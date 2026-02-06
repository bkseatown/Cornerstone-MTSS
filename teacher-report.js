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

  const ACTIVITY_HREF = {
    'word-quest': 'word-quest.html',
    cloze: 'cloze.html',
    comprehension: 'comprehension.html',
    fluency: 'fluency.html',
    madlibs: 'madlibs.html',
    writing: 'writing.html',
    'plan-it': 'plan-it.html'
  };

  const FOCUS_LIBRARY = {
    'phonics-decoding': {
      label: 'Phonics & Decoding',
      specialistFit: 'SPED · EAL · SLP',
      summary: 'Explicit sound-symbol mapping and controlled transfer to text.',
      steps: [
        {
          phase: 'I do',
          activity: 'word-quest',
          move: 'Model decoding moves and corrective feedback with target patterns.'
        },
        {
          phase: 'We do',
          activity: 'cloze',
          move: 'Guide students to apply target words in sentence context.'
        },
        {
          phase: 'You do with support',
          activity: 'fluency',
          move: 'Practice connected text with line focus and immediate coaching.'
        }
      ],
      wordQuestFocusByBand: {
        'K-2': { focus: 'cvc', len: '3' },
        '3-5': { focus: 'ccvc', len: '4' },
        '6-8': { focus: 'multisyllable', len: 'any' },
        '9-12': { focus: 'multisyllable', len: 'any' }
      }
    },
    'fluency-prosody': {
      label: 'Fluency & Prosody',
      specialistFit: 'SPED · EAL · SLP',
      summary: 'Build automaticity, expression, and punctuation-aware reading.',
      steps: [
        {
          phase: 'I do',
          activity: 'fluency',
          move: 'Model rate, phrasing, and punctuation in short connected text.'
        },
        {
          phase: 'We do',
          activity: 'comprehension',
          move: 'Read together, annotate key evidence, and discuss meaning.'
        },
        {
          phase: 'You do with support',
          activity: 'writing',
          move: 'Use sentence stems to retell or summarize with teacher prompts.'
        }
      ],
      wordQuestFocusByBand: {
        'K-2': { focus: 'digraph', len: '3' },
        '3-5': { focus: 'r_controlled', len: '5' },
        '6-8': { focus: 'vowel_team', len: '5' },
        '9-12': { focus: 'multisyllable', len: 'any' }
      }
    },
    'comprehension-evidence': {
      label: 'Comprehension & Evidence',
      specialistFit: 'EAL · SPED · Literacy coach',
      summary: 'Move from surface reading to evidence-based responses.',
      steps: [
        {
          phase: 'I do',
          activity: 'comprehension',
          move: 'Model question unpacking and how to locate evidence.'
        },
        {
          phase: 'We do',
          activity: 'cloze',
          move: 'Use context clues and justify answer choices together.'
        },
        {
          phase: 'You do with support',
          activity: 'writing',
          move: 'Write a short response citing evidence with scaffolded frames.'
        }
      ],
      wordQuestFocusByBand: {
        'K-2': { focus: 'cvc', len: '3' },
        '3-5': { focus: 'cvce', len: '4' },
        '6-8': { focus: 'vowel_team', len: '5' },
        '9-12': { focus: 'multisyllable', len: 'any' }
      }
    },
    'writing-language': {
      label: 'Writing & Language',
      specialistFit: 'SPED · EAL · Classroom',
      summary: 'Sentence quality, vocabulary precision, and paragraph coherence.',
      steps: [
        {
          phase: 'I do',
          activity: 'writing',
          move: 'Model a topic sentence and one expanded detail sentence.'
        },
        {
          phase: 'We do',
          activity: 'madlibs',
          move: 'Co-construct grammar and word choice in a guided playful task.'
        },
        {
          phase: 'You do with support',
          activity: 'comprehension',
          move: 'Respond to text prompts with sentence-level feedback.'
        }
      ],
      wordQuestFocusByBand: {
        'K-2': { focus: 'digraph', len: '3' },
        '3-5': { focus: 'vowel_team', len: '5' },
        '6-8': { focus: 'multisyllable', len: 'any' },
        '9-12': { focus: 'multisyllable', len: 'any' }
      }
    },
    'sel-executive': {
      label: 'SEL & Executive Function',
      specialistFit: 'Counseling · SEL · Learning support',
      summary: 'Self-management, planning stamina, and reflection routines.',
      steps: [
        {
          phase: 'I do',
          activity: 'plan-it',
          move: 'Model planning choices, timing, and regulation checkpoints.'
        },
        {
          phase: 'We do',
          activity: 'writing',
          move: 'Co-write a simple action plan using supportive language.'
        },
        {
          phase: 'You do with support',
          activity: 'comprehension',
          move: 'Self-monitor with evidence prompts and reflective check-ins.'
        }
      ],
      wordQuestFocusByBand: {
        'K-2': { focus: 'cvc', len: '3' },
        '3-5': { focus: 'ccvc', len: '4' },
        '6-8': { focus: 'multisyllable', len: 'any' },
        '9-12': { focus: 'multisyllable', len: 'any' }
      }
    }
  };

  const learnerNameEl = document.getElementById('report-learner-name');
  const generatedAtEl = document.getElementById('report-generated-at');
  const metricsEl = document.getElementById('report-metrics');
  const focusEl = document.getElementById('report-focus');
  const pulseEl = document.getElementById('report-pulse');
  const builderGradeEl = document.getElementById('report-builder-grade');
  const builderFocusEl = document.getElementById('report-builder-focus');
  const builderDurationEl = document.getElementById('report-builder-duration');
  const builderGenerateBtn = document.getElementById('report-builder-generate');
  const builderCopyBtn = document.getElementById('report-builder-copy');
  const builderOutputEl = document.getElementById('report-builder-output');
  const builderStatusEl = document.getElementById('report-builder-status');
  const heatmapEl = document.getElementById('report-heatmap');
  const emptyEl = document.getElementById('report-empty');
  const refreshBtn = document.getElementById('report-refresh');
  const exportPdfBtn = document.getElementById('report-export-pdf');
  const printBtn = document.getElementById('report-print');

  let latestBuilderText = '';

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

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getActivityHref(activityId, context = {}) {
    const file = ACTIVITY_HREF[activityId];
    if (!file) return '#';
    const url = new URL(file, window.location.href);
    if (activityId === 'word-quest' && context.wordQuestFocus) {
      url.searchParams.set('focus', context.wordQuestFocus);
      if (context.wordQuestLength) {
        url.searchParams.set('len', context.wordQuestLength);
      }
    }
    return url.toString();
  }

  function normalizeGradeBand(value) {
    const band = String(value || '').trim();
    if (band === 'K-2' || band === '3-5' || band === '6-8' || band === '9-12') return band;
    return '3-5';
  }

  function activityDomain(activityId) {
    if (activityId === 'word-quest') return 'decoding';
    if (activityId === 'fluency') return 'fluency';
    if (activityId === 'comprehension' || activityId === 'cloze') return 'comprehension';
    if (activityId === 'writing' || activityId === 'madlibs') return 'written-language';
    if (activityId === 'plan-it') return 'executive-function';
    return 'general';
  }

  function domainLabel(domainId) {
    const map = {
      decoding: 'Decoding',
      fluency: 'Fluency & prosody',
      comprehension: 'Comprehension',
      'written-language': 'Written language',
      'executive-function': 'Planning & regulation',
      general: 'General literacy'
    };
    return map[domainId] || 'Literacy';
  }

  function getActivityStats(logs) {
    const buckets = {};
    logs.forEach((entry) => {
      const activity = String(entry?.activity || '');
      if (!ACTIVITY_LABELS[activity]) return;
      if (!buckets[activity]) {
        buckets[activity] = {
          activity,
          label: ACTIVITY_LABELS[activity],
          scores: [],
          evidence: 0,
          lastTs: 0
        };
      }
      const score = scoreEntry(entry);
      if (typeof score === 'number' && !Number.isNaN(score)) {
        buckets[activity].scores.push(clamp(score));
      }
      buckets[activity].evidence += 1;
      buckets[activity].lastTs = Math.max(buckets[activity].lastTs, Number(entry?.ts || 0));
    });

    return Object.values(buckets).map((bucket) => ({
      activity: bucket.activity,
      label: bucket.label,
      avg: average(bucket.scores),
      evidence: bucket.evidence,
      lastTs: bucket.lastTs
    }));
  }

  function getDomainStats(logs) {
    const buckets = {};
    logs.forEach((entry) => {
      const activity = String(entry?.activity || '');
      const domain = activityDomain(activity);
      if (!buckets[domain]) {
        buckets[domain] = { domain, scores: [], evidence: 0 };
      }
      const score = scoreEntry(entry);
      if (typeof score === 'number' && !Number.isNaN(score)) {
        buckets[domain].scores.push(clamp(score));
      }
      buckets[domain].evidence += 1;
    });

    return Object.values(buckets).map((bucket) => ({
      domain: bucket.domain,
      label: domainLabel(bucket.domain),
      avg: average(bucket.scores),
      evidence: bucket.evidence
    }));
  }

  function mapPlacementFocusToBuilder(focus) {
    const value = String(focus || '').toLowerCase();
    if (!value) return 'comprehension-evidence';
    if (value === 'cvc' || value === 'digraph' || value === 'ccvc' || value === 'cvce' || value === 'vowel_team' || value === 'r_controlled' || value === 'multisyllable') {
      return 'phonics-decoding';
    }
    return 'comprehension-evidence';
  }

  function mapStandardToBuilder(standard) {
    const text = String(standard || '');
    if (text.startsWith('RF')) return text === 'RF.3.4' ? 'fluency-prosody' : 'phonics-decoding';
    if (text.startsWith('RL') || text.startsWith('RI')) return 'comprehension-evidence';
    if (text.startsWith('W') || text.startsWith('L')) return 'writing-language';
    if (text.startsWith('SL')) return 'sel-executive';
    return 'comprehension-evidence';
  }

  function recommendBuilderFocus(placementRec, weakestRow, domainStats) {
    if (placementRec?.focus) return mapPlacementFocusToBuilder(placementRec.focus);
    if (weakestRow?.standard) return mapStandardToBuilder(weakestRow.standard);

    const weakestDomain = domainStats
      .filter((row) => row.evidence > 0 && row.avg !== null)
      .sort((a, b) => (a.avg - b.avg))[0];

    if (!weakestDomain) return 'comprehension-evidence';
    if (weakestDomain.domain === 'decoding') return 'phonics-decoding';
    if (weakestDomain.domain === 'fluency') return 'fluency-prosody';
    if (weakestDomain.domain === 'written-language') return 'writing-language';
    if (weakestDomain.domain === 'executive-function') return 'sel-executive';
    return 'comprehension-evidence';
  }

  function getMinuteSplit(totalMinutes) {
    const n = Number(totalMinutes || 20);
    if (n <= 10) return [3, 4, 3];
    if (n <= 20) return [5, 8, 7];
    return [8, 12, 10];
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

  function getSupportProfile() {
    const settings = readJson('decode_settings', {}) || {};
    const enabled = [];
    if (settings.largeText) enabled.push('Large text');
    if (settings.lineFocus) enabled.push('Line focus');
    if (settings.reducedStimulation) enabled.push('Reduced stimulation');
    if (settings.focusMode) enabled.push('Focus mode');
    if (settings.calmMode) enabled.push('Calm mode');
    if (settings.fontProfile === 'opendyslexic') enabled.push('OpenDyslexic font profile');
    if (settings.fontProfile === 'atkinson') enabled.push('Atkinson font profile');
    return enabled;
  }

  function buildPulseModel(logs, placementRec, weakestRow) {
    const activityStats = getActivityStats(logs);
    const domainStats = getDomainStats(logs)
      .filter((row) => row.evidence > 0 && row.avg !== null)
      .sort((a, b) => b.avg - a.avg);

    const strengths = domainStats
      .filter((row) => row.evidence >= 2 && row.avg >= 0.74)
      .slice(0, 3);

    const gaps = [...domainStats]
      .filter((row) => row.evidence >= 2 && row.avg < 0.7)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 3);

    const fallbackStrengths = strengths.length ? strengths : domainStats.slice(0, 2);
    const fallbackGaps = gaps.length ? gaps : [...domainStats].sort((a, b) => a.avg - b.avg).slice(0, 2);

    const priorities = [];
    if (placementRec?.headline) {
      priorities.push(`Placement priority: ${placementRec.headline}`);
    } else if (placementRec?.focus) {
      priorities.push(`Placement priority: ${placementRec.focus}`);
    }
    if (weakestRow?.standard) {
      const rec = STANDARD_RECOMMENDATIONS[weakestRow.standard];
      priorities.push(
        rec
          ? `Standards priority: ${weakestRow.standard} -> ${rec.focus}`
          : `Standards priority: ${weakestRow.standard} (${weakestRow.label})`
      );
    }
    if (fallbackGaps[0]) {
      priorities.push(`Domain priority: ${fallbackGaps[0].label} (${formatPercent(fallbackGaps[0].avg)})`);
    }

    const supports = getSupportProfile();
    const topPriority = priorities[0] || 'Build evidence with 3-5 scored sessions this week.';
    const domainPriority = fallbackGaps[0]?.label || 'Core literacy';

    return {
      strengths: fallbackStrengths,
      gaps: fallbackGaps,
      priorities: priorities.slice(0, 3),
      supports,
      topPriority,
      domainPriority,
      activityStats
    };
  }

  function renderPulse(pulse) {
    if (!pulseEl) return;

    const strengthItems = pulse.strengths.length
      ? pulse.strengths.map((row) => `<li>${escapeHtml(row.label)} · ${formatPercent(row.avg)} (${row.evidence} samples)</li>`).join('')
      : '<li>Need more scored sessions for a stable strengths pattern.</li>';

    const gapItems = pulse.gaps.length
      ? pulse.gaps.map((row) => `<li>${escapeHtml(row.label)} · ${formatPercent(row.avg)} (${row.evidence} samples)</li>`).join('')
      : '<li>No major domain gaps flagged yet. Continue progress monitoring.</li>';

    const priorityItems = pulse.priorities.length
      ? pulse.priorities.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>Run at least 3 scored sessions to generate priorities.</li>';

    const supportsText = pulse.supports.length
      ? pulse.supports.map(escapeHtml).join(' · ')
      : 'No accessibility supports enabled yet. Suggested starter set: Large text · Line focus · Reduced stimulation.';

    pulseEl.innerHTML = `
      <div class="report-pulse-grid">
        <article class="report-pulse-card">
          <h3>Strengths</h3>
          <ul>${strengthItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Highest-Leverage Gaps</h3>
          <ul>${gapItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>4-Week Intervention Pathway</h3>
          <ul>
            <li>Week 1: I do heavy modeling in ${escapeHtml(pulse.domainPriority)}.</li>
            <li>Week 2: We do guided reps with immediate feedback and correction.</li>
            <li>Week 3: You do with support, plus brief fluency/comprehension checks.</li>
            <li>Week 4: Re-check progress and tighten next targets from data.</li>
          </ul>
          <div class="report-pulse-note">${escapeHtml(pulse.topPriority)}</div>
        </article>
        <article class="report-pulse-card">
          <h3>Priorities + Supports</h3>
          <ul>${priorityItems}</ul>
          <div class="report-pulse-note"><strong>Support profile:</strong> ${supportsText}</div>
        </article>
      </div>
    `;
  }

  function renderBuilderFocusOptions() {
    if (!builderFocusEl) return;
    const entries = Object.entries(FOCUS_LIBRARY);
    builderFocusEl.innerHTML = entries
      .map(([id, profile]) => `<option value="${id}">${profile.label}</option>`)
      .join('');
  }

  function renderBuilderPlan(context = {}) {
    if (!builderOutputEl || !builderFocusEl || !builderDurationEl || !builderGradeEl) return;

    const focusId = String(builderFocusEl.value || 'comprehension-evidence');
    const duration = Number(builderDurationEl.value || 20);
    const gradeBand = normalizeGradeBand(builderGradeEl.value || context.gradeBand);
    const profile = FOCUS_LIBRARY[focusId] || FOCUS_LIBRARY['comprehension-evidence'];
    const split = getMinuteSplit(duration);
    const wordQuestDefault = profile.wordQuestFocusByBand?.[gradeBand] || { focus: 'all', len: 'any' };
    const lines = [
      `${profile.label} · ${duration} minutes · ${gradeBand}`,
      profile.summary,
      `Best fit: ${profile.specialistFit}`,
      ''
    ];

    const stepCards = profile.steps.map((step, index) => {
      const minutes = split[index] || split[split.length - 1];
      const href = getActivityHref(step.activity, {
        wordQuestFocus: wordQuestDefault.focus,
        wordQuestLength: wordQuestDefault.len
      });
      lines.push(`${index + 1}) ${step.phase} · ${minutes} min · ${ACTIVITY_LABELS[step.activity] || step.activity}`);
      lines.push(`   ${step.move}`);
      lines.push(`   ${href}`);
      return `
        <article class="report-builder-step">
          <div class="report-builder-phase">${index + 1}. ${escapeHtml(step.phase)} · ${minutes} min</div>
          <div class="report-builder-activity">${escapeHtml(ACTIVITY_LABELS[step.activity] || step.activity)}</div>
          <div class="report-builder-move">${escapeHtml(step.move)}</div>
          <a class="secondary-btn report-builder-link" href="${href}">Open ${escapeHtml(ACTIVITY_LABELS[step.activity] || step.activity)}</a>
        </article>
      `;
    }).join('');

    lines.push('');
    lines.push('Instructional spine: explicit model -> guided practice -> independent practice with support.');
    latestBuilderText = lines.join('\n');

    builderOutputEl.innerHTML = `
      <div class="report-builder-summary">
        <div><strong>${escapeHtml(profile.label)}</strong> · ${duration} minutes · ${escapeHtml(gradeBand)}</div>
        <div>${escapeHtml(profile.summary)}</div>
        <div><strong>Best fit:</strong> ${escapeHtml(profile.specialistFit)}</div>
      </div>
      <div class="report-builder-steps">${stepCards}</div>
      <div class="report-builder-note">Use this as a daily lesson spine: explicit model -> guided practice -> independent practice with support.</div>
    `;
    if (builderStatusEl) builderStatusEl.textContent = '';
  }

  async function copyBuilderPlan() {
    if (!latestBuilderText) {
      if (builderStatusEl) builderStatusEl.textContent = 'Build a lesson first, then copy.';
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestBuilderText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      if (builderStatusEl) builderStatusEl.textContent = 'Lesson plan copied.';
    } catch {
      if (builderStatusEl) builderStatusEl.textContent = 'Clipboard unavailable. Copy directly from the lesson cards.';
    }
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

    const pulse = buildPulseModel(logs, placementRec, weakest);
    renderPulse(pulse);

    if (builderGradeEl && learner?.gradeBand) {
      builderGradeEl.value = normalizeGradeBand(learner.gradeBand);
    }
    if (builderFocusEl) {
      const recommendedFocus = recommendBuilderFocus(placementRec, weakest, getDomainStats(logs));
      builderFocusEl.value = recommendedFocus;
    }
    renderBuilderPlan({ gradeBand: learner?.gradeBand });
  }

  renderBuilderFocusOptions();
  refreshBtn?.addEventListener('click', refreshReport);
  exportPdfBtn?.addEventListener('click', exportPdf);
  printBtn?.addEventListener('click', () => window.print());
  builderGenerateBtn?.addEventListener('click', () => renderBuilderPlan());
  builderCopyBtn?.addEventListener('click', () => {
    copyBuilderPlan();
  });
  builderGradeEl?.addEventListener('change', () => renderBuilderPlan());
  builderFocusEl?.addEventListener('change', () => renderBuilderPlan());
  builderDurationEl?.addEventListener('change', () => renderBuilderPlan());

  refreshReport();
})();
