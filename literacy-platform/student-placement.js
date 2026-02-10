(function () {
  const VALID_THEMES = ['calm', 'professional', 'playful', 'high-contrast'];
  const THEME_KEY = 'cs_hv2_theme';
  const RESULT_KEY = 'cs_lit_quickcheck_v1';

  const LETTER_ITEMS = [
    { letter: 'm', sound: '/m/' },
    { letter: 's', sound: '/s/' },
    { letter: 't', sound: '/t/' },
    { letter: 'p', sound: '/p/' },
    { letter: 'a', sound: '/a/' },
    { letter: 'o', sound: '/o/' },
    { letter: 'l', sound: '/l/' },
    { letter: 'n', sound: '/n/' }
  ];

  const CVC_WORDS = ['cat', 'sip', 'run', 'peg', 'cob', 'fin'];
  const DIGRAPH_VOWEL_WORDS = ['ship', 'that', 'rain', 'boat', 'each', 'train'];
  const FLUENCY_SENTENCE = 'The black cat ran to the big box.';

  const state = {
    step: 0,
    letterIndex: 0,
    letters: LETTER_ITEMS.map((item) => ({ ...item, known: null })),
    cvcIndex: 0,
    cvc: CVC_WORDS.map((word) => ({ word, attempted: false, response: null })),
    dvIndex: 0,
    dv: DIGRAPH_VOWEL_WORDS.map((word) => ({ word, attempted: false, response: null })),
    fluency: '',
    downloadStatus: ''
  };

  const root = document.getElementById('studentPlacementRoot');
  if (!root) return;

  applyTheme();
  render();

  function applyTheme() {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const queryTheme = String(params.get('theme') || '').trim().toLowerCase();
      const storedTheme = String(localStorage.getItem(THEME_KEY) || '').trim().toLowerCase();
      const chosen = VALID_THEMES.includes(queryTheme)
        ? queryTheme
        : VALID_THEMES.includes(storedTheme)
          ? storedTheme
          : 'calm';
      if (VALID_THEMES.includes(queryTheme)) localStorage.setItem(THEME_KEY, queryTheme);
      const html = document.documentElement;
      const body = document.body;
      VALID_THEMES.forEach((theme) => {
        html.classList.remove(`cs-hv2-theme-${theme}`);
        body.classList.remove(`cs-hv2-theme-${theme}`);
      });
      html.classList.add(`cs-hv2-theme-${chosen}`);
      body.classList.add(`cs-hv2-theme-${chosen}`);
    } catch {}
  }

  function render() {
    const step = state.step;
    if (step === 0) {
      renderWelcome();
      return;
    }
    if (step === 1) {
      renderLetters();
      return;
    }
    if (step === 2) {
      renderWordStep({
        title: 'CVC blending',
        subtitle: 'Read each word, then pick how it felt.',
        list: state.cvc,
        index: state.cvcIndex,
        onTry: handleCvcTry,
        onAnswer: handleCvcAnswer
      });
      return;
    }
    if (step === 3) {
      renderWordStep({
        title: 'Digraphs and vowel teams',
        subtitle: 'Try each word and choose your response.',
        list: state.dv,
        index: state.dvIndex,
        onTry: handleDvTry,
        onAnswer: handleDvAnswer
      });
      return;
    }
    if (step === 4) {
      renderFluency();
      return;
    }
    renderResults();
  }

  function renderWelcome() {
    root.innerHTML = `
      <p class="cs-sp-step">Screen 1 of 6</p>
      <h2 class="cs-sp-title">Let's find your best starting place in reading.</h2>
      <p class="cs-sp-subtitle">This quick check gives you a clear next step in just a few minutes.</p>
      <div class="cs-sp-actions">
        <button class="cs-sp-btn cs-sp-btn-primary" type="button" data-action="start">Start -&gt;</button>
      </div>
    `;
    const startBtn = root.querySelector('[data-action="start"]');
    if (startBtn) startBtn.addEventListener('click', () => setStep(1));
  }

  function renderLetters() {
    const current = state.letters[state.letterIndex];
    if (!current) return;
    root.innerHTML = `
      <p class="cs-sp-step">Screen 2 of 6 · Letter ${state.letterIndex + 1} of ${state.letters.length}</p>
      <h2 class="cs-sp-title">Letter sounds</h2>
      <p class="cs-sp-subtitle">Tap to hear the model sound, then choose your response.</p>
      <button class="cs-sp-btn cs-sp-focus" type="button" data-action="play-sound">Hear model sound</button>
      <div class="cs-sp-letter" aria-label="Current letter">${escapeHtml(current.letter)}</div>
      <div class="cs-sp-option-grid" role="group" aria-label="Letter sound response">
        <button class="cs-sp-btn" type="button" data-action="letter-known">I know this sound</button>
        <button class="cs-sp-btn" type="button" data-action="letter-unsure">I'm not sure</button>
      </div>
    `;

    const soundBtn = root.querySelector('[data-action="play-sound"]');
    const knownBtn = root.querySelector('[data-action="letter-known"]');
    const unsureBtn = root.querySelector('[data-action="letter-unsure"]');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        speak(`The sound is ${current.sound}.`);
      });
    }
    if (knownBtn) knownBtn.addEventListener('click', () => handleLetterAnswer(true));
    if (unsureBtn) unsureBtn.addEventListener('click', () => handleLetterAnswer(false));
  }

  function renderWordStep(config) {
    const entry = config.list[config.index];
    if (!entry) return;
    const revealed = !!entry.attempted;
    root.innerHTML = `
      <p class="cs-sp-step">Screen ${config.title === 'CVC blending' ? '3' : '4'} of 6 · Word ${config.index + 1} of ${config.list.length}</p>
      <h2 class="cs-sp-title">${escapeHtml(config.title)}</h2>
      <p class="cs-sp-subtitle">${escapeHtml(config.subtitle)}</p>
      <button class="cs-sp-btn cs-sp-focus" type="button" data-action="try-read">Try to read it</button>
      <div class="cs-sp-word" aria-label="Current word">
        ${revealed ? escapeHtml(entry.word) : '<span class="cs-sp-word-placeholder">_ _ _ _</span>'}
      </div>
      <div class="cs-sp-option-grid" role="group" aria-label="Word reading response">
        <button class="cs-sp-btn" type="button" data-action="easy" ${revealed ? '' : 'disabled'}>I read it easily</button>
        <button class="cs-sp-btn" type="button" data-action="hard" ${revealed ? '' : 'disabled'}>I tried but it was hard</button>
        <button class="cs-sp-btn" type="button" data-action="unknown" ${revealed ? '' : 'disabled'}>I didn't know it</button>
      </div>
    `;

    const tryBtn = root.querySelector('[data-action="try-read"]');
    const easyBtn = root.querySelector('[data-action="easy"]');
    const hardBtn = root.querySelector('[data-action="hard"]');
    const unknownBtn = root.querySelector('[data-action="unknown"]');

    if (tryBtn) tryBtn.addEventListener('click', config.onTry);
    if (easyBtn) easyBtn.addEventListener('click', () => config.onAnswer('easy'));
    if (hardBtn) hardBtn.addEventListener('click', () => config.onAnswer('hard'));
    if (unknownBtn) unknownBtn.addEventListener('click', () => config.onAnswer('unknown'));
  }

  function renderFluency() {
    root.innerHTML = `
      <p class="cs-sp-step">Screen 5 of 6</p>
      <h2 class="cs-sp-title">Fluency snapshot</h2>
      <p class="cs-sp-subtitle">Read this sentence, then choose how it felt.</p>
      <div class="cs-sp-sentence">${escapeHtml(FLUENCY_SENTENCE)}</div>
      <div class="cs-sp-option-grid" role="group" aria-label="Fluency self-rating">
        <button class="cs-sp-btn" type="button" data-action="fluency-easy">That felt easy</button>
        <button class="cs-sp-btn" type="button" data-action="fluency-okay">That felt okay</button>
        <button class="cs-sp-btn" type="button" data-action="fluency-tricky">That was tricky</button>
      </div>
    `;
    const easyBtn = root.querySelector('[data-action="fluency-easy"]');
    const okayBtn = root.querySelector('[data-action="fluency-okay"]');
    const trickyBtn = root.querySelector('[data-action="fluency-tricky"]');
    if (easyBtn) easyBtn.addEventListener('click', () => finishCheck('easy'));
    if (okayBtn) okayBtn.addEventListener('click', () => finishCheck('okay'));
    if (trickyBtn) trickyBtn.addEventListener('click', () => finishCheck('tricky'));
  }

  function renderResults() {
    const summary = buildSummary();
    const fluencyLabel = summary.fluency_rating === 'easy'
      ? 'Easy'
      : summary.fluency_rating === 'okay'
        ? 'Okay'
        : 'Tricky';
    root.innerHTML = `
      <p class="cs-sp-step">Screen 6 of 6</p>
      <h2 class="cs-sp-title">Your quick check</h2>
      <p class="cs-sp-subtitle">Here is your reading snapshot to share with your teacher.</p>
      <section class="cs-sp-summary" aria-label="Quick check summary">
        <div class="cs-sp-summary-row">
          <p class="cs-sp-summary-label">Letter sounds you know</p>
          <p class="cs-sp-summary-value">${summary.letters_known}/8</p>
        </div>
        <div class="cs-sp-summary-row">
          <p class="cs-sp-summary-label">CVC words easy</p>
          <p class="cs-sp-summary-value">${summary.cvc_easy}/6</p>
        </div>
        <div class="cs-sp-summary-row">
          <p class="cs-sp-summary-label">Digraph/vowel team words easy</p>
          <p class="cs-sp-summary-value">${summary.dv_easy}/6</p>
        </div>
        <div class="cs-sp-summary-row">
          <p class="cs-sp-summary-label">Fluency self-rating</p>
          <p class="cs-sp-summary-value">${fluencyLabel}</p>
        </div>
      </section>
      <p class="cs-sp-note">Students can download and share their results with teachers.</p>
      <div class="cs-sp-actions">
        <a class="cs-sp-btn cs-sp-btn-primary" href="word-quest.html">Go to Word Quest</a>
        <button class="cs-sp-btn" type="button" data-action="download">Send results to my teacher</button>
      </div>
      <p class="cs-sp-download-status" aria-live="polite">${escapeHtml(state.downloadStatus || '')}</p>
    `;
    const dlBtn = root.querySelector('[data-action="download"]');
    if (dlBtn) dlBtn.addEventListener('click', downloadSummary);
  }

  function handleLetterAnswer(known) {
    state.letters[state.letterIndex].known = !!known;
    if (state.letterIndex < state.letters.length - 1) {
      state.letterIndex += 1;
      render();
      return;
    }
    setStep(2);
  }

  function handleCvcTry() {
    const current = state.cvc[state.cvcIndex];
    if (!current) return;
    current.attempted = true;
    render();
  }

  function handleCvcAnswer(response) {
    const current = state.cvc[state.cvcIndex];
    if (!current) return;
    current.response = response;
    if (state.cvcIndex < state.cvc.length - 1) {
      state.cvcIndex += 1;
      render();
      return;
    }
    setStep(3);
  }

  function handleDvTry() {
    const current = state.dv[state.dvIndex];
    if (!current) return;
    current.attempted = true;
    render();
  }

  function handleDvAnswer(response) {
    const current = state.dv[state.dvIndex];
    if (!current) return;
    current.response = response;
    if (state.dvIndex < state.dv.length - 1) {
      state.dvIndex += 1;
      render();
      return;
    }
    setStep(4);
  }

  function finishCheck(fluencyRating) {
    state.fluency = fluencyRating;
    persistSummary();
    setStep(5);
  }

  function buildSummary() {
    return {
      date: new Date().toISOString(),
      letters_known: state.letters.filter((item) => item.known === true).length,
      cvc_easy: state.cvc.filter((item) => item.response === 'easy').length,
      dv_easy: state.dv.filter((item) => item.response === 'easy').length,
      fluency_rating: state.fluency || 'tricky'
    };
  }

  function persistSummary() {
    try {
      localStorage.setItem(RESULT_KEY, JSON.stringify(buildSummary()));
    } catch {}
  }

  function downloadSummary() {
    const summary = buildSummary();
    const headers = ['date', 'letters_known', 'cvc_easy', 'dv_easy', 'fluency_rating'];
    const row = [
      summary.date,
      String(summary.letters_known),
      String(summary.cvc_easy),
      String(summary.dv_easy),
      summary.fluency_rating
    ];
    const csv = `${headers.join(',')}\n${row.map(csvEscape).join(',')}\n`;
    const stamp = summary.date.replace(/[:.]/g, '-');
    const filename = `student-quick-check-${stamp}.csv`;
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      state.downloadStatus = `Saved ${filename}`;
    } catch {
      state.downloadStatus = 'Download unavailable on this device.';
    }
    render();
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    if (!/[",\n]/.test(text)) return text;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function speak(text) {
    try {
      if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance !== 'function') return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(String(text || ''));
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  function setStep(step) {
    state.step = step;
    render();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
