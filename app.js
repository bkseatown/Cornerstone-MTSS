/* =========================================
// Compatibility: map WORDS_DATA to WORD_ENTRIES
if (typeof WORDS_DATA !== "undefined") window.WORD_ENTRIES = WORDS_DATA;
   DECODE THE WORD - GOLD MASTER (IOS SAFE + FIXED STUDIO FLOW)
   ========================================= */

const MAX_GUESSES = 6;
let CURRENT_WORD_LENGTH = 5;
let currentWord = "";
let currentEntry = null;
let guesses = [];
let currentGuess = "";
let gameOver = false;
let isFirstLoad = true;
let isUpperCase = false;
let cachedVoices = [];
let lengthAutoSet = false;
let patternLengthCache = null;
let voicesReadyPromise = null;
let speechStartTimeout = null;
let modalDismissBound = false;
let assessmentState = null;
let enhancedVoicePrefetched = false;
let warmupPrefetchDone = false;
let fitScreenActive = false;
let practiceRecorder = {
    stream: null,
    mediaRecorder: null,
    activeKey: null,
    chunks: []
};
const practiceRecordings = new Map();
const phonemeAudioCache = new Map();

// DOM Elements - will be initialized after DOM loads
let board, keyboard, modalOverlay, welcomeModal, teacherModal, studioModal, gameModal;

// App settings (accessibility + teacher tools)
const SETTINGS_KEY = 'decode_settings';
const DEFAULT_SETTINGS = {
    calmMode: false,
    largeText: false,
    showIPA: true,
    showExamples: true,
    showMouthCues: true,
    speechRate: 0.85,
    voiceDialect: 'en-US',
    autoHear: true,
    funHud: {
        enabled: true,
        coins: 0,
        hearts: 3,
        maxHearts: 3,
        challenge: false,
        sfx: false,
        style: 'playful'
    },
    gameMode: {
        teamMode: false,
        timerEnabled: false,
        timerSeconds: 60,
        activeTeam: 'A',
        teamAName: 'Team A',
        teamBName: 'Team B',
        teamACoins: 0,
        teamBCoins: 0
    },
    classroom: {
        dockOpen: false,
        timerMinutes: 10
    },
    translation: {
        pinned: false,
        lang: 'en'
    },
    bonus: {
        frequency: 'always'
    },
    soundWallSections: {
        'vowel-valley': true,
        'long-vowels': true,
        'r-controlled': true,
        'diphthongs': true,
        'welded': true,
        'schwa': true,
        'consonant-grid': true,
        'blends': true
    }
};

const WTW_INVENTORIES = {
    psi: {
        label: 'Primary Spelling Inventory (PSI)',
        words: [
            { word: 'fan', pattern: 'Short A' },
            { word: 'pet', pattern: 'Short E' },
            { word: 'dig', pattern: 'Short I' },
            { word: 'rob', pattern: 'Short O' },
            { word: 'hop', pattern: 'Short O' },
            { word: 'man', pattern: 'Short A' },
            { word: 'pen', pattern: 'Short E' },
            { word: 'rig', pattern: 'Short I' },
            { word: 'top', pattern: 'Short O' },
            { word: 'sun', pattern: 'Short U' },
            { word: 'plate', pattern: 'Long A (CVCe)' },
            { word: 'spin', pattern: 'Initial Blend (sp)' },
            { word: 'train', pattern: 'Vowel Team (ai)' },
            { word: 'deer', pattern: 'Vowel Team (ee)' },
            { word: 'sheep', pattern: 'Vowel Team (ee)' },
            { word: 'float', pattern: 'Vowel Team (oa)' },
            { word: 'drive', pattern: 'Long I (CVCe)' },
            { word: 'bright', pattern: 'Vowel Team (igh)' },
            { word: 'swing', pattern: 'Blend + NG' },
            { word: 'train', pattern: 'Vowel Team (ai)' },
            { word: 'stick', pattern: 'Blend (st)' },
            { word: 'dream', pattern: 'Vowel Team (ea)' },
            { word: 'block', pattern: 'Blend (bl) + CK' },
            { word: 'flash', pattern: 'Blend (fl) + SH' },
            { word: 'snake', pattern: 'Long A (CVCe)' },
            { word: 'clock', pattern: 'Blend (cl) + CK' }
        ]
    },
    esi: {
        label: 'Elementary Spelling Inventory (ESI)',
        words: [
            { word: 'bed', pattern: 'Short E' },
            { word: 'ship', pattern: 'Digraph SH' },
            { word: 'drive', pattern: 'Long I (CVCe)' },
            { word: 'bright', pattern: 'Vowel Team (igh)' },
            { word: 'chain', pattern: 'Vowel Team (ai)' },
            { word: 'float', pattern: 'Vowel Team (oa)' },
            { word: 'train', pattern: 'Vowel Team (ai)' },
            { word: 'snake', pattern: 'Long A (CVCe)' },
            { word: 'stick', pattern: 'Blend (st)' },
            { word: 'block', pattern: 'Blend (bl) + CK' },
            { word: 'ship', pattern: 'Digraph SH' },
            { word: 'train', pattern: 'Vowel Team (ai)' },
            { word: 'drive', pattern: 'Long I (CVCe)' },
            { word: 'bright', pattern: 'Vowel Team (igh)' },
            { word: 'chain', pattern: 'Vowel Team (ai)' },
            { word: 'float', pattern: 'Vowel Team (oa)' },
            { word: 'stick', pattern: 'Blend (st)' },
            { word: 'block', pattern: 'Blend (bl) + CK' },
            { word: 'cake', pattern: 'Long A (CVCe)' },
            { word: 'dream', pattern: 'Vowel Team (ea)' },
            { word: 'sheet', pattern: 'Vowel Team (ee)' },
            { word: 'snake', pattern: 'Long A (CVCe)' },
            { word: 'flash', pattern: 'Blend (fl) + SH' },
            { word: 'clock', pattern: 'Blend (cl) + CK' },
            { word: 'slide', pattern: 'Long I (CVCe)' }
        ]
    },
    usi: {
        label: 'Upper-Level Spelling Inventory (USI)',
        words: [
            { word: 'switch', pattern: 'Digraph (tch)' },
            { word: 'smudge', pattern: 'DGE' },
            { word: 'trapped', pattern: 'Double Consonant + -ed' },
            { word: 'scrape', pattern: 'Silent E + Blend' },
            { word: 'knotted', pattern: 'Silent K + Double Consonant' },
            { word: 'shaving', pattern: 'Long A + -ing' },
            { word: 'squirt', pattern: 'SQU + R-controlled' },
            { word: 'pounce', pattern: 'Diphthong OU' },
            { word: 'scratches', pattern: 'TCH + -es' },
            { word: 'crater', pattern: 'Open Syllable' },
            { word: 'certain', pattern: 'Soft C' },
            { word: 'pleasure', pattern: 'Soft G / ZH' },
            { word: 'fortunate', pattern: 'Derivational (-ate)' },
            { word: 'confindle', pattern: 'Derivational (prefix)' },
            { word: 'appreciate', pattern: 'Derivational (-ate)' },
            { word: 'spoilage', pattern: 'Derivational (-age)' },
            { word: 'oppose', pattern: 'Prefix + Silent E' },
            { word: 'manage', pattern: 'Soft G' },
            { word: 'village', pattern: 'Soft G + -age' },
            { word: 'concede', pattern: 'Soft C + Silent E' },
            { word: 'commercial', pattern: 'Derivational (-cial)' },
            { word: 'independent', pattern: 'Derivational (-ent)' },
            { word: 'opposition', pattern: 'Derivational (-tion)' },
            { word: 'confident', pattern: 'Derivational (-ent)' },
            { word: 'definition', pattern: 'Derivational (-tion)' },
            { word: 'deviation', pattern: 'Derivational (-tion)' },
            { word: 'heredity', pattern: 'Derivational (-ity)' },
            { word: 'permanent', pattern: 'Derivational (-ent)' },
            { word: 'commercial', pattern: 'Derivational (-cial)' },
            { word: 'dependent', pattern: 'Derivational (-ent)' },
            { word: 'irrelevant', pattern: 'Derivational (prefix)' }
        ]
    }
};

const WTW_PRACTICE_SETS = {
    psi: [
        { word: 'cap', pattern: 'Short A' },
        { word: 'pen', pattern: 'Short E' },
        { word: 'sit', pattern: 'Short I' },
        { word: 'mom', pattern: 'Short O' },
        { word: 'bug', pattern: 'Short U' },
        { word: 'flag', pattern: 'Blend (fl)' },
        { word: 'clap', pattern: 'Blend (cl)' },
        { word: 'ship', pattern: 'Digraph SH' },
        { word: 'shop', pattern: 'Digraph SH' },
        { word: 'rain', pattern: 'Vowel Team (ai)' },
        { word: 'seed', pattern: 'Vowel Team (ee)' },
        { word: 'boat', pattern: 'Vowel Team (oa)' },
        { word: 'snake', pattern: 'Long A (CVCe)' },
        { word: 'drive', pattern: 'Long I (CVCe)' },
        { word: 'clock', pattern: 'Blend (cl) + CK' }
    ],
    esi: [
        { word: 'chip', pattern: 'Digraph CH' },
        { word: 'shine', pattern: 'Long I (CVCe)' },
        { word: 'float', pattern: 'Vowel Team (oa)' },
        { word: 'train', pattern: 'Vowel Team (ai)' },
        { word: 'green', pattern: 'Vowel Team (ee)' },
        { word: 'flash', pattern: 'Blend (fl) + SH' },
        { word: 'block', pattern: 'Blend (bl) + CK' },
        { word: 'snake', pattern: 'Long A (CVCe)' },
        { word: 'slide', pattern: 'Long I (CVCe)' },
        { word: 'paint', pattern: 'Vowel Team (ai)' },
        { word: 'dream', pattern: 'Vowel Team (ea)' },
        { word: 'clock', pattern: 'Blend (cl) + CK' }
    ],
    usi: [
        { word: 'bridge', pattern: 'DGE' },
        { word: 'scrape', pattern: 'Silent E + Blend' },
        { word: 'squash', pattern: 'SQU' },
        { word: 'fortunate', pattern: 'Derivational (-ate)' },
        { word: 'addition', pattern: 'Derivational (-tion)' },
        { word: 'dependent', pattern: 'Derivational (-ent)' },
        { word: 'conclude', pattern: 'Prefix + Silent E' },
        { word: 'motion', pattern: 'Derivational (-tion)' },
        { word: 'scratched', pattern: 'TCH + -ed' },
        { word: 'pleasure', pattern: 'Soft G / ZH' },
        { word: 'permanent', pattern: 'Derivational (-ent)' },
        { word: 'relevant', pattern: 'Derivational (prefix)' }
    ]
};

const CORE_PHONICS_LEVELS = [
    {
        id: 'cvc',
        label: 'CVC Short Vowels',
        words: ['cat', 'bed', 'sit', 'hot', 'cup', 'map', 'sun', 'red', 'pin', 'dog']
    },
    {
        id: 'digraphs',
        label: 'Digraphs (sh, ch, th, wh, ph)',
        words: ['ship', 'chip', 'thin', 'whip', 'phone', 'shop', 'math', 'shed', 'chop', 'when']
    },
    {
        id: 'blends',
        label: 'Blends (st, bl, tr, fl)',
        words: ['stop', 'flag', 'trap', 'plan', 'slug', 'frog', 'blink', 'strip', 'crab', 'glad']
    },
    {
        id: 'long-vowels',
        label: 'Long Vowels (CVCe)',
        words: ['cake', 'slide', 'ride', 'bone', 'mule', 'shape', 'these', 'home', 'cute', 'late']
    },
    {
        id: 'vowel-teams',
        label: 'Vowel Teams (ai, ee, oa, ea)',
        words: ['rain', 'train', 'seed', 'sheep', 'boat', 'float', 'team', 'dream', 'coat', 'seal']
    },
    {
        id: 'r-controlled',
        label: 'R-Controlled Vowels',
        words: ['car', 'her', 'bird', 'fork', 'turn', 'storm', 'first', 'cart', 'hurt', 'barn']
    }
];

const WTW_STAGES = [
    {
        id: 'letter-name',
        label: 'Letter-Name Alphabetic',
        words: [
            { word: 'cat', pattern: 'Short A' },
            { word: 'pin', pattern: 'Short I' },
            { word: 'bed', pattern: 'Short E' },
            { word: 'hot', pattern: 'Short O' },
            { word: 'cup', pattern: 'Short U' },
            { word: 'map', pattern: 'CVC' },
            { word: 'sun', pattern: 'CVC' },
            { word: 'fish', pattern: 'Digraph SH' },
            { word: 'chip', pattern: 'Digraph CH' },
            { word: 'thin', pattern: 'Digraph TH' }
        ]
    },
    {
        id: 'within-word',
        label: 'Within Word Pattern',
        words: [
            { word: 'rain', pattern: 'Vowel Team AI' },
            { word: 'boat', pattern: 'Vowel Team OA' },
            { word: 'seed', pattern: 'Vowel Team EE' },
            { word: 'night', pattern: 'Long I' },
            { word: 'snow', pattern: 'Long O' },
            { word: 'coin', pattern: 'Diphthong OI' },
            { word: 'out', pattern: 'Diphthong OU' },
            { word: 'bird', pattern: 'R-Controlled IR' },
            { word: 'fork', pattern: 'R-Controlled OR' },
            { word: 'turn', pattern: 'R-Controlled UR' }
        ]
    },
    {
        id: 'syllable-juncture',
        label: 'Syllable Juncture',
        words: [
            { word: 'rabbit', pattern: 'Closed + Closed' },
            { word: 'picnic', pattern: 'Closed + Closed' },
            { word: 'paper', pattern: 'Open + Closed' },
            { word: 'sunset', pattern: 'Compound' },
            { word: 'campfire', pattern: 'Compound' },
            { word: 'robot', pattern: 'Open + Closed' },
            { word: 'sticky', pattern: 'Vowel + Y' },
            { word: 'napkin', pattern: 'Closed + Closed' }
        ]
    },
    {
        id: 'derivational',
        label: 'Derivational Relations',
        words: [
            { word: 'music', pattern: 'Base + ic' },
            { word: 'musician', pattern: 'Base + ian' },
            { word: 'danger', pattern: 'Base + er' },
            { word: 'dangerous', pattern: 'Base + ous' },
            { word: 'celebrate', pattern: 'Base' },
            { word: 'celebration', pattern: 'Base + tion' }
        ]
    }
];

let appSettings = { ...DEFAULT_SETTINGS };

// --- AUDIO DATABASE SETUP (IndexedDB) ---
const DB_NAME = "PhonicsAudioDB";
const STORE_NAME = "audio_files";
let db;
let dbReadyResolve;
const dbReady = new Promise((resolve) => {
    dbReadyResolve = resolve;
});

function initDB() {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        if (dbReadyResolve) dbReadyResolve(db);
    };
    request.onerror = (event) => {
        console.error("DB Error", event);
        if (dbReadyResolve) dbReadyResolve(null);
    };
}

function saveAudioToDB(key, blob) {
    if (!db) return;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, key);
}

function getAudioFromDB(key) {
    return new Promise((resolve) => {
        if (!db) return resolve(null);
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });
}

async function ensureDBReady() {
    if (db) return db;
    return dbReady;
}

async function deleteAudioFromDB(key) {
    const database = await ensureDBReady();
    if (!database) return false;
    return new Promise((resolve) => {
        const tx = database.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
    });
}

async function listAudioKeys() {
    const database = await ensureDBReady();
    if (!database) return [];
    return new Promise((resolve) => {
        const keys = [];
        const tx = database.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.openCursor();
        req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
                keys.push(cursor.key);
                cursor.continue();
            } else {
                resolve(keys);
            }
        };
        req.onerror = () => resolve(keys);
    });
}

async function deleteAudioByFilter(predicate) {
    const keys = await listAudioKeys();
    const targets = keys.filter(predicate);
    await Promise.all(targets.map(key => deleteAudioFromDB(key)));
    return targets.length;
}

async function countRecordingsByType() {
    const keys = await listAudioKeys();
    const counts = { total: keys.length, word: 0, sentence: 0, phoneme: 0 };
    keys.forEach(key => {
        if (key.endsWith('_word')) counts.word += 1;
        else if (key.endsWith('_sentence')) counts.sentence += 1;
        else if (key.startsWith('phoneme_')) counts.phoneme += 1;
    });
    return counts;
}

function getPhonemeRecordingKey(sound = '') {
    return `phoneme_${sound.toString().toLowerCase()}`;
}

function clearPhonemeCache(sound = '') {
    if (!sound) return;
    const key = getPhonemeRecordingKey(sound);
    const cached = phonemeAudioCache.get(key);
    if (cached?.url) URL.revokeObjectURL(cached.url);
    phonemeAudioCache.delete(key);
}

function clearAllPhonemeCache() {
    phonemeAudioCache.forEach(entry => {
        if (entry?.url) URL.revokeObjectURL(entry.url);
    });
    phonemeAudioCache.clear();
}

async function prefetchPhonemeClips(sounds = []) {
    const unique = Array.from(new Set((sounds || [])
        .map(sound => (sound || '').toString().toLowerCase())
        .filter(Boolean)));
    if (!unique.length) return;
    await ensureDBReady();
    await Promise.all(unique.map(async (sound) => {
        const key = getPhonemeRecordingKey(sound);
        if (phonemeAudioCache.has(key)) return;
        const blob = await getAudioFromDB(key);
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        phonemeAudioCache.set(key, { blob, url, createdAt: Date.now() });
    }));
}

async function tryPlayRecordedPhoneme(sound = '') {
    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    if (!useTeacherVoice) return false;
    const key = getPhonemeRecordingKey(sound);
    let cached = phonemeAudioCache.get(key);
    if (!cached) {
        await ensureDBReady();
        const blob = await getAudioFromDB(key);
        if (!blob) return false;
        cached = { blob, url: URL.createObjectURL(blob), createdAt: Date.now() };
        phonemeAudioCache.set(key, cached);
    }
    if (!cached?.url) return false;
    const audio = new Audio(cached.url);
    audio.play();
    return true;
}

function prefetchWarmupPhonemes() {
    if (warmupPrefetchDone) return;
    const sounds = Array.from(document.querySelectorAll('.warmup-tile[data-sound]'))
        .map(tile => tile.dataset.sound)
        .filter(Boolean);
    if (!sounds.length) return;
    warmupPrefetchDone = true;
    prefetchPhonemeClips(sounds);
}

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        appSettings = {
            ...DEFAULT_SETTINGS,
            ...parsed,
            funHud: {
                ...DEFAULT_SETTINGS.funHud,
                ...(parsed.funHud || {})
            },
            translation: {
                ...DEFAULT_SETTINGS.translation,
                ...(parsed.translation || {})
            },
            bonus: {
                ...DEFAULT_SETTINGS.bonus,
                ...(parsed.bonus || {})
            },
            gameMode: {
                ...DEFAULT_SETTINGS.gameMode,
                ...(parsed.gameMode || {})
            },
            classroom: {
                ...DEFAULT_SETTINGS.classroom,
                ...(parsed.classroom || {})
            },
            soundWallSections: {
                ...DEFAULT_SETTINGS.soundWallSections,
                ...(parsed.soundWallSections || {})
            }
        };

        const migrated = localStorage.getItem('bonus_frequency_migrated');
        if (!migrated && (!parsed.bonus || ['sometimes', 'often'].includes(parsed.bonus.frequency))) {
            appSettings.bonus.frequency = DEFAULT_SETTINGS.bonus.frequency;
            localStorage.setItem('bonus_frequency_migrated', 'true');
        }

    } catch (e) {
        console.warn('Could not parse settings, using defaults.', e);
    }
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
}

function getSpeechRate(type = 'word') {
    const base = appSettings.speechRate || DEFAULT_SETTINGS.speechRate;
    if (type === 'phoneme') return Math.max(0.6, base - 0.15);
    if (type === 'sentence') return Math.min(1.0, base + 0.05);
    return base;
}

function applySettings() {
    document.body.classList.toggle('calm-mode', appSettings.calmMode);
    document.body.classList.toggle('large-text', appSettings.largeText);
    document.body.classList.toggle('hide-ipa', !appSettings.showIPA);
    document.body.classList.toggle('hide-examples', !appSettings.showExamples);
    document.body.classList.toggle('hide-mouth-cues', !appSettings.showMouthCues);
    document.body.classList.add('force-light');
    document.documentElement.style.colorScheme = 'light';
    updateFunHudVisibility();

    const calmToggle = document.getElementById('toggle-calm-mode');
    if (calmToggle) calmToggle.checked = appSettings.calmMode;
    const largeTextToggle = document.getElementById('toggle-large-text');
    if (largeTextToggle) largeTextToggle.checked = appSettings.largeText;
    const ipaToggle = document.getElementById('toggle-show-ipa');
    if (ipaToggle) ipaToggle.checked = appSettings.showIPA;
    const examplesToggle = document.getElementById('toggle-show-examples');
    if (examplesToggle) examplesToggle.checked = appSettings.showExamples;
    const cuesToggle = document.getElementById('toggle-mouth-cues');
    if (cuesToggle) cuesToggle.checked = appSettings.showMouthCues;
    const speechRateInput = document.getElementById('speech-rate');
    if (speechRateInput) {
        speechRateInput.value = appSettings.speechRate;
        const display = document.getElementById('speech-rate-value');
        if (display) display.textContent = `${appSettings.speechRate.toFixed(2)}x`;
    }

    const voiceSelect = document.getElementById('system-voice-select');
    if (voiceSelect) {
        voiceSelect.value = appSettings.voiceDialect || DEFAULT_SETTINGS.voiceDialect;
    }

    const translationSelect = document.getElementById('translation-default-select');
    if (translationSelect) {
        translationSelect.value = appSettings.translation?.lang || 'en';
    }
    const translationLock = document.getElementById('translation-lock-toggle');
    if (translationLock) {
        translationLock.checked = !!appSettings.translation?.pinned;
    }

    const bonusSelect = document.getElementById('bonus-frequency');
    if (bonusSelect) {
        bonusSelect.value = appSettings.bonus?.frequency || 'sometimes';
    }

    const autoHearToggle = document.getElementById('toggle-auto-hear');
    if (autoHearToggle) {
        autoHearToggle.checked = appSettings.autoHear !== false;
    }

    applySoundWallSectionVisibility();
}

function applySoundWallSectionVisibility() {
    const sections = document.querySelectorAll('.soundwall-section');
    sections.forEach(section => {
        const key = section.dataset.section;
        if (!key) return;
        const isVisible = appSettings.soundWallSections[key] !== false;
        section.classList.toggle('hidden', !isVisible);
    });

    const filterInputs = document.querySelectorAll('.soundwall-filters input[type="checkbox"][data-section]');
    filterInputs.forEach(input => {
        const section = input.dataset.section;
        if (!section) return;
        input.checked = appSettings.soundWallSections[section] !== false;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add('force-light');
    document.documentElement.classList.add('force-light');
    loadSettings();

    // Initialize DOM elements
    board = document.getElementById("game-board");
    keyboard = document.getElementById("keyboard");
    modalOverlay = document.getElementById("modal-overlay");
    welcomeModal = document.getElementById("welcome-modal");
    teacherModal = document.getElementById("teacher-modal");
    studioModal = document.getElementById("recording-studio-modal");
    gameModal = document.getElementById("modal");
    if (welcomeModal) {
        welcomeModal.dataset.overlayClose = 'true';
    }
    
    initDB();
    initControls();
    syncLengthOptionsToPattern(true);
    initWarmupButtons();
    initKeyboard();
    initVoiceLoader(); 
    notifyMissingEnglishVoice();
    updateFunHudVisibility();
    initStudio();
    initNewFeatures();
    initTutorial();
    initFocusToggle();
    enableOverlayCloseForAllModals();
    initModalDismissals();
    initHowTo();
    initClozeLink();
    initComprehensionLink();
    initFluencyLink();
    initAdventureMode();
    ensureMoreToolsMenu();
    initClassroomDock();
    organizeHeaderActions();
    if (typeof initAssessmentFlow === 'function') {
        initAssessmentFlow();
    }
    initVoiceSourceControls(); // Voice source toggle
    initTeacherTools();
    initSoundWallFilters();
    applySettings();
    
    // Initialize adaptive actions
    if (typeof initAdaptiveActions === 'function') {
        initAdaptiveActions();
    } else {
        console.log('initAdaptiveActions not available - skipping');
    }
    
    startNewGame();
    checkFirstTimeVisitor();
    positionFunHud();
    updateFitScreenMode();
    scheduleEnhancedVoicePrefetch();
    window.addEventListener('resize', () => {
        positionFunHud();
        updateFitScreenMode();
    });

    if (modalOverlay) {
        const observer = new MutationObserver(() => updateFunHudVisibility());
        observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
    }

    const dockParam = new URLSearchParams(window.location.search).get('dock');
    if (dockParam) {
        document.body.classList.add('dock-only');
        ensureClassroomDock();
        toggleClassroomDock(true);
        setClassroomDockTab(dockParam);
    }
});

function enableOverlayCloseForAllModals() {
    if (modalDismissBound) return;
    const modals = getAllModalElements();
    modals.forEach(modal => {
        modal.dataset.overlayClose = 'true';
    });
    modalDismissBound = true;
}

function ensureFunHud() {
    let hud = document.getElementById('fun-hud');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'fun-hud';
        hud.className = 'fun-hud hidden';
        hud.innerHTML = `
            <div class="fun-hud-item fun-hud-team" id="fun-hud-team"></div>
            <div class="fun-hud-item fun-hud-coins">
                <span class="fun-hud-icon">🪙</span>
                <span class="fun-hud-label">Coins</span>
                <span class="fun-hud-value" id="fun-hud-coins">0</span>
            </div>
            <div class="fun-hud-item fun-hud-hearts">
                <span class="fun-hud-icon">❤️</span>
                <span class="fun-hud-label">Hearts</span>
                <span class="fun-hud-value" id="fun-hud-hearts">3</span>
            </div>
            <div class="fun-hud-item fun-hud-timer">
                <span class="fun-hud-icon">⏱</span>
                <span class="fun-hud-label">Timer</span>
                <span class="fun-hud-value" id="fun-hud-timer">0:00</span>
            </div>
            <div class="fun-hud-item fun-hud-help">
                <button type="button" id="fun-hud-help" class="fun-hud-mini-btn" aria-label="About game modes">?</button>
            </div>
            <div class="fun-hud-item fun-hud-quick">
                <button type="button" id="fun-hud-adventure" class="fun-hud-mini-btn">Adventure</button>
            </div>
        `;
        document.body.appendChild(hud);
    } else if (!document.getElementById('fun-hud-timer')) {
        hud.innerHTML = `
            <div class="fun-hud-item fun-hud-team" id="fun-hud-team"></div>
            <div class="fun-hud-item fun-hud-coins">
                <span class="fun-hud-icon">🪙</span>
                <span class="fun-hud-label">Coins</span>
                <span class="fun-hud-value" id="fun-hud-coins">0</span>
            </div>
            <div class="fun-hud-item fun-hud-hearts">
                <span class="fun-hud-icon">❤️</span>
                <span class="fun-hud-label">Hearts</span>
                <span class="fun-hud-value" id="fun-hud-hearts">3</span>
            </div>
            <div class="fun-hud-item fun-hud-timer">
                <span class="fun-hud-icon">⏱</span>
                <span class="fun-hud-label">Timer</span>
                <span class="fun-hud-value" id="fun-hud-timer">0:00</span>
            </div>
            <div class="fun-hud-item fun-hud-help">
                <button type="button" id="fun-hud-help" class="fun-hud-mini-btn" aria-label="About game modes">?</button>
            </div>
            <div class="fun-hud-item fun-hud-quick">
                <button type="button" id="fun-hud-adventure" class="fun-hud-mini-btn">Adventure</button>
            </div>
        `;
    }
    const helpBtn = hud.querySelector('#fun-hud-help');
    if (helpBtn && !helpBtn.dataset.bound) {
        helpBtn.dataset.bound = 'true';
        helpBtn.title = 'Fun: coins track wins. Challenge: hearts change on misses. Team: alternate turns and score.';
    }
    const adventureBtn = hud.querySelector('#fun-hud-adventure');
    if (adventureBtn && !adventureBtn.dataset.bound) {
        adventureBtn.dataset.bound = 'true';
        adventureBtn.addEventListener('click', openAdventureModal);
    }
    return hud;
}

