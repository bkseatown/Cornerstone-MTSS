#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DEFAULT_LANGUAGES = ['en', 'es', 'zh', 'tl', 'hi', 'ms', 'vi'];
const DEFAULT_FIELDS = ['word', 'def', 'sentence'];
const DEFAULT_VOICE_MAP = {
    en: 'en-US-JennyNeural',
    es: 'es-ES-ElviraNeural',
    zh: 'zh-CN-XiaoxiaoNeural',
    tl: 'fil-PH-BlessicaNeural',
    hi: 'hi-IN-SwaraNeural',
    ms: 'ms-MY-YasminNeural',
    vi: 'vi-VN-HoaiMyNeural',
    ar: 'ar-SA-ZariyahNeural',
    ko: 'ko-KR-SunHiNeural',
    ja: 'ja-JP-NanamiNeural'
};
const LANGUAGE_LOCALE_MAP = {
    en: 'en-US',
    es: 'es-ES',
    zh: 'zh-CN',
    tl: 'fil-PH',
    hi: 'hi-IN',
    ms: 'ms-MY',
    vi: 'vi-VN',
    ar: 'ar-SA',
    ko: 'ko-KR',
    ja: 'ja-JP'
};
const OUTPUT_FORMAT = 'audio-24khz-96kbitrate-mono-mp3';
const PHONEME_MANIFEST_PREFIX = '@phoneme:';
const PHONEME_DEFAULT_FILE = 'phoneme-data.js';
const PASSAGE_MANIFEST_PREFIX = '@passage:';
const PASSAGE_DEFAULT_FILE = 'app.js';
const PASSAGE_EXPANSION_DEFAULT_FILE = 'decodables-expansion.js';
const PHONEME_TTS_OVERRIDES = {
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
    'oo-short': 'short oo, as in book',
    ar: 'ar',
    or: 'or',
    ur: 'er',
    ir: 'er',
    er: 'er',
    ow: 'ow',
    oi: 'oy',
    zh: 'zh',
    ch: 'ch',
    sh: 'sh',
    th: 'th',
    'th-voiced': 'th',
    ng: 'ng',
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

function parseArgs(argv) {
    const args = {};
    argv.forEach((part) => {
        if (!part.startsWith('--')) return;
        const raw = part.slice(2);
        const eq = raw.indexOf('=');
        if (eq === -1) {
            args[raw] = 'true';
            return;
        }
        const key = raw.slice(0, eq);
        const value = raw.slice(eq + 1);
        args[key] = value;
    });
    return args;
}

function splitList(value, fallback) {
    if (!value) return fallback.slice();
    return value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
}

function toForwardSlash(value) {
    return value.replace(/\\/g, '/');
}

function wait(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

function bumpFieldCounter(counter, field) {
    const key = String(field || 'word').toLowerCase();
    counter[key] = (counter[key] || 0) + 1;
}

function bumpTextCounter(counter, key, amount) {
    const normalizedKey = String(key || 'unknown').toLowerCase();
    counter[normalizedKey] = (counter[normalizedKey] || 0) + amount;
}

function formatCounter(counter = {}) {
    const keys = Object.keys(counter || {});
    if (!keys.length) return 'n/a';
    return keys
        .sort((a, b) => a.localeCompare(b))
        .map((key) => `${key}:${counter[key]}`)
        .join(', ');
}

function safeWordSlug(word = '') {
    const slug = String(word || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || 'word';
}

function safePassageSlug(title = '') {
    return safeWordSlug(title || 'passage');
}

function safePackId(packId = '') {
    const slug = String(packId || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug;
}

function normalizeLangCode(code = 'en') {
    const raw = String(code || '').trim().toLowerCase();
    if (!raw) return 'en';
    if (raw === 'hindi') return 'hi';
    if (raw === 'malay' || raw === 'bahasa') return 'ms';
    if (raw === 'vietnamese') return 'vi';
    if (raw === 'arabic') return 'ar';
    if (raw === 'korean') return 'ko';
    if (raw === 'japanese') return 'ja';
    if (raw === 'fil' || raw === 'tagalog' || raw === 'filipino') return 'tl';
    if (raw.startsWith('zh')) return 'zh';
    return raw.slice(0, 2);
}

function fieldToDataKey(field) {
    if (field === 'def') return 'def';
    if (field === 'sentence') return 'sentence';
    return 'word';
}

function escapeXml(text = '') {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function loadJsonFile(filePath, fallback = {}) {
    if (!filePath) return fallback;
    const absolute = path.resolve(filePath);
    if (!fs.existsSync(absolute)) return fallback;
    try {
        const raw = fs.readFileSync(absolute, 'utf8');
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function loadWordsData(wordsPath) {
    const source = fs.readFileSync(wordsPath, 'utf8');
    const browserLikeWindow = {};
    const context = {
        window: browserLikeWindow,
        self: browserLikeWindow,
        global: browserLikeWindow,
        console
    };
    vm.createContext(context);
    vm.runInContext(
        `${source}\nthis.__WORDS_DATA__ = (typeof WORDS_DATA !== "undefined" ? WORDS_DATA : (window && window.WORD_ENTRIES) || null);`,
        context,
        { filename: wordsPath }
    );
    const data = context.__WORDS_DATA__;
    if (!data || typeof data !== 'object') {
        throw new Error('Unable to load WORDS_DATA from words.js');
    }
    return data;
}

function loadDecodableCatalog(appPath, expansionPath = '') {
    if (!fs.existsSync(appPath)) return [];
    const appSource = fs.readFileSync(appPath, 'utf8');
    const appMatch = appSource.match(/const DEFAULT_DECODABLE_TEXTS = \[[\s\S]*?\n\];/);
    if (!appMatch) return [];
    const context = { console };
    vm.createContext(context);
    vm.runInContext(
        `${appMatch[0]}\nthis.__DEFAULT_DECODABLE_TEXTS__ = (typeof DEFAULT_DECODABLE_TEXTS !== "undefined" ? DEFAULT_DECODABLE_TEXTS : []);`,
        context,
        { filename: appPath }
    );
    const baseData = Array.isArray(context.__DEFAULT_DECODABLE_TEXTS__) ? context.__DEFAULT_DECODABLE_TEXTS__ : [];
    let expansionData = [];
    if (expansionPath && fs.existsSync(expansionPath)) {
        const expansionSource = fs.readFileSync(expansionPath, 'utf8');
        const expansionWindow = {};
        const expansionContext = {
            window: expansionWindow,
            self: expansionWindow,
            global: expansionWindow,
            console
        };
        vm.createContext(expansionContext);
        vm.runInContext(
            `${expansionSource}\nthis.__DECODABLE_TEXTS_EXPANSION__ = (window && window.DECODABLE_TEXTS_EXPANSION) || [];`,
            expansionContext,
            { filename: expansionPath }
        );
        expansionData = Array.isArray(expansionContext.__DECODABLE_TEXTS_EXPANSION__)
            ? expansionContext.__DECODABLE_TEXTS_EXPANSION__
            : [];
    }

    const seen = new Set();
    return [...baseData, ...expansionData]
        .map((entry) => ({
            title: String(entry?.title || '').trim(),
            content: String(entry?.content || '').trim()
        }))
        .filter((entry) => {
            if (!entry.title || !entry.content) return false;
            const key = `${entry.title.toLowerCase()}|${entry.content.toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function normalizePhonemeSoundKey(soundKey = '') {
    const raw = String(soundKey || '').trim().toLowerCase();
    if (!raw) return '';
    return raw.replace(/\s+/g, '-');
}

function getPhonemeText(entry, soundKey) {
    if (entry?.tts) {
        return String(entry.tts).trim();
    }
    const normalizedSound = normalizePhonemeSoundKey(soundKey);
    if (PHONEME_TTS_OVERRIDES[normalizedSound]) {
        return PHONEME_TTS_OVERRIDES[normalizedSound];
    }
    const rawSound = String(entry?.sound || '')
        .replace(/[\/\[\]]/g, '')
        .trim()
        .toLowerCase();
    if (rawSound) {
        return rawSound;
    }
    if (entry?.grapheme) {
        return String(entry.grapheme).trim().toLowerCase();
    }
    return normalizedSound;
}

function loadPhonemeCatalog(phonemePath, setName = 'core') {
    if (!fs.existsSync(phonemePath)) {
        return [];
    }
    const source = fs.readFileSync(phonemePath, 'utf8');
    const browserLikeWindow = {};
    const context = {
        window: browserLikeWindow,
        self: browserLikeWindow,
        global: browserLikeWindow,
        console
    };
    vm.createContext(context);
    vm.runInContext(
        `${source}
this.__PHONEME_DATA__ = (window && window.PHONEME_DATA) || null;
this.__PHONEME_CATEGORIES__ = (window && window.PHONEME_CATEGORIES) || null;`,
        context,
        { filename: phonemePath }
    );

    const phonemeData = context.__PHONEME_DATA__;
    if (!phonemeData || typeof phonemeData !== 'object') {
        return [];
    }

    const allKeys = Object.keys(phonemeData);
    const categories = context.__PHONEME_CATEGORIES__;
    const coreCandidates = [];
    if (categories && Array.isArray(categories.vowels)) {
        coreCandidates.push(...categories.vowels);
    }
    if (categories && Array.isArray(categories.consonants)) {
        coreCandidates.push(...categories.consonants);
    }

    const selectedKeys = (setName === 'all' ? allKeys : coreCandidates)
        .map((key) => normalizePhonemeSoundKey(key))
        .filter(Boolean);

    const uniqueKeys = Array.from(new Set(selectedKeys))
        .filter((key) => phonemeData[key])
        .sort((a, b) => a.localeCompare(b));

    return uniqueKeys.map((soundKey) => {
        const entry = phonemeData[soundKey] || {};
        const text = getPhonemeText(entry, soundKey);
        return {
            soundKey,
            text,
            name: String(entry.name || '').trim(),
            example: String(entry.example || '').trim()
        };
    }).filter((item) => !!item.text);
}

function localeFromVoice(voiceName = '') {
    const parts = String(voiceName || '').split('-');
    if (parts.length >= 2) {
        return `${parts[0]}-${parts[1]}`;
    }
    return 'en-US';
}

function localeFromLanguage(langCode = 'en') {
    const normalized = normalizeLangCode(langCode);
    return LANGUAGE_LOCALE_MAP[normalized] || localeFromVoice(normalized);
}

function isMultilingualVoice(voiceName = '') {
    return /multilingual/i.test(String(voiceName || ''));
}

async function fetchAzureToken(region, subscriptionKey) {
    const response = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Content-Length': '0'
        }
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Token request failed (${response.status}): ${body.slice(0, 240)}`);
    }
    const token = await response.text();
    if (!token) throw new Error('Token request succeeded but token was empty.');
    return token;
}

async function synthesizeTextToMp3({ token, region, voice, locale, text }) {
    const ssml = `<speak version="1.0" xml:lang="${escapeXml(locale)}"><voice name="${escapeXml(voice)}">${escapeXml(text)}</voice></speak>`;
    const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': OUTPUT_FORMAT,
            'User-Agent': 'cornerstone-mtss-tts-exporter'
        },
        body: ssml
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`TTS failed (${response.status}): ${body.slice(0, 260)}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) throw new Error('TTS returned empty audio.');
    return buffer;
}

function getOverrideText(overrides, word, lang, field) {
    const wordBlock = overrides[word] || overrides[word.toLowerCase()] || null;
    if (!wordBlock || typeof wordBlock !== 'object') return '';
    const langBlock = wordBlock[lang] || wordBlock[normalizeLangCode(lang)] || null;
    if (!langBlock || typeof langBlock !== 'object') return '';
    const key = fieldToDataKey(field);
    return String(langBlock[key] || '').trim();
}

function getTaskText({ word, lang, field, entry, overrides, fallbackLang }) {
    const fieldKey = fieldToDataKey(field);
    const overrideText = getOverrideText(overrides, word, lang, field);
    if (overrideText) {
        return { text: overrideText, source: 'override', sourceLang: lang };
    }

    if (field === 'word') {
        if (lang === 'en') {
            return { text: word, source: 'word-key', sourceLang: 'en' };
        }
        const localizedWord = String(entry?.[lang]?.word || '').trim();
        if (localizedWord) {
            return { text: localizedWord, source: 'localized-word', sourceLang: lang };
        }
        if (fallbackLang === 'en') {
            return { text: word, source: 'fallback-word-key', sourceLang: 'en' };
        }
        return { text: '', source: 'missing', sourceLang: lang };
    }

    const primaryText = String(entry?.[lang]?.[fieldKey] || '').trim();
    if (primaryText) {
        return { text: primaryText, source: 'words-data', sourceLang: lang };
    }

    if (fallbackLang) {
        const fallbackText = String(entry?.[fallbackLang]?.[fieldKey] || '').trim();
        if (fallbackText) {
            return { text: fallbackText, source: 'fallback', sourceLang: fallbackLang };
        }
    }

    return { text: '', source: 'missing', sourceLang: lang };
}

function buildVoiceMap(baseMap, userMap) {
    const merged = { ...baseMap };
    Object.entries(userMap || {}).forEach(([rawKey, value]) => {
        const key = normalizeLangCode(rawKey);
        if (!value) return;
        merged[key] = value;
    });
    return merged;
}

function updatePackRegistry({ rootDir, packId, packName, manifestBasePath, generatedAt, languages, fields, voiceMap }) {
    if (!packId) return null;
    const registryPath = path.join(rootDir, 'audio', 'tts', 'packs', 'pack-registry.json');
    fs.mkdirSync(path.dirname(registryPath), { recursive: true });

    let registry = { version: 1, updatedAt: generatedAt, packs: [] };
    if (fs.existsSync(registryPath)) {
        try {
            const existing = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
            if (existing && typeof existing === 'object') {
                registry = {
                    version: 1,
                    updatedAt: generatedAt,
                    packs: Array.isArray(existing.packs) ? existing.packs : []
                };
            }
        } catch {
            registry = { version: 1, updatedAt: generatedAt, packs: [] };
        }
    }

    const packEntry = {
        id: packId,
        name: packName || packId,
        manifestPath: `${manifestBasePath}/tts-manifest.json`,
        description: `Generated via Azure TTS exporter (${packName || packId}).`,
        generatedAt,
        languages: Array.isArray(languages) ? languages : [],
        fields: Array.isArray(fields) ? fields : [],
        voices: voiceMap
    };

    registry.packs = registry.packs.filter((pack) => safePackId(pack?.id || '') !== packId);
    registry.packs.push(packEntry);
    registry.updatedAt = generatedAt;

    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    return registryPath;
}

function printUsage() {
    console.log(`
Azure TTS export for CORNERSTONE MTSS

Usage:
  node scripts/export-azure-tts.js [options]

Required:
  --region=<azure_region>         or env AZURE_SPEECH_REGION
  --key=<azure_key>               or env AZURE_SPEECH_KEY

Optional:
  --languages=en,es,zh,tl,hi,ms,vi,ar,ko,ja
                                   (default: en,es,zh,tl,hi,ms,vi)
  --fields=word,def,sentence      (default: word,def,sentence)
  --dry-run=true                  show task/character counts without calling Azure
  --include-passages=true         include decodable passage clips from app.js
  --passages-only=true            generate passage clips only
  --passages-file=app.js          file containing DEFAULT_DECODABLE_TEXTS
  --passages-expansion-file=decodables-expansion.js
  --fallback-lang=en              fallback text language when a field is missing
  --voice-map=path/to/voices.json JSON object { "en":"...", "es":"..." }
  --overrides=path/to/overrides.json
  --pack-id=ava                 creates/updates audio/tts/packs/<pack-id>
  --pack-name="Ava Pack"        display name shown in app selector
  --include-phonemes=true       include phoneme clip generation
  --phonemes-only=true          only generate phoneme clips
  --phoneme-set=core            core (default) or all
  --phoneme-file=phoneme-data.js
  --preserve-existing=true       keep existing manifest entries/fields when updating
  --words=words.js
  --out=audio/tts
  --manifest-base=audio/tts
  --limit=100
  --retries=2
  --overwrite=true

Notes:
  - Hindi text is not present in words.js by default. Use --overrides for Hindi content.
  - Output manifest is written to <out>/tts-manifest.json.
  - With --pack-id, pack metadata is written to audio/tts/packs/pack-registry.json.
`);
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help === 'true' || args.h === 'true') {
        printUsage();
        return;
    }

    const rootDir = path.resolve(__dirname, '..');
    const wordsPath = path.resolve(rootDir, args.words || 'words.js');
    const phonemePath = path.resolve(rootDir, args['phoneme-file'] || PHONEME_DEFAULT_FILE);
    const passagesPath = path.resolve(rootDir, args['passages-file'] || PASSAGE_DEFAULT_FILE);
    const passagesExpansionArg = typeof args['passages-expansion-file'] === 'string'
        ? args['passages-expansion-file'].trim()
        : '';
    const passagesExpansionPath = path.resolve(
        rootDir,
        passagesExpansionArg || PASSAGE_EXPANSION_DEFAULT_FILE
    );
    const packId = safePackId(args['pack-id'] || '');
    const hasExplicitOutDir = typeof args.out === 'string' && args.out.trim().length > 0;
    const outDir = hasExplicitOutDir
        ? path.resolve(rootDir, args.out)
        : (packId
            ? path.resolve(rootDir, 'audio', 'tts', 'packs', packId)
            : path.resolve(rootDir, 'audio', 'tts'));
    const defaultManifestBase = packId
        ? toForwardSlash(path.join('audio', 'tts', 'packs', packId))
        : toForwardSlash(path.relative(rootDir, outDir) || 'audio/tts');
    const manifestBase = toForwardSlash((args['manifest-base'] || defaultManifestBase).replace(/^\.\/+/, ''));
    const packName = String(args['pack-name'] || '').trim() || (packId ? `${packId} voice pack` : '');
    const fallbackLang = args['fallback-lang'] ? normalizeLangCode(args['fallback-lang']) : '';
    const languageArg = (typeof args.languages === 'string' && args.languages.trim().length)
        ? args.languages
        : ((typeof args.language === 'string' && args.language !== 'true' && args.language.trim().length)
            ? args.language
            : '');
    if (!args.languages && args.language === 'true') {
        console.warn(`[TTS] Warning: "--language" was provided without a value. Using default languages: ${DEFAULT_LANGUAGES.join(',')}.`);
    }

    const fieldArg = (typeof args.fields === 'string' && args.fields.trim().length)
        ? args.fields
        : ((typeof args.field === 'string' && args.field !== 'true' && args.field.trim().length)
            ? args.field
            : '');

    const languages = splitList(languageArg, DEFAULT_LANGUAGES).map(normalizeLangCode);
    const fields = splitList(fieldArg, DEFAULT_FIELDS).map((field) => {
        if (field === 'definition') return 'def';
        if (field === 'sentence') return 'sentence';
        return field === 'word' ? 'word' : field;
    }).filter((field) => DEFAULT_FIELDS.includes(field));
    const limit = Number.isFinite(Number(args.limit)) ? Math.max(0, Number(args.limit)) : 0;
    const retries = Number.isFinite(Number(args.retries)) ? Math.max(0, Number(args.retries)) : 2;
    const overwrite = args.overwrite === 'true';
    const dryRun = args['dry-run'] === 'true';
    const includePassages = args['include-passages'] === 'true' || args['passages-only'] === 'true';
    const passagesOnly = args['passages-only'] === 'true';
    const includePhonemes = args['include-phonemes'] === 'true' || args['phonemes-only'] === 'true';
    const phonemesOnly = args['phonemes-only'] === 'true';
    const phonemeSet = String(args['phoneme-set'] || 'core').toLowerCase() === 'all' ? 'all' : 'core';

    const region = (args.region || process.env.AZURE_SPEECH_REGION || '').trim();
    const key = (args.key || process.env.AZURE_SPEECH_KEY || '').trim();
    const hasCredentials = !!(region && key);
    if (dryRun && !hasCredentials) {
        console.log('[TTS] Dry run mode: Azure credentials not required.');
    }

    const shouldExportWords = !phonemesOnly && !passagesOnly;

    if (!fs.existsSync(wordsPath) && shouldExportWords) {
        throw new Error(`Cannot find words data file: ${wordsPath}`);
    }
    if (includePassages && !fs.existsSync(passagesPath)) {
        throw new Error(`Cannot find passages file: ${passagesPath}`);
    }
    if (includePassages && passagesExpansionArg && !fs.existsSync(passagesExpansionPath)) {
        throw new Error(`Cannot find passages expansion file: ${passagesExpansionPath}`);
    }
    fs.mkdirSync(outDir, { recursive: true });

    const voiceMapFile = loadJsonFile(args['voice-map'], {});
    const voiceMap = buildVoiceMap(DEFAULT_VOICE_MAP, voiceMapFile);
    const overrides = loadJsonFile(args.overrides, {});
    const wordsData = shouldExportWords ? loadWordsData(wordsPath) : {};
    const wordList = shouldExportWords ? Object.keys(wordsData) : [];
    const passageCatalog = includePassages ? loadDecodableCatalog(passagesPath, passagesExpansionPath) : [];
    if (includePassages && !passageCatalog.length) {
        console.warn(`[TTS] Warning: no decodable passages found in ${passagesPath}`);
    }

    const tasks = [];
    const skippedMissing = [];
    const skippedNoVoice = [];

    if (shouldExportWords) {
        wordList.forEach((word) => {
            const entry = wordsData[word];
            languages.forEach((lang) => {
                const voice = voiceMap[lang];
                if (!voice) {
                    skippedNoVoice.push({ word, lang, field: '*', reason: 'no voice configured' });
                    return;
                }
                fields.forEach((field) => {
                    const { text, source, sourceLang } = getTaskText({
                        word,
                        lang,
                        field,
                        entry,
                        overrides,
                        fallbackLang
                    });
                    if (!text) {
                        skippedMissing.push({ word, lang, field, reason: 'missing text', sourceLang });
                        return;
                    }
                    const slug = safeWordSlug(word);
                    const relativePath = toForwardSlash(path.join(lang, field, `${slug}.mp3`));
                    tasks.push({
                        word,
                        lang,
                        field,
                        text,
                        source,
                        sourceLang,
                        voice,
                        locale: isMultilingualVoice(voice)
                            ? localeFromLanguage(lang)
                            : localeFromVoice(voice),
                        relativePath,
                        absolutePath: path.join(outDir, relativePath)
                    });
                });
            });
        });
    }

    if (includePassages) {
        passageCatalog.forEach((passage) => {
            languages.forEach((lang) => {
                const voice = voiceMap[lang];
                if (!voice) {
                    skippedNoVoice.push({
                        word: passage.title,
                        lang,
                        field: 'passage',
                        reason: 'no voice configured'
                    });
                    return;
                }

                const slug = safePassageSlug(passage.title);
                const relativePath = toForwardSlash(path.join(lang, 'passage', `${slug}.mp3`));
                tasks.push({
                    word: passage.title,
                    lang,
                    field: 'passage',
                    text: passage.content,
                    source: 'decodable-texts',
                    sourceLang: 'en',
                    voice,
                    locale: isMultilingualVoice(voice)
                        ? localeFromLanguage(lang)
                        : localeFromVoice(voice),
                    relativePath,
                    absolutePath: path.join(outDir, relativePath),
                    manifestKey: `${PASSAGE_MANIFEST_PREFIX}${slug}|${lang}|passage`
                });
            });
        });
    }

    let phonemeCatalog = [];
    if (includePhonemes) {
        phonemeCatalog = loadPhonemeCatalog(phonemePath, phonemeSet);
        const phonemeVoice = voiceMap.en;
        if (!phonemeVoice) {
            phonemeCatalog.forEach((item) => {
                skippedNoVoice.push({
                    word: item.soundKey,
                    lang: 'en',
                    field: 'phoneme',
                    reason: 'no voice configured for en'
                });
            });
        } else {
            phonemeCatalog.forEach((item) => {
                const relativePath = toForwardSlash(path.join('phoneme', `${safeWordSlug(item.soundKey)}.mp3`));
                tasks.push({
                    word: item.soundKey,
                    lang: 'en',
                    field: 'phoneme',
                    text: item.text,
                    source: 'phoneme-data',
                    sourceLang: 'en',
                    voice: phonemeVoice,
                    locale: isMultilingualVoice(phonemeVoice)
                        ? localeFromLanguage('en')
                        : localeFromVoice(phonemeVoice),
                    relativePath,
                    absolutePath: path.join(outDir, relativePath),
                    manifestKey: `${PHONEME_MANIFEST_PREFIX}${normalizePhonemeSoundKey(item.soundKey)}|en|phoneme`
                });
            });
        }
    }

    const finalTasks = limit > 0 ? tasks.slice(0, limit) : tasks;
    const manifestPath = path.join(outDir, 'tts-manifest.json');
    const preserveExisting = args['preserve-existing'] !== 'false';
    let existingManifest = null;
    if (preserveExisting && fs.existsSync(manifestPath)) {
        try {
            const rawExisting = fs.readFileSync(manifestPath, 'utf8');
            existingManifest = JSON.parse(rawExisting);
        } catch (error) {
            console.warn('[TTS] Could not parse existing manifest; continuing without preserve-existing merge.');
        }
    }

    const manifestFieldSet = new Set(
        preserveExisting && Array.isArray(existingManifest?.fields)
            ? existingManifest.fields
            : []
    );
    fields.forEach((field) => manifestFieldSet.add(field));
    if (includePassages) manifestFieldSet.add('passage');
    if (includePhonemes) manifestFieldSet.add('phoneme');
    const manifestFields = Array.from(manifestFieldSet);

    const manifestLanguageSet = new Set(
        preserveExisting && Array.isArray(existingManifest?.languages)
            ? existingManifest.languages.map((lang) => normalizeLangCode(lang))
            : []
    );
    languages.forEach((lang) => manifestLanguageSet.add(normalizeLangCode(lang)));
    const manifestLanguages = Array.from(manifestLanguageSet);

    const manifestVoiceMap = {
        ...(preserveExisting && existingManifest?.voiceMap && typeof existingManifest.voiceMap === 'object'
            ? existingManifest.voiceMap
            : {}),
        ...voiceMap
    };

    const preservedEntries = preserveExisting && existingManifest?.entries && typeof existingManifest.entries === 'object'
        ? { ...existingManifest.entries }
        : {};

    const generatedAt = new Date().toISOString();
    const manifest = {
        version: 1,
        generatedAt,
        region,
        format: OUTPUT_FORMAT,
        packId: packId || 'default',
        packName: packName || 'Default voice pack',
        languages: manifestLanguages,
        fields: manifestFields,
        voiceMap: manifestVoiceMap,
        entries: preservedEntries
    };

    let totalCharacters = 0;
    const charactersByLanguage = {};
    const charactersByField = {};
    finalTasks.forEach((task) => {
        const textLength = String(task.text || '').length;
        totalCharacters += textLength;
        bumpTextCounter(charactersByLanguage, task.lang, textLength);
        bumpTextCounter(charactersByField, task.field, textLength);
    });

    const phonemeTaskCount = finalTasks.reduce((count, task) => count + (task.field === 'phoneme' ? 1 : 0), 0);
    const passageTaskCount = finalTasks.reduce((count, task) => count + (task.field === 'passage' ? 1 : 0), 0);
    const tasksNeedingSynthesis = finalTasks.filter((task) => overwrite || !fs.existsSync(task.absolutePath));
    if (!dryRun && tasksNeedingSynthesis.length > 0 && !hasCredentials) {
        throw new Error('Missing Azure credentials. Provide --region/--key or AZURE_SPEECH_REGION/AZURE_SPEECH_KEY.');
    }
    console.log(`[TTS] words=${wordList.length} passages=${passageCatalog.length} tasks=${finalTasks.length} missing=${skippedMissing.length} noVoice=${skippedNoVoice.length} phonemes=${phonemeTaskCount}`);
    if (includePassages) {
        console.log(`[TTS] passageTasks=${passageTaskCount}`);
    }
    console.log(`[TTS] chars=${totalCharacters} byLang={${formatCounter(charactersByLanguage)}} byField={${formatCounter(charactersByField)}}`);
    if (dryRun) {
        console.log('[TTS] Dry run complete. No Azure requests were made.');
        return;
    }

    let token = null;
    let tokenIssuedAt = 0;
    if (tasksNeedingSynthesis.length > 0) {
        token = await fetchAzureToken(region, key);
        tokenIssuedAt = Date.now();
    }

    let generated = 0;
    let reused = 0;
    let failed = 0;
    const generatedByField = {};
    const reusedByField = {};
    const failedByField = {};
    const failures = [];

    for (let index = 0; index < finalTasks.length; index += 1) {
        const task = finalTasks[index];
        const manifestKey = task.manifestKey || `${task.word.toLowerCase()}|${task.lang}|${task.field}`;
        manifest.entries[manifestKey] = `${manifestBase}/${task.relativePath}`;
        fs.mkdirSync(path.dirname(task.absolutePath), { recursive: true });

        if (!overwrite && fs.existsSync(task.absolutePath)) {
            reused += 1;
            bumpFieldCounter(reusedByField, task.field);
            if ((index + 1) % 50 === 0) {
                console.log(`[TTS] progress ${index + 1}/${finalTasks.length} (generated=${generated}, reused=${reused}, failed=${failed})`);
            }
            continue;
        }

        if (token && (Date.now() - tokenIssuedAt) > (8 * 60 * 1000)) {
            token = await fetchAzureToken(region, key);
            tokenIssuedAt = Date.now();
        }

        let success = false;
        let lastError = '';
        for (let attempt = 0; attempt <= retries; attempt += 1) {
            try {
                const audioBuffer = await synthesizeTextToMp3({
                    token,
                    region,
                    voice: task.voice,
                    locale: task.locale,
                    text: task.text
                });
                fs.writeFileSync(task.absolutePath, audioBuffer);
                generated += 1;
                bumpFieldCounter(generatedByField, task.field);
                success = true;
                break;
            } catch (error) {
                lastError = error && error.message ? error.message : 'Unknown TTS error';
                const transient = /(terminated|timeout|timed out|socket|network|fetch failed|econnreset|aborted|429|502|503|504)/i.test(lastError);
                if (attempt >= retries || !transient) {
                    break;
                }
                await wait(350 * (attempt + 1));
            }
        }

        if (!success) {
            failures.push({
                word: task.word,
                lang: task.lang,
                field: task.field,
                voice: task.voice,
                error: lastError || 'Unknown TTS error'
            });
            failed += 1;
            bumpFieldCounter(failedByField, task.field);
            console.error(`[TTS] failed ${task.word} ${task.lang} ${task.field}: ${lastError || 'Unknown TTS error'}`);
        }

        if ((index + 1) % 25 === 0 || index === finalTasks.length - 1) {
            console.log(`[TTS] progress ${index + 1}/${finalTasks.length} (generated=${generated}, reused=${reused}, failed=${failed})`);
        }
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    const report = {
        generatedAt,
        region,
        packId: packId || 'default',
        packName: packName || 'Default voice pack',
        languages: manifestLanguages,
        fields: manifestFields,
        voiceMap: manifestVoiceMap,
        retries,
        words: wordList.length,
        attempted: finalTasks.length,
        generated,
        reused,
        failed,
        generatedByField,
        reusedByField,
        failedByField,
        phonemeCatalogSize: phonemeCatalog.length,
        phonemeTasks: phonemeTaskCount,
        skippedMissing: skippedMissing.length,
        skippedNoVoice: skippedNoVoice.length,
        failures,
        missingDetails: skippedMissing.slice(0, 2000),
        noVoiceDetails: skippedNoVoice.slice(0, 2000)
    };
    const reportPath = path.join(outDir, 'tts-export-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    let registryPath = null;
    if (packId) {
        registryPath = updatePackRegistry({
            rootDir,
            packId,
            packName: manifest.packName,
            manifestBasePath: manifestBase,
            generatedAt,
            languages: manifestLanguages,
            fields: manifestFields,
            voiceMap: manifestVoiceMap
        });
    }

    console.log(`[TTS] Done. Manifest: ${manifestPath}`);
    console.log(`[TTS] Report:   ${reportPath}`);
    if (registryPath) {
        console.log(`[TTS] Registry: ${registryPath}`);
    }
}

main().catch((error) => {
    const message = error && error.message ? error.message : String(error);
    console.error(`[TTS] ${message}`);
    process.exit(1);
});
