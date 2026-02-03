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
    translation: {
        pinned: false,
        lang: 'en'
    },
    bonus: {
        frequency: 'often'
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
            soundWallSections: {
                ...DEFAULT_SETTINGS.soundWallSections,
                ...(parsed.soundWallSections || {})
            }
        };

        const migrated = localStorage.getItem('bonus_frequency_migrated');
        if (!migrated && (!parsed.bonus || parsed.bonus.frequency === 'sometimes')) {
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
    initAssessmentFlow();
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
            <div class="fun-hud-item">
                <span class="fun-hud-icon">❤️</span>
                <span class="fun-hud-value" id="fun-hud-hearts">3</span>
            </div>
            <div class="fun-hud-item">
                <span class="fun-hud-icon">🪙</span>
                <span class="fun-hud-value" id="fun-hud-coins">0</span>
            </div>
        `;
        document.body.appendChild(hud);
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
    if (hearts) hearts.textContent = String(appSettings.funHud?.hearts ?? 3);
    if (coins) coins.textContent = String(appSettings.funHud?.coins ?? 0);
}

function updateFunHudVisibility() {
    const hud = ensureFunHud();
    const enabled = !!appSettings.funHud?.enabled;
    hud.classList.toggle('hidden', !enabled);
    document.body.classList.toggle('fun-mode', enabled);
    document.body.classList.toggle('fun-studio', enabled && appSettings.funHud?.style === 'studio');
    if (enabled) renderFunHud();
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
}

function initTeacherTools() {
    ensureVoiceQualityHint();
    updateVoiceInstallPrompt();
    ensureAutoHearToggle();
    ensureFunHudControls();
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
    hearWord.onclick = () => speak(word, 'word');
    
    // Show "Hear sentence" only if sentence exists
    if (entry.sentence && entry.sentence.length > 5) {
        hearSentence.style.display = 'inline-block';
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
    
    // Show "Mouth guide" if we have a matching phoneme
    if (firstSound && canShowMouthPosition(firstSound)) {
        mouthPosition.style.display = 'inline-block';
        mouthPosition.onclick = () => openPhonemeGuideToSound(firstSound);
    } else {
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

function speakPhoneme(sound) {
    if (!sound) return;
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

    const insertAfter = (node, reference) => {
        if (!reference || !reference.parentElement) return;
        reference.parentElement.insertBefore(node, reference.nextSibling);
    };

    const translationParent = translationSelector?.parentElement;
    if (translationSelector && translationParent === modalContent) {
        if (audioControls.parentElement !== modalContent) {
            modalContent.insertBefore(audioControls, translationSelector);
        }
        if (actionRow.parentElement !== modalContent) {
            modalContent.insertBefore(actionRow, translationSelector);
        }
    } else if (sentenceEl && sentenceEl.parentElement) {
        if (audioControls.parentElement !== sentenceEl.parentElement) {
            insertAfter(audioControls, sentenceEl);
        }
        if (actionRow.parentElement !== audioControls.parentElement) {
            insertAfter(actionRow, audioControls);
        }
    } else {
        if (!modalContent.contains(audioControls)) modalContent.appendChild(audioControls);
        if (!modalContent.contains(actionRow)) modalContent.appendChild(actionRow);
    }
}

function showEndModal(win) {
    // Track progress
    trackProgress(currentWord, win, guesses.length);
    
    modalOverlay.classList.remove("hidden");
    gameModal.classList.remove("hidden");
    gameModal.dataset.overlayClose = 'true';
    gameModal.classList.toggle("win", win);
    gameModal.classList.toggle("loss", !win);
    document.getElementById("modal-title").textContent = win ? "Great Job!" : "Nice Try!";
    
    renderModalWord(currentWord);
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
        appSettings.funHud.coins = (appSettings.funHud.coins || 0) + 1;
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
    
    // Close new modals
    const decodableModal = document.getElementById("decodable-modal");
    const progressModal = document.getElementById("progress-modal");
    const phonemeModal = document.getElementById("phoneme-modal");
    const helpModal = document.getElementById("help-modal");
    const bonusModal = document.getElementById("bonus-modal");
    const infoModal = document.getElementById("info-modal");
    if (decodableModal) decodableModal.classList.add("hidden");
    if (progressModal) progressModal.classList.add("hidden");
    if (phonemeModal) phonemeModal.classList.add("hidden");
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

    const defaultSound = preselectSound || currentSelectedSound?.sound || 'a';
    selectSoundByKey(defaultSound);
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

    sounds.forEach(item => {
        const config = typeof item === 'string' ? { soundKey: item } : item;
        const phoneme = window.PHONEME_DATA[config.soundKey];
        if (!phoneme) return;
        const label = config.label || phoneme.grapheme || config.soundKey;
        const tile = createSoundTile(config.soundKey, phoneme, label, options.vowel);
        container.appendChild(tile);
    });
}

function buildSoundSectionGrouped(containerId, groups, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

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
            const label = config.label || phoneme.grapheme || config.soundKey;
            const tile = createSoundTile(config.soundKey, phoneme, label, options.vowel);
            row.appendChild(tile);
        });

        wrapper.appendChild(row);
        container.appendChild(wrapper);
    });
}

const SOUND_GUIDE_INFO = {
    short_vowels: {
        title: 'Short Vowels',
        body: 'Short vowels are quick, relaxed vowel sounds. They usually appear in short words.',
        examples: ['cat', 'bed', 'sit', 'hot', 'cup']
    },
    vowel_teams: {
        title: 'Vowel Teams',
        body: 'Two letters team up to make one vowel sound.',
        examples: ['rain', 'seed', 'boat', 'moon']
    },
    diphthongs: {
        title: 'Diphthongs',
        body: 'Two vowel sounds glide together in one syllable.',
        examples: ['cow', 'coin', 'toy', 'out']
    },
    digraphs: {
        title: 'Digraphs',
        body: 'Two letters make one new sound.',
        examples: ['ship', 'chip', 'thin', 'phone']
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
        body: 'These tiles match common letter sounds.',
        examples: ['b', 'm', 't', 's']
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
    const sounds = ['sh', 'ch', 'th', 'wh', 'ph'];
    return [
        ...sounds,
        { soundKey: 'k', label: 'CK' }
    ].filter(item => {
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
    const fallback = ['ay', 'ee', 'igh', 'oa', 'oo', 'ah'];
    const fromGroups = window.PHONEME_GROUPS?.vowels?.long || fallback;
    return fromGroups.filter(sound => window.PHONEME_DATA[sound]);
}

function getDiphthongSounds() {
    const fallback = ['ow', 'ou', 'oi', 'oy', 'aw'];
    const fromGroups = window.PHONEME_GROUPS?.vowels?.diphthongs || fallback;
    return fromGroups.filter(sound => window.PHONEME_DATA[sound]);
}

function getRControlledSounds() {
    const rSounds = ['ar', 'er', 'ir', 'or', 'ur'];
    return rSounds.filter(sound => window.PHONEME_DATA[sound]);
}

function getWeldedSounds() {
    const welded = ['ang', 'ing', 'ong', 'ung', 'ank', 'ink', 'onk', 'unk'];
    return welded.filter(sound => window.PHONEME_DATA[sound]);
}

function createSoundTile(soundKey, phoneme, label, isVowel = false) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `sound-tile${isVowel ? ' vowel' : ''}`;
    tile.dataset.sound = soundKey;
    tile.dataset.label = label;
    tile.textContent = label.toUpperCase();

    tile.onclick = () => {
        selectSound(soundKey, phoneme, label, tile);
    };

    return tile;
}

function selectSoundByKey(soundKey) {
    const tile = document.querySelector(`.sound-tile[data-sound="${soundKey}"]`);
    const phoneme = window.PHONEME_DATA[soundKey];
    if (phoneme) {
        selectSound(soundKey, phoneme, phoneme.grapheme || soundKey, tile);
    }
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
    const mouthClass = getMouthClass(phoneme);
    
    card.innerHTML = `
        <div class="phoneme-letter">${displayText}</div>
        <div class="mini-mouth"><div class="mouth ${mouthClass}"></div></div>
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
    const parts = [];
    if (phoneme.lips) parts.push(`Lips: ${phoneme.lips}`);
    if (phoneme.tongue) parts.push(`Tongue: ${phoneme.tongue}`);
    if (parts.length) return parts.join(' • ');
    return phoneme.cue || '';
}

