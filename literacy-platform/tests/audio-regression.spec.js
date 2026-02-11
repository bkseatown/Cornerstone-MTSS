const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');

function pageUrl(fileName) {
  return pathToFileURL(path.join(rootDir, fileName)).href;
}

async function closeBlockingOverlayIfPresent(page) {
  const overlay = page.locator('#modal-overlay');
  const isVisible = await overlay.isVisible().catch(() => false);
  if (!isVisible) return;

  const closeSelectors = [
    '#start-playing-btn',
    '#bonus-continue',
    '.close-btn',
    '.close-teacher',
    '.close-studio'
  ];

  for (const selector of closeSelectors) {
    const button = page.locator(selector).first();
    const visible = await button.isVisible().catch(() => false);
    if (!visible) continue;
    await button.click();
    await expect(overlay).toHaveClass(/hidden/, { timeout: 3000 });
    return;
  }

  throw new Error('Modal overlay is visible but no close/continue button is available.');
}

async function prepareFreshFirstVisitFlow(page) {
  await page.goto(pageUrl('index.html'), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await closeBlockingOverlayIfPresent(page);
}

async function assertPointerCanReach(page, selector) {
  const locator = page.locator(selector);
  const box = await locator.boundingBox();
  if (!box) throw new Error(`No bounding box for ${selector}`);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  const hit = await page.evaluate(({ hitX, hitY }) => {
    const element = document.elementFromPoint(hitX, hitY);
    if (!element) return null;
    const style = getComputedStyle(element);
    return {
      tag: element.tagName,
      id: element.id || '',
      className: element.className || '',
      pointerEvents: style.pointerEvents,
      zIndex: style.zIndex
    };
  }, { hitX: x, hitY: y });

  if (!hit) throw new Error(`No hit target for ${selector}`);
  console.log(`elementFromPoint hit for ${selector}:`, hit);
  const targetMatches = hit.id === selector.replace(/^#/, '');
  if (!targetMatches) {
    const overlays = await page.evaluate(() => {
      return [...document.querySelectorAll('body *')]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return (
            rect.width >= window.innerWidth - 2
            && rect.height >= window.innerHeight - 2
            && (style.position === 'fixed' || style.position === 'absolute')
            && style.pointerEvents !== 'none'
            && (parseFloat(style.opacity) > 0 || style.backdropFilter !== 'none' || style.filter !== 'none')
          );
        })
        .slice(0, 20)
        .map((el) => {
          const style = getComputedStyle(el);
          return {
            tag: el.tagName,
            id: el.id || '',
            className: el.className || '',
            pointerEvents: style.pointerEvents,
            zIndex: style.zIndex,
            opacity: style.opacity
          };
        });
    });
    console.log('likely overlays:', overlays);
    throw new Error(`Pointer hit mismatch for ${selector}: ${JSON.stringify(hit)} overlays=${JSON.stringify(overlays)}`);
  }
}

async function openWordQuest(page) {
  await page.goto(pageUrl('word-quest.html'), { waitUntil: 'domcontentloaded' });
  await closeBlockingOverlayIfPresent(page);
  await expect(page.locator('#game-canvas')).toBeVisible();
  await expect(page.locator('#simple-hear-word')).toBeVisible();
  await expect(page.locator('#simple-hear-sentence')).toBeVisible();
}

async function installAudioHarness(page, mode = 'always-play') {
  await page.evaluate((harnessMode) => {
    window.__audioHarness = {
      mode: harnessMode,
      events: [],
      speakCalls: 0,
      cancelCalls: 0
    };

    let nextId = 1;
    class MockAudioElement {
      constructor(url = '') {
        this.__id = nextId++;
        this.url = String(url || '');
        this.dataset = {};
        this.currentTime = 0;
        this.playbackRate = 1;
        this.paused = true;
        this.ended = false;
        this.onended = null;
        this.onerror = null;
      }

      async play() {
        this.paused = false;
        this.ended = false;
        window.__audioHarness.events.push({
          type: 'play',
          id: this.__id,
          sourceId: this.dataset.playbackSourceId || '',
          url: this.url
        });
        return true;
      }

      pause() {
        this.paused = true;
        this.currentTime = 0;
        window.__audioHarness.events.push({
          type: 'pause',
          id: this.__id,
          sourceId: this.dataset.playbackSourceId || '',
          url: this.url
        });
      }
    }

    window.HTMLAudioElement = MockAudioElement;
    window.Audio = function MockAudio(url) {
      return new MockAudioElement(url);
    };

    if (window.speechSynthesis) {
      window.speechSynthesis.speak = () => {
        window.__audioHarness.speakCalls += 1;
      };
      window.speechSynthesis.cancel = () => {
        window.__audioHarness.cancelCalls += 1;
      };
    }

    const playWithSource = async ({ sourceId = '', type = 'word' } = {}) => {
      if (typeof window.playAudioClipUrl === 'function') {
        return window.playAudioClipUrl(`mock://packed/${type}`, {
          sourceId,
          playbackRate: 1
        });
      }
      const audio = new window.Audio(`mock://packed/${type}`);
      if (sourceId) audio.dataset.playbackSourceId = sourceId;
      await audio.play();
      return true;
    };

    if (harnessMode === 'always-play') {
      window.tryPlayPackedTtsForCurrentWord = async (options = {}) =>
        playWithSource({ sourceId: options.sourceId || '', type: options.type || 'word' });
      window.tryPlayPackedTtsForLiteralText = async (options = {}) =>
        playWithSource({ sourceId: options.sourceId || '', type: options.type || 'sentence' });
    } else if (harnessMode === 'always-miss') {
      window.tryPlayPackedTtsForCurrentWord = async () => false;
      window.tryPlayPackedTtsForLiteralText = async () => false;
    }
  }, mode);
}

