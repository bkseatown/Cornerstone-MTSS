const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');

function pageUrl(fileName) {
  return pathToFileURL(path.join(rootDir, fileName)).href;
}

async function openWordQuest(page) {
  await page.goto(pageUrl('word-quest.html'), { waitUntil: 'domcontentloaded' });
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

async function triggerButton(page, selector) {
  await page.evaluate((targetSelector) => {
    const button = document.querySelector(targetSelector);
    if (!(button instanceof HTMLElement)) {
      throw new Error(`Missing button: ${targetSelector}`);
    }
    button.click();
  }, selector);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('hq_english_voice_notice', 'true');
      localStorage.setItem('hq_voice_notice_shown', 'true');
      localStorage.setItem('cs_hv2_theme', 'calm');
    } catch (e) {}
  });
});

test.describe('Audio playback behavior', () => {
  test('one stream at a time, and same button press pauses current stream', async ({ page }) => {
    await openWordQuest(page);
    await installAudioHarness(page, 'always-play');

    await triggerButton(page, '#simple-hear-word');
    await page.waitForTimeout(50);

    let state = await readHarnessState(page);
    expect(state.events.filter((event) => event.type === 'play' && event.sourceId === 'simple-hear-word').length).toBe(1);
    expect(state.events.filter((event) => event.type === 'pause').length).toBe(0);

    await triggerButton(page, '#simple-hear-sentence');
    await page.waitForTimeout(50);

    state = await readHarnessState(page);
    expect(state.events.filter((event) => event.type === 'pause' && event.sourceId === 'simple-hear-word').length).toBeGreaterThanOrEqual(1);
    expect(state.events.filter((event) => event.type === 'play' && event.sourceId === 'simple-hear-sentence').length).toBe(1);

    const playSentenceCountBeforeToggle = state.events.filter(
      (event) => event.type === 'play' && event.sourceId === 'simple-hear-sentence'
    ).length;

    await triggerButton(page, '#simple-hear-sentence');
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

    await triggerButton(page, '#simple-hear-word');
    await page.waitForTimeout(40);
    await triggerButton(page, '#simple-hear-sentence');
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
});
