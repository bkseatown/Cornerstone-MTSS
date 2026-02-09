const { test: base, expect } = require('@playwright/test');

const silenceInitScript = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel?.();
    window.speechSynthesis.speak = () => {};
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;
  }

  HTMLMediaElement.prototype.play = function () {
    return Promise.resolve();
  };

  Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
    get() { return true; },
    set() {},
    configurable: true
  });
};

const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(silenceInitScript);
    await use(page);
  }
});

module.exports = { test, expect, silenceInitScript };
