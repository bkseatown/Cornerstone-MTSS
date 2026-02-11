const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');
const THEMES = ['calm', 'professional', 'playful'];

function pageUrl(fileName) {
  return pathToFileURL(path.join(rootDir, fileName)).href;
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
    expect(metrics.keyboardHeight).toBeGreaterThanOrEqual(170);
    expect(metrics.keyHeight).toBeGreaterThanOrEqual(44);
  });

  test('tablet landscape 1024x768 keeps keyboard usable without clipping', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openWordQuest(page, 'professional');

    const metrics = await wordQuestMetrics(page);
    expect(metrics.scrollDelta).toBeLessThanOrEqual(2);
    expect(metrics.keyboardBottom).toBeLessThanOrEqual(metrics.viewportHeight + 2);
    expect(metrics.keyboardHeight).toBeGreaterThanOrEqual(165);
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
      expect(byTheme[theme].selectValue).toBe(theme);
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
});
