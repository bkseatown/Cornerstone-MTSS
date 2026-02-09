const WRITING_PROMPTS = {
  'K-2': {
    opinion: [
      {
        id: 'k2-recess-opinion',
        title: 'Best Recess Game',
        prompt: 'Share your opinion about the best recess game and give reasons.',
        starters: ['I think...', 'One reason is...', 'Another reason is...', 'In conclusion...']
      },
      {
        id: 'k2-class-job',
        title: 'Class Job Choice',
        prompt: 'Which class job would you choose and why?',
        starters: ['I would choose...', 'This matters because...', 'Also...', 'So...']
      }
    ],
    informational: [
      {
        id: 'k2-animal-facts',
        title: 'Animal Facts',
        prompt: 'Teach readers about one animal with clear details.',
        starters: ['My topic is...', 'One detail is...', 'Another detail is...', 'In conclusion...']
      },
      {
        id: 'k2-how-to',
        title: 'How-To Mini Writing',
        prompt: 'Explain how to do something in order.',
        starters: ['First...', 'Next...', 'Then...', 'Finally...']
      }
    ],
    narrative: [
      {
        id: 'k2-small-moment',
        title: 'Small Moment Story',
        prompt: 'Write a short story about one important moment.',
        starters: ['At the beginning...', 'In the middle...', 'At the end...']
      }
    ]
  },
  '3-5': {
    opinion: [
      {
        id: '35-school-change',
        title: 'One School Change',
        prompt: 'What is one change that would make school better? Support your topic sentence with details.',
        starters: ['My opinion is...', 'One important reason is...', 'For example...', 'In conclusion...']
      },
      {
        id: '35-tech-time',
        title: 'Screen Time Balance',
        prompt: 'Should students have daily technology time? Explain with details.',
        starters: ['I believe...', 'Another detail is...', 'This shows that...', 'In conclusion...']
      }
    ],
    informational: [
      {
        id: '35-process-explain',
        title: 'Explain a Process',
        prompt: 'Explain a process clearly with topic sentence, details, and conclusion.',
        starters: ['My topic is...', 'One detail is...', 'Another detail is...', 'In conclusion...']
      },
      {
        id: '35-community-helper',
        title: 'Community Helper Report',
        prompt: 'Write an informational paragraph about a community helper.',
        starters: ['A community helper is...', 'For example...', 'This helps because...', 'In conclusion...']
      }
    ],
    narrative: [
      {
        id: '35-problem-solution',
        title: 'Problem and Resolution',
        prompt: 'Write a narrative with a clear beginning, middle, and end.',
        starters: ['At the beginning...', 'The problem was...', 'Then...', 'In the end...']
      }
    ]
  },
  '6-8': {
    argument: [
      {
        id: '68-school-issue',
        title: 'School Issue Argument',
        prompt: 'Write an argument with thesis, reasons, evidence, and conclusion.',
        starters: ['My thesis is...', 'One reason is...', 'For example...', 'This shows that...', 'In conclusion...']
      },
      {
        id: '68-community-choice',
        title: 'Community Choice',
        prompt: 'Argue for one community improvement using evidence.',
        starters: ['My claim is...', 'Evidence includes...', 'A counterargument is...', 'Ultimately...']
      }
    ],
    informational: [
      {
        id: '68-concept-explain',
        title: 'Explain a Concept',
        prompt: 'Explain an academic concept with evidence and transitions.',
        starters: ['A key idea is...', 'For example...', 'This shows...', 'In conclusion...']
      }
    ],
    narrative: [
      {
        id: '68-scene',
        title: 'Narrative Scene',
        prompt: 'Write a narrative with a clear beginning, conflict, and resolution.',
        starters: ['At first...', 'The conflict began when...', 'Next...', 'By the end...']
      }
    ],
    reflection: [
      {
        id: '68-reflect-growth',
        title: 'Learning Reflection',
        prompt: 'Reflect on a challenge and explain how your thinking changed.',
        starters: ['At first I thought...', 'One key moment was...', 'Now I understand...', 'Next I will...']
      }
    ]
  },
  '9-12': {
    argument: [
      {
        id: '912-policy-argument',
        title: 'Policy Position',
        prompt: 'Write an argument with thesis, evidence, counterargument, and conclusion.',
        starters: ['My thesis is...', 'Evidence suggests...', 'A counterargument is...', 'Therefore...']
      },
      {
        id: '912-ethics',
        title: 'Ethics Position',
        prompt: 'Take a position on an ethical issue and support with evidence.',
        starters: ['I argue that...', 'For instance...', 'This demonstrates...', 'In conclusion...']
      }
    ],
    informational: [
      {
        id: '912-synthesis',
        title: 'Synthesis Response',
        prompt: 'Synthesize two ideas with evidence and cohesive transitions.',
        starters: ['A central concept is...', 'Evidence includes...', 'In contrast...', 'As a result...']
      }
    ],
    narrative: [
      {
        id: '912-turning-point',
        title: 'Turning Point Narrative',
        prompt: 'Write a narrative focused on one turning point and resolution.',
        starters: ['At the beginning...', 'The turning point occurred when...', 'After that...', 'In the end...']
      }
    ],
    reflection: [
      {
        id: '912-reflect-identity',
        title: 'Identity Reflection',
        prompt: 'Reflect on a decision that shaped your thinking.',
        starters: ['One decision that mattered was...', 'This mattered because...', 'I learned that...', 'Moving forward...']
      }
    ]
  }
};

