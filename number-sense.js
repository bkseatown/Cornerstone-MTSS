const NUMERACY_LOG_KEY = 'decode_numeracy_log_v1';
const PAGE_MODE = document.body.classList.contains('operations-page') ? 'operations-builder' : 'numeracy-sprint';
const PAGE_CONFIG = PAGE_MODE === 'operations-builder'
  ? {
      settingsKey: 'opsbuilder_settings_v1',
      defaultDomain: 'operations',
      lockDomain: true,
      startIdleLabel: 'Start Builder',
      startRunningLabel: 'Builder Running...',
      readyPrompt: 'Press Start Builder to generate your first operations prompt.',
      sourceTag: 'decode-operation-builder',
      activityId: 'operations',
      activityLabel: 'Operation Builder'
    }
  : {
      settingsKey: 'numsense_settings_v1',
      defaultDomain: 'number-sense',
      lockDomain: false,
      startIdleLabel: 'Start Sprint',
      startRunningLabel: 'Session Running...',
      readyPrompt: 'Press Start Sprint to generate your first numeracy prompt.',
      sourceTag: 'decode-numeracy-sprint',
      activityId: 'number-sense',
      activityLabel: 'Number Sense Sprint'
    };
const SETTINGS_KEY = PAGE_CONFIG.settingsKey;

const DOMAIN_META = {
  'number-sense': {
    domainLabel: 'Number sense',
    activity: 'number-sense',
    activityLabel: 'Number Sense Sprint'
  },
  operations: {
    domainLabel: 'Operations',
    activity: 'operations',
    activityLabel: 'Operation Builder'
  },
  'problem-solving': {
    domainLabel: 'Problem solving',
    activity: 'problem-solving',
    activityLabel: 'Problem Pathways'
  },
  fluency: {
    domainLabel: 'Math fluency',
    activity: 'fluency',
    activityLabel: 'Math Fluency Sprint'
  },
  'math-language': {
    domainLabel: 'Math language',
    activity: 'math-language',
    activityLabel: 'Math Language Builder'
  }
};

const TAG_LABELS = {
  'compare-within-20': 'Compare within 20',
  'make-ten': 'Make ten',
  'one-more-less': 'One more / one less',
  'place-value': 'Place value',
  'compare-3-digit': 'Compare 3-digit numbers',
  'round-nearest-10': 'Round to nearest 10',
  'integer-order': 'Integer order',
  'fraction-decimal': 'Fraction and decimal links',
  'percent-decimal': 'Percent and decimal links',
  'percent-change': 'Percent change',
  slope: 'Slope',
  'scientific-notation': 'Scientific notation',
  'operations-k2': 'Add/subtract within 20',
  'operations-35': 'Multiply/divide strategy',
  'operations-68': 'Integer and fraction operations',
  'operations-912': 'Linear equation solving',
  'word-problem-k2': 'Word problem routine',
  'word-problem-35': 'Two-step arithmetic',
  'word-problem-68': 'Ratio reasoning',
  'word-problem-912': 'Algebraic modeling',
  'fact-fluency-k2': 'Fact fluency K-2',
  'fact-fluency-35': 'Fact fluency 3-5',
  'fact-fluency-68': 'Fact fluency 6-8',
  'fact-fluency-912': 'Fact fluency 9-12',
  'language-k2': 'Math vocabulary K-2',
  'language-35': 'Math vocabulary 3-5',
  'language-68': 'Math reasoning language',
  'language-912': 'Algebra and data language'
};

const FUN_LIBRARY = {
  'K-2': {
    success: [
      'Joke: Why was the equal sign so humble? It knew it was not less than or greater than anyone.',
      'Fun fact: A group of flamingos is called a "flamboyance."',
      'Quote: "Mistakes are proof that you are trying."'
    ],
    retry: [
      'Try-again boost: Your brain grows every time you check and fix.',
      'Tiny reset: breathe in 4, out 4, then solve the next one.',
      'Coach note: Slow is smooth, smooth becomes fast.'
    ]
  },
  '3-5': {
    success: [
      'Joke: Why was six afraid of seven? Because seven ate nine.',
      'Fun fact: Honeybees can recognize simple number patterns.',
      'Quote: "Success is the sum of small efforts repeated daily."'
    ],
    retry: [
      'Retry tip: Circle the important numbers, then choose your operation.',
      'Mindset line: Not yet is better than giving up.',
      'Quick cue: Use a model first, then compute.'
    ]
  },
  '6-8': {
    success: [
      'Joke: Parallel lines have so much in common. Too bad they will never meet.',
      'Fun fact: The word "hundred" comes from an old Norse word meaning 120.',
      'Quote: "Discipline is choosing what you want most over what you want now."'
    ],
    retry: [
      'Retry cue: Check units and signs before finalizing.',
      'Focus reset: Name the strategy out loud, then execute.',
      'Learning move: Compare this item to one you solved correctly.'
    ]
  },
  '9-12': {
    success: [
      'Joke: Why do mathematicians love parks? Because of all the natural logs.',
      'Fun fact: The equal sign (=) was first used in print in 1557.',
      'Quote: "Great things are done by a series of small things brought together."'
    ],
    retry: [
      'Retry cue: Translate words to variables before calculating.',
      'Precision move: Estimate first, then solve exactly.',
      'Growth line: Keep the rigor, adjust the strategy.'
    ]
  }
};

const state = {
  gradeBand: '3-5',
  domain: PAGE_CONFIG.defaultDomain,
  totalRounds: 10,
  roundIndex: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  sessionActive: false,
  locked: false,
  currentItem: null,
  itemStartedAt: 0,
  attempts: [],
  coachMoves: []
};