function renderFunHud() {
    const maxHearts = appSettings.funHud?.maxHearts ?? 3;
    if (!appSettings.funHud?.hearts || appSettings.funHud.hearts < 1) {
        appSettings.funHud.hearts = maxHearts;
    }
    const hearts = document.getElementById('fun-hud-hearts');
    const coins = document.getElementById('fun-hud-coins');
    const timer = document.getElementById('fun-hud-timer');
    const teamLabel = document.getElementById('fun-hud-team');
    const heartsItem = document.querySelector('.fun-hud-hearts');
    const coinsItem = document.querySelector('.fun-hud-coins');
    const timerItem = document.querySelector('.fun-hud-timer');

    const teamMode = !!appSettings.gameMode?.teamMode;
    const timerEnabled = !!appSettings.gameMode?.timerEnabled;
    const gameModeActive = teamMode || timerEnabled || !!appSettings.funHud?.challenge;

    if (teamMode) {
        const aName = appSettings.gameMode?.teamAName || 'Team A';
        const bName = appSettings.gameMode?.teamBName || 'Team B';
        const aCoins = appSettings.gameMode?.teamACoins ?? 0;
        const bCoins = appSettings.gameMode?.teamBCoins ?? 0;
        const aShort = formatTeamShortLabel(aName, 'A');
        const bShort = formatTeamShortLabel(bName, 'B');
        if (coins) coins.textContent = `${aShort} ${aCoins} • ${bShort} ${bCoins}`;
        if (teamLabel) {
            teamLabel.textContent = `Turn: ${formatTeamShortLabel(getActiveTeamLabel(), getActiveTeamKey())}`;
            teamLabel.style.display = 'inline-flex';
        }
    } else {
        if (coins) coins.textContent = String(appSettings.funHud?.coins ?? 0);
        if (teamLabel) {
            teamLabel.textContent = '';
            teamLabel.style.display = 'none';
        }
    }

    if (hearts) hearts.textContent = String(appSettings.funHud?.hearts ?? 3);
    if (heartsItem) heartsItem.style.display = appSettings.funHud?.challenge ? 'inline-flex' : 'none';
    if (coinsItem) coinsItem.style.display = gameModeActive ? 'inline-flex' : 'none';

    if (timerItem) timerItem.style.display = timerEnabled ? 'inline-flex' : 'none';
    if (timer && timerEnabled) timer.textContent = formatTime(lightningRemaining || appSettings.gameMode?.timerSeconds || 0);
}

function formatTeamShortLabel(name = '', fallback = '') {
    if (!name) return fallback;
    const cleaned = name.toString().replace(/team\s*/i, '').trim();
    if (!cleaned) return fallback;
    const parts = cleaned.split(/\s+/);
    const base = parts[0] || cleaned;
    if (base.length <= 4) return base;
    return base.slice(0, 4);
}

function updateFunHudVisibility() {
    const hud = ensureFunHud();
    const enabled = !!appSettings.funHud?.enabled;
    const overlayOpen = modalOverlay && !modalOverlay.classList.contains('hidden');
    const gameModeActive = !!appSettings.gameMode?.teamMode
        || !!appSettings.gameMode?.timerEnabled
        || !!appSettings.funHud?.challenge;
    const shouldShow = enabled && gameModeActive && !funHudSuspended && !overlayOpen;
    hud.classList.toggle('hidden', !shouldShow);
    document.body.classList.toggle('fun-mode', enabled);
    document.body.classList.toggle('fun-studio', enabled && appSettings.funHud?.style === 'studio');
    if (shouldShow) {
        renderFunHud();
        positionFunHud();
    }
}

function positionFunHud() {
    const hud = document.getElementById('fun-hud');
    const header = document.querySelector('header');
    if (!hud || !header) return;
    const rect = header.getBoundingClientRect();
    const actions = header.querySelector('.header-actions');
    const controls = document.querySelector('.controls');
    const warmup = document.querySelector('.warmup-panel');
    const bottoms = [rect.bottom];
    if (actions) bottoms.push(actions.getBoundingClientRect().bottom);
    if (controls) bottoms.push(controls.getBoundingClientRect().bottom);
    if (warmup && warmup.offsetParent) bottoms.push(warmup.getBoundingClientRect().bottom);
    const top = Math.max(12, ...bottoms.map(val => val + 8));
    hud.style.top = `${top}px`;
    hud.style.right = window.innerWidth < 720 ? '8px' : '16px';
}

function updateFitScreenMode() {
    const shouldFit = window.innerHeight < 900;
    if (fitScreenActive === shouldFit) return;
    fitScreenActive = shouldFit;
    document.body.classList.toggle('fit-screen', shouldFit);
    positionFunHud();
}

function applyFunHudOutcome(win) {
    if (!appSettings.funHud?.enabled) return;
    const maxHearts = appSettings.funHud?.maxHearts ?? 3;
    let hearts = appSettings.funHud?.hearts ?? maxHearts;
    if (appSettings.funHud?.challenge) {
        hearts = win ? Math.min(maxHearts, hearts + 1) : Math.max(1, hearts - 1);
    }
    appSettings.funHud.hearts = hearts;
    saveSettings();
    renderFunHud();
}

let funAudioContext = null;
let funHudSuspended = false;

function setFunHudSuspended(shouldSuspend = false) {
    funHudSuspended = shouldSuspend;
    const hud = ensureFunHud();
    hud.classList.toggle('suspended', shouldSuspend);
    updateFunHudVisibility();
}
function playFunChime(type = 'win') {
    if (!appSettings.funHud?.sfx) return;
    try {
        if (!funAudioContext) {
            funAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = funAudioContext;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const base = type === 'win' ? 660 : 520;
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.exponentialRampToValueAtTime(base * 1.25, now + 0.12);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    } catch (e) {
        console.warn('SFX unavailable', e);
    }
}

function getAllModalElements() {
    return Array.from(document.querySelectorAll('.modal, [role="dialog"], [id$="-modal"], [id$="modal"]'));
}

/* --- VOICE LOADING & PICKER --- */
function initVoiceLoader() {
    const voiceSelect = document.getElementById("system-voice-select");

    const load = () => {
        cachedVoices = window.speechSynthesis.getVoices();
        populateVoiceList();
        updateVoiceInstallPrompt();
        updateEnhancedVoicePrompt();
    };

    const populateVoiceList = () => {
        if (!voiceSelect) return;
        voiceSelect.innerHTML = `
            <option value="en-US">American English (Default)</option>
            <option value="en-GB">British English</option>
        `;

        const preferredDialect = appSettings.voiceDialect || DEFAULT_SETTINGS.voiceDialect;
        voiceSelect.value = preferredDialect;
        
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        if (window.speechSynthesis.addEventListener) {
            window.speechSynthesis.addEventListener('voiceschanged', load);
        } else {
            window.speechSynthesis.onvoiceschanged = load;
        }
    }

    if(voiceSelect) {
        voiceSelect.onchange = () => {
            appSettings.voiceDialect = voiceSelect.value || DEFAULT_SETTINGS.voiceDialect;
            saveSettings();
            updateVoiceInstallPrompt();
            updateEnhancedVoicePrompt();
            prefetchEnhancedVoice();
        };
    }
}

function getVoicesAsync(timeout = 800) {
    if (cachedVoices.length) return Promise.resolve(cachedVoices);
    if (voicesReadyPromise) return voicesReadyPromise;

    voicesReadyPromise = new Promise((resolve) => {
        const existing = window.speechSynthesis.getVoices();
        if (existing && existing.length) {
            cachedVoices = existing;
            voicesReadyPromise = null;
            resolve(existing);
            return;
        }

        let resolved = false;
        const finish = () => {
            if (resolved) return;
            resolved = true;
            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length) cachedVoices = voices;
            voicesReadyPromise = null;
            resolve(cachedVoices);
        };

        if (window.speechSynthesis.addEventListener) {
            window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
        } else {
            window.speechSynthesis.onvoiceschanged = finish;
        }

        setTimeout(finish, timeout);
    });

    return voicesReadyPromise;
}

function speakUtterance(utterance) {
    if (!('speechSynthesis' in window)) return;
    if (speechStartTimeout) clearTimeout(speechStartTimeout);
    window.speechSynthesis.cancel();
    speechStartTimeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        speechStartTimeout = null;
    }, 40);
}

async function speak(text, type = "word") {
    if (!text) return;
    window.speechSynthesis.cancel(); 

    // 1. Check Studio Recording
    let dbKey = "";
    if (type === "word") {
        dbKey = `${text.toLowerCase()}_word`;
    } else if (type === "sentence") {
        // Handle both data structures for sentences
        let currentSentence = null;
        if (currentEntry && currentEntry.en && currentEntry.en.sentence) {
            currentSentence = currentEntry.en.sentence;
        } else if (currentEntry && currentEntry.sentence) {
            currentSentence = currentEntry.sentence;
        }
        
        if (currentSentence && text === currentSentence) {
            dbKey = `${currentWord.toLowerCase()}_sentence`;
        } else {
            dbKey = "unknown"; 
        }
    } else {
        dbKey = "unknown";
    }

    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    const blob = useTeacherVoice ? await getAudioFromDB(dbKey) : null;
    
    if (blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
        return; 
    }

    // 2. Fallback to System Voice
    const msg = new SpeechSynthesisUtterance(text);
    const voices = await getVoicesAsync();
    const preferred = pickBestEnglishVoice(voices);
    if (preferred) {
        msg.voice = preferred;
        msg.lang = preferred.lang;
    } else {
        msg.lang = getPreferredEnglishDialect();
    }
    msg.rate = getSpeechRate(type === 'sentence' ? 'sentence' : 'word');
    msg.pitch = 1.0;

    speakUtterance(msg);
}

function getPreferredEnglishDialect() {
    const raw = (appSettings.voiceDialect || DEFAULT_SETTINGS.voiceDialect || 'en-US').toString();
    const normalized = raw.toLowerCase();
    if (['uk', 'en-uk', 'british', 'en-gb'].includes(normalized)) return 'en-GB';
    if (['us', 'en-us', 'american'].includes(normalized)) return 'en-US';
    if (normalized.startsWith('en-')) return raw;
    if (normalized.startsWith('en')) return 'en-US';
    return 'en-US';
}

function pickBestEnglishVoice(voices) {
    if (!voices || !voices.length) return null;
    const dialect = getPreferredEnglishDialect();
    let voice = pickBestVoiceForLang(voices, dialect);
    if (!voice && dialect !== 'en') {
        voice = pickBestVoiceForLang(voices, 'en');
    }
    return voice;
}

const HIGH_QUALITY_VOICE_PATTERNS = [
    /Premium/i,
    /Enhanced/i,
    /Natural/i,
    /Neural/i,
    /Siri/i,
    /Google/i,
    /Microsoft/i,
    /Samantha/i,
    /Ava/i,
    /Alex/i,
    /Daniel/i,
    /Serena/i,
    /Kate/i
];

function isHighQualityVoice(voice) {
    if (!voice || !voice.name) return false;
    return HIGH_QUALITY_VOICE_PATTERNS.some(pattern => pattern.test(voice.name));
}

function pickBestVoiceForLang(voices, targetLang, options = {}) {
    if (!voices || !voices.length || !targetLang) return null;
    const normalized = targetLang.toLowerCase();
    const matches = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(normalized));
    if (!matches.length) return null;

    const highQuality = matches.filter(isHighQualityVoice);
    const pool = options.requireHighQuality ? highQuality : (highQuality.length ? highQuality : matches);
    if (!pool.length) return null;

    const preferredPatterns = HIGH_QUALITY_VOICE_PATTERNS;

    for (const pattern of preferredPatterns) {
        const preferred = pool.find(v => pattern.test(v.name));
        if (preferred) return preferred;
    }

    return pool[0];
}

function getTranslationVoiceTarget(languageCode) {
    const langMappings = {
        'es': 'es',
        'zh': 'zh',
        'vi': 'vi',
        'tl': 'tl',
        'pt': 'pt',
        'hi': 'hi'
    };
    return langMappings[languageCode] || languageCode;
}

async function hasHighQualityVoiceForLanguage(languageCode) {
    const voices = await getVoicesAsync();
    const targetLang = getTranslationVoiceTarget(languageCode);
    return !!pickBestVoiceForLang(voices, targetLang, { requireHighQuality: true });
}

function ensureTranslationAudioNote() {
    const translationDisplay = document.getElementById("translation-display");
    if (!translationDisplay) return null;
    let note = document.getElementById("translation-audio-note");
    if (!note) {
        note = document.createElement("div");
        note.id = "translation-audio-note";
        note.className = "translation-audio-note hidden";
        translationDisplay.appendChild(note);
    }
    return note;
}

function getVoiceInstallHint() {
    return 'Install enhanced voices in System Settings → Accessibility → Spoken Content → System Voice → Manage Voices. Voices can take a moment to load the first time.';
}

async function notifyMissingEnglishVoice() {
    const voices = await getVoicesAsync();
    const dialect = getPreferredEnglishDialect();
    const hasHighQuality = !!pickBestVoiceForLang(voices, dialect, { requireHighQuality: true }) ||
        (dialect !== 'en' && !!pickBestVoiceForLang(voices, 'en', { requireHighQuality: true }));
    if (!hasHighQuality && !localStorage.getItem('hq_english_voice_notice')) {
        showToast('Install enhanced English voices for clearer phoneme audio.');
        localStorage.setItem('hq_english_voice_notice', 'true');
    }
}

function setTranslationAudioNote(message, withTooltip = false) {
    const note = ensureTranslationAudioNote();
    if (!note) return;
    if (message) {
        if (withTooltip) {
            const hint = getVoiceInstallHint();
            note.innerHTML = `${message} <span class="tiny-tooltip" title="${hint}" aria-label="${hint}">ⓘ</span>`;
        } else {
            note.textContent = message;
        }
        note.classList.remove("hidden");
    } else {
        note.textContent = "";
        note.classList.add("hidden");
    }
}

function notifyMissingHighQualityVoice() {
    setTranslationAudioNote('Audio unavailable for this language.', true);
    if (!localStorage.getItem('hq_voice_notice_shown')) {
        showToast('Install enhanced voices for better audio quality.');
        localStorage.setItem('hq_voice_notice_shown', 'true');
    }
}

/* Play text in a specific language for translations */
async function playTextInLanguage(text, languageCode) {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    const msg = new SpeechSynthesisUtterance(text);
    const voices = await getVoicesAsync();
    const targetLang = getTranslationVoiceTarget(languageCode);
    
    // Find best voice for the language
    const preferredVoice = pickBestVoiceForLang(voices, targetLang, { requireHighQuality: true });
    
    if (preferredVoice) {
        msg.voice = preferredVoice;
        msg.lang = preferredVoice.lang;
        setTranslationAudioNote('');
    } else {
        notifyMissingHighQualityVoice();
        return;
    }
    
    msg.rate = Math.max(0.65, getSpeechRate('sentence') - 0.1);
    msg.pitch = 1.0;
    
    speakUtterance(msg);
}

function getTranslationData(word, langCode) {
    if (!word || !langCode || langCode === 'en') return null;
    const lower = word.toLowerCase();
    const source = (typeof WORDS_DATA !== 'undefined') ? WORDS_DATA : null;
    const entry = source && source[lower] ? source[lower][langCode] : null;
    if (entry) {
        return {
            definition: entry.def || '',
            sentence: entry.sentence || ''
        };
    }
    if (window.TRANSLATIONS && typeof window.TRANSLATIONS.getTranslation === 'function') {
        return window.TRANSLATIONS.getTranslation(lower, langCode);
    }
    return null;
}

/* --- CONTROLS & EVENTS --- */
function initControls() {
    document.getElementById("new-word-btn").onclick = () => {
        document.getElementById("new-word-btn").blur(); 
        startNewGame();
    };
    const caseToggle = document.getElementById("case-toggle");
    if (caseToggle) {
        caseToggle.onclick = (e) => {
            e.target.blur();
            toggleCase();
        };
    }
    
    const patternSelect = document.getElementById("pattern-select");
    if (patternSelect) {
        patternSelect.onchange = () => {
            patternSelect.blur();
            syncLengthOptionsToPattern(true);
            startNewGame();
        };
    }
    
    const lengthSelect = document.getElementById("length-select");
    if (lengthSelect) {
        lengthSelect.onchange = (e) => {
            e.target.blur();
            lengthAutoSet = false;
            startNewGame();
        };
    }

    document.getElementById("teacher-btn").onclick = openTeacherMode;
    document.getElementById("set-word-btn").onclick = handleTeacherSubmit;
    document.getElementById("open-studio-btn").onclick = openStudioSetup;
    const toggleMaskBtn = document.getElementById("toggle-mask");
    if (toggleMaskBtn) {
        toggleMaskBtn.onclick = () => {
            const inp = document.getElementById("custom-word-input");
            const isHidden = inp.type === "password";
            inp.type = isHidden ? "text" : "password";
            toggleMaskBtn.textContent = isHidden ? "Hide" : "Show";
            inp.focus();
        };
    }

    // Simple audio buttons
    const hearWordBtn = document.getElementById("simple-hear-word");
    const hearSentenceBtn = document.getElementById("simple-hear-sentence");
    
    if (hearWordBtn) {
        hearWordBtn.onclick = () => {
            if (currentWord) {
                // Add visual feedback
                const originalText = hearWordBtn.innerHTML;
                hearWordBtn.innerHTML = '🔊 Playing...';
                hearWordBtn.style.opacity = '0.7';
                
                speak(currentWord, 'word');
                
                // Reset button after a short delay
                setTimeout(() => {
                    hearWordBtn.innerHTML = originalText;
                    hearWordBtn.style.opacity = '1';
                }, 2000);
            }
            hearWordBtn.blur();
        };
    }
    
    if (hearSentenceBtn) {
        hearSentenceBtn.onclick = () => {
            let sentence = null;
            if (currentEntry && currentEntry.en && currentEntry.en.sentence) {
                sentence = currentEntry.en.sentence;
            } else if (currentEntry && currentEntry.sentence) {
                sentence = currentEntry.sentence;
            }
            
            const sentencePreview = document.getElementById('sentence-preview');
            
            if (sentence) {
                // Show sentence preview
                if (sentencePreview) {
                    sentencePreview.textContent = `"${sentence}"`;
                    sentencePreview.classList.remove('hidden');
                    
                    // Hide preview after 5 seconds
                    setTimeout(() => {
                        sentencePreview.classList.add('hidden');
                    }, 5000);
                }
                
                // Add visual feedback
                const originalText = hearSentenceBtn.innerHTML;
                hearSentenceBtn.innerHTML = '🔊 Playing...';
                hearSentenceBtn.style.opacity = '0.7';
                
                speak(sentence, 'sentence');
                
                // Reset button after a short delay
                setTimeout(() => {
                    hearSentenceBtn.innerHTML = originalText;
                    hearSentenceBtn.style.opacity = '1';
                }, 2000);
            } else {
                // Show feedback if no sentence available
                if (sentencePreview) {
                    sentencePreview.textContent = 'No example sentence available for this word.';
                    sentencePreview.classList.remove('hidden');
                    
                    setTimeout(() => {
                        sentencePreview.classList.add('hidden');
                    }, 3000);
                }
                
                const originalText = hearSentenceBtn.innerHTML;
                hearSentenceBtn.innerHTML = '❌ No sentence';
                hearSentenceBtn.style.opacity = '0.7';
                
                setTimeout(() => {
                    hearSentenceBtn.innerHTML = originalText;
                    hearSentenceBtn.style.opacity = '1';
                }, 1500);
            }
            hearSentenceBtn.blur();
        };
    }
    
    document.getElementById("speak-btn").onclick = () => {
        speak(currentWord, "word");
    };
    document.getElementById("play-again-btn").onclick = () => {
        closeModal();
        startNewGame();
    };

    document.querySelectorAll(".close-btn, .close-teacher, .close-studio, #start-playing-btn").forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    window.addEventListener("keydown", (e) => {
        if (isModalOpen()) {
            if (!studioModal.classList.contains("hidden")) return; 

            if (e.key === "Escape") {
                closeModal();
            } else if (e.key === "Enter" && !teacherModal.classList.contains("hidden")) {
                handleTeacherSubmit();
            }
            return; 
        }

        if (gameOver) return;

        // Add visual feedback to on-screen keyboard
        const key = e.key.toLowerCase();
        
        if (/^[a-z]$/i.test(key)) {
            // Find key by data-key attribute
            const keyElement = document.querySelector(`.key[data-key="${key}"]`);
            if (keyElement) {
                keyElement.classList.add('key-pressed');
                setTimeout(() => keyElement.classList.remove('key-pressed'), 150);
            }
            handleInput(key);
        }
        else if (e.key === "Enter") {
            const enterKey = Array.from(document.querySelectorAll('.key.wide')).find(k => 
                k.textContent === 'ENTER'
            );
            if (enterKey) {
                enterKey.classList.add('key-pressed');
                setTimeout(() => enterKey.classList.remove('key-pressed'), 150);
            }
            submitGuess();
        }
        else if (e.key === "Backspace") {
            const backKey = Array.from(document.querySelectorAll('.key.wide')).find(k => 
                k.textContent.includes('⌫')
            );
            if (backKey) {
                backKey.classList.add('key-pressed');
                setTimeout(() => backKey.classList.remove('key-pressed'), 150);
            }
            deleteLetter();
        }
    });

    const tInput = document.getElementById("custom-word-input");
    tInput.addEventListener("keydown", (e) => {
        e.stopImmediatePropagation(); 
        if (e.key === "Enter") handleTeacherSubmit();
        if (e.key === "Escape") closeModal();
    });
}

function initWarmupButtons() {
    const warmupPanel = document.querySelector('.warmup-panel');
    if (warmupPanel) {
        warmupPanel.classList.add('hidden');
        warmupPanel.setAttribute('aria-hidden', 'true');
    }

    const phonemeBtn = document.getElementById('phoneme-btn');
    if (phonemeBtn) {
        phonemeBtn.onclick = () => openPhonemeGuide();
    }

    const warmupTiles = document.querySelectorAll('.warmup-tile');
    warmupTiles.forEach(tile => {
        tile.onclick = () => {
            const sound = tile.dataset.sound;
            openPhonemeGuide(sound);
        };
    });

    prefetchWarmupPhonemes();
}

function initTeacherTools() {
    compactTeacherLayout();
    ensureVoiceQualityHint();
    updateVoiceInstallPrompt();
    updateEnhancedVoicePrompt();
    ensureAutoHearToggle();
    ensureFunHudControls();
    ensureAssessmentControls();
    ensureClassroomDockControl();
    ensurePracticePackRow();
    ensureTeacherTabs();
    const calmToggle = document.getElementById('toggle-calm-mode');
    if (calmToggle) {
        calmToggle.onchange = () => {
            appSettings.calmMode = calmToggle.checked;
            saveSettings();
            applySettings();
        };
    }

    const largeTextToggle = document.getElementById('toggle-large-text');
    if (largeTextToggle) {
        largeTextToggle.onchange = () => {
            appSettings.largeText = largeTextToggle.checked;
            saveSettings();
            applySettings();
        };
    }

    const ipaToggle = document.getElementById('toggle-show-ipa');
    if (ipaToggle) {
        ipaToggle.onchange = () => {
            appSettings.showIPA = ipaToggle.checked;
            saveSettings();
            applySettings();
        };
    }

    const examplesToggle = document.getElementById('toggle-show-examples');
    if (examplesToggle) {
        examplesToggle.onchange = () => {
            appSettings.showExamples = examplesToggle.checked;
            saveSettings();
            applySettings();
        };
    }

    const cuesToggle = document.getElementById('toggle-mouth-cues');
    if (cuesToggle) {
        cuesToggle.onchange = () => {
            appSettings.showMouthCues = cuesToggle.checked;
            saveSettings();
            applySettings();
        };
    }

    const speechRateInput = document.getElementById('speech-rate');
    if (speechRateInput) {
        speechRateInput.oninput = () => {
            const value = parseFloat(speechRateInput.value);
            appSettings.speechRate = Number.isFinite(value) ? value : DEFAULT_SETTINGS.speechRate;
            const display = document.getElementById('speech-rate-value');
            if (display) display.textContent = `${appSettings.speechRate.toFixed(2)}x`;
            saveSettings();
        };
    }

    const translationSelect = document.getElementById('translation-default-select');
    if (translationSelect) {
        translationSelect.onchange = () => {
            appSettings.translation.lang = translationSelect.value;
            saveSettings();
        };
    }

    const translationLock = document.getElementById('translation-lock-toggle');
    if (translationLock) {
        translationLock.onchange = () => {
            appSettings.translation.pinned = translationLock.checked;
            saveSettings();
        };
    }

    const bonusSelect = document.getElementById('bonus-frequency');
    if (bonusSelect) {
        bonusSelect.onchange = () => {
            appSettings.bonus.frequency = bonusSelect.value;
            saveSettings();
        };
    }

    const autoHearToggle = document.getElementById('toggle-auto-hear');
    if (autoHearToggle) {
        autoHearToggle.checked = appSettings.autoHear !== false;
        autoHearToggle.onchange = () => {
            appSettings.autoHear = autoHearToggle.checked;
            saveSettings();
        };
    }
}

function ensureClassroomDockControl() {
    const grid = document.querySelector('#teacher-modal .teacher-tools-grid');
    if (!grid || document.getElementById('open-classroom-dock')) return;

    const row = document.createElement('div');
    row.className = 'toggle-row inline';
    row.innerHTML = `
        <button type="button" id="open-classroom-dock" class="teacher-secondary-btn">Open Classroom Dock</button>
    `;
    grid.appendChild(row);
    row.querySelector('#open-classroom-dock')?.addEventListener('click', () => {
        toggleClassroomDock(true);
    });
}

function ensurePracticePackRow() {
    const grid = document.querySelector('#teacher-modal .teacher-tools-grid');
    if (!grid || document.getElementById('practice-pack-row')) return;

    const row = document.createElement('div');
    row.className = 'teacher-pack-row';
    row.id = 'practice-pack-row';
    row.innerHTML = `
        <div class="practice-pack-label">
            <strong>Download practice pack</strong>
            <span class="teacher-subtext">CSV summary + audio bundle</span>
        </div>
        <div class="practice-pack-actions">
            <button type="button" id="practice-pack-csv" class="teacher-secondary-btn">CSV</button>
            <button type="button" id="practice-pack-audio" class="teacher-secondary-btn">Audio bundle</button>
            <button type="button" id="practice-pack-clear" class="teacher-secondary-btn">Clear local recordings</button>
        </div>
    `;
    grid.appendChild(row);

    row.querySelector('#practice-pack-csv')?.addEventListener('click', downloadPracticePackCsv);
    row.querySelector('#practice-pack-audio')?.addEventListener('click', downloadPracticeAudioBundle);
    row.querySelector('#practice-pack-clear')?.addEventListener('click', clearAllPracticeRecordings);
}

function ensureTeacherTabs() {
    const modal = document.getElementById('teacher-modal');
    if (!modal || modal.dataset.tabsInit === 'true') return;
    const content = modal.querySelector('.modal-content') || modal;
    if (!content) return;
    const header = content.querySelector('h2');
    const closeBtn = content.querySelector('.close-teacher');

    const tabs = document.createElement('div');
    tabs.className = 'teacher-tabs';
    tabs.innerHTML = `
        <button type="button" class="teacher-tab-btn active" data-tab="audio" aria-selected="true">Audio</button>
        <button type="button" class="teacher-tab-btn" data-tab="assessments" aria-selected="false">Assessments</button>
    `;

    const audioPanel = document.createElement('div');
    audioPanel.className = 'teacher-tab-panel active';
    audioPanel.dataset.tab = 'audio';

    const assessmentPanel = document.createElement('div');
    assessmentPanel.className = 'teacher-tab-panel';
    assessmentPanel.dataset.tab = 'assessments';

    if (header) {
        header.insertAdjacentElement('afterend', tabs);
    } else {
        content.prepend(tabs);
    }
    tabs.insertAdjacentElement('afterend', audioPanel);
    audioPanel.insertAdjacentElement('afterend', assessmentPanel);

    const movable = Array.from(content.children).filter(child => (
        child !== tabs &&
        child !== audioPanel &&
        child !== assessmentPanel &&
        child !== header &&
        child !== closeBtn
    ));
    movable.forEach(child => audioPanel.appendChild(child));

    const assessmentRow = audioPanel.querySelector('#open-assessment-btn')?.closest('.toggle-row');
    const practiceRow = audioPanel.querySelector('#practice-pack-row');
    if (assessmentRow) assessmentPanel.appendChild(assessmentRow);
    if (practiceRow) assessmentPanel.appendChild(practiceRow);

    tabs.querySelectorAll('.teacher-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => setTeacherTab(btn.dataset.tab || 'audio'));
    });

    modal.dataset.tabsInit = 'true';
}

function setTeacherTab(tab = 'audio') {
    const modal = document.getElementById('teacher-modal');
    if (!modal) return;
    modal.querySelectorAll('.teacher-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.tab === tab);
    });
    modal.querySelectorAll('.teacher-tab-btn').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}

function compactTeacherLayout() {
    const modal = document.getElementById('teacher-modal');
    if (!modal || modal.dataset.cleaned === 'true') return;
    modal.dataset.cleaned = 'true';
    modal.classList.add('teacher-clean');

    const deleteGrid = modal.querySelector('.voice-delete-grid');
    if (deleteGrid && !modal.querySelector('.teacher-danger')) {
        const wrapper = document.createElement('details');
        wrapper.className = 'teacher-section teacher-danger';
        wrapper.innerHTML = `<summary>Cleanup tools</summary>`;
        deleteGrid.parentNode?.insertBefore(wrapper, deleteGrid);
        wrapper.appendChild(deleteGrid);
    }

    const tools = modal.querySelector('.teacher-tools');
    if (tools) tools.classList.add('teacher-section');
}

function ensureAssessmentControls() {
    const grid = document.querySelector('#teacher-modal .teacher-tools-grid');
    if (!grid) return;
    if (document.getElementById('open-assessment-btn')) return;

    const row = document.createElement('div');
    row.className = 'toggle-row inline';
    row.innerHTML = `
        <button type="button" id="open-assessment-btn" class="teacher-secondary-btn">Words Their Way Assessment</button>
        <button type="button" id="open-core-phonics-btn" class="teacher-secondary-btn">Core Phonics Practice</button>
    `;
    grid.appendChild(row);
    row.querySelector('#open-assessment-btn')?.addEventListener('click', openAssessmentModal);
    row.querySelector('#open-core-phonics-btn')?.addEventListener('click', openCorePhonicsModal);
}

