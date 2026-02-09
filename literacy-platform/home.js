// Home page enhancements: placement screener + recommended next steps.
(function () {
  const PLACEMENT_KEY = 'decode_placement_v1';
  const SETTINGS_KEY = 'decode_settings';
  const HOME_VISUAL_MODE_KEY = 'cornerstone_home_visual_mode_v1';
  const HOME_DETAILS_MODE_KEY = 'cornerstone_home_details_mode_v1';
  const HOME_LANGUAGE_PREF_KEY = 'cornerstone_home_language_pref_v1';
  const HOME_VOICE_DIALECT_PREF_KEY = 'cornerstone_home_voice_dialect_pref_v1';
  const HOME_VOICE_PACK_PREF_KEY = 'cornerstone_home_voice_pack_pref_v1';
  const TTS_BASE_PREF_KEY = 'decode_tts_base_path_v1';
  const TTS_BASE_PLAIN = 'audio/tts';
  const TTS_BASE_SCOPED = 'literacy-platform/audio/tts';
  const QUICKCHECK_SUMMARY_KEY = 'cornerstone_quickcheck_summary_v1';
  const QUICKCHECK_SHUFFLE_KEY_PREFIX = 'cornerstone_quickcheck_queue_v2::';
  const HOME_STUDENT_NAME_KEY = 'cm_student_name';
  const HOME_GRADE_BAND_KEY = 'cm_grade_band';
  const HOME_STUDENT_EAL_KEY = 'cm_student_eal';
  const HOME_STUDENT_VIBE_KEY = 'cm_student_vibe';
  const HOME_PARENT_NAME_KEY = 'cm_parent_name';
  const HOME_PARENT_GRADE_KEY = 'cm_parent_grade_band';
  const HOME_PARENT_GOALS_KEY = 'cm_parent_goals';
  const HOME_PARENT_FOCUS_KEY = 'cm_parent_focus';
  const HOME_SCHOOL_NAME_KEY = 'cm_school_name';
  const HOME_SCHOOL_GRADE_KEY = 'cm_school_grade_band';
  const HOME_SCHOOL_CONCERN_KEY = 'cm_school_concern';
  const HOME_FOCUS_TODAY_KEY = 'cm_focus_today';
  const HOME_ROLE_WIZARD_KEY = 'cm_role';
  const HOME_WIZARD_STEP_KEY = 'cm_home_step';
  const HOME_NON_STUDENT_UNLOCK_KEY = 'cornerstone_home_non_student_unlock_v1';
  const HOME_ONBOARDING_STATE_KEY = 'cornerstone_home_onboarding_state_v1';

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
  const homeWhyStripEl = document.getElementById('home-why-strip');
  const homeHeroStepsEl = document.getElementById('home-hero-steps');
  const homeQuickLanguageSelect = document.getElementById('home-quick-language');
  const homeQuickVoiceDialectSelect = document.getElementById('home-quick-voice-dialect');
  const homeQuickVoicePackSelect = document.getElementById('home-quick-voice-pack');
  const homeQuickAutoHearToggle = document.getElementById('home-quick-autohear');
  const homeQuickLanguageNote = document.getElementById('home-quick-language-note');
  const homeQuickVoiceNote = document.getElementById('home-quick-voice-note');
  const homeRolePickButtons = Array.from(document.querySelectorAll('.home-role-pick[data-role-target]'));
  const homeEntryGroupButtons = Array.from(document.querySelectorAll('.home-entry-segment[data-entry-group]'));
  const homeWizard = document.getElementById('home-onboarding-wizard');
  const homeWizardSteps = Array.from(document.querySelectorAll('.home-step[data-step-index]'));
  const homeStepPanels = Array.from(document.querySelectorAll('.home-step-panel[data-home-step-panel]'));
  const homeStepSummaries = document.getElementById('home-step-summaries');
  const homeRoleStepNextBtn = document.getElementById('home-step-role-next');
  const homeDetailsStepBackBtn = document.getElementById('home-step-details-back');
  const homeDetailsStepNextBtn = document.getElementById('home-step-details-next');
  const homeFocusStepBackBtn = document.getElementById('home-step-focus-back');
  const homeFocusStepNextBtn = document.getElementById('home-step-focus-next');
  const homeQuickCheckStepBackBtn = document.getElementById('home-step-quickcheck-back');
  const homeSkipQuickCheckBtn = document.getElementById('home-skip-quickcheck');
  const homeQuickCheckLabelEl = document.getElementById('home-step-quickcheck-label');
  const homeQuickCheckHintEl = homeQuickCheckLabelEl?.parentElement?.querySelector('.home-mini-hint') || null;
  const homeTeamRoleWrap = document.getElementById('home-team-role-wrap');
  const homeTeamRoleSelect = document.getElementById('home-team-role-select');
  const homeParentSetup = document.getElementById('home-parent-setup');
  const homeStudentSetup = document.getElementById('home-student-setup');
  const homeSchoolSetup = document.getElementById('home-school-setup');
  const homeStudentNameInput = document.getElementById('home-student-name');
  const homeStudentEalToggle = document.getElementById('home-student-eal');
  const homeStudentVibeSelect = document.getElementById('home-student-vibe');
  const homeParentNameInput = document.getElementById('home-parent-name');
  const homeParentGradeSelect = document.getElementById('home-parent-grade');
  const homeParentFocusSelect = document.getElementById('home-parent-focus');
  const homeSchoolNameInput = document.getElementById('home-school-name');
  const homeSchoolGradeSelect = document.getElementById('home-school-grade');
  const homeSchoolConcernSelect = document.getElementById('home-school-concern');
  const homeParentGoalButtons = Array.from(document.querySelectorAll('.home-goal-btn[data-parent-goal]'));
  const homeGradeBandButtons = Array.from(document.querySelectorAll('.home-grade-band-btn[data-grade-band]'));
  const homeFocusButtons = Array.from(document.querySelectorAll('.home-focus-btn[data-focus-value]'));
  const homePostCheckCard = document.getElementById('home-post-check');
  const homePostCheckTitle = document.getElementById('home-post-check-title');
  const homePostCheckBullets = document.getElementById('home-post-check-bullets');
  const homePostCheckLaunch = document.getElementById('home-post-check-launch');
  const homePostCheckRerun = document.getElementById('home-post-check-rerun');
  const homeNextBest = document.getElementById('home-next-best');
  const homeNextBestTitle = document.getElementById('home-next-best-title');
  const homeNextBestCopy = document.getElementById('home-next-best-copy');
  const homeNextBestActions = document.getElementById('home-next-best-actions');
  const homeToolkit = document.getElementById('home-toolkit');
  const homeToolkitTitle = document.getElementById('home-toolkit-title');
  const homeToolkitGrid = document.getElementById('home-toolkit-grid');
  const placementSubtitle = document.getElementById('placement-subtitle');
  const quickCheckStage = document.getElementById('quickcheck-stage');

  const HOME_ENTRY_GROUP_KEY = 'cornerstone_home_entry_group_v1';
  const HOME_ENTRY_GROUP_DEFAULT_ROLE = Object.freeze({
    student: 'student',
    parent: 'parent',
    school: 'teacher'
  });
  const HOME_ROLE_ENTRY_GROUP = Object.freeze({
    student: 'student',
    parent: 'parent',
    teacher: 'school',
    admin: 'school',
    dean: 'school',
    'learning-support': 'school',
    slp: 'school',
    eal: 'school',
    counselor: 'school',
    psychologist: 'school'
  });

  const HOME_PARENT_GOAL_LABELS = Object.freeze({
    'homework-help': 'homework help',
    'reading-support': 'reading support',
    'math-support': 'math support',
    sel: 'SEL support',
    both: 'both',
    'parenting-supports': 'parenting supports'
  });

  function normalizeHomeVisualMode(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'calm' ? 'calm' : 'fun';
  }

  function normalizeHomeDetailsMode(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw === 'expanded' ? 'expanded' : 'collapsed';
  }

  function normalizeHomeEntryGroup(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'parent') return 'parent';
    if (raw === 'school') return 'school';
    return 'student';
  }

  function normalizeFocusToday(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'numeracy') return 'numeracy';
    if (raw === 'both') return 'both';
    return 'literacy';
  }

  function readFocusToday() {
    return normalizeFocusToday(localStorage.getItem(HOME_FOCUS_TODAY_KEY));
  }

  function readStudentName() {
    return String(localStorage.getItem(HOME_STUDENT_NAME_KEY) || '').trim();
  }

  function readStudentGradeBand() {
    return normalizeGradeBand(localStorage.getItem(HOME_GRADE_BAND_KEY) || '');
  }

  function readStudentIsEnglishLearner() {
    return localStorage.getItem(HOME_STUDENT_EAL_KEY) === '1';
  }

  function normalizeStudentVibe(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'fun') return 'fun';
    if (raw === 'calm') return 'calm';
    return '';
  }

  function readStudentVibe() {
    return normalizeStudentVibe(localStorage.getItem(HOME_STUDENT_VIBE_KEY) || '');
  }

  function readParentName() {
    return String(localStorage.getItem(HOME_PARENT_NAME_KEY) || '').trim();
  }

  function readParentGradeBand() {
    return normalizeGradeBand(localStorage.getItem(HOME_PARENT_GRADE_KEY) || '');
  }

  function readParentGoals() {
    const focused = String(localStorage.getItem(HOME_PARENT_FOCUS_KEY) || '').trim().toLowerCase();
    if (focused) return [focused];
    try {
      const parsed = JSON.parse(localStorage.getItem(HOME_PARENT_GOALS_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((value) => String(value || '').trim().toLowerCase())
        .filter(Boolean);
    } catch {
      return [];
    }
  }

  function writeParentGoals(goals = []) {
    const normalized = Array.from(new Set((Array.isArray(goals) ? goals : [])
      .map((value) => String(value || '').trim().toLowerCase())
      .filter(Boolean)));
    if (!normalized.length) {
      localStorage.removeItem(HOME_PARENT_GOALS_KEY);
      localStorage.removeItem(HOME_PARENT_FOCUS_KEY);
      return [];
    }
    localStorage.setItem(HOME_PARENT_GOALS_KEY, JSON.stringify(normalized));
    localStorage.setItem(HOME_PARENT_FOCUS_KEY, normalized[0]);
    return normalized;
  }

  function readSchoolName() {
    return String(localStorage.getItem(HOME_SCHOOL_NAME_KEY) || '').trim();
  }

  function readSchoolGradeBand() {
    return normalizeGradeBand(localStorage.getItem(HOME_SCHOOL_GRADE_KEY) || '');
  }

  function readSchoolConcern() {
    return String(localStorage.getItem(HOME_SCHOOL_CONCERN_KEY) || '').trim();
  }

  function readNonStudentUnlock() {
    return localStorage.getItem(HOME_NON_STUDENT_UNLOCK_KEY) === '1';
  }

  function writeNonStudentUnlock(enabled) {
    if (enabled) {
      localStorage.setItem(HOME_NON_STUDENT_UNLOCK_KEY, '1');
    } else {
      localStorage.removeItem(HOME_NON_STUDENT_UNLOCK_KEY);
    }
  }

  function activeOnboardingProfileId() {
    const learnerId = String(window.DECODE_PLATFORM?.getActiveLearnerId?.() || '').trim();
    if (learnerId) return `learner:${learnerId}`;
    const fallbackStudentName = readStudentName();
    if (fallbackStudentName) return `student:${fallbackStudentName.toLowerCase()}`;
    return 'global';
  }

  function readOnboardingStateMap() {
    const parsed = safeParse(localStorage.getItem(HOME_ONBOARDING_STATE_KEY) || '');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  }

  function writeOnboardingStateMap(map = {}) {
    const next = map && typeof map === 'object' && !Array.isArray(map) ? map : {};
    localStorage.setItem(HOME_ONBOARDING_STATE_KEY, JSON.stringify(next));
  }

  function readOnboardingProfileState() {
    const map = readOnboardingStateMap();
    const profileId = activeOnboardingProfileId();
    const state = map[profileId];
    if (!state || typeof state !== 'object' || Array.isArray(state)) return null;
    return state;
  }

  function collectOnboardingStateSnapshot(extra = {}) {
    const quickCheckPayload = Object.prototype.hasOwnProperty.call(extra, 'quickCheckPayload')
      ? extra.quickCheckPayload
      : load();
    const roleId = normalizeRoleId(localStorage.getItem(HOME_ROLE_WIZARD_KEY) || activeWizardRole()) || 'student';
    const quickCheckComplete = Object.prototype.hasOwnProperty.call(extra, 'quickCheckCompleted')
      ? !!extra.quickCheckCompleted
      : hasQuickCheckRecommendation(quickCheckPayload);
    const nonStudentUnlock = Object.prototype.hasOwnProperty.call(extra, 'nonStudentUnlock')
      ? !!extra.nonStudentUnlock
      : readNonStudentUnlock();
    const profileState = {
      profileId: activeOnboardingProfileId(),
      entryGroup: readHomeEntryGroup(),
      roleId,
      wizardStep: readWizardStep(),
      studentName: readStudentName(),
      gradeBand: readStudentGradeBand(),
      studentEal: readStudentIsEnglishLearner(),
      studentVibe: readStudentVibe(),
      parentName: readParentName(),
      parentGradeBand: readParentGradeBand(),
      parentGoals: readParentGoals(),
      schoolName: readSchoolName(),
      schoolGradeBand: readSchoolGradeBand(),
      schoolConcern: readSchoolConcern(),
      focusToday: readFocusToday(),
      nonStudentUnlock,
      quickCheckCompleted: quickCheckComplete,
      quickCheckUpdatedAt: String(quickCheckPayload?.updatedAt || ''),
      quickCheckPayload: quickCheckPayload && typeof quickCheckPayload === 'object' ? quickCheckPayload : null,
      updatedAt: new Date().toISOString()
    };
    return { ...profileState, ...extra };
  }

  function persistOnboardingProfileState(extra = {}) {
    const map = readOnboardingStateMap();
    const profileId = activeOnboardingProfileId();
    const previous = map[profileId] && typeof map[profileId] === 'object' ? map[profileId] : {};
    const next = { ...previous, ...collectOnboardingStateSnapshot(extra), profileId };
    map[profileId] = next;
    writeOnboardingStateMap(map);
    return next;
  }

  function applyOnboardingProfileState(state = null) {
    if (!state || typeof state !== 'object') return false;
    const setString = (key, value) => {
      const normalized = String(value || '').trim();
      if (normalized) {
        localStorage.setItem(key, normalized);
      } else {
        localStorage.removeItem(key);
      }
    };
    setString(HOME_ENTRY_GROUP_KEY, normalizeHomeEntryGroup(state.entryGroup || 'student'));
    setString(HOME_ROLE_WIZARD_KEY, normalizeRoleId(state.roleId || '') || 'student');
    localStorage.setItem(HOME_WIZARD_STEP_KEY, String(normalizeWizardStep(state.wizardStep || 1)));
    setString(HOME_STUDENT_NAME_KEY, state.studentName || '');
    setString(HOME_GRADE_BAND_KEY, normalizeGradeBand(state.gradeBand || ''));
    localStorage.setItem(HOME_STUDENT_EAL_KEY, state.studentEal ? '1' : '0');
    setString(HOME_STUDENT_VIBE_KEY, normalizeStudentVibe(state.studentVibe || ''));
    setString(HOME_PARENT_NAME_KEY, state.parentName || '');
    setString(HOME_PARENT_GRADE_KEY, normalizeGradeBand(state.parentGradeBand || ''));
    writeParentGoals(Array.isArray(state.parentGoals) ? state.parentGoals : []);
    setString(HOME_SCHOOL_NAME_KEY, state.schoolName || '');
    setString(HOME_SCHOOL_GRADE_KEY, normalizeGradeBand(state.schoolGradeBand || ''));
    setString(HOME_SCHOOL_CONCERN_KEY, state.schoolConcern || '');
    setString(HOME_FOCUS_TODAY_KEY, normalizeFocusToday(state.focusToday || 'literacy'));
    writeNonStudentUnlock(!!state.nonStudentUnlock);
    if (Object.prototype.hasOwnProperty.call(state, 'quickCheckPayload')) {
      if (state.quickCheckPayload && typeof state.quickCheckPayload === 'object') {
        localStorage.setItem(PLACEMENT_KEY, JSON.stringify(state.quickCheckPayload));
        localStorage.setItem(QUICKCHECK_SUMMARY_KEY, JSON.stringify(state.quickCheckPayload));
      } else {
        localStorage.removeItem(PLACEMENT_KEY);
        localStorage.removeItem(QUICKCHECK_SUMMARY_KEY);
      }
    }
    return true;
  }

  function hydrateOnboardingFromProfileState() {
    const state = readOnboardingProfileState();
    if (!state) return false;
    return applyOnboardingProfileState(state);
  }

  function normalizeWizardStep(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(1, Math.min(4, Math.round(numeric)));
  }

  function readWizardStep() {
    return normalizeWizardStep(localStorage.getItem(HOME_WIZARD_STEP_KEY) || 1);
  }

  function summarizeRoleSelection() {
    const group = readHomeEntryGroup();
    if (group === 'school') {
      const role = normalizeRoleId(homeTeamRoleSelect?.value || homeRoleSelect?.value || '');
      return HOME_ROLE_LABELS?.[role] || 'School Team';
    }
    if (group === 'parent') return 'Parent / Caregiver';
    return 'Student';
  }

  function summarizeWhoYouAre() {
    const group = readHomeEntryGroup();
    if (group === 'student') {
      const name = readStudentName();
      const band = readStudentGradeBand();
      const eal = readStudentIsEnglishLearner();
      const vibe = readStudentVibe();
      if (name && band && vibe) return `${name} (${band}) · ${vibe}`;
      if (name && band) return `${name} (${band})`;
      if (name && eal) return `${name} (learning English)`;
      if (name) return name;
      return 'Student details pending';
    }
    if (group === 'school') {
      const roleLabel = HOME_ROLE_LABELS?.[normalizeRoleId(homeTeamRoleSelect?.value || homeRoleSelect?.value || '')] || 'School Team';
      const schoolGrade = readSchoolGradeBand();
      if (schoolGrade) return `${roleLabel} (${schoolGrade})`;
      return roleLabel;
    }
    const parentName = readParentName();
    const parentBand = readParentGradeBand();
    const goals = readParentGoals();
    if (parentName && parentBand && goals.length) {
      return `${parentName} (${parentBand}) · ${HOME_PARENT_GOAL_LABELS[goals[0]] || goals[0]}`;
    }
    if (parentName && parentBand) return `${parentName} (${parentBand})`;
    if (parentName) return parentName;
    return 'Home support pathway';
  }

  function summarizeFocusSelection() {
    const focus = readFocusToday();
    if (focus === 'numeracy') return 'Math & Numbers';
    if (focus === 'both') return 'Reading & Words + Math & Numbers';
    return 'Reading & Words';
  }

  function isQuickCheckRequiredForGroup(group = readHomeEntryGroup()) {
    return normalizeHomeEntryGroup(group) === 'student';
  }

  function detailsStepComplete(group = readHomeEntryGroup()) {
    const normalizedGroup = normalizeHomeEntryGroup(group);
    if (normalizedGroup === 'student') {
      return !!readStudentName() && !!readStudentGradeBand();
    }
    if (normalizedGroup === 'parent') {
      return !!readParentName() && !!readParentGradeBand();
    }
    return true;
  }

  function quickCheckStepComplete(payload = load(), group = readHomeEntryGroup()) {
    const recommendationReady = hasQuickCheckRecommendation(payload);
    if (isQuickCheckRequiredForGroup(group)) return recommendationReady;
    return recommendationReady || readNonStudentUnlock();
  }

  function maxWizardStepForGroup(group = readHomeEntryGroup()) {
    const normalizedGroup = normalizeHomeEntryGroup(group);
    if (!detailsStepComplete(normalizedGroup)) return 2;
    return 4;
  }

  function refreshQuickCheckStepUi(payload = load()) {
    const group = readHomeEntryGroup();
    const required = isQuickCheckRequiredForGroup(group);
    const completed = quickCheckStepComplete(payload, group);
    if (homeQuickCheckLabelEl) {
      homeQuickCheckLabelEl.textContent = required
        ? 'Step 4 · Quick Check (required)'
        : 'Step 4 · Quick Check (optional)';
    }
    if (homeQuickCheckHintEl) {
      homeQuickCheckHintEl.textContent = required
        ? 'A short adaptive check (about 5–8 minutes) gives one clear starting point before activities open.'
        : 'A short adaptive check (about 5–8 minutes) gives one clear starting point. School Team and Parent roles can skip for now.';
    }
    if (homeRoleLaunchBtn) {
      homeRoleLaunchBtn.textContent = completed ? 'Run Quick Check Again' : (required ? 'Start Quick Check' : 'Run Quick Check');
    }
    if (homeSkipQuickCheckBtn) {
      homeSkipQuickCheckBtn.classList.toggle('hidden', required || completed);
    }
  }

  function renderWizardStepSummaries(activeStep = 1) {
    if (!homeStepSummaries) return;
    const summaries = [];
    if (activeStep > 1) {
      summaries.push({ step: 1, label: 'Role', value: summarizeRoleSelection() });
    }
    if (activeStep > 2) {
      summaries.push({ step: 2, label: 'Who you are', value: summarizeWhoYouAre() });
    }
    if (activeStep > 3) {
      summaries.push({ step: 3, label: 'Focus', value: summarizeFocusSelection() });
    }
    if (!summaries.length) {
      homeStepSummaries.classList.add('hidden');
      homeStepSummaries.innerHTML = '';
      return;
    }
    homeStepSummaries.classList.remove('hidden');
    homeStepSummaries.innerHTML = summaries.map((row) => `
      <div class="home-step-summary-chip">
        <span class="home-step-summary-label">${escapeHtml(row.label)}:</span>
        <span class="home-step-summary-value">${escapeHtml(row.value)}</span>
        <button type="button" class="home-step-summary-edit" data-edit-step="${row.step}">Edit</button>
      </div>
    `).join('');
  }

  function applyWizardPanels(activeStep = 1) {
    const safeStep = normalizeWizardStep(activeStep);
    homeStepPanels.forEach((panel) => {
      const step = Number(panel.dataset.homeStepPanel || panel.dataset.homeStep || 0);
      const isActive = step === safeStep;
      panel.classList.toggle('hidden', !isActive);
      panel.classList.toggle('active', isActive);
    });
    renderWizardStepSummaries(safeStep);
  }

  function applyWizardStepState(activeStep = 1, options = {}) {
    const maxStep = maxWizardStepForGroup(readHomeEntryGroup());
    const safeStep = Math.min(normalizeWizardStep(activeStep), maxStep);
    homeWizardSteps.forEach((stepEl) => {
      const idx = Number(stepEl.dataset.stepIndex || 0);
      stepEl.classList.toggle('active', idx === safeStep);
      stepEl.classList.toggle('complete', idx > 0 && idx < safeStep);
      const canJumpBack = idx > 0 && idx < safeStep;
      stepEl.disabled = !canJumpBack;
      stepEl.classList.toggle('clickable', canJumpBack);
      stepEl.setAttribute('aria-disabled', canJumpBack ? 'false' : 'true');
    });
    applyWizardPanels(safeStep);
    refreshQuickCheckStepUi();
    if (homeRolePreviewEl) {
      const summary = safeStep === 1
        ? 'Step 1 of 4: Choose role.'
        : safeStep === 2
          ? 'Step 2 of 4: Add who you are.'
        : safeStep === 3
            ? 'Step 3 of 4: Pick today’s focus.'
            : (isQuickCheckRequiredForGroup()
              ? 'Step 4 of 4: Complete Quick Check to unlock activities.'
              : 'Step 4 of 4: Run Quick Check or skip for now.');
      homeRolePreviewEl.textContent = summary;
    }
    if (options.persist) {
      localStorage.setItem(HOME_WIZARD_STEP_KEY, String(safeStep));
      persistOnboardingProfileState({ wizardStep: safeStep });
    }
    return safeStep;
  }

  function activeWizardStepForGroup(group, payload = load()) {
    const normalizedGroup = normalizeHomeEntryGroup(group);
    const storedStep = normalizeWizardStep(readWizardStep());
    const maxStep = maxWizardStepForGroup(normalizedGroup);
    const clampedStep = Math.min(storedStep, maxStep);
    if (clampedStep < 4) return clampedStep;
    if (quickCheckStepComplete(payload, normalizedGroup)) return 4;
    return 4;
  }

  function readHomeEntryGroup() {
    return normalizeHomeEntryGroup(localStorage.getItem(HOME_ENTRY_GROUP_KEY));
  }

  function getEntryGroupForRole(roleId) {
    const normalizedRole = normalizeRoleId(roleId) || 'teacher';
    return HOME_ROLE_ENTRY_GROUP[normalizedRole] || 'school';
  }

  function applyHomeEntryGroup(group, options = {}) {
    const normalizedGroup = normalizeHomeEntryGroup(group);
    const shouldPersist = !!options.persist;
    const preserveCurrentRole = !!options.preserveCurrentRole;

    homeEntryGroupButtons.forEach((button) => {
      const buttonGroup = normalizeHomeEntryGroup(button.dataset.entryGroup || '');
      const isActive = buttonGroup === normalizedGroup;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const visibleRoleButtons = [];
    homeRolePickButtons.forEach((button) => {
      const buttonGroup = normalizeHomeEntryGroup(button.dataset.entryGroup || '');
      const isVisible = buttonGroup === normalizedGroup;
      button.classList.toggle('hidden', !isVisible);
      if (isVisible) visibleRoleButtons.push(button);
    });

    const defaultRole = HOME_ENTRY_GROUP_DEFAULT_ROLE[normalizedGroup] || 'teacher';
    const selectedRole = normalizeRoleId(homeRoleSelect?.value || '');
    const selectedIsVisible = visibleRoleButtons.length
      ? visibleRoleButtons.some((button) => normalizeRoleId(button.dataset.roleTarget || '') === selectedRole)
      : getEntryGroupForRole(selectedRole) === normalizedGroup;
    if (!preserveCurrentRole && homeRoleSelect && (!selectedRole || !selectedIsVisible)) {
      homeRoleSelect.value = defaultRole;
    }

    if (homeTeamRoleWrap) {
      homeTeamRoleWrap.classList.toggle('hidden', normalizedGroup !== 'school');
    }
    if (homeParentSetup) {
      homeParentSetup.classList.toggle('hidden', normalizedGroup !== 'parent');
    }
    if (homeStudentSetup) {
      homeStudentSetup.classList.toggle('hidden', normalizedGroup !== 'student');
    }
    if (homeSchoolSetup) {
      homeSchoolSetup.classList.toggle('hidden', normalizedGroup !== 'school');
    }
    if (normalizedGroup === 'school' && homeTeamRoleSelect) {
      const teamRole = normalizeRoleId(homeTeamRoleSelect.value || '') || 'teacher';
      if (!preserveCurrentRole && homeRoleSelect) {
        homeRoleSelect.value = teamRole;
      }
    } else if (normalizedGroup === 'parent' && homeRoleSelect) {
      homeRoleSelect.value = 'parent';
    } else if (normalizedGroup === 'student' && homeRoleSelect) {
      homeRoleSelect.value = 'student';
    }

    const requestedStep = normalizeWizardStep(options.step || activeWizardStepForGroup(normalizedGroup));
    applyWizardStepState(requestedStep, { persist: shouldPersist });
    refreshQuickCheckStepUi();

    if (shouldPersist) {
      localStorage.setItem(HOME_ENTRY_GROUP_KEY, normalizedGroup);
      if (normalizedGroup === 'student') {
        writeNonStudentUnlock(false);
      }
      const wizardRole = normalizedGroup === 'school'
        ? (normalizeRoleId(homeTeamRoleSelect?.value || '') || normalizeRoleId(homeRoleSelect?.value || '') || 'teacher')
        : defaultRole;
      localStorage.setItem(HOME_ROLE_WIZARD_KEY, wizardRole);
      persistOnboardingProfileState({ entryGroup: normalizedGroup, roleId: wizardRole });
    }
    return normalizedGroup;
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
    const precheckLocked = document.body.classList.contains('home-precheck');
    const normalized = precheckLocked ? 'collapsed' : normalizeHomeDetailsMode(mode);
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

  function normalizeStarterLanguage(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (
      normalized === 'es' || normalized === 'zh' || normalized === 'tl'
      || normalized === 'ms' || normalized === 'vi' || normalized === 'hi'
      || normalized === 'ar' || normalized === 'ko' || normalized === 'ja'
    ) {
      return normalized;
    }
    return 'en';
  }

  function normalizeVoiceDialect(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return normalized === 'en-gb' ? 'en-GB' : 'en-US';
  }

  function normalizeVoicePackId(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return 'default';
    const cleaned = normalized.replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return cleaned || 'default';
  }

  function normalizeTtsBasePath(value) {
    const normalized = String(value || '').trim().replace(/^\/+|\/+$/g, '');
    if (normalized === TTS_BASE_PLAIN || normalized === TTS_BASE_SCOPED) {
      return normalized;
    }
    return '';
  }

  function readPreferredTtsBasePath() {
    try {
      return normalizeTtsBasePath(localStorage.getItem(TTS_BASE_PREF_KEY) || '');
    } catch {
      return '';
    }
  }

  function rememberPreferredTtsBasePath(value = '') {
    const normalized = normalizeTtsBasePath(value);
    if (!normalized) return;
    try {
      localStorage.setItem(TTS_BASE_PREF_KEY, normalized);
    } catch {}
  }

  function getTtsBasePathCandidates() {
    const preferred = readPreferredTtsBasePath();
    const pathname = String(window.location?.pathname || '').toLowerCase();
    const inferredPrimary = pathname.includes('/literacy-platform/') ? TTS_BASE_PLAIN : TTS_BASE_SCOPED;
    return Array.from(new Set([preferred, inferredPrimary, TTS_BASE_PLAIN, TTS_BASE_SCOPED].filter(Boolean)));
  }

  function readDecodeSettings() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {}
    return {};
  }

  function writeDecodeSettings(nextSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    window.dispatchEvent(new CustomEvent('decode:settings-updated', { detail: { source: 'home' } }));
  }

  function updateQuickLanguageNote(langCode) {
    if (!homeQuickLanguageNote) return;
    const lang = normalizeStarterLanguage(langCode);
    if (lang === 'en') {
      homeQuickLanguageNote.textContent = 'English-only mode selected. Full translation and audio can be enabled any time.';
      return;
    }
    const labelByLanguage = {
      es: 'Spanish',
      zh: 'Chinese',
      hi: 'Hindi',
      tl: 'Tagalog',
      ms: 'Malay',
      vi: 'Vietnamese',
      ar: 'Arabic',
      ko: 'Korean',
      ja: 'Japanese'
    };
    const label = labelByLanguage[lang] || lang.toUpperCase();
    if (lang === 'es' || lang === 'zh' || lang === 'tl' || lang === 'hi' || lang === 'ms' || lang === 'vi' || lang === 'ar' || lang === 'ko' || lang === 'ja') {
      homeQuickLanguageNote.textContent = `${label} is ready with full reveal translation. Packed audio plays when matching clips are installed.`;
      return;
    }
    homeQuickLanguageNote.textContent = `${label} is enabled as an optional language with school-safe reveal copy.`;
  }

  function updateQuickVoiceNote(dialect, packName = '') {
    if (!homeQuickVoiceNote) return;
    const dialectLabel = normalizeVoiceDialect(dialect) === 'en-GB' ? 'British English' : 'American English';
    const packLabel = String(packName || '').trim();
    if (packLabel && packLabel.toLowerCase() !== 'default voice pack') {
      homeQuickVoiceNote.textContent = `${dialectLabel} + ${packLabel} will load as your default classroom voice.`;
      return;
    }
    homeQuickVoiceNote.textContent = `${dialectLabel} narration is set as your default classroom voice.`;
  }

  async function loadQuickVoicePackOptions(selectedPackId = 'default') {
    if (!homeQuickVoicePackSelect) return 'default';

    const candidates = getTtsBasePathCandidates().map((base) => `${base}/packs/pack-registry.json`);
    let packs = [];
    for (const path of candidates) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) continue;
        const parsed = await response.json();
        const detectedBase = path.startsWith(`${TTS_BASE_PLAIN}/`) ? TTS_BASE_PLAIN : TTS_BASE_SCOPED;
        rememberPreferredTtsBasePath(detectedBase);
        if (parsed && Array.isArray(parsed.packs)) {
          packs = parsed.packs
            .filter((pack) => pack && typeof pack === 'object')
            .map((pack) => ({
              id: normalizeVoicePackId(pack.id),
              name: String(pack.name || pack.id || '').trim() || 'Voice Pack'
            }))
            .filter((pack) => pack.id && pack.id !== 'default');
          break;
        }
      } catch {}
    }

    homeQuickVoicePackSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = 'default';
    defaultOption.textContent = 'Default voice pack';
    homeQuickVoicePackSelect.appendChild(defaultOption);

    packs.forEach((pack) => {
      const option = document.createElement('option');
      option.value = pack.id;
      option.textContent = pack.name;
      homeQuickVoicePackSelect.appendChild(option);
    });

    const normalizedSelected = normalizeVoicePackId(selectedPackId);
    const hasSelected = Array.from(homeQuickVoicePackSelect.options).some((opt) => opt.value === normalizedSelected);
    homeQuickVoicePackSelect.value = hasSelected ? normalizedSelected : 'default';
    return homeQuickVoicePackSelect.value;
  }

  function initQuickStarterControls() {
    if (!homeQuickLanguageSelect && !homeQuickAutoHearToggle && !homeQuickVoiceDialectSelect && !homeQuickVoicePackSelect) return;
    const settings = readDecodeSettings();
    settings.translation = settings.translation && typeof settings.translation === 'object'
      ? settings.translation
      : { pinned: false, lang: 'en' };

    const preferredFromStorage = normalizeStarterLanguage(localStorage.getItem(HOME_LANGUAGE_PREF_KEY));
    const selectedLanguage = normalizeStarterLanguage(settings.translation.lang || preferredFromStorage);
    settings.translation.lang = selectedLanguage;
    settings.translation.pinned = selectedLanguage !== 'en';
    settings.voiceDialect = normalizeVoiceDialect(settings.voiceDialect || localStorage.getItem(HOME_VOICE_DIALECT_PREF_KEY) || 'en-US');
    settings.ttsPackId = normalizeVoicePackId(settings.ttsPackId || localStorage.getItem(HOME_VOICE_PACK_PREF_KEY) || 'default');

    if (homeQuickLanguageSelect) {
      homeQuickLanguageSelect.value = selectedLanguage;
      homeQuickLanguageSelect.addEventListener('change', () => {
        const nextLanguage = normalizeStarterLanguage(homeQuickLanguageSelect.value);
        const latest = readDecodeSettings();
        latest.translation = latest.translation && typeof latest.translation === 'object'
          ? latest.translation
          : { pinned: false, lang: 'en' };
        latest.translation.lang = nextLanguage;
        latest.translation.pinned = nextLanguage !== 'en';
        localStorage.setItem(HOME_LANGUAGE_PREF_KEY, nextLanguage);
        writeDecodeSettings(latest);
        updateQuickLanguageNote(nextLanguage);
      });
    }

    if (homeQuickAutoHearToggle) {
      homeQuickAutoHearToggle.checked = settings.autoHear !== false;
      homeQuickAutoHearToggle.addEventListener('change', () => {
        const latest = readDecodeSettings();
        latest.autoHear = !!homeQuickAutoHearToggle.checked;
        writeDecodeSettings(latest);
      });
    }

    if (homeQuickVoiceDialectSelect) {
      homeQuickVoiceDialectSelect.value = normalizeVoiceDialect(settings.voiceDialect || 'en-US');
      homeQuickVoiceDialectSelect.addEventListener('change', () => {
        const nextDialect = normalizeVoiceDialect(homeQuickVoiceDialectSelect.value);
        const latest = readDecodeSettings();
        latest.voiceDialect = nextDialect;
        localStorage.setItem(HOME_VOICE_DIALECT_PREF_KEY, nextDialect);
        writeDecodeSettings(latest);
        updateQuickVoiceNote(nextDialect, homeQuickVoicePackSelect?.selectedOptions?.[0]?.textContent || '');
      });
    }

    if (homeQuickVoicePackSelect) {
      loadQuickVoicePackOptions(settings.ttsPackId).then((resolvedPackId) => {
        const selectedPackId = normalizeVoicePackId(resolvedPackId);
        const latest = readDecodeSettings();
        latest.ttsPackId = selectedPackId;
        localStorage.setItem(HOME_VOICE_PACK_PREF_KEY, selectedPackId);
        writeDecodeSettings(latest);
        updateQuickVoiceNote(latest.voiceDialect || 'en-US', homeQuickVoicePackSelect?.selectedOptions?.[0]?.textContent || '');
      });

      homeQuickVoicePackSelect.addEventListener('change', () => {
        const selectedPackId = normalizeVoicePackId(homeQuickVoicePackSelect.value);
        const latest = readDecodeSettings();
        latest.ttsPackId = selectedPackId;
        localStorage.setItem(HOME_VOICE_PACK_PREF_KEY, selectedPackId);
        writeDecodeSettings(latest);
        updateQuickVoiceNote(latest.voiceDialect || 'en-US', homeQuickVoicePackSelect?.selectedOptions?.[0]?.textContent || '');
      });
    }

    updateQuickLanguageNote(selectedLanguage);
    localStorage.setItem(HOME_LANGUAGE_PREF_KEY, selectedLanguage);
    localStorage.setItem(HOME_VOICE_DIALECT_PREF_KEY, settings.voiceDialect);
    localStorage.setItem(HOME_VOICE_PACK_PREF_KEY, settings.ttsPackId);
    updateQuickVoiceNote(settings.voiceDialect, homeQuickVoicePackSelect?.selectedOptions?.[0]?.textContent || '');
    writeDecodeSettings(settings);
  }

  applyHomeVisualMode(readHomeVisualMode(), { persist: false });
  // Keep homepage first impression low-scroll every load; workspace remains one-click away.
  applyHomeDetailsMode('collapsed', { persist: false });
  initQuickStarterControls();
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

  if (!overlay || !modal || !summary || !calcBtn || !clearBtn || !result || !goWordQuest || !quickCheckStage) {
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

  const QUICKCHECK_LEVELS = {
    literacy: [
      { id: 'phonemic-awareness', label: 'Phonemic awareness', focus: 'cvc', length: '3', roundId: 'sound-sense' },
      { id: 'graphemes', label: 'Grapheme recognition', focus: 'cvc', length: '3', roundId: 'sound-sense' },
      { id: 'cvc', label: 'CVC decoding', focus: 'cvc', length: '3', roundId: 'word-building' },
      { id: 'digraphs-blends', label: 'Digraphs + blends', focus: 'digraph', length: '4', roundId: 'word-building' },
      { id: 'vowel-teams', label: 'Vowel teams', focus: 'vowel_team', length: '5', roundId: 'thirty-second-read' }
    ],
    numeracy: [
      { id: 'counting-quantity', label: 'Counting + quantity', roundId: 'number-sense' },
      { id: 'make-10', label: 'Making 10', roundId: 'strategy-check' },
      { id: 'place-value', label: 'Place value to 100', roundId: 'strategy-check' },
      { id: 'add-sub-strategies', label: 'Add/sub strategies', roundId: 'flexible-thinking' }
    ]
  };

  const QUICKCHECK_ROUND_META = {
    literacy: {
      'sound-sense': {
        title: 'Round 1 · Sound Sense',
        hint: 'Hear a sound, match the grapheme, then explain your choice.'
      },
      'word-building': {
        title: 'Round 2 · Word Building',
        hint: 'Use chunks and patterns to build or decode words.'
      },
      'thirty-second-read': {
        title: 'Round 3 · 30-second Read',
        hint: 'Choose the best pacing/prosody move for a short read.'
      }
    },
    numeracy: {
      'number-sense': {
        title: 'Round 1 · Number Sense',
        hint: 'Show quantity understanding and quick number structure.'
      },
      'strategy-check': {
        title: 'Round 2 · Strategy Check',
        hint: 'Pick a strategy path that fits the problem.'
      },
      'flexible-thinking': {
        title: 'Round 3 · Flexible Thinking',
        hint: 'Solve the same problem with a second method.'
      }
    }
  };

  const QUICKCHECK_STRATEGY_BANK = {
    literacy: {
      younger: {
        correct: ['I listened for the sound', 'I tapped each sound', 'I used letter clues', 'I checked my answer'],
        incorrect: ['Hear it again', 'Tap each sound slowly', 'Look for letter clues', 'Ask a helper']
      },
      older: {
        correct: ['I sounded it out', 'I used a chunk', 'I looked for patterns', 'I checked my choice'],
        incorrect: ['Hear it one more time', 'Slow down and sound it out', 'Look for a known pattern', 'Try a different clue']
      }
    },
    numeracy: {
      younger: {
        correct: ['I counted objects', 'I used fingers or dots', 'I made 10', 'I checked my answer'],
        incorrect: ['Count again slowly', 'Use a ten-frame', 'Try make-10', 'Ask for a number line']
      },
      older: {
        correct: ['I counted on', 'I made 10', 'I broke it apart', 'I used a number line'],
        incorrect: ['Count on and recheck', 'Try make-10 first', 'Break it apart', 'Use a visual model']
      }
    }
  };

  const QUICKCHECK_QUESTION_BANK = {
    literacy: [
      { id: 'lit-pa-1', level: 0, metric: 'accuracy', prompt: 'Which word starts with the same sound as sun?', choices: ['sock', 'cat', 'map', 'dog'], answer: 0 },
      { id: 'lit-pa-2', level: 0, metric: 'accuracy', prompt: 'What word do these sounds make: /m/ /a/ /p/?', choices: ['map', 'mop', 'tap', 'mat'], answer: 0 },
      { id: 'lit-pa-3', level: 0, metric: 'accuracy', prompt: 'Which word ends with the /t/ sound?', choices: ['cat', 'pig', 'fan', 'jam'], answer: 0 },
      { id: 'lit-gr-1', level: 1, metric: 'accuracy', prompt: 'Listen and pick the letters for the /sh/ sound.', audioPrompt: 'sh', choices: ['ch', 'th', 'sh', 'wh'], answer: 2 },
      { id: 'lit-gr-2', level: 1, metric: 'accuracy', prompt: 'Listen and pick the letters for the /th/ sound in "thin".', audioPrompt: 'th', choices: ['th', 'sh', 'wh', 'ch'], answer: 0 },
      { id: 'lit-gr-3', level: 1, metric: 'accuracy', prompt: 'Which letter team spells the long /e/ in "seed"?', choices: ['ea', 'ee', 'ie', 'oa'], answer: 1 },
      { id: 'lit-cvc-1', level: 2, metric: 'accuracy', prompt: 'Pick the set where both words are CVC words.', choices: ['cat + fin', 'rain + smile', 'ship + kite', 'boat + train'], answer: 0 },
      { id: 'lit-cvc-2', level: 2, metric: 'accuracy', prompt: 'Pick the set where both words are CVC words.', choices: ['sun + map', 'tree + rain', 'stone + grape', 'chair + boat'], answer: 0 },
      { id: 'lit-cvc-3', level: 2, metric: 'accuracy', prompt: 'Which word rhymes with "pin"?', choices: ['pan', 'pen', 'fin', 'fan'], answer: 2 },
      { id: 'lit-db-1', level: 3, metric: 'accuracy', prompt: 'Pick the word with an initial blend.', choices: ['ship', 'trip', 'chin', 'math'], answer: 1 },
      { id: 'lit-db-2', level: 3, metric: 'accuracy', prompt: 'Pick the word with a digraph.', choices: ['stop', 'frog', 'chat', 'clap'], answer: 2 },
      { id: 'lit-db-3', level: 3, metric: 'accuracy', prompt: 'Which word has a blend at the end?', choices: ['sand', 'ship', 'math', 'knee'], answer: 0 },
      { id: 'lit-read-1', level: 4, metric: 'rate', prompt: '30-second read: which pacing target is best?', choices: ['Race as fast as possible', 'Steady pace with clear stops', 'Pause after every word', 'Whisper very quietly'], answer: 1 },
      { id: 'lit-read-2', level: 4, metric: 'prosody', prompt: '30-second read: what shows strong prosody?', choices: ['Flat voice for every sentence', 'No pauses at punctuation', 'Expression that matches punctuation', 'Skip words to keep speed'], answer: 2 },
      { id: 'lit-read-3', level: 4, metric: 'prosody', prompt: 'When a sentence has a comma, what should the reader do?', choices: ['Take a short pause', 'Stop reading', 'Speed up', 'Drop the last word'], answer: 0 }
    ],
    numeracy: [
      { id: 'num-cq-1', level: 0, metric: 'number-sense', prompt: 'How many dots are there? ●●●●●', choices: ['4', '5', '6', '7'], answer: 1 },
      { id: 'num-cq-2', level: 0, metric: 'number-sense', prompt: 'What number comes after 39?', choices: ['38', '40', '41', '49'], answer: 1 },
      { id: 'num-m10-1', level: 1, metric: 'strategy-check', prompt: 'What makes 10 with 6?', choices: ['2', '3', '4', '5'], answer: 2 },
      { id: 'num-m10-2', level: 1, metric: 'strategy-check', prompt: '8 + __ = 10', choices: ['1', '2', '3', '4'], answer: 1 },
      { id: 'num-pv-1', level: 2, metric: 'strategy-check', prompt: 'In 47, the 4 means...', choices: ['4 ones', '4 tens', '40 ones', '7 tens'], answer: 1 },
      { id: 'num-pv-2', level: 2, metric: 'strategy-check', prompt: 'Which number is greater?', choices: ['58', '85', '55', '48'], answer: 1 },
      { id: 'num-flex-1', level: 3, metric: 'flexible-thinking', prompt: '38 + 25 can be solved another way by...', choices: ['Using only counting by ones', 'Making 100 by regrouping tens and ones', 'Ignoring the tens', 'Subtracting instead'], answer: 1 },
      { id: 'num-flex-2', level: 3, metric: 'flexible-thinking', prompt: 'For 42 - 9, a strong second strategy is to...', choices: ['Add 9 instead', 'Count back 9 or subtract 10 then add 1', 'Guess near 30 and stop', 'Skip the ones place'], answer: 1 },
      { id: 'num-flex-3', level: 3, metric: 'flexible-thinking', prompt: 'Which choice shows flexible thinking?', choices: ['Only one method every time', 'Try a second strategy to verify', 'Avoid visual models', 'Never check answers'], answer: 1 }
    ]
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
      writing: 'writing-studio.html',
      'plan-it': 'plan-it.html',
      'number-sense': 'number-sense.html',
      operations: 'operations.html',
      'problem-solving': 'number-sense.html',
      'math-language': 'number-sense.html',
      assessments: 'assessments.html',
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
          { title: 'Class Heatmap', body: `Red: ${literacyGap} · Yellow: ${numeracyGap} · Green: ${literacyStrength}.` },
          { title: 'One-Click Grouping', body: 'Create target groups and assign Word Quest/Number Sense in one pass.' },
          { title: 'Auto Reports', body: `Drafted progress notes + framework-aligned evidence. ${weeklyLine}` }
        ],
        actions: [
          { label: 'Open Teacher Report', href: roleReportHref('teacher', '#report-role-pathway'), kind: 'primary' },
          { label: 'Create Group Set', href: roleReportHref('teacher', '#report-intervention-timeline'), kind: 'ghost' },
          { label: 'Send Parent Note Draft', href: roleReportHref('teacher', '#report-parent-communication'), kind: 'ghost' }
        ]
      },
      admin: {
        label: 'Administrator',
        tagline: 'Building Tier 1. Strengthening Tier 2. Supporting Tier 3.',
        mission: 'Monitor implementation quality, evidence confidence, and support-intensity fit across teams.',
        cards: [
          { title: 'Tier Distribution', body: 'Track Tier 1 / Tier 2 / Tier 3 placement and movement each week.' },
          { title: 'Class-by-Class Heatmap', body: `Priority concentration: ${literacyGap} and ${numeracyGap}.` },
          { title: 'Intervention Impact', body: `Progress-over-time view with implementation checks. ${weeklyLine}` }
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
          { title: 'Speech + Literacy Tracker', body: 'Log articulation clarity, consistency, and transfer into decoding tasks.' },
          { title: 'Communication Lab', body: 'Target turn-taking, repair prompts, and body-language cues in short loops.' },
          { title: 'Intervention Target', body: `Priority targets: ${literacyGap} and ${numeracyGap}.` }
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
          { title: 'Articulation Tracker', body: 'Track accuracy, clarity, and consistency by target sound.' },
          { title: 'Communication Lab', body: 'Practice facial expression, body language, and conversation repair moves.' },
          { title: 'Transfer Anchor', body: `Use oral rehearsal to support ${numeracyGap} explanations in math language.` }
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
          { title: 'Communication Lab', body: 'Use conversational repair prompts: “I didn’t understand. Can you rephrase?”' },
          { title: 'Bridge To Classroom', body: 'Pair sentence frames with evidence responses in reading and math.' }
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
          { title: 'Wellbeing Quick Check', body: '5-minute check-in: feeling scale + top stressor + immediate support cue.' },
          { title: 'Skills Micro-Lessons', body: 'Friend conflict, pressure coping, digital boundaries, planning routines.' },
          { title: 'Student Voice', body: 'Each lesson ends with reflection, one action step, and one home prompt.' }
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
          { title: 'My Path', body: `Today focus: ${literacyGap}. You only get 2–3 short tasks to keep momentum high.` },
          { title: 'Fluency Studio', body: 'Read aloud, watch your wave, and earn Clear Speaker / Smooth Reader / Paced Well badges.' },
          { title: 'Sound Lab + Typing Quest', body: 'Practice target sounds, then type key words tied to your current literacy level.' }
        ],
        actions: [
          { label: 'Start Word Quest', href: context.wordQuestUrl, kind: 'primary' },
          { label: 'Open Fluency Studio', href: 'fluency.html', kind: 'ghost' },
          { label: 'Build Confidence (Plan-It)', href: 'plan-it.html', kind: 'ghost' }
        ]
      },
      parent: {
        label: 'Parent / Caregiver',
        tagline: 'Every learner supported, every step of the way.',
        mission: `Support ${learnerLabel} with simple, consistent home routines aligned to school goals.`,
        cards: [
          { title: 'Understand The Focus', body: `Reading: ${literacyGap}. Math: ${numeracyGap}. Plain language, no jargon.` },
          { title: 'Practice Together', body: '10 minutes/day with mini games and clear scripts for home routines.' },
          { title: 'Tech + Wellbeing', body: 'Supportive guidance for screen time, phone boundaries, and AI safety at home.' }
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
    const selectedEntryGroup = applyHomeEntryGroup(getEntryGroupForRole(normalizedRole), {
      persist: false,
      preserveCurrentRole: true
    });

    homeRolePickButtons.forEach((button) => {
      const targetRole = normalizeRoleId(button.dataset.roleTarget || '');
      const buttonGroup = normalizeHomeEntryGroup(button.dataset.entryGroup || '');
      const isActive = targetRole === normalizedRole && buttonGroup === selectedEntryGroup;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (homeRoleLaunchBtn) {
      homeRoleLaunchBtn.textContent = 'Start Quick Check';
      homeRoleLaunchBtn.setAttribute('data-role-target', normalizedRole);
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
    const pinState = resolvePinState();

    if (!homeRoleSelect.value || normalizeRoleId(homeRoleSelect.value) !== selectedRole) {
      homeRoleSelect.value = selectedRole;
    }
    updateRoleSelectorStudentLock(selectedRole === 'student' && !!pinState.strictMode);
    applyStudentMode(selectedRole);
    writePreferredRole(selectedRole);

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
        ? `Student Mode is active. Adults in any role can use "Unlock Adult Tools" in the top bar. ${pinModeLine} Recovery phrase can also unlock.`
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
    hydrateOnboardingFromProfileState();
    syncWizardFromStorage();
    editingLearnerId = '';
    const summaryPayload = load();
    renderSummary(summaryPayload);
    syncHomePrecheckState(summaryPayload);
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

  let quickCheckSession = null;

  function initialQuickCheckLevel(domain, gradeBand) {
    const band = normalizeGradeBand(gradeBand);
    if (domain === 'literacy') {
      if (band === '6-8' || band === '9-12') return 3;
      if (band === '3-5') return 2;
      return 1;
    }
    if (band === '6-8' || band === '9-12') return 2;
    if (band === '3-5') return 1;
    return 0;
  }

  function quickCheckDomainsForFocus(focusToday) {
    const normalized = normalizeFocusToday(focusToday);
    if (normalized === 'both') return ['literacy', 'numeracy'];
    return [normalized];
  }

  function shuffleList(items = []) {
    const next = Array.isArray(items) ? items.slice() : [];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const swap = Math.floor(Math.random() * (i + 1));
      [next[i], next[swap]] = [next[swap], next[i]];
    }
    return next;
  }

  function readQuickCheckQueue(scope = '') {
    const key = `${QUICKCHECK_SHUFFLE_KEY_PREFIX}${String(scope || '').trim()}`;
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '{}');
      return {
        key,
        queue: Array.isArray(parsed.queue) ? parsed.queue : [],
        last: typeof parsed.last === 'string' ? parsed.last : '',
        signature: typeof parsed.signature === 'string' ? parsed.signature : ''
      };
    } catch {
      return { key, queue: [], last: '', signature: '' };
    }
  }

  function writeQuickCheckQueue(state = {}) {
    if (!state.key) return;
    const payload = {
      queue: Array.isArray(state.queue) ? state.queue : [],
      last: typeof state.last === 'string' ? state.last : '',
      signature: typeof state.signature === 'string' ? state.signature : ''
    };
    localStorage.setItem(state.key, JSON.stringify(payload));
  }

  function pickQuickCheckFromQueue(items = [], scope = 'default') {
    const pool = Array.from(new Set((Array.isArray(items) ? items : []).filter(Boolean)));
    if (!pool.length) return '';
    if (pool.length === 1) return pool[0];
    const signature = `${pool.length}:${pool.slice().sort().join('|')}`;
    const state = readQuickCheckQueue(scope);
    let queue = state.queue.filter((item) => pool.includes(item));
    if (state.signature !== signature || !queue.length) {
      queue = shuffleList(pool);
      if (queue.length > 1 && state.last && queue[queue.length - 1] === state.last) {
        [queue[0], queue[queue.length - 1]] = [queue[queue.length - 1], queue[0]];
      }
    }
    const selected = queue.pop() || pool[0];
    writeQuickCheckQueue({
      key: state.key,
      queue,
      last: selected,
      signature
    });
    return selected;
  }

  function isYoungerQuickCheckBand(gradeBand = '') {
    const band = normalizeGradeBand(gradeBand);
    return !band || band === 'K-2';
  }

  function getQuickCheckStrategies(domain, { gradeBand = '', isCorrect = true } = {}) {
    const pack = QUICKCHECK_STRATEGY_BANK[domain] || QUICKCHECK_STRATEGY_BANK.literacy;
    const lane = isYoungerQuickCheckBand(gradeBand) ? 'younger' : 'older';
    const selectedPack = pack[lane] || pack.older || pack.younger;
    if (!selectedPack) return [];
    const options = selectedPack[isCorrect ? 'correct' : 'incorrect'] || [];
    return Array.isArray(options) ? options : [];
  }

  function pickQuestionForLevel(domain, targetLevel, askedIds) {
    const pool = (QUICKCHECK_QUESTION_BANK[domain] || []).filter((question) => !askedIds.has(question.id));
    if (!pool.length) return null;
    const exactPool = pool.filter((question) => Number(question.level) === Number(targetLevel));
    const targetPool = exactPool.length
      ? exactPool
      : pool
        .slice()
        .sort((a, b) => Math.abs(Number(a.level) - Number(targetLevel)) - Math.abs(Number(b.level) - Number(targetLevel)));
    if (!targetPool.length) return null;
    const selectedId = pickQuickCheckFromQueue(
      targetPool.map((question) => question.id),
      `${domain}:level:${targetLevel}`
    );
    return targetPool.find((question) => question.id === selectedId) || targetPool[0];
  }

  function activeWizardRole() {
    const group = readHomeEntryGroup();
    const storedRole = normalizeRoleId(localStorage.getItem(HOME_ROLE_WIZARD_KEY) || '');
    if (group === 'student') return 'student';
    if (group === 'parent') return 'parent';
    if (group === 'school') {
      return normalizeRoleId(homeTeamRoleSelect?.value || '') || storedRole || normalizeRoleId(homeRoleSelect?.value || '') || 'teacher';
    }
    return storedRole || normalizeRoleId(homeRoleSelect?.value || '') || 'student';
  }

  function createQuickCheckSession(options = {}) {
    const roleId = normalizeRoleId(options.roleId || activeWizardRole()) || 'student';
    const entryGroup = getEntryGroupForRole(roleId);
    const gradeBand = normalizeGradeBand(options.gradeBand || readStudentGradeBand());
    const focusToday = normalizeFocusToday(options.focusToday || readFocusToday());
    const domains = quickCheckDomainsForFocus(focusToday);
    const asked = {};
    const counts = {};
    const correct = {};
    const levels = {};
    const highestCorrectLevel = {};
    domains.forEach((domain) => {
      asked[domain] = new Set();
      counts[domain] = 0;
      correct[domain] = 0;
      levels[domain] = initialQuickCheckLevel(domain, gradeBand);
      highestCorrectLevel[domain] = -1;
    });
    return {
      roleId,
      entryGroup,
      studentName: options.studentName || readStudentName(),
      gradeBand,
      focusToday,
      domains,
      domainIndex: 0,
      counts,
      correct,
      levels,
      highestCorrectLevel,
      asked,
      pendingAnswer: null,
      strategyLog: [],
      history: [],
      metricBuckets: createMetricBuckets(),
      currentQuestion: null,
      maxQuestionsPerDomain: 5
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

  function quickCheckCurrentDomain(session) {
    if (!session) return '';
    return session.domains[session.domainIndex] || '';
  }

  function advanceQuickCheckQuestion(session) {
    if (!session) return null;
    while (session.domainIndex < session.domains.length) {
      const domain = quickCheckCurrentDomain(session);
      const askedCount = Number(session.counts[domain] || 0);
      if (askedCount >= session.maxQuestionsPerDomain) {
        session.domainIndex += 1;
        continue;
      }
      const level = Number(session.levels[domain] || 0);
      const nextQuestion = pickQuestionForLevel(domain, level, session.asked[domain]);
      if (!nextQuestion) {
        session.domainIndex += 1;
        continue;
      }
      session.currentQuestion = nextQuestion;
      session.asked[domain].add(nextQuestion.id);
      return nextQuestion;
    }
    session.currentQuestion = null;
    return null;
  }

  function setQuickCheckButtonState(inProgress) {
    calcBtn.textContent = inProgress ? 'Restart Quick Check' : 'Start Quick Check';
  }

  function setFocusButtons(value, options = {}) {
    const normalized = normalizeFocusToday(value);
    homeFocusButtons.forEach((button) => {
      const isActive = normalizeFocusToday(button.dataset.focusValue || '') === normalized;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    if (options.persist) {
      localStorage.setItem(HOME_FOCUS_TODAY_KEY, normalized);
      persistOnboardingProfileState({ focusToday: normalized });
    }
    return normalized;
  }

  function setGradeBandButtons(value, options = {}) {
    const normalized = normalizeGradeBand(value || '');
    homeGradeBandButtons.forEach((button) => {
      const isActive = normalizeGradeBand(button.dataset.gradeBand || '') === normalized;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    if (options.persist) {
      if (normalized) {
        localStorage.setItem(HOME_GRADE_BAND_KEY, normalized);
      } else {
        localStorage.removeItem(HOME_GRADE_BAND_KEY);
      }
      persistOnboardingProfileState({ gradeBand: normalized });
    }
    return normalized;
  }

  function setParentGoalButtons(goals = [], options = {}) {
    const normalized = writeParentGoals(goals);
    const selectedSet = new Set(normalized);
    if (homeParentFocusSelect) {
      homeParentFocusSelect.value = normalized[0] || '';
    }
    homeParentGoalButtons.forEach((button) => {
      const goal = String(button.dataset.parentGoal || '').trim().toLowerCase();
      const isActive = selectedSet.has(goal);
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    if (options.persist) {
      persistOnboardingProfileState({ parentGoals: normalized });
    }
    return normalized;
  }

  function quickCheckLevelLabel(domain, levelIndex) {
    const levels = QUICKCHECK_LEVELS[domain] || [];
    const safeIndex = Math.max(0, Math.min(levels.length - 1, Number(levelIndex) || 0));
    return levels[safeIndex]?.label || 'Starting point';
  }

  function quickCheckLevelMeta(domain, levelIndex) {
    const levels = QUICKCHECK_LEVELS[domain] || [];
    const safeIndex = Math.max(0, Math.min(levels.length - 1, Number(levelIndex) || 0));
    return levels[safeIndex] || null;
  }

  function quickCheckRoundMeta(domain, levelIndex) {
    const levelMeta = quickCheckLevelMeta(domain, levelIndex);
    const roundId = String(levelMeta?.roundId || '').trim();
    const domainMeta = QUICKCHECK_ROUND_META[domain] || {};
    if (roundId && domainMeta[roundId]) return domainMeta[roundId];
    const fallbackKey = Object.keys(domainMeta)[0];
    return fallbackKey ? domainMeta[fallbackKey] : { title: 'Quick Check', hint: 'Pick one answer and keep going.' };
  }

  function createMetricBuckets() {
    const makeBucket = () => ({ total: 0, correct: 0 });
    return {
      literacy: {
        accuracy: makeBucket(),
        rate: makeBucket(),
        prosody: makeBucket()
      },
      numeracy: {
        'number-sense': makeBucket(),
        'strategy-check': makeBucket(),
        'flexible-thinking': makeBucket()
      }
    };
  }

  function metricKeyForQuestion(domain, question = null) {
    const raw = String(question?.metric || '').trim().toLowerCase();
    if (domain === 'literacy') {
      if (raw === 'rate') return 'rate';
      if (raw === 'prosody') return 'prosody';
      return 'accuracy';
    }
    if (raw === 'number-sense' || raw === 'strategy-check' || raw === 'flexible-thinking') {
      return raw;
    }
    return 'strategy-check';
  }

  function updateMetricBuckets(session, domain, question, isCorrect) {
    const key = metricKeyForQuestion(domain, question);
    const domainBuckets = session?.metricBuckets?.[domain];
    if (!domainBuckets || !domainBuckets[key]) return;
    domainBuckets[key].total += 1;
    if (isCorrect) domainBuckets[key].correct += 1;
  }

  function metricPercent(bucket) {
    const total = Number(bucket?.total || 0);
    const correct = Number(bucket?.correct || 0);
    if (total <= 0) return 0;
    return Math.round((correct / total) * 100);
  }

  function quickCheckBand(score = 0) {
    if (score >= 85) return 'green';
    if (score >= 65) return 'yellow';
    return 'red';
  }

  function buildFluencyGrowthSnapshot() {
    const logs = getRecentActivityEntries()
      .filter((entry) => String(entry?.activity || '').toLowerCase() === 'fluency')
      .sort((a, b) => Number(a?.ts || 0) - Number(b?.ts || 0))
      .slice(-6);
    return logs.map((entry) => {
      const when = Number(entry?.ts || 0);
      const detail = entry?.detail || {};
      const orf = Number(detail.orf || entry?.score || 0);
      const accuracy = Number(detail.accuracyPct || 0);
      return {
        date: when ? new Date(when).toLocaleDateString() : '—',
        orf: Number.isFinite(orf) ? Number(orf.toFixed(0)) : 0,
        accuracy: Number.isFinite(accuracy) ? Number(accuracy.toFixed(0)) : 0
      };
    });
  }

  function buildPathwayPlanner(payload = {}) {
    const recommendation = payload?.recommendation || {};
    const literacy = payload?.domains?.literacy || null;
    const numeracy = payload?.domains?.numeracy || null;
    const literacyNeed = literacy?.levelLabel || 'decoding patterns';
    const numeracyNeed = numeracy?.levelLabel || 'number strategy checks';
    const primaryLabel = recommendation.activityLabel || 'Word Quest';
    const primaryFocus = recommendation.headline || 'Targeted practice lane';

    const today = [
      `8 min ${primaryLabel}: ${primaryFocus}`,
      '5 min Fluency Studio: live read coach with clear-speaker badges',
      '3 min Sound Lab: targeted phoneme or strategy loop'
    ];

    const groups = [
      `Group A: blends/digraph support (${literacyNeed})`,
      `Group B: vowel teams and transfer practice`,
      `Group C: fluency/prosody with strategy reflection`
    ];

    return {
      today,
      groups,
      teacherSummary: [
        `Likely literacy gap: ${literacyNeed}.`,
        `Likely numeracy gap: ${numeracyNeed}.`
      ]
    };
  }

  function buildFluencyStudioSnapshot(payload = {}, session = null) {
    const literacySummary = payload?.domains?.literacy || null;
    const literacyBuckets = session?.metricBuckets?.literacy || {};
    const accuracyScore = literacySummary?.accuracy || metricPercent(literacyBuckets.accuracy);
    const rateFromItems = metricPercent(literacyBuckets.rate);
    const prosodyFromItems = metricPercent(literacyBuckets.prosody);
    const rateScore = literacyBuckets.rate?.total ? rateFromItems : Math.max(55, Math.round((accuracyScore || 0) * 0.9));
    const prosodyScore = literacyBuckets.prosody?.total ? prosodyFromItems : Math.max(58, Math.round((accuracyScore || 0) * 0.92));
    const growth = buildFluencyGrowthSnapshot();
    return {
      accuracyScore,
      rateScore,
      prosodyScore,
      badges: [
        { label: 'Clear Speaker', score: accuracyScore, band: quickCheckBand(accuracyScore) },
        { label: 'Smooth Reader', score: prosodyScore, band: quickCheckBand(prosodyScore) },
        { label: 'Paced Well', score: rateScore, band: quickCheckBand(rateScore) }
      ],
      growth
    };
  }

  function playQuickCheckPromptAudio(question = null) {
    const text = String(question?.audioPrompt || '').trim();
    if (!text) return;
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
    try {
      const utterance = new SpeechSynthesisUtterance(`Listen: ${text}`);
      utterance.lang = 'en-US';
      utterance.rate = 0.82;
      utterance.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  function summarizeQuickCheckDomain(session, domain) {
    const total = Number(session.counts[domain] || 0);
    const correct = Number(session.correct[domain] || 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const highestCorrect = Number(session.highestCorrectLevel[domain] || -1);
    const fallbackLevel = Number(session.levels[domain] || 0);
    const safeLevel = Math.max(0, Math.min((QUICKCHECK_LEVELS[domain] || []).length - 1, highestCorrect >= 0 ? highestCorrect : fallbackLevel));
    const roundMeta = quickCheckRoundMeta(domain, safeLevel);
    return {
      domain,
      total,
      correct,
      accuracy,
      levelIndex: safeLevel,
      levelLabel: quickCheckLevelLabel(domain, safeLevel),
      roundTitle: roundMeta?.title || 'Quick Check'
    };
  }

  function recommendationFromQuickCheck(summaryPayload) {
    const domains = summaryPayload?.domains || {};
    const focusToday = normalizeFocusToday(summaryPayload?.focusToday || 'literacy');
    const literacy = domains.literacy || null;
    const numeracy = domains.numeracy || null;
    let selectedDomain = focusToday;
    if (focusToday === 'both') {
      if (literacy && numeracy) {
        selectedDomain = literacy.accuracy <= numeracy.accuracy ? 'literacy' : 'numeracy';
      } else {
        selectedDomain = literacy ? 'literacy' : 'numeracy';
      }
    }

    if (selectedDomain === 'numeracy' && numeracy) {
      const level = numeracy.levelIndex;
      if (level <= 0) {
        return {
          focus: 'all',
          length: 'any',
          headline: 'Start with Number Sense: counting and quantity.',
          notes: 'Use concrete visuals first, then quick verbal checks.',
          teacherLead: 'Likely gap: mapping quantity to numerals.',
          activityLabel: 'Number Sense Lab',
          activityHref: 'number-sense.html?lane=counting',
          ctaLabel: 'Start Number Sense'
        };
      }
      if (level === 1) {
        return {
          focus: 'all',
          length: 'any',
          headline: 'Start with Number Sense: making 10.',
          notes: 'Use make-10 strategy cards and short number talks.',
          teacherLead: 'Likely gap: making 10 efficiently with visual anchors.',
          activityLabel: 'Number Sense Lab',
          activityHref: 'number-sense.html?lane=make10',
          ctaLabel: 'Start Number Sense'
        };
      }
      if (level === 2) {
        return {
          focus: 'all',
          length: 'any',
          headline: 'Start with Number Sense: place value to 100.',
          notes: 'Bridge tens and ones with visual models before timed practice.',
          teacherLead: 'Likely strength: place-value language with visual models.',
          activityLabel: 'Number Sense Lab',
          activityHref: 'number-sense.html?lane=place-value',
          ctaLabel: 'Start Number Sense'
        };
      }
      return {
        focus: 'all',
        length: 'any',
        headline: 'Start with strategy-first operations practice.',
        notes: 'Prioritize explain-your-thinking prompts before speed goals.',
        teacherLead: 'Likely strength: flexible strategy choice. Likely gap: second-method verification.',
        activityLabel: 'Strategy Studio',
        activityHref: 'operations.html?lane=strategy',
        ctaLabel: 'Start Strategy Studio'
      };
    }

    const literacyLevel = literacy?.levelIndex ?? 0;
    const levels = QUICKCHECK_LEVELS.literacy || [];
    const levelMeta = levels[Math.max(0, Math.min(levels.length - 1, literacyLevel))] || levels[0];
    const notesByLevel = {
      'phonemic-awareness': 'Use listen-repeat routines and short sound-box rounds.',
      graphemes: 'Practice sound-symbol mapping before adding word chains.',
      cvc: 'Use short-vowel contrast sets and immediate feedback loops.',
      'digraphs-blends': 'Mix digraphs and blends in short, high-success rounds.',
      'vowel-teams': 'Use one vowel team at a time with clear examples.'
    };
    return {
      focus: levelMeta?.focus || 'cvc',
      length: levelMeta?.length || '3',
      headline: `Start with ${(levelMeta?.label || 'CVC decoding').toLowerCase()} in Word Quest.`,
      notes: notesByLevel[levelMeta?.id] || 'Use short rounds and explicit strategy language.',
      teacherLead: levelMeta?.id === 'vowel-teams'
        ? 'Likely needs Tier 2 support in: vowel teams + blends.'
        : 'Likely needs Tier 2 support in targeted decoding patterns.',
      activityLabel: 'Word Quest',
      activityHref: wordQuestHref(levelMeta?.focus || 'cvc', levelMeta?.length || '3'),
      ctaLabel: 'Start Word Quest'
    };
  }

  function buildQuickCheckPayload(session) {
    const domains = {};
    session.domains.forEach((domain) => {
      domains[domain] = summarizeQuickCheckDomain(session, domain);
    });
    const payload = {
      version: 2,
      roleId: session.roleId,
      entryGroup: session.entryGroup,
      studentName: session.studentName || '',
      gradeBand: session.gradeBand || '',
      focusToday: session.focusToday,
      domains,
      metricBuckets: session.metricBuckets,
      strategyLog: session.strategyLog.slice(),
      updatedAt: new Date().toISOString()
    };
    payload.recommendation = recommendationFromQuickCheck(payload);
    payload.pathwayPlanner = buildPathwayPlanner(payload);
    payload.fluencyStudio = buildFluencyStudioSnapshot(payload, session);
    return payload;
  }

  function store(data) {
    localStorage.setItem(PLACEMENT_KEY, JSON.stringify(data));
    localStorage.setItem(QUICKCHECK_SUMMARY_KEY, JSON.stringify(data));
    persistOnboardingProfileState({
      quickCheckPayload: data,
      quickCheckCompleted: hasQuickCheckRecommendation(data),
      nonStudentUnlock: readNonStudentUnlock()
    });
  }

  function load() {
    const parsed = safeParse(localStorage.getItem(PLACEMENT_KEY) || '') || safeParse(localStorage.getItem(QUICKCHECK_SUMMARY_KEY) || '');
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  }

  function hasQuickCheckRecommendation(payload = load()) {
    return !!(payload && typeof payload === 'object' && payload.recommendation);
  }

  function renderHomePostCheckCard(payload = null) {
    if (!homePostCheckCard || !homePostCheckTitle || !homePostCheckBullets || !homePostCheckLaunch) return;
    const recommendation = payload?.recommendation || null;
    if (!recommendation) {
      homePostCheckCard.classList.add('hidden');
      homePostCheckTitle.textContent = 'Run Quick Check to get a recommendation.';
      homePostCheckBullets.innerHTML = '';
      homePostCheckLaunch.href = 'word-quest.html';
      return;
    }
    const literacySummary = payload?.domains?.literacy;
    const numeracySummary = payload?.domains?.numeracy;
    const planner = payload?.pathwayPlanner;
    const fluency = payload?.fluencyStudio;
    const bullets = [];
    if (recommendation.headline) bullets.push(recommendation.headline);
    if (literacySummary) bullets.push(`Literacy: ${literacySummary.levelLabel} (${literacySummary.correct}/${literacySummary.total} correct)`);
    if (numeracySummary) bullets.push(`Numeracy: ${numeracySummary.levelLabel} (${numeracySummary.correct}/${numeracySummary.total} correct)`);
    if (recommendation.notes) bullets.push(recommendation.notes);
    if (recommendation.teacherLead) bullets.push(`Teacher cue: ${recommendation.teacherLead}`);
    if (planner?.today?.length) bullets.push(`Today: ${planner.today[0]}`);
    if (planner?.today?.[1]) bullets.push(`Then: ${planner.today[1]}`);
    if (fluency?.badges?.length) {
      const badgeLine = fluency.badges.map((badge) => `${badge.label} ${badge.score}%`).join(' · ');
      bullets.push(`Fluency Studio: ${badgeLine}`);
    }
    if (payload?.entryGroup === 'school' && planner?.groups?.length) {
      bullets.push(`Auto groups: ${planner.groups[0]}`);
      if (planner.groups[1]) bullets.push(planner.groups[1]);
    }

    homePostCheckCard.classList.remove('hidden');
    homePostCheckTitle.textContent = recommendation.activityLabel || 'Start recommended path';
    homePostCheckBullets.innerHTML = bullets.slice(0, 3).map((line) => `<li>${escapeHtml(line)}</li>`).join('');
    homePostCheckLaunch.href = String(recommendation.activityHref || wordQuestHref(recommendation.focus, recommendation.length));
  }

  function renderHomeNextBestActions(payload = null, { unlocked = false } = {}) {
    if (!homeNextBest || !homeNextBestTitle || !homeNextBestCopy || !homeNextBestActions) return;
    if (!unlocked) {
      homeNextBest.classList.add('hidden');
      homeNextBestActions.innerHTML = '';
      return;
    }
    const roleId = normalizeRoleId(activeWizardRole()) || 'student';
    const focus = readFocusToday();
    const recommendation = payload?.recommendation || null;
    const defaultWordQuestHref = recommendation?.activityHref || wordQuestHref(recommendation?.focus, recommendation?.length);
    const numeracyHref = 'number-sense.html';
    const focusHref = focus === 'numeracy'
      ? numeracyHref
      : focus === 'both'
        ? defaultWordQuestHref
        : defaultWordQuestHref;

    const variants = {
      student: {
        title: 'Student pathway',
        copy: 'Follow one short path at a time and keep your streak moving.',
        actions: [
          { label: 'Start Recommended Path', href: focusHref, kind: 'primary' },
          { label: 'Student Toolkit (Coming Soon)', href: 'student-toolkit.html', kind: 'ghost' },
          { label: 'Open Fluency Studio', href: 'fluency.html', kind: 'ghost' },
          { label: 'View Progress', href: 'teacher-report.html?role=student#report-outcomes', kind: 'ghost' }
        ]
      },
      parent: {
        title: 'Parent / Caregiver pathway',
        copy: 'Use one clear home action tonight, then share progress back to school.',
        actions: [
          { label: 'Tonight Plan', href: focusHref, kind: 'primary' },
          { label: 'Parent Toolkit (Coming Soon)', href: 'parent-toolkit.html', kind: 'ghost' },
          { label: 'Parent Report', href: 'teacher-report.html?role=parent#report-parent-communication', kind: 'ghost' },
          { label: 'Open Tools', href: 'plan-it.html', kind: 'ghost' }
        ]
      },
      school: {
        title: 'School Team pathway',
        copy: 'Use quick evidence, form groups, then launch the next intervention block.',
        actions: [
          { label: 'Open Teacher Report', href: `teacher-report.html?role=${encodeURIComponent(roleId)}`, kind: 'primary' },
          { label: `${HOME_ROLE_LABELS[roleId] || 'School Team'} Toolkit (Coming Soon)`, href: roleToolkitHref(roleId), kind: 'ghost' },
          { label: 'Launch Word Quest', href: defaultWordQuestHref, kind: 'ghost' },
          { label: 'Launch Number Sense', href: numeracyHref, kind: 'ghost' }
        ]
      }
    };
    const entryGroup = normalizeHomeEntryGroup(readHomeEntryGroup());
    const model = entryGroup === 'student'
      ? variants.student
      : entryGroup === 'parent'
        ? variants.parent
        : variants.school;
    homeNextBest.classList.remove('hidden');
    homeNextBestTitle.textContent = model.title;
    homeNextBestCopy.textContent = model.copy;
    homeNextBestActions.innerHTML = model.actions
      .map((action) => `<a class="home-cta ${action.kind === 'primary' ? 'primary' : 'ghost'}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`)
      .join('');
  }

  function roleToolkitHref(roleId = '') {
    const normalized = normalizeRoleId(roleId);
    if (normalized === 'teacher') return 'teacher-toolkit.html';
    if (normalized === 'learning-support') return 'learning-support-toolkit.html';
    if (normalized === 'eal') return 'eal-toolkit.html';
    if (normalized === 'slp') return 'slp-toolkit.html';
    if (normalized === 'counselor') return 'counselor-toolkit.html';
    if (normalized === 'psychologist') return 'psychologist-toolkit.html';
    if (normalized === 'admin') return 'administrator-toolkit.html';
    if (normalized === 'dean') return 'dean-toolkit.html';
    if (normalized === 'parent') return 'parent-toolkit.html';
    return 'student-toolkit.html';
  }

  function renderHomeToolkitPanel(payload = null, { unlocked = false } = {}) {
    if (!homeToolkit || !homeToolkitTitle || !homeToolkitGrid) return;
    if (!unlocked) {
      homeToolkit.classList.add('hidden');
      homeToolkitGrid.innerHTML = '';
      return;
    }
    const roleId = normalizeRoleId(activeWizardRole()) || 'student';
    const entryGroup = normalizeHomeEntryGroup(readHomeEntryGroup());
    const recommendation = payload?.recommendation || null;
    const recommendedHref = String(recommendation?.activityHref || wordQuestHref(recommendation?.focus, recommendation?.length));
    const schoolToolkitHref = roleToolkitHref(roleId);
    const tiles = entryGroup === 'student'
      ? [
          { title: 'Start Recommended Path', body: 'Continue from your Quick Check result.', href: recommendedHref },
          { title: 'Student Toolkit (Coming Soon)', body: 'Streaks, strategy badges, and guided practice flow.', href: 'student-toolkit.html' },
          { title: 'Writing Studio (Coming Soon)', body: 'Plan, draft, revise, publish with clear scaffolds.', href: 'writing-studio.html' },
          { title: 'Explore Math & Numbers', body: 'Quick number sense and strategy routines.', href: 'number-sense.html' }
        ]
      : entryGroup === 'parent'
        ? [
            { title: 'Parent Toolkit (Coming Soon)', body: 'How to help tonight with calm, clear routines.', href: 'parent-toolkit.html' },
            { title: 'Start Recommended Path', body: 'One clear activity to run tonight.', href: recommendedHref },
            { title: 'Writing Studio (Coming Soon)', body: 'Step Up-aligned writing support in one place.', href: 'writing-studio.html' },
            { title: 'View Parent Report', body: 'Progress snapshot you can share with school.', href: 'teacher-report.html?role=parent#report-parent-communication' }
          ]
        : [
            { title: 'School Team Toolkit Hub', body: 'Role-specific toolkit pages and roadmap previews.', href: 'school-team-toolkit.html' },
            { title: `${HOME_ROLE_LABELS[roleId] || 'School Team'} Toolkit (Coming Soon)`, body: 'Role-aligned workflows and intervention supports.', href: schoolToolkitHref },
            { title: 'Start Recommended Path', body: 'Launch the top activity from Quick Check.', href: recommendedHref },
            { title: 'Open Impact Dashboard', body: 'View trends, groups, and report outputs.', href: `teacher-report.html?role=${encodeURIComponent(roleId)}` }
          ];

    homeToolkit.classList.remove('hidden');
    homeToolkitTitle.textContent = entryGroup === 'school'
      ? `${HOME_ROLE_LABELS[roleId] || 'School Team'} toolkit`
      : entryGroup === 'parent'
        ? 'Parent toolkit'
        : 'Student toolkit';
    homeToolkitGrid.innerHTML = tiles
      .map((tile) => `
        <a class="home-toolkit-tile" href="${escapeHtml(tile.href)}">
          <div class="home-toolkit-tile-title">${escapeHtml(tile.title)}</div>
          <div class="home-toolkit-tile-copy">${escapeHtml(tile.body)}</div>
        </a>
      `)
      .join('');
  }

  function syncHomePrecheckState(payload = load()) {
    const entryGroup = readHomeEntryGroup();
    const completed = hasQuickCheckRecommendation(payload);
    const unlocked = isQuickCheckRequiredForGroup(entryGroup)
      ? completed
      : (completed || readNonStudentUnlock());
    document.body.classList.toggle('home-precheck', !unlocked);
    document.body.classList.toggle('home-quickcheck-complete', unlocked);
    if (unlocked && readWizardStep() < 4) {
      localStorage.setItem(HOME_WIZARD_STEP_KEY, '4');
    }
    document.querySelectorAll('[data-precheck-hidden], [data-home-detail]').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      node.classList.toggle('hidden', !unlocked);
    });
    if (homeRolePreviewEl) {
      homeRolePreviewEl.classList.toggle('hidden', unlocked);
    }
    if (homeWhyStripEl) {
      homeWhyStripEl.classList.toggle('hidden', unlocked);
    }
    if (homeHeroStepsEl) {
      homeHeroStepsEl.classList.toggle('hidden', unlocked);
    }
    if (!unlocked) {
      applyHomeDetailsMode('collapsed', { persist: false });
    }
    renderHomePostCheckCard(payload);
    renderHomeNextBestActions(payload, { unlocked: false });
    renderHomeToolkitPanel(payload, { unlocked: false });
    refreshQuickCheckStepUi(payload);
    persistOnboardingProfileState({
      quickCheckPayload: payload,
      quickCheckCompleted: completed,
      nonStudentUnlock: readNonStudentUnlock()
    });
  }

  function showResult(payload) {
    const rec = payload?.recommendation || null;
    if (!rec) {
      result.classList.remove('hidden');
      result.innerHTML = '<div class="placement-result-title">Quick Check complete</div><div class="muted">No recommendation generated. Please run it again.</div>';
      return;
    }
    const literacySummary = payload?.domains?.literacy;
    const numeracySummary = payload?.domains?.numeracy;
    const planner = payload?.pathwayPlanner;
    const fluencyStudio = payload?.fluencyStudio;
    const studentName = String(payload?.studentName || '').trim();
    const kidLead = studentName
      ? `Nice work, ${escapeHtml(studentName)}. You are ready to start here.`
      : 'Nice work. You are ready to start here.';
    const teacherRows = [literacySummary, numeracySummary]
      .filter(Boolean)
      .map((domainSummary) => `<li>${escapeHtml(domainSummary.roundTitle || domainSummary.levelLabel)} · ${domainSummary.correct}/${domainSummary.total} correct</li>`)
      .join('');
    const todayRows = Array.isArray(planner?.today)
      ? planner.today.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '';
    const groupRows = Array.isArray(planner?.groups)
      ? planner.groups.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '';
    const badgeRows = Array.isArray(fluencyStudio?.badges)
      ? fluencyStudio.badges.map((badge) => `<li><strong>${escapeHtml(badge.label)}</strong>: ${badge.score}% (${escapeHtml(badge.band)})</li>`).join('')
      : '';
    const growthBars = Array.isArray(fluencyStudio?.growth)
      ? fluencyStudio.growth.slice(-4).map((row) => `
        <div class="home-growth-row">
          <span>${escapeHtml(row.date)}</span>
          <div class="home-growth-bar"><i style="width:${Math.max(8, Math.min(100, Number(row.accuracy || 0)))}%"></i></div>
          <span>${escapeHtml(String(row.accuracy || 0))}%</span>
        </div>
      `).join('')
      : '';

    result.classList.remove('hidden');
    result.innerHTML = `
      <div class="placement-result-title">You are ready to start here</div>
      <div class="placement-result-main">${kidLead}</div>
      <div class="muted" style="margin-top:6px;"><strong>${escapeHtml(rec.activityLabel || 'Recommended activity')}</strong>: ${escapeHtml(rec.headline || '')}</div>
      ${rec.notes ? `<div class="muted" style="margin-top:6px;">${escapeHtml(rec.notes)}</div>` : ''}
      ${rec.teacherLead ? `<div class="muted" style="margin-top:6px;"><strong>Teacher cue:</strong> ${escapeHtml(rec.teacherLead)}</div>` : ''}
      <div class="placement-teacher-block" style="margin-top:10px;">
        <div class="home-mini-title">Teacher view</div>
        <ul class="home-progress-list" style="margin-top:4px;">${teacherRows || '<li>No domain summary available.</li>'}</ul>
      </div>
      ${todayRows ? `
        <div class="placement-teacher-block" style="margin-top:10px;">
          <div class="home-mini-title">Pathway Planner · Today</div>
          <ul class="home-progress-list" style="margin-top:4px;">${todayRows}</ul>
        </div>
      ` : ''}
      ${groupRows ? `
        <div class="placement-teacher-block" style="margin-top:10px;">
          <div class="home-mini-title">Auto groups</div>
          <ul class="home-progress-list" style="margin-top:4px;">${groupRows}</ul>
        </div>
      ` : ''}
      ${badgeRows ? `
        <div class="placement-teacher-block" style="margin-top:10px;">
          <div class="home-mini-title">Fluency Studio badges</div>
          <ul class="home-progress-list" style="margin-top:4px;">${badgeRows}</ul>
        </div>
      ` : ''}
      ${growthBars ? `
        <div class="placement-teacher-block" style="margin-top:10px;">
          <div class="home-mini-title">Weekly fluency growth</div>
          <div class="home-growth-grid">${growthBars}</div>
        </div>
      ` : ''}
    `;
    const href = String(rec.activityHref || wordQuestHref(rec.focus, rec.length));
    goWordQuest.href = href;
    goWordQuest.textContent = rec.ctaLabel || 'Start Recommended Path';
    goWordQuest.classList.remove('hidden');
    syncHomePrecheckState(payload);
  }

  function renderSummary(data) {
    if (!summary) return;

    if (!data || !data.recommendation) {
      summary.innerHTML = `
        <div class="home-mini-title">Current recommendation</div>
        <div class="muted">Not set yet. Run Quick Check to get a starting path.</div>
      `;
      if (openWordQuest) openWordQuest.href = 'word-quest.html';
      renderHomePostCheckCard(null);
      return;
    }

    const rec = data.recommendation;
    const updated = data.updatedAt ? new Date(data.updatedAt) : null;
    const updatedText = updated && !Number.isNaN(updated.getTime())
      ? updated.toLocaleDateString()
      : '—';

    const literacySummary = data?.domains?.literacy;
    const numeracySummary = data?.domains?.numeracy;
    const planner = data?.pathwayPlanner;
    const summaryParts = [];
    if (literacySummary) summaryParts.push(`Literacy: ${literacySummary.levelLabel}`);
    if (numeracySummary) summaryParts.push(`Numeracy: ${numeracySummary.levelLabel}`);
    if (planner?.today?.[0]) summaryParts.push(`Today: ${planner.today[0]}`);

    summary.innerHTML = `
      <div class="home-mini-title">Current recommendation</div>
      <div class="home-placement-line"><strong>${escapeHtml(rec.activityLabel || 'Next path')}</strong> · updated <strong>${updatedText}</strong></div>
      <div class="muted">${escapeHtml(rec.headline || '')}</div>
      ${rec.teacherLead ? `<div class="muted">${escapeHtml(rec.teacherLead)}</div>` : ''}
      ${summaryParts.length ? `<div class="muted">${summaryParts.map((part) => escapeHtml(part)).join(' · ')}</div>` : ''}
    `;

    const href = String(rec.activityHref || wordQuestHref(rec.focus, rec.length));
    goWordQuest.href = href;
    if (openWordQuest) openWordQuest.href = href;
    renderHomePostCheckCard(data);
  }

  function renderQuickCheckIntro() {
    const group = readHomeEntryGroup();
    const roleId = activeWizardRole();
    const studentName = readStudentName();
    const gradeBand = readStudentGradeBand();
    const focusToday = readFocusToday();
    const roleLabel = HOME_ROLE_LABELS[roleId] || 'Student';
    const focusLabel = focusToday === 'numeracy'
      ? 'Math & Numbers'
      : focusToday === 'both'
        ? 'Reading & Words + Math & Numbers'
        : 'Reading & Words';
    const roundsCopy = focusToday === 'numeracy'
      ? 'Rounds: Number Sense → Strategy Check → Flexible Thinking.'
      : focusToday === 'both'
        ? 'Rounds: Literacy Sound Sense + Word Building + 30-second Read, then Numeracy Number Sense + Strategy + Flexible Thinking.'
        : 'Rounds: Sound Sense → Word Building → 30-second Read.';
    const nameLine = group === 'student' && studentName
      ? `<div class="quickcheck-inline-note">Learner: <strong>${escapeHtml(studentName)}</strong>${gradeBand ? ` (${escapeHtml(gradeBand)})` : ''}</div>`
      : '';
    if (placementSubtitle) {
      placementSubtitle.textContent = group === 'student'
        ? 'An adaptive check (about 5–8 minutes) to find the best starting point.'
        : 'A short adaptive check to set a clear first step for this pathway.';
    }
    quickCheckStage.innerHTML = `
      <div class="quickcheck-card">
        <div class="quickcheck-title">Ready to run Quick Check?</div>
        <p class="quickcheck-copy">Role: <strong>${escapeHtml(roleLabel)}</strong> · Focus: <strong>${escapeHtml(focusLabel)}</strong>.</p>
        ${nameLine}
        <p class="quickcheck-copy">${escapeHtml(roundsCopy)}</p>
        <p class="quickcheck-copy">${group === 'student'
    ? 'You will answer short adaptive items, then get a pathway plan with one clear next step.'
    : 'You can run this now for data-rich placement, or skip from Home and return later.'}</p>
      </div>
    `;
    result.classList.add('hidden');
    goWordQuest.classList.add('hidden');
    setQuickCheckButtonState(false);
  }

  function renderQuickCheckQuestion(session, options = {}) {
    const domain = quickCheckCurrentDomain(session);
    const reviewPending = !!options.reviewPending && !!session.pendingAnswer;
    const question = reviewPending
      ? session.pendingAnswer.question
      : (session.currentQuestion || advanceQuickCheckQuestion(session));
    if (!question) {
      const payload = buildQuickCheckPayload(session);
      store(payload);
      syncProfileAndLook(payload.gradeBand || '');
      showResult(payload);
      renderSummary(payload);
      quickCheckStage.innerHTML = `
        <div class="quickcheck-card quickcheck-complete">
          <div class="quickcheck-progress">Quick Check complete</div>
          <div class="quickcheck-title">Your recommended next step is ready below.</div>
          <p class="quickcheck-copy">Use Start Recommended Path to begin, or restart this check any time.</p>
        </div>
      `;
      setQuickCheckButtonState(true);
      return;
    }
    session.currentQuestion = question;
    const index = Number(session.counts[domain] || 0) + 1;
    const total = session.maxQuestionsPerDomain;
    const progressLabel = domain === 'literacy' ? 'Literacy Quick Check' : 'Numeracy Quick Check';
    const roundMeta = quickCheckRoundMeta(domain, Number(question.level || 0));
    const selectedIndex = reviewPending ? Number(session.pendingAnswer?.selectedIndex) : Number.NaN;
    const hasAudioPrompt = !!String(question.audioPrompt || '').trim();
    const promptHint = hasAudioPrompt ? 'Listen first, then pick one answer.' : 'Pick one answer.';
    quickCheckStage.innerHTML = `
      <div class="quickcheck-card">
        <div class="quickcheck-progress">${escapeHtml(progressLabel)} · ${escapeHtml(roundMeta.title || 'Round')} · Item ${index} of ${total}</div>
        <div class="quickcheck-title">${escapeHtml(question.prompt)}</div>
        <div class="quickcheck-inline-note">${escapeHtml(roundMeta.hint || '')}</div>
        ${hasAudioPrompt ? `
          <div class="quickcheck-listen-row">
            <button type="button" class="secondary-btn quickcheck-listen-btn" data-action="play-prompt-audio">Hear sound</button>
          </div>
        ` : ''}
        <div class="quickcheck-copy">${escapeHtml(promptHint)}</div>
        <div class="quickcheck-choice-grid">
          ${question.choices.map((choice, choiceIndex) => `
            <button type="button" class="quickcheck-choice${choiceIndex === selectedIndex ? ' selected' : ''}" data-choice-index="${choiceIndex}">
              ${escapeHtml(choice)}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    if (hasAudioPrompt) {
      playQuickCheckPromptAudio(question);
    }
  }

  function renderQuickCheckPostAnswer(session) {
    const pending = session.pendingAnswer;
    if (!pending) return;
    const question = pending.question;
    const domain = pending.domain;
    const isCorrect = !!pending.correct;
    const roundMeta = quickCheckRoundMeta(domain, Number(question?.level || 0));
    const strategies = getQuickCheckStrategies(domain, {
      gradeBand: session.gradeBand,
      isCorrect
    });
    const strategyPrompt = isCorrect
      ? 'What helped you figure it out?'
      : 'What could help on the next one?';
    const answerLine = isCorrect
      ? `Answer selected: <strong>${escapeHtml(question.choices[pending.selectedIndex] || '')}</strong>`
      : `Answer selected: <strong>${escapeHtml(question.choices[pending.selectedIndex] || '')}</strong> · Best answer: <strong>${escapeHtml(question.choices[question.answer] || '')}</strong>`;
    quickCheckStage.innerHTML = `
      <div class="quickcheck-card">
        <div class="quickcheck-progress">${escapeHtml(roundMeta.title || 'Quick Check')}</div>
        <div class="quickcheck-feedback ${isCorrect ? 'success' : 'needs-support'}">${isCorrect ? 'Nice work.' : 'Good effort. Let’s keep going.'}</div>
        <div class="quickcheck-copy">${escapeHtml(strategyPrompt)}</div>
        <div class="quickcheck-strategy-grid">
          ${strategies.map((strategy) => `
            <button type="button" class="quickcheck-strategy-chip" data-strategy="${escapeHtml(strategy)}">${escapeHtml(strategy)}</button>
          `).join('')}
        </div>
        <div class="quickcheck-copy">${answerLine}</div>
        <div class="quickcheck-next-row">
          <button type="button" class="secondary-btn quickcheck-back-btn" data-action="review-question">Back</button>
          <button type="button" class="primary-btn quickcheck-next-btn" data-action="next-question">Next</button>
        </div>
      </div>
    `;
  }

  function startQuickCheck(options = {}) {
    quickCheckSession = createQuickCheckSession(options);
    result.classList.add('hidden');
    goWordQuest.classList.add('hidden');
    setQuickCheckButtonState(true);
    renderQuickCheckQuestion(quickCheckSession);
  }

  function syncWizardFromStorage() {
    hydrateOnboardingFromProfileState();
    const group = readHomeEntryGroup();
    const storedRole = normalizeRoleId(localStorage.getItem(HOME_ROLE_WIZARD_KEY) || '');
    const role = group === 'school'
      ? (storedRole || normalizeRoleId(homeTeamRoleSelect?.value || '') || 'teacher')
      : group === 'parent'
        ? 'parent'
        : 'student';
    if (homeRoleSelect) {
      homeRoleSelect.value = role;
    }
    if (homeTeamRoleSelect && group === 'school') {
      homeTeamRoleSelect.value = role;
    }
    const resolvedGroup = getEntryGroupForRole(role);
    applyHomeEntryGroup(resolvedGroup, { persist: false, preserveCurrentRole: true });
    if (homeStudentNameInput) {
      homeStudentNameInput.value = readStudentName();
    }
    if (homeStudentEalToggle) {
      homeStudentEalToggle.checked = readStudentIsEnglishLearner();
    }
    if (homeStudentVibeSelect) {
      homeStudentVibeSelect.value = readStudentVibe();
    }
    if (homeParentNameInput) {
      homeParentNameInput.value = readParentName();
    }
    if (homeParentGradeSelect) {
      homeParentGradeSelect.value = readParentGradeBand();
    }
    if (homeParentFocusSelect) {
      homeParentFocusSelect.value = readParentGoals()[0] || '';
    }
    if (homeSchoolNameInput) {
      homeSchoolNameInput.value = readSchoolName();
    }
    if (homeSchoolGradeSelect) {
      homeSchoolGradeSelect.value = readSchoolGradeBand();
    }
    if (homeSchoolConcernSelect) {
      homeSchoolConcernSelect.value = readSchoolConcern();
    }
    setParentGoalButtons(readParentGoals(), { persist: false });
    setGradeBandButtons(readStudentGradeBand(), { persist: false });
    setFocusButtons(readFocusToday(), { persist: false });
    refreshQuickCheckStepUi();
  }

  function handleQuickCheckStageClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !quickCheckSession) return;

    const playPromptBtn = target.closest('[data-action="play-prompt-audio"]');
    if (playPromptBtn) {
      const question = quickCheckSession.pendingAnswer?.question || quickCheckSession.currentQuestion;
      playQuickCheckPromptAudio(question);
      return;
    }

    const choiceBtn = target.closest('.quickcheck-choice');
    if (choiceBtn) {
      const activeQuestion = quickCheckSession.pendingAnswer?.question || quickCheckSession.currentQuestion;
      if (!activeQuestion) return;
      const domain = quickCheckSession.pendingAnswer?.domain || quickCheckCurrentDomain(quickCheckSession);
      const selectedIndex = Number(choiceBtn.getAttribute('data-choice-index'));
      if (Number.isNaN(selectedIndex)) return;
      const isCorrect = selectedIndex === Number(activeQuestion.answer);
      if (quickCheckSession.pendingAnswer && quickCheckSession.pendingAnswer.question?.id === activeQuestion.id) {
        quickCheckSession.pendingAnswer.selectedIndex = selectedIndex;
        quickCheckSession.pendingAnswer.correct = isCorrect;
      } else {
        quickCheckSession.pendingAnswer = {
          domain,
          question: activeQuestion,
          selectedIndex,
          correct: isCorrect,
          strategy: ''
        };
      }
      renderQuickCheckPostAnswer(quickCheckSession);
      return;
    }

    const strategyBtn = target.closest('.quickcheck-strategy-chip');
    if (strategyBtn && quickCheckSession.pendingAnswer) {
      const strategy = String(strategyBtn.getAttribute('data-strategy') || '').trim();
      quickCheckSession.pendingAnswer.strategy = strategy;
      quickCheckStage.querySelectorAll('.quickcheck-strategy-chip').forEach((chip) => {
        chip.classList.toggle('active', chip === strategyBtn);
      });
      return;
    }

    const reviewBtn = target.closest('[data-action="review-question"]');
    if (reviewBtn && quickCheckSession.pendingAnswer) {
      renderQuickCheckQuestion(quickCheckSession, { reviewPending: true });
      return;
    }

    const nextBtn = target.closest('[data-action="next-question"]');
    if (nextBtn && quickCheckSession.pendingAnswer) {
      const pending = quickCheckSession.pendingAnswer;
      const question = pending.question;
      const domain = pending.domain;
      const isCorrect = Number(pending.selectedIndex) === Number(question.answer);
      updateMetricBuckets(quickCheckSession, domain, question, isCorrect);
      const roundMeta = quickCheckRoundMeta(domain, Number(question.level || 0));
      quickCheckSession.counts[domain] = Number(quickCheckSession.counts[domain] || 0) + 1;
      if (isCorrect) {
        quickCheckSession.correct[domain] = Number(quickCheckSession.correct[domain] || 0) + 1;
        quickCheckSession.highestCorrectLevel[domain] = Math.max(Number(quickCheckSession.highestCorrectLevel[domain] || -1), Number(question.level) || 0);
        quickCheckSession.levels[domain] = Math.min((QUICKCHECK_LEVELS[domain] || []).length - 1, Number(quickCheckSession.levels[domain] || 0) + 1);
      } else {
        quickCheckSession.levels[domain] = Math.max(0, Number(quickCheckSession.levels[domain] || 0) - 1);
      }
      quickCheckSession.strategyLog.push({
        domain,
        round: roundMeta?.title || '',
        questionId: question.id,
        strategy: pending.strategy || 'Not selected',
        correct: !!isCorrect
      });
      quickCheckSession.history.push({
        domain,
        questionId: question.id,
        selectedIndex: pending.selectedIndex,
        correct: !!isCorrect
      });
      quickCheckSession.pendingAnswer = null;
      quickCheckSession.currentQuestion = null;
      renderQuickCheckQuestion(quickCheckSession);
    }
  }

  function goWizardStep(step) {
    applyWizardStepState(step, { persist: true });
  }

  function canAdvanceDetailsStep() {
    const group = readHomeEntryGroup();
    if (group === 'student') {
      const studentName = String(homeStudentNameInput?.value || '').trim();
      const gradeBand = normalizeGradeBand(localStorage.getItem(HOME_GRADE_BAND_KEY) || '');
      const vibe = normalizeStudentVibe(homeStudentVibeSelect?.value || '');
      if (!studentName) {
        if (homeRolePreviewEl) {
          homeRolePreviewEl.textContent = 'Enter student name to continue.';
        }
        homeStudentNameInput?.focus();
        return false;
      }
      if (!gradeBand) {
        if (homeRolePreviewEl) {
          homeRolePreviewEl.textContent = 'Choose a grade band to continue.';
        }
        homeGradeBandButtons[0]?.focus();
        return false;
      }
      localStorage.setItem(HOME_STUDENT_NAME_KEY, studentName);
      if (vibe) {
        localStorage.setItem(HOME_STUDENT_VIBE_KEY, vibe);
      } else {
        localStorage.removeItem(HOME_STUDENT_VIBE_KEY);
      }
      return true;
    }
    if (group === 'parent') {
      const parentName = String(homeParentNameInput?.value || '').trim();
      const parentBand = normalizeGradeBand(homeParentGradeSelect?.value || '');
      const parentFocus = String(homeParentFocusSelect?.value || '').trim().toLowerCase();
      if (!parentName) {
        if (homeRolePreviewEl) {
          homeRolePreviewEl.textContent = 'Enter your name to continue.';
        }
        homeParentNameInput?.focus();
        return false;
      }
      if (!parentBand) {
        if (homeRolePreviewEl) {
          homeRolePreviewEl.textContent = 'Choose student grade band to continue.';
        }
        homeParentGradeSelect?.focus();
        return false;
      }
      localStorage.setItem(HOME_PARENT_NAME_KEY, parentName);
      localStorage.setItem(HOME_PARENT_GRADE_KEY, parentBand);
      if (parentFocus) {
        writeParentGoals([parentFocus]);
      } else {
        writeParentGoals([]);
      }
      return true;
    }
    const schoolRole = normalizeRoleId(homeTeamRoleSelect?.value || '');
    if (!schoolRole) {
      if (homeRolePreviewEl) {
        homeRolePreviewEl.textContent = 'Choose a School Team role to continue.';
      }
      homeTeamRoleSelect?.focus();
      return false;
    }
    localStorage.setItem(HOME_ROLE_WIZARD_KEY, schoolRole);
    const schoolName = String(homeSchoolNameInput?.value || '').trim();
    const schoolBand = normalizeGradeBand(homeSchoolGradeSelect?.value || '');
    const schoolConcern = String(homeSchoolConcernSelect?.value || '').trim();
    if (schoolName) localStorage.setItem(HOME_SCHOOL_NAME_KEY, schoolName);
    else localStorage.removeItem(HOME_SCHOOL_NAME_KEY);
    if (schoolBand) localStorage.setItem(HOME_SCHOOL_GRADE_KEY, schoolBand);
    else localStorage.removeItem(HOME_SCHOOL_GRADE_KEY);
    if (schoolConcern) localStorage.setItem(HOME_SCHOOL_CONCERN_KEY, schoolConcern);
    else localStorage.removeItem(HOME_SCHOOL_CONCERN_KEY);
    return true;
  }

  function bindWizardSummaryEdits() {
    if (!homeStepSummaries || homeStepSummaries.dataset.bound === 'true') return;
    homeStepSummaries.dataset.bound = 'true';
    homeStepSummaries.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const editBtn = target.closest('[data-edit-step]');
      if (!(editBtn instanceof HTMLButtonElement)) return;
      const step = normalizeWizardStep(editBtn.getAttribute('data-edit-step') || 1);
      goWizardStep(step);
    });
  }

  function openQuickCheckFromWizard() {
    const roleId = activeWizardRole();
    const group = getEntryGroupForRole(roleId);
    const studentName = String(homeStudentNameInput?.value || '').trim();
    if (group === 'student') {
      if (!studentName) {
        if (homeRolePreviewEl) {
          homeRolePreviewEl.textContent = 'Step 2: enter a student name before running Quick Check.';
        }
        homeStudentNameInput?.focus();
        applyWizardStepState(2, { persist: true });
        return;
      }
      if (studentName) {
        localStorage.setItem(HOME_STUDENT_NAME_KEY, studentName);
      }
      localStorage.setItem(HOME_ROLE_WIZARD_KEY, 'student');
    } else {
      localStorage.setItem(HOME_ROLE_WIZARD_KEY, roleId);
      writeNonStudentUnlock(false);
    }
    const gradeBand = readStudentGradeBand();
    if (gradeBand) syncProfileAndLook(gradeBand);
    applyWizardStepState(4, { persist: true });
    persistOnboardingProfileState({ roleId, nonStudentUnlock: readNonStudentUnlock() });
    openModal();
    renderQuickCheckIntro();
  }

  startBtn?.addEventListener('click', () => {
    openQuickCheckFromWizard();
  });

  homeRoleLaunchBtn?.addEventListener('click', () => {
    openQuickCheckFromWizard();
  });

  homeRoleStepNextBtn?.addEventListener('click', () => {
    goWizardStep(2);
  });

  homeDetailsStepBackBtn?.addEventListener('click', () => {
    goWizardStep(1);
  });

  homeDetailsStepNextBtn?.addEventListener('click', () => {
    if (!canAdvanceDetailsStep()) return;
    goWizardStep(3);
  });

  homeFocusStepBackBtn?.addEventListener('click', () => {
    goWizardStep(2);
  });

  homeFocusStepNextBtn?.addEventListener('click', () => {
    goWizardStep(4);
  });

  homeQuickCheckStepBackBtn?.addEventListener('click', () => {
    goWizardStep(3);
  });

  homeSkipQuickCheckBtn?.addEventListener('click', () => {
    if (isQuickCheckRequiredForGroup()) return;
    writeNonStudentUnlock(true);
    persistOnboardingProfileState({
      nonStudentUnlock: true,
      quickCheckPayload: load(),
      quickCheckCompleted: hasQuickCheckRecommendation(load())
    });
    syncHomePrecheckState(load());
    goWizardStep(4);
  });

  homePostCheckRerun?.addEventListener('click', () => {
    openModal();
    renderQuickCheckIntro();
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

  quickCheckStage.addEventListener('click', handleQuickCheckStageClick);

  homeWizardSteps.forEach((stepButton) => {
    stepButton.addEventListener('click', () => {
      const requested = normalizeWizardStep(stepButton.dataset.stepIndex || 1);
      const currentStep = readWizardStep();
      if (requested < currentStep) {
        goWizardStep(requested);
      }
    });
  });

  calcBtn.addEventListener('click', () => {
    if (!quickCheckSession) {
      const roleId = activeWizardRole();
      startQuickCheck({
        roleId,
        gradeBand: readStudentGradeBand(),
        focusToday: readFocusToday(),
        studentName: readStudentName()
      });
      return;
    }
    startQuickCheck({
      roleId: quickCheckSession.roleId,
      gradeBand: quickCheckSession.gradeBand,
      focusToday: quickCheckSession.focusToday,
      studentName: quickCheckSession.studentName
    });
  });

  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(PLACEMENT_KEY);
    localStorage.removeItem(QUICKCHECK_SUMMARY_KEY);
    writeNonStudentUnlock(false);
    result.classList.add('hidden');
    goWordQuest.classList.add('hidden');
    quickCheckSession = null;
    localStorage.setItem(HOME_WIZARD_STEP_KEY, '1');
    goWizardStep(1);
    renderQuickCheckIntro();
    renderSummary(null);
    syncHomePrecheckState(null);
    persistOnboardingProfileState({
      wizardStep: 1,
      nonStudentUnlock: false,
      quickCheckCompleted: false,
      quickCheckPayload: null
    });
  });

  // Initial render
  bindWizardSummaryEdits();
  syncWizardFromStorage();
  renderQuickCheckIntro();
  const initialSummary = load();
  renderSummary(initialSummary);
  syncHomePrecheckState(initialSummary);

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

  applyHomeEntryGroup(readHomeEntryGroup(), { persist: false, preserveCurrentRole: true, step: readWizardStep() });
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
    const nextRole = normalizeRoleId(homeRoleSelect.value || '');
    if (nextRole) {
      localStorage.setItem(HOME_ROLE_WIZARD_KEY, nextRole);
    }
    if (homeTeamRoleSelect && getEntryGroupForRole(nextRole) === 'school') {
      homeTeamRoleSelect.value = nextRole;
    }
    applyHomeEntryGroup(getEntryGroupForRole(nextRole), { persist: true, preserveCurrentRole: true, step: 1 });
    renderRoleDashboard();
    renderQuickCheckIntro();
  });
  homeEntryGroupButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextGroup = normalizeHomeEntryGroup(button.dataset.entryGroup || '');
      applyHomeEntryGroup(nextGroup, { persist: true, preserveCurrentRole: false, step: 1 });
      const roleId = normalizeRoleId(homeRoleSelect?.value || HOME_ENTRY_GROUP_DEFAULT_ROLE[nextGroup] || 'student');
      if (roleId) localStorage.setItem(HOME_ROLE_WIZARD_KEY, roleId);
      renderRoleDashboard();
      renderQuickCheckIntro();
    });
  });
  homeTeamRoleSelect?.addEventListener('change', () => {
    const roleId = normalizeRoleId(homeTeamRoleSelect.value || '') || 'teacher';
    if (homeRoleSelect) {
      homeRoleSelect.value = roleId;
    }
    localStorage.setItem(HOME_ROLE_WIZARD_KEY, roleId);
    applyHomeEntryGroup('school', { persist: true, preserveCurrentRole: true, step: 1 });
    renderRoleDashboard();
    renderQuickCheckIntro();
  });
  homeRolePickButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const roleId = normalizeRoleId(button.dataset.roleTarget || '');
      if (!roleId) return;
      applyHomeEntryGroup(getEntryGroupForRole(roleId), { persist: true, preserveCurrentRole: true, step: 1 });
      if (homeRoleSelect) {
        homeRoleSelect.value = roleId;
      }
      renderRoleDashboard();
      renderQuickCheckIntro();
    });
  });
  homeStudentNameInput?.addEventListener('input', () => {
    const value = String(homeStudentNameInput.value || '').trim();
    if (value) {
      localStorage.setItem(HOME_STUDENT_NAME_KEY, value);
    } else {
      localStorage.removeItem(HOME_STUDENT_NAME_KEY);
    }
    persistOnboardingProfileState({ studentName: value });
    applyWizardStepState(activeWizardStepForGroup('student', load()));
    renderQuickCheckIntro();
  });
  homeStudentEalToggle?.addEventListener('change', () => {
    const enabled = !!homeStudentEalToggle.checked;
    localStorage.setItem(HOME_STUDENT_EAL_KEY, enabled ? '1' : '0');
    persistOnboardingProfileState({ studentEal: enabled });
    applyWizardStepState(activeWizardStepForGroup('student', load()));
    renderQuickCheckIntro();
  });
  homeStudentVibeSelect?.addEventListener('change', () => {
    const vibe = normalizeStudentVibe(homeStudentVibeSelect.value || '');
    if (vibe) {
      localStorage.setItem(HOME_STUDENT_VIBE_KEY, vibe);
    } else {
      localStorage.removeItem(HOME_STUDENT_VIBE_KEY);
    }
    persistOnboardingProfileState({ studentVibe: vibe });
    applyWizardStepState(activeWizardStepForGroup('student', load()));
  });
  homeParentNameInput?.addEventListener('input', () => {
    const value = String(homeParentNameInput.value || '').trim();
    if (value) {
      localStorage.setItem(HOME_PARENT_NAME_KEY, value);
    } else {
      localStorage.removeItem(HOME_PARENT_NAME_KEY);
    }
    persistOnboardingProfileState({ parentName: value });
    applyWizardStepState(activeWizardStepForGroup('parent', load()));
    renderQuickCheckIntro();
  });
  homeParentGradeSelect?.addEventListener('change', () => {
    const gradeBand = normalizeGradeBand(homeParentGradeSelect.value || '');
    if (gradeBand) {
      localStorage.setItem(HOME_PARENT_GRADE_KEY, gradeBand);
    } else {
      localStorage.removeItem(HOME_PARENT_GRADE_KEY);
    }
    persistOnboardingProfileState({ parentGradeBand: gradeBand });
    applyWizardStepState(activeWizardStepForGroup('parent', load()));
    renderQuickCheckIntro();
  });
  homeParentFocusSelect?.addEventListener('change', () => {
    const focus = String(homeParentFocusSelect.value || '').trim().toLowerCase();
    if (focus) {
      writeParentGoals([focus]);
    } else {
      writeParentGoals([]);
    }
    persistOnboardingProfileState({ parentGoals: readParentGoals() });
    applyWizardStepState(activeWizardStepForGroup('parent', load()));
  });
  homeSchoolNameInput?.addEventListener('input', () => {
    const value = String(homeSchoolNameInput.value || '').trim();
    if (value) {
      localStorage.setItem(HOME_SCHOOL_NAME_KEY, value);
    } else {
      localStorage.removeItem(HOME_SCHOOL_NAME_KEY);
    }
    persistOnboardingProfileState({ schoolName: value });
  });
  homeSchoolGradeSelect?.addEventListener('change', () => {
    const gradeBand = normalizeGradeBand(homeSchoolGradeSelect.value || '');
    if (gradeBand) {
      localStorage.setItem(HOME_SCHOOL_GRADE_KEY, gradeBand);
    } else {
      localStorage.removeItem(HOME_SCHOOL_GRADE_KEY);
    }
    persistOnboardingProfileState({ schoolGradeBand: gradeBand });
  });
  homeSchoolConcernSelect?.addEventListener('change', () => {
    const concern = String(homeSchoolConcernSelect.value || '').trim();
    if (concern) {
      localStorage.setItem(HOME_SCHOOL_CONCERN_KEY, concern);
    } else {
      localStorage.removeItem(HOME_SCHOOL_CONCERN_KEY);
    }
    persistOnboardingProfileState({ schoolConcern: concern });
  });
  homeParentGoalButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const goal = String(button.dataset.parentGoal || '').trim().toLowerCase();
      if (!goal) return;
      const next = new Set(readParentGoals());
      if (next.has(goal)) {
        next.delete(goal);
      } else {
        next.add(goal);
      }
      setParentGoalButtons(Array.from(next), { persist: true });
      applyWizardStepState(activeWizardStepForGroup('parent', load()));
      renderQuickCheckIntro();
    });
  });
  homeGradeBandButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const band = normalizeGradeBand(button.dataset.gradeBand || '');
      if (!band) return;
      setGradeBandButtons(band, { persist: true });
      syncProfileAndLook(band);
      applyWizardStepState(activeWizardStepForGroup(readHomeEntryGroup(), load()));
      renderQuickCheckIntro();
    });
  });
  homeFocusButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const focusValue = normalizeFocusToday(button.dataset.focusValue || '');
      setFocusButtons(focusValue, { persist: true });
      applyWizardStepState(activeWizardStepForGroup(readHomeEntryGroup(), load()));
      renderQuickCheckIntro();
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
