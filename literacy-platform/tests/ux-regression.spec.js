const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');
const THEMES = ['calm', 'professional', 'playful'];

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

async function clickWithElementFromPointGuard(page, selector) {
  const target = page.locator(selector).first();
  await expect(target).toBeVisible();
  const box = await target.boundingBox();
  if (!box) throw new Error(`selector=${selector} hit=null`);

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const probe = await page.evaluate(({ cssSelector, x, y }) => {
    const node = document.elementFromPoint(x, y);
    if (!node) return { matches: false, hit: null };
    const style = getComputedStyle(node);
    return {
      matches: !!(node.matches(cssSelector) || node.closest(cssSelector)),
      hit: {
        tag: String(node.tagName || '').toLowerCase(),
        id: String(node.id || ''),
        className: String(node.className || ''),
        pointerEvents: String(style.pointerEvents || ''),
        zIndex: String(style.zIndex || '')
      }
    };
  }, { cssSelector: selector, x: centerX, y: centerY });

  if (!probe.matches) {
    throw new Error(`selector=${selector} hit=${JSON.stringify(probe.hit)}`);
  }

  await target.click();
}

async function openWordQuestToolsMenu(page) {
  const toolsMenu = page.locator('#wq-tools-menu');
  if (await toolsMenu.count() === 0) return;
  const isOpen = await page.evaluate(() => !!document.getElementById('wq-tools-menu')?.open);
  if (isOpen) return;
  await clickWithElementFromPointGuard(page, '#wq-tools-toggle');
  await expect.poll(() => page.evaluate(() => !!document.getElementById('wq-tools-menu')?.open)).toBe(true);
}

async function openWordQuest(page, theme = 'calm') {
  await page.goto(pageUrl('word-quest.html'), { waitUntil: 'domcontentloaded' });
  await page.evaluate((selectedTheme) => {
    try {
      localStorage.setItem('cs_hv2_theme', selectedTheme);
      localStorage.setItem('hq_english_voice_notice', 'true');
      localStorage.setItem('hq_voice_notice_shown', 'true');
    } catch (e) {}
  }, theme);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#game-canvas')).toBeVisible();
  const welcomeModal = page.locator('#welcome-modal');
  if (await welcomeModal.isVisible().catch(() => false)) {
    const startBtn = page.locator('#start-playing-btn');
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
    } else {
      await page.locator('#welcome-modal .close-btn').click();
    }
  }
  await page.waitForSelector('#keyboard button, #keyboard .key, #keyboard [data-key]');
}

async function wordQuestMetrics(page) {
  return page.evaluate(() => {
    const keyboard = document.getElementById('keyboard');
    const board = document.getElementById('game-board');
    const firstKey = keyboard && keyboard.querySelector('button, .key, [data-key]');
    const keyboardRect = keyboard ? keyboard.getBoundingClientRect() : null;
    const boardRect = board ? board.getBoundingClientRect() : null;
    return {
      scrollDelta: document.documentElement.scrollHeight - window.innerHeight,
      viewportHeight: window.innerHeight,
      keyboardBottom: keyboardRect ? keyboardRect.bottom : 0,
      keyboardHeight: keyboardRect ? keyboardRect.height : 0,
      boardHeight: boardRect ? boardRect.height : 0,
      keyHeight: firstKey ? parseFloat(getComputedStyle(firstKey).height || '0') : 0
    };
  });
}

