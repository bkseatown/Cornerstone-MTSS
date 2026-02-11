#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RUNTIME_MARKER = '\n\n\n/* Build a simple runtime word database for the game */';

const DEFAULT_WORDS_PATH = 'words.js';
const DEFAULT_PROFILE = 'fun-k12';
const DEFAULT_AUDIT_TOP = 20;
const DEFAULT_AUDIT_REPEAT_THRESHOLD = 5;

const BAD_TEMPLATE_PATTERNS = [
  /helps connect ideas about time, place, reason, or sequence/i,
  /our teacher asked us to underline .* because it changed the meaning/i,
  /is an animal that helps us learn how different ecosystems work/i,
  /is a food ingredient students might see in cafeteria menus or home kitchens/i,
  /is a plant or nature word people use in science and garden conversations/i,
  /my partner picked .* for our healthy snack poster because everyone recognized it/i,
  /our team had to .* quickly so we could finish before the timer/i
];

const SCHOOL_UNSAFE_WORDS = new Set([
  'slur',
  'slurs',
  'profanity'
]);

const COLOR_WORDS = new Set([
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
  'gray', 'grey', 'gold', 'silver', 'crimson', 'scarlet', 'teal', 'turquoise', 'navy', 'violet',
  'indigo', 'amber', 'coral', 'beige', 'tan', 'ivory'
]);

const ANIMAL_WORDS = new Set([
  'ant', 'ape', 'badger', 'bat', 'bear', 'beaver', 'bee', 'bird', 'bison', 'boar', 'buffalo',
  'butterfly', 'camel', 'cat', 'cheetah', 'chicken', 'chimp', 'cow', 'crab', 'crocodile', 'deer',
  'dog', 'dolphin', 'donkey', 'duck', 'eagle', 'elephant', 'falcon', 'ferret', 'fish', 'fox',
  'frog', 'gazelle', 'giraffe', 'goat', 'goose', 'gorilla', 'hamster', 'hawk', 'hedgehog',
  'hippo', 'horse', 'hyena', 'iguana', 'jaguar', 'jellyfish', 'kangaroo', 'koala', 'lemur',
  'leopard', 'lion', 'lizard', 'llama', 'lobster', 'lynx', 'mole', 'monkey', 'moose', 'mouse',
  'narwhal', 'newt', 'otter', 'owl', 'ox', 'panda', 'panther', 'parrot', 'peacock', 'pelican',
  'penguin', 'pheasant', 'pig', 'pigeon', 'pony', 'porcupine', 'quail', 'rabbit', 'raccoon', 'rat',
  'reindeer', 'rhino', 'rhinoceros', 'robin', 'salamander', 'seal', 'shark', 'sheep', 'skunk',
  'sloth', 'snail', 'snake', 'sparrow', 'spider', 'squid', 'swan', 'tiger', 'toad', 'turkey',
  'turtle', 'walrus', 'whale', 'wolf', 'wombat', 'yak', 'zebra', 'platypus', 'kingfisher', 'hornet'
]);

const FOOD_WORDS = new Set([
  'apple', 'apricot', 'avocado', 'bagel', 'banana', 'bean', 'beef', 'berry', 'bread', 'broccoli',
  'burger', 'burrito', 'butter', 'cabbage', 'cake', 'candy', 'carrot', 'cereal', 'cheese', 'cherry',
  'chicken', 'chili', 'chocolate', 'cookie', 'corn', 'cracker', 'croissant', 'cucumber', 'cupcake',
  'donut', 'dumpling', 'egg', 'fig', 'fries', 'garlic', 'grape', 'grapefruit', 'ham', 'hazelnut',
  'honey', 'honeydew', 'hummus', 'icecream', 'jam', 'juice', 'kale', 'ketchup', 'kiwi', 'lasagna',
  'lemon', 'lemonade', 'lettuce', 'lime', 'mango', 'marshmallow', 'mayonnaise', 'meatball', 'melon',
  'milk', 'milkshake', 'muffin', 'mushroom', 'mustard', 'nacho', 'noodle', 'nut', 'nutmeg', 'oatmeal',
  'olive', 'omelet', 'onion', 'orange', 'pancake', 'papaya', 'pasta', 'peach', 'peanut', 'pear',
  'pepper', 'pickle', 'pie', 'pineapple', 'pizza', 'plum', 'popcorn', 'potato', 'pretzel', 'pumpkin',
  'radish', 'rice', 'salad', 'salmon', 'sandwich', 'sausage', 'smoothie', 'snack', 'soup', 'spinach',
  'strawberry', 'sushi', 'taco', 'toast', 'tomato', 'tortilla', 'waffle', 'watermelon', 'yogurt'
]);