function ensureVoiceQualityHint() {
    const voiceSelect = document.getElementById('system-voice-select');
    if (!voiceSelect) return;
    let hint = document.getElementById('voice-quality-hint');
    if (!hint) {
        hint = document.createElement('div');
        hint.id = 'voice-quality-hint';
        hint.className = 'voice-quality-hint';
        const tip = getVoiceInstallHint();
        hint.innerHTML = `Enhanced voices (may load after first play) <span class="tiny-tooltip" title="${tip}" aria-label="${tip}">ⓘ</span>`;
        voiceSelect.insertAdjacentElement('afterend', hint);
    }
}

function ensureVoiceInstallPrompt() {
    const voiceSelect = document.getElementById('system-voice-select');
    if (!voiceSelect) return null;
    let row = document.getElementById('voice-install-row');
    if (!row) {
        row = document.createElement('div');
        row.id = 'voice-install-row';
        row.className = 'voice-install-row hidden';
        row.innerHTML = `
            <button type="button" id="voice-install-btn">Install better voices</button>
            <span>Boost clarity for phonemes and definitions.</span>
        `;
        voiceSelect.insertAdjacentElement('afterend', row);
    }
    const btn = row.querySelector('#voice-install-btn');
    if (btn && !btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.onclick = () => {
            alert(getVoiceInstallHint());
        };
    }
    return row;
}

async function updateVoiceInstallPrompt() {
    const row = ensureVoiceInstallPrompt();
    if (!row) return;
    const voices = await getVoicesAsync();
    const dialect = getPreferredEnglishDialect();
    const hasHQ = !!pickBestVoiceForLang(voices, dialect, { requireHighQuality: true }) ||
        (dialect !== 'en' && !!pickBestVoiceForLang(voices, 'en', { requireHighQuality: true }));
    row.classList.toggle('hidden', hasHQ);
}

function ensureEnhancedVoicePrompt() {
    const voiceSelect = document.getElementById('system-voice-select');
    if (!voiceSelect) return null;
    let row = document.getElementById('voice-available-row');
    if (!row) {
        row = document.createElement('div');
        row.id = 'voice-available-row';
        row.className = 'voice-available-row hidden';
        row.innerHTML = `
            <span>Enhanced voice available.</span>
            <button type="button" id="voice-prefetch-btn">Prefetch now</button>
        `;
        voiceSelect.insertAdjacentElement('afterend', row);
    }
    const btn = row.querySelector('#voice-prefetch-btn');
    if (btn && !btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.onclick = () => prefetchEnhancedVoice();
    }
    return row;
}

async function updateEnhancedVoicePrompt() {
    const row = ensureEnhancedVoicePrompt();
    if (!row) return;
    const voices = await getVoicesAsync();
    const dialect = getPreferredEnglishDialect();
    const hasHQ = !!pickBestVoiceForLang(voices, dialect, { requireHighQuality: true }) ||
        (dialect !== 'en' && !!pickBestVoiceForLang(voices, 'en', { requireHighQuality: true }));
    row.classList.toggle('hidden', !hasHQ);
}

function scheduleEnhancedVoicePrefetch() {
    if (enhancedVoicePrefetched) return;
    const handler = () => {
        prefetchEnhancedVoice();
        window.removeEventListener('pointerdown', handler);
        window.removeEventListener('keydown', handler);
    };
    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
}

async function prefetchEnhancedVoice() {
    if (enhancedVoicePrefetched) return;
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) return;
    const voices = await getVoicesAsync();
    const dialect = getPreferredEnglishDialect();
    const preferred = pickBestVoiceForLang(voices, dialect, { requireHighQuality: true }) ||
        (dialect !== 'en' ? pickBestVoiceForLang(voices, 'en', { requireHighQuality: true }) : null);
    if (!preferred) return;
    enhancedVoicePrefetched = true;
    const utterance = new SpeechSynthesisUtterance(' ');
    utterance.voice = preferred;
    utterance.lang = preferred.lang;
    utterance.rate = getSpeechRate('word');
    utterance.pitch = 1.0;
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
}

function ensureAutoHearToggle() {
    const grid = document.querySelector('#teacher-modal .teacher-tools-grid');
    if (!grid) return;
    if (document.getElementById('toggle-auto-hear')) return;

    const row = document.createElement('label');
    row.className = 'toggle-row';
    row.innerHTML = `
        <input type="checkbox" id="toggle-auto-hear" />
        Auto-play word, definition, and sentence
    `;
    grid.appendChild(row);
}

function ensureFunHudControls() {
    const grid = document.querySelector('#teacher-modal .teacher-tools-grid');
    if (!grid) return;
    if (document.getElementById('toggle-fun-hud')) return;

    const row = document.createElement('label');
    row.className = 'toggle-row';
    row.innerHTML = `
        <input type="checkbox" id="toggle-fun-hud" />
        Fun mode (coins & hearts)
    `;
    grid.appendChild(row);

    const toggle = row.querySelector('#toggle-fun-hud');
    toggle.checked = !!appSettings.funHud?.enabled;
    toggle.onchange = () => {
        appSettings.funHud.enabled = toggle.checked;
        saveSettings();
        updateFunHudVisibility();
    };

    const modeRow = document.createElement('label');
    modeRow.className = 'toggle-row';
    modeRow.innerHTML = `
        <input type="checkbox" id="toggle-fun-challenge" />
        Hearts change on wins/losses
    `;
    grid.appendChild(modeRow);

    const sfxRow = document.createElement('label');
    sfxRow.className = 'toggle-row';
    sfxRow.innerHTML = `
        <input type="checkbox" id="toggle-fun-sfx" />
        Tiny reward sounds
    `;
    grid.appendChild(sfxRow);

    const styleRow = document.createElement('label');
    styleRow.className = 'toggle-row select-row';
    styleRow.innerHTML = `
        <span>Fun style</span>
        <select id="fun-style-select">
            <option value="playful">Playful</option>
            <option value="studio">Studio</option>
        </select>
    `;
    grid.appendChild(styleRow);

    const resetRow = document.createElement('div');
    resetRow.className = 'toggle-row inline';
    resetRow.innerHTML = `
        <button type="button" id="reset-fun-hud" class="teacher-secondary-btn">Reset fun counters</button>
    `;
    grid.appendChild(resetRow);

    const challengeToggle = modeRow.querySelector('#toggle-fun-challenge');
    challengeToggle.checked = !!appSettings.funHud?.challenge;
    challengeToggle.onchange = () => {
        appSettings.funHud.challenge = challengeToggle.checked;
        saveSettings();
        renderFunHud();
    };

    const sfxToggle = sfxRow.querySelector('#toggle-fun-sfx');
    sfxToggle.checked = !!appSettings.funHud?.sfx;
    sfxToggle.onchange = () => {
        appSettings.funHud.sfx = sfxToggle.checked;
        saveSettings();
    };

    const styleSelect = styleRow.querySelector('#fun-style-select');
    styleSelect.value = appSettings.funHud?.style || 'playful';
    styleSelect.onchange = () => {
        appSettings.funHud.style = styleSelect.value;
        saveSettings();
        updateFunHudVisibility();
    };

    const resetBtn = resetRow.querySelector('#reset-fun-hud');
    resetBtn.onclick = () => {
        appSettings.funHud.coins = 0;
        appSettings.funHud.hearts = appSettings.funHud.maxHearts || 3;
        saveSettings();
        renderFunHud();
        showToast('Fun counters reset.');
    };
}

function initSoundWallFilters() {
    const filterInputs = document.querySelectorAll('.soundwall-filters input[type="checkbox"][data-section]');
    if (!filterInputs.length) return;

    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            const section = input.dataset.section;
            if (!section) return;
            appSettings.soundWallSections[section] = input.checked;
            saveSettings();
            applySoundWallSectionVisibility();
        });
    });
}

function isModalOpen() {
    return !modalOverlay.classList.contains("hidden");
}

/* --- AUTO-ADJUST WORD LENGTH BASED ON PATTERN --- */
const PATTERN_LENGTH_RULES = {
    cvc: { preferred: '3', valid: [3] },
    cvce: { preferred: '4', valid: [4, 5] },
    ccvc: { preferred: '4', valid: [4, 5] },
    cvcc: { preferred: '4', valid: [4, 5] }
};

function buildPatternLengthCache() {
    if (!window.WORD_ENTRIES) return null;
    const cache = { all: new Set() };
    Object.keys(window.WORD_ENTRIES).forEach(word => {
        const entry = window.WORD_ENTRIES[word];
        const len = word.length;
        cache.all.add(len);
        if (entry && Array.isArray(entry.tags)) {
            entry.tags.forEach(tag => {
                if (!cache[tag]) cache[tag] = new Set();
                cache[tag].add(len);
            });
        }
    });
    patternLengthCache = {};
    Object.keys(cache).forEach(key => {
        patternLengthCache[key] = Array.from(cache[key]).sort((a, b) => a - b);
    });
    return patternLengthCache;
}

function getPatternLengths(pattern) {
    if (!patternLengthCache) buildPatternLengthCache();
    const key = pattern || 'all';
    if (patternLengthCache && patternLengthCache[key] && patternLengthCache[key].length) {
        return patternLengthCache[key];
    }
    if (patternLengthCache && patternLengthCache.all && patternLengthCache.all.length) {
        return patternLengthCache.all;
    }
    const fallback = PATTERN_LENGTH_RULES[key]?.valid;
    return fallback && fallback.length ? fallback.slice() : [5];
}

function pickDefaultLength(lengths) {
    if (!lengths || !lengths.length) return 5;
    if (lengths.includes(5)) return 5;
    const underFive = lengths.filter(l => l < 5);
    if (underFive.length) return Math.max(...underFive);
    return lengths[0];
}

function normalizeLengthOptions(lengthSelect) {
    if (!lengthSelect) return;
    const options = Array.from(lengthSelect.options);
    const hasFive = options.some(opt => opt.value === '5');
    const toRemove = [];

    options.forEach(opt => {
        if (opt.value === 'traditional') {
            if (hasFive) {
                toRemove.push(opt);
            } else {
                opt.value = '5';
                opt.textContent = '5';
            }
        }
        if (opt.value === '5') {
            opt.textContent = '5';
        }
    });

    toRemove.forEach(opt => opt.remove());
}

function syncLengthOptionsToPattern(setDefault = false) {
    const patternSelect = document.getElementById("pattern-select");
    const lengthSelect = document.getElementById("length-select");
    if (!patternSelect || !lengthSelect) return;

    normalizeLengthOptions(lengthSelect);

    const pattern = patternSelect.value || 'all';
    const lengths = getPatternLengths(pattern);
    const allowed = new Set(lengths.map(len => String(len)));

    Array.from(lengthSelect.options).forEach(opt => {
        if (opt.value === 'any') {
            opt.disabled = false;
            opt.hidden = false;
            return;
        }
        if (!allowed.size) {
            opt.disabled = false;
            opt.hidden = false;
            return;
        }
        const enabled = allowed.has(opt.value);
        opt.disabled = !enabled;
        opt.hidden = !enabled;
    });

    const selectedOpt = lengthSelect.options[lengthSelect.selectedIndex];
    if (setDefault || (selectedOpt && selectedOpt.disabled)) {
        const defaultLen = pickDefaultLength(lengths);
        const defaultValue = String(defaultLen);
        const defaultOption = Array.from(lengthSelect.options).find(opt => opt.value === defaultValue && !opt.disabled);
        if (defaultOption) {
            lengthSelect.value = defaultValue;
        } else {
            const anyOption = lengthSelect.querySelector('option[value="any"]');
            if (anyOption) lengthSelect.value = 'any';
        }
    }
}

function autoAdjustLength() {
    syncLengthOptionsToPattern(true);
}

function updatePatternLengthCompatibility() {
    syncLengthOptionsToPattern(false);
}

/* --- STUDIO LOGIC --- */
let studioList = [];
let studioIndex = 0;
let mediaRecorder = null;
let audioChunks = [];
let recordingType = ""; // Track what we are recording

function initStudio() {
    document.getElementById("studio-source-select").onchange = (e) => {
        const pasteArea = document.getElementById("studio-paste-area");
        pasteArea.classList.toggle("hidden", e.target.value !== "paste");
    };

    document.getElementById("start-studio-btn").onclick = startStudioSession;
    document.getElementById("exit-studio-btn").onclick = closeModal;
    
    document.getElementById("record-word-btn").onclick = () => toggleRecording("word");
    document.getElementById("record-sentence-btn").onclick = () => toggleRecording("sentence");
    
    document.getElementById("play-word-preview").onclick = () => playPreview("word");
    document.getElementById("play-sentence-preview").onclick = () => playPreview("sentence");
    
    document.getElementById("next-item-btn").onclick = nextStudioItem;
    document.getElementById("prev-item-btn").onclick = prevStudioItem;
    document.getElementById("skip-item-btn").onclick = skipStudioItem;
}

function openStudioSetup() {
    teacherModal.classList.add("hidden");
    studioModal.classList.remove("hidden");
    document.getElementById("studio-setup-view").classList.remove("hidden");
    document.getElementById("studio-record-view").classList.add("hidden");
}

async function startStudioSession() {
    const source = document.getElementById("studio-source-select").value;
    const skipExisting = document.getElementById("studio-skip-existing").checked;
    
    // Safety check
    if (!window.WORD_ENTRIES) {
        alert("Word database not loaded yet. Please wait and try again.");
        return;
    }
    
    let rawList = [];

    if (source === "focus") {
        const pattern = document.getElementById("pattern-select").value;
        const allWords = Object.keys(window.WORD_ENTRIES);
        rawList = allWords.filter(w => {
            const e = window.WORD_ENTRIES[w];
            return pattern === 'all' || (e.tags && e.tags.includes(pattern));
        });
    } else {
        const text = document.getElementById("studio-paste-input").value;
        rawList = text.split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(s => s && /^[a-z]+$/.test(s));
    }

    if (rawList.length === 0) {
        alert("No words found. Please check your selection or pasted list.");
        return;
    }

    studioList = [];
    for (let w of rawList) {
        const entry = window.WORD_ENTRIES[w];
        let sentence = `The word is ${w}.`; // fallback
        
        // Extract sentence from multilingual data structure
        if (entry) {
            if (entry.en && entry.en.sentence) {
                sentence = entry.en.sentence;
            } else if (entry.sentence) {
                sentence = entry.sentence;
            }
        }
        
        if (skipExisting) {
            const hasWord = await getAudioFromDB(`${w}_word`);
            const hasSent = await getAudioFromDB(`${w}_sentence`);
            if (hasWord && hasSent) continue; 
        }
        
        studioList.push({ 
            word: w, 
            sentence: sentence,
            definition: entry?.en?.def || entry?.def || `Definition for ${w}`,
            entry: entry
        });
    }

    if (studioList.length === 0) {
        alert("All selected words already have recordings! Try unchecking 'Skip existing' or choose different words.");
        return;
    }

    studioIndex = 0;
    document.getElementById("studio-setup-view").classList.add("hidden");
    document.getElementById("studio-record-view").classList.remove("hidden");
    loadStudioItem();
}

function loadStudioItem() {
    if (studioIndex >= studioList.length) {
        showStudioCompletionModal();
        return;
    }

    const item = studioList[studioIndex];
    const progressElement = document.getElementById("studio-progress");
    const definitionElement = document.getElementById("studio-definition-display");
    
    // Enhanced progress display
    const progressText = `Word ${studioIndex + 1} of ${studioList.length}`;
    const percentComplete = Math.round(((studioIndex) / studioList.length) * 100);
    progressElement.innerHTML = `<strong>${progressText}</strong> • ${percentComplete}% Complete`;
    
    // Populate word data
    document.getElementById("studio-word-display").textContent = item.word.toUpperCase();
    document.getElementById("studio-sentence-display").value = item.sentence || "";
    
    // Show definition
    if (definitionElement) {
        definitionElement.textContent = item.definition || "No definition available";
    }

    resetRecordButtons();
    updateNavigationButtons();
    
    // Auto-scroll to top of recording area
    const recordView = document.getElementById("studio-record-view");
    if (recordView) {
        recordView.scrollTop = 0;
    }
}

function showStudioCompletionModal() {
    const totalWords = studioList.length;
    const wordsRecorded = studioIndex;
    
    const message = `🎉 Recording Session Complete!\n\n` +
                   `✅ ${totalWords} words processed\n` +
                   `🎙️ Recordings saved to device\n\n` +
                   `Your custom recordings will now be used when students play with these words. ` +
                   `The app will automatically prefer your recordings over computer-generated speech.`;
    
    alert(message);
    closeModal();
}

function resetRecordButtons() {
    const wordBtn = document.getElementById("record-word-btn");
    const sentBtn = document.getElementById("record-sentence-btn");
    const playW = document.getElementById("play-word-preview");
    const playS = document.getElementById("play-sentence-preview");

    // Reset button states
    wordBtn.innerHTML = "🎤 Record Word";
    wordBtn.classList.remove("recording");
    wordBtn.style.background = "#dc2626";
    
    sentBtn.innerHTML = "🎤 Record Sentence";
    sentBtn.classList.remove("recording");
    sentBtn.style.background = "#dc2626";
    
    // Reset play buttons
    playW.disabled = true;
    playW.style.background = "#e5e7eb";
    playW.style.color = "#9ca3af";
    
    playS.disabled = true;
    playS.style.background = "#e5e7eb";
    playS.style.color = "#9ca3af";

    // Check for existing recordings and update play button states
    const w = studioList[studioIndex].word;
    getAudioFromDB(`${w}_word`).then(blob => { 
        if(blob) {
            playW.disabled = false;
            playW.style.background = "#10b981";
            playW.style.color = "white";
            wordBtn.innerHTML = "✅ Re-record Word";
            wordBtn.style.background = "#059669";
        }
    });
    
    getAudioFromDB(`${w}_sentence`).then(blob => { 
        if(blob) {
            playS.disabled = false;
            playS.style.background = "#10b981";
            playS.style.color = "white";
            sentBtn.innerHTML = "✅ Re-record Sentence";
            sentBtn.style.background = "#059669";
        }
    });
}

function toggleRecording(type) {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        // FIX: iOS/Safari Mime Check
        let mimeType = "audio/webm";
        if (MediaRecorder.isTypeSupported("audio/mp4")) {
            mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            mimeType = "audio/webm;codecs=opus";
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunks = [];
        recordingType = type; // Track what we are recording

        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunks, { type: mimeType });
            const word = studioList[studioIndex].word;
            const key = type === "word" ? `${word}_word` : `${word}_sentence`;
            
            saveAudioToDB(key, blob);
            
            const btn = document.getElementById(type === "word" ? "record-word-btn" : "record-sentence-btn");
            const playBtn = document.getElementById(type === "word" ? "play-word-preview" : "play-sentence-preview");
            
            // Update button to show successful recording
            btn.innerHTML = type === "word" ? "✅ Re-record Word" : "✅ Re-record Sentence";
            btn.classList.remove("recording");
            btn.style.background = "#059669";
            
            // Enable and style the play button
            playBtn.disabled = false;
            playBtn.style.background = "#10b981";
            playBtn.style.color = "white";

            // Show success message
            const statusElement = document.getElementById("recording-status");
            statusElement.style.display = "block";
            statusElement.style.background = "#d1fae5";
            statusElement.style.color = "#065f46";
            statusElement.innerHTML = `🎉 ${type === "word" ? "Word" : "Sentence"} recording saved!`;
            
            setTimeout(() => {
                statusElement.style.display = "none";
                
                // CRITICAL FIX: Only auto-advance if we just finished the SENTENCE.
                // This ensures the user stays on the card after recording the Word.
                if (document.getElementById("studio-auto-advance").checked && recordingType === 'sentence') {
                    setTimeout(nextStudioItem, 500);
                }
            }, 2000);
        };

        mediaRecorder.start();
        
        const btn = document.getElementById(type === "word" ? "record-word-btn" : "record-sentence-btn");
        const statusElement = document.getElementById("recording-status");
        
        // Update button for recording state
        btn.innerHTML = "🔴 Stop Recording";
        btn.classList.add("recording");
        btn.style.background = "#ef4444";
        
        // Show recording status
        statusElement.style.display = "block";
        statusElement.style.background = "#fee2e2";
        statusElement.style.color = "#dc2626";
        statusElement.innerHTML = `🔴 Recording ${type === "word" ? "word" : "sentence"}... Click button to stop.`;

    }).catch(err => {
        console.error("Mic Error:", err);
        alert("Could not access microphone. Please check permissions and try again.");
    });
}

async function playPreview(type) {
    const word = studioList[studioIndex].word;
    const key = type === "word" ? `${word}_word` : `${word}_sentence`;
    const blob = await getAudioFromDB(key);
    if (blob) {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
    }
}

function nextStudioItem() {
    studioIndex++;
    loadStudioItem();
}

function prevStudioItem() {
    if (studioIndex > 0) {
        studioIndex--;
        loadStudioItem();
    }
    updateNavigationButtons();
}

