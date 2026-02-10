(function () {
  const FLAG_KEY = 'cs_home_v2';
  const STATE_KEY_PREFIX = 'cs_hv2_state_v1::';
  const THEME_STORAGE_KEY = 'cs_hv2_theme';
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
    { value: 'student-me', role: 'student', label: 'Me', subline: 'I’m learning on my own.' },
    { value: 'student-teacher', role: 'student', label: 'With my teacher', subline: 'my teacher is guiding me.' },
    { value: 'student-family', role: 'student', label: 'With my family', subline: 'I’m working with a parent or caregiver.' },
    { value: 'school', role: 'school', label: 'School Team', subline: 'I work at the school.' }
  ];

  const SCHOOL_TEAM_ROLES = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'learning-support', label: 'Learning Support' },
    { value: 'eal', label: 'EAL' },
    { value: 'slp', label: 'SLP' },
    { value: 'counselor', label: 'Counselor' },
    { value: 'psychologist', label: 'Psychologist' },
    { value: 'admin', label: 'Administrator' },
    { value: 'dean', label: 'Dean' }
  ];

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

  const ROLE_OPTION_LOOKUP = buildRoleOptionLookup();

  let cs_hv2_quickcheck_poll = null;

  function buildRoleOptionLookup() {
    const map = {};
    ROLE_OPTIONS.forEach((option) => {
      map[option.value] = option;
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

  function normalizeRoleOption(value) {
    const raw = String(value || '').trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(ROLE_OPTION_LOOKUP, raw) ? raw : null;
  }

  function roleForRoleOption(value) {
    const key = normalizeRoleOption(value);
    if (!key) return null;
    return normalizeRole(ROLE_OPTION_LOOKUP[key].role);
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

  function getLegacyHomeStateKey() {
    return `${LEGACY_HOME_STATE_KEY_PREFIX}${getScopeId()}`;
  }

  function createDefaultState() {
    return {
      step: 0,
      role: null,
      schoolRole: null,
      roleOption: null,
      focus: null,
      quickCheckStatus: 'not_started'
    };
  }

  function sanitizeState(source) {
    const raw = source && typeof source === 'object' ? source : {};
    const roleOption = normalizeRoleOption(raw.roleOption);
    const normalizedRole = normalizeRole(raw.role) || roleForRoleOption(roleOption);
    const sanitizedFocus = normalizeFocus(raw.focus) || 'both';
    const schoolRole = normalizedRole === 'school' ? normalizeSchoolRole(raw.schoolRole) : null;

    return {
      step: normalizeStep(raw.step),
      role: normalizedRole,
      schoolRole,
      roleOption,
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
    return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY) || 'calm');
  }

  function writeTheme(theme) {
    const normalized = normalizeTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
    return normalized;
  }

  function readThemeFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const value = String(params.get('theme') || '').trim().toLowerCase();
      if (!value) return '';
      return THEME_OPTIONS.some((theme) => theme.value === value) ? value : '';
    } catch {
      return '';
    }
  }

  function applyTheme(theme) {
    const normalized = normalizeTheme(theme);
    document.body.classList.remove('cs-hv2-theme-calm', 'cs-hv2-theme-professional', 'cs-hv2-theme-playful');
    document.body.classList.add(`cs-hv2-theme-${normalized}`);
  }

  function normalizeVisibleStep(step, state) {
    const normalized = normalizeStep(step);
    const role = roleForRoleOption(state.roleOption) || state.role;
    if (normalized === 0) return 0;
    if (!role) return 1;
    if (normalized === 1) return 1;
    if (normalized === 2) {
      return role === 'school' ? 2 : 3;
    }
    if (normalized === 3 && role === 'school' && !state.schoolRole) return 2;
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

  function renderThemeSelector(theme) {
    return `
      <div class="cs-hv2-theme-select" role="group" aria-label="Theme">
        <span class="cs-hv2-theme-label">Theme</span>
        <div class="cs-hv2-theme-row">
          ${THEME_OPTIONS.map((option) => `
            <button type="button" class="cs-hv2-theme-btn${theme === option.value ? ' cs-hv2-theme-selected' : ''}" data-action="set-theme" data-theme="${option.value}">${escapeHtml(option.label)}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderRoleChoices(state) {
    return ROLE_OPTIONS.map((option) => `
      <button type="button" class="cs-hv2-choice-card${state.roleOption === option.value ? ' cs-hv2-choice-selected' : ''}" data-action="choose-role" data-role-option="${option.value}">
        <span class="cs-hv2-choice-title">${escapeHtml(option.label)}</span>
        <span class="cs-hv2-choice-subline">${escapeHtml(option.subline)}</span>
      </button>
    `).join('');
  }

  function renderSchoolRoleChoices(state) {
    return SCHOOL_TEAM_ROLES.map((option) => `
      <option value="${option.value}" ${state.schoolRole === option.value ? 'selected' : ''}>${escapeHtml(option.label)}</option>
    `).join('');
  }

  function renderWelcome(root) {
    const theme = readTheme();
    root.innerHTML = `
      <div class="cs-hv2-container cs-hv2-hero-wrap">
        <section class="cs-hv2-card cs-hv2-hero" aria-label="Welcome">
          <div class="cs-hv2-hero-top">
            <p class="cs-hv2-hero-eyebrow">WELCOME</p>
            <div class="cs-hv2-hero-controls">
              ${renderThemeSelector(theme)}
              <button type="button" class="cs-hv2-start-over" data-action="start-over">Start over</button>
            </div>
          </div>
          <h2 class="cs-hv2-hero-title">Let&rsquo;s find the right learning pathway.</h2>
          <p class="cs-hv2-hero-subline">We&rsquo;ll ask a few quick questions so we can help you get started in the right place.</p>
          <button type="button" class="cs-hv2-btn cs-hv2-btn-primary cs-hv2-hero-btn" data-action="begin">Get started &rarr;</button>
        </section>
      </div>
    `;
  }

  function renderRole(root, state) {
    const selectedRole = roleForRoleOption(state.roleOption);
    root.innerHTML = `
      <div class="cs-hv2-container">
        <section class="cs-hv2-card cs-hv2-question-card">
          <p class="cs-hv2-step-label">Step 1 of 3</p>
          <h2 class="cs-hv2-question">Who are we helping today?</h2>
          <div class="cs-hv2-choice-grid">${renderRoleChoices(state)}</div>
          <p class="cs-hv2-hint">Choose one option to begin.</p>
          <div class="cs-hv2-quick-actions">
            <button type="button" class="cs-hv2-btn cs-hv2-btn-primary" data-action="role-next" ${selectedRole ? '' : 'disabled'}>Find my pathway &rarr;</button>
          </div>
          <div class="cs-hv2-footer">
            <button type="button" class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderSchoolRole(root, state) {
    root.innerHTML = `
      <div class="cs-hv2-container">
        <section class="cs-hv2-card cs-hv2-question-card">
          <p class="cs-hv2-step-label">Step 2 of 3</p>
          <h2 class="cs-hv2-question">What is your role?</h2>
          <label class="cs-hv2-field-label" for="cs-hv2-school-role">Choose your role</label>
          <select id="cs-hv2-school-role" class="cs-hv2-select">
            <option value="">Choose your role</option>
            ${renderSchoolRoleChoices(state)}
          </select>
          <div class="cs-hv2-quick-actions">
            <button type="button" class="cs-hv2-btn cs-hv2-btn-primary" data-action="school-role-next" ${state.schoolRole ? '' : 'disabled'}>Next &rarr;</button>
          </div>
          <div class="cs-hv2-footer">
            <button type="button" class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderQuickCheck(root, state) {
    root.innerHTML = `
      <div class="cs-hv2-container">
        <section class="cs-hv2-card cs-hv2-question-card">
          <p class="cs-hv2-step-label">Step 3 of 3</p>
          <h2 class="cs-hv2-question">Quick Check (recommended)</h2>
          <p class="cs-hv2-quickcopy">A short check helps us match you to the right level. It&rsquo;s quick, low-pressure, and helpful.</p>
          <ul class="cs-hv2-quick-bullets">
            <li>This is not a test.</li>
            <li>You can stop anytime.</li>
            <li>Your answers guide better support.</li>
          </ul>
          <div class="cs-hv2-quick-actions">
            <button type="button" class="cs-hv2-btn cs-hv2-btn-primary" data-action="start">Start Quick Check</button>
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
    if (normalized === 2) renderSchoolRole(root, state);
    if (normalized === 3) renderQuickCheck(root, state);

    attachListeners();
  }

  function attachListeners() {
    const root = document.getElementById('homeV2Root');
    if (!root) return;

    root.querySelector('[data-action="begin"]')?.addEventListener('click', () => {
      const state = writeState({ step: 1 });
      showStep(state.step);
    });

    root.querySelector('[data-action="start-over"]')?.addEventListener('click', () => {
      writeState({}, { reset: true });
      showStep(0);
    });

    root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      const state = readState();
      const role = roleForRoleOption(state.roleOption) || state.role;
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
        if (role === 'school') {
          writeState({ step: 2 });
          showStep(2);
        } else {
          writeState({ step: 1 });
          showStep(1);
        }
      }
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
        const roleOption = normalizeRoleOption(button.getAttribute('data-role-option') || '');
        const role = roleForRoleOption(roleOption);
        if (!role) return;
        writeState({
          roleOption,
          role,
          schoolRole: role === 'school' ? readState().schoolRole : null,
          focus: 'both',
          quickCheckStatus: 'not_started'
        });
        showStep(1);
      });
    });

    root.querySelector('[data-action="role-next"]')?.addEventListener('click', () => {
      const state = readState();
      const role = roleForRoleOption(state.roleOption) || state.role;
      if (!role) return;
      if (role === 'school') {
        writeState({ step: 2 });
        showStep(2);
      } else {
        writeState({ step: 3, schoolRole: null });
        showStep(3);
      }
    });

    root.querySelector('#cs-hv2-school-role')?.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      writeState({ schoolRole: normalizeSchoolRole(target.value) });
      showStep(2);
    });

    root.querySelector('[data-action="school-role-next"]')?.addEventListener('click', () => {
      const state = readState();
      if (!state.schoolRole) return;
      writeState({ step: 3 });
      showStep(3);
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

    const themeFromUrl = readThemeFromUrl();
    if (themeFromUrl) {
      writeTheme(themeFromUrl);
    }
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
