const WRITING_PROMPTS = {
  'K-2': {
    opinion: [
      {
        id: 'k2-recess',
        title: 'Best Recess Game',
        prompt: 'What is the best recess game? Tell your opinion and give at least 2 reasons.',
        starters: ['I think…', 'First,…', 'Also,…', 'Because…', 'In conclusion,…']
      },
      {
        id: 'k2-pet',
        title: 'Perfect Pet',
        prompt: 'Would you rather have a cat or a dog? Tell why.',
        starters: ['I would rather…', 'One reason is…', 'Another reason is…', 'So…']
      }
    ],
    informative: [
      {
        id: 'k2-howto',
        title: 'How To Do Something',
        prompt: 'Explain how to do something you know well (draw, build, cook, play a game).',
        starters: ['First,…', 'Next,…', 'Then,…', 'Finally,…']
      },
      {
        id: 'k2-animal',
        title: 'Animal Facts',
        prompt: 'Write facts about an animal you know.',
        starters: ['My animal is…', 'It can…', 'It lives…', 'One cool fact is…']
      }
    ],
    narrative: [
      {
        id: 'k2-small-moment',
        title: 'Small Moment',
        prompt: 'Tell a short story about one moment from your day.',
        starters: ['One day,…', 'Suddenly,…', 'Then,…', 'In the end,…']
      }
    ]
  },
  '3-5': {
    opinion: [
      {
        id: '35-school-change',
        title: 'One School Change',
        prompt: 'What is one change that would make school better? Explain with reasons and an example.',
        starters: ['I believe…', 'First,…', 'For example,…', 'Also,…', 'Therefore,…']
      }
    ],
    informative: [
      {
        id: '35-explain-process',
        title: 'Explain A Process',
        prompt: 'Explain how something works (a sport rule, a science idea, or a classroom routine).',
        starters: ['This works because…', 'First,…', 'Next,…', 'Finally,…']
      }
    ],
    narrative: [
      {
        id: '35-problem-solution',
        title: 'Problem + Solution',
        prompt: 'Write a story where a character has a problem and solves it.',
        starters: ['At first,…', 'The problem was…', 'Then,…', 'Because of that,…', 'In the end,…']
      }
    ]
  },
  '6-8': {
    opinion: [
      {
        id: '68-argument',
        title: 'Claim + Evidence',
        prompt: 'Make a claim about school or community. Support it with at least 2 pieces of evidence.',
        starters: ['My claim is…', 'One reason is…', 'Evidence shows…', 'Additionally,…', 'In conclusion,…']
      }
    ],
    informative: [
      {
        id: '68-explain-concept',
        title: 'Explain A Concept',
        prompt: 'Explain a concept you learned in science or humanities. Define it and give an example.',
        starters: ['A key idea is…', 'This means…', 'For example,…', 'This matters because…']
      }
    ],
    narrative: [
      {
        id: '68-scene',
        title: 'Write A Scene',
        prompt: 'Write a short scene with dialogue. Show how a character feels through actions and words.',
        starters: ['I noticed…', '“…”', 'As I…', 'Suddenly,…']
      }
    ]
  },
  '9-12': {
    opinion: [
      {
        id: '912-position',
        title: 'Position Paragraph',
        prompt: 'Write a position paragraph on an issue you care about. Include a claim, reasons, and evidence.',
        starters: ['My position is…', 'A major reason is…', 'For instance,…', 'A counterpoint is…', 'Ultimately,…']
      }
    ],
    informative: [
      {
        id: '912-synthesis',
        title: 'Synthesis Paragraph',
        prompt: 'Synthesize two ideas you have learned. Explain how they connect and why it matters.',
        starters: ['Both ideas suggest…', 'In contrast,…', 'Together,…', 'This matters because…']
      }
    ],
    narrative: [
      {
        id: '912-flash',
        title: 'Flash Narrative',
        prompt: 'Write a 6–10 sentence flash narrative with a clear turning point.',
        starters: ['At first,…', 'I used to think…', 'Then,…', 'After that,…', 'Now…']
      }
    ]
  }
};

const gradeSelect = document.getElementById('writing-grade');
const genreSelect = document.getElementById('writing-genre');
const promptSelect = document.getElementById('writing-prompt');
const shuffleBtn = document.getElementById('writing-shuffle');

const promptTitleEl = document.getElementById('writing-prompt-title');
const promptTextEl = document.getElementById('writing-prompt-text');
const startersEl = document.getElementById('writing-starters');