async function readHarnessState(page) {
  return page.evaluate(() => window.__audioHarness || { events: [], speakCalls: 0, cancelCalls: 0 });
}

test.beforeEach(async ({ page }) => {
  await prepareFreshFirstVisitFlow(page);
  await page.evaluate(() => {
    localStorage.setItem('hq_english_voice_notice', 'true');
    localStorage.setItem('hq_voice_notice_shown', 'true');
    localStorage.setItem('cs_hv2_theme', 'calm');
  });
});

test.describe('Audio playback behavior', () => {
  test('one stream at a time, and same button press pauses current stream', async ({ page }) => {
    await openWordQuest(page);
    await installAudioHarness(page, 'always-play');
    await expect(page.locator('#modal-overlay')).toHaveClass(/hidden/);
    await assertPointerCanReach(page, '#simple-hear-word');

    await page.locator('#simple-hear-word').click();
    await page.waitForTimeout(50);

    let state = await readHarnessState(page);
    expect(state.events.filter((event) => event.type === 'play' && event.sourceId === 'simple-hear-word').length).toBe(1);
    expect(state.events.filter((event) => event.type === 'pause').length).toBe(0);

    await assertPointerCanReach(page, '#simple-hear-sentence');
    await page.locator('#simple-hear-sentence').click();
    await page.waitForTimeout(50);

    state = await readHarnessState(page);
    expect(state.events.filter((event) => event.type === 'pause' && event.sourceId === 'simple-hear-word').length).toBeGreaterThanOrEqual(1);
    expect(state.events.filter((event) => event.type === 'play' && event.sourceId === 'simple-hear-sentence').length).toBe(1);

    const playSentenceCountBeforeToggle = state.events.filter(
      (event) => event.type === 'play' && event.sourceId === 'simple-hear-sentence'
    ).length;

    await assertPointerCanReach(page, '#simple-hear-sentence');
    await page.locator('#simple-hear-sentence').click();
    await page.waitForTimeout(50);

    state = await readHarnessState(page);
    const playSentenceCountAfterToggle = state.events.filter(
      (event) => event.type === 'play' && event.sourceId === 'simple-hear-sentence'
    ).length;
    const pauseSentenceCount = state.events.filter(
      (event) => event.type === 'pause' && event.sourceId === 'simple-hear-sentence'
    ).length;

    expect(playSentenceCountAfterToggle).toBe(playSentenceCountBeforeToggle);
    expect(pauseSentenceCount).toBeGreaterThanOrEqual(1);
  });

  test('missing Azure clips never trigger robotic system speech fallback', async ({ page }) => {
    await openWordQuest(page);
    await installAudioHarness(page, 'always-miss');
    await expect(page.locator('#modal-overlay')).toHaveClass(/hidden/);
    await assertPointerCanReach(page, '#simple-hear-word');

    await page.locator('#simple-hear-word').click();
    await page.waitForTimeout(40);
    await assertPointerCanReach(page, '#simple-hear-sentence');
    await page.locator('#simple-hear-sentence').click();
    await page.waitForTimeout(40);

    const translationResult = await page.evaluate(async () => {
      if (typeof window.playTextInLanguage !== 'function') return false;
      return window.playTextInLanguage('hola', 'es', 'word', 'translation-hear-word');
    });
    expect(translationResult).toBeFalsy();

    const state = await readHarnessState(page);
    expect(state.events.filter((event) => event.type === 'play').length).toBe(0);
    expect(state.speakCalls).toBe(0);
  });

  test('joke reveal shows and reads punchline only', async ({ page }) => {
    await openWordQuest(page);
    await installAudioHarness(page, 'always-play');
    await expect(page.locator('#modal-overlay')).toHaveClass(/hidden/);

    await page.evaluate(() => {
      if (typeof appSettings !== 'undefined' && appSettings) {
        appSettings.autoHear = true;
      }
      window.getBonusContentPool = () => ({
        jokes: ['Why did the notebook bring a sweater? It had too many drafts.'],
        riddles: [],
        facts: [],
        quotes: []
      });
      window.showBonusContent();
    });

    const bonusModal = page.locator('#bonus-modal');
    await expect(bonusModal).toBeVisible();
    await expect(page.locator('#bonus-text')).toContainText('Why did the notebook bring a sweater?');

    await assertPointerCanReach(page, '#bonus-reveal-detail');
    await page.locator('#bonus-reveal-detail').click();

    await expect(page.locator('#bonus-text')).toHaveText('It had too many drafts.');
    const revealState = await page.evaluate(() => ({
      ttsText: document.getElementById('bonus-hear')?.dataset?.ttsText || '',
      hearLabel: document.getElementById('bonus-hear')?.textContent?.trim() || ''
    }));
    expect(revealState.ttsText).toBe('It had too many drafts.');
    expect(revealState.hearLabel).toBe('Hear the punchline');

    await page.waitForTimeout(60);
    const state = await readHarnessState(page);
    expect(state.events.filter((event) => event.type === 'play' && event.sourceId === 'bonus-hear').length).toBeGreaterThanOrEqual(1);
  });
});
