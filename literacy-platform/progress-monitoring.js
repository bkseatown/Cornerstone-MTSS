(function () {
  const STORE_PREFIX = 'cs_pm_v1::';
  const ACTIVE_STUDENT_KEY = 'cs_pm_v1_active_student';
  const DATE_FIELDS = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const PROBES = [
    {
      id: 'letter-sounds',
      title: 'Letter Sounds',
      description: 'K-2 baseline of known letter sounds.',
      bandLabel: 'K-2',
      group: 'Literacy',
      scoreHint: 'Correct out of 10'
    },
    {
      id: 'cvc-reading',
      title: 'CVC Word Reading',
      description: 'Short word decoding fluency check.',
      bandLabel: 'K-2 / 3-5',
      group: 'Literacy',
      scoreHint: 'Correct out of 10'
    },
    {
      id: 'fluency',
      title: 'Fluency (WPM + Accuracy)',
      description: 'Track pace and accuracy in connected text.',
      bandLabel: '3-5 / 6-8 / 9-12',
      group: 'Literacy',
      scoreHint: 'WPM and accuracy %'
    },
    {
      id: 'comprehension-quick',
      title: 'Comprehension Quick',
      description: 'Three-question comprehension self-check.',
      bandLabel: 'All bands',
      group: 'Literacy',
      scoreHint: 'Correct out of 3'
    },
    {
      id: 'number-sense',
      title: 'Number Sense',
      description: 'Short number reasoning probe.',
      bandLabel: 'K-2 / 3-5',
      group: 'Math',
      scoreHint: 'Correct out of 10'
    },
    {
      id: 'operations',
      title: 'Operations',
      description: 'Compute and explain strategy quickly.',
      bandLabel: '3-5 / 6-8',
      group: 'Math',
      scoreHint: 'Correct out of 10'
    },
    {
      id: 'strategy',
      title: 'Problem Solving Strategy',
      description: 'Capture reasoning notes and shared strategy.',
      bandLabel: 'All bands',
      group: 'Math',
      scoreHint: 'Notes + shared strategy'
    }
  ];

  const rootNodes = {
    studentName: document.getElementById('cs-pm-student-name'),
    gradeBand: document.getElementById('cs-pm-grade-band'),
    studentLoadBtn: document.getElementById('cs-pm-student-load'),
    studentStatus: document.getElementById('cs-pm-student-status'),
    probeGrid: document.getElementById('cs-pm-probe-grid'),
    entrySubtitle: document.getElementById('cs-pm-entry-subtitle'),
    entryForm: document.getElementById('cs-pm-entry-form'),
    entryStatus: document.getElementById('cs-pm-entry-status'),
    trendSubtitle: document.getElementById('cs-pm-trend-subtitle'),
    trendSummary: document.getElementById('cs-pm-trend-summary'),
    trendBody: document.getElementById('cs-pm-trend-body'),
    exportCsvBtn: document.getElementById('cs-pm-export-csv'),
    exportSstBtn: document.getElementById('cs-pm-export-sst'),
    exportStatus: document.getElementById('cs-pm-export-status')
  };

  if (!rootNodes.probeGrid || !rootNodes.entryForm || !rootNodes.trendBody) return;

  const state = {
    activeProbeId: PROBES[0].id,
    activeStudentSlug: '',
    activeStudent: null
  };

  initialize();

  function initialize() {
    bindEvents();
    hydrateActiveStudent();
    renderProbeGrid();
    renderEntry();
    renderTrendView();
  }

  function bindEvents() {
    rootNodes.studentLoadBtn?.addEventListener('click', startOrLoadStudent);
    rootNodes.probeGrid?.addEventListener('click', handleProbeSelect);
    rootNodes.entryForm?.addEventListener('click', handleEntrySave);
    rootNodes.exportCsvBtn?.addEventListener('click', downloadStudentCsv);
    rootNodes.exportSstBtn?.addEventListener('click', downloadSstSnapshot);
  }

  function hydrateActiveStudent() {
    try {
      const storedSlug = String(localStorage.getItem(ACTIVE_STUDENT_KEY) || '').trim();
      if (!storedSlug) return;
      const stored = readStudentRecord(storedSlug);
      if (!stored) return;
      state.activeStudentSlug = storedSlug;
      state.activeStudent = stored;
      if (rootNodes.studentName) rootNodes.studentName.value = stored.student || '';
      if (rootNodes.gradeBand) rootNodes.gradeBand.value = stored.grade_band || '';
      setNote(rootNodes.studentStatus, `Loaded ${stored.student || 'student'} (${stored.grade_band || 'grade band not set'}).`);
    } catch {}
  }

  function startOrLoadStudent() {
    const studentName = String(rootNodes.studentName?.value || '').trim();
    const gradeBand = String(rootNodes.gradeBand?.value || '').trim();
    if (!studentName) {
      setNote(rootNodes.studentStatus, 'Enter a student name before loading.', true);
      return;
    }
    if (!gradeBand) {
      setNote(rootNodes.studentStatus, 'Choose a grade band before loading.', true);
      return;
    }

    const slug = slugify(studentName);
    if (!slug) {
      setNote(rootNodes.studentStatus, 'Use letters or numbers in the student name.', true);
      return;
    }

    const existing = readStudentRecord(slug);
    const studentRecord = existing || {
      student: studentName,
      grade_band: gradeBand,
      results: []
    };

    studentRecord.student = studentName;
    studentRecord.grade_band = gradeBand;
    if (!Array.isArray(studentRecord.results)) studentRecord.results = [];

    state.activeStudentSlug = slug;
    state.activeStudent = studentRecord;
    persistStudentRecord();
    setNote(rootNodes.studentStatus, `${existing ? 'Loaded' : 'Created'} profile for ${studentName}.`);
    renderEntry();
    renderTrendView();
  }

  function handleProbeSelect(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest('button[data-probe-id]');
    if (!button) return;
    const probeId = String(button.getAttribute('data-probe-id') || '');
    if (!PROBES.some((probe) => probe.id === probeId)) return;
    state.activeProbeId = probeId;
    renderProbeGrid();
    renderEntry();
    renderTrendView();
  }

  function handleEntrySave(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.getAttribute('data-action') !== 'save-result') return;
    saveProbeResult();
  }

  function saveProbeResult() {
    if (!state.activeStudent) {
      setNote(rootNodes.entryStatus, 'Load a student before saving probe results.', true);
      return;
    }

    const dateInput = document.getElementById('cs-pm-result-date');
    const dateRaw = String(dateInput?.value || '').trim();
    const dateISO = toIsoDate(dateRaw);
    if (!dateISO) {
      setNote(rootNodes.entryStatus, 'Enter a valid date before saving.', true);
      return;
    }

    const probeId = state.activeProbeId;
    const notesInput = document.getElementById('cs-pm-result-notes');
    const notes = String(notesInput?.value || '').trim();
    const result = {
      probe: probeId,
      dateISO,
      notes,
      createdAt: new Date().toISOString()
    };

    if (probeId === 'letter-sounds' || probeId === 'cvc-reading' || probeId === 'number-sense' || probeId === 'operations') {
      const correct = readNumericInput('cs-pm-result-correct', 0, 10);
      if (correct === null) {
        setNote(rootNodes.entryStatus, 'Enter a whole number score between 0 and 10.', true);
        return;
      }
      result.correct = correct;
      result.total = 10;
    } else if (probeId === 'fluency') {
      const wpm = readNumericInput('cs-pm-result-wpm', 0, 500);
      const accuracy = readNumericInput('cs-pm-result-accuracy', 0, 100);
      if (wpm === null || accuracy === null) {
        setNote(rootNodes.entryStatus, 'Enter valid WPM and accuracy values.', true);
        return;
      }
      result.wpm = wpm;
      result.accuracy_pct = accuracy;
    } else if (probeId === 'comprehension-quick') {
      const correct = readNumericInput('cs-pm-result-comp-correct', 0, 3);
      const confidenceEl = document.getElementById('cs-pm-result-confidence');
      const confidence = String(confidenceEl?.value || '').trim();
      if (correct === null || !confidence) {
        setNote(rootNodes.entryStatus, 'Enter comprehension score and confidence.', true);
        return;
      }
      result.correct = correct;
      result.total = 3;
      result.confidence = confidence;
    } else if (probeId === 'strategy') {
      const sharedEl = document.getElementById('cs-pm-result-shared');
      result.shared_strategy = String(sharedEl?.value || 'no') === 'yes';
      if (!result.notes) {
        setNote(rootNodes.entryStatus, 'Add strategy notes before saving.', true);
        return;
      }
    }

    state.activeStudent.results.push(result);
    persistStudentRecord();
    setNote(rootNodes.entryStatus, 'Result saved.');
    renderEntry();
    renderTrendView();
  }

  function renderProbeGrid() {
    rootNodes.probeGrid.innerHTML = PROBES.map((probe) => {
      const isActive = probe.id === state.activeProbeId;
      return `
        <button class="cs-pm-probe-btn ${isActive ? 'cs-pm-probe-btn-active' : ''}" type="button" data-probe-id="${escapeHtml(probe.id)}">
          <span class="cs-pm-probe-meta">${escapeHtml(probe.group)} · ${escapeHtml(probe.bandLabel)}</span>
          <h4 class="cs-pm-probe-title">${escapeHtml(probe.title)}</h4>
          <p class="cs-pm-probe-desc">${escapeHtml(probe.description)}</p>
        </button>
      `;
    }).join('');
  }

  function renderEntry() {
    const probe = getActiveProbe();
    if (!probe) return;

    if (!state.activeStudent) {
      if (rootNodes.entrySubtitle) rootNodes.entrySubtitle.textContent = 'Load a student to begin.';
      rootNodes.entryForm.innerHTML = '<p class="cs-pm-callout">Start or load a student profile before entering probe data.</p>';
      return;
    }

    if (rootNodes.entrySubtitle) {
      rootNodes.entrySubtitle.textContent = `${state.activeStudent.student} · ${state.activeStudent.grade_band} · ${probe.title}`;
    }

    rootNodes.entryForm.innerHTML = `
      <div class="cs-pm-entry-grid">
        <label class="cs-pm-field" for="cs-pm-result-date">
          <span>Date</span>
          <input id="cs-pm-result-date" class="cs-pm-input" type="date" value="${escapeHtml(todayIsoDate())}" />
        </label>
        ${entryFieldsForProbe(probe.id)}
        <label class="cs-pm-field ${probe.id === 'strategy' ? '' : ''}" for="cs-pm-result-notes">
          <span>Notes (optional)</span>
          <textarea id="cs-pm-result-notes" class="cs-pm-textarea" placeholder="Quick observation notes"></textarea>
        </label>
      </div>
      <div class="cs-pm-entry-actions">
        <button class="cs-pm-btn cs-pm-btn-primary" type="button" data-action="save-result">Save result</button>
      </div>
    `;

    if (probe.id === 'strategy') {
      const notesLabel = rootNodes.entryForm.querySelector('label[for="cs-pm-result-notes"] > span');
      if (notesLabel) notesLabel.textContent = 'Strategy notes';
    }
  }

  function entryFieldsForProbe(probeId) {
    if (probeId === 'letter-sounds' || probeId === 'cvc-reading' || probeId === 'number-sense' || probeId === 'operations') {
      return `
        <label class="cs-pm-field" for="cs-pm-result-correct">
          <span>Correct (out of 10)</span>
          <input id="cs-pm-result-correct" class="cs-pm-input" type="number" min="0" max="10" step="1" inputmode="numeric" />
        </label>
      `;
    }

    if (probeId === 'fluency') {
      return `
        <label class="cs-pm-field" for="cs-pm-result-wpm">
          <span>Words per minute (WPM)</span>
          <input id="cs-pm-result-wpm" class="cs-pm-input" type="number" min="0" max="500" step="1" inputmode="numeric" />
        </label>
        <label class="cs-pm-field" for="cs-pm-result-accuracy">
          <span>Accuracy (%)</span>
          <input id="cs-pm-result-accuracy" class="cs-pm-input" type="number" min="0" max="100" step="1" inputmode="numeric" />
        </label>
      `;
    }

    if (probeId === 'comprehension-quick') {
      return `
        <label class="cs-pm-field" for="cs-pm-result-comp-correct">
          <span>Correct (out of 3)</span>
          <input id="cs-pm-result-comp-correct" class="cs-pm-input" type="number" min="0" max="3" step="1" inputmode="numeric" />
        </label>
        <label class="cs-pm-field" for="cs-pm-result-confidence">
          <span>Confidence</span>
          <select id="cs-pm-result-confidence" class="cs-pm-select">
            <option value="">Choose</option>
            <option value="Easy">Easy</option>
            <option value="OK">OK</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
      `;
    }

    if (probeId === 'strategy') {
      return `
        <label class="cs-pm-field" for="cs-pm-result-shared">
          <span>Shared strategy</span>
          <select id="cs-pm-result-shared" class="cs-pm-select">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
      `;
    }

    return '';
  }

  function renderTrendView() {
    const probe = getActiveProbe();
    if (!probe) return;

    if (!state.activeStudent) {
      if (rootNodes.trendSubtitle) rootNodes.trendSubtitle.textContent = 'Saved results appear here, most recent first.';
      rootNodes.trendSummary.innerHTML = '';
      rootNodes.trendBody.innerHTML = `
        <tr>
          <td colspan="4">Load a student to view trend data.</td>
        </tr>
      `;
      return;
    }

    const allResults = sortedResults(state.activeStudent.results);
    const probeResults = allResults.filter((row) => row.probe === probe.id);
    if (rootNodes.trendSubtitle) {
      rootNodes.trendSubtitle.textContent = `${probe.title} results for ${state.activeStudent.student} (latest first).`;
    }

    rootNodes.trendSummary.innerHTML = PROBES.map((item) => {
      const count = allResults.filter((row) => row.probe === item.id).length;
      const latest = allResults.find((row) => row.probe === item.id);
      return `
        <article class="cs-pm-stat">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${count} saved · ${escapeHtml(latest ? scoreLabel(latest) : 'No results yet')}</span>
        </article>
      `;
    }).join('');

    if (!probeResults.length) {
      rootNodes.trendBody.innerHTML = `
        <tr>
          <td colspan="4">No saved results for this probe yet.</td>
        </tr>
      `;
      return;
    }

    rootNodes.trendBody.innerHTML = probeResults.map((row) => `
      <tr>
        <td>${escapeHtml(formatDateLabel(row.dateISO))}</td>
        <td>${escapeHtml(probeTitle(row.probe))}</td>
        <td>${escapeHtml(scoreLabel(row))}</td>
        <td>${escapeHtml(truncate(row.notes || '', 140) || '-')}</td>
      </tr>
    `).join('');
  }

  function downloadStudentCsv() {
    if (!state.activeStudent || !Array.isArray(state.activeStudent.results) || !state.activeStudent.results.length) {
      setNote(rootNodes.exportStatus, 'Save at least one result before exporting CSV.', true);
      return;
    }

    const rows = sortedResults(state.activeStudent.results);
    const header = [
      'student',
      'grade_band',
      'probe_type',
      'date_iso',
      'correct',
      'total',
      'wpm',
      'accuracy_pct',
      'confidence',
      'shared_strategy',
      'notes'
    ];

    const lines = [header.join(',')];
    rows.forEach((row) => {
      const record = [
        state.activeStudent.student || '',
        state.activeStudent.grade_band || '',
        probeTitle(row.probe),
        row.dateISO || '',
        safeCsvValue(row.correct),
        safeCsvValue(row.total),
        safeCsvValue(row.wpm),
        safeCsvValue(row.accuracy_pct),
        safeCsvValue(row.confidence),
        row.shared_strategy ? 'Yes' : row.shared_strategy === false ? 'No' : '',
        row.notes || ''
      ];
      lines.push(record.map(csvEscape).join(','));
    });

    const csv = lines.join('\n');
    const stamp = todayIsoDate().replace(/-/g, '');
    const filename = `progress-monitoring-${state.activeStudentSlug || 'student'}-${stamp}.csv`;
    downloadBlob(filename, csv, 'text/csv;charset=utf-8;');
    setNote(rootNodes.exportStatus, 'Student progress CSV downloaded.');
  }

  function downloadSstSnapshot() {
    if (!state.activeStudent || !Array.isArray(state.activeStudent.results) || !state.activeStudent.results.length) {
      setNote(rootNodes.exportStatus, 'Save at least one result before exporting the SST snapshot.', true);
      return;
    }

    const sorted = sortedResults(state.activeStudent.results);
    const latestByProbe = {};
    sorted.forEach((row) => {
      if (!latestByProbe[row.probe]) latestByProbe[row.probe] = row;
    });

    const latestRows = PROBES.map((probe) => {
      const latest = latestByProbe[probe.id];
      if (!latest) {
        return `
          <tr>
            <td>${escapeHtml(probe.title)}</td>
            <td>-</td>
            <td>-</td>
          </tr>
        `;
      }
      return `
        <tr>
          <td>${escapeHtml(probe.title)}</td>
          <td>${escapeHtml(scoreLabel(latest))}</td>
          <td>${escapeHtml(truncate(latest.notes || '', 180) || '-')}</td>
        </tr>
      `;
    }).join('');

    const trendRows = sorted.slice(0, 12).map((row) => `
      <tr>
        <td>${escapeHtml(formatDateLabel(row.dateISO))}</td>
        <td>${escapeHtml(probeTitle(row.probe))}</td>
        <td>${escapeHtml(scoreLabel(row))}</td>
        <td>${escapeHtml(truncate(row.notes || '', 120) || '-')}</td>
      </tr>
    `).join('');

    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SST Snapshot - ${escapeHtml(state.activeStudent.student || 'Student')}</title>
  <style>
    body { font-family: "Atkinson Hyperlegible", "Segoe UI", Arial, sans-serif; margin: 1.2rem; color: #0f172a; }
    h1, h2 { margin: 0 0 0.45rem; line-height: 1.25; }
    p { margin: 0 0 0.6rem; color: #334155; }
    .meta { margin-bottom: 1rem; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.7rem; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.6rem; }
    th, td { border: 1px solid #cbd5e1; text-align: left; padding: 0.5rem; font-size: 0.92rem; vertical-align: top; }
    th { background: #eef2ff; }
    .print-actions { margin: 0.8rem 0 1rem; }
    button { border: 1px solid #cbd5e1; background: #eef2ff; color: #1e293b; border-radius: 0.55rem; padding: 0.45rem 0.7rem; font-weight: 700; }
    @media print { .print-actions { display: none; } body { margin: 0.5rem; } }
  </style>
</head>
<body>
  <h1>SST Snapshot</h1>
  <p>Progress Monitoring V1 summary for classroom MTSS conversations.</p>
  <div class="meta">
    <p><strong>Student:</strong> ${escapeHtml(state.activeStudent.student || '-')}</p>
    <p><strong>Grade band:</strong> ${escapeHtml(state.activeStudent.grade_band || '-')}</p>
    <p><strong>Generated:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
  </div>
  <div class="print-actions">
    <button onclick="window.print()">Print</button>
  </div>
  <h2>Latest by probe</h2>
  <table>
    <thead>
      <tr>
        <th>Probe</th>
        <th>Latest score</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>${latestRows}</tbody>
  </table>
  <h2 style="margin-top:1rem;">Recent trend (latest 12)</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Probe</th>
        <th>Score</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>${trendRows || '<tr><td colspan="4">No results saved yet.</td></tr>'}</tbody>
  </table>
</body>
</html>
    `.trim();

    const stamp = todayIsoDate().replace(/-/g, '');
    const filename = `sst-snapshot-${state.activeStudentSlug || 'student'}-${stamp}.html`;
    downloadBlob(filename, html, 'text/html;charset=utf-8;');
    setNote(rootNodes.exportStatus, 'Printable SST snapshot downloaded.');
  }

  function persistStudentRecord() {
    if (!state.activeStudentSlug || !state.activeStudent) return;
    try {
      localStorage.setItem(ACTIVE_STUDENT_KEY, state.activeStudentSlug);
      localStorage.setItem(`${STORE_PREFIX}${state.activeStudentSlug}`, JSON.stringify(state.activeStudent));
    } catch {}
  }

  function readStudentRecord(slug) {
    try {
      const raw = localStorage.getItem(`${STORE_PREFIX}${slug}`) || '';
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return {
        student: String(parsed.student || ''),
        grade_band: String(parsed.grade_band || ''),
        results: Array.isArray(parsed.results) ? parsed.results.slice() : []
      };
    } catch {
      return null;
    }
  }

  function getActiveProbe() {
    return PROBES.find((probe) => probe.id === state.activeProbeId) || PROBES[0];
  }

  function probeTitle(probeId) {
    return PROBES.find((probe) => probe.id === probeId)?.title || probeId;
  }

  function scoreLabel(result) {
    if (!result || typeof result !== 'object') return '-';
    if (result.probe === 'fluency') {
      const wpm = Number.isFinite(Number(result.wpm)) ? Number(result.wpm) : 0;
      const accuracy = Number.isFinite(Number(result.accuracy_pct)) ? Number(result.accuracy_pct) : 0;
      return `${wpm} WPM, ${accuracy}% accuracy`;
    }
    if (result.probe === 'comprehension-quick') {
      const correct = Number.isFinite(Number(result.correct)) ? Number(result.correct) : 0;
      const confidence = String(result.confidence || 'Unknown');
      return `${correct}/3, confidence: ${confidence}`;
    }
    if (result.probe === 'strategy') {
      const shared = result.shared_strategy ? 'Yes' : 'No';
      return `Shared strategy: ${shared}`;
    }
    if (Number.isFinite(Number(result.correct)) && Number.isFinite(Number(result.total))) {
      return `${Number(result.correct)}/${Number(result.total)} correct`;
    }
    return '-';
  }

  function sortedResults(results) {
    return (Array.isArray(results) ? results.slice() : []).sort((a, b) => {
      const dateA = Date.parse(String(a?.dateISO || '')) || 0;
      const dateB = Date.parse(String(b?.dateISO || '')) || 0;
      if (dateA !== dateB) return dateB - dateA;
      const createdA = Date.parse(String(a?.createdAt || '')) || 0;
      const createdB = Date.parse(String(b?.createdAt || '')) || 0;
      return createdB - createdA;
    });
  }

  function readNumericInput(id, min, max) {
    const input = document.getElementById(id);
    const raw = String(input?.value || '').trim();
    if (!raw) return null;
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) return null;
    const rounded = Math.round(numeric);
    if (rounded < min || rounded > max) return null;
    return rounded;
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function toIsoDate(dateText) {
    const raw = String(dateText || '').trim();
    if (!raw) return null;
    const parsed = new Date(`${raw}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
  }

  function formatDateLabel(iso) {
    const parsed = new Date(String(iso || ''));
    if (Number.isNaN(parsed.getTime())) return 'Unknown';
    return parsed.toLocaleDateString(undefined, DATE_FIELDS);
  }

  function downloadBlob(filename, content, contentType) {
    try {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
    } catch {
      setNote(rootNodes.exportStatus, 'Download failed on this device. Try again.', true);
    }
  }

  function csvEscape(value) {
    const text = String(value === undefined || value === null ? '' : value);
    if (!/[",\n]/.test(text)) return text;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function safeCsvValue(value) {
    if (value === undefined || value === null) return '';
    return value;
  }

  function setNote(node, message, isWarn) {
    if (!node) return;
    node.textContent = String(message || '');
    node.classList.toggle('cs-pm-note-warn', !!isWarn);
  }

  function truncate(value, maxLength) {
    const text = String(value || '');
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}...`;
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
