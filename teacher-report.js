// Teacher report: printable growth summary + standards mastery heatmap.
(function () {
  const ACTIVITY_LABELS = {
    'word-quest': 'Word Quest',
    cloze: 'Story Fill',
    comprehension: 'Read & Think',
    fluency: 'Speed Sprint',
    madlibs: 'Silly Stories',
    writing: 'Write & Build',
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
      focus: 'Silly Stories + Write & Build',
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
      focus: 'Write & Build',
      notes: 'Use plan-to-draft frames with explicit detail sentences.'
    },
    'W.3.4': {
      focus: 'Write & Build revisions',
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
    writing: 'writing.html',
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
    }
  };

  const ROLE_PROTOCOL_GUIDANCE = {
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
    'sel-counselor': {
      progressLens: 'Track planning stamina, self-monitoring language, and emotional regulation during literacy tasks.',
      handoff: 'Use shared check-in/check-out language with teachers to reinforce reflection and persistence goals.',
      familyBridge: 'Send one regulation strategy tied to homework reading/writing time.'
    },
    leadership: {
      progressLens: 'Track implementation consistency, cycle fidelity, and learner growth against benchmark checkpoints.',
      handoff: 'Use weekly pulse + protocol review in team meetings to decide supports, staffing, and next cycle focus.',
      familyBridge: 'Provide a concise summary of gains, next target, and support plan in family-friendly language.'
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
    'role-pathway': { label: 'Role Pathway' },
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

  const REPORT_MEDIA_MAX_ITEMS = 400;

  const NUMERACY_IMPORT_UNDO_KEY = 'decode_numeracy_import_undo_v1';

  const learnerNameEl = document.getElementById('report-learner-name');
  const generatedAtEl = document.getElementById('report-generated-at');
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
  const rolePathwayEl = document.getElementById('report-role-pathway');
  const roleCopyBtn = document.getElementById('report-role-copy');
  const roleStatusEl = document.getElementById('report-role-status');

  let latestBuilderText = '';
  let latestShareText = '';
  let latestGoalText = '';
  let latestProtocolText = '';
  let latestNumeracyText = '';
  let latestRolePathwayText = '';
  let latestGoalContext = null;
  let latestProtocolContext = null;
  let latestNumeracyContext = null;
  let latestRoleContext = null;
  let pendingNumeracyImport = null;
  let reportMediaDbPromise = null;
  let reportMediaRecorderState = null;
  let reportMediaDraft = null;
  let reportMediaClips = [];
  let reportMediaObjectUrls = [];

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
      'Decode the Word - Numeracy CSV Template Bundle',
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
    const fileStem = `decode-report-${slugify(learner?.name || 'learner')}-${buildDateSlug(today)}`;
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
      .join(', ') || 'Word Quest, Read & Think, Write & Build';

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
    if (selected !== 'auto' && ROLE_PATHWAY_LIBRARY[selected]) return selected;
    return recommendRolePathwayId(pulse);
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

  function recommendRolePathwayId(pulse) {
    const topDomain = pulse?.gaps?.[0]?.domain || '';
    if (topDomain === 'fluency') return 'slp';
    if (topDomain === 'executive-function') return 'sel-counselor';
    if (topDomain === 'comprehension' || topDomain === 'written-language') return 'eal';
    return 'learning-support';
  }

  function getRoleStepHref(step, context = {}) {
    if (!step?.activity) return '#';
    if (step.activity === 'teacher-report') {
      return step.anchor || 'teacher-report.html';
    }
    return getActivityHref(step.activity, context);
  }

  function renderRolePathway(context = {}) {
    if (!rolePathwayEl || !roleSelectEl) return;
    const learner = context.learner || null;
    const pulse = context.pulse || null;
    const placementRec = context.placementRec || null;
    const weakestRow = context.weakestRow || null;
    const preferredRoleId = recommendRolePathwayId(pulse);

    if (!roleSelectEl.value || !ROLE_PATHWAY_LIBRARY[roleSelectEl.value]) {
      roleSelectEl.value = preferredRoleId;
    }

    const roleId = roleSelectEl.value || preferredRoleId;
    const pathway = ROLE_PATHWAY_LIBRARY[roleId] || ROLE_PATHWAY_LIBRARY['learning-support'];
    const gradeBand = normalizeGradeBand(learner?.gradeBand || builderGradeEl?.value || '3-5');
    const focusProfile = FOCUS_LIBRARY[pathway.focusId] || FOCUS_LIBRARY['comprehension-evidence'];
    const defaultWordQuest = focusProfile.wordQuestFocusByBand?.[gradeBand] || { focus: 'all', len: 'any' };
    const wordQuestFocus = placementRec?.focus || defaultWordQuest.focus;
    const wordQuestLength = placementRec?.length || defaultWordQuest.len;
    const urgentDomain = pulse?.traffic?.red?.[0] || 'No urgent domain currently flagged.';
    const topPriority = pulse?.topPriority || 'Run at least 3 scored sessions to produce stronger role-specific recommendations.';

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

    latestRolePathwayText = [
      `${pathway.label} Launch Pathway`,
      `Grade band: ${gradeBand}`,
      `Team fit: ${pathway.fit}`,
      `Goal: ${pathway.goal}`,
      `Top priority: ${topPriority}`,
      `Urgent lane: ${urgentDomain}`,
      '',
      ...stepLines
    ].join('\n');

    rolePathwayEl.innerHTML = `
      <div class="report-role-summary">
        <div><strong>${escapeHtml(pathway.label)}</strong> · ${escapeHtml(pathway.fit)}</div>
        <div>${escapeHtml(pathway.goal)}</div>
        <div><strong>Current top priority:</strong> ${escapeHtml(topPriority)}</div>
        <div><strong>Urgent lane from R/Y/G:</strong> ${escapeHtml(urgentDomain)}</div>
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

  function renderShareSummary(learner, metrics, pulse, weakestRow, placementRec) {
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

  function loadSampleData() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const sampleLog = [
      { activity: 'word-quest', label: 'Word Quest', event: '4/5', ts: now - (0.7 * day), detail: { correct: 4, total: 5 } },
      { activity: 'fluency', label: 'Speed Sprint', event: 'Goal met', ts: now - (0.6 * day), detail: { orf: 82, goal: 95 } },
      { activity: 'comprehension', label: 'Read & Think', event: '3/5', ts: now - (0.5 * day), detail: { correct: 3, total: 5 } },
      { activity: 'writing', label: 'Write & Build', event: 'Built paragraph', ts: now - (0.45 * day), detail: { wordCount: 52 } },
      { activity: 'plan-it', label: 'Plan-It', event: 'Checked (2 issues)', ts: now - (0.4 * day), detail: { issues: 2 } },
      { activity: 'cloze', label: 'Story Fill', event: '2/4', ts: now - (0.35 * day), detail: { correct: 2, total: 4 } },
      { activity: 'word-quest', label: 'Word Quest', event: '3/5', ts: now - (0.3 * day), detail: { correct: 3, total: 5 } },
      { activity: 'fluency', label: 'Speed Sprint', event: 'Checked', ts: now - (0.24 * day), detail: { orf: 76, goal: 95 } },
      { activity: 'comprehension', label: 'Read & Think', event: '4/5', ts: now - (0.18 * day), detail: { correct: 4, total: 5 } },
      { activity: 'madlibs', label: 'Silly Stories', event: 'Completed', ts: now - (0.14 * day), detail: { wordCount: 45 } },
      { activity: 'writing', label: 'Write & Build', event: 'Checked', ts: now - (0.1 * day), detail: { wordCount: 58 } },
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
  }

  function refreshReport() {
    const learner = window.DECODE_PLATFORM?.getActiveLearner?.();
    if (learnerNameEl) learnerNameEl.textContent = learner?.name || 'Learner';
    if (generatedAtEl) generatedAtEl.textContent = new Date().toLocaleString();

    const logs = getLogs();
    const metrics = renderMetrics(logs);
    const rows = renderHeatmap(logs);
    const placementRec = getPlacementRecommendation();
    const weakest = getWeakestStandardRow(rows);
    renderFocus(placementRec, weakest);

    const pulse = buildPulseModel(logs, placementRec, weakest, { gradeBand: learner?.gradeBand });
    renderPulse(pulse);
    const numeracyLogs = getNumeracyLogs();
    const numeracyPulse = buildNumeracyPulseModel(numeracyLogs, { gradeBand: learner?.gradeBand });
    renderNumeracyPulse(numeracyPulse);
    renderOutcomeProof(logs, pulse, placementRec, weakest);
    renderFrameworkCrosswalk(pulse);
    renderBenchmarks(learner, pulse);
    renderShareSummary(learner, metrics, pulse, weakest, placementRec);

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
      placementRec,
      weakestRow: weakest
    };
    if (roleSelectEl && !roleSelectEl.dataset.manualRole) {
      roleSelectEl.value = recommendRolePathwayId(pulse);
    }
    renderRolePathway(latestRoleContext);
    renderReportMediaViewsFromCache();
  }

  renderBuilderFocusOptions();
  refreshBtn?.addEventListener('click', refreshReport);
  loadSampleBtn?.addEventListener('click', () => {
    loadSampleData();
    refreshReport();
    if (shareStatusEl) shareStatusEl.textContent = 'Sample data loaded.';
  });
  exportPdfBtn?.addEventListener('click', exportPdf);
  printBtn?.addEventListener('click', () => window.print());
  shareCopyBtn?.addEventListener('click', () => {
    copyShareSummary();
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
    if (latestRoleContext) {
      renderRolePathway(latestRoleContext);
    }
  });
  roleCopyBtn?.addEventListener('click', () => {
    copyRolePathway();
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
  });
  reportMediaSectionEl?.addEventListener('change', () => {
    setReportMediaStatus(`Target section: ${reportMediaSectionLabel(reportMediaSectionEl.value)}.`, false, true);
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
  syncReportMediaRecorderButtons();
  renderReportMediaViewsFromCache();
  refreshReportMediaViews();
  renderNumeracyImportSpec();
  renderNumeracyImportPreview();
  syncNumeracyImportActions();
  refreshReport();
})();