test.describe('Word Quest UX layout', () => {
  test('desktop 1440x900 fits with keyboard visible and tappable keys', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWordQuest(page, 'calm');

    const metrics = await wordQuestMetrics(page);
    expect(metrics.scrollDelta).toBeLessThanOrEqual(2);
    expect(metrics.keyboardBottom).toBeLessThanOrEqual(metrics.viewportHeight + 2);
    expect(metrics.keyboardHeight).toBeGreaterThanOrEqual(168);
    expect(metrics.keyHeight).toBeGreaterThanOrEqual(44);
  });

  test('tablet landscape 1024x768 keeps keyboard usable without clipping', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openWordQuest(page, 'professional');

    const metrics = await wordQuestMetrics(page);
    expect(metrics.scrollDelta).toBeLessThanOrEqual(2);
    expect(metrics.keyboardBottom).toBeLessThanOrEqual(metrics.viewportHeight + 2);
    expect(metrics.keyboardHeight).toBeGreaterThanOrEqual(164);
    expect(metrics.keyHeight).toBeGreaterThanOrEqual(42);
  });

  test('tablet portrait 768x1024 keeps board and keyboard fully reachable', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openWordQuest(page, 'calm');

    const metrics = await wordQuestMetrics(page);
    expect(metrics.keyboardHeight).toBeGreaterThanOrEqual(170);
    expect(metrics.keyHeight).toBeGreaterThanOrEqual(42);
    expect(metrics.keyboardBottom).toBeLessThanOrEqual(metrics.viewportHeight + 8);
  });

  test('phone 390x844 keeps keyboard tap targets usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openWordQuest(page, 'calm');
    await page.locator('#keyboard').scrollIntoViewIfNeeded();

    const metrics = await wordQuestMetrics(page);
    expect(metrics.keyboardHeight).toBeGreaterThanOrEqual(200);
    expect(metrics.keyHeight).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Theme propagation', () => {
  test('Word Quest applies theme class and unique keyboard surface values', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWordQuest(page, 'calm');

    const byTheme = {};
    for (const theme of THEMES) {
      await page.evaluate((selectedTheme) => {
        localStorage.setItem('cs_hv2_theme', selectedTheme);
      }, theme);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#keyboard button, #keyboard .key, #keyboard [data-key]');

      byTheme[theme] = await page.evaluate(() => ({
        bodyClass: document.body.className,
        keyboardSurface: getComputedStyle(document.body).getPropertyValue('--wq-keyboard-surface').trim(),
        pageBg: getComputedStyle(document.body).getPropertyValue('--wq-page-bg').trim(),
        selectValue: document.getElementById('wq-theme-select')?.value || ''
      }));

      expect(byTheme[theme].bodyClass).toContain(`cs-hv2-theme-${theme}`);
      if (byTheme[theme].selectValue) {
        expect(byTheme[theme].selectValue).toBe(theme);
      }
      expect(byTheme[theme].keyboardSurface.length).toBeGreaterThan(0);
    }

    expect(new Set(THEMES.map((theme) => byTheme[theme].keyboardSurface)).size).toBe(3);
    expect(new Set(THEMES.map((theme) => byTheme[theme].pageBg)).size).toBe(3);
  });

  test('Home V2 applies theme class and avoids force-light overlay', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl('index.html'), { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.home-main')).toBeVisible();

    const byTheme = {};
    for (const theme of THEMES) {
      await page.evaluate((selectedTheme) => {
        localStorage.setItem('cs_hv2_theme', selectedTheme);
      }, theme);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#homeV2Root .cs-hv2-card');

      byTheme[theme] = await page.evaluate(() => {
        const card = document.querySelector('#homeV2Root .cs-hv2-card');
        const cardStyle = card ? getComputedStyle(card) : null;
        return {
          bodyClass: document.body.className,
          hasForceLight: document.body.classList.contains('force-light'),
          pageBg: getComputedStyle(document.body).getPropertyValue('--hv2-page-bg').trim(),
          cardBorder: cardStyle ? cardStyle.borderColor : '',
          cardBg: cardStyle ? cardStyle.backgroundColor : ''
        };
      });

      expect(byTheme[theme].bodyClass).toContain(`cs-hv2-theme-${theme}`);
      expect(byTheme[theme].hasForceLight).toBeFalsy();
      expect(byTheme[theme].pageBg.length).toBeGreaterThan(0);
    }

    expect(new Set(THEMES.map((theme) => byTheme[theme].pageBg)).size).toBe(3);
  });

  test('Palette dropdown applies and persists distinct presets with guarded clicks', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl('word-quest.html'), { waitUntil: 'domcontentloaded' });
    await closeBlockingOverlayIfPresent(page);
    await expect(page.locator('#game-canvas')).toBeVisible();
    await page.evaluate(() => {
      localStorage.setItem('cs_hv2_theme', 'calm');
      localStorage.setItem('cs_wq_scene', 'calm-studio');
      localStorage.setItem('cs_wq_keyboard_style', 'auto');
      localStorage.setItem('cs_wq_intensity', 'medium');
      localStorage.setItem('cs_wq_shape', 'soft');
      localStorage.setItem('cs_wq_density', 'standard');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await closeBlockingOverlayIfPresent(page);

    const paletteSelector = '#wq-palette-select';
    await expect(page.locator('#wq-theme-studio-overlay')).toHaveCount(0);
    await openWordQuestToolsMenu(page);
    await clickWithElementFromPointGuard(page, paletteSelector);
    await expect(page.locator(`${paletteSelector} option[value="classic-wordle"]`)).toHaveCount(1);

    await page.locator(paletteSelector).selectOption('professional-midnight');
    await expect.poll(() => page.evaluate(() => document.body.dataset.wqScene || '')).toBe('professional-midnight');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('cs_wq_scene') || '')).toBe('professional-midnight');

    const midnightTokens = await page.evaluate(() => ({
      pageBg: getComputedStyle(document.body).getPropertyValue('--wq-page-bg').trim(),
      keyBg: getComputedStyle(document.body).getPropertyValue('--wq-key-bg').trim(),
      keyboardSurface: getComputedStyle(document.body).getPropertyValue('--wq-keyboard-surface').trim()
    }));

    await page.locator(paletteSelector).selectOption('playful-festival');
    await expect.poll(() => page.evaluate(() => document.body.dataset.wqScene || '')).toBe('playful-festival');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('cs_wq_scene') || '')).toBe('playful-festival');

    const festivalTokens = await page.evaluate(() => ({
      pageBg: getComputedStyle(document.body).getPropertyValue('--wq-page-bg').trim(),
      keyBg: getComputedStyle(document.body).getPropertyValue('--wq-key-bg').trim(),
      keyboardSurface: getComputedStyle(document.body).getPropertyValue('--wq-keyboard-surface').trim()
    }));

    expect(festivalTokens.pageBg).not.toBe(midnightTokens.pageBg);
    expect(festivalTokens.keyBg).not.toBe(midnightTokens.keyBg);
    expect(festivalTokens.keyboardSurface).not.toBe(midnightTokens.keyboardSurface);

    await page.locator(paletteSelector).selectOption('classic-wordle');
    await expect.poll(() => page.evaluate(() => document.body.dataset.wqScene || '')).toBe('classic-wordle');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('cs_wq_scene') || '')).toBe('classic-wordle');

    const classicWordleTokens = await page.evaluate(() => ({
      pageBg: getComputedStyle(document.body).getPropertyValue('--wq-page-bg').trim(),
      keyBg: getComputedStyle(document.body).getPropertyValue('--wq-key-bg').trim(),
      keyboardSurface: getComputedStyle(document.body).getPropertyValue('--wq-keyboard-surface').trim()
    }));

    expect(classicWordleTokens.pageBg).not.toBe(festivalTokens.pageBg);
    expect(classicWordleTokens.keyBg).not.toBe(festivalTokens.keyBg);
    expect(classicWordleTokens.keyboardSurface).not.toBe(festivalTokens.keyboardSurface);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await closeBlockingOverlayIfPresent(page);
    await expect(page.locator(paletteSelector)).toHaveValue('classic-wordle');
    await expect.poll(() => page.evaluate(() => document.body.dataset.wqScene || '')).toBe('classic-wordle');
  });

  test('Palette selection closes Tools and typing resumes immediately', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWordQuest(page, 'calm');

    await openWordQuestToolsMenu(page);
    await expect.poll(() => page.evaluate(() => !!document.getElementById('wq-tools-menu')?.open)).toBe(true);
    await clickWithElementFromPointGuard(page, '#wq-palette-select');
    await page.locator('#wq-palette-select').selectOption('ocean-calm');
    await expect.poll(() => page.evaluate(() => document.body.dataset.wqScene || '')).toBe('ocean-calm');
    await expect.poll(() => page.evaluate(() => !!document.getElementById('wq-tools-menu')?.open)).toBe(false);

    await page.keyboard.type('cat');
    await expect.poll(() => page.evaluate(() => (
      [0, 1, 2]
        .map((index) => String(document.getElementById(`tile-${index}`)?.textContent || '').trim().toLowerCase())
        .join('')
    ))).toBe('cat');
  });

  test('Voice popup supports outside-dismiss and drag/expand controls', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWordQuest(page, 'calm');

    await openWordQuestToolsMenu(page);
    await clickWithElementFromPointGuard(page, '#simple-voice-settings');

    const overlay = page.locator('#voice-quick-overlay');
    await expect(overlay).toBeVisible();
    await expect(page.locator('#voice-quick-overlay .popup-window-handle')).toBeVisible();
    await expect(page.locator('#voice-quick-overlay .popup-window-expand-btn')).toBeVisible();
    await overlay.click({ position: { x: 6, y: 6 } });
    await expect(overlay).toHaveClass(/hidden/);
  });
});