function skipStudioItem() {
    const confirmSkip = confirm(`Skip recording "${studioList[studioIndex].word}"?\n\nYou can come back to it later by using the Previous button.`);
    if (confirmSkip) {
        nextStudioItem();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById("prev-item-btn");
    const nextBtn = document.getElementById("next-item-btn");
    
    if (prevBtn) {
        prevBtn.disabled = studioIndex === 0;
        prevBtn.style.opacity = studioIndex === 0 ? "0.5" : "1";
    }
    
    if (nextBtn) {
        const isLast = studioIndex >= studioList.length - 1;
        nextBtn.innerHTML = isLast ? "🏁 Finish Session" : "Next Word →";
    }
}

/* --- GAME LOGIC --- */
function startNewGame(customWord = null) {
    // Safety check: ensure board element exists
    if (!board) {
        console.error("Game board element not found! Cannot start game.");
        board = document.getElementById("game-board");
        if (!board) {
            console.error("Still cannot find #game-board element!");
            return;
        }
    }
    
    gameOver = false;
    guesses = [];
    currentGuess = "";
    board.innerHTML = "";
    clearKeyboardColors();
    updateFocusPanel();
    clearPracticeGroup('word:');
    clearPracticeGroup('sentence:');
    
    if (customWord) {
        currentWord = customWord.toLowerCase();
        CURRENT_WORD_LENGTH = currentWord.length;
        currentEntry = window.WORD_ENTRIES[currentWord] || { 
            def: "Teacher set word.", sentence: "Can you decode this?", syllables: currentWord 
        };
    } else {
        const data = getWordFromDictionary();
        currentWord = data.word;
        currentEntry = data.entry;
        CURRENT_WORD_LENGTH = currentWord.length;
    }

    isFirstLoad = false;
    board.style.setProperty("--word-length", CURRENT_WORD_LENGTH);
    for (let i = 0; i < MAX_GUESSES * CURRENT_WORD_LENGTH; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    }
    
    console.log(`✓ Game started: word="${currentWord}" (${CURRENT_WORD_LENGTH} letters)`);
    
    // Update adaptive actions for new word
    if (typeof updateAdaptiveActions === 'function') {
        updateAdaptiveActions();
    }

    resetLightningTimer();
    renderFunHud();
}

function getWordFromDictionary() {
    const pattern = document.getElementById("pattern-select").value;
    const lenVal = document.getElementById("length-select").value;
    
    // Safety check: ensure word database is loaded
    if (!window.WORD_ENTRIES) {
        console.error("Word database not loaded yet");
        return { word: "apple", entry: { def: "Loading...", sentence: "Please wait.", syllables: "ap-ple" } };
    }
    
    let targetLen = null;
    if (lenVal === 'any') {
        targetLen = null;
    } else if (lenVal === 'traditional' || lenVal === '5') {
        targetLen = 5;
    } else {
        const parsed = parseInt(lenVal, 10);
        targetLen = Number.isFinite(parsed) ? parsed : null;
    }

    const pool = Object.keys(window.WORD_ENTRIES).filter(w => {
        const e = window.WORD_ENTRIES[w];
        const lenMatch = !targetLen || w.length === targetLen;
        const patMatch = pattern === 'all' || (e.tags && e.tags.includes(pattern));
        return lenMatch && patMatch;
    });

    if (pool.length === 0) return { word: "apple", entry: window.WORD_ENTRIES["apple"] };
    const final = pool[Math.floor(Math.random() * pool.length)];
    return { word: final, entry: window.WORD_ENTRIES[final] };
}

function updateFocusPanel() {
    const sel = document.getElementById("pattern-select");
    const pat = sel ? sel.value : "all";

    // Safety check: ensure FOCUS_INFO is loaded
    if (!window.FOCUS_INFO) {
        console.error("FOCUS_INFO not loaded yet");
        return;
    }

    const info = window.FOCUS_INFO[pat] || window.FOCUS_INFO.all || {
        title: "Practice",
        desc: "General Review",
        examples: ""
    };

    // Support both older + newer DOM ids
    const titleEl = document.getElementById("focus-title") || document.getElementById("simple-focus-title");
    const descEl = document.getElementById("focus-desc") || document.getElementById("simple-focus-desc");
    const examplesEl = document.getElementById("focus-examples") || document.getElementById("simple-focus-examples");

    if (titleEl) titleEl.textContent = info.title || "";
    if (descEl) descEl.textContent = info.desc || "";

    if (examplesEl) {
        if (info.examples) {
            examplesEl.textContent = `Try words like: ${info.examples}`;
            examplesEl.classList.remove("hidden");
        } else {
            examplesEl.textContent = "";
            examplesEl.classList.add("hidden");
        }
    }

    // Quick tiles row is optional; never crash if missing
    const quickRow = document.getElementById("quick-tiles-row");
    if (quickRow) {
        if (pat !== "all" && info.quick && Array.isArray(info.quick) && info.quick.length) {
            quickRow.innerHTML = "";
            info.quick.forEach(q => {
                const b = document.createElement("button");
                b.className = "q-tile";
                b.type = "button";
                b.textContent = q;
                b.onclick = () => {
                    for (let c of q) handleInput(c);
                    b.blur();
                };
                quickRow.appendChild(b);
            });
            quickRow.classList.remove("hidden");
        } else {
            quickRow.classList.add("hidden");
            quickRow.innerHTML = "";
        }
    }
}

/* ==========================================
   ADAPTIVE ACTION ROW - Context-aware quick actions
   ========================================== */

function updateAdaptiveActions() {
    // Get current word info
    const word = currentWord;
    const entry = currentEntry;
    
    if (!word || !entry) return;
    
    // Action buttons
    const hearWord = document.getElementById('action-hear-word');
    const hearSentence = document.getElementById('action-hear-sentence');
    const hearSound = document.getElementById('action-hear-sound');
    const mouthPosition = document.getElementById('action-mouth-position');
    
    if (!hearWord) return; // Elements not loaded yet
    
    // Always show "Hear word"
    hearWord.style.display = 'inline-block';
    hearWord.classList.add('hint-primary');
    hearWord.onclick = () => speak(word, 'word');
    
    // Show "Hear sentence" only if sentence exists
    if (entry.sentence && entry.sentence.length > 5) {
        hearSentence.style.display = 'inline-block';
        hearSentence.classList.add('hint-primary');
        hearSentence.onclick = () => speak(entry.sentence, 'sentence');
    } else {
        hearSentence.style.display = 'none';
    }
    
    // Show "Hear sound" if we can detect a phoneme pattern
    const firstSound = detectPrimarySound(word);
    if (firstSound) {
        hearSound.style.display = 'inline-block';
        hearSound.onclick = () => {
            // Play sound then word
            speakPhoneme(firstSound);
            setTimeout(() => speak(word, 'word'), 600);
        };
    } else {
        hearSound.style.display = 'none';
    }
    
    // Mouth guide is optional and off by default (Sound Guide is primary)
    if (mouthPosition) {
        mouthPosition.style.display = 'none';
    }
    
    // Update voice indicator
    updateVoiceIndicator();
}

function detectPrimarySound(word) {
    if (!word) return null;
    
    // Detect first vowel sound (simplified - can be enhanced)
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    for (let char of word.toLowerCase()) {
        if (vowels.includes(char)) {
            return char;
        }
    }
    return word[0]; // Fallback to first letter
}

async function speakPhoneme(sound) {
    if (!sound) return;
    const lower = sound.toString().toLowerCase();
    if (await tryPlayRecordedPhoneme(lower)) return;
    const phonemeData = window.PHONEME_DATA ? window.PHONEME_DATA[sound.toLowerCase()] : null;
    const text = phonemeData ? getPhonemeTts(phonemeData, sound) : sound;
    speakText(text, 'phoneme');
}

function canShowMouthPosition(sound) {
    // Check if we have mouth position data for this sound
    if (!sound || !window.PHONEME_DATA) return false;
    return !!window.PHONEME_DATA[sound.toLowerCase()];
}

function openPhonemeGuideToSound(sound) {
    // Open phoneme modal
    const phonemeModal = document.getElementById('phoneme-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (phonemeModal && modalOverlay) {
        modalOverlay.classList.remove('hidden');
        phonemeModal.classList.remove('hidden');
        setWarmupOpen(true);
        if (sound) prefetchPhonemeClips([sound]);
    try { populatePhonemeGrid && populatePhonemeGrid(); } catch(e) {}
        
        // Scroll to matching card and highlight
        setTimeout(() => {
            const targetCard = document.querySelector(`.phoneme-card[data-sound="${sound}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.classList.add('highlight-flash');
                setTimeout(() => targetCard.classList.remove('highlight-flash'), 2000);
            }
        }, 100);
    }
}

function updateVoiceIndicator() {
    const indicator = document.getElementById('voice-indicator');
    const indicatorText = document.getElementById('voice-indicator-text');
    
    if (!indicator || !indicatorText) return;
    
    // Check if teacher recordings are enabled
    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    
    if (useTeacherVoice && hasAnyRecordings()) {
        indicator.style.display = 'block';
        indicatorText.textContent = '🎤 Using teacher\'s voice';
    } else {
        indicator.style.display = 'none';
    }
}

function hasAnyRecordings() {
    // Check if any recordings exist in IndexedDB
    // Simplified check - can be enhanced
    return localStorage.getItem('hasRecordings') === 'true';
}

function initAdaptiveActions() {
    // Wire up action buttons
    const hearWord = document.getElementById('action-hear-word');
    const hearSentence = document.getElementById('action-hear-sentence');
    const hearSound = document.getElementById('action-hear-sound');
    const mouthPosition = document.getElementById('action-mouth-position');
    
    // Actions are wired up in updateAdaptiveActions()
    // This is just initial setup
    
    console.log('✓ Adaptive actions initialized');
}

function initKeyboard() {
    const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    keyboard.innerHTML = "";
    rows.forEach(r => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        r.split("").forEach(char => {
            const k = document.createElement("button");
            k.className = `key ${"aeiou".includes(char) ? 'vowel' : ''}`;
            k.textContent = isUpperCase ? char.toUpperCase() : char;
            k.dataset.key = char;
            k.onclick = (e) => {
                // Add visual feedback
                e.target.classList.add('key-pressed');
                setTimeout(() => e.target.classList.remove('key-pressed'), 150);
                
                handleInput(char);
                e.target.blur(); 
            };
            rowDiv.appendChild(k);
        });
        if (r === "zxcvbnm") {
            const ent = createKey("ENTER", submitGuess, true);
            const del = createKey("⌫", deleteLetter, true);
            rowDiv.prepend(ent);
            rowDiv.append(del);
        }
        keyboard.appendChild(rowDiv);
    });
}

function createKey(txt, action, wide) {
    const b = document.createElement("button");
    b.textContent = txt;
    b.className = `key ${wide ? 'wide' : ''}`;
    b.onclick = (e) => {
        // Add visual feedback
        e.target.classList.add('key-pressed');
        setTimeout(() => e.target.classList.remove('key-pressed'), 150);
        
        action();
        e.target.blur();
    };
    return b;
}

function handleInput(char) {
    if (currentGuess.length < CURRENT_WORD_LENGTH && !gameOver) {
        currentGuess += char;
        updateGrid();
    }
}

function deleteLetter() {
    currentGuess = currentGuess.slice(0, -1);
    updateGrid();
}

function updateGrid() {
    const offset = guesses.length * CURRENT_WORD_LENGTH;
    for (let i = 0; i < CURRENT_WORD_LENGTH; i++) {
        const t = document.getElementById(`tile-${offset + i}`);
        t.textContent = "";
        t.className = "tile"; 
    }
    for (let i = 0; i < currentGuess.length; i++) {
        const t = document.getElementById(`tile-${offset + i}`);
        const char = currentGuess[i];
        t.textContent = isUpperCase ? char.toUpperCase() : char;
        t.className = "tile active";
    }
}

function toggleCase() {
    isUpperCase = !isUpperCase;
    const caseToggle = document.getElementById("case-toggle");
    if (caseToggle) {
        caseToggle.textContent = isUpperCase ? "ABC" : "abc";
    }
    initKeyboard();
    document.querySelectorAll(".tile").forEach(t => {
        if(t.textContent) t.textContent = isUpperCase ? t.textContent.toUpperCase() : t.textContent.toLowerCase();
    });
}

function submitGuess() {
    if (currentGuess.length !== CURRENT_WORD_LENGTH) {
        const offset = guesses.length * CURRENT_WORD_LENGTH;
        const first = document.getElementById(`tile-${offset}`);
        if(first) {
            first.style.transform = "translateX(5px)";
            setTimeout(() => first.style.transform = "none", 100);
        }
        showToast("Finish the word first."); // CLEAN TOAST
        return;
    }
    const guessTeam = appSettings.gameMode?.teamMode ? getActiveTeamKey() : 'A';
    lastGuessTeam = guessTeam;

    const result = evaluate(currentGuess, currentWord);
    revealColors(result, currentGuess);
    guesses.push(currentGuess);

    if (currentGuess === currentWord) {
        gameOver = true;
        confetti(); 
        setTimeout(() => {
            showEndModal(true);  // Show word reveal first
        }, 1500);
    } else if (guesses.length >= MAX_GUESSES) {
        gameOver = true;
        setTimeout(() => showEndModal(false), 1500);
    } else {
        currentGuess = "";
        if (appSettings.gameMode?.teamMode) {
            toggleActiveTeam();
            renderFunHud();
        }
    }
}

function evaluate(guess, target) {
    const res = Array(CURRENT_WORD_LENGTH).fill("absent");
    const tArr = target.split("");
    const gArr = guess.split("");

    gArr.forEach((c, i) => {
        if (c === tArr[i]) {
            res[i] = "correct";
            tArr[i] = null;
            gArr[i] = null;
        }
    });
    gArr.forEach((c, i) => {
        if (c && tArr.includes(c)) {
            res[i] = "present";
            tArr[tArr.indexOf(c)] = null;
        }
    });
    return res;
}

function revealColors(result, guess) {
    const offset = (guesses.length) * CURRENT_WORD_LENGTH;
    result.forEach((status, i) => {
        setTimeout(() => {
            const t = document.getElementById(`tile-${offset + i}`);
            t.classList.add(status);
            t.classList.add("pop");
            const k = document.querySelector(`.key[data-key="${guess[i]}"]`);
            if (k) {
                if (status === "correct") {
                    k.classList.remove("present", "absent");
                    k.classList.add("correct");
                } else if (status === "present") {
                    if (!k.classList.contains("correct")) {
                        k.classList.remove("absent");
                        k.classList.add("present");
                    }
                } else if (status === "absent") {
                    if (!k.classList.contains("correct") && !k.classList.contains("present")) {
                        k.classList.add("absent");
                    }
                }
            }
        }, i * 200);
    });
}

function renderModalWord(word) {
    const wordEl = document.getElementById("modal-word");
    if (!wordEl) return;
    const letters = (word || "").toUpperCase().split("");
    if (!letters.length) {
        wordEl.textContent = "";
        return;
    }
    wordEl.classList.add("reveal-word");
    wordEl.setAttribute("aria-label", letters.join(""));
    wordEl.innerHTML = letters
        .map((ch, i) => `<span style="--delay:${(i * 0.08).toFixed(2)}s">${ch}</span>`)
        .join("");
}

function applyRevealVariant(win) {
    const wordEl = document.getElementById("modal-word");
    if (!wordEl) return;
    const variants = ['lift', 'flip', 'sparkle'];
    const choice = win ? variants[Math.floor(Math.random() * variants.length)] : 'lift';
    wordEl.classList.remove('variant-lift', 'variant-flip', 'variant-sparkle');
    wordEl.classList.add(`variant-${choice}`);
}

function updateModalSyllables(word, rawSyllables) {
    const syllableEl = document.getElementById("modal-syllables");
    if (!syllableEl) return;

    const cleanedWord = (word || "").replace(/[^a-z]/gi, "").toLowerCase();
    const cleanedSyllables = (rawSyllables || "").replace(/[^a-z]/gi, "").toLowerCase();

    if (!rawSyllables || cleanedSyllables === cleanedWord) {
        syllableEl.textContent = "";
        syllableEl.classList.add("hidden");
        return;
    }

    syllableEl.textContent = rawSyllables;
    syllableEl.classList.remove("hidden");
}

function estimateSpeechDuration(text, rate = 1) {
    if (!text) return 0;
    const normalized = Math.max(0.6, rate || 1);
    const base = Math.max(900, text.length * 55);
    return Math.min(9000, base / normalized);
}

function autoPlayReveal(definitionText, sentenceText) {
    if (appSettings.autoHear === false) return;
    const wordText = currentWord || '';
    const speechRateWord = getSpeechRate('word');
    const speechRateSentence = getSpeechRate('sentence');

    let delay = 150;
    if (wordText) {
        setTimeout(() => speak(wordText, 'word'), delay);
        delay += estimateSpeechDuration(wordText, speechRateWord);
    }
    if (definitionText) {
        setTimeout(() => speakText(definitionText, 'sentence'), delay);
        delay += estimateSpeechDuration(definitionText, speechRateSentence);
    }
    if (sentenceText) {
        setTimeout(() => speak(sentenceText, 'sentence'), delay);
    }
}

function prepareTranslationSection() {
    const languageSelect = document.getElementById("language-select");
    let section = document.querySelector(".translation-selector");
    if (!section && languageSelect) {
        section = languageSelect.closest(".translation-selector") || languageSelect.parentElement;
        if (section && !section.classList.contains("translation-selector")) {
            section.classList.add("translation-selector");
        }
    }
    if (!section || section.dataset.compactified === "true") return section;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "translation-toggle";
    toggle.textContent = "🌐 Translate";

    section.prepend(toggle);

    const controls = document.createElement("div");
    controls.className = "translation-controls";

    Array.from(section.children).forEach(child => {
        if (child !== toggle) controls.appendChild(child);
    });

    section.appendChild(controls);
    section.classList.add("translation-compact");
    section.dataset.compactified = "true";

    toggle.addEventListener("click", () => {
        section.classList.toggle("is-open");
    });

    return section;
}

function ensureTranslationElements(modalContent) {
    const container = modalContent || document;
    const languageSelect = document.getElementById('language-select');
    const fallbackSelector = languageSelect
        ? (languageSelect.closest('.translation-selector') || languageSelect.parentElement)
        : null;
    const translationSelector = container.querySelector('.translation-selector') || document.querySelector('.translation-selector') || fallbackSelector;

    let translationDisplay = document.getElementById('translation-display');
    if (!translationDisplay) {
        translationDisplay = document.createElement('div');
        translationDisplay.id = 'translation-display';
        translationDisplay.className = 'translation-display hidden';
    }

    let translatedDef = document.getElementById('translated-def');
    if (!translatedDef) {
        translatedDef = document.createElement('div');
        translatedDef.id = 'translated-def';
        translationDisplay.appendChild(translatedDef);
    }

    let translatedSentence = document.getElementById('translated-sentence');
    if (!translatedSentence) {
        translatedSentence = document.createElement('div');
        translatedSentence.id = 'translated-sentence';
        translationDisplay.appendChild(translatedSentence);
    }

    let audioRow = translationDisplay.querySelector('.translation-audio-row');
    if (!audioRow) {
        audioRow = document.createElement('div');
        audioRow.className = 'translation-audio-row';
        translationDisplay.appendChild(audioRow);
    }

    let playTranslatedDef = document.getElementById('play-translated-def');
    if (!playTranslatedDef) {
        playTranslatedDef = document.createElement('button');
        playTranslatedDef.id = 'play-translated-def';
        playTranslatedDef.type = 'button';
        playTranslatedDef.textContent = 'Hear Definition';
    }
    if (audioRow && !audioRow.contains(playTranslatedDef)) audioRow.appendChild(playTranslatedDef);

    let playTranslatedSentence = document.getElementById('play-translated-sentence');
    if (!playTranslatedSentence) {
        playTranslatedSentence = document.createElement('button');
        playTranslatedSentence.id = 'play-translated-sentence';
        playTranslatedSentence.type = 'button';
        playTranslatedSentence.textContent = 'Hear Sentence';
    }
    if (audioRow && !audioRow.contains(playTranslatedSentence)) audioRow.appendChild(playTranslatedSentence);

    if (translationSelector && !translationSelector.contains(translationDisplay)) {
        translationSelector.appendChild(translationDisplay);
    } else if (modalContent && !modalContent.contains(translationDisplay)) {
        modalContent.appendChild(translationDisplay);
    }

    return { translationDisplay, translatedDef, translatedSentence, playTranslatedDef, playTranslatedSentence, translationSelector };
}

function setupModalAudioControls(definitionText, sentenceText) {
    if (!gameModal) return;
    const modalContent = gameModal.querySelector('.modal-content')
        || gameModal.querySelector('.modal-body')
        || gameModal;
    if (!modalContent) return;

    let audioControls = document.getElementById('modal-audio-controls');
    if (!audioControls) {
        audioControls = document.createElement('div');
        audioControls.id = 'modal-audio-controls';
        audioControls.className = 'modal-audio-controls';
    }

    let actionRow = document.getElementById('modal-action-row');
    if (!actionRow) {
        actionRow = document.createElement('div');
        actionRow.id = 'modal-action-row';
        actionRow.className = 'modal-action-row';
    }

    let autoReadRow = document.getElementById('auto-read-toggle');
    if (!autoReadRow) {
        autoReadRow = document.createElement('div');
        autoReadRow.id = 'auto-read-toggle';
        autoReadRow.className = 'auto-read-toggle';
        autoReadRow.innerHTML = `
            <label class="auto-read-label">
                <input type="checkbox" id="auto-read-checkbox" />
                Auto-read word, definition, and sentence
            </label>
        `;
    }
    const autoReadCheckbox = autoReadRow.querySelector('#auto-read-checkbox');
    if (autoReadCheckbox) {
        autoReadCheckbox.checked = appSettings.autoHear !== false;
        autoReadCheckbox.onchange = () => {
            appSettings.autoHear = autoReadCheckbox.checked;
            saveSettings();
        };
    }

    let speakBtn = document.getElementById('speak-btn');
    if (!speakBtn) {
        speakBtn = document.createElement('button');
        speakBtn.id = 'speak-btn';
        speakBtn.type = 'button';
    }
    speakBtn.textContent = 'Hear Word';
    speakBtn.classList.add('modal-audio-btn');
    speakBtn.onclick = () => {
        if (currentWord) speak(currentWord, 'word');
    };
    if (!audioControls.contains(speakBtn)) audioControls.appendChild(speakBtn);

    let defBtn = document.getElementById('modal-hear-def');
    if (!defBtn) {
        defBtn = document.createElement('button');
        defBtn.id = 'modal-hear-def';
        defBtn.type = 'button';
        defBtn.className = 'modal-audio-btn';
    }
    defBtn.textContent = 'Hear Definition';
    defBtn.disabled = !definitionText;
    defBtn.onclick = () => {
        if (definitionText) speakText(definitionText, 'sentence');
    };
    if (!audioControls.contains(defBtn)) audioControls.appendChild(defBtn);

    let sentenceBtn = document.getElementById('modal-hear-sentence');
    if (!sentenceBtn) {
        sentenceBtn = document.createElement('button');
        sentenceBtn.id = 'modal-hear-sentence';
        sentenceBtn.type = 'button';
        sentenceBtn.className = 'modal-audio-btn';
    }
    sentenceBtn.textContent = 'Hear Sentence';
    sentenceBtn.disabled = !sentenceText;
    sentenceBtn.onclick = () => {
        if (sentenceText) speak(sentenceText, 'sentence');
    };
    if (!audioControls.contains(sentenceBtn)) audioControls.appendChild(sentenceBtn);

    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.classList.add('modal-primary-btn');
        if (!actionRow.contains(playAgainBtn)) actionRow.appendChild(playAgainBtn);
    }

    const translationSelector = modalContent.querySelector('.translation-selector')
        || document.querySelector('.translation-selector')
        || document.getElementById('language-select')?.parentElement;
    const sentenceEl = modalContent.querySelector('#modal-sentence');

    const safeInsertBefore = (parent, node, reference) => {
        if (!parent || !node) return;
        if (reference && reference.parentElement === parent) {
            parent.insertBefore(node, reference);
        } else if (!parent.contains(node)) {
            parent.appendChild(node);
        }
    };
    const safeInsertAfter = (parent, node, reference) => {
        if (!parent || !node) return;
        if (reference && reference.parentElement === parent) {
            parent.insertBefore(node, reference.nextSibling);
        } else if (!parent.contains(node)) {
            parent.appendChild(node);
        }
    };

    const translationParent = translationSelector?.parentElement;
    if (translationSelector && translationParent === modalContent) {
        safeInsertBefore(modalContent, audioControls, translationSelector);
        safeInsertBefore(modalContent, actionRow, translationSelector);
        safeInsertBefore(modalContent, autoReadRow, translationSelector);
    } else if (sentenceEl && sentenceEl.parentElement) {
        const parent = sentenceEl.parentElement;
        safeInsertAfter(parent, audioControls, sentenceEl);
        safeInsertAfter(parent, actionRow, audioControls);
        safeInsertAfter(parent, autoReadRow, actionRow);
    } else {
        safeInsertBefore(modalContent, audioControls, null);
        safeInsertAfter(modalContent, actionRow, audioControls);
        safeInsertAfter(modalContent, autoReadRow, actionRow);
    }

    // Practice recorder (local-only)
    let recorderGroup = document.getElementById('practice-recorder-group');
    if (!recorderGroup) {
        recorderGroup = document.createElement('div');
        recorderGroup.id = 'practice-recorder-group';
        recorderGroup.className = 'practice-recorder-group';
    }
    recorderGroup.innerHTML = '';
    if (currentWord) {
        ensurePracticeRecorder(recorderGroup, `word:${currentWord}`, 'Record Word');
    }
    if (sentenceText) {
        ensurePracticeRecorder(recorderGroup, `sentence:${currentWord}`, 'Record Sentence');
    }
    safeInsertAfter(modalContent, recorderGroup, autoReadRow);
}

function showEndModal(win) {
    // Track progress
    trackProgress(currentWord, win, guesses.length);

    stopLightningTimer();
    
    modalOverlay.classList.remove("hidden");
    gameModal.classList.remove("hidden");
    gameModal.dataset.overlayClose = 'true';
    gameModal.classList.toggle("win", win);
    gameModal.classList.toggle("loss", !win);
    document.getElementById("modal-title").textContent = win ? "Great Job!" : "Nice Try!";
    
    renderModalWord(currentWord);
    applyRevealVariant(win);
    const syllableText = currentEntry?.syllables ? currentEntry.syllables.replace(/-/g, " • ") : "";
    updateModalSyllables(currentWord, syllableText);
    
    // Handle both data structures (your multilingual format vs simple format)
    let def, sentence;
    const wordData = (typeof WORDS_DATA !== 'undefined') ? WORDS_DATA[currentWord] : null;
    const enData = wordData && wordData.en ? wordData.en : null;
    if (enData) {
        def = enData.def;
        sentence = enData.sentence;
    } else if (currentEntry && currentEntry.en) {
        def = currentEntry.en.def;
        sentence = currentEntry.en.sentence;
    } else {
        def = currentEntry?.def || "";
        sentence = currentEntry?.sentence || "";
    }
    
    document.getElementById("modal-def").textContent = def;
    document.getElementById("modal-sentence").textContent = `"${sentence}"`;

    setupModalAudioControls(def, sentence);

    if (win && appSettings.funHud?.enabled) {
        if (appSettings.gameMode?.teamMode) {
            if (lastGuessTeam === 'B') {
                appSettings.gameMode.teamBCoins = (appSettings.gameMode.teamBCoins || 0) + 1;
            } else {
                appSettings.gameMode.teamACoins = (appSettings.gameMode.teamACoins || 0) + 1;
            }
        } else {
            appSettings.funHud.coins = (appSettings.funHud.coins || 0) + 1;
        }
        saveSettings();
        renderFunHud();
        playFunChime('win');
    }
    applyFunHudOutcome(win);
    
    // Set up translation dropdown functionality
    const languageSelect = document.getElementById("language-select");
    const modalContent = gameModal.querySelector('.modal-content') || gameModal;
    const translationElements = ensureTranslationElements(modalContent);
    const translationDisplay = translationElements.translationDisplay;
    const translatedDef = translationElements.translatedDef;
    const translatedSentence = translationElements.translatedSentence;
    const playTranslatedDef = translationElements.playTranslatedDef;
    const playTranslatedSentence = translationElements.playTranslatedSentence;
    
    const pinCheckbox = document.getElementById("pin-language");
    const pinStatus = document.getElementById("translation-pin-status");
    const translationSection = prepareTranslationSection();
    const toggleTranslationSection = (open) => {
        if (translationSection) {
            translationSection.classList.toggle("is-open", open);
        }
    };

    const renderTranslation = async (selectedLang) => {
        if (!translationDisplay || !translatedDef || !translatedSentence) return;
        if (!selectedLang || selectedLang === "en") {
            translationDisplay.classList.add("hidden");
            setTranslationAudioNote('');
            return;
        }

        const translation = getTranslationData(currentWord, selectedLang);
        if (translation && (translation.definition || translation.sentence)) {
            translatedDef.textContent = translation.definition || '';
            translatedSentence.textContent = translation.sentence ? `"${translation.sentence}"` : '';

            if (playTranslatedDef) {
                playTranslatedDef.onclick = () => playTextInLanguage(translation.definition, selectedLang);
            }
            if (playTranslatedSentence) {
                playTranslatedSentence.onclick = () => playTextInLanguage(translation.sentence, selectedLang);
            }

            translationDisplay.classList.remove("hidden");
        } else {
            translatedDef.textContent = "Translation not available yet.";
            translatedSentence.textContent = "";
            if (playTranslatedDef) playTranslatedDef.onclick = null;
            if (playTranslatedSentence) playTranslatedSentence.onclick = null;
            translationDisplay.classList.remove("hidden");
        }

        const hasVoice = await hasHighQualityVoiceForLanguage(selectedLang);
        if (playTranslatedDef) playTranslatedDef.disabled = !hasVoice;
        if (playTranslatedSentence) playTranslatedSentence.disabled = !hasVoice;
        if (!hasVoice) {
            setTranslationAudioNote('Audio unavailable for this language.', true);
        } else {
            setTranslationAudioNote('');
        }

        const translationSection = translationDisplay.closest('.translation-compact');
        if (translationSection) translationSection.classList.add('is-open');
    };

    const updatePinStatus = () => {
        if (!pinStatus) return;
        if (appSettings.translation?.pinned && appSettings.translation?.lang && appSettings.translation.lang !== 'en') {
            const optionLabel = languageSelect?.selectedOptions?.[0]?.textContent || appSettings.translation.lang;
            pinStatus.textContent = `Locked to ${optionLabel}.`;
            pinStatus.classList.remove('hidden');
        } else {
            pinStatus.textContent = "";
            pinStatus.classList.add('hidden');
        }
    };

    if (languageSelect) {
        const pinned = appSettings.translation?.pinned;
        const pinnedLang = appSettings.translation?.lang || 'en';
        languageSelect.value = pinned ? pinnedLang : 'en';
        translationDisplay.classList.add("hidden");

        if (pinCheckbox) {
            pinCheckbox.checked = !!pinned;
        }

        renderTranslation(languageSelect.value);
        updatePinStatus();
        toggleTranslationSection(languageSelect.value && languageSelect.value !== 'en');

        languageSelect.onchange = () => {
            const selectedLang = languageSelect.value;
            renderTranslation(selectedLang);
            toggleTranslationSection(selectedLang && selectedLang !== 'en');

            if (pinCheckbox && pinCheckbox.checked) {
                appSettings.translation.lang = selectedLang;
                if (selectedLang === 'en') {
                    appSettings.translation.pinned = false;
                    pinCheckbox.checked = false;
                }
                saveSettings();
            }
            updatePinStatus();
        };

        if (pinCheckbox) {
            pinCheckbox.onchange = () => {
                const selectedLang = languageSelect.value;
                const shouldPin = pinCheckbox.checked && selectedLang !== 'en';
                appSettings.translation.pinned = shouldPin;
                if (shouldPin) {
                    appSettings.translation.lang = selectedLang;
                }
                saveSettings();
                updatePinStatus();
                toggleTranslationSection(selectedLang && selectedLang !== 'en');
            };
        }
    }
    
    // Store that we should show bonus when modal closes
    sessionStorage.setItem('showBonusOnClose', 'true');

    autoPlayReveal(def, sentence);
}

function openTeacherMode() {
    modalOverlay.classList.remove("hidden");
    teacherModal.classList.remove("hidden");
    const inp = document.getElementById("custom-word-input");
    inp.value = "";
    document.getElementById("teacher-error").textContent = "";
    setTeacherTab('audio');
    
    // Initialize voice control settings
    initTeacherVoiceControl();
    applySettings();
    
    inp.focus();
}

/* ==========================================
   TEACHER VOICE CONTROL SYSTEM
   ========================================== */

function initTeacherVoiceControl() {
    const toggle = document.getElementById('teacher-voice-toggle');
    const statusText = document.getElementById('recording-count');
    const deleteAllBtn = document.getElementById('delete-all-recordings');
    const deleteWordBtn = document.getElementById('delete-word-recording');
    const deleteSentenceBtn = document.getElementById('delete-sentence-recording');
    const deleteAllWordBtn = document.getElementById('delete-all-word-recordings');
    const deleteAllSentenceBtn = document.getElementById('delete-all-sentence-recordings');
    const deletePhonemeBtn = document.getElementById('delete-phoneme-recording');

    if (!toggle) return;

    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    toggle.checked = useTeacherVoice;

    updateRecordingStatus();

    toggle.onchange = () => {
        const enabled = toggle.checked;
        localStorage.setItem('useTeacherRecordings', enabled.toString());
        updateVoiceIndicator();
        showToast(enabled ? '✅ Teacher voice enabled' : '🔊 Using system voice');
    };

    if (deleteWordBtn) {
        deleteWordBtn.onclick = async () => {
            if (!currentWord) return showToast('No word selected yet.');
            if (confirm(`Delete the word recording for "${currentWord}"?`)) {
                await deleteAudioFromDB(`${currentWord}_word`);
                showToast('✅ Word recording deleted');
                updateRecordingStatus();
            }
        };
    }

    if (deleteSentenceBtn) {
        deleteSentenceBtn.onclick = async () => {
            if (!currentWord) return showToast('No word selected yet.');
            if (confirm(`Delete the sentence recording for "${currentWord}"?`)) {
                await deleteAudioFromDB(`${currentWord}_sentence`);
                showToast('✅ Sentence recording deleted');
                updateRecordingStatus();
            }
        };
    }

    if (deletePhonemeBtn) {
        deletePhonemeBtn.onclick = async () => {
            if (!currentSelectedSound?.sound) return showToast('Select a sound in the Sounds guide first.');
            const key = `phoneme_${currentSelectedSound.sound}`;
            if (confirm(`Delete the phoneme recording for "${currentSelectedSound.sound}"?`)) {
                await deleteAudioFromDB(key);
                clearPhonemeCache(currentSelectedSound.sound);
                showToast('✅ Phoneme recording deleted');
                updateRecordingStatus();
            }
        };
    }

    if (deleteAllWordBtn) {
        deleteAllWordBtn.onclick = async () => {
            if (confirm('Delete all word recordings? This cannot be undone.')) {
                const count = await deleteAudioByFilter(key => key.endsWith('_word'));
                showToast(`✅ Deleted ${count} word recording${count === 1 ? '' : 's'}`);
                updateRecordingStatus();
            }
        };
    }

    if (deleteAllSentenceBtn) {
        deleteAllSentenceBtn.onclick = async () => {
            if (confirm('Delete all sentence recordings? This cannot be undone.')) {
                const count = await deleteAudioByFilter(key => key.endsWith('_sentence'));
                showToast(`✅ Deleted ${count} sentence recording${count === 1 ? '' : 's'}`);
                updateRecordingStatus();
            }
        };
    }

    if (deleteAllBtn) {
        deleteAllBtn.onclick = async () => {
            if (confirm('Delete all your voice recordings? This cannot be undone.')) {
                await clearAllTeacherRecordings();
            }
        };
    }
}

function updateRecordingStatus() {
    const statusText = document.getElementById('recording-count');
    if (!statusText) return;

    countRecordingsByType().then(counts => {
        const total = counts.total || 0;
        if (total > 0) {
            statusText.textContent = `${counts.word} word • ${counts.sentence} sentence${counts.sentence === 1 ? '' : 's'} recorded`;
            localStorage.setItem('hasRecordings', 'true');
        } else {
            statusText.textContent = 'No recordings yet';
            localStorage.setItem('hasRecordings', 'false');
        }
    });
}

async function clearAllTeacherRecordings() {
    const database = await ensureDBReady();
    if (!database) {
        showToast('❌ No recordings to delete');
        return;
    }

    return new Promise((resolve) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
            showToast('✅ All recordings deleted');
            localStorage.setItem('hasRecordings', 'false');
            clearAllPhonemeCache();
            updateRecordingStatus();
            updateVoiceIndicator();
            resolve(true);
        };

        request.onerror = () => {
            showToast('❌ Error deleting recordings');
            resolve(false);
        };
    });
}

function updateVoiceIndicator() {
    const indicator = document.getElementById('voice-indicator');
    const indicatorText = document.getElementById('voice-indicator-text');
    
    if (!indicator || !indicatorText) return;
    
    // Check if teacher recordings are enabled and exist
    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    const hasRecordings = localStorage.getItem('hasRecordings') === 'true';
    
    if (useTeacherVoice && hasRecordings) {
        indicator.style.display = 'block';
        indicatorText.textContent = '🎤 Using teacher\'s voice';
    } else {
        indicator.style.display = 'none';
    }
}

function handleTeacherSubmit() {
    const val = document.getElementById("custom-word-input").value.trim().toLowerCase();
    if (val.length < 3 || val.length > 10 || !/^[a-z]+$/.test(val)) {
        document.getElementById("teacher-error").textContent = "3-10 letters, no spaces.";
        return;
    }
    
    // Show clear confirmation
    document.getElementById("teacher-error").textContent = "";
    document.getElementById("teacher-error").style.color = "var(--color-correct)";
    document.getElementById("teacher-error").textContent = `✅ Word accepted: "${val.toUpperCase()}" - Game ready!`;
    
    // Briefly pause for confirmation, then start
    setTimeout(() => {
        closeModal();
        showBanner(`✅ Teacher word set: ${val.toUpperCase()}`);
        startNewGame(val);
    }, 800);
}

function closeModal() {
    const wasGameModalOpen = !gameModal.classList.contains("hidden");
    
    modalOverlay.classList.add("hidden");
    welcomeModal.classList.add("hidden");
    teacherModal.classList.add("hidden");
    gameModal.classList.add("hidden");
    studioModal.classList.add("hidden");
    const howtoModal = document.getElementById("howto-modal");
    const assessmentModal = document.getElementById("assessment-modal");
    const corePhonicsModal = document.getElementById("core-phonics-modal");
    const adventureModal = document.getElementById("adventure-modal");
    if (howtoModal) howtoModal.classList.add("hidden");
    if (assessmentModal) assessmentModal.classList.add("hidden");
    if (corePhonicsModal) corePhonicsModal.classList.add("hidden");
    if (adventureModal) adventureModal.classList.add("hidden");
    
    // Close new modals
    const decodableModal = document.getElementById("decodable-modal");
    const progressModal = document.getElementById("progress-modal");
    const phonemeModal = document.getElementById("phoneme-modal");
    const helpModal = document.getElementById("help-modal");
    const bonusModal = document.getElementById("bonus-modal");
    const infoModal = document.getElementById("info-modal");
    if (decodableModal) decodableModal.classList.add("hidden");
    if (progressModal) progressModal.classList.add("hidden");
    if (phonemeModal) {
        phonemeModal.classList.add("hidden");
        clearSoundSelection();
    }
    if (helpModal) helpModal.classList.add("hidden");
    if (bonusModal) bonusModal.classList.add("hidden");
    if (infoModal) infoModal.classList.add("hidden");
    
    if (document.activeElement) document.activeElement.blur();
    document.body.focus();
    
    // Show bonus content if closing word modal after win
    if (wasGameModalOpen && sessionStorage.getItem('showBonusOnClose') === 'true') {
        sessionStorage.removeItem('showBonusOnClose');
        if (shouldShowBonusContent()) {
            setTimeout(() => showBonusContent(), 300);
        }
    }
    
    // Auto-start new game after closing win/loss modal
    if (wasGameModalOpen && gameOver) {
        setTimeout(() => startNewGame(), 300);
    }

    document.body.classList.remove('adventure-open');
    setWarmupOpen(false);
    updateFunHudVisibility();
}

function showBanner(msg) {
    const b = document.getElementById("banner-container");
    b.textContent = msg;
    b.classList.remove("hidden");
    b.classList.add("visible"); 
    setTimeout(() => {
        b.classList.remove("visible");
        b.classList.add("hidden");
    }, 3000);
}

// FIX: New Non-Stacking Toast
function showToast(msg) {
    const container = document.getElementById("toast-container");
    container.innerHTML = ""; // Clear existing
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ==========================================
   Practice Recorder (Local-only, auto-delete)
   ========================================== */

async function ensurePracticeStream() {
    if (practiceRecorder.stream) return practiceRecorder.stream;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        practiceRecorder.stream = stream;
        return stream;
    } catch (err) {
        showToast('Microphone access is needed to record.');
        throw err;
    }
}

function getPracticeRecording(key) {
    return practiceRecordings.get(key);
}

function clearPracticeRecording(key) {
    const existing = practiceRecordings.get(key);
    if (existing?.url) {
        URL.revokeObjectURL(existing.url);
    }
    practiceRecordings.delete(key);
    updatePracticeRecorderUI(key);
}

function clearPracticeGroup(prefix) {
    Array.from(practiceRecordings.keys()).forEach(key => {
        if (key.startsWith(prefix)) {
            clearPracticeRecording(key);
        }
    });
}

async function startPracticeRecording(key) {
    await ensurePracticeStream();
    if (practiceRecorder.mediaRecorder && practiceRecorder.mediaRecorder.state === 'recording') {
        practiceRecorder.mediaRecorder.stop();
    }

    const recorder = new MediaRecorder(practiceRecorder.stream);
    practiceRecorder.mediaRecorder = recorder;
    practiceRecorder.activeKey = key;
    practiceRecorder.chunks = [];

    recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            practiceRecorder.chunks.push(event.data);
        }
    };

    recorder.onstop = () => {
        const blob = new Blob(practiceRecorder.chunks, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const existing = practiceRecordings.get(key);
        if (existing?.url) URL.revokeObjectURL(existing.url);
        practiceRecordings.set(key, { blob, url, createdAt: Date.now() });
        practiceRecorder.activeKey = null;
        practiceRecorder.chunks = [];
        updatePracticeRecorderUI(key);
    };

    recorder.start();
    updatePracticeRecorderUI(key, true);
}

function stopPracticeRecording() {
    if (practiceRecorder.mediaRecorder && practiceRecorder.mediaRecorder.state === 'recording') {
        practiceRecorder.mediaRecorder.stop();
    }
}

async function togglePracticeRecording(key) {
    if (practiceRecorder.mediaRecorder && practiceRecorder.mediaRecorder.state === 'recording') {
        if (practiceRecorder.activeKey === key) {
            stopPracticeRecording();
            return;
        }
        stopPracticeRecording();
        setTimeout(() => startPracticeRecording(key), 150);
        return;
    }
    await startPracticeRecording(key);
}

function playPracticeRecording(key) {
    const recording = practiceRecordings.get(key);
    if (!recording?.url) return;
    const audio = new Audio(recording.url);
    audio.play();
}

function updatePracticeRecorderUI(key, isRecording = false) {
    const row = document.querySelector(`.practice-recorder[data-recorder-key="${key}"]`);
    if (!row) return;
    const recordBtn = row.querySelector('.practice-record');
    const playBtn = row.querySelector('.practice-play');
    const clearBtn = row.querySelector('.practice-clear');
    const status = row.querySelector('.practice-status');
    const hasRecording = !!practiceRecordings.get(key);

    if (recordBtn) recordBtn.textContent = isRecording ? 'Stop' : 'Record';
    if (recordBtn) recordBtn.classList.toggle('recording', isRecording);
    if (playBtn) playBtn.disabled = !hasRecording;
    if (clearBtn) clearBtn.disabled = !hasRecording;
    if (status) status.textContent = isRecording ? 'Recording…' : (hasRecording ? 'Ready' : 'Tap record');
}

function ensurePracticeRecorder(container, key, label) {
    if (!container) return;
    let row = container.querySelector(`.practice-recorder[data-recorder-key="${key}"]`);
    if (!row) {
        row = document.createElement('div');
        row.className = 'practice-recorder';
        row.dataset.recorderKey = key;
        row.innerHTML = `
            <span class="practice-label"></span>
            <span class="practice-status"></span>
            <button type="button" class="practice-record">Record</button>
            <button type="button" class="practice-play" disabled>Play</button>
            <button type="button" class="practice-clear" disabled>Redo</button>
        `;
        container.appendChild(row);
    }
    const labelEl = row.querySelector('.practice-label');
    if (labelEl) labelEl.textContent = label;
    const recordBtn = row.querySelector('.practice-record');
    const playBtn = row.querySelector('.practice-play');
    const clearBtn = row.querySelector('.practice-clear');
    if (recordBtn) recordBtn.onclick = () => togglePracticeRecording(key);
    if (playBtn) playBtn.onclick = () => playPracticeRecording(key);
    if (clearBtn) clearBtn.onclick = () => clearPracticeRecording(key);
    updatePracticeRecorderUI(key);
}

function clearAllPracticeRecordings() {
    if (practiceRecordings.size === 0) {
        showToast('No practice recordings to clear.');
        return;
    }
    if (!confirm('Clear all local practice recordings? This only removes audio stored on this device.')) return;
    if (practiceRecorder.mediaRecorder && practiceRecorder.mediaRecorder.state === 'recording') {
        practiceRecorder.mediaRecorder.stop();
    }
    Array.from(practiceRecordings.keys()).forEach(key => clearPracticeRecording(key));
    showToast('✅ Local practice recordings cleared');
}

function parsePracticeKey(key = '') {
    const [type, label] = key.split(':');
    return { type: type || 'unknown', label: label || '' };
}

function buildPracticePackCsv() {
    const header = ['Type', 'Label', 'Created At'];
    const rows = [];
    practiceRecordings.forEach((entry, key) => {
        const parsed = parsePracticeKey(key);
        const createdAt = entry?.createdAt ? new Date(entry.createdAt).toISOString() : '';
        rows.push([parsed.type, parsed.label, createdAt]);
    });
    return [header, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
}

function downloadPracticePackCsv() {
    if (practiceRecordings.size === 0) {
        showToast('No practice recordings yet.');
        return;
    }
    const csv = buildPracticePackCsv();
    downloadCSV(csv, `practice_pack_${new Date().toISOString().split('T')[0]}.csv`);
}

function getAudioExtension(blob) {
    if (!blob?.type) return 'webm';
    if (blob.type.includes('mp4')) return 'm4a';
    if (blob.type.includes('wav')) return 'wav';
    if (blob.type.includes('mpeg')) return 'mp3';
    return 'webm';
}

async function downloadPracticeAudioBundle() {
    if (practiceRecordings.size === 0) {
        showToast('No practice recordings yet.');
        return;
    }
    const files = [];
    for (const [key, entry] of practiceRecordings.entries()) {
        const parsed = parsePracticeKey(key);
        if (!entry?.blob) continue;
        const ext = getAudioExtension(entry.blob);
        const safeLabel = (parsed.label || 'recording').toString().replace(/[^a-z0-9-_]+/gi, '_');
        const filename = `practice_${parsed.type}_${safeLabel}.${ext}`;
        const buffer = await entry.blob.arrayBuffer();
        files.push({ name: filename, data: new Uint8Array(buffer) });
    }
    if (!files.length) {
        showToast('No audio files found.');
        return;
    }
    const zip = createZipArchive(files);
    downloadBlob(zip, `practice_audio_${new Date().toISOString().split('T')[0]}.zip`);
}

function checkFirstTimeVisitor() {
    if (!localStorage.getItem("decode_v5_visited")) {
        modalOverlay.classList.remove("hidden");
        welcomeModal.classList.remove("hidden");
        localStorage.setItem("decode_v5_visited", "true");
    }
}

function clearKeyboardColors() {
    document.querySelectorAll(".key").forEach(k => {
        k.classList.remove("correct", "present", "absent");
    });
}

function confetti() {
    // Create more confetti pieces spread across screen
    for (let i = 0; i < 80; i++) {
        const c = document.createElement("div");
        c.style.position = "fixed";
        c.style.left = (Math.random() * 100) + "vw"; // Spread across full width
        c.style.top = "-20px";
        c.style.width = (Math.random() * 6 + 6) + "px"; // Varied sizes 6-12px
        c.style.height = (Math.random() * 6 + 6) + "px";
        c.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        c.style.borderRadius = Math.random() > 0.5 ? "50%" : "0"; // Mix circles and squares
        c.style.zIndex = "2000";
        c.style.opacity = "1";
        // Varied fall speeds for more natural effect
        const duration = (Math.random() * 0.8 + 1.2); // 1.2-2s
        c.style.transition = `top ${duration}s ease-in, opacity ${duration}s ease-in, transform ${duration}s ease-in`;
        document.body.appendChild(c);
        
        setTimeout(() => {
            c.style.top = "110vh";
            c.style.opacity = "0";
            c.style.transform = `rotate(${Math.random() * 360}deg)`; // Spin while falling
        }, 10);
        
        setTimeout(() => c.remove(), duration * 1000 + 100);
    }
}

/* ==========================================
   BONUS CONTENT SYSTEM
   ========================================== */

const BONUS_CONTENT = {
    jokes: [
        "Why did the bicycle fall over? Because it was two-tired!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why don't scientists trust atoms? Because they make up everything!",
        "What do you call a fish wearing a bowtie? Sofishticated!",
        "Why did the math book look sad? Because it had too many problems!",
        "What do you call a sleeping bull? A bulldozer!",
        "Why did the cookie go to the doctor? Because it felt crumbly!",
        "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
        "Why can't you give Elsa a balloon? Because she will let it go!",
        "What do you call a snowman in summer? A puddle!",
        "Why did the pencil cross the road? To draw the other side!",
        "What do you call cheese that isn't yours? Nacho cheese!",
        "Why did the tomato blush? Because it saw the salad dressing!",
        "What do you call a lazy kangaroo? A pouch potato!",
        "Why did the kid bring a ladder to school? To go to high school!",
        "What do you call a sleeping dinosaur? A dino-snore!",
        "Why did the banana wear sunscreen? Because it didn't want to peel!"
    ],
    facts: [
        "Honey never spoils! Archaeologists have found 3,000-year-old honey that's still edible.",
        "A group of flamingos is called a 'flamboyance'!",
        "Octopuses have three hearts and blue blood.",
        "Bananas are berries, but strawberries aren't!",
        "Lightning strikes Earth about 100 times every second.",
        "The shortest war in history lasted only 38 minutes.",
        "Your brain generates enough electricity to power a small light bulb.",
        "A cloud can weigh more than a million pounds!",
        "Butterflies taste with their feet.",
        "The dot over 'i' and 'j' is called a 'tittle'.",
        "Koalas sleep up to 20 hours a day.",
        "A day on Venus is longer than a year on Venus.",
        "Some cats can jump up to six times their body length.",
        "The heart of a shrimp is in its head.",
        "Dolphins have names for each other!",
        "Hot water can freeze faster than cold water (the Mpemba effect).",
        "Sea otters hold hands while they sleep so they don't drift apart."
    ],
    quotes: [
        "The more that you read, the more things you will know. — Dr. Seuss",
        "Today a reader, tomorrow a leader. — Margaret Fuller",
        "A person who never made a mistake never tried anything new. — Albert Einstein",
        "Be yourself; everyone else is already taken. — Oscar Wilde",
        "In a world where you can be anything, be kind.",
        "You're braver than you believe, stronger than you seem. — A.A. Milne",
        "The expert in anything was once a beginner.",
        "Every mistake is a chance to learn something new.",
        "Believe you can and you're halfway there. — Theodore Roosevelt",
        "What you do today can improve all your tomorrows.",
        "Mistakes are proof that you are trying.",
        "Small steps every day add up to big progress.",
        "Curiosity is the spark behind every discovery.",
        "Kind words can make someone's whole day brighter.",
        "Practice makes progress."
    ]
};

function shouldShowBonusContent() {
    const frequency = appSettings.bonus?.frequency || 'sometimes';
    if (frequency === 'off') return false;
    if (frequency === 'often' || frequency === 'always') return true;
    if (frequency === 'rare') return Math.random() < 0.2;
    return Math.random() < 0.4;
}

function showBonusContent() {
    // Randomly choose joke, fact, or quote
    const types = ['jokes', 'facts', 'quotes'];
    const lastKey = localStorage.getItem('last_bonus_key');
    let type = types[Math.floor(Math.random() * types.length)];
    let content = BONUS_CONTENT[type][Math.floor(Math.random() * BONUS_CONTENT[type].length)];
    let guard = 0;
    while (lastKey && `${type}:${content}` === lastKey && guard < 5) {
        type = types[Math.floor(Math.random() * types.length)];
        content = BONUS_CONTENT[type][Math.floor(Math.random() * BONUS_CONTENT[type].length)];
        guard += 1;
    }
    localStorage.setItem('last_bonus_key', `${type}:${content}`);
    
    const emoji = type === 'jokes' ? '😄' : type === 'facts' ? '🌟' : '💭';
    const title = type === 'jokes' ? 'Joke Time!' : type === 'facts' ? 'Fun Fact!' : 'Quote of the Day';

    const bonusModal = document.getElementById('bonus-modal');
    if (!bonusModal) return;

    modalOverlay.classList.remove('hidden');
    bonusModal.classList.remove('hidden');

    const emojiEl = document.getElementById('bonus-emoji');
    const titleEl = document.getElementById('bonus-title');
    const textEl = document.getElementById('bonus-text');
    if (emojiEl) emojiEl.textContent = emoji;
    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.textContent = content;
}

/* ==========================================
   NEW FEATURES: Translation, Decodable Texts, Progress, Phoneme Guide
   ========================================== */

// Progress tracking data
let progressData = {
    wordsAttempted: 0,
    wordsCorrect: 0,
    recentWords: [],
    totalGuesses: 0
};

// Load progress data from localStorage
function loadProgressData() {
    const saved = localStorage.getItem('decode_progress_data');
    if (saved) {
        try {
            progressData = JSON.parse(saved);
        } catch (e) {
            console.error('Could not load progress data');
        }
    }
}

// Save progress data
function saveProgressData() {
    localStorage.setItem('decode_progress_data', JSON.stringify(progressData));
}

// Track game completion
function trackProgress(word, won, numGuesses) {
    progressData.wordsAttempted++;
    if (won) progressData.wordsCorrect++;
    progressData.totalGuesses += numGuesses;
    
    progressData.recentWords.unshift({
        word: word,
        won: won,
        guesses: numGuesses,
        date: new Date().toLocaleDateString()
    });
    
    // Keep only last 20 words
    if (progressData.recentWords.length > 20) {
        progressData.recentWords = progressData.recentWords.slice(0, 20);
    }
    
    saveProgressData();
}

// Initialize new features
function initNewFeatures() {
    loadProgressData();
    
    // Translation button
    const translateBtn = document.getElementById('translate-btn');
    if (translateBtn) {
        translateBtn.onclick = () => {
            const section = document.getElementById('translation-section');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
        };
    }
    
    // Translation select
    const translateSelect = document.getElementById('translate-to');
    if (translateSelect) {
        translateSelect.onchange = () => {
            const lang = translateSelect.value;
            if (!lang) return;
            
            const resultDiv = document.getElementById('translation-result');
            const word = currentWord;
            const def = currentEntry.def || '';
            
            // Debug: Check if translations are loaded
            console.log('Translation requested for:', word, 'Language:', lang);
            console.log('window.TRANSLATIONS exists:', !!window.TRANSLATIONS);
            if (window.TRANSLATIONS) {
                console.log('Available words:', Object.keys(window.TRANSLATIONS));
            }
            
            // Use curated translations for high-frequency words
            const translation = getWordTranslation(word, lang);
            console.log('Translation found:', translation);
            
            if (translation) {
                // Rich translation available from translations.js
                resultDiv.innerHTML = `
                    <div style="padding: 12px; background: #e8f5e9; border-radius: 8px; border: 2px solid var(--color-correct);">
                        <div style="color: var(--color-correct); font-weight: 600; margin-bottom: 8px;">✓ Translation Available</div>
                        
                        <div style="font-size: 1.2rem; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <strong>${word}</strong> 
                            <span style="color: #999;">→</span> 
                            <strong style="color: var(--color-correct);">${translation.word}</strong>
                            ${translation.phonetic ? `<span style="font-size: 0.85rem; color: #666; font-style: italic;">(${translation.phonetic})</span>` : ''}
                        </div>
                        
                        <div style="font-size: 0.95rem; color: #555; margin-bottom: 10px; line-height: 1.5;">
                            ${translation.def || translation.meaning || ''}
                        </div>
                        
                        ${translation.sentence ? `
                            <div style="padding: 8px; background: white; border-radius: 4px; font-size: 0.9rem; color: #666; font-style: italic; border-left: 3px solid var(--color-correct);">
                                "${translation.sentence}"
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                // Fallback: Show English definition clearly
                resultDiv.innerHTML = `
                    <div style="padding: 10px; background: #fff3e0; border-radius: 6px; border: 2px solid #ffb74d;">
                        <div style="color: #f57c00; font-weight: 600; margin-bottom: 6px;">📚 Translation Coming Soon</div>
                        <div style="font-size: 1.1rem; margin-bottom: 8px;">
                            <strong>${word}</strong> (English)
                        </div>
                        <div style="font-size: 0.9rem; color: #555; margin-bottom: 8px;">
                            <em>Meaning: ${def}</em>
                        </div>
                        <div style="font-size: 0.85rem; color: #666; line-height: 1.4;">
                            Working with English meanings helps build vocabulary skills! We're adding more translations regularly.
                        </div>
                    </div>
                `;
            }
        };
    }
    
    // Decodable texts button
    const decodableBtn = document.getElementById('decodable-btn');
    if (decodableBtn) {
        decodableBtn.onclick = openDecodableTexts;
    }
    
    // Help button
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.onclick = openHelpModal;
    }
    
    // Progress button
    const progressBtn = document.getElementById('progress-btn');
    if (progressBtn) {
        progressBtn.onclick = openProgressModal;
    }
    
    // Phoneme cards are created when the phoneme modal opens.
    
    // Close buttons for new modals
    document.querySelectorAll('.close-decodable, .close-progress, .close-phoneme, .close-help').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const closeDecodableBtn = document.getElementById('close-decodable-btn');
    if (closeDecodableBtn) {
        closeDecodableBtn.onclick = closeModal;
    }
    
    // Export data button
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.onclick = exportProgressData;
    }
    
    // Clear data button
    const clearBtn = document.getElementById('clear-data-btn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm('Clear all progress data? This cannot be undone.')) {
                progressData = {
                    wordsAttempted: 0,
                    wordsCorrect: 0,
                    recentWords: [],
                    totalGuesses: 0
                };
                saveProgressData();
                openProgressModal(); // Refresh display
            }
        };
    }
    
    // Phoneme card clicks - respect voice source selection
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.phoneme-card');
        if (card) {
            const sound = card.dataset.sound;
            const example = card.dataset.example;
            
            // Check which voice source is selected
            const voiceSource = document.querySelector('input[name="guide-voice-source"]:checked')?.value;
            
            if (voiceSource === 'system') {
                // Force system voice - bypass any recordings
                speakWithSystemVoice(example);
            } else {
                // Use recorded voice if available, fallback to system
                speak(example, 'word');
            }
        }
    });
}

// Force system voice (ignore recordings)
function speakWithSystemVoice(text) {
    if (!('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
    const preferred = pickBestEnglishVoice(voices);
    if (preferred) {
        utterance.voice = preferred;
        utterance.lang = preferred.lang;
    } else {
        utterance.lang = getPreferredEnglishDialect();
    }
    
    utterance.rate = getSpeechRate();
    speakUtterance(utterance);
}

// Open decodable texts
function openDecodableTexts() {
    if (!window.DECODABLE_TEXTS) {
        alert('Decodable texts not loaded');
        return;
    }
    
    modalOverlay.classList.remove('hidden');
    const decodableModal = document.getElementById('decodable-modal');
    decodableModal.classList.remove('hidden');
    
    const listDiv = document.getElementById('decodable-text-list');
    const modal = document.getElementById('decodable-modal');
    if (modal) {
        let recorder = document.getElementById('decodable-recorder');
        if (!recorder) {
            recorder = document.createElement('div');
            recorder.id = 'decodable-recorder';
            recorder.className = 'practice-recorder-group';
            modal.querySelector('.modal-content')?.insertAdjacentElement('afterbegin', recorder);
        }
        recorder.innerHTML = '<div class="practice-recorder-note">Select a passage to record.</div>';
    }
    const pattern = document.getElementById('pattern-select').value;
    
    // Filter texts by current pattern
    const texts = window.DECODABLE_TEXTS.filter(text => {
        return pattern === 'all' || (text.tags && text.tags.some(tag => tag === pattern || pattern.includes(tag)));
    });
    
    if (texts.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: #666;">No texts available for this pattern.</p>';
        return;
    }
    
    listDiv.innerHTML = texts.map(text => `
        <div class="decodable-text-card" onclick="readDecodableText('${text.title}')">
            <div class="decodable-text-title">${text.title}</div>
            <div class="decodable-text-level">${text.level}</div>
            <div class="decodable-text-content">${text.content}</div>
        </div>
    `).join('');
}

// Read decodable text aloud
function readDecodableText(title) {
    const text = window.DECODABLE_TEXTS.find(t => t.title === title);
    if (text) {
        clearPracticeGroup('passage:');
        const recorder = document.getElementById('decodable-recorder');
        if (recorder) {
            recorder.innerHTML = '';
            ensurePracticeRecorder(recorder, `passage:${text.title}`, 'Record Passage');
        }
        speak(text.content, 'sentence');
    }
}

// Open progress modal
function openHelpModal() {
    modalOverlay.classList.remove('hidden');
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
        helpModal.classList.remove('hidden');
    }
}

function openProgressModal() {
    modalOverlay.classList.remove('hidden');
    const progressModal = document.getElementById('progress-modal');
    progressModal.classList.remove('hidden');
    
    // Update stats
    document.getElementById('stat-attempted').textContent = progressData.wordsAttempted;
    document.getElementById('stat-correct').textContent = progressData.wordsCorrect;
    
    const rate = progressData.wordsAttempted > 0 
        ? Math.round((progressData.wordsCorrect / progressData.wordsAttempted) * 100)
        : 0;
    document.getElementById('stat-rate').textContent = rate + '%';
    
    const avgGuesses = progressData.wordsAttempted > 0
        ? (progressData.totalGuesses / progressData.wordsAttempted).toFixed(1)
        : 0;
    document.getElementById('stat-avg-guesses').textContent = avgGuesses;
    
    // Recent words
    const recentDiv = document.getElementById('recent-words');
    if (progressData.recentWords.length === 0) {
        recentDiv.innerHTML = '<p style="color: #666;">No words played yet.</p>';
    } else {
        recentDiv.innerHTML = progressData.recentWords.map(w => `
            <div style="padding: 6px; border-bottom: 1px solid #eee;">
                <strong>${w.word}</strong> - 
                ${w.won ? '✅' : '❌'} 
                (${w.guesses} guesses) - 
                <small>${w.date}</small>
            </div>
        `).join('');
    }
}

// Export progress data
function exportProgressData() {
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `decode-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Progress data exported!');
}

// Open phoneme guide
/* ==========================================
   PHONEME CARD INITIALIZATION WITH MOUTH ANIMATIONS
   ========================================== */


/* ==========================================================================
   ADVANCED ARTICULATION SYSTEM
   Comprehensive phoneme guide with mouth positioning and multiple sounds
   ========================================================================== */

// Current selected sound for detailed view
let currentSelectedSound = null;
let currentSelectedTile = null;
let soundGuideBuilt = false;

function populatePhonemeGrid(preselectSound = null) {
    if (!window.PHONEME_DATA) {
        console.error('Phoneme data not loaded!');
        return;
    }

    const subtitle = document.querySelector('.sound-guide-subtitle');
    if (subtitle) subtitle.textContent = 'Tap a tile to see a quick tip and example. Sounds are shown like /sh/.';

    if (!soundGuideBuilt) {
        buildVowelRow();
        buildAlphabetBoard();
        buildSoundSection('digraph-board', getDigraphSounds());
        buildSoundSection('blend-board', getBlendSounds());
        buildSoundSectionGrouped('vowel-team-board', [
            { title: 'Vowel Teams', sounds: getVowelTeamOnlySounds() },
            { title: 'Diphthongs', sounds: getDiphthongSounds() }
        ], { vowel: true });
        buildSoundSection('rcontrolled-board', getRControlledSounds(), { vowel: true });
        buildSoundSection('welded-board', getWeldedSounds(), { vowel: true });
        initArticulationAudioControls();
        injectSoundGuideInfoButtons();
        soundGuideBuilt = true;
    }

    const defaultSound = preselectSound || currentSelectedSound?.sound || null;
    if (defaultSound) {
        selectSoundByKey(defaultSound);
    } else {
        clearSoundSelection();
    }
}

function buildVowelRow() {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    buildSoundSection('vowel-row', vowels, { vowel: true });
}

function buildAlphabetBoard() {
    const board = document.getElementById('alphabet-board');
    if (!board) return;
    board.innerHTML = '';

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    letters.forEach(letter => {
        const data = getLetterTileData(letter);
        if (!data) return;
        const tile = createSoundTile(data.soundKey, data.phoneme, data.label, data.vowel);
        board.appendChild(tile);
    });
}

function buildSoundSection(containerId, sounds, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    let count = 0;
    sounds.forEach(item => {
        const config = typeof item === 'string' ? { soundKey: item } : item;
        const phoneme = window.PHONEME_DATA[config.soundKey];
        if (!phoneme) return;
        const label = config.label || phoneme.sound || phoneme.grapheme || config.soundKey;
        const tile = createSoundTile(config.soundKey, phoneme, label, options.vowel);
        container.appendChild(tile);
        count += 1;
    });

    const section = container.closest('.sound-guide-section');
    if (section) {
        section.classList.toggle('hidden', count === 0);
    }
}

function buildSoundSectionGrouped(containerId, groups, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    let total = 0;
    groups.forEach(group => {
        const wrapper = document.createElement('div');
        wrapper.className = 'sound-subsection';

        if (group.title) {
            const heading = document.createElement('div');
            heading.className = 'sound-subsection-title';
            heading.textContent = group.title;
            wrapper.appendChild(heading);
        }

        const row = document.createElement('div');
        row.className = 'sound-row';
        group.sounds.forEach(item => {
            const config = typeof item === 'string' ? { soundKey: item } : item;
            const phoneme = window.PHONEME_DATA[config.soundKey];
            if (!phoneme) return;
            const label = config.label || phoneme.sound || phoneme.grapheme || config.soundKey;
            const tile = createSoundTile(config.soundKey, phoneme, label, options.vowel);
            row.appendChild(tile);
            total += 1;
        });

        wrapper.appendChild(row);
        container.appendChild(wrapper);
    });

    const section = container.closest('.sound-guide-section');
    if (section) {
        section.classList.toggle('hidden', total === 0);
    }
}

const SOUND_GUIDE_INFO = {
    short_vowels: {
        title: 'Short Vowels',
        body: 'Short vowels are quick, relaxed vowel sounds. They usually appear in short words.',
        examples: ['cat', 'bed', 'sit', 'hot', 'cup']
    },
    vowel_teams: {
        title: 'Vowel Teams',
        body: 'Two vowels team up (ai, ee, oa) or split digraphs like a-e in cake and i-e in kite.',
        examples: ['rain', 'seed', 'boat', 'cake']
    },
    diphthongs: {
        title: 'Diphthongs',
        body: 'Two vowel sounds glide together in one syllable.',
        examples: ['cow', 'coin', 'toy', 'out']
    },
    digraphs: {
        title: 'Digraphs',
        body: 'Two letters make one sound (sh, ch, th, ng).',
        examples: ['ship', 'chin', 'thin', 'sing']
    },
    blends: {
        title: 'Blends',
        body: 'Two or three consonants blend together. You can still hear each sound.',
        examples: ['bl', 'tr', 'sw', 'st']
    },
    r_controlled: {
        title: 'R-Controlled Vowels',
        body: 'The “r” changes the vowel sound.',
        examples: ['car', 'her', 'bird', 'fork', 'turn']
    },
    welded: {
        title: 'Welded Sounds',
        body: 'Common vowel + consonant chunks that stick together.',
        examples: ['ang', 'ing', 'ong', 'unk']
    },
    alphabet: {
        title: 'Alphabet Sounds',
        body: 'Single-letter sounds. Some change by context (c before a is /k/, before i is /s/).',
        examples: ['b', 'm', 't', 'c']
    }
};

function mapHeadingToInfoKey(text = '') {
    const label = text.toLowerCase();
    if (label.includes('short vowel')) return 'short_vowels';
    if (label.includes('vowel team')) return 'vowel_teams';
    if (label.includes('diphthong')) return 'diphthongs';
    if (label.includes('digraph')) return 'digraphs';
    if (label.includes('blend')) return 'blends';
    if (label.includes('r-controlled') || label.includes('r controlled')) return 'r_controlled';
    if (label.includes('welded')) return 'welded';
    if (label.includes('alphabet')) return 'alphabet';
    return null;
}

function ensureInfoModal() {
    let modal = document.getElementById('info-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'info-modal';
        modal.className = 'modal hidden';
        modal.dataset.overlayClose = 'true';
        modal.innerHTML = `
            <div class="modal-content info-modal-content">
                <button class="close-btn" aria-label="Close">✕</button>
                <h2 id="info-modal-title">More Info</h2>
                <p id="info-modal-body"></p>
                <div id="info-modal-examples" class="info-modal-examples"></div>
            </div>
        `;
        document.body.appendChild(modal);
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => closeInfoModal();
    }
    return modal;
}

function openInfoModal(key) {
    const info = SOUND_GUIDE_INFO[key];
    if (!info) return;
    const modal = ensureInfoModal();
    const title = modal.querySelector('#info-modal-title');
    const body = modal.querySelector('#info-modal-body');
    const examples = modal.querySelector('#info-modal-examples');
    if (title) title.textContent = info.title;
    if (body) body.textContent = info.body;
    if (examples) {
        examples.innerHTML = '';
        info.examples.forEach(example => {
            const badge = document.createElement('span');
            badge.className = 'info-example';
            badge.textContent = example;
            examples.appendChild(badge);
        });
    }
    if (modalOverlay) modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}

function closeInfoModal() {
    const infoModal = document.getElementById('info-modal');
    if (!infoModal || infoModal.classList.contains('hidden')) return;
    infoModal.classList.add('hidden');
    const othersOpen = getAllModalElements().some(modal => {
        if (modal.id === 'info-modal') return false;
        return !modal.classList.contains('hidden');
    });
    if (!othersOpen && modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
}

function injectSoundGuideInfoButtons() {
    const headings = document.querySelectorAll('.sound-guide-section h3, .sound-subsection-title');
    headings.forEach(heading => {
        if (heading.querySelector('.info-icon')) return;
        const key = mapHeadingToInfoKey(heading.textContent || '');
        if (!key) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'info-icon';
        btn.setAttribute('aria-label', 'More info');
        btn.dataset.infoKey = key;
        btn.textContent = 'ℹ︎';
        btn.onclick = () => openInfoModal(key);
        heading.appendChild(btn);
    });
}

function getLetterTileData(letter) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    if (window.PHONEME_DATA[letter]) {
        return {
            soundKey: letter,
            phoneme: window.PHONEME_DATA[letter],
            label: letter.toUpperCase(),
            vowel: vowels.includes(letter)
        };
    }

    const fallback = {
        c: { soundKey: 'k', name: 'Hard C', example: 'cat', sound: '/k/' },
        q: { soundKey: 'k', name: 'Q (kw)', example: 'quit', sound: '/kw/' },
        x: { soundKey: 'k', name: 'X (ks)', example: 'box', sound: '/ks/' }
    }[letter];

    if (!fallback || !window.PHONEME_DATA[fallback.soundKey]) return null;
    const base = window.PHONEME_DATA[fallback.soundKey];
    return {
        soundKey: fallback.soundKey,
        phoneme: {
            ...base,
            name: fallback.name,
            example: fallback.example,
            sound: fallback.sound,
            grapheme: letter.toUpperCase(),
            description: `${fallback.name} as in ${fallback.example}`
        },
        label: letter.toUpperCase(),
        vowel: vowels.includes(letter)
    };
}

function getDigraphSounds() {
    const sounds = ['ch', 'sh', 'th', 'th-voiced', 'ng', 'zh'];
    return sounds.filter(item => {
        const key = typeof item === 'string' ? item : item.soundKey;
        return window.PHONEME_DATA[key];
    });
}

function getBlendSounds() {
    const blends = window.PHONEME_GROUPS?.consonants?.blends || [
        'bl', 'cl', 'fl', 'gl', 'pl', 'sl',
        'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr',
        'sk', 'sm', 'sn', 'sp', 'st', 'sw'
    ];
    return blends.filter(sound => window.PHONEME_DATA[sound]);
}

function getVowelTeamSounds() {
    return getVowelTeamOnlySounds();
}

function getVowelTeamOnlySounds() {
    const fallback = ['ay', 'ee', 'igh', 'oa', 'oo'];
    const fromGroups = window.PHONEME_GROUPS?.vowels?.long || fallback;
    return fromGroups.filter(sound => window.PHONEME_DATA[sound]);
}

function getDiphthongSounds() {
    const fallback = ['ow', 'oi', 'oo-short'];
    const fromGroups = window.PHONEME_GROUPS?.vowels?.diphthongs || fallback;
    return fromGroups.filter(sound => window.PHONEME_DATA[sound]);
}

function getRControlledSounds() {
    const rSounds = ['ar', 'or', 'ur', 'air', 'ear', 'ure'];
    return rSounds.filter(sound => window.PHONEME_DATA[sound]);
}

function getWeldedSounds() {
    const fromGroups = window.PHONEME_GROUPS?.vowels?.welded;
    const welded = Array.isArray(fromGroups) ? fromGroups : ['ang', 'ing', 'ong', 'ung', 'ank', 'ink', 'onk', 'unk'];
    return welded.filter(sound => window.PHONEME_DATA[sound]);
}

function createSoundTile(soundKey, phoneme, label, isVowel = false) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `sound-tile${isVowel ? ' vowel' : ''}`;
    tile.dataset.sound = soundKey;
    tile.dataset.label = label;
    tile.textContent = formatSoundLabel(label);

    tile.onclick = () => {
        selectSound(soundKey, phoneme, label, tile);
    };

    return tile;
}

function formatSoundLabel(label) {
    if (!label) return '';
    const text = label.toString();
    if (text.includes('/')) return text;
    return text.toUpperCase();
}

function selectSoundByKey(soundKey) {
    const tile = document.querySelector(`.sound-tile[data-sound="${soundKey}"]`);
    const phoneme = window.PHONEME_DATA[soundKey];
    if (phoneme) {
        selectSound(soundKey, phoneme, phoneme.sound || phoneme.grapheme || soundKey, tile);
    }
}

function clearSoundSelection() {
    currentSelectedSound = null;
    if (currentSelectedTile) {
        currentSelectedTile.classList.remove('selected');
        currentSelectedTile = null;
    }
    const displayPanel = document.getElementById('selected-sound-display');
    if (displayPanel) {
        displayPanel.classList.add('hidden');
    }
    const layout = document.querySelector('.sound-guide-layout');
    if (layout) layout.classList.add('no-card');
}

function initPhonemeTabNavigation() {
    const tabs = document.querySelectorAll('.phoneme-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.onclick = () => {
            // Update tab appearance
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.color = '#6b7280';
            });
            tab.classList.add('active');
            tab.style.background = 'white';
            tab.style.color = '#374151';
            
            // Show corresponding content
            const targetTab = tab.dataset.tab;
            contents.forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(targetTab + '-content').classList.remove('hidden');
        };
    });
}

function populatePhonemeGroup(gridId, sounds) {
    const grid = document.getElementById(gridId);
    if (!grid) return 0;

    grid.innerHTML = '';
    let count = 0;

    sounds.forEach(sound => {
        const phoneme = window.PHONEME_DATA[sound];
        if (!phoneme) return;
        const card = createPhonemeCard(sound, phoneme);
        grid.appendChild(card);
        count += 1;
    });

    const section = grid.closest('.phoneme-section');
    if (section) {
        section.classList.toggle('hidden', count === 0);
    }

    return count;
}

function populateVowelsGrid() {
    if (window.PHONEME_GROUPS && window.PHONEME_GROUPS.vowels) {
        populatePhonemeGroup('vowels-short-grid', window.PHONEME_GROUPS.vowels.short);
        populatePhonemeGroup('vowels-long-grid', window.PHONEME_GROUPS.vowels.long);
        populatePhonemeGroup('vowels-rcontrolled-grid', window.PHONEME_GROUPS.vowels.rControlled);
        populatePhonemeGroup('vowels-diphthongs-grid', window.PHONEME_GROUPS.vowels.diphthongs);
        populatePhonemeGroup('vowels-welded-grid', window.PHONEME_GROUPS.vowels.welded);
        populatePhonemeGroup('vowels-schwa-grid', window.PHONEME_GROUPS.vowels.schwa);
        return;
    }

    const grid = document.getElementById('vowels-grid');
    if (!grid) return;

    const vowels = window.PHONEME_CATEGORIES.vowels.filter(v => window.PHONEME_DATA[v]);
    grid.innerHTML = '';

    vowels.forEach(sound => {
        const phoneme = window.PHONEME_DATA[sound];
        const card = createPhonemeCard(sound, phoneme);
        grid.appendChild(card);
    });
}

function populateConsonantsGrid() {
    if (window.PHONEME_GROUPS && window.PHONEME_GROUPS.consonants) {
        populatePhonemeGroup('consonants-single-grid', window.PHONEME_GROUPS.consonants.single);
        populatePhonemeGroup('consonants-digraphs-grid', window.PHONEME_GROUPS.consonants.digraphs);
        populatePhonemeGroup('consonants-blends-grid', window.PHONEME_GROUPS.consonants.blends);
        return;
    }

    const grid = document.getElementById('consonants-grid');
    if (!grid) return;

    const consonants = window.PHONEME_CATEGORIES.consonants.filter(c => window.PHONEME_DATA[c]);
    grid.innerHTML = '';

    consonants.forEach(sound => {
        const phoneme = window.PHONEME_DATA[sound];
        const card = createPhonemeCard(sound, phoneme);
        grid.appendChild(card);
    });
}

function populateSoundWall() {
    populateVowelValley();

    if (window.PHONEME_GROUPS && window.PHONEME_GROUPS.vowels) {
        populatePhonemeGroup('soundwall-long-vowels', window.PHONEME_GROUPS.vowels.long);
        populatePhonemeGroup('soundwall-rcontrolled', window.PHONEME_GROUPS.vowels.rControlled);
        populatePhonemeGroup('soundwall-diphthongs', window.PHONEME_GROUPS.vowels.diphthongs);
        populatePhonemeGroup('soundwall-welded', window.PHONEME_GROUPS.vowels.welded);
        populatePhonemeGroup('soundwall-schwa', window.PHONEME_GROUPS.vowels.schwa);
    }

    populateConsonantGrid();

    if (window.PHONEME_GROUPS && window.PHONEME_GROUPS.consonants) {
        populatePhonemeGroup('soundwall-blends', window.PHONEME_GROUPS.consonants.blends);
    }
}

function populateVowelValley() {
    const container = document.getElementById('vowel-valley');
    if (!container) return;

    container.innerHTML = '';

    const valley = window.UFLI_VOWEL_VALLEY || [];
    valley.forEach(item => {
        const phoneme = window.PHONEME_DATA[item.sound];
        if (!phoneme) return;
        const card = createPhonemeCard(item.sound, phoneme);
        card.classList.add('valley-item');
        card.style.setProperty('--valley-offset', `${item.offset || 0}px`);
        container.appendChild(card);
    });
}

function populateConsonantGrid() {
    const grid = document.getElementById('consonant-grid');
    if (!grid) return;

    const places = [
        { id: 'lips', label: 'Lips Together' },
        { id: 'teeth', label: 'Teeth on Lip' },
        { id: 'between', label: 'Tongue Between Teeth' },
        { id: 'behind', label: 'Tongue Behind Top Teeth' },
        { id: 'lifted', label: 'Tongue Lifted' },
        { id: 'pulled', label: 'Tongue Pulled Back' },
        { id: 'throat', label: 'Back of Throat' }
    ];

    const manners = [
        { id: 'stop', label: 'Stop' },
        { id: 'nasal', label: 'Nasal' },
        { id: 'fricative', label: 'Fricative' },
        { id: 'affricate', label: 'Affricate' },
        { id: 'glide', label: 'Glide' },
        { id: 'liquid', label: 'Liquid' }
    ];

    if (!grid.dataset.built) {
        grid.innerHTML = '';

        const emptyHeader = document.createElement('div');
        emptyHeader.className = 'grid-header';
        grid.appendChild(emptyHeader);

        places.forEach(place => {
            const header = document.createElement('div');
            header.className = 'grid-header';
            header.textContent = place.label;
            grid.appendChild(header);
        });

        manners.forEach(manner => {
            const rowLabel = document.createElement('div');
            rowLabel.className = 'row-label';
            rowLabel.textContent = manner.label;
            grid.appendChild(rowLabel);

            places.forEach(place => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.id = `cell-${manner.id}-${place.id}`;
                grid.appendChild(cell);
            });
        });

        grid.dataset.built = 'true';
    }

    grid.querySelectorAll('.grid-cell').forEach(cell => {
        cell.innerHTML = '';
    });

    const placementMap = window.UFLI_CONSONANT_GRID || {};
    Object.keys(placementMap).forEach(sound => {
        const placement = placementMap[sound];
        const cell = document.getElementById(`cell-${placement.manner}-${placement.place}`);
        const phoneme = window.PHONEME_DATA[sound];
        if (!cell || !phoneme) return;
        const card = createPhonemeCard(sound, phoneme);
        cell.appendChild(card);
    });
}