const PLANT_WORDS = new Set([
  'acorn', 'algae', 'bamboo', 'bark', 'berrybush', 'blossom', 'branch', 'bud', 'bush', 'cactus',
  'clover', 'daisy', 'dandelion', 'fern', 'flower', 'forest', 'grass', 'grove', 'hibiscus', 'ivy',
  'jasmine', 'juniper', 'lagoon', 'lavender', 'leaf', 'lilac', 'lily', 'lotus', 'magnolia', 'maple',
  'marigold', 'marsh', 'meadow', 'moss', 'oak', 'orchid', 'palm', 'peony', 'petal', 'petunia',
  'pine', 'poplar', 'pollen', 'prairie', 'primrose', 'redwood', 'river', 'rosemary', 'rose', 'root',
  'sage', 'sapling', 'sequoia', 'shoreline', 'spring', 'sprout', 'stream', 'sunflower', 'thistle',
  'thorn', 'trail', 'tree', 'tulip', 'valley', 'violet', 'waterfall', 'weed', 'willow', 'woodland',
  'yarrow', 'zinnia'
]);

const PLACE_WORDS = new Set([
  'airport', 'alley', 'arena', 'attic', 'basement', 'beach', 'bridge', 'cabin', 'cafeteria', 'campus',
  'castle', 'cave', 'city', 'classroom', 'clinic', 'coast', 'desert', 'farm', 'field', 'garage',
  'garden', 'gym', 'hallway', 'harbor', 'hospital', 'house', 'island', 'kitchen', 'lake', 'library',
  'market', 'museum', 'neighborhood', 'office', 'park', 'playground', 'plaza', 'pond', 'road',
  'school', 'shore', 'stadium', 'station', 'store', 'street', 'swamp', 'town', 'village', 'warehouse',
  'yard', 'zone'
]);

const TIME_CONNECTORS = new Set([
  'after', 'again', 'already', 'before', 'eventually', 'finally', 'first', 'later', 'meanwhile',
  'next', 'soon', 'then', 'today', 'tomorrow', 'tonight', 'when', 'while', 'yesterday'
]);

const REASON_CONNECTORS = new Set(['because', 'however', 'therefore', 'since', 'although', 'though']);
const CONDITION_CONNECTORS = new Set(['if', 'unless', 'until', 'whether']);
const POSITION_CONNECTORS = new Set([
  'above', 'across', 'along', 'among', 'around', 'beneath', 'beside', 'between', 'beyond', 'below',
  'inside', 'outside', 'near', 'nearby', 'under', 'over'
]);

const MATH_TERMS = new Set([
  'add', 'addition', 'subtract', 'subtraction', 'multiply', 'multiplication', 'divide', 'division',
  'sum', 'difference', 'product', 'quotient', 'equal', 'equals', 'equation', 'expression', 'fraction',
  'decimal', 'percent', 'ratio', 'proportion', 'integer', 'whole', 'place', 'value', 'digit', 'number',
  'count', 'counting', 'estimate', 'round', 'rounding', 'greater', 'less', 'compare', 'comparison',
  'pattern', 'sequence', 'shape', 'triangle', 'square', 'rectangle', 'circle', 'polygon', 'angle',
  'perimeter', 'area', 'volume', 'length', 'width', 'height', 'weight', 'mass', 'time', 'hour',
  'minute', 'second', 'money', 'coin', 'dollar', 'cent', 'graph', 'table', 'data', 'mean', 'median',
  'mode', 'range', 'total', 'share', 'split'
]);

const SCIENCE_TERMS = new Set([
  'atom', 'cell', 'cells', 'ecosystem', 'energy', 'force', 'friction', 'gravity', 'habitat', 'matter',
  'molecule', 'planet', 'orbit', 'solar', 'system', 'climate', 'weather', 'erosion', 'fossil', 'species',
  'adaptation', 'photosynthesis', 'chlorophyll', 'evaporation', 'condensation', 'precipitation',
  'observation', 'hypothesis', 'experiment', 'variable', 'control', 'evidence', 'data', 'temperature',
  'thermometer', 'volume', 'mass', 'density', 'solution', 'mixture', 'organism', 'predator', 'prey',
  'food', 'chain', 'cycle', 'resource', 'renewable', 'nonrenewable', 'landform', 'volcano', 'earthquake',
  'magnet', 'magnetic', 'current'
]);

const HUMANITIES_TERMS = new Set([
  'history', 'geography', 'government', 'citizen', 'community', 'culture', 'tradition', 'timeline',
  'primary', 'secondary', 'source', 'evidence', 'artifact', 'economy', 'trade', 'region', 'continent',
  'country', 'state', 'city', 'rural', 'urban', 'map', 'route', 'landmark', 'law', 'rights',
  'responsibility', 'democracy', 'constitution', 'election', 'debate', 'perspective', 'point', 'view',
  'cause', 'effect', 'change', 'continuity', 'conflict', 'cooperation', 'migration', 'settlement',
  'colonial', 'revolution', 'timeline', 'ancient', 'modern'
]);

const WIDA_TERMS = new Set([
  'analyze', 'argue', 'ask', 'classify', 'compare', 'compose', 'conclude', 'connect', 'construct',
  'contrast', 'create', 'criticize', 'define', 'describe', 'determine', 'develop', 'discuss', 'evaluate',
  'explain', 'identify', 'illustrate', 'infer', 'interpret', 'justify', 'locate', 'narrate', 'observe',
  'organize', 'predict', 'present', 'question', 'reason', 'recall', 'retell', 'sequence', 'summarize',
  'support', 'synthesize', 'trace', 'clarify', 'elaborate', 'evidence', 'claim', 'topic', 'detail',
  'purpose', 'audience', 'transition', 'academic', 'language'
]);

