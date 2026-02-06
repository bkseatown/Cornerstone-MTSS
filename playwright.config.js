const fs = require('fs');
const path = require('path');
const { defineConfig } = require('@playwright/test');

function resolveChromiumExecutable() {
  const home = process.env.HOME;
  if (!home) return null;

  const cacheDir = path.join(home, 'Library', 'Caches', 'ms-playwright');
  if (!fs.existsSync(cacheDir)) return null;

  const platformFolder = process.arch === 'arm64' ? 'chrome-mac-arm64' : 'chrome-mac-x64';
  const candidates = fs
    .readdirSync(cacheDir)
    .filter((entry) => entry.startsWith('chromium-'))
    .sort((a, b) => {
      const av = Number(a.split('-')[1] || 0);
      const bv = Number(b.split('-')[1] || 0);
      return bv - av;
    });

  for (const candidate of candidates) {
    const executablePath = path.join(
      cacheDir,
      candidate,
      platformFolder,
      'Google Chrome for Testing.app',
      'Contents',
      'MacOS',
      'Google Chrome for Testing'
    );
    if (fs.existsSync(executablePath)) return executablePath;
  }

  return null;
}

const chromiumExecutable = resolveChromiumExecutable();

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01
    }
  },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
        launchOptions: chromiumExecutable ? { executablePath: chromiumExecutable } : undefined
      }
    },
    {
      name: 'ipad-chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1024, height: 1366 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
        launchOptions: chromiumExecutable ? { executablePath: chromiumExecutable } : undefined
      }
    }
  ]
});