const planTopic = document.getElementById('plan-topic');
const planDetail1 = document.getElementById('plan-detail-1');
const planDetail2 = document.getElementById('plan-detail-2');
const planDetail3 = document.getElementById('plan-detail-3');
const planTransitions = document.getElementById('plan-transitions');

const draftTopic = document.getElementById('draft-topic');
const draftDetail1 = document.getElementById('draft-detail-1');
const draftDetail2 = document.getElementById('draft-detail-2');
const draftDetail3 = document.getElementById('draft-detail-3');
const draftConclusion = document.getElementById('draft-conclusion');

const buildBtn = document.getElementById('writing-build');
const clearBtn = document.getElementById('writing-clear');
const previewEl = document.getElementById('writing-preview-text');
const feedbackEl = document.getElementById('writing-feedback');

const STORAGE_KEY = 'writing_builder_v1';
let currentPrompt = null;

function applyLightTheme() {
  document.body.classList.add('force-light');
  document.documentElement.classList.add('force-light');
  document.documentElement.style.colorScheme = 'light';
}

function listGrades() {
  return Object.keys(WRITING_PROMPTS);
}

function listGenresForGrade(grade) {
  const group = WRITING_PROMPTS[grade] || {};
  return Object.keys(group);
}

function labelGenre(key) {
  if (key === 'opinion') return 'Opinion';
  if (key === 'informative') return 'Informative';
  if (key === 'narrative') return 'Narrative';
  return key;
}

function getPromptPool() {
  const grade = gradeSelect.value;
  const genre = genreSelect.value;
  return (WRITING_PROMPTS[grade]?.[genre] || []).slice();
}

function buildFilters() {
  gradeSelect.innerHTML = listGrades().map(g => `<option value="${g}">${g}</option>`).join('');
  gradeSelect.value = 'K-2';

  const genres = listGenresForGrade(gradeSelect.value);
  genreSelect.innerHTML = genres.map(key => `<option value="${key}">${labelGenre(key)}</option>`).join('');
}

function buildPromptList() {
  const pool = getPromptPool();
  promptSelect.innerHTML = pool.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
  currentPrompt = pool[0] || null;
  renderPrompt();
}

function shufflePrompt() {
  const pool = getPromptPool();
  if (!pool.length) return;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  currentPrompt = pick;
  promptSelect.value = pick.id;
  renderPrompt();
}

function renderPrompt() {
  if (!currentPrompt) return;
  promptTitleEl.textContent = currentPrompt.title;
  promptTextEl.textContent = currentPrompt.prompt;
  startersEl.innerHTML = (currentPrompt.starters || [])
    .map(s => `<span class="writing-starter">${s}</span>`)
    .join('');
  saveState();
}

function ensureSentence(text) {
  const trimmed = (text || '').toString().trim();
  if (!trimmed) return '';
  const hasEnd = /[.!?]$/.test(trimmed);
  return hasEnd ? trimmed : `${trimmed}.`;
}

function buildParagraph() {
  const parts = [
    ensureSentence(draftTopic.value),
    ensureSentence(draftDetail1.value),
    ensureSentence(draftDetail2.value),
    ensureSentence(draftDetail3.value),
    ensureSentence(draftConclusion.value)
  ].filter(Boolean);

  const paragraph = parts.join(' ');
  previewEl.textContent = paragraph || 'Your paragraph will appear here.';
  runChecks(parts);
  saveState();
}

function firstAlpha(text = '') {
  const match = (text || '').match(/[A-Za-z]/);
  return match ? match[0] : '';
}

function startsWithCapital(text = '') {
  const ch = firstAlpha(text);
  return !!ch && ch === ch.toUpperCase();
}

function minWords(text = '', min = 5) {
  const wc = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return wc >= min;
}