const ACADEMIC_DOMAIN_SETS = {
  math: MATH_TERMS,
  science: SCIENCE_TERMS,
  humanities: HUMANITIES_TERMS,
  wida: WIDA_TERMS
};

const ACADEMIC_DOMAINS = Object.keys(ACADEMIC_DOMAIN_SETS);

const SUPPORTED_LANGS = ['en', 'es', 'zh', 'tl', 'ms', 'vi', 'hi', 'ar', 'ko', 'ja'];

function parseArgs(argv) {
  const args = { _: [] };
  for (const token of argv) {
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }
    const eq = token.indexOf('=');
    if (eq === -1) {
      args[token.slice(2)] = 'true';
      continue;
    }
    const key = token.slice(2, eq);
    const value = token.slice(eq + 1);
    args[key] = value;
  }
  return args;
}

function hashString(input) {
  let hash = 2166136261;
  const text = String(input || '');
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick(list, seed, offset = 0) {
  if (!Array.isArray(list) || !list.length) return '';
  return list[Math.abs(seed + offset) % list.length];
}

function cap(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeTemplate(text, word) {
  if (!text) return '';
  const rx = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
  return String(text).toLowerCase().replace(rx, '{w}');
}

function loadWordsData(wordsPath) {
  const source = fs.readFileSync(wordsPath, 'utf8');
  const context = { window: {}, globalThis: {} };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(`${source}\n;this.__WORDS_DATA__ = (typeof WORDS_DATA !== 'undefined' ? WORDS_DATA : null);`, context);
  const data = context.__WORDS_DATA__;
  if (!data || typeof data !== 'object') {
    throw new Error(`Unable to load WORDS_DATA from ${wordsPath}`);
  }

  const markerIndex = source.indexOf(RUNTIME_MARKER);
  const suffix = markerIndex >= 0 ? source.slice(markerIndex) : '';
  return { data, source, suffix };
}

function saveWordsData(wordsPath, data, suffix = '') {
  const content = `const WORDS_DATA = \n${JSON.stringify(data, null, 2)};${suffix}`;
  fs.writeFileSync(wordsPath, content);
}

function parseNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function rangeFromArgs(args, totalEntries) {
  const start = Math.max(1, parseNumber(args.start, 1));
  const end = Math.min(totalEntries, parseNumber(args.end, totalEntries));
  if (start > end) {
    throw new Error(`Invalid range: start (${start}) is greater than end (${end})`);
  }
  return { start, end };
}

function isLikelySchoolWord(word) {
  const w = String(word || '').trim().toLowerCase();
  if (!w) return { ok: false, reason: 'empty' };
  if (!/^[a-z][a-z\-']*$/.test(w)) return { ok: false, reason: 'non-alpha chars' };
  if (w.length < 2 || w.length > 16) return { ok: false, reason: 'length out of range' };
  if (!/[aeiouy]/.test(w)) return { ok: false, reason: 'no vowel' };
  if (/(.)\1\1/.test(w)) return { ok: false, reason: 'triple repeated letters' };
  if (/q(?!u)/.test(w)) return { ok: false, reason: 'q not followed by u' };
  if (SCHOOL_UNSAFE_WORDS.has(w)) return { ok: false, reason: 'blocked term' };

  const rareChars = (w.match(/[qzxj]/g) || []).length;
  if (rareChars >= 4) return { ok: false, reason: 'rare-letter density' };
  return { ok: true, reason: '' };
}

function classifyWord(word, entry = {}) {
  const w = String(word || '').toLowerCase();
  const pos = String(entry?.pos || '').toLowerCase();

  if (MATH_TERMS.has(w)) return 'math';
  if (SCIENCE_TERMS.has(w)) return 'science';
  if (HUMANITIES_TERMS.has(w)) return 'humanities';
  if (WIDA_TERMS.has(w)) return 'wida';
  if (COLOR_WORDS.has(w)) return 'color';
  if (TIME_CONNECTORS.has(w) || REASON_CONNECTORS.has(w) || CONDITION_CONNECTORS.has(w) || POSITION_CONNECTORS.has(w) || pos === 'word') {
    return 'connector';
  }
  if (pos === 'verb') return 'verb';
  if (pos === 'adjective') return 'adjective';
  if (pos === 'adverb') return 'adverb';
  if (ANIMAL_WORDS.has(w)) return 'animal';
  if (FOOD_WORDS.has(w)) return 'food';
  if (PLANT_WORDS.has(w)) return 'plant';
  if (PLACE_WORDS.has(w)) return 'place';
  if (pos === 'noun') return 'noun';
  return 'general';
}

function connectorType(word) {
  if (TIME_CONNECTORS.has(word)) return 'time clue';
  if (REASON_CONNECTORS.has(word)) return 'reason clue';
  if (CONDITION_CONNECTORS.has(word)) return 'condition clue';
  if (POSITION_CONNECTORS.has(word)) return 'position clue';
  return 'bridge word';
}

function generateMathStoryProblem(word, seed) {
  const entities = ['stickers', 'markers', 'notebooks', 'blocks', 'coins', 'books', 'cups'];
  const names = ['Mia', 'Jay', 'Noah', 'Ava', 'Liam', 'Zoe', 'Kai'];
  const a = 4 + (seed % 9);
  const b = 3 + (Math.floor(seed / 7) % 8);
  const c = 2 + (Math.floor(seed / 17) % 7);
  const entity = pick(entities, seed, 2);
  const nameA = pick(names, seed, 3);
  const nameB = pick(names, seed, 5);

  const w = String(word || '').toLowerCase();

  if (/(add|sum|total|plus)/.test(w)) {
    return `${nameA} has ${a} ${entity}. ${nameB} gives ${nameA} ${b} more. How many ${entity} does ${nameA} have in all?`;
  }
  if (/(subtract|difference|minus|less)/.test(w)) {
    return `${nameA} had ${a + b} ${entity}. ${nameA} used ${b} of them. How many ${entity} are left?`;
  }
  if (/(multiply|product|times)/.test(w)) {
    return `${nameA} makes ${a} rows with ${c} ${entity} in each row. How many ${entity} are there altogether?`;
  }
  if (/(divide|quotient|share|split)/.test(w)) {
    return `${nameA} has ${a * c} ${entity}. ${nameA} shares them equally with ${c} friends. How many ${entity} does each friend get?`;
  }
  if (/(fraction|decimal|percent|ratio|proportion)/.test(w)) {
    return `A class chart shows ${a} out of ${a + b} students chose reading first. Write that as a ${word}.`;
  }
  if (/(perimeter|area|volume|length|width|height)/.test(w)) {
    return `A rectangle is ${a} units long and ${b} units wide. Use ${word} to solve a question about this shape.`;
  }
  if (/(graph|table|data|mean|median|mode|range)/.test(w)) {
    return `The class recorded test scores: ${a}, ${b}, ${a + c}, ${b + c}, ${a + b}. Use ${word} to analyze the data.`;
  }
  return `${nameA} and ${nameB} are solving a problem with ${a}, ${b}, and ${c}. Explain how the math word "${word}" helps solve it.`;
}

function generateScienceScenario(word, seed) {
  const names = ['Mia', 'Jay', 'Noah', 'Ava', 'Liam', 'Zoe', 'Kai'];
  const settings = ['in the school garden', 'during lab stations', 'on the playground science walk', 'at the weather station corner'];
  const probes = ['recorded observations', 'tested a small model', 'compared two samples', 'tracked changes over time'];
  const name = pick(names, seed, 1);
  const place = pick(settings, seed, 2);
  const action = pick(probes, seed, 3);
  return `${name} worked ${place} and ${action}. Explain how the science term "${word}" helps describe what happened.`;
}

function generateHumanitiesScenario(word, seed) {
  const names = ['Mia', 'Jay', 'Noah', 'Ava', 'Liam', 'Zoe', 'Kai'];
  const settings = ['in social studies', 'during a history discussion', 'while reading a primary source', 'during a geography map task'];
  const prompts = ['compared two perspectives', 'traced cause and effect', 'used map evidence', 'debated a classroom decision'];
  const name = pick(names, seed, 1);
  const setting = pick(settings, seed, 2);
  const prompt = pick(prompts, seed, 3);
  return `${name} was ${setting} and ${prompt}. Write one sentence showing the humanities word "${word}" in context.`;
}

function generateWidaScenario(word, seed) {
  const frames = [
    `Use "${word}" in an academic sentence frame: "I can ___ because ___."`,
    `Explain a classroom idea using the WIDA-style word "${word}" and one transition word.`,
    `Write a short response that uses "${word}" to show clear academic language.`,
    `Practice speaking: use "${word}" to compare two ideas with evidence.`
  ];
  return pick(frames, seed, 1);
}

function generateAcademicPrompt(word, domain, seed) {
  if (domain === 'math') return generateMathStoryProblem(word, seed);
  if (domain === 'science') return generateScienceScenario(word, seed);
  if (domain === 'humanities') return generateHumanitiesScenario(word, seed);
  if (domain === 'wida') return generateWidaScenario(word, seed);
  return `Use the word "${word}" in a classroom-friendly sentence that shows clear academic meaning.`;
}

function generateCopy(word, entry, profile = DEFAULT_PROFILE, seedOffset = 0) {
  const w = String(word || '').toLowerCase();
  const seed = hashString(`${w}|${profile}|${seedOffset}`);
  const category = classifyWord(w, entry);

  const contexts = ['during writing time', 'in small group', 'during partner work', 'in read-aloud', 'during word practice', 'in our class discussion'];
  const reactions = ['and the meaning clicked faster.', 'and the sentence sounded stronger right away.', 'and even reluctant writers had ideas.', 'and my teacher smiled at the revision.', 'and everyone could picture the scene.'];

  let def = '';
  let sentence = '';

  if (category === 'math' || category === 'science' || category === 'humanities' || category === 'wida') {
    const domain = category;
    const label = domain === 'wida' ? 'academic-language' : domain;
    const defStarts = [
      `${cap(w)} is a ${label} term that helps students explain ideas clearly`,
      `In ${label}, ${w} gives classroom thinking a stronger structure`,
      `The word ${w} helps readers follow ${label} meaning step by step`
    ];
    const defEnds = [
      'during discussions, reading, and writing.',
      'so students can show how they reached an idea.',
      'especially for multilingual classroom communication.'
    ];
    def = `${pick(defStarts, seed, 1)} ${pick(defEnds, seed, 2)}`;

    const prompt = generateAcademicPrompt(w, domain, seed);
    sentence = `We used "${w}" in our ${label} practice ${pick(contexts, seed, 3)}, ${pick(reactions, seed, 4)} Example: ${prompt}`;
  } else if (category === 'connector') {
    const cType = connectorType(w);
    def = `${pick([
      `The word ${w} works as a ${cType} that links ideas smoothly`,
      `${cap(w)} is a ${cType} that helps readers follow your meaning`,
      `Use ${w} as a ${cType} when you want your sentence to flow`
    ], seed, 1)} ${pick(['without confusion.', 'in a clear, natural way.', 'on the first read.'], seed, 2)}`;
    sentence = `${pick([
      `I added ${w} to my paragraph`,
      `Our teacher highlighted ${w}`,
      `When we used ${w} in the right spot`
    ], seed, 3)} ${pick(contexts, seed, 4)}, ${pick(reactions, seed, 5)}`;
  } else if (category === 'verb') {
    def = `${pick([
      `To ${w} means to take action on purpose`,
      `${cap(w)} means moving from idea to action`,
      `To ${w} means doing the step instead of waiting`
    ], seed, 1)} ${pick(['with focus.', 'in a clear way.', 'when a task matters.'], seed, 2)}`;
    sentence = `${pick([
      `I had to ${w} before the timer ended`,
      `Our group chose to ${w} first`,
      `When I ${w} step by step`
    ], seed, 3)}, ${pick(reactions, seed, 4)}`;
  } else if (category === 'adjective' || category === 'adverb') {
    def = `${pick([
      `${cap(w)} is a describing word that adds detail`,
      `The word ${w} helps show how something looks, feels, or happens`,
      `${cap(w)} makes writing more vivid and precise`
    ], seed, 1)} ${pick(['for young readers.', 'in classroom writing.', 'during revision.'], seed, 2)}`;
    sentence = `${pick([
      `I used ${w} in my sentence`,
      `My partner added ${w} to the draft`,
      `The class chose ${w} for stronger word choice`
    ], seed, 3)} ${pick(contexts, seed, 4)}, ${pick(reactions, seed, 5)}`;
  } else if (category === 'animal') {
    def = `${pick([
      `The word ${w} names an animal students often study`,
      `${cap(w)} is an animal term that fits science and literacy`,
      `Use ${w} to make nature writing specific and memorable`
    ], seed, 1)} ${pick(['in class.', 'for habitat topics.', 'during projects.'], seed, 2)}`;
    sentence = `${pick([
      `Our group picked ${w} for a habitat sentence`,
      `I wrote about ${w} in my journal`,
      `The class used ${w} in science writing`
    ], seed, 3)} ${pick(contexts, seed, 4)}, ${pick(reactions, seed, 5)}`;
  } else if (category === 'food' || category === 'plant' || category === 'place') {
    def = `${pick([
      `The word ${w} gives writing a concrete image`,
      `${cap(w)} is a useful vocabulary word for real-world examples`,
      `Use ${w} to make classroom sentences specific`
    ], seed, 1)} ${pick(['and easy to picture.', 'for K-12 learners.', 'without sounding stiff.'], seed, 2)}`;
    sentence = `${pick([
      `I used ${w} in our class example`,
      `My partner wrote ${w} in a quick sentence`,
      `We added ${w} to the vocabulary challenge`
    ], seed, 3)} ${pick(contexts, seed, 4)}, ${pick(reactions, seed, 5)}`;
  } else {
    def = `${pick([
      `The word ${w} helps make writing clear and specific`,
      `${cap(w)} gives sentences a stronger meaning anchor`,
      `Use ${w} to replace vague wording with clear language`
    ], seed, 1)} ${pick(['for classroom communication.', 'in reading and writing tasks.', 'for student-friendly examples.'], seed, 2)}`;
    sentence = `${pick([
      `I used ${w} in my draft`,
      `My group tested ${w} in a sentence`,
      `We practiced ${w} in vocabulary work`
    ], seed, 3)} ${pick(contexts, seed, 4)}, ${pick(reactions, seed, 5)}`;
  }

  return {
    def: String(def).replace(/\s+/g, ' ').trim(),
    sentence: String(sentence).replace(/\s+/g, ' ').trim(),
    category
  };
}

function validateCopy(word, copy) {
  const issues = [];
  const w = String(word || '').toLowerCase();
  const def = String(copy?.def || '');
  const sentence = String(copy?.sentence || '');

  if (!def || !sentence) issues.push('missing def or sentence');
  if (def.length < 35 || def.length > 220) issues.push('definition length out of range');
  if (sentence.length < 45 || sentence.length > 320) issues.push('sentence length out of range');
  if (!def.toLowerCase().includes(w)) issues.push('definition missing word token');
  if (!sentence.toLowerCase().includes(w) && !sentence.includes(`"${w}"`)) issues.push('sentence missing word token');
  for (const pattern of BAD_TEMPLATE_PATTERNS) {
    if (pattern.test(def) || pattern.test(sentence)) {
      issues.push(`blocked template pattern: ${pattern}`);
    }
  }

  return { ok: issues.length === 0, issues };
}

function generateCopyWithGate(word, entry, profile, maxAttempts = 16) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = generateCopy(word, entry, profile, attempt);
    const validation = validateCopy(word, candidate);
    if (validation.ok) {
      return {
        ...candidate,
        qualityIssues: []
      };
    }
  }

  const fallback = generateCopy(word, entry, profile, maxAttempts + 1);
  const check = validateCopy(word, fallback);
  return {
    ...fallback,
    qualityIssues: check.issues
  };
}

function auditTemplates(entries, top = DEFAULT_AUDIT_TOP) {
  const defMap = new Map();
  const sentMap = new Map();
  for (const [word, entry] of entries) {
    const def = normalizeTemplate(entry?.en?.def || '', word);
    const sentence = normalizeTemplate(entry?.en?.sentence || '', word);
    if (def) defMap.set(def, (defMap.get(def) || 0) + 1);
    if (sentence) sentMap.set(sentence, (sentMap.get(sentence) || 0) + 1);
  }

  const topDefs = [...defMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);
  const topSents = [...sentMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);
  return { topDefs, topSents, defMap, sentMap };
}

function parseCandidateInput(inputPath) {
  const content = fs.readFileSync(inputPath, 'utf8');
  const trimmed = content.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v || '').trim()).filter(Boolean);
    }
    if (parsed && Array.isArray(parsed.words)) {
      return parsed.words.map((v) => String(v || '').trim()).filter(Boolean);
    }
  }

  return trimmed
    .split(/\r?\n|,/)
    .map((v) => String(v || '').trim())
    .filter(Boolean);
}