function formatMouthDescription(phoneme) {
    if (!phoneme) return '';
    if (phoneme.example) return `Example: ${phoneme.example}`;
    return phoneme.description || '';
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

function ensureArticulationCard(phoneme) {
    let display = document.getElementById('selected-sound-display');
    if (!display) {
        display = document.querySelector('.sound-guide-card') || document.querySelector('.sound-guide-layout');
    }
    if (!display || !phoneme) return;
    let card = document.getElementById('articulation-card');
    if (!card) {
        card = document.createElement('div');
        card.id = 'articulation-card';
        card.className = 'articulation-card';
        card.innerHTML = `
            <div class="articulation-title">Articulation Card</div>
            <div class="articulation-visual">
                <div class="articulation-illustration">
                    <div class="articulation-mouth">
                        <div class="articulation-teeth"></div>
                        <div class="articulation-tongue"></div>
                        <div class="articulation-lips"></div>
                    </div>
                </div>
            </div>
            <div class="articulation-caption"></div>
        `;
        const selectedCard = display.querySelector('.selected-sound') || display.firstElementChild;
        if (selectedCard) {
            selectedCard.insertAdjacentElement('afterend', card);
        } else {
            display.appendChild(card);
        }
    }
    const illustration = card.querySelector('.articulation-illustration');
    if (illustration) {
        const shape = getArticulationShape(phoneme);
        illustration.className = `articulation-illustration shape-${shape}`;
    }
    const caption = card.querySelector('.articulation-caption');
    if (caption) {
        caption.textContent = formatMouthCue(phoneme);
    }
}

function selectSound(sound, phoneme, labelOverride = null, tile = null) {
    if (!phoneme) return;

    currentSelectedSound = { sound, phoneme, label: labelOverride };

    if (currentSelectedTile) {
        currentSelectedTile.classList.remove('selected');
    }
    if (tile) {
        tile.classList.add('selected');
        currentSelectedTile = tile;
    }

    const display = document.getElementById('selected-sound-display');
    if (display) display.classList.remove('hidden');

    const displayLabel = labelOverride || phoneme.grapheme || sound;
    const soundLetter = document.getElementById('sound-letter');
    if (soundLetter) soundLetter.textContent = displayLabel.toUpperCase();

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
        const mouthClass = getMouthClass(phoneme);
        mouthVisual.innerHTML = `<div class="mouth ${mouthClass}"></div>`;
    }

    ensureArticulationCard(phoneme);
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
    const hearSoundBtn = document.getElementById('hear-phoneme-sound');
    
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
    
    if (hearSoundBtn) {
        hearSoundBtn.onclick = () => {
            if (currentSelectedSound) {
                speakPhonemeSound(currentSelectedSound.phoneme, currentSelectedSound.sound);
            }
        };
    }
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
    let cleaned = sound.toString().replace(/[\/\[\]]/g, '').trim();
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
    a: 'aeh',
    e: 'eh',
    i: 'ih',
    o: 'aw',
    u: 'uh',
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

function speakPhonemeSound(phoneme, soundKey = '') {
    const tts = getPhonemeTts(phoneme, soundKey);
    if (!tts) return;
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
    // Create or get mouth display container
    let mouthDisplay = document.getElementById('phoneme-mouth-display');
    
    if (!mouthDisplay) {
        mouthDisplay = document.createElement('div');
        mouthDisplay.id = 'phoneme-mouth-display';
        mouthDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            text-align: center;
        `;
        document.body.appendChild(mouthDisplay);
    }
    
    // Build content
    const animation = phonemeData ? getMouthClass(phonemeData) : 'mouth-neutral';
    const cue = phonemeData ? phonemeData.cue : 'Watch the mouth';
    const description = phonemeData ? phonemeData.description : '';
    
    mouthDisplay.innerHTML = `
        <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 10px; color: #2c3e50;">
            ${sound.toUpperCase()} Sound
        </div>
        
        <div class="mouth-container">
            <div class="mouth ${animation}"></div>
        </div>
        
        ${phonemeData ? `
            <div class="phoneme-articulation">
                <div class="phoneme-cue">${cue}</div>
                <div class="phoneme-description">${description}</div>
                
                <div style="margin-top: 12px; font-size: 0.8rem; color: #888;">
                    <div>Tongue: ${phonemeData.tongue}</div>
                    <div>Lips: ${phonemeData.lips}</div>
                </div>
            </div>
        ` : ''}
        
        <button onclick="document.getElementById('phoneme-mouth-display').style.display='none'" 
                style="margin-top: 20px; padding: 10px 24px; background: var(--color-correct); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Got it!
        </button>
    `;
    
    mouthDisplay.style.display = 'block';
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (mouthDisplay) mouthDisplay.style.display = 'none';
    }, 8000);
}

function openPhonemeGuide(preselectSound = null) {
    modalOverlay.classList.remove('hidden');
    const phonemeModal = document.getElementById('phoneme-modal');
    if (!phonemeModal) {
        console.error("phoneme-modal element not found!");
        return;
    }
    phonemeModal.classList.remove('hidden');

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
    if (!document.getElementById('howto-btn')) {
        const btn = document.createElement('button');
        btn.id = 'howto-btn';
        btn.type = 'button';
        btn.className = 'link-btn';
        btn.textContent = 'How to Play';
        btn.addEventListener('click', openHowToModal);
        headerActions.insertBefore(btn, headerActions.firstChild);
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
            <p class="howto-subtitle">Clear, calm steps so students can jump right in.</p>
            <div class="howto-section">
                <h3>Guessing</h3>
                <ul>
                    <li>Type a word, then press Enter.</li>
                    <li><span class="chip correct"></span> Green = correct spot.</li>
                    <li><span class="chip present"></span> Gold = in the word, wrong spot.</li>
                    <li><span class="chip absent"></span> Slate = not in the word.</li>
                </ul>
            </div>
            <div class="howto-section">
                <h3>Audio Support</h3>
                <ul>
                    <li>Use Hear Word / Definition / Sentence in the reveal card.</li>
                    <li>Warm‑Up: tap a sound to see mouth cues and hear it.</li>
                    <li>Teacher can enable stronger voices in settings.</li>
                </ul>
            </div>
            <div class="howto-section">
                <h3>Fun Mode</h3>
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
