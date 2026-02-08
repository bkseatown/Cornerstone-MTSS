// Shared platform boot (runs on every page).
// Purpose: keep learner context, UI look, and accessibility settings consistent across activities.
(function () {
  const SETTINGS_KEY = 'decode_settings';
  const PLACEMENT_KEY = 'decode_placement_v1';
  const PROFILE_KEY = 'decode_profile_v1';
  const ACTIVITY_LOG_KEY = 'decode_activity_log_v1';
  const LESSON_KEY = 'decode_teacher_lessons_v1';
  const QUICK_RESPONSES_KEY = 'decode_quick_responses_v1';
  const QUICK_RESPONSES_OPEN_KEY = 'decode_quick_responses_open_v1';
  const HOME_ROLE_KEY = 'cornerstone_home_role_v1';
  const HOME_LAST_ADULT_ROLE_KEY = 'cornerstone_home_role_last_adult_v1';
  const STUDENT_MODE_PIN_KEY = 'cornerstone_student_mode_pin_v1';
  const STUDENT_MODE_STRICT_KEY = 'cornerstone_student_mode_strict_v1';
  const STUDENT_MODE_RECOVERY_KEY = 'cornerstone_student_mode_recovery_v1';
  const DEFAULT_STUDENT_MODE_PIN = '2468';
  const BUILD_STAMP_CACHE_KEY = 'cornerstone_build_stamp_v1';
  const BUILD_STAMP_CACHE_TTL_MS = 15 * 60 * 1000;
  const BUILD_STAMP_REPO_OWNER = 'bkseatown';
  const BUILD_STAMP_REPO_NAME = 'Cornerstone-MTSS';
  const BUILD_STAMP_BRANCH = 'main';

  const LEARNERS_KEY = 'decode_learners_v1';
  const ACTIVE_LEARNER_KEY = 'decode_active_learner_v1';
  const STORAGE_SCOPE_MIGRATION_KEY = 'decode_scope_migrated_v1';
  const STORAGE_SCOPE_PREFIX = 'decode_scope_v1::';

  const UI_LOOK_CLASSES = ['look-k2', 'look-35', 'look-612'];

  const GLOBAL_STORAGE_KEYS = new Set([
    LEARNERS_KEY,
    ACTIVE_LEARNER_KEY,
    STORAGE_SCOPE_MIGRATION_KEY,
    LESSON_KEY
  ]);

  const SCOPED_PREFIXES = [
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

  const SCOPED_EXACT_KEYS = new Set([
    'useTeacherRecordings',
    'hasRecordings',
    'tutorialShown',
    'last_bonus_key',
    'bonus_frequency_migrated',
    'hq_english_voice_notice',
    'hq_voice_notice_shown'
  ]);

  const ACTIVITIES = [
    {
      id: 'home',
      href: 'index.html',
      navLabel: 'Home'
    },
    {
      id: 'word-quest',
      href: 'word-quest.html',
      navLabel: 'Decode Quest'
    },
    {
      id: 'cloze',
      href: 'cloze.html',
      navLabel: 'Sentence Lab'
    },
    {
      id: 'comprehension',
      href: 'comprehension.html',
      navLabel: 'Meaning Lab'
    },
    {
      id: 'fluency',
      href: 'fluency.html',
      navLabel: 'Fluency Sprint'
    },
    {
      id: 'madlibs',
      href: 'madlibs.html',
      navLabel: 'Story Remix'
    },
    {
      id: 'writing',
      href: 'writing.html',
      navLabel: 'Writing Studio'
    },
    {
      id: 'plan-it',
      href: 'plan-it.html',
      navLabel: 'Intervention Studio'
    },
    {
      id: 'number-sense',
      href: 'number-sense.html',
      navLabel: 'Number Sense Lab'
    },
    {
      id: 'operations',
      href: 'operations.html',
      navLabel: 'Strategy Studio'
    },
    {
      id: 'assessments',
      href: 'assessments.html',
      navLabel: 'Assessments Hub'
    },
    {
      id: 'teacher-report',
      href: 'teacher-report.html',
      navLabel: 'Impact Dashboard'
    }
  ];

  const PRIMARY_GUIDED_LINKS = [
    { id: 'home', href: 'index.html', label: 'Home' }
  ];

  const NAV_MENU_GROUPS = [
    {
      id: 'literacy',
      label: 'Literacy',
      items: [
        { activityId: 'word-quest', label: 'Word Quest' },
        { activityId: 'cloze', label: 'Story Fill' },
        { activityId: 'comprehension', label: 'Read & Think' },
        { activityId: 'fluency', label: 'Speed Sprint' },
        { activityId: 'madlibs', label: 'Silly Stories' },
        { activityId: 'writing', label: 'Write & Build' },
        { activityId: 'plan-it', label: 'Plan-It' }
      ]
    },
    {
      id: 'numeracy',
      label: 'Numeracy',
      items: [
        { activityId: 'number-sense', label: 'Number Sense' },
        { activityId: 'operations', label: 'Operations' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { activityId: 'assessments', label: 'Assessments', studentHidden: true },
        { activityId: 'teacher-report', label: 'Impact Dashboard', studentHidden: true }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        { id: 'guided-start', label: 'Guided Start', href: 'index.html#role-dashboard' },
        { id: 'session-setup', label: 'Session Setup', href: 'word-quest.html?tool=session', action: 'session-setup', studentHidden: true },
        { id: 'recording-studio', label: 'Recording Studio', href: 'word-quest.html?tool=studio', action: 'recording-studio', studentHidden: true },
        { id: 'sound-lab', label: 'Sound Lab', href: 'word-quest.html?soundlab=1', action: 'sound-lab' }
      ]
    }
  ];

  const GUIDE_TIP_DISMISS_PREFIX = 'cornerstone_guide_tip_dismissed_v1::';
  const GUIDE_TIPS = {
    home: {
      title: 'Welcome to CORNERSTONE MTSS',
      body: 'Start by choosing Student, Parent, or School Team. We guide the next best step from there.'
    },
    'word-quest': {
      title: 'Decode Quest Quick Start',
      body: 'Set focus + word length, press New Round, then use Hear Word for first-pass support.'
    },
    cloze: {
      title: 'Sentence Lab Quick Start',
      body: 'Use this after decoding practice to strengthen meaning, syntax, and transfer.'
    },
    comprehension: {
      title: 'Meaning Lab Quick Start',
      body: 'Use short text + evidence prompts, then log one next move for intervention continuity.'
    },
    fluency: {
      title: 'Fluency Sprint Quick Start',
      body: 'Run a 1-minute read, record WPM + accuracy, then set one concrete goal for tomorrow.'
    },
    writing: {
      title: 'Writing Studio Quick Start',
      body: 'Keep writing routines short: plan, draft, revise, then capture one growth note.'
    },
    'number-sense': {
      title: 'Number Sense Lab Quick Start',
      body: 'Start with strategy-first prompts before standard algorithm fluency checks.'
    },
    operations: {
      title: 'Strategy Studio Quick Start',
      body: 'Use visual models and reasoning talk to surface misconceptions quickly.'
    },
    assessments: {
      title: 'Assessments Hub Quick Start',
      body: 'Choose your role, open priority lanes, then launch the right screener and intervention flow.'
    },
    'teacher-report': {
      title: 'Impact Dashboard Quick Start',
      body: 'Open Literacy + Numeracy Pulse, then generate the intervention timeline and IESP draft.'
    }
  };

  const ACTIVITY_STANDARD_TAGS = {
    'word-quest': ['RF.2.3', 'RF.3.3'],
    cloze: ['L.3.4', 'RL.3.1'],
    comprehension: ['RL.3.1', 'RI.3.1'],
    fluency: ['RF.3.4'],
    madlibs: ['L.3.1', 'L.3.3'],
    writing: ['W.3.2', 'W.3.4'],
    'plan-it': ['SL.3.1', 'W.3.8'],
    'number-sense': ['CCSS-MATH-3-NBT-A-1', 'CCSS-MATH-4-OA-A-3'],
    operations: ['CCSS-MATH-3-OA-A-1', 'CCSS-MATH-4-NBT-B-4'],
    assessments: ['RF.1.2', 'RF.2.3', 'CCSS-MATH-3-NBT-A-1', 'SEL-MTSS']
  };

  const STORY_TRACK_ORDER = ['word-quest', 'fluency', 'comprehension', 'writing', 'plan-it'];
  const STORY_TRACK_ACTIVITIES = new Set(['cloze', 'comprehension', 'fluency', 'madlibs', 'writing', 'plan-it']);
  const QUICK_RESPONSE_ACTIVITIES = new Set(['cloze', 'comprehension', 'madlibs', 'writing', 'plan-it', 'number-sense', 'operations']);
  const BREADCRUMB_ACTIVITIES = new Set(['cloze', 'comprehension', 'fluency', 'madlibs', 'writing', 'plan-it', 'number-sense', 'operations', 'assessments', 'teacher-report']);
  const ACCESSIBILITY_PANEL_ACTIVITIES = new Set(['home']);

  const ACCESSIBILITY_DEFAULTS = {
    calmMode: false,
    largeText: false,
    showIPA: true,
    showExamples: true,
    showMouthCues: true,
    lineFocus: false,
    uiLook: '35',
    focusMode: false,
    reducedStimulation: false,
    fontProfile: 'atkinson'
  };

  const DEFAULT_QUICK_RESPONSES = [
    { icon: '🙋', text: 'I need help.' },
    { icon: '🔁', text: 'Please repeat that.' },
    { icon: '⏳', text: 'I need more time.' },
    { icon: '✅', text: 'I am ready.' },
    { icon: '💧', text: 'I need a break.' },
    { icon: '🔊', text: 'Please read it aloud.' },
    { icon: '🤔', text: 'I am not sure.' },
    { icon: '🎯', text: 'Can I try one more?' }
  ];

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function formatBuildStampTime(value) {
    const parsed = new Date(value || Date.now());
    if (Number.isNaN(parsed.getTime())) return '';
    return `${parsed.getUTCFullYear()}-${pad2(parsed.getUTCMonth() + 1)}-${pad2(parsed.getUTCDate())} ${pad2(parsed.getUTCHours())}:${pad2(parsed.getUTCMinutes())} UTC`;
  }

  function readBuildStampCache() {
    const parsed = safeParse(localStorage.getItem(BUILD_STAMP_CACHE_KEY) || '');
    if (!parsed || typeof parsed !== 'object') return null;
    if ((parsed.expiresAt || 0) < Date.now()) return null;
    if (typeof parsed.sha !== 'string' || !parsed.sha.trim()) return null;
    if (typeof parsed.time !== 'string' || !parsed.time.trim()) return null;
    return parsed;
  }

  function writeBuildStampCache(payload) {
    if (!payload || typeof payload !== 'object') return;
    localStorage.setItem(BUILD_STAMP_CACHE_KEY, JSON.stringify({
      sha: payload.sha,
      time: payload.time,
      expiresAt: Date.now() + BUILD_STAMP_CACHE_TTL_MS
    }));
  }

  async function fetchLatestBuildStamp() {
    const endpoint = `https://api.github.com/repos/${BUILD_STAMP_REPO_OWNER}/${BUILD_STAMP_REPO_NAME}/commits/${BUILD_STAMP_BRANCH}`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });
    if (!response.ok) {
      throw new Error(`Build stamp lookup failed (${response.status})`);
    }
    const payload = await response.json();
    const sha = String(payload?.sha || '').trim().slice(0, 8);
    const commitTime = payload?.commit?.committer?.date || payload?.commit?.author?.date || '';
    const time = formatBuildStampTime(commitTime);
    return {
      sha: sha || 'unknown',
      time: time || formatBuildStampTime(Date.now())
    };
  }

  async function resolveBuildStamp() {
    const cached = readBuildStampCache();
    if (cached) {
      return { sha: cached.sha, time: cached.time };
    }
    try {
      const fresh = await fetchLatestBuildStamp();
      writeBuildStampCache(fresh);
      return fresh;
    } catch {
      return {
        sha: 'local',
        time: formatBuildStampTime(Date.now())
      };
    }
  }

  function ensureFavicon() {
    if (!document.head) return;
    if (document.querySelector('link[rel~="icon"]')) return;
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%234f46e5'/%3E%3Cstop offset='100%25' stop-color='%230ea5e9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='url(%23g)'/%3E%3Cpath d='M16 44V20h13.5c6 0 9.5 3.5 9.5 8.1 0 3.9-2.5 6.8-6.5 7.7L43 44h-7.8l-8.6-7.3H23V44h-7zM23 31h6c2.1 0 3.4-1.2 3.4-2.9s-1.3-2.9-3.4-2.9h-6V31z' fill='white'/%3E%3C/svg%3E";
    document.head.appendChild(link);
  }

  function ensureBuildStampStyle() {
    if (!document.head) return;
    if (document.getElementById('build-stamp-style')) return;
    const style = document.createElement('style');
    style.id = 'build-stamp-style';
    style.textContent = `
      #global-build-stamp {
        position: fixed;
        right: 12px;
        bottom: 10px;
        z-index: 2200;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid rgba(51, 65, 85, 0.25);
        background: rgba(248, 250, 252, 0.86);
        color: #334155;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.14);
        backdrop-filter: blur(6px);
        font: 600 11px/1.2 "Atkinson Hyperlegible", "Segoe UI", sans-serif;
        letter-spacing: 0.02em;
        pointer-events: none;
      }
      @media (max-width: 720px) {
        #global-build-stamp {
          right: 8px;
          bottom: 8px;
          font-size: 10px;
        }
      }
      @media print {
        #global-build-stamp {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function renderBuildStamp() {
    if (!document.body) return;
    ensureBuildStampStyle();
    let badge = document.getElementById('global-build-stamp');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'global-build-stamp';
      badge.setAttribute('aria-live', 'polite');
      document.body.appendChild(badge);
    }
    badge.textContent = 'Build: loading...';
    resolveBuildStamp().then((payload) => {
      badge.textContent = `Build: ${payload.sha} | ${payload.time}`;
    });
  }

  function normalizeLook(value) {
    const raw = String(value || '35');
    if (raw === 'k2') return 'k2';
    if (raw === '612') return '612';
    return '35';
  }

  function normalizeFontProfile(value) {
    const raw = String(value || '').toLowerCase().trim();
    return raw === 'opendyslexic' ? 'opendyslexic' : 'atkinson';
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

  function deriveLearnerProfile({ settings, profile, placement }) {
    const gradeBand = normalizeGradeBand(profile?.gradeBand || placement?.gradeBand || settings?.gradeBand || '');
    const fromBand = gradeBandToLook(gradeBand);
    const uiLook = normalizeLook(settings?.uiLook || profile?.uiLook || fromBand || '35');
    return {
      version: 1,
      gradeBand: gradeBand || '',
      uiLook
    };
  }

  function normalizeHomeRolePathway(rawRole) {
    const raw = String(rawRole || '').trim().toLowerCase();
    if (!raw) return '';
    if (raw === 'learner' || raw === 'pupil') return 'student';
    if (raw === 'administrator' || raw === 'leadership' || raw === 'leader') return 'admin';
    if (raw === 'learning_support' || raw === 'ls' || raw === 'sped') return 'learning-support';
    if (raw === 'speech') return 'slp';
    if (raw === 'ell' || raw === 'esl') return 'eal';
    if (raw === 'sel-counselor' || raw === 'school-counselor') return 'counselor';
    if (raw === 'psych' || raw === 'school-psychologist') return 'psychologist';
    if (raw === 'caregiver' || raw === 'family') return 'parent';
    return raw;
  }

  function readHomeRolePathway() {
    return normalizeHomeRolePathway(localStorage.getItem(HOME_ROLE_KEY) || '');
  }

  function setHomeRolePathway(roleId) {
    const normalized = normalizeHomeRolePathway(roleId);
    if (!normalized) return;
    if (normalized !== 'student') {
      localStorage.setItem(HOME_LAST_ADULT_ROLE_KEY, normalized);
    }
    localStorage.setItem(HOME_ROLE_KEY, normalized);
    window.dispatchEvent(new CustomEvent('decode:home-role-changed', { detail: { role: normalized } }));
  }

  function readLastAdultRolePathway() {
    const fromStored = normalizeHomeRolePathway(localStorage.getItem(HOME_LAST_ADULT_ROLE_KEY) || '');
    if (fromStored && fromStored !== 'student') return fromStored;
    const current = readHomeRolePathway();
    if (current && current !== 'student') return current;
    return 'teacher';
  }

  function normalizeStudentPin(rawPin) {
    return String(rawPin || '')
      .replace(/[^\d]/g, '')
      .slice(0, 8);
  }

  function isValidStudentPin(rawPin) {
    const normalized = normalizeStudentPin(rawPin);
    return normalized.length >= 4 && normalized.length <= 8;
  }

  function readCustomStudentModePin() {
    const stored = String(localStorage.getItem(STUDENT_MODE_PIN_KEY) || '').trim();
    if (!isValidStudentPin(stored)) return '';
    return normalizeStudentPin(stored);
  }

  function hasCustomStudentModePin() {
    return !!readCustomStudentModePin();
  }

  function readStudentModeStrictMode() {
    return localStorage.getItem(STUDENT_MODE_STRICT_KEY) === '1';
  }

  function writeStudentModeStrictMode(enabled) {
    if (enabled) {
      localStorage.setItem(STUDENT_MODE_STRICT_KEY, '1');
    } else {
      localStorage.removeItem(STUDENT_MODE_STRICT_KEY);
    }
  }

  function normalizeRecoveryPhrase(rawPhrase) {
    return String(rawPhrase || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildRecoveryPhrase() {
    const words = [
      'anchor', 'maple', 'harbor', 'cedar', 'sunrise', 'canvas', 'ridge', 'meadow', 'spark', 'beacon',
      'silver', 'amber', 'summit', 'ribbon', 'ocean', 'river', 'forest', 'comet', 'planet', 'signal',
      'orchid', 'ember', 'granite', 'lumen', 'fable', 'horizon', 'orbit', 'jungle', 'keeper', 'lantern'
    ];
    const pick = () => words[Math.floor(Math.random() * words.length)];
    return `${pick()}-${pick()}-${pick()}-${pick()}`;
  }

  function readStudentModeRecoveryPhrase() {
    const stored = normalizeRecoveryPhrase(localStorage.getItem(STUDENT_MODE_RECOVERY_KEY) || '');
    return stored || '';
  }

  function ensureStudentModeRecoveryPhrase() {
    const existing = readStudentModeRecoveryPhrase();
    if (existing) return existing;
    const generated = normalizeRecoveryPhrase(buildRecoveryPhrase());
    localStorage.setItem(STUDENT_MODE_RECOVERY_KEY, generated);
    return generated;
  }

  function verifyStudentModeRecoveryPhrase(rawPhrase) {
    const submitted = normalizeRecoveryPhrase(rawPhrase);
    if (!submitted) return false;
    const stored = ensureStudentModeRecoveryPhrase();
    return submitted === stored;
  }

  function verifyStudentModePin(rawPin) {
    const submitted = normalizeStudentPin(rawPin);
    if (!submitted) return false;
    const customPin = readCustomStudentModePin();
    if (customPin) {
      if (submitted === customPin) return true;
      if (!readStudentModeStrictMode() && submitted === DEFAULT_STUDENT_MODE_PIN) return true;
      return false;
    }
    return submitted === DEFAULT_STUDENT_MODE_PIN;
  }

  function getStudentModePinState() {
    const hasCustomPin = hasCustomStudentModePin();
    const strictMode = hasCustomPin ? readStudentModeStrictMode() : false;
    return {
      hasCustomPin,
      strictMode,
      fallbackDefaultEnabled: !strictMode,
      defaultPin: DEFAULT_STUDENT_MODE_PIN,
      hasRecoveryPhrase: !!readStudentModeRecoveryPhrase()
    };
  }

  function getStudentModeRecoveryState() {
    return {
      phrase: ensureStudentModeRecoveryPhrase()
    };
  }

  function updateStudentModePin({ currentPin = '', newPin = '' } = {}) {
    if (!verifyStudentModePin(currentPin)) {
      return { ok: false, reason: 'current-pin' };
    }
    if (!isValidStudentPin(newPin)) {
      return { ok: false, reason: 'pin-format' };
    }
    const normalizedNew = normalizeStudentPin(newPin);
    if (normalizedNew === DEFAULT_STUDENT_MODE_PIN) {
      localStorage.removeItem(STUDENT_MODE_PIN_KEY);
      localStorage.removeItem(STUDENT_MODE_STRICT_KEY);
      return { ok: true, customPinEnabled: false, pinLength: DEFAULT_STUDENT_MODE_PIN.length };
    }
    localStorage.setItem(STUDENT_MODE_PIN_KEY, normalizedNew);
    return { ok: true, customPinEnabled: true, pinLength: normalizedNew.length };
  }

  function resetStudentModePinToDefault(currentPin = '') {
    if (!verifyStudentModePin(currentPin)) {
      return { ok: false, reason: 'current-pin' };
    }
    localStorage.removeItem(STUDENT_MODE_PIN_KEY);
    localStorage.removeItem(STUDENT_MODE_STRICT_KEY);
    return { ok: true, customPinEnabled: false, pinLength: DEFAULT_STUDENT_MODE_PIN.length };
  }

  function setStudentModeStrict({ currentPin = '', strictMode = false } = {}) {
    if (!verifyStudentModePin(currentPin)) {
      return { ok: false, reason: 'current-pin' };
    }
    const enabled = !!strictMode;
    if (enabled && !hasCustomStudentModePin()) {
      return { ok: false, reason: 'custom-required' };
    }
    writeStudentModeStrictMode(enabled);
    return { ok: true, strictMode: enabled };
  }

  function rotateStudentModeRecoveryPhrase({ currentPin = '' } = {}) {
    if (!verifyStudentModePin(currentPin)) {
      return { ok: false, reason: 'current-pin' };
    }
    const nextPhrase = normalizeRecoveryPhrase(buildRecoveryPhrase());
    localStorage.setItem(STUDENT_MODE_RECOVERY_KEY, nextPhrase);
    return { ok: true, phrase: nextPhrase };
  }

  function recoverStudentModePinWithPhrase({ phrase = '' } = {}) {
    if (!verifyStudentModeRecoveryPhrase(phrase)) {
      return { ok: false, reason: 'phrase' };
    }
    localStorage.removeItem(STUDENT_MODE_PIN_KEY);
    localStorage.removeItem(STUDENT_MODE_STRICT_KEY);
    return { ok: true, pinResetToDefault: true };
  }

  function attemptExitStudentMode() {
    const hasCustomPin = hasCustomStudentModePin();
    const strictMode = hasCustomPin && readStudentModeStrictMode();
    const hint = strictMode
      ? 'Enter adult PIN or recovery phrase to exit Student Mode.'
      : hasCustomPin
        ? `Enter adult PIN or recovery phrase to exit Student Mode.\nFallback default PIN: ${DEFAULT_STUDENT_MODE_PIN}`
        : `Enter adult PIN or recovery phrase to exit Student Mode.\nDefault PIN: ${DEFAULT_STUDENT_MODE_PIN}`;
    const entry = window.prompt(hint);
    if (entry === null) return;
    const normalizedEntry = String(entry || '').trim();
    if (!verifyStudentModePin(normalizedEntry)) {
      const recovery = recoverStudentModePinWithPhrase({ phrase: normalizedEntry });
      if (recovery.ok) {
        window.alert(`Recovery phrase accepted. PIN reset to default ${DEFAULT_STUDENT_MODE_PIN}.`);
      } else if (strictMode) {
        window.alert('Incorrect PIN. Strict mode is on and fallback is disabled.');
        return;
      } else if (hasCustomPin) {
        window.alert(`Incorrect PIN. Try your custom PIN, fallback default ${DEFAULT_STUDENT_MODE_PIN}, or recovery phrase.`);
        return;
      } else {
        window.alert(`Incorrect PIN. Default PIN is ${DEFAULT_STUDENT_MODE_PIN}.`);
        return;
      }
    }
    if (!verifyStudentModePin(normalizedEntry) && !verifyStudentModeRecoveryPhrase(normalizedEntry)) {
      return;
    }

    const nextRole = readLastAdultRolePathway();
    setHomeRolePathway(nextRole);
    window.location.reload();
  }

  function applyStudentModeState() {
    const rolePathway = readHomeRolePathway();
    const isStudent = rolePathway === 'student';
    document.body.classList.toggle('student-mode', isStudent);
    if (rolePathway) {
      document.body.dataset.rolePathway = rolePathway;
    } else {
      delete document.body.dataset.rolePathway;
    }
  }

  function renderStudentModeExitControl() {
    const isStudent = readHomeRolePathway() === 'student';
    const containers = Array.from(document.querySelectorAll('.header-actions'));
    if (!containers.length) return;

    containers.forEach((container) => {
      let exitBtn = container.querySelector('.student-mode-exit-btn');

      if (!isStudent) {
        if (exitBtn) exitBtn.remove();
        return;
      }

      if (!exitBtn) {
        exitBtn = document.createElement('button');
        exitBtn.type = 'button';
        exitBtn.className = 'link-btn student-mode-exit-btn';
        exitBtn.textContent = 'Adult Exit';
        exitBtn.title = 'Adult PIN required';
        container.appendChild(exitBtn);
      }

      if (exitBtn.dataset.bound !== 'true') {
        exitBtn.dataset.bound = 'true';
        exitBtn.addEventListener('click', attemptExitStudentMode);
      }
    });
  }

  function readScopedSettings() {
    const parsed = safeParse(localStorage.getItem(SETTINGS_KEY) || '');
    const merged = {
      ...ACCESSIBILITY_DEFAULTS,
      ...(parsed && typeof parsed === 'object' ? parsed : {})
    };
    merged.uiLook = normalizeLook(merged.uiLook);
    merged.fontProfile = normalizeFontProfile(merged.fontProfile);
    merged.focusMode = !!merged.focusMode;
    merged.reducedStimulation = !!merged.reducedStimulation;
    merged.calmMode = !!merged.calmMode;
    merged.largeText = !!merged.largeText;
    merged.lineFocus = !!merged.lineFocus;
    return merged;
  }

  function writeScopedSettings(patch = {}) {
    const existing = readScopedSettings();
    const merged = {
      ...existing,
      ...patch
    };
    merged.uiLook = normalizeLook(merged.uiLook);
    merged.fontProfile = normalizeFontProfile(merged.fontProfile);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  }

  function normalizeQuickResponses(raw) {
    const fallback = DEFAULT_QUICK_RESPONSES.map((item) => ({ ...item }));
    if (!Array.isArray(raw)) return fallback;
    const normalized = raw
      .map((item) => {
        const icon = String(item?.icon || '').trim() || '💬';
        const text = String(item?.text || '').trim();
        if (!text) return null;
        return { icon, text: text.endsWith('.') ? text : `${text}` };
      })
      .filter(Boolean)
      .slice(0, 12);
    return normalized.length ? normalized : fallback;
  }

  function readQuickResponses() {
    const parsed = safeParse(localStorage.getItem(QUICK_RESPONSES_KEY) || '');
    return normalizeQuickResponses(parsed);
  }

  function writeQuickResponses(items) {
    const normalized = normalizeQuickResponses(items);
    localStorage.setItem(QUICK_RESPONSES_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function shouldScopeKey(key) {
    const text = String(key || '');
    if (!text) return false;
    if (text.startsWith(STORAGE_SCOPE_PREFIX)) return false;
    if (GLOBAL_STORAGE_KEYS.has(text)) return false;
    if (SCOPED_EXACT_KEYS.has(text)) return true;
    return SCOPED_PREFIXES.some((prefix) => text.startsWith(prefix));
  }

  function normalizeLearnerName(value) {
    const cleaned = String(value || '').trim().replace(/\s+/g, ' ');
    return cleaned || 'Learner';
  }

  function learnerScopedStorageKey(learnerId, key) {
    return `${STORAGE_SCOPE_PREFIX}${learnerId}::${key}`;
  }

  function makeLearnerId() {
    const random = Math.random().toString(36).slice(2, 9);
    return `learner-${Date.now().toString(36)}-${random}`;
  }

  const localStorageRef = window.localStorage;
  const storageProto = Object.getPrototypeOf(localStorageRef);
  const rawGetItem = storageProto.getItem;
  const rawSetItem = storageProto.setItem;
  const rawRemoveItem = storageProto.removeItem;
  const rawKey = storageProto.key;

  function globalGetItem(key) {
    return rawGetItem.call(localStorageRef, key);
  }

  function globalSetItem(key, value) {
    return rawSetItem.call(localStorageRef, key, value);
  }

  function globalRemoveItem(key) {
    return rawRemoveItem.call(localStorageRef, key);
  }

  function globalKey(index) {
    return rawKey.call(localStorageRef, index);
  }

  function readLearnersGlobal() {
    const parsed = safeParse(globalGetItem(LEARNERS_KEY) || '');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === 'string' && item.id.trim());
  }

  function writeLearnersGlobal(learners) {
    globalSetItem(LEARNERS_KEY, JSON.stringify(learners));
  }

  function readActiveLearnerIdGlobal() {
    return (globalGetItem(ACTIVE_LEARNER_KEY) || '').toString().trim();
  }

  function writeActiveLearnerIdGlobal(id) {
    globalSetItem(ACTIVE_LEARNER_KEY, String(id || '').trim());
  }

  function buildDefaultLearner() {
    const legacyProfile = safeParse(globalGetItem(PROFILE_KEY) || '');
    const gradeBand = normalizeGradeBand(legacyProfile?.gradeBand || '');
    const now = Date.now();
    return {
      id: 'learner-default',
      name: 'Learner 1',
      gradeBand,
      createdAt: now,
      updatedAt: now
    };
  }

  function ensureLearnerState() {
    let learners = readLearnersGlobal();
    if (!learners.length) {
      learners = [buildDefaultLearner()];
      writeLearnersGlobal(learners);
    } else {
      learners = learners.map((item, index) => ({
        id: String(item.id),
        name: normalizeLearnerName(item.name || `Learner ${index + 1}`),
        gradeBand: normalizeGradeBand(item.gradeBand || ''),
        createdAt: Number(item.createdAt) || Date.now(),
        updatedAt: Number(item.updatedAt) || Date.now()
      }));
      writeLearnersGlobal(learners);
    }

    let activeId = readActiveLearnerIdGlobal();
    if (!activeId || !learners.some((learner) => learner.id === activeId)) {
      activeId = learners[0].id;
      writeActiveLearnerIdGlobal(activeId);
    }

    return { learners, activeId };
  }

  const learnerState = ensureLearnerState();

  function getActiveLearnerId() {
    return learnerState.activeId;
  }

  function getLearners() {
    return learnerState.learners.slice();
  }

  function getActiveLearner() {
    return learnerState.learners.find((learner) => learner.id === learnerState.activeId) || learnerState.learners[0] || null;
  }

  function migrateLegacyDataIntoScopedStorage() {
    if (globalGetItem(STORAGE_SCOPE_MIGRATION_KEY) === '1') return;

    const targetLearnerId = getActiveLearnerId();
    const toCopy = [];
    const length = localStorageRef.length;
    for (let index = 0; index < length; index += 1) {
      const key = globalKey(index);
      if (!key) continue;
      if (key.startsWith(STORAGE_SCOPE_PREFIX)) continue;
      if (!shouldScopeKey(key)) continue;
      const value = globalGetItem(key);
      if (value === null) continue;
      const scoped = learnerScopedStorageKey(targetLearnerId, key);
      if (globalGetItem(scoped) === null) {
        toCopy.push([scoped, value]);
      }
    }

    toCopy.forEach(([scopedKey, value]) => {
      globalSetItem(scopedKey, value);
    });
    globalSetItem(STORAGE_SCOPE_MIGRATION_KEY, '1');
  }

  migrateLegacyDataIntoScopedStorage();

  if (!storageProto.__decodeLearnerScopedPatchApplied) {
    storageProto.getItem = function decodeScopedGetItem(key) {
      if (this !== localStorageRef) return rawGetItem.call(this, key);
      const requested = String(key);
      if (!shouldScopeKey(requested)) return rawGetItem.call(this, requested);
      return rawGetItem.call(this, learnerScopedStorageKey(getActiveLearnerId(), requested));
    };

    storageProto.setItem = function decodeScopedSetItem(key, value) {
      if (this !== localStorageRef) return rawSetItem.call(this, key, value);
      const requested = String(key);
      if (!shouldScopeKey(requested)) return rawSetItem.call(this, requested, value);
      return rawSetItem.call(this, learnerScopedStorageKey(getActiveLearnerId(), requested), value);
    };

    storageProto.removeItem = function decodeScopedRemoveItem(key) {
      if (this !== localStorageRef) return rawRemoveItem.call(this, key);
      const requested = String(key);
      if (!shouldScopeKey(requested)) return rawRemoveItem.call(this, requested);
      return rawRemoveItem.call(this, learnerScopedStorageKey(getActiveLearnerId(), requested));
    };

    storageProto.__decodeLearnerScopedPatchApplied = true;
  }

  function readLearnerScopedData(learnerId) {
    const prefix = `${STORAGE_SCOPE_PREFIX}${learnerId}::`;
    const data = {};
    const length = localStorageRef.length;
    for (let index = 0; index < length; index += 1) {
      const key = globalKey(index);
      if (!key || !key.startsWith(prefix)) continue;
      const rawStorageKey = key.slice(prefix.length);
      const value = globalGetItem(key);
      if (value !== null) data[rawStorageKey] = value;
    }
    return data;
  }

  function writeLearnerScopedData(learnerId, data) {
    if (!data || typeof data !== 'object') return 0;
    let written = 0;
    Object.entries(data).forEach(([key, value]) => {
      if (!shouldScopeKey(key)) return;
      if (typeof value !== 'string') return;
      globalSetItem(learnerScopedStorageKey(learnerId, key), value);
      written += 1;
    });
    return written;
  }

  function clearLearnerScopedData(learnerId) {
    const prefix = `${STORAGE_SCOPE_PREFIX}${learnerId}::`;
    const toDelete = [];
    const length = localStorageRef.length;
    for (let index = 0; index < length; index += 1) {
      const key = globalKey(index);
      if (key && key.startsWith(prefix)) toDelete.push(key);
    }
    toDelete.forEach((key) => globalRemoveItem(key));
  }

  function updateLearners(nextLearners) {
    learnerState.learners = nextLearners;
    writeLearnersGlobal(nextLearners);
  }

  function setActiveLearnerInternal(learnerId) {
    if (!learnerState.learners.some((learner) => learner.id === learnerId)) return false;
    learnerState.activeId = learnerId;
    writeActiveLearnerIdGlobal(learnerId);
    return true;
  }

  const stored = readScopedSettings();
  const storedPlacement = safeParse(localStorage.getItem(PLACEMENT_KEY) || '');
  const storedProfile = safeParse(localStorage.getItem(PROFILE_KEY) || '');
  const derivedProfile = deriveLearnerProfile({ settings: stored, profile: storedProfile, placement: storedPlacement });
  if (!stored.uiLook && derivedProfile?.uiLook) {
    stored.uiLook = normalizeLook(derivedProfile.uiLook);
  }

  const body = document.body;
  if (!body) return;

  body.classList.add('force-light');
  body.dataset.learnerId = getActiveLearnerId();
  document.documentElement.style.colorScheme = 'light';

  applyPlatformAccessibilitySettings(stored);

  const platform = (window.DECODE_PLATFORM = window.DECODE_PLATFORM || {});
  platform.activities = platform.activities || ACTIVITIES;

  function readJson(key, fallback) {
    const parsed = safeParse(localStorage.getItem(key) || '');
    return parsed === null || parsed === undefined ? fallback : parsed;
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function appendLocalArray(key, item, limit = 120) {
    const existing = readJson(key, []);
    const arr = Array.isArray(existing) ? existing : [];
    arr.unshift(item);
    if (arr.length > limit) arr.length = limit;
    writeJson(key, arr);
    return arr;
  }

  function applyPlatformAccessibilitySettings(settings) {
    const normalized = {
      ...ACCESSIBILITY_DEFAULTS,
      ...(settings || {})
    };

    body.classList.toggle('calm-mode', !!normalized.calmMode);
    body.classList.toggle('large-text', !!normalized.largeText);
    body.classList.toggle('hide-ipa', normalized.showIPA === false);
    body.classList.toggle('hide-examples', normalized.showExamples === false);
    body.classList.toggle('hide-mouth-cues', normalized.showMouthCues === false);
    body.classList.toggle('focus-mode', !!normalized.focusMode);
    body.classList.toggle('reduced-stimulation', !!normalized.reducedStimulation);
    body.classList.toggle('line-focus', !!normalized.lineFocus);
    body.classList.remove('font-atkinson', 'font-opendyslexic');
    body.classList.add(normalized.fontProfile === 'opendyslexic' ? 'font-opendyslexic' : 'font-atkinson');

    const uiLook = normalizeLook(normalized.uiLook);
    UI_LOOK_CLASSES.forEach((cls) => body.classList.remove(cls));
    body.classList.add(uiLook === 'k2' ? 'look-k2' : uiLook === '612' ? 'look-612' : 'look-35');
  }

  platform.readJson = platform.readJson || readJson;
  platform.writeJson = platform.writeJson || writeJson;
  platform.appendLocalArray = platform.appendLocalArray || appendLocalArray;
  platform.getSettings = function getSettingsPublic() {
    return readScopedSettings();
  };
  platform.setSettings = function setSettingsPublic(patch = {}, options = {}) {
    const updated = writeScopedSettings(patch);
    applyPlatformAccessibilitySettings(updated);
    if (options.emit !== false) {
      window.dispatchEvent(new CustomEvent('decode:settings-changed', { detail: updated }));
    }
    if (options.resize !== false) {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
    return updated;
  };
  platform.getQuickResponses = function getQuickResponsesPublic() {
    return readQuickResponses();
  };
  platform.setQuickResponses = function setQuickResponsesPublic(items) {
    const saved = writeQuickResponses(items);
    window.dispatchEvent(new CustomEvent('decode:quick-responses-changed', { detail: saved }));
    return saved;
  };
  platform.getStudentModePinState = function getStudentModePinStatePublic() {
    return getStudentModePinState();
  };
  platform.getStudentModeRecoveryState = function getStudentModeRecoveryStatePublic() {
    return getStudentModeRecoveryState();
  };
  platform.updateStudentModePin = function updateStudentModePinPublic(input = {}) {
    return updateStudentModePin(input);
  };
  platform.resetStudentModePinToDefault = function resetStudentModePinToDefaultPublic(currentPin = '') {
    return resetStudentModePinToDefault(currentPin);
  };
  platform.setStudentModeStrict = function setStudentModeStrictPublic(input = {}) {
    return setStudentModeStrict(input);
  };
  platform.rotateStudentModeRecoveryPhrase = function rotateStudentModeRecoveryPhrasePublic(input = {}) {
    return rotateStudentModeRecoveryPhrase(input);
  };
  platform.recoverStudentModePinWithPhrase = function recoverStudentModePinWithPhrasePublic(input = {}) {
    return recoverStudentModePinWithPhrase(input);
  };

  platform.getProfile = platform.getProfile || function getProfile() {
    const settings = safeParse(localStorage.getItem(SETTINGS_KEY) || '');
    const placement = safeParse(localStorage.getItem(PLACEMENT_KEY) || '');
    const profile = safeParse(localStorage.getItem(PROFILE_KEY) || '');
    return deriveLearnerProfile({ settings, profile, placement });
  };

  platform.setProfile = platform.setProfile || function setProfile(updates) {
    const existing = safeParse(localStorage.getItem(PROFILE_KEY) || '') || {};
    const merged = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
      version: 1
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));

    const active = getActiveLearner();
    if (active && updates && Object.prototype.hasOwnProperty.call(updates, 'gradeBand')) {
      const next = learnerState.learners.map((learner) => (
        learner.id === active.id
          ? { ...learner, gradeBand: normalizeGradeBand(updates.gradeBand || ''), updatedAt: Date.now() }
          : learner
      ));
      updateLearners(next);
    }
    return merged;
  };

  platform.logActivity = platform.logActivity || function logActivity(entry) {
    try {
      const activity = String(entry?.activity || '');
      const standards = Array.isArray(entry?.standards)
        ? entry.standards
        : (ACTIVITY_STANDARD_TAGS[activity] || []);
      const record = {
        ts: Date.now(),
        learnerId: getActiveLearnerId(),
        standards,
        ...entry
      };
      appendLocalArray(ACTIVITY_LOG_KEY, record, 140);
      renderStoryTrack();
      return record;
    } catch {
      return null;
    }
  };

  platform.getLearners = function getLearnersPublic() {
    return getLearners();
  };

  platform.getActiveLearnerId = function getActiveLearnerIdPublic() {
    return getActiveLearnerId();
  };

  platform.getActiveLearner = function getActiveLearnerPublic() {
    return getActiveLearner();
  };

  platform.addLearner = function addLearnerPublic(input = {}) {
    const now = Date.now();
    const learner = {
      id: makeLearnerId(),
      name: normalizeLearnerName(input.name || `Learner ${learnerState.learners.length + 1}`),
      gradeBand: normalizeGradeBand(input.gradeBand || ''),
      createdAt: now,
      updatedAt: now
    };
    updateLearners([...learnerState.learners, learner]);
    return learner;
  };

  platform.updateLearner = function updateLearnerPublic(id, updates = {}) {
    let updated = null;
    const next = learnerState.learners.map((learner) => {
      if (learner.id !== id) return learner;
      updated = {
        ...learner,
        name: normalizeLearnerName(Object.prototype.hasOwnProperty.call(updates, 'name') ? updates.name : learner.name),
        gradeBand: Object.prototype.hasOwnProperty.call(updates, 'gradeBand')
          ? normalizeGradeBand(updates.gradeBand || '')
          : learner.gradeBand,
        updatedAt: Date.now()
      };
      return updated;
    });
    if (!updated) return null;
    updateLearners(next);
    return updated;
  };

  platform.removeLearner = function removeLearnerPublic(id, options = {}) {
    if (learnerState.learners.length <= 1) return { ok: false, reason: 'minimum' };
    if (!learnerState.learners.some((learner) => learner.id === id)) return { ok: false, reason: 'missing' };

    const next = learnerState.learners.filter((learner) => learner.id !== id);
    updateLearners(next);
    clearLearnerScopedData(id);

    if (learnerState.activeId === id) {
      setActiveLearnerInternal(next[0].id);
      if (options.reload !== false) window.location.reload();
    }
    return { ok: true };
  };

  platform.setActiveLearner = function setActiveLearnerPublic(id, options = {}) {
    const changed = learnerState.activeId !== id;
    const ok = setActiveLearnerInternal(id);
    if (!ok) return false;

    body.dataset.learnerId = getActiveLearnerId();
    applyPlatformAccessibilitySettings(readScopedSettings());
    renderLearnerSwitchers();
    renderStoryTrack();
    renderQuickResponseDock();
    applyFocusModeLayout();

    if (changed && options.reload !== false) {
      window.location.reload();
    }
    return true;
  };

  platform.getLearnerDataSnapshot = function getLearnerDataSnapshotPublic(id) {
    const learnerId = id || getActiveLearnerId();
    return readLearnerScopedData(learnerId);
  };

  platform.importLearnerDataSnapshot = function importLearnerDataSnapshotPublic(data, id) {
    const learnerId = id || getActiveLearnerId();
    return writeLearnerScopedData(learnerId, data);
  };

  function getCurrentPageFile() {
    const raw = (window.location && window.location.pathname) ? window.location.pathname : '';
    const last = raw.split('/').filter(Boolean).pop();
    return (last || 'index.html').toLowerCase();
  }

  function getCurrentActivityId() {
    const currentFile = getCurrentPageFile();
    const match = ACTIVITIES.find((a) => (a.href || '').toLowerCase() === currentFile);
    return match ? match.id : '';
  }

  function getCurrentActivity() {
    const activityId = getCurrentActivityId();
    return ACTIVITIES.find((activity) => activity.id === activityId) || ACTIVITIES[0];
  }

  function shouldRenderStoryTrack(activityId = getCurrentActivityId()) {
    return STORY_TRACK_ACTIVITIES.has(activityId);
  }

  function shouldRenderQuickResponses(activityId = getCurrentActivityId()) {
    return QUICK_RESPONSE_ACTIVITIES.has(activityId);
  }

  function shouldRenderBreadcrumb(activityId = getCurrentActivityId()) {
    return BREADCRUMB_ACTIVITIES.has(activityId);
  }

  function shouldRenderAccessibilityPanel(activityId = getCurrentActivityId()) {
    return ACCESSIBILITY_PANEL_ACTIVITIES.has(activityId);
  }

  function getHeaderContainer() {
    return document.querySelector('header')
      || document.querySelector('.cloze-header, .comp-header, .fluency-header, .madlibs-header, .writing-header, .planit-header');
  }

  function getHeaderTopContainer() {
    return document.querySelector('header .header-top') || getHeaderContainer();
  }

  function renderBreadcrumbTrail() {
    const activityId = getCurrentActivityId();
    if (!shouldRenderBreadcrumb(activityId)) {
      const existing = document.getElementById('activity-breadcrumb');
      if (existing) existing.remove();
      return;
    }

    const header = getHeaderContainer();
    if (!header) return;

    let breadcrumb = document.getElementById('activity-breadcrumb');
    if (!breadcrumb) {
      breadcrumb = document.createElement('nav');
      breadcrumb.id = 'activity-breadcrumb';
      breadcrumb.className = 'activity-breadcrumb';
      breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    }

    if (header.tagName && header.tagName.toLowerCase() === 'header') {
      if (breadcrumb.parentElement !== header) {
        header.appendChild(breadcrumb);
      }
    } else if (header.parentElement) {
      const next = header.nextElementSibling;
      if (next !== breadcrumb) {
        header.parentElement.insertBefore(breadcrumb, next);
      }
    }

    breadcrumb.innerHTML = '';
    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.textContent = 'Home';
    breadcrumb.appendChild(homeLink);

    const current = getCurrentActivity();
    if (current.id !== 'home') {
      const sep = document.createElement('span');
      sep.className = 'breadcrumb-sep';
      sep.textContent = '›';
      breadcrumb.appendChild(sep);

      const currentLabel = document.createElement('span');
      currentLabel.className = 'breadcrumb-current';
      currentLabel.textContent = current.navLabel;
      breadcrumb.appendChild(currentLabel);
    }
  }

  function getCompletedStorySteps() {
    const logs = readJson(ACTIVITY_LOG_KEY, []);
    const entries = Array.isArray(logs) ? logs : [];
    const completed = new Set();
    entries.forEach((entry) => {
      const activity = String(entry?.activity || '');
      if (STORY_TRACK_ORDER.includes(activity)) {
        completed.add(activity);
      }
    });
    return completed;
  }

  function renderStoryTrack() {
    const currentId = getCurrentActivityId();
    const enabled = shouldRenderStoryTrack(currentId);
    body.classList.toggle('has-story-track', enabled);
    if (!enabled) {
      const existing = document.getElementById('story-track');
      if (existing) existing.remove();
      return;
    }

    let track = document.getElementById('story-track');
    if (!track) {
      track = document.createElement('div');
      track.id = 'story-track';
      track.className = 'story-track';
      track.setAttribute('role', 'navigation');
      track.setAttribute('aria-label', 'Story Track progress');
      document.body.appendChild(track);
    }

    const completed = getCompletedStorySteps();
    const completedCount = STORY_TRACK_ORDER.filter((id) => completed.has(id)).length;
    const progressValue = Math.round((completedCount / STORY_TRACK_ORDER.length) * 100);

    track.innerHTML = '';

    const topRow = document.createElement('div');
    topRow.className = 'story-track-top';
    topRow.innerHTML = `
      <div class="story-track-title">Story Track</div>
      <div class="story-track-percent">${progressValue}% complete</div>
    `;
    track.appendChild(topRow);

    const progressBar = document.createElement('div');
    progressBar.className = 'story-track-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', String(progressValue));
    const fill = document.createElement('div');
    fill.className = 'story-track-progress-fill';
    fill.style.width = `${progressValue}%`;
    progressBar.appendChild(fill);
    track.appendChild(progressBar);

    const steps = document.createElement('div');
    steps.className = 'story-track-steps';
    STORY_TRACK_ORDER.forEach((id, index) => {
      const activity = ACTIVITIES.find((item) => item.id === id);
      if (!activity) return;
      const link = document.createElement('a');
      link.href = activity.href;
      link.className = 'story-track-step';
      link.textContent = `${index + 1}. ${activity.navLabel}`;
      if (completed.has(id)) link.classList.add('is-complete');
      if (id === currentId) {
        link.classList.add('is-current');
        link.setAttribute('aria-current', 'page');
      }
      steps.appendChild(link);
    });
    track.appendChild(steps);
  }

  function getFocusTarget(main, activityId) {
    const selectorMap = {
      home: '.home-card[aria-label="Placement"]',
      'teacher-report': '.report-card',
      'word-quest': '#game-canvas',
      cloze: '.cloze-story',
      comprehension: '.comp-panel',
      fluency: '.fluency-panel',
      madlibs: '.madlibs-panel',
      writing: '.writing-panel',
      'plan-it': '.planit-panel',
      'number-sense': '.numsense-panel',
      operations: '.numsense-panel'
    };

    const selector = selectorMap[activityId] || '';
    if (selector) {
      const target = main.querySelector(selector);
      if (target) return target;
    }
    return main.firstElementChild;
  }

  function applyFocusModeLayout() {
    const main = document.querySelector('main');
    if (!main) return;

    const settings = readScopedSettings();
    const enabled = !!settings.focusMode;
    const activityId = getCurrentActivityId();
    const target = getFocusTarget(main, activityId);

    Array.from(main.children).forEach((child) => {
      child.classList.remove('focus-mode-target');
      child.classList.remove('focus-mode-hidden');
      if (!enabled || !target) return;
      if (child === target) child.classList.add('focus-mode-target');
      else child.classList.add('focus-mode-hidden');
    });

    body.classList.toggle('focus-mode-active', enabled);
  }

  function serializeQuickResponses(items) {
    return items.map((item) => `${item.icon} | ${item.text}`).join('\n');
  }

  function parseQuickResponseLines(rawText) {
    const lines = String(rawText || '').split('\n');
    const parsed = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const parts = trimmed.split('|');
      if (parts.length >= 2) {
        const icon = parts[0].trim() || '💬';
        const text = parts.slice(1).join('|').trim();
        return text ? { icon, text } : null;
      }
      if (trimmed.length <= 3) return null;
      return { icon: '💬', text: trimmed };
    }).filter(Boolean);
    return normalizeQuickResponses(parsed);
  }

  function renderQuickResponseDock() {
    if (!shouldRenderQuickResponses(getCurrentActivityId())) {
      const existing = document.getElementById('quick-response-dock');
      if (existing) existing.remove();
      return;
    }

    let dock = document.getElementById('quick-response-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'quick-response-dock';
      dock.className = 'quick-response-dock';
      dock.innerHTML = `
        <button type="button" class="quick-response-toggle">Quick Responses</button>
        <div class="quick-response-panel hidden">
          <div class="quick-response-grid" aria-label="AAC quick responses"></div>
          <div class="quick-response-output" aria-live="polite"></div>
          <details class="quick-response-editor">
            <summary>Teacher edit</summary>
            <p class="muted">One response per line using <code>icon | text</code>.</p>
            <textarea class="quick-response-editor-input" rows="6"></textarea>
            <div class="quick-response-editor-actions">
              <button type="button" class="secondary-btn quick-response-save">Save responses</button>
              <button type="button" class="secondary-btn quick-response-reset">Reset defaults</button>
            </div>
          </details>
        </div>
      `;
      document.body.appendChild(dock);
    }

    const openState = localStorage.getItem(QUICK_RESPONSES_OPEN_KEY) === 'true';
    const panel = dock.querySelector('.quick-response-panel');
    const toggle = dock.querySelector('.quick-response-toggle');
    const grid = dock.querySelector('.quick-response-grid');
    const output = dock.querySelector('.quick-response-output');
    const editorInput = dock.querySelector('.quick-response-editor-input');
    const saveBtn = dock.querySelector('.quick-response-save');
    const resetBtn = dock.querySelector('.quick-response-reset');

    panel?.classList.toggle('hidden', !openState);
    if (toggle) {
      toggle.setAttribute('aria-expanded', openState ? 'true' : 'false');
      toggle.textContent = openState ? 'Hide Quick Responses' : 'Quick Responses';
    }

    const responses = readQuickResponses();
    if (grid) {
      grid.innerHTML = '';
      responses.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quick-response-btn';
        button.innerHTML = `<span class="quick-response-icon">${item.icon}</span><span class="quick-response-text">${item.text}</span>`;
        button.addEventListener('click', () => {
          if (output) output.textContent = item.text;
          try {
            if (window.speechSynthesis) {
              const utterance = new SpeechSynthesisUtterance(item.text);
              utterance.rate = 0.9;
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utterance);
            }
          } catch {}
          window.dispatchEvent(new CustomEvent('decode:quick-response', { detail: { text: item.text } }));
        });
        grid.appendChild(button);
      });
    }

    if (editorInput) {
      editorInput.value = serializeQuickResponses(responses);
    }

    if (dock.dataset.bound !== 'true') {
      dock.dataset.bound = 'true';
      toggle?.addEventListener('click', () => {
        const currentlyOpen = localStorage.getItem(QUICK_RESPONSES_OPEN_KEY) === 'true';
        localStorage.setItem(QUICK_RESPONSES_OPEN_KEY, currentlyOpen ? 'false' : 'true');
        renderQuickResponseDock();
      });

      saveBtn?.addEventListener('click', () => {
        const parsed = parseQuickResponseLines(editorInput?.value || '');
        writeQuickResponses(parsed);
        if (output) output.textContent = 'Quick responses updated.';
        renderQuickResponseDock();
      });

      resetBtn?.addEventListener('click', () => {
        writeQuickResponses(DEFAULT_QUICK_RESPONSES);
        if (output) output.textContent = 'Quick responses reset to defaults.';
        renderQuickResponseDock();
      });
    }
  }

  function renderAccessibilityPanel() {
    if (!shouldRenderAccessibilityPanel(getCurrentActivityId())) {
      const existing = document.getElementById('global-accessibility-tools');
      if (existing) existing.remove();
      return;
    }

    const headerTop = getHeaderTopContainer();
    if (!headerTop) return;

    let panel = document.getElementById('global-accessibility-tools');
    if (!panel) {
      panel = document.createElement('details');
      panel.id = 'global-accessibility-tools';
      panel.className = 'global-accessibility-tools';
      panel.innerHTML = `
        <summary>Accessibility</summary>
        <div class="global-accessibility-body">
          <label><input type="checkbox" data-setting="focusMode" /> Focus mode</label>
          <label><input type="checkbox" data-setting="reducedStimulation" /> Reduced stimulation</label>
          <label><input type="checkbox" data-setting="calmMode" /> Calm mode</label>
          <label><input type="checkbox" data-setting="largeText" /> Large text</label>
          <label><input type="checkbox" data-setting="lineFocus" /> Line focus</label>
          <label class="global-accessibility-font-label">Font
            <select data-setting="fontProfile">
              <option value="atkinson">Atkinson Hyperlegible</option>
              <option value="opendyslexic">OpenDyslexic</option>
            </select>
          </label>
          <button type="button" class="secondary-btn global-accessibility-reset">Reset supports</button>
        </div>
      `;
      headerTop.appendChild(panel);
    }

    const settings = readScopedSettings();
    panel.querySelectorAll('[data-setting]').forEach((input) => {
      const key = input.getAttribute('data-setting');
      if (!key) return;
      if (input.tagName === 'SELECT') {
        input.value = String(settings[key] ?? '');
      } else if (input instanceof HTMLInputElement && input.type === 'checkbox') {
        input.checked = !!settings[key];
      }
    });

    if (panel.dataset.bound !== 'true') {
      panel.dataset.bound = 'true';
      panel.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const key = target.getAttribute('data-setting');
        if (!key) return;
        let value;
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
          value = target.checked;
        } else if (target instanceof HTMLSelectElement) {
          value = target.value;
        } else {
          return;
        }
        platform.setSettings({ [key]: value });
        applyFocusModeLayout();
      });

      const resetBtn = panel.querySelector('.global-accessibility-reset');
      resetBtn?.addEventListener('click', () => {
        platform.setSettings({
          calmMode: ACCESSIBILITY_DEFAULTS.calmMode,
          largeText: ACCESSIBILITY_DEFAULTS.largeText,
          focusMode: ACCESSIBILITY_DEFAULTS.focusMode,
          reducedStimulation: ACCESSIBILITY_DEFAULTS.reducedStimulation,
          lineFocus: ACCESSIBILITY_DEFAULTS.lineFocus,
          fontProfile: ACCESSIBILITY_DEFAULTS.fontProfile
        });
        applyFocusModeLayout();
        renderAccessibilityPanel();
      });
    }
  }

  function resolveNavItem(item) {
    if (!item || typeof item !== 'object') return null;
    if (item.activityId) {
      const activity = ACTIVITIES.find((entry) => entry.id === item.activityId);
      if (!activity) return null;
      const studentHidden = !!item.studentHidden || item.activityId === 'teacher-report' || item.activityId === 'assessments';
      return {
        id: item.activityId,
        href: activity.href,
        label: item.label || activity.navLabel,
        studentHidden,
        action: item.action || ''
      };
    }
    const href = String(item.href || '').trim();
    return {
      id: item.id || href || item.label || '',
      href: href || '#',
      label: item.label || 'Link',
      studentHidden: !!item.studentHidden,
      action: item.action || ''
    };
  }

  function navHrefMatchesCurrentPage(href = '', currentFile = getCurrentPageFile()) {
    if (!href) return false;
    try {
      const parsed = new URL(href, window.location.origin);
      const targetFile = (parsed.pathname.split('/').filter(Boolean).pop() || 'index.html').toLowerCase();
      if (targetFile !== currentFile) return false;

      const requiredParams = new URLSearchParams(parsed.search || '');
      if (Array.from(requiredParams.keys()).length) {
        const currentParams = new URLSearchParams(window.location.search || '');
        for (const [key, value] of requiredParams.entries()) {
          if ((currentParams.get(key) || '') !== value) return false;
        }
      }

      if (parsed.hash) {
        return parsed.hash.toLowerCase() === (window.location.hash || '').toLowerCase();
      }
      return true;
    } catch {
      return false;
    }
  }

  function createNavGroupMenu(group, currentId = '', currentFile = getCurrentPageFile()) {
    const resolvedItems = (group?.items || [])
      .map(resolveNavItem)
      .filter(Boolean);
    if (!resolvedItems.length) return null;

    const details = document.createElement('details');
    details.className = 'header-activity-menu';
    details.dataset.groupId = group.id || '';

    const summary = document.createElement('summary');
    summary.className = 'header-activity-summary';
    summary.textContent = group.label || 'Menu';
    details.appendChild(summary);

    const panel = document.createElement('div');
    panel.className = 'header-activity-panel';

    let groupIsActive = false;
    let hiddenCount = 0;
    resolvedItems.forEach((item) => {
      const isActive = item.id === currentId || navHrefMatchesCurrentPage(item.href, currentFile);
      if (isActive) groupIsActive = true;
      if (item.studentHidden) hiddenCount += 1;

      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'header-activity-link';
      link.textContent = item.label;
      if (item.studentHidden) {
        link.setAttribute('data-student-hidden', 'true');
      }
      if (item.action) {
        link.dataset.navAction = item.action;
      }
      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
      panel.appendChild(link);
    });

    if (hiddenCount === resolvedItems.length) {
      details.setAttribute('data-student-hidden', 'true');
    }
    if (groupIsActive) {
      summary.classList.add('active');
      summary.setAttribute('aria-current', 'page');
    }

    details.appendChild(panel);
    return details;
  }

  function wirePrimaryNavMenus(nav, currentId = '') {
    if (!nav) return;
    const menus = Array.from(nav.querySelectorAll('.header-activity-menu'));
    menus.forEach((menu) => {
      if (menu.dataset.bound === 'true') return;
      menu.dataset.bound = 'true';
      menu.addEventListener('toggle', () => {
        if (!menu.open) return;
        menus.forEach((other) => {
          if (other !== menu) other.removeAttribute('open');
        });
      });
    });

    if (nav.dataset.dismissBound !== 'true') {
      nav.dataset.dismissBound = 'true';
      document.addEventListener('click', (event) => {
        if (!(event.target instanceof Node) || nav.contains(event.target)) return;
        menus.forEach((menu) => menu.removeAttribute('open'));
      });
    }

    if (nav.dataset.toolActionBound !== 'true') {
      nav.dataset.toolActionBound = 'true';
      nav.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const actionLink = target.closest('[data-nav-action]');
        if (!(actionLink instanceof HTMLAnchorElement)) return;
        const action = (actionLink.dataset.navAction || '').trim();
        if (!action || currentId !== 'word-quest') return;
        event.preventDefault();
        menus.forEach((menu) => menu.removeAttribute('open'));
        window.dispatchEvent(new CustomEvent('cornerstone:tool-request', { detail: { action } }));
      });
    }
  }

  function renderPrimaryNav() {
    const navs = Array.from(document.querySelectorAll('.header-actions'));
    if (!navs.length) return;
    const currentFile = getCurrentPageFile();
    const currentActivity = getCurrentActivity();
    const currentId = currentActivity?.id || '';

    navs.forEach((nav) => {
      nav.innerHTML = '';
      PRIMARY_GUIDED_LINKS.forEach((entry) => {
        const link = document.createElement('a');
        link.className = 'link-btn';
        link.href = entry.href;
        link.textContent = entry.label;
        if (entry.studentHidden) {
          link.setAttribute('data-student-hidden', 'true');
        }
        if (entry.href.toLowerCase() === currentFile) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
        nav.appendChild(link);
      });

      NAV_MENU_GROUPS.forEach((group) => {
        const menu = createNavGroupMenu(group, currentId, currentFile);
        if (menu) nav.appendChild(menu);
      });
      wirePrimaryNavMenus(nav, currentId);
    });

    renderStudentModeExitControl();
  }

  function renderPageGuideTip() {
    const activityId = getCurrentActivityId();
    const tip = GUIDE_TIPS[activityId];
    const existing = document.getElementById('page-guide-tip');
    if (!tip) {
      if (existing) existing.remove();
      return;
    }

    const dismissKey = `${GUIDE_TIP_DISMISS_PREFIX}${activityId}`;
    if (localStorage.getItem(dismissKey) === 'true') {
      if (existing) existing.remove();
      return;
    }

    const main = document.querySelector('main');
    if (!main) return;
    const guide = existing || document.createElement('aside');
    guide.id = 'page-guide-tip';
    guide.className = 'page-guide-tip';
    guide.setAttribute('role', 'status');
    guide.setAttribute('aria-live', 'polite');
    guide.innerHTML = `
      <div class="page-guide-tip-title">${tip.title}</div>
      <div class="page-guide-tip-body">${tip.body}</div>
      <div class="page-guide-tip-actions">
        <button type="button" class="secondary-btn" data-tip-action="hide">Hide</button>
        <button type="button" class="secondary-btn" data-tip-action="dismiss">Got it (don't show again)</button>
      </div>
    `;

    if (!existing) {
      main.insertBefore(guide, main.firstChild);
    }

    if (guide.dataset.bound !== 'true') {
      guide.dataset.bound = 'true';
      guide.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const action = target.getAttribute('data-tip-action');
        if (!action) return;
        if (action === 'dismiss') {
          localStorage.setItem(dismissKey, 'true');
        }
        guide.remove();
      });
    }
  }

  function buildLearnerOptions(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    getLearners().forEach((learner) => {
      const option = document.createElement('option');
      option.value = learner.id;
      option.textContent = learner.name;
      selectEl.appendChild(option);
    });
    selectEl.value = getActiveLearnerId();
  }

  function renderLearnerSwitchers() {
    const containers = Array.from(document.querySelectorAll('.header-actions'));
    if (!containers.length) return;

    containers.forEach((container) => {
      let switcher = container.querySelector('.learner-switcher');
      if (!switcher) {
        switcher = document.createElement('div');
        switcher.className = 'learner-switcher';
        switcher.innerHTML = `
          <label class="learner-switcher-label">Learner</label>
          <select class="learner-switcher-select" aria-label="Active learner"></select>
          <a class="link-btn learner-manage-btn" href="index.html#learners">Manage</a>
        `;
        container.appendChild(switcher);
      }

      const select = switcher.querySelector('.learner-switcher-select');
      buildLearnerOptions(select);
      if (select && select.dataset.bound !== 'true') {
        select.dataset.bound = 'true';
        select.addEventListener('change', () => {
          const nextId = select.value;
          platform.setActiveLearner(nextId, { reload: true });
        });
      }
    });

    renderStudentModeExitControl();
  }

  platform.refreshLearnerSwitchers = function refreshLearnerSwitchersPublic() {
    renderLearnerSwitchers();
  };
  platform.refreshStoryTrack = function refreshStoryTrackPublic() {
    renderStoryTrack();
  };
  platform.refreshQuickResponses = function refreshQuickResponsesPublic() {
    renderQuickResponseDock();
  };
  platform.refreshAccessibilityTools = function refreshAccessibilityToolsPublic() {
    renderAccessibilityPanel();
    applyFocusModeLayout();
  };

  ensureFavicon();
  renderBuildStamp();
  renderPrimaryNav();
  applyStudentModeState();
  renderLearnerSwitchers();
  renderBreadcrumbTrail();
  renderPageGuideTip();
  renderAccessibilityPanel();
  renderStoryTrack();
  renderQuickResponseDock();
  applyFocusModeLayout();

  window.addEventListener('decode:settings-changed', () => {
    renderAccessibilityPanel();
    applyFocusModeLayout();
  });

  window.addEventListener('decode:home-role-changed', () => {
    applyStudentModeState();
    renderStudentModeExitControl();
  });

  window.addEventListener('storage', (event) => {
    if (!event || event.key === HOME_ROLE_KEY) {
      applyStudentModeState();
      renderStudentModeExitControl();
    }
  });

  window.addEventListener('decode:quick-responses-changed', () => {
    renderQuickResponseDock();
  });

  const activityId = getCurrentActivityId();
  if (activityId && activityId !== 'home' && activityId !== 'word-quest' && activityId !== 'plan-it' && activityId !== 'teacher-report') {
    const main = document.querySelector('main');
    if (main) {
      const readLessonMap = () => {
        const parsed = safeParse(localStorage.getItem(LESSON_KEY) || '');
        return parsed && typeof parsed === 'object' ? parsed : {};
      };
      const saveLessonMap = (map) => {
        localStorage.setItem(LESSON_KEY, JSON.stringify(map));
      };
      const getLessonUrl = () => {
        const map = readLessonMap();
        return (map[activityId] || '').toString().trim();
      };
      const setLessonUrl = (url) => {
        const map = readLessonMap();
        const cleaned = (url || '').toString().trim();
        if (cleaned) map[activityId] = cleaned;
        else delete map[activityId];
        saveLessonMap(map);
      };

      let lessonCard = document.getElementById('activity-lesson-card');
      if (!lessonCard) {
        lessonCard = document.createElement('div');
        lessonCard.id = 'activity-lesson-card';
        lessonCard.className = 'activity-lesson hidden';
        main.appendChild(lessonCard);
      }

      let teacherTools = document.getElementById('activity-teacher-tools');
      if (!teacherTools) {
        teacherTools = document.createElement('details');
        teacherTools.id = 'activity-teacher-tools';
        teacherTools.className = 'activity-teacher-tools';
        teacherTools.innerHTML = `
          <summary>Teacher tools</summary>
          <div class="activity-teacher-body">
            <label for="activity-lesson-url"><strong>Mini-lesson video link</strong></label>
            <div class="activity-teacher-row">
              <input id="activity-lesson-url" type="url" placeholder="Paste a YouTube link or a teacher video link" />
              <button id="activity-lesson-open" type="button" class="secondary-btn">Open</button>
            </div>
            <div class="muted">Tip: use a “share” link you trust. This app does not download videos.</div>
          </div>
        `;
        main.appendChild(teacherTools);
      }

      const renderLesson = () => {
        const url = getLessonUrl();
        const input = document.getElementById('activity-lesson-url');
        const openBtn = document.getElementById('activity-lesson-open');
        if (input) input.value = url;
        if (openBtn) openBtn.disabled = !url;

        if (!url) {
          lessonCard.classList.add('hidden');
          lessonCard.innerHTML = '';
          return;
        }

        lessonCard.classList.remove('hidden');
        lessonCard.innerHTML = `
          <div class="activity-lesson-title">Mini-lesson</div>
          <div class="activity-lesson-copy">Watch a short explanation before you start (opens a new tab).</div>
          <button id="activity-lesson-watch" type="button" class="secondary-btn">Watch</button>
        `;
        lessonCard.querySelector('#activity-lesson-watch')?.addEventListener('click', () => {
          window.open(url, '_blank', 'noopener,noreferrer');
        });
      };

      const input = document.getElementById('activity-lesson-url');
      input?.addEventListener('change', () => {
        setLessonUrl(input.value);
        renderLesson();
      });

      const openBtn = document.getElementById('activity-lesson-open');
      openBtn?.addEventListener('click', () => {
        const url = getLessonUrl();
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
      });

      renderLesson();
    }
  }
})();