function parseDomainList(rawDomains = '') {
  if (!rawDomains || !String(rawDomains).trim()) return [...ACADEMIC_DOMAINS];
  const requested = String(rawDomains)
    .split(',')
    .map((value) => String(value || '').trim().toLowerCase())
    .filter(Boolean);
  const unique = [...new Set(requested)];
  const invalid = unique.filter((domain) => !ACADEMIC_DOMAINS.includes(domain));
  if (invalid.length) {
    throw new Error(`Invalid domain(s): ${invalid.join(', ')}. Allowed: ${ACADEMIC_DOMAINS.join(', ')}`);
  }
  return unique.length ? unique : [...ACADEMIC_DOMAINS];
}

function buildAcademicExport(wordsData, profile, domains) {
  const domainSet = new Set(domains);
  const terms = [];
  for (const [word, entry] of Object.entries(wordsData)) {
    const category = classifyWord(word, entry);
    if (!domainSet.has(category)) continue;

    const seed = hashString(word);
    const academicPrompt = generateAcademicPrompt(word, category, seed);
    const translations = {};
    for (const lang of SUPPORTED_LANGS) {
      const langBlock = entry?.[lang] || {};
      if (lang === 'en') continue;
      translations[lang] = {
        def: String(langBlock.def || '').trim(),
        sentence: String(langBlock.sentence || '').trim()
      };
    }

    terms.push({
      word,
      pos: entry?.pos || '',
      category,
      profile,
      en: {
        def: String(entry?.en?.def || '').trim(),
        sentence: String(entry?.en?.sentence || '').trim(),
        academicPrompt
      },
      translations
    });
  }

  terms.sort((a, b) => a.word.localeCompare(b.word));
  const byDomain = {};
  for (const domain of domains) byDomain[domain] = 0;
  for (const term of terms) byDomain[term.category] = (byDomain[term.category] || 0) + 1;

  return {
    generatedAt: new Date().toISOString(),
    profile,
    domains,
    termCount: terms.length,
    byDomain,
    languages: SUPPORTED_LANGS,
    terms
  };
}