const STATUS_META = {
  ready: { label: 'Ready', icon: '✅' },
  growing: { label: 'Growing', icon: '🟡' },
  'not-yet': { label: 'Not yet', icon: '🟣' },
  'not-assessed': { label: 'Not assessed', icon: '⚪' }
};

const TRANSITION_BANK = [
  'first', 'next', 'then', 'finally',
  'for example', 'for instance', 'because', 'also',
  'however', 'therefore', 'in addition', 'as a result',
  'in conclusion', 'ultimately'
];

const EVIDENCE_BANK = [
  'for example', 'for instance', 'this shows', 'evidence',
  'according to', 'data', 'research', 'quote', 'because'
];

const SUPPORT_BANK = {
  opinion: {
    sentence: ['One important reason is...', 'For example...', 'This shows that...', 'In conclusion...'],
    transitions: ['first', 'next', 'also', 'because', 'therefore'],
    evidence: ['For example...', 'According to...', 'This shows that...']
  },
  argument: {
    sentence: ['My thesis is...', 'One reason is...', 'Evidence suggests...', 'A counterargument is...'],
    transitions: ['however', 'in addition', 'therefore', 'as a result', 'ultimately'],
    evidence: ['For instance...', 'According to...', 'The data suggests...', 'This demonstrates...']
  },
  informational: {
    sentence: ['My topic is...', 'One detail is...', 'For example...', 'In conclusion...'],
    transitions: ['first', 'next', 'in addition', 'for example', 'in conclusion'],
    evidence: ['For example...', 'This shows that...', 'According to...']
  },
  narrative: {
    sentence: ['At the beginning...', 'In the middle...', 'After that...', 'In the end...'],
    transitions: ['first', 'next', 'then', 'suddenly', 'finally'],
    evidence: ['I noticed...', 'This mattered because...', 'One detail was...']
  },
  reflection: {
    sentence: ['At first I thought...', 'One key moment was...', 'Now I understand...', 'Next I will...'],
    transitions: ['at first', 'later', 'because', 'therefore', 'moving forward'],
    evidence: ['For example...', 'One piece of evidence is...', 'This shows...']
  }
};

const STORAGE_KEY = 'writing_studio_stepup_v2';
const SESSIONS_KEY = 'cornerstone_writing_sessions_v2';
const SUPPORT_PREF_PREFIX = 'cornerstone_stepup_supports_v1::';

const STEP_ORDER = ['plan', 'draft', 'check', 'revise', 'publish'];

const gradeSelect = document.getElementById('writing-grade');
const genreSelect = document.getElementById('writing-genre');
const promptSelect = document.getElementById('writing-prompt');
const shuffleBtn = document.getElementById('writing-shuffle');

const promptTitleEl = document.getElementById('writing-prompt-title');
const promptTextEl = document.getElementById('writing-prompt-text');
const startersEl = document.getElementById('writing-starters');

const frameTitleEl = document.getElementById('writing-frame-title');
const frameDescriptionEl = document.getElementById('writing-frame-description');
const planFieldsEl = document.getElementById('writing-plan-fields');
const draftFieldsEl = document.getElementById('writing-draft-fields');

const stepTabs = Array.from(document.querySelectorAll('[data-step-tab]'));
const stepPanels = Array.from(document.querySelectorAll('[data-step-panel]'));

const planNextBtn = document.getElementById('writing-plan-next');
const draftToCheckBtn = document.getElementById('writing-draft-to-check');
const buildBtn = document.getElementById('writing-build');
const checkToReviseBtn = document.getElementById('writing-check-to-revise');
const reviseToPublishBtn = document.getElementById('writing-revise-to-publish');

const checklistEl = document.getElementById('writing-checklist');
const checkNextEl = document.getElementById('writing-check-next');

const missionDepthEl = document.getElementById('writing-mission-depth');
const missionsRefreshBtn = document.getElementById('writing-missions-refresh');
const missionsEl = document.getElementById('writing-missions');
const missionStatusEl = document.getElementById('writing-mission-status');

const previewEl = document.getElementById('writing-preview-text');
const sessionSummaryEl = document.getElementById('writing-session-summary');
const feedbackEl = document.getElementById('writing-feedback');

const copyBtn = document.getElementById('writing-copy');
const printBtn = document.getElementById('writing-print');
const saveSessionBtn = document.getElementById('writing-save-session');
const clearBtn = document.getElementById('writing-clear');

const supportsToggleEl = document.getElementById('writing-supports-toggle');
const supportsEl = document.getElementById('writing-supports');

const state = {
  grade: '3-5',
  genre: 'opinion',
  promptId: '',
  step: 'plan',
  missionDepth: 'level-up',
  planData: {},
  draftData: {},
  checks: [],
  dimensions: {
    topicClaim: 'not-assessed',
    detailsEvidence: 'not-assessed',
    organizationTransitions: 'not-assessed',
    conventions: 'not-assessed'
  },
  nextStep: '',
  missions: [],
  supportsEnabled: true,
  publishText: ''
};

function applyLightTheme() {
  document.body.classList.add('force-light');
  document.documentElement.classList.add('force-light');
  document.documentElement.style.colorScheme = 'light';
}

function safeParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function getActiveLearner() {
  return window.DECODE_PLATFORM?.getActiveLearner?.() || null;
}

function learnerSupportKey() {
  const learner = getActiveLearner();
  const suffix = learner?.id || learner?.name || 'default';
  return `${SUPPORT_PREF_PREFIX}${String(suffix).toLowerCase()}`;
}

function listGrades() {
  return Object.keys(WRITING_PROMPTS);
}