function populateLettersGrid() {
    const grid = document.getElementById('letters-grid');
    if (!grid) return;
    
    const letters = Object.keys(window.LETTER_SOUNDS);
    grid.innerHTML = '';
    
    letters.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.style.cssText = `
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 700;
            font-size: 2rem;
        `;
        
        card.textContent = letter.toUpperCase();
        card.onclick = () => showLetterSounds(letter);
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
        
        grid.appendChild(card);
    });
}

function getMouthClass(phoneme) {
    return phoneme?.animation || 'mouth-neutral';
}

function createPhonemeCard(sound, phoneme) {
    const card = document.createElement('div');
    card.className = 'phoneme-card';
    card.dataset.sound = sound;
    card.dataset.example = phoneme.example || '';
    card.style.cssText = `
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    `;
    
    const displayText = (phoneme.grapheme || sound).toUpperCase();
    
    card.innerHTML = `
        <div class="phoneme-letter">${displayText}</div>
        <div class="phoneme-example">${phoneme.example || ''}</div>
        <div class="phoneme-ipa">${phoneme.sound || ''}</div>
    `;
    
    card.onclick = () => selectSound(sound, phoneme);
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = phoneme.color || '#3b82f6';
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = '#e5e7eb';
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
    
    return card;
}

function getSoundNameLabel(phoneme) {
    if (!phoneme || !phoneme.name) return '';
    const label = phoneme.name.toString();
    const lowered = label.toLowerCase();
    if (lowered.includes('blend') || lowered.includes('digraph') || lowered.includes('sound')) return '';
    return label;
}

