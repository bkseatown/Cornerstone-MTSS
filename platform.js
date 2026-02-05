// Shared platform boot (runs on every page).
// Purpose: keep UI look + accessibility settings consistent across activities.
(function () {
  const SETTINGS_KEY = 'decode_settings';
  const UI_LOOK_CLASSES = ['look-k2', 'look-35', 'look-612'];

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function normalizeLook(value) {
    const raw = String(value || '35');
    if (raw === 'k2') return 'k2';
    if (raw === '612') return '612';
    return '35';
  }

  const stored = safeParse(localStorage.getItem(SETTINGS_KEY) || '');
  const look = normalizeLook(stored && stored.uiLook);

  const body = document.body;
  if (!body) return;

  body.classList.add('force-light');
  document.documentElement.style.colorScheme = 'light';

  // Accessibility toggles (safe on pages that don't use them).
  body.classList.toggle('calm-mode', !!(stored && stored.calmMode));
  body.classList.toggle('large-text', !!(stored && stored.largeText));
  body.classList.toggle('hide-ipa', stored ? stored.showIPA === false : false);
  body.classList.toggle('hide-examples', stored ? stored.showExamples === false : false);
  body.classList.toggle('hide-mouth-cues', stored ? stored.showMouthCues === false : false);

  UI_LOOK_CLASSES.forEach((cls) => body.classList.remove(cls));
  body.classList.add(look === 'k2' ? 'look-k2' : look === '612' ? 'look-612' : 'look-35');
})();