function printUsage() {
  console.log(`
Wordbank Studio (school-safe + kid-friendly copy pipeline)

Usage:
  node scripts/wordbank-studio.js <command> [options]

Commands:
  audit        Analyze repetition/template drift in words.js
  draft        Generate quality-gated EN definition/sentence drafts for a range
  apply        Apply a previously generated draft JSON into words.js
  filter       Filter candidate word lists for likely K-12 school-safe vocabulary
  export-academic  Export domain glossary pack (math/science/humanities/wida) with prompts + translations
  export-math      Compatibility alias for export-academic --domains=math

Global options:
  --words=words.js               path to words file (default: words.js)

Audit options:
  --start=1 --end=1000          inclusive entry index range (1-based)
  --top=20                      number of top templates to print
  --repeat-threshold=5          highlight templates repeated at least this many times

Draft options:
  --start=501 --end=1000        rewrite range (default full file)
  --profile=fun-k12             writing profile key
  --out=scripts/output/draft.json
  --preview=25                  print first N generated records to stdout

Apply options:
  --input=scripts/output/draft.json
  --out=words.js                output words file (default: overwrite --words path)

Filter options:
  --input=path/to/candidates.txt|json
  --out=scripts/output/filtered.json

Export-academic options:
  --out=scripts/output/academic-glossary.json
  --domains=math,science,humanities,wida
  --profile=fun-k12

Examples:
  node scripts/wordbank-studio.js audit --words=words.js --start=501 --end=1000
  node scripts/wordbank-studio.js draft --words=words.js --start=501 --end=1000 --out=/tmp/second500-draft.json --preview=20
  node scripts/wordbank-studio.js apply --words=words.js --input=/tmp/second500-draft.json
  node scripts/wordbank-studio.js filter --input=/tmp/candidates.txt --out=/tmp/filtered.json
  node scripts/wordbank-studio.js export-academic --words=words.js --domains=math,science,humanities,wida --out=/tmp/academic-glossary.json
  node scripts/wordbank-studio.js export-math --words=words.js --out=/tmp/math-k5-glossary.json
`);
}