function runChecks(sentences) {
  const items = [];

  const required = [
    { key: 'Topic sentence', value: draftTopic.value },
    { key: 'Detail 1', value: draftDetail1.value },
    { key: 'Detail 2', value: draftDetail2.value },
    { key: 'Conclusion', value: draftConclusion.value }
  ];

  required.forEach(({ key, value }) => {
    const ok = value.trim().length > 0;
    items.push(ok ? `✅ ${key} filled in.` : `⚠️ Add your ${key.toLowerCase()}.`);
  });

  const allFilled = required.every(r => r.value.trim().length > 0);
  if (allFilled) {
    const capsOk = sentences.filter(Boolean).every(startsWithCapital);
    items.push(capsOk ? '✅ Sentences start with capital letters.' : '⚠️ Check capital letters at the start of each sentence.');

    const endOk = sentences.filter(Boolean).every(s => /[.!?]$/.test(s.trim()));
    items.push(endOk ? '✅ Sentences end with punctuation.' : '⚠️ Add end punctuation (. ? !).');

    const lengthOk = sentences.filter(Boolean).every(s => minWords(s, 5));
    items.push(lengthOk ? '✅ Sentences have enough words to make meaning.' : '⚠️ Try adding a few more words to your sentences.');

    const transitions = (planTransitions.value || '')
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);
    if (transitions.length) {
      const detailText = `${draftDetail1.value} ${draftDetail2.value} ${draftDetail3.value}`.toLowerCase();
      const used = transitions.some(t => detailText.includes(t));
      items.push(used ? '✅ You used a transition word.' : '💡 Try adding a transition word (first, next, because…).');
    }
  }

  feedbackEl.innerHTML = `<ul class="writing-feedback-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

function clearAll() {
  [
    planTopic, planDetail1, planDetail2, planDetail3, planTransitions,
    draftTopic, draftDetail1, draftDetail2, draftDetail3, draftConclusion
  ].forEach(el => (el.value = ''));

  previewEl.textContent = 'Your paragraph will appear here.';
  feedbackEl.textContent = '';
  saveState(true);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed) return;

    if (parsed.grade && WRITING_PROMPTS[parsed.grade]) gradeSelect.value = parsed.grade;
    const genres = listGenresForGrade(gradeSelect.value);
    genreSelect.innerHTML = genres.map(key => `<option value="${key}">${labelGenre(key)}</option>`).join('');
    if (parsed.genre && genres.includes(parsed.genre)) genreSelect.value = parsed.genre;

    buildPromptList();
    const pool = getPromptPool();
    const pick = pool.find(p => p.id === parsed.promptId);
    if (pick) {
      currentPrompt = pick;
      promptSelect.value = pick.id;
      renderPrompt();
    }

    planTopic.value = parsed.planTopic || '';
    planDetail1.value = parsed.planDetail1 || '';
    planDetail2.value = parsed.planDetail2 || '';
    planDetail3.value = parsed.planDetail3 || '';
    planTransitions.value = parsed.planTransitions || '';

    draftTopic.value = parsed.draftTopic || '';
    draftDetail1.value = parsed.draftDetail1 || '';
    draftDetail2.value = parsed.draftDetail2 || '';
    draftDetail3.value = parsed.draftDetail3 || '';
    draftConclusion.value = parsed.draftConclusion || '';

    if (parsed.preview) {
      previewEl.textContent = parsed.preview;
    }
    if (parsed.feedback) {
      feedbackEl.innerHTML = parsed.feedback;
    }
  } catch (e) {}
}

function saveState(clear = false) {
  if (clear) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  const payload = {
    grade: gradeSelect.value,
    genre: genreSelect.value,
    promptId: currentPrompt?.id || null,

    planTopic: planTopic.value,
    planDetail1: planDetail1.value,
    planDetail2: planDetail2.value,
    planDetail3: planDetail3.value,
    planTransitions: planTransitions.value,

    draftTopic: draftTopic.value,
    draftDetail1: draftDetail1.value,
    draftDetail2: draftDetail2.value,
    draftDetail3: draftDetail3.value,
    draftConclusion: draftConclusion.value,

    preview: previewEl.textContent,
    feedback: feedbackEl.innerHTML
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function wireAutosave() {
  const inputs = [
    gradeSelect, genreSelect, promptSelect, shuffleBtn,
    planTopic, planDetail1, planDetail2, planDetail3, planTransitions,
    draftTopic, draftDetail1, draftDetail2, draftDetail3, draftConclusion
  ];
  inputs.forEach(el => {
    el?.addEventListener('input', () => saveState());
    el?.addEventListener('change', () => saveState());
  });
}

function init() {
  applyLightTheme();
  buildFilters();
  buildPromptList();
  loadState();
  wireAutosave();

  gradeSelect.addEventListener('change', () => {
    const genres = listGenresForGrade(gradeSelect.value);
    genreSelect.innerHTML = genres.map(key => `<option value="${key}">${labelGenre(key)}</option>`).join('');
    buildPromptList();
  });

  genreSelect.addEventListener('change', buildPromptList);

  promptSelect.addEventListener('change', () => {
    const pool = getPromptPool();
    currentPrompt = pool.find(p => p.id === promptSelect.value) || pool[0] || null;
    renderPrompt();
  });

  shuffleBtn.addEventListener('click', shufflePrompt);
  buildBtn.addEventListener('click', buildParagraph);
  clearBtn.addEventListener('click', clearAll);

  previewEl.textContent = 'Your paragraph will appear here.';
}

init();

