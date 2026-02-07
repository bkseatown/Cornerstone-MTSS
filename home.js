// Home page enhancements: placement screener + recommended next steps.
(function () {
  const PLACEMENT_KEY = 'decode_placement_v1';
  const SETTINGS_KEY = 'decode_settings';
  const HOME_VISUAL_MODE_KEY = 'cornerstone_home_visual_mode_v1';
  const HOME_DETAILS_MODE_KEY = 'cornerstone_home_details_mode_v1';

  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('placement-modal');
  const summary = document.getElementById('placement-summary');

  const startBtn = document.getElementById('placement-start');
  const closeBtn = document.getElementById('placement-close');
  const calcBtn = document.getElementById('placement-calc');
  const clearBtn = document.getElementById('placement-clear');
  const result = document.getElementById('placement-result');
  const goWordQuest = document.getElementById('placement-go-word-quest');
  const openWordQuest = document.getElementById('placement-open-word-quest');
  const homeVisualFunBtn = document.getElementById('home-visual-fun');
  const homeVisualCalmBtn = document.getElementById('home-visual-calm');
  const homeWorkspaceToggleBtn = document.getElementById('home-toggle-workspace');
  const homeHeaderToggleBtn = document.getElementById('home-header-toggle');
  const homeRoleLaunchBtn = document.getElementById('home-role-launch');
  const homeRolePreviewEl = document.getElementById('home-role-preview');
  const homeRolePickButtons = Array.from(document.querySelectorAll('.home-role-pick[data-role-target]'));

  const gradeSelect = document.getElementById('placement-grade');
  const skillEls = {
    letterSounds: document.getElementById('skill-letter-sounds'),
    cvc: document.getElementById('skill-cvc'),
    digraph: document.getElementById('skill-digraph'),
    blends: document.getElementById('skill-blends'),
    magicE: document.getElementById('skill-magic-e'),
    vowelTeam: document.getElementById('skill-vowel-team'),
    rControlled: document.getElementById('skill-r-controlled'),
    multisyllable: document.getElementById('skill-multisyllable')
  };

  function normalizeHomeVisualMode(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'calm' ? 'calm' : 'fun';
  }

  function normalizeHomeDetailsMode(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'expanded' ? 'expanded' : 'collapsed';
  }

  function readHomeVisualMode() {
    return normalizeHomeVisualMode(localStorage.getItem(HOME_VISUAL_MODE_KEY));
  }

  function applyHomeVisualMode(mode, options = {}) {
    const normalized = normalizeHomeVisualMode(mode);
    const body = document.body;
    if (body) {
      body.classList.toggle('home-visual-fun', normalized === 'fun');
      body.classList.toggle('home-visual-calm', normalized === 'calm');
    }
    if (homeVisualFunBtn) {
      homeVisualFunBtn.classList.toggle('active', normalized === 'fun');
      homeVisualFunBtn.setAttribute('aria-pressed', normalized === 'fun' ? 'true' : 'false');
    }
    if (homeVisualCalmBtn) {
      homeVisualCalmBtn.classList.toggle('active', normalized === 'calm');
      homeVisualCalmBtn.setAttribute('aria-pressed', normalized === 'calm' ? 'true' : 'false');
    }
    if (options.persist) {
      localStorage.setItem(HOME_VISUAL_MODE_KEY, normalized);
    }
    return normalized;
  }

  function applyHomeDetailsMode(mode, options = {}) {
    const normalized = normalizeHomeDetailsMode(mode);
    const expanded = normalized === 'expanded';
    document.body.classList.toggle('home-details-expanded', expanded);
    document.body.classList.toggle('home-details-collapsed', !expanded);

    const toggleLabel = expanded ? 'Hide Workspace Tools' : 'Show Workspace Tools';
    if (homeWorkspaceToggleBtn) {
      homeWorkspaceToggleBtn.textContent = toggleLabel;
      homeWorkspaceToggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
    if (homeHeaderToggleBtn) {
      homeHeaderToggleBtn.textContent = expanded ? 'Hide Workspace' : 'Workspace';
      homeHeaderToggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    if (options.persist) {
      localStorage.setItem(HOME_DETAILS_MODE_KEY, normalized);
    }
    if (expanded && options.focusStart) {
      const anchor = document.getElementById('home-workspace-start');
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return normalized;
  }

  applyHomeVisualMode(readHomeVisualMode(), { persist: false });
  applyHomeDetailsMode(localStorage.getItem(HOME_DETAILS_MODE_KEY), { persist: false });
  homeVisualFunBtn?.addEventListener('click', () => {
    applyHomeVisualMode('fun', { persist: true });
  });
  homeVisualCalmBtn?.addEventListener('click', () => {
    applyHomeVisualMode('calm', { persist: true });
  });
  homeWorkspaceToggleBtn?.addEventListener('click', () => {
    const expanded = document.body.classList.contains('home-details-expanded');
    applyHomeDetailsMode(expanded ? 'collapsed' : 'expanded', { persist: true, focusStart: !expanded });
  });
  homeHeaderToggleBtn?.addEventListener('click', () => {
    const expanded = document.body.classList.contains('home-details-expanded');
    applyHomeDetailsMode(expanded ? 'collapsed' : 'expanded', { persist: true, focusStart: !expanded });
  });

  if (!overlay || !modal || !summary || !startBtn || !calcBtn || !clearBtn || !result || !goWordQuest || !gradeSelect) {
    return;
  }

  const wordQuestStat = document.getElementById('progress-word-quest');
  const wordQuestDetail = document.getElementById('progress-word-quest-detail');
  const activityLogList = document.getElementById('progress-activity-log');
  const activityLogEmpty = document.getElementById('progress-activity-empty');
  const exportJsonBtn = document.getElementById('progress-export-json');
  const exportCsvBtn = document.getElementById('progress-export-csv');
  const importJsonBtn = document.getElementById('progress-import-json');
  const importFileInput = document.getElementById('progress-import-file');
  const reportStatus = document.getElementById('progress-report-status');
  const learnerActiveSelect = document.getElementById('learner-active-select');
  const learnerActiveMeta = document.getElementById('learner-active-meta');
  const learnerNameInput = document.getElementById('learner-name-input');
  const learnerGradeInput = document.getElementById('learner-grade-input');
  const learnerAddBtn = document.getElementById('learner-add-btn');
  const learnerList = document.getElementById('learner-list');
  const learnerStatus = document.getElementById('learner-status');
  const homeRoleSelect = document.getElementById('home-role-select');
  const homeRoleSignal = document.getElementById('home-role-signal');
  const homeRoleSecurity = document.getElementById('home-role-security');
  const homePinCurrentInput = document.getElementById('home-pin-current');
  const homePinNewInput = document.getElementById('home-pin-new');
  const homePinConfirmInput = document.getElementById('home-pin-confirm');
  const homePinStrictToggle = document.getElementById('home-pin-strict');
  const homePinSaveBtn = document.getElementById('home-pin-save');
  const homePinStrictSaveBtn = document.getElementById('home-pin-strict-save');
  const homePinResetBtn = document.getElementById('home-pin-reset');
  const homePinStatus = document.getElementById('home-pin-status');
  const homeRecoveryPhraseInput = document.getElementById('home-recovery-phrase');
  const homeRecoveryCopyBtn = document.getElementById('home-recovery-copy');
  const homeRecoveryRotateBtn = document.getElementById('home-recovery-rotate');
  const homeRecoveryInput = document.getElementById('home-recovery-input');
  const homeRecoveryApplyBtn = document.getElementById('home-recovery-apply');
  const homeRecoveryStatus = document.getElementById('home-recovery-status');
  const transferCodeInput = document.getElementById('progress-transfer-code');
  const transferGenerateBtn = document.getElementById('progress-transfer-generate');
  const transferApplyBtn = document.getElementById('progress-transfer-apply');
  const transferStatus = document.getElementById('progress-transfer-status');
  const homeRoleSummary = document.getElementById('home-role-summary');
  const homeRoleCards = document.getElementById('home-role-cards');
  const homeRoleActions = document.getElementById('home-role-actions');
  const homeClassBlockGrid = document.getElementById('home-class-block-grid');
  const homeClassBlockStatus = document.getElementById('home-class-block-status');
  let editingLearnerId = '';

  const REPORT_VERSION = 1;
  const HOME_ROLE_KEY = 'cornerstone_home_role_v1';
  const HOME_LAST_ADULT_ROLE_KEY = 'cornerstone_home_role_last_adult_v1';
  const STUDENT_MODE_PIN_DEFAULT = '2468';
  const TRANSFER_CODE_PREFIX = 'CMTSS1:';
  const REPORT_EXACT_KEYS = new Set([
    'cloze_settings',
    'cloze_last_set_v1',
    'comp_progress',
    'comp_filters_v1',
    'fluency_progress',
    'fluency_filters_v1',
    'writing_builder_v1',
    'planit_progress_v2',
    'planit_video_links_v1',
    'planit_reflections_v1',
    'wtw_assessment_records',
    'useTeacherRecordings',
    'hasRecordings',
    'decode_v5_visited',
    'tutorialShown',
    'last_bonus_key',
    'bonus_frequency_migrated',
    'hq_english_voice_notice',
    'hq_voice_notice_shown'
  ]);
  const REPORT_PREFIXES = [
    'decode_',
    'cloze_',
    'comp_',
    'fluency_',
    'writing_',
    'planit_',
    'numsense_',
    'opsbuilder_',
    'wtw_'
  ];

  const HOME_ROLE_LABELS = {
    teacher: 'Teacher',
    admin: 'Administrator',
    dean: 'Dean',
    'learning-support': 'Learning Support Teacher',
    slp: 'Speech and Language Pathologist',
    eal: 'EAL Specialist',
    counselor: 'School Counselor',
    psychologist: 'School Psychologist',
    student: 'Student',
    parent: 'Parent / Caregiver'
  };

  const HOME_ROLE_ALIAS_MAP = {
    teacher: 'teacher',
    classroom: 'teacher',
    admin: 'admin',
    administrator: 'admin',
    leadership: 'admin',
    leader: 'admin',
    dean: 'dean',
    'learning-support': 'learning-support',
    learningsupport: 'learning-support',
    'learning_support': 'learning-support',
    ls: 'learning-support',
    sped: 'learning-support',
    slp: 'slp',
    speech: 'slp',
    eal: 'eal',
    ell: 'eal',
    esl: 'eal',
    counselor: 'counselor',
    counselling: 'counselor',
    'school-counselor': 'counselor',
    psych: 'psychologist',
    psychologist: 'psychologist',
    'school-psychologist': 'psychologist',
    student: 'student',
    learner: 'student',
    pupil: 'student',
    parent: 'parent',
    caregiver: 'parent',
    family: 'parent'
  };

  const HOME_LITERACY_DOMAIN_LABELS = {
    decoding: 'Decoding',
    fluency: 'Fluency & Prosody',
    comprehension: 'Comprehension',
    'written-language': 'Written Language',
    'executive-function': 'SEL / Executive Function',
    general: 'General Literacy'
  };

  const HOME_NUMERACY_DOMAIN_LABELS = {
    'number-sense': 'Number Sense',
    operations: 'Operations',
    'problem-solving': 'Problem Solving',
    fluency: 'Math Fluency',
    'math-language': 'Math Language',
    general: 'General Numeracy'
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function clamp01(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return 0;
    return Math.max(0, Math.min(1, numeric));
  }

  function normalizeRoleId(raw) {
    const key = String(raw || '').trim().toLowerCase();
    if (!key) return '';
    return HOME_ROLE_ALIAS_MAP[key] || '';
  }

  function readPreferredRole() {
    return normalizeRoleId(localStorage.getItem(HOME_ROLE_KEY) || '');
  }

  function writePreferredRole(roleId) {
    const normalized = normalizeRoleId(roleId);
    if (!normalized) return;
    const previous = normalizeRoleId(localStorage.getItem(HOME_ROLE_KEY) || '');
    if (previous === normalized) return;
    if (normalized !== 'student') {
      localStorage.setItem(HOME_LAST_ADULT_ROLE_KEY, normalized);
    } else if (previous && previous !== 'student') {
      localStorage.setItem(HOME_LAST_ADULT_ROLE_KEY, previous);
    }
    localStorage.setItem(HOME_ROLE_KEY, normalized);
    window.dispatchEvent(new CustomEvent('decode:home-role-changed', { detail: { role: normalized } }));
  }

  function roleFromQuery() {
    const params = new URLSearchParams(window.location.search || '');
    return normalizeRoleId(params.get('role'));
  }

  function applyStudentMode(roleId) {
    const normalized = normalizeRoleId(roleId);
    const isStudent = normalized === 'student';
    document.body.classList.toggle('student-mode', isStudent);
    document.body.dataset.rolePathway = normalized || '';
  }

  function updateRoleSelectorStudentLock(isLocked) {
    if (!homeRoleSelect) return;
    Array.from(homeRoleSelect.options || []).forEach((option) => {
      const normalized = normalizeRoleId(option.value);
      option.disabled = !!isLocked && normalized && normalized !== 'student';
    });
  }

  function setPinStatus(message, isError = false) {
    if (!homePinStatus) return;
    homePinStatus.textContent = message || '';
    homePinStatus.classList.toggle('error', !!isError);
    homePinStatus.classList.toggle('success', !isError && !!message);
  }

  function setRecoveryStatus(message, isError = false) {
    if (!homeRecoveryStatus) return;
    homeRecoveryStatus.textContent = message || '';
    homeRecoveryStatus.classList.toggle('error', !!isError);
    homeRecoveryStatus.classList.toggle('success', !isError && !!message);
  }

  function resetPinFormInputs() {
    if (homePinCurrentInput) homePinCurrentInput.value = '';
    if (homePinNewInput) homePinNewInput.value = '';
    if (homePinConfirmInput) homePinConfirmInput.value = '';
  }

  function refreshRecoveryPhraseDisplay() {
    if (!homeRecoveryPhraseInput) return;
    const platform = window.DECODE_PLATFORM;
    const state = platform?.getStudentModeRecoveryState?.();
    const phrase = String(state?.phrase || '').trim();
    homeRecoveryPhraseInput.value = phrase;
  }

  function setTransferStatus(message, isError = false) {
    if (!transferStatus) return;
    transferStatus.textContent = message || '';
    transferStatus.classList.toggle('error', !!isError);
    transferStatus.classList.toggle('success', !isError && !!message);
  }

  function resolvePinState() {
    const fallback = {
      hasCustomPin: false,
      strictMode: false,
      fallbackDefaultEnabled: true,
      defaultPin: STUDENT_MODE_PIN_DEFAULT
    };
    const platform = window.DECODE_PLATFORM;
    const state = platform?.getStudentModePinState?.();
    if (!state || typeof state !== 'object') return fallback;
    return {
      hasCustomPin: !!state.hasCustomPin,
      strictMode: !!state.strictMode,
      fallbackDefaultEnabled: state.fallbackDefaultEnabled !== false,
      defaultPin: String(state.defaultPin || STUDENT_MODE_PIN_DEFAULT)
    };
  }

  function scoreFromEntry(entry) {
    const detail = entry?.detail;
    const correct = Number(detail?.correct);
    const total = Number(detail?.total);
    if (total > 0 && correct >= 0) {
      return clamp01(correct / total);
    }

    const orf = Number(detail?.orf);
    const goal = Number(detail?.goal);
    if (goal > 0 && orf >= 0) {
      return clamp01(orf / goal);
    }

    const ratio = String(entry?.event || '').match(/(\d+)\s*\/\s*(\d+)/);
    if (ratio) {
      const numerator = Number(ratio[1]);
      const denominator = Number(ratio[2]);
      if (denominator > 0) return clamp01(numerator / denominator);
    }

    return null;
  }

  function literacyDomainFromActivity(activityId) {
    const id = String(activityId || '').toLowerCase();
    if (id === 'word-quest') return 'decoding';
    if (id === 'fluency') return 'fluency';
    if (id === 'cloze' || id === 'comprehension') return 'comprehension';
    if (id === 'writing' || id === 'madlibs') return 'written-language';
    if (id === 'plan-it') return 'executive-function';
    return 'general';
  }

  function numeracyDomainFromEntry(entry) {
    const explicit = String(entry?.detail?.domain || '').toLowerCase();
    if (HOME_NUMERACY_DOMAIN_LABELS[explicit]) return explicit;
    const id = String(entry?.activity || '').toLowerCase();
    if (id === 'number-sense') return 'number-sense';
    if (id === 'operations') return 'operations';
    if (id === 'problem-solving') return 'problem-solving';
    if (id === 'fluency') return 'fluency';
    if (id === 'math-language') return 'math-language';
    return 'general';
  }

  function buildDomainSummary(entries, domainResolver, labels) {
    const bucket = {};
    entries.forEach((entry) => {
      const score = scoreFromEntry(entry);
      if (score === null) return;
      const domain = domainResolver(entry);
      if (!bucket[domain]) {
        bucket[domain] = { domain, sum: 0, count: 0 };
      }
      bucket[domain].sum += score;
      bucket[domain].count += 1;
    });

    const ranked = Object.values(bucket)
      .filter((row) => row.count > 0)
      .map((row) => ({
        domain: row.domain,
        avg: row.sum / row.count,
        count: row.count,
        label: labels[row.domain] || row.domain
      }))
      .sort((a, b) => a.avg - b.avg);

    const topGap = ranked[0] || null;
    const topStrength = ranked.length ? ranked[ranked.length - 1] : null;
    return { ranked, topGap, topStrength };
  }

  function buildRoleContext() {
    const placement = load();
    const recommendation = placement?.recommendation || null;
    const literacyLogs = getRecentActivityEntries();
    const numeracyRaw = safeParse(localStorage.getItem('decode_numeracy_log_v1') || '');
    const numeracyLogs = Array.isArray(numeracyRaw) ? numeracyRaw : [];
    const literacySummary = buildDomainSummary(
      literacyLogs,
      (entry) => literacyDomainFromActivity(entry?.activity),
      HOME_LITERACY_DOMAIN_LABELS
    );
    const numeracySummary = buildDomainSummary(
      numeracyLogs,
      numeracyDomainFromEntry,
      HOME_NUMERACY_DOMAIN_LABELS
    );
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const literacyWeek = literacyLogs.filter((entry) => Number(entry?.ts || 0) >= weekAgo).length;
    const numeracyWeek = numeracyLogs.filter((entry) => Number(entry?.ts || 0) >= weekAgo).length;
    const learner = window.DECODE_PLATFORM?.getActiveLearner?.() || null;

    return {
      learner,
      recommendation,
      wordQuestUrl: recommendation ? wordQuestHref(recommendation.focus, recommendation.length) : 'word-quest.html',
      literacyWeek,
      numeracyWeek,
      literacySummary,
      numeracySummary
    };
  }

  function recommendHomeRole(context) {
    const literacyGap = context?.literacySummary?.topGap?.domain || '';
    if (literacyGap === 'executive-function') return 'counselor';
    if (literacyGap === 'fluency') return 'slp';
    if (literacyGap === 'comprehension' || literacyGap === 'written-language') return 'eal';
    if (literacyGap === 'decoding') return 'learning-support';
    if ((context?.literacyWeek || 0) + (context?.numeracyWeek || 0) <= 2) return 'teacher';
    return 'teacher';
  }

  function roleReportHref(roleId, hash = '') {
    const base = `teacher-report.html?role=${encodeURIComponent(roleId)}`;
    return hash ? `${base}${hash}` : base;
  }

  function setHomeClassBlockStatus(message, isError = false) {
    if (!homeClassBlockStatus) return;
    homeClassBlockStatus.textContent = message || '';
    homeClassBlockStatus.classList.toggle('error', !!isError);
    homeClassBlockStatus.classList.toggle('success', !isError && !!message);
  }

  function normalizeLauncherGradeBand(value) {
    const normalized = normalizeGradeBand(value || '');
    if (normalized === 'K-2' || normalized === '3-5' || normalized === '6-8' || normalized === '9-12') {
      return normalized;
    }
    return '3-5';
  }

  function getHomeActivityHref(activityId, options = {}) {
    const fileByActivity = {
      'word-quest': 'word-quest.html',
      cloze: 'cloze.html',
      comprehension: 'comprehension.html',
      fluency: 'fluency.html',
      madlibs: 'madlibs.html',
      writing: 'writing.html',
      'plan-it': 'plan-it.html',
      'number-sense': 'number-sense.html',
      operations: 'operations.html',
      'problem-solving': 'number-sense.html',
      'math-language': 'number-sense.html',
      'teacher-report': 'teacher-report.html'
    };
    const file = fileByActivity[activityId] || 'index.html';
    const url = new URL(file, window.location.href);
    if (activityId === 'word-quest') {
      const focus = options.wordQuestFocus || 'all';
      const length = options.wordQuestLength || 'any';
      if (focus) url.searchParams.set('focus', focus);
      if (length) url.searchParams.set('len', length);
    }
    if (activityId === 'number-sense' || activityId === 'problem-solving' || activityId === 'math-language') {
      const domain = activityId === 'problem-solving'
        ? 'problem-solving'
        : activityId === 'math-language'
          ? 'math-language'
          : 'number-sense';
      url.searchParams.set('domain', domain);
      if (options.gradeBand) url.searchParams.set('gradeBand', options.gradeBand);
    }
    if (activityId === 'teacher-report' && options.roleId) {
      url.searchParams.set('role', options.roleId);
    }
    return url.toString();
  }

  function renderHomeClassBlockLauncher(roleId, context = {}) {
    if (!homeClassBlockGrid) return;
    const classBlocks = window.CORNERSTONE_CLASS_BLOCKS;
    if (!classBlocks?.buildPlansForRole) {
      homeClassBlockGrid.innerHTML = '<div class="muted">Class Block Launcher is unavailable. Reload the page to restore launcher presets.</div>';
      setHomeClassBlockStatus('Launcher presets unavailable.', true);
      return;
    }

    const normalizedRole = classBlocks.normalizeRole(roleId || 'teacher');
    const gradeBand = normalizeLauncherGradeBand(context?.learner?.gradeBand || '');
    const placement = context?.recommendation || {};
    const plans = classBlocks.buildPlansForRole({ roleId: normalizedRole, gradeBand });
    const cardsHtml = plans.map((plan) => {
      const launchStep = plan.launchStep || plan.steps[0] || null;
      const launchHref = launchStep
        ? getHomeActivityHref(launchStep.activity, {
          wordQuestFocus: placement.focus || 'all',
          wordQuestLength: placement.length || 'any',
          gradeBand,
          roleId: normalizedRole
        })
        : '#';
      const stepsHtml = plan.steps
        .map((step) => `<li>${escapeHtml(step.activityLabel)} · ${escapeHtml(String(step.minutes))} min</li>`)
        .join('');
      return `
        <article class="home-class-block-card">
          <div class="home-class-block-head">
            <div class="home-class-block-title">${escapeHtml(plan.title)}</div>
            <div class="home-class-block-meta">${escapeHtml(gradeBand)}</div>
          </div>
          <div class="home-class-block-summary">${escapeHtml(plan.summary)}</div>
          <ul class="home-class-block-steps">${stepsHtml}</ul>
          <a
            class="home-cta primary home-class-block-launch"
            href="${escapeHtml(launchHref)}"
            data-source="home"
            data-role-id="${escapeHtml(normalizedRole)}"
            data-track="${escapeHtml(plan.track)}"
            data-grade-band="${escapeHtml(gradeBand)}"
            data-block-id="${escapeHtml(plan.id)}"
            data-block-title="${escapeHtml(plan.title)}"
            data-minutes="${escapeHtml(String(plan.minutes))}"
            data-launch-activity="${escapeHtml(launchStep?.activity || '')}"
            data-step-count="${escapeHtml(String(plan.steps.length || 0))}"
            data-note="${escapeHtml(plan.summary)}"
          >
            Launch ${escapeHtml(String(plan.minutes))}-minute block
          </a>
        </article>
      `;
    }).join('');
    homeClassBlockGrid.innerHTML = cardsHtml;
    setHomeClassBlockStatus(`Launcher ready for ${classBlocks.roleLabel(normalizedRole)} (${gradeBand}).`);
  }

  function logClassBlockLaunchFromElement(element) {
    const classBlocks = window.CORNERSTONE_CLASS_BLOCKS;
    if (!classBlocks?.appendLaunchLog) return;
    const minutes = Number(element.getAttribute('data-minutes') || 20);
    const roleId = String(element.getAttribute('data-role-id') || 'teacher');
    const roleLabel = classBlocks.roleLabel(roleId);
    classBlocks.appendLaunchLog({
      source: String(element.getAttribute('data-source') || 'home'),
      roleId,
      track: String(element.getAttribute('data-track') || 'integrated'),
      gradeBand: String(element.getAttribute('data-grade-band') || '3-5'),
      minutes,
      blockId: String(element.getAttribute('data-block-id') || ''),
      blockTitle: String(element.getAttribute('data-block-title') || ''),
      launchActivity: String(element.getAttribute('data-launch-activity') || ''),
      stepCount: Number(element.getAttribute('data-step-count') || 0),
      note: String(element.getAttribute('data-note') || '')
    });
    setHomeClassBlockStatus(`Logged launch: ${minutes}-minute block (${roleLabel}).`);
  }

  function buildRoleModel(roleId, context) {
    const learnerLabel = context?.learner?.name || 'Current learner';
    const literacyGap = context?.literacySummary?.topGap?.label || 'Gather more literacy evidence';
    const numeracyGap = context?.numeracySummary?.topGap?.label || 'Gather more numeracy evidence';
    const literacyStrength = context?.literacySummary?.topStrength?.label || 'No confirmed literacy strength yet';
    const numeracyStrength = context?.numeracySummary?.topStrength?.label || 'No confirmed numeracy strength yet';
    const weeklyLine = `${context?.literacyWeek || 0} literacy sessions · ${context?.numeracyWeek || 0} numeracy sessions in the last 7 days`;

    const models = {
      teacher: {
        label: 'Teacher',
        tagline: 'Clear pathways from a strong base.',
        mission: `Keep Tier 1 strong while targeting the highest-need skill gaps for ${learnerLabel}.`,
        cards: [
          { title: 'Primary Lens', body: `Top literacy gap: ${literacyGap}. Top numeracy gap: ${numeracyGap}.` },
          { title: 'What To Protect', body: `Maintain core access while extending strengths (${literacyStrength}; ${numeracyStrength}).` },
          { title: 'Evidence Check', body: weeklyLine }
        ],
        actions: [
          { label: 'Open Teacher Report', href: roleReportHref('teacher', '#report-role-pathway'), kind: 'primary' },
          { label: 'Run Word Quest', href: context.wordQuestUrl, kind: 'ghost' },
          { label: 'Run Number Sense', href: 'number-sense.html', kind: 'ghost' }
        ]
      },
      admin: {
        label: 'Administrator',
        tagline: 'Building Tier 1. Strengthening Tier 2. Supporting Tier 3.',
        mission: 'Monitor implementation quality, evidence confidence, and support-intensity fit across teams.',
        cards: [
          { title: 'System Priority', body: `Current risk concentration: ${literacyGap} (literacy) and ${numeracyGap} (numeracy).` },
          { title: 'Momentum Signal', body: weeklyLine },
          { title: 'Decision Lens', body: 'Use timeline + outcomes to verify that staffing decisions follow data.' }
        ],
        actions: [
          { label: 'Open Leadership View', href: roleReportHref('admin', '#report-outcomes'), kind: 'primary' },
          { label: 'Review Timeline', href: roleReportHref('admin', '#report-intervention-timeline'), kind: 'ghost' },
          { label: 'Review Alignment', href: roleReportHref('admin', '#report-framework-crosswalk'), kind: 'ghost' }
        ]
      },
      dean: {
        label: 'Dean',
        tagline: 'Building Tier 1. Strengthening Tier 2. Supporting Tier 3.',
        mission: 'Coordinate classroom + specialist execution so supports stay coherent and measurable.',
        cards: [
          { title: 'Team Priority', body: `Highest current focus areas: ${literacyGap} and ${numeracyGap}.` },
          { title: 'Handoff Quality', body: 'Set weekly owners and deadlines for each red-lane action.' },
          { title: 'Evidence Check', body: weeklyLine }
        ],
        actions: [
          { label: 'Open Dean Workflow', href: roleReportHref('dean', '#report-role-pathway'), kind: 'primary' },
          { label: 'Plan-It Coordination', href: 'plan-it.html', kind: 'ghost' },
          { label: 'Review Timeline', href: roleReportHref('dean', '#report-intervention-timeline'), kind: 'ghost' }
        ]
      },
      'learning-support': {
        label: 'Learning Support Teacher',
        tagline: 'From solid ground to open access.',
        mission: 'Tighten intervention cycles with explicit teaching, guided transfer, and documentation fidelity.',
        cards: [
          { title: 'Intervention Target', body: `Priority targets: ${literacyGap} and ${numeracyGap}.` },
          { title: 'Strength Leverage', body: `Use strengths to build transfer (${literacyStrength}; ${numeracyStrength}).` },
          { title: 'Evidence Check', body: weeklyLine }
        ],
        actions: [
          { label: 'Open LS Dashboard', href: roleReportHref('learning-support', '#report-iesp-output'), kind: 'primary' },
          { label: 'Target Word Quest', href: context.wordQuestUrl, kind: 'ghost' },
          { label: 'Open Intervention Timeline', href: roleReportHref('learning-support', '#report-intervention-timeline'), kind: 'ghost' }
        ]
      },
      slp: {
        label: 'Speech and Language Pathologist',
        tagline: 'From solid ground to open access.',
        mission: 'Connect articulation/phonology and prosody goals to reading and expressive language transfer.',
        cards: [
          { title: 'Speech-Literacy Focus', body: `Current language-linked gap: ${literacyGap}.` },
          { title: 'Transfer Anchor', body: `Use oral rehearsal to support ${numeracyGap} explanations in math language.` },
          { title: 'Evidence Check', body: weeklyLine }
        ],
        actions: [
          { label: 'Open SLP Pathway', href: roleReportHref('slp', '#report-role-pathway'), kind: 'primary' },
          { label: 'Run Speed Sprint', href: 'fluency.html', kind: 'ghost' },
          { label: 'Open Goal Drafts', href: roleReportHref('slp', '#report-goal-output'), kind: 'ghost' }
        ]
      },
      eal: {
        label: 'EAL Specialist',
        tagline: 'From solid ground to open access.',
        mission: 'Support language access without reducing rigor through vocabulary, syntax, and discourse scaffolds.',
        cards: [
          { title: 'Language Access Target', body: `Highest language-heavy needs: ${literacyGap} and ${numeracyGap}.` },
          { title: 'Bridge To Classroom', body: 'Pair sentence frames with evidence responses in reading and math.' },
          { title: 'Evidence Check', body: weeklyLine }
        ],
        actions: [
          { label: 'Open EAL Pathway', href: roleReportHref('eal', '#report-role-pathway'), kind: 'primary' },
          { label: 'Run Read & Think', href: 'comprehension.html', kind: 'ghost' },
          { label: 'Run Story Fill', href: 'cloze.html', kind: 'ghost' }
        ]
      },
      counselor: {
        label: 'School Counselor',
        tagline: 'From solid ground to open access.',
        mission: 'Build self-management, persistence, and reflection language during academic tasks.',
        cards: [
          { title: 'SEL/EF Priority', body: `Current regulation/EF pressure point: ${literacyGap}.` },
          { title: 'Student Voice', body: 'Use quick reflection routines to capture thoughts, emotions, actions, and next step.' },
          { title: 'Evidence Check', body: weeklyLine }
        ],
        actions: [
          { label: 'Open Counselor Pathway', href: roleReportHref('counselor', '#report-role-pathway'), kind: 'primary' },
          { label: 'Run Plan-It', href: 'plan-it.html', kind: 'ghost' },
          { label: 'Open Parent Partnership', href: roleReportHref('counselor', '#report-parent-communication'), kind: 'ghost' }
        ]
      },
      psychologist: {
        label: 'School Psychologist',
        tagline: 'From solid ground to open access.',
        mission: 'Triangulate classroom/intervention evidence to guide referral confidence and next diagnostic steps.',
        cards: [
          { title: 'Assessment Lens', body: `Converging concern areas: ${literacyGap} and ${numeracyGap}.` },
          { title: 'Risk Framing', body: 'Separate skill deficit from language load and performance variability.' },
          { title: 'Evidence Check', body: weeklyLine }
        ],
        actions: [
          { label: 'Open Psych Workflow', href: roleReportHref('psychologist', '#report-role-pathway'), kind: 'primary' },
          { label: 'Review Numeracy Intake', href: roleReportHref('psychologist', '#report-numeracy-import-preview'), kind: 'ghost' },
          { label: 'Open IESP Draft', href: roleReportHref('psychologist', '#report-iesp-output'), kind: 'ghost' }
        ]
      },
      student: {
        label: 'Student',
        tagline: 'Strong foundations across every tier.',
        mission: `Know your next step, practice with focus, and track your wins for ${learnerLabel}.`,
        cards: [
          { title: 'My Next Literacy Goal', body: `Focus today: ${literacyGap}.` },
          { title: 'My Next Math Goal', body: `Focus today: ${numeracyGap}.` },
          { title: 'My Strengths', body: `You are already showing strength in ${literacyStrength} and ${numeracyStrength}.` }
        ],
        actions: [
          { label: 'Start Word Quest', href: context.wordQuestUrl, kind: 'primary' },
          { label: 'Start Number Sense', href: 'number-sense.html', kind: 'ghost' },
          { label: 'Build Confidence (Plan-It)', href: 'plan-it.html', kind: 'ghost' }
        ]
      },
      parent: {
        label: 'Parent / Caregiver',
        tagline: 'Every learner supported, every step of the way.',
        mission: `Support ${learnerLabel} with simple, consistent home routines aligned to school goals.`,
        cards: [
          { title: 'Current School Focus', body: `Reading: ${literacyGap}. Math: ${numeracyGap}.` },
          { title: 'What Is Going Well', body: `Current strengths: ${literacyStrength}; ${numeracyStrength}.` },
          { title: 'Home Routine Cue', body: '5-10 minutes daily: one reading strategy + one conceptual math strategy.' }
        ],
        actions: [
          { label: 'Open Parent Pathway', href: roleReportHref('parent', '#report-parent-communication'), kind: 'primary' },
          { label: 'View Family Summary', href: roleReportHref('parent', '#report-share-summary'), kind: 'ghost' },
          { label: 'Open Home Practice Activities', href: context.wordQuestUrl, kind: 'ghost' }
        ]
      }
    };

    return models[roleId] || models.teacher;
  }

  function syncRoleStarter(roleId, model) {
    const normalizedRole = normalizeRoleId(roleId) || 'teacher';
    homeRolePickButtons.forEach((button) => {
      const targetRole = normalizeRoleId(button.dataset.roleTarget || '');
      button.classList.toggle('active', targetRole === normalizedRole);
      button.setAttribute('aria-pressed', targetRole === normalizedRole ? 'true' : 'false');
    });

    const primaryAction = model?.actions?.[0] || null;
    if (homeRoleLaunchBtn) {
      homeRoleLaunchBtn.href = primaryAction?.href || 'word-quest.html';
      homeRoleLaunchBtn.textContent = primaryAction?.label || 'Start My Pathway';
    }

    if (homeRolePreviewEl) {
      const previewLine = model?.cards?.[0]?.body || model?.mission || 'Role guidance will appear here.';
      homeRolePreviewEl.textContent = `${model?.label || 'Role'}: ${previewLine}`;
    }
  }

  function renderRoleDashboard() {
    if (!homeRoleSelect || !homeRoleSignal || !homeRoleSummary || !homeRoleCards || !homeRoleActions) return;

    const context = buildRoleContext();
    const queryRole = roleFromQuery();
    const storedRole = readPreferredRole();
    const fallbackRole = recommendHomeRole(context);
    const requestedRole = normalizeRoleId(homeRoleSelect.value)
      || queryRole
      || storedRole
      || fallbackRole;
    let selectedRole = requestedRole;

    if (storedRole === 'student' && selectedRole !== 'student') {
      selectedRole = 'student';
    }

    if (!homeRoleSelect.value || normalizeRoleId(homeRoleSelect.value) !== selectedRole) {
      homeRoleSelect.value = selectedRole;
    }
    updateRoleSelectorStudentLock(selectedRole === 'student');
    applyStudentMode(selectedRole);
    writePreferredRole(selectedRole);

    const pinState = resolvePinState();
    refreshRecoveryPhraseDisplay();
    if (homePinStrictToggle) {
      homePinStrictToggle.checked = !!pinState.strictMode;
      homePinStrictToggle.disabled = !pinState.hasCustomPin;
    }
    if (homePinStrictSaveBtn) {
      homePinStrictSaveBtn.disabled = !pinState.hasCustomPin;
    }

    if (homeRoleSecurity) {
      const pinModeLine = pinState.hasCustomPin
        ? (pinState.fallbackDefaultEnabled
          ? `Custom PIN enabled (fallback default ${pinState.defaultPin} still works).`
          : 'Custom PIN enabled (strict mode: default fallback disabled).')
        : `Using default PIN ${pinState.defaultPin}.`;
      homeRoleSecurity.textContent = selectedRole === 'student'
        ? `Student Mode is active. Adults in any role can use "Adult Exit" in the top bar. ${pinModeLine} Recovery phrase can also unlock.`
        : `Student Mode security (all adult roles): ${pinModeLine} Keep your recovery phrase in a safe place.`;
    }

    const model = buildRoleModel(selectedRole, context);
    const evidenceText = `${context.literacyWeek} literacy + ${context.numeracyWeek} numeracy sessions this week`;
    syncRoleStarter(selectedRole, model);

    homeRoleSignal.innerHTML = `
      <span class="home-role-chip">${escapeHtml(model.label)}</span>
      <span class="home-role-chip subtle">${escapeHtml(evidenceText)}</span>
    `;

    homeRoleSummary.innerHTML = `
      <div class="home-role-title">${escapeHtml(model.tagline)}</div>
      <div class="home-role-mission">${escapeHtml(model.mission)}</div>
    `;

    homeRoleCards.innerHTML = (model.cards || [])
      .map((card) => `
        <article class="home-role-card">
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `)
      .join('');

    homeRoleActions.innerHTML = (model.actions || [])
      .map((action) => `
        <a class="home-cta ${action.kind === 'primary' ? 'primary' : 'ghost'}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>
      `)
      .join('');

    renderHomeClassBlockLauncher(selectedRole, context);
  }

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function setReportStatus(message, isError = false) {
    if (!reportStatus) return;
    reportStatus.textContent = message || '';
    reportStatus.classList.toggle('error', !!isError);
    reportStatus.classList.toggle('success', !isError && !!message);
  }

  function setLearnerStatus(message, isError = false) {
    if (!learnerStatus) return;
    learnerStatus.textContent = message || '';
    learnerStatus.classList.toggle('error', !!isError);
    learnerStatus.classList.toggle('success', !isError && !!message);
  }

  function isReportStorageKey(key) {
    return REPORT_EXACT_KEYS.has(key) || REPORT_PREFIXES.some((prefix) => key.startsWith(prefix));
  }

  function buildReportSnapshot() {
    const platform = window.DECODE_PLATFORM;
    const data = platform?.getLearnerDataSnapshot?.() || {};
    const learner = platform?.getActiveLearner?.() || null;

    return {
      version: REPORT_VERSION,
      format: 'decode-progress-report',
      exportedAt: new Date().toISOString(),
      learner,
      data
    };
  }

  function downloadBlob(text, filename, mimeType) {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function formatDateSlug(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function escapeCsvCell(value) {
    const raw = String(value ?? '');
    if (!/[",\n]/.test(raw)) return raw;
    return `"${raw.replace(/"/g, '""')}"`;
  }

  function getRecentActivityEntries() {
    const log = safeParse(localStorage.getItem('decode_activity_log_v1') || '');
    return Array.isArray(log) ? log : [];
  }

  function handleExportJson() {
    const snapshot = buildReportSnapshot();
    const keyCount = Object.keys(snapshot.data).length;
    const filename = `cornerstone-mtss-report-${formatDateSlug(new Date())}.json`;
    downloadBlob(JSON.stringify(snapshot, null, 2), filename, 'application/json;charset=utf-8');
    setReportStatus(`Exported ${keyCount} data keys to ${filename}.`);
  }

  function handleExportCsv() {
    const entries = getRecentActivityEntries();
    if (!entries.length) {
      setReportStatus('No activity log data to export yet.', true);
      return;
    }

    const header = [
      'timestamp_iso',
      'activity',
      'event',
      'score',
      'coins',
      'streak',
      'focus',
      'details'
    ];
    const rows = entries.map((entry) => {
      const details = entry && typeof entry === 'object'
        ? JSON.stringify(entry)
        : '';
      return [
        entry?.ts ? new Date(entry.ts).toISOString() : '',
        entry?.label || entry?.activityLabel || entry?.activity || '',
        entry?.event || entry?.action || entry?.message || '',
        entry?.score ?? '',
        entry?.coins ?? '',
        entry?.streak ?? '',
        entry?.focus ?? '',
        details
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\n');

    const filename = `cornerstone-mtss-activity-${formatDateSlug(new Date())}.csv`;
    downloadBlob(csv, filename, 'text/csv;charset=utf-8');
    setReportStatus(`Exported ${rows.length} activity rows to ${filename}.`);
  }

  function extractImportPairs(raw) {
    const parsed = safeParse(raw);
    if (!parsed || typeof parsed !== 'object') return [];
    const source = parsed.data && typeof parsed.data === 'object'
      ? parsed.data
      : parsed;
    return Object.entries(source).filter(([key, value]) => (
      typeof key === 'string' && typeof value === 'string' && isReportStorageKey(key)
    ));
  }

  function refreshAfterImport() {
    const settings = safeParse(localStorage.getItem(SETTINGS_KEY) || '');
    if (settings?.uiLook) {
      applyLookClass(settings.uiLook);
    }
    renderSummary(load());
    renderProgress();
    renderLearners();
  }

  function commitImportPairs(pairs = []) {
    const platform = window.DECODE_PLATFORM;
    if (platform?.importLearnerDataSnapshot) {
      const payload = {};
      pairs.forEach(([key, value]) => {
        payload[key] = value;
      });
      platform.importLearnerDataSnapshot(payload);
    } else {
      pairs.forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }
    refreshAfterImport();
    return pairs.length;
  }

  function utf8ToBase64(text) {
    const input = String(text || '');
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToUtf8(value) {
    const encoded = String(value || '').trim();
    if (!encoded) return '';
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function handleGenerateTransferCode() {
    if (!transferCodeInput) return;
    try {
      const snapshot = buildReportSnapshot();
      const payload = {
        version: REPORT_VERSION,
        format: 'cornerstone-transfer',
        exportedAt: new Date().toISOString(),
        learner: snapshot.learner || null,
        data: snapshot.data || {}
      };
      const encoded = utf8ToBase64(JSON.stringify(payload));
      const transferCode = `${TRANSFER_CODE_PREFIX}${encoded}`;
      transferCodeInput.value = transferCode;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(transferCode)
          .then(() => setTransferStatus('Transfer code generated and copied. It includes learners, settings, activity logs, and report data.'))
          .catch(() => setTransferStatus('Transfer code generated. Clipboard blocked, so copy from the box.'));
      } else {
        setTransferStatus('Transfer code generated. Copy from the box, then paste on another device.');
      }
    } catch {
      setTransferStatus('Could not generate transfer code.', true);
    }
  }

  function handleApplyTransferCode() {
    const rawInput = String(transferCodeInput?.value || '').trim();
    if (!rawInput) {
      setTransferStatus('Paste a transfer code first.', true);
      return;
    }

    let rawPayloadText = '';
    try {
      if (rawInput.startsWith('{')) {
        rawPayloadText = rawInput;
      } else {
        const compact = rawInput.replace(/\s+/g, '');
        const encoded = compact.startsWith(TRANSFER_CODE_PREFIX)
          ? compact.slice(TRANSFER_CODE_PREFIX.length)
          : compact;
        rawPayloadText = base64ToUtf8(encoded);
      }
    } catch {
      setTransferStatus('Transfer code is invalid or corrupted.', true);
      return;
    }

    const pairs = extractImportPairs(rawPayloadText);
    if (!pairs.length) {
      setTransferStatus('Transfer code did not contain supported Cornerstone data keys.', true);
      return;
    }

    const shouldApply = window.confirm('Apply transfer code now? This updates matching local data on this device and can overwrite current values.');
    if (!shouldApply) {
      setTransferStatus('Transfer apply cancelled.');
      return;
    }

    const count = commitImportPairs(pairs);
    setTransferStatus(`Applied transfer code and imported ${count} data keys. Refresh if role/dashboard does not update immediately.`);
    setReportStatus(`Imported ${count} data keys from transfer code.`);
  }

  function handleImportFile(file) {
    if (!file) return;
    file.text()
      .then((raw) => {
        const pairs = extractImportPairs(raw);
        if (!pairs.length) {
          setReportStatus('Import failed: file did not contain supported Cornerstone data keys.', true);
          return;
        }
        const count = commitImportPairs(pairs);
        setReportStatus(`Imported ${count} data keys from ${file.name}.`);
      })
      .catch(() => {
        setReportStatus('Import failed: unable to read the selected file.', true);
      });
  }

  function formatLearnerMeta(learner) {
    if (!learner) return 'No active learner selected.';
    const gradeBand = normalizeGradeBand(learner.gradeBand || '') || 'Not set';
    return `Grade band: ${gradeBand}`;
  }

  function buildGradeBandSelect(select, selectedValue = '') {
    if (!select) return;
    const normalized = normalizeGradeBand(selectedValue || '');
    select.innerHTML = `
      <option value="">Choose…</option>
      <option value="K-2">K–2</option>
      <option value="3-5">3–5</option>
      <option value="6-8">6–8</option>
      <option value="9-12">9–12</option>
    `;
    select.value = normalized;
  }

  function switchLearner(id) {
    const platform = window.DECODE_PLATFORM;
    if (!platform?.setActiveLearner) return;
    const changed = platform.getActiveLearnerId?.() !== id;
    const ok = platform.setActiveLearner(id, { reload: false });
    if (!ok) {
      setLearnerStatus('Could not switch learner.', true);
      return;
    }
    platform.refreshLearnerSwitchers?.();
    const settings = safeParse(localStorage.getItem(SETTINGS_KEY) || '');
    if (settings?.uiLook) applyLookClass(settings.uiLook);
    editingLearnerId = '';
    renderSummary(load());
    renderProgress();
    renderLearners();
    if (changed) {
      setLearnerStatus('Switched active learner.');
    }
  }

  function renderLearners() {
    const platform = window.DECODE_PLATFORM;
    if (!platform?.getLearners || !platform?.getActiveLearner) return;

    const learners = platform.getLearners();
    const active = platform.getActiveLearner();

    if (learnerActiveSelect) {
      learnerActiveSelect.innerHTML = '';
      learners.forEach((learner) => {
        const option = document.createElement('option');
        option.value = learner.id;
        option.textContent = learner.name;
        learnerActiveSelect.appendChild(option);
      });
      if (active?.id) learnerActiveSelect.value = active.id;
    }

    if (learnerActiveMeta) {
      learnerActiveMeta.textContent = formatLearnerMeta(active);
    }

    if (learnerList) {
      learnerList.innerHTML = '';
      learners.forEach((learner) => {
        const li = document.createElement('li');
        li.className = 'home-learner-item';
        li.dataset.learnerId = learner.id;
        const isEditing = editingLearnerId === learner.id;
        const gradeBand = normalizeGradeBand(learner.gradeBand || '') || '—';

        const copy = document.createElement('div');
        copy.className = 'home-learner-copy';
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = learner.name;
        const gradeSpan = document.createElement('span');
        gradeSpan.className = 'muted';
        gradeSpan.textContent = `Grade: ${gradeBand}`;
        copy.appendChild(nameStrong);
        copy.appendChild(gradeSpan);

        const actions = document.createElement('div');
        actions.className = 'home-learner-actions';

        const switchBtn = document.createElement('button');
        switchBtn.className = 'secondary-btn';
        switchBtn.type = 'button';
        switchBtn.dataset.action = 'switch';
        switchBtn.dataset.id = learner.id;
        switchBtn.textContent = 'Switch';
        if (active?.id === learner.id) switchBtn.disabled = true;

        const editBtn = document.createElement('button');
        editBtn.className = 'secondary-btn';
        editBtn.type = 'button';
        editBtn.dataset.action = 'edit';
        editBtn.dataset.id = learner.id;
        editBtn.textContent = 'Edit';
        if (isEditing) editBtn.disabled = true;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'secondary-btn';
        removeBtn.type = 'button';
        removeBtn.dataset.action = 'remove';
        removeBtn.dataset.id = learner.id;
        removeBtn.textContent = 'Remove';
        if (learners.length <= 1) removeBtn.disabled = true;

        actions.appendChild(switchBtn);
        actions.appendChild(editBtn);
        actions.appendChild(removeBtn);
        li.appendChild(copy);
        li.appendChild(actions);

        if (isEditing) {
          const editor = document.createElement('div');
          editor.className = 'home-learner-editor';

          const grid = document.createElement('div');
          grid.className = 'home-learner-edit-grid';

          const nameField = document.createElement('label');
          nameField.className = 'home-field-label';
          nameField.textContent = 'Name';
          const editNameInput = document.createElement('input');
          editNameInput.className = 'home-input';
          editNameInput.type = 'text';
          editNameInput.value = learner.name || '';
          editNameInput.dataset.role = 'edit-name';

          const gradeField = document.createElement('label');
          gradeField.className = 'home-field-label';
          gradeField.textContent = 'Grade band';
          const editGradeSelect = document.createElement('select');
          editGradeSelect.className = 'home-select';
          editGradeSelect.dataset.role = 'edit-grade';
          buildGradeBandSelect(editGradeSelect, learner.gradeBand || '');

          const nameWrap = document.createElement('div');
          nameWrap.appendChild(nameField);
          nameWrap.appendChild(editNameInput);

          const gradeWrap = document.createElement('div');
          gradeWrap.appendChild(gradeField);
          gradeWrap.appendChild(editGradeSelect);

          grid.appendChild(nameWrap);
          grid.appendChild(gradeWrap);

          const editorActions = document.createElement('div');
          editorActions.className = 'home-learner-editor-actions';

          const saveBtn = document.createElement('button');
          saveBtn.className = 'primary-btn';
          saveBtn.type = 'button';
          saveBtn.dataset.action = 'save-edit';
          saveBtn.dataset.id = learner.id;
          saveBtn.textContent = 'Save';

          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'secondary-btn';
          cancelBtn.type = 'button';
          cancelBtn.dataset.action = 'cancel-edit';
          cancelBtn.dataset.id = learner.id;
          cancelBtn.textContent = 'Cancel';

          editorActions.appendChild(saveBtn);
          editorActions.appendChild(cancelBtn);

          editor.appendChild(grid);
          editor.appendChild(editorActions);
          li.appendChild(editor);
        }

        learnerList.appendChild(li);
      });
    }
  }

  function normalizeGradeBand(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw === 'k2' || raw.toLowerCase() === 'k-2') return 'K-2';
    if (raw === '35' || raw === '3-5') return '3-5';
    if (raw === '68' || raw === '6-8') return '6-8';
    if (raw === '912' || raw === '9-12') return '9-12';
    if (raw === '612' || raw === '6-12') return '6-8';
    return raw;
  }

  function gradeBandToLook(band) {
    const normalized = normalizeGradeBand(band);
    if (normalized === 'K-2') return 'k2';
    if (normalized === '3-5') return '35';
    if (normalized === '6-8' || normalized === '9-12') return '612';
    return '';
  }

  function applyLookClass(look) {
    const body = document.body;
    if (!body) return;
    body.classList.remove('look-k2', 'look-35', 'look-612');
    body.classList.add(look === 'k2' ? 'look-k2' : look === '612' ? 'look-612' : 'look-35');
  }

  function syncProfileAndLook(gradeBand) {
    const normalized = normalizeGradeBand(gradeBand);
    if (!normalized) return;

    const platform = window.DECODE_PLATFORM;

    try {
      platform?.setProfile?.({ gradeBand: normalized });
    } catch {}

    const look = gradeBandToLook(normalized);
    if (!look) return;

    if (platform?.setSettings) {
      platform.setSettings({ uiLook: look }, { emit: true });
    } else {
      const existing = safeParse(localStorage.getItem(SETTINGS_KEY) || '') || {};
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, uiLook: look }));
    }
    applyLookClass(look);
  }

  function getSkillState() {
    return {
      letterSounds: !!skillEls.letterSounds?.checked,
      cvc: !!skillEls.cvc?.checked,
      digraph: !!skillEls.digraph?.checked,
      blends: !!skillEls.blends?.checked,
      magicE: !!skillEls.magicE?.checked,
      vowelTeam: !!skillEls.vowelTeam?.checked,
      rControlled: !!skillEls.rControlled?.checked,
      multisyllable: !!skillEls.multisyllable?.checked
    };
  }

  function computeRecommendation(skills) {
    if (!skills.letterSounds) {
      return {
        focus: 'cvc',
        length: '3',
        headline: 'Start with sound-letter connections + 3-letter words.',
        notes: 'Tip: open Sound Lab in Word Quest (Tools ▾) and practice short vowels + consonants.'
      };
    }
    if (!skills.cvc) {
      return {
        focus: 'cvc',
        length: '3',
        headline: 'Start with CVC short vowels.',
        notes: 'Keep words short and repeat patterns daily.'
      };
    }
    if (!skills.digraph) {
      return {
        focus: 'digraph',
        length: '4',
        headline: 'Next focus: digraphs (sh/ch/th).',
        notes: 'Practice the digraph sound, then read words with that pattern.'
      };
    }
    if (!skills.blends) {
      return {
        focus: 'ccvc',
        length: '4',
        headline: 'Next focus: blends (st/bl/cr).',
        notes: 'Start with initial blends (CCVC), then move to final blends (CVCC).'
      };
    }
    if (!skills.magicE) {
      return {
        focus: 'cvce',
        length: '4',
        headline: 'Next focus: silent‑e (CVCe).',
        notes: 'Contrast pairs help: cap → cape, kit → kite.'
      };
    }
    if (!skills.vowelTeam) {
      return {
        focus: 'vowel_team',
        length: '5',
        headline: 'Next focus: vowel teams.',
        notes: 'Try one team per day (ai, ee, oa…).'
      };
    }
    if (!skills.rControlled) {
      return {
        focus: 'r_controlled',
        length: '5',
        headline: 'Next focus: r‑controlled vowels.',
        notes: 'Group by sound (ar / er / or) to reduce confusion.'
      };
    }
    if (!skills.multisyllable) {
      return {
        focus: 'multisyllable',
        length: 'any',
        headline: 'Next focus: multisyllable words.',
        notes: 'Teach “chunking”: syllables, prefixes/suffixes, and known patterns.'
      };
    }
    return {
      focus: 'multisyllable',
      length: 'any',
      headline: 'You can start with multisyllable practice.',
      notes: 'Mix in prefixes/suffixes and vocabulary work.'
    };
  }

  function wordQuestHref(focus, length) {
    const url = new URL('word-quest.html', window.location.href);
    if (focus) url.searchParams.set('focus', focus);
    if (length) url.searchParams.set('len', length);
    return url.toString();
  }

  function openModal() {
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    modal.classList.remove('hidden');
    modal.dataset.open = 'true';
  }

  function closeModal() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    modal.classList.add('hidden');
    delete modal.dataset.open;
  }

  function renderSummary(data) {
    if (!summary) return;

    if (!data || !data.recommendation) {
      summary.innerHTML = `
        <div class="home-mini-title">Current recommendation</div>
        <div class="muted">Not set yet. Run the screener to get a starting focus.</div>
      `;
      if (openWordQuest) openWordQuest.href = 'word-quest.html';
      return;
    }

    const rec = data.recommendation;
    const updated = data.updatedAt ? new Date(data.updatedAt) : null;
    const updatedText = updated && !Number.isNaN(updated.getTime())
      ? updated.toLocaleDateString()
      : '—';

    const focusLabel = rec.focus === 'vowel_team'
      ? 'Vowel Teams'
      : rec.focus === 'r_controlled'
        ? 'R-Controlled'
        : rec.focus === 'cvce'
          ? 'Silent‑e (CVCe)'
          : rec.focus === 'ccvc'
            ? 'Blends (CCVC)'
            : rec.focus === 'digraph'
              ? 'Digraphs'
              : rec.focus === 'cvc'
                ? 'CVC'
                : rec.focus === 'multisyllable'
                  ? 'Multisyllable'
                  : 'All Words';

    summary.innerHTML = `
      <div class="home-mini-title">Current recommendation</div>
      <div class="home-placement-line"><strong>${focusLabel}</strong> · length <strong>${rec.length}</strong> · updated <strong>${updatedText}</strong></div>
      <div class="muted">${rec.headline || ''}</div>
    `;

    const href = wordQuestHref(rec.focus, rec.length);
    goWordQuest.href = href;
    openWordQuest.href = href;
  }

  function store(data) {
    localStorage.setItem(PLACEMENT_KEY, JSON.stringify(data));
  }

  function load() {
    return safeParse(localStorage.getItem(PLACEMENT_KEY) || '');
  }

  function setFormFromData(data) {
    if (!data) return;
    if (gradeSelect && data.gradeBand !== undefined) {
      gradeSelect.value = normalizeGradeBand(data.gradeBand) || '';
    }
    const skills = data.skills || {};
    if (skillEls.letterSounds) skillEls.letterSounds.checked = !!skills.letterSounds;
    if (skillEls.cvc) skillEls.cvc.checked = !!skills.cvc;
    if (skillEls.digraph) skillEls.digraph.checked = !!skills.digraph;
    if (skillEls.blends) skillEls.blends.checked = !!skills.blends;
    if (skillEls.magicE) skillEls.magicE.checked = !!skills.magicE;
    if (skillEls.vowelTeam) skillEls.vowelTeam.checked = !!skills.vowelTeam;
    if (skillEls.rControlled) skillEls.rControlled.checked = !!skills.rControlled;
    if (skillEls.multisyllable) skillEls.multisyllable.checked = !!skills.multisyllable;
  }

  function showResult(rec) {
    result.classList.remove('hidden');
    result.innerHTML = `
      <div class="placement-result-title">Recommended Word Quest focus</div>
      <div class="placement-result-main"><strong>${rec.focus}</strong> · length <strong>${rec.length}</strong></div>
      <div class="muted" style="margin-top:6px;">${rec.headline || ''}</div>
      ${rec.notes ? `<div class="muted" style="margin-top:6px;">${rec.notes}</div>` : ''}
    `;

    const href = wordQuestHref(rec.focus, rec.length);
    goWordQuest.href = href;
    goWordQuest.classList.remove('hidden');
  }

  startBtn.addEventListener('click', () => {
    const existing = load();
    setFormFromData(existing);
    if (existing?.recommendation) {
      showResult(existing.recommendation);
    } else {
      result.classList.add('hidden');
      goWordQuest.classList.add('hidden');
    }
    openModal();
  });

  closeBtn?.addEventListener('click', closeModal);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.dataset.open === 'true') {
      closeModal();
    }
  });

  calcBtn.addEventListener('click', () => {
    const gradeBand = normalizeGradeBand(gradeSelect.value || '');
    const skills = getSkillState();
    const recommendation = computeRecommendation(skills);
    const payload = {
      version: 1,
      gradeBand,
      skills,
      recommendation,
      updatedAt: new Date().toISOString()
    };
    store(payload);
    syncProfileAndLook(gradeBand);
    showResult(recommendation);
    renderSummary(payload);
  });

  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(PLACEMENT_KEY);
    Object.values(skillEls).forEach((el) => {
      if (el) el.checked = false;
    });
    gradeSelect.value = '';
    result.classList.add('hidden');
    goWordQuest.classList.add('hidden');
    renderSummary(null);
  });

  // Initial render
  renderSummary(load());

  function renderProgress() {
    if (wordQuestStat && wordQuestDetail) {
      const data = safeParse(localStorage.getItem('decode_progress_data') || '');
      const attempted = Number(data?.wordsAttempted || 0);
      const correct = Number(data?.wordsCorrect || 0);
      const totalGuesses = Number(data?.totalGuesses || 0);

      if (!attempted) {
        wordQuestStat.textContent = 'No data yet';
        wordQuestDetail.textContent = 'Play a few rounds to see accuracy and recent words.';
      } else {
        const accuracy = Math.round((correct / attempted) * 100);
        const avgGuesses = attempted ? (totalGuesses / attempted) : 0;
        wordQuestStat.textContent = `${accuracy}% accuracy`;
        wordQuestDetail.textContent = `${correct}/${attempted} correct · avg guesses ${avgGuesses.toFixed(1)}`;
      }
    }

    if (activityLogList && activityLogEmpty) {
      const entries = getRecentActivityEntries().slice(0, 8);
      activityLogList.innerHTML = '';
      activityLogEmpty.textContent = '';

      if (!entries.length) {
        activityLogEmpty.textContent = 'No recent activity yet.';
      } else {
        entries.forEach((entry) => {
          const when = entry?.ts ? new Date(entry.ts) : null;
          const whenText = when && !Number.isNaN(when.getTime())
            ? when.toLocaleDateString()
            : '';
          const label = entry?.label || entry?.activityLabel || entry?.activity || 'Activity';
          const event = entry?.event || entry?.action || entry?.message || 'Updated';
          const li = document.createElement('li');
          li.textContent = whenText ? `${label}: ${event} (${whenText})` : `${label}: ${event}`;
          activityLogList.appendChild(li);
        });
      }
    }

    renderRoleDashboard();
  }

  renderProgress();
  renderLearners();

  exportJsonBtn?.addEventListener('click', handleExportJson);
  exportCsvBtn?.addEventListener('click', handleExportCsv);
  transferGenerateBtn?.addEventListener('click', handleGenerateTransferCode);
  transferApplyBtn?.addEventListener('click', handleApplyTransferCode);
  importJsonBtn?.addEventListener('click', () => {
    importFileInput?.click();
  });
  importFileInput?.addEventListener('change', () => {
    const file = importFileInput.files?.[0];
    handleImportFile(file);
    importFileInput.value = '';
  });
  learnerActiveSelect?.addEventListener('change', () => {
    switchLearner(learnerActiveSelect.value);
  });
  learnerAddBtn?.addEventListener('click', () => {
    const platform = window.DECODE_PLATFORM;
    const name = (learnerNameInput?.value || '').trim();
    const gradeBand = normalizeGradeBand(learnerGradeInput?.value || '');
    if (!platform?.addLearner) return;
    if (!name) {
      setLearnerStatus('Enter a learner name before adding.', true);
      return;
    }
    platform.addLearner({ name, gradeBand });
    if (learnerNameInput) learnerNameInput.value = '';
    if (learnerGradeInput) learnerGradeInput.value = '';
    editingLearnerId = '';
    platform.refreshLearnerSwitchers?.();
    renderLearners();
    setLearnerStatus('Learner added.');
  });
  homeRoleSelect?.addEventListener('change', () => {
    renderRoleDashboard();
  });
  homeRolePickButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const roleId = normalizeRoleId(button.dataset.roleTarget || '');
      if (!roleId) return;
      if (homeRoleSelect) {
        homeRoleSelect.value = roleId;
      }
      renderRoleDashboard();
    });
  });
  homePinSaveBtn?.addEventListener('click', () => {
    const currentPin = String(homePinCurrentInput?.value || '').trim();
    const newPin = String(homePinNewInput?.value || '').trim();
    const confirmPin = String(homePinConfirmInput?.value || '').trim();
    if (!currentPin) {
      setPinStatus('Enter current PIN first.', true);
      return;
    }
    if (newPin !== confirmPin) {
      setPinStatus('New PIN and confirm PIN do not match.', true);
      return;
    }
    const platform = window.DECODE_PLATFORM;
    const response = platform?.updateStudentModePin?.({ currentPin, newPin });
    if (!response?.ok) {
      if (response?.reason === 'current-pin') {
        setPinStatus('Current PIN is incorrect.', true);
      } else if (response?.reason === 'pin-format') {
        setPinStatus('New PIN must be 4-8 digits.', true);
      } else {
        setPinStatus('Could not save PIN on this device.', true);
      }
      return;
    }
    resetPinFormInputs();
    setPinStatus('Adult PIN updated for this device.');
    renderRoleDashboard();
  });
  homeRecoveryCopyBtn?.addEventListener('click', () => {
    const phrase = String(homeRecoveryPhraseInput?.value || '').trim();
    if (!phrase) {
      setRecoveryStatus('Recovery phrase unavailable. Refresh role dashboard.', true);
      return;
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(phrase)
        .then(() => setRecoveryStatus('Recovery phrase copied. Store it somewhere secure.'))
        .catch(() => setRecoveryStatus('Clipboard blocked. Copy phrase manually from the box.'));
      return;
    }
    setRecoveryStatus('Clipboard unavailable. Copy phrase manually from the box.');
  });
  homeRecoveryRotateBtn?.addEventListener('click', () => {
    const currentPin = String(homePinCurrentInput?.value || '').trim();
    if (!currentPin) {
      setRecoveryStatus('Enter current PIN first to regenerate phrase.', true);
      return;
    }
    const platform = window.DECODE_PLATFORM;
    const response = platform?.rotateStudentModeRecoveryPhrase?.({ currentPin });
    if (!response?.ok) {
      setRecoveryStatus('Current PIN is incorrect.', true);
      return;
    }
    if (homePinCurrentInput) homePinCurrentInput.value = '';
    refreshRecoveryPhraseDisplay();
    setRecoveryStatus('Recovery phrase regenerated. Replace your saved copy.');
    renderRoleDashboard();
  });
  homeRecoveryApplyBtn?.addEventListener('click', () => {
    const phrase = String(homeRecoveryInput?.value || '').trim();
    if (!phrase) {
      setRecoveryStatus('Enter recovery phrase first.', true);
      return;
    }
    const platform = window.DECODE_PLATFORM;
    const response = platform?.recoverStudentModePinWithPhrase?.({ phrase });
    if (!response?.ok) {
      setRecoveryStatus('Recovery phrase is incorrect.', true);
      return;
    }
    if (homeRecoveryInput) homeRecoveryInput.value = '';
    resetPinFormInputs();
    setRecoveryStatus(`Recovery accepted. PIN reset to default ${STUDENT_MODE_PIN_DEFAULT}.`);
    setPinStatus(`PIN reset to default ${STUDENT_MODE_PIN_DEFAULT}.`);
    renderRoleDashboard();
  });
  homePinStrictSaveBtn?.addEventListener('click', () => {
    const currentPin = String(homePinCurrentInput?.value || '').trim();
    if (!currentPin) {
      setPinStatus('Enter current PIN first.', true);
      return;
    }
    const strictMode = !!homePinStrictToggle?.checked;
    const platform = window.DECODE_PLATFORM;
    const response = platform?.setStudentModeStrict?.({ currentPin, strictMode });
    if (!response?.ok) {
      if (response?.reason === 'current-pin') {
        setPinStatus('Current PIN is incorrect.', true);
      } else if (response?.reason === 'custom-required') {
        setPinStatus('Set a custom PIN first, then enable strict mode.', true);
      } else {
        setPinStatus('Could not update strict mode on this device.', true);
      }
      return;
    }
    if (homePinCurrentInput) homePinCurrentInput.value = '';
    setPinStatus(strictMode
      ? 'Strict mode enabled. Default fallback PIN is now disabled.'
      : `Strict mode disabled. Default fallback PIN ${STUDENT_MODE_PIN_DEFAULT} is active.`);
    setRecoveryStatus('');
    renderRoleDashboard();
  });
  homePinResetBtn?.addEventListener('click', () => {
    const currentPin = String(homePinCurrentInput?.value || '').trim();
    if (!currentPin) {
      setPinStatus('Enter current PIN first.', true);
      return;
    }
    const platform = window.DECODE_PLATFORM;
    const response = platform?.resetStudentModePinToDefault?.(currentPin);
    if (!response?.ok) {
      setPinStatus('Current PIN is incorrect.', true);
      return;
    }
    resetPinFormInputs();
    setPinStatus(`PIN reset to default ${STUDENT_MODE_PIN_DEFAULT}.`);
    setRecoveryStatus('');
    renderRoleDashboard();
  });
  homeClassBlockGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const launchEl = target.closest('.home-class-block-launch');
    if (!(launchEl instanceof HTMLElement)) return;
    logClassBlockLaunchFromElement(launchEl);
  });
  learnerList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const actionEl = target.closest('button[data-action]');
    if (!actionEl) return;
    const id = actionEl.getAttribute('data-id') || '';
    const action = actionEl.getAttribute('data-action');
    const platform = window.DECODE_PLATFORM;

    if (action === 'switch') {
      switchLearner(id);
      return;
    }

    if (action === 'edit') {
      editingLearnerId = id;
      renderLearners();
      setLearnerStatus('Editing learner.');
      return;
    }

    if (action === 'cancel-edit') {
      editingLearnerId = '';
      renderLearners();
      setLearnerStatus('');
      return;
    }

    if (action === 'save-edit') {
      if (!platform?.updateLearner) return;
      const row = actionEl.closest('li[data-learner-id]');
      const editNameInput = row?.querySelector('input[data-role="edit-name"]');
      const editGradeSelect = row?.querySelector('select[data-role="edit-grade"]');
      const name = (editNameInput && 'value' in editNameInput) ? editNameInput.value.trim() : '';
      const gradeBand = normalizeGradeBand((editGradeSelect && 'value' in editGradeSelect) ? editGradeSelect.value : '');

      if (!name) {
        setLearnerStatus('Learner name cannot be empty.', true);
        editNameInput?.focus();
        return;
      }

      const updated = platform.updateLearner(id, { name, gradeBand });
      if (!updated) {
        setLearnerStatus('Could not update learner.', true);
        return;
      }

      if (platform.getActiveLearnerId?.() === id) {
        window.DECODE_PLATFORM?.setProfile?.({ gradeBand: gradeBand || '' });
        if (gradeBand) syncProfileAndLook(gradeBand);
      }

      editingLearnerId = '';
      platform.refreshLearnerSwitchers?.();
      renderLearners();
      renderSummary(load());
      renderProgress();
      setLearnerStatus('Learner updated.');
      return;
    }

    if (action === 'remove') {
      if (!platform?.removeLearner) return;
      const confirmRemove = window.confirm('Remove this learner and all learner-specific saved data on this device?');
      if (!confirmRemove) return;
      const response = platform.removeLearner(id, { reload: false });
      if (!response?.ok) {
        setLearnerStatus('Could not remove learner. At least one learner is required.', true);
        return;
      }
      editingLearnerId = '';
      platform.refreshLearnerSwitchers?.();
      renderLearners();
      renderSummary(load());
      renderProgress();
      setLearnerStatus('Learner removed.');
    }
  });
})();