function runAudit(args) {
  const wordsPath = path.resolve(process.cwd(), args.words || DEFAULT_WORDS_PATH);
  const { data } = loadWordsData(wordsPath);
  const allEntries = Object.entries(data);
  const { start, end } = rangeFromArgs(args, allEntries.length);
  const top = Math.max(1, parseNumber(args.top, DEFAULT_AUDIT_TOP));
  const threshold = Math.max(2, parseNumber(args['repeat-threshold'], DEFAULT_AUDIT_REPEAT_THRESHOLD));

  const slice = allEntries.slice(start - 1, end);
  const report = auditTemplates(slice, top);

  const defRepeated = [...report.defMap.values()].filter((count) => count >= threshold).reduce((sum, count) => sum + count, 0);
  const sentRepeated = [...report.sentMap.values()].filter((count) => count >= threshold).reduce((sum, count) => sum + count, 0);

  console.log(`[audit] file=${wordsPath}`);
  console.log(`[audit] range=${start}-${end} entries=${slice.length}`);
  console.log(`[audit] repeated(def>=${threshold})=${defRepeated}`);
  console.log(`[audit] repeated(sentence>=${threshold})=${sentRepeated}`);

  console.log('\n[audit] top definition templates');
  for (const [template, count] of report.topDefs) {
    if (count < 2) continue;
    console.log(`${count}\t${template}`);
  }

  console.log('\n[audit] top sentence templates');
  for (const [template, count] of report.topSents) {
    if (count < 2) continue;
    console.log(`${count}\t${template}`);
  }
}

