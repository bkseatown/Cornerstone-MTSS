(function () {
  const VALID_THEMES = ['calm', 'professional', 'playful'];
  const THEME_KEY = 'cs_hv2_theme';
  const RESULT_KEY = 'cs_math_quickcheck_v1';

  const NUMBER_SENSE_ITEMS = [
    {
      id: 'count_forward',
      prompt: 'Count forward: start at 27. What are the next 5 numbers?',
      choices: [
        '28, 29, 30, 31, 32',
        '27, 28, 29, 30, 31',
        '26, 27, 28, 29, 30',
        '28, 30, 31, 32, 33'
      ],
      isCorrect(choice) {
        return choice === '28, 29, 30, 31, 32';
      }
    },
    {
      id: 'count_backward',
      prompt: 'Count backward: start at 52. What are the previous 5 numbers?',
      choices: [
        '51, 50, 49, 48, 47',
        '52, 51, 50, 49, 48',
        '51, 49, 48, 47, 46',
        '50, 49, 48, 47, 46'
      ],
      isCorrect(choice) {
        return choice === '51, 50, 49, 48, 47';
      }
    },
    {
      id: 'bigger_decimal',
      prompt: 'Which is bigger: 3.8 or 3.75?',
      choices: ['3.8', '3.75', 'They are equal', 'Not sure'],
      isCorrect(choice) {
        return choice === '3.8';
      }
    },
    {
      id: 'tens_place',
      prompt: 'Place value: What digit is in the tens place of 4,628?',
      choices: ['2', '6', '4', '8'],
      isCorrect(choice) {
        return choice === '2';
      }
    },
    {
      id: 'make_ten_pick',
      prompt: 'Make 10: Pick a pair that makes 10 (6, 4, 7, 3).',
      choices: ['6 and 4', '7 and 3', '6 and 3', '4 and 7'],
      isCorrect(choice) {
        return choice === '6 and 4' || choice === '7 and 3' || choice === '4 and 7';
      }
    },
    {
      id: 'fraction_compare',
      prompt: 'Compare: Which is greater, 1/2 or 3/8?',
      choices: ['1/2 is greater', '3/8 is greater', 'They are equal', 'Not sure'],
      isCorrect(choice) {
        return choice === '1/2 is greater';
      }
    }
  ];

  const state = {
    step: 0,
    nsIndex: 0,
    nsResponses: NUMBER_SENSE_ITEMS.map((item) => ({
      id: item.id,
      status: null,
      selectedChoice: ''
    })),
    makeTens: {
      representText: '',
      representDrawing: '',
      hundreds: '',
      tens: '',
      ones: '',
      fillBlank: ''
    },
    strategy: {
      thinking: '',
      drawing: ''
    },
    downloadStatus: ''
  };

  const root = document.getElementById('mathPlacementRoot');
  if (!root) return;

  applyTheme();
  render();

  function applyTheme() {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const fromUrl = String(params.get('theme') || '').trim().toLowerCase();
      const fromStorage = String(localStorage.getItem(THEME_KEY) || '').trim().toLowerCase();
      const chosen = VALID_THEMES.includes(fromUrl)
        ? fromUrl
        : VALID_THEMES.includes(fromStorage)
          ? fromStorage
          : 'calm';
      if (VALID_THEMES.includes(fromUrl)) localStorage.setItem(THEME_KEY, fromUrl);

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
    if (state.step === 0) {
      renderWelcome();
      return;
    }
    if (state.step === 1) {
      renderNumberSenseItem();
      return;
    }
    if (state.step === 2) {
      renderMakingTens();
      return;
    }
    if (state.step === 3) {
      renderStrategy();
      return;
    }
    renderResults();
  }

  function renderWelcome() {
    root.innerHTML = `
      <p class="cs-mp-step">Screen 1 of 5</p>
      <h2 class="cs-mp-title">Let's find your best starting place in math.</h2>
      <p class="cs-mp-subtitle">This quick check helps match your next math practice steps.</p>
      <div class="cs-mp-actions">
        <button class="cs-mp-btn cs-mp-btn-primary" type="button" data-action="start">Start -&gt;</button>
      </div>
    `;
    root.querySelector('[data-action="start"]')?.addEventListener('click', () => {
      setStep(1);
    });
  }

  function renderNumberSenseItem() {
    const item = NUMBER_SENSE_ITEMS[state.nsIndex];
    if (!item) {
      setStep(2);
      return;
    }

    root.innerHTML = `
      <p class="cs-mp-step">Screen 2 of 5 · Item ${state.nsIndex + 1} of ${NUMBER_SENSE_ITEMS.length}</p>
      <h2 class="cs-mp-title">Number sense (IKAN-lite)</h2>
      <p class="cs-mp-subtitle">Choose the best answer for each item. You can skip if needed.</p>
      <section class="cs-mp-problem" aria-label="Number sense item">
        <h3>${escapeHtml(item.prompt)}</h3>
        <div class="cs-mp-choice-grid" role="group" aria-label="Choices">
          ${item.choices.map((choice, index) => `
            <button class="cs-mp-btn cs-mp-choice-btn" type="button" data-action="answer" data-choice-index="${index}">${escapeHtml(choice)}</button>
          `).join('')}
        </div>
      </section>
      <div class="cs-mp-actions">
        <button class="cs-mp-btn cs-mp-btn-quiet" type="button" data-action="skip-item">Skip item</button>
      </div>
    `;

    root.querySelectorAll('[data-action="answer"]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-choice-index'));
        const choice = item.choices[index] || '';
        const status = item.isCorrect(choice) ? 'correct' : 'incorrect';
        state.nsResponses[state.nsIndex] = {
          id: item.id,
          status,
          selectedChoice: choice
        };
        advanceNumberSense();
      });
    });

    root.querySelector('[data-action="skip-item"]')?.addEventListener('click', () => {
      state.nsResponses[state.nsIndex] = {
        id: item.id,
        status: 'skipped',
        selectedChoice: ''
      };
      advanceNumberSense();
    });
  }

  function advanceNumberSense() {
    if (state.nsIndex < NUMBER_SENSE_ITEMS.length - 1) {
      state.nsIndex += 1;
      render();
      return;
    }
    setStep(2);
  }

  function renderMakingTens() {
    root.innerHTML = `
      <p class="cs-mp-step">Screen 3 of 5</p>
      <h2 class="cs-mp-title">Making tens and hundreds</h2>
      <p class="cs-mp-subtitle">Share your work in text or drawing boxes. This section is not auto-graded for drawing quality.</p>

      <section class="cs-mp-problem">
        <h3>1) Represent 28 in two ways.</h3>
        <div class="cs-mp-form-grid">
          <div class="cs-mp-form-row">
            <label for="mp-represent-text">Text way</label>
            <input id="mp-represent-text" class="cs-mp-input" type="text" placeholder="Example: 20 + 8" value="${escapeHtml(state.makeTens.representText)}" />
          </div>
          <div class="cs-mp-form-row">
            <label for="mp-represent-drawing">Drawing box (optional)</label>
            <textarea id="mp-represent-drawing" class="cs-mp-textarea" placeholder="Use symbols or quick sketch notes...">${escapeHtml(state.makeTens.representDrawing)}</textarea>
          </div>
        </div>
      </section>

      <section class="cs-mp-problem">
        <h3>2) Break 135 into hundreds, tens, ones.</h3>
        <div class="cs-mp-choice-grid">
          <div class="cs-mp-form-row">
            <label for="mp-hundreds">Hundreds</label>
            <input id="mp-hundreds" class="cs-mp-input" type="text" inputmode="numeric" value="${escapeHtml(state.makeTens.hundreds)}" />
          </div>
          <div class="cs-mp-form-row">
            <label for="mp-tens">Tens</label>
            <input id="mp-tens" class="cs-mp-input" type="text" inputmode="numeric" value="${escapeHtml(state.makeTens.tens)}" />
          </div>
          <div class="cs-mp-form-row">
            <label for="mp-ones">Ones</label>
            <input id="mp-ones" class="cs-mp-input" type="text" inputmode="numeric" value="${escapeHtml(state.makeTens.ones)}" />
          </div>
        </div>
      </section>

      <section class="cs-mp-problem">
        <h3>3) Fill the blank: 100 = 40 + __</h3>
        <div class="cs-mp-form-row">
          <label for="mp-fill-blank">Blank value</label>
          <input id="mp-fill-blank" class="cs-mp-input" type="text" inputmode="numeric" value="${escapeHtml(state.makeTens.fillBlank)}" />
        </div>
      </section>

      <div class="cs-mp-actions">
        <button class="cs-mp-btn cs-mp-btn-primary" type="button" data-action="to-strategy">Continue -&gt;</button>
      </div>
    `;

    const representTextEl = root.querySelector('#mp-represent-text');
    const representDrawingEl = root.querySelector('#mp-represent-drawing');
    const hundredsEl = root.querySelector('#mp-hundreds');
    const tensEl = root.querySelector('#mp-tens');
    const onesEl = root.querySelector('#mp-ones');
    const fillBlankEl = root.querySelector('#mp-fill-blank');

    representTextEl?.addEventListener('input', () => {
      state.makeTens.representText = String(representTextEl.value || '');
    });
    representDrawingEl?.addEventListener('input', () => {
      state.makeTens.representDrawing = String(representDrawingEl.value || '');
    });
    hundredsEl?.addEventListener('input', () => {
      state.makeTens.hundreds = String(hundredsEl.value || '');
    });
    tensEl?.addEventListener('input', () => {
      state.makeTens.tens = String(tensEl.value || '');
    });
    onesEl?.addEventListener('input', () => {
      state.makeTens.ones = String(onesEl.value || '');
    });
    fillBlankEl?.addEventListener('input', () => {
      state.makeTens.fillBlank = String(fillBlankEl.value || '');
    });

    root.querySelector('[data-action="to-strategy"]')?.addEventListener('click', () => {
      setStep(3);
    });
  }

  function renderStrategy() {
    root.innerHTML = `
      <p class="cs-mp-step">Screen 4 of 5</p>
      <h2 class="cs-mp-title">Strategy snapshot (GLOSS-lite)</h2>
      <p class="cs-mp-subtitle">Problem: 23 + 19 = __</p>
      <section class="cs-mp-problem">
        <h3>How did you think about it?</h3>
        <div class="cs-mp-form-grid">
          <div class="cs-mp-form-row">
            <label for="mp-strategy-thinking">Your strategy</label>
            <textarea id="mp-strategy-thinking" class="cs-mp-textarea" placeholder="Example: I made 20 + 20 and adjusted by 2...">${escapeHtml(state.strategy.thinking)}</textarea>
          </div>
          <div class="cs-mp-form-row">
            <label for="mp-strategy-drawing">Optional drawing box</label>
            <textarea id="mp-strategy-drawing" class="cs-mp-textarea" placeholder="Add symbols, place-value notes, or a sketch...">${escapeHtml(state.strategy.drawing)}</textarea>
          </div>
        </div>
      </section>
      <div class="cs-mp-actions">
        <button class="cs-mp-btn cs-mp-btn-primary" type="button" data-action="to-results">Continue -&gt;</button>
      </div>
    `;

    const strategyEl = root.querySelector('#mp-strategy-thinking');
    const drawingEl = root.querySelector('#mp-strategy-drawing');

    strategyEl?.addEventListener('input', () => {
      state.strategy.thinking = String(strategyEl.value || '');
    });
    drawingEl?.addEventListener('input', () => {
      state.strategy.drawing = String(drawingEl.value || '');
    });

    root.querySelector('[data-action="to-results"]')?.addEventListener('click', () => {
      persistSummary();
      setStep(4);
    });
  }

  function renderResults() {
    const summary = buildSummary();
    const sharedStrategy = summary.shared_strategy ? 'Yes' : 'No';

    root.innerHTML = `
      <p class="cs-mp-step">Screen 5 of 5</p>
      <h2 class="cs-mp-title">Your quick check</h2>
      <p class="cs-mp-subtitle">Here is your math snapshot to share with your teacher.</p>

      <section class="cs-mp-summary" aria-label="Math quick check summary">
        <div class="cs-mp-summary-row">
          <p class="cs-mp-summary-label">Number sense correct</p>
          <p class="cs-mp-summary-value">${summary.ns_correct}/6</p>
        </div>
        <div class="cs-mp-summary-row">
          <p class="cs-mp-summary-label">Making tens/hundreds complete</p>
          <p class="cs-mp-summary-value">${summary.make_tens_complete}/3</p>
        </div>
        <div class="cs-mp-summary-row">
          <p class="cs-mp-summary-label">Strategy shared</p>
          <p class="cs-mp-summary-value">${sharedStrategy}</p>
        </div>
      </section>

      <div class="cs-mp-actions">
        <a class="cs-mp-btn cs-mp-btn-primary" href="number-sense.html">Go to Number Sense practice</a>
        <button class="cs-mp-btn" type="button" data-action="download">Download results for my teacher</button>
      </div>
      <p class="cs-mp-download-status" aria-live="polite">${escapeHtml(state.downloadStatus || '')}</p>
    `;

    root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
      downloadSummary();
    });
  }

  function buildSummary() {
    const nsCorrect = state.nsResponses.filter((entry) => entry.status === 'correct').length;

    const item1Complete = Boolean(String(state.makeTens.representText || '').trim())
      && Boolean(String(state.makeTens.representDrawing || '').trim());
    const item2Complete = Boolean(String(state.makeTens.hundreds || '').trim())
      && Boolean(String(state.makeTens.tens || '').trim())
      && Boolean(String(state.makeTens.ones || '').trim());
    const item3Complete = Boolean(String(state.makeTens.fillBlank || '').trim());
    const makeTensComplete = [item1Complete, item2Complete, item3Complete].filter(Boolean).length;

    const sharedStrategy = Boolean(String(state.strategy.thinking || '').trim() || String(state.strategy.drawing || '').trim());

    return {
      date: new Date().toISOString(),
      ns_correct: nsCorrect,
      make_tens_complete: makeTensComplete,
      shared_strategy: sharedStrategy,
      notes: buildNotes()
    };
  }

  function buildNotes() {
    const nsLines = state.nsResponses.map((entry, index) => {
      const item = NUMBER_SENSE_ITEMS[index];
      const status = entry.status || 'skipped';
      const selected = entry.selectedChoice ? ` | ${entry.selectedChoice}` : '';
      return `${index + 1}) ${item.prompt} -> ${status}${selected}`;
    });

    const makeTensLines = [
      `Represent 28 text: ${String(state.makeTens.representText || '').trim() || 'none'}`,
      `Represent 28 drawing: ${String(state.makeTens.representDrawing || '').trim() || 'none'}`,
      `135 breakdown: H=${String(state.makeTens.hundreds || '').trim() || 'none'}, T=${String(state.makeTens.tens || '').trim() || 'none'}, O=${String(state.makeTens.ones || '').trim() || 'none'}`,
      `100 = 40 + __ : ${String(state.makeTens.fillBlank || '').trim() || 'none'}`,
      `Strategy text: ${String(state.strategy.thinking || '').trim() || 'none'}`,
      `Strategy drawing: ${String(state.strategy.drawing || '').trim() || 'none'}`
    ];

    return [...nsLines, ...makeTensLines].join(' || ');
  }

  function persistSummary() {
    try {
      localStorage.setItem(RESULT_KEY, JSON.stringify(buildSummary()));
    } catch {}
  }

  function downloadSummary() {
    const summary = buildSummary();
    const headers = ['date', 'ns_correct', 'make_tens_complete', 'shared_strategy', 'notes'];
    const row = [
      summary.date,
      String(summary.ns_correct),
      String(summary.make_tens_complete),
      summary.shared_strategy ? 'true' : 'false',
      summary.notes
    ];
    const csv = `${headers.join(',')}\n${row.map(csvEscape).join(',')}\n`;
    const stamp = summary.date.replace(/[:.]/g, '-');
    const filename = `math-quick-check-${stamp}.csv`;

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

  function setStep(step) {
    state.step = step;
    render();
  }

  function csvEscape(value) {
    const text = String(value || '');
    if (!/[",\n]/.test(text)) return text;
    return `"${text.replace(/"/g, '""')}"`;
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
