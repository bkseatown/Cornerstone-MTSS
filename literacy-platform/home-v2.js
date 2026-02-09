(function () {
  const FLAG_KEY = 'cs_home_v2';
  const STATE_KEY_PREFIX = 'cs_hv2_state_v1::';
  const ACTIVE_LEARNER_KEY = 'decode_active_learner_v1';
  const LEGACY_HOME_STATE_KEY_PREFIX = 'cornerstone_home_state_v4::';
  const LEGACY_ROLE_KEY = 'cm_role';
  const LEGACY_FOCUS_KEY = 'cm_focus_today';
  const PLACEMENT_KEY = 'decode_placement_v1';
  const QUICKCHECK_SUMMARY_KEY = 'cornerstone_quickcheck_summary_v1';
  const POLL_INTERVAL_MS = 700;

  const SCHOOL_ROLES = [
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
    teacher: 'teacher-toolkit.html',
    'learning-support': 'learning-support-toolkit.html',
    eal: 'eal-toolkit.html',
    slp: 'slp-toolkit.html',
    counselor: 'counselor-toolkit.html',
    psychologist: 'psychologist-toolkit.html',
    admin: 'administrator-toolkit.html',
    dean: 'dean-toolkit.html'
  };

  let cs_hv2_quickcheck_poll = null;
  const cs_hv2_build_stamp = readBuildStamp();

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

  function readBuildStamp() {
    const fromCurrent = document.currentScript instanceof HTMLScriptElement ? document.currentScript : null;
    const script = fromCurrent || Array.from(document.querySelectorAll('script[src]')).find((node) => /home-v2\.js(\?|$)/.test(node.src));
    if (!script) return 'dev';
    try {
      const src = new URL(script.src, window.location.href);
      const raw = src.searchParams.get('v') || '';
      const stamp = String(raw).trim();
      return stamp || 'dev';
    } catch {
      return 'dev';
    }
  }

  function normalizeRole(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'student' || raw === 'parent' || raw === 'school' ? raw : null;
  }

  function normalizeSchoolRole(value) {
    const raw = String(value || '').trim().toLowerCase();
    return SCHOOL_ROLES.some((item) => item.value === raw) ? raw : null;
  }

  function normalizeDivision(value) {
    const raw = String(value || '').trim().toUpperCase();
    return raw === 'ES' || raw === 'MS' || raw === 'HS' ? raw : '';
  }

  function normalizeFocus(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'literacy' || raw === 'numeracy' || raw === 'both' ? raw : null;
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
    return Math.max(0, Math.min(4, Math.round(asNumber)));
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
      learnerName: '',
      division: '',
      focus: null,
      quickCheckStatus: 'not_started'
    };
  }

  function sanitizeState(source) {
    const raw = source && typeof source === 'object' ? source : {};
    return {
      step: normalizeStep(raw.step),
      role: normalizeRole(raw.role),
      schoolRole: normalizeSchoolRole(raw.schoolRole),
      learnerName: String(raw.learnerName || '').trim().slice(0, 80),
      division: normalizeDivision(raw.division),
      focus: normalizeFocus(raw.focus),
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

  function progressForStep(step, role) {
    if (step <= 0) return null;
    const total = role === 'school' ? 4 : 3;
    if (step === 1) return { current: 1, total };
    if (step === 2) return { current: 2, total };
    if (step === 3) return { current: role === 'school' ? 3 : 2, total };
    return { current: total, total };
  }

  function canContinue(state) {
    if (state.step === 1) return !!state.role;
    if (state.step === 2) return !!state.division && !!state.schoolRole;
    if (state.step === 3) return !!state.focus;
    return true;
  }

  function nextStep(state) {
    if (state.step === 0) return 1;
    if (state.step === 1) return state.role === 'school' ? 2 : 3;
    if (state.step === 2) return 3;
    if (state.step === 3) return 4;
    return 4;
  }

  function previousStep(state) {
    if (state.step === 1) return 0;
    if (state.step === 2) return 1;
    if (state.step === 3) return state.role === 'school' ? 2 : 1;
    if (state.step === 4) return 3;
    return 0;
  }

  function normalizeVisibleStep(step, state) {
    const normalized = normalizeStep(step);
    if (normalized === 2 && state.role !== 'school') {
      return 3;
    }
    return normalized;
  }

  function resolveHubPath(state) {
    if (state.role === 'student') return 'student-toolkit.html';
    if (state.role === 'parent') return 'parent-toolkit.html';
    if (state.role === 'school') {
      return HUB_BY_SCHOOL_ROLE[state.schoolRole || 'teacher'] || 'teacher-toolkit.html';
    }
    return 'student-toolkit.html';
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
      learnerName: role === 'school' ? String(state.learnerName || '').trim() : '',
      gradeBand: role === 'school' ? state.division : '',
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

  function openExistingQuickCheck() {
    const launchButton = document.getElementById('home-role-launch');
    const startButton = document.getElementById('placement-start');
    const calcButton = document.getElementById('placement-calc');

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

  function renderProgress(state) {
    const progress = progressForStep(state.step, state.role);
    if (!progress) return '';
    const percent = Math.round((progress.current / progress.total) * 100);
    return `
      <div class="cs-hv2-progress" aria-label="Progress">
        <div class="cs-hv2-progress-text">Step ${progress.current} of ${progress.total}</div>
        <div class="cs-hv2-progress-track" aria-hidden="true">
          <div class="cs-hv2-progress-fill" style="width:${percent}%;"></div>
        </div>
      </div>
    `;
  }

  function renderStepTemplate(root, state, content) {
    root.innerHTML = `
      <div class="cs-hv2-container">
        <section class="cs-hv2-card cs-hv2-onboard-card">
          ${renderProgress(state)}
          ${content}
          <div class="cs-hv2-build-stamp">HV2 Build: ${escapeHtml(cs_hv2_build_stamp)}</div>
        </section>
      </div>
    `;
  }

  function renderWelcome(root, state) {
    renderStepTemplate(
      root,
      state,
      `
        <h2 class="cs-hv2-title">Welcome to Cornerstone MTSS</h2>
        <p class="cs-hv2-subtitle">We'll ask a few quick questions to match you with the best starting point.</p>
        <div class="cs-hv2-actions cs-hv2-actions-right">
          <button class="cs-hv2-btn cs-hv2-btn-primary" data-action="begin">Begin</button>
        </div>
      `
    );
  }

  function renderRolePicker(root, state) {
    renderStepTemplate(
      root,
      state,
      `
        <h2 class="cs-hv2-title">Who is using Cornerstone today?</h2>
        <p class="cs-hv2-subtitle">Choose one option to continue.</p>
        <div class="cs-hv2-choice-grid" role="group" aria-label="Who is using Cornerstone today">
          <button class="cs-hv2-btn cs-hv2-btn-primary${state.role === 'student' ? ' cs-hv2-is-selected' : ''}" data-action="set-role" data-role="student" aria-pressed="${state.role === 'student'}">Student</button>
          <button class="cs-hv2-btn cs-hv2-btn-primary${state.role === 'parent' ? ' cs-hv2-is-selected' : ''}" data-action="set-role" data-role="parent" aria-pressed="${state.role === 'parent'}">Parent / Caregiver</button>
          <button class="cs-hv2-btn cs-hv2-btn-primary${state.role === 'school' ? ' cs-hv2-is-selected' : ''}" data-action="set-role" data-role="school" aria-pressed="${state.role === 'school'}">School Team</button>
        </div>
        <div class="cs-hv2-actions">
          <button class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button>
          <button class="cs-hv2-btn cs-hv2-btn-primary" data-action="continue" ${canContinue(state) ? '' : 'disabled'}>Continue</button>
        </div>
      `
    );
  }

  function renderSchoolInfo(root, state) {
    renderStepTemplate(
      root,
      state,
      `
        <h2 class="cs-hv2-title">Who are you supporting today?</h2>
        <p class="cs-hv2-subtitle">Share a few details so we can personalize your workspace.</p>
        <div class="cs-hv2-form-grid">
          <label class="cs-hv2-field">
            <span>Your name (optional)</span>
            <input id="cs-hv2-name" type="text" maxlength="80" value="${escapeHtml(state.learnerName)}" />
          </label>
          <label class="cs-hv2-field">
            <span>Division</span>
            <select id="cs-hv2-division">
              <option value="">Select division</option>
              <option value="ES" ${state.division === 'ES' ? 'selected' : ''}>ES</option>
              <option value="MS" ${state.division === 'MS' ? 'selected' : ''}>MS</option>
              <option value="HS" ${state.division === 'HS' ? 'selected' : ''}>HS</option>
            </select>
          </label>
          <label class="cs-hv2-field">
            <span>Role</span>
            <select id="cs-hv2-school-role">
              <option value="">Select role</option>
              ${SCHOOL_ROLES.map((role) => `<option value="${role.value}" ${state.schoolRole === role.value ? 'selected' : ''}>${role.label}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="cs-hv2-actions">
          <button class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button>
          <button class="cs-hv2-btn cs-hv2-btn-primary" data-action="continue" ${canContinue(state) ? '' : 'disabled'}>Continue</button>
        </div>
      `
    );
  }

  function renderFocusPicker(root, state) {
    renderStepTemplate(
      root,
      state,
      `
        <h2 class="cs-hv2-title">What are we focusing on today?</h2>
        <p class="cs-hv2-subtitle">Pick a focus area to launch the right Quick Check.</p>
        <div class="cs-hv2-choice-grid" role="group" aria-label="Focus selection">
          <button class="cs-hv2-btn cs-hv2-btn-primary${state.focus === 'literacy' ? ' cs-hv2-is-selected' : ''}" data-action="set-focus" data-focus="literacy" aria-pressed="${state.focus === 'literacy'}">Reading &amp; Words</button>
          <button class="cs-hv2-btn cs-hv2-btn-primary${state.focus === 'numeracy' ? ' cs-hv2-is-selected' : ''}" data-action="set-focus" data-focus="numeracy" aria-pressed="${state.focus === 'numeracy'}">Math &amp; Numbers</button>
          <button class="cs-hv2-btn cs-hv2-btn-primary${state.focus === 'both' ? ' cs-hv2-is-selected' : ''}" data-action="set-focus" data-focus="both" aria-pressed="${state.focus === 'both'}">Both</button>
        </div>
        <div class="cs-hv2-actions">
          <button class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button>
          <button class="cs-hv2-btn cs-hv2-btn-primary" data-action="continue" ${canContinue(state) ? '' : 'disabled'}>Continue</button>
        </div>
      `
    );
  }

  function renderQuickCheckStarter(root, state) {
    renderStepTemplate(
      root,
      state,
      `
        <h2 class="cs-hv2-title">Quick Check (5-8 minutes)</h2>
        <p class="cs-hv2-subtitle">A short adaptive check helps us match the right level and recommend next steps.</p>
        <div class="cs-hv2-actions">
          <button class="cs-hv2-btn cs-hv2-btn-secondary" data-action="back">Back</button>
          <div class="cs-hv2-action-group">
            <button class="cs-hv2-btn cs-hv2-btn-secondary" data-action="skip">Skip for now</button>
            <button class="cs-hv2-btn cs-hv2-btn-primary" data-action="start">Start Quick Check</button>
          </div>
        </div>
      `
    );
  }

  function showStep(stepIndex) {
    const root = document.getElementById('homeV2Root');
    if (!root) return;

    let state = readState();
    const normalized = normalizeVisibleStep(stepIndex, state);
    if (normalized !== state.step) {
      state = writeState({ step: normalized });
    }

    root.innerHTML = '';
    if (normalized === 0) renderWelcome(root, state);
    if (normalized === 1) renderRolePicker(root, state);
    if (normalized === 2) renderSchoolInfo(root, state);
    if (normalized === 3) renderFocusPicker(root, state);
    if (normalized === 4) renderQuickCheckStarter(root, state);
    attachListeners();
  }

  function attachListeners() {
    const root = document.getElementById('homeV2Root');
    if (!root) return;

    root.querySelector('[data-action="begin"]')?.addEventListener('click', () => {
      const state = writeState({ step: 1 });
      showStep(state.step);
    });

    root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      const state = readState();
      const next = writeState({ step: previousStep(state) });
      showStep(next.step);
    });

    root.querySelector('[data-action="continue"]')?.addEventListener('click', () => {
      const state = readState();
      if (!canContinue(state)) return;
      const next = writeState({ step: nextStep(state) });
      showStep(next.step);
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
      openExistingQuickCheck();
      startQuickCheckPolling();
    });

    root.querySelectorAll('[data-action="set-role"]').forEach((button) => {
      button.addEventListener('click', () => {
        const role = normalizeRole(button.getAttribute('data-role') || '');
        if (!role) return;
        const state = readState();
        writeState({
          role,
          schoolRole: role === 'school' ? state.schoolRole : null,
          learnerName: role === 'school' ? state.learnerName : '',
          division: role === 'school' ? state.division : '',
          focus: null,
          quickCheckStatus: 'not_started'
        });
        showStep(1);
      });
    });

    root.querySelectorAll('[data-action="set-focus"]').forEach((button) => {
      button.addEventListener('click', () => {
        const focus = normalizeFocus(button.getAttribute('data-focus') || '');
        if (!focus) return;
        writeState({ focus, quickCheckStatus: 'not_started' });
        showStep(3);
      });
    });

    root.querySelector('#cs-hv2-name')?.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      writeState({ learnerName: target.value });
    });

    root.querySelector('#cs-hv2-division')?.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      writeState({ division: normalizeDivision(target.value) });
      showStep(2);
    });

    root.querySelector('#cs-hv2-school-role')?.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      writeState({ schoolRole: normalizeSchoolRole(target.value) });
      showStep(2);
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
