const SCENARIOS = [
  {
    id: 'morning-mission',
    band: 'K-2',
    title: 'Morning Mission',
    description: 'It is 7:00 AM. You want to arrive at school feeling calm and ready by 8:30 AM.',
    tip: 'Tip: Put “must-do” tasks first, then leave a small buffer.',
    selFocus: 'Self-management: planning calmly',
    reflection: 'What could you do if one task takes longer than expected?',
    startTime: '7:00',
    endTime: '8:30',
    stepMinutes: 15,
    tasks: [
      { id: 'breakfast', label: 'Breakfast', durationMinutes: 15, earliest: '7:00', latestStart: '7:45' },
      { id: 'dress', label: 'Get dressed', durationMinutes: 15, earliest: '7:00', latestStart: '8:00' },
      { id: 'pack', label: 'Pack backpack', durationMinutes: 15, earliest: '7:15', latestStart: '8:00' },
      { id: 'read', label: 'Read 10–15 minutes', durationMinutes: 15, earliest: '7:15', latestStart: '8:15' },
      { id: 'leave', label: 'Leave for school', durationMinutes: 15, mustStart: '8:15' }
    ]
  },
  {
    id: 'after-school-rescue',
    band: '3-5',
    title: 'After-School Rescue',
    description: 'It is 3:00 PM. You want to finish your tasks and be ready for bed by 9:00 PM.',
    tip: 'Tip: Start with the fixed events (practice, dinner), then fit flexible tasks around them.',
    selFocus: 'Balance: responsibilities + self-care',
    reflection: 'Which task helps you feel most ready for tomorrow—and why?',
    startTime: '3:00',
    endTime: '9:00',
    stepMinutes: 30,
    tasks: [
      { id: 'snack', label: 'Snack', durationMinutes: 30, earliest: '3:00', latestStart: '4:30' },
      { id: 'homework', label: 'Homework', durationMinutes: 60, earliest: '3:00', latestStart: '6:00' },
      { id: 'reading', label: 'Reading', durationMinutes: 30, earliest: '3:30', latestStart: '8:00' },
      { id: 'practice', label: 'Practice', durationMinutes: 60, mustStart: '5:00' },
      { id: 'dinner', label: 'Dinner', durationMinutes: 30, mustStart: '6:30' },
      { id: 'shower', label: 'Shower', durationMinutes: 30, earliest: '7:00', latestStart: '8:00' }
    ]
  },
  {
    id: 'project-balance',
    band: '6-8',
    title: 'Project Balance',
    description: 'It is 4:00 PM. You have homework, a club practice, and you still need time to recharge before bed.',
    tip: 'Tip: Protect one short “reset” break so you don’t run out of focus.',
    selFocus: 'Executive function: focus + breaks',
    reflection: 'Where did you place your break—and how did it help your focus?',
    startTime: '4:00',
    endTime: '10:00',
    stepMinutes: 30,
    tasks: [
      { id: 'snack', label: 'Snack', durationMinutes: 30, earliest: '4:00', latestStart: '5:30' },
      { id: 'homework', label: 'Homework', durationMinutes: 60, earliest: '4:00', latestStart: '7:30' },
      { id: 'project', label: 'Group project', durationMinutes: 60, earliest: '4:30', latestStart: '8:00' },
      { id: 'practice', label: 'Club / practice', durationMinutes: 60, mustStart: '6:00' },
      { id: 'dinner', label: 'Dinner', durationMinutes: 30, mustStart: '7:30' },
      { id: 'reset', label: 'Reset break', durationMinutes: 30, earliest: '4:30', latestStart: '9:00' },
      { id: 'shower', label: 'Shower', durationMinutes: 30, earliest: '8:00', latestStart: '9:30' }
    ]
  },
  {
    id: 'work-study-wellness',
    band: '9-12',
    title: 'Work, Study, Wellness',
    description: 'It is 4:00 PM. You have a shift, then you need to study and still protect sleep by 11:00 PM.',
    tip: 'Tip: Schedule sleep first, then build the rest around it. “Late” work is harder.',
    selFocus: 'Boundaries: sleep + stress management',
    reflection: 'What boundary protects your well-being in this plan?',
    startTime: '4:00',
    endTime: '11:00',
    stepMinutes: 30,
    tasks: [
      { id: 'commute', label: 'Commute', durationMinutes: 30, mustStart: '4:30' },
      { id: 'shift', label: 'Work shift', durationMinutes: 180, mustStart: '5:00' },
      { id: 'dinner', label: 'Dinner', durationMinutes: 30, earliest: '8:00', latestStart: '9:30' },
      { id: 'study', label: 'Study block', durationMinutes: 60, earliest: '8:30', latestStart: '10:00' },
      { id: 'home', label: 'Home / family', durationMinutes: 30, earliest: '8:00', latestStart: '10:00' },
      { id: 'unwind', label: 'Unwind', durationMinutes: 30, earliest: '9:00', latestStart: '10:30' },
      { id: 'bed', label: 'Get ready for bed', durationMinutes: 30, mustStart: '10:30' }
    ]
  }
];

