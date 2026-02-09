(function () {
  const BLOCK_LOG_KEY = 'decode_class_block_launch_log_v1';

  const ROLE_LABELS = {
    teacher: 'Teacher',
    admin: 'Administrator',
    dean: 'Dean',
    'learning-support': 'Learning Support Teacher',
    slp: 'Speech-Language Pathologist',
    eal: 'EAL Specialist',
    counselor: 'School Counselor',
    psychologist: 'School Psychologist',
    student: 'Student',
    parent: 'Parent / Caregiver'
  };

  const ROLE_ALIAS = {
    teacher: 'teacher',
    classroom: 'teacher',
    admin: 'admin',
    administrator: 'admin',
    leadership: 'admin',
    dean: 'dean',
    'learning-support': 'learning-support',
    learning_support: 'learning-support',
    ls: 'learning-support',
    sped: 'learning-support',
    slp: 'slp',
    speech: 'slp',
    eal: 'eal',
    ell: 'eal',
    esl: 'eal',
    counselor: 'counselor',
    counselling: 'counselor',
    psych: 'psychologist',
    psychologist: 'psychologist',
    student: 'student',
    learner: 'student',
    parent: 'parent',
    caregiver: 'parent',
    family: 'parent'
  };

  const ACTIVITY_LABELS = {
    'word-quest': 'Word Quest',
    cloze: 'Story Fill',
    comprehension: 'Read & Think',
    fluency: 'Speed Sprint',
    madlibs: 'Silly Stories',
    writing: 'Writing Studio',
    'plan-it': 'Plan-It',
    'number-sense': 'Number Sense Sprint',
    operations: 'Operation Builder',
    'problem-solving': 'Problem Pathways',
    'math-language': 'Math Language Builder',
    'teacher-report': 'Teacher Report'
  };

  const DURATION_PRESETS = [
    { minutes: 20, title: 'Quick Block', summary: 'Fast warm-up + guided practice + clear exit signal.' },
    { minutes: 30, title: 'Balanced Block', summary: 'Core instruction plus transfer and reflection.' },
    { minutes: 50, title: 'Full Intervention Block', summary: 'Explicit teach, guided reps, transfer, and evidence capture.' }
  ];

  const ROLE_TRACK = {
    teacher: 'integrated',
    admin: 'integrated',
    dean: 'integrated',
    'learning-support': 'literacy',
    slp: 'literacy',
    eal: 'literacy',
    counselor: 'integrated',
    psychologist: 'integrated',
    student: 'literacy',
    parent: 'integrated'
  };

  const TRACK_TEMPLATES = {
    literacy: {
      20: [
        { activity: 'word-quest', minutes: 6, move: 'Pattern warm-up and quick corrective feedback.' },
        { activity: 'cloze', minutes: 6, move: 'Apply word patterns inside sentence context.' },
        { activity: 'comprehension', minutes: 6, move: 'Use one text-evidence response cycle.' },
        { activity: 'teacher-report', minutes: 2, move: 'Capture one evidence note for next lesson.' }
      ],
      30: [
        { activity: 'word-quest', minutes: 8, move: 'Direct modeling + immediate correction.' },
        { activity: 'cloze', minutes: 8, move: 'Guided transfer with sentence frames.' },
        { activity: 'comprehension', minutes: 8, move: 'Evidence response with oral rehearsal.' },
        { activity: 'writing', minutes: 4, move: 'Short written transfer sentence.' },
        { activity: 'teacher-report', minutes: 2, move: 'Log progress and set next target.' }
      ],
      50: [
        { activity: 'word-quest', minutes: 10, move: 'Intensive pattern cycle and rapid error correction.' },
        { activity: 'cloze', minutes: 10, move: 'Context transfer in guided sets.' },
        { activity: 'comprehension', minutes: 10, move: 'Text evidence and reasoning check.' },
        { activity: 'fluency', minutes: 8, move: 'Repeated reading with prosody cueing.' },
        { activity: 'writing', minutes: 7, move: 'Create a short paragraph from the lesson text.' },
        { activity: 'teacher-report', minutes: 5, move: 'Update timeline and intervention notes.' }
      ]
    },
    numeracy: {
      20: [
        { activity: 'number-sense', minutes: 7, move: 'Mental number routine and strategy naming.' },
        { activity: 'operations', minutes: 7, move: 'Model conceptual operation strategy choices.' },
        { activity: 'problem-solving', minutes: 4, move: 'One verbalized problem pathway.' },
        { activity: 'teacher-report', minutes: 2, move: 'Capture strategy evidence and next move.' }
      ],
      30: [
        { activity: 'number-sense', minutes: 8, move: 'Number strings and friendly-number reasoning.' },
        { activity: 'operations', minutes: 8, move: 'Concrete-representational-abstract link.' },
        { activity: 'problem-solving', minutes: 8, move: 'Student explanation and strategy compare.' },
        { activity: 'math-language', minutes: 4, move: 'Sentence frame for math discourse.' },
        { activity: 'teacher-report', minutes: 2, move: 'Log outcomes and regroup signal.' }
      ],
      50: [
        { activity: 'number-sense', minutes: 12, move: 'Diagnostic warm-up with manipulative strategy talk.' },
        { activity: 'operations', minutes: 12, move: 'Concept-first operation sequence with models.' },
        { activity: 'problem-solving', minutes: 10, move: 'Multi-step task with coached reasoning.' },
        { activity: 'math-language', minutes: 8, move: 'Vocabulary and explanation rehearsal.' },
        { activity: 'operations', minutes: 3, move: 'Quick transfer check from known facts.' },
        { activity: 'teacher-report', minutes: 5, move: 'Update pulse evidence and next-cycle grouping.' }
      ]
    },
    integrated: {
      20: [
        { activity: 'word-quest', minutes: 5, move: 'Sound-symbol warm-up with immediate feedback.' },
        { activity: 'number-sense', minutes: 5, move: 'Mental strategy warm-up.' },
        { activity: 'comprehension', minutes: 4, move: 'One evidence-based prompt.' },
        { activity: 'operations', minutes: 4, move: 'One conceptual operation prompt.' },
        { activity: 'teacher-report', minutes: 2, move: 'Record one literacy + one numeracy signal.' }
      ],
      30: [
        { activity: 'word-quest', minutes: 7, move: 'Direct instruction and guided decoding reps.' },
        { activity: 'number-sense', minutes: 7, move: 'Strategy-focused number routine.' },
        { activity: 'comprehension', minutes: 6, move: 'Text evidence check with sentence stems.' },
        { activity: 'operations', minutes: 6, move: 'Visual model and reasoning explanation.' },
        { activity: 'plan-it', minutes: 2, move: 'Quick reflection and next-step plan.' },
        { activity: 'teacher-report', minutes: 2, move: 'Log today\'s intervention evidence.' }
      ],
      50: [
        { activity: 'word-quest', minutes: 10, move: 'Explicit phonics/morphology instruction cycle.' },
        { activity: 'comprehension', minutes: 10, move: 'Evidence-based reading transfer.' },
        { activity: 'number-sense', minutes: 10, move: 'Conceptual strategy routine with talk.' },
        { activity: 'operations', minutes: 8, move: 'Reasoning-first operation practice.' },
        { activity: 'plan-it', minutes: 7, move: 'SEL/EF check-in and self-monitoring language.' },
        { activity: 'teacher-report', minutes: 5, move: 'Update timeline, groups, and next-cycle targets.' }
      ]
    }
  };

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function clampMinutes(value) {
    const numeric = Number(value);
    if (numeric === 20 || numeric === 30 || numeric === 50) return numeric;
    return 20;
  }

  function normalizeRole(rawRole) {
    const key = String(rawRole || '').trim().toLowerCase();
    if (!key) return 'teacher';
    return ROLE_ALIAS[key] || 'teacher';
  }

  function roleLabel(roleId) {
    return ROLE_LABELS[roleId] || ROLE_LABELS.teacher;
  }

  function activityLabel(activityId) {
    return ACTIVITY_LABELS[activityId] || 'Activity';
  }

  function resolveTrack(roleId) {
    return ROLE_TRACK[roleId] || 'integrated';
  }

  function buildPlan(input = {}) {
    const roleId = normalizeRole(input.roleId || 'teacher');
    const minutes = clampMinutes(input.minutes || 20);
    const gradeBand = String(input.gradeBand || '3-5');
    const track = resolveTrack(roleId);
    const preset = DURATION_PRESETS.find((item) => item.minutes === minutes) || DURATION_PRESETS[0];
    const template = TRACK_TEMPLATES[track]?.[minutes] || TRACK_TEMPLATES.integrated[20];
    const steps = template.map((step, index) => ({
      id: `${track}-${minutes}-${index + 1}`,
      index: index + 1,
      activity: step.activity,
      activityLabel: activityLabel(step.activity),
      minutes: Number(step.minutes || 0),
      move: String(step.move || '')
    }));
    const launchStep = steps.find((step) => step.activity !== 'teacher-report') || steps[0] || null;
    return {
      id: `${roleId}-${track}-${minutes}`,
      roleId,
      roleLabel: roleLabel(roleId),
      track,
      gradeBand,
      minutes,
      title: `${minutes}-minute ${preset.title}`,
      summary: preset.summary,
      steps,
      launchStep
    };
  }

  function buildPlansForRole(input = {}) {
    const roleId = normalizeRole(input.roleId || 'teacher');
    const gradeBand = String(input.gradeBand || '3-5');
    return DURATION_PRESETS.map((preset) => buildPlan({
      roleId,
      gradeBand,
      minutes: preset.minutes
    }));
  }

  function readLaunchLogs() {
    const parsed = safeParse(localStorage.getItem(BLOCK_LOG_KEY) || '');
    return Array.isArray(parsed) ? parsed : [];
  }

  function writeLaunchLogs(rows) {
    localStorage.setItem(BLOCK_LOG_KEY, JSON.stringify(rows));
  }

  function appendLaunchLog(input = {}) {
    const row = {
      ts: Date.now(),
      source: String(input.source || 'home'),
      roleId: normalizeRole(input.roleId || 'teacher'),
      roleLabel: roleLabel(input.roleId || 'teacher'),
      track: String(input.track || 'integrated'),
      gradeBand: String(input.gradeBand || '3-5'),
      minutes: clampMinutes(input.minutes || 20),
      blockId: String(input.blockId || ''),
      blockTitle: String(input.blockTitle || ''),
      launchActivity: String(input.launchActivity || ''),
      launchActivityLabel: activityLabel(String(input.launchActivity || '')),
      stepCount: Number(input.stepCount || 0),
      note: String(input.note || '')
    };
    const rows = readLaunchLogs();
    rows.unshift(row);
    writeLaunchLogs(rows.slice(0, 220));
    window.dispatchEvent(new CustomEvent('decode:class-block-logged', { detail: row }));
    return row;
  }

  window.CORNERSTONE_CLASS_BLOCKS = {
    DURATION_PRESETS,
    ROLE_LABELS,
    ACTIVITY_LABELS,
    BLOCK_LOG_KEY,
    normalizeRole,
    roleLabel,
    activityLabel,
    resolveTrack,
    buildPlan,
    buildPlansForRole,
    readLaunchLogs,
    appendLaunchLog
  };
})();