function formatMouthCue(phoneme) {
    if (!phoneme) return '';
    if (phoneme.example && phoneme.sound) return `Listen for ${phoneme.sound} in “${phoneme.example}.”`;
    if (phoneme.example) return `Listen for the sound in “${phoneme.example}.”`;
    if (phoneme.cue) return phoneme.cue;
    if (phoneme.description) return phoneme.description;
    return '';
}

function formatMouthDescription(phoneme) {
    if (!phoneme) return '';
    if (phoneme.example) return `Example: ${phoneme.example}`;
    return phoneme.description || phoneme.cue || '';
}

function getArticulationShape(phoneme) {
    const shape = (phoneme?.mouthShape || '').toLowerCase();
    if (shape.includes('wide')) return 'wide';
    if (shape.includes('smile')) return 'smile';
    if (shape.includes('rounded')) return 'round';
    if (shape.includes('neutral')) return 'neutral';
    const mouthClass = getMouthClass(phoneme);
    if (mouthClass.includes('th')) return 'tongue';
    if (mouthClass.includes('f')) return 'teeth';
    if (mouthClass.includes('s')) return 'teeth';
    if (['mouth-b', 'mouth-p', 'mouth-m'].includes(mouthClass)) return 'closed';
    if (mouthClass.includes('sh') || mouthClass.includes('ch')) return 'round';
    return 'neutral';
}

function getClipartForSound(soundKey = '', phoneme = null) {
    const key = soundKey.toString().toLowerCase();
    const cliparts = {
        a: { label: 'apple', svg: getClipartSvg('apple') },
        e: { label: 'egg', svg: getClipartSvg('egg') },
        i: { label: 'igloo', svg: getClipartSvg('igloo') },
        o: { label: 'octopus', svg: getClipartSvg('octopus') },
        u: { label: 'umbrella', svg: getClipartSvg('umbrella') }
    };
    if (cliparts[key]) return cliparts[key];
    const fallbackLabel = phoneme?.example || 'sound cue';
    return { label: fallbackLabel, svg: getClipartSvg('sound') };
}

function getClipartSvg(type = 'sound') {
    switch (type) {
        case 'apple':
            return `
                <svg class="sound-clipart clipart-apple" viewBox="0 0 120 120" role="img" aria-label="Apple">
                    <circle cx="60" cy="68" r="30" fill="#f87171"/>
                    <circle cx="48" cy="62" r="18" fill="#fb7185" opacity="0.85"/>
                    <rect x="56" y="26" width="8" height="18" rx="4" fill="#92400e"/>
                    <path d="M60 30c10-12 24-14 32-2-14 6-26 8-32 2Z" fill="#34d399"/>
                </svg>
            `;
        case 'egg':
            return `
                <svg class="sound-clipart clipart-egg" viewBox="0 0 120 120" role="img" aria-label="Egg">
                    <ellipse cx="60" cy="66" rx="30" ry="38" fill="#fef3c7"/>
                    <ellipse cx="50" cy="58" rx="10" ry="16" fill="#fde68a" opacity="0.9"/>
                </svg>
            `;
        case 'igloo':
            return `
                <svg class="sound-clipart clipart-igloo" viewBox="0 0 120 120" role="img" aria-label="Igloo">
                    <path d="M20 78c4-26 24-44 40-44s36 18 40 44H20Z" fill="#bfdbfe"/>
                    <path d="M32 78c3-20 18-34 28-34s25 14 28 34H32Z" fill="#93c5fd"/>
                    <rect x="52" y="70" width="16" height="16" rx="6" fill="#60a5fa"/>
                </svg>
            `;
        case 'octopus':
            return `
                <svg class="sound-clipart clipart-octopus" viewBox="0 0 120 120" role="img" aria-label="Octopus">
                    <circle cx="60" cy="54" r="24" fill="#f472b6"/>
                    <circle cx="50" cy="50" r="4" fill="#0f172a"/>
                    <circle cx="70" cy="50" r="4" fill="#0f172a"/>
                    <path d="M30 74c6 14 18 16 30 10 12 6 24 4 30-10" stroke="#f472b6" stroke-width="10" stroke-linecap="round" fill="none"/>
                </svg>
            `;
        case 'umbrella':
            return `
                <svg class="sound-clipart clipart-umbrella" viewBox="0 0 120 120" role="img" aria-label="Umbrella">
                    <path d="M20 64c8-26 72-26 80 0H20Z" fill="#60a5fa"/>
                    <path d="M60 64v30c0 8-10 8-10 0" stroke="#1e3a8a" stroke-width="6" stroke-linecap="round" fill="none"/>
                    <circle cx="60" cy="60" r="6" fill="#1e3a8a"/>
                </svg>
            `;
        default:
            return `
                <svg class="sound-clipart clipart-sound" viewBox="0 0 120 120" role="img" aria-label="Sound waves">
                    <circle cx="42" cy="60" r="14" fill="#a5b4fc"/>
                    <path d="M70 42c10 12 10 24 0 36" stroke="#818cf8" stroke-width="8" stroke-linecap="round" fill="none"/>
                    <path d="M86 32c14 18 14 38 0 56" stroke="#6366f1" stroke-width="8" stroke-linecap="round" fill="none"/>
                </svg>
            `;
    }
}

function getArticulationIconSvg(phoneme) {
    const shape = getArticulationShape(phoneme);
    const mouth = (() => {
        switch (shape) {
            case 'wide':
                return `<rect x="34" y="60" width="52" height="24" rx="10" fill="#f87171"/>`;
            case 'smile':
                return `<path d="M34 66c10 14 42 14 52 0" stroke="#f87171" stroke-width="10" stroke-linecap="round" fill="none"/>`;
            case 'round':
                return `<circle cx="60" cy="72" r="16" fill="#f87171"/>`;
            case 'closed':
                return `<rect x="30" y="66" width="60" height="10" rx="5" fill="#f87171"/>`;
            case 'tongue':
                return `<path d="M36 58h48v16a14 14 0 0 1-14 14H50a14 14 0 0 1-14-14V58Z" fill="#f87171"/>`;
            default:
                return `<rect x="32" y="64" width="56" height="14" rx="7" fill="#f87171"/>`;
        }
    })();

    return `
        <svg class="sound-clipart clipart-mouth" viewBox="0 0 120 120" role="img" aria-label="Mouth cue">
            <circle cx="60" cy="52" r="34" fill="#fde68a" opacity="0.6"/>
            <circle cx="60" cy="52" r="28" fill="#fde68a" opacity="0.9"/>
            ${mouth}
        </svg>
    `;
}

function ensureArticulationCard(phoneme) {
    const display = document.getElementById('selected-sound-display');
    if (!display || !phoneme) return;

    let card = document.getElementById('articulation-card');
    if (!card) {
        card = document.createElement('div');
        card.id = 'articulation-card';
        card.className = 'articulation-card';
        display.appendChild(card);
    }

    const soundKey = currentSelectedSound?.sound || '';
    const cue = formatMouthCue(phoneme);
    const soundLabel = phoneme.sound ? phoneme.sound.toString() : '';
    const example = phoneme.example || '';
    const letterBadge = (phoneme.grapheme || soundKey || '').toString().toUpperCase();

    const exampleLine = example ? `<div class="articulation-example">Example: <strong>${example}</strong></div>` : '';
    const soundBadge = soundLabel || (soundKey ? `/${soundKey}/` : '');
    const pictureLine = `<div class="articulation-picture-label">Phoneme</div>`;

    card.innerHTML = `
        <div class="articulation-card-header">
            <span class="articulation-title">Articulation Card</span>
            <div class="articulation-actions">
                ${soundLabel ? `<span class="articulation-ipa">${soundLabel}</span>` : ''}
                <button type="button" class="articulation-collapse" id="collapse-articulation">Collapse card</button>
            </div>
        </div>
        <div class="articulation-card-body">
            <div class="articulation-visual">
                <div class="articulation-visual-block">
                    <div class="articulation-visual-wrap articulation-letter">${letterBadge || '•'}</div>
                    <div class="articulation-picture-label">Target letter</div>
                </div>
                <div class="articulation-visual-block">
                    <div class="articulation-visual-wrap articulation-icon">${soundBadge || '•'}</div>
                    ${pictureLine}
                </div>
            </div>
            <div class="articulation-text">
                <div class="articulation-tip">${cue}</div>
                ${exampleLine}
            </div>
        </div>
    `;

    const collapseBtn = document.getElementById('collapse-articulation');
    if (collapseBtn) {
        collapseBtn.onclick = () => clearSoundSelection();
    }
}

function selectSound(sound, phoneme, labelOverride = null, tile = null) {
    if (!phoneme) return;

    if (currentSelectedSound?.sound === sound) {
        clearSoundSelection();
        return;
    }

    currentSelectedSound = { sound, phoneme, label: labelOverride };
    clearPracticeGroup('sound:');

    if (currentSelectedTile) {
        currentSelectedTile.classList.remove('selected');
    }
    if (tile) {
        tile.classList.add('selected');
        currentSelectedTile = tile;
    }

    const displayPanel = document.getElementById('selected-sound-display');
    if (displayPanel) displayPanel.classList.remove('hidden');
    const layout = document.querySelector('.sound-guide-layout');
    if (layout) layout.classList.remove('no-card');

    const displayLabel = labelOverride || phoneme.sound || phoneme.grapheme || sound;
    const soundLetter = document.getElementById('sound-letter');
    if (soundLetter) soundLetter.textContent = formatSoundLabel(displayLabel);

    const soundName = document.getElementById('sound-name');
    if (soundName) {
        const label = getSoundNameLabel(phoneme);
        soundName.textContent = label;
        soundName.classList.toggle('hidden', !label);
    }

    const mouthCue = document.getElementById('mouth-cue');
    if (mouthCue) mouthCue.textContent = formatMouthCue(phoneme);

    const mouthDescription = document.getElementById('mouth-description');
    if (mouthDescription) mouthDescription.textContent = formatMouthDescription(phoneme);

    const mouthVisual = document.getElementById('mouth-visual');
    if (mouthVisual) {
        mouthVisual.innerHTML = '';
        mouthVisual.style.display = 'none';
    }

    const cueLabel = document.querySelector('.sound-cue-label');
    if (cueLabel) cueLabel.textContent = 'Sound Tip';

    const hearSoundBtn = document.getElementById('hear-phoneme-sound');
    if (hearSoundBtn) {
        hearSoundBtn.remove();
    }

    ensureArticulationCard(phoneme);

    if (displayPanel && sound) {
        // Remove phoneme practice recorder for articulation card
        const existingSoundRecorder = displayPanel.querySelector('.practice-recorder-group');
        if (existingSoundRecorder) existingSoundRecorder.remove();
    }
}