const scenarioSelect = document.getElementById('planit-scenario');
const scenarioTitle = document.getElementById('planit-scenario-title');
const scenarioText = document.getElementById('planit-scenario-text');
const scenarioTip = document.getElementById('planit-scenario-tip');
const quickGradeEl = document.getElementById('planit-quick-grade');
const quickFocusEl = document.getElementById('planit-quick-focus');
const quickMinutesEl = document.getElementById('planit-quick-minutes');
const quickGenerateBtn = document.getElementById('planit-quick-generate');
const quickOutputEl = document.getElementById('planit-quick-output');
const quickStatusEl = document.getElementById('planit-quick-status');
const taskList = document.getElementById('planit-task-list');
const resetBtn = document.getElementById('planit-reset');
const checkBtn = document.getElementById('planit-check');
const autoBtn = document.getElementById('planit-auto');
const hintBtn = document.getElementById('planit-hint');
const feedbackEl = document.getElementById('planit-feedback');
const timelineEl = document.getElementById('planit-timeline');
const lessonEl = document.getElementById('planit-lesson');
const missionRerollBtn = document.getElementById('planit-mission-reroll');
const missionListEl = document.getElementById('planit-mission-list');
const missionBannerEl = document.getElementById('planit-mission-banner');
const missionXpEl = document.getElementById('planit-xp');
const missionStreakEl = document.getElementById('planit-streak');
const missionLevelEl = document.getElementById('planit-level');
const missionProgressTextEl = document.getElementById('planit-level-progress-text');
const missionProgressFillEl = document.getElementById('planit-level-progress-fill');

const reflectionSection = document.getElementById('planit-reflection');
const reflectionPromptEl = document.getElementById('planit-reflection-prompt');
const reflectionInput = document.getElementById('planit-reflection-input');
const reflectionSaveBtn = document.getElementById('planit-reflection-save');
const reflectionSavedEl = document.getElementById('planit-reflection-saved');

const videoInput = document.getElementById('planit-video-url');
const videoOpenBtn = document.getElementById('planit-video-open');

const QUICK_ACTIVITY_META = {
  'word-quest': { label: 'Word Quest', href: 'word-quest.html' },
  cloze: { label: 'Story Fill', href: 'cloze.html' },
  comprehension: { label: 'Read & Think', href: 'comprehension.html' },
  fluency: { label: 'Speed Sprint', href: 'fluency.html' },
  madlibs: { label: 'Silly Stories', href: 'madlibs.html' },
  writing: { label: 'Writing Studio', href: 'writing.html' },
  'plan-it': { label: 'Plan-It', href: 'plan-it.html' }
};

