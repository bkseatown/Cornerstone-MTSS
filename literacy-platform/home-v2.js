(function () {
  const FLAG_KEY = 'cs_home_v2';
  const STATE_KEY_PREFIX = 'cs_hv2_state_v1::';
  const THEME_KEY_PREFIX = 'cs_hv2_theme_v1::';
  const ACTIVE_LEARNER_KEY = 'decode_active_learner_v1';
  const LEGACY_HOME_STATE_KEY_PREFIX = 'cornerstone_home_state_v4::';
  const LEGACY_ROLE_KEY = 'cm_role';
  const LEGACY_FOCUS_KEY = 'cm_focus_today';
  const PLACEMENT_KEY = 'decode_placement_v1';
  const QUICKCHECK_SUMMARY_KEY = 'cornerstone_quickcheck_summary_v1';
  const POLL_INTERVAL_MS = 700;

  const THEME_OPTIONS = [
    { value: 'calm', label: 'Calm' },
    { value: 'professional', label: 'Professional' },
    { value: 'playful', label: 'Playful' }
  ];

  const ROLE_OPTIONS = [
    { value: 'student', label: 'Student', subline: 'I\'m learning or practicing.' },
    { value: 'parent', label: 'Parent / Caregiver', subline: 'I\'m supporting my child.' },
    { value: 'school', label: 'School Team', subline: 'I\'m working with students.' }
  ];

  const CONTEXT_OPTIONS = {
    student: {
      prompt: 'What are you mainly here for today?',
      choices: [
        { value: 'student-reading', label: 'Reading & Words', focus: 'literacy' },
        { value: 'student-math', label: 'Math & Numbers', focus: 'numeracy' },
        { value: 'student-both', label: 'Both', focus: 'both' }
      ]
    },
    parent: {
      prompt: 'What do you want help with?',
      choices: [
        { value: 'parent-understand', label: 'Understand my child\'s learning', focus: 'both' },
        { value: 'parent-practice', label: 'Practice together at home', focus: 'both' },
        { value: 'parent-next-steps', label: 'Get clear next steps', focus: 'both' }
      ]
    },
    school: {
      prompt: 'What\'s your main focus today?',
      choices: [
        { value: 'school-literacy', label: 'Literacy', focus: 'literacy' },
        { value: 'school-numeracy', label: 'Numeracy', focus: 'numeracy' },
        { value: 'school-wellbeing', label: 'Wellbeing / Learning behaviors', focus: 'both' }
      ]
    }
  };

  const CONTEXT_LOOKUP = buildContextLookup();

  const HUB_BY_SCHOOL_ROLE = {
    teacher: 'teacher-hub.html',
    'learning-support': 'learning-support-hub.html',
    eal: 'eal-hub.html',
    slp: 'slp-hub.html',
    counselor: 'counselor-hub.html',
    psychologist: 'psychologist-hub.html',
    admin: 'admin-hub.html',
    dean: 'admin-hub.html'
  };

  const HUB_BY_ROLE = {
    student: 'student-hub.html',
    parent: 'parent-hub.html'
  };

  let cs_hv2_quickcheck_poll = null;
  let cs_hv2_settings_open = false;

  function buildContextLookup() {
    const map = {};
    Object.values(CONTEXT_OPTIONS).forEach((group) => {
      group.choices.forEach((choice) => {
        map[choice.value] = choice;
      });
    });
    return map;
  }

  function isFeatureEnabled() {
    return String(localStorage.getItem(FLAG_KEY) || '').trim().toLowerCase() === 'true';
  }

  function safeParse(raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function normalizeRole(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'student' || raw === 'parent' || raw === 'school' ? raw : null;
  }

  function normalizeFocus(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'literacy' || raw === 'numeracy' || raw === 'both' ? raw : null;
  }

  function normalizeTheme(value) {
    const raw = String(value || '').trim().toLowerCase();
    return THEME_OPTIONS.some((theme) => theme.value === raw) ? raw : 'calm';
  }

  function normalizeSchoolRole(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return null;
    return Object.prototype.hasOwnProperty.call(HUB_BY_SCHOOL_ROLE, raw) ? raw : null;
  }

  function normalizeContextChoice(value) {
    const raw = String(value || '').trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(CONTEXT_LOOKUP, raw) ? raw : null;
  }

  function normalizeQuickCheckStatus(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'not_started' || raw === 'in_progress' || raw === 'complete' || raw === 'skipped') {
      return raw;
    }
    return 'not_started';
  }

  function normalizeStep(value) {
    const asNumber = Number(value);
    if (!Number.isFinite(asNumber)) return 0;
    return Math.max(0, Math.min(3, Math.round(asNumber)));
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getScopeId() {
    const activeLearnerId = String(localStorage.getItem(ACTIVE_LEARNER_KEY) || '').trim().toLowerCase();
    const cleaned = activeLearnerId.replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return cleaned || 'global';
  }

  function getStateKey() {
    return `${STATE_KEY_PREFIX}${getScopeId()}`;
  }

  function getThemeKey() {
    return `${THEME_KEY_PREFIX}${getScopeId()}`;
  }

  function getLegacyHomeStateKey() {
    return `${LEGACY_HOME_STATE_KEY_PREFIX}${getScopeId()}`;
  }

  function createDefaultState() {
    return {
      step: 0,
      role: null,
      schoolRole: null,
      contextChoice: null,
      focus: null,
      quickCheckStatus: 'not_started'
    };
  }

  function sanitizeState(source) {
    const raw = source && typeof source === 'object' ? source : {};
    const contextChoice = normalizeContextChoice(raw.contextChoice);
    const focusFromContext = contextChoice ? CONTEXT_LOOKUP[contextChoice].focus : null;
    const sanitizedFocus = normalizeFocus(raw.focus) || focusFromContext;

    return {
      step: normalizeStep(raw.step),
      role: normalizeRole(raw.role),
      schoolRole: normalizeSchoolRole(raw.schoolRole),
      contextChoice,
      focus: sanitizedFocus,
      quickCheckStatus: normalizeQuickCheckStatus(raw.quickCheckStatus)
    };
  }

  function readState() {
    const parsed = safeParse(localStorage.getItem(getStateKey()) || '');
    return sanitizeState({ ...createDefaultState(), ...parsed });
  }

  function writeState(patch = {}, options = {}) {
    const base = options.reset ? createDefaultState() : readState();
    const next = sanitizeState({ ...base, ...patch });
    localStorage.setItem(getStateKey(), JSON.stringify(next));
    return next;
  }

  function readTheme() {
    return normalizeTheme(localStorage.getItem(getThemeKey()) || 'calm');
  }

  function writeTheme(theme) {
    const normalized = normalizeTheme(theme);
    localStorage.setItem(getThemeKey(), normalized);
    return normalized;
  }

  function applyTheme(theme) {
    const normalized = normalizeTheme(theme);
    document.body.classList.remove('cs-hv2-theme-calm', 'cs-hv2-theme-professional', 'cs-hv2-theme-playful');
    document.body.classList.add(`cs-hv2-theme-${normalized}`);
  }

  function normalizeVisibleStep(step, state) {
    const normalized = normalizeStep(step);
    if (normalized === 0) return 0;
    if (!state.role) return 1;
    if (normalized === 1) return 1;
    if (normalized === 2) return 2;
    if (normalized === 3 && !state.focus) return 2;
    return 3;
  }

  function resolveHubPath(state) {
    if (state.role === 'student' || state.role === 'parent') {
      return HUB_BY_ROLE[state.role] || 'student-hub.html';
    }
    if (state.role === 'school') {
      return HUB_BY_SCHOOL_ROLE[state.schoolRole || 'teacher'] || 'teacher-hub.html';
    }
    return 'student-hub.html';
  }

  function hasRecommendation() {
    const placement = safeParse(localStorage.getItem(PLACEMENT_KEY) || '');
    const summary = safeParse(localStorage.getItem(QUICKCHECK_SUMMARY_KEY) || '');
    const payload = placement && typeof placement === 'object' ? placement : summary;
    if (!payload || typeof payload !== 'object') return false;
    return !!(payload.recommendation || payload.focus || payload.score || payload.band || payload.summary);
  }

  function stopQuickCheckPolling() {
    if (!cs_hv2_quickcheck_poll) return;
    window.clearInterval(cs_hv2_quickcheck_poll);
    cs_hv2_quickcheck_poll = null;
  }

  function routeToHub(quickCheckStatus) {
    const state = readState();
    const target = resolveHubPath(state);
    const url = new URL(target, window.location.href);
    url.searchParams.set('source', 'home-v2');
    url.searchParams.set('quickcheck', quickCheckStatus || state.quickCheckStatus);
    if (state.focus) url.searchParams.set('focus', state.focus);
    window.location.href = url.toString();
  }

  function startQuickCheckPolling() {
    stopQuickCheckPolling();
    cs_hv2_quickcheck_poll = window.setInterval(() => {
      const current = readState();
      if (current.quickCheckStatus !== 'in_progress') {
        stopQuickCheckPolling();
        return;
      }
      if (!hasRecommendation()) return;
      stopQuickCheckPolling();
      writeState({ quickCheckStatus: 'complete' });
      routeToHub('complete');
    }, POLL_INTERVAL_MS);
  }

  function pushLegacyBridgeState(state) {
    const role = state.role || 'student';
    const focus = state.focus || 'literacy';
    const legacy = {
      role,
      subrole: role === 'school' ? state.schoolRole || 'teacher' : '',
      learnerName: '',
      gradeBand: '',
      focus,
      quickCheckComplete: false,
      quickCheckSummary: null,
      wizardStep: 4,
      parentGoal: '',
      schoolPrimaryArea: ''
    };
    localStorage.setItem(getLegacyHomeStateKey(), JSON.stringify(legacy));
    localStorage.setItem(LEGACY_ROLE_KEY, role === 'school' ? legacy.subrole : role);
    localStorage.setItem(LEGACY_FOCUS_KEY, focus);
  }

  function openExistingQuickCheck(role) {
    const launchButton = document.getElementById('home-role-launch');
    const startButton = document.getElementById('placement-start');
    const calcButton = document.getElementById('placement-calc');

    if (role === 'parent') {
      if (startButton instanceof HTMLButtonElement) {
        startButton.click();
      }
      window.setTimeout(() => {
        if (calcButton instanceof HTMLButtonElement) {
          calcButton.click();
        }
      }, 120);
      return;
    }

    if (launchButton instanceof HTMLButtonElement) {
      launchButton.click();
    } else if (startButton instanceof HTMLButtonElement) {
      startButton.click();
    }

    window.setTimeout(() => {
      const modal = document.getElementById('placement-modal');
      const isHidden = modal?.classList.contains('hidden');
      if (isHidden && startButton instanceof HTMLButtonElement) {
        startButton.click();
      }
      if (calcButton instanceof HTMLButtonElement) {
        calcButton.click();
      }
    }, 120);
  }

  function contextPromptForRole(role) {
    return CONTEXT_OPTIONS[role]?.prompt || CONTEXT_OPTIONS.student.prompt;
  }

  function contextChoicesForRole(role) {
    return CONTEXT_OPTIONS[role]?.choices || CONTEXT_OPTIONS.student.choices;
  }

  function renderThemeSettings(theme) {
    const openClass = cs_hv2_settings_open ? '' : ' cs-hv2-hidden';
    return `
      <div class="cs-hv2-toolbar">
        <button type="button" class="cs-hv2-settings-trigger" data-action="toggle-settings" aria-expanded="${cs_hv2_settings_open}">Settings</button>
      </div>
      <div class="cs-hv2-settings${openClass}" data-cs-hv2-settings>
        <div class="cs-hv2-settings-title">Theme</div>
        <div class="cs-hv2-theme-row" role="group" aria-label="Home theme">
          ${THEME_OPTIONS.map((option) => `
            <button type="button" class="cs-hv2-theme-btn${theme === option.value ? ' cs-hv2-theme-selected' : ''}" data-action="set-theme" data-theme="${option.value}">${escapeHtml(option.label)}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderRoleChoices(state) {
    return ROLE_OPTIONS.map((option) => `
      <button type="button" class="cs-hv2-choice-card${state.role === option.value ? ' cs-hv2-choice-selected' : ''}" data-action="choose-role" data-role="${option.value}">
        <span class="cs-hv2-choice-title">${escapeHtml(option.label)}</span>
        <span class="cs-hv2-choice-subline">${escapeHtml(option.subline)}</span>
      </button>
    `).join('');
  }

  function renderContextChoices(state) {
    return contextChoicesForRole(state.role).map((choice) => `
      <button type="button" class="cs-hv2-choice-card${state.contextChoice === choice.value ? ' cs-hv2-choice-selected' : ''}" data-action="choose-context" data-context="${choice.value}">
        <span class="cs-hv2-choice-title">${escapeHtml(choice.label)}</span>
      </button>
    `).join('');
  }

  function renderQuestionLayout(root, state, title, choicesMarkup, showBack) {
    const theme = readTheme();
    root.innerHTML = `
      <div class="cs-hv2-container">
        <section class="cs-hv2-card cs-hv2-question-card">
          ${renderThemeSettings(theme)}
          <p class="cs-hv2-step-label">Step ${state.step} of 3</p>
          <h2 class="cs-hv2-question">${title}</h2>
          <div class="cs-hv2-choice-grid">${choicesMarkup}</div>
          ${showBack ? '<div class="cs-hv2-footer"><button type="button" class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button></div>' : ''}
        </section>
      </div>
    `;
  }

  function renderWelcome(root) {
    root.innerHTML = `
      <div class="cs-hv2-container cs-hv2-hero-wrap">
        <section class="cs-hv2-hero" aria-label="Welcome">
          <h2 class="cs-hv2-hero-title">Let&rsquo;s get you to the right starting place.</h2>
          <p class="cs-hv2-hero-subline">Answer 3 quick questions and we&rsquo;ll match you to the best pathway.</p>
          <button type="button" class="cs-hv2-btn cs-hv2-btn-primary cs-hv2-hero-btn" data-action="begin">Get started &rarr;</button>
        </section>
      </div>
    `;
  }

  function renderRole(root, state) {
    renderQuestionLayout(root, state, 'Who are you here as today?', renderRoleChoices(state), true);
  }

  function renderContext(root, state) {
    renderQuestionLayout(root, state, contextPromptForRole(state.role), renderContextChoices(state), true);
  }

  function renderQuickCheck(root, state) {
    const theme = readTheme();
    root.innerHTML = `
      <div class="cs-hv2-container">
        <section class="cs-hv2-card cs-hv2-question-card">
          ${renderThemeSettings(theme)}
          <p class="cs-hv2-step-label">Step 3 of 3</p>
          <h2 class="cs-hv2-question">Quick Check (5-8 minutes)</h2>
          <p class="cs-hv2-quickcopy">This short check helps us match you to the right level right away. You can stop anytime.</p>
          <div class="cs-hv2-quick-actions">
            <button type="button" class="cs-hv2-btn cs-hv2-btn-primary" data-action="start">Start Quick Check &rarr;</button>
            <button type="button" class="cs-hv2-btn cs-hv2-btn-secondary" data-action="skip">Skip for now</button>
          </div>
          <div class="cs-hv2-footer">
            <button type="button" class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button>
          </div>
        </section>
      </div>
    `;
  }

  function showStep(stepIndex) {
    const root = document.getElementById('homeV2Root');
    if (!root) return;

    let state = readState();
    const normalized = normalizeVisibleStep(stepIndex, state);
    if (normalized !== state.step) {
      state = writeState({ step: normalized });
    }

    if (normalized === 0) renderWelcome(root);
    if (normalized === 1) renderRole(root, state);
    if (normalized === 2) renderContext(root, state);
    if (normalized === 3) renderQuickCheck(root, state);

    attachListeners();
  }

  function attachListeners() {
    const root = document.getElementById('homeV2Root');
    if (!root) return;

    root.querySelector('[data-action="begin"]')?.addEventListener('click', () => {
      cs_hv2_settings_open = false;
      const state = writeState({ step: 1 });
      showStep(state.step);
    });

    root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      const state = readState();
      cs_hv2_settings_open = false;
      if (state.step === 1) {
        writeState({ step: 0 });
        showStep(0);
        return;
      }
      if (state.step === 2) {
        writeState({ step: 1 });
        showStep(1);
        return;
      }
      if (state.step === 3) {
        writeState({ step: 2 });
        showStep(2);
      }
    });

    root.querySelector('[data-action="toggle-settings"]')?.addEventListener('click', () => {
      const state = readState();
      cs_hv2_settings_open = !cs_hv2_settings_open;
      showStep(state.step);
    });

    root.querySelectorAll('[data-action="set-theme"]').forEach((button) => {
      button.addEventListener('click', () => {
        const selected = normalizeTheme(button.getAttribute('data-theme') || 'calm');
        writeTheme(selected);
        applyTheme(selected);
        const state = readState();
        showStep(state.step);
      });
    });

    root.querySelectorAll('[data-action="choose-role"]').forEach((button) => {
      button.addEventListener('click', () => {
        const role = normalizeRole(button.getAttribute('data-role') || '');
        if (!role) return;
        const state = readState();
        cs_hv2_settings_open = false;
        writeState({
          role,
          schoolRole: role === 'school' ? state.schoolRole : null,
          contextChoice: null,
          focus: null,
          quickCheckStatus: 'not_started',
          step: 2
        });
        showStep(2);
      });
    });

    root.querySelectorAll('[data-action="choose-context"]').forEach((button) => {
      button.addEventListener('click', () => {
        const contextChoice = normalizeContextChoice(button.getAttribute('data-context') || '');
        if (!contextChoice) return;
        const role = readState().role;
        const focus = normalizeFocus(CONTEXT_LOOKUP[contextChoice]?.focus || null);
        if (!role || !focus) return;
        cs_hv2_settings_open = false;
        writeState({ contextChoice, focus, quickCheckStatus: 'not_started', step: 3 });
        showStep(3);
      });
    });

    root.querySelector('[data-action="skip"]')?.addEventListener('click', () => {
      writeState({ quickCheckStatus: 'skipped' });
      routeToHub('skipped');
    });

    root.querySelector('[data-action="start"]')?.addEventListener('click', () => {
      const state = readState();
      if (!state.focus) return;
      const prepared = writeState({ quickCheckStatus: 'in_progress' });
      pushLegacyBridgeState(prepared);
      if (hasRecommendation()) {
        writeState({ quickCheckStatus: 'complete' });
        routeToHub('complete');
        return;
      }
      openExistingQuickCheck(prepared.role);
      startQuickCheckPolling();
    });
  }

  function hideLegacyHome() {
    document.body.classList.add('cs-hv2-page', 'cs-hv2-enabled');
    document.querySelectorAll('.home-main > .home-card').forEach((card) => {
      card.setAttribute('aria-hidden', 'true');
    });
  }

  function mountHomeV2() {
    const root = document.getElementById('homeV2Root');
    if (!root) return;

    applyTheme(readTheme());
    hideLegacyHome();

    const state = readState();
    showStep(normalizeVisibleStep(state.step, state));

    window.addEventListener('focus', () => {
      const current = readState();
      if (current.quickCheckStatus !== 'in_progress') return;
      if (!hasRecommendation()) return;
      writeState({ quickCheckStatus: 'complete' });
      routeToHub('complete');
    });
  }

  if (!isFeatureEnabled()) return;
  mountHomeV2();
})();
