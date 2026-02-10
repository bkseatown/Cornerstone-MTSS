// Teacher report: printable growth summary + standards mastery heatmap.
(function () {
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
    'math-language': 'Math Language Builder'
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
      focus: 'Silly Stories + Writing Studio',
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
      focus: 'Writing Studio',
      notes: 'Use plan-to-draft frames with explicit detail sentences.'
    },
    'W.3.4': {
      focus: 'Writing Studio revisions',
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
    writing: 'writing-studio.html',
    'plan-it': 'plan-it.html',
    'number-sense': 'number-sense.html',
    operations: 'operations.html',
    'problem-solving': 'number-sense.html',
    'math-language': 'number-sense.html'
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

  const DOMAIN_ACTIVITY_PLAYBOOK = {
    decoding: [
      { activity: 'word-quest', move: 'Target pattern drills with immediate corrective feedback.' },
      { activity: 'cloze', move: 'Apply decoding patterns inside sentence context.' }
    ],
    fluency: [
      { activity: 'fluency', move: 'Use repeated readings with explicit pace and phrasing cues.' },
      { activity: 'comprehension', move: 'Read then answer with evidence to connect rate and meaning.' }
    ],
    comprehension: [
      { activity: 'comprehension', move: 'Practice text-dependent questions and evidence sentences.' },
      { activity: 'cloze', move: 'Use context clues and justify every blank choice.' }
    ],
    'written-language': [
      { activity: 'writing', move: 'Build sentence-to-paragraph structure with guided frames.' },
      { activity: 'madlibs', move: 'Rehearse grammar and vocabulary choices in short cycles.' }
    ],
    'executive-function': [
      { activity: 'plan-it', move: 'Model scheduling, timing, and reflection routines.' },
      { activity: 'writing', move: 'Convert plans into short actionable writing goals.' }
    ],
    general: [
      { activity: 'word-quest', move: 'Use a short decoding warm-up before core tasks.' },
      { activity: 'comprehension', move: 'Close with one text-evidence check for transfer.' }
    ]
  };

  const ROLE_PATHWAY_LIBRARY = {
    teacher: {
      label: 'Teacher',
      fit: 'Tier 1 core + classroom differentiation',
      goal: 'Run a daily high-impact core routine and tighten support for students who are below benchmark.',
      focusId: 'comprehension-evidence',
      steps: [
        { activity: 'word-quest', minutes: '5-7', move: 'Open with explicit decoding or vocabulary preview tied to today\'s target.' },
        { activity: 'comprehension', minutes: '8-10', move: 'Use evidence stems and turn-and-talk to reinforce language + meaning.' },
        { activity: 'teacher-report', label: 'Classroom Signal Snapshot', anchor: '#report-pulse', minutes: '2-3', move: 'Check red/yellow/green priorities and set tomorrow\'s regroup plan.' }
      ]
    },
    admin: {
      label: 'Administrator',
      fit: 'Leadership · implementation coherence',
      goal: 'See whether intervention cycles are consistent, data-rich, and producing growth that can scale across teams.',
      focusId: 'comprehension-evidence',
      steps: [
        { activity: 'teacher-report', label: 'Outcome Proof Snapshot', anchor: '#report-outcomes', minutes: '2-3', move: 'Review momentum, implementation depth, and support intensity match.' },
        { activity: 'teacher-report', label: 'Timeline + IESP Workflow', anchor: '#report-intervention-timeline', minutes: '3-4', move: 'Check documentation quality and whether action follows data.' },
        { activity: 'teacher-report', label: 'Framework + Benchmark View', anchor: '#report-framework-crosswalk', minutes: '2-3', move: 'Verify alignment and benchmark fit before staffing decisions.' }
      ]
    },
    dean: {
      label: 'Dean',
      fit: 'Instructional leadership · team coordination',
      goal: 'Coordinate specialist and classroom actions so interventions stay coherent and measurable each cycle.',
      focusId: 'comprehension-evidence',
      steps: [
        { activity: 'teacher-report', label: 'Role Dashboard', anchor: '#report-role-pathway', minutes: '2-3', move: 'Confirm priorities, owner, and handoff responsibilities.' },
        { activity: 'plan-it', minutes: '6-8', move: 'Align classroom routines to intervention priorities and daily accountability checks.' },
        { activity: 'teacher-report', label: 'Timeline Review', anchor: '#report-intervention-timeline', minutes: '2-3', move: 'Use timeline evidence to prepare weekly case review.' }
      ]
    },
    'learning-support': {
      label: 'Learning Support / SPED',
      fit: 'MTSS · SPED · Intervention',
      goal: 'Run a tight intervention loop with explicit modeling, guided transfer, and documented next steps.',
      focusId: 'phonics-decoding',
      steps: [
        { activity: 'word-quest', minutes: '8-10', move: 'Target the current placement focus and coach errors immediately.' },
        { activity: 'cloze', minutes: '6-8', move: 'Transfer the pattern to context and check understanding aloud.' },
        { activity: 'teacher-report', label: 'Teacher Report Snapshot', anchor: '#report-share-summary', minutes: '2-3', move: 'Capture a shareable summary for MTSS notes and family communication.' }
      ]
    },
    eal: {
      label: 'EAL',
      fit: 'Language development · EAL · Classroom support',
      goal: 'Blend decoding, vocabulary, and context cues with language-friendly routines.',
      focusId: 'comprehension-evidence',
      steps: [
        { activity: 'word-quest', minutes: '6-8', move: 'Preview key vocabulary and decode high-utility words.' },
        { activity: 'comprehension', minutes: '8-10', move: 'Use text evidence prompts and sentence stems for oral rehearsal.' },
        { activity: 'cloze', minutes: '4-6', move: 'Close with context clues and quick justification of choices.' }
      ]
    },
    slp: {
      label: 'Speech-Language (SLP)',
      fit: 'SLP · Fluency · Phonology',
      goal: 'Connect sound production, prosody, and language output in short high-repetition sets.',
      focusId: 'fluency-prosody',
      steps: [
        { activity: 'word-quest', minutes: '6-8', move: 'Warm up with targeted phoneme patterns and repeated production.' },
        { activity: 'fluency', minutes: '8-10', move: 'Practice paced oral reading with phrasing and punctuation cues.' },
        { activity: 'writing', minutes: '4-6', move: 'Use a short written output to reinforce expressive language transfer.' }
      ]
    },
    counselor: {
      label: 'School Counselor',
      fit: 'Counselor · SEL · executive function',
      goal: 'Use short literacy and planning routines to strengthen regulation language, persistence, and self-advocacy.',
      focusId: 'sel-executive',
      steps: [
        { activity: 'plan-it', minutes: '8-10', move: 'Model planning and coping checkpoints before task execution.' },
        { activity: 'writing', minutes: '6-8', move: 'Capture reflection language for thoughts, emotions, actions, and next move.' },
        { activity: 'teacher-report', label: 'Family Bridge Snapshot', anchor: '#report-parent-communication', minutes: '2-3', move: 'Draft one concrete home strategy and share in plain language.' }
      ]
    },
    psychologist: {
      label: 'School Psychologist',
      fit: 'Assessment interpretation · intervention planning',
      goal: 'Use short-cycle evidence to identify likely barriers and tighten referral/intervention decisions early.',
      focusId: 'comprehension-evidence',
      steps: [
        { activity: 'teacher-report', label: 'Evidence Quality + Tier View', anchor: '#report-pulse', minutes: '3-4', move: 'Check confidence, readiness, and tier rationale before making high-stakes recommendations.' },
        { activity: 'teacher-report', label: 'Numeracy Data Intake', anchor: '#report-numeracy-import-preview', minutes: '3-4', move: 'Cross-check classroom data against screener signals and benchmark risk levels.' },
        { activity: 'teacher-report', label: 'IESP Auto-Draft', anchor: '#report-iesp-output', minutes: '3-4', move: 'Export draft present levels, goals, and monitoring plan for team review.' }
      ]
    },
    'sel-counselor': {
      label: 'SEL / School Counselor',
      fit: 'Counselor · SEL · Executive function',
      goal: 'Use literacy tasks to build regulation, planning stamina, and reflection language.',
      focusId: 'sel-executive',
      steps: [
        { activity: 'plan-it', minutes: '8-10', move: 'Model planning decisions and discuss regulation checkpoints.' },
        { activity: 'writing', minutes: '6-8', move: 'Translate plans into short action writing with supportive stems.' },
        { activity: 'comprehension', minutes: '4-6', move: 'End with evidence-based reflection on choices and outcomes.' }
      ]
    },
    leadership: {
      label: 'Leadership / Admin',
      fit: 'Principal · HoS · Instructional coaching',
      goal: 'Demonstrate instructional coherence, measurable impact, and repeatable daily implementation.',
      focusId: 'comprehension-evidence',
      steps: [
        { activity: 'teacher-report', label: 'Literacy Pulse + R/Y/G', anchor: '#report-pulse', minutes: '2-3', move: 'Open the pulse to show intervention priorities and support bands.' },
        { activity: 'plan-it', minutes: '5-7', move: 'Show cross-skill transfer into executive-function and self-management routines.' },
        { activity: 'word-quest', minutes: '5-7', move: 'Show focused decoding reps with immediate feedback and learner adjustment.' }
      ]
    },
    parent: {
      label: 'Parent / Caregiver',
      fit: 'Home-school partnership · Family support',
      goal: 'Translate school intervention language into family-friendly routines that reinforce conceptual math and structured literacy at home.',
      focusId: 'comprehension-evidence',
      steps: [
        { activity: 'teacher-report', label: 'Parent Partnership Snapshot', anchor: '#report-parent-communication', minutes: '3-4', move: 'Open the parent message and share one literacy + one numeracy focus in plain language.' },
        { activity: 'teacher-report', label: 'Family-Friendly Data View', anchor: '#report-share-summary', minutes: '2-3', move: 'Show current strengths and next steps without jargon.' },
        { activity: 'teacher-report', label: 'Home Practice Clip', anchor: '#report-media-library', minutes: '2-3', move: 'Attach a short teacher video/audio clip modeling at-home support.' }
      ]
    }
  };

  const ROLE_PROTOCOL_GUIDANCE = {
    teacher: {
      progressLens: 'Track whether core instruction is preventing new gaps while targeted supports accelerate students already behind.',
      handoff: 'Bring top red/yellow domains and next-day regroup plan to PLC/grade-level check-ins.',
      familyBridge: 'Share one sentence starter for reading and one for math that families can use tonight.'
    },
    admin: {
      progressLens: 'Monitor cycle fidelity, evidence confidence, and whether staffing intensity matches learner need.',
      handoff: 'Use role dashboards and timeline entries in leadership meetings to unblock implementation bottlenecks.',
      familyBridge: 'Ensure communication is plain-language, consistent, and linked to measurable checkpoints.'
    },
    dean: {
      progressLens: 'Look for coherence across classroom routines, specialist plans, and intervention documentation.',
      handoff: 'Set weekly owner + deadline for every red-domain action and verify follow-through in the timeline.',
      familyBridge: 'Coordinate one aligned message across specialists so families get a single clear plan.'
    },
    'learning-support': {
      progressLens: 'Prioritize explicit error analysis (substitution, omission, phoneme confusion) and short-cycle mastery checks.',
      handoff: 'Coordinate with classroom teacher on carryover targets and document progress for MTSS/IEP reviews.',
      familyBridge: 'Share one at-home practice move aligned to the weekly target pattern.'
    },
    eal: {
      progressLens: 'Track both language load and literacy skill so scaffolds support access without lowering rigor.',
      handoff: 'Align vocabulary, sentence frames, and discourse supports with class units and WIDA-aligned language goals.',
      familyBridge: 'Recommend multilingual rehearsal routines (home language + English transfer) for weekly targets.'
    },
    slp: {
      progressLens: 'Monitor articulation/phonology, pacing, and expressive carryover while tracking literacy accuracy.',
      handoff: 'Coordinate sound targets with classroom reading tasks so speech goals transfer into academic text.',
      familyBridge: 'Share short oral rehearsal scripts matched to the current phoneme or prosody focus.'
    },
    counselor: {
      progressLens: 'Track regulation language, task persistence, and ability to recover after errors during academic tasks.',
      handoff: 'Align behavior-support language with classroom and specialist routines so students hear one shared script.',
      familyBridge: 'Send one short check-in script families can use before homework and one debrief script after.'
    },
    psychologist: {
      progressLens: 'Separate skill deficit, language load, and performance variability before escalating to deeper testing.',
      handoff: 'Use converging evidence (classroom + intervention + screener) to guide referral confidence.',
      familyBridge: 'Frame findings around strengths, barriers, and actionable next supports rather than labels alone.'
    },
    'sel-counselor': {
      progressLens: 'Track planning stamina, self-monitoring language, and emotional regulation during literacy tasks.',
      handoff: 'Use shared check-in/check-out language with teachers to reinforce reflection and persistence goals.',
      familyBridge: 'Send one regulation strategy tied to homework reading/writing time.'
    },
    leadership: {
      progressLens: 'Track implementation consistency, cycle fidelity, and learner growth against benchmark checkpoints.',
      handoff: 'Use weekly pulse + protocol review in team meetings to decide supports, staffing, and next cycle focus.',
      familyBridge: 'Provide a concise summary of gains, next target, and support plan in family-friendly language.'
    },
    parent: {
      progressLens: 'Focus on home-transfer behaviors: practice consistency, confidence, and use of taught strategies (not just answer accuracy).',
      handoff: 'Align parent-facing language with classroom goals so home routines reinforce school interventions.',
      familyBridge: 'Share one structured literacy move and one conceptual math move families can model in 5-10 minutes.'
    }
  };

  const FRAMEWORK_ALIGNMENT = {
    decoding: [
      { framework: 'Science of Reading', alignment: 'Explicit phoneme-grapheme mapping, cumulative review, and decodable transfer.' },
      { framework: 'OG / Wilson / UFLI', alignment: 'Direct sound-symbol instruction, syllable routines, dictation, and corrective feedback.' },
      { framework: 'Words Their Way', alignment: 'Feature-based spelling pattern analysis and word sorting.' },
      { framework: 'Corrective Reading / Lexia-style', alignment: 'Mastery checks, scripted correction loops, and frequent retrieval.' },
      { framework: 'Common Core', alignment: 'RF.2.3, RF.3.3, RF.3.4 and language transfer standards.' },
      { framework: 'PYP / MYP / DP (SL/HL)', alignment: 'Structured word study and morphology linked to authentic reading and writing tasks.' },
      { framework: 'UK Curriculum', alignment: 'Phonics and word-reading progression across KS1-KS3 expectations.' },
      { framework: 'WIDA', alignment: 'Language forms, vocabulary, and discourse supports within literacy instruction.' }
    ],
    fluency: [
      { framework: 'Science of Reading', alignment: 'Build automaticity after decoding accuracy; rate must support meaning.' },
      { framework: 'OG / Wilson / UFLI', alignment: 'Repeated connected-text practice with phrasing and error correction.' },
      { framework: 'Corrective Reading / Lexia-style', alignment: 'Timed passages with immediate feedback and progress graphing.' },
      { framework: 'Common Core', alignment: 'RF.3.4 and grade-level oral reading fluency expectations.' },
      { framework: 'PYP / MYP / DP (SL/HL)', alignment: 'Fluency as access to comprehension, discussion, and literary analysis.' },
      { framework: 'UK Curriculum', alignment: 'Accuracy, automaticity, and prosody in curriculum-aligned reading.' },
      { framework: 'WIDA', alignment: 'Oral language scaffolds and pronunciation-aware rehearsal for multilingual learners.' }
    ],
    comprehension: [
      { framework: 'Science of Reading', alignment: 'Language comprehension integrated with decoding through evidence-based questioning.' },
      { framework: 'UFLI / Structured Literacy transfer', alignment: 'Apply taught patterns and vocabulary in connected text.' },
      { framework: 'Common Core', alignment: 'RL/RI text evidence, inferencing, and vocabulary-in-context standards.' },
      { framework: 'PYP / MYP / DP (SL/HL)', alignment: 'Inquiry, interpretation, and evidence-backed responses across text types.' },
      { framework: 'UK Curriculum', alignment: 'Retrieval, inference, and explanation in reading comprehension objectives.' },
      { framework: 'WIDA', alignment: 'Sentence stems and discourse scaffolds to express evidence clearly.' }
    ],
    'written-language': [
      { framework: 'Science of Reading and Writing', alignment: 'Reading-writing reciprocity: spelling, syntax, and composition reinforce each other.' },
      { framework: 'Words Their Way', alignment: 'Spelling-feature knowledge applied in sentence and paragraph writing.' },
      { framework: 'Step Up to Writing', alignment: 'Structured planning, color-coding, and clear paragraph organization.' },
      { framework: 'Common Core', alignment: 'W.3.2, W.3.4, W.3.8 and language conventions.' },
      { framework: 'PYP / MYP / DP (SL/HL)', alignment: 'Purpose-driven writing for audience, argument, and reflection.' },
      { framework: 'UK Curriculum', alignment: 'Composition, grammar, and transcription expectations by key stage.' },
      { framework: 'WIDA', alignment: 'Language objectives paired with content objectives for writing output.' }
    ],
    'executive-function': [
      { framework: 'MTSS / RTI', alignment: 'Tiered supports for planning, self-monitoring, and persistence.' },
      { framework: 'SEL Frameworks', alignment: 'Goal setting, self-management, and reflection routines embedded in literacy tasks.' },
      { framework: 'Common Core Speaking & Listening', alignment: 'Collaborative planning and discussion routines (SL standards).' },
      { framework: 'PYP / MYP', alignment: 'Approaches to learning: self-management and communication skills.' },
      { framework: 'UK / International pastoral systems', alignment: 'Metacognition, independence, and regulation outcomes.' },
      { framework: 'WIDA', alignment: 'Language-supported reflection and strategy talk for multilingual learners.' }
    ]
  };

  const BENCHMARK_EXPECTATIONS = {
    'K-2': {
      decoding: { boy: 0.45, moy: 0.62, eoy: 0.78 },
      fluency: { boy: 0.34, moy: 0.52, eoy: 0.68 },
      comprehension: { boy: 0.36, moy: 0.54, eoy: 0.7 },
      'written-language': { boy: 0.32, moy: 0.5, eoy: 0.66 },
      'executive-function': { boy: 0.42, moy: 0.58, eoy: 0.72 }
    },
    '3-5': {
      decoding: { boy: 0.52, moy: 0.68, eoy: 0.82 },
      fluency: { boy: 0.44, moy: 0.62, eoy: 0.78 },
      comprehension: { boy: 0.46, moy: 0.64, eoy: 0.8 },
      'written-language': { boy: 0.42, moy: 0.6, eoy: 0.76 },
      'executive-function': { boy: 0.48, moy: 0.64, eoy: 0.78 }
    },
    '6-8': {
      decoding: { boy: 0.58, moy: 0.72, eoy: 0.84 },
      fluency: { boy: 0.5, moy: 0.66, eoy: 0.8 },
      comprehension: { boy: 0.52, moy: 0.68, eoy: 0.82 },
      'written-language': { boy: 0.48, moy: 0.66, eoy: 0.8 },
      'executive-function': { boy: 0.5, moy: 0.66, eoy: 0.8 }
    },
    '9-12': {
      decoding: { boy: 0.6, moy: 0.74, eoy: 0.86 },
      fluency: { boy: 0.54, moy: 0.7, eoy: 0.82 },
      comprehension: { boy: 0.56, moy: 0.72, eoy: 0.84 },
      'written-language': { boy: 0.52, moy: 0.7, eoy: 0.84 },
      'executive-function': { boy: 0.52, moy: 0.68, eoy: 0.82 }
    }
  };

  const NUMERACY_ACTIVITY_LABELS = {
    'number-sense': 'Number Sense Sprint',
    operations: 'Operation Builder',
    'problem-solving': 'Problem Pathways',
    fluency: 'Math Fact Fluency',
    'math-language': 'Math Language Studio'
  };

  const NUMERACY_DOMAIN_ACTIVITY_PLAYBOOK = {
    'number-sense': [
      { activity: 'number-sense', move: 'Use quick quantity reasoning, place value, and comparison tasks with immediate feedback.' },
      { activity: 'operations', move: 'Apply number relationships inside structured operation routines.' }
    ],
    operations: [
      { activity: 'operations', move: 'Model strategy selection (counting on, decomposition, regrouping) and error correction.' },
      { activity: 'problem-solving', move: 'Transfer operation strategy into short contextual word problems.' }
    ],
    'problem-solving': [
      { activity: 'problem-solving', move: 'Teach read-plan-solve-check routines with annotated reasoning steps.' },
      { activity: 'math-language', move: 'Use sentence frames for explaining operations, units, and justification.' }
    ],
    fluency: [
      { activity: 'fluency', move: 'Run brief, high-success retrieval sets focused on automaticity and accuracy.' },
      { activity: 'operations', move: 'Link fluent facts to multi-step operation tasks.' }
    ],
    'math-language': [
      { activity: 'math-language', move: 'Build precise vocabulary for compare, estimate, justify, and represent.' },
      { activity: 'problem-solving', move: 'Apply language frames while solving and explaining multi-step tasks.' }
    ],
    general: [
      { activity: 'number-sense', move: 'Open with quantity and place-value warm-ups.' },
      { activity: 'problem-solving', move: 'Close with one explanation-focused transfer problem.' }
    ]
  };

  const NUMERACY_FRAMEWORK_ALIGNMENT = {
    'number-sense': [
      { framework: 'Common Core Math', alignment: 'Build cardinality, place value, and flexible number reasoning (OA/NBT domains).' },
      { framework: 'UK Curriculum (Maths)', alignment: 'Number and place value progression with mental calculation fluency.' },
      { framework: 'IB PYP/MYP Math', alignment: 'Conceptual understanding of quantity, pattern, and representation.' },
      { framework: 'MTSS/RTI for Math', alignment: 'Frequent checks and targeted small-group instruction from current misconceptions.' },
      { framework: 'WIDA', alignment: 'Support mathematical discourse with visuals and language scaffolds.' }
    ],
    operations: [
      { framework: 'Common Core Math', alignment: 'Operations and algebraic thinking through strategy, structure, and reasoning.' },
      { framework: 'UK Curriculum (Maths)', alignment: 'Fluent methods for addition, subtraction, multiplication, and division.' },
      { framework: 'IB PYP/MYP Math', alignment: 'Strategy flexibility and conceptual-to-procedural transfer.' },
      { framework: 'High-impact tutoring models', alignment: 'Explicit worked examples + deliberate practice + corrective feedback.' },
      { framework: 'UDL', alignment: 'Multiple representations and response options without reducing cognitive demand.' }
    ],
    'problem-solving': [
      { framework: 'Common Core Math Practice', alignment: 'Make sense of problems, reason quantitatively, and construct viable arguments.' },
      { framework: 'UK Curriculum (Maths)', alignment: 'Reasoning and problem-solving with explanation and justification.' },
      { framework: 'IB PYP/MYP Math', alignment: 'Inquiry-led application of concepts in authentic contexts.' },
      { framework: 'MTSS/RTI for Math', alignment: 'Use error pattern analysis to adjust strategy instruction rapidly.' },
      { framework: 'WIDA', alignment: 'Mathematical language routines support multilingual reasoning and explanation.' }
    ],
    fluency: [
      { framework: 'Common Core Math', alignment: 'Develop procedural fluency with understanding and application.' },
      { framework: 'UK Curriculum (Maths)', alignment: 'Rapid recall and fluent calculation as foundation for complex tasks.' },
      { framework: 'IB PYP/MYP Math', alignment: 'Accuracy and efficiency to support higher-order mathematical thinking.' },
      { framework: 'Intervention best practice', alignment: 'Short, high-frequency retrieval cycles with immediate feedback.' },
      { framework: 'UDL', alignment: 'Accessible fluency practice with pacing and scaffold controls.' }
    ],
    'math-language': [
      { framework: 'Common Core Math Practice', alignment: 'Use precise language and reasoning to communicate mathematical thinking.' },
      { framework: 'WIDA', alignment: 'Explicit language objectives integrated with mathematics content goals.' },
      { framework: 'IB PYP/MYP Math', alignment: 'Academic discourse and reflection as part of conceptual understanding.' },
      { framework: 'UK Curriculum (Maths)', alignment: 'Reasoning and explaining methods using mathematical vocabulary.' },
      { framework: 'UDL', alignment: 'Sentence stems, visuals, and multimodal expression for equitable participation.' }
    ]
  };

  const NUMERACY_BENCHMARK_EXPECTATIONS = {
    'K-2': {
      'number-sense': { boy: 0.44, moy: 0.6, eoy: 0.76 },
      operations: { boy: 0.4, moy: 0.56, eoy: 0.72 },
      'problem-solving': { boy: 0.34, moy: 0.5, eoy: 0.66 },
      fluency: { boy: 0.36, moy: 0.52, eoy: 0.68 },
      'math-language': { boy: 0.34, moy: 0.5, eoy: 0.66 }
    },
    '3-5': {
      'number-sense': { boy: 0.5, moy: 0.66, eoy: 0.8 },
      operations: { boy: 0.48, moy: 0.64, eoy: 0.78 },
      'problem-solving': { boy: 0.42, moy: 0.58, eoy: 0.74 },
      fluency: { boy: 0.44, moy: 0.6, eoy: 0.74 },
      'math-language': { boy: 0.4, moy: 0.56, eoy: 0.72 }
    },
    '6-8': {
      'number-sense': { boy: 0.54, moy: 0.68, eoy: 0.82 },
      operations: { boy: 0.52, moy: 0.66, eoy: 0.8 },
      'problem-solving': { boy: 0.48, moy: 0.62, eoy: 0.78 },
      fluency: { boy: 0.5, moy: 0.64, eoy: 0.78 },
      'math-language': { boy: 0.46, moy: 0.6, eoy: 0.76 }
    },
    '9-12': {
      'number-sense': { boy: 0.56, moy: 0.7, eoy: 0.84 },
      operations: { boy: 0.54, moy: 0.68, eoy: 0.82 },
      'problem-solving': { boy: 0.5, moy: 0.64, eoy: 0.8 },
      fluency: { boy: 0.5, moy: 0.64, eoy: 0.78 },
      'math-language': { boy: 0.48, moy: 0.62, eoy: 0.78 }
    }
  };

  const NUMERACY_SAS_CURRICULUM_READINESS = {
    'K-2': 'Elementary readiness: build quantity, place-value, and strategy language foundations that transfer to later integrated pathways.',
    '3-5': 'Upper elementary readiness: strengthen multi-step operation strategy, justification language, and transfer to novel problems.',
    '6-8': 'Middle school readiness: align support to integrated pathway expectations with emphasis on modeling, algebraic reasoning, and problem explanation.',
    '9-12': 'High school readiness: align interventions to SAS integrated math pathways (Integrated Math I, Integrated Math II with Trigonometry, Integrated Math III, and Integrated Math III with Precalculus), emphasizing conceptual understanding, strategy transfer, and mathematical communication.'
  };

  const NUMERACY_ASSESSMENT_BUNDLES = {
    auto: {
      label: 'Auto by grade band',
      includeBridges: true,
      includeIMUnit: true,
      includeCooldowns: true,
      includeGlossIkan: true,
      includeAimsweb: 'auto',
      includeMap: 'auto'
    },
    'core-classroom': {
      label: 'Bridges + IM core only',
      includeBridges: true,
      includeIMUnit: true,
      includeCooldowns: true,
      includeGlossIkan: false,
      includeAimsweb: false,
      includeMap: false
    },
    'intervention-triage': {
      label: 'Core + GLoSS/IKAN triage',
      includeBridges: true,
      includeIMUnit: true,
      includeCooldowns: true,
      includeGlossIkan: true,
      includeAimsweb: 'auto',
      includeMap: false
    },
    'full-stack': {
      label: 'Core + screeners (Aimsweb/MAP)',
      includeBridges: true,
      includeIMUnit: true,
      includeCooldowns: true,
      includeGlossIkan: true,
      includeAimsweb: true,
      includeMap: true
    }
  };

  const BRIDGES_INTERVENTION_MANUALS = {
    bookcase: {
      title: 'Bridges intervention manuals bookcase',
      scope: 'Primary library (all grade bands)',
      href: 'https://fliphtml5.com/bookcase/xwzbg/'
    },
    'volume-1': {
      title: 'Bridges Intervention Volume 1 Teacher Masters',
      scope: 'Foundational strategy routines (K-5 bridge support)',
      href: 'https://online.fliphtml5.com/pxpll/fqoz/'
    },
    'volume-5': {
      title: 'Intervention Guide: Grade-level Topics Volume 5',
      scope: 'Upper elementary reteach and transfer tasks',
      href: 'https://online.fliphtml5.com/pxpll/aytr/'
    },
    'volume-6': {
      title: 'Intervention Guide: Grade-level Topics Volume 6',
      scope: 'Middle school-ready intervention tasks and strategy extensions',
      href: 'https://online.fliphtml5.com/pxpll/wyzx/'
    }
  };

  const NUMERACY_SCREENER_POLICY = {
    aimswebMaxGrade: 4,
    mapMaxGrade: 8,
    mapWindowNote: 'MAP check-ins typically run through Grade 8 (often EOY in upper middle school).'
  };

  const NUMERACY_STRATEGY_STAGES = {
    'counting-all': {
      label: 'Counting all / finger counting',
      signal: 'Learner relies on one-by-one counting for most facts and loses track under load.',
      leverageMove: 'Move quickly to counting-on, ten frames, and make-10 routines.'
    },
    'counting-on': {
      label: 'Counting on',
      signal: 'Learner can start from a known addend but still depends on sequential counts.',
      leverageMove: 'Introduce doubles, near doubles, and friendly-number jumps.'
    },
    'make-ten-friendly': {
      label: 'Make 10 / friendly numbers',
      signal: 'Learner can bridge through 10 or nearest tens but needs consistency across problems.',
      leverageMove: 'Use number strings and visual models to generalize strategy choice.'
    },
    'derived-facts': {
      label: 'Derived facts and decomposition',
      signal: 'Learner decomposes quantities and uses related facts with moderate flexibility.',
      leverageMove: 'Increase transfer to multi-step problems and explanation language.'
    },
    'algorithm-with-reasoning': {
      label: 'Algorithm + reasoning transfer',
      signal: 'Learner can compute with standard algorithms but reasoning and model choice vary.',
      leverageMove: 'Keep conceptual prompts active: explain, represent, justify.'
    }
  };

  const NUMERACY_IMPORT_SOURCE_META = {
    'im-cooldown': {
      label: 'IM cooldown / unit checks',
      sourceTag: 'im-cooldown',
      expectedColumns: 'date, grade, domain/focus, correct, total (or score like 7/10)',
      fallbackDomain: 'problem-solving'
    },
    aimsweb: {
      label: 'Aimsweb (math)',
      sourceTag: 'aimsweb-progress',
      expectedColumns: 'date, grade, measure/subtest, national percentile or Student Growth Percentile (or performance/risk/tier + score)',
      fallbackDomain: 'fluency'
    },
    map: {
      label: 'MAP (math)',
      sourceTag: 'map-check',
      expectedColumns: 'date, grade, subject/goal area, percentile and/or RIT (growth percentile/observed vs projected growth also accepted)',
      fallbackDomain: 'problem-solving'
    }
  };

  const NUMERACY_IMPORT_TEMPLATE_LIBRARY = {
    'im-cooldown': {
      templateHeaders: ['date', 'grade', 'domain', 'focus', 'skill', 'assessment', 'unit', 'task', 'correct', 'total', 'score', 'percent'],
      sampleRows: [
        {
          date: '2026-02-06',
          grade: '5',
          domain: 'operations',
          focus: 'fractions',
          skill: 'compare fractions',
          assessment: 'IM Cooldown',
          unit: 'Unit 4',
          task: 'Cooldown 4.3',
          correct: '8',
          total: '10',
          score: '',
          percent: '80'
        }
      ],
      acceptedHeaders: [
        'date',
        'assessment date',
        'timestamp',
        'grade',
        'grade level',
        'domain',
        'focus',
        'strand',
        'skill',
        'standard',
        'assessment',
        'task',
        'unit',
        'score',
        'result',
        'points',
        'correct',
        'correct items',
        'num correct',
        'total',
        'possible',
        'max',
        'total items',
        'points possible',
        'percent',
        'pct',
        'percent correct'
      ]
    },
    aimsweb: {
      templateHeaders: ['date', 'grade', 'measure', 'subtest', 'assessment', 'window', 'risk status', 'performance level', 'tier', 'percentile rank', 'student growth percentile', 'score', 'benchmark score', 'percent'],
      sampleRows: [
        {
          date: '2026-02-06',
          grade: '4',
          measure: 'Math Computation',
          subtest: 'Grade 4',
          assessment: 'Aimsweb Winter',
          window: 'Winter',
          'risk status': 'Moderate Risk',
          'performance level': 'Below Average',
          tier: 'Tier 2',
          'percentile rank': '28',
          'student growth percentile': '41',
          score: '34',
          'benchmark score': '50',
          percent: '68'
        }
      ],
      acceptedHeaders: [
        'date',
        'assessment date',
        'benchmark date',
        'test date',
        'timestamp',
        'grade',
        'grade level',
        'enrolled grade',
        'measure',
        'measure name',
        'subtest',
        'skill',
        'domain',
        'skills area',
        'item category',
        'assessment',
        'test',
        'test name',
        'battery',
        'window',
        'season',
        'percentile',
        'percentile rank',
        'national percentile',
        'norm percentile',
        'overall percentile',
        'student growth percentile',
        'growth percentile',
        'sgp',
        'conditional growth percentile',
        'risk',
        'risk level',
        'risk status',
        'benchmark',
        'benchmark status',
        'status',
        'performance level',
        'tier',
        'alert',
        'score',
        'raw score',
        'value',
        'composite score',
        'growth scale value',
        'gsv',
        'total',
        'max score',
        'goal',
        'benchmark score',
        'target score',
        'percent',
        'pct',
        'percent correct',
        'accuracy'
      ]
    },
    map: {
      templateHeaders: ['date', 'grade', 'subject', 'test name', 'term', 'window', 'goal area', 'instructional area', 'achievement percentile', 'growth percentile', 'rit score', 'possible range', 'observed growth', 'projected growth', 'conditional growth index'],
      sampleRows: [
        {
          date: '2026-02-06',
          grade: '6',
          subject: 'Mathematics',
          'test name': 'MAP Growth Mathematics',
          term: 'Winter',
          window: 'Winter 2026',
          'goal area': 'Operations and Algebraic Thinking',
          'instructional area': 'Reasoning with equations',
          'achievement percentile': '39',
          'growth percentile': '53',
          'rit score': '205',
          'possible range': '201-209',
          'observed growth': '8',
          'projected growth': '7',
          'conditional growth index': '0.4'
        }
      ],
      acceptedHeaders: [
        'date',
        'test date',
        'assessment date',
        'term date',
        'timestamp',
        'grade',
        'grade level',
        'test grade',
        'subject',
        'test name',
        'course',
        'goal',
        'goal area',
        'strand',
        'domain',
        'focus',
        'instructional area',
        'suggested area of focus',
        'relative strength',
        'term',
        'window',
        'percentile',
        'percentile rank',
        'achievement percentile',
        'national percentile',
        'norm percentile',
        'growth percentile',
        'student growth percentile',
        'conditional growth percentile',
        'cgp',
        'rit',
        'rit score',
        'score',
        'subject score',
        'overall rit',
        'math rit',
        'possible range',
        'rit range',
        'score range',
        'observed growth',
        'rit growth',
        'actual growth',
        'projected growth',
        'expected growth',
        'growth projection',
        'conditional growth index',
        'cgi',
        'percent',
        'pct',
        'percent correct',
        'accuracy'
      ]
    }
  };

  const REPORT_MEDIA_SECTION_META = {
    'literacy-pulse': { label: 'Literacy Pulse' },
    'numeracy-pulse': { label: 'Numeracy Pulse' },
    'numeracy-packet': { label: 'Numeracy Packet' },
    'numeracy-import': { label: 'Numeracy Data Intake' },
    'goal-draft': { label: 'Tiered Goal Draft' },
    'literacy-protocol': { label: 'Intervention Protocol' },
    'timeline-iesp': { label: 'Timeline + IESP Auto-Draft' },
    'role-pathway': { label: 'Role Pathway' },
    'parent-pathway': { label: 'Parent Partnership Pathway' },
    'lesson-builder': { label: 'One-Tap Lesson Builder' }
  };

  const REPORT_MEDIA_CATEGORIES = [
    { id: 'mini-lesson', label: 'Mini-lesson' },
    { id: 'whiteboard-walkthrough', label: 'Whiteboard walkthrough' },
    { id: 'intervention-note', label: 'Intervention note' },
    { id: 'student-reflection', label: 'Student reflection' },
    { id: 'fluency-sample', label: 'Fluency sample' },
    { id: 'math-reasoning', label: 'Math reasoning' },
    { id: 'sel-check-in', label: 'SEL check-in' },
    { id: 'family-update', label: 'Family update' }
  ];

  const REPORT_MEDIA_DB = {
    name: 'decode_report_media_v1',
    version: 1,
    store: 'clips'
  };

  const PARENT_MESSAGE_STORE_KEY = 'decode_parent_messages_v1';
  const WRITING_SESSION_STORE_KEY = 'cornerstone_writing_sessions_v2';

  const REPORT_MEDIA_PROMPT_MAP = {
    'literacy-pulse': {
      teacher: 'In 60-90 seconds, explain one literacy strength, one gap, and exactly what you will teach next.',
      student: 'Record what reading strategy helped you most today and one strategy you will try next.'
    },
    'numeracy-pulse': {
      teacher: 'Explain one conceptual math strategy focus and how it connects to class learning.',
      student: 'Show how you solved one math problem and name the strategy you used.'
    },
    'numeracy-packet': {
      teacher: 'Model the week plan: strategy stage, checkpoint target, and one transfer task.',
      student: 'Describe today\'s math strategy and where you can use it again.'
    },
    'numeracy-import': {
      teacher: 'Briefly explain what data source was imported and what instruction decision it changes.',
      student: 'Describe what this progress check tells you about your next goal.'
    },
    'goal-draft': {
      teacher: 'State the near-term goal in family-friendly language and how progress will be checked.',
      student: 'Say your goal in your own words and one action you will take this week.'
    },
    'literacy-protocol': {
      teacher: 'Walk through the intervention routine: explicit teach, guided practice, and transfer.',
      student: 'Share how you feel during each step and where you need support.'
    },
    'timeline-iesp': {
      teacher: 'Summarize the latest timeline evidence and next IESP action in family-friendly language.',
      student: 'Share one strategy that helped this week and one support you need next.'
    },
    'role-pathway': {
      teacher: 'Summarize role-specific priorities and one actionable handoff for the team.',
      student: 'Share what support from adults helps you learn best.'
    },
    'parent-pathway': {
      teacher: 'For parents: explain one structured literacy move and one conceptual math move they can do at home in 5-10 minutes.',
      student: 'Tell your parent one reading strategy and one math strategy you are practicing this week.'
    },
    'lesson-builder': {
      teacher: 'Preview today\'s I do / We do / You do lesson and what success looks like.',
      student: 'Reflect on which part of today\'s lesson helped you most.'
    }
  };

  const REPORT_MEDIA_MAX_ITEMS = 400;

  const NUMERACY_IMPORT_UNDO_KEY = 'decode_numeracy_import_undo_v1';
  const STUDENT_QUICKCHECK_KEY = 'cs_lit_quickcheck_v1';

  const learnerNameEl = document.getElementById('report-learner-name');
  const generatedAtEl = document.getElementById('report-generated-at');
  const quickCheckPanelEl = document.getElementById('report-quickcheck-panel');
  const quickCheckClearBtn = document.getElementById('report-quickcheck-clear');
  const metricsEl = document.getElementById('report-metrics');
  const focusEl = document.getElementById('report-focus');
  const pulseEl = document.getElementById('report-pulse');
  const numeracyPulseEl = document.getElementById('report-numeracy-pulse');
  const builderGradeEl = document.getElementById('report-builder-grade');
  const builderFocusEl = document.getElementById('report-builder-focus');
  const builderDurationEl = document.getElementById('report-builder-duration');
  const builderGenerateBtn = document.getElementById('report-builder-generate');
  const builderCopyBtn = document.getElementById('report-builder-copy');
  const builderOutputEl = document.getElementById('report-builder-output');
  const builderStatusEl = document.getElementById('report-builder-status');
  const writingSnapshotEl = document.getElementById('report-writing-snapshot');
  const writingTrendsEl = document.getElementById('report-writing-trends');
  const writingCopyBtn = document.getElementById('report-writing-copy');
  const writingStatusEl = document.getElementById('report-writing-status');
  const writingHeatmapEl = document.getElementById('report-writing-heatmap');
  const heatmapEl = document.getElementById('report-heatmap');
  const emptyEl = document.getElementById('report-empty');
  const refreshBtn = document.getElementById('report-refresh');
  const loadSampleBtn = document.getElementById('report-load-sample');
  const exportPdfBtn = document.getElementById('report-export-pdf');
  const printBtn = document.getElementById('report-print');
  const shareSummaryEl = document.getElementById('report-share-summary');
  const shareCopyBtn = document.getElementById('report-share-copy');
  const shareStatusEl = document.getElementById('report-share-status');
  const outcomesEl = document.getElementById('report-outcomes');
  const demoReadinessEl = document.getElementById('report-demo-readiness');
  const showcaseFlowEl = document.getElementById('report-showcase-flow');
  const demoAutopilotBtn = document.getElementById('report-demo-autopilot');
  const demoCopyBtn = document.getElementById('report-demo-copy');
  const showcaseCopyBtn = document.getElementById('report-showcase-copy');
  const leadershipExportBtn = document.getElementById('report-leadership-export');
  const demoStatusEl = document.getElementById('report-demo-status');
  const crosswalkEl = document.getElementById('report-framework-crosswalk');
  const benchmarksEl = document.getElementById('report-benchmarks');
  const goalDomainEl = document.getElementById('report-goal-domain');
  const goalTierEl = document.getElementById('report-goal-tier');
  const goalHorizonEl = document.getElementById('report-goal-horizon');
  const goalGenerateBtn = document.getElementById('report-goal-generate');
  const goalCopyBtn = document.getElementById('report-goal-copy');
  const goalOutputEl = document.getElementById('report-goal-output');
  const goalStatusEl = document.getElementById('report-goal-status');
  const protocolDomainEl = document.getElementById('report-protocol-domain');
  const protocolTierEl = document.getElementById('report-protocol-tier');
  const protocolRoleEl = document.getElementById('report-protocol-role');
  const protocolCycleEl = document.getElementById('report-protocol-cycle');
  const protocolGenerateBtn = document.getElementById('report-protocol-generate');
  const protocolCopyBtn = document.getElementById('report-protocol-copy');
  const protocolOutputEl = document.getElementById('report-protocol-output');
  const protocolStatusEl = document.getElementById('report-protocol-status');
  const numeracyDomainEl = document.getElementById('report-numeracy-domain');
  const numeracyTierEl = document.getElementById('report-numeracy-tier');
  const numeracyCycleEl = document.getElementById('report-numeracy-cycle');
  const numeracyAssessmentEl = document.getElementById('report-numeracy-assessment');
  const numeracyStrategyEl = document.getElementById('report-numeracy-strategy');
  const numeracyGenerateBtn = document.getElementById('report-numeracy-generate');
  const numeracyCopyBtn = document.getElementById('report-numeracy-copy');
  const numeracyOutputEl = document.getElementById('report-numeracy-output');
  const numeracyStatusEl = document.getElementById('report-numeracy-status');
  const numeracyImportSourceEl = document.getElementById('report-numeracy-import-source');
  const numeracyImportFileEl = document.getElementById('report-numeracy-import-file');
  const numeracyImportTemplateBtn = document.getElementById('report-numeracy-import-template-btn');
  const numeracyImportHeadersBtn = document.getElementById('report-numeracy-import-headers-btn');
  const numeracyImportAllTemplatesBtn = document.getElementById('report-numeracy-import-all-templates-btn');
  const numeracyImportPreviewBtn = document.getElementById('report-numeracy-import-preview-btn');
  const numeracyImportBtn = document.getElementById('report-numeracy-import-btn');
  const numeracyImportUndoBtn = document.getElementById('report-numeracy-import-undo-btn');
  const numeracyImportSpecEl = document.getElementById('report-numeracy-import-spec');
  const numeracyImportPreviewEl = document.getElementById('report-numeracy-import-preview');
  const numeracyImportStatusEl = document.getElementById('report-numeracy-import-status');
  const reportMediaOpenBtn = document.getElementById('report-media-open-btn');
  const reportMediaOverlayEl = document.getElementById('report-media-overlay');
  const reportMediaModalEl = document.getElementById('report-media-modal');
  const reportMediaCloseBtn = document.getElementById('report-media-close-btn');
  const reportMediaOwnerEl = document.getElementById('report-media-owner');
  const reportMediaSourceEl = document.getElementById('report-media-source');
  const reportMediaSectionEl = document.getElementById('report-media-section');
  const reportMediaCategoryEl = document.getElementById('report-media-category');
  const reportMediaLabelEl = document.getElementById('report-media-label');
  const reportMediaTagsEl = document.getElementById('report-media-tags');
  const reportMediaPromptEl = document.getElementById('report-media-prompt');
  const reportMediaStartBtn = document.getElementById('report-media-start-btn');
  const reportMediaStopBtn = document.getElementById('report-media-stop-btn');
  const reportMediaSaveBtn = document.getElementById('report-media-save-btn');
  const reportMediaDiscardBtn = document.getElementById('report-media-discard-btn');
  const reportMediaAudioPreviewEl = document.getElementById('report-media-audio-preview');
  const reportMediaVideoPreviewEl = document.getElementById('report-media-video-preview');
  const reportMediaModalStatusEl = document.getElementById('report-media-modal-status');
  const reportMediaLibraryEl = document.getElementById('report-media-library');
  const reportMediaStatusEl = document.getElementById('report-media-status');
  const reportMediaSearchEl = document.getElementById('report-media-search');
  const reportMediaFilterSectionEl = document.getElementById('report-media-filter-section');
  const reportMediaFilterOwnerEl = document.getElementById('report-media-filter-owner');
  const reportMediaFilterCategoryEl = document.getElementById('report-media-filter-category');
  const reportMediaSlotEls = Array.from(document.querySelectorAll('[data-media-slot]'));
  const roleSelectEl = document.getElementById('report-role-select');
  const roleDashboardEl = document.getElementById('report-role-dashboard');
  const rolePathwayEl = document.getElementById('report-role-pathway');
  const roleCopyBtn = document.getElementById('report-role-copy');
  const roleStatusEl = document.getElementById('report-role-status');
  const parentIntentEl = document.getElementById('report-parent-intent');
  const parentLanguageEl = document.getElementById('report-parent-language');
  const parentReadingLevelEl = document.getElementById('report-parent-reading-level');
  const parentTemplateEl = document.getElementById('report-parent-template');
  const parentTemplateBtn = document.getElementById('report-parent-template-btn');
  const parentMessageInputEl = document.getElementById('report-parent-message-input');
  const parentGenerateBtn = document.getElementById('report-parent-generate');
  const parentSaveBtn = document.getElementById('report-parent-save');
  const parentCopyBtn = document.getElementById('report-parent-copy');
  const parentMessageOutputEl = document.getElementById('report-parent-message-output');
  const parentWritingTrendEl = document.getElementById('report-parent-writing-trend');
  const parentMessageStatusEl = document.getElementById('report-parent-message-status');
  const interventionTimelineEl = document.getElementById('report-intervention-timeline');
  const iespTrackEl = document.getElementById('report-iesp-track');
  const iespCycleEl = document.getElementById('report-iesp-cycle');
  const iespOwnerEl = document.getElementById('report-iesp-owner');
  const timelineFilterTrackEl = document.getElementById('report-timeline-filter-track');
  const timelineFilterWindowEl = document.getElementById('report-timeline-filter-window');
  const timelineFilterSearchEl = document.getElementById('report-timeline-filter-search');
  const timelineDemoFillBtn = document.getElementById('report-timeline-demo-fill');
  const timelineExportBtn = document.getElementById('report-timeline-export');
  const timelineManualWhenEl = document.getElementById('report-timeline-manual-when');
  const timelineManualTrackEl = document.getElementById('report-timeline-manual-track');
  const timelineManualOwnerEl = document.getElementById('report-timeline-manual-owner');
  const timelineManualLabelEl = document.getElementById('report-timeline-manual-label');
  const timelineManualEventEl = document.getElementById('report-timeline-manual-event');
  const timelineManualNoteEl = document.getElementById('report-timeline-manual-note');
  const timelineManualAddBtn = document.getElementById('report-timeline-manual-add');
  const timelineManualClearBtn = document.getElementById('report-timeline-manual-clear');
  const timelineStatusEl = document.getElementById('report-timeline-status');
  const iespGenerateBtn = document.getElementById('report-iesp-generate');
  const iespCopyBtn = document.getElementById('report-iesp-copy');
  const iespExportTeamBtn = document.getElementById('report-iesp-export-team');
  const iespExportParentBtn = document.getElementById('report-iesp-export-parent');
  const iespOutputEl = document.getElementById('report-iesp-output');
  const iespStatusEl = document.getElementById('report-iesp-status');
  const sprintTrackEl = document.getElementById('report-sprint-track');
  const sprintWindowEl = document.getElementById('report-sprint-window');
  const sprintOwnerEl = document.getElementById('report-sprint-owner');
  const sprintGenerateBtn = document.getElementById('report-sprint-generate');
  const sprintCopyBtn = document.getElementById('report-sprint-copy');
  const sprintExportBtn = document.getElementById('report-sprint-export');
  const sprintBoardEl = document.getElementById('report-sprint-board');
  const sprintStatusEl = document.getElementById('report-sprint-status');
  const classBlockRoleEl = document.getElementById('report-class-block-role');
  const classBlockGradeEl = document.getElementById('report-class-block-grade');
  const classBlockGridEl = document.getElementById('report-class-block-grid');
  const classBlockStatusEl = document.getElementById('report-class-block-status');

  let latestBuilderText = '';
  let latestShareText = '';
  let latestWritingSnapshotText = '';
  let latestWritingProgress = null;
  let latestDemoReadinessText = '';
  let latestShowcaseScriptText = '';
  let latestLeadershipPackText = '';
  let latestGoalText = '';
  let latestProtocolText = '';
  let latestNumeracyText = '';
  let latestRolePathwayText = '';
  let latestParentMessageText = '';
  let latestIespText = '';
  let latestIespParentText = '';
  let latestTimelineText = '';
  let latestTimelineRows = [];
  let latestSprintBoardText = '';
  let latestGoalContext = null;
  let latestProtocolContext = null;
  let latestNumeracyContext = null;
  let latestRoleContext = null;
  let latestParentContext = null;
  let latestIespContext = null;
  let latestSprintContext = null;
  let latestClassBlockContext = null;
  let latestLeadershipContext = null;
  let pendingNumeracyImport = null;
  let reportMediaDbPromise = null;
  let reportMediaRecorderState = null;
  let reportMediaDraft = null;
  let reportMediaClips = [];
  let reportMediaObjectUrls = [];
  const HOME_ROLE_KEY = 'cornerstone_home_role_v1';
  const TIMELINE_MANUAL_KEY = 'cornerstone_timeline_manual_v1';
  const SPRINT_COMPLETION_KEY = 'cornerstone_sprint_completion_v1';

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

  function isStudentModeActive() {
    const role = normalizeHomeRolePathway(localStorage.getItem(HOME_ROLE_KEY) || '');
    return role === 'student';
  }

  function renderStudentModeReportLock() {
    document.body.classList.add('student-mode');
    const cards = Array.from(document.querySelectorAll('.report-card'));
    cards.forEach((card) => {
      card.setAttribute('data-student-hidden', 'true');
      card.hidden = true;
      card.setAttribute('aria-hidden', 'true');
    });

    const reportMain = document.querySelector('.report-main');
    if (!reportMain) return;

    let lockCard = document.getElementById('report-student-lock-card');
    if (!lockCard) {
      lockCard = document.createElement('section');
      lockCard.id = 'report-student-lock-card';
      lockCard.className = 'report-card report-student-lock';
      reportMain.prepend(lockCard);
    }

    lockCard.hidden = false;
    lockCard.removeAttribute('aria-hidden');
    lockCard.innerHTML = `
      <div class="report-card-header">
        <h2>Student Mode is On</h2>
      </div>
      <p class="report-focus-note">This report view is locked for learners. Use student practice pathways or ask an adult to use <strong>Unlock Adult Tools</strong> in the top bar.</p>
      <div class="home-cta-row">
        <a class="home-cta primary" href="word-quest.html">Start Word Quest</a>
        <a class="home-cta ghost" href="number-sense.html">Start Number Sense</a>
        <a class="home-cta ghost" href="plan-it.html">Open Plan-It</a>
        <a class="home-cta ghost" href="index.html?role=student">Go to Student Home</a>
      </div>
    `;
  }

  if (isStudentModeActive()) {
    renderStudentModeReportLock();
    return;
  }

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

  function clampCount(value, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(max, Math.round(numeric)));
  }

  function formatQuickCheckDate(dateValue) {
    const parsed = new Date(dateValue || '');
    if (Number.isNaN(parsed.getTime())) return 'Unknown';
    return parsed.toLocaleString();
  }

  function fluencyLabel(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'easy') return 'Easy';
    if (normalized === 'okay') return 'Okay';
    if (normalized === 'tricky') return 'Tricky';
    return 'Tricky';
  }

  function normalizeQuickCheckPayload(payload) {
    if (!payload || typeof payload !== 'object') return null;
    return {
      dateLabel: formatQuickCheckDate(payload.date),
      lettersKnown: clampCount(payload.letters_known, 8),
      cvcEasy: clampCount(payload.cvc_easy, 6),
      dvEasy: clampCount(payload.dv_easy, 6),
      fluencyRating: fluencyLabel(payload.fluency_rating)
    };
  }

  function renderStudentQuickCheckPanel() {
    if (!quickCheckPanelEl) return;
    const payload = safeParse(localStorage.getItem(STUDENT_QUICKCHECK_KEY) || '');
    const data = normalizeQuickCheckPayload(payload);
    if (!data) {
      quickCheckPanelEl.innerHTML = '<p class="report-focus-note">No Quick Check results found. Students can download and share their results.</p>';
      if (quickCheckClearBtn) quickCheckClearBtn.disabled = true;
      return;
    }

    quickCheckPanelEl.innerHTML = `
      <div class="report-builder-summary">
        <div><strong>Date:</strong> ${escapeHtml(data.dateLabel)}</div>
        <div><strong>Letter sounds known:</strong> ${data.lettersKnown}/8</div>
        <div><strong>CVC words easy:</strong> ${data.cvcEasy}/6</div>
        <div><strong>Digraph/vowel team words easy:</strong> ${data.dvEasy}/6</div>
        <div><strong>Fluency self-rating:</strong> ${escapeHtml(data.fluencyRating)}</div>
      </div>
      <p class="report-focus-note">These results are student self-reported and for classroom insight only.</p>
    `;
    if (quickCheckClearBtn) quickCheckClearBtn.disabled = false;
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

  function normalizeCsvKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  function detectCsvDelimiter(text) {
    const firstLine = String(text || '')
      .split(/\r?\n/)
      .find((line) => line.trim().length > 0) || '';
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const max = Math.max(commaCount, tabCount, semicolonCount);
    if (max === tabCount && tabCount > 0) return '\t';
    if (max === semicolonCount && semicolonCount > 0) return ';';
    return ',';
  }

  function parseDelimitedRows(text, delimiter = ',') {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    const source = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < source.length; i += 1) {
      const char = source[i];
      const next = source[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === delimiter && !inQuotes) {
        row.push(cell.trim());
        cell = '';
        continue;
      }

      if (char === '\n' && !inQuotes) {
        row.push(cell.trim());
        const hasValue = row.some((value) => String(value || '').trim() !== '');
        if (hasValue) rows.push(row);
        row = [];
        cell = '';
        continue;
      }

      cell += char;
    }

    if (cell.length > 0 || row.length > 0) {
      row.push(cell.trim());
      const hasValue = row.some((value) => String(value || '').trim() !== '');
      if (hasValue) rows.push(row);
    }

    return rows;
  }

  function parseCsvObjects(text) {
    const delimiter = detectCsvDelimiter(text);
    const rows = parseDelimitedRows(text, delimiter);
    if (!rows.length) return [];
    const header = rows[0].map((value) => normalizeCsvKey(value));
    return rows.slice(1).map((cells, index) => {
      const obj = { __row: index + 2 };
      header.forEach((key, keyIndex) => {
        if (!key) return;
        obj[key] = String(cells[keyIndex] || '').trim();
      });
      return obj;
    });
  }

  function activeNumeracyImportSourceId() {
    const sourceId = String(numeracyImportSourceEl?.value || 'im-cooldown');
    return NUMERACY_IMPORT_SOURCE_META[sourceId] ? sourceId : 'im-cooldown';
  }

  function getNumeracyTemplateSpec(sourceId) {
    return NUMERACY_IMPORT_TEMPLATE_LIBRARY[sourceId] || NUMERACY_IMPORT_TEMPLATE_LIBRARY['im-cooldown'];
  }

  function escapeCsvValue(value) {
    const text = String(value ?? '');
    if (/["\n,]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function buildCsvContent(headers, rows) {
    const safeHeaders = Array.isArray(headers) ? headers : [];
    const safeRows = Array.isArray(rows) ? rows : [];
    const lines = [safeHeaders.map((header) => escapeCsvValue(header)).join(',')];
    safeRows.forEach((row) => {
      const values = safeHeaders.map((header) => escapeCsvValue(row?.[header] ?? ''));
      lines.push(values.join(','));
    });
    return `${lines.join('\n')}\n`;
  }

  function downloadCsvText(fileName, csvText) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(href);
  }

  function downloadNumeracyTemplateCsv() {
    const sourceId = activeNumeracyImportSourceId();
    const meta = NUMERACY_IMPORT_SOURCE_META[sourceId] || NUMERACY_IMPORT_SOURCE_META['im-cooldown'];
    const spec = getNumeracyTemplateSpec(sourceId);
    const csvText = buildCsvContent(spec.templateHeaders, spec.sampleRows);
    downloadCsvText(`${sourceId}-template.csv`, csvText);
    setNumeracyImportStatus(`Downloaded template CSV for ${meta.label}.`);
  }

  function downloadNumeracyAcceptedHeadersCsv() {
    const sourceId = activeNumeracyImportSourceId();
    const meta = NUMERACY_IMPORT_SOURCE_META[sourceId] || NUMERACY_IMPORT_SOURCE_META['im-cooldown'];
    const spec = getNumeracyTemplateSpec(sourceId);
    const rows = (spec.acceptedHeaders || []).map((header) => ({
      header,
      normalized: normalizeCsvKey(header)
    }));
    const csvText = buildCsvContent(['header', 'normalized'], rows);
    downloadCsvText(`${sourceId}-accepted-headers.csv`, csvText);
    setNumeracyImportStatus(`Downloaded accepted headers CSV for ${meta.label}.`);
  }

  const REPORT_ZIP_CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let crc = index;
      for (let bit = 0; bit < 8; bit += 1) {
        crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
      }
      table[index] = crc >>> 0;
    }
    return table;
  })();

  function reportZipCrc32(data) {
    let crc = 0xffffffff;
    for (let index = 0; index < data.length; index += 1) {
      crc = REPORT_ZIP_CRC_TABLE[(crc ^ data[index]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function reportZipDosDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = Math.floor(date.getSeconds() / 2);
    const dosTime = (hours << 11) | (minutes << 5) | seconds;
    const dosDate = ((year - 1980) << 9) | (month << 5) | day;
    return { dosTime, dosDate };
  }

  function createReportZipArchive(files = []) {
    const encoder = new TextEncoder();
    const fileRecords = [];
    const chunks = [];
    let offset = 0;

    files.forEach((file) => {
      const nameBytes = encoder.encode(String(file.name || 'file.txt'));
      const data = file.data instanceof Uint8Array ? file.data : encoder.encode(String(file.data || ''));
      const { dosTime, dosDate } = reportZipDosDateTime();
      const crc = reportZipCrc32(data);

      const localHeader = new Uint8Array(30 + nameBytes.length);
      const localView = new DataView(localHeader.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, dosTime, true);
      localView.setUint16(12, dosDate, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, nameBytes.length, true);
      localView.setUint16(28, 0, true);
      localHeader.set(nameBytes, 30);

      chunks.push(localHeader, data);
      fileRecords.push({
        nameBytes,
        crc,
        size: data.length,
        offset,
        dosTime,
        dosDate
      });
      offset += localHeader.length + data.length;
    });

    const centralChunks = [];
    let centralSize = 0;
    fileRecords.forEach((record) => {
      const centralHeader = new Uint8Array(46 + record.nameBytes.length);
      const centralView = new DataView(centralHeader.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, record.dosTime, true);
      centralView.setUint16(14, record.dosDate, true);
      centralView.setUint32(16, record.crc, true);
      centralView.setUint32(20, record.size, true);
      centralView.setUint32(24, record.size, true);
      centralView.setUint16(28, record.nameBytes.length, true);
      centralView.setUint16(30, 0, true);
      centralView.setUint16(32, 0, true);
      centralView.setUint16(34, 0, true);
      centralView.setUint16(36, 0, true);
      centralView.setUint32(38, 0, true);
      centralView.setUint32(42, record.offset, true);
      centralHeader.set(record.nameBytes, 46);
      centralChunks.push(centralHeader);
      centralSize += centralHeader.length;
    });

    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, fileRecords.length, true);
    endView.setUint16(10, fileRecords.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    endView.setUint16(20, 0, true);

    return new Blob([...chunks, ...centralChunks, endRecord], { type: 'application/zip' });
  }

  function downloadBlobFile(fileName, blob) {
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(href);
  }

  function downloadNumeracyAllTemplatesBundle() {
    const encoder = new TextEncoder();
    const files = [];
    Object.keys(NUMERACY_IMPORT_SOURCE_META).forEach((sourceId) => {
      const spec = getNumeracyTemplateSpec(sourceId);
      const templateCsv = buildCsvContent(spec.templateHeaders || [], spec.sampleRows || []);
      files.push({
        name: `templates/${sourceId}-template.csv`,
        data: encoder.encode(templateCsv)
      });
      const acceptedHeaderRows = (spec.acceptedHeaders || []).map((header) => ({
        header,
        normalized: normalizeCsvKey(header)
      }));
      const acceptedCsv = buildCsvContent(['header', 'normalized'], acceptedHeaderRows);
      files.push({
        name: `headers/${sourceId}-accepted-headers.csv`,
        data: encoder.encode(acceptedCsv)
      });
    });

    const readme = [
      'CORNERSTONE MTSS - Numeracy CSV Template Bundle',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      'Files:',
      '- templates/*: starter CSV files with a sample row',
      '- headers/*: accepted header aliases and normalized lookup keys',
      '',
      'How to use:',
      '1) Pick a source in Teacher Report > Numeracy Data Intake (CSV).',
      '2) Fill the matching template or map your export headers to accepted aliases.',
      '3) Preview before commit to inspect mapped rows and skip diagnostics.'
    ].join('\n');

    files.push({
      name: 'README.txt',
      data: encoder.encode(readme)
    });

    const zipBlob = createReportZipArchive(files);
    downloadBlobFile(`numeracy_csv_templates_bundle_${buildDateSlug(new Date())}.zip`, zipBlob);
    setNumeracyImportStatus('Downloaded all source templates + accepted headers bundle.');
  }

  function getCsvValue(row, aliases) {
    for (let index = 0; index < aliases.length; index += 1) {
      const key = normalizeCsvKey(aliases[index]);
      const value = row[key];
      if (value !== undefined && String(value).trim() !== '') return String(value).trim();
    }
    return '';
  }

  function parseNumericValue(raw) {
    const text = String(raw || '').trim();
    if (!text) return null;
    const normalized = text.replace(/,/g, '');
    const match = normalized.match(/[-+]?\d*\.?\d+/);
    if (!match) return null;
    const value = Number(match[0]);
    return Number.isFinite(value) ? value : null;
  }

  function parseNumericRangeMidpoint(raw) {
    const text = String(raw || '').trim();
    if (!text) return null;
    const matches = text.replace(/,/g, '').match(/[-+]?\d*\.?\d+/g);
    if (!matches || !matches.length) return null;
    if (matches.length === 1) return parseNumericValue(matches[0]);
    const first = Number(matches[0]);
    const second = Number(matches[1]);
    if (!Number.isFinite(first) || !Number.isFinite(second)) return null;
    return (first + second) / 2;
  }

  function parseDateValue(raw) {
    const text = String(raw || '').trim();
    if (!text) return Date.now();
    const parsed = Date.parse(text);
    if (!Number.isNaN(parsed)) return parsed;
    const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (slashMatch) {
      const month = Number(slashMatch[1]);
      const day = Number(slashMatch[2]);
      let year = Number(slashMatch[3]);
      if (year < 100) year += 2000;
      const ts = Date.UTC(year, month - 1, day);
      if (!Number.isNaN(ts)) return ts;
    }
    return Date.now();
  }

  function toGradeBand(raw, fallback = '3-5') {
    const text = String(raw || '').trim().toLowerCase();
    if (!text) return normalizeGradeBand(fallback);
    if (text.includes('k') || text.includes('kind')) return 'K-2';
    if (text.includes('9') || text.includes('10') || text.includes('11') || text.includes('12') || text.includes('high')) return '9-12';
    const numeric = parseNumericValue(text);
    if (numeric !== null) {
      if (numeric <= 2) return 'K-2';
      if (numeric <= 5) return '3-5';
      if (numeric <= 8) return '6-8';
      return '9-12';
    }
    return normalizeGradeBand(fallback);
  }

  function inferNumeracyDomainFromText(rawText, fallbackDomain = 'number-sense') {
    const text = String(rawText || '').toLowerCase();
    if (!text) return fallbackDomain;
    if (text.includes('fact') || text.includes('fluency') || text.includes('automaticity')) return 'fluency';
    if (text.includes('problem') || text.includes('application') || text.includes('model') || text.includes('reason')) return 'problem-solving';
    if (text.includes('language') || text.includes('vocab') || text.includes('explain') || text.includes('justify') || text.includes('communicat')) return 'math-language';
    if (text.includes('operation') || text.includes('add') || text.includes('subtract') || text.includes('multiply') || text.includes('divide') || text.includes('equation') || text.includes('algebra')) return 'operations';
    if (text.includes('number') || text.includes('place value') || text.includes('count') || text.includes('quantity')) return 'number-sense';
    return fallbackDomain;
  }

  function numeracyActivityFromDomain(domainId) {
    if (domainId === 'operations') return 'operations';
    if (domainId === 'problem-solving') return 'problem-solving';
    if (domainId === 'fluency') return 'fluency';
    if (domainId === 'math-language') return 'math-language';
    return 'number-sense';
  }

  function riskLabelToRatio(rawRisk) {
    const text = String(rawRisk || '').toLowerCase();
    if (!text) return null;
    if (/\btier\s*3\b/.test(text) || /\bt3\b/.test(text) || /\btiii\b/.test(text)) return 0.42;
    if (/\btier\s*2\b/.test(text) || /\bt2\b/.test(text) || /\btii\b/.test(text)) return 0.62;
    if (/\btier\s*1\b/.test(text) || /\bt1\b/.test(text) || /\bti\b/.test(text)) return 0.82;
    if (text.includes('at risk') || text.includes('below target') || text.includes('below expectation')) return 0.42;
    if (text.includes('well below') || text.includes('far below') || text.includes('below average')) return 0.42;
    if (text.includes('above average') || text.includes('well above') || text.includes('exceeds')) return 0.88;
    if (text.includes('average') || text.includes('typical')) return 0.74;
    if (text.includes('high') || text.includes('intensive') || text.includes('red')) return 0.42;
    if (text.includes('some') || text.includes('moderate') || text.includes('yellow') || text.includes('watch')) return 0.62;
    if (text.includes('low') || text.includes('on track') || text.includes('green') || text.includes('meets')) return 0.82;
    return null;
  }

  function ritToRatio(rit, gradeBand) {
    const ranges = {
      'K-2': { min: 130, max: 200 },
      '3-5': { min: 150, max: 220 },
      '6-8': { min: 170, max: 240 },
      '9-12': { min: 180, max: 250 }
    };
    const range = ranges[gradeBand] || ranges['3-5'];
    return clamp((rit - range.min) / (range.max - range.min));
  }

  function buildImportedNumeracyEntry(input) {
    const ratio = clamp(input.ratio);
    const percentScore = Math.round(ratio * 100);
    const domain = String(input.domain || 'number-sense');
    const activity = numeracyActivityFromDomain(domain);
    const label = NUMERACY_ACTIVITY_LABELS[activity] || activity;
    const sourceTag = String(input.sourceTag || 'external-import');

    return {
      ts: input.ts || Date.now(),
      learnerId: input.learnerId || '',
      activity,
      label,
      event: `${percentScore}/100`,
      detail: {
        domain,
        gradeBand: input.gradeBand || '3-5',
        correct: percentScore,
        total: 100,
        accuracy: ratio,
        source: sourceTag,
        sourceLabel: input.sourceLabel || sourceTag,
        sourceDetail: input.sourceDetail || '',
        evidenceType: 'external-import'
      }
    };
  }

  function summarizeRowPreviewFields(row, limit = 4) {
    const items = Object.entries(row || {})
      .filter(([key, value]) => key !== '__row' && String(value || '').trim() !== '')
      .slice(0, limit)
      .map(([key, value]) => `${key}=${String(value).trim().slice(0, 28)}`);
    return items.join(' | ');
  }

  function buildImportSkipDiagnostic(row, reason, detail, context = {}) {
    const rowNumber = Number(row?.__row || 0);
    return {
      rowNumber: rowNumber > 0 ? rowNumber : null,
      reason: reason || 'Unable to map row',
      detail: detail || 'Required import fields were not found.',
      observed: summarizeRowPreviewFields(row, 4),
      source: context.sourceId || ''
    };
  }

  function summarizeSkipReasons(skippedRows) {
    const counts = {};
    (Array.isArray(skippedRows) ? skippedRows : []).forEach((row) => {
      const reason = row?.reason || 'Unable to map row';
      counts[reason] = (counts[reason] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);
  }

  function importImCooldownRow(row, context) {
    const scoreRaw = getCsvValue(row, ['score', 'result', 'points', 'percentcorrect']);
    const correct = parseNumericValue(getCsvValue(row, ['correct', 'correctitems', 'numcorrect']));
    const total = parseNumericValue(getCsvValue(row, ['total', 'possible', 'max', 'totalitems', 'pointspossible']));
    const percent = parseNumericValue(getCsvValue(row, ['percent', 'pct', 'percentcorrect']));

    let ratio = null;
    if (correct !== null && total !== null && total > 0) ratio = correct / total;
    if (ratio === null) {
      const ratioFromScore = parseRatioFromText(scoreRaw);
      if (ratioFromScore !== null) ratio = ratioFromScore;
    }
    if (ratio === null && percent !== null) {
      ratio = percent > 1 ? percent / 100 : percent;
    }
    if (ratio === null) {
      return {
        entry: null,
        diagnostic: buildImportSkipDiagnostic(
          row,
          'No usable classroom score fields',
          'Need correct+total, score ratio (e.g., 7/10), or percent/percent correct.',
          context
        )
      };
    }

    const gradeBand = toGradeBand(getCsvValue(row, ['grade', 'gradelevel']), context.defaultGradeBand);
    const domainText = [
      getCsvValue(row, ['domain', 'focus', 'strand']),
      getCsvValue(row, ['skill', 'standard']),
      getCsvValue(row, ['assessment', 'task', 'unit'])
    ].join(' ');
    const domain = inferNumeracyDomainFromText(domainText, context.meta.fallbackDomain);
    const ts = parseDateValue(getCsvValue(row, ['date', 'assessmentdate', 'timestamp']));
    const sourceDetail = getCsvValue(row, ['unit', 'cooldown', 'task', 'standard']) || 'IM classroom check';

    return {
      entry: buildImportedNumeracyEntry({
        ratio,
        ts,
        learnerId: context.learnerId,
        gradeBand,
        domain,
        sourceTag: context.meta.sourceTag,
        sourceLabel: context.meta.label,
        sourceDetail
      }),
      diagnostic: null
    };
  }

  function importAimswebRow(row, context) {
    const percentile = parseNumericValue(getCsvValue(row, [
      'percentile',
      'percentilerank',
      'nationalpercentile',
      'normpercentile',
      'overallpercentile'
    ]));
    const growthPercentile = parseNumericValue(getCsvValue(row, [
      'studentgrowthpercentile',
      'growthpercentile',
      'sgp',
      'conditionalgrowthpercentile'
    ]));
    const riskLabel = getCsvValue(row, [
      'risk',
      'risklevel',
      'riskstatus',
      'benchmark',
      'benchmarkstatus',
      'status',
      'performancelevel',
      'tier',
      'alert'
    ]);
    const score = parseNumericValue(getCsvValue(row, [
      'score',
      'rawscore',
      'value',
      'compositescore',
      'growthscalevalue',
      'gsv'
    ]));
    const total = parseNumericValue(getCsvValue(row, [
      'total',
      'maxscore',
      'goal',
      'benchmarkscore',
      'targetscore'
    ]));
    const percent = parseNumericValue(getCsvValue(row, [
      'percent',
      'pct',
      'percentcorrect',
      'accuracy'
    ]));

    let ratio = null;
    if (score !== null && total !== null && total > 0) ratio = score / total;
    if (ratio === null && percentile !== null) ratio = percentile / 100;
    if (ratio === null && growthPercentile !== null) ratio = growthPercentile / 100;
    if (ratio === null && percent !== null) ratio = percent > 1 ? percent / 100 : percent;
    if (ratio === null && score !== null && score >= 0 && score <= 100) ratio = score / 100;
    if (ratio === null) ratio = riskLabelToRatio(riskLabel);
    if (ratio === null) {
      return {
        entry: null,
        diagnostic: buildImportSkipDiagnostic(
          row,
          'No percentile, risk, or score signal',
          'Need one of percentile/growth percentile, score+benchmark score, percent, or risk/performance/tier fields.',
          context
        )
      };
    }

    const gradeBand = toGradeBand(getCsvValue(row, ['grade', 'gradelevel', 'enrolledgrade']), context.defaultGradeBand);
    const domainText = [
      getCsvValue(row, [
        'measure',
        'subtest',
        'skill',
        'domain',
        'measurename',
        'skillsarea',
        'itemcategory',
        'testname'
      ]),
      getCsvValue(row, ['assessment', 'test', 'battery'])
    ].join(' ');
    const domain = inferNumeracyDomainFromText(domainText, context.meta.fallbackDomain);
    const ts = parseDateValue(getCsvValue(row, ['date', 'assessmentdate', 'benchmarkdate', 'testdate', 'timestamp']));
    const sourceDetail = [
      getCsvValue(row, ['measure', 'subtest', 'measurename']),
      getCsvValue(row, ['performancelevel', 'riskstatus', 'benchmarkstatus', 'tier']),
      getCsvValue(row, ['assessment', 'season', 'window'])
    ].filter(Boolean).join(' · ') || 'Aimsweb math screener';

    return {
      entry: buildImportedNumeracyEntry({
        ratio,
        ts,
        learnerId: context.learnerId,
        gradeBand,
        domain,
        sourceTag: context.meta.sourceTag,
        sourceLabel: context.meta.label,
        sourceDetail
      }),
      diagnostic: null
    };
  }

  function importMapRow(row, context) {
    const percentile = parseNumericValue(getCsvValue(row, [
      'percentile',
      'percentilerank',
      'achievementpercentile',
      'nationalpercentile',
      'normpercentile'
    ]));
    const growthPercentile = parseNumericValue(getCsvValue(row, [
      'growthpercentile',
      'studentgrowthpercentile',
      'conditionalgrowthpercentile',
      'cgp'
    ]));
    const rit = parseNumericValue(getCsvValue(row, ['rit', 'ritscore', 'score', 'subjectscore', 'overallrit', 'mathrit']));
    const ritRangeMidpoint = parseNumericRangeMidpoint(getCsvValue(row, ['possiblerange', 'ritrange', 'scorerange']));
    const percent = parseNumericValue(getCsvValue(row, ['percent', 'pct', 'percentcorrect', 'accuracy']));
    const observedGrowth = parseNumericValue(getCsvValue(row, ['observedgrowth', 'ritgrowth', 'actualgrowth']));
    const projectedGrowth = parseNumericValue(getCsvValue(row, ['projectedgrowth', 'expectedgrowth', 'growthprojection']));
    const cgi = parseNumericValue(getCsvValue(row, ['conditionalgrowthindex', 'cgi']));

    const gradeBand = toGradeBand(getCsvValue(row, ['grade', 'gradelevel', 'testgrade']), context.defaultGradeBand);
    let ratio = null;
    if (percentile !== null) ratio = percentile / 100;
    if (ratio === null && growthPercentile !== null) ratio = growthPercentile / 100;
    if (ratio === null && percent !== null) ratio = percent > 1 ? percent / 100 : percent;
    if (ratio === null && rit !== null) ratio = ritToRatio(rit, gradeBand);
    if (ratio === null && ritRangeMidpoint !== null) ratio = ritToRatio(ritRangeMidpoint, gradeBand);
    if (ratio === null && observedGrowth !== null && projectedGrowth !== null && projectedGrowth > 0) {
      ratio = clamp(observedGrowth / projectedGrowth);
    }
    if (ratio === null && cgi !== null) ratio = clamp(0.5 + (cgi * 0.15));
    if (ratio === null) {
      return {
        entry: null,
        diagnostic: buildImportSkipDiagnostic(
          row,
          'No percentile, RIT, or growth signal',
          'Need one of achievement/growth percentile, RIT (or range), observed/projected growth, CGI, or percent fields.',
          context
        )
      };
    }

    const domainText = [
      getCsvValue(row, [
        'goalarea',
        'strand',
        'domain',
        'focus',
        'instructionalarea',
        'suggestedareaoffocus',
        'relativestrength'
      ]),
      getCsvValue(row, ['testname', 'subject', 'course', 'goal'])
    ].join(' ');
    const domain = inferNumeracyDomainFromText(domainText, context.meta.fallbackDomain);
    const ts = parseDateValue(getCsvValue(row, ['date', 'testdate', 'assessmentdate', 'termdate', 'timestamp']));
    const sourceDetail = [
      getCsvValue(row, ['subject', 'testname']),
      getCsvValue(row, ['goalarea', 'instructionalarea', 'strand']),
      getCsvValue(row, ['term', 'window'])
    ].filter(Boolean).join(' · ') || 'MAP math check';

    return {
      entry: buildImportedNumeracyEntry({
        ratio,
        ts,
        learnerId: context.learnerId,
        gradeBand,
        domain,
        sourceTag: context.meta.sourceTag,
        sourceLabel: context.meta.label,
        sourceDetail
      }),
      diagnostic: null
    };
  }

  function importNumeracyCsv(sourceId, csvText, context = {}) {
    const meta = NUMERACY_IMPORT_SOURCE_META[sourceId] || NUMERACY_IMPORT_SOURCE_META['im-cooldown'];
    const rows = parseCsvObjects(csvText);
    const imported = [];
    const skippedRows = [];

    rows.forEach((row) => {
      let mapped = null;
      if (sourceId === 'aimsweb') {
        mapped = importAimswebRow(row, { ...context, meta, sourceId });
      } else if (sourceId === 'map') {
        mapped = importMapRow(row, { ...context, meta, sourceId });
      } else {
        mapped = importImCooldownRow(row, { ...context, meta, sourceId });
      }

      if (mapped?.entry) {
        imported.push(mapped.entry);
      } else {
        skippedRows.push(
          mapped?.diagnostic || buildImportSkipDiagnostic(
            row,
            'Unable to map row',
            'Required import fields were not found.',
            { sourceId }
          )
        );
      }
    });

    return {
      entries: imported,
      importedCount: imported.length,
      skippedCount: skippedRows.length,
      totalRows: rows.length,
      sourceLabel: meta.label,
      skippedRows,
      skipReasonSummary: summarizeSkipReasons(skippedRows)
    };
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
    const numeracyDomainByActivity = {
      'number-sense': 'number-sense',
      operations: 'operations',
      'problem-solving': 'problem-solving',
      fluency: 'fluency',
      'math-language': 'math-language'
    };

    const numeracyPageByActivity = {
      operations: 'operations.html',
      'number-sense': 'number-sense.html',
      'problem-solving': 'number-sense.html',
      fluency: 'number-sense.html',
      'math-language': 'number-sense.html'
    };

    if (context.numeracyMode && numeracyDomainByActivity[activityId]) {
      const numeracyFile = numeracyPageByActivity[activityId] || 'number-sense.html';
      const numeracyUrl = new URL(numeracyFile, window.location.href);
      numeracyUrl.searchParams.set('domain', numeracyDomainByActivity[activityId]);
      if (context.builderGradeBand) {
        numeracyUrl.searchParams.set('gradeBand', context.builderGradeBand);
      }
      if (context.numeracyRounds) {
        numeracyUrl.searchParams.set('rounds', String(context.numeracyRounds));
      }
      return numeracyUrl.toString();
    }

    const file = ACTIVITY_HREF[activityId];
    if (!file) return '#';
    const url = new URL(file, window.location.href);
    if (activityId === 'word-quest' && context.wordQuestFocus) {
      url.searchParams.set('focus', context.wordQuestFocus);
      if (context.wordQuestLength) {
        url.searchParams.set('len', context.wordQuestLength);
      }
    }
    if (activityId === 'plan-it') {
      if (context.builderFocus) {
        url.searchParams.set('builderFocus', context.builderFocus);
      }
      if (context.builderGradeBand) {
        url.searchParams.set('builderGrade', context.builderGradeBand);
      }
      if (context.builderMinutes) {
        url.searchParams.set('builderMinutes', String(context.builderMinutes));
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

  function currentSchoolWindow(date = new Date()) {
    const month = date.getMonth() + 1;
    if (month >= 8 && month <= 10) return 'boy';
    if (month >= 11 || month <= 2) return 'moy';
    return 'eoy';
  }

  function schoolWindowLabel(windowKey) {
    if (windowKey === 'boy') return 'Beginning of year';
    if (windowKey === 'moy') return 'Middle of year';
    return 'End of year';
  }

  function benchmarkStatus(current, target) {
    if (current === null || current === undefined || Number.isNaN(current)) {
      return { label: 'Need baseline', cls: 'bench-none' };
    }
    if (target === null || target === undefined || Number.isNaN(target)) {
      return { label: 'No target', cls: 'bench-none' };
    }
    const delta = current - target;
    if (delta >= 0.03) {
      return { label: 'On track', cls: 'bench-good' };
    }
    if (delta >= -0.06) {
      return { label: 'Watch', cls: 'bench-watch' };
    }
    return { label: 'Intensive', cls: 'bench-alert' };
  }

  function daysSince(ts, now = Date.now()) {
    if (!ts || Number.isNaN(ts)) return null;
    return Math.max(0, Math.round((now - ts) / (24 * 60 * 60 * 1000)));
  }

  function evaluateEvidenceQuality(logs, activityStats, domainStats) {
    const now = Date.now();
    const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);
    let scoredSessions = 0;
    let latestTs = 0;

    logs.forEach((entry) => {
      const score = scoreEntry(entry);
      if (typeof score === 'number' && !Number.isNaN(score)) {
        scoredSessions += 1;
      }
      latestTs = Math.max(latestTs, Number(entry?.ts || 0));
    });

    const recentSessions = logs.filter((entry) => Number(entry?.ts || 0) >= fourteenDaysAgo).length;
    const domainCoverage = domainStats.filter((row) => row.evidence > 0).length;
    const activityCoverage = activityStats.filter((row) => row.evidence > 0).length;
    const recencyDays = daysSince(latestTs, now);

    const volumeScore = logs.length >= 18 ? 1 : logs.length >= 12 ? 0.86 : logs.length >= 8 ? 0.7 : logs.length >= 4 ? 0.5 : 0.28;
    const scoredScore = scoredSessions >= 12 ? 1 : scoredSessions >= 8 ? 0.86 : scoredSessions >= 5 ? 0.68 : scoredSessions >= 3 ? 0.5 : 0.3;
    const recentScore = recentSessions >= 6 ? 1 : recentSessions >= 4 ? 0.84 : recentSessions >= 2 ? 0.64 : recentSessions >= 1 ? 0.46 : 0.3;
    const domainScore = Math.min(1, domainCoverage / 4);
    const activityScore = Math.min(1, activityCoverage / 5);
    const recencyScore = recencyDays === null
      ? 0.3
      : recencyDays <= 2
        ? 1
        : recencyDays <= 7
          ? 0.86
          : recencyDays <= 14
            ? 0.68
            : recencyDays <= 28
              ? 0.45
              : 0.3;

    const confidenceScore = clamp(
      (volumeScore * 0.26)
      + (scoredScore * 0.24)
      + (recentScore * 0.18)
      + (domainScore * 0.16)
      + (activityScore * 0.08)
      + (recencyScore * 0.08)
    );

    const confidenceLabel = confidenceScore >= 0.78
      ? 'High confidence'
      : confidenceScore >= 0.56
        ? 'Medium confidence'
        : 'Early signal';
    const confidenceClass = confidenceScore >= 0.78
      ? 'bench-good'
      : confidenceScore >= 0.56
        ? 'bench-watch'
        : 'bench-alert';

    const readiness = confidenceScore >= 0.74 && logs.length >= 10 && domainCoverage >= 3
      ? 'Actionable'
      : confidenceScore >= 0.56
        ? 'Building'
        : 'Not ready for high-stakes decisions';
    const readinessClass = readiness === 'Actionable'
      ? 'bench-good'
      : readiness === 'Building'
        ? 'bench-watch'
        : 'bench-alert';

    const cautions = [];
    if (logs.length < 8) cautions.push('Evidence volume is low; run more scored sessions before making major placement changes.');
    if (domainCoverage < 3) cautions.push('Coverage is narrow; collect evidence across decoding, fluency, and comprehension before broad conclusions.');
    if (recentSessions < 3) cautions.push('Recent evidence is thin; prioritize fresh data this week to avoid stale recommendations.');
    if (recencyDays !== null && recencyDays > 14) cautions.push('Last scored activity is more than two weeks old; refresh data before sharing with intervention teams.');

    const nextMoves = [];
    if (logs.length < 10) nextMoves.push('Run 3-5 short scored sessions this week.');
    if (domainCoverage < 4) nextMoves.push('Ensure at least one scored task in each literacy domain before next review.');
    if (recentSessions < 4) nextMoves.push('Collect at least four recent data points across two activity types.');
    if (!nextMoves.length) nextMoves.push('Use current data to run a 4-week intervention cycle, then re-check momentum.');

    return {
      confidenceScore,
      confidenceLabel,
      confidenceClass,
      readiness,
      readinessClass,
      scoredSessions,
      totalSessions: logs.length,
      recentSessions,
      domainCoverage,
      activityCoverage,
      recencyDays,
      cautions: cautions.slice(0, 3),
      nextMoves: nextMoves.slice(0, 3)
    };
  }

  function buildBenchmarkSignals(domainStats, gradeBand) {
    const benchmarkMap = BENCHMARK_EXPECTATIONS[gradeBand] || BENCHMARK_EXPECTATIONS['3-5'];
    const windowKey = currentSchoolWindow(new Date());
    const statuses = (domainStats || [])
      .filter((row) => row.domain !== 'general' && benchmarkMap[row.domain] && row.avg !== null && row.avg !== undefined)
      .map((row) => {
        const target = benchmarkMap[row.domain][windowKey];
        const status = benchmarkStatus(row.avg, target);
        const delta = target === null || target === undefined ? null : row.avg - target;
        return {
          domain: row.domain,
          label: row.label,
          current: row.avg,
          target,
          delta,
          status
        };
      });

    return {
      windowKey,
      statuses,
      intensiveCount: statuses.filter((row) => row.status.cls === 'bench-alert').length,
      watchCount: statuses.filter((row) => row.status.cls === 'bench-watch').length,
      onTrackCount: statuses.filter((row) => row.status.cls === 'bench-good').length
    };
  }

  function inferTierRecommendation(domainStats, benchmarkSignals, evidence) {
    const eligible = (domainStats || []).filter((row) => row.domain !== 'general' && row.avg !== null && row.avg !== undefined);
    const redByScore = eligible.filter((row) => row.avg < 0.6).length;
    const severeByScore = eligible.filter((row) => row.avg < 0.52).length;
    const intensiveByBench = benchmarkSignals?.intensiveCount || 0;
    const watchByBench = benchmarkSignals?.watchCount || 0;

    let tier = '1';
    if (severeByScore >= 1 || intensiveByBench >= 2) {
      tier = '3';
    } else if (redByScore >= 1 || intensiveByBench >= 1 || watchByBench >= 2) {
      tier = '2';
    }

    const provisional = (evidence?.confidenceScore || 0) < 0.56;
    const tierLabel = provisional ? `Provisional Tier ${tier}` : `Tier ${tier}`;

    const rationaleParts = [];
    if (severeByScore >= 1) rationaleParts.push('one or more domains are below 52% mastery');
    else if (redByScore >= 1) rationaleParts.push('at least one domain is below 60% mastery');
    if (intensiveByBench >= 1) rationaleParts.push(`${intensiveByBench} domain(s) are below benchmark range`);
    if (!rationaleParts.length) rationaleParts.push('current evidence is mostly on track');
    if (provisional) rationaleParts.push('confidence is still building, so this should be validated with more data');

    return {
      tier,
      tierLabel,
      provisional,
      rationale: `${rationaleParts.join('; ')}.`,
      cadence: tierPlanText(tier),
      decisionRule: progressRuleText(tier)
    };
  }

  function buildLiteracyEngineModel(logs, activityStats, domainStats, gradeBand) {
    const evidence = evaluateEvidenceQuality(logs, activityStats, domainStats);
    const benchmarkSignals = buildBenchmarkSignals(domainStats, gradeBand);
    const tierRecommendation = inferTierRecommendation(domainStats, benchmarkSignals, evidence);

    return {
      evidence,
      benchmarkSignals,
      tierRecommendation,
      equityGuardrails: [
        'Preserve core rigor while adjusting language load, chunking, and response mode.',
        'For EAL/SPED learners, separate language scaffolds from skill expectations when progress-monitoring.',
        'Escalate intensity only when trend data and benchmark gap both indicate risk.'
      ]
    };
  }

  function numeracyActivityDomain(activityId) {
    if (activityId === 'number-sense') return 'number-sense';
    if (activityId === 'operations') return 'operations';
    if (activityId === 'problem-solving') return 'problem-solving';
    if (activityId === 'fluency') return 'fluency';
    if (activityId === 'math-language') return 'math-language';
    return 'general';
  }

  function numeracyDomainLabel(domainId) {
    const map = {
      'number-sense': 'Number sense',
      operations: 'Operations',
      'problem-solving': 'Problem solving',
      fluency: 'Math fluency',
      'math-language': 'Math language',
      general: 'General numeracy'
    };
    return map[domainId] || 'Numeracy';
  }

  function numeracyScoreEntry(entry) {
    const detail = entry?.detail || {};
    const event = String(entry?.event || '').toLowerCase();

    if (typeof detail.correct === 'number' && typeof detail.total === 'number' && detail.total > 0) {
      return clamp(detail.correct / detail.total);
    }

    const ratioFromEvent = parseRatioFromText(event);
    if (ratioFromEvent !== null) return ratioFromEvent;

    if (typeof detail.accuracy === 'number') {
      const raw = Number(detail.accuracy);
      return raw > 1 ? clamp(raw / 100) : clamp(raw);
    }

    if (typeof detail.won === 'boolean') {
      return detail.won ? 1 : 0.25;
    }

    if (typeof detail.missed === 'number' && typeof detail.total === 'number' && detail.total > 0) {
      return clamp((detail.total - detail.missed) / detail.total);
    }

    if (event.includes('mastery') || event.includes('goal met') || event.includes('complete')) {
      return 0.85;
    }

    if (event.includes('started') || event.includes('attempted')) {
      return 0.55;
    }

    return 0.6;
  }

  function getNumeracyLogs() {
    const log = readJson('decode_numeracy_log_v1', []);
    return Array.isArray(log) ? log : [];
  }

  function getNumeracyActivityStats(logs) {
    const buckets = {};
    logs.forEach((entry) => {
      const activity = String(entry?.activity || '');
      if (!NUMERACY_ACTIVITY_LABELS[activity]) return;
      if (!buckets[activity]) {
        buckets[activity] = {
          activity,
          label: NUMERACY_ACTIVITY_LABELS[activity],
          scores: [],
          evidence: 0,
          lastTs: 0
        };
      }
      const score = numeracyScoreEntry(entry);
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

  function getNumeracyDomainStats(logs) {
    const buckets = {};
    logs.forEach((entry) => {
      const activity = String(entry?.activity || '');
      const domain = String(entry?.detail?.domain || numeracyActivityDomain(activity));
      if (!buckets[domain]) {
        buckets[domain] = { domain, scores: [], evidence: 0 };
      }
      const score = numeracyScoreEntry(entry);
      if (typeof score === 'number' && !Number.isNaN(score)) {
        buckets[domain].scores.push(clamp(score));
      }
      buckets[domain].evidence += 1;
    });

    return Object.values(buckets).map((bucket) => ({
      domain: bucket.domain,
      label: numeracyDomainLabel(bucket.domain),
      avg: average(bucket.scores),
      evidence: bucket.evidence
    }));
  }

  function evaluateNumeracyEvidenceQuality(logs, activityStats, domainStats) {
    const now = Date.now();
    const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);
    let scoredSessions = 0;
    let latestTs = 0;

    logs.forEach((entry) => {
      const score = numeracyScoreEntry(entry);
      if (typeof score === 'number' && !Number.isNaN(score)) {
        scoredSessions += 1;
      }
      latestTs = Math.max(latestTs, Number(entry?.ts || 0));
    });

    const recentSessions = logs.filter((entry) => Number(entry?.ts || 0) >= fourteenDaysAgo).length;
    const domainCoverage = domainStats.filter((row) => row.evidence > 0 && row.domain !== 'general').length;
    const activityCoverage = activityStats.filter((row) => row.evidence > 0).length;
    const recencyDays = daysSince(latestTs, now);

    const volumeScore = logs.length >= 16 ? 1 : logs.length >= 10 ? 0.84 : logs.length >= 6 ? 0.66 : logs.length >= 3 ? 0.5 : 0.28;
    const scoredScore = scoredSessions >= 12 ? 1 : scoredSessions >= 8 ? 0.86 : scoredSessions >= 5 ? 0.7 : scoredSessions >= 3 ? 0.52 : 0.3;
    const recentScore = recentSessions >= 6 ? 1 : recentSessions >= 4 ? 0.82 : recentSessions >= 2 ? 0.64 : recentSessions >= 1 ? 0.44 : 0.3;
    const domainScore = Math.min(1, domainCoverage / 4);
    const activityScore = Math.min(1, activityCoverage / 4);
    const recencyScore = recencyDays === null
      ? 0.3
      : recencyDays <= 2
        ? 1
        : recencyDays <= 7
          ? 0.84
          : recencyDays <= 14
            ? 0.66
            : recencyDays <= 28
              ? 0.45
              : 0.3;

    const confidenceScore = clamp(
      (volumeScore * 0.28)
      + (scoredScore * 0.24)
      + (recentScore * 0.18)
      + (domainScore * 0.16)
      + (activityScore * 0.08)
      + (recencyScore * 0.06)
    );

    const confidenceLabel = confidenceScore >= 0.78
      ? 'High confidence'
      : confidenceScore >= 0.56
        ? 'Medium confidence'
        : 'Early signal';
    const confidenceClass = confidenceScore >= 0.78
      ? 'bench-good'
      : confidenceScore >= 0.56
        ? 'bench-watch'
        : 'bench-alert';

    const readiness = confidenceScore >= 0.72 && logs.length >= 8 && domainCoverage >= 3
      ? 'Actionable'
      : confidenceScore >= 0.56
        ? 'Building'
        : 'Not ready for high-stakes decisions';
    const readinessClass = readiness === 'Actionable'
      ? 'bench-good'
      : readiness === 'Building'
        ? 'bench-watch'
        : 'bench-alert';

    const cautions = [];
    if (logs.length < 8) cautions.push('Numeracy evidence volume is low; gather more scored checks before major placement decisions.');
    if (domainCoverage < 3) cautions.push('Coverage is narrow; include number sense, operations, and problem solving evidence.');
    if (recentSessions < 3) cautions.push('Recent evidence is thin; capture fresh probes this week.');
    if (recencyDays !== null && recencyDays > 14) cautions.push('Most recent numeracy evidence is stale; refresh before team review.');

    const nextMoves = [];
    if (logs.length < 10) nextMoves.push('Run 3-5 short numeracy probes this week.');
    if (domainCoverage < 4) nextMoves.push('Collect at least one scored task in each numeracy domain.');
    if (recentSessions < 4) nextMoves.push('Capture at least four recent data points across two activity types.');
    if (!nextMoves.length) nextMoves.push('Run the next 4-week numeracy intervention cycle and re-check growth.');

    return {
      confidenceScore,
      confidenceLabel,
      confidenceClass,
      readiness,
      readinessClass,
      scoredSessions,
      totalSessions: logs.length,
      recentSessions,
      domainCoverage,
      activityCoverage,
      recencyDays,
      cautions: cautions.slice(0, 3),
      nextMoves: nextMoves.slice(0, 3)
    };
  }

  function buildNumeracyBenchmarkSignals(domainStats, gradeBand) {
    const benchmarkMap = NUMERACY_BENCHMARK_EXPECTATIONS[gradeBand] || NUMERACY_BENCHMARK_EXPECTATIONS['3-5'];
    const windowKey = currentSchoolWindow(new Date());
    const statuses = (domainStats || [])
      .filter((row) => row.domain !== 'general' && benchmarkMap[row.domain] && row.avg !== null && row.avg !== undefined)
      .map((row) => {
        const target = benchmarkMap[row.domain][windowKey];
        const status = benchmarkStatus(row.avg, target);
        const delta = target === null || target === undefined ? null : row.avg - target;
        return {
          domain: row.domain,
          label: row.label,
          current: row.avg,
          target,
          delta,
          status
        };
      });

    return {
      windowKey,
      statuses,
      intensiveCount: statuses.filter((row) => row.status.cls === 'bench-alert').length,
      watchCount: statuses.filter((row) => row.status.cls === 'bench-watch').length,
      onTrackCount: statuses.filter((row) => row.status.cls === 'bench-good').length
    };
  }

  function inferNumeracyTierRecommendation(domainStats, benchmarkSignals, evidence) {
    const eligible = (domainStats || []).filter((row) => row.domain !== 'general' && row.avg !== null && row.avg !== undefined);
    const redByScore = eligible.filter((row) => row.avg < 0.6).length;
    const severeByScore = eligible.filter((row) => row.avg < 0.52).length;
    const intensiveByBench = benchmarkSignals?.intensiveCount || 0;
    const watchByBench = benchmarkSignals?.watchCount || 0;

    let tier = '1';
    if (severeByScore >= 1 || intensiveByBench >= 2) {
      tier = '3';
    } else if (redByScore >= 1 || intensiveByBench >= 1 || watchByBench >= 2) {
      tier = '2';
    }

    const provisional = (evidence?.confidenceScore || 0) < 0.56;
    const tierLabel = provisional ? `Provisional Tier ${tier}` : `Tier ${tier}`;

    const rationaleParts = [];
    if (severeByScore >= 1) rationaleParts.push('one or more numeracy domains are below 52% mastery');
    else if (redByScore >= 1) rationaleParts.push('at least one numeracy domain is below 60% mastery');
    if (intensiveByBench >= 1) rationaleParts.push(`${intensiveByBench} domain(s) are below benchmark range`);
    if (!rationaleParts.length) rationaleParts.push('current numeracy evidence is mostly on track');
    if (provisional) rationaleParts.push('confidence is still building, so confirm with additional probes');

    return {
      tier,
      tierLabel,
      provisional,
      rationale: `${rationaleParts.join('; ')}.`
    };
  }

  function buildNumeracyRecommendedActivities(gaps) {
    const picks = [];
    const seen = new Set();
    function add(activityId, rationale) {
      if (!activityId || seen.has(activityId)) return;
      seen.add(activityId);
      picks.push({
        activity: activityId,
        label: NUMERACY_ACTIVITY_LABELS[activityId] || activityId,
        rationale
      });
    }

    gaps.forEach((gap) => {
      const playbook = NUMERACY_DOMAIN_ACTIVITY_PLAYBOOK[gap.domain] || NUMERACY_DOMAIN_ACTIVITY_PLAYBOOK.general;
      playbook.forEach((step) => add(step.activity, `${gap.label}: ${step.move}`));
    });

    if (!picks.length) {
      NUMERACY_DOMAIN_ACTIVITY_PLAYBOOK.general.forEach((step) => add(step.activity, step.move));
    }
    return picks.slice(0, 3);
  }

  function buildNumeracyEngineModel(logs, activityStats, domainStats, gradeBand) {
    const evidence = evaluateNumeracyEvidenceQuality(logs, activityStats, domainStats);
    const benchmarkSignals = buildNumeracyBenchmarkSignals(domainStats, gradeBand);
    const tierRecommendation = inferNumeracyTierRecommendation(domainStats, benchmarkSignals, evidence);

    return {
      evidence,
      benchmarkSignals,
      tierRecommendation,
      guardrails: [
        'Keep mathematical reasoning demand high while adjusting language and representation supports.',
        'Separate conceptual misunderstanding from language-expression barriers for EAL/SPED learners.',
        'Escalate intervention intensity only when trend data and benchmark gap both indicate risk.'
      ]
    };
  }

  function buildNumeracyPulseModel(logs, options = {}) {
    const gradeBand = normalizeGradeBand(options.gradeBand || '3-5');
    const activityStats = getNumeracyActivityStats(logs);
    const domainStats = getNumeracyDomainStats(logs)
      .filter((row) => row.domain !== 'general' && row.evidence > 0 && row.avg !== null)
      .sort((a, b) => b.avg - a.avg);
    const engine = buildNumeracyEngineModel(logs, activityStats, domainStats, gradeBand);

    const strengths = domainStats
      .filter((row) => row.evidence >= 2 && row.avg >= 0.74)
      .slice(0, 3);

    const gaps = [...domainStats]
      .filter((row) => row.evidence >= 2 && row.avg < 0.7)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 3);

    const fallbackStrengths = strengths.length ? strengths : domainStats.slice(0, 3);
    const fallbackGaps = gaps.length ? gaps : [...domainStats].sort((a, b) => a.avg - b.avg).slice(0, 3);

    const priorities = [];
    if (fallbackGaps[0]) priorities.push(`Top numeracy gap: ${fallbackGaps[0].label} (${formatPercent(fallbackGaps[0].avg)})`);
    if (engine?.tierRecommendation?.tierLabel) priorities.push(`Support intensity: ${engine.tierRecommendation.tierLabel}`);
    if (engine?.evidence?.confidenceLabel) priorities.push(`Evidence signal: ${engine.evidence.confidenceLabel}`);

    const traffic = {
      red: [],
      yellow: [],
      green: []
    };
    domainStats.forEach((row) => {
      const label = `${row.label} (${formatPercent(row.avg)})`;
      if (row.avg < 0.6) {
        traffic.red.push(label);
      } else if (row.avg < 0.8) {
        traffic.yellow.push(label);
      } else {
        traffic.green.push(label);
      }
    });

    const interventionSnapshot = activityStats
      .filter((row) => row.avg !== null)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 5);

    const recommendedActivities = buildNumeracyRecommendedActivities(fallbackGaps);

    return {
      gradeBand,
      engine,
      strengths: fallbackStrengths,
      gaps: fallbackGaps,
      priorities: priorities.slice(0, 3),
      domainStats,
      activityStats,
      recommendedActivities,
      traffic,
      interventionSnapshot
    };
  }

  function renderNumeracyPulse(pulse) {
    if (!numeracyPulseEl) return;

    const engine = pulse?.engine || {};
    const evidence = engine?.evidence || {};
    const tierRecommendation = engine?.tierRecommendation || {};
    const benchmarkSignals = engine?.benchmarkSignals || {};

    const strengthItems = pulse?.strengths?.length
      ? pulse.strengths.map((row) => `<li>${escapeHtml(row.label)} · ${formatPercent(row.avg)} (${row.evidence} samples)</li>`).join('')
      : '<li>Need more scored numeracy sessions to confirm strengths.</li>';
    const gapItems = pulse?.gaps?.length
      ? pulse.gaps.map((row) => `<li>${escapeHtml(row.label)} · ${formatPercent(row.avg)} (${row.evidence} samples)</li>`).join('')
      : '<li>No major numeracy gaps flagged yet.</li>';
    const priorityItems = pulse?.priorities?.length
      ? pulse.priorities.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>Collect 3-5 scored numeracy sessions to generate stronger priorities.</li>';
    const activityItems = pulse?.recommendedActivities?.length
      ? pulse.recommendedActivities.map((item) => `<li><strong>${escapeHtml(item.label)}</strong><div class="report-pulse-subnote">${escapeHtml(item.rationale)}</div></li>`).join('')
      : '<li>Complete scored numeracy tasks first for activity recommendations.</li>';
    const benchmarkItems = benchmarkSignals?.statuses?.length
      ? benchmarkSignals.statuses.map((row) => `<li>${escapeHtml(row.label)}: ${formatPercent(row.current)} vs ${formatPercent(row.target)} <span class="report-bench-chip ${row.status.cls}">${escapeHtml(row.status.label)}</span></li>`).join('')
      : '<li>Benchmark signal appears after scored domain evidence.</li>';
    const cautionItems = evidence?.cautions?.length
      ? evidence.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>No major data quality cautions right now.</li>';
    const nextMoveItems = evidence?.nextMoves?.length
      ? evidence.nextMoves.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>Continue current numeracy cycle and refresh next week.</li>';
    const redItems = pulse?.traffic?.red?.length
      ? pulse.traffic.red.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>No domains in urgent status.</li>';
    const yellowItems = pulse?.traffic?.yellow?.length
      ? pulse.traffic.yellow.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>No domains in monitor status.</li>';
    const greenItems = pulse?.traffic?.green?.length
      ? pulse.traffic.green.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>No domains in maintain status yet.</li>';

    const confidenceClass = evidence?.confidenceClass || 'bench-none';
    const readinessClass = evidence?.readinessClass || 'bench-none';
    const confidenceLabel = evidence?.confidenceLabel || 'No confidence signal yet';
    const readinessLabel = evidence?.readiness || 'Collect baseline evidence';
    const tierLabel = tierRecommendation?.tierLabel || 'Tier recommendation pending';
    const tierRationale = tierRecommendation?.rationale || 'Need more evidence for tier recommendation.';
    const recencyText = evidence?.recencyDays === null || evidence?.recencyDays === undefined
      ? 'No recent session'
      : `${evidence.recencyDays} day(s) since last logged session`;
    const sourceBundleId = resolveNumeracyAssessmentBundle();
    const sourceSummary = summarizeNumeracySources(pulse?.gradeBand || '3-5', sourceBundleId);
    const sourceItems = sourceSummary.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
    const sourceAvailabilityItems = sourceSummary.availabilitySummary.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
    const coherenceItems = [
      'Tier 1: run conceptual routines (number strings, visual models, cooldown checks) in core.',
      'Tier 2: add targeted small-group strategy sessions with weekly progress probes.',
      'Tier 3: daily intensive strategy intervention plus specialist and family communication.'
    ].map((line) => `<li>${escapeHtml(line)}</li>`).join('');

    numeracyPulseEl.innerHTML = `
      <div class="report-pulse-grid">
        <article class="report-pulse-card">
          <h3>Numeracy Engine Status</h3>
          <ul>
            <li><strong>Confidence:</strong> ${escapeHtml(confidenceLabel)} (${formatPercent(evidence?.confidenceScore || 0)}) <span class="report-bench-chip ${confidenceClass}">${escapeHtml(confidenceLabel)}</span></li>
            <li><strong>Readiness:</strong> ${escapeHtml(readinessLabel)} <span class="report-bench-chip ${readinessClass}">${escapeHtml(readinessLabel)}</span></li>
            <li><strong>Coverage:</strong> ${escapeHtml(String(evidence?.totalSessions || 0))} sessions · ${escapeHtml(String(evidence?.scoredSessions || 0))} scored · ${escapeHtml(String(evidence?.domainCoverage || 0))} domains</li>
            <li><strong>Recency:</strong> ${escapeHtml(recencyText)}</li>
          </ul>
        </article>
        <article class="report-pulse-card">
          <h3>Strengths</h3>
          <ul>${strengthItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Highest-Leverage Gaps</h3>
          <ul>${gapItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Tier Recommendation</h3>
          <ul>
            <li><strong>${escapeHtml(tierLabel)}</strong></li>
            <li>${escapeHtml(tierRationale)}</li>
          </ul>
        </article>
        <article class="report-pulse-card">
          <h3>Priorities</h3>
          <ul>${priorityItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Recommended Next Activities</h3>
          <ul>${activityItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Benchmark Match Signal</h3>
          <ul>${benchmarkItems}</ul>
          <div class="report-pulse-note"><strong>Window:</strong> ${escapeHtml(schoolWindowLabel(benchmarkSignals?.windowKey || currentSchoolWindow(new Date())))} · Grade band ${escapeHtml(pulse?.gradeBand || '3-5')}</div>
        </article>
        <article class="report-pulse-card">
          <h3>Assessment Stack (Configured)</h3>
          <div class="report-pulse-note"><strong>Bundle:</strong> ${escapeHtml(sourceSummary.bundleLabel)}</div>
          <ul>${sourceItems}</ul>
          <ul>${sourceAvailabilityItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>MTSS Coherence Scaffold</h3>
          <ul>${coherenceItems}</ul>
          <div class="report-pulse-note"><strong>Current recommendation:</strong> ${escapeHtml(tierLabel)}</div>
        </article>
        <article class="report-pulse-card">
          <h3>Data Quality Guardrails</h3>
          <ul>${cautionItems}</ul>
          <div class="report-pulse-note"><strong>Next data moves:</strong></div>
          <ul>${nextMoveItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Red / Yellow / Green Workflow</h3>
          <div class="report-rag-grid">
            <section class="report-rag-lane report-rag-red">
              <div class="report-rag-title">Red (Immediate support)</div>
              <ul>${redItems}</ul>
            </section>
            <section class="report-rag-lane report-rag-yellow">
              <div class="report-rag-title">Yellow (Guided practice)</div>
              <ul>${yellowItems}</ul>
            </section>
            <section class="report-rag-lane report-rag-green">
              <div class="report-rag-title">Green (Maintain + extend)</div>
              <ul>${greenItems}</ul>
            </section>
          </div>
        </article>
      </div>
    `;
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
    const fileStem = `cornerstone-mtss-report-${slugify(learner?.name || 'learner')}-${buildDateSlug(today)}`;
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
    if (!metricsEl) return [];
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
    return metrics;
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

  function buildRecommendedActivities(gaps, placementRec, weakestRow) {
    const picks = [];
    const seen = new Set();

    function pushPick(activityId, rationale) {
      if (!activityId || seen.has(activityId)) return;
      seen.add(activityId);
      picks.push({
        activity: activityId,
        label: ACTIVITY_LABELS[activityId] || activityId,
        href: getActivityHref(activityId),
        rationale
      });
    }

    gaps.forEach((gap) => {
      const playbook = DOMAIN_ACTIVITY_PLAYBOOK[gap.domain] || DOMAIN_ACTIVITY_PLAYBOOK.general;
      playbook.forEach((step) => {
        pushPick(step.activity, `${gap.label}: ${step.move}`);
      });
    });

    if (placementRec?.focus) {
      pushPick('word-quest', `Placement focus ${placementRec.focus} for targeted decoding reps.`);
    }

    if (weakestRow?.standard) {
      const rec = STANDARD_RECOMMENDATIONS[weakestRow.standard];
      if (rec?.focus?.toLowerCase().includes('plan-it')) pushPick('plan-it', rec.notes || 'Reinforce planning and reflection routines.');
      if (rec?.focus?.toLowerCase().includes('write')) pushPick('writing', rec.notes || 'Reinforce writing structure with explicit models.');
      if (rec?.focus?.toLowerCase().includes('fluency')) pushPick('fluency', rec.notes || 'Reinforce rate, accuracy, and expression.');
      if (rec?.focus?.toLowerCase().includes('read')) pushPick('comprehension', rec.notes || 'Reinforce text-evidence responses.');
      if (rec?.focus?.toLowerCase().includes('word')) pushPick('word-quest', rec.notes || 'Reinforce phonics and decoding patterns.');
    }

    if (!picks.length) {
      const fallback = DOMAIN_ACTIVITY_PLAYBOOK.general;
      fallback.forEach((step) => pushPick(step.activity, step.move));
    }

    return picks.slice(0, 3);
  }

  function buildPulseModel(logs, placementRec, weakestRow, options = {}) {
    const gradeBand = normalizeGradeBand(options.gradeBand || '3-5');
    const activityStats = getActivityStats(logs);
    const domainStats = getDomainStats(logs)
      .filter((row) => row.evidence > 0 && row.avg !== null)
      .sort((a, b) => b.avg - a.avg);
    const engine = buildLiteracyEngineModel(logs, activityStats, domainStats, gradeBand);

    const strengths = domainStats
      .filter((row) => row.evidence >= 2 && row.avg >= 0.74)
      .slice(0, 3);

    const gaps = [...domainStats]
      .filter((row) => row.evidence >= 2 && row.avg < 0.7)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 3);

    const fallbackStrengths = strengths.length ? strengths : domainStats.slice(0, 3);
    const fallbackGaps = gaps.length ? gaps : [...domainStats].sort((a, b) => a.avg - b.avg).slice(0, 3);

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
    const recommendedActivities = buildRecommendedActivities(fallbackGaps, placementRec, weakestRow);

    const traffic = {
      red: [],
      yellow: [],
      green: []
    };
    domainStats.forEach((row) => {
      const label = `${row.label} (${formatPercent(row.avg)})`;
      if (row.avg < 0.6) {
        traffic.red.push(label);
      } else if (row.avg < 0.8) {
        traffic.yellow.push(label);
      } else {
        traffic.green.push(label);
      }
    });

    const interventionSnapshot = activityStats
      .filter((row) => row.avg !== null)
      .sort((a, b) => (a.avg - b.avg))
      .slice(0, 5);

    return {
      gradeBand,
      engine,
      strengths: fallbackStrengths,
      gaps: fallbackGaps,
      priorities: priorities.slice(0, 3),
      supports,
      topPriority,
      domainPriority,
      domainStats,
      activityStats,
      recommendedActivities,
      traffic,
      interventionSnapshot
    };
  }

  function renderPulse(pulse) {
    if (!pulseEl) return;

    const engine = pulse.engine || null;
    const evidence = engine?.evidence || {};
    const tierRecommendation = engine?.tierRecommendation || {};
    const benchmarkSignals = engine?.benchmarkSignals || {};

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

    const activityItems = pulse.recommendedActivities.length
      ? pulse.recommendedActivities.map((item) => `
        <li>
          <a class="report-pulse-link" href="${item.href}">${escapeHtml(item.label)}</a>
          <div class="report-pulse-subnote">${escapeHtml(item.rationale)}</div>
        </li>
      `).join('')
      : '<li>Build 3-5 scored sessions first, then refresh for activity recommendations.</li>';

    const redItems = pulse.traffic.red.length ? pulse.traffic.red.map((item) => `<li>${escapeHtml(item)}</li>`).join('') : '<li>No domains in urgent status.</li>';
    const yellowItems = pulse.traffic.yellow.length ? pulse.traffic.yellow.map((item) => `<li>${escapeHtml(item)}</li>`).join('') : '<li>No domains in monitor status.</li>';
    const greenItems = pulse.traffic.green.length ? pulse.traffic.green.map((item) => `<li>${escapeHtml(item)}</li>`).join('') : '<li>No domains in maintain status yet.</li>';

    const snapshotItems = pulse.interventionSnapshot.length
      ? pulse.interventionSnapshot.map((row) => `<li>${escapeHtml(row.label)} · ${formatPercent(row.avg)} (${row.evidence} samples)</li>`).join('')
      : '<li>No scored activity snapshot yet.</li>';

    const benchmarkItems = benchmarkSignals.statuses?.length
      ? benchmarkSignals.statuses
        .slice(0, 4)
        .map((row) => `<li>${escapeHtml(row.label)}: ${formatPercent(row.current)} vs ${formatPercent(row.target)} <span class="report-bench-chip ${row.status.cls}">${escapeHtml(row.status.label)}</span></li>`)
        .join('')
      : '<li>Benchmark matching appears after scored domain evidence is available.</li>';

    const cautionItems = evidence.cautions?.length
      ? evidence.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>No major data quality cautions right now.</li>';

    const nextMoveItems = evidence.nextMoves?.length
      ? evidence.nextMoves.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>Continue current intervention cycle and re-check progress next week.</li>';

    const guardrailItems = engine?.equityGuardrails?.length
      ? engine.equityGuardrails.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>Maintain accessible, scaffolded, high-expectation instruction.</li>';

    const confidenceClass = evidence.confidenceClass || 'bench-none';
    const readinessClass = evidence.readinessClass || 'bench-none';
    const confidenceLabel = evidence.confidenceLabel || 'No confidence signal yet';
    const readinessLabel = evidence.readiness || 'Collect baseline evidence';
    const tierLabel = tierRecommendation.tierLabel || 'Tier recommendation pending';
    const tierRationale = tierRecommendation.rationale || 'Need more evidence to support tier recommendation.';
    const cadenceLine = tierRecommendation.cadence || 'Run consistent sessions and review weekly.';
    const decisionRuleLine = tierRecommendation.decisionRule || 'Use weekly trend review to adjust supports.';
    const recencyText = evidence.recencyDays === null ? 'No recent session' : `${evidence.recencyDays} day(s) since last logged session`;

    pulseEl.innerHTML = `
      <div class="report-pulse-grid">
        <article class="report-pulse-card">
          <h3>Intervention Engine Status</h3>
          <ul>
            <li><strong>Confidence:</strong> ${escapeHtml(confidenceLabel)} (${formatPercent(evidence.confidenceScore || 0)}) <span class="report-bench-chip ${confidenceClass}">${escapeHtml(confidenceLabel)}</span></li>
            <li><strong>Readiness:</strong> ${escapeHtml(readinessLabel)} <span class="report-bench-chip ${readinessClass}">${escapeHtml(readinessLabel)}</span></li>
            <li><strong>Coverage:</strong> ${escapeHtml(String(evidence.totalSessions || 0))} sessions · ${escapeHtml(String(evidence.scoredSessions || 0))} scored · ${escapeHtml(String(evidence.domainCoverage || 0))} domains · ${escapeHtml(String(evidence.activityCoverage || 0))} activities</li>
            <li><strong>Recency:</strong> ${escapeHtml(recencyText)}</li>
          </ul>
          <div class="report-pulse-note">${escapeHtml(cadenceLine)}</div>
        </article>
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
        <article class="report-pulse-card">
          <h3>Tier Recommendation</h3>
          <ul>
            <li><strong>${escapeHtml(tierLabel)}</strong></li>
            <li>${escapeHtml(tierRationale)}</li>
            <li>${escapeHtml(decisionRuleLine)}</li>
          </ul>
        </article>
        <article class="report-pulse-card">
          <h3>Recommended Next Activities</h3>
          <ul>${activityItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Unified Intervention Snapshot</h3>
          <ul>${snapshotItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Benchmark Match Signal</h3>
          <ul>${benchmarkItems}</ul>
          <div class="report-pulse-note"><strong>Window:</strong> ${escapeHtml(schoolWindowLabel(benchmarkSignals.windowKey || currentSchoolWindow(new Date())))} · Grade band ${escapeHtml(pulse.gradeBand || '3-5')}</div>
        </article>
        <article class="report-pulse-card">
          <h3>Data Quality Guardrails</h3>
          <ul>${cautionItems}</ul>
          <div class="report-pulse-note"><strong>Next data moves:</strong></div>
          <ul>${nextMoveItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Equity Safeguards (SPED / EAL)</h3>
          <ul>${guardrailItems}</ul>
        </article>
        <article class="report-pulse-card">
          <h3>Red / Yellow / Green Workflow</h3>
          <div class="report-rag-grid">
            <section class="report-rag-lane report-rag-red">
              <div class="report-rag-title">Red (Immediate support)</div>
              <ul>${redItems}</ul>
            </section>
            <section class="report-rag-lane report-rag-yellow">
              <div class="report-rag-title">Yellow (Guided practice)</div>
              <ul>${yellowItems}</ul>
            </section>
            <section class="report-rag-lane report-rag-green">
              <div class="report-rag-title">Green (Maintain + extend)</div>
              <ul>${greenItems}</ul>
            </section>
          </div>
        </article>
      </div>
    `;
  }

  function buildOutcomeProofModel(logs, pulse, placementRec, weakestRow) {
    const scored = logs
      .map((entry) => ({
        score: scoreEntry(entry),
        ts: Number(entry?.ts || 0)
      }))
      .filter((row) => typeof row.score === 'number' && !Number.isNaN(row.score))
      .sort((a, b) => a.ts - b.ts);

    const recent = scored.slice(-8);
    const prior = scored.slice(Math.max(0, scored.length - 16), Math.max(0, scored.length - 8));
    const recentAvg = average(recent.map((row) => row.score));
    const priorAvg = average(prior.map((row) => row.score));
    const momentumDelta = recentAvg !== null && priorAvg !== null
      ? recentAvg - priorAvg
      : null;

    const activities = new Set(
      logs
        .map((entry) => String(entry?.activity || ''))
        .filter((activity) => !!ACTIVITY_LABELS[activity])
    );
    const domains = new Set(
      Array.from(activities).map((activity) => activityDomain(activity))
    );

    const evidenceCount = logs.length;
    const readiness = evidenceCount >= 12
      ? 'High'
      : evidenceCount >= 6
        ? 'Building'
        : 'Early';

    const redCount = pulse?.traffic?.red?.length || 0;
    const yellowCount = pulse?.traffic?.yellow?.length || 0;
    const greenCount = pulse?.traffic?.green?.length || 0;
    const engineConfidence = pulse?.engine?.evidence?.confidenceLabel || 'Early signal';
    const engineReadiness = pulse?.engine?.evidence?.readiness || 'Need more evidence';
    const engineTier = pulse?.engine?.tierRecommendation?.tierLabel || 'Tier recommendation pending';

    const focusId = recommendBuilderFocus(placementRec, weakestRow, getDomainStats(logs));
    const focusProfile = FOCUS_LIBRARY[focusId] || FOCUS_LIBRARY['comprehension-evidence'];

    const implementationLine = evidenceCount
      ? `${evidenceCount} logged sessions across ${activities.size || 1} activities and ${domains.size || 1} domains.`
      : 'No logged sessions yet. Start with a 10-minute cycle and refresh this report.';

    const momentumLine = momentumDelta === null
      ? 'Need at least 16 scored events for trend-to-trend momentum.'
      : `${momentumDelta >= 0 ? '+' : ''}${Math.round(momentumDelta * 100)} points vs prior window (${formatPercent(priorAvg)} -> ${formatPercent(recentAvg)}).`;

    const tierLine = `R/Y/G spread: ${redCount} red · ${yellowCount} yellow · ${greenCount} green.`;
    const alignmentLine = `${focusProfile.label} is currently the strongest team-fit focus (${focusProfile.specialistFit}).`;
    const engineLine = `Engine status: ${engineConfidence} · ${engineReadiness} · ${engineTier}.`;

    const narrative = [
      `Teacher action: ${pulse?.topPriority || 'Build a 4-week intervention loop from the top gap.'}`,
      `Learner response: ${momentumLine}`,
      `System value: ${tierLine} ${alignmentLine}`,
      engineLine
    ];

    return {
      readiness,
      implementationLine,
      momentumLine,
      tierLine,
      alignmentLine,
      engineLine,
      narrative
    };
  }

  function renderOutcomeProof(logs, pulse, placementRec, weakestRow) {
    if (!outcomesEl) return;
    const model = buildOutcomeProofModel(logs, pulse, placementRec, weakestRow);
    const narrativeItems = model.narrative.map((line) => `<li>${escapeHtml(line)}</li>`).join('');

    outcomesEl.innerHTML = `
      <div class="report-outcome-grid">
        <article class="report-outcome-card">
          <h3>Implementation Strength</h3>
          <div class="report-outcome-value">${escapeHtml(model.readiness)}</div>
          <div class="report-outcome-note">${escapeHtml(model.implementationLine)}</div>
        </article>
        <article class="report-outcome-card">
          <h3>Momentum Signal</h3>
          <div class="report-outcome-value">${escapeHtml(model.momentumLine.split('. ')[0] || model.momentumLine)}</div>
          <div class="report-outcome-note">${escapeHtml(model.momentumLine)}</div>
        </article>
        <article class="report-outcome-card">
          <h3>Tiered Support Readiness</h3>
          <div class="report-outcome-value">${escapeHtml(model.tierLine)}</div>
          <div class="report-outcome-note">${escapeHtml(model.alignmentLine)}</div>
        </article>
      </div>
      <div class="report-outcome-proof">
        <h3>Leadership Narrative (ready to share)</h3>
        <ul>${narrativeItems}</ul>
      </div>
    `;
  }

  function getPriorityDomainsForAlignment(pulse) {
    const rankedGaps = (pulse?.gaps || [])
      .map((row) => row.domain)
      .filter((domainId) => !!FRAMEWORK_ALIGNMENT[domainId]);
    const defaults = ['decoding', 'comprehension', 'fluency', 'written-language'];
    return Array.from(new Set([...rankedGaps, ...defaults])).slice(0, 4);
  }

  function renderFrameworkCrosswalk(pulse) {
    if (!crosswalkEl) return;
    const domains = getPriorityDomainsForAlignment(pulse);
    if (!domains.length) {
      crosswalkEl.innerHTML = '<div class="muted">Not enough data yet. Complete scored sessions to generate framework mapping.</div>';
      return;
    }

    const cards = domains.map((domainId) => {
      const rows = FRAMEWORK_ALIGNMENT[domainId] || [];
      const current = pulse?.domainStats?.find((row) => row.domain === domainId);
      const currentText = current?.avg !== null && current?.avg !== undefined
        ? `${formatPercent(current.avg)} (${current.evidence || 0} samples)`
        : 'Need more scored samples';
      const list = rows.map((entry) => `<li><strong>${escapeHtml(entry.framework)}:</strong> ${escapeHtml(entry.alignment)}</li>`).join('');
      return `
        <article class="report-crosswalk-card">
          <h3>${escapeHtml(domainLabel(domainId))}</h3>
          <div class="report-crosswalk-score"><strong>Current evidence:</strong> ${escapeHtml(currentText)}</div>
          <ul>${list}</ul>
        </article>
      `;
    }).join('');

    crosswalkEl.innerHTML = `
      <div class="report-crosswalk-grid">${cards}</div>
      <div class="report-crosswalk-note">Crosswalk is a planning support view that translates learner data into framework-aligned instructional moves.</div>
    `;
  }

  function renderBenchmarks(learner, pulse) {
    if (!benchmarksEl) return;
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const benchmarkMap = BENCHMARK_EXPECTATIONS[gradeBand] || BENCHMARK_EXPECTATIONS['3-5'];
    const windowKey = currentSchoolWindow(new Date());
    const rows = Object.keys(benchmarkMap).map((domainId) => {
      const expected = benchmarkMap[domainId];
      const current = pulse?.domainStats?.find((row) => row.domain === domainId)?.avg ?? null;
      const status = benchmarkStatus(current, expected[windowKey]);
      return `
        <tr>
          <td><strong>${escapeHtml(domainLabel(domainId))}</strong></td>
          <td>${formatPercent(current)}</td>
          <td>${formatPercent(expected.boy)}</td>
          <td>${formatPercent(expected.moy)}</td>
          <td>${formatPercent(expected.eoy)}</td>
          <td><span class="report-bench-chip ${status.cls}">${escapeHtml(status.label)}</span></td>
        </tr>
      `;
    }).join('');

    benchmarksEl.innerHTML = `
      <div class="report-bench-meta">
        <div><strong>Grade band benchmark set:</strong> ${escapeHtml(gradeBand)}</div>
        <div><strong>Current checkpoint:</strong> ${escapeHtml(schoolWindowLabel(windowKey))}</div>
      </div>
      <div class="report-bench-table-wrap">
        <table class="report-bench-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Current</th>
              <th>BOY</th>
              <th>MOY</th>
              <th>EOY</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="report-bench-note">Benchmarks are planning norms on the platform mastery scale and should be calibrated with your school or network expectations.</div>
    `;
  }

  function resolveGoalDomain(pulse) {
    const selected = String(goalDomainEl?.value || 'auto');
    if (selected !== 'auto') return selected;
    if (pulse?.gaps?.[0]?.domain) return pulse.gaps[0].domain;
    const ranked = (pulse?.domainStats || [])
      .filter((row) => row.avg !== null && row.avg !== undefined)
      .sort((a, b) => a.avg - b.avg);
    return ranked[0]?.domain || 'decoding';
  }

  function computeGoalTarget({ baseline, benchmark, tier, horizon }) {
    const tierNearGain = tier === '1' ? 0.08 : tier === '2' ? 0.12 : 0.16;
    const tierLongGain = tier === '1' ? 0.14 : tier === '2' ? 0.2 : 0.24;
    const expected = benchmark || null;
    let target = expected;
    if (baseline !== null && baseline !== undefined && !Number.isNaN(baseline)) {
      const gain = horizon === 'near' ? tierNearGain : tierLongGain;
      target = target === null || target === undefined ? baseline + gain : Math.max(target, baseline + gain);
    }
    if (target === null || target === undefined || Number.isNaN(target)) return null;
    return clamp(target, 0.1, 0.98);
  }

  function tierPlanText(tier) {
    if (tier === '1') {
      return 'Tier 1: 4x/week targeted differentiation inside core literacy block, 10-15 minutes each cycle.';
    }
    if (tier === '3') {
      return 'Tier 3: Daily intensive individualized support, 25-35 minutes, with explicit modeling and immediate corrective feedback.';
    }
    return 'Tier 2: 4-5x/week small-group intervention, 15-25 minutes, tightly matched to the top gap.';
  }

  function progressRuleText(tier) {
    if (tier === '1') {
      return 'Decision rule: if growth is <5 points after 4 weeks, move to Tier 2 targeted support.';
    }
    if (tier === '3') {
      return 'Decision rule: if growth is <8 points after 4 weeks, redesign plan and increase specialist intensity.';
    }
    return 'Decision rule: if growth is <7 points after 4 weeks, increase session frequency or move to Tier 3.';
  }

  function renderGoalDraft(context = {}) {
    if (!goalOutputEl) return;
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const domainId = resolveGoalDomain(pulse);
    const domainName = domainLabel(domainId);
    const tier = String(goalTierEl?.value || '2');
    const focusHorizon = String(goalHorizonEl?.value || 'near');
    const benchmarkSet = BENCHMARK_EXPECTATIONS[gradeBand]?.[domainId] || null;
    const windowKey = currentSchoolWindow(new Date());
    const baseline = pulse?.domainStats?.find((row) => row.domain === domainId)?.avg ?? null;
    const nearBenchmark = benchmarkSet
      ? (windowKey === 'boy' ? benchmarkSet.moy : benchmarkSet.eoy)
      : null;
    const longBenchmark = benchmarkSet?.eoy ?? null;
    const nearTarget = computeGoalTarget({ baseline, benchmark: nearBenchmark, tier, horizon: 'near' });
    const longTarget = computeGoalTarget({ baseline, benchmark: longBenchmark, tier, horizon: 'long' });
    const baselineText = baseline !== null && baseline !== undefined && !Number.isNaN(baseline)
      ? formatPercent(baseline)
      : 'Collect 3-5 scored sessions for baseline';
    const nearTargetText = nearTarget !== null ? formatPercent(nearTarget) : 'Set after baseline';
    const longTargetText = longTarget !== null ? formatPercent(longTarget) : 'Set after baseline';
    const learnerName = learner?.name || 'Learner';
    const frameworks = (FRAMEWORK_ALIGNMENT[domainId] || [])
      .slice(0, 4)
      .map((item) => item.framework)
      .join(' · ');
    const recommendedActivities = (pulse?.recommendedActivities || [])
      .map((item) => item.label)
      .slice(0, 3)
      .join(', ') || 'Word Quest, Read & Think, Writing Studio';

    const nearGoal = `Near-term goal (4-6 weeks): ${learnerName} will improve ${domainName.toLowerCase()} from ${baselineText} to ${nearTargetText} on platform mastery indicators, using ${tier === '1' ? 'core differentiation' : tier === '2' ? 'targeted small-group intervention' : 'intensive individualized intervention'}.`;
    const longGoal = `Long-term goal (12-16 weeks): ${learnerName} will sustain ${longTargetText} or higher in ${domainName.toLowerCase()} with transfer across at least two activity types and consistent progress-monitoring evidence.`;
    const benchmarkLine = benchmarkSet
      ? `Benchmark anchors for ${gradeBand}: BOY ${formatPercent(benchmarkSet.boy)} · MOY ${formatPercent(benchmarkSet.moy)} · EOY ${formatPercent(benchmarkSet.eoy)}.`
      : `Benchmark anchors for ${gradeBand} not configured yet.`;
    const equityLine = 'Equity guardrail: keep cognitive demand high while adjusting scaffolds (language supports, chunking, accessibility settings, and explicit modeling).';
    const monitoringLine = `Progress monitoring: check twice weekly using scored tasks in ${recommendedActivities}.`;
    const tierLine = tierPlanText(tier);
    const decisionLine = progressRuleText(tier);

    latestGoalText = [
      `${learnerName} Tiered Goal Draft (${domainName})`,
      `Grade band: ${gradeBand} | Tier ${tier}`,
      nearGoal,
      longGoal,
      tierLine,
      monitoringLine,
      benchmarkLine,
      decisionLine,
      equityLine,
      `Framework alignment: ${frameworks}`
    ].join('\n');

    goalOutputEl.innerHTML = `
      <div class="report-goal-card">
        <h3>${escapeHtml(domainName)} · Tier ${escapeHtml(tier)}</h3>
        <p>${escapeHtml(nearGoal)}</p>
        <p>${escapeHtml(longGoal)}</p>
        <ul>
          <li>${escapeHtml(tierLine)}</li>
          <li>${escapeHtml(monitoringLine)}</li>
          <li>${escapeHtml(benchmarkLine)}</li>
          <li>${escapeHtml(decisionLine)}</li>
          <li>${escapeHtml(equityLine)}</li>
          <li><strong>Framework alignment:</strong> ${escapeHtml(frameworks)}</li>
        </ul>
        <div class="report-goal-note">Current focus horizon: ${focusHorizon === 'near' ? 'Near term (4-6 weeks)' : 'Long term (12-16 weeks)'}.</div>
      </div>
    `;
    if (goalStatusEl) goalStatusEl.textContent = '';
  }

  async function copyGoalDraft() {
    if (!latestGoalText) {
      if (goalStatusEl) goalStatusEl.textContent = 'Generate a goal draft first, then copy.';
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestGoalText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      if (goalStatusEl) goalStatusEl.textContent = 'Goal draft copied.';
    } catch {
      if (goalStatusEl) goalStatusEl.textContent = 'Clipboard unavailable. Copy directly from the goal card.';
    }
  }

  function resolveProtocolDomain(pulse) {
    const selected = String(protocolDomainEl?.value || 'auto');
    if (selected !== 'auto') return selected;
    return resolveGoalDomain(pulse);
  }

  function resolveProtocolTier(pulse) {
    const selected = String(protocolTierEl?.value || 'auto');
    if (selected !== 'auto') return selected;
    const engineTier = String(pulse?.engine?.tierRecommendation?.tier || '');
    if (engineTier === '1' || engineTier === '2' || engineTier === '3') return engineTier;
    return String(goalTierEl?.value || '2');
  }

  function resolveProtocolRole(pulse) {
    const selected = String(protocolRoleEl?.value || 'auto');
    if (selected !== 'auto') {
      const normalized = normalizeRoleId(selected);
      if (ROLE_PATHWAY_LIBRARY[normalized]) return normalized;
    }
    return normalizeRoleId(recommendRolePathwayId(pulse));
  }

  function resolveProtocolCycleWeeks() {
    const cycle = Number(protocolCycleEl?.value || 4);
    if (cycle === 6 || cycle === 8) return cycle;
    return 4;
  }

  function buildWeeklyTrajectory(baseline, nearTarget, cycleWeeks) {
    if (baseline === null || baseline === undefined || Number.isNaN(baseline)) return [];
    if (nearTarget === null || nearTarget === undefined || Number.isNaN(nearTarget)) return [];
    const weeks = Math.max(1, Number(cycleWeeks || 4));
    const gainPerWeek = (nearTarget - baseline) / weeks;
    const trajectory = [];
    for (let week = 1; week <= weeks; week += 1) {
      trajectory.push({
        week,
        expected: clamp(baseline + (gainPerWeek * week), 0.05, 0.99)
      });
    }
    return trajectory;
  }

  function stageMinutesByTier(tier) {
    if (tier === '1') return ['4-5', '3-4', '3-5'];
    if (tier === '3') return ['10-12', '8-10', '7-9'];
    return ['6-8', '5-7', '4-6'];
  }

  function buildProtocolActivityPlan(domainId, pulse, tier, pathway = null) {
    const defaults = DOMAIN_ACTIVITY_PLAYBOOK[domainId] || DOMAIN_ACTIVITY_PLAYBOOK.general;
    const picks = [];
    const seen = new Set();
    const stageLabels = ['Explicit teach', 'Guided practice', 'Transfer & reflect'];
    const minuteSlots = stageMinutesByTier(tier);

    function addPick(activityId, rationale, options = {}) {
      if (!activityId || seen.has(activityId)) return;
      seen.add(activityId);
      picks.push({
        activity: activityId,
        label: options.label || ACTIVITY_LABELS[activityId] || activityId,
        rationale,
        stage: options.stage || null,
        minutes: options.minutes || null
      });
    }

    if (pathway?.steps?.length) {
      pathway.steps.forEach((step, index) => {
        addPick(step.activity, step.move || '', {
          label: step.label || ACTIVITY_LABELS[step.activity] || step.activity,
          stage: stageLabels[index] || `Stage ${index + 1}`,
          minutes: step.minutes || minuteSlots[index]
        });
      });
    }

    (pulse?.recommendedActivities || []).forEach((item) => {
      addPick(item.activity, item.rationale || '', {
        label: item.label || ACTIVITY_LABELS[item.activity] || item.activity
      });
    });
    defaults.forEach((step) => {
      addPick(step.activity, step.move || '', {
        label: ACTIVITY_LABELS[step.activity] || step.activity
      });
    });

    return picks.slice(0, 3).map((item, index) => ({
      ...item,
      stage: item.stage || stageLabels[index] || `Stage ${index + 1}`,
      minutes: item.minutes || minuteSlots[index] || '4-6'
    }));
  }

  function renderInterventionProtocol(context = {}) {
    if (!protocolOutputEl) return;
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const domainId = resolveProtocolDomain(pulse);
    const domainName = domainLabel(domainId);
    const tier = resolveProtocolTier(pulse);
    const roleId = resolveProtocolRole(pulse);
    const pathway = ROLE_PATHWAY_LIBRARY[roleId] || ROLE_PATHWAY_LIBRARY['learning-support'];
    const roleGuidance = ROLE_PROTOCOL_GUIDANCE[roleId] || ROLE_PROTOCOL_GUIDANCE['learning-support'];
    const cycleWeeks = resolveProtocolCycleWeeks();
    const benchmarkSet = BENCHMARK_EXPECTATIONS[gradeBand]?.[domainId] || null;
    const windowKey = currentSchoolWindow(new Date());
    const baseline = pulse?.domainStats?.find((row) => row.domain === domainId)?.avg ?? null;
    const nearBenchmark = benchmarkSet
      ? (windowKey === 'boy' ? benchmarkSet.moy : benchmarkSet.eoy)
      : null;
    const nearTarget = computeGoalTarget({ baseline, benchmark: nearBenchmark, tier, horizon: 'near' });
    const trajectory = buildWeeklyTrajectory(baseline, nearTarget, cycleWeeks);
    const cadenceLine = tierPlanText(tier);
    const decisionLine = progressRuleText(tier);
    const learnerName = learner?.name || 'Learner';
    const frameworks = (FRAMEWORK_ALIGNMENT[domainId] || [])
      .slice(0, 4)
      .map((row) => row.framework);
    const frameworkLine = frameworks.length ? frameworks.join(' · ') : 'Science of Reading · Structured Literacy';
    const supportProfile = pulse?.supports?.length ? pulse.supports.join(' · ') : 'Large text · Line focus · Reduced stimulation';
    const activityPlan = buildProtocolActivityPlan(domainId, pulse, tier, pathway);
    const activityPlanHtml = activityPlan.length
      ? activityPlan.map((item) => `<li><strong>${escapeHtml(item.stage)} (${escapeHtml(item.minutes)} min):</strong> ${escapeHtml(item.label)} · ${escapeHtml(item.rationale || 'Run targeted reps with immediate feedback.')}</li>`).join('')
      : '<li>Run targeted reps in Word Quest, then transfer into comprehension and writing.</li>';
    const activityPlanText = activityPlan.length
      ? activityPlan.map((item) => `${item.stage} (${item.minutes} min): ${item.label} - ${item.rationale || 'Run targeted reps with immediate feedback.'}`)
      : ['Explicit teach (6-8 min): Word Quest - Target the focus pattern with immediate correction.'];
    const trajectoryHtml = trajectory.length
      ? trajectory.map((row) => `<li>Week ${row.week}: expected checkpoint ${formatPercent(row.expected)}</li>`).join('')
      : '<li>Set baseline with 3-5 scored sessions, then regenerate protocol.</li>';
    const trajectoryText = trajectory.length
      ? trajectory.map((row) => `Week ${row.week} checkpoint: ${formatPercent(row.expected)}`)
      : ['Need baseline evidence for weekly checkpoint trajectory.'];
    const tierLabel = pulse?.engine?.tierRecommendation?.tierLabel || `Tier ${tier}`;
    const confidenceLine = pulse?.engine?.evidence?.confidenceLabel
      ? `${pulse.engine.evidence.confidenceLabel} (${formatPercent(pulse.engine.evidence.confidenceScore || 0)})`
      : 'Early signal';
    const roleLabel = pathway?.label || 'Learning Support / SPED';
    const roleFit = pathway?.fit || 'MTSS · Intervention';
    const roleGoal = pathway?.goal || 'Run a focused intervention cycle and document growth.';
    const roleTopPriority = pulse?.topPriority || 'Run 3-5 scored sessions this week to strengthen the signal.';
    const urgentLane = pulse?.traffic?.red?.[0] || 'No urgent lane currently flagged.';
    const baselineText = baseline !== null && baseline !== undefined && !Number.isNaN(baseline)
      ? formatPercent(baseline)
      : 'Need baseline';
    const nearTargetText = nearTarget !== null && nearTarget !== undefined && !Number.isNaN(nearTarget)
      ? formatPercent(nearTarget)
      : 'Set after baseline';
    const protocolDecisionRules = [
      'Rule 1: If two consecutive probes are >5 points below the weekly checkpoint, increase scaffold intensity and add one extra session per week.',
      'Rule 2: If three probes meet or exceed checkpoints, shift one weekly session to transfer tasks (comprehension/writing) while maintaining decoding accuracy.',
      decisionLine
    ];
    const equityRules = pulse?.engine?.equityGuardrails?.length
      ? pulse.engine.equityGuardrails
      : ['Preserve rigor while adjusting language supports, chunking, and response mode.'];

    latestProtocolText = [
      `${learnerName} Intervention Protocol Packet`,
      `Domain: ${domainName}`,
      `Grade band: ${gradeBand}`,
      `Role lens: ${roleLabel} (${roleFit})`,
      `Role goal: ${roleGoal}`,
      `Cycle length: ${cycleWeeks} weeks`,
      `Tier: ${tierLabel}`,
      `Engine confidence: ${confidenceLine}`,
      `Baseline: ${baselineText}`,
      `Cycle target: ${nearTargetText}`,
      '',
      `Cadence: ${cadenceLine}`,
      `Progress monitoring: 2 probes/week + 1 transfer check/week in ${domainName.toLowerCase()}.`,
      '',
      'Daily session structure:',
      ...activityPlanText.map((line) => `- ${line}`),
      '',
      'Weekly trajectory checkpoints:',
      ...trajectoryText.map((line) => `- ${line}`),
      '',
      'Decision rules:',
      ...protocolDecisionRules.map((line) => `- ${line}`),
      '',
      'Role implementation focus:',
      `- Current priority: ${roleTopPriority}`,
      `- Urgent lane: ${urgentLane}`,
      `- Progress lens: ${roleGuidance.progressLens}`,
      `- Team handoff: ${roleGuidance.handoff}`,
      `- Family bridge: ${roleGuidance.familyBridge}`,
      '',
      `Framework alignment: ${frameworkLine}`,
      `Support profile: ${supportProfile}`,
      'Equity guardrails:',
      ...equityRules.map((line) => `- ${line}`)
    ].join('\n');

    protocolOutputEl.innerHTML = `
      <div class="report-protocol-grid">
        <article class="report-protocol-card">
          <h3>${escapeHtml(domainName)} · ${escapeHtml(tierLabel)}</h3>
          <ul>
            <li><strong>Cycle:</strong> ${escapeHtml(String(cycleWeeks))} weeks</li>
            <li><strong>Baseline:</strong> ${escapeHtml(baselineText)}</li>
            <li><strong>Target by cycle end:</strong> ${escapeHtml(nearTargetText)}</li>
            <li><strong>Engine confidence:</strong> ${escapeHtml(confidenceLine)}</li>
          </ul>
          <div class="report-protocol-note">${escapeHtml(cadenceLine)}</div>
        </article>
        <article class="report-protocol-card">
          <h3>Role lens: ${escapeHtml(roleLabel)}</h3>
          <ul>
            <li><strong>Team fit:</strong> ${escapeHtml(roleFit)}</li>
            <li><strong>Role goal:</strong> ${escapeHtml(roleGoal)}</li>
            <li><strong>Current priority:</strong> ${escapeHtml(roleTopPriority)}</li>
            <li><strong>Urgent lane:</strong> ${escapeHtml(urgentLane)}</li>
          </ul>
          <div class="report-protocol-note"><strong>Progress lens:</strong> ${escapeHtml(roleGuidance.progressLens)}</div>
          <div class="report-protocol-note"><strong>Team handoff:</strong> ${escapeHtml(roleGuidance.handoff)}</div>
          <div class="report-protocol-note"><strong>Family bridge:</strong> ${escapeHtml(roleGuidance.familyBridge)}</div>
        </article>
        <article class="report-protocol-card">
          <h3>Weekly checkpoint trajectory</h3>
          <ul>${trajectoryHtml}</ul>
          <div class="report-protocol-note">Collect at least 2 scored probes each week in the target domain.</div>
        </article>
        <article class="report-protocol-card">
          <h3>Daily intervention loop</h3>
          <ul>${activityPlanHtml}</ul>
        </article>
        <article class="report-protocol-card">
          <h3>Decision rules + safeguards</h3>
          <ul>${protocolDecisionRules.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
          <div class="report-protocol-note"><strong>Framework alignment:</strong> ${escapeHtml(frameworkLine)}</div>
          <div class="report-protocol-note"><strong>Support profile:</strong> ${escapeHtml(supportProfile)}</div>
          <ul>${equityRules.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
        </article>
      </div>
    `;
    if (protocolStatusEl) protocolStatusEl.textContent = '';
  }

  async function copyInterventionProtocol() {
    if (!latestProtocolText) {
      if (protocolStatusEl) protocolStatusEl.textContent = 'Generate the protocol first, then copy.';
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestProtocolText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      if (protocolStatusEl) protocolStatusEl.textContent = 'Protocol copied.';
    } catch {
      if (protocolStatusEl) protocolStatusEl.textContent = 'Clipboard unavailable. Copy directly from the protocol card.';
    }
  }

  function numeracyGradeRange(gradeBand) {
    if (gradeBand === 'K-2') return { min: 0, max: 2 };
    if (gradeBand === '3-5') return { min: 3, max: 5 };
    if (gradeBand === '6-8') return { min: 6, max: 8 };
    return { min: 9, max: 12 };
  }

  function sourceAvailability(maxGrade, range) {
    if (range.max <= maxGrade) {
      return { available: true, partial: false, label: 'Available' };
    }
    if (range.min > maxGrade) {
      return { available: false, partial: false, label: 'Not routine' };
    }
    return { available: true, partial: true, label: 'Partial by grade' };
  }

  function resolveNumeracyAssessmentBundle() {
    const selected = String(numeracyAssessmentEl?.value || 'auto');
    return NUMERACY_ASSESSMENT_BUNDLES[selected] ? selected : 'auto';
  }

  function summarizeNumeracySources(gradeBand, bundleId) {
    const range = numeracyGradeRange(gradeBand);
    const bundle = NUMERACY_ASSESSMENT_BUNDLES[bundleId] || NUMERACY_ASSESSMENT_BUNDLES.auto;
    const aimswebAvailability = sourceAvailability(NUMERACY_SCREENER_POLICY.aimswebMaxGrade, range);
    const mapAvailability = sourceAvailability(NUMERACY_SCREENER_POLICY.mapMaxGrade, range);
    const manualIds = ['bookcase', 'volume-1'];
    if (gradeBand === '3-5') manualIds.push('volume-5');
    if (gradeBand === '6-8' || gradeBand === '9-12') manualIds.push('volume-6');
    const manualReferences = manualIds
      .map((id) => BRIDGES_INTERVENTION_MANUALS[id])
      .filter(Boolean);

    const lines = [];
    if (bundle.includeBridges) {
      lines.push('Bridges intervention checks: use daily strategy snapshots and quick transfer tasks.');
      lines.push('Bridges manual alignment: pre-select routines from manual sets before each intervention cycle.');
    }
    if (bundle.includeIMUnit) {
      lines.push('IM unit assessments: use as anchor checkpoints for conceptual mastery.');
    }
    if (bundle.includeCooldowns) {
      lines.push('IM cooldowns: use 2-3 items for flexible regrouping and reteach planning.');
    }
    if (bundle.includeGlossIkan) {
      lines.push('GLoSS + IKAN: run strategy interviews to identify current reasoning stage.');
    }

    const includeAimsweb = bundle.includeAimsweb === true || (bundle.includeAimsweb === 'auto' && aimswebAvailability.available);
    if (includeAimsweb) {
      const descriptor = aimswebAvailability.partial ? 'Aimsweb (partial range): use where administered in current grades.' : 'Aimsweb: include as external progress-monitoring signal.';
      lines.push(descriptor);
    }

    const includeMap = bundle.includeMap === true || (bundle.includeMap === 'auto' && mapAvailability.available);
    if (includeMap) {
      const descriptor = mapAvailability.partial ? 'MAP (partial range): use where administered in current grades.' : 'MAP: include trend checks for longer-horizon readiness.';
      lines.push(descriptor);
    }

    if (!lines.length) {
      lines.push('Collect Bridges/IM classroom evidence first, then add screeners as available.');
    }

    const availabilitySummary = [
      `Aimsweb status: ${aimswebAvailability.label} (configured through Grade ${NUMERACY_SCREENER_POLICY.aimswebMaxGrade}).`,
      `MAP status: ${mapAvailability.label} (configured through Grade ${NUMERACY_SCREENER_POLICY.mapMaxGrade}).`
    ];

    return {
      bundleLabel: bundle.label,
      lines: lines.slice(0, 6),
      availabilitySummary,
      manualReferences
    };
  }

  function resolveNumeracyStrategyStage(pulse, gradeBand, domainId) {
    const selected = String(numeracyStrategyEl?.value || 'auto');
    if (selected !== 'auto' && NUMERACY_STRATEGY_STAGES[selected]) {
      return selected;
    }

    const topGap = pulse?.gaps?.find((row) => row.domain === domainId) || pulse?.gaps?.[0];
    const avg = topGap?.avg ?? null;

    if (avg !== null && avg < 0.45) return 'counting-all';
    if (avg !== null && avg < 0.55) return 'counting-on';
    if (avg !== null && avg < 0.64) return 'make-ten-friendly';
    if (avg !== null && avg < 0.74) return 'derived-facts';

    if (gradeBand === '9-12') return 'algorithm-with-reasoning';
    if (domainId === 'problem-solving' || domainId === 'math-language') return 'algorithm-with-reasoning';
    return 'derived-facts';
  }

  function numeracyConceptualMoves(stageId) {
    if (stageId === 'counting-all') {
      return [
        'Use number strings with ten-frame and rekenrek visuals to replace one-by-one counting.',
        'Teach count-on from the larger addend, then bridge to make-10.'
      ];
    }
    if (stageId === 'counting-on') {
      return [
        'Use Jo Boaler/Pam Harris style number strings to surface efficient strategies.',
        'Anchor routines to doubles/near doubles and friendly-number jumps.'
      ];
    }
    if (stageId === 'make-ten-friendly') {
      return [
        'Prioritize make-10, compensation, and get-to-friendly-number routines.',
        'Require a quick visual model before symbolic recording.'
      ];
    }
    if (stageId === 'algorithm-with-reasoning') {
      return [
        'Pair algorithm work with represent-explain-justify prompts every session.',
        'Have learners compare at least two strategies and defend efficiency.'
      ];
    }
    return [
      'Use decomposition and derived-fact strategies before defaulting to algorithm-only methods.',
      'Prompt verbal strategy naming before and after solving.'
    ];
  }

  function numeracyTierPlanText(tier) {
    if (tier === '1') {
      return 'Tier 1 numeracy coherence: daily conceptual routines in core class, with Bridges/IM cooldown checks used for flexible grouping.';
    }
    if (tier === '3') {
      return 'Tier 3 numeracy coherence: daily intensive intervention (25-35 min), explicit strategy staging, and weekly specialist/family review.';
    }
    return 'Tier 2 numeracy coherence: 4-5 targeted sessions each week (15-25 min), linked directly to strategy gaps from classroom and screener evidence.';
  }

  function numeracyDecisionRuleText(tier) {
    if (tier === '1') {
      return 'Decision rule: if growth is <5 points after 4 weeks and cooldown/unit evidence confirms the gap, move to Tier 2.';
    }
    if (tier === '3') {
      return 'Decision rule: if growth is <8 points after 4 weeks, redesign strategy stage and increase specialist intensity.';
    }
    return 'Decision rule: if growth is <7 points after 4 weeks across probes and classroom checks, increase frequency or move to Tier 3.';
  }

  function resolveNumeracyDomain(pulse) {
    const selected = String(numeracyDomainEl?.value || 'auto');
    if (selected !== 'auto') return selected;
    if (pulse?.gaps?.[0]?.domain) return pulse.gaps[0].domain;
    const ranked = (pulse?.domainStats || [])
      .filter((row) => row.avg !== null && row.avg !== undefined)
      .sort((a, b) => a.avg - b.avg);
    return ranked[0]?.domain || 'number-sense';
  }

  function resolveNumeracyTier(pulse) {
    const selected = String(numeracyTierEl?.value || 'auto');
    if (selected !== 'auto') return selected;
    const engineTier = String(pulse?.engine?.tierRecommendation?.tier || '');
    if (engineTier === '1' || engineTier === '2' || engineTier === '3') return engineTier;
    return '2';
  }

  function resolveNumeracyCycleWeeks() {
    const cycle = Number(numeracyCycleEl?.value || 4);
    if (cycle === 6 || cycle === 8) return cycle;
    return 4;
  }

  function numeracyStageMinutesByTier(tier) {
    if (tier === '1') return ['4-5', '4-5', '3-4'];
    if (tier === '3') return ['10-12', '8-10', '7-9'];
    return ['6-8', '6-8', '4-6'];
  }

  function buildNumeracyProtocolActivityPlan(domainId, pulse, tier, gradeBand) {
    const defaults = NUMERACY_DOMAIN_ACTIVITY_PLAYBOOK[domainId] || NUMERACY_DOMAIN_ACTIVITY_PLAYBOOK.general;
    const picks = [];
    const seen = new Set();
    const stages = ['Concept teach', 'Guided solve', 'Explain & transfer'];
    const minutes = numeracyStageMinutesByTier(tier);

    function add(activityId, rationale) {
      if (!activityId || seen.has(activityId)) return;
      seen.add(activityId);
      picks.push({
        activity: activityId,
        label: NUMERACY_ACTIVITY_LABELS[activityId] || activityId,
        rationale
      });
    }

    (pulse?.recommendedActivities || []).forEach((item) => add(item.activity, item.rationale || ''));
    defaults.forEach((step) => add(step.activity, step.move || ''));

    return picks.slice(0, 3).map((row, index) => ({
      ...row,
      stage: stages[index] || `Stage ${index + 1}`,
      minutes: minutes[index] || '4-6',
      href: getActivityHref(row.activity, {
        numeracyMode: true,
        builderGradeBand: gradeBand,
        numeracyRounds: 10
      })
    }));
  }

  function renderNumeracyProtocol(context = {}) {
    if (!numeracyOutputEl) return;
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const domainId = resolveNumeracyDomain(pulse);
    const domainName = numeracyDomainLabel(domainId);
    const tier = resolveNumeracyTier(pulse);
    const cycleWeeks = resolveNumeracyCycleWeeks();
    const sourceBundleId = resolveNumeracyAssessmentBundle();
    const sourceSummary = summarizeNumeracySources(gradeBand, sourceBundleId);
    const strategyStageId = resolveNumeracyStrategyStage(pulse, gradeBand, domainId);
    const strategyStage = NUMERACY_STRATEGY_STAGES[strategyStageId] || NUMERACY_STRATEGY_STAGES['derived-facts'];
    const conceptualMoves = numeracyConceptualMoves(strategyStageId);
    const benchmarkSet = NUMERACY_BENCHMARK_EXPECTATIONS[gradeBand]?.[domainId] || null;
    const windowKey = currentSchoolWindow(new Date());
    const baseline = pulse?.domainStats?.find((row) => row.domain === domainId)?.avg ?? null;
    const nearBenchmark = benchmarkSet
      ? (windowKey === 'boy' ? benchmarkSet.moy : benchmarkSet.eoy)
      : null;
    const nearTarget = computeGoalTarget({ baseline, benchmark: nearBenchmark, tier, horizon: 'near' });
    const trajectory = buildWeeklyTrajectory(baseline, nearTarget, cycleWeeks);
    const cadenceLine = numeracyTierPlanText(tier);
    const decisionLine = numeracyDecisionRuleText(tier);
    const learnerName = learner?.name || 'Learner';
    const frameworks = (NUMERACY_FRAMEWORK_ALIGNMENT[domainId] || [])
      .slice(0, 4)
      .map((item) => item.framework)
      .join(' · ');
    const sasReadinessLine = NUMERACY_SAS_CURRICULUM_READINESS[gradeBand] || NUMERACY_SAS_CURRICULUM_READINESS['3-5'];
    const activityPlan = buildNumeracyProtocolActivityPlan(domainId, pulse, tier, gradeBand);
    const activityItems = activityPlan.length
      ? activityPlan.map((item) => `<li><strong>${escapeHtml(item.stage)} (${escapeHtml(item.minutes)} min):</strong> <a class="report-pulse-link" href="${item.href}">${escapeHtml(item.label)}</a> · ${escapeHtml(item.rationale || 'Use targeted practice with immediate feedback.')}</li>`).join('')
      : '<li>Run a numeracy warm-up, guided problem set, and language-based explanation transfer.</li>';
    const trajectoryItems = trajectory.length
      ? trajectory.map((row) => `<li>Week ${row.week}: expected checkpoint ${formatPercent(row.expected)}</li>`).join('')
      : '<li>Set baseline with 3-5 scored probes, then regenerate packet.</li>';
    const baselineText = baseline !== null && baseline !== undefined && !Number.isNaN(baseline)
      ? formatPercent(baseline)
      : 'Need baseline';
    const nearTargetText = nearTarget !== null && nearTarget !== undefined && !Number.isNaN(nearTarget)
      ? formatPercent(nearTarget)
      : 'Set after baseline';
    const tierLabel = pulse?.engine?.tierRecommendation?.tierLabel || `Tier ${tier}`;
    const confidenceText = pulse?.engine?.evidence?.confidenceLabel
      ? `${pulse.engine.evidence.confidenceLabel} (${formatPercent(pulse.engine.evidence.confidenceScore || 0)})`
      : 'Early signal';
    const guardrails = pulse?.engine?.guardrails?.length
      ? pulse.engine.guardrails
      : ['Keep conceptual rigor high while scaffolding language and representation.'];
    const topPriority = pulse?.priorities?.[0] || 'Collect additional numeracy evidence this week.';
    const sourceItems = sourceSummary.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
    const sourceAvailabilityItems = sourceSummary.availabilitySummary.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
    const manualReferenceItems = sourceSummary.manualReferences?.length
      ? sourceSummary.manualReferences
        .map((row) => `<li><a class="report-pulse-link" href="${escapeHtml(row.href)}" target="_blank" rel="noopener">${escapeHtml(row.title)}</a> · ${escapeHtml(row.scope)}</li>`)
        .join('')
      : '<li>No manual references configured.</li>';
    const conceptualMoveItems = conceptualMoves.map((line) => `<li>${escapeHtml(line)}</li>`).join('');

    latestNumeracyText = [
      `${learnerName} Numeracy Intervention Packet`,
      `Domain: ${domainName}`,
      `Grade band: ${gradeBand}`,
      `Cycle length: ${cycleWeeks} weeks`,
      `Tier: ${tierLabel}`,
      `Engine confidence: ${confidenceText}`,
      `Baseline: ${baselineText}`,
      `Cycle target: ${nearTargetText}`,
      `Assessment bundle: ${sourceSummary.bundleLabel}`,
      `Strategy stage: ${strategyStage.label}`,
      '',
      `Priority: ${topPriority}`,
      `Cadence: ${cadenceLine}`,
      'Daily numeracy loop:',
      ...(activityPlan.length
        ? activityPlan.map((item) => `- ${item.stage} (${item.minutes} min): ${item.label} - ${item.rationale || 'Use targeted practice with immediate feedback.'}\n  ${item.href}`)
        : ['- Concept teach -> guided solve -> explain and transfer']),
      '',
      'Weekly checkpoints:',
      ...(trajectory.length
        ? trajectory.map((row) => `- Week ${row.week}: ${formatPercent(row.expected)}`)
        : ['- Need baseline to generate weekly checkpoint targets']),
      '',
      'Decision rules:',
      '- If two consecutive probes fall >5 points below checkpoint, increase scaffold intensity and add one session/week.',
      '- If three probes meet/exceed checkpoints, shift one weekly session to transfer and explanation tasks.',
      `- ${decisionLine}`,
      '',
      'Assessment and monitoring stack:',
      ...sourceSummary.lines.map((line) => `- ${line}`),
      ...sourceSummary.availabilitySummary.map((line) => `- ${line}`),
      'Bridges manual references:',
      ...(sourceSummary.manualReferences?.length
        ? sourceSummary.manualReferences.map((row) => `- ${row.title} (${row.scope}): ${row.href}`)
        : ['- No manual references configured']),
      '',
      'Conceptual strategy moves:',
      `- Stage signal: ${strategyStage.signal}`,
      `- Stage lever: ${strategyStage.leverageMove}`,
      ...conceptualMoves.map((line) => `- ${line}`),
      '',
      `Framework alignment: ${frameworks || 'Common Core Math · UK Curriculum · IB Math · WIDA'}`,
      `SAS/Illustrative Math readiness: ${sasReadinessLine}`,
      'Equity guardrails:',
      ...guardrails.map((line) => `- ${line}`)
    ].join('\n');

    numeracyOutputEl.innerHTML = `
      <div class="report-protocol-grid">
        <article class="report-protocol-card">
          <h3>${escapeHtml(domainName)} · ${escapeHtml(tierLabel)}</h3>
          <ul>
            <li><strong>Cycle:</strong> ${escapeHtml(String(cycleWeeks))} weeks</li>
            <li><strong>Baseline:</strong> ${escapeHtml(baselineText)}</li>
            <li><strong>Target by cycle end:</strong> ${escapeHtml(nearTargetText)}</li>
            <li><strong>Engine confidence:</strong> ${escapeHtml(confidenceText)}</li>
            <li><strong>Strategy stage:</strong> ${escapeHtml(strategyStage.label)}</li>
          </ul>
          <div class="report-protocol-note">${escapeHtml(cadenceLine)}</div>
          <div class="report-protocol-note"><strong>Priority:</strong> ${escapeHtml(topPriority)}</div>
        </article>
        <article class="report-protocol-card">
          <h3>Weekly checkpoint trajectory</h3>
          <ul>${trajectoryItems}</ul>
          <div class="report-protocol-note">Collect at least 2 scored numeracy probes each week in the target domain.</div>
        </article>
        <article class="report-protocol-card">
          <h3>Daily intervention loop</h3>
          <ul>${activityItems}</ul>
        </article>
        <article class="report-protocol-card">
          <h3>Assessment and monitoring stack</h3>
          <div class="report-protocol-note"><strong>Bundle:</strong> ${escapeHtml(sourceSummary.bundleLabel)}</div>
          <ul>${sourceItems}</ul>
          <ul>${sourceAvailabilityItems}</ul>
          <div class="report-protocol-note"><strong>Bridges manual references:</strong></div>
          <ul>${manualReferenceItems}</ul>
        </article>
        <article class="report-protocol-card">
          <h3>Conceptual strategy progression</h3>
          <ul>
            <li><strong>Signal:</strong> ${escapeHtml(strategyStage.signal)}</li>
            <li><strong>Leverage move:</strong> ${escapeHtml(strategyStage.leverageMove)}</li>
          </ul>
          <ul>${conceptualMoveItems}</ul>
        </article>
        <article class="report-protocol-card">
          <h3>Decision rules + alignment</h3>
          <ul>
            <li>If two consecutive probes fall below checkpoint, increase support intensity.</li>
            <li>If three probes meet checkpoints, shift one session to transfer and justification tasks.</li>
            <li>${escapeHtml(decisionLine)}</li>
          </ul>
          <div class="report-protocol-note"><strong>Framework alignment:</strong> ${escapeHtml(frameworks || 'Common Core Math · UK Curriculum · IB Math · WIDA')}</div>
          <div class="report-protocol-note"><strong>SAS/IM readiness:</strong> ${escapeHtml(sasReadinessLine)}</div>
          <ul>${guardrails.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
        </article>
      </div>
    `;
    if (numeracyStatusEl) numeracyStatusEl.textContent = '';
  }

  async function copyNumeracyProtocol() {
    if (!latestNumeracyText) {
      if (numeracyStatusEl) numeracyStatusEl.textContent = 'Generate the numeracy packet first, then copy.';
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestNumeracyText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      if (numeracyStatusEl) numeracyStatusEl.textContent = 'Numeracy packet copied.';
    } catch {
      if (numeracyStatusEl) numeracyStatusEl.textContent = 'Clipboard unavailable. Copy directly from the numeracy packet.';
    }
  }

  function setNumeracyImportStatus(message, isError = false) {
    if (!numeracyImportStatusEl) return;
    numeracyImportStatusEl.textContent = message || '';
    numeracyImportStatusEl.classList.toggle('error', !!isError);
    numeracyImportStatusEl.classList.toggle('success', !isError && !!message);
  }

  function readNumeracyImportUndo() {
    const parsed = safeParse(localStorage.getItem(NUMERACY_IMPORT_UNDO_KEY) || '');
    if (!parsed || !Array.isArray(parsed.logs)) return null;
    return parsed;
  }

  function saveNumeracyImportUndo(logs) {
    localStorage.setItem(NUMERACY_IMPORT_UNDO_KEY, JSON.stringify({
      ts: Date.now(),
      logs: Array.isArray(logs) ? logs.slice(-700) : []
    }));
  }

  function clearNumeracyImportUndo() {
    localStorage.removeItem(NUMERACY_IMPORT_UNDO_KEY);
  }

  function syncNumeracyImportActions() {
    if (numeracyImportBtn) numeracyImportBtn.disabled = !pendingNumeracyImport?.result?.entries?.length;
    if (numeracyImportUndoBtn) numeracyImportUndoBtn.disabled = !readNumeracyImportUndo();
  }

  function renderNumeracyImportPreview() {
    if (!numeracyImportPreviewEl) return;
    if (!pendingNumeracyImport || !pendingNumeracyImport.result) {
      numeracyImportPreviewEl.innerHTML = '';
      return;
    }

    const result = pendingNumeracyImport.result;
    const rows = result.entries.slice(0, 8).map((entry) => {
      const domain = numeracyDomainLabel(entry?.detail?.domain || 'number-sense');
      const gradeBand = normalizeGradeBand(entry?.detail?.gradeBand || '3-5');
      const accuracy = formatPercent(entry?.detail?.accuracy || 0);
      const detail = entry?.detail?.sourceDetail || '';
      const dateText = new Date(Number(entry?.ts || Date.now())).toLocaleDateString();
      return `<tr><td>${escapeHtml(dateText)}</td><td>${escapeHtml(domain)}</td><td>${escapeHtml(gradeBand)}</td><td>${escapeHtml(accuracy)}</td><td>${escapeHtml(detail)}</td></tr>`;
    }).join('');
    const skippedRows = Array.isArray(result.skippedRows) ? result.skippedRows : [];
    const skipReasons = Array.isArray(result.skipReasonSummary) ? result.skipReasonSummary : [];
    const skipSummaryItems = skipReasons.length
      ? skipReasons.map((item) => `<li>${escapeHtml(item.reason)} (${item.count})</li>`).join('')
      : '<li>No skipped rows.</li>';
    const skippedRowsHtml = skippedRows.slice(0, 12).map((row) => `
      <tr>
        <td>${row.rowNumber ? escapeHtml(String(row.rowNumber)) : '—'}</td>
        <td>${escapeHtml(row.reason || 'Unable to map row')}</td>
        <td>${escapeHtml(row.detail || 'Required import fields were not found.')}</td>
        <td>${escapeHtml(row.observed || '—')}</td>
      </tr>
    `).join('');

    const sampleNotice = result.entries.length > 8
      ? `<div class="report-bench-note">Showing first 8 rows of ${result.entries.length} mapped entries.</div>`
      : '';
    const skippedNotice = skippedRows.length > 12
      ? `<div class="report-bench-note">Showing first 12 skipped rows of ${skippedRows.length} total diagnostics.</div>`
      : '';

    numeracyImportPreviewEl.innerHTML = `
      <div class="report-builder-summary">
        <div><strong>Preview ready:</strong> ${escapeHtml(result.sourceLabel)} from ${escapeHtml(pendingNumeracyImport.fileName || 'selected file')}</div>
        <div><strong>Rows parsed:</strong> ${result.totalRows} · <strong>Mapped:</strong> ${result.importedCount} · <strong>Skipped:</strong> ${result.skippedCount}</div>
      </div>
      <div class="report-bench-table-wrap">
        <table class="report-bench-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Domain</th>
              <th>Grade Band</th>
              <th>Accuracy</th>
              <th>Source Detail</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="5">No mapped rows in preview.</td></tr>'}</tbody>
        </table>
      </div>
      ${sampleNotice}
      <div class="report-builder-summary">
        <div><strong>Skip reason summary:</strong></div>
        <ul class="report-import-skip-summary">${skipSummaryItems}</ul>
      </div>
      <div class="report-bench-table-wrap">
        <table class="report-bench-table">
          <thead>
            <tr>
              <th>CSV Row</th>
              <th>Reason</th>
              <th>Fix Hint</th>
              <th>Observed Fields</th>
            </tr>
          </thead>
          <tbody>${skippedRowsHtml || '<tr><td colspan="4">No skipped rows.</td></tr>'}</tbody>
        </table>
      </div>
      ${skippedNotice}
    `;
  }

  function renderNumeracyImportSpec() {
    if (!numeracyImportSpecEl) return;
    const sourceId = activeNumeracyImportSourceId();
    const meta = NUMERACY_IMPORT_SOURCE_META[sourceId] || NUMERACY_IMPORT_SOURCE_META['im-cooldown'];
    const spec = getNumeracyTemplateSpec(sourceId);
    const templateHeaders = spec.templateHeaders || [];
    const acceptedHeaders = spec.acceptedHeaders || [];
    const templateHeaderText = templateHeaders.map((header) => `<code>${escapeHtml(header)}</code>`).join(' ');
    const acceptedHeaderText = acceptedHeaders.map((header) => `<code>${escapeHtml(header)}</code>`).join(' ');
    numeracyImportSpecEl.innerHTML = `
      <div><strong>Expected columns:</strong> ${escapeHtml(meta.expectedColumns)}.</div>
      <div><strong>Template headers:</strong> ${templateHeaderText}</div>
      <details class="report-import-details">
        <summary>Accepted headers (${acceptedHeaders.length})</summary>
        <div class="report-import-header-list">${acceptedHeaderText}</div>
      </details>
    `;
  }

  async function handleNumeracyCsvPreview() {
    const sourceId = activeNumeracyImportSourceId();
    const file = numeracyImportFileEl?.files?.[0];
    if (!file) {
      setNumeracyImportStatus('Choose a CSV file before previewing.', true);
      return;
    }

    try {
      const text = await file.text();
      const learner = window.DECODE_PLATFORM?.getActiveLearner?.() || null;
      const result = importNumeracyCsv(sourceId, text, {
        learnerId: learner?.id || '',
        defaultGradeBand: normalizeGradeBand(learner?.gradeBand || '3-5')
      });

      pendingNumeracyImport = {
        sourceId,
        fileName: file.name,
        result
      };
      renderNumeracyImportPreview();
      syncNumeracyImportActions();

      if (!result.entries.length) {
        const topReason = result.skipReasonSummary?.[0];
        const reasonLine = topReason
          ? ` Top reason: ${topReason.reason} (${topReason.count}).`
          : '';
        setNumeracyImportStatus(`Preview found 0 mapped rows from ${result.sourceLabel}. ${result.skippedCount} row(s) were skipped.${reasonLine}`, true);
        return;
      }

      setNumeracyImportStatus(`Preview ready: ${result.importedCount}/${result.totalRows} rows mapped from ${result.sourceLabel}. Click Commit Import to save.`);
    } catch {
      pendingNumeracyImport = null;
      renderNumeracyImportPreview();
      syncNumeracyImportActions();
      setNumeracyImportStatus('Preview failed: unable to parse this CSV file.', true);
    }
  }

  function commitNumeracyCsvImport() {
    if (!pendingNumeracyImport?.result?.entries?.length) {
      setNumeracyImportStatus('Run Preview CSV first, then commit.', true);
      return;
    }

    const existing = getNumeracyLogs();
    saveNumeracyImportUndo(existing);
    const result = pendingNumeracyImport.result;
    const merged = [...existing, ...result.entries].slice(-700);
    localStorage.setItem('decode_numeracy_log_v1', JSON.stringify(merged));

    try {
      window.DECODE_PLATFORM?.logActivity?.({
        activity: 'teacher-report',
        label: 'Teacher Report',
        event: `Imported ${result.importedCount} ${result.sourceLabel} rows`,
        detail: {
          source: pendingNumeracyImport.sourceId,
          imported: result.importedCount,
          skipped: result.skippedCount
        }
      });
    } catch {}

    setNumeracyImportStatus(`Committed ${result.importedCount}/${result.totalRows} rows from ${result.sourceLabel}. Undo is available.`);
    if (numeracyImportFileEl) numeracyImportFileEl.value = '';
    pendingNumeracyImport = null;
    renderNumeracyImportPreview();
    syncNumeracyImportActions();
    refreshReport();
  }

  function undoNumeracyCsvImport() {
    const snapshot = readNumeracyImportUndo();
    if (!snapshot?.logs) {
      setNumeracyImportStatus('No import snapshot available to undo.', true);
      return;
    }

    localStorage.setItem('decode_numeracy_log_v1', JSON.stringify(snapshot.logs));
    clearNumeracyImportUndo();
    pendingNumeracyImport = null;
    renderNumeracyImportPreview();
    syncNumeracyImportActions();

    try {
      window.DECODE_PLATFORM?.logActivity?.({
        activity: 'teacher-report',
        label: 'Teacher Report',
        event: 'Undid last numeracy CSV import',
        detail: {
          source: 'numeracy-import-undo'
        }
      });
    } catch {}
    setNumeracyImportStatus('Undo complete. Numeracy logs restored to pre-import state.');
    refreshReport();
  }

  function reportMediaSectionLabel(sectionId) {
    return REPORT_MEDIA_SECTION_META[sectionId]?.label || 'General';
  }

  function reportMediaCategoryLabel(categoryId) {
    const match = REPORT_MEDIA_CATEGORIES.find((item) => item.id === categoryId);
    return match?.label || 'General';
  }

  function updateReportMediaPrompt() {
    if (!reportMediaPromptEl) return;
    const sectionId = String(reportMediaSectionEl?.value || 'literacy-pulse');
    const owner = String(reportMediaOwnerEl?.value || 'teacher');
    const sourceType = String(reportMediaSourceEl?.value || 'audio');
    const sectionPrompts = REPORT_MEDIA_PROMPT_MAP[sectionId] || {};
    const basePrompt = sectionPrompts[owner] || 'Record one clear teaching point, one next step, and one encouragement statement.';
    const sourceHint = sourceType === 'screen'
      ? 'Screen mode tip: open your whiteboard/app first, then select it in the share picker.'
      : sourceType === 'video'
        ? 'Video mode tip: keep camera stable and model one example only.'
        : 'Audio mode tip: keep your message under 90 seconds and use plain language.';
    reportMediaPromptEl.innerHTML = `<strong>Prompt:</strong> ${escapeHtml(basePrompt)} <br /><strong>Capture tip:</strong> ${escapeHtml(sourceHint)}`;
  }

  function setReportMediaStatus(message, isError = false, isModal = false) {
    if (isModal) {
      if (!reportMediaModalStatusEl) return;
      reportMediaModalStatusEl.textContent = message || '';
      reportMediaModalStatusEl.classList.toggle('error', !!isError);
      reportMediaModalStatusEl.classList.toggle('success', !isError && !!message);
      return;
    }
    if (!reportMediaStatusEl) return;
    reportMediaStatusEl.textContent = message || '';
    reportMediaStatusEl.classList.toggle('error', !!isError);
    reportMediaStatusEl.classList.toggle('success', !isError && !!message);
  }

  function releaseReportMediaStream(stream) {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {}
    });
  }

  function clearReportMediaObjectUrls() {
    reportMediaObjectUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    reportMediaObjectUrls = [];
  }

  function makeReportMediaObjectUrl(blob) {
    if (!blob) return '';
    const url = URL.createObjectURL(blob);
    reportMediaObjectUrls.push(url);
    return url;
  }

  function parseReportMediaTags(rawValue) {
    return String(rawValue || '')
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10);
  }

  function formatDurationMs(durationMs) {
    if (!durationMs || Number.isNaN(durationMs)) return '—';
    const totalSeconds = Math.max(1, Math.round(durationMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (!minutes) return `${seconds}s`;
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }

  function reportMediaMatchesFilters(clip) {
    const searchValue = String(reportMediaSearchEl?.value || '').trim().toLowerCase();
    const sectionValue = String(reportMediaFilterSectionEl?.value || 'all');
    const ownerValue = String(reportMediaFilterOwnerEl?.value || 'all');
    const categoryValue = String(reportMediaFilterCategoryEl?.value || 'all');

    if (sectionValue !== 'all' && clip.section !== sectionValue) return false;
    if (ownerValue !== 'all' && clip.owner !== ownerValue) return false;
    if (categoryValue !== 'all' && clip.category !== categoryValue) return false;

    if (!searchValue) return true;
    const haystack = [
      clip.label,
      clip.category,
      reportMediaCategoryLabel(clip.category),
      clip.section,
      reportMediaSectionLabel(clip.section),
      ...(Array.isArray(clip.tags) ? clip.tags : [])
    ].join(' ').toLowerCase();
    return haystack.includes(searchValue);
  }

  function renderReportMediaSelects() {
    if (reportMediaSectionEl) {
      reportMediaSectionEl.innerHTML = Object.keys(REPORT_MEDIA_SECTION_META)
        .map((id) => `<option value="${id}">${REPORT_MEDIA_SECTION_META[id].label}</option>`)
        .join('');
    }
    if (reportMediaFilterSectionEl) {
      reportMediaFilterSectionEl.innerHTML = [
        '<option value="all">All sections</option>',
        ...Object.keys(REPORT_MEDIA_SECTION_META)
          .map((id) => `<option value="${id}">${REPORT_MEDIA_SECTION_META[id].label}</option>`)
      ].join('');
    }
    if (reportMediaCategoryEl) {
      reportMediaCategoryEl.innerHTML = REPORT_MEDIA_CATEGORIES
        .map((item) => `<option value="${item.id}">${item.label}</option>`)
        .join('');
    }
    if (reportMediaFilterCategoryEl) {
      reportMediaFilterCategoryEl.innerHTML = [
        '<option value="all">All categories</option>',
        ...REPORT_MEDIA_CATEGORIES.map((item) => `<option value="${item.id}">${item.label}</option>`)
      ].join('');
    }
  }

  function syncReportMediaRecorderButtons() {
    const isRecording = reportMediaRecorderState?.mediaRecorder?.state === 'recording';
    if (reportMediaStartBtn) reportMediaStartBtn.disabled = isRecording;
    if (reportMediaStopBtn) reportMediaStopBtn.disabled = !isRecording;
    if (reportMediaSaveBtn) reportMediaSaveBtn.disabled = !reportMediaDraft;
    if (reportMediaDiscardBtn) reportMediaDiscardBtn.disabled = !reportMediaDraft && !isRecording;
  }

  function clearReportMediaPreview() {
    if (reportMediaAudioPreviewEl) {
      reportMediaAudioPreviewEl.pause();
      reportMediaAudioPreviewEl.removeAttribute('src');
      reportMediaAudioPreviewEl.classList.add('hidden');
      reportMediaAudioPreviewEl.load();
    }
    if (reportMediaVideoPreviewEl) {
      reportMediaVideoPreviewEl.pause();
      reportMediaVideoPreviewEl.removeAttribute('src');
      reportMediaVideoPreviewEl.srcObject = null;
      reportMediaVideoPreviewEl.classList.add('hidden');
      reportMediaVideoPreviewEl.load();
    }
  }

  function renderReportMediaDraftPreview() {
    clearReportMediaPreview();
    if (!reportMediaDraft) return;
    if (reportMediaDraft.sourceType === 'audio') {
      if (!reportMediaAudioPreviewEl) return;
      reportMediaAudioPreviewEl.src = reportMediaDraft.url;
      reportMediaAudioPreviewEl.classList.remove('hidden');
      return;
    }
    if (!reportMediaVideoPreviewEl) return;
    reportMediaVideoPreviewEl.src = reportMediaDraft.url;
    reportMediaVideoPreviewEl.classList.remove('hidden');
  }

  function renderReportMediaLivePreview(stream) {
    clearReportMediaPreview();
    if (!reportMediaVideoPreviewEl || !stream) return;
    reportMediaVideoPreviewEl.srcObject = stream;
    reportMediaVideoPreviewEl.muted = true;
    reportMediaVideoPreviewEl.classList.remove('hidden');
    reportMediaVideoPreviewEl.play().catch(() => {});
  }

  function clearReportMediaDraft() {
    if (reportMediaDraft?.url) {
      try {
        URL.revokeObjectURL(reportMediaDraft.url);
      } catch {}
    }
    reportMediaDraft = null;
    clearReportMediaPreview();
    syncReportMediaRecorderButtons();
  }

  function reportMediaMimeCandidates(sourceType) {
    if (sourceType === 'audio') {
      return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    }
    return ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  }

  function reportMediaMimeType(sourceType) {
    const candidates = reportMediaMimeCandidates(sourceType);
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      if (
        typeof window.MediaRecorder !== 'undefined' &&
        typeof window.MediaRecorder.isTypeSupported === 'function' &&
        window.MediaRecorder.isTypeSupported(candidate)
      ) {
        return candidate;
      }
    }
    return '';
  }

  function openReportMediaDb() {
    if (reportMediaDbPromise) return reportMediaDbPromise;
    reportMediaDbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('indexeddb-unavailable'));
        return;
      }
      const request = indexedDB.open(REPORT_MEDIA_DB.name, REPORT_MEDIA_DB.version);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(REPORT_MEDIA_DB.store)) {
          const store = db.createObjectStore(REPORT_MEDIA_DB.store, { keyPath: 'id' });
          store.createIndex('section', 'section', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('owner', 'owner', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('indexeddb-open-failed'));
    });
    return reportMediaDbPromise;
  }

  async function readReportMediaClips() {
    const db = await openReportMediaDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(REPORT_MEDIA_DB.store, 'readonly');
      const request = tx.objectStore(REPORT_MEDIA_DB.store).getAll();
      request.onsuccess = () => {
        const rows = Array.isArray(request.result) ? request.result : [];
        rows.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
        resolve(rows);
      };
      request.onerror = () => reject(request.error || new Error('media-read-failed'));
    });
  }

  async function saveReportMediaClip(clip) {
    const db = await openReportMediaDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(REPORT_MEDIA_DB.store, 'readwrite');
      tx.objectStore(REPORT_MEDIA_DB.store).put(clip);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('media-save-failed'));
      tx.onabort = () => reject(tx.error || new Error('media-save-aborted'));
    });

    const clips = await readReportMediaClips();
    if (clips.length <= REPORT_MEDIA_MAX_ITEMS) return;
    const extras = clips.slice(REPORT_MEDIA_MAX_ITEMS);
    await Promise.all(extras.map((item) => deleteReportMediaClip(item.id, false)));
  }

  async function deleteReportMediaClip(clipId, refreshViews = true) {
    if (!clipId) return;
    const db = await openReportMediaDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(REPORT_MEDIA_DB.store, 'readwrite');
      tx.objectStore(REPORT_MEDIA_DB.store).delete(clipId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('media-delete-failed'));
      tx.onabort = () => reject(tx.error || new Error('media-delete-aborted'));
    });
    if (refreshViews) {
      await refreshReportMediaViews();
    }
  }

  async function refreshReportMediaViews() {
    try {
      reportMediaClips = await readReportMediaClips();
      renderReportMediaViewsFromCache();
    } catch {
      reportMediaClips = [];
      clearReportMediaObjectUrls();
      if (reportMediaLibraryEl) {
        reportMediaLibraryEl.innerHTML = '<div class="muted">Media library is unavailable in this browser context.</div>';
      }
      renderReportMediaSlots();
    }
  }

  function renderReportMediaViewsFromCache() {
    clearReportMediaObjectUrls();
    renderReportMediaLibrary();
    renderReportMediaSlots();
  }

  function renderReportMediaSlots() {
    reportMediaSlotEls.forEach((slot) => {
      const sectionId = String(slot.dataset.mediaSlot || '');
      if (!sectionId) {
        slot.innerHTML = '';
        return;
      }
      const items = reportMediaClips
        .filter((clip) => clip.section === sectionId)
        .slice(0, 3);
      const rows = items.map((clip) => {
        const src = makeReportMediaObjectUrl(clip.blob);
        const media = clip.sourceType === 'audio'
          ? `<audio controls src="${src}"></audio>`
          : `<video controls playsinline src="${src}"></video>`;
        const tags = (clip.tags || []).length
          ? `<div class="report-media-chip-row">${clip.tags.map((tag) => `<span class="report-media-chip">#${escapeHtml(tag)}</span>`).join('')}</div>`
          : '';
        return `
          <article class="report-media-item report-media-item-compact">
            <div class="report-media-item-head">
              <strong>${escapeHtml(clip.label || 'Untitled clip')}</strong>
              <span>${escapeHtml(new Date(Number(clip.createdAt || Date.now())).toLocaleDateString())}</span>
            </div>
            <div class="report-media-item-meta">${escapeHtml(clip.owner || 'teacher')} · ${escapeHtml(reportMediaCategoryLabel(clip.category))} · ${escapeHtml(formatDurationMs(clip.durationMs))}</div>
            ${tags}
            <div class="report-media-player">${media}</div>
          </article>
        `;
      }).join('');

      slot.innerHTML = `
        <div class="report-media-slot-head">
          <strong>Section Recordings</strong>
          <button class="secondary-btn report-media-open-section-btn" type="button" data-target-section="${sectionId}">Add</button>
        </div>
        ${rows || '<div class="report-media-empty">No recordings attached yet.</div>'}
      `;
    });
  }

  function renderReportMediaLibrary() {
    if (!reportMediaLibraryEl) return;
    const filtered = reportMediaClips.filter((clip) => reportMediaMatchesFilters(clip));
    if (!filtered.length) {
      reportMediaLibraryEl.innerHTML = '<div class="muted">No recordings match your filters yet.</div>';
      return;
    }

    const visible = filtered.slice(0, 24);
    const cards = visible.map((clip) => {
      const src = makeReportMediaObjectUrl(clip.blob);
      const media = clip.sourceType === 'audio'
        ? `<audio controls src="${src}"></audio>`
        : `<video controls playsinline src="${src}"></video>`;
      const tags = (clip.tags || []).length
        ? `<div class="report-media-chip-row">${clip.tags.map((tag) => `<span class="report-media-chip">#${escapeHtml(tag)}</span>`).join('')}</div>`
        : '';
      return `
        <article class="report-media-item">
          <div class="report-media-item-head">
            <strong>${escapeHtml(clip.label || 'Untitled clip')}</strong>
            <span>${escapeHtml(new Date(Number(clip.createdAt || Date.now())).toLocaleString())}</span>
          </div>
          <div class="report-media-item-meta">${escapeHtml(reportMediaSectionLabel(clip.section))} · ${escapeHtml(clip.owner || 'teacher')} · ${escapeHtml(reportMediaCategoryLabel(clip.category))} · ${escapeHtml(formatDurationMs(clip.durationMs))}</div>
          ${tags}
          <div class="report-media-player">${media}</div>
          <div class="report-media-item-actions">
            <button class="secondary-btn report-media-open-section-btn" type="button" data-target-section="${escapeHtml(clip.section || 'literacy-pulse')}">Add In Section</button>
            <button class="secondary-btn report-media-delete-btn" type="button" data-media-delete="${escapeHtml(clip.id)}">Delete</button>
          </div>
        </article>
      `;
    }).join('');

    const notice = filtered.length > visible.length
      ? `<div class="report-bench-note">Showing ${visible.length} of ${filtered.length} clips. Narrow filters to find specific recordings.</div>`
      : '';

    reportMediaLibraryEl.innerHTML = `
      <div class="report-media-grid">${cards}</div>
      ${notice}
    `;
  }

  function setReportMediaModalOpen(isOpen) {
    if (reportMediaOverlayEl) reportMediaOverlayEl.classList.toggle('hidden', !isOpen);
    if (reportMediaModalEl) reportMediaModalEl.classList.toggle('hidden', !isOpen);
    if (!isOpen) {
      setReportMediaStatus('', false, true);
    }
  }

  function openReportMediaModal(sectionId = '') {
    if (sectionId && reportMediaSectionEl && REPORT_MEDIA_SECTION_META[sectionId]) {
      reportMediaSectionEl.value = sectionId;
    }
    setReportMediaModalOpen(true);
    updateReportMediaPrompt();
    setReportMediaStatus(`Ready to record for ${reportMediaSectionLabel(reportMediaSectionEl?.value || 'literacy-pulse')}.`, false, true);
  }

  function closeReportMediaModal() {
    setReportMediaModalOpen(false);
    if (reportMediaRecorderState?.mediaRecorder?.state === 'recording') {
      try {
        reportMediaRecorderState.mediaRecorder.stop();
      } catch {}
    }
    releaseReportMediaStream(reportMediaRecorderState?.stream);
    reportMediaRecorderState = null;
    syncReportMediaRecorderButtons();
  }

  async function startReportMediaRecording() {
    if (!window.MediaRecorder) {
      setReportMediaStatus('This browser does not support recording.', true, true);
      return;
    }
    if (reportMediaRecorderState?.mediaRecorder?.state === 'recording') {
      setReportMediaStatus('Recording is already running.', true, true);
      return;
    }

    const sourceType = String(reportMediaSourceEl?.value || 'audio');
    let stream = null;
    try {
      if (sourceType === 'screen') {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          throw new Error('screen-share-unavailable');
        }
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
      } else if (sourceType === 'video') {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
      }
    } catch {
      setReportMediaStatus('Could not access microphone/camera/screen. Check permissions and retry.', true, true);
      return;
    }

    clearReportMediaDraft();
    const mimeType = reportMediaMimeType(sourceType);
    const mediaRecorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
    const chunks = [];
    const startedAt = Date.now();

    mediaRecorder.ondataavailable = (event) => {
      if (event?.data?.size) chunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      releaseReportMediaStream(stream);
      reportMediaRecorderState = null;
      if (!chunks.length) {
        setReportMediaStatus('No media data captured. Try recording again.', true, true);
        syncReportMediaRecorderButtons();
        clearReportMediaPreview();
        return;
      }
      const blobType = mediaRecorder.mimeType || mimeType || (sourceType === 'audio' ? 'audio/webm' : 'video/webm');
      const blob = new Blob(chunks, { type: blobType });
      const url = URL.createObjectURL(blob);
      reportMediaDraft = {
        sourceType,
        blob,
        url,
        mimeType: blobType,
        durationMs: Date.now() - startedAt
      };
      renderReportMediaDraftPreview();
      syncReportMediaRecorderButtons();
      setReportMediaStatus('Draft ready. Add label/tags and click Save Clip.', false, true);
    };

    reportMediaRecorderState = {
      mediaRecorder,
      stream,
      sourceType
    };

    mediaRecorder.start();
    if (sourceType === 'video' || sourceType === 'screen') {
      renderReportMediaLivePreview(stream);
    } else {
      clearReportMediaPreview();
    }
    syncReportMediaRecorderButtons();
    setReportMediaStatus('Recording now. Click Stop when finished.', false, true);
  }

  function stopReportMediaRecording() {
    if (!reportMediaRecorderState?.mediaRecorder || reportMediaRecorderState.mediaRecorder.state !== 'recording') {
      setReportMediaStatus('No active recording to stop.', true, true);
      return;
    }
    try {
      reportMediaRecorderState.mediaRecorder.stop();
    } catch {
      setReportMediaStatus('Could not stop recording cleanly. Try again.', true, true);
    }
    syncReportMediaRecorderButtons();
  }

  async function saveReportMediaDraft() {
    if (!reportMediaDraft) {
      setReportMediaStatus('Record something first, then save.', true, true);
      return;
    }
    const label = String(reportMediaLabelEl?.value || '').trim();
    if (!label) {
      setReportMediaStatus('Add a label before saving.', true, true);
      return;
    }
    const sectionId = String(reportMediaSectionEl?.value || 'literacy-pulse');
    const categoryId = String(reportMediaCategoryEl?.value || 'mini-lesson');
    const owner = String(reportMediaOwnerEl?.value || 'teacher');
    const tags = parseReportMediaTags(reportMediaTagsEl?.value);
    const learner = window.DECODE_PLATFORM?.getActiveLearner?.() || null;
    const clipId = `clip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const clip = {
      id: clipId,
      createdAt: Date.now(),
      section: REPORT_MEDIA_SECTION_META[sectionId] ? sectionId : 'literacy-pulse',
      owner,
      category: categoryId,
      label,
      tags,
      sourceType: reportMediaDraft.sourceType,
      mimeType: reportMediaDraft.mimeType,
      durationMs: reportMediaDraft.durationMs,
      learnerId: learner?.id || '',
      learnerName: learner?.name || '',
      blob: reportMediaDraft.blob
    };

    try {
      await saveReportMediaClip(clip);
      clearReportMediaDraft();
      if (reportMediaLabelEl) reportMediaLabelEl.value = '';
      if (reportMediaTagsEl) reportMediaTagsEl.value = '';
      await refreshReportMediaViews();
      setReportMediaStatus(`Saved clip to ${reportMediaSectionLabel(clip.section)}.`, false, true);
      setReportMediaStatus(`Saved "${clip.label}" (${reportMediaSectionLabel(clip.section)}).`);
    } catch {
      setReportMediaStatus('Could not save clip. Try again.', true, true);
    }
  }

  async function deleteReportMediaClipFromUi(clipId) {
    if (!clipId) return;
    const target = reportMediaClips.find((clip) => clip.id === clipId);
    const label = target?.label || 'this clip';
    if (!confirm(`Delete ${label}? This cannot be undone.`)) return;
    try {
      await deleteReportMediaClip(clipId, true);
      setReportMediaStatus(`Deleted ${label}.`);
    } catch {
      setReportMediaStatus('Could not delete clip.', true);
    }
  }

  function readParentMessageStore() {
    const parsed = safeParse(localStorage.getItem(PARENT_MESSAGE_STORE_KEY) || '');
    return parsed && typeof parsed === 'object' ? parsed : {};
  }

  function writeParentMessageStore(store) {
    localStorage.setItem(PARENT_MESSAGE_STORE_KEY, JSON.stringify(store || {}));
  }

  function parentLearnerKey(learner) {
    return learner?.id || 'global';
  }

  function getParentMessagesForLearner(learner) {
    const store = readParentMessageStore();
    const key = parentLearnerKey(learner);
    const rows = Array.isArray(store[key]) ? store[key] : [];
    return rows.slice().sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  }

  function getLatestParentMessage(learner) {
    return getParentMessagesForLearner(learner)[0] || null;
  }

  function saveParentMessageForLearner(learner, payload) {
    const store = readParentMessageStore();
    const key = parentLearnerKey(learner);
    const rows = Array.isArray(store[key]) ? store[key] : [];
    const next = {
      id: `parent_msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      learnerId: learner?.id || '',
      learnerName: learner?.name || '',
      intent: payload.intent || 'balanced',
      readingLevel: payload.readingLevel || 'standard',
      language: payload.language || 'en',
      template: payload.template || 'progress',
      text: String(payload.text || '').trim()
    };
    store[key] = [next, ...rows].slice(0, 20);
    writeParentMessageStore(store);
    return next;
  }

  function parentIntentLabel(intentId) {
    if (intentId === 'literacy') return 'Structured literacy focus';
    if (intentId === 'numeracy') return 'Conceptual math focus';
    if (intentId === 'confidence') return 'Confidence and routine focus';
    return 'Balanced literacy + numeracy';
  }

  function parentReadingLevelLabel(levelId) {
    if (levelId === 'plain') return 'Plain language';
    if (levelId === 'detailed') return 'Detailed';
    return 'Standard';
  }

  function parentLanguageLabel(languageId) {
    if (languageId === 'es') return 'Spanish (ES)';
    if (languageId === 'zh') return 'Chinese (ZH)';
    return 'English (EN)';
  }

  function parentTemplateLabel(templateId) {
    if (templateId === 'home-routine') return 'Home routine prompt';
    if (templateId === 'celebration') return 'Celebrate and encourage';
    return 'Progress snapshot';
  }

  function buildParentMessageModel(context = {}) {
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const learnerName = learner?.name || 'your child';
    const literacyGap = pulse?.gaps?.[0] || null;
    const literacyStrength = pulse?.strengths?.[0] || null;
    const numeracyGap = numeracyPulse?.gaps?.[0] || null;
    const numeracyStrength = numeracyPulse?.strengths?.[0] || null;
    const literacyFocus = literacyGap?.label || 'word reading and comprehension transfer';
    const numeracyFocus = numeracyGap?.label || 'number sense and problem-solving language';
    const literacyStrengthText = literacyStrength?.label || 'reading engagement and effort';
    const numeracyStrengthText = numeracyStrength?.label || 'math perseverance and strategy talk';

    const intro = `Hello family, this is a quick update from school on ${learnerName}'s learning focus this cycle.`;
    const literacyLine = `In literacy, we are focusing on ${literacyFocus.toLowerCase()} using structured routines (explicit model, guided practice, and short transfer checks).`;
    const numeracyLine = `In math, we are focusing on ${numeracyFocus.toLowerCase()} using conceptual strategy routines rather than memorization-only steps.`;
    const strengthLine = `${learnerName} is currently showing strengths in ${literacyStrengthText.toLowerCase()} and ${numeracyStrengthText.toLowerCase()}.`;
    const homeRoutine = 'At home (5-10 minutes): ask your child to explain one reading strategy and one math strategy out loud, then show one example.';
    const confidenceLine = 'If your child gets stuck, prompt with: “Show me what you know first,” instead of giving the answer immediately.';
    const close = 'Thank you for partnering with us. We will update you again after the next progress checkpoint.';
    const literacyTier = pulse?.engine?.tierRecommendation?.tierLabel || 'Tier 2';
    const numeracyTier = numeracyPulse?.engine?.tierRecommendation?.tierLabel || 'Tier 2';
    const literacyConfidence = pulse?.engine?.evidence?.confidenceLabel || 'Emerging signal';
    const numeracyConfidence = numeracyPulse?.engine?.evidence?.confidenceLabel || 'Emerging signal';
    return {
      learnerName,
      literacyGap,
      literacyStrength,
      numeracyGap,
      numeracyStrength,
      literacyFocus,
      numeracyFocus,
      literacyStrengthText,
      numeracyStrengthText,
      intro,
      literacyLine,
      numeracyLine,
      strengthLine,
      homeRoutine,
      confidenceLine,
      close,
      literacyTier,
      numeracyTier,
      literacyConfidence,
      numeracyConfidence
    };
  }

  function generateEnglishParentMessage(model, intent, readingLevel) {
    const {
      learnerName,
      literacyGap,
      numeracyGap,
      literacyStrength,
      numeracyStrength,
      literacyFocus,
      numeracyFocus,
      literacyStrengthText,
      numeracyStrengthText,
      intro,
      literacyLine,
      numeracyLine,
      strengthLine,
      homeRoutine,
      confidenceLine,
      close,
      literacyTier,
      numeracyTier,
      literacyConfidence,
      numeracyConfidence
    } = model;

    if (readingLevel === 'plain') {
      const plainIntro = `Hello family. Here is this week's short learning update for ${learnerName}.`;
      const plainLiteracy = `Reading focus: ${literacyFocus.toLowerCase()}. We teach, practice together, then your child tries independently.`;
      const plainNumeracy = `Math focus: ${numeracyFocus.toLowerCase()}. We use strategy talk, drawings, and explanation steps.`;
      const plainStrength = `Strengths to celebrate: ${literacyStrengthText.toLowerCase()} and ${numeracyStrengthText.toLowerCase()}.`;
      const plainRoutine = 'Home practice (5-10 minutes): ask your child to explain one reading move and one math move, then model one example together.';
      const plainClose = 'Thank you for partnering with us.';
      if (intent === 'literacy') return [plainIntro, plainLiteracy, plainStrength, plainRoutine, plainClose].join('\n\n');
      if (intent === 'numeracy') return [plainIntro, plainNumeracy, plainStrength, plainRoutine, plainClose].join('\n\n');
      if (intent === 'confidence') return [plainIntro, plainStrength, plainRoutine, confidenceLine, plainClose].join('\n\n');
      return [plainIntro, plainLiteracy, plainNumeracy, plainStrength, plainRoutine, plainClose].join('\n\n');
    }

    if (readingLevel === 'detailed') {
      const literacyData = `Literacy signal: ${literacyFocus.toLowerCase()} (${formatPercent(literacyGap?.avg)} current mastery estimate, support intensity: ${literacyTier}, confidence: ${literacyConfidence}).`;
      const numeracyData = `Numeracy signal: ${numeracyFocus.toLowerCase()} (${formatPercent(numeracyGap?.avg)} current mastery estimate, support intensity: ${numeracyTier}, confidence: ${numeracyConfidence}).`;
      const detailStrength = `Current strengths: ${literacyStrengthText} (${formatPercent(literacyStrength?.avg)}) and ${numeracyStrengthText} (${formatPercent(numeracyStrength?.avg)}).`;
      const detailClose = 'Please reach out if you want a short home plan aligned to these targets.';
      if (intent === 'literacy') return [intro, literacyData, detailStrength, homeRoutine, detailClose].join('\n\n');
      if (intent === 'numeracy') return [intro, numeracyData, detailStrength, homeRoutine, detailClose].join('\n\n');
      if (intent === 'confidence') return [intro, detailStrength, homeRoutine, confidenceLine, detailClose].join('\n\n');
      return [intro, literacyData, numeracyData, detailStrength, homeRoutine, detailClose].join('\n\n');
    }

    if (intent === 'literacy') {
      return [intro, literacyLine, `Current strength to celebrate: ${literacyStrengthText}.`, homeRoutine, close].join('\n\n');
    }
    if (intent === 'numeracy') {
      return [intro, numeracyLine, `Current strength to celebrate: ${numeracyStrengthText}.`, homeRoutine, close].join('\n\n');
    }
    if (intent === 'confidence') {
      return [intro, strengthLine, homeRoutine, confidenceLine, close].join('\n\n');
    }
    return [intro, literacyLine, numeracyLine, strengthLine, homeRoutine, close].join('\n\n');
  }

  function generateSpanishParentMessage(model, intent, readingLevel) {
    const {
      learnerName,
      literacyGap,
      numeracyGap,
      literacyStrength,
      numeracyStrength,
      literacyFocus,
      numeracyFocus,
      literacyStrengthText,
      numeracyStrengthText,
      literacyTier,
      numeracyTier,
      literacyConfidence,
      numeracyConfidence
    } = model;
    const intro = `Hola familia. Este es un resumen breve del progreso de ${learnerName} en este ciclo.`;
    const literacyLine = `En lectura y escritura estamos trabajando ${literacyFocus.toLowerCase()} con rutina explicita: modelo, practica guiada y transferencia corta.`;
    const numeracyLine = `En matematicas estamos trabajando ${numeracyFocus.toLowerCase()} con estrategias conceptuales, no solo memorizacion.`;
    const strengthLine = `Fortalezas actuales: ${literacyStrengthText.toLowerCase()} y ${numeracyStrengthText.toLowerCase()}.`;
    const homeRoutine = 'Rutina en casa (5-10 minutos): pida que su hijo explique una estrategia de lectura y una de matematicas, luego practiquen un ejemplo.';
    const confidenceLine = 'Si hay bloqueo, use la frase: "Muestrame primero lo que ya sabes."';
    const close = 'Gracias por su apoyo. Compartiremos una nueva actualizacion en el siguiente punto de control.';

    if (readingLevel === 'plain') {
      const plainIntro = `Hola familia. Actualizacion corta de esta semana para ${learnerName}.`;
      const plainLiteracy = `Lectura: ${literacyFocus.toLowerCase()}. Primero modelamos, luego practicamos juntos y despues practica independiente.`;
      const plainNumeracy = `Matematicas: ${numeracyFocus.toLowerCase()}. Usamos dibujos, lenguaje matematico y explicaciones.`;
      const plainClose = 'Gracias por apoyar este proceso en casa.';
      if (intent === 'literacy') return [plainIntro, plainLiteracy, strengthLine, homeRoutine, plainClose].join('\n\n');
      if (intent === 'numeracy') return [plainIntro, plainNumeracy, strengthLine, homeRoutine, plainClose].join('\n\n');
      if (intent === 'confidence') return [plainIntro, strengthLine, homeRoutine, confidenceLine, plainClose].join('\n\n');
      return [plainIntro, plainLiteracy, plainNumeracy, strengthLine, homeRoutine, plainClose].join('\n\n');
    }

    if (readingLevel === 'detailed') {
      const literacyData = `Senal de lectura: ${literacyFocus.toLowerCase()} (${formatPercent(literacyGap?.avg)} de dominio estimado, intensidad: ${literacyTier}, confianza: ${literacyConfidence}).`;
      const numeracyData = `Senal de matematicas: ${numeracyFocus.toLowerCase()} (${formatPercent(numeracyGap?.avg)} de dominio estimado, intensidad: ${numeracyTier}, confianza: ${numeracyConfidence}).`;
      const detailStrength = `Fortalezas: ${literacyStrengthText} (${formatPercent(literacyStrength?.avg)}) y ${numeracyStrengthText} (${formatPercent(numeracyStrength?.avg)}).`;
      if (intent === 'literacy') return [intro, literacyData, detailStrength, homeRoutine, close].join('\n\n');
      if (intent === 'numeracy') return [intro, numeracyData, detailStrength, homeRoutine, close].join('\n\n');
      if (intent === 'confidence') return [intro, detailStrength, homeRoutine, confidenceLine, close].join('\n\n');
      return [intro, literacyData, numeracyData, detailStrength, homeRoutine, close].join('\n\n');
    }

    if (intent === 'literacy') return [intro, literacyLine, strengthLine, homeRoutine, close].join('\n\n');
    if (intent === 'numeracy') return [intro, numeracyLine, strengthLine, homeRoutine, close].join('\n\n');
    if (intent === 'confidence') return [intro, strengthLine, homeRoutine, confidenceLine, close].join('\n\n');
    return [intro, literacyLine, numeracyLine, strengthLine, homeRoutine, close].join('\n\n');
  }

  function generateChineseParentMessage(model, intent, readingLevel) {
    const {
      learnerName,
      literacyGap,
      numeracyGap,
      literacyStrength,
      numeracyStrength,
      literacyFocus,
      numeracyFocus,
      literacyStrengthText,
      numeracyStrengthText,
      literacyTier,
      numeracyTier,
      literacyConfidence,
      numeracyConfidence
    } = model;
    const intro = `家长您好，这是${learnerName}本周期的学习简报。`;
    const literacyLine = `读写重点：${literacyFocus.toLowerCase()}。课堂流程是“教师示范-共同练习-独立迁移”。`;
    const numeracyLine = `数学重点：${numeracyFocus.toLowerCase()}。我们强调概念策略与表达，不只记忆步骤。`;
    const strengthLine = `当前优势：${literacyStrengthText.toLowerCase()}，以及${numeracyStrengthText.toLowerCase()}。`;
    const homeRoutine = '家庭练习（5-10分钟）：请孩子口头说明一个阅读策略和一个数学策略，再一起做一个例题。';
    const confidenceLine = '当孩子卡住时，可以先问：“你先告诉我你已经知道什么？”';
    const close = '感谢配合。我们会在下一个进度检查后再次更新。';

    if (readingLevel === 'plain') {
      const plainIntro = `${learnerName}本周学习更新如下。`;
      const plainLiteracy = `读写：${literacyFocus.toLowerCase()}。先示范，再一起练习，最后独立完成。`;
      const plainNumeracy = `数学：${numeracyFocus.toLowerCase()}。用图示、语言和步骤解释来解决问题。`;
      if (intent === 'literacy') return [plainIntro, plainLiteracy, strengthLine, homeRoutine, close].join('\n\n');
      if (intent === 'numeracy') return [plainIntro, plainNumeracy, strengthLine, homeRoutine, close].join('\n\n');
      if (intent === 'confidence') return [plainIntro, strengthLine, homeRoutine, confidenceLine, close].join('\n\n');
      return [plainIntro, plainLiteracy, plainNumeracy, strengthLine, homeRoutine, close].join('\n\n');
    }

    if (readingLevel === 'detailed') {
      const literacyData = `读写信号：${literacyFocus.toLowerCase()}（当前掌握度估计${formatPercent(literacyGap?.avg)}，支持强度${literacyTier}，置信度${literacyConfidence}）。`;
      const numeracyData = `数学信号：${numeracyFocus.toLowerCase()}（当前掌握度估计${formatPercent(numeracyGap?.avg)}，支持强度${numeracyTier}，置信度${numeracyConfidence}）。`;
      const detailStrength = `优势表现：${literacyStrengthText}（${formatPercent(literacyStrength?.avg)}）和${numeracyStrengthText}（${formatPercent(numeracyStrength?.avg)}）。`;
      if (intent === 'literacy') return [intro, literacyData, detailStrength, homeRoutine, close].join('\n\n');
      if (intent === 'numeracy') return [intro, numeracyData, detailStrength, homeRoutine, close].join('\n\n');
      if (intent === 'confidence') return [intro, detailStrength, homeRoutine, confidenceLine, close].join('\n\n');
      return [intro, literacyData, numeracyData, detailStrength, homeRoutine, close].join('\n\n');
    }

    if (intent === 'literacy') return [intro, literacyLine, strengthLine, homeRoutine, close].join('\n\n');
    if (intent === 'numeracy') return [intro, numeracyLine, strengthLine, homeRoutine, close].join('\n\n');
    if (intent === 'confidence') return [intro, strengthLine, homeRoutine, confidenceLine, close].join('\n\n');
    return [intro, literacyLine, numeracyLine, strengthLine, homeRoutine, close].join('\n\n');
  }

  function generateParentMessage(context = {}) {
    const intent = String(parentIntentEl?.value || 'balanced');
    const readingLevel = String(parentReadingLevelEl?.value || 'standard');
    const language = String(parentLanguageEl?.value || 'en');
    const model = buildParentMessageModel(context);
    if (language === 'es') return generateSpanishParentMessage(model, intent, readingLevel);
    if (language === 'zh') return generateChineseParentMessage(model, intent, readingLevel);
    return generateEnglishParentMessage(model, intent, readingLevel);
  }

  function generateParentStarterTemplate(context = {}) {
    const model = buildParentMessageModel(context);
    const language = String(parentLanguageEl?.value || 'en');
    const templateId = String(parentTemplateEl?.value || 'progress');

    if (templateId === 'home-routine') {
      if (language === 'es') {
        return [
          `Hola familia, esta semana estamos reforzando ${model.literacyFocus.toLowerCase()} en lectura y ${model.numeracyFocus.toLowerCase()} en matematicas.`,
          'Rutina sugerida (5-10 minutos):',
          '1) Lean una frase corta y expliquen la estrategia de lectura.',
          '2) Resuelvan un problema corto de matematicas y expliquen la estrategia en voz alta.',
          '3) Cierre con una celebracion especifica del esfuerzo.'
        ].join('\n');
      }
      if (language === 'zh') {
        return [
          `家长您好，本周我们在读写上强化${model.literacyFocus.toLowerCase()}，在数学上强化${model.numeracyFocus.toLowerCase()}。`,
          '建议家庭练习（5-10分钟）：',
          '1）读一句短文本，并说出所用阅读策略。',
          '2）做一道短数学题，并口头解释策略。',
          '3）最后具体表扬一次努力与坚持。'
        ].join('\n');
      }
      return [
        `Hello family, this week we are reinforcing ${model.literacyFocus.toLowerCase()} in literacy and ${model.numeracyFocus.toLowerCase()} in math.`,
        'Suggested home routine (5-10 minutes):',
        '1) Read one short line and name the reading strategy.',
        '2) Solve one short math item and explain the strategy out loud.',
        '3) End with one specific celebration of effort.'
      ].join('\n');
    }

    if (templateId === 'celebration') {
      if (language === 'es') {
        return [
          `Fortalezas para celebrar: ${model.literacyStrengthText.toLowerCase()} y ${model.numeracyStrengthText.toLowerCase()}.`,
          'Gracias por apoyar la practica diaria.',
          'Siguiente enfoque: mantener constancia y explicar estrategias con lenguaje claro.'
        ].join('\n');
      }
      if (language === 'zh') {
        return [
          `值得庆祝的优势：${model.literacyStrengthText.toLowerCase()}，以及${model.numeracyStrengthText.toLowerCase()}。`,
          '感谢您持续支持日常练习。',
          '下一步重点：保持练习频率，并用清晰语言解释策略。'
        ].join('\n');
      }
      return [
        `Strengths to celebrate: ${model.literacyStrengthText.toLowerCase()} and ${model.numeracyStrengthText.toLowerCase()}.`,
        'Thank you for supporting daily practice.',
        'Next focus: maintain consistency and strategy explanation language.'
      ].join('\n');
    }

    if (language === 'es') {
      return [
        `Resumen de progreso: ${model.learnerName} muestra avances en ${model.literacyStrengthText.toLowerCase()} y ${model.numeracyStrengthText.toLowerCase()}.`,
        `Foco actual: ${model.literacyFocus.toLowerCase()} + ${model.numeracyFocus.toLowerCase()}.`,
        'Siguiente paso: continuar practica corta, explicita y frecuente.'
      ].join('\n');
    }
    if (language === 'zh') {
      return [
        `进度概览：${model.learnerName}在${model.literacyStrengthText.toLowerCase()}和${model.numeracyStrengthText.toLowerCase()}方面有明显进展。`,
        `当前重点：${model.literacyFocus.toLowerCase()} + ${model.numeracyFocus.toLowerCase()}。`,
        '下一步：继续短时、高频、明确示范的练习。'
      ].join('\n');
    }
    return [
      `Progress snapshot: ${model.learnerName} is showing gains in ${model.literacyStrengthText.toLowerCase()} and ${model.numeracyStrengthText.toLowerCase()}.`,
      `Current focus: ${model.literacyFocus.toLowerCase()} + ${model.numeracyFocus.toLowerCase()}.`,
      'Next move: keep short, explicit, high-frequency practice.'
    ].join('\n');
  }

  function setParentMessageStatus(message, isError = false) {
    if (!parentMessageStatusEl) return;
    parentMessageStatusEl.textContent = message || '';
    parentMessageStatusEl.classList.toggle('error', !!isError);
    parentMessageStatusEl.classList.toggle('success', !isError && !!message);
  }

  function renderParentMessagePanel(context = {}) {
    if (!parentMessageOutputEl) return;
    const learner = context.learner || null;
    const messages = getParentMessagesForLearner(learner);
    const currentDraft = String(parentMessageInputEl?.value || '').trim();
    const latestSaved = messages[0] || null;
    const draft = currentDraft || latestSaved?.text || generateParentMessage(context);
    const writingProgress = context.writingProgress || latestWritingProgress || buildWritingProgressModel(learner);
    const parentWritingSummary = writingProgress?.parentSummary
      || 'Writing trend snapshot will appear after the first saved Writing Studio session.';

    if (parentMessageInputEl && !currentDraft) {
      parentMessageInputEl.value = draft;
    }

    latestParentMessageText = draft;

    const recentItems = messages.slice(0, 5).map((item) => `
      <li>
        <strong>${escapeHtml(parentIntentLabel(item.intent))}</strong> · ${escapeHtml(parentLanguageLabel(item.language || 'en'))} · ${escapeHtml(parentReadingLevelLabel(item.readingLevel || 'standard'))} · ${escapeHtml(new Date(Number(item.createdAt || Date.now())).toLocaleString())}
        <button class="secondary-btn report-parent-load-btn" type="button" data-parent-load="${escapeHtml(item.id)}">Load</button>
      </li>
    `).join('');

    parentMessageOutputEl.innerHTML = `
      <div class="report-builder-summary">
        <div><strong>Current parent-ready message (${escapeHtml(parentIntentLabel(parentIntentEl?.value || 'balanced'))} · ${escapeHtml(parentLanguageLabel(parentLanguageEl?.value || 'en'))} · ${escapeHtml(parentReadingLevelLabel(parentReadingLevelEl?.value || 'standard'))}):</strong></div>
        <div>${escapeHtml(draft).replace(/\n/g, '<br />')}</div>
      </div>
      <div class="report-bench-note"><strong>Parent writing snapshot:</strong> ${escapeHtml(parentWritingSummary)}</div>
      <div class="report-bench-note"><strong>Step Up alignment note:</strong> This approach follows the same structure used in school (Step Up to Writing), just in a digital, interactive way.</div>
      <div class="report-bench-note"><strong>Tip:</strong> Pair this text with a short recording clip in the Parent Partnership section.</div>
      <div class="report-builder-summary">
        <div><strong>Saved messages for this learner:</strong></div>
        <ul class="report-import-skip-summary">${recentItems || '<li>No saved parent messages yet.</li>'}</ul>
      </div>
    `;

    if (parentWritingTrendEl) {
      parentWritingTrendEl.innerHTML = `<strong>Writing trend snapshot:</strong> ${escapeHtml(parentWritingSummary)}`;
    }
  }

  function loadSavedParentMessageById(messageId, learner) {
    if (!messageId) return;
    const message = getParentMessagesForLearner(learner).find((row) => row.id === messageId);
    if (!message) return;
    if (parentMessageInputEl) parentMessageInputEl.value = message.text || '';
    if (parentIntentEl) parentIntentEl.value = message.intent || 'balanced';
    if (parentLanguageEl) parentLanguageEl.value = message.language || 'en';
    if (parentReadingLevelEl) parentReadingLevelEl.value = message.readingLevel || 'standard';
    if (parentTemplateEl) parentTemplateEl.value = message.template || 'progress';
    latestParentMessageText = message.text || '';
    if (latestParentContext) renderParentMessagePanel(latestParentContext);
    setParentMessageStatus('Loaded saved parent message.');
  }

  function generateParentMessageDraft() {
    if (!latestParentContext) {
      setParentMessageStatus('Refresh the report first to generate a parent message.', true);
      return;
    }
    const draft = generateParentMessage(latestParentContext);
    if (parentMessageInputEl) parentMessageInputEl.value = draft;
    latestParentMessageText = draft;
    renderParentMessagePanel(latestParentContext);
    setParentMessageStatus('Generated parent message draft.');
  }

  function applyParentStarterTemplate() {
    if (!latestParentContext) {
      setParentMessageStatus('Refresh the report first, then apply a starter template.', true);
      return;
    }
    const draft = generateParentStarterTemplate(latestParentContext);
    if (parentMessageInputEl) parentMessageInputEl.value = draft;
    latestParentMessageText = draft;
    renderParentMessagePanel(latestParentContext);
    setParentMessageStatus(`Applied ${parentTemplateLabel(parentTemplateEl?.value || 'progress')} in ${parentLanguageLabel(parentLanguageEl?.value || 'en')}.`);
  }

  function saveParentMessageDraft() {
    if (!latestParentContext) {
      setParentMessageStatus('Refresh the report first, then save a parent message.', true);
      return;
    }
    const text = String(parentMessageInputEl?.value || '').trim();
    if (!text) {
      setParentMessageStatus('Write or generate a message before saving.', true);
      return;
    }
    const saved = saveParentMessageForLearner(latestParentContext.learner, {
      intent: String(parentIntentEl?.value || 'balanced'),
      readingLevel: String(parentReadingLevelEl?.value || 'standard'),
      language: String(parentLanguageEl?.value || 'en'),
      template: String(parentTemplateEl?.value || 'progress'),
      text
    });
    latestParentMessageText = saved.text || text;
    renderParentMessagePanel(latestParentContext);
    setParentMessageStatus('Parent message saved.');
  }

  async function copyParentMessageDraft() {
    const text = String(parentMessageInputEl?.value || latestParentMessageText || '').trim();
    if (!text) {
      setParentMessageStatus('Generate or write a parent message first.', true);
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('clipboard-unavailable');
      }
      setParentMessageStatus('Parent message copied.');
    } catch {
      setParentMessageStatus('Clipboard unavailable. Copy directly from the message card.', true);
    }
  }

  function recommendRolePathwayId(pulse) {
    const topDomain = pulse?.gaps?.[0]?.domain || '';
    if (topDomain === 'general') return 'teacher';
    if (topDomain === 'fluency') return 'slp';
    if (topDomain === 'executive-function') return 'counselor';
    if (topDomain === 'comprehension' || topDomain === 'written-language') return 'eal';
    return 'learning-support';
  }

  function normalizeRoleFromQuery(rawRole) {
    const raw = String(rawRole || '').trim().toLowerCase();
    if (!raw) return '';
    const aliasMap = {
      sped: 'learning-support',
      'learning-support': 'learning-support',
      'learning_support': 'learning-support',
      ls: 'learning-support',
      eal: 'eal',
      ell: 'eal',
      esl: 'eal',
      teacher: 'teacher',
      classroom: 'teacher',
      admin: 'admin',
      administrator: 'admin',
      dean: 'dean',
      slp: 'slp',
      speech: 'slp',
      counselor: 'counselor',
      counselling: 'counselor',
      psych: 'psychologist',
      psychologist: 'psychologist',
      schoolpsych: 'psychologist',
      'school-psychologist': 'psychologist',
      'school-counselor': 'counselor',
      'sel-counselor': 'sel-counselor',
      leadership: 'admin',
      leader: 'admin',
      parent: 'parent',
      caregiver: 'parent',
      family: 'parent'
    };
    return aliasMap[raw] || '';
  }

  function applyInitialRoleFromQuery() {
    if (!roleSelectEl) return;
    const params = new URLSearchParams(window.location.search || '');
    const roleFromQuery = normalizeRoleFromQuery(params.get('role'));
    if (!roleFromQuery || !ROLE_PATHWAY_LIBRARY[roleFromQuery]) return;
    roleSelectEl.value = roleFromQuery;
    roleSelectEl.dataset.manualRole = 'true';
    if (protocolRoleEl) {
      const hasProtocolRole = Array.from(protocolRoleEl.options || []).some((option) => option.value === roleFromQuery);
      if (hasProtocolRole) protocolRoleEl.value = roleFromQuery;
    }
  }

  function getRoleStepHref(step, context = {}) {
    if (!step?.activity) return '#';
    if (step.activity === 'teacher-report') {
      return step.anchor || 'teacher-report.html';
    }
    return getActivityHref(step.activity, context);
  }

  function normalizeRoleId(roleId) {
    if (roleId === 'leadership') return 'admin';
    if (roleId === 'sel-counselor') return 'counselor';
    return roleId;
  }

  function renderRolePathway(context = {}) {
    if (!rolePathwayEl || !roleSelectEl) return;
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const placementRec = context.placementRec || null;
    const logs = Array.isArray(context.logs) ? context.logs : [];
    const numeracyLogs = Array.isArray(context.numeracyLogs) ? context.numeracyLogs : [];
    const preferredRoleId = recommendRolePathwayId(pulse);

    if (!roleSelectEl.value || !ROLE_PATHWAY_LIBRARY[roleSelectEl.value]) {
      roleSelectEl.value = preferredRoleId;
    }

    const roleIdRaw = roleSelectEl.value || preferredRoleId;
    const roleId = normalizeRoleId(roleIdRaw);
    const pathway = ROLE_PATHWAY_LIBRARY[roleId] || ROLE_PATHWAY_LIBRARY['learning-support'];
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const focusProfile = FOCUS_LIBRARY[pathway.focusId] || FOCUS_LIBRARY['comprehension-evidence'];
    const defaultWordQuest = focusProfile.wordQuestFocusByBand?.[gradeBand] || { focus: 'all', len: 'any' };
    const wordQuestFocus = placementRec?.focus || defaultWordQuest.focus;
    const wordQuestLength = placementRec?.length || defaultWordQuest.len;
    const urgentDomain = pulse?.traffic?.red?.[0] || 'No urgent domain currently flagged.';
    const topPriority = pulse?.topPriority || 'Run at least 3 scored sessions to produce stronger role-specific recommendations.';
    const latestParentMessage = getLatestParentMessage(learner);
    const parentMessagePreview = latestParentMessage?.text
      ? latestParentMessage.text.slice(0, 220)
      : '';
    const literacyTier = pulse?.engine?.tierRecommendation?.tierLabel || 'Tier recommendation pending';
    const numeracyTier = numeracyPulse?.engine?.tierRecommendation?.tierLabel || 'Tier recommendation pending';
    const literacyConfidence = pulse?.engine?.evidence?.confidenceLabel || 'Early signal';
    const numeracyConfidence = numeracyPulse?.engine?.evidence?.confidenceLabel || 'Early signal';
    const recentLiteracy = logs.filter((entry) => Number(entry?.ts || 0) >= (Date.now() - (7 * 24 * 60 * 60 * 1000))).length;
    const recentNumeracy = numeracyLogs.filter((entry) => Number(entry?.ts || 0) >= (Date.now() - (7 * 24 * 60 * 60 * 1000))).length;
    const topLiteracyGap = pulse?.gaps?.[0]?.label || 'Need more literacy evidence';
    const topNumeracyGap = numeracyPulse?.gaps?.[0]?.label || 'Need more numeracy evidence';
    const topLiteracyStrength = pulse?.strengths?.[0]?.label || 'No clear literacy strength yet';
    const topNumeracyStrength = numeracyPulse?.strengths?.[0]?.label || 'No clear numeracy strength yet';
    const guidance = ROLE_PROTOCOL_GUIDANCE[roleId] || ROLE_PROTOCOL_GUIDANCE['learning-support'];

    const baseContext = {
      wordQuestFocus,
      wordQuestLength,
      builderFocus: pathway.focusId,
      builderGradeBand: gradeBand,
      builderMinutes: 20
    };

    const stepLines = [];
    const stepCards = pathway.steps.map((step, index) => {
      const label = step.label || ACTIVITY_LABELS[step.activity] || step.activity;
      const href = getRoleStepHref(step, baseContext);
      const openLabel = step.activity === 'teacher-report'
        ? `Open ${label}`
        : `Open ${ACTIVITY_LABELS[step.activity] || label}`;
      stepLines.push(`${index + 1}) ${label} (${step.minutes} min)`);
      stepLines.push(`   ${step.move}`);
      stepLines.push(`   ${href}`);
      return `
        <article class="report-role-step">
          <div class="report-role-phase">${index + 1}. ${escapeHtml(label)} · ${escapeHtml(step.minutes)} min</div>
          <div class="report-role-move">${escapeHtml(step.move)}</div>
          <a class="secondary-btn report-role-link" href="${href}">${escapeHtml(openLabel)}</a>
        </article>
      `;
    }).join('');

    const dashboardCards = [
      {
        title: 'Signal Snapshot',
        lines: [
          `Top literacy gap: ${topLiteracyGap}`,
          `Top numeracy gap: ${topNumeracyGap}`,
          `Urgent lane: ${urgentDomain}`
        ]
      },
      {
        title: 'Intensity + Confidence',
        lines: [
          `Literacy intensity: ${literacyTier}`,
          `Numeracy intensity: ${numeracyTier}`,
          `Confidence: ${literacyConfidence} / ${numeracyConfidence}`
        ]
      },
      {
        title: 'Weekly Evidence',
        lines: [
          `Literacy logs (7 days): ${recentLiteracy}`,
          `Numeracy logs (7 days): ${recentNumeracy}`,
          `Grade band: ${gradeBand}`
        ]
      },
      {
        title: 'Team Handoff',
        lines: [
          `Progress lens: ${guidance.progressLens}`,
          `Handoff: ${guidance.handoff}`,
          `Family bridge: ${guidance.familyBridge}`
        ]
      }
    ];

    const dashboardHtml = dashboardCards
      .map((card) => `
        <article class="report-role-dashboard-card">
          <h3>${escapeHtml(card.title)}</h3>
          <ul>${card.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
        </article>
      `)
      .join('');
    if (roleDashboardEl) {
      roleDashboardEl.innerHTML = `<div class="report-role-dashboard-grid">${dashboardHtml}</div>`;
    }

    latestRolePathwayText = [
      `${pathway.label} Launch Pathway`,
      `Grade band: ${gradeBand}`,
      `Team fit: ${pathway.fit}`,
      `Goal: ${pathway.goal}`,
      `Top priority: ${topPriority}`,
      `Urgent lane: ${urgentDomain}`,
      `Literacy intensity/confidence: ${literacyTier} / ${literacyConfidence}`,
      `Numeracy intensity/confidence: ${numeracyTier} / ${numeracyConfidence}`,
      `Top strengths: ${topLiteracyStrength}; ${topNumeracyStrength}`,
      `Evidence (7 days): literacy ${recentLiteracy}, numeracy ${recentNumeracy}`,
      ...(roleId === 'parent'
        ? [
          `Latest parent message: ${parentMessagePreview || 'No saved parent message yet. Open Parent Partnership Pathway to draft one.'}`
        ]
        : []),
      '',
      ...stepLines
    ].join('\n');

    rolePathwayEl.innerHTML = `
      <div class="report-role-summary">
        <div><strong>${escapeHtml(pathway.label)}</strong> · ${escapeHtml(pathway.fit)}</div>
        <div>${escapeHtml(pathway.goal)}</div>
        <div><strong>Current top priority:</strong> ${escapeHtml(topPriority)}</div>
        <div><strong>Urgent lane from R/Y/G:</strong> ${escapeHtml(urgentDomain)}</div>
        <div><strong>Top strengths:</strong> ${escapeHtml(topLiteracyStrength)} · ${escapeHtml(topNumeracyStrength)}</div>
        ${roleId === 'parent'
          ? `<div><strong>Latest parent message:</strong> ${escapeHtml(parentMessagePreview || 'No saved parent message yet. Use Parent Partnership Pathway to create one.')}</div>`
          : ''}
      </div>
      <div class="report-role-steps">${stepCards}</div>
      <div class="report-role-note">Suggested routine: keep this loop to 20 minutes daily and refresh the report weekly.</div>
    `;
    if (roleStatusEl) roleStatusEl.textContent = '';
  }

  async function copyRolePathway() {
    if (!latestRolePathwayText) {
      if (roleStatusEl) roleStatusEl.textContent = 'Refresh report first to generate a role pathway.';
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestRolePathwayText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      if (roleStatusEl) roleStatusEl.textContent = 'Role pathway copied.';
    } catch {
      if (roleStatusEl) roleStatusEl.textContent = 'Clipboard unavailable. Copy directly from the pathway cards.';
    }
  }

  function setClassBlockStatus(message, isError = false) {
    if (!classBlockStatusEl) return;
    classBlockStatusEl.textContent = message || '';
    classBlockStatusEl.classList.toggle('error', !!isError);
    classBlockStatusEl.classList.toggle('success', !isError && !!message);
  }

  function getClassBlockLibrary() {
    return window.CORNERSTONE_CLASS_BLOCKS || null;
  }

  function getClassBlockLaunchLogs() {
    const classBlocks = getClassBlockLibrary();
    if (!classBlocks?.readLaunchLogs) return [];
    const rows = classBlocks.readLaunchLogs();
    return Array.isArray(rows) ? rows : [];
  }

  function normalizeClassBlockRole(value) {
    const classBlocks = getClassBlockLibrary();
    if (!classBlocks?.normalizeRole) return 'teacher';
    return classBlocks.normalizeRole(value || 'teacher');
  }

  function resolveClassBlockGradeBand(context = {}) {
    if (classBlockGradeEl?.value) {
      return normalizeGradeBand(classBlockGradeEl.value);
    }
    return normalizeGradeBand(context.learner?.gradeBand || builderGradeEl?.value || '3-5');
  }

  function getClassBlockStepHref(step, context = {}) {
    if (!step?.activity) return '#';
    if (step.activity === 'teacher-report') {
      return '#report-intervention-timeline';
    }
    const numeracyActivities = new Set(['number-sense', 'operations', 'problem-solving', 'math-language']);
    return getActivityHref(step.activity, {
      numeracyMode: numeracyActivities.has(step.activity),
      wordQuestFocus: context.wordQuestFocus || 'all',
      wordQuestLength: context.wordQuestLength || 'any',
      builderGradeBand: context.gradeBand || '3-5',
      builderFocus: context.builderFocus || 'comprehension-evidence',
      builderMinutes: context.builderMinutes || 20
    });
  }

  function renderClassBlockLauncher(context = {}) {
    if (!classBlockGridEl) return;
    const classBlocks = getClassBlockLibrary();
    if (!classBlocks?.buildPlansForRole) {
      classBlockGridEl.innerHTML = '<div class="report-bench-note">Class block presets are unavailable. Reload to restore launcher data.</div>';
      setClassBlockStatus('Class block presets unavailable.', true);
      return;
    }

    if (classBlockRoleEl && !classBlockRoleEl.dataset.manualRole && roleSelectEl?.value) {
      classBlockRoleEl.value = normalizeClassBlockRole(roleSelectEl.value);
    }
    const roleId = normalizeClassBlockRole(classBlockRoleEl?.value || roleSelectEl?.value || 'teacher');
    if (classBlockRoleEl && classBlockRoleEl.value !== roleId) {
      classBlockRoleEl.value = roleId;
    }
    const learnerGradeBand = normalizeGradeBand(context.learner?.gradeBand || builderGradeEl?.value || '3-5');
    if (classBlockGradeEl && !classBlockGradeEl.dataset.manualGrade) {
      classBlockGradeEl.value = learnerGradeBand;
    }
    const gradeBand = resolveClassBlockGradeBand(context);
    if (classBlockGradeEl && classBlockGradeEl.value !== gradeBand) {
      classBlockGradeEl.value = gradeBand;
    }

    const plans = classBlocks.buildPlansForRole({ roleId, gradeBand });
    const placementRec = context.placementRec || {};
    const cardsHtml = plans.map((plan) => {
      const launchStep = plan.launchStep || plan.steps[0] || null;
      const launchHref = launchStep
        ? getClassBlockStepHref(launchStep, {
          ...context,
          gradeBand,
          wordQuestFocus: placementRec.focus || 'all',
          wordQuestLength: placementRec.length || 'any'
        })
        : '#';
      const stepList = plan.steps.map((step) => {
        const href = getClassBlockStepHref(step, {
          ...context,
          gradeBand,
          wordQuestFocus: placementRec.focus || 'all',
          wordQuestLength: placementRec.length || 'any'
        });
        return `<li><a class="report-pulse-link" href="${escapeHtml(href)}">${escapeHtml(step.activityLabel)}</a> · ${escapeHtml(String(step.minutes))} min</li>`;
      }).join('');
      return `
        <article class="report-class-block-card">
          <div class="report-class-block-head">
            <div class="report-class-block-title">${escapeHtml(plan.title)}</div>
            <div class="report-class-block-meta">${escapeHtml(gradeBand)}</div>
          </div>
          <div class="report-class-block-summary">${escapeHtml(plan.summary)}</div>
          <ul class="report-class-block-steps">${stepList}</ul>
          <div class="report-class-block-actions">
            <a
              class="primary-btn report-class-block-launch"
              href="${escapeHtml(launchHref)}"
              data-source="teacher-report"
              data-role-id="${escapeHtml(roleId)}"
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
          </div>
        </article>
      `;
    }).join('');

    classBlockGridEl.innerHTML = cardsHtml;
    setClassBlockStatus(`Launcher ready for ${classBlocks.roleLabel(roleId)} (${gradeBand}).`);
  }

  function logClassBlockLaunchFromElement(element) {
    const classBlocks = getClassBlockLibrary();
    if (!classBlocks?.appendLaunchLog) return;
    const minutes = Number(element.getAttribute('data-minutes') || 20);
    const roleId = normalizeClassBlockRole(element.getAttribute('data-role-id') || 'teacher');
    const roleLabel = classBlocks.roleLabel(roleId);
    classBlocks.appendLaunchLog({
      source: String(element.getAttribute('data-source') || 'teacher-report'),
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
    setClassBlockStatus(`Logged launch: ${minutes}-minute block (${roleLabel}).`);
    if (latestIespContext) {
      latestIespContext.classBlockLogs = getClassBlockLaunchLogs();
      renderInterventionTimeline(latestIespContext);
    }
  }

  function resolveIespTrack() {
    const selected = String(iespTrackEl?.value || 'integrated');
    if (selected === 'literacy' || selected === 'numeracy' || selected === 'integrated') return selected;
    return 'integrated';
  }

  function resolveIespCycleWeeks() {
    const cycle = Number(iespCycleEl?.value || 6);
    if (cycle === 4 || cycle === 6 || cycle === 8 || cycle === 12) return cycle;
    return 6;
  }

  function resolveIespOwnerRole() {
    const selected = String(iespOwnerEl?.value || 'teacher');
    const normalized = normalizeRoleId(selected);
    return ROLE_PATHWAY_LIBRARY[normalized] ? normalized : 'teacher';
  }

  function normalizeTimelineTrack(track) {
    const raw = String(track || '').trim().toLowerCase();
    if (raw === 'numeracy') return 'numeracy';
    if (raw === 'manual') return 'manual';
    return 'literacy';
  }

  function resolveTimelineFilterTrack() {
    const selected = String(timelineFilterTrackEl?.value || 'all').toLowerCase();
    if (selected === 'literacy' || selected === 'numeracy' || selected === 'manual') return selected;
    return 'all';
  }

  function resolveTimelineFilterWindowDays() {
    const selected = String(timelineFilterWindowEl?.value || '30').toLowerCase();
    if (selected === 'all') return null;
    const value = Number(selected);
    if (value === 7 || value === 14 || value === 30 || value === 90) return value;
    return 30;
  }

  function formatTimelineInputDate(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  function setDefaultTimelineManualWhen() {
    if (!timelineManualWhenEl || timelineManualWhenEl.value) return;
    timelineManualWhenEl.value = formatTimelineInputDate(Date.now());
  }

  function parseTimelineInputDate(value) {
    const raw = String(value || '').trim();
    if (!raw) return Date.now();
    const parsed = new Date(raw);
    const ts = parsed.getTime();
    if (Number.isNaN(ts)) return Date.now();
    return ts;
  }

  function loadManualTimelineEntries() {
    const parsed = safeParse(localStorage.getItem(TIMELINE_MANUAL_KEY) || '');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => ({
        id: String(entry?.id || ''),
        ts: Number(entry?.ts || 0),
        track: normalizeTimelineTrack(entry?.track || 'manual'),
        label: String(entry?.label || '').trim(),
        event: String(entry?.event || '').trim(),
        note: String(entry?.note || '').trim(),
        owner: String(entry?.owner || '').trim()
      }))
      .filter((entry) => entry.id && entry.ts > 0 && entry.label && entry.event && entry.note)
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 120);
  }

  function saveManualTimelineEntries(entries) {
    const list = Array.isArray(entries) ? entries : [];
    localStorage.setItem(TIMELINE_MANUAL_KEY, JSON.stringify(list.slice(0, 120)));
  }

  function setTimelineStatus(message, isError = false) {
    if (!timelineStatusEl) return;
    timelineStatusEl.textContent = message || '';
    timelineStatusEl.classList.toggle('error', !!isError);
    timelineStatusEl.classList.toggle('success', !isError && !!message);
  }

  function timelineTrackLabel(track) {
    if (track === 'manual') return 'Team Log';
    if (track === 'numeracy') return 'Numeracy';
    return 'Literacy';
  }

  function buildInterventionTimelineEntries(context = {}) {
    const literacyLogs = Array.isArray(context.logs) ? context.logs : [];
    const numeracyLogs = Array.isArray(context.numeracyLogs) ? context.numeracyLogs : [];
    const classBlockLogs = Array.isArray(context.classBlockLogs) ? context.classBlockLogs : getClassBlockLaunchLogs();
    const manualTimelineLogs = Array.isArray(context.manualTimelineLogs) ? context.manualTimelineLogs : loadManualTimelineEntries();

    const mappedLiteracy = literacyLogs.map((entry) => {
      const score = scoreEntry(entry);
      const domain = activityDomain(entry?.activity || '');
      const domainName = domainLabel(domain);
      return {
        ts: Number(entry?.ts || 0),
        track: 'literacy',
        source: 'activity',
        label: entry?.label || ACTIVITY_LABELS[entry?.activity] || 'Literacy activity',
        event: String(entry?.event || 'Logged update'),
        note: `${domainName}${typeof score === 'number' && !Number.isNaN(score) ? ` · ${formatPercent(score)}` : ''}`
      };
    });

    const mappedNumeracy = numeracyLogs.map((entry) => {
      const score = numeracyScoreEntry(entry);
      const domain = String(entry?.detail?.domain || numeracyActivityDomain(entry?.activity || ''));
      const domainName = numeracyDomainLabel(domain);
      return {
        ts: Number(entry?.ts || 0),
        track: 'numeracy',
        source: 'activity',
        label: entry?.label || NUMERACY_ACTIVITY_LABELS[entry?.activity] || 'Numeracy activity',
        event: String(entry?.event || 'Logged update'),
        note: `${domainName}${typeof score === 'number' && !Number.isNaN(score) ? ` · ${formatPercent(score)}` : ''}`
      };
    });

    const mappedClassBlocks = classBlockLogs.map((entry) => {
      const minutes = Number(entry?.minutes || 0);
      const roleLabel = String(entry?.roleLabel || entry?.roleId || 'Team');
      const blockTitle = String(entry?.blockTitle || `Class block ${minutes || ''} min`).trim();
      const launchLabel = String(entry?.launchActivityLabel || entry?.launchActivity || 'next activity');
      const track = String(entry?.track || '').toLowerCase() === 'numeracy' ? 'numeracy' : 'literacy';
      const launchMeta = launchLabel ? ` · starts with ${launchLabel}` : '';
      return {
        ts: Number(entry?.ts || 0),
        track,
        source: 'class-block',
        label: 'Class Block Launcher',
        event: `${roleLabel} launched ${minutes || 20}-minute block`,
        note: `${blockTitle}${launchMeta}`
      };
    });

    const mappedManual = manualTimelineLogs.map((entry) => {
      const owner = String(entry?.owner || '').trim();
      const ownerNote = owner ? `${owner} · ` : '';
      return {
        ts: Number(entry?.ts || 0),
        track: normalizeTimelineTrack(entry?.track || 'manual'),
        source: 'manual',
        label: String(entry?.label || 'Manual intervention note'),
        event: String(entry?.event || 'Team update'),
        note: `${ownerNote}${String(entry?.note || '').trim()}`
      };
    });

    return [...mappedLiteracy, ...mappedNumeracy, ...mappedClassBlocks, ...mappedManual]
      .filter((row) => row.ts > 0)
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 80);
  }

  function filterTimelineRows(rows = []) {
    const trackFilter = resolveTimelineFilterTrack();
    const windowDays = resolveTimelineFilterWindowDays();
    const query = String(timelineFilterSearchEl?.value || '').trim().toLowerCase();
    const cutoff = windowDays ? (Date.now() - (windowDays * 24 * 60 * 60 * 1000)) : 0;
    return rows.filter((row) => {
      if (trackFilter === 'manual' && row.source !== 'manual') return false;
      if ((trackFilter === 'literacy' || trackFilter === 'numeracy') && row.track !== trackFilter) return false;
      if (cutoff && row.ts < cutoff) return false;
      if (query) {
        const haystack = [
          row.label,
          row.event,
          row.note,
          row.track,
          row.source
        ].join(' ').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }

  function renderInterventionTimeline(context = {}) {
    if (!interventionTimelineEl) return;
    const rows = buildInterventionTimelineEntries(context);
    if (!rows.length) {
      interventionTimelineEl.innerHTML = '<div class="report-bench-note">No intervention evidence yet. Run activities, then refresh this report.</div>';
      latestTimelineText = '';
      latestTimelineRows = [];
      return;
    }

    const filteredRows = filterTimelineRows(rows);
    if (!filteredRows.length) {
      interventionTimelineEl.innerHTML = '<div class="report-bench-note">No timeline entries match the current filters. Adjust track, window, or search.</div>';
      latestTimelineText = '';
      latestTimelineRows = [];
      return;
    }

    const displayRows = filteredRows.slice(0, 24);
    const trackFilter = resolveTimelineFilterTrack();
    const windowDays = resolveTimelineFilterWindowDays();
    const recencyLabel = windowDays ? `last ${windowDays} days` : 'all time';
    const trackLabel = trackFilter === 'all'
      ? 'all tracks'
      : (trackFilter === 'manual' ? 'manual notes only' : `${timelineTrackLabel(trackFilter)} only`);

    const itemsHtml = displayRows.map((row) => `
      <article class="report-timeline-item">
        <div class="report-timeline-item-head">
          <span class="report-timeline-track ${row.track === 'numeracy' ? 'numeracy' : row.track === 'manual' ? 'manual' : 'literacy'}">${escapeHtml(timelineTrackLabel(row.track))}</span>
          <span>${escapeHtml(new Date(row.ts).toLocaleString())}</span>
        </div>
        <div class="report-timeline-event">${escapeHtml(row.label)}: ${escapeHtml(row.event)}</div>
        <div class="report-timeline-note">${escapeHtml(row.note)}</div>
      </article>
    `).join('');

    interventionTimelineEl.innerHTML = `
      <div class="report-builder-summary">
        <div><strong>Live intervention timeline:</strong> latest literacy + numeracy evidence for team review.</div>
        <div><strong>Showing:</strong> ${displayRows.length} of ${filteredRows.length} entries (${escapeHtml(trackLabel)}, ${escapeHtml(recencyLabel)}).</div>
      </div>
      <div class="report-timeline-list">${itemsHtml}</div>
    `;

    latestTimelineRows = filteredRows.slice(0, 80);
    latestTimelineText = latestTimelineRows.map((row) => {
      const stamp = new Date(row.ts).toLocaleString();
      const sourceLabel = row.source === 'manual' ? 'Manual' : row.source === 'class-block' ? 'Class block' : 'Activity';
      return `[${stamp}] ${timelineTrackLabel(row.track)} · ${row.label}: ${row.event} (${row.note}) [${sourceLabel}]`;
    }).join('\n');
  }

  function setIespStatus(message, isError = false) {
    if (!iespStatusEl) return;
    iespStatusEl.textContent = message || '';
    iespStatusEl.classList.toggle('error', !!isError);
    iespStatusEl.classList.toggle('success', !isError && !!message);
  }

  function addManualTimelineEntry() {
    const label = String(timelineManualLabelEl?.value || '').trim();
    const event = String(timelineManualEventEl?.value || '').trim() || 'Team update';
    const note = String(timelineManualNoteEl?.value || '').trim();
    const owner = String(timelineManualOwnerEl?.value || '').trim();
    const track = normalizeTimelineTrack(timelineManualTrackEl?.value || 'manual');

    if (!label) {
      setTimelineStatus('Add a short activity/routine label before saving the note.', true);
      return;
    }
    if (!note) {
      setTimelineStatus('Add a quick note so the team can act on this timeline entry.', true);
      return;
    }

    const ts = parseTimelineInputDate(timelineManualWhenEl?.value || '');
    const current = loadManualTimelineEntries();
    const entry = {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts,
      track,
      label,
      event,
      note,
      owner
    };
    const updated = [entry].concat(current).slice(0, 120);
    saveManualTimelineEntries(updated);

    if (timelineManualNoteEl) timelineManualNoteEl.value = '';
    if (timelineManualLabelEl) timelineManualLabelEl.value = '';
    if (timelineManualEventEl) timelineManualEventEl.value = '';
    if (timelineManualWhenEl) timelineManualWhenEl.value = formatTimelineInputDate(Date.now());

    if (latestIespContext) {
      latestIespContext.manualTimelineLogs = updated;
      renderInterventionTimeline(latestIespContext);
      renderIespDraft(latestIespContext);
    } else {
      renderInterventionTimeline({ manualTimelineLogs: updated });
    }

    if (latestSprintContext) {
      latestSprintContext.manualTimelineLogs = updated;
      renderSprintBoard(latestSprintContext);
    }

    setTimelineStatus('Manual intervention note added to timeline.');
    setIespStatus('IESP draft refreshed with latest timeline evidence.');
  }

  function clearManualTimelineEntries() {
    saveManualTimelineEntries([]);
    if (latestIespContext) {
      latestIespContext.manualTimelineLogs = [];
      renderInterventionTimeline(latestIespContext);
      renderIespDraft(latestIespContext);
    } else {
      renderInterventionTimeline({ manualTimelineLogs: [] });
    }
    if (latestSprintContext) {
      latestSprintContext.manualTimelineLogs = [];
      renderSprintBoard(latestSprintContext);
    }
    setTimelineStatus('Manual timeline notes cleared.');
    setIespStatus('IESP draft refreshed after clearing manual notes.');
    if (timelineManualWhenEl) timelineManualWhenEl.value = formatTimelineInputDate(Date.now());
  }

  function seedDemoManualTimelineEntries() {
    const context = latestIespContext || {};
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const ownerRole = resolveIespOwnerRole();
    const ownerLabel = ROLE_PATHWAY_LIBRARY[ownerRole]?.label || 'Teacher';
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const litPriority = pulse?.gaps?.[0]?.label || 'decoding accuracy and transfer';
    const numPriority = numeracyPulse?.gaps?.[0]?.label || 'number sense strategy use';
    const litStrength = pulse?.strengths?.[0]?.label || 'fluency momentum';
    const numStrength = numeracyPulse?.strengths?.[0]?.label || 'strategy explanation language';

    const demoRows = [
      {
        ts: now - (6 * day),
        track: 'literacy',
        label: 'Tiered literacy regroup',
        event: 'R/Y/G groups adjusted from pulse',
        note: `Red lane prioritized around ${litPriority}.`,
        owner: ownerLabel
      },
      {
        ts: now - (5 * day),
        track: 'numeracy',
        label: 'Conceptual strategy mini-lesson',
        event: 'Manipulative-first routine launched',
        note: `Targeted ${numPriority} with think-aloud modeling.`,
        owner: ownerLabel
      },
      {
        ts: now - (4 * day),
        track: 'manual',
        label: 'Family bridge message',
        event: 'Parent update sent',
        note: 'Shared one literacy and one numeracy at-home routine in plain language.',
        owner: ownerLabel
      },
      {
        ts: now - (3 * day),
        track: 'literacy',
        label: 'Guided transfer check',
        event: 'Student evidence reviewed',
        note: `Most consistent strength observed in ${litStrength}.`,
        owner: ownerLabel
      },
      {
        ts: now - (2 * day),
        track: 'numeracy',
        label: 'Cooldown reteach cycle',
        event: 'Flexible group reteach complete',
        note: `Students showed stronger carryover in ${numStrength}.`,
        owner: ownerLabel
      },
      {
        ts: now - day,
        track: 'manual',
        label: 'Case review prep',
        event: 'IESP/sprint artifacts updated',
        note: 'Timeline, goals, and progress checks aligned for team meeting.',
        owner: ownerLabel
      }
    ].map((entry, index) => ({
      ...entry,
      id: `demo-${now}-${index}`,
      track: normalizeTimelineTrack(entry.track)
    }));

    const existing = loadManualTimelineEntries().filter((entry) => !String(entry.id || '').startsWith('demo-'));
    const updated = demoRows.concat(existing).sort((a, b) => b.ts - a.ts).slice(0, 120);
    saveManualTimelineEntries(updated);

    if (latestIespContext) {
      latestIespContext.manualTimelineLogs = updated;
      renderInterventionTimeline(latestIespContext);
      renderIespDraft(latestIespContext);
    } else {
      renderInterventionTimeline({ manualTimelineLogs: updated });
    }
    if (latestSprintContext) {
      latestSprintContext.manualTimelineLogs = updated;
      renderSprintBoard(latestSprintContext);
    }

    setTimelineStatus('Demo timeline generated with six intervention checkpoints.');
    setIespStatus('IESP draft refreshed with demo timeline evidence.');
  }

  function exportTimelineCsv() {
    if (!latestTimelineRows.length) {
      setTimelineStatus('No timeline rows to export. Refresh report or adjust filters.', true);
      return;
    }

    const csvEscape = (value) => {
      const text = String(value ?? '');
      if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
      return text;
    };

    const headers = ['date', 'time', 'track', 'source', 'label', 'event', 'note'];
    const lines = [headers.join(',')];
    latestTimelineRows.forEach((row) => {
      const date = new Date(row.ts);
      const dateText = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
      const timeText = Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString();
      lines.push([
        dateText,
        timeText,
        timelineTrackLabel(row.track),
        row.source || 'activity',
        row.label || '',
        row.event || '',
        row.note || ''
      ].map(csvEscape).join(','));
    });

    const learnerName = latestIespContext?.learner?.name || 'learner';
    const learnerSlug = slugify(learnerName || 'learner');
    const dateSlug = buildDateSlug(new Date());
    const fileName = `intervention-timeline-${learnerSlug}-${dateSlug}.csv`;
    downloadBlobFile(fileName, new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
    setTimelineStatus('Timeline CSV exported.');
  }

  function buildIespDraft(context = {}) {
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const track = resolveIespTrack();
    const cycleWeeks = resolveIespCycleWeeks();
    const ownerRole = resolveIespOwnerRole();
    const ownerLabel = ROLE_PATHWAY_LIBRARY[ownerRole]?.label || 'Teacher';
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const learnerName = learner?.name || 'Learner';
    const litGap = pulse?.gaps?.[0] || null;
    const numGap = numeracyPulse?.gaps?.[0] || null;
    const litStrength = pulse?.strengths?.[0] || null;
    const numStrength = numeracyPulse?.strengths?.[0] || null;
    const litTier = pulse?.engine?.tierRecommendation?.tierLabel || 'Tier 2';
    const numTier = numeracyPulse?.engine?.tierRecommendation?.tierLabel || 'Tier 2';
    const litBaseline = litGap?.avg;
    const numBaseline = numGap?.avg;
    const litTarget = typeof litBaseline === 'number' ? clamp(litBaseline + 0.12, 0.15, 0.97) : null;
    const numTarget = typeof numBaseline === 'number' ? clamp(numBaseline + 0.12, 0.15, 0.97) : null;
    const reviewDate = new Date(Date.now() + (cycleWeeks * 7 * 24 * 60 * 60 * 1000));
    const timelineRows = buildInterventionTimelineEntries(context).slice(0, 5);
    const ownerGuidance = ROLE_PROTOCOL_GUIDANCE[ownerRole] || ROLE_PROTOCOL_GUIDANCE['learning-support'];

    const presentLevels = [];
    if (track !== 'numeracy') {
      presentLevels.push(`Literacy present level: ${litGap?.label || 'Need baseline literacy evidence'} (${formatPercent(litBaseline)}), support intensity ${litTier}.`);
    }
    if (track !== 'literacy') {
      presentLevels.push(`Numeracy present level: ${numGap?.label || 'Need baseline numeracy evidence'} (${formatPercent(numBaseline)}), support intensity ${numTier}.`);
    }

    const strengths = [];
    if (track !== 'numeracy') strengths.push(`Literacy strength: ${litStrength?.label || 'Collect more literacy sessions to confirm strengths'}.`);
    if (track !== 'literacy') strengths.push(`Numeracy strength: ${numStrength?.label || 'Collect more numeracy sessions to confirm strengths'}.`);

    const goals = [];
    if (track !== 'numeracy') {
      goals.push(`Literacy goal (${cycleWeeks} weeks): improve from ${formatPercent(litBaseline)} to ${formatPercent(litTarget)} in ${litGap?.label || 'priority literacy domain'} with explicit teach-guided practice-transfer routines.`);
    }
    if (track !== 'literacy') {
      goals.push(`Numeracy goal (${cycleWeeks} weeks): improve from ${formatPercent(numBaseline)} to ${formatPercent(numTarget)} in ${numGap?.label || 'priority numeracy domain'} using conceptual strategy instruction and explanation checks.`);
    }
    if (track === 'integrated') {
      goals.push('Integrated transfer goal: apply one reading strategy and one math strategy independently in classroom tasks each week.');
    }

    const monitoring = [
      'Collect at least 2 scored probes per target domain each week.',
      'Use red/yellow/green lane updates every Friday to adjust groups and intensity.',
      'Review family message + team handoff language each cycle to maintain coherence.'
    ];

    const timelineHighlights = timelineRows.length
      ? timelineRows.map((row) => `${new Date(row.ts).toLocaleDateString()} - ${timelineTrackLabel(row.track)}: ${row.label} (${row.event})`)
      : ['No timeline entries yet. Run activities to generate progress evidence.'];

    const textLines = [
      `IESP Auto-Draft`,
      `Learner: ${learnerName}`,
      `Grade band: ${gradeBand}`,
      `Track: ${track}`,
      `Case lead: ${ownerLabel}`,
      `Cycle length: ${cycleWeeks} weeks`,
      `Next review date: ${reviewDate.toLocaleDateString()}`,
      '',
      'Present levels:',
      ...presentLevels.map((line) => `- ${line}`),
      '',
      'Strengths:',
      ...strengths.map((line) => `- ${line}`),
      '',
      'Goals:',
      ...goals.map((line) => `- ${line}`),
      '',
      'Progress monitoring and service plan:',
      ...monitoring.map((line) => `- ${line}`),
      '',
      'Team handoff:',
      `- ${ownerGuidance.handoff}`,
      `- ${ownerGuidance.progressLens}`,
      `- ${ownerGuidance.familyBridge}`,
      '',
      'Timeline highlights:',
      ...timelineHighlights.map((line) => `- ${line}`)
    ];

    const html = `
      <div class="report-goal-card">
        <h3>IESP Draft · ${escapeHtml(learnerName)} · ${escapeHtml(track)}</h3>
        <p><strong>Case lead:</strong> ${escapeHtml(ownerLabel)} · <strong>Cycle:</strong> ${escapeHtml(String(cycleWeeks))} weeks · <strong>Review date:</strong> ${escapeHtml(reviewDate.toLocaleDateString())}</p>
        <ul>
          ${presentLevels.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
          ${strengths.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
          ${goals.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
        </ul>
        <div class="report-protocol-note"><strong>Progress monitoring:</strong></div>
        <ul>${monitoring.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
        <div class="report-protocol-note"><strong>Team handoff:</strong> ${escapeHtml(ownerGuidance.handoff)}</div>
        <div class="report-protocol-note"><strong>Timeline highlights:</strong></div>
        <ul>${timelineHighlights.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
      </div>
    `;

    return {
      text: textLines.join('\n'),
      html
    };
  }

  function renderIespDraft(context = {}) {
    if (!iespOutputEl) return;
    const draft = buildIespDraft(context);
    latestIespText = draft.text;
    latestIespParentText = buildIespParentSnapshot(context);
    iespOutputEl.innerHTML = draft.html;
    setIespStatus('');
  }

  function setSprintStatus(message, isError = false) {
    if (!sprintStatusEl) return;
    sprintStatusEl.textContent = message || '';
    sprintStatusEl.classList.toggle('error', !!isError);
    sprintStatusEl.classList.toggle('success', !isError && !!message);
  }

  function resolveSprintTrack() {
    const selected = String(sprintTrackEl?.value || 'integrated');
    if (selected === 'literacy' || selected === 'numeracy' || selected === 'integrated') return selected;
    return 'integrated';
  }

  function resolveSprintWindowDays() {
    const selected = Number(sprintWindowEl?.value || 7);
    if (selected === 5 || selected === 7 || selected === 10) return selected;
    return 7;
  }

  function resolveSprintOwnerRole() {
    const selected = String(sprintOwnerEl?.value || resolveIespOwnerRole());
    const normalized = normalizeRoleId(selected);
    return ROLE_PATHWAY_LIBRARY[normalized] ? normalized : 'teacher';
  }

  function sprintLaneMeta(lane) {
    if (lane === 'red') return { label: 'Urgent', className: 'report-sprint-lane-red' };
    if (lane === 'yellow') return { label: 'Monitor', className: 'report-sprint-lane-yellow' };
    return { label: 'Maintain', className: 'report-sprint-lane-green' };
  }

  function laneFromTraffic(traffic = {}) {
    if (Array.isArray(traffic.red) && traffic.red.length) return 'red';
    if (Array.isArray(traffic.yellow) && traffic.yellow.length) return 'yellow';
    return 'green';
  }

  function addInstructionalDays(baseDate, dayCount) {
    const date = new Date(baseDate);
    let remaining = Math.max(0, Number(dayCount) || 0);
    while (remaining > 0) {
      date.setDate(date.getDate() + 1);
      const day = date.getDay();
      if (day !== 0 && day !== 6) remaining -= 1;
    }
    return date;
  }

  function loadSprintCompletionStore() {
    const parsed = safeParse(localStorage.getItem(SPRINT_COMPLETION_KEY) || '');
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  }

  function saveSprintCompletionStore(store) {
    const next = store && typeof store === 'object' ? store : {};
    const keys = Object.keys(next).slice(0, 60);
    const trimmed = {};
    keys.forEach((key) => {
      trimmed[key] = next[key];
    });
    localStorage.setItem(SPRINT_COMPLETION_KEY, JSON.stringify(trimmed));
  }

  function buildSprintCompletionContextKey({ learnerName = 'learner', track = 'integrated', windowDays = 7, ownerRole = 'teacher' } = {}) {
    const learnerSlug = slugify(String(learnerName || 'learner')) || 'learner';
    const ownerSlug = slugify(String(ownerRole || 'teacher')) || 'teacher';
    const trackSlug = slugify(String(track || 'integrated')) || 'integrated';
    const windowSlug = Number(windowDays || 7);
    return `${learnerSlug}|${trackSlug}|${ownerSlug}|${windowSlug}`;
  }

  function getSprintCompletionMap(contextKey) {
    if (!contextKey) return {};
    const store = loadSprintCompletionStore();
    const map = store[contextKey];
    return map && typeof map === 'object' ? map : {};
  }

  function setSprintTaskCompletion(contextKey, taskId, isDone) {
    if (!contextKey || !taskId) return;
    const store = loadSprintCompletionStore();
    const map = store[contextKey] && typeof store[contextKey] === 'object' ? { ...store[contextKey] } : {};
    if (isDone) {
      map[taskId] = true;
    } else {
      delete map[taskId];
    }
    store[contextKey] = map;
    saveSprintCompletionStore(store);
  }

  function buildSprintBoard(context = {}) {
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const track = resolveSprintTrack();
    const windowDays = resolveSprintWindowDays();
    const ownerRole = resolveSprintOwnerRole();
    const ownerLabel = ROLE_PATHWAY_LIBRARY[ownerRole]?.label || 'Teacher';
    const ownerGuidance = ROLE_PROTOCOL_GUIDANCE[ownerRole] || ROLE_PROTOCOL_GUIDANCE['learning-support'];
    const learnerName = learner?.name || 'Learner';
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const today = new Date();
    const reviewDate = addInstructionalDays(today, windowDays);

    const literacyLane = laneFromTraffic(pulse?.traffic || {});
    const numeracyLane = laneFromTraffic(numeracyPulse?.traffic || {});
    const literacyMeta = sprintLaneMeta(literacyLane);
    const numeracyMeta = sprintLaneMeta(numeracyLane);
    const litGap = pulse?.gaps?.[0] || null;
    const litStrength = pulse?.strengths?.[0] || null;
    const numGap = numeracyPulse?.gaps?.[0] || null;
    const numStrength = numeracyPulse?.strengths?.[0] || null;
    const litTier = pulse?.engine?.tierRecommendation?.tierLabel || 'Tier 2';
    const numTier = numeracyPulse?.engine?.tierRecommendation?.tierLabel || 'Tier 2';
    const litActivity = pulse?.recommendedActivities?.[0]?.label || 'Word Quest';
    const numActivity = numeracyPulse?.recommendedActivities?.[0]?.label || 'Number Sense Sprint';
    const timelineRows = buildInterventionTimelineEntries(context).slice(0, 3);

    const tasks = [];
    if (track !== 'numeracy') {
      tasks.push({
        lane: literacyLane,
        laneLabel: literacyMeta.label,
        laneClass: literacyMeta.className,
        title: `Literacy priority: ${litGap?.label || 'Collect baseline literacy signal'}`,
        move: `Run explicit teach -> guided practice -> transfer using ${litActivity}; target ${litTier}.`,
        minutes: '15-25',
        owner: ownerLabel
      });
    }
    if (track !== 'literacy') {
      tasks.push({
        lane: numeracyLane,
        laneLabel: numeracyMeta.label,
        laneClass: numeracyMeta.className,
        title: `Numeracy priority: ${numGap?.label || 'Collect baseline numeracy signal'}`,
        move: `Use manipulatives + strategy talk in ${numActivity}; target ${numTier}.`,
        minutes: '15-25',
        owner: ownerLabel
      });
    }

    tasks.push({
      lane: 'yellow',
      laneLabel: 'Monitor',
      laneClass: 'report-sprint-lane-yellow',
      title: 'R/Y/G grouping refresh',
      move: `Set red/yellow/green groups from current pulse and assign one concrete move per group.`,
      minutes: '8-12',
      owner: ownerLabel
    });
    tasks.push({
      lane: 'yellow',
      laneLabel: 'Monitor',
      laneClass: 'report-sprint-lane-yellow',
      title: 'Evidence logging cadence',
      move: 'Capture at least two scored checks per focus domain this cycle and verify trend direction.',
      minutes: '6-8',
      owner: ownerLabel
    });
    tasks.push({
      lane: 'green',
      laneLabel: 'Maintain',
      laneClass: 'report-sprint-lane-green',
      title: 'Family bridge update',
      move: 'Send one plain-language parent message (EN/ES/ZH template) with one literacy and one numeracy home routine.',
      minutes: '5-8',
      owner: ownerLabel
    });
    tasks.push({
      lane: 'green',
      laneLabel: 'Maintain',
      laneClass: 'report-sprint-lane-green',
      title: 'Team handoff + review',
      move: ownerGuidance.handoff || 'Prepare handoff notes and review progress with team.',
      minutes: '10-12',
      owner: ownerLabel
    });

    const laneCounts = tasks.reduce((acc, task) => {
      acc[task.lane] = (acc[task.lane] || 0) + 1;
      return acc;
    }, { red: 0, yellow: 0, green: 0 });

    const completionContextKey = buildSprintCompletionContextKey({
      learnerName,
      track,
      windowDays,
      ownerRole
    });
    const completionMap = getSprintCompletionMap(completionContextKey);
    const dueOffsets = [0, 1, 2, 3, 4, Math.max(4, windowDays - 1)];
    const sprintRows = tasks.map((task, index) => {
      const dueDate = addInstructionalDays(today, dueOffsets[index] || 0);
      const dueLabel = dueDate.toLocaleDateString();
      const taskId = `${task.lane}-${slugify(task.title || `task-${index + 1}`)}-${index + 1}`;
      const done = !!completionMap[taskId];
      return {
        ...task,
        index,
        taskId,
        dueDate,
        dueLabel,
        done
      };
    });
    const completedCount = sprintRows.filter((row) => row.done).length;
    const completionPct = sprintRows.length ? Math.round((completedCount / sprintRows.length) * 100) : 0;
    const lines = [
      'Intervention Sprint Board',
      `Learner: ${learnerName}`,
      `Grade band: ${gradeBand}`,
      `Track: ${track}`,
      `Owner: ${ownerLabel}`,
      `Window: ${windowDays} instructional days`,
      `Review date: ${reviewDate.toLocaleDateString()}`,
      '',
      `Lane mix: Urgent ${laneCounts.red} · Monitor ${laneCounts.yellow} · Maintain ${laneCounts.green}`,
      `Completion: ${completedCount}/${sprintRows.length} actions complete (${completionPct}%)`,
      ''
    ];

    const taskItemsHtml = sprintRows.map((task) => {
      const doneLabel = task.done ? 'Done' : 'Open';
      lines.push(`${task.index + 1}) [${task.laneLabel}] ${task.title} [${doneLabel}]`);
      lines.push(`   Move: ${task.move}`);
      lines.push(`   Owner: ${task.owner} · Time: ${task.minutes} min · Due: ${task.dueLabel}`);
      return `
        <article class="report-sprint-item ${task.laneClass} ${task.done ? 'is-done' : ''}">
          <div class="report-sprint-item-head">
            <span class="report-sprint-lane-pill ${task.laneClass}">${escapeHtml(task.laneLabel)}</span>
            <span>Due ${escapeHtml(task.dueLabel)}</span>
          </div>
          <div class="report-sprint-title">${escapeHtml(task.title)}</div>
          <div class="report-sprint-move">${escapeHtml(task.move)}</div>
          <div class="report-sprint-meta"><strong>Owner:</strong> ${escapeHtml(task.owner)} · <strong>Time:</strong> ${escapeHtml(task.minutes)} min</div>
          <div class="report-sprint-actions">
            <button
              type="button"
              class="secondary-btn report-sprint-toggle"
              data-sprint-context-key="${escapeHtml(completionContextKey)}"
              data-sprint-task-id="${escapeHtml(task.taskId)}"
              data-sprint-done="${task.done ? '1' : '0'}"
            >
              ${task.done ? 'Mark Open' : 'Mark Done'}
            </button>
            <span class="report-sprint-state">${task.done ? 'Completed' : 'Pending'}</span>
          </div>
        </article>
      `;
    }).join('');

    const timelineHtml = timelineRows.length
      ? timelineRows.map((row) => `<li>${escapeHtml(new Date(row.ts).toLocaleDateString())} · ${escapeHtml(timelineTrackLabel(row.track))}: ${escapeHtml(row.label)} (${escapeHtml(row.event)})</li>`).join('')
      : '<li>No recent timeline entries yet. Run activities to generate evidence.</li>';

    lines.push('');
    lines.push('Recent timeline evidence:');
    if (timelineRows.length) {
      timelineRows.forEach((row) => {
        lines.push(`- ${new Date(row.ts).toLocaleDateString()} · ${timelineTrackLabel(row.track)}: ${row.label} (${row.event})`);
      });
    } else {
      lines.push('- No recent timeline entries yet.');
    }

    const html = `
      <div class="report-builder-summary">
        <div><strong>Next-cycle sprint board:</strong> owner-assigned intervention actions with due dates.</div>
        <div><strong>Window:</strong> ${escapeHtml(String(windowDays))} instructional days · <strong>Owner:</strong> ${escapeHtml(ownerLabel)} · <strong>Review date:</strong> ${escapeHtml(reviewDate.toLocaleDateString())}</div>
        <div><strong>Lane mix:</strong> Urgent ${laneCounts.red} · Monitor ${laneCounts.yellow} · Maintain ${laneCounts.green}</div>
        <div><strong>Execution:</strong> ${completedCount}/${sprintRows.length} complete (${completionPct}%).</div>
      </div>
      <div class="report-sprint-grid">${taskItemsHtml}</div>
      <div class="report-sprint-evidence">
        <div class="report-sprint-evidence-title">Recent timeline evidence</div>
        <ul>${timelineHtml}</ul>
      </div>
    `;

    return {
      text: lines.join('\n'),
      html
    };
  }

  function renderSprintBoard(context = {}) {
    if (!sprintBoardEl) return;
    const board = buildSprintBoard(context);
    latestSprintBoardText = board.text;
    sprintBoardEl.innerHTML = board.html;
    setSprintStatus('');
  }

  async function copySprintBoard() {
    if (!latestSprintBoardText) {
      setSprintStatus('Generate the sprint board first, then copy.', true);
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestSprintBoardText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      setSprintStatus('Sprint board copied.');
    } catch {
      setSprintStatus('Clipboard unavailable. Copy directly from the sprint board.', true);
    }
  }

  function exportSprintBoard() {
    if (!latestSprintContext) {
      setSprintStatus('Refresh report first to generate sprint board export.', true);
      return;
    }
    const learnerName = latestSprintContext.learner?.name || 'learner';
    const learnerSlug = slugify(learnerName || 'learner');
    const dateSlug = buildDateSlug(new Date());
    const text = latestSprintBoardText || buildSprintBoard(latestSprintContext).text;
    const fileName = `intervention-sprint-board-${learnerSlug}-${dateSlug}.txt`;
    downloadBlobFile(fileName, new Blob([text], { type: 'text/plain;charset=utf-8' }));
    setSprintStatus('Sprint board exported.');
  }

  function toggleSprintTaskFromUi(contextKey, taskId, wasDone) {
    if (!latestSprintContext) {
      setSprintStatus('Refresh report first, then update sprint completion.', true);
      return;
    }
    const isDone = !wasDone;
    setSprintTaskCompletion(contextKey, taskId, isDone);
    renderSprintBoard(latestSprintContext);
    setSprintStatus(isDone ? 'Sprint task marked done.' : 'Sprint task moved back to open.');
  }

  async function copyIespDraft() {
    if (!latestIespText) {
      setIespStatus('Generate an IESP draft first, then copy.', true);
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestIespText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      setIespStatus('IESP draft copied.');
    } catch {
      setIespStatus('Clipboard unavailable. Copy directly from the IESP card.', true);
    }
  }

  function buildIespParentSnapshot(context = {}) {
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const track = resolveIespTrack();
    const cycleWeeks = resolveIespCycleWeeks();
    const ownerRole = resolveIespOwnerRole();
    const ownerLabel = ROLE_PATHWAY_LIBRARY[ownerRole]?.label || 'Teacher';
    const learnerName = learner?.name || 'Learner';
    const litGap = pulse?.gaps?.[0] || null;
    const numGap = numeracyPulse?.gaps?.[0] || null;
    const litStrength = pulse?.strengths?.[0] || null;
    const numStrength = numeracyPulse?.strengths?.[0] || null;

    const focusLines = [];
    if (track !== 'numeracy') {
      focusLines.push(`- Reading focus: ${litGap?.label || 'Reading baseline is still being established'}.`);
    }
    if (track !== 'literacy') {
      focusLines.push(`- Math focus: ${numGap?.label || 'Math baseline is still being established'}.`);
    }

    const strengthLines = [];
    if (track !== 'numeracy') {
      strengthLines.push(`- Reading strength: ${litStrength?.label || 'Collecting more reading evidence'}.`);
    }
    if (track !== 'literacy') {
      strengthLines.push(`- Math strength: ${numStrength?.label || 'Collecting more math evidence'}.`);
    }

    const nextStepLines = [];
    if (track !== 'numeracy') {
      nextStepLines.push('- Read together for 5-10 minutes and ask your child to explain one word-solving strategy.');
    }
    if (track !== 'literacy') {
      nextStepLines.push('- Use one short mental-math routine (make 10, friendly numbers, or number-line jumps) and explain thinking out loud.');
    }
    nextStepLines.push('- Celebrate effort first, then name one clear goal for the next week.');

    const reviewDate = new Date(Date.now() + (cycleWeeks * 7 * 24 * 60 * 60 * 1000));
    const lines = [
      'CORNERSTONE MTSS Parent Snapshot',
      `Learner: ${learnerName}`,
      `Support cycle: ${cycleWeeks} weeks`,
      `Case lead: ${ownerLabel}`,
      `Next team review: ${reviewDate.toLocaleDateString()}`,
      '',
      'Current focus:',
      ...focusLines,
      '',
      'Current strengths:',
      ...strengthLines,
      '',
      'At-home next steps:',
      ...nextStepLines,
      '',
      'How progress is checked:',
      '- We collect short learning checks each week and update supports when needed.',
      '- If progress is slower than expected, support intensity is adjusted quickly.'
    ];
    return lines.join('\n');
  }

  function exportIespDraft(kind = 'team') {
    if (!latestIespContext) {
      setIespStatus('Refresh report first to build IESP exports.', true);
      return;
    }

    const learnerName = latestIespContext.learner?.name || 'learner';
    const learnerSlug = slugify(learnerName || 'learner');
    const dateSlug = buildDateSlug(new Date());

    if (kind === 'parent') {
      const parentText = latestIespParentText || buildIespParentSnapshot(latestIespContext);
      const fileName = `iesp-parent-snapshot-${learnerSlug}-${dateSlug}.txt`;
      downloadBlobFile(fileName, new Blob([parentText], { type: 'text/plain;charset=utf-8' }));
      setIespStatus('Parent snapshot exported.');
      return;
    }

    const teamText = latestIespText || buildIespDraft(latestIespContext).text;
    const fileName = `iesp-team-brief-${learnerSlug}-${dateSlug}.txt`;
    downloadBlobFile(fileName, new Blob([teamText], { type: 'text/plain;charset=utf-8' }));
    setIespStatus('Team brief exported.');
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
        wordQuestLength: wordQuestDefault.len,
        builderFocus: focusId,
        builderGradeBand: gradeBand,
        builderMinutes: duration
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

  function normalizeWritingStatus(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'ready') return 'ready';
    if (raw === 'growing') return 'growing';
    if (raw === 'not-yet' || raw === 'notyet' || raw === 'not_yet') return 'not-yet';
    return 'not-assessed';
  }

  const WRITING_DIMENSION_ORDER = [
    { key: 'topicClaim', label: 'Topic/Claim' },
    { key: 'detailsEvidence', label: 'Details/Evidence' },
    { key: 'organizationTransitions', label: 'Organization/Transitions' },
    { key: 'conventions', label: 'Conventions' }
  ];

  function writingStatusScore(status) {
    const normalized = normalizeWritingStatus(status);
    if (normalized === 'ready') return 2;
    if (normalized === 'growing') return 1;
    if (normalized === 'not-yet') return 0;
    return -1;
  }

  function writingTrendArrow(delta) {
    if (delta > 0) return '↗';
    if (delta < 0) return '↘';
    return '→';
  }

  function formatSignedCount(value, suffix = '') {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    const numeric = Number(value);
    if (numeric === 0) return `0${suffix}`;
    return `${numeric > 0 ? '+' : ''}${numeric}${suffix}`;
  }

  function buildWritingProgressModel(learner) {
    const sessions = readWritingSessions(learner)
      .slice()
      .sort((a, b) => Number(b?.ts || 0) - Number(a?.ts || 0))
      .slice(0, 12);

    if (!sessions.length) {
      return {
        sessions,
        latest: null,
        previous: null,
        dimensions: [],
        trends: [],
        summaryLine: 'No saved writing sessions yet.',
        parentSummary: 'No writing snapshot yet. Save one Step Up writing session to start trend reporting.',
        text: 'Writing Progress Snapshot\nNo saved writing sessions yet.'
      };
    }

    const latest = sessions[0] || null;
    const previous = sessions[1] || null;
    const latestDimensions = latest?.dimensions || {};
    const previousDimensions = previous?.dimensions || {};

    const dimensions = WRITING_DIMENSION_ORDER.map((row) => {
      const latestStatus = normalizeWritingStatus(latestDimensions[row.key]);
      const previousStatus = normalizeWritingStatus(previousDimensions[row.key]);
      const delta = writingStatusScore(latestStatus) - writingStatusScore(previousStatus);
      return {
        ...row,
        latestStatus,
        previousStatus,
        delta
      };
    });

    const latestReady = dimensions.filter((row) => row.latestStatus === 'ready').length;
    const previousReady = dimensions.filter((row) => row.previousStatus === 'ready').length;
    const readyDelta = previous ? latestReady - previousReady : null;

    const latestWordCount = Number(latest?.wordCount || 0);
    const previousWordCount = Number(previous?.wordCount || 0);
    const wordDelta = previous ? latestWordCount - previousWordCount : null;

    const latestReadinessPercent = Math.round((latestReady / WRITING_DIMENSION_ORDER.length) * 100);
    const previousReadinessPercent = Math.round((previousReady / WRITING_DIMENSION_ORDER.length) * 100);
    const readinessDelta = previous ? latestReadinessPercent - previousReadinessPercent : null;

    const trendSessions = sessions.slice(0, 6).reverse();
    const trends = WRITING_DIMENSION_ORDER.map((row) => {
      const history = trendSessions.map((session) => normalizeWritingStatus(session?.dimensions?.[row.key]));
      const first = history[0] || 'not-assessed';
      const last = history[history.length - 1] || 'not-assessed';
      const delta = writingStatusScore(last) - writingStatusScore(first);
      return {
        ...row,
        history,
        first,
        last,
        delta
      };
    });

    const stageProgress = latest?.stageProgress && typeof latest.stageProgress === 'object'
      ? latest.stageProgress
      : null;
    const completedStages = stageProgress
      ? ['plan', 'draft', 'check', 'revise', 'publish'].filter((stage) => !!stageProgress[stage]).length
      : null;
    const missionsCompleted = Number(latest?.missionsCompleted || 0);
    const missionsAssigned = Number(latest?.missionsAssigned || 0);
    const genreLabel = humanizeWritingGenre(latest?.genre);
    const gradeBand = String(latest?.gradeBand || '—');
    const latestDate = new Date(Number(latest?.ts || Date.now())).toLocaleDateString();
    const learnerLabel = learner?.name || latest?.learnerName || 'Learner';

    const trendHighlights = trends
      .map((row) => `${row.label} ${writingTrendArrow(row.delta)} ${writingStatusLabel(row.last)}`)
      .join(' · ');

    const summaryLine = `${learnerLabel}: ${latestReadinessPercent}% Step Up readiness (${latestReady}/4 ready) · ${latestWordCount || 0} words · missions ${missionsCompleted}/${missionsAssigned || 0}${readinessDelta === null ? '' : ` · readiness ${formatSignedCount(readinessDelta, '%')}`}${wordDelta === null ? '' : ` · words ${formatSignedCount(wordDelta)}`}.`;
    const parentSummary = `${learnerLabel} writing trend: ${latestReady}/4 Step Up dimensions ready (${latestReadinessPercent}%). ${trendHighlights || 'Trend window building.'} Home move: ask for one clear topic sentence, one detail, and one conclusion sentence.`;

    const lines = [
      `Writing Progress Snapshot`,
      `Learner: ${learnerLabel}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Latest session: ${latestDate} · ${gradeBand} · ${genreLabel}`,
      `Step Up readiness: ${latestReady}/4 (${latestReadinessPercent}%)${readyDelta === null ? '' : ` (${formatSignedCount(readyDelta)} vs previous)`}`,
      `Word count: ${latestWordCount || 0}${wordDelta === null ? '' : ` (${formatSignedCount(wordDelta)} vs previous)`}`,
      `Revision missions: ${missionsCompleted}/${missionsAssigned || 0}`,
      `Workflow completion: ${completedStages === null ? 'Not captured' : `${completedStages}/5 stages saved`}`,
      `Trend highlights: ${trendHighlights || 'Trend window building.'}`
    ];

    return {
      sessions,
      latest,
      previous,
      dimensions,
      trends,
      latestReady,
      latestReadinessPercent,
      latestWordCount,
      readinessDelta,
      wordDelta,
      missionsCompleted,
      missionsAssigned,
      completedStages,
      summaryLine,
      parentSummary,
      text: lines.join('\n')
    };
  }

  function setWritingSnapshotStatus(message, isError = false) {
    if (!writingStatusEl) return;
    writingStatusEl.textContent = message || '';
    writingStatusEl.classList.toggle('error', !!isError);
    writingStatusEl.classList.toggle('success', !isError && !!message);
  }

  function renderWritingProgressSnapshot(learner) {
    const model = buildWritingProgressModel(learner);
    latestWritingProgress = model;
    latestWritingSnapshotText = model.text;

    if (!writingSnapshotEl || !writingTrendsEl) return model;

    if (!model.sessions.length) {
      writingSnapshotEl.innerHTML = `
        <h3>Writing Progress Snapshot</h3>
        <div class="report-standard-note">No saved writing sessions yet.</div>
      `;
      writingTrendsEl.innerHTML = `
        <h3>Step Up Trend Window</h3>
        <div class="report-standard-note">Complete Plan → Draft → Check → Revise → Publish and save a session to start trends.</div>
      `;
      setWritingSnapshotStatus('');
      return model;
    }

    const dimensionRows = model.dimensions.map((row) => `
      <li>
        <strong>${escapeHtml(row.label)}:</strong>
        <span class="report-writing-status ${writingStatusClass(row.latestStatus)}">${writingStatusLabel(row.latestStatus)}</span>
        <span class="report-writing-trend-arrow">${writingTrendArrow(row.delta)}</span>
        <span class="report-writing-status ${writingStatusClass(row.previousStatus)}">${writingStatusLabel(row.previousStatus)}</span>
      </li>
    `).join('');

    writingSnapshotEl.innerHTML = `
      <h3>Writing Progress Snapshot</h3>
      <div class="report-writing-progress-meta">${escapeHtml(model.summaryLine)}</div>
      <ul class="report-writing-progress-list">${dimensionRows}</ul>
      <div class="report-standard-note">Aligned to Step Up to Writing: Topic/Claim, Details/Evidence, Organization/Transitions, Conventions.</div>
    `;

    const trendRows = model.trends.map((row) => {
      const history = row.history.map((status) => `<span class="report-writing-status ${writingStatusClass(status)}">${writingStatusLabel(status)}</span>`).join(' <span class="report-writing-trend-arrow">→</span> ');
      return `
        <article class="report-writing-trend-row">
          <div class="report-writing-trend-head">
            <strong>${escapeHtml(row.label)}</strong>
            <span class="report-writing-trend-arrow">${writingTrendArrow(row.delta)}</span>
            <span>${escapeHtml(writingStatusLabel(row.last))}</span>
          </div>
          <div class="report-writing-trend-history">${history}</div>
        </article>
      `;
    }).join('');

    writingTrendsEl.innerHTML = `
      <h3>Step Up Trend Window</h3>
      <div class="report-standard-note">Latest six saved writing sessions (oldest → newest).</div>
      <div class="report-writing-trend-grid">${trendRows}</div>
    `;

    setWritingSnapshotStatus('');
    return model;
  }

  async function copyWritingSnapshot() {
    if (!latestWritingSnapshotText) {
      setWritingSnapshotStatus('Refresh report first to build a writing snapshot.', true);
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestWritingSnapshotText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      setWritingSnapshotStatus('Writing snapshot copied.');
    } catch {
      setWritingSnapshotStatus('Clipboard unavailable. Copy directly from the snapshot cards.', true);
    }
  }

  function writingStatusLabel(status) {
    if (status === 'ready') return 'Ready';
    if (status === 'growing') return 'Growing';
    if (status === 'not-yet') return 'Not yet';
    return 'Not assessed';
  }

  function writingStatusClass(status) {
    if (status === 'ready') return 'report-writing-status-ready';
    if (status === 'growing') return 'report-writing-status-growing';
    if (status === 'not-yet') return 'report-writing-status-not-yet';
    return 'report-writing-status-not-assessed';
  }

  function readWritingSessions(learner) {
    const allSessions = readJson(WRITING_SESSION_STORE_KEY, []);
    const sessions = Array.isArray(allSessions) ? allSessions : [];
    if (!learner) return sessions;

    const learnerId = String(learner.id || '').trim().toLowerCase();
    const learnerName = String(learner.name || '').trim().toLowerCase();

    return sessions.filter((session) => {
      const sessionLearnerId = String(session?.learnerId || '').trim().toLowerCase();
      const sessionLearnerName = String(session?.learnerName || '').trim().toLowerCase();
      if (learnerId && sessionLearnerId) return sessionLearnerId === learnerId;
      if (learnerName && sessionLearnerName) return sessionLearnerName === learnerName;
      return true;
    });
  }

  function humanizeWritingGenre(genreId) {
    const genre = String(genreId || '').toLowerCase();
    if (genre === 'opinion') return 'Opinion';
    if (genre === 'argument') return 'Argument';
    if (genre === 'informational') return 'Informational';
    if (genre === 'narrative') return 'Narrative';
    if (genre === 'reflection') return 'Reflection';
    return genre || 'Writing';
  }

  function renderWritingStepUpHeatmap(learner) {
    if (!writingHeatmapEl) return [];
    const sessions = readWritingSessions(learner)
      .slice()
      .sort((a, b) => Number(b?.ts || 0) - Number(a?.ts || 0))
      .slice(0, 8);

    const thead = writingHeatmapEl.querySelector('thead');
    const tbody = writingHeatmapEl.querySelector('tbody');
    if (!thead || !tbody) return sessions;

    thead.innerHTML = `
      <tr>
        <th>Writing Session</th>
        <th>Topic/Claim</th>
        <th>Details/Evidence</th>
        <th>Organization/Transitions</th>
        <th>Conventions</th>
      </tr>
    `;

    if (!sessions.length) {
      tbody.innerHTML = `
        <tr>
          <td><strong>Writing Studio</strong><div class="report-standard-note">No saved writing sessions yet.</div></td>
          <td><span class="report-writing-status report-writing-status-not-assessed">Not assessed</span></td>
          <td><span class="report-writing-status report-writing-status-not-assessed">Not assessed</span></td>
          <td><span class="report-writing-status report-writing-status-not-assessed">Not assessed</span></td>
          <td><span class="report-writing-status report-writing-status-not-assessed">Not assessed</span></td>
        </tr>
      `;
      return sessions;
    }

    tbody.innerHTML = sessions.map((session) => {
      const dimensions = session?.dimensions || {};
      const topicClaim = normalizeWritingStatus(dimensions.topicClaim);
      const detailsEvidence = normalizeWritingStatus(dimensions.detailsEvidence);
      const organizationTransitions = normalizeWritingStatus(dimensions.organizationTransitions);
      const conventions = normalizeWritingStatus(dimensions.conventions);
      const ts = Number(session?.ts || Date.now());
      const dateLabel = new Date(ts).toLocaleDateString();
      const gradeBand = escapeHtml(String(session?.gradeBand || '—'));
      const genre = escapeHtml(humanizeWritingGenre(session?.genre));
      const wordCount = Number(session?.wordCount || 0);

      return `
        <tr>
          <td>
            <strong>${dateLabel} · ${gradeBand} · ${genre}</strong>
            <div class="report-standard-note">${wordCount ? `${wordCount} words` : 'Draft saved'}</div>
          </td>
          <td><span class="report-writing-status ${writingStatusClass(topicClaim)}">${writingStatusLabel(topicClaim)}</span></td>
          <td><span class="report-writing-status ${writingStatusClass(detailsEvidence)}">${writingStatusLabel(detailsEvidence)}</span></td>
          <td><span class="report-writing-status ${writingStatusClass(organizationTransitions)}">${writingStatusLabel(organizationTransitions)}</span></td>
          <td><span class="report-writing-status ${writingStatusClass(conventions)}">${writingStatusLabel(conventions)}</span></td>
        </tr>
      `;
    }).join('');

    return sessions;
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

  function getMetricValue(metrics, label) {
    return metrics.find((metric) => metric.label === label)?.value || '—';
  }

  function renderShareSummary(learner, metrics, pulse, weakestRow, placementRec, writingProgress) {
    if (!shareSummaryEl) return;
    const engine = pulse.engine || {};
    const evidence = engine.evidence || {};
    const tierRecommendation = engine.tierRecommendation || {};

    const strengths = pulse.strengths.length
      ? pulse.strengths.map((row) => `${row.label} ${formatPercent(row.avg)}`).join(', ')
      : 'Need more scored sessions to confirm strengths.';

    const gaps = pulse.gaps.length
      ? pulse.gaps.map((row) => `${row.label} ${formatPercent(row.avg)}`).join(', ')
      : 'No major domain gaps flagged yet.';

    const activities = pulse.recommendedActivities.length
      ? pulse.recommendedActivities.map((row) => row.label).join(', ')
      : 'Build additional activity evidence first.';

    const focusLine = weakestRow?.standard
      ? `Data priority standard: ${weakestRow.standard} (${formatPercent(weakestRow.overall)}).`
      : placementRec?.focus
        ? `Placement priority: ${placementRec.focus} (length ${placementRec.length}).`
        : 'Priority: collect more scored sessions this week.';

    const learnerLabel = learner?.name || 'Learner';
    const writingSummary = writingProgress?.summaryLine || 'Writing snapshot pending. Save a Writing Studio session to start trends.';
    const writingParentSummary = writingProgress?.parentSummary || 'Parent writing trend snapshot pending.';
    const lines = [
      `${learnerLabel} Literacy Summary`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      `Sessions completed: ${getMetricValue(metrics, 'Total Sessions')} (${getMetricValue(metrics, 'Sessions (7 days)')} in the last 7 days).`,
      `Word Quest accuracy: ${getMetricValue(metrics, 'Word Quest Accuracy')}.`,
      `Fluency estimate: ${getMetricValue(metrics, 'Fluency (est. mastery)')}.`,
      `Comprehension estimate: ${getMetricValue(metrics, 'Comprehension (est. mastery)')}.`,
      '',
      `Strengths: ${strengths}`,
      `Top 3 gaps: ${gaps}`,
      `${focusLine}`,
      `Recommended next activities: ${activities}`,
      'Writing alignment: Aligned to Step Up to Writing structure (Topic/Claim, Details/Evidence, Organization/Transitions, Conventions).',
      `Writing snapshot: ${writingSummary}`,
      `Parent writing trend line: ${writingParentSummary}`,
      `Intervention priority: ${pulse.topPriority}`,
      `Engine confidence: ${evidence.confidenceLabel || 'Early signal'} (${formatPercent(evidence.confidenceScore || 0)}).`,
      `Suggested support intensity: ${tierRecommendation.tierLabel || 'Tier 2'} (${tierRecommendation.rationale || 'Needs additional data confirmation.'})`
    ];

    latestShareText = lines.join('\n');
    shareSummaryEl.textContent = latestShareText;
    if (shareStatusEl) shareStatusEl.textContent = '';
  }

  async function copyShareSummary() {
    if (!latestShareText) {
      if (shareStatusEl) shareStatusEl.textContent = 'Refresh report first to generate a summary.';
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestShareText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      if (shareStatusEl) shareStatusEl.textContent = 'Summary copied.';
    } catch {
      if (shareStatusEl) shareStatusEl.textContent = 'Clipboard unavailable. Copy text directly from the summary box.';
    }
  }

  function setDemoStatus(message, isError = false) {
    if (!demoStatusEl) return;
    demoStatusEl.textContent = message || '';
    demoStatusEl.classList.toggle('error', !!isError);
    demoStatusEl.classList.toggle('success', !isError && !!message);
  }

  function roundToTenths(value) {
    return Math.round(Number(value || 0) * 10) / 10;
  }

  function clampRating(value) {
    return roundToTenths(clamp(Number(value || 0), 1, 10));
  }

  function buildDemoReadinessModel(context = {}) {
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const logs = Array.isArray(context.logs) ? context.logs : [];
    const numeracyLogs = Array.isArray(context.numeracyLogs) ? context.numeracyLogs : [];
    const settings = readJson('decode_settings', {}) || {};

    const allLogs = [...logs, ...numeracyLogs];
    const totalSessions = allLogs.length;
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentSessions = allLogs.filter((entry) => Number(entry?.ts || 0) >= weekAgo).length;
    const activityBreadth = new Set(allLogs.map((entry) => String(entry?.activity || '')).filter(Boolean)).size;
    const litDomainCoverage = Number(pulse?.engine?.evidence?.domainCoverage || pulse?.domainStats?.length || 0);
    const numDomainCoverage = Number(numeracyPulse?.engine?.evidence?.domainCoverage || numeracyPulse?.domainStats?.length || 0);
    const litConfidence = Number(pulse?.engine?.evidence?.confidenceScore || 0);
    const numConfidence = Number(numeracyPulse?.engine?.evidence?.confidenceScore || 0);
    const recommendedCount = Number((pulse?.recommendedActivities?.length || 0) + (numeracyPulse?.recommendedActivities?.length || 0));
    const supportProfile = getSupportProfile();
    const supportCount = supportProfile.length;
    const roleCount = Object.keys(ROLE_PATHWAY_LIBRARY || {}).length;
    const specialistRoleCount = ['learning-support', 'eal', 'slp', 'counselor', 'psychologist', 'parent']
      .filter((roleId) => ROLE_PATHWAY_LIBRARY[roleId])
      .length;
    const frameworkCount = Object.keys(FRAMEWORK_ALIGNMENT || {}).length;
    const benchmarkSignals = pulse?.engine?.benchmarkSignals?.statuses?.length || numeracyPulse?.engine?.benchmarkSignals?.statuses?.length || 0;
    const equityGuardrailCount = Number((pulse?.engine?.equityGuardrails?.length || 0) + (numeracyPulse?.engine?.guardrails?.length || 0));
    const hasSprint = !!latestSprintBoardText;
    const hasIesp = !!latestIespText;
    const hasRolePathway = !!latestRolePathwayText;
    const hasParentPathway = !!(latestParentMessageText || getLatestParentMessage(learner)?.text);
    const hasOutcomeProof = !!(outcomesEl && outcomesEl.textContent && outcomesEl.textContent.trim().length);
    const voicePackId = String(settings.ttsPackId || 'default');
    const audienceMode = String(settings.audienceMode || 'auto');
    const hasEnhancedVoicePack = voicePackId && voicePackId !== 'default';
    const hasAudienceGuardrails = audienceMode !== 'auto';
    const funHudEnabled = !!settings?.funHud?.enabled;

    const categories = [
      {
        id: 'functionality',
        label: 'Functionality',
        score: clampRating(5.3 + (activityBreadth * 0.34) + (Math.min(totalSessions, 28) * 0.07) + (hasIesp ? 0.6 : 0)),
        evidence: `${activityBreadth} activity pathways used; ${totalSessions} logged sessions.`
      },
      {
        id: 'fun',
        label: 'Fun & Engagement',
        score: clampRating(5.0 + (funHudEnabled ? 1.0 : 0.4) + (Math.min(recentSessions, 16) * 0.08) + (hasAudienceGuardrails ? 0.5 : 0)),
        evidence: `${recentSessions} recent sessions; audience mode ${hasAudienceGuardrails ? audienceMode : 'auto'}.`
      },
      {
        id: 'inspirational',
        label: 'Inspirational',
        score: clampRating(5.4 + (hasOutcomeProof ? 1.1 : 0.5) + (hasSprint ? 0.8 : 0.3) + (hasParentPathway ? 0.5 : 0.2)),
        evidence: `Outcome narrative + sprint board${hasParentPathway ? ' + parent message' : ''} available.`
      },
      {
        id: 'informational',
        label: 'Informational',
        score: clampRating(5.4 + (litConfidence * 1.6) + (numConfidence * 1.3) + (benchmarkSignals ? 0.7 : 0.2)),
        evidence: `Engine confidence: literacy ${formatPercent(litConfidence)} / numeracy ${formatPercent(numConfidence)}.`
      },
      {
        id: 'skill-building',
        label: 'Skill Building',
        score: clampRating(5.2 + ((litDomainCoverage + numDomainCoverage) * 0.35) + (recommendedCount * 0.2)),
        evidence: `${litDomainCoverage + numDomainCoverage} domains represented; ${recommendedCount} next-activity suggestions.`
      },
      {
        id: 'ease',
        label: 'Ease of Use',
        score: clampRating(5.1 + (supportCount * 0.22) + (hasRolePathway ? 0.8 : 0.3) + (hasSprint ? 0.7 : 0.2) + (hasIesp ? 0.8 : 0.2)),
        evidence: `${supportCount} active accessibility supports; role/sprint/IESP workflows ${hasSprint && hasIesp ? 'ready' : 'in progress'}.`
      },
      {
        id: 'navigation',
        label: 'Intuitive Navigation',
        score: clampRating(5.5 + (hasRolePathway ? 1.0 : 0.4) + (hasIesp ? 0.9 : 0.4) + (hasSprint ? 0.6 : 0.2)),
        evidence: 'Direct pathway links across pulse, sprint board, role dashboard, and IESP.'
      },
      {
        id: 'professional',
        label: 'Professional + Modern Look',
        score: clampRating(6.7 + (hasOutcomeProof ? 0.7 : 0.3) + (hasIesp ? 0.6 : 0.2) + (hasSprint ? 0.5 : 0.2)),
        evidence: 'Leadership-ready report cards, exports, and intervention artifacts are visible in one screen.'
      },
      {
        id: 'customization',
        label: 'K-12 + Adult Customization',
        score: clampRating(5.3 + (Math.min(roleCount, 12) * 0.22) + (supportCount * 0.18) + (hasEnhancedVoicePack ? 0.5 : 0)),
        evidence: `${roleCount} role pathways, ${supportCount} support toggles, voice pack ${hasEnhancedVoicePack ? voicePackId : 'default'}.`
      },
      {
        id: 'content-depth',
        label: 'Content Depth + Breadth',
        score: clampRating(5.3 + (frameworkCount * 0.3) + (activityBreadth * 0.18) + (benchmarkSignals ? 0.4 : 0.1)),
        evidence: `${frameworkCount} alignment domains plus literacy/numeracy intervention tracks.`
      },
      {
        id: 'specialist',
        label: 'SPED / SEL / EAL / SLP Fit',
        score: clampRating(5.6 + (specialistRoleCount * 0.34) + (equityGuardrailCount * 0.3) + (hasParentPathway ? 0.4 : 0)),
        evidence: `${specialistRoleCount} specialist-facing role dashboards with equity guardrails and parent bridge tools.`
      }
    ];

    const overall = clampRating(average(categories.map((row) => row.score)) || 1);
    const readinessBand = overall >= 9
      ? 'Demo 9+/10 ready'
      : overall >= 8.5
        ? 'Strong demo state (8.5+)'
        : overall >= 7.5
          ? 'Promising but needs polish'
          : 'Foundational build stage';

    const lines = [
      `CORNERSTONE MTSS Demo Readiness`,
      `Learner: ${learner?.name || 'Learner'}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      `Overall readiness: ${overall}/10 (${readinessBand})`,
      `Evidence: ${totalSessions} total sessions · ${recentSessions} sessions in last 7 days · ${activityBreadth} activity pathways`,
      ''
    ];
    categories.forEach((row) => {
      lines.push(`- ${row.label}: ${row.score}/10`);
      lines.push(`  ${row.evidence}`);
    });

    return {
      overall,
      readinessBand,
      categories,
      text: lines.join('\n')
    };
  }

  function renderDemoReadiness(context = {}) {
    if (!demoReadinessEl) return;
    const model = buildDemoReadinessModel(context);
    latestDemoReadinessText = model.text;
    const categoryHtml = model.categories.map((row) => `
      <article class="report-demo-card">
        <h3>${escapeHtml(row.label)}</h3>
        <div class="report-demo-score">${escapeHtml(String(row.score))}/10</div>
        <div class="report-demo-note">${escapeHtml(row.evidence)}</div>
      </article>
    `).join('');
    demoReadinessEl.innerHTML = `
      <div class="report-demo-summary">
        <div><strong>Overall readiness:</strong> ${escapeHtml(String(model.overall))}/10</div>
        <div>${escapeHtml(model.readinessBand)}</div>
      </div>
      <div class="report-demo-grid">${categoryHtml}</div>
    `;
    setDemoStatus('');
  }

  function buildShowcaseFlowModel(context = {}) {
    const pulse = context.pulse || null;
    const numeracyPulse = context.numeracyPulse || null;
    const litGap = pulse?.gaps?.[0]?.label || 'Top literacy gap';
    const numGap = numeracyPulse?.gaps?.[0]?.label || 'Top numeracy gap';
    const litTier = pulse?.engine?.tierRecommendation?.tierLabel || 'Tier recommendation pending';
    const numTier = numeracyPulse?.engine?.tierRecommendation?.tierLabel || 'Tier recommendation pending';
    const topPriority = pulse?.topPriority || 'Run a focused 4-week intervention cycle from top gap.';

    const steps = [
      {
        title: 'Mission + Role Lens',
        detail: 'Open Home role context to frame MTSS vision and team pathways.',
        href: 'index.html#role-dashboard'
      },
      {
        title: 'Literacy Pulse',
        detail: `Show top literacy gap (${litGap}) and current support intensity (${litTier}).`,
        href: '#report-pulse'
      },
      {
        title: 'Numeracy Pulse',
        detail: `Show top numeracy gap (${numGap}) and current support intensity (${numTier}).`,
        href: '#report-numeracy-pulse'
      },
      {
        title: 'Intervention Sprint Board',
        detail: 'Show owner-assigned next-cycle actions with due dates and lane priorities.',
        href: '#report-sprint-board-section'
      },
      {
        title: 'IESP Auto-Draft',
        detail: 'Generate copy-ready goals, monitoring cadence, and team handoff from live evidence.',
        href: '#report-iesp-output'
      },
      {
        title: 'Role + Parent Handoff',
        detail: 'Open role dashboard and parent partnership message to show implementation coherence.',
        href: '#report-role-dashboard'
      }
    ];

    const scriptLines = [
      'CORNERSTONE MTSS Showcase Flow (Hiring Committee)',
      `1) Mission: "Strong foundations across every tier."`,
      `2) Literacy pulse: ${litGap} is the top literacy target and ${litTier} is the current support intensity.`,
      `3) Numeracy pulse: ${numGap} is the top numeracy target and ${numTier} is the current support intensity.`,
      `4) Sprint board: owner-assigned actions + due dates convert data into daily execution.`,
      `5) IESP draft: goals + progress monitoring + handoff are generated from current evidence.`,
      `6) Role + parent handoff: specialists and families receive aligned next steps.`,
      `Close: "${topPriority}"`
    ];

    return {
      steps,
      text: scriptLines.join('\n')
    };
  }

  function renderShowcaseFlow(context = {}) {
    if (!showcaseFlowEl) return;
    const model = buildShowcaseFlowModel(context);
    latestShowcaseScriptText = model.text;
    const stepHtml = model.steps.map((step, index) => {
      const href = String(step.href || '#');
      const hrefLabel = href.startsWith('#') ? 'Open in report' : 'Open page';
      return `
        <article class="report-showcase-step">
          <div class="report-showcase-phase">${index + 1}. ${escapeHtml(step.title)}</div>
          <div class="report-showcase-detail">${escapeHtml(step.detail)}</div>
          <a class="secondary-btn report-showcase-link" href="${escapeHtml(href)}">${escapeHtml(hrefLabel)}</a>
        </article>
      `;
    }).join('');
    showcaseFlowEl.innerHTML = `
      <div class="report-showcase-steps">${stepHtml}</div>
      <div class="report-showcase-note"><strong>Talk track:</strong> copy showcase script to present this flow in 3-5 minutes.</div>
    `;
  }

  function buildLeadershipPackText(context = {}) {
    const learner = context.learner || null;
    const learnerName = learner?.name || 'Learner';
    const sections = [
      latestDemoReadinessText || 'Demo readiness not generated yet.',
      latestShowcaseScriptText || 'Showcase script not generated yet.',
      latestShareText || 'Share summary not generated yet.',
      latestWritingSnapshotText || 'Writing snapshot not generated yet.',
      latestSprintBoardText || 'Sprint board not generated yet.',
      latestIespText || 'IESP draft not generated yet.',
      latestRolePathwayText || 'Role pathway not generated yet.',
      latestParentMessageText || latestIespParentText || 'Parent snapshot not generated yet.'
    ];
    const text = [
      `CORNERSTONE MTSS Leadership Pack`,
      `Learner: ${learnerName}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '--- Demo Readiness ---',
      sections[0],
      '',
      '--- Showcase Script ---',
      sections[1],
      '',
      '--- Shareable Summary ---',
      sections[2],
      '',
      '--- Writing Snapshot ---',
      sections[3],
      '',
      '--- Sprint Board ---',
      sections[4],
      '',
      '--- IESP Draft ---',
      sections[5],
      '',
      '--- Role Pathway ---',
      sections[6],
      '',
      '--- Parent Snapshot ---',
      sections[7]
    ].join('\n');
    latestLeadershipPackText = text;
    return text;
  }

  async function copyDemoReadiness() {
    if (!latestDemoReadinessText) {
      setDemoStatus('Refresh report first to generate demo readiness.', true);
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestDemoReadinessText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      setDemoStatus('Demo readiness copied.');
    } catch {
      setDemoStatus('Clipboard unavailable. Copy directly from the readiness panel.', true);
    }
  }

  async function copyShowcaseScript() {
    if (!latestShowcaseScriptText) {
      setDemoStatus('Refresh report first to generate showcase script.', true);
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(latestShowcaseScriptText);
      } else {
        throw new Error('clipboard-unavailable');
      }
      setDemoStatus('Showcase script copied.');
    } catch {
      setDemoStatus('Clipboard unavailable. Copy directly from the showcase flow panel.', true);
    }
  }

  function exportLeadershipPack() {
    if (!latestLeadershipContext) {
      setDemoStatus('Refresh report first to build leadership export.', true);
      return;
    }
    const learnerName = latestLeadershipContext.learner?.name || 'learner';
    const learnerSlug = slugify(learnerName || 'learner');
    const dateSlug = buildDateSlug(new Date());
    const text = buildLeadershipPackText(latestLeadershipContext);
    const fileName = `cornerstone-leadership-pack-${learnerSlug}-${dateSlug}.txt`;
    downloadBlobFile(fileName, new Blob([text], { type: 'text/plain;charset=utf-8' }));
    setDemoStatus('Leadership pack exported.');
  }

  function runDemoAutopilot() {
    loadSampleData();
    refreshReport();

    if (iespTrackEl) iespTrackEl.value = 'integrated';
    if (iespCycleEl) iespCycleEl.value = '6';
    if (iespOwnerEl) {
      const preferredOwner = 'learning-support';
      const hasOwner = Array.from(iespOwnerEl.options || []).some((option) => option.value === preferredOwner);
      if (hasOwner) iespOwnerEl.value = preferredOwner;
    }
    if (sprintTrackEl) sprintTrackEl.value = 'integrated';
    if (sprintWindowEl) sprintWindowEl.value = '7';
    if (sprintOwnerEl) {
      const preferredOwner = 'learning-support';
      const hasOwner = Array.from(sprintOwnerEl.options || []).some((option) => option.value === preferredOwner);
      if (hasOwner) sprintOwnerEl.value = preferredOwner;
    }
    if (timelineFilterTrackEl) timelineFilterTrackEl.value = 'all';
    if (timelineFilterWindowEl) timelineFilterWindowEl.value = '30';
    if (timelineFilterSearchEl) timelineFilterSearchEl.value = '';

    seedDemoManualTimelineEntries();

    if (latestIespContext) {
      renderInterventionTimeline(latestIespContext);
      renderIespDraft(latestIespContext);
    }
    if (latestSprintContext) {
      renderSprintBoard(latestSprintContext);
    }
    if (latestLeadershipContext) {
      renderDemoReadiness(latestLeadershipContext);
      renderShowcaseFlow(latestLeadershipContext);
      buildLeadershipPackText(latestLeadershipContext);
    }

    setDemoStatus('Demo autopilot complete: sample data, timeline checkpoints, IESP, sprint board, and showcase outputs refreshed.');
  }

  function runDemoAutopilotFromQuery() {
    const params = new URLSearchParams(window.location.search || '');
    const demoMode = String(params.get('demo') || '').trim().toLowerCase();
    if (!demoMode || !['1', 'true', 'autopilot', 'pack'].includes(demoMode)) return;
    runDemoAutopilot();
    setDemoStatus('Demo autopilot launched from quick-start link.');
    params.delete('demo');
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash || ''}`;
    window.history.replaceState({}, '', nextUrl);
  }

  function loadSampleData() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const sampleLog = [
      { activity: 'word-quest', label: 'Word Quest', event: '4/5', ts: now - (0.7 * day), detail: { correct: 4, total: 5 } },
      { activity: 'fluency', label: 'Speed Sprint', event: 'Goal met', ts: now - (0.6 * day), detail: { orf: 82, goal: 95 } },
      { activity: 'comprehension', label: 'Read & Think', event: '3/5', ts: now - (0.5 * day), detail: { correct: 3, total: 5 } },
      { activity: 'writing', label: 'Writing Studio', event: 'Built paragraph', ts: now - (0.45 * day), detail: { wordCount: 52 } },
      { activity: 'plan-it', label: 'Plan-It', event: 'Checked (2 issues)', ts: now - (0.4 * day), detail: { issues: 2 } },
      { activity: 'cloze', label: 'Story Fill', event: '2/4', ts: now - (0.35 * day), detail: { correct: 2, total: 4 } },
      { activity: 'word-quest', label: 'Word Quest', event: '3/5', ts: now - (0.3 * day), detail: { correct: 3, total: 5 } },
      { activity: 'fluency', label: 'Speed Sprint', event: 'Checked', ts: now - (0.24 * day), detail: { orf: 76, goal: 95 } },
      { activity: 'comprehension', label: 'Read & Think', event: '4/5', ts: now - (0.18 * day), detail: { correct: 4, total: 5 } },
      { activity: 'madlibs', label: 'Silly Stories', event: 'Completed', ts: now - (0.14 * day), detail: { wordCount: 45 } },
      { activity: 'writing', label: 'Writing Studio', event: 'Checked', ts: now - (0.1 * day), detail: { wordCount: 58 } },
      { activity: 'plan-it', label: 'Plan-It', event: 'Checked (no overlaps)', ts: now - (0.05 * day), detail: { issues: 0 } }
    ];
    const numeracySampleLog = [
      { activity: 'number-sense', label: 'Number Sense Sprint', event: '7/10', ts: now - (0.75 * day), detail: { correct: 7, total: 10, domain: 'number-sense', source: 'im-cooldown' } },
      { activity: 'operations', label: 'Operation Builder', event: '6/10', ts: now - (0.62 * day), detail: { correct: 6, total: 10, domain: 'operations', source: 'bridges-check' } },
      { activity: 'problem-solving', label: 'Problem Pathways', event: '4/8', ts: now - (0.48 * day), detail: { correct: 4, total: 8, domain: 'problem-solving', source: 'im-unit' } },
      { activity: 'fluency', label: 'Math Fact Fluency', event: '8/12', ts: now - (0.36 * day), detail: { correct: 8, total: 12, domain: 'fluency', source: 'gloss-ikan' } },
      { activity: 'math-language', label: 'Math Language Studio', event: '5/8', ts: now - (0.28 * day), detail: { correct: 5, total: 8, domain: 'math-language', source: 'map-check' } },
      { activity: 'operations', label: 'Operation Builder', event: '7/10', ts: now - (0.19 * day), detail: { correct: 7, total: 10, domain: 'operations', source: 'decode-numeracy-sprint' } },
      { activity: 'problem-solving', label: 'Problem Pathways', event: '5/8', ts: now - (0.11 * day), detail: { correct: 5, total: 8, domain: 'problem-solving', source: 'im-cooldown' } },
      { activity: 'number-sense', label: 'Number Sense Sprint', event: '8/10', ts: now - (0.04 * day), detail: { correct: 8, total: 10, domain: 'number-sense', source: 'aimsweb-progress' } }
    ];

    localStorage.setItem('decode_activity_log_v1', JSON.stringify(sampleLog));
    localStorage.setItem('decode_numeracy_log_v1', JSON.stringify(numeracySampleLog));
    localStorage.setItem('decode_progress_data', JSON.stringify({
      wordsAttempted: 140,
      wordsCorrect: 104
    }));
    localStorage.setItem('decode_placement_v1', JSON.stringify({
      recommendation: {
        focus: 'vowel_team',
        length: '5',
        headline: 'Strengthen vowel-team decoding in short daily cycles.',
        notes: 'Use targeted decoding reps before comprehension.'
      }
    }));

    const sampleWritingSessions = [
      {
        id: `writing_sample_${now - Math.round(3.2 * day)}`,
        ts: now - (3.2 * day),
        learnerId: '',
        learnerName: 'Sample Learner',
        gradeBand: '3-5',
        genre: 'opinion',
        planner: 'sutw-frame',
        promptId: 'sample',
        frameId: 'sample::sutw-frame',
        text: 'School gardens should be part of every campus. First, students learn science by growing plants. Next, they can write observations and share what they discover. In conclusion, gardens build responsibility and stronger writing habits.',
        wordCount: 41,
        dimensions: {
          topicClaim: 'growing',
          detailsEvidence: 'growing',
          organizationTransitions: 'not-yet',
          conventions: 'growing'
        },
        checklist: [],
        missionsCompleted: 0,
        missionsAssigned: 2,
        nextStep: 'Add one transition and strengthen your conclusion.',
        strengths: ['Topic sentence'],
        stageProgress: { plan: true, draft: true, check: true, revise: false, publish: false },
        readiness: { readyCount: 0, total: 4, percent: 25 }
      },
      {
        id: `writing_sample_${now - Math.round(2.2 * day)}`,
        ts: now - (2.2 * day),
        learnerId: '',
        learnerName: 'Sample Learner',
        gradeBand: '3-5',
        genre: 'opinion',
        planner: 'sutw-frame',
        promptId: 'sample',
        frameId: 'sample::sutw-frame',
        text: 'School gardens should be part of every campus. First, students learn science by growing plants. For example, our class tracked seed growth each week and wrote reflections. In conclusion, gardens teach responsibility and clear communication.',
        wordCount: 43,
        dimensions: {
          topicClaim: 'ready',
          detailsEvidence: 'growing',
          organizationTransitions: 'growing',
          conventions: 'growing'
        },
        checklist: [],
        missionsCompleted: 1,
        missionsAssigned: 2,
        nextStep: 'Add one more evidence detail.',
        strengths: ['Topic sentence', 'Transitions / Power words'],
        stageProgress: { plan: true, draft: true, check: true, revise: true, publish: true },
        readiness: { readyCount: 1, total: 4, percent: 50 }
      },
      {
        id: `writing_sample_${now - Math.round(1.1 * day)}`,
        ts: now - (1.1 * day),
        learnerId: '',
        learnerName: 'Sample Learner',
        gradeBand: '3-5',
        genre: 'opinion',
        planner: 'sutw-frame',
        promptId: 'sample',
        frameId: 'sample::sutw-frame',
        text: 'School gardens should be part of every campus. First, students learn science by growing plants. For example, our class tracked seed growth each week and compared data in groups. Also, students practice teamwork while they explain evidence. In conclusion, gardens build responsibility and stronger writing.',
        wordCount: 51,
        dimensions: {
          topicClaim: 'ready',
          detailsEvidence: 'ready',
          organizationTransitions: 'growing',
          conventions: 'growing'
        },
        checklist: [],
        missionsCompleted: 1,
        missionsAssigned: 2,
        nextStep: 'Polish conventions and conclusion sentence.',
        strengths: ['Topic sentence', 'Details / Evidence'],
        stageProgress: { plan: true, draft: true, check: true, revise: true, publish: true },
        readiness: { readyCount: 2, total: 4, percent: 75 }
      },
      {
        id: `writing_sample_${now - Math.round(0.3 * day)}`,
        ts: now - (0.3 * day),
        learnerId: '',
        learnerName: 'Sample Learner',
        gradeBand: '3-5',
        genre: 'opinion',
        planner: 'sutw-frame',
        promptId: 'sample',
        frameId: 'sample::sutw-frame',
        text: 'School gardens should be part of every campus. First, students learn science by growing plants. For example, our class tracked seed growth each week and wrote evidence statements about what changed. Next, students explain their reasoning using transitions like therefore and as a result. In conclusion, gardens build responsibility, vocabulary, and stronger writing habits.',
        wordCount: 60,
        dimensions: {
          topicClaim: 'ready',
          detailsEvidence: 'ready',
          organizationTransitions: 'ready',
          conventions: 'growing'
        },
        checklist: [],
        missionsCompleted: 2,
        missionsAssigned: 3,
        nextStep: 'Polish conventions one final time.',
        strengths: ['Topic sentence', 'Details / Evidence', 'Transitions / Power words'],
        stageProgress: { plan: true, draft: true, check: true, revise: true, publish: true },
        readiness: { readyCount: 3, total: 4, percent: 75 }
      }
    ];
    localStorage.setItem(WRITING_SESSION_STORE_KEY, JSON.stringify(sampleWritingSessions));
  }

  function refreshReport() {
    const learner = window.DECODE_PLATFORM?.getActiveLearner?.();
    if (learnerNameEl) learnerNameEl.textContent = learner?.name || 'Learner';
    if (generatedAtEl) generatedAtEl.textContent = new Date().toLocaleString();
    renderStudentQuickCheckPanel();

    const logs = getLogs();
    const metrics = renderMetrics(logs);
    const writingProgress = renderWritingProgressSnapshot(learner);
    renderWritingStepUpHeatmap(learner);
    const rows = renderHeatmap(logs);
    const placementRec = getPlacementRecommendation();
    const weakest = getWeakestStandardRow(rows);
    renderFocus(placementRec, weakest);

    const pulse = buildPulseModel(logs, placementRec, weakest, { gradeBand: learner?.gradeBand });
    renderPulse(pulse);
    const numeracyLogs = getNumeracyLogs();
    const classBlockLogs = getClassBlockLaunchLogs();
    const numeracyPulse = buildNumeracyPulseModel(numeracyLogs, { gradeBand: learner?.gradeBand });
    renderNumeracyPulse(numeracyPulse);
    renderOutcomeProof(logs, pulse, placementRec, weakest);
    renderFrameworkCrosswalk(pulse);
    renderBenchmarks(learner, pulse);
    renderShareSummary(learner, metrics, pulse, weakest, placementRec, writingProgress);

    if (builderGradeEl && learner?.gradeBand) {
      builderGradeEl.value = normalizeGradeBand(learner.gradeBand);
    }
    if (builderFocusEl) {
      const recommendedFocus = recommendBuilderFocus(placementRec, weakest, getDomainStats(logs));
      builderFocusEl.value = recommendedFocus;
    }
    renderBuilderPlan({ gradeBand: learner?.gradeBand });

    latestGoalContext = {
      learner,
      pulse,
      placementRec,
      weakestRow: weakest
    };
    renderGoalDraft(latestGoalContext);

    latestProtocolContext = {
      learner,
      pulse,
      placementRec,
      weakestRow: weakest
    };
    renderInterventionProtocol(latestProtocolContext);

    latestNumeracyContext = {
      learner,
      pulse: numeracyPulse
    };
    renderNumeracyProtocol(latestNumeracyContext);

    latestRoleContext = {
      learner,
      pulse,
      numeracyPulse,
      logs,
      numeracyLogs,
      classBlockLogs,
      placementRec,
      weakestRow: weakest
    };
    if (roleSelectEl && !roleSelectEl.dataset.manualRole) {
      roleSelectEl.value = recommendRolePathwayId(pulse);
    }
    renderRolePathway(latestRoleContext);

    latestParentContext = {
      learner,
      pulse,
      numeracyPulse,
      writingProgress
    };
    latestIespContext = {
      learner,
      pulse,
      numeracyPulse,
      logs,
      numeracyLogs,
      classBlockLogs,
      manualTimelineLogs: loadManualTimelineEntries()
    };
    latestClassBlockContext = {
      learner,
      pulse,
      numeracyPulse,
      placementRec,
      logs,
      numeracyLogs,
      classBlockLogs
    };
    latestLeadershipContext = {
      learner,
      pulse,
      numeracyPulse,
      logs,
      numeracyLogs,
      classBlockLogs,
      metrics,
      placementRec,
      weakestRow: weakest
    };
    latestSprintContext = latestIespContext;
    if (sprintOwnerEl && !sprintOwnerEl.dataset.manualOwner) {
      const suggestedOwner = resolveIespOwnerRole();
      const hasOwner = Array.from(sprintOwnerEl.options || []).some((option) => option.value === suggestedOwner);
      if (hasOwner) sprintOwnerEl.value = suggestedOwner;
    }
    renderInterventionTimeline(latestIespContext);
    renderIespDraft(latestIespContext);
    renderSprintBoard(latestSprintContext);
    renderClassBlockLauncher(latestClassBlockContext);
    renderDemoReadiness(latestLeadershipContext);
    renderShowcaseFlow(latestLeadershipContext);
    buildLeadershipPackText(latestLeadershipContext);
    renderParentMessagePanel(latestParentContext);
    renderReportMediaViewsFromCache();
  }

  renderBuilderFocusOptions();
  refreshBtn?.addEventListener('click', refreshReport);
  quickCheckClearBtn?.addEventListener('click', () => {
    try {
      localStorage.removeItem(STUDENT_QUICKCHECK_KEY);
    } catch {}
    renderStudentQuickCheckPanel();
  });
  loadSampleBtn?.addEventListener('click', () => {
    loadSampleData();
    refreshReport();
    if (shareStatusEl) shareStatusEl.textContent = 'Sample data loaded.';
  });
  demoAutopilotBtn?.addEventListener('click', () => {
    runDemoAutopilot();
  });
  exportPdfBtn?.addEventListener('click', exportPdf);
  printBtn?.addEventListener('click', () => window.print());
  shareCopyBtn?.addEventListener('click', () => {
    copyShareSummary();
  });
  writingCopyBtn?.addEventListener('click', () => {
    copyWritingSnapshot();
  });
  demoCopyBtn?.addEventListener('click', () => {
    copyDemoReadiness();
  });
  showcaseCopyBtn?.addEventListener('click', () => {
    copyShowcaseScript();
  });
  leadershipExportBtn?.addEventListener('click', () => {
    exportLeadershipPack();
  });
  builderGenerateBtn?.addEventListener('click', () => renderBuilderPlan());
  builderCopyBtn?.addEventListener('click', () => {
    copyBuilderPlan();
  });
  goalGenerateBtn?.addEventListener('click', () => {
    if (latestGoalContext) {
      renderGoalDraft(latestGoalContext);
    }
  });
  goalCopyBtn?.addEventListener('click', () => {
    copyGoalDraft();
  });
  protocolGenerateBtn?.addEventListener('click', () => {
    if (latestProtocolContext) {
      renderInterventionProtocol(latestProtocolContext);
    }
  });
  protocolCopyBtn?.addEventListener('click', () => {
    copyInterventionProtocol();
  });
  numeracyGenerateBtn?.addEventListener('click', () => {
    if (latestNumeracyContext) {
      renderNumeracyProtocol(latestNumeracyContext);
    }
  });
  numeracyImportPreviewBtn?.addEventListener('click', () => {
    handleNumeracyCsvPreview();
  });
  numeracyImportTemplateBtn?.addEventListener('click', () => {
    downloadNumeracyTemplateCsv();
  });
  numeracyImportHeadersBtn?.addEventListener('click', () => {
    downloadNumeracyAcceptedHeadersCsv();
  });
  numeracyImportAllTemplatesBtn?.addEventListener('click', () => {
    downloadNumeracyAllTemplatesBundle();
  });
  numeracyImportBtn?.addEventListener('click', () => {
    commitNumeracyCsvImport();
  });
  numeracyImportUndoBtn?.addEventListener('click', () => {
    undoNumeracyCsvImport();
  });
  numeracyCopyBtn?.addEventListener('click', () => {
    copyNumeracyProtocol();
  });
  goalDomainEl?.addEventListener('change', () => {
    if (latestGoalContext) {
      renderGoalDraft(latestGoalContext);
    }
  });
  goalTierEl?.addEventListener('change', () => {
    if (latestGoalContext) {
      renderGoalDraft(latestGoalContext);
    }
  });
  goalHorizonEl?.addEventListener('change', () => {
    if (latestGoalContext) {
      renderGoalDraft(latestGoalContext);
    }
  });
  protocolDomainEl?.addEventListener('change', () => {
    if (latestProtocolContext) {
      renderInterventionProtocol(latestProtocolContext);
    }
  });
  protocolTierEl?.addEventListener('change', () => {
    if (latestProtocolContext) {
      renderInterventionProtocol(latestProtocolContext);
    }
  });
  protocolRoleEl?.addEventListener('change', () => {
    if (latestProtocolContext) {
      renderInterventionProtocol(latestProtocolContext);
    }
  });
  protocolCycleEl?.addEventListener('change', () => {
    if (latestProtocolContext) {
      renderInterventionProtocol(latestProtocolContext);
    }
  });
  numeracyDomainEl?.addEventListener('change', () => {
    if (latestNumeracyContext) {
      renderNumeracyProtocol(latestNumeracyContext);
    }
  });
  numeracyTierEl?.addEventListener('change', () => {
    if (latestNumeracyContext) {
      renderNumeracyProtocol(latestNumeracyContext);
    }
  });
  numeracyCycleEl?.addEventListener('change', () => {
    if (latestNumeracyContext) {
      renderNumeracyProtocol(latestNumeracyContext);
    }
  });
  numeracyAssessmentEl?.addEventListener('change', () => {
    if (latestNumeracyContext) {
      renderNumeracyPulse(latestNumeracyContext.pulse);
      renderNumeracyProtocol(latestNumeracyContext);
    }
  });
  numeracyStrategyEl?.addEventListener('change', () => {
    if (latestNumeracyContext) {
      renderNumeracyProtocol(latestNumeracyContext);
    }
  });
  numeracyImportSourceEl?.addEventListener('change', () => {
    pendingNumeracyImport = null;
    renderNumeracyImportSpec();
    renderNumeracyImportPreview();
    syncNumeracyImportActions();
    setNumeracyImportStatus('Source changed. Download template/headers if needed, then preview your CSV.');
  });
  numeracyImportFileEl?.addEventListener('change', () => {
    pendingNumeracyImport = null;
    renderNumeracyImportPreview();
    syncNumeracyImportActions();
    if (numeracyImportFileEl?.files?.[0]) {
      setNumeracyImportStatus('File selected. Click Preview CSV to review mapped rows before committing.');
    }
  });
  roleSelectEl?.addEventListener('change', () => {
    roleSelectEl.dataset.manualRole = 'true';
    if (protocolRoleEl) {
      const normalized = normalizeRoleId(roleSelectEl.value || '');
      const hasProtocolRole = Array.from(protocolRoleEl.options || []).some((option) => option.value === normalized);
      if (hasProtocolRole) protocolRoleEl.value = normalized;
      if (classBlockRoleEl && !classBlockRoleEl.dataset.manualRole) {
        classBlockRoleEl.value = normalized;
      }
    }
    if (latestRoleContext) {
      renderRolePathway(latestRoleContext);
    }
    if (latestClassBlockContext) {
      renderClassBlockLauncher(latestClassBlockContext);
    }
  });
  roleCopyBtn?.addEventListener('click', () => {
    copyRolePathway();
  });
  classBlockRoleEl?.addEventListener('change', () => {
    classBlockRoleEl.dataset.manualRole = 'true';
    if (latestClassBlockContext) {
      renderClassBlockLauncher(latestClassBlockContext);
    }
  });
  classBlockGradeEl?.addEventListener('change', () => {
    classBlockGradeEl.dataset.manualGrade = 'true';
    if (latestClassBlockContext) {
      renderClassBlockLauncher(latestClassBlockContext);
    }
  });
  classBlockGridEl?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const launchEl = target.closest('.report-class-block-launch');
    if (!(launchEl instanceof HTMLElement)) return;
    logClassBlockLaunchFromElement(launchEl);
  });
  parentGenerateBtn?.addEventListener('click', () => {
    generateParentMessageDraft();
  });
  parentSaveBtn?.addEventListener('click', () => {
    saveParentMessageDraft();
  });
  parentTemplateBtn?.addEventListener('click', () => {
    applyParentStarterTemplate();
  });
  parentCopyBtn?.addEventListener('click', () => {
    copyParentMessageDraft();
  });
  parentIntentEl?.addEventListener('change', () => {
    if (latestParentContext) {
      generateParentMessageDraft();
    }
  });
  parentLanguageEl?.addEventListener('change', () => {
    if (latestParentContext) {
      generateParentMessageDraft();
    }
  });
  parentReadingLevelEl?.addEventListener('change', () => {
    if (latestParentContext) {
      generateParentMessageDraft();
    }
  });
  parentTemplateEl?.addEventListener('change', () => {
    setParentMessageStatus(`Starter template selected: ${parentTemplateLabel(parentTemplateEl.value || 'progress')}.`);
  });
  parentMessageInputEl?.addEventListener('input', () => {
    latestParentMessageText = String(parentMessageInputEl.value || '').trim();
    if (latestParentContext) renderParentMessagePanel(latestParentContext);
  });
  iespGenerateBtn?.addEventListener('click', () => {
    if (!latestIespContext) {
      setIespStatus('Refresh report first to build an IESP draft.', true);
      return;
    }
    renderIespDraft(latestIespContext);
    setIespStatus('IESP draft generated.');
  });
  iespCopyBtn?.addEventListener('click', () => {
    copyIespDraft();
  });
  iespExportTeamBtn?.addEventListener('click', () => {
    exportIespDraft('team');
  });
  iespExportParentBtn?.addEventListener('click', () => {
    exportIespDraft('parent');
  });
  iespTrackEl?.addEventListener('change', () => {
    if (latestIespContext) renderIespDraft(latestIespContext);
  });
  iespCycleEl?.addEventListener('change', () => {
    if (latestIespContext) renderIespDraft(latestIespContext);
  });
  iespOwnerEl?.addEventListener('change', () => {
    if (latestIespContext) renderIespDraft(latestIespContext);
    if (sprintOwnerEl && !sprintOwnerEl.dataset.manualOwner) {
      const suggestedOwner = resolveIespOwnerRole();
      const hasOwner = Array.from(sprintOwnerEl.options || []).some((option) => option.value === suggestedOwner);
      if (hasOwner) sprintOwnerEl.value = suggestedOwner;
      if (latestSprintContext) renderSprintBoard(latestSprintContext);
    }
  });
  timelineExportBtn?.addEventListener('click', () => {
    exportTimelineCsv();
  });
  timelineDemoFillBtn?.addEventListener('click', () => {
    seedDemoManualTimelineEntries();
  });
  timelineFilterTrackEl?.addEventListener('change', () => {
    if (latestIespContext) {
      renderInterventionTimeline(latestIespContext);
    } else {
      renderInterventionTimeline({ manualTimelineLogs: loadManualTimelineEntries() });
    }
  });
  timelineFilterWindowEl?.addEventListener('change', () => {
    if (latestIespContext) {
      renderInterventionTimeline(latestIespContext);
    } else {
      renderInterventionTimeline({ manualTimelineLogs: loadManualTimelineEntries() });
    }
  });
  timelineFilterSearchEl?.addEventListener('input', () => {
    if (latestIespContext) {
      renderInterventionTimeline(latestIespContext);
    } else {
      renderInterventionTimeline({ manualTimelineLogs: loadManualTimelineEntries() });
    }
  });
  timelineManualAddBtn?.addEventListener('click', () => {
    addManualTimelineEntry();
  });
  timelineManualClearBtn?.addEventListener('click', () => {
    clearManualTimelineEntries();
  });
  sprintGenerateBtn?.addEventListener('click', () => {
    if (!latestSprintContext) {
      setSprintStatus('Refresh report first to build a sprint board.', true);
      return;
    }
    renderSprintBoard(latestSprintContext);
    setSprintStatus('Sprint board generated.');
  });
  sprintCopyBtn?.addEventListener('click', () => {
    copySprintBoard();
  });
  sprintExportBtn?.addEventListener('click', () => {
    exportSprintBoard();
  });
  sprintTrackEl?.addEventListener('change', () => {
    if (latestSprintContext) renderSprintBoard(latestSprintContext);
  });
  sprintWindowEl?.addEventListener('change', () => {
    if (latestSprintContext) renderSprintBoard(latestSprintContext);
  });
  sprintOwnerEl?.addEventListener('change', () => {
    sprintOwnerEl.dataset.manualOwner = 'true';
    if (latestSprintContext) renderSprintBoard(latestSprintContext);
  });
  reportMediaOpenBtn?.addEventListener('click', () => {
    openReportMediaModal(reportMediaFilterSectionEl?.value && reportMediaFilterSectionEl.value !== 'all'
      ? reportMediaFilterSectionEl.value
      : (reportMediaSectionEl?.value || 'literacy-pulse'));
  });
  reportMediaCloseBtn?.addEventListener('click', () => {
    closeReportMediaModal();
  });
  reportMediaOverlayEl?.addEventListener('click', () => {
    closeReportMediaModal();
  });
  reportMediaStartBtn?.addEventListener('click', () => {
    startReportMediaRecording();
  });
  reportMediaStopBtn?.addEventListener('click', () => {
    stopReportMediaRecording();
  });
  reportMediaSaveBtn?.addEventListener('click', () => {
    saveReportMediaDraft();
  });
  reportMediaDiscardBtn?.addEventListener('click', () => {
    clearReportMediaDraft();
    setReportMediaStatus('Draft cleared.', false, true);
  });
  reportMediaSourceEl?.addEventListener('change', () => {
    setReportMediaStatus(`Capture mode: ${reportMediaSourceEl.value === 'screen' ? 'Screen/whiteboard share' : reportMediaSourceEl.value}.`, false, true);
    updateReportMediaPrompt();
  });
  reportMediaSectionEl?.addEventListener('change', () => {
    setReportMediaStatus(`Target section: ${reportMediaSectionLabel(reportMediaSectionEl.value)}.`, false, true);
    updateReportMediaPrompt();
  });
  reportMediaOwnerEl?.addEventListener('change', () => {
    updateReportMediaPrompt();
  });
  reportMediaCategoryEl?.addEventListener('change', () => {
    updateReportMediaPrompt();
  });
  reportMediaSearchEl?.addEventListener('input', () => {
    renderReportMediaViewsFromCache();
  });
  reportMediaFilterSectionEl?.addEventListener('change', () => {
    renderReportMediaViewsFromCache();
  });
  reportMediaFilterOwnerEl?.addEventListener('change', () => {
    renderReportMediaViewsFromCache();
  });
  reportMediaFilterCategoryEl?.addEventListener('change', () => {
    renderReportMediaViewsFromCache();
  });
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const openBtn = target.closest('.report-media-open-section-btn');
    if (openBtn instanceof HTMLElement && openBtn.dataset.targetSection) {
      openReportMediaModal(openBtn.dataset.targetSection);
      return;
    }

    const deleteBtn = target.closest('.report-media-delete-btn');
    if (deleteBtn instanceof HTMLElement && deleteBtn.dataset.mediaDelete) {
      deleteReportMediaClipFromUi(deleteBtn.dataset.mediaDelete);
      return;
    }

    const parentLoadBtn = target.closest('.report-parent-load-btn');
    if (parentLoadBtn instanceof HTMLElement && parentLoadBtn.dataset.parentLoad) {
      loadSavedParentMessageById(parentLoadBtn.dataset.parentLoad, latestParentContext?.learner || null);
      return;
    }

    const sprintToggleBtn = target.closest('.report-sprint-toggle');
    if (sprintToggleBtn instanceof HTMLElement && sprintToggleBtn.dataset.sprintTaskId && sprintToggleBtn.dataset.sprintContextKey) {
      const wasDone = sprintToggleBtn.dataset.sprintDone === '1';
      toggleSprintTaskFromUi(sprintToggleBtn.dataset.sprintContextKey, sprintToggleBtn.dataset.sprintTaskId, wasDone);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && reportMediaModalEl && !reportMediaModalEl.classList.contains('hidden')) {
      closeReportMediaModal();
    }
  });
  builderGradeEl?.addEventListener('change', () => renderBuilderPlan());
  builderFocusEl?.addEventListener('change', () => renderBuilderPlan());
  builderDurationEl?.addEventListener('change', () => renderBuilderPlan());

  renderReportMediaSelects();
  applyInitialRoleFromQuery();
  setDefaultTimelineManualWhen();
  updateReportMediaPrompt();
  syncReportMediaRecorderButtons();
  renderReportMediaViewsFromCache();
  refreshReportMediaViews();
  renderNumeracyImportSpec();
  renderNumeracyImportPreview();
  syncNumeracyImportActions();
  refreshReport();
  runDemoAutopilotFromQuery();
})();