const QUICK_FOCUS_LIBRARY = {
  'phonics-decoding': {
    label: 'Phonics & Decoding',
    summary: 'Build accurate word reading with explicit sound-symbol routines.',
    steps: [
      { phase: 'I do', activity: 'word-quest', move: 'Model target sound patterns and corrective feedback.' },
      { phase: 'We do', activity: 'cloze', move: 'Apply patterns in short sentence context together.' },
      { phase: 'You do with support', activity: 'fluency', move: 'Transfer to connected text with teacher prompts.' }
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
    summary: 'Increase accuracy, pacing, and expression while preserving comprehension.',
    steps: [
      { phase: 'I do', activity: 'fluency', move: 'Demonstrate phrasing and punctuation-aware reading.' },
      { phase: 'We do', activity: 'comprehension', move: 'Read and discuss evidence from the same text.' },
      { phase: 'You do with support', activity: 'writing', move: 'Write a short text response with sentence frames.' }
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
    summary: 'Strengthen text-based responses with evidence and reasoning.',
    steps: [
      { phase: 'I do', activity: 'comprehension', move: 'Model question unpacking and evidence hunting.' },
      { phase: 'We do', activity: 'cloze', move: 'Justify each answer with context clues.' },
      { phase: 'You do with support', activity: 'writing', move: 'Write a short evidence statement with feedback.' }
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
    summary: 'Improve sentence quality, structure, and vocabulary choices.',
    steps: [
      { phase: 'I do', activity: 'writing', move: 'Model one clear topic sentence and one detail sentence.' },
      { phase: 'We do', activity: 'madlibs', move: 'Co-build grammar and vocabulary decisions.' },
      { phase: 'You do with support', activity: 'comprehension', move: 'Respond to prompts using sentence stems.' }
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
    summary: 'Develop planning, pacing, and self-regulation routines.',
    steps: [
      { phase: 'I do', activity: 'plan-it', move: 'Model task sequencing and timing decisions.' },
      { phase: 'We do', activity: 'writing', move: 'Co-write one realistic daily plan.' },
      { phase: 'You do with support', activity: 'comprehension', move: 'Reflect with evidence-based check-ins.' }
    ],
    wordQuestFocusByBand: {
      'K-2': { focus: 'cvc', len: '3' },
      '3-5': { focus: 'ccvc', len: '4' },
      '6-8': { focus: 'multisyllable', len: 'any' },
      '9-12': { focus: 'multisyllable', len: 'any' }
    }
  }
};

const STORAGE_KEY = 'planit_progress_v2';
const VIDEO_KEY = 'planit_video_links_v1';
const REFLECTION_KEY = 'planit_reflections_v1';
const CHALLENGE_KEY = 'planit_challenge_v1';
const LEVEL_XP = 100;
const BASE_MISSIONS = ['all-tasks', 'no-overlap'];
const FOCUS_TASK_PATTERN = /(break|reset|unwind|read|snack)/i;

let currentScenario = SCENARIOS[0];
let selections = {}; // { taskId: "HH:MM" }
let activeTaskId = null;
let lastCheck = { missing: new Set(), overlaps: new Set() };
let lastPlanSource = 'manual';
let challengeState = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  wins: 0,
  losses: 0,
  bonusMissionId: 'start-strong',
  lastScoredSignature: ''
};

function applyLightTheme() {
  document.body.classList.add('force-light');
  document.documentElement.classList.add('force-light');
  document.documentElement.style.colorScheme = 'light';
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function defaultChallengeState() {
  return {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    wins: 0,
    losses: 0,
    bonusMissionId: 'start-strong',
    lastScoredSignature: ''
  };
}

function loadChallengeState() {
  const parsed = safeParse(localStorage.getItem(CHALLENGE_KEY) || '');
  if (!parsed || typeof parsed !== 'object') {
    challengeState = defaultChallengeState();
    return;
  }
  challengeState = {
    ...defaultChallengeState(),
    ...parsed
  };
}

function saveChallengeState() {
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challengeState));
}

function getFocusTasksForScenario() {
  return (currentScenario.tasks || []).filter((task) => FOCUS_TASK_PATTERN.test(String(task.label || '')));
}

function getScenarioBonusMissionPool() {
  const pool = ['start-strong', 'finish-buffer'];
  if (getFocusTasksForScenario().length) {
    pool.push('focus-reset');
  }
  return pool;
}

function pickBonusMission(exclude = '') {
  const pool = getScenarioBonusMissionPool().filter((id) => id !== exclude);
  if (!pool.length) return 'start-strong';
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function ensureBonusMissionForScenario() {
  const pool = getScenarioBonusMissionPool();
  if (!pool.includes(challengeState.bonusMissionId)) {
    challengeState.bonusMissionId = pool[0] || 'start-strong';
    saveChallengeState();
  }
}

function getMissionDefinition(missionId) {
  switch (missionId) {
    case 'all-tasks':
      return {
        id: missionId,
        title: 'Fill the board',
        text: 'Place a start time for every task.'
      };
    case 'no-overlap':
      return {
        id: missionId,
        title: 'Zero overlap',
        text: 'Keep the timeline conflict-free.'
      };
    case 'focus-reset':
      return {
        id: missionId,
        title: 'Protect a reset',
        text: 'Schedule at least one regulation task before the final hour.'
      };
    case 'finish-buffer':
      return {
        id: missionId,
        title: 'Finish with buffer',
        text: 'Leave at least one step as a buffer before the timeline ends.'
      };
    default:
      return {
        id: 'start-strong',
        title: 'Start strong',
        text: 'Start one task inside the first hour window.'
      };
  }
}

function getMissionIds() {
  ensureBonusMissionForScenario();
  return BASE_MISSIONS.concat(challengeState.bonusMissionId || 'start-strong');
}

function normalizeGradeBand(value) {
  const band = String(value || '').trim();
  if (band === 'K-2' || band === '3-5' || band === '6-8' || band === '9-12') return band;
  return '3-5';
}

function getMinuteSplit(totalMinutes) {
  const n = Number(totalMinutes || 20);
  if (n <= 10) return [3, 4, 3];
  if (n <= 20) return [5, 8, 7];
  return [8, 12, 10];
}

function getQuickActivityHref(activityId, context = {}) {
  const meta = QUICK_ACTIVITY_META[activityId];
  if (!meta) return '#';
  const url = new URL(meta.href, window.location.href);
  if (activityId === 'word-quest' && context.wordQuestFocus) {
    url.searchParams.set('focus', context.wordQuestFocus);
    if (context.wordQuestLength) {
      url.searchParams.set('len', context.wordQuestLength);
    }
  }
  if (activityId === 'plan-it') {
    if (context.builderFocus) url.searchParams.set('builderFocus', context.builderFocus);
    if (context.builderGrade) url.searchParams.set('builderGrade', context.builderGrade);
    if (context.builderMinutes) url.searchParams.set('builderMinutes', String(context.builderMinutes));
  }
  return url.toString();
}

function toMinutes(timeStr) {
  const [h, m] = (timeStr || '0:0').split(':').map(n => Number(n));
  return (h * 60) + (m || 0);
}

function fromMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

function listSlots(scenario) {
  const start = toMinutes(scenario.startTime);
  const end = toMinutes(scenario.endTime);
  const step = scenario.stepMinutes;
  const slots = [];
  for (let t = start; t <= end; t += step) {
    slots.push(fromMinutes(t));
  }
  return slots;
}

function getTaskOptions(task, scenario) {
  const slots = listSlots(scenario);
  const start = toMinutes(scenario.startTime);
  const end = toMinutes(scenario.endTime);
  const dur = task.durationMinutes;

  if (task.mustStart) return [task.mustStart];

  const earliest = task.earliest ? toMinutes(task.earliest) : start;
  const latestStart = task.latestStart ? toMinutes(task.latestStart) : (end - dur);

  return slots.filter(label => {
    const t = toMinutes(label);
    if (t < earliest) return false;
    if (t > latestStart) return false;
    if (t + dur > end) return false;
    return true;
  });
}

function initializeFixedTasks() {
  (currentScenario.tasks || []).forEach(task => {
    if (task.mustStart) selections[task.id] = task.mustStart;
  });
}

function getDefaultGradeBand() {
  try {
    const profile = window.DECODE_PLATFORM?.getProfile?.();
    return profile?.gradeBand || '';
  } catch (e) {
    return '';
  }
}

function pickDefaultScenario() {
  const band = getDefaultGradeBand();
  if (band) {
    const found = SCENARIOS.find(s => s.band === band);
    if (found) return found;
  }
  return SCENARIOS.find(s => s.id === 'after-school-rescue') || SCENARIOS[0];
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;
    const pick = SCENARIOS.find(s => s.id === parsed.scenarioId);
    if (pick) currentScenario = pick;
    selections = parsed.selections || {};
  } catch (e) {}
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    scenarioId: currentScenario.id,
    selections
  }));
}

function buildScenarioList() {
  const order = ['K-2', '3-5', '6-8', '9-12'];
  scenarioSelect.innerHTML = '';

  order.forEach(band => {
    const items = SCENARIOS.filter(s => s.band === band);
    if (!items.length) return;
    const group = document.createElement('optgroup');
    group.label = band;
    items.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.title;
      group.appendChild(option);
    });
    scenarioSelect.appendChild(group);
  });

  if (!Array.from(scenarioSelect.options).some(o => o.value === currentScenario.id)) {
    currentScenario = pickDefaultScenario();
  }
  scenarioSelect.value = currentScenario.id;
}

function renderScenario() {
  scenarioTitle.textContent = currentScenario.title;
  const sel = currentScenario.selFocus ? ` • ${currentScenario.selFocus}` : '';
  scenarioText.textContent = `${currentScenario.description}${sel}`;
  scenarioTip.textContent = currentScenario.tip || '';
}