function showLetterSounds(letter) {
    const sounds = window.LETTER_SOUNDS[letter];
    if (!sounds) return;
    
    document.getElementById('selected-letter').textContent = letter.toUpperCase();
    
    const grid = document.getElementById('letter-sounds-grid');
    grid.innerHTML = '';
    
    sounds.forEach(soundInfo => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 2rem; font-weight: 700;">${letter.toUpperCase()}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #374151;">${soundInfo.name}</div>
                    <div style="font-size: 0.9rem; color: #6b7280;">Example: ${soundInfo.example}</div>
                </div>
                <button style="padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 0.85rem;">Play</button>
            </div>
        `;
        
        card.onclick = () => {
            if (window.PHONEME_DATA[soundInfo.phoneme]) {
                selectSound(soundInfo.phoneme, window.PHONEME_DATA[soundInfo.phoneme]);
            }
        };
        
        // Find and setup the play button
        const playBtn = card.querySelector('button');
        playBtn.onclick = (e) => {
            e.stopPropagation();
            playLetterSequence(letter, soundInfo.example, soundInfo.phoneme);
        };
        
        grid.appendChild(card);
    });
    
    document.getElementById('letter-sounds-display').classList.remove('hidden');
    document.getElementById('letter-sounds-display').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initArticulationAudioControls() {
    const hearLetterBtn = document.getElementById('hear-letter-name');
    const hearWordBtn = document.getElementById('hear-example-word');
    
    if (hearLetterBtn) {
        hearLetterBtn.onclick = () => {
            if (currentSelectedSound) {
                const grapheme = currentSelectedSound.label || currentSelectedSound.phoneme.grapheme || currentSelectedSound.sound;
                speakSpelling(grapheme);
            }
        };
    }
    
    if (hearWordBtn) {
        hearWordBtn.onclick = () => {
            if (currentSelectedSound) {
                speakText(currentSelectedSound.phoneme.example || '');
            }
        };
    }

    const actionButtons = document.querySelectorAll('.sound-card-actions button');
    actionButtons.forEach(btn => {
        if (btn.dataset.bound === 'true') return;
        const label = (btn.textContent || '').toLowerCase();
        if (label.includes('letter')) {
            btn.dataset.bound = 'true';
            btn.onclick = () => {
                if (currentSelectedSound) {
                    const grapheme = currentSelectedSound.label || currentSelectedSound.phoneme.grapheme || currentSelectedSound.sound;
                    speakSpelling(grapheme);
                }
            };
        } else if (label.includes('example')) {
            btn.dataset.bound = 'true';
            btn.onclick = () => {
                if (currentSelectedSound) {
                    speakText(currentSelectedSound.phoneme.example || '');
                }
            };
        }
    });
}

function playLetterSequence(letter, word, phoneme) {
    // Play: spelling → example word → sound cue
    speakSpelling(letter);

    setTimeout(() => {
        speakText(word);
    }, 900);

    setTimeout(() => {
        const phonemeData = window.getPhonemeData ? window.getPhonemeData(phoneme) : null;
        speakPhonemeSound(phonemeData, phoneme);
    }, 1800);
}

async function speakText(text, rateType = 'word') {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = await getVoicesAsync();
    const preferred = pickBestEnglishVoice(voices);
    if (preferred) {
        utterance.voice = preferred;
        utterance.lang = preferred.lang;
    } else {
        utterance.lang = getPreferredEnglishDialect();
    }
    utterance.rate = getSpeechRate(rateType);
    utterance.pitch = 1.0;
    speakUtterance(utterance);
}

function speakSpelling(grapheme) {
    if (!grapheme) return;
    const letters = grapheme
        .toString()
        .toUpperCase()
        .split('')
        .join(' ');
    speakText(letters, 'phoneme');
}

function normalizePhonemeForTTS(sound) {
    if (!sound) return '';
    let cleaned = sound.toString().replace(/[\/\[\]]/g, '').trim().toLowerCase();
    const multiMap = {
        'iː': 'ee',
        'uː': 'oo',
        'eɪ': 'ay',
        'aɪ': 'eye',
        'oʊ': 'oh',
        'aʊ': 'ow',
        'ɔɪ': 'oy',
        'ɜː': 'er'
    };
    Object.entries(multiMap).forEach(([key, value]) => {
        cleaned = cleaned.replace(new RegExp(key, 'g'), value);
    });
    const charMap = {
        'æ': 'aeh',
        'ɑ': 'ah',
        'ɒ': 'aw',
        'ɔ': 'aw',
        'ə': 'uh',
        'ʌ': 'uh',
        'ɛ': 'eh',
        'ɪ': 'ih',
        'ʊ': 'oo',
        'ʃ': 'sh',
        'ʒ': 'zh',
        'ʧ': 'ch',
        'ʤ': 'j',
        'θ': 'th',
        'ð': 'th',
        'ŋ': 'ng',
        'ɜ': 'er',
        'ː': ''
    };
    cleaned = cleaned.replace(/[æɑɒɔəʌɛɪʊʃʒʧʤθðŋɜː]/g, (match) => charMap[match] || match);
    return cleaned.replace(/\s+/g, ' ').trim();
}

const SOUND_TTS_MAP = {
    a: 'short a, as in cat',
    e: 'short e, as in bed',
    i: 'short i, as in sit',
    o: 'short o, as in top',
    u: 'short u, as in up',
    ay: 'ay',
    ee: 'ee',
    igh: 'eye',
    oa: 'oh',
    oo: 'oo',
    ow: 'ow',
    ou: 'ow',
    oi: 'oy',
    oy: 'oy',
    aw: 'aw',
    ah: 'ah',
    ar: 'ar',
    er: 'er',
    ir: 'er',
    or: 'or',
    ur: 'er',
    'oo-short': 'short oo, as in book',
    air: 'air, as in chair',
    ear: 'ear, as in near',
    ure: 'ure, as in pure',
    sh: 'sh',
    ch: 'ch',
    th: 'th',
    'th-voiced': 'th',
    zh: 'zh',
    ng: 'ng',
    ph: 'f',
    wh: 'wh',
    b: 'buh',
    p: 'puh',
    d: 'duh',
    t: 'tuh',
    g: 'guh',
    k: 'kuh',
    f: 'fff',
    v: 'vuh',
    s: 'sss',
    z: 'zzz',
    h: 'huh',
    j: 'juh',
    l: 'lll',
    r: 'rrr',
    w: 'wuh',
    y: 'yuh',
    m: 'mmm',
    n: 'nnn'
};

function getSoundTtsFromKey(soundKey = '') {
    const key = soundKey.toString().toLowerCase();
    return SOUND_TTS_MAP[key] || '';
}

function isShortVowelSound(soundKey = '', phoneme = null) {
    const key = soundKey.toString().toLowerCase();
    const shortVowels = ['a', 'e', 'i', 'o', 'u'];
    if (!shortVowels.includes(key)) return false;
    if (phoneme?.name && phoneme.name.toLowerCase().includes('short')) return true;
    return true;
}

function getPhonemeTts(phoneme, soundKey = '') {
    if (!phoneme) return '';
    if (phoneme.tts) return phoneme.tts;
    const override = getSoundTtsFromKey(soundKey);
    if (override) return override;
    const rawSound = phoneme.sound ? phoneme.sound.toString().replace(/[\/\[\]]/g, '').trim() : '';
    const normalized = normalizePhonemeForTTS(rawSound);
    if (normalized) return normalized;
    if (rawSound) return rawSound;
    if (phoneme.grapheme) return phoneme.grapheme.toString().toLowerCase();
    if (soundKey) return soundKey.toString().toLowerCase();
    return '';
}

async function speakPhonemeSound(phoneme, soundKey = '') {
    const tts = getPhonemeTts(phoneme, soundKey);
    if (!tts) return;
    const key = soundKey || phoneme?.grapheme || '';
    if (key) {
        const played = await tryPlayRecordedPhoneme(key);
        if (played) return;
    }
    speakText(tts, 'phoneme');
}

function initPhonemeCards() {
    const cards = document.querySelectorAll('.phoneme-card');

    let initialized = 0;
    cards.forEach(card => {
        if (card.dataset.mouthInit === 'true') return;
        card.dataset.mouthInit = 'true';
        initialized += 1;

        card.addEventListener('click', () => {
            const sound = card.dataset.sound;
            if (!sound) return;

            const phonemeData = window.getPhonemeData ? window.getPhonemeData(sound) : null;
            showPhonemeMouth(sound, phonemeData);
        });
    });

    if (initialized > 0) {
        console.log('✓ Initialized', initialized, 'phoneme cards with mouth animations');
    }
}

function showPhonemeMouth(sound, phonemeData) {
    if (phonemeData) {
        selectSound(sound, phonemeData);
        speakPhonemeSound(phonemeData, sound);
    }
    const mouthDisplay = document.getElementById('phoneme-mouth-display');
    if (mouthDisplay) mouthDisplay.remove();
}

function setWarmupOpen(isOpen) {
    document.body.classList.toggle('warmup-open', isOpen);
    setFunHudSuspended(isOpen);
}

function openPhonemeGuide(preselectSound = null) {
    modalOverlay.classList.remove('hidden');
    const phonemeModal = document.getElementById('phoneme-modal');
    if (!phonemeModal) {
        console.error("phoneme-modal element not found!");
        return;
    }
    clearSoundSelection();
    phonemeModal.classList.remove('hidden');
    setWarmupOpen(true);
    if (preselectSound) {
        prefetchPhonemeClips([preselectSound]);
    } else {
        prefetchWarmupPhonemes();
    }

    try {
        if (typeof populatePhonemeGrid === 'function') {
            populatePhonemeGrid(preselectSound);
        } else {
            console.error("populatePhonemeGrid function not found!");
        }
    } catch (e) {
        console.error("Error populating phoneme grid:", e);
    }
}


/* ==========================================
   MULTILINGUAL GLOSSARY (No API Required)
   Curated translations for high-frequency words
   ========================================== */

// Curated multilingual glossary
// Translation system loaded from translations.js
// window.TRANSLATIONS provides rich multilingual data:
// - word: native script translation
// - def: definition in home language  
// - sentence: example sentence translated
// - phonetic: pronunciation guide

function getWordTranslation(word, langCode) {
    const wordLower = word.toLowerCase();
    // Use window.TRANSLATIONS from translations.js (loaded via script tag)
    if (window.TRANSLATIONS) {
        if (typeof window.TRANSLATIONS.getTranslation === 'function') {
            return window.TRANSLATIONS.getTranslation(wordLower, langCode);
        }
        if (window.TRANSLATIONS[wordLower] && window.TRANSLATIONS[wordLower][langCode]) {
            return window.TRANSLATIONS[wordLower][langCode];
        }
    }
    return null;
}


/* Self-Contained Phoneme Voice Management */
let phonemeRecorder = null;
let phonemeAudioChunks = [];
let currentPhonemeForRecording = null;

function initVoiceSourceControls() {
    // Toggle voice source
    const voiceRadios = document.getElementsByName('guide-voice-source');
    voiceRadios.forEach(radio => {
        radio.closest('.voice-option').addEventListener('click', function() {
            const radioInput = this.querySelector('input[type="radio"]');
            radioInput.checked = true;
            
            // Update styling
            document.querySelectorAll('.voice-option').forEach(opt => {
                opt.style.borderColor = '#d0d0d0';
                opt.style.background = 'white';
            });
            this.style.borderColor = 'var(--color-correct)';
            this.style.background = '#f0f8f5';
            
            if (radioInput.value === 'system') {
                showToast('Using system voice');
            } else {
                showToast('Using your recorded voice');
            }
        });
    });
    
    // When clicking a phoneme card, set it as current for recording (Teacher Studio only)
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.phoneme-card');
        if (card && card.dataset.sound) {
            currentPhonemeForRecording = card.dataset.sound;
            const displayEl = document.getElementById('current-phoneme-recording');
            if (displayEl) {
                displayEl.textContent = card.dataset.sound;
            }
        }
    });
}

/* First-Time Tutorial */
function initTutorial() {
    const tutorialShown = localStorage.getItem('tutorialShown');
    const welcomeModal = document.getElementById('welcome-modal');
    const startBtn = document.getElementById('start-playing-btn');
    const dontShowCheckbox = document.getElementById('dont-show-tutorial');
    
    if (!tutorialShown && welcomeModal) {
        if (modalOverlay) modalOverlay.classList.remove('hidden');
        welcomeModal.classList.remove('hidden');
    }
    
    if (startBtn) {
        startBtn.onclick = () => {
            if (dontShowCheckbox && dontShowCheckbox.checked) {
                localStorage.setItem('tutorialShown', 'true');
            }
            closeModal();
        };
    }
}

/* Focus Panel Toggle */
function initFocusToggle() {
    const toggleBtn = document.getElementById('focus-toggle-btn');
    const focusPanel = document.getElementById('focus-panel');
    
    if (toggleBtn && focusPanel) {
        toggleBtn.onclick = () => {
            const isHidden = focusPanel.classList.contains('hidden');
            
            if (isHidden) {
                focusPanel.classList.remove('hidden');
                toggleBtn.classList.add('expanded');
                toggleBtn.textContent = '▼ Hide';
            } else {
                focusPanel.classList.add('hidden');
                toggleBtn.classList.remove('expanded');
                toggleBtn.textContent = '💡 Hints';
            }
        };
    }
}

function initHowTo() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    if (document.getElementById('howto-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'howto-btn';
    btn.type = 'button';
    btn.className = 'link-btn howto-icon-btn';
    btn.textContent = '?';
    btn.setAttribute('aria-label', 'How to Play');
    btn.title = 'How to Play';
    btn.addEventListener('click', openHowToModal);
    headerActions.appendChild(btn);
}

function initClozeLink() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('cloze-btn')) return;
    const link = document.createElement('a');
    link.id = 'cloze-btn';
    link.href = 'cloze.html';
    link.className = 'link-btn';
    link.textContent = 'Story Fill';
    link.title = 'Cloze';
    const madlibsLink = Array.from(headerActions.querySelectorAll('a, button'))
        .find(el => (el.textContent || '').toLowerCase().includes('mad libs'));
    if (madlibsLink) {
        headerActions.insertBefore(link, madlibsLink);
    } else {
        headerActions.appendChild(link);
    }
}

function initComprehensionLink() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('comprehension-btn')) return;
    const link = document.createElement('a');
    link.id = 'comprehension-btn';
    link.href = 'comprehension.html';
    link.className = 'link-btn';
    link.textContent = 'Read & Think';
    link.title = 'Comprehension';
    const madlibsLink = Array.from(headerActions.querySelectorAll('a, button'))
        .find(el => (el.textContent || '').toLowerCase().includes('mad libs'));
    if (madlibsLink) {
        headerActions.insertBefore(link, madlibsLink);
    } else {
        headerActions.appendChild(link);
    }
}

function initFluencyLink() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('fluency-btn')) return;
    const link = document.createElement('a');
    link.id = 'fluency-btn';
    link.href = 'fluency.html';
    link.className = 'link-btn';
    link.textContent = 'Speed Sprint';
    link.title = 'Fluency';
    const madlibsLink = Array.from(headerActions.querySelectorAll('a, button'))
        .find(el => (el.textContent || '').toLowerCase().includes('mad libs'));
    if (madlibsLink) {
        headerActions.insertBefore(link, madlibsLink);
    } else {
        headerActions.appendChild(link);
    }
}

function initAdventureMode() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('adventure-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'adventure-btn';
    btn.type = 'button';
    btn.className = 'link-btn';
    btn.textContent = 'Adventure';
    btn.title = 'Adventure Mode';
    btn.addEventListener('click', openAdventureModal);
    headerActions.insertBefore(btn, headerActions.firstChild);
}

function initClassroomDock() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('classroom-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'classroom-btn';
    btn.type = 'button';
    btn.className = 'link-btn';
    btn.textContent = 'Classroom';
    btn.addEventListener('click', () => toggleClassroomDock());
    headerActions.insertBefore(btn, headerActions.firstChild);

    ensureClassroomDock();
    if (appSettings.classroom?.dockOpen) {
        toggleClassroomDock(true);
    }
}

let classroomFileUrl = null;
let classroomTimerId = null;
let classroomTimerRemaining = 0;
let classroomTimerDuration = 0;

function ensureClassroomDock() {
    let dock = document.getElementById('classroom-dock');
    if (dock) return dock;

    dock = document.createElement('div');
    dock.id = 'classroom-dock';
    dock.className = 'classroom-dock hidden';
    dock.innerHTML = `
        <div class="classroom-dock-header">
            <div>
                <h3>Classroom Dock</h3>
                <p>Keep slides and timers handy while you play.</p>
            </div>
            <div class="dock-actions">
                <button class="dock-popout" id="dock-popout" type="button">Open in new tab</button>
                <button class="dock-fullscreen" id="dock-fullscreen" type="button">Full screen</button>
                <button class="dock-close" aria-label="Close">✕</button>
            </div>
        </div>
        <div class="classroom-dock-tabs">
            <button class="dock-tab active" data-tab="slides">Slides</button>
            <button class="dock-tab" data-tab="timer">Timer</button>
        </div>
        <div class="classroom-dock-body">
            <div class="dock-panel" data-panel="slides">
                <label class="dock-upload">
                    <input id="dock-file-input" type="file" accept="application/pdf,image/*" />
                    <span>Upload PDF or image</span>
                </label>
                <div id="dock-file-name" class="dock-file-name">No file loaded yet.</div>
                <div id="dock-file-viewer" class="dock-file-viewer"></div>
                <p class="dock-hint">Tip: export slide decks as PDF for the cleanest view.</p>
            </div>
            <div class="dock-panel hidden" data-panel="timer">
                <div class="dock-timer-display" id="dock-timer-display">10:00</div>
                <div class="dock-timer-controls">
                    <button id="dock-timer-start" class="primary-btn" type="button">Start</button>
                    <button id="dock-timer-pause" class="secondary-btn" type="button">Pause</button>
                    <button id="dock-timer-reset" class="secondary-btn" type="button">Reset</button>
                </div>
                <div class="dock-timer-set">
                    <label for="dock-timer-select">Minutes</label>
                    <select id="dock-timer-select">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </select>
                </div>
                <p class="dock-hint">Pomodoro tip: 25 minutes focus, 5 minutes break.</p>
            </div>
        </div>
    `;
    document.body.appendChild(dock);

    dock.querySelector('.dock-close')?.addEventListener('click', () => {
        if (document.body.classList.contains('dock-only')) {
            window.close();
        } else {
            toggleClassroomDock(false);
        }
    });
    dock.querySelector('#dock-popout')?.addEventListener('click', openClassroomDockInNewTab);
    dock.querySelector('#dock-fullscreen')?.addEventListener('click', toggleClassroomDockFullscreen);
    dock.querySelectorAll('.dock-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            setClassroomDockTab(btn.dataset.tab || 'slides');
        });
    });

    const fileInput = dock.querySelector('#dock-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files?.[0];
            if (file) {
                loadClassroomFile(file);
            }
        });
    }

    initClassroomTimerControls(dock);
    return dock;
}

function ensureMoreToolsMenu() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('more-tools-btn')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'more-tools-wrapper';
    wrapper.innerHTML = `
        <button type="button" id="sound-lab-btn" class="link-btn ghost">Sound Lab</button>
        <button type="button" id="more-tools-btn" class="link-btn">More ▾</button>
        <div id="more-tools-menu" class="more-tools-menu hidden">
            <button type="button" id="menu-warmup" class="more-tools-item">Sounds Warm‑Up</button>
        </div>
    `;
    headerActions.appendChild(wrapper);

    const btn = wrapper.querySelector('#more-tools-btn');
    const menu = wrapper.querySelector('#more-tools-menu');
    const warmup = wrapper.querySelector('#menu-warmup');
    const soundLab = wrapper.querySelector('#sound-lab-btn');

    const closeMenu = () => menu.classList.add('hidden');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) closeMenu();
    });

    if (warmup) warmup.onclick = () => {
        closeMenu();
        openPhonemeGuide();
    };

    if (soundLab) {
        soundLab.addEventListener('click', () => openPhonemeGuide());
    }
}

function organizeHeaderActions() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || headerActions.dataset.organized === 'true') return;

    const moreWrapper = headerActions.querySelector('.more-tools-wrapper');
    const howtoBtn = headerActions.querySelector('#howto-btn');

    const findById = (id) => headerActions.querySelector(`#${id}`);
    const findByText = (text) => Array.from(headerActions.querySelectorAll('a,button'))
        .find(el => (el.textContent || '').toLowerCase().includes(text));

    const classroomBtn = findById('classroom-btn');
    const adventureBtn = findById('adventure-btn');
    const teacherBtn = findById('teacher-btn');
    const newWordBtn = findById('new-word-btn') || findByText('new word');
    const clozeBtn = findById('cloze-btn') || findByText('cloze');
    const compBtn = findById('comprehension-btn') || findByText('comprehension');
    const fluencyBtn = findById('fluency-btn') || findByText('fluency');
    const madlibsBtn = findById('madlibs-btn') || findByText('mad libs');

    const groupPrimary = document.createElement('div');
    groupPrimary.className = 'nav-group nav-group-primary';
    const groupModes = document.createElement('div');
    groupModes.className = 'nav-group nav-group-modes';
    const groupTools = document.createElement('div');
    groupTools.className = 'nav-group nav-group-tools';

    const existing = Array.from(headerActions.children);
    const used = new Set();

    const add = (el, group) => {
        if (!el || used.has(el)) return;
        used.add(el);
        group.appendChild(el);
    };

    add(classroomBtn, groupPrimary);
    add(teacherBtn, groupPrimary);

    add(newWordBtn, groupModes);
    add(adventureBtn, groupModes);
    add(clozeBtn, groupModes);
    add(compBtn, groupModes);
    add(fluencyBtn, groupModes);
    add(madlibsBtn, groupModes);

    if (moreWrapper) add(moreWrapper, groupTools);
    if (howtoBtn) add(howtoBtn, groupTools);

    existing.forEach(el => {
        if (!used.has(el)) groupTools.appendChild(el);
    });

    headerActions.innerHTML = '';
    if (groupPrimary.children.length) headerActions.appendChild(groupPrimary);
    if (groupModes.children.length) headerActions.appendChild(groupModes);
    if (groupTools.children.length) headerActions.appendChild(groupTools);
    headerActions.dataset.organized = 'true';

    if (newWordBtn) {
        newWordBtn.textContent = 'Word Quest';
        newWordBtn.title = 'New Word';
        newWordBtn.classList.add('active');
        newWordBtn.setAttribute('aria-current', 'page');
    }

    if (madlibsBtn) {
        madlibsBtn.textContent = 'Silly Stories';
        madlibsBtn.title = 'Mad Libs';
    }

    if (adventureBtn) {
        adventureBtn.title = 'Adventure Mode';
    }

    if (classroomBtn) {
        classroomBtn.title = 'Classroom Tools';
    }

    if (teacherBtn) {
        teacherBtn.title = 'Teacher Settings';
    }
}

function toggleClassroomDock(forceOpen = null) {
    const dock = ensureClassroomDock();
    if (!dock) return;
    const willOpen = forceOpen === null ? dock.classList.contains('hidden') : forceOpen;
    dock.classList.toggle('hidden', !willOpen);
    appSettings.classroom.dockOpen = willOpen;
    saveSettings();
}

function getActiveDockTab() {
    const dock = document.getElementById('classroom-dock');
    if (!dock) return 'slides';
    const active = dock.querySelector('.dock-tab.active');
    return active?.dataset.tab || 'slides';
}

function openClassroomDockInNewTab() {
    const tab = getActiveDockTab();
    const url = new URL(window.location.href);
    url.searchParams.set('dock', tab);
    window.open(url.toString(), '_blank', 'noopener');
}

function toggleClassroomDockFullscreen() {
    const dock = document.getElementById('classroom-dock');
    if (!dock) return;
    if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
    }
    if (dock.requestFullscreen) {
        dock.requestFullscreen();
    }
}

function setClassroomDockTab(tab) {
    const dock = document.getElementById('classroom-dock');
    if (!dock) return;
    dock.querySelectorAll('.dock-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    dock.querySelectorAll('.dock-panel').forEach(panel => {
        panel.classList.toggle('hidden', panel.dataset.panel !== tab);
    });
}

function loadClassroomFile(file) {
    if (classroomFileUrl) {
        URL.revokeObjectURL(classroomFileUrl);
        classroomFileUrl = null;
    }

    const viewer = document.getElementById('dock-file-viewer');
    const name = document.getElementById('dock-file-name');
    if (!viewer || !name) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        showToast('Please upload a PDF or image file.');
        return;
    }

    classroomFileUrl = URL.createObjectURL(file);
    name.textContent = file.name;

    if (file.type === 'application/pdf') {
        viewer.innerHTML = `<iframe title="Classroom PDF" src="${classroomFileUrl}" frameborder="0"></iframe>`;
    } else {
        viewer.innerHTML = `<img src="${classroomFileUrl}" alt="Classroom slide" />`;
    }
}

function initClassroomTimerControls(dock) {
    const display = dock.querySelector('#dock-timer-display');
    const startBtn = dock.querySelector('#dock-timer-start');
    const pauseBtn = dock.querySelector('#dock-timer-pause');
    const resetBtn = dock.querySelector('#dock-timer-reset');
    const select = dock.querySelector('#dock-timer-select');

    const initialMinutes = Number(appSettings.classroom?.timerMinutes || 10);
    if (select) select.value = String(initialMinutes);
    setClassroomTimerMinutes(initialMinutes);

    if (select) {
        select.addEventListener('change', () => {
            const minutes = Number(select.value || 10);
            setClassroomTimerMinutes(minutes);
        });
    }

    if (startBtn) startBtn.addEventListener('click', startClassroomTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseClassroomTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetClassroomTimer);

    if (display) updateClassroomTimerDisplay();
}

function setClassroomTimerMinutes(minutes = 10) {
    const clamped = Math.max(1, Math.min(60, Number(minutes) || 10));
    classroomTimerDuration = clamped * 60;
    if (!classroomTimerRemaining || !classroomTimerId) {
        classroomTimerRemaining = classroomTimerDuration;
    }
    appSettings.classroom.timerMinutes = clamped;
    saveSettings();
    updateClassroomTimerDisplay();
}

function updateClassroomTimerDisplay() {
    const display = document.getElementById('dock-timer-display');
    if (!display) return;
    display.textContent = formatTime(classroomTimerRemaining || classroomTimerDuration || 0);
}

function startClassroomTimer() {
    if (classroomTimerId) return;
    if (!classroomTimerRemaining) classroomTimerRemaining = classroomTimerDuration || 0;
    classroomTimerId = setInterval(() => {
        classroomTimerRemaining = Math.max(0, classroomTimerRemaining - 1);
        updateClassroomTimerDisplay();
        if (classroomTimerRemaining <= 0) {
            pauseClassroomTimer();
            showToast('⏱️ Time! Great focus.');
        }
    }, 1000);
}

function pauseClassroomTimer() {
    if (classroomTimerId) {
        clearInterval(classroomTimerId);
        classroomTimerId = null;
    }
}

function resetClassroomTimer() {
    pauseClassroomTimer();
    classroomTimerRemaining = classroomTimerDuration || 0;
    updateClassroomTimerDisplay();
}

