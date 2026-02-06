// Teacher report: printable growth summary + standards mastery heatmap.
(function () {
  const ACTIVITY_LABELS = {
    'word-quest': 'Word Quest',
    cloze: 'Story Fill',
    comprehension: 'Read & Think',
    fluency: 'Speed Sprint',
    madlibs: 'Silly Stories',
    writing: 'Write & Build',
    'plan-it': 'Plan-It'
  };

  const ACTIVITY_ORDER = [
    'word-quest',
    'cloze',
    'comprehension',
    'fluency',
    'madlibs',
    'writing',
    'plan-it'
  ];

  const ACTIVITY_STANDARDS = {
    'word-quest': ['RF.2.3', 'RF.3.3'],
    cloze: ['L.3.4', 'RL.3.1'],
    comprehension: ['RL.3.1', 'RI.3.1'],
    fluency: ['RF.3.4'],
    madlibs: ['L.3.1', 'L.3.3'],
    writing: ['W.3.2', 'W.3.4'],
    'plan-it': ['SL.3.1', 'W.3.8']
  };

  const STANDARD_META = {
    'RF.2.3': { domain: 'Foundational Skills', label: 'Phonics and word analysis' },
    'RF.3.3': { domain: 'Foundational Skills', label: 'Decode multisyllable words' },
    'RF.3.4': { domain: 'Foundational Skills', label: 'Read with fluency and accuracy' },
    'L.3.1': { domain: 'Language', label: 'Grammar and usage' },
    'L.3.3': { domain: 'Language', label: 'Vocabulary and expression' },
    'L.3.4': { domain: 'Language', label: 'Determine meaning in context' },
    'RL.3.1': { domain: 'Reading Literature', label: 'Ask and answer questions' },
    'RI.3.1': { domain: 'Reading Informational', label: 'Use evidence from text' },
    'W.3.2': { domain: 'Writing', label: 'Informative/explanatory writing' },
    'W.3.4': { domain: 'Writing', label: 'Clear, coherent writing' },
    'W.3.8': { domain: 'Writing', label: 'Recall and organize information' },
    'SL.3.1': { domain: 'Speaking & Listening', label: 'Collaborative discussion skills' }
  };

  const STANDARD_RECOMMENDATIONS = {
    'RF.2.3': {
      focus: 'Word Quest (CVC, digraphs, blends)',
      notes: 'Use short decoding sets and immediate error correction.'
    },
    'RF.3.3': {
      focus: 'Word Quest (multisyllable + affixes)',
      notes: 'Chunk words by syllables, prefixes, and suffixes.'
    },
    'RF.3.4': {
      focus: 'Speed Sprint',
      notes: 'Run 1-minute repeated readings with a reachable WCPM goal.'
    },
    'L.3.1': {
      focus: 'Silly Stories',
      notes: 'Target parts of speech and sentence-level revisions.'
    },
    'L.3.3': {
      focus: 'Silly Stories + Write & Build',
      notes: 'Practice stronger word choices and sentence variety.'
    },
    'L.3.4': {
      focus: 'Story Fill',
      notes: 'Use context clues and discuss why each choice fits.'
    },
    'RL.3.1': {
      focus: 'Read & Think',
      notes: 'Require evidence-based answers from the passage.'
    },
    'RI.3.1': {
      focus: 'Read & Think (informational passages)',
      notes: 'Highlight keywords and cite text evidence.'
    },
    'W.3.2': {
      focus: 'Write & Build',
      notes: 'Use plan-to-draft frames with explicit detail sentences.'
    },
    'W.3.4': {
      focus: 'Write & Build revisions',
      notes: 'Revise for sentence clarity and organization.'
    },
    'W.3.8': {
      focus: 'Plan-It',
      notes: 'Practice sequencing and reflecting on planning choices.'
    },
    'SL.3.1': {
      focus: 'Plan-It reflection routines',
      notes: 'Prompt verbal justification for each selected step.'
    }
  };

  const learnerNameEl = document.getElementById('report-learner-name');
  const generatedAtEl = document.getElementById('report-generated-at');
  const metricsEl = document.getElementById('report-metrics');
  const focusEl = document.getElementById('report-focus');
  const heatmapEl = document.getElementById('report-heatmap');
  const emptyEl = document.getElementById('report-empty');
  const refreshBtn = document.getElementById('report-refresh');
  const exportPdfBtn = document.getElementById('report-export-pdf');
  const printBtn = document.getElementById('report-print');

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function readJson(key, fallback) {
    const parsed = safeParse(localStorage.getItem(key) || '');
    return parsed === null || parsed === undefined ? fallback : parsed;
  }

  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  function average(values) {
    if (!values.length) return null;
    const sum = values.reduce((total, value) => total + value, 0);
    return sum / values.length;
  }

  function parseRatioFromText(text) {
    const match = String(text || '').match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) return null;
    const numerator = Number(match[1]);
    const denominator = Number(match[2]);
    if (!denominator) return null;
    return clamp(numerator / denominator);
  }

  function scoreEntry(entry) {
    const detail = entry?.detail || {};
    const event = String(entry?.event || '').toLowerCase();
    const activity = String(entry?.activity || '');

    if (typeof detail.correct === 'number' && typeof detail.total === 'number' && detail.total > 0) {
      return clamp(detail.correct / detail.total);
    }

    const ratioFromEvent = parseRatioFromText(event);
    if (ratioFromEvent !== null) return ratioFromEvent;

    if (typeof detail.won === 'boolean') {
      return detail.won ? 1 : 0.2;
    }

    if (typeof detail.issues === 'number') {
      return clamp(1 - (detail.issues * 0.2));
    }

    if (typeof detail.goal === 'number' && detail.goal > 0 && typeof detail.orf === 'number') {
      return clamp(detail.orf / detail.goal);
    }

    if (typeof detail.orf === 'number') {
      return clamp(detail.orf / 120);
    }

    if (typeof detail.wordCount === 'number') {
      return clamp(detail.wordCount / 60);
    }

    if (event.includes('goal met') || event.includes('quest complete') || event.includes('level complete')) {
      return 1;
    }

    if (event.includes('checked') || event.includes('generated') || event.includes('built paragraph')) {
      return 0.7;
    }

    if (activity === 'madlibs') return 0.7;
    if (activity === 'plan-it') return 0.65;

    return 0.6;
  }

  function getLogs() {
    const log = readJson('decode_activity_log_v1', []);
    return Array.isArray(log) ? log : [];
  }

  function formatPercent(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return `${Math.round(value * 100)}%`;
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'learner';
  }

  function buildDateSlug(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function exportPdf() {
    const learner = window.DECODE_PLATFORM?.getActiveLearner?.();
    const today = new Date();
    const fileStem = `decode-report-${slugify(learner?.name || 'learner')}-${buildDateSlug(today)}`;
    const previousTitle = document.title;
    document.title = fileStem;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 800);
  }

  function buildMetrics(logs) {
    const uniqueActivities = new Set(logs.map((entry) => entry?.activity).filter(Boolean));
    const now = Date.now();
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const recentSessions = logs.filter((entry) => Number(entry?.ts || 0) >= weekAgo).length;

    const wordQuest = readJson('decode_progress_data', {});
    const attempted = Number(wordQuest?.wordsAttempted || 0);
    const correct = Number(wordQuest?.wordsCorrect || 0);
    const wordQuestAccuracy = attempted ? clamp(correct / attempted) : null;

    const fluencyEntries = logs.filter((entry) => entry?.activity === 'fluency' && typeof entry?.detail?.orf === 'number');
    const fluencyAvg = average(fluencyEntries.map((entry) => clamp(Number(entry.detail.orf) / 120)));

    const comprehensionEntries = logs.filter((entry) => entry?.activity === 'comprehension');
    const compScores = comprehensionEntries.map((entry) => scoreEntry(entry));
    const compAvg = average(compScores);

    const latestEntry = logs[0];
    const latestDate = latestEntry?.ts ? new Date(latestEntry.ts).toLocaleDateString() : 'No activity yet';

    return [
      { label: 'Total Sessions', value: `${logs.length}` },
      { label: 'Activities Used', value: `${uniqueActivities.size}` },
      { label: 'Sessions (7 days)', value: `${recentSessions}` },
      { label: 'Word Quest Accuracy', value: formatPercent(wordQuestAccuracy) },
      { label: 'Fluency (est. mastery)', value: formatPercent(fluencyAvg) },
      { label: 'Comprehension (est. mastery)', value: formatPercent(compAvg) },
      { label: 'Most Recent Activity', value: latestDate }
    ];
  }

  function buildHeatmap(logs) {
    const standardSet = new Set(Object.keys(STANDARD_META));
    logs.forEach((entry) => {
      const activity = String(entry?.activity || '');
      const tagged = Array.isArray(entry?.standards) ? entry.standards : (ACTIVITY_STANDARDS[activity] || []);
      tagged.forEach((standard) => {
        if (standard) standardSet.add(String(standard));
      });
    });
    const standards = Array.from(standardSet);
    const matrix = {};
    standards.forEach((standard) => {
      matrix[standard] = {};
      ACTIVITY_ORDER.forEach((activity) => {
        matrix[standard][activity] = [];
      });
    });

    logs.forEach((entry) => {
      const activity = String(entry?.activity || '');
      const mappedStandards = Array.isArray(entry?.standards) && entry.standards.length
        ? entry.standards
        : ACTIVITY_STANDARDS[activity];
      if (!mappedStandards || !mappedStandards.length) return;
      const score = scoreEntry(entry);
      mappedStandards.forEach((standard) => {
        if (!matrix[standard]) return;
        matrix[standard][activity].push(score);
      });
    });

    return standards.map((standard) => {
      const perActivity = {};
      ACTIVITY_ORDER.forEach((activity) => {
        perActivity[activity] = average(matrix[standard][activity]);
      });
      const allScores = ACTIVITY_ORDER
        .flatMap((activity) => matrix[standard][activity]);
      return {
        standard,
        domain: STANDARD_META[standard]?.domain || 'Standards',
        label: STANDARD_META[standard]?.label || standard,
        perActivity,
        overall: average(allScores),
        evidence: allScores.length
      };
    });
  }

  function getPlacementRecommendation() {
    const placement = readJson('decode_placement_v1', null);
    return placement?.recommendation || null;
  }

  function getWeakestStandardRow(rows) {
    const eligible = rows.filter((row) => row.evidence >= 3 && row.overall !== null);
    if (!eligible.length) return null;
    return eligible.reduce((weakest, row) => {
      if (!weakest) return row;
      return row.overall < weakest.overall ? row : weakest;
    }, null);
  }

  function renderMetrics(logs) {
    if (!metricsEl) return;
    const metrics = buildMetrics(logs);
    metricsEl.innerHTML = '';
    metrics.forEach((metric) => {
      const card = document.createElement('div');
      card.className = 'report-metric';
      card.innerHTML = `
        <div class="report-metric-label">${metric.label}</div>
        <div class="report-metric-value">${metric.value}</div>
      `;
      metricsEl.appendChild(card);
    });
  }

  function renderFocus(placementRec, weakestRow) {
    if (!focusEl) return;
    focusEl.innerHTML = '';

    if (placementRec) {
      const title = document.createElement('div');
      title.className = 'report-focus-title';
      title.textContent = `${placementRec.focus} (length ${placementRec.length})`;
      const note = document.createElement('div');
      note.className = 'report-focus-note';
      note.textContent = placementRec.headline || placementRec.notes || 'Use placement-aligned practice in Word Quest.';
      focusEl.appendChild(title);
      focusEl.appendChild(note);
    }

    if (!weakestRow) {
      if (!placementRec) {
        const fallback = document.createElement('div');
        fallback.className = 'report-focus-note';
        fallback.textContent = 'Not enough evidence yet. Run at least three scored sessions for stronger recommendations.';
        focusEl.appendChild(fallback);
      }
      return;
    }

    const recommendation = STANDARD_RECOMMENDATIONS[weakestRow.standard];
    const weakHeader = document.createElement('div');
    weakHeader.className = 'report-focus-title';
    weakHeader.textContent = `Priority from data: ${weakestRow.standard} (${formatPercent(weakestRow.overall)})`;
    focusEl.appendChild(weakHeader);

    const weakBody = document.createElement('div');
    weakBody.className = 'report-focus-note';
    if (recommendation) {
      weakBody.textContent = `${recommendation.focus}. ${recommendation.notes}`;
    } else {
      weakBody.textContent = `${weakestRow.label}. Reinforce this standard with targeted practice and explicit feedback.`;
    }
    focusEl.appendChild(weakBody);
  }

  function masteryClass(score) {
    if (score === null || score === undefined) return 'heat-empty';
    if (score >= 0.85) return 'heat-high';
    if (score >= 0.65) return 'heat-mid';
    return 'heat-low';
  }

  function renderHeatmap(logs) {
    if (!heatmapEl || !emptyEl) return [];
    const rows = buildHeatmap(logs);

    const thead = heatmapEl.querySelector('thead');
    const tbody = heatmapEl.querySelector('tbody');
    if (!thead || !tbody) return rows;

    thead.innerHTML = '';
    tbody.innerHTML = '';

    const headRow = document.createElement('tr');
    const standardHead = document.createElement('th');
    standardHead.textContent = 'Standard';
    headRow.appendChild(standardHead);
    ACTIVITY_ORDER.forEach((activity) => {
      const th = document.createElement('th');
      th.textContent = ACTIVITY_LABELS[activity] || activity;
      headRow.appendChild(th);
    });
    const overallHead = document.createElement('th');
    overallHead.textContent = 'Overall';
    headRow.appendChild(overallHead);
    const evidenceHead = document.createElement('th');
    evidenceHead.textContent = 'Evidence';
    headRow.appendChild(evidenceHead);
    thead.appendChild(headRow);

    rows.forEach((row) => {
      const tr = document.createElement('tr');
      const standardCell = document.createElement('td');
      const standardStrong = document.createElement('strong');
      standardStrong.textContent = row.standard;
      const standardNote = document.createElement('div');
      standardNote.className = 'report-standard-note';
      standardNote.textContent = row.label;
      standardCell.appendChild(standardStrong);
      standardCell.appendChild(standardNote);
      tr.appendChild(standardCell);

      ACTIVITY_ORDER.forEach((activity) => {
        const score = row.perActivity[activity];
        const td = document.createElement('td');
        td.className = `heat-cell ${masteryClass(score)}`;
        td.textContent = formatPercent(score);
        tr.appendChild(td);
      });

      const overallCell = document.createElement('td');
      overallCell.className = `heat-cell ${masteryClass(row.overall)}`;
      overallCell.textContent = formatPercent(row.overall);
      tr.appendChild(overallCell);

      const evidenceCell = document.createElement('td');
      evidenceCell.textContent = `${row.evidence}`;
      tr.appendChild(evidenceCell);
      tbody.appendChild(tr);
    });

    const hasEvidence = rows.some((row) => row.evidence > 0);
    emptyEl.textContent = hasEvidence
      ? ''
      : 'No scored activity evidence yet. Complete a few activities, then refresh this report.';

    return rows;
  }

  function refreshReport() {
    const learner = window.DECODE_PLATFORM?.getActiveLearner?.();
    if (learnerNameEl) learnerNameEl.textContent = learner?.name || 'Learner';
    if (generatedAtEl) generatedAtEl.textContent = new Date().toLocaleString();

    const logs = getLogs();
    renderMetrics(logs);
    const rows = renderHeatmap(logs);
    const placementRec = getPlacementRecommendation();
    const weakest = getWeakestStandardRow(rows);
    renderFocus(placementRec, weakest);
  }

  refreshBtn?.addEventListener('click', refreshReport);
  exportPdfBtn?.addEventListener('click', exportPdf);
  printBtn?.addEventListener('click', () => window.print());

  refreshReport();
})();
