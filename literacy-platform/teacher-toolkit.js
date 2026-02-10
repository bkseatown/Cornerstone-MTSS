(function () {
  const STORAGE_PREFIX = 'cs_toolkit_v1::';

  const CATEGORIES = [
    {
      id: 'clarity-directions',
      title: 'Clarity & directions (UDL access)',
      items: [
        { id: 'visual-directions-anchor-chart', title: 'Visual directions / anchor chart', desc: 'Post a visible step-by-step model students can reference independently.' },
        { id: 'chunk-the-task', title: 'Chunk the task', desc: 'Split larger work into smaller, clear checkpoints.' },
        { id: 'worked-example-non-example', title: 'Worked example + non-example', desc: 'Show both what quality looks like and what to avoid.' },
        { id: 'quick-check-understanding', title: 'Quick check for understanding', desc: 'Pause briefly to confirm the next step is clear for everyone.' }
      ]
    },
    {
      id: 'participation-engagement',
      title: 'Participation & engagement',
      items: [
        { id: 'choice-response-format', title: 'Choice of response format', desc: 'Let students respond by speaking, drawing, writing, or modeling.' },
        { id: 'partner-talk-routine', title: 'Partner talk routine', desc: 'Use a short turn-and-talk to increase processing and participation.' },
        { id: 'goal-one-minute-reflection', title: 'Goal + 1-minute reflection', desc: 'Set a quick goal and close with a short reflection check-in.' }
      ]
    },
    {
      id: 'executive-function-planning',
      title: 'Executive function / planning',
      items: [
        { id: 'first-then-plan', title: 'First/Then plan', desc: 'Name the immediate task first, then the follow-up task.' },
        { id: 'two-minute-start-routine', title: '2-minute start routine', desc: 'Use a fast launch routine to reduce start-up delay.' },
        { id: 'timer-planned-breaks', title: 'Timer + planned breaks', desc: 'Set short work intervals with predictable reset points.' }
      ]
    },
    {
      id: 'regulation-supports',
      title: 'Regulation supports (Responsive Classroom aligned)',
      items: [
        { id: 'reset-routine-breathing-body', title: 'Reset routine (breathing + body)', desc: 'Use a brief body-and-breath reset before re-engaging.' },
        { id: 'movement-break-menu', title: 'Movement break menu', desc: 'Offer quick, structured movement options during longer blocks.' },
        { id: 'calm-corner-reset-card', title: 'Calm corner / reset card', desc: 'Provide a consistent reset space with a clear return routine.' }
      ]
    },
    {
      id: 'feedback-routines',
      title: 'Feedback routines',
      items: [
        { id: 'glow-grow-language', title: 'Glow/Grow language (no red)', desc: 'Frame feedback with one strength and one next step.' },
        { id: 'one-focus-target-at-time', title: 'One focus target at a time', desc: 'Keep feedback narrow so students can act on it immediately.' }
      ]
    }
  ];

  const root = document.getElementById('ttk-categories');
  const studentNameEl = document.getElementById('ttk-student-name');
  const gradeBandEl = document.getElementById('ttk-grade-band');
  const loadBtn = document.getElementById('ttk-load-btn');
  const contextStatusEl = document.getElementById('ttk-context-status');
  const exportCsvBtn = document.getElementById('ttk-export-csv');
  const exportHtmlBtn = document.getElementById('ttk-export-html');
  const exportStatusEl = document.getElementById('ttk-export-status');

  if (!root || !studentNameEl || !gradeBandEl || !loadBtn || !exportCsvBtn || !exportHtmlBtn) return;

  const state = {
    activeKey: '',
    student: '',
    grade_band: '',
    items: createDefaultItems(),
    updated_at: ''
  };

  renderCategories();
  bindEvents();
  setContextStatus('Choose a student context, then select Start / Load.');

  function bindEvents() {
    loadBtn.addEventListener('click', () => {
      loadProfile();
    });

    root.addEventListener('change', (event) => {
      handleItemEdit(event);
    });

    root.addEventListener('input', (event) => {
      handleItemEdit(event);
    });

    exportCsvBtn.addEventListener('click', () => {
      if (!ensureActiveProfile()) return;
      exportCsv();
    });

    exportHtmlBtn.addEventListener('click', () => {
      if (!ensureActiveProfile()) return;
      exportPrintableSummary();
    });
  }

  function loadProfile() {
    const student = String(studentNameEl.value || '').trim();
    const gradeBand = String(gradeBandEl.value || '').trim();
    const slug = slugify(student) || 'general';
    const key = `${STORAGE_PREFIX}${slug}`;

    const saved = parseStored(localStorage.getItem(key) || '');
    const defaults = createDefaultItems();

    if (saved && typeof saved === 'object') {
      state.student = String(saved.student || student || '').trim();
      state.grade_band = String(saved.grade_band || gradeBand || '').trim();
      state.items = mergeItems(defaults, Array.isArray(saved.items) ? saved.items : []);
      state.updated_at = String(saved.updated_at || '').trim();
      setContextStatus(`Loaded toolkit profile for ${state.student || 'General class'}.`);
    } else {
      state.student = student;
      state.grade_band = gradeBand;
      state.items = defaults;
      state.updated_at = '';
      setContextStatus(`Started toolkit profile for ${state.student || 'General class'}.`);
    }

    state.activeKey = key;
    studentNameEl.value = state.student;
    gradeBandEl.value = state.grade_band;
    persist();
    renderCategories();
  }

  function handleItemEdit(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!state.activeKey) return;

    const itemId = String(target.getAttribute('data-item-id') || '');
    const field = String(target.getAttribute('data-field') || '');
    if (!itemId || !field) return;

    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;

    if (field === 'tried') {
      const checked = target instanceof HTMLInputElement ? !!target.checked : false;
      item.tried = checked;
      if (checked && !item.start_date) item.start_date = todayValue();
      persist();
      renderCategories();
      return;
    }

    const value = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
      ? String(target.value || '')
      : '';
    item[field] = value;
    persist();
  }

  function renderCategories() {
    root.innerHTML = CATEGORIES.map((category) => {
      const cards = category.items.map((spec) => {
        const item = state.items.find((entry) => entry.id === spec.id) || defaultItemFromSpec(category.title, spec);
        const disabledAttr = item.tried ? '' : 'disabled';
        return `
          <article class="cs-ttk-item ${item.tried ? '' : 'cs-ttk-item-disabled'}">
            <div class="cs-ttk-item-title-row">
              <h5>${escapeHtml(spec.title)}</h5>
              <label class="cs-ttk-toggle">
                <input type="checkbox" data-item-id="${escapeHtml(item.id)}" data-field="tried" ${item.tried ? 'checked' : ''} />
                Try it
              </label>
            </div>
            <p class="cs-ttk-item-desc">${escapeHtml(spec.desc)}</p>
            <div class="cs-ttk-item-meta">
              <label class="cs-ttk-field">
                <span>Start date</span>
                <input type="date" class="cs-ttk-input" data-item-id="${escapeHtml(item.id)}" data-field="start_date" value="${escapeHtml(item.start_date || todayValue())}" ${disabledAttr} />
              </label>
              <label class="cs-ttk-field">
                <span>Frequency</span>
                <select class="cs-ttk-select" data-item-id="${escapeHtml(item.id)}" data-field="frequency" ${disabledAttr}>
                  ${['', 'daily', 'weekly', 'as needed'].map((choice) => `<option value="${escapeHtml(choice)}" ${item.frequency === choice ? 'selected' : ''}>${escapeHtml(choice || 'Choose')}</option>`).join('')}
                </select>
              </label>
              <label class="cs-ttk-field">
                <span>Did it help?</span>
                <select class="cs-ttk-select" data-item-id="${escapeHtml(item.id)}" data-field="helpfulness" ${disabledAttr}>
                  ${['', 'Not yet', 'Some', 'Yes'].map((choice) => `<option value="${escapeHtml(choice)}" ${item.helpfulness === choice ? 'selected' : ''}>${escapeHtml(choice || 'Choose')}</option>`).join('')}
                </select>
              </label>
            </div>
            <label class="cs-ttk-field">
              <span>Notes (optional)</span>
              <textarea class="cs-ttk-textarea" data-item-id="${escapeHtml(item.id)}" data-field="notes" ${disabledAttr}>${escapeHtml(item.notes || '')}</textarea>
            </label>
          </article>
        `;
      }).join('');

      return `
        <section class="cs-ttk-category">
          <h4>${escapeHtml(category.title)}</h4>
          <div class="cs-ttk-item-grid">
            ${cards}
          </div>
        </section>
      `;
    }).join('');
  }

  function exportCsv() {
    const tried = getTriedItems();
    if (!tried.length) {
      setExportStatus('No tried items to export yet. Toggle Try it on at least one routine.', true);
      return;
    }

    const headers = ['student', 'grade_band', 'item_id', 'item_title', 'category', 'start_date', 'frequency', 'helpfulness', 'notes', 'updated_at'];
    const rows = tried.map((item) => [
      state.student || 'General class',
      state.grade_band || '',
      item.id,
      item.title,
      item.category,
      item.start_date || '',
      item.frequency || '',
      item.helpfulness || '',
      item.notes || '',
      state.updated_at || ''
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');
    const stamp = todayValue().replace(/-/g, '');
    const slug = slugify(state.student) || 'general';
    downloadBlob(`teacher-toolkit-log-${slug}-${stamp}.csv`, csv, 'text/csv;charset=utf-8;');
    setExportStatus('Toolkit CSV downloaded.');
  }

  function exportPrintableSummary() {
    const tried = getTriedItems();
    const generated = new Date().toLocaleString();
    const summaryRows = tried.length
      ? tried.map((item) => `
          <tr>
            <td>${escapeHtml(item.title)}</td>
            <td>${escapeHtml(item.category)}</td>
            <td>${escapeHtml(item.start_date || '-')}</td>
            <td>${escapeHtml(item.frequency || '-')}</td>
            <td>${escapeHtml(item.helpfulness || '-')}</td>
            <td>${escapeHtml(item.notes || '-')}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="6">No routines marked as tried yet.</td></tr>';

    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Teacher Toolkit Summary</title>
  <style>
    body { font-family: "Atkinson Hyperlegible", "Segoe UI", Arial, sans-serif; margin: 1rem; color: #0f172a; }
    h1, h2 { margin: 0 0 .5rem; }
    p { margin: 0 0 .45rem; line-height: 1.45; }
    .panel { border: 1px solid #cbd5e1; border-radius: .75rem; padding: .75rem; margin-bottom: .75rem; background: #fff; }
    table { width: 100%; border-collapse: collapse; margin-top: .4rem; }
    th, td { border: 1px solid #cbd5e1; text-align: left; vertical-align: top; padding: .42rem; font-size: .9rem; line-height: 1.35; }
    th { background: #eef2ff; }
    .actions { margin-bottom: .75rem; }
    button { border: 1px solid #cbd5e1; border-radius: .6rem; background: #eef2ff; padding: .45rem .7rem; font-weight: 700; }
    @media print { .actions { display: none; } body { margin: .5rem; } }
  </style>
</head>
<body>
  <h1>Teacher Toolkit Summary</h1>
  <p>Generated: ${escapeHtml(generated)}</p>
  <div class="actions"><button onclick="window.print()">Print</button></div>
  <div class="panel">
    <p><strong>Student:</strong> ${escapeHtml(state.student || 'General class')}</p>
    <p><strong>Grade band:</strong> ${escapeHtml(state.grade_band || '-')}</p>
    <p><strong>Updated:</strong> ${escapeHtml(formatDateLabel(state.updated_at) || '-')}</p>
  </div>
  <div class="panel">
    <h2>Tried routines</h2>
    <table>
      <thead>
        <tr>
          <th>Routine</th>
          <th>Category</th>
          <th>Start date</th>
          <th>Frequency</th>
          <th>Did it help?</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${summaryRows}
      </tbody>
    </table>
  </div>
</body>
</html>
    `.trim();

    const stamp = todayValue().replace(/-/g, '');
    const slug = slugify(state.student) || 'general';
    downloadBlob(`teacher-toolkit-summary-${slug}-${stamp}.html`, html, 'text/html;charset=utf-8;');
    setExportStatus('Printable toolkit summary downloaded.');
  }

  function ensureActiveProfile() {
    if (state.activeKey) return true;
    setExportStatus('Select Start / Load before exporting.', true);
    return false;
  }

  function getTriedItems() {
    return state.items.filter((item) => item.tried).map((item) => ({
      ...item,
      title: itemTitleById(item.id),
      category: categoryTitleByItemId(item.id)
    }));
  }

  function persist() {
    if (!state.activeKey) return;
    state.updated_at = new Date().toISOString();
    const payload = {
      student: state.student || '',
      grade_band: state.grade_band || '',
      items: state.items.map((item) => ({
        id: item.id,
        tried: !!item.tried,
        start_date: String(item.start_date || ''),
        frequency: String(item.frequency || ''),
        helpfulness: String(item.helpfulness || ''),
        notes: String(item.notes || '')
      })),
      updated_at: state.updated_at
    };
    try {
      localStorage.setItem(state.activeKey, JSON.stringify(payload));
    } catch {}
  }

  function createDefaultItems() {
    return CATEGORIES.flatMap((category) => category.items.map((spec) => defaultItemFromSpec(category.title, spec)));
  }

  function defaultItemFromSpec(_categoryTitle, spec) {
    return {
      id: spec.id,
      tried: false,
      start_date: todayValue(),
      frequency: '',
      helpfulness: '',
      notes: ''
    };
  }

  function mergeItems(defaults, savedItems) {
    const savedMap = new Map();
    savedItems.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const id = String(item.id || '').trim();
      if (!id) return;
      savedMap.set(id, item);
    });
    return defaults.map((base) => {
      const saved = savedMap.get(base.id);
      if (!saved) return base;
      return {
        ...base,
        tried: !!saved.tried,
        start_date: String(saved.start_date || base.start_date || todayValue()),
        frequency: String(saved.frequency || ''),
        helpfulness: String(saved.helpfulness || ''),
        notes: String(saved.notes || '')
      };
    });
  }

  function itemTitleById(id) {
    for (const category of CATEGORIES) {
      for (const item of category.items) {
        if (item.id === id) return item.title;
      }
    }
    return id;
  }

  function categoryTitleByItemId(id) {
    for (const category of CATEGORIES) {
      if (category.items.some((item) => item.id === id)) return category.title;
    }
    return '';
  }

  function setContextStatus(message) {
    if (!contextStatusEl) return;
    contextStatusEl.textContent = String(message || '');
  }

  function setExportStatus(message, isWarn) {
    if (!exportStatusEl) return;
    exportStatusEl.textContent = String(message || '');
    exportStatusEl.classList.toggle('cs-ttk-note-warn', !!isWarn);
  }

  function formatDateLabel(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return text;
    return date.toLocaleString();
  }

  function todayValue() {
    return new Date().toISOString().slice(0, 10);
  }

  function parseStored(raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function csvEscape(value) {
    const text = String(value === undefined || value === null ? '' : value);
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

  function downloadBlob(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }
})();