function getIntervals() {
  const start = toMinutes(currentScenario.startTime);
  const end = toMinutes(currentScenario.endTime);

  const intervals = [];
  currentScenario.tasks.forEach(task => {
    const startLabel = selections[task.id];
    if (!startLabel) return;
    const t0 = toMinutes(startLabel);
    const t1 = t0 + task.durationMinutes;
    intervals.push({
      id: task.id,
      label: task.label,
      start: t0,
      end: t1,
      duration: task.durationMinutes,
      fixed: !!task.mustStart
    });
  });

  const problems = [];
  intervals.forEach(it => {
    if (it.start < start || it.end > end) problems.push(`${it.label} does not fit in the timeline.`);
  });

  return { intervals, problems };
}

function evaluatePlanSnapshot() {
  const missingTasks = currentScenario.tasks.filter((task) => !selections[task.id]);
  const { intervals, problems: rangeProblems } = getIntervals();
  const issues = rangeProblems.slice();
  const overlapIds = new Set();
  const sorted = intervals.slice().sort((a, b) => a.start - b.start);

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (cur.start < prev.end) {
      issues.push(`Overlap: ${prev.label} overlaps with ${cur.label}.`);
      overlapIds.add(prev.id);
      overlapIds.add(cur.id);
    }
  }

  currentScenario.tasks.forEach((task) => {
    const chosen = selections[task.id];
    if (!chosen) return;
    if (task.mustStart && chosen !== task.mustStart) {
      issues.push(`${task.label} must start at ${task.mustStart}.`);
      overlapIds.add(task.id);
    }
    if (task.earliest && toMinutes(chosen) < toMinutes(task.earliest)) {
      issues.push(`${task.label} starts too early (earliest: ${task.earliest}).`);
    }
    if (task.latestStart && toMinutes(chosen) > toMinutes(task.latestStart)) {
      issues.push(`${task.label} starts too late (latest: ${task.latestStart}).`);
    }
  });

  const start = toMinutes(currentScenario.startTime);
  const end = toMinutes(currentScenario.endTime);
  const firstHourLimit = start + 60;
  const hasEarlyStart = intervals.some((interval) => interval.start <= firstHourLimit);
  const focusTaskIds = new Set(getFocusTasksForScenario().map((task) => task.id));
  const finalHourStart = end - 60;
  const hasFocusReset = intervals.some((interval) => focusTaskIds.has(interval.id) && interval.start < finalHourStart);
  const latestEnd = intervals.reduce((max, interval) => Math.max(max, interval.end), start);
  const hasBuffer = (end - latestEnd) >= currentScenario.stepMinutes;

  return {
    missingTasks,
    intervals,
    sorted,
    issues,
    overlapIds,
    allTasksPlaced: missingTasks.length === 0,
    noOverlaps: overlapIds.size === 0,
    clean: missingTasks.length === 0 && issues.length === 0,
    hasEarlyStart,
    hasFocusReset,
    hasBuffer
  };
}

function getMissionStatuses(snapshot) {
  const map = {
    'all-tasks': snapshot.allTasksPlaced,
    'no-overlap': snapshot.allTasksPlaced && snapshot.noOverlaps && snapshot.issues.length === 0,
    'start-strong': snapshot.hasEarlyStart,
    'focus-reset': snapshot.hasFocusReset,
    'finish-buffer': snapshot.hasBuffer
  };

  return getMissionIds().map((missionId) => {
    const def = getMissionDefinition(missionId);
    return {
      ...def,
      done: !!map[missionId]
    };
  });
}

function buildPlanSignature() {
  const rows = Object.keys(selections)
    .sort()
    .map((taskId) => `${taskId}:${selections[taskId]}`);
  return `${currentScenario.id}|${rows.join('|')}`;
}

function renderMissionBoard(snapshot = evaluatePlanSnapshot()) {
  if (!missionListEl) return;
  const missionStatuses = getMissionStatuses(snapshot);
  const level = Math.floor((Number(challengeState.xp) || 0) / LEVEL_XP) + 1;
  const progress = (Number(challengeState.xp) || 0) % LEVEL_XP;
  const progressPct = Math.max(0, Math.min(100, (progress / LEVEL_XP) * 100));
  const doneCount = missionStatuses.filter((mission) => mission.done).length;

  missionXpEl.textContent = String(Math.max(0, Number(challengeState.xp) || 0));
  missionStreakEl.textContent = String(Math.max(0, Number(challengeState.streak) || 0));
  missionLevelEl.textContent = String(level);
  missionProgressTextEl.textContent = `${progress} / ${LEVEL_XP} XP to next level`;
  missionProgressFillEl.style.width = `${progressPct}%`;

  missionListEl.innerHTML = missionStatuses.map((mission) => `
    <article class="planit-mission-item ${mission.done ? 'is-done' : ''}">
      <div class="planit-mission-item-main">
        <div class="planit-mission-item-title">${mission.title}</div>
        <div class="planit-mission-item-text">${mission.text}</div>
      </div>
      <div class="planit-mission-item-status">${mission.done ? '✓' : '•'}</div>
    </article>
  `).join('');

  if (missionBannerEl && !missionBannerEl.textContent.trim()) {
    missionBannerEl.textContent = `Missions complete: ${doneCount} / ${missionStatuses.length}.`;
    missionBannerEl.classList.toggle('muted', true);
  }
}

function setMissionBanner(message, tone = 'neutral') {
  if (!missionBannerEl) return;
  missionBannerEl.textContent = message || '';
  missionBannerEl.classList.remove('muted', 'is-success', 'is-warning');
  if (!message) {
    missionBannerEl.classList.add('muted');
    return;
  }
  if (tone === 'success') missionBannerEl.classList.add('is-success');
  else if (tone === 'warning') missionBannerEl.classList.add('is-warning');
  else missionBannerEl.classList.add('muted');
}