function runDraft(args) {
  const wordsPath = path.resolve(process.cwd(), args.words || DEFAULT_WORDS_PATH);
  const outPath = args.out ? path.resolve(process.cwd(), args.out) : '';
  if (!outPath) {
    throw new Error('draft requires --out=<path>');
  }

  const { data } = loadWordsData(wordsPath);
  const allEntries = Object.entries(data);
  const { start, end } = rangeFromArgs(args, allEntries.length);
  const profile = String(args.profile || DEFAULT_PROFILE).trim() || DEFAULT_PROFILE;
  const preview = Math.max(0, parseNumber(args.preview, 0));

  const updates = {};
  const qualityWarnings = [];

  for (let i = start - 1; i <= end - 1; i += 1) {
    const [word, entry] = allEntries[i];
    const schoolCheck = isLikelySchoolWord(word);
    if (!schoolCheck.ok) {
      qualityWarnings.push({ word, index: i + 1, reason: `school-safe filter: ${schoolCheck.reason}` });
    }

    const generated = generateCopyWithGate(word, entry, profile);
    updates[word] = {
      index: i + 1,
      category: generated.category,
      qualityIssues: generated.qualityIssues,
      en: {
        def: generated.def,
        sentence: generated.sentence
      }
    };

    if (ACADEMIC_DOMAINS.includes(generated.category)) {
      updates[word].en.academicPrompt = generateAcademicPrompt(
        word,
        generated.category,
        hashString(`${word}|${generated.category}|${profile}`)
      );
    }

    if (generated.qualityIssues.length) {
      qualityWarnings.push({
        word,
        index: i + 1,
        reason: `quality gate warnings: ${generated.qualityIssues.join('; ')}`
      });
    }
  }

  const draft = {
    generatedAt: new Date().toISOString(),
    wordsPath,
    profile,
    range: { start, end },
    count: Object.keys(updates).length,
    qualityWarnings,
    updates
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(draft, null, 2));

  console.log(`[draft] wrote ${Object.keys(updates).length} updates -> ${outPath}`);
  console.log(`[draft] warnings=${qualityWarnings.length}`);

  if (preview > 0) {
    const items = Object.entries(updates).slice(0, preview);
    console.log('\n[draft] preview');
    for (const [word, item] of items) {
      console.log(`\n${word} (#${item.index}, ${item.category})`);
      console.log(`def: ${item.en.def}`);
      console.log(`sentence: ${item.en.sentence}`);
      if (item.en.academicPrompt) {
        console.log(`academicPrompt: ${item.en.academicPrompt}`);
      }
      if (item.qualityIssues.length) {
        console.log(`qualityIssues: ${item.qualityIssues.join(' | ')}`);
      }
    }
  }
}

