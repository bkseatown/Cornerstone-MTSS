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
      navLabel: 'Word Quest'
    },
    {
      id: 'cloze',
      href: 'cloze.html',
      navLabel: 'Story Fill'
    },
    {
      id: 'comprehension',
      href: 'comprehension.html',
      navLabel: 'Read & Think'
    },
    {
      id: 'fluency',
      href: 'fluency.html',
      navLabel: 'Speed Sprint'
    },
    {
      id: 'madlibs',
      href: 'madlibs.html',
      navLabel: 'Silly Stories'
    },
    {
      id: 'writing',
      href: 'writing.html',
      navLabel: 'Write & Build'
    },
    {
      id: 'plan-it',
      href: 'plan-it.html',
      navLabel: 'Plan-It'
    },
    {
      id: 'number-sense',
      href: 'number-sense.html',
      navLabel: 'Number Sense'
    },
    {
      id: 'operations',
      href: 'operations.html',
      navLabel: 'Operations'
    },
    {
      id: 'teacher-report',
      href: 'teacher-report.html',
      navLabel: 'Reports'
    }
  ];

  const ACTIVITY_STANDARD_TAGS = {
    'word-quest': ['RF.2.3', 'RF.3.3'],
    cloze: ['L.3.4', 'RL.3.1'],
    comprehension: ['RL.3.1', 'RI.3.1'],
    fluency: ['RF.3.4'],
    madlibs: ['L.3.1', 'L.3.3'],
    writing: ['W.3.2', 'W.3.4'],
    'plan-it': ['SL.3.1', 'W.3.8'],
    'number-sense': ['CCSS-MATH-3-NBT-A-1', 'CCSS-MATH-4-OA-A-3'],
    operations: ['CCSS-MATH-3-OA-A-1', 'CCSS-MATH-4-NBT-B-4']
  };

  const STORY_TRACK_ORDER = ['word-quest', 'fluency', 'comprehension', 'writing', 'plan-it'];
  const STORY_TRACK_ACTIVITIES = new Set(['cloze', 'comprehension', 'fluency', 'madlibs', 'writing', 'plan-it']);
  const QUICK_RESPONSE_ACTIVITIES = new Set(['cloze', 'comprehension', 'madlibs', 'writing', 'plan-it', 'number-sense', 'operations']);
  const BREADCRUMB_ACTIVITIES = new Set(['cloze', 'comprehension', 'fluency', 'madlibs', 'writing', 'plan-it', 'number-sense', 'operations', 'teacher-report']);
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

  function renderPrimaryNav() {
    const navs = Array.from(document.querySelectorAll('nav.header-actions'));
    if (!navs.length) return;
    const currentFile = getCurrentPageFile();

    navs.forEach((nav) => {
      nav.innerHTML = '';
      ACTIVITIES.forEach((activity) => {
        const link = document.createElement('a');
        link.className = 'link-btn';
        link.href = activity.href;
        link.textContent = activity.navLabel;
        if (activity.href.toLowerCase() === currentFile) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
        nav.appendChild(link);
      });
    });
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

  renderPrimaryNav();
  renderLearnerSwitchers();
  renderBreadcrumbTrail();
  renderAccessibilityPanel();
  renderStoryTrack();
  renderQuickResponseDock();
  applyFocusModeLayout();

  window.addEventListener('decode:settings-changed', () => {
    renderAccessibilityPanel();
    applyFocusModeLayout();
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