function isUpperGrade(grade) {
  return grade === '6-8' || grade === '9-12';
}

function listGenres(grade) {
  return Object.keys(WRITING_PROMPTS[grade] || {});
}

function genreLabel(genre) {
  if (genre === 'opinion') return 'Opinion';
  if (genre === 'argument') return 'Opinion / Argument';
  if (genre === 'informational') return 'Informational';
  if (genre === 'narrative') return 'Narrative';
  if (genre === 'reflection') return 'Reflection';
  return genre;
}

function promptPool() {
  return (WRITING_PROMPTS[state.grade]?.[state.genre] || []).slice();
}

function currentPrompt() {
  return promptPool().find((prompt) => prompt.id === state.promptId) || promptPool()[0] || null;
}

function getDefaultGradeBand() {
  const fromProfile = window.DECODE_PLATFORM?.getProfile?.()?.gradeBand;
  if (fromProfile && WRITING_PROMPTS[fromProfile]) return fromProfile;
  return '3-5';
}

function ensureValidState() {
  if (!WRITING_PROMPTS[state.grade]) {
    state.grade = getDefaultGradeBand();
  }

  const genres = listGenres(state.grade);
  if (!genres.includes(state.genre)) {
    state.genre = genres[0] || 'opinion';
  }

  const pool = promptPool();
  if (!pool.length) {
    state.promptId = '';
    return;
  }

  const hasPrompt = pool.some((prompt) => prompt.id === state.promptId);
  if (!hasPrompt) {
    state.promptId = pool[0].id;
  }
}

function buildSelectOptions() {
  gradeSelect.innerHTML = listGrades()
    .map((grade) => `<option value="${grade}">${grade}</option>`)
    .join('');
  gradeSelect.value = state.grade;

  genreSelect.innerHTML = listGenres(state.grade)
    .map((genre) => `<option value="${genre}">${genreLabel(genre)}</option>`)
    .join('');
  genreSelect.value = state.genre;

  promptSelect.innerHTML = promptPool()
    .map((prompt) => `<option value="${prompt.id}">${prompt.title}</option>`)
    .join('');
  promptSelect.value = state.promptId;
}

function getFrameConfig(grade, genre) {
  if (genre === 'narrative') {
    return {
      id: 'sutw-narrative',
      kind: 'narrative',
      title: 'Step Up Narrative Writing Frame',
      description: 'Beginning (setting + characters), Middle (problem + events), End (resolution).',
      planFields: [
        { key: 'beginning', label: 'Beginning (Setting + Characters)', placeholder: 'Who is in the story and where does it begin?' },
        { key: 'middle', label: 'Middle (Problem + Events)', placeholder: 'What problem happens and what key events follow?' },
        { key: 'end', label: 'End (Resolution)', placeholder: 'How is the problem resolved?' },
        { key: 'transitionsPower', label: 'Transitions / Power words', placeholder: 'first, next, suddenly, finally...' }
      ],
      draftFields: [
        { key: 'beginning', label: 'Beginning (Setting + Characters)', placeholder: 'Write your opening.' },
        { key: 'middle', label: 'Middle (Problem + Events)', placeholder: 'Write the middle events.' },
        { key: 'end', label: 'End (Resolution)', placeholder: 'Write the ending and resolution.' }
      ]
    };
  }

  if (isUpperGrade(grade) && (genre === 'argument' || genre === 'opinion')) {
    return {
      id: 'sutw-argument',
      kind: 'argument',
      title: 'Step Up Argument Writing Frame',
      description: 'Thesis, reasons + evidence, optional counterargument, then a strong conclusion.',
      planFields: [
        { key: 'thesis', label: 'Thesis', placeholder: 'State your clear claim.' },
        { key: 'reason1Evidence', label: 'Reason 1 + Evidence', placeholder: 'Reason with one piece of evidence.' },
        { key: 'reason2Evidence', label: 'Reason 2 + Evidence', placeholder: 'Second reason with evidence.' },
        { key: 'counterargument', label: 'Counterargument (optional)', placeholder: 'What might the other side say?' },
        { key: 'conclusion', label: 'Conclusion', placeholder: 'Restate your thesis and close strongly.' },
        { key: 'transitionsPower', label: 'Transitions / Power words', placeholder: 'however, in addition, therefore, ultimately...' }
      ],
      draftFields: [
        { key: 'thesis', label: 'Thesis', placeholder: 'State your thesis.' },
        { key: 'reason1Evidence', label: 'Reason 1 + Evidence', placeholder: 'Write reason one and evidence.' },
        { key: 'reason2Evidence', label: 'Reason 2 + Evidence', placeholder: 'Write reason two and evidence.' },
        { key: 'counterargument', label: 'Counterargument (optional)', placeholder: 'Address another perspective.' },
        { key: 'conclusion', label: 'Conclusion', placeholder: 'Conclude with impact and clarity.' }
      ]
    };
  }

  if (grade === 'K-2') {
    return {
      id: 'sutw-k2',
      kind: 'elementary',
      title: 'Step Up Early Writer Frame',
      description: 'Topic sentence, details, and conclusion with simple transitions.',
      planFields: [
        { key: 'topicSentence', label: 'Topic sentence', placeholder: 'What is your main idea?' },
        { key: 'detail1', label: 'Detail 1', placeholder: 'One detail to support your idea.' },
        { key: 'detail2', label: 'Detail 2', placeholder: 'Another detail to support your idea.' },
        { key: 'conclusion', label: 'Conclusion', placeholder: 'How will you end your writing?' },
        { key: 'transitionsPower', label: 'Transitions / Power words', placeholder: 'first, next, because, finally...' }
      ],
      draftFields: [
        { key: 'topicSentence', label: 'Topic sentence', placeholder: 'State your main idea.' },
        { key: 'detail1', label: 'Detail 1', placeholder: 'Add one supporting detail.' },
        { key: 'detail2', label: 'Detail 2', placeholder: 'Add another supporting detail.' },
        { key: 'conclusion', label: 'Conclusion', placeholder: 'Wrap up your writing.' }
      ]
    };
  }

  return {
    id: 'sutw-35',
    kind: 'elementary',
    title: 'Step Up Paragraph Frame',
    description: 'Topic sentence, at least three details, and conclusion.',
    planFields: [
      { key: 'topicSentence', label: 'Topic sentence', placeholder: 'What is your main point?' },
      { key: 'detail1', label: 'Detail 1', placeholder: 'Add evidence or an example.' },
      { key: 'detail2', label: 'Detail 2', placeholder: 'Add another supporting detail.' },
      { key: 'detail3', label: 'Detail 3', placeholder: 'Add one more detail.' },
      { key: 'conclusion', label: 'Conclusion', placeholder: 'How will you close your paragraph?' },
      { key: 'transitionsPower', label: 'Transitions / Power words', placeholder: 'first, next, for example, in conclusion...' }
    ],
    draftFields: [
      { key: 'topicSentence', label: 'Topic sentence', placeholder: 'State your topic sentence.' },
      { key: 'detail1', label: 'Detail 1', placeholder: 'Support your topic with detail one.' },
      { key: 'detail2', label: 'Detail 2', placeholder: 'Support your topic with detail two.' },
      { key: 'detail3', label: 'Detail 3', placeholder: 'Support your topic with detail three.' },
      { key: 'conclusion', label: 'Conclusion', placeholder: 'Write a strong conclusion.' }
    ]
  };
}