function ensureAdventureModal() {
    let modal = document.getElementById('adventure-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'adventure-modal';
    modal.className = 'modal hidden adventure-modal';
    modal.dataset.overlayClose = 'true';
    modal.innerHTML = `
        <div class="modal-content adventure-content">
            <button class="close-btn" aria-label="Close">✕</button>
            <h2>Choose Your Adventure</h2>
            <p class="adventure-subtitle">Pick a mode, then press “Start” to play.</p>

            <div class="adventure-grid">
                <label class="adventure-card">
                    <input type="checkbox" id="adventure-team-toggle" />
                    <div class="adventure-card-body">
                        <h3>Team Battle</h3>
                        <p>Two teams take turns. The team that cracks the code earns coins.</p>
                    </div>
                </label>

                <label class="adventure-card">
                    <input type="checkbox" id="adventure-timer-toggle" />
                    <div class="adventure-card-body">
                        <h3>Lightning Round</h3>
                        <p>Beat the timer to win. Perfect for fast practice.</p>
                        <div class="adventure-timer-row">
                            <span>Time limit</span>
                            <select id="adventure-timer-seconds">
                                <option value="30">30s</option>
                                <option value="45">45s</option>
                                <option value="60">60s</option>
                                <option value="90">90s</option>
                            </select>
                        </div>
                    </div>
                </label>

                <label class="adventure-card">
                    <input type="checkbox" id="adventure-challenge-toggle" />
                    <div class="adventure-card-body">
                        <h3>Challenge Mode</h3>
                        <p>Hearts appear only in Challenge Mode. Lose one on a miss.</p>
                    </div>
                </label>
            </div>

            <p class="adventure-note">Coins track wins. Hearts only appear in Challenge Mode.</p>

            <div class="adventure-team-settings" id="adventure-team-settings">
                <h3>Teams</h3>
                <div class="adventure-team-row">
                    <label>Team A</label>
                    <input id="team-a-name" type="text" maxlength="18" />
                </div>
                <div class="adventure-team-row">
                    <label>Team B</label>
                    <input id="team-b-name" type="text" maxlength="18" />
                </div>
                <div class="adventure-team-row" id="adventure-turn-row">
                    <span class="adventure-active-label">Current Turn</span>
                    <button type="button" id="adventure-switch-team" class="secondary-btn">Switch Team</button>
                    <span id="adventure-active-team" class="adventure-active-team"></span>
                </div>
            </div>

            <div class="adventure-actions">
                <button type="button" id="adventure-start" class="primary-btn">Start Adventure</button>
                <button type="button" id="adventure-reset-coins" class="secondary-btn">Reset Team Coins</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-btn')?.addEventListener('click', closeModal);
    initAdventureControls();
    return modal;
}

function openAdventureModal() {
    const modal = ensureAdventureModal();
    if (!modalOverlay) return;
    hydrateAdventureUI();
    modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    document.body.classList.add('adventure-open');
}

function hydrateAdventureUI() {
    const teamToggle = document.getElementById('adventure-team-toggle');
    const timerToggle = document.getElementById('adventure-timer-toggle');
    const challengeToggle = document.getElementById('adventure-challenge-toggle');
    const timerSelect = document.getElementById('adventure-timer-seconds');
    const teamSettings = document.getElementById('adventure-team-settings');
    const teamAInput = document.getElementById('team-a-name');
    const teamBInput = document.getElementById('team-b-name');
    const activeTeam = document.getElementById('adventure-active-team');
    const turnRow = document.getElementById('adventure-turn-row');

    if (teamToggle) teamToggle.checked = !!appSettings.gameMode?.teamMode;
    if (timerToggle) timerToggle.checked = !!appSettings.gameMode?.timerEnabled;
    if (challengeToggle) challengeToggle.checked = !!appSettings.funHud?.challenge;
    if (timerSelect) timerSelect.value = String(appSettings.gameMode?.timerSeconds || 60);

    if (teamAInput) teamAInput.value = appSettings.gameMode?.teamAName || 'Team A';
    if (teamBInput) teamBInput.value = appSettings.gameMode?.teamBName || 'Team B';

    if (teamSettings) {
        teamSettings.style.display = appSettings.gameMode?.teamMode ? 'block' : 'none';
    }
    if (activeTeam) activeTeam.textContent = getActiveTeamLabel();
    if (turnRow) {
        turnRow.style.display = appSettings.gameMode?.teamMode ? 'grid' : 'none';
    }
}

function initAdventureControls() {
    const teamToggle = document.getElementById('adventure-team-toggle');
    const timerToggle = document.getElementById('adventure-timer-toggle');
    const challengeToggle = document.getElementById('adventure-challenge-toggle');
    const timerSelect = document.getElementById('adventure-timer-seconds');
    const teamSettings = document.getElementById('adventure-team-settings');
    const teamAInput = document.getElementById('team-a-name');
    const teamBInput = document.getElementById('team-b-name');
    const switchTeamBtn = document.getElementById('adventure-switch-team');
    const activeTeam = document.getElementById('adventure-active-team');
    const startBtn = document.getElementById('adventure-start');
    const resetCoinsBtn = document.getElementById('adventure-reset-coins');

    if (teamToggle) {
        teamToggle.addEventListener('change', () => {
            appSettings.gameMode.teamMode = teamToggle.checked;
            if (teamSettings) teamSettings.style.display = teamToggle.checked ? 'block' : 'none';
            const turnRow = document.getElementById('adventure-turn-row');
            if (turnRow) turnRow.style.display = teamToggle.checked ? 'grid' : 'none';
            saveSettings();
            renderFunHud();
        });
    }

    if (timerToggle) {
        timerToggle.addEventListener('change', () => {
            appSettings.gameMode.timerEnabled = timerToggle.checked;
            saveSettings();
            resetLightningTimer();
            renderFunHud();
        });
    }

    if (timerSelect) {
        timerSelect.addEventListener('change', () => {
            appSettings.gameMode.timerSeconds = Number(timerSelect.value) || 60;
            saveSettings();
            resetLightningTimer();
        });
    }

    if (challengeToggle) {
        challengeToggle.addEventListener('change', () => {
            appSettings.funHud.challenge = challengeToggle.checked;
            if (challengeToggle.checked && (!appSettings.funHud.hearts || appSettings.funHud.hearts < 1)) {
                appSettings.funHud.hearts = appSettings.funHud.maxHearts || 3;
            }
            saveSettings();
            renderFunHud();
        });
    }

    if (teamAInput) {
        teamAInput.addEventListener('input', () => {
            appSettings.gameMode.teamAName = teamAInput.value.trim() || 'Team A';
            if (activeTeam) activeTeam.textContent = getActiveTeamLabel();
            saveSettings();
            renderFunHud();
        });
    }

    if (teamBInput) {
        teamBInput.addEventListener('input', () => {
            appSettings.gameMode.teamBName = teamBInput.value.trim() || 'Team B';
            if (activeTeam) activeTeam.textContent = getActiveTeamLabel();
            saveSettings();
            renderFunHud();
        });
    }

    if (switchTeamBtn) {
        switchTeamBtn.addEventListener('click', () => {
            toggleActiveTeam();
            if (activeTeam) activeTeam.textContent = getActiveTeamLabel();
            renderFunHud();
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            closeModal();
            startNewGame();
        });
    }

    if (resetCoinsBtn) {
        resetCoinsBtn.addEventListener('click', () => {
            appSettings.gameMode.teamACoins = 0;
            appSettings.gameMode.teamBCoins = 0;
            saveSettings();
            renderFunHud();
            showToast('Team coins reset.');
        });
    }
}

function getActiveTeamKey() {
    return (appSettings.gameMode?.activeTeam || 'A').toUpperCase();
}

function getActiveTeamLabel() {
    const key = getActiveTeamKey();
    return key === 'A' ? (appSettings.gameMode?.teamAName || 'Team A') : (appSettings.gameMode?.teamBName || 'Team B');
}

function toggleActiveTeam() {
    const next = getActiveTeamKey() === 'A' ? 'B' : 'A';
    appSettings.gameMode.activeTeam = next;
    saveSettings();
}

let lightningTimer = null;
let lightningRemaining = 0;
let lastGuessTeam = 'A';

function formatTime(seconds = 0) {
    const clamped = Math.max(0, Math.floor(seconds));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function resetLightningTimer() {
    stopLightningTimer();
    if (!appSettings.gameMode?.timerEnabled) {
        lightningRemaining = 0;
        renderFunHud();
        return;
    }
    lightningRemaining = appSettings.gameMode.timerSeconds || 60;
    startLightningTimer();
    renderFunHud();
}

function startLightningTimer() {
    stopLightningTimer();
    if (!appSettings.gameMode?.timerEnabled) return;
    if (!lightningRemaining) {
        lightningRemaining = appSettings.gameMode.timerSeconds || 60;
    }
    lightningTimer = setInterval(() => {
        lightningRemaining -= 1;
        if (lightningRemaining <= 0) {
            lightningRemaining = 0;
            stopLightningTimer();
            if (!gameOver) {
                gameOver = true;
                showEndModal(false);
            }
        }
        renderFunHud();
    }, 1000);
}

function stopLightningTimer() {
    if (lightningTimer) {
        clearInterval(lightningTimer);
        lightningTimer = null;
    }
}
function ensureHowToModal() {
    let modal = document.getElementById('howto-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'howto-modal';
    modal.className = 'modal hidden howto-modal';
    modal.dataset.overlayClose = 'true';
    modal.innerHTML = `
        <div class="modal-content howto-content">
            <button class="close-btn" aria-label="Close">✕</button>
            <h2>How to Play</h2>
            <p class="howto-subtitle">Quick steps for students and teachers.</p>
            <div class="howto-section">
                <h3>1) Guess the word</h3>
                <ul>
                    <li>Type a word, then press Enter.</li>
                    <li><span class="chip correct"></span> Green = correct spot.</li>
                    <li><span class="chip present"></span> Gold = in the word, wrong spot.</li>
                    <li><span class="chip absent"></span> Slate = not in the word.</li>
                </ul>
            </div>
            <div class="howto-section">
                <h3>2) Use audio tools</h3>
                <ul>
                    <li>Hear Word / Definition / Sentence in the reveal card.</li>
                    <li>Warm‑Up: tap a sound to see mouth cues and hear it.</li>
                </ul>
            </div>
            <div class="howto-section">
                <h3>3) Fun mode (optional)</h3>
                <ul>
                    <li>Coins track progress. Hearts are optional in Challenge mode.</li>
                    <li>Teachers can toggle fun, sound effects, and difficulty.</li>
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-btn')?.addEventListener('click', closeModal);
    return modal;
}

function openHowToModal() {
    const modal = ensureHowToModal();
    if (!modalOverlay) return;
    modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}

function initAssessmentFlow() {
    ensureAssessmentControls();
}

function ensureAssessmentModal() {
    let modal = document.getElementById('assessment-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'assessment-modal';
    modal.className = 'modal hidden assessment-modal';
    modal.dataset.overlayClose = 'true';
    modal.innerHTML = `
        <div class="modal-content assessment-content">
            <button class="close-btn" aria-label="Close">✕</button>
            <h2>Words Their Way Assessment</h2>
            <p class="assessment-subtitle">Dictate each word, then capture the student’s typed response.</p>

            <div class="assessment-setup" id="assessment-setup">
                <div class="assessment-row">
                    <label for="assessment-student">Student name</label>
                    <input id="assessment-student" type="text" placeholder="Student name" />
                </div>
                <div class="assessment-row">
                    <label for="assessment-class">Class / Group (optional)</label>
                    <input id="assessment-class" type="text" placeholder="Class or group" />
                </div>
                <div class="assessment-row">
                    <label for="assessment-inventory">Inventory</label>
                    <select id="assessment-inventory">
                        <option value="psi">Primary (PSI)</option>
                        <option value="esi">Elementary (ESI)</option>
                        <option value="usi">Upper-Level (USI)</option>
                    </select>
                </div>
                <div class="assessment-row">
                    <label for="assessment-mode">Mode</label>
                    <select id="assessment-mode">
                        <option value="assessment">Assessment (official list)</option>
                        <option value="practice">Practice (similar patterns)</option>
                    </select>
                </div>
                <div class="assessment-row assessment-practice-row">
                    <label for="assessment-count">Practice words</label>
                    <input id="assessment-count" type="number" min="5" max="30" value="10" />
                </div>
                <button type="button" id="assessment-start" class="primary-btn">Start</button>
            </div>

            <div class="assessment-play hidden" id="assessment-play">
                <div class="assessment-hud">
                    <div class="assessment-progress">Word <span id="assessment-index">1</span> of <span id="assessment-total">10</span></div>
                    <div class="assessment-quest">Quest Coins: <span id="assessment-coins">0</span></div>
                    <div class="assessment-streak">Streak: <span id="assessment-streak">0</span></div>
                </div>
                <div class="assessment-prompt">Listen and type the word.</div>
                <div class="assessment-buttons">
                    <button type="button" id="assessment-play-prompt" class="secondary-btn">Play prompt</button>
                    <button type="button" id="assessment-play-word" class="secondary-btn">Play word</button>
                    <button type="button" id="assessment-play-sentence" class="secondary-btn">Play sentence</button>
                </div>
                <div class="assessment-input-row">
                    <input id="assessment-response" type="text" placeholder="Type the word here" />
                    <button type="button" id="assessment-submit" class="primary-btn">Submit</button>
                </div>
                <div id="assessment-feedback" class="assessment-feedback"></div>
                <div class="assessment-footer">
                    <button type="button" id="assessment-skip" class="secondary-btn">Skip</button>
                    <button type="button" id="assessment-stop" class="secondary-btn">End session</button>
                </div>
            </div>

            <div class="assessment-summary hidden" id="assessment-summary">
                <h3>Summary</h3>
                <div class="assessment-summary-grid">
                    <div><strong>Accuracy:</strong> <span id="assessment-accuracy"></span></div>
                    <div><strong>Correct:</strong> <span id="assessment-correct"></span></div>
                    <div><strong>Total:</strong> <span id="assessment-total-summary"></span></div>
                </div>
                <div id="assessment-feature-breakdown" class="assessment-feature-breakdown"></div>
                <div id="assessment-focus" class="assessment-note"></div>
                <div class="assessment-export">
                    <button type="button" id="assessment-export" class="primary-btn">Export CSV</button>
                    <button type="button" id="assessment-export-all" class="secondary-btn">Export all records</button>
                    <button type="button" id="assessment-restart" class="secondary-btn">Start another round</button>
                </div>
                <div class="assessment-note">Patterns are tagged for analysis and aligned with Words Their Way stages.</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-btn')?.addEventListener('click', closeModal);

    modal.querySelector('#assessment-start')?.addEventListener('click', startAssessment);
    modal.querySelector('#assessment-play-prompt')?.addEventListener('click', () => playAssessmentPrompt());
    modal.querySelector('#assessment-play-word')?.addEventListener('click', () => playAssessmentWord());
    modal.querySelector('#assessment-play-sentence')?.addEventListener('click', () => playAssessmentSentence());
    modal.querySelector('#assessment-submit')?.addEventListener('click', submitAssessmentWord);
    modal.querySelector('#assessment-skip')?.addEventListener('click', () => submitAssessmentWord(true));
    modal.querySelector('#assessment-stop')?.addEventListener('click', finishAssessment);
    modal.querySelector('#assessment-export')?.addEventListener('click', exportCurrentAssessment);
    modal.querySelector('#assessment-export-all')?.addEventListener('click', exportAllAssessments);
    modal.querySelector('#assessment-restart')?.addEventListener('click', restartAssessment);

    const responseInput = modal.querySelector('#assessment-response');
    responseInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitAssessmentWord();
        }
    });

    const modeSelect = modal.querySelector('#assessment-mode');
    const practiceRow = modal.querySelector('.assessment-practice-row');
    modeSelect?.addEventListener('change', () => {
        if (!practiceRow) return;
        practiceRow.style.display = modeSelect.value === 'practice' ? 'grid' : 'none';
    });

    return modal;
}

function openAssessmentModal() {
    const modal = ensureAssessmentModal();
    if (!modalOverlay) return;
    modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}

function ensureCorePhonicsModal() {
    let modal = document.getElementById('core-phonics-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'core-phonics-modal';
    modal.className = 'modal hidden core-phonics-modal';
    modal.dataset.overlayClose = 'true';
    modal.innerHTML = `
        <div class="modal-content core-phonics-content">
            <button class="close-btn" aria-label="Close">✕</button>
            <h2>Core Phonics Practice</h2>
            <p class="assessment-subtitle">Progressive decoding practice for small groups or independent work.</p>
            <div class="core-phonics-controls">
                <label for="core-phonics-level">Level</label>
                <select id="core-phonics-level"></select>
                <button type="button" id="core-phonics-shuffle" class="secondary-btn">Shuffle</button>
            </div>
            <div class="core-phonics-hud">
                <div>Word <span id="core-phonics-index">1</span> / <span id="core-phonics-total">1</span></div>
                <div>Quest Coins: <span id="core-phonics-coins">0</span></div>
            </div>
            <div class="core-phonics-card">
                <div id="core-phonics-word" class="core-phonics-word">cat</div>
            </div>
            <div class="core-phonics-actions">
                <button type="button" id="core-phonics-play" class="secondary-btn">Play word</button>
                <button type="button" id="core-phonics-next" class="primary-btn">I read it!</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-btn')?.addEventListener('click', closeModal);
    modal.querySelector('#core-phonics-play')?.addEventListener('click', playCorePhonicsWord);
    modal.querySelector('#core-phonics-next')?.addEventListener('click', advanceCorePhonics);
    modal.querySelector('#core-phonics-shuffle')?.addEventListener('click', shuffleCorePhonics);

    const select = modal.querySelector('#core-phonics-level');
    select.innerHTML = '';
    CORE_PHONICS_LEVELS.forEach(level => {
        const option = document.createElement('option');
        option.value = level.id;
        option.textContent = level.label;
        select.appendChild(option);
    });
    select.addEventListener('change', () => {
        startCorePhonics(select.value);
    });
    return modal;
}

function openCorePhonicsModal() {
    const modal = ensureCorePhonicsModal();
    if (!modalOverlay) return;
    modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    const select = modal.querySelector('#core-phonics-level');
    startCorePhonics(select?.value || CORE_PHONICS_LEVELS[0].id);
}

let corePhonicsState = null;

function startCorePhonics(levelId) {
    const level = CORE_PHONICS_LEVELS.find(item => item.id === levelId) || CORE_PHONICS_LEVELS[0];
    corePhonicsState = {
        levelId: level.id,
        words: [...level.words],
        index: 0,
        coins: 0
    };
    updateCorePhonicsUI();
}

function updateCorePhonicsUI() {
    if (!corePhonicsState) return;
    const modal = ensureCorePhonicsModal();
    const word = corePhonicsState.words[corePhonicsState.index] || '';
    modal.querySelector('#core-phonics-word').textContent = word.toUpperCase();
    modal.querySelector('#core-phonics-index').textContent = `${corePhonicsState.index + 1}`;
    modal.querySelector('#core-phonics-total').textContent = `${corePhonicsState.words.length}`;
    modal.querySelector('#core-phonics-coins').textContent = `${corePhonicsState.coins}`;
}

function playCorePhonicsWord() {
    if (!corePhonicsState) return;
    const word = corePhonicsState.words[corePhonicsState.index];
    if (word) speakText(word, 'word');
}

function advanceCorePhonics() {
    if (!corePhonicsState) return;
    corePhonicsState.coins += 1;
    corePhonicsState.index = (corePhonicsState.index + 1) % corePhonicsState.words.length;
    updateCorePhonicsUI();
}

function shuffleCorePhonics() {
    if (!corePhonicsState) return;
    corePhonicsState.words = shuffleList(corePhonicsState.words);
    corePhonicsState.index = 0;
    updateCorePhonicsUI();
}

function startAssessment() {
    const modal = ensureAssessmentModal();
    const student = modal.querySelector('#assessment-student')?.value.trim() || 'Student';
    const classGroup = modal.querySelector('#assessment-class')?.value.trim() || '';
    const inventoryId = modal.querySelector('#assessment-inventory')?.value || 'psi';
    const mode = modal.querySelector('#assessment-mode')?.value || 'assessment';
    const practiceCount = parseInt(modal.querySelector('#assessment-count')?.value || '10', 10);

    const inventory = WTW_INVENTORIES[inventoryId];
    const baseList = mode === 'practice'
        ? (WTW_PRACTICE_SETS[inventoryId] || inventory.words)
        : inventory.words;

    const list = mode === 'practice'
        ? shuffleList([...baseList]).slice(0, Math.max(5, Math.min(30, practiceCount || 10)))
        : [...baseList];

    assessmentState = {
        id: `wtw_${Date.now()}`,
        student,
        classGroup,
        inventoryId,
        inventoryLabel: inventory.label,
        mode,
        list,
        index: 0,
        responses: [],
        correct: 0,
        streak: 0,
        coins: 0,
        startedAt: new Date().toISOString(),
        endedAt: null
    };

    modal.querySelector('#assessment-setup')?.classList.add('hidden');
    modal.querySelector('#assessment-summary')?.classList.add('hidden');
    modal.querySelector('#assessment-play')?.classList.remove('hidden');
    updateAssessmentUI();
}

function restartAssessment() {
    const modal = ensureAssessmentModal();
    modal.querySelector('#assessment-summary')?.classList.add('hidden');
    modal.querySelector('#assessment-setup')?.classList.remove('hidden');
    modal.querySelector('#assessment-play')?.classList.add('hidden');
}

function updateAssessmentUI() {
    if (!assessmentState) return;
    const modal = ensureAssessmentModal();
    const total = assessmentState.list.length;
    const current = assessmentState.list[assessmentState.index];
    modal.querySelector('#assessment-index').textContent = `${assessmentState.index + 1}`;
    modal.querySelector('#assessment-total').textContent = `${total}`;
    modal.querySelector('#assessment-coins').textContent = `${assessmentState.coins}`;
    modal.querySelector('#assessment-streak').textContent = `${assessmentState.streak}`;
    modal.querySelector('#assessment-feedback').textContent = current ? `Target pattern: ${current.pattern}` : '';
    modal.querySelector('#assessment-response').value = '';
}

function playAssessmentPrompt() {
    const word = getAssessmentWord();
    if (!word) return;
    const sentence = buildAssessmentSentence(word);
    window.speechSynthesis.cancel();
    speakText(word, 'word');
    const delay1 = estimateSpeechDuration(word, getSpeechRate('word')) + 200;
    setTimeout(() => speakText(sentence, 'sentence'), delay1);
    const delay2 = delay1 + estimateSpeechDuration(sentence, getSpeechRate('sentence')) + 200;
    setTimeout(() => speakText(word, 'word'), delay2);
}

function playAssessmentWord() {
    const word = getAssessmentWord();
    if (word) speakText(word, 'word');
}

function playAssessmentSentence() {
    const word = getAssessmentWord();
    if (!word) return;
    speakText(buildAssessmentSentence(word), 'sentence');
}

function buildAssessmentSentence(word) {
    return `The word is ${word}.`;
}

function getAssessmentWord() {
    if (!assessmentState) return '';
    return assessmentState.list[assessmentState.index]?.word || '';
}

function submitAssessmentWord(isSkip = false) {
    if (!assessmentState) return;
    const modal = ensureAssessmentModal();
    const current = assessmentState.list[assessmentState.index];
    if (!current) return;
    const responseInput = modal.querySelector('#assessment-response');
    const response = isSkip ? '' : (responseInput?.value.trim() || '');
    const correct = !isSkip && response.toLowerCase() === current.word.toLowerCase();

    assessmentState.responses.push({
        word: current.word,
        pattern: current.pattern,
        response,
        correct,
        index: assessmentState.index + 1
    });

    if (correct) {
        assessmentState.correct += 1;
        assessmentState.streak += 1;
        assessmentState.coins += 2;
    } else {
        assessmentState.streak = 0;
    }

    assessmentState.index += 1;
    if (assessmentState.index >= assessmentState.list.length) {
        finishAssessment();
    } else {
        updateAssessmentUI();
    }
}

function finishAssessment() {
    if (!assessmentState) return;
    assessmentState.endedAt = new Date().toISOString();

    const modal = ensureAssessmentModal();
    modal.querySelector('#assessment-play')?.classList.add('hidden');
    modal.querySelector('#assessment-summary')?.classList.remove('hidden');

    const total = assessmentState.list.length;
    const accuracy = total ? Math.round((assessmentState.correct / total) * 100) : 0;
    modal.querySelector('#assessment-accuracy').textContent = `${accuracy}%`;
    modal.querySelector('#assessment-correct').textContent = `${assessmentState.correct}`;
    modal.querySelector('#assessment-total-summary').textContent = `${total}`;

    const breakdown = getFeatureBreakdown(assessmentState.responses);
    renderFeatureBreakdown(breakdown);
    renderFocusNote(breakdown, accuracy, assessmentState.inventoryId);

    saveAssessmentRecord(assessmentState);
}

function saveAssessmentRecord(record) {
    const key = 'wtw_assessment_records';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(record);
    localStorage.setItem(key, JSON.stringify(existing));
}

function exportCurrentAssessment() {
    if (!assessmentState) return;
    const csv = buildAssessmentCSV(assessmentState);
    downloadCSV(csv, `wtw_${assessmentState.student}_${assessmentState.inventoryId}.csv`);
}

function exportAllAssessments() {
    const key = 'wtw_assessment_records';
    const records = JSON.parse(localStorage.getItem(key) || '[]');
    if (!records.length) return showToast('No saved assessments yet.');
    const csv = records.map(buildAssessmentCSV).join('\n\n');
    downloadCSV(csv, `wtw_all_assessments.csv`);
}

function buildAssessmentCSV(record) {
    const header = [
        'Student',
        'Class',
        'Inventory',
        'Mode',
        'Word',
        'Pattern',
        'Response',
        'Correct',
        'Index',
        'Started At',
        'Ended At'
    ];
    const rows = record.responses.map(item => [
        record.student,
        record.classGroup || '',
        record.inventoryLabel,
        record.mode,
        item.word,
        item.pattern,
        item.response,
        item.correct ? 'Yes' : 'No',
        item.index,
        record.startedAt,
        record.endedAt || ''
    ]);
    const total = record.list.length;
    const accuracy = total ? Math.round((record.correct / total) * 100) : 0;
    const breakdown = getFeatureBreakdown(record.responses);
    const suggestion = getStageSuggestion(record.inventoryId, accuracy);
    rows.push([
        record.student,
        record.classGroup || '',
        record.inventoryLabel,
        record.mode,
        'Summary',
        '',
        '',
        '',
        `Accuracy ${accuracy}%`,
        '',
        ''
    ]);
    rows.push([
        record.student,
        record.classGroup || '',
        record.inventoryLabel,
        record.mode,
        'Placement Suggestion',
        suggestion,
        '',
        '',
        '',
        '',
        ''
    ]);
    Object.entries(breakdown).forEach(([feature, stats]) => {
        rows.push([
            record.student,
            record.classGroup || '',
            record.inventoryLabel,
            record.mode,
            'Feature Summary',
            feature,
            '',
            `${stats.correct}/${stats.total}`,
            '',
            '',
            ''
        ]);
    });
    return [header, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
}

function escapeCsv(value) {
    const str = String(value ?? '');
    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
        let c = i;
        for (let k = 0; k < 8; k += 1) {
            c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c >>> 0;
    }
    return table;
})();

function crc32(data) {
    let c = 0xffffffff;
    for (let i = 0; i < data.length; i += 1) {
        c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
}

function getDosDateTime(date = new Date()) {
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

function createZipArchive(files = []) {
    const encoder = new TextEncoder();
    const fileRecords = [];
    const chunks = [];
    let offset = 0;

    files.forEach(file => {
        const nameBytes = encoder.encode(file.name);
        const data = file.data || new Uint8Array();
        const { dosTime, dosDate } = getDosDateTime();
        const crc = crc32(data);

        const localHeader = new Uint8Array(30 + nameBytes.length);
        const view = new DataView(localHeader.buffer);
        view.setUint32(0, 0x04034b50, true);
        view.setUint16(4, 20, true);
        view.setUint16(6, 0, true);
        view.setUint16(8, 0, true);
        view.setUint16(10, dosTime, true);
        view.setUint16(12, dosDate, true);
        view.setUint32(14, crc, true);
        view.setUint32(18, data.length, true);
        view.setUint32(22, data.length, true);
        view.setUint16(26, nameBytes.length, true);
        view.setUint16(28, 0, true);
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
    fileRecords.forEach(record => {
        const centralHeader = new Uint8Array(46 + record.nameBytes.length);
        const view = new DataView(centralHeader.buffer);
        view.setUint32(0, 0x02014b50, true);
        view.setUint16(4, 20, true);
        view.setUint16(6, 20, true);
        view.setUint16(8, 0, true);
        view.setUint16(10, 0, true);
        view.setUint16(12, record.dosTime, true);
        view.setUint16(14, record.dosDate, true);
        view.setUint32(16, record.crc, true);
        view.setUint32(20, record.size, true);
        view.setUint32(24, record.size, true);
        view.setUint16(28, record.nameBytes.length, true);
        view.setUint16(30, 0, true);
        view.setUint16(32, 0, true);
        view.setUint16(34, 0, true);
        view.setUint16(36, 0, true);
        view.setUint32(38, 0, true);
        view.setUint32(42, record.offset, true);
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

function shuffleList(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function getFeatureBreakdown(responses = []) {
    return responses.reduce((acc, item) => {
        const key = item.pattern || 'Unknown';
        if (!acc[key]) acc[key] = { total: 0, correct: 0 };
        acc[key].total += 1;
        if (item.correct) acc[key].correct += 1;
        return acc;
    }, {});
}

function renderFeatureBreakdown(breakdown) {
    const container = document.getElementById('assessment-feature-breakdown');
    if (!container) return;
    container.innerHTML = '';
    const entries = Object.entries(breakdown);
    if (!entries.length) return;
    const list = document.createElement('div');
    list.className = 'assessment-feature-list';
    entries.forEach(([feature, stats]) => {
        const chip = document.createElement('div');
        chip.className = 'assessment-feature-chip';
        chip.textContent = `${feature}: ${stats.correct}/${stats.total}`;
        list.appendChild(chip);
    });
    container.appendChild(list);
}

function renderFocusNote(breakdown, accuracy = 0, inventoryId = '') {
    const container = document.getElementById('assessment-focus');
    if (!container) return;
    const entries = Object.entries(breakdown);
    if (!entries.length) {
        container.textContent = '';
        return;
    }
    const sorted = entries.sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total));
    const focus = sorted.slice(0, 3).map(([feature]) => feature);
    const suggestion = getStageSuggestion(inventoryId, accuracy);
    container.textContent = `Suggested focus patterns: ${focus.join(', ')}. ${suggestion}`;
}

function getStageSuggestion(inventoryId, accuracy) {
    if (inventoryId === 'psi') {
        return accuracy >= 85
            ? 'Placement suggestion: ready to try the Elementary Spelling Inventory.'
            : 'Placement suggestion: continue with Primary Spelling Inventory.';
    }
    if (inventoryId === 'esi') {
        return accuracy >= 85
            ? 'Placement suggestion: ready to try the Upper-Level Spelling Inventory.'
            : 'Placement suggestion: continue with Elementary Spelling Inventory.';
    }
    if (inventoryId === 'usi') {
        return accuracy >= 85
            ? 'Placement suggestion: strong derivational patterns; continue advanced instruction.'
            : 'Placement suggestion: continue with Upper-Level Spelling Inventory.';
    }
    return '';
}

function getDismissableModal() {
    const modals = getAllModalElements();
    const visible = modals.filter(modal => {
        const isVisible = !modal.classList.contains('hidden');
        const canClose = modal.dataset.overlayClose === 'true';
        return isVisible && canClose;
    });
    const infoModal = visible.find(modal => modal.id === 'info-modal');
    return infoModal || visible[0];
}

function initModalDismissals() {
    if (!modalOverlay) return;

    modalOverlay.addEventListener('click', (e) => {
        if (e.target !== modalOverlay) return;
        const active = getDismissableModal();
        if (active) {
            if (active.id === 'welcome-modal') {
                const startBtn = document.getElementById('start-playing-btn');
                if (startBtn) return startBtn.click();
            }
            if (active.id === 'info-modal') return closeInfoModal();
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const activeEl = document.activeElement;
        if (activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) return;
        const active = getDismissableModal();
        if (!active) return;
        if (active.id === 'welcome-modal') {
            const startBtn = document.getElementById('start-playing-btn');
            if (startBtn) return startBtn.click();
        }
        if (active.id === 'info-modal') return closeInfoModal();
        closeModal();
    });
}

// Initialize on page load handled above.