function overlapsAny(interval, others) {
  return others.some(o => (interval.start < o.end && interval.end > o.start));
}

function isSlotAvailable(task, timeLabel) {
  if (!task || !timeLabel) return false;
  const options = getTaskOptions(task, currentScenario);
  if (!options.includes(timeLabel)) return false;

  const start = toMinutes(timeLabel);
  const interval = { start, end: start + task.durationMinutes };
  const { intervals } = getIntervals();
  const others = intervals.filter(i => i.id !== task.id);
  return !overlapsAny(interval, others);
}

function formatConstraint(task) {
  if (task.mustStart) return `Fixed: ${task.mustStart}`;
  const parts = [];
  if (task.earliest) parts.push(`Earliest ${task.earliest}`);
  if (task.latestStart) parts.push(`Latest ${task.latestStart}`);
  return parts.join(' • ');
}

function renderTasks() {
  taskList.innerHTML = '';
  currentScenario.tasks.forEach(task => {
    const options = getTaskOptions(task, currentScenario);
    const chosen = selections[task.id] && options.includes(selections[task.id]) ? selections[task.id] : '';

    const row = document.createElement('div');
    row.className = 'planit-task';
    row.dataset.task = task.id;
    row.classList.toggle('is-active', activeTaskId === task.id);
    row.classList.toggle('is-missing', lastCheck.missing.has(task.id));

    const constraint = formatConstraint(task);
    const meta = constraint ? `${task.durationMinutes} min • ${constraint}` : `${task.durationMinutes} min`;

    if (task.mustStart) {
      row.innerHTML = `
        <div class="planit-task-left">
          <div class="planit-task-name">${task.label}</div>
          <div class="planit-task-meta">${meta}</div>
        </div>
        <div class="planit-task-right">
          <div class="planit-fixed-pill" aria-label="Fixed start time">${task.mustStart}</div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="planit-task-left">
          <div class="planit-task-name">${task.label}</div>
          <div class="planit-task-meta">${meta}</div>
        </div>
        <div class="planit-task-right">
          <label class="planit-task-label">
            Start
            <select data-task="${task.id}">
              <option value="">Choose…</option>
              ${options.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
          </label>
        </div>
      `;

      const select = row.querySelector('select');
      select.value = chosen;
      select.addEventListener('change', () => {
        if (select.value) {
          selections[task.id] = select.value;
        } else {
          delete selections[task.id];
        }
        lastPlanSource = 'manual';
        activeTaskId = null;
        clearCheckFlags();
        saveState();
        renderTasks();
        renderTimeline();
        renderMissionBoard();
        setMissionBanner('');
        hideReflection();
      });
    }

    row.addEventListener('click', (event) => {
      if (event.target && (event.target.tagName === 'SELECT' || event.target.tagName === 'OPTION' || event.target.tagName === 'BUTTON' || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
        return;
      }
      if (task.mustStart) return;
      activeTaskId = (activeTaskId === task.id) ? null : task.id;
      renderTasks();
      renderTimeline();
    });

    taskList.appendChild(row);
  });
}

function clearCheckFlags() {
  lastCheck = { missing: new Set(), overlaps: new Set() };
}

function renderTimeline() {
  const slots = listSlots(currentScenario);
  const start = toMinutes(currentScenario.startTime);
  const step = currentScenario.stepMinutes;
  const rows = Math.max(1, slots.length - 1);

  timelineEl.innerHTML = '';
  timelineEl.style.setProperty('--planit-rows', String(rows));

  const activeTask = activeTaskId ? currentScenario.tasks.find(t => t.id === activeTaskId) : null;
  const activeOptions = activeTask ? getTaskOptions(activeTask, currentScenario) : [];

  // row labels + slots
  slots.slice(0, -1).forEach((label, i) => {
    const row = document.createElement('div');
    row.className = 'planit-time-row';
    row.style.gridRow = `${i + 1}`;

    const time = document.createElement('div');
    time.className = 'planit-time-label';
    time.textContent = label;

    const slot = document.createElement('div');
    slot.className = 'planit-time-slot';
    slot.dataset.time = label;

    if (activeTask && activeOptions.includes(label)) {
      const canPlace = isSlotAvailable(activeTask, label);
      slot.classList.toggle('is-available', canPlace);
      slot.classList.toggle('is-unavailable', !canPlace);
    }

    slot.addEventListener('click', () => {
      if (!activeTask) return;
      if (!isSlotAvailable(activeTask, label)) return;
      selections[activeTask.id] = label;
      lastPlanSource = 'manual';
      activeTaskId = null;
      clearCheckFlags();
      saveState();
      renderTasks();
      renderTimeline();
      renderMissionBoard();
      setMissionBanner('');
      hideReflection();
    });

    timelineEl.appendChild(time);
    timelineEl.appendChild(slot);
  });

  // task blocks
  const { intervals } = getIntervals();
  intervals.forEach((it, idx) => {
    const rowStart = Math.floor((it.start - start) / step) + 1;
    const rowSpan = Math.max(1, Math.ceil(it.duration / step));
    const block = document.createElement('button');
    block.type = 'button';
    block.className = 'planit-block';
    block.style.gridRow = `${rowStart} / span ${rowSpan}`;
    block.style.setProperty('--planit-color', String((idx % 6) + 1));
    block.classList.toggle('is-overlap', lastCheck.overlaps.has(it.id));
    block.classList.toggle('is-fixed', it.fixed);
    block.setAttribute('aria-label', `${it.label} starting at ${fromMinutes(it.start)} for ${it.duration} minutes`);
    block.innerHTML = `
      <div class="planit-block-title">${it.label}</div>
      <div class="planit-block-meta">${fromMinutes(it.start)} • ${it.duration} min</div>
    `;
    block.addEventListener('click', () => {
      const task = currentScenario.tasks.find(t => t.id === it.id);
      if (task?.mustStart) return;
      delete selections[it.id];
      lastPlanSource = 'manual';
      clearCheckFlags();
      saveState();
      renderTasks();
      renderTimeline();
      renderMissionBoard();
      setMissionBanner('');
      hideReflection();
    });
    timelineEl.appendChild(block);
  });
}

function awardChallengeWin(snapshot) {
  const signature = buildPlanSignature();
  if (signature === challengeState.lastScoredSignature) {
    const missionStatuses = getMissionStatuses(snapshot);
    setMissionBanner(`Plan already scored. ${missionStatuses.filter((mission) => mission.done).length}/${missionStatuses.length} missions complete. Tweak the plan for more XP.`, 'warning');
    renderMissionBoard(snapshot);
    return;
  }

  const missionStatuses = getMissionStatuses(snapshot);
  const completed = missionStatuses.filter((mission) => mission.done).length;
  const allComplete = completed === missionStatuses.length;
  let xpGain = 22 + (completed * 5);
  if (allComplete) xpGain += 8;
  if (lastPlanSource === 'manual') xpGain += 5;

  challengeState.xp = (Number(challengeState.xp) || 0) + xpGain;
  challengeState.streak = (Number(challengeState.streak) || 0) + 1;
  challengeState.bestStreak = Math.max(Number(challengeState.bestStreak) || 0, challengeState.streak);
  challengeState.wins = (Number(challengeState.wins) || 0) + 1;
  challengeState.lastScoredSignature = signature;
  saveChallengeState();

  const streakNote = challengeState.streak > 1 ? ` · streak x${challengeState.streak}` : '';
  const fullNote = allComplete ? ' All missions complete.' : '';
  setMissionBanner(`+${xpGain} XP${streakNote}. ${completed}/${missionStatuses.length} missions complete.${fullNote}`, 'success');
  renderMissionBoard(snapshot);
}

function awardChallengeMiss(snapshot) {
  if ((Number(challengeState.streak) || 0) > 0) {
    challengeState.streak = 0;
  }
  challengeState.losses = (Number(challengeState.losses) || 0) + 1;
  saveChallengeState();
  setMissionBanner('Plan has conflicts. Use Hint move to fix one step quickly.', 'warning');
  renderMissionBoard(snapshot);
}

function checkPlan() {
  feedbackEl.textContent = '';
  clearCheckFlags();

  const snapshot = evaluatePlanSnapshot();
  if (snapshot.missingTasks.length) {
    lastCheck.missing = new Set(snapshot.missingTasks.map((task) => task.id));
    feedbackEl.textContent = `Pick start times for: ${snapshot.missingTasks.map((task) => task.label).join(', ')}.`;
    renderTasks();
    renderTimeline();
    setMissionBanner('Finish placing all tasks, then run Check Plan for XP.', 'warning');
    renderMissionBoard(snapshot);
    hideReflection();
    return;
  }

  lastCheck.overlaps = snapshot.overlapIds;

  if (snapshot.issues.length) {
    feedbackEl.innerHTML = `<ul class="planit-feedback-list">${snapshot.issues.map((problem) => `<li>⚠️ ${problem}</li>`).join('')}</ul>`;
    renderTasks();
    renderTimeline();
    awardChallengeMiss(snapshot);
    hideReflection();
  } else {
    feedbackEl.textContent = '✅ Nice plan! Everything fits with no overlaps.';
    renderTasks();
    renderTimeline();
    awardChallengeWin(snapshot);
    showReflection();
  }

  try {
    window.DECODE_PLATFORM?.logActivity?.({
      activity: 'plan-it',
      label: 'Plan-It',
      event: snapshot.issues.length ? `Checked (${snapshot.issues.length} issue${snapshot.issues.length === 1 ? '' : 's'})` : 'Checked (no overlaps)',
      detail: {
        scenarioId: currentScenario.id,
        scenarioTitle: currentScenario.title,
        issues: snapshot.issues.length
      }
    });
  } catch (e) {}
}

function autoPlan() {
  clearCheckFlags();
  hideReflection();
  lastPlanSource = 'auto';

  const fixed = {};
  currentScenario.tasks.forEach(t => {
    if (t.mustStart) fixed[t.id] = t.mustStart;
  });
  selections = { ...fixed };

  const flex = currentScenario.tasks
    .filter(t => !t.mustStart)
    .map(t => {
      const opts = getTaskOptions(t, currentScenario);
      return { task: t, options: opts, window: opts.length };
    })
    .sort((a, b) => (a.window - b.window) || (b.task.durationMinutes - a.task.durationMinutes));

  flex.forEach(({ task, options }) => {
    for (const label of options) {
      if (isSlotAvailable(task, label)) {
        selections[task.id] = label;
        break;
      }
    }
  });

  saveState();
  renderTasks();
  renderTimeline();
  renderMissionBoard();
  setMissionBanner('Auto-plan filled a draft. Use Hint move or drag-by-click to personalize it.', 'neutral');
  feedbackEl.textContent = 'Auto-plan filled what it could. Tap “Check Plan” to review.';
}

function resetAll() {
  selections = {};
  initializeFixedTasks();
  activeTaskId = null;
  lastPlanSource = 'manual';
  clearCheckFlags();
  saveState();
  renderTasks();
  renderTimeline();
  renderMissionBoard();
  setMissionBanner('Plan reset. Complete missions to rebuild your streak.', 'neutral');
  feedbackEl.textContent = '';
  hideReflection();
}

function loadVideoMap() {
  const parsed = safeParse(localStorage.getItem(VIDEO_KEY) || '');
  return parsed && typeof parsed === 'object' ? parsed : {};
}

function saveVideoMap(map) {
  localStorage.setItem(VIDEO_KEY, JSON.stringify(map));
}

function currentVideoUrl() {
  const map = loadVideoMap();
  return (map[currentScenario.id] || '').toString().trim();
}

function setCurrentVideoUrl(url) {
  const map = loadVideoMap();
  const cleaned = (url || '').toString().trim();
  if (cleaned) {
    map[currentScenario.id] = cleaned;
  } else {
    delete map[currentScenario.id];
  }
  saveVideoMap(map);
}

function renderLesson() {
  if (!lessonEl) return;
  const url = currentVideoUrl();
  if (!url) {
    lessonEl.classList.add('hidden');
    lessonEl.innerHTML = '';
    return;
  }
  lessonEl.classList.remove('hidden');
  lessonEl.innerHTML = `
    <div class="planit-lesson-title">Mini-lesson</div>
    <div class="planit-lesson-copy">Watch a short explanation before you plan (opens a new tab).</div>
    <button type="button" id="planit-lesson-open" class="secondary-btn">Watch</button>
  `;
  lessonEl.querySelector('#planit-lesson-open')?.addEventListener('click', () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

function syncTeacherVideoControls() {
  if (!videoInput || !videoOpenBtn) return;
  const url = currentVideoUrl();
  videoInput.value = url;
  videoOpenBtn.disabled = !url;
}

function renderQuickFocusOptions() {
  if (!quickFocusEl) return;
  quickFocusEl.innerHTML = Object.entries(QUICK_FOCUS_LIBRARY)
    .map(([id, profile]) => `<option value="${id}">${profile.label}</option>`)
    .join('');
}

function applyQuickBuilderQueryDefaults() {
  const params = new URLSearchParams(window.location.search || '');
  const queryFocus = String(params.get('builderFocus') || '').trim();
  const queryGradeRaw = String(params.get('builderGrade') || '').trim();
  const queryGrade = normalizeGradeBand(queryGradeRaw);
  const queryMinutes = String(params.get('builderMinutes') || '').trim();

  if (quickGradeEl) {
    const profileBand = normalizeGradeBand(getDefaultGradeBand());
    quickGradeEl.value = profileBand;
    if (queryGradeRaw) quickGradeEl.value = queryGrade;
  }

  if (quickFocusEl && queryFocus && QUICK_FOCUS_LIBRARY[queryFocus]) {
    quickFocusEl.value = queryFocus;
  }

  if (quickMinutesEl && ['10', '20', '30'].includes(queryMinutes)) {
    quickMinutesEl.value = queryMinutes;
  }
}

function renderQuickLessonBuilder() {
  if (!quickOutputEl || !quickFocusEl || !quickGradeEl || !quickMinutesEl) return;

  const focusId = String(quickFocusEl.value || 'comprehension-evidence');
  const gradeBand = normalizeGradeBand(quickGradeEl.value || getDefaultGradeBand());
  const minutes = Number(quickMinutesEl.value || 20);
  const profile = QUICK_FOCUS_LIBRARY[focusId] || QUICK_FOCUS_LIBRARY['comprehension-evidence'];
  const split = getMinuteSplit(minutes);
  const wordQuestDefaults = profile.wordQuestFocusByBand?.[gradeBand] || { focus: 'all', len: 'any' };

  const stepCards = profile.steps.map((step, index) => {
    const activityMeta = QUICK_ACTIVITY_META[step.activity] || { label: step.activity };
    const href = getQuickActivityHref(step.activity, {
      wordQuestFocus: wordQuestDefaults.focus,
      wordQuestLength: wordQuestDefaults.len,
      builderFocus: focusId,
      builderGrade: gradeBand,
      builderMinutes: minutes
    });
    return `
      <article class="planit-quick-step">
        <div class="planit-quick-phase">${index + 1}. ${step.phase} · ${split[index] || split[split.length - 1]} min</div>
        <div class="planit-quick-activity">${activityMeta.label}</div>
        <div class="planit-quick-move">${step.move}</div>
        <a class="secondary-btn planit-quick-link" href="${href}">Open ${activityMeta.label}</a>
      </article>
    `;
  }).join('');

  const redActivity = QUICK_ACTIVITY_META[profile.steps[0]?.activity]?.label || 'Target activity';
  const yellowActivity = QUICK_ACTIVITY_META[profile.steps[1]?.activity]?.label || 'Guided activity';
  const greenActivity = QUICK_ACTIVITY_META[profile.steps[2]?.activity]?.label || 'Independent activity';

  quickOutputEl.innerHTML = `
    <div class="planit-quick-summary">
      <strong>${profile.label}</strong> · ${minutes} minutes · ${gradeBand}
      <div>${profile.summary}</div>
    </div>
    <div class="planit-quick-steps">${stepCards}</div>
    <div class="planit-quick-rag">
      <section class="planit-rag-lane planit-rag-red">
        <div class="planit-rag-title">Red (Immediate support)</div>
        <ul>
          <li>Start with explicit modeling and tight teacher prompts.</li>
          <li>Primary lane: ${redActivity}.</li>
        </ul>
      </section>
      <section class="planit-rag-lane planit-rag-yellow">
        <div class="planit-rag-title">Yellow (Guided practice)</div>
        <ul>
          <li>Move to coached reps with fast feedback loops.</li>
          <li>Primary lane: ${yellowActivity}.</li>
        </ul>
      </section>
      <section class="planit-rag-lane planit-rag-green">
        <div class="planit-rag-title">Green (Maintain + extend)</div>
        <ul>
          <li>Assign independent reps and extension challenges.</li>
          <li>Primary lane: ${greenActivity}.</li>
        </ul>
      </section>
    </div>
  `;

  if (quickStatusEl) {
    quickStatusEl.textContent = `Built ${minutes}-minute lesson for ${gradeBand}.`;
  }
}

function loadReflectionMap() {
  const parsed = safeParse(localStorage.getItem(REFLECTION_KEY) || '');
  return parsed && typeof parsed === 'object' ? parsed : {};
}

function saveReflectionMap(map) {
  localStorage.setItem(REFLECTION_KEY, JSON.stringify(map));
}

function loadReflectionText() {
  const map = loadReflectionMap();
  return (map[currentScenario.id]?.text || '').toString();
}

function saveReflectionText(text) {
  const map = loadReflectionMap();
  map[currentScenario.id] = {
    text: (text || '').toString(),
    updatedAt: Date.now()
  };
  saveReflectionMap(map);
}

function showReflection() {
  if (!reflectionSection || !reflectionPromptEl || !reflectionInput) return;
  reflectionPromptEl.textContent = currentScenario.reflection || 'What strategy worked for you?';
  reflectionInput.value = loadReflectionText();
  reflectionSavedEl.textContent = '';
  reflectionSection.classList.remove('hidden');
}

function hideReflection() {
  if (!reflectionSection) return;
  reflectionSection.classList.add('hidden');
  if (reflectionSavedEl) reflectionSavedEl.textContent = '';
}

function findBestSlotForTask(task) {
  const options = getTaskOptions(task, currentScenario);
  if (!options.length) return '';
  const earliest = options.find((label) => isSlotAvailable(task, label));
  if (earliest) return earliest;
  return '';
}

function hintMove() {
  clearCheckFlags();
  const missingFlexTasks = currentScenario.tasks
    .filter((task) => !task.mustStart && !selections[task.id])
    .map((task) => ({ task, slot: findBestSlotForTask(task), window: getTaskOptions(task, currentScenario).length }))
    .sort((a, b) => (a.window - b.window) || (b.task.durationMinutes - a.task.durationMinutes));

  const nextMissing = missingFlexTasks.find((row) => row.slot);
  if (nextMissing) {
    activeTaskId = nextMissing.task.id;
    renderTasks();
    renderTimeline();
    renderMissionBoard();
    feedbackEl.textContent = `Hint: place ${nextMissing.task.label} at ${nextMissing.slot}.`;
    setMissionBanner(`Try the highlighted slots for ${nextMissing.task.label}.`, 'neutral');
    return;
  }

  const snapshot = evaluatePlanSnapshot();
  const overlapId = Array.from(snapshot.overlapIds)[0];
  if (overlapId) {
    const task = currentScenario.tasks.find((row) => row.id === overlapId && !row.mustStart);
    if (task) {
      activeTaskId = task.id;
      renderTasks();
      renderTimeline();
      renderMissionBoard(snapshot);
      feedbackEl.textContent = `Hint: move ${task.label} to an available green slot.`;
      setMissionBanner(`Resolve overlap by moving ${task.label}.`, 'warning');
      return;
    }
  }

  if (snapshot.clean) {
    feedbackEl.textContent = 'Your timeline is already clean. Check plan to bank XP.';
    setMissionBanner('Timeline looks ready. Run Check Plan to lock in points.', 'success');
    renderMissionBoard(snapshot);
    return;
  }

  feedbackEl.textContent = 'No automatic hint found. Try Auto-plan, then personalize one task at a time.';
  setMissionBanner('Use Auto-plan as a draft, then adjust for student reality.', 'warning');
  renderMissionBoard(snapshot);
}

function rerollMission() {
  const nextId = pickBonusMission(challengeState.bonusMissionId);
  challengeState.bonusMissionId = nextId;
  saveChallengeState();
  const snapshot = evaluatePlanSnapshot();
  renderMissionBoard(snapshot);
  setMissionBanner(`New challenge: ${getMissionDefinition(nextId).title}.`, 'neutral');
}

function init() {
  applyLightTheme();
  loadChallengeState();
  loadState();
  if (!currentScenario || !SCENARIOS.find(s => s.id === currentScenario.id)) {
    currentScenario = pickDefaultScenario();
    selections = {};
  }
  ensureBonusMissionForScenario();
  initializeFixedTasks();

  buildScenarioList();
  renderScenario();
  renderQuickFocusOptions();
  applyQuickBuilderQueryDefaults();
  renderQuickLessonBuilder();
  renderLesson();
  renderTasks();
  renderTimeline();
  renderMissionBoard();
  syncTeacherVideoControls();
  hideReflection();

  scenarioSelect.addEventListener('change', () => {
    const pick = SCENARIOS.find(s => s.id === scenarioSelect.value);
    if (pick) currentScenario = pick;
    selections = {};
    activeTaskId = null;
    lastPlanSource = 'manual';
    clearCheckFlags();
    initializeFixedTasks();
    ensureBonusMissionForScenario();
    saveState();
    renderScenario();
    renderLesson();
    renderTasks();
    renderTimeline();
    renderMissionBoard();
    setMissionBanner('');
    feedbackEl.textContent = '';
    syncTeacherVideoControls();
    hideReflection();
  });

  resetBtn.addEventListener('click', resetAll);
  checkBtn.addEventListener('click', checkPlan);
  autoBtn?.addEventListener('click', autoPlan);
  hintBtn?.addEventListener('click', hintMove);
  missionRerollBtn?.addEventListener('click', rerollMission);
  quickGenerateBtn?.addEventListener('click', renderQuickLessonBuilder);
  quickGradeEl?.addEventListener('change', renderQuickLessonBuilder);
  quickFocusEl?.addEventListener('change', renderQuickLessonBuilder);
  quickMinutesEl?.addEventListener('change', renderQuickLessonBuilder);

  reflectionSaveBtn?.addEventListener('click', () => {
    const text = (reflectionInput?.value || '').toString();
    saveReflectionText(text);
    if (reflectionSavedEl) reflectionSavedEl.textContent = 'Saved.';
  });

  videoInput?.addEventListener('change', () => {
    setCurrentVideoUrl(videoInput.value);
    syncTeacherVideoControls();
    renderLesson();
  });

  videoOpenBtn?.addEventListener('click', () => {
    const url = currentVideoUrl();
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

init();