function sentenceClass(label) {
  if (/topic|thesis|claim|beginning/i.test(label)) return 'writing-sentence writing-sentence-topic';
  if (/conclusion|end/i.test(label)) return 'writing-sentence writing-sentence-conclusion';
  return 'writing-sentence writing-sentence-detail';
}

function renderPromptCard() {
  const prompt = currentPrompt();
  if (!prompt) {
    promptTitleEl.textContent = 'Prompt';
    promptTextEl.textContent = 'Select a grade and genre to begin.';
    startersEl.innerHTML = '';
    return;
  }

  promptTitleEl.textContent = prompt.title;
  promptTextEl.textContent = prompt.prompt;
  startersEl.innerHTML = (prompt.starters || [])
    .map((starter) => `<span class="writing-starter">${starter}</span>`)
    .join('');
}

function renderFrame() {
  const frame = getFrameConfig(state.grade, state.genre);
  frameTitleEl.textContent = frame.title;
  frameDescriptionEl.textContent = frame.description;

  planFieldsEl.innerHTML = frame.planFields
    .map((field) => `
      <label class="writing-field">
        <span>${field.label}</span>
        <input type="text" data-plan-key="${field.key}" placeholder="${field.placeholder}" value="${escapeAttribute(state.planData[field.key] || '')}" />
      </label>
    `)
    .join('');

  draftFieldsEl.innerHTML = frame.draftFields
    .map((field) => `
      <div class="${sentenceClass(field.label)}">
        <span>${field.label}</span>
        <textarea rows="3" data-draft-key="${field.key}" placeholder="${field.placeholder}">${escapeHtml(state.draftData[field.key] || '')}</textarea>
      </div>
    `)
    .join('');
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttribute(text) {
  return escapeHtml(text).replace(/'/g, '&#39;');
}

function nonEmpty(text) {
  return String(text || '').trim().length > 0;
}

function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function lowercaseText(text) {
  return String(text || '').toLowerCase();
}

function containsAnyPhrase(text, phrases) {
  const source = lowercaseText(text);
  return (phrases || []).some((phrase) => source.includes(lowercaseText(phrase)));
}

function clampStatus(statuses) {
  if (statuses.includes('not-yet')) return 'not-yet';
  if (statuses.includes('growing')) return 'growing';
  if (statuses.includes('ready')) return 'ready';
  return 'not-assessed';
}

function statusPill(status) {
  const meta = STATUS_META[status] || STATUS_META['not-assessed'];
  return `<span class="writing-status-chip status-${status}">${meta.icon} ${meta.label}</span>`;
}

function getDraftText(frame) {
  return frame.draftFields
    .map((field) => ensureSentence(state.draftData[field.key] || ''))
    .filter(Boolean)
    .join('\n\n');
}

function ensureSentence(text) {
  const clean = String(text || '').trim();
  if (!clean) return '';
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function evaluateWriting() {
  const frame = getFrameConfig(state.grade, state.genre);
  const draftText = getDraftText(frame);
  const lowerDraft = lowercaseText(draftText);
  const checklist = [];
  const dimensions = {
    topicClaim: 'not-assessed',
    detailsEvidence: 'not-assessed',
    organizationTransitions: 'not-assessed',
    conventions: 'not-assessed'
  };

  const pushChecklist = (id, title, status, next) => {
    checklist.push({ id, title, status, next });
  };

  if (frame.kind === 'narrative') {
    const beginningStatus = nonEmpty(state.draftData.beginning) ? 'ready' : 'not-yet';
    const middleWords = wordCount(state.draftData.middle || '');
    const middleStatus = middleWords >= 8 ? 'ready' : middleWords >= 4 ? 'growing' : 'not-yet';
    const endStatus = nonEmpty(state.draftData.end) ? 'ready' : 'not-yet';

    pushChecklist('beginning', 'Beginning (Setting + Characters)', beginningStatus, 'Add where the story starts and who is involved.');
    pushChecklist('middle', 'Middle (Problem + Events)', middleStatus, 'Add one more event detail in the middle.');
    pushChecklist('end', 'End (Resolution)', endStatus, 'Strengthen the ending so the resolution is clear.');

    dimensions.topicClaim = beginningStatus;
    dimensions.detailsEvidence = clampStatus([middleStatus, endStatus]);
  } else if (frame.kind === 'argument') {
    const thesisWords = wordCount(state.draftData.thesis || '');
    const thesisStatus = thesisWords >= 8 ? 'ready' : thesisWords >= 4 ? 'growing' : 'not-yet';
    const reasonOne = state.draftData.reason1Evidence || '';
    const reasonTwo = state.draftData.reason2Evidence || '';
    const reasonCount = [reasonOne, reasonTwo].filter(nonEmpty).length;
    const evidenceUsed = containsAnyPhrase(`${reasonOne} ${reasonTwo}`, EVIDENCE_BANK);
    const reasonsStatus = reasonCount >= 2 && evidenceUsed
      ? 'ready'
      : reasonCount >= 1
        ? 'growing'
        : 'not-yet';
    const counterStatus = nonEmpty(state.draftData.counterargument) ? 'ready' : 'growing';
    const conclusionStatus = nonEmpty(state.draftData.conclusion) ? 'ready' : 'not-yet';

    pushChecklist('thesis', 'Clear thesis', thesisStatus, 'State your claim in one strong sentence.');
    pushChecklist('reasons', 'Reasons supported with evidence', reasonsStatus, 'Add evidence language such as “for example” or “this shows that.”');
    pushChecklist('counter', 'Counterargument (optional)', counterStatus, 'Optional: add one opposing point and respond.');
    pushChecklist('conclusion', 'Conclusion', conclusionStatus, 'Strengthen your conclusion by restating the thesis.');

    dimensions.topicClaim = thesisStatus;
    dimensions.detailsEvidence = reasonsStatus;
  } else {
    const topicWords = wordCount(state.draftData.topicSentence || '');
    const topicStatus = topicWords >= 6 ? 'ready' : topicWords >= 3 ? 'growing' : 'not-yet';
    const detailKeys = ['detail1', 'detail2', 'detail3'];
    const detailCount = detailKeys.filter((key) => nonEmpty(state.draftData[key])).length;
    const detailsStatus = detailCount >= 2 ? 'ready' : detailCount === 1 ? 'growing' : 'not-yet';
    const conclusionStatus = nonEmpty(state.draftData.conclusion) ? 'ready' : 'not-yet';

    pushChecklist('topic', 'Topic sentence', topicStatus, 'Write one clear topic sentence first.');
    pushChecklist('details', 'At least 2 details', detailsStatus, 'Add one more detail to support your topic sentence.');
    pushChecklist('conclusion', 'Conclusion', conclusionStatus, 'Add a conclusion that wraps up your thinking.');

    dimensions.topicClaim = topicStatus;
    dimensions.detailsEvidence = detailsStatus;
    dimensions.organizationTransitions = clampStatus([conclusionStatus]);
  }

  const transitionsFound = containsAnyPhrase(`${lowerDraft} ${(state.planData.transitionsPower || '').toLowerCase()}`, TRANSITION_BANK);
  const transitionsStatus = transitionsFound ? 'ready' : wordCount(draftText) >= 20 ? 'growing' : 'not-yet';
  const hasPeriod = /[.!?]/.test(draftText);
  const startsWithCapital = /^[A-Z]/.test(String(draftText || '').trim());
  const conventionsStatus = hasPeriod && startsWithCapital
    ? 'ready'
    : hasPeriod || startsWithCapital
      ? 'growing'
      : 'not-yet';

  pushChecklist('transitions', 'Transitions / Power words', transitionsStatus, 'Add a transition (power word) between ideas.');
  pushChecklist('conventions', 'Conventions', conventionsStatus, 'Check capitalization and ending punctuation.');

  dimensions.organizationTransitions = clampStatus([dimensions.organizationTransitions, transitionsStatus]);
  dimensions.conventions = conventionsStatus;

  const firstNotReady = checklist.find((item) => item.status === 'not-yet') || checklist.find((item) => item.status === 'growing');
  const nextStep = firstNotReady ? firstNotReady.next : 'Keep this draft and publish it. Your Step Up structure is ready.';

  const strengths = checklist
    .filter((item) => item.status === 'ready')
    .slice(0, 3)
    .map((item) => item.title);

  return {
    checklist,
    dimensions,
    nextStep,
    strengths,
    wordCount: wordCount(draftText),
    text: draftText
  };
}

function renderChecklist(result) {
  const checklist = Array.isArray(result?.checklist) ? result.checklist : [];
  if (!checklist.length) {
    checklistEl.innerHTML = '<div class="writing-help">Run the check after drafting to see Step Up feedback.</div>';
    checkNextEl.textContent = '';
    return;
  }

  checklistEl.innerHTML = checklist
    .map((item) => `
      <article class="writing-check-item status-${item.status}">
        <div>${statusPill(item.status)}</div>
        <div>
          <div class="writing-check-title">${escapeHtml(item.title)}</div>
          <div class="writing-help">Next step: ${escapeHtml(item.next)}</div>
        </div>
      </article>
    `)
    .join('');

  checkNextEl.textContent = `Recommended next step: ${result.nextStep}`;
}

function buildMissionPool(result) {
  const missions = [];
  const checklistMap = new Map((result?.checklist || []).map((item) => [item.id, item]));

  const topic = checklistMap.get('topic') || checklistMap.get('thesis') || checklistMap.get('beginning');
  const details = checklistMap.get('details') || checklistMap.get('reasons') || checklistMap.get('middle');
  const conclusion = checklistMap.get('conclusion') || checklistMap.get('end');
  const transitions = checklistMap.get('transitions');
  const conventions = checklistMap.get('conventions');

  if (topic && topic.status !== 'ready') {
    missions.push({
      id: 'mission-topic-claim',
      title: 'Strengthen your topic sentence or claim.',
      tip: 'Try one clear sentence that tells the reader exactly what this piece is about.',
      done: false
    });
  }

  if (details && details.status !== 'ready') {
    missions.push({
      id: 'mission-details',
      title: 'Add one more detail to support your topic sentence.',
      tip: 'Use “For example...” or “One important reason is...” to elaborate.',
      done: false
    });
  }

  if (transitions && transitions.status !== 'ready') {
    missions.push({
      id: 'mission-transition',
      title: 'Add a transition (power word) between paragraphs.',
      tip: 'Try “however,” “next,” “therefore,” or “in conclusion.”',
      done: false
    });
  }

  if (conclusion && conclusion.status !== 'ready') {
    missions.push({
      id: 'mission-conclusion',
      title: 'Strengthen your conclusion.',
      tip: 'Restate your main point and leave the reader with one clear final thought.',
      done: false
    });
  }

  if (conventions && conventions.status !== 'ready') {
    missions.push({
      id: 'mission-conventions',
      title: 'Polish conventions for readability.',
      tip: 'Check capitalization, punctuation, and sentence endings one line at a time.',
      done: false
    });
  }

  if (!missions.length) {
    missions.push({
      id: 'mission-polish',
      title: 'Polish one sentence with stronger elaboration.',
      tip: 'Choose one sentence and add a detail that makes your thinking clearer.',
      done: false
    });
  }

  return missions;
}

function missionLimit(depth) {
  if (depth === 'quick') return 1;
  if (depth === 'deep') return 5;
  return 3;
}

function buildRevisionMissions() {
  const result = evaluateWriting();
  state.checks = result.checklist;
  state.dimensions = result.dimensions;
  state.nextStep = result.nextStep;

  const pool = buildMissionPool(result);
  const limit = missionLimit(state.missionDepth);
  const existingDone = new Map(state.missions.map((mission) => [mission.id, !!mission.done]));
  state.missions = pool.slice(0, limit).map((mission) => ({
    ...mission,
    done: existingDone.get(mission.id) || false
  }));

  renderMissions();
  renderChecklist(result);
  renderPublishPreview();
  saveState();
}

function renderMissions() {
  if (!state.missions.length) {
    missionsEl.innerHTML = '<div class="writing-help">Run Step Up Check first to generate missions.</div>';
    missionStatusEl.textContent = '';
    return;
  }

  missionsEl.innerHTML = state.missions
    .map((mission) => `
      <article class="writing-mission ${mission.done ? 'done' : ''}">
        <label>
          <input type="checkbox" data-mission-id="${mission.id}" ${mission.done ? 'checked' : ''} />
          <span>${escapeHtml(mission.title)}</span>
        </label>
        <button class="secondary-btn" type="button" data-show-tip="${mission.id}">Show me how</button>
        <div class="writing-help hidden" data-tip-id="${mission.id}">${escapeHtml(mission.tip)}</div>
      </article>
    `)
    .join('');

  const completed = state.missions.filter((mission) => mission.done).length;
  missionStatusEl.textContent = completed === state.missions.length
    ? 'Revision Quest complete. Nice revision growth.'
    : `${completed}/${state.missions.length} missions complete.`;
}

function renderSupports() {
  const prompt = currentPrompt();
  const supportSet = SUPPORT_BANK[state.genre] || SUPPORT_BANK.opinion;
  const starters = prompt?.starters || supportSet.sentence;

  if (!state.supportsEnabled) {
    supportsEl.innerHTML = '<div class="writing-help">Step Up supports are off for this learner.</div>';
    return;
  }

  supportsEl.innerHTML = `
    <div class="writing-support-block">
      <strong>Sentence starters</strong>
      <div class="writing-starters">
        ${starters.map((item) => `<span class="writing-starter">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
    <div class="writing-support-block">
      <strong>Transitions / Power words</strong>
      <div class="writing-starters">
        ${(supportSet.transitions || []).map((item) => `<span class="writing-starter">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
    <div class="writing-support-block">
      <strong>Evidence / Elaboration stems</strong>
      <div class="writing-starters">
        ${(supportSet.evidence || []).map((item) => `<span class="writing-starter">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
  `;
}

function renderPublishPreview() {
  const text = getDraftText(getFrameConfig(state.grade, state.genre));
  state.publishText = text;
  previewEl.textContent = text || 'Your publish-ready draft appears here after you write.';

  const result = evaluateWriting();
  const summary = [
    `Topic/Claim: ${STATUS_META[result.dimensions.topicClaim]?.label || 'Not assessed'}`,
    `Details/Evidence: ${STATUS_META[result.dimensions.detailsEvidence]?.label || 'Not assessed'}`,
    `Organization/Transitions: ${STATUS_META[result.dimensions.organizationTransitions]?.label || 'Not assessed'}`,
    `Conventions: ${STATUS_META[result.dimensions.conventions]?.label || 'Not assessed'}`
  ];
  sessionSummaryEl.innerHTML = `<div class="writing-help">Step Up snapshot: ${summary.join(' · ')}</div>`;
}

function setStep(stepId) {
  state.step = STEP_ORDER.includes(stepId) ? stepId : 'plan';

  stepTabs.forEach((tab) => {
    const active = tab.dataset.stepTab === state.step;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  stepPanels.forEach((panel) => {
    const active = panel.dataset.stepPanel === state.step;
    panel.hidden = !active;
  });

  if (state.step === 'publish') {
    renderPublishPreview();
  }

  saveState();
}

function syncPlanToDraftIfEmpty(key, value) {
  const frame = getFrameConfig(state.grade, state.genre);
  const hasMatchingDraftField = frame.draftFields.some((field) => field.key === key);
  if (!hasMatchingDraftField) return;
  if (!nonEmpty(state.draftData[key])) {
    state.draftData[key] = value;
    const textarea = draftFieldsEl.querySelector(`[data-draft-key="${key}"]`);
    if (textarea) textarea.value = value;
  }
}

function runStepUpCheck() {
  const result = evaluateWriting();
  state.checks = result.checklist;
  state.dimensions = result.dimensions;
  state.nextStep = result.nextStep;
  renderChecklist(result);
  renderPublishPreview();

  feedbackEl.textContent = `Step Up check complete. Next step: ${result.nextStep}`;
  saveState();
  return result;
}

function clearWorkspace() {
  state.planData = {};
  state.draftData = {};
  state.checks = [];
  state.dimensions = {
    topicClaim: 'not-assessed',
    detailsEvidence: 'not-assessed',
    organizationTransitions: 'not-assessed',
    conventions: 'not-assessed'
  };
  state.nextStep = '';
  state.missions = [];
  state.publishText = '';

  renderFrame();
  renderChecklist({ checklist: [] });
  renderMissions();
  renderPublishPreview();
  setStep('plan');
  feedbackEl.textContent = 'Workspace cleared. Start a fresh piece.';
  saveState();
}

function toSessionRecord(result) {
  const learner = getActiveLearner();
  const now = Date.now();
  return {
    id: `writing_${now}_${Math.random().toString(36).slice(2, 8)}`,
    ts: now,
    learnerId: learner?.id || '',
    learnerName: learner?.name || 'Learner',
    gradeBand: state.grade,
    genre: state.genre,
    promptId: state.promptId,
    frameId: getFrameConfig(state.grade, state.genre).id,
    text: result.text,
    wordCount: result.wordCount,
    dimensions: result.dimensions,
    checklist: result.checklist.map((item) => ({ id: item.id, title: item.title, status: item.status })),
    missionsCompleted: state.missions.filter((mission) => mission.done).length,
    missionsAssigned: state.missions.length,
    nextStep: result.nextStep,
    strengths: result.strengths
  };
}

function saveWritingSession() {
  const result = evaluateWriting();
  if (!result.wordCount) {
    feedbackEl.textContent = 'Write at least one sentence before saving your session.';
    return;
  }

  const allSessions = safeParse(localStorage.getItem(SESSIONS_KEY), []);
  const rows = Array.isArray(allSessions) ? allSessions : [];
  rows.unshift(toSessionRecord(result));
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(rows.slice(0, 200)));

  renderPublishPreview();
  feedbackEl.textContent = 'Session saved. Teacher reports now include Step Up-aligned writing data.';
  saveState();

  try {
    window.DECODE_PLATFORM?.logActivity?.({
      activity: 'writing',
      label: 'Writing Studio',
      event: `Step Up check saved (${result.wordCount} words)`,
      detail: {
        gradeBand: state.grade,
        genre: state.genre,
        dimensions: result.dimensions,
        missionsCompleted: state.missions.filter((mission) => mission.done).length
      }
    });
  } catch {}
}

async function copyPublishedText() {
  const text = state.publishText || getDraftText(getFrameConfig(state.grade, state.genre));
  if (!text.trim()) {
    feedbackEl.textContent = 'Build your draft first, then copy.';
    return;
  }

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      feedbackEl.textContent = 'Published draft copied.';
      return;
    }
    throw new Error('clipboard-unavailable');
  } catch {
    feedbackEl.textContent = 'Clipboard unavailable. Use Print to export.';
  }
}

function saveSupportPreference() {
  localStorage.setItem(learnerSupportKey(), JSON.stringify({ enabled: state.supportsEnabled }));
}

function loadSupportPreference() {
  const pref = safeParse(localStorage.getItem(learnerSupportKey()), null);
  if (pref && typeof pref.enabled === 'boolean') {
    state.supportsEnabled = pref.enabled;
  }
}

function saveState() {
  const payload = {
    grade: state.grade,
    genre: state.genre,
    promptId: state.promptId,
    step: state.step,
    missionDepth: state.missionDepth,
    planData: state.planData,
    draftData: state.draftData,
    checks: state.checks,
    dimensions: state.dimensions,
    nextStep: state.nextStep,
    missions: state.missions,
    supportsEnabled: state.supportsEnabled,
    publishText: state.publishText
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  const raw = safeParse(localStorage.getItem(STORAGE_KEY), null);
  if (!raw || typeof raw !== 'object') return;

  state.grade = raw.grade || state.grade;
  state.genre = raw.genre || state.genre;
  state.promptId = raw.promptId || state.promptId;
  state.step = STEP_ORDER.includes(raw.step) ? raw.step : state.step;
  state.missionDepth = raw.missionDepth || state.missionDepth;
  state.planData = raw.planData && typeof raw.planData === 'object' ? raw.planData : {};
  state.draftData = raw.draftData && typeof raw.draftData === 'object' ? raw.draftData : {};
  state.checks = Array.isArray(raw.checks) ? raw.checks : [];
  state.dimensions = raw.dimensions && typeof raw.dimensions === 'object' ? raw.dimensions : state.dimensions;
  state.nextStep = raw.nextStep || '';
  state.missions = Array.isArray(raw.missions) ? raw.missions : [];
  state.supportsEnabled = typeof raw.supportsEnabled === 'boolean' ? raw.supportsEnabled : state.supportsEnabled;
  state.publishText = raw.publishText || '';
}

function refreshAll() {
  ensureValidState();
  buildSelectOptions();
  renderPromptCard();
  renderFrame();
  renderSupports();
  renderPublishPreview();

  if (state.checks.length) {
    renderChecklist({ checklist: state.checks, nextStep: state.nextStep });
  } else {
    renderChecklist({ checklist: [] });
  }

  renderMissions();
  missionDepthEl.value = state.missionDepth;
  supportsToggleEl.checked = state.supportsEnabled;
  setStep(state.step);
}

function handleGradeChange() {
  state.grade = gradeSelect.value;
  const genreList = listGenres(state.grade);
  if (!genreList.includes(state.genre)) {
    state.genre = genreList[0] || 'opinion';
  }
  const pool = promptPool();
  state.promptId = pool[0]?.id || '';
  state.step = 'plan';
  refreshAll();
  saveState();
}

function handleGenreChange() {
  state.genre = genreSelect.value;
  const pool = promptPool();
  state.promptId = pool[0]?.id || '';
  state.step = 'plan';
  refreshAll();
  saveState();
}

function handlePromptChange() {
  state.promptId = promptSelect.value;
  renderPromptCard();
  renderSupports();
  saveState();
}

function shufflePrompt() {
  const pool = promptPool();
  if (!pool.length) return;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  state.promptId = pick.id;
  promptSelect.value = pick.id;
  renderPromptCard();
  renderSupports();
  saveState();
}

function wireFieldEvents() {
  planFieldsEl.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const key = target.dataset.planKey;
    if (!key) return;

    state.planData[key] = target.value;
    syncPlanToDraftIfEmpty(key, target.value);
    renderPublishPreview();
    saveState();
  });

  draftFieldsEl.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    const key = target.dataset.draftKey;
    if (!key) return;

    state.draftData[key] = target.value;
    renderPublishPreview();
    saveState();
  });

  missionsEl.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const showTipId = target.dataset.showTip;
    if (!showTipId) return;

    const tip = missionsEl.querySelector(`[data-tip-id="${showTipId}"]`);
    if (tip) tip.classList.toggle('hidden');
  });

  missionsEl.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const missionId = target.dataset.missionId;
    if (!missionId) return;

    const mission = state.missions.find((row) => row.id === missionId);
    if (!mission) return;
    mission.done = !!target.checked;
    renderMissions();
    saveState();
  });
}

function wireUiEvents() {
  gradeSelect.addEventListener('change', handleGradeChange);
  genreSelect.addEventListener('change', handleGenreChange);
  promptSelect.addEventListener('change', handlePromptChange);
  shuffleBtn.addEventListener('click', shufflePrompt);

  stepTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const nextStep = tab.dataset.stepTab;
      if (!nextStep) return;
      if (nextStep === 'check') runStepUpCheck();
      if (nextStep === 'revise') buildRevisionMissions();
      if (nextStep === 'publish') renderPublishPreview();
      setStep(nextStep);
    });
  });

  planNextBtn.addEventListener('click', () => setStep('draft'));
  draftToCheckBtn.addEventListener('click', () => {
    runStepUpCheck();
    setStep('check');
  });
  buildBtn.addEventListener('click', () => {
    renderPublishPreview();
    feedbackEl.textContent = 'Publish preview updated.';
  });
  checkToReviseBtn.addEventListener('click', () => {
    buildRevisionMissions();
    setStep('revise');
  });
  reviseToPublishBtn.addEventListener('click', () => {
    renderPublishPreview();
    setStep('publish');
  });

  missionDepthEl.addEventListener('change', () => {
    state.missionDepth = missionDepthEl.value;
    buildRevisionMissions();
  });
  missionsRefreshBtn.addEventListener('click', buildRevisionMissions);

  copyBtn.addEventListener('click', () => {
    copyPublishedText();
  });
  printBtn.addEventListener('click', () => window.print());
  saveSessionBtn.addEventListener('click', saveWritingSession);
  clearBtn.addEventListener('click', clearWorkspace);

  supportsToggleEl.addEventListener('change', () => {
    state.supportsEnabled = !!supportsToggleEl.checked;
    renderSupports();
    saveSupportPreference();
    saveState();
  });

  wireFieldEvents();
}

function init() {
  applyLightTheme();

  state.grade = getDefaultGradeBand();
  state.genre = listGenres(state.grade)[0] || 'opinion';
  state.promptId = promptPool()[0]?.id || '';

  loadState();
  loadSupportPreference();
  ensureValidState();
  refreshAll();
  wireUiEvents();

  feedbackEl.textContent = 'Writing Studio is aligned to Step Up to Writing structure.';
}

init();