function runApply(args) {
  const wordsPath = path.resolve(process.cwd(), args.words || DEFAULT_WORDS_PATH);
  const inputPath = args.input ? path.resolve(process.cwd(), args.input) : '';
  if (!inputPath || !fs.existsSync(inputPath)) {
    throw new Error('apply requires --input=<existing draft json path>');
  }

  const outPath = args.out ? path.resolve(process.cwd(), args.out) : wordsPath;
  const { data, suffix } = loadWordsData(wordsPath);
  const draft = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const updates = draft?.updates;
  if (!updates || typeof updates !== 'object') {
    throw new Error('Invalid draft file: missing updates object');
  }

  let changed = 0;
  const missingWords = [];

  for (const [word, patch] of Object.entries(updates)) {
    if (!Object.prototype.hasOwnProperty.call(data, word)) {
      missingWords.push(word);
      continue;
    }
    if (!patch?.en?.def || !patch?.en?.sentence) continue;

    data[word].en = data[word].en || {};
    const beforeDef = data[word].en.def || '';
    const beforeSentence = data[word].en.sentence || '';

    data[word].en.def = String(patch.en.def).trim();
    data[word].en.sentence = String(patch.en.sentence).trim();

    if (beforeDef !== data[word].en.def || beforeSentence !== data[word].en.sentence) {
      changed += 1;
    }
  }

  saveWordsData(outPath, data, suffix);

  console.log(`[apply] changed=${changed}`);
  console.log(`[apply] output=${outPath}`);
  if (missingWords.length) {
    console.log(`[apply] missing words not found in data: ${missingWords.length}`);
  }
}

function runFilter(args) {
  const inputPath = args.input ? path.resolve(process.cwd(), args.input) : '';
  if (!inputPath || !fs.existsSync(inputPath)) {
    throw new Error('filter requires --input=<candidate words file>');
  }
  const outPath = args.out ? path.resolve(process.cwd(), args.out) : '';
  if (!outPath) {
    throw new Error('filter requires --out=<output json>');
  }

  const candidates = parseCandidateInput(inputPath);
  const accepted = [];
  const rejected = [];

  for (const candidateRaw of candidates) {
    const candidate = String(candidateRaw || '').trim().toLowerCase();
    if (!candidate) continue;
    const check = isLikelySchoolWord(candidate);
    if (!check.ok) {
      rejected.push({ word: candidate, reason: check.reason });
      continue;
    }

    accepted.push({
      word: candidate,
      category: classifyWord(candidate, {})
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    input: inputPath,
    total: candidates.length,
    accepted: accepted.length,
    rejected: rejected.length,
    acceptedWords: accepted,
    rejectedWords: rejected
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`[filter] input=${inputPath}`);
  console.log(`[filter] accepted=${accepted.length} rejected=${rejected.length}`);
  console.log(`[filter] output=${outPath}`);
}

function runExportAcademic(args, aliasDomain = '') {
  const wordsPath = path.resolve(process.cwd(), args.words || DEFAULT_WORDS_PATH);
  const outPath = args.out ? path.resolve(process.cwd(), args.out) : '';
  if (!outPath) {
    throw new Error('export-academic requires --out=<path>');
  }

  const profile = String(args.profile || DEFAULT_PROFILE).trim() || DEFAULT_PROFILE;
  const domains = aliasDomain ? [aliasDomain] : parseDomainList(args.domains || '');
  const { data } = loadWordsData(wordsPath);
  const exportData = buildAcademicExport(data, profile, domains);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(exportData, null, 2));

  console.log(`[export-academic] domains=${domains.join(',')}`);
  console.log(`[export-academic] terms=${exportData.termCount}`);
  console.log(`[export-academic] byDomain=${JSON.stringify(exportData.byDomain)}`);
  console.log(`[export-academic] output=${outPath}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = String(args._[0] || '').trim();

  if (!command || command === 'help' || args.help === 'true') {
    printUsage();
    return;
  }

  if (command === 'audit') {
    runAudit(args);
    return;
  }

  if (command === 'draft') {
    runDraft(args);
    return;
  }

  if (command === 'apply') {
    runApply(args);
    return;
  }

  if (command === 'filter') {
    runFilter(args);
    return;
  }

  if (command === 'export-academic') {
    runExportAcademic(args);
    return;
  }

  if (command === 'export-math') {
    runExportAcademic(args, 'math');
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  const message = error && error.message ? error.message : String(error);
  console.error(`[wordbank-studio] ${message}`);
  process.exit(1);
}