const ui = {
  grade: document.getElementById('numsense-grade'),
  domain: document.getElementById('numsense-domain'),
  rounds: document.getElementById('numsense-rounds'),
  start: document.getElementById('numsense-start'),
  correct: document.getElementById('numsense-correct'),
  streak: document.getElementById('numsense-streak'),
  remaining: document.getElementById('numsense-remaining'),
  kicker: document.getElementById('numsense-kicker'),
  prompt: document.getElementById('numsense-prompt'),
  stem: document.getElementById('numsense-stem'),
  options: document.getElementById('numsense-options'),
  hintBtn: document.getElementById('numsense-hint'),
  skipBtn: document.getElementById('numsense-skip'),
  hintText: document.getElementById('numsense-hint-text'),
  feedback: document.getElementById('numsense-feedback'),
  pulse: document.getElementById('numsense-pulse'),
  fun: document.getElementById('numsense-fun'),
  coachList: document.getElementById('numsense-coach-list')
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

function randomInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function pick(list) {
  return list[randomInt(0, list.length - 1)];
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function roundTo(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp01(value) {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function average(values) {
  if (!Array.isArray(values) || !values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
}

function normalizeGradeBand(value) {
  const raw = String(value || '').trim();
  if (raw === 'K-2' || raw.toLowerCase() === 'k-2' || raw === 'k2') return 'K-2';
  if (raw === '3-5' || raw === '35') return '3-5';
  if (raw === '6-8' || raw === '68' || raw === '6-12' || raw === '612') return '6-8';
  if (raw === '9-12' || raw === '912') return '9-12';
  return '3-5';
}

function normalizeDomain(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (DOMAIN_META[raw]) return raw;
  return PAGE_CONFIG.defaultDomain;
}

function getDefaultGradeBand() {
  try {
    return normalizeGradeBand(window.DECODE_PLATFORM?.getProfile?.()?.gradeBand || '');
  } catch {
    return '3-5';
  }
}

function getOptionFallbackFactory(answer) {
  const numeric = Number(answer);
  if (!Number.isNaN(numeric)) {
    return () => String(numeric + randomInt(-9, 9));
  }
  return () => `Option ${randomInt(5, 99)}`;
}

function buildOptionSet(answer, distractors, fallbackFactory) {
  const answerText = String(answer);
  const pool = [];
  [answerText, ...(distractors || []).map((item) => String(item))].forEach((item) => {
    if (!item && item !== '0') return;
    if (!pool.includes(item)) pool.push(item);
  });

  const picked = [answerText];
  const wrongPool = pool.filter((item) => item !== answerText);
  while (picked.length < 4 && wrongPool.length) {
    const index = randomInt(0, wrongPool.length - 1);
    picked.push(wrongPool.splice(index, 1)[0]);
  }

  let guard = 0;
  while (picked.length < 4 && guard < 24) {
    const fallback = String((fallbackFactory || (() => `Option ${randomInt(10, 99)}`))());
    if (!picked.includes(fallback)) picked.push(fallback);
    guard += 1;
  }
  while (picked.length < 4) {
    picked.push(`Option ${randomInt(100, 999)}`);
  }

  return shuffle(picked.slice(0, 4));
}

function createChoiceItem(input) {
  const answer = String(input.answer);
  return {
    kicker: input.kicker || DOMAIN_META[state.domain]?.domainLabel || 'Numeracy',
    prompt: input.prompt || '',
    stem: input.stem || '',
    answer,
    options: buildOptionSet(answer, input.distractors || [], input.fallback || getOptionFallbackFactory(answer)),
    hint: input.hint || 'Use one visual model, then compute.',
    explain: input.explain || '',
    tag: input.tag || 'general',
    coach: input.coach || 'Prompt student to explain why the selected strategy fits the problem.',
    domain: state.domain
  };
}

function generateNumberSenseQuestion(gradeBand) {
  if (gradeBand === 'K-2') {
    const type = randomInt(0, 2);
    if (type === 0) {
      const a = randomInt(2, 18);
      let b = randomInt(1, 19);
      if (a === b) b += 1;
      const answer = Math.max(a, b);
      return createChoiceItem({
        kicker: 'Compare quantities',
        prompt: 'Which number is greater?',
        stem: `${a} or ${b}`,
        answer,
        distractors: [Math.min(a, b), answer - 1, answer + 1],
        hint: 'Count up and look for the larger total.',
        explain: `${answer} is larger because it has more ones.`,
        tag: 'compare-within-20',
        coach: 'Use counters or fingers first, then name which set has more.'
      });
    }
    if (type === 1) {
      const first = randomInt(1, 9);
      const answer = 10 - first;
      return createChoiceItem({
        kicker: 'Build 10',
        prompt: `What number makes 10 with ${first}?`,
        answer,
        distractors: [answer + 1, answer - 1, first],
        hint: 'Use your ten frame in your head.',
        explain: `${first} + ${answer} = 10.`,
        tag: 'make-ten',
        coach: 'Prompt for ten-frame language: "How many more to make ten?"'
      });
    }
    const base = randomInt(2, 18);
    const moreOrLess = pick(['one more', 'one less']);
    const answer = moreOrLess === 'one more' ? base + 1 : base - 1;
    return createChoiceItem({
      kicker: 'Count forward and back',
      prompt: `What is ${moreOrLess} than ${base}?`,
      answer,
      distractors: [base, answer + 1, answer - 1],
      hint: 'Move one step on your mental number line.',
      explain: `${moreOrLess} than ${base} is ${answer}.`,
      tag: 'one-more-less',
      coach: 'Use a number line and have learner point to the move before answering.'
    });
  }

  if (gradeBand === '3-5') {
    const type = randomInt(0, 2);
    if (type === 0) {
      const number = randomInt(120, 987);
      const position = pick([
        { name: 'hundreds', place: 100 },
        { name: 'tens', place: 10 },
        { name: 'ones', place: 1 }
      ]);
      const digit = Math.floor(number / position.place) % 10;
      const answer = digit * position.place;
      return createChoiceItem({
        kicker: 'Place value',
        prompt: `What is the value of the ${position.name} digit in ${number}?`,
        answer,
        distractors: [digit, digit * 10, digit * 100, number],
        hint: 'Name the digit, then multiply by its place.',
        explain: `The ${position.name} place is worth ${position.place}, so the value is ${answer}.`,
        tag: 'place-value',
        coach: 'Have student read the number in expanded form before responding.'
      });
    }
    if (type === 1) {
      const a = randomInt(200, 999);
      let b = randomInt(200, 999);
      if (a === b) b += 3;
      const answer = Math.max(a, b);
      return createChoiceItem({
        kicker: 'Compare numbers',
        prompt: 'Which number is greater?',
        stem: `${a} or ${b}`,
        answer,
        distractors: [Math.min(a, b), answer - 10, answer + 10],
        hint: 'Compare hundreds first, then tens.',
        explain: `${answer} has the greater place-value pattern.`,
        tag: 'compare-3-digit',
        coach: 'Prompt learner to compare by place from left to right.'
      });
    }
    const number = randomInt(115, 985);
    const ones = number % 10;
    const answer = ones >= 5 ? number + (10 - ones) : number - ones;
    return createChoiceItem({
      kicker: 'Rounding',
      prompt: `Round ${number} to the nearest 10.`,
      answer,
      distractors: [number - ones, number + (10 - ones), number],
      hint: 'Check the ones digit: 5 or more rounds up.',
      explain: `${number} rounds to ${answer} because the ones digit is ${ones}.`,
      tag: 'round-nearest-10',
      coach: 'Use number line rounding jumps to show why the nearest ten wins.'
    });
  }

  if (gradeBand === '6-8') {
    const type = randomInt(0, 2);
    if (type === 0) {
      const a = randomInt(-25, 18);
      let b = randomInt(-25, 18);
      if (a === b) b += 2;
      const answer = Math.max(a, b);
      return createChoiceItem({
        kicker: 'Integer reasoning',
        prompt: 'Which value is greater?',
        stem: `${a} or ${b}`,
        answer,
        distractors: [Math.min(a, b), answer + 2, answer - 2],
        hint: 'On a number line, farther right means greater.',
        explain: `${answer} is to the right of the other value.`,
        tag: 'integer-order',
        coach: 'Prompt number-line language before computation.'
      });
    }
    if (type === 1) {
      const set = pick([
        { fraction: '1/2', decimal: '0.5' },
        { fraction: '3/4', decimal: '0.75' },
        { fraction: '2/5', decimal: '0.4' },
        { fraction: '5/8', decimal: '0.625' }
      ]);
      return createChoiceItem({
        kicker: 'Fraction and decimal link',
        prompt: `Which decimal is equivalent to ${set.fraction}?`,
        answer: set.decimal,
        distractors: ['0.25', '0.6', '0.8', '0.125'],
        fallback: () => String(roundTo(Math.random(), 3)),
        hint: 'Think of denominator as equal parts of one whole.',
        explain: `${set.fraction} is exactly ${set.decimal}.`,
        tag: 'fraction-decimal',
        coach: 'Prompt conversion language: "out of one whole."'
      });
    }
    const set = pick([
      { percent: '25%', decimal: '0.25' },
      { percent: '40%', decimal: '0.4' },
      { percent: '62%', decimal: '0.62' },
      { percent: '8%', decimal: '0.08' }
    ]);
    return createChoiceItem({
      kicker: 'Percent and decimal link',
      prompt: `What decimal is equivalent to ${set.percent}?`,
      answer: set.decimal,
      distractors: ['2.5', '0.025', '0.52', '0.8'],
      fallback: () => `0.${randomInt(1, 99)}`,
      hint: 'Percent means out of 100.',
      explain: `${set.percent} = ${set.decimal}.`,
      tag: 'percent-decimal',
      coach: 'Use "out of 100" sentence frames before selecting.'
    });
  }

  const type = randomInt(0, 2);
  if (type === 0) {
    const start = randomInt(30, 220);
    const risePercent = pick([10, 15, 20, 25, 30]);
    const answer = `${risePercent}%`;
    const next = start + (start * risePercent / 100);
    return createChoiceItem({
      kicker: 'Percent change',
      prompt: `A value grows from ${start} to ${next}. What is the percent increase?`,
      answer,
      distractors: [`${risePercent - 5}%`, `${risePercent + 5}%`, `${Math.round(next)}%`],
      hint: 'Increase divided by original gives percent change.',
      explain: `Increase is ${next - start}, and ${(next - start)} / ${start} = ${risePercent}%.`,
      tag: 'percent-change',
      coach: 'Prompt students to name original value before finding percent change.'
    });
  }
  if (type === 1) {
    const x1 = randomInt(-3, 2);
    const x2 = x1 + pick([2, 3, 4]);
    const slope = pick([1, 2, 3, -1, -2]);
    const y1 = randomInt(-6, 10);
    const y2 = y1 + (slope * (x2 - x1));
    return createChoiceItem({
      kicker: 'Linear relationships',
      prompt: `Find slope between (${x1}, ${y1}) and (${x2}, ${y2}).`,
      answer: slope,
      distractors: [slope + 1, slope - 1, -slope],
      hint: 'Use rise over run.',
      explain: `Slope = (${y2} - ${y1}) / (${x2} - ${x1}) = ${slope}.`,
      tag: 'slope',
      coach: 'Ask student to label rise and run before dividing.'
    });
  }
  const coefficient = pick([2, 3, 4, 5, 6]);
  const exponent = pick([2, 3, 4]);
  const answer = `${coefficient} x 10^${exponent}`;
  return createChoiceItem({
    kicker: 'Scientific notation',
    prompt: `Which scientific notation matches ${coefficient * (10 ** exponent)}?`,
    answer,
    distractors: [`${coefficient + 1} x 10^${exponent}`, `${coefficient} x 10^${exponent - 1}`, `${coefficient} x 10^${exponent + 1}`],
    hint: 'Move decimal left until one non-zero digit remains in front.',
    explain: `${coefficient * (10 ** exponent)} = ${answer}.`,
    tag: 'scientific-notation',
    coach: 'Prompt decimal shift explanation before selecting.'
  });
}

function generateOperationsQuestion(gradeBand) {
  if (gradeBand === 'K-2') {
    const add = Math.random() >= 0.5;
    if (add) {
      const a = randomInt(3, 12);
      const b = randomInt(2, 8);
      const answer = a + b;
      return createChoiceItem({
        kicker: 'Operation strategy',
        prompt: `${a} + ${b} = ?`,
        answer,
        distractors: [answer - 1, answer + 1, a + (b - 1)],
        hint: 'Count on from the larger number.',
        explain: `${a} + ${b} = ${answer}.`,
        tag: 'operations-k2',
        coach: 'Model "count on" instead of counting all.'
      });
    }
    const a = randomInt(8, 18);
    const b = randomInt(2, 7);
    const answer = a - b;
    return createChoiceItem({
      kicker: 'Operation strategy',
      prompt: `${a} - ${b} = ?`,
      answer,
      distractors: [answer - 1, answer + 1, a - (b - 1)],
      hint: 'Count backward by b steps.',
      explain: `${a} - ${b} = ${answer}.`,
      tag: 'operations-k2',
      coach: 'Use number-line jumps for subtraction accuracy.'
    });
  }

  if (gradeBand === '3-5') {
    const type = randomInt(0, 1);
    if (type === 0) {
      const a = randomInt(3, 12);
      const b = randomInt(3, 12);
      const answer = a * b;
      return createChoiceItem({
        kicker: 'Multiplication strategy',
        prompt: `${a} x ${b} = ?`,
        answer,
        distractors: [answer - b, answer + a, (a + b)],
        hint: 'Use known facts and arrays.',
        explain: `${a} groups of ${b} equals ${answer}.`,
        tag: 'operations-35',
        coach: 'Prompt array language before selecting.'
      });
    }
    const divisor = randomInt(3, 12);
    const quotient = randomInt(2, 10);
    const dividend = divisor * quotient;
    return createChoiceItem({
      kicker: 'Division strategy',
      prompt: `${dividend} / ${divisor} = ?`,
      answer: quotient,
      distractors: [quotient - 1, quotient + 1, divisor],
      hint: 'Think: what times divisor gives dividend?',
      explain: `${quotient} x ${divisor} = ${dividend}, so the quotient is ${quotient}.`,
      tag: 'operations-35',
      coach: 'Use fact family prompts to connect multiplication and division.'
    });
  }

  if (gradeBand === '6-8') {
    if (Math.random() >= 0.5) {
      const a = randomInt(-16, 14);
      const b = randomInt(-12, 12);
      const answer = a - b;
      return createChoiceItem({
        kicker: 'Integer operations',
        prompt: `${a} - (${b}) = ?`,
        answer,
        distractors: [a + b, answer + 2, answer - 2],
        hint: 'Subtracting a negative means add.',
        explain: `${a} - (${b}) = ${answer}.`,
        tag: 'operations-68',
        coach: 'Have learner rewrite subtraction of negatives before computing.'
      });
    }
    const numerator = pick([1, 2, 3, 4]);
    const denominator = pick([4, 5, 6, 8]);
    const addNumerator = pick([1, 2, 3]);
    const answer = roundTo((numerator / denominator) + (addNumerator / denominator), 3);
    return createChoiceItem({
      kicker: 'Fraction operations',
      prompt: `${numerator}/${denominator} + ${addNumerator}/${denominator} = ?`,
      answer,
      distractors: [roundTo((numerator + addNumerator + 1) / denominator, 3), roundTo((numerator + addNumerator) / (denominator + 1), 3), roundTo((numerator + addNumerator - 1) / denominator, 3)],
      fallback: () => String(roundTo(Math.random() * 2, 3)),
      hint: 'Same denominator: add numerators.',
      explain: `(${numerator} + ${addNumerator})/${denominator} = ${answer}.`,
      tag: 'operations-68',
      coach: 'Prompt denominator check first before combining fractions.'
    });
  }

  const a = randomInt(2, 9);
  const x = randomInt(2, 12);
  const b = randomInt(-6, 8);
  const rhs = (a * x) + b;
  return createChoiceItem({
    kicker: 'Equation solving',
    prompt: `Solve: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${rhs}`,
    answer: x,
    distractors: [x + 1, x - 1, rhs - b],
    hint: 'Undo addition/subtraction, then divide by coefficient.',
    explain: `After isolating ${a}x, divide by ${a} to get x = ${x}.`,
    tag: 'operations-912',
    coach: 'Require students to state inverse operations as they solve.'
  });
}

function generateProblemSolvingQuestion(gradeBand) {
  if (gradeBand === 'K-2') {
    const apples = randomInt(5, 14);
    const eaten = randomInt(2, 5);
    const answer = apples - eaten;
    return createChoiceItem({
      kicker: 'Story problem',
      prompt: `Lina has ${apples} apples and eats ${eaten}. How many are left?`,
      answer,
      distractors: [answer + 1, answer - 1, apples + eaten],
      hint: 'Circle what is left after taking away.',
      explain: `${apples} - ${eaten} = ${answer}.`,
      tag: 'word-problem-k2',
      coach: 'Use act-it-out with objects, then write the equation.'
    });
  }
  if (gradeBand === '3-5') {
    const boxes = randomInt(3, 7);
    const pencilsPer = randomInt(5, 9);
    const givenAway = randomInt(4, 10);
    const answer = (boxes * pencilsPer) - givenAway;
    return createChoiceItem({
      kicker: 'Two-step problem',
      prompt: `A class has ${boxes} boxes with ${pencilsPer} pencils each and gives away ${givenAway}. How many pencils remain?`,
      answer,
      distractors: [boxes * pencilsPer, answer + givenAway, answer - 2],
      hint: 'Find total first, then subtract.',
      explain: `${boxes} x ${pencilsPer} = ${boxes * pencilsPer}, then minus ${givenAway} gives ${answer}.`,
      tag: 'word-problem-35',
      coach: 'Prompt students to label Step 1 and Step 2 before computing.'
    });
  }
  if (gradeBand === '6-8') {
    const ratioA = pick([2, 3, 4, 5]);
    const ratioB = pick([3, 4, 5, 6]);
    const partA = randomInt(10, 20) * ratioA;
    const answer = Math.round((partA / ratioA) * ratioB);
    return createChoiceItem({
      kicker: 'Ratio reasoning',
      prompt: `In a ratio ${ratioA}:${ratioB}, if first quantity is ${partA}, what is the second quantity?`,
      answer,
      distractors: [partA + ratioB, Math.round(partA / ratioB), answer - ratioA],
      hint: 'Find scale factor from first quantity, then apply it to second part.',
      explain: `Scale factor is ${partA} / ${ratioA}, so second quantity is ${answer}.`,
      tag: 'word-problem-68',
      coach: 'Encourage table or double-number-line representation first.'
    });
  }
  const tickets = randomInt(120, 320);
  const sold = randomInt(40, 120);
  const price = randomInt(8, 20);
  const answer = (tickets - sold) * price;
  return createChoiceItem({
    kicker: 'Algebraic modeling',
    prompt: `An event had ${tickets} tickets. ${sold} were sold online. Remaining tickets cost $${price} each. Revenue from remaining tickets?`,
    answer,
    distractors: [tickets * price, sold * price, answer + price],
    hint: 'Find remaining tickets first, then multiply by price.',
    explain: `Remaining = ${tickets} - ${sold}. Multiply by ${price} to get ${answer}.`,
    tag: 'word-problem-912',
    coach: 'Prompt variable statement before substituting values.'
  });
}

function generateFluencyQuestion(gradeBand) {
  if (gradeBand === 'K-2') {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9);
    const answer = a + b;
    return createChoiceItem({
      kicker: 'Math fluency',
      prompt: `${a} + ${b} = ?`,
      answer,
      distractors: [answer - 1, answer + 1, a + (b + 1)],
      hint: 'Use known doubles when possible.',
      explain: `Quick fact: ${a} + ${b} = ${answer}.`,
      tag: 'fact-fluency-k2',
      coach: 'Prompt mental strategy words: doubles, make ten, count on.'
    });
  }
  if (gradeBand === '3-5') {
    const a = randomInt(4, 12);
    const b = randomInt(4, 12);
    const answer = a * b;
    return createChoiceItem({
      kicker: 'Math fluency',
      prompt: `${a} x ${b} = ?`,
      answer,
      distractors: [answer - a, answer + b, a + b],
      hint: 'Break one factor if needed.',
      explain: `${a} x ${b} = ${answer}.`,
      tag: 'fact-fluency-35',
      coach: 'Prompt decomposition strategy for unknown facts.'
    });
  }
  if (gradeBand === '6-8') {
    const a = randomInt(12, 30);
    const b = randomInt(3, 9);
    const answer = a / b;
    const whole = Number.isInteger(answer) ? answer : roundTo(answer, 2);
    return createChoiceItem({
      kicker: 'Math fluency',
      prompt: `${a} / ${b} = ?`,
      answer: whole,
      distractors: [roundTo((a + b) / b, 2), roundTo((a - b) / b, 2), b],
      fallback: () => String(roundTo((Math.random() * 10) + 1, 2)),
      hint: 'Think multiplication inverse first.',
      explain: `${b} x ${whole} = ${a}.`,
      tag: 'fact-fluency-68',
      coach: 'Prompt inverse-operation language before answering.'
    });
  }
  const coefficient = randomInt(2, 6);
  const x = randomInt(2, 9);
  const constant = randomInt(-5, 7);
  const answer = (coefficient * x) + constant;
  return createChoiceItem({
    kicker: 'Math fluency',
    prompt: `Evaluate ${coefficient}x ${constant >= 0 ? '+' : '-'} ${Math.abs(constant)} when x = ${x}.`,
    answer,
    distractors: [answer + coefficient, answer - coefficient, (coefficient + x)],
    hint: 'Substitute x first, then simplify.',
    explain: `${coefficient}(${x}) ${constant >= 0 ? '+' : '-'} ${Math.abs(constant)} = ${answer}.`,
    tag: 'fact-fluency-912',
    coach: 'Require substitution step to be verbalized before simplifying.'
  });
}

function generateMathLanguageQuestion(gradeBand) {
  if (gradeBand === 'K-2') {
    return createChoiceItem({
      kicker: 'Math language',
      prompt: 'Which word means the answer to an addition problem?',
      answer: 'sum',
      distractors: ['difference', 'equal', 'minus'],
      hint: 'Think plus sign.',
      explain: 'The answer to addition is called a sum.',
      tag: 'language-k2',
      coach: 'Pair vocabulary with symbol cards and gestures.'
    });
  }
  if (gradeBand === '3-5') {
    return createChoiceItem({
      kicker: 'Math language',
      prompt: 'Complete the sentence: 3/4 is ___ than 1/2.',
      answer: 'greater',
      distractors: ['less', 'equal', 'undefined'],
      hint: 'Compare benchmark fractions.',
      explain: 'Three fourths is greater than one half.',
      tag: 'language-35',
      coach: 'Prompt compare language with fraction visuals.'
    });
  }
  if (gradeBand === '6-8') {
    return createChoiceItem({
      kicker: 'Reasoning language',
      prompt: 'Choose the strongest explanation sentence.',
      stem: 'A student solved 4(3 + 2) as 4x3 + 4x2.',
      answer: 'This uses the distributive property correctly.',
      distractors: [
        'This uses associative property only.',
        'This is wrong because multiplication comes first.',
        'This only works with subtraction.'
      ],
      hint: 'Look for precise property language.',
      explain: 'Multiplication distributes over addition, so both terms are multiplied by 4.',
      tag: 'language-68',
      coach: 'Require complete property sentence stems before final answer.'
    });
  }
  return createChoiceItem({
    kicker: 'Reasoning language',
    prompt: 'Best interpretation of slope = -2 in context?',
    answer: 'For each 1-unit increase in x, y decreases by 2 units.',
    distractors: [
      'For each 2-unit increase in x, y increases by 1 unit.',
      'x and y are both always positive.',
      'The line has no y-intercept.'
    ],
    hint: 'Slope is change in y for every 1 change in x.',
    explain: 'A negative slope means y goes down as x goes up.',
    tag: 'language-912',
    coach: 'Prompt "for each 1 in x" framing for slope explanations.'
  });
}

function generateQuestion(gradeBand, domain) {
  if (domain === 'operations') return generateOperationsQuestion(gradeBand);
  if (domain === 'problem-solving') return generateProblemSolvingQuestion(gradeBand);
  if (domain === 'fluency') return generateFluencyQuestion(gradeBand);
  if (domain === 'math-language') return generateMathLanguageQuestion(gradeBand);
  return generateNumberSenseQuestion(gradeBand);
}

function readNumeracyLogs() {
  const parsed = safeParse(localStorage.getItem(NUMERACY_LOG_KEY) || '');
  return Array.isArray(parsed) ? parsed : [];
}

function appendNumeracyLog(entry) {
  const list = readNumeracyLogs();
  list.push(entry);
  const capped = list.slice(-320);
  localStorage.setItem(NUMERACY_LOG_KEY, JSON.stringify(capped));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    gradeBand: state.gradeBand,
    domain: state.domain,
    totalRounds: state.totalRounds
  }));
}

function loadSettings() {
  const parsed = safeParse(localStorage.getItem(SETTINGS_KEY) || '') || {};
  state.gradeBand = normalizeGradeBand(parsed.gradeBand || getDefaultGradeBand());
  state.domain = normalizeDomain(parsed.domain || PAGE_CONFIG.defaultDomain);
  state.totalRounds = [8, 10, 12].includes(Number(parsed.totalRounds)) ? Number(parsed.totalRounds) : 10;
}

function applyQueryDefaults() {
  const params = new URLSearchParams(window.location.search || '');
  const queryDomain = PAGE_CONFIG.lockDomain
    ? PAGE_CONFIG.defaultDomain
    : normalizeDomain(params.get('domain') || params.get('numeracyDomain') || state.domain);
  const queryGrade = params.get('gradeBand') || params.get('grade') || state.gradeBand;
  const queryRounds = Number(params.get('rounds') || state.totalRounds);

  state.domain = queryDomain;
  state.gradeBand = normalizeGradeBand(queryGrade);
  if ([8, 10, 12].includes(queryRounds)) state.totalRounds = queryRounds;
}

function syncControls() {
  if (ui.grade) ui.grade.value = state.gradeBand;
  if (ui.domain) ui.domain.value = state.domain;
  if (ui.rounds) ui.rounds.value = String(state.totalRounds);
}

function setSessionControlsDisabled(disabled) {
  if (ui.grade) ui.grade.disabled = disabled;
  if (ui.domain) ui.domain.disabled = disabled || PAGE_CONFIG.lockDomain;
  if (ui.rounds) ui.rounds.disabled = disabled;
  if (ui.start) ui.start.textContent = disabled ? PAGE_CONFIG.startRunningLabel : PAGE_CONFIG.startIdleLabel;
}

function renderHud() {
  if (ui.correct) ui.correct.textContent = String(state.correct);
  if (ui.streak) ui.streak.textContent = String(state.streak);
  if (ui.remaining) {
    const remaining = Math.max(0, state.totalRounds - state.roundIndex);
    ui.remaining.textContent = String(remaining);
  }
}

function renderCoachMoves() {
  if (!ui.coachList) return;
  ui.coachList.innerHTML = '';
  if (!state.coachMoves.length) {
    const li = document.createElement('li');
    li.textContent = 'No urgent coach moves yet. Keep probing for a clear signal.';
    ui.coachList.appendChild(li);
    return;
  }
  state.coachMoves.slice(0, 4).forEach((move) => {
    const li = document.createElement('li');
    li.textContent = move;
    ui.coachList.appendChild(li);
  });
}

function renderPulse() {
  if (!ui.pulse) return;
  if (!state.attempts.length) {
    ui.pulse.innerHTML = '<p>Start a sprint to generate live mastery and gap signals.</p>';
    return;
  }

  const answered = state.attempts.length;
  const accuracy = clamp01(state.correct / answered);
  const avgMs = Math.round(average(state.attempts.map((attempt) => attempt.responseMs || 0)));

  const byTag = {};
  state.attempts.forEach((attempt) => {
    if (!byTag[attempt.tag]) {
      byTag[attempt.tag] = { tag: attempt.tag, total: 0, correct: 0 };
    }
    byTag[attempt.tag].total += 1;
    if (attempt.correct) byTag[attempt.tag].correct += 1;
  });

  const rows = Object.values(byTag)
    .map((row) => ({
      tag: row.tag,
      label: TAG_LABELS[row.tag] || row.tag,
      accuracy: row.total > 0 ? row.correct / row.total : 0,
      total: row.total
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const topGap = rows[0];
  const topStrength = rows.slice().sort((a, b) => b.accuracy - a.accuracy)[0];

  ui.pulse.innerHTML = `
    <div class="numsense-pulse-grid">
      <article class="numsense-pulse-card">
        <h3>Live Summary</h3>
        <ul>
          <li><strong>Accuracy:</strong> ${Math.round(accuracy * 100)}%</li>
          <li><strong>Answered:</strong> ${answered}/${state.totalRounds}</li>
          <li><strong>Best streak:</strong> ${state.bestStreak}</li>
          <li><strong>Avg response:</strong> ${avgMs || 0} ms</li>
        </ul>
      </article>
      <article class="numsense-pulse-card">
        <h3>Top Gap</h3>
        <p>${topGap ? `${topGap.label} (${Math.round(topGap.accuracy * 100)}% across ${topGap.total} probe(s))` : 'No gap signal yet.'}</p>
      </article>
      <article class="numsense-pulse-card">
        <h3>Top Strength</h3>
        <p>${topStrength ? `${topStrength.label} (${Math.round(topStrength.accuracy * 100)}%)` : 'No strength signal yet.'}</p>
      </article>
    </div>
  `;
}

function setFeedback(message, type = 'neutral') {
  if (!ui.feedback) return;
  ui.feedback.textContent = message;
  ui.feedback.classList.remove('is-correct', 'is-wrong');
  if (type === 'correct') ui.feedback.classList.add('is-correct');
  if (type === 'wrong') ui.feedback.classList.add('is-wrong');
}

function setFunLine(correct) {
  if (!ui.fun) return;
  const band = FUN_LIBRARY[state.gradeBand] ? state.gradeBand : '3-5';
  const list = correct ? FUN_LIBRARY[band].success : FUN_LIBRARY[band].retry;
  ui.fun.textContent = pick(list);
}

function addCoachMove(move) {
  if (!move) return;
  if (state.coachMoves.includes(move)) return;
  state.coachMoves.unshift(move);
  state.coachMoves = state.coachMoves.slice(0, 6);
}

function renderCurrentItem() {
  if (!ui.options || !ui.prompt || !ui.kicker || !ui.stem) return;
  ui.options.innerHTML = '';
  if (!state.currentItem) {
    ui.kicker.textContent = 'Ready';
    ui.prompt.textContent = PAGE_CONFIG.readyPrompt;
    ui.stem.textContent = '';
    return;
  }

  ui.kicker.textContent = state.currentItem.kicker;
  ui.prompt.textContent = state.currentItem.prompt;
  ui.stem.textContent = state.currentItem.stem || '';

  state.currentItem.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'numsense-option';
    button.dataset.value = option;
    button.innerHTML = `<span class="numsense-option-index">${index + 1}</span><span>${option}</span>`;
    button.addEventListener('click', () => {
      handleAnswer(option);
    });
    ui.options.appendChild(button);
  });
}

function markOptionFeedback(selected, answer) {
  const buttons = Array.from(ui.options?.querySelectorAll('.numsense-option') || []);
  buttons.forEach((button) => {
    button.disabled = true;
    const value = String(button.dataset.value || '');
    if (value === String(answer)) button.classList.add('is-correct');
    if (selected !== 'Skip' && value === String(selected) && value !== String(answer)) {
      button.classList.add('is-wrong');
    }
  });
}

function logProbe(item, selected, correct, responseMs) {
  const meta = DOMAIN_META[state.domain] || DOMAIN_META['number-sense'];
  appendNumeracyLog({
    ts: Date.now(),
    learnerId: window.DECODE_PLATFORM?.getActiveLearnerId?.() || '',
    activity: meta.activity,
    label: meta.activityLabel,
    event: `${correct ? 'Correct' : 'Incorrect'} · ${state.roundIndex}/${state.totalRounds}`,
    detail: {
      domain: state.domain,
      gradeBand: state.gradeBand,
      correct: correct ? 1 : 0,
      total: 1,
      accuracy: correct ? 1 : 0,
      selected: selected,
      answer: item.answer,
      tag: item.tag,
      source: PAGE_CONFIG.sourceTag,
      evidenceType: 'probe-item',
      responseMs
    }
  });
}

function logSessionSummary() {
  const answered = state.attempts.length || 1;
  const accuracy = clamp01(state.correct / answered);
  const avgMs = Math.round(average(state.attempts.map((attempt) => attempt.responseMs || 0)));
  const meta = DOMAIN_META[state.domain] || DOMAIN_META['number-sense'];

  appendNumeracyLog({
    ts: Date.now(),
    learnerId: window.DECODE_PLATFORM?.getActiveLearnerId?.() || '',
    activity: meta.activity,
    label: meta.activityLabel,
    event: `${state.correct}/${state.totalRounds}`,
    detail: {
      domain: state.domain,
      gradeBand: state.gradeBand,
      correct: state.correct,
      total: state.totalRounds,
      accuracy,
      avgResponseMs: avgMs,
      bestStreak: state.bestStreak,
      source: PAGE_CONFIG.sourceTag,
      evidenceType: 'session-summary'
    }
  });

  try {
    window.DECODE_PLATFORM?.logActivity?.({
      activity: PAGE_CONFIG.activityId,
      label: PAGE_CONFIG.activityLabel,
      event: `${meta.domainLabel}: ${state.correct}/${state.totalRounds}`,
      score: Math.round(accuracy * 100),
      detail: {
        domain: state.domain,
        gradeBand: state.gradeBand,
        correct: state.correct,
        total: state.totalRounds,
        bestStreak: state.bestStreak
      }
    });
  } catch {}
}

function finishSession() {
  state.sessionActive = false;
  state.locked = false;
  setSessionControlsDisabled(false);
  renderHud();
  renderPulse();
  renderCoachMoves();
  logSessionSummary();

  const accuracy = state.attempts.length ? Math.round((state.correct / state.attempts.length) * 100) : 0;
  setFeedback(`Session complete: ${state.correct}/${state.totalRounds} (${accuracy}%). Adjust the next sprint from your top gap.`, 'neutral');
  if (ui.hintText) ui.hintText.textContent = '';
}

function nextPrompt() {
  if (!state.sessionActive) return;
  if (state.roundIndex >= state.totalRounds) {
    finishSession();
    return;
  }
  state.currentItem = generateQuestion(state.gradeBand, state.domain);
  state.itemStartedAt = performance.now();
  state.locked = false;
  if (ui.hintText) ui.hintText.textContent = '';
  setFeedback('', 'neutral');
  renderCurrentItem();
  renderHud();
}

function handleAnswer(rawValue) {
  if (!state.sessionActive || state.locked || !state.currentItem) return;
  state.locked = true;
  const selected = rawValue === '__skip__' ? 'Skip' : String(rawValue);
  const answer = String(state.currentItem.answer);
  const correct = selected === answer;
  const responseMs = Math.max(0, Math.round(performance.now() - state.itemStartedAt));

  if (correct) {
    state.correct += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    setFeedback(`Correct. ${state.currentItem.explain || ''}`, 'correct');
  } else {
    state.streak = 0;
    if (selected === 'Skip') {
      setFeedback(`Skipped. Correct answer: ${answer}. ${state.currentItem.explain || ''}`, 'wrong');
    } else {
      setFeedback(`Not yet. Correct answer: ${answer}. ${state.currentItem.explain || ''}`, 'wrong');
    }
    addCoachMove(state.currentItem.coach);
  }

  state.roundIndex += 1;
  state.attempts.push({
    tag: state.currentItem.tag,
    correct,
    responseMs
  });

  logProbe(state.currentItem, selected, correct, responseMs);
  setFunLine(correct);
  markOptionFeedback(selected, answer);
  renderHud();
  renderPulse();
  renderCoachMoves();

  window.setTimeout(() => {
    nextPrompt();
  }, correct ? 650 : 950);
}

function showHint() {
  if (!state.sessionActive || !state.currentItem || !ui.hintText) return;
  ui.hintText.textContent = state.currentItem.hint || 'Use one visual model, then compute.';
}

function skipItem() {
  if (!state.sessionActive || !state.currentItem) return;
  handleAnswer('__skip__');
}

function startSession() {
  state.gradeBand = normalizeGradeBand(ui.grade?.value || state.gradeBand);
  state.domain = PAGE_CONFIG.lockDomain
    ? PAGE_CONFIG.defaultDomain
    : normalizeDomain(ui.domain?.value || state.domain);
  state.totalRounds = [8, 10, 12].includes(Number(ui.rounds?.value)) ? Number(ui.rounds.value) : 10;
  saveSettings();

  state.roundIndex = 0;
  state.correct = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.sessionActive = true;
  state.locked = false;
  state.currentItem = null;
  state.attempts = [];
  state.coachMoves = [];

  setSessionControlsDisabled(true);
  renderCoachMoves();
  renderPulse();
  renderHud();
  setFunLine(true);

  try {
    const meta = DOMAIN_META[state.domain] || DOMAIN_META['number-sense'];
    window.DECODE_PLATFORM?.logActivity?.({
      activity: PAGE_CONFIG.activityId,
      label: PAGE_CONFIG.activityLabel,
      event: `Started ${meta.domainLabel} (${state.gradeBand})`,
      detail: {
        domain: state.domain,
        gradeBand: state.gradeBand,
        total: state.totalRounds
      }
    });
  } catch {}

  nextPrompt();
}

function onSetupChange() {
  if (state.sessionActive) return;
  state.gradeBand = normalizeGradeBand(ui.grade?.value || state.gradeBand);
  state.domain = PAGE_CONFIG.lockDomain
    ? PAGE_CONFIG.defaultDomain
    : normalizeDomain(ui.domain?.value || state.domain);
  state.totalRounds = [8, 10, 12].includes(Number(ui.rounds?.value)) ? Number(ui.rounds.value) : state.totalRounds;
  saveSettings();
  renderHud();
}

function applyPageModeUi() {
  if (!PAGE_CONFIG.lockDomain) return;
  state.domain = PAGE_CONFIG.defaultDomain;
  if (ui.domain) {
    ui.domain.value = PAGE_CONFIG.defaultDomain;
    ui.domain.disabled = true;
    const field = ui.domain.closest('.numsense-field');
    if (field) field.classList.add('is-hidden');
  }
}

function handleKeydown(event) {
  if (!state.sessionActive || state.locked) return;
  if (!state.currentItem) return;
  if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4') {
    const index = Number(event.key) - 1;
    const options = state.currentItem.options || [];
    if (options[index] !== undefined) {
      handleAnswer(options[index]);
    }
    return;
  }
  if (event.key.toLowerCase() === 'h') {
    showHint();
    return;
  }
  if (event.key.toLowerCase() === 's') {
    skipItem();
  }
}

function init() {
  applyLightTheme();
  loadSettings();
  applyQueryDefaults();
  applyPageModeUi();
  syncControls();
  saveSettings();
  setSessionControlsDisabled(false);
  renderHud();
  renderPulse();
  renderCoachMoves();
  renderCurrentItem();

  ui.start?.addEventListener('click', startSession);
  ui.hintBtn?.addEventListener('click', showHint);
  ui.skipBtn?.addEventListener('click', skipItem);
  ui.grade?.addEventListener('change', onSetupChange);
  ui.domain?.addEventListener('change', onSetupChange);
  ui.rounds?.addEventListener('change', onSetupChange);
  document.addEventListener('keydown', handleKeydown);
}

init();
