#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const OUTPUT_FORMAT = 'audio-24khz-96kbitrate-mono-mp3';
const BONUS_TYPES = ['jokes', 'riddles', 'facts', 'quotes'];
const DEFAULT_VOICE = 'en-US-Ava:DragonHDLatestNeural';
const DEFAULT_PROSODY_SETTINGS = Object.freeze({
    enabled: true,
    defaultRate: '0%',
    defaultPitch: '0Hz',
    jokeSetupRate: '-3%',
    jokePunchlineRate: '+8%',
    jokeFullRate: '+2%',
    jokeBreakMs: 420,
    riddlePromptRate: '-4%',
    riddleAnswerRate: '+6%',
    riddleBreakMs: 320,
    factsRate: '0%',
    quotesRate: '-2%',
    jokePunchlinePitch: '+2Hz',
    riddleAnswerPitch: '+1Hz',
    styleJokes: '',
    styleRiddles: '',
    styleFacts: '',
    styleQuotes: '',
    styleAnswers: ''
});

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

function parseBooleanFlag(value, fallback = false) {
    if (value === undefined || value === null || value === '') return fallback;
    const normalized = String(value).trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') return false;
    return fallback;
}

function parseIntegerFlag(value, fallback = 0) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function readJsonFile(filePath = '', fallback = {}) {
    const candidate = String(filePath || '').trim();
    if (!candidate || !fs.existsSync(candidate)) return fallback;
    try {
        return JSON.parse(fs.readFileSync(candidate, 'utf8'));
    } catch {
        return fallback;
    }
}

function readProsodyStringArg(args, key, fileConfig, fallback = '') {
    const fromArg = String(args[key] || '').trim();
    if (fromArg) return fromArg;
    const fromFile = String(fileConfig[key] || '').trim();
    if (fromFile) return fromFile;
    return fallback;
}

function buildProsodySettings(args = {}, rootDir = '') {
    const configPath = String(args['prosody-config'] || '').trim();
    const resolvedConfigPath = configPath
        ? path.resolve(rootDir, configPath)
        : '';
    const fileConfig = readJsonFile(resolvedConfigPath, {});
    const settings = {
        enabled: parseBooleanFlag(
            args.prosody,
            parseBooleanFlag(fileConfig.enabled, DEFAULT_PROSODY_SETTINGS.enabled)
        ),
        defaultRate: readProsodyStringArg(args, 'default-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.defaultRate),
        defaultPitch: readProsodyStringArg(args, 'default-pitch', fileConfig, DEFAULT_PROSODY_SETTINGS.defaultPitch),
        jokeSetupRate: readProsodyStringArg(args, 'joke-setup-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.jokeSetupRate),
        jokePunchlineRate: readProsodyStringArg(args, 'joke-punchline-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.jokePunchlineRate),
        jokeFullRate: readProsodyStringArg(args, 'joke-full-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.jokeFullRate),
        jokeBreakMs: Math.max(0, parseIntegerFlag(args['joke-break-ms'], parseIntegerFlag(fileConfig.jokeBreakMs, DEFAULT_PROSODY_SETTINGS.jokeBreakMs))),
        riddlePromptRate: readProsodyStringArg(args, 'riddle-prompt-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.riddlePromptRate),
        riddleAnswerRate: readProsodyStringArg(args, 'riddle-answer-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.riddleAnswerRate),
        riddleBreakMs: Math.max(0, parseIntegerFlag(args['riddle-break-ms'], parseIntegerFlag(fileConfig.riddleBreakMs, DEFAULT_PROSODY_SETTINGS.riddleBreakMs))),
        factsRate: readProsodyStringArg(args, 'facts-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.factsRate),
        quotesRate: readProsodyStringArg(args, 'quotes-rate', fileConfig, DEFAULT_PROSODY_SETTINGS.quotesRate),
        jokePunchlinePitch: readProsodyStringArg(args, 'joke-punchline-pitch', fileConfig, DEFAULT_PROSODY_SETTINGS.jokePunchlinePitch),
        riddleAnswerPitch: readProsodyStringArg(args, 'riddle-answer-pitch', fileConfig, DEFAULT_PROSODY_SETTINGS.riddleAnswerPitch),
        styleJokes: readProsodyStringArg(args, 'style-jokes', fileConfig, DEFAULT_PROSODY_SETTINGS.styleJokes),
        styleRiddles: readProsodyStringArg(args, 'style-riddles', fileConfig, DEFAULT_PROSODY_SETTINGS.styleRiddles),
        styleFacts: readProsodyStringArg(args, 'style-facts', fileConfig, DEFAULT_PROSODY_SETTINGS.styleFacts),
        styleQuotes: readProsodyStringArg(args, 'style-quotes', fileConfig, DEFAULT_PROSODY_SETTINGS.styleQuotes),
        styleAnswers: readProsodyStringArg(args, 'style-answers', fileConfig, DEFAULT_PROSODY_SETTINGS.styleAnswers)
    };
    return {
        ...settings,
        configPath: resolvedConfigPath
    };
}

function toForwardSlash(value = '') {
    return String(value || '').replace(/\\/g, '/');
}

function safePackId(packId = '') {
    const normalized = String(packId || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return normalized || 'ava-multi';
}

function normalizeBonusLine(text = '') {
    return String(text || '')
        .replace(/\u200B/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/\s+([,.;!?])/g, '$1')
        .trim();
}

function normalizeBonusManifestKeyText(text = '') {
    return normalizeBonusLine(text).toLowerCase();
}

function splitRiddlePromptAndAnswer(line = '') {
    const normalized = normalizeBonusLine(line);
    if (!normalized) return { prompt: '', answer: '' };
    const questionIndex = normalized.lastIndexOf('?');
    if (questionIndex < 0) return { prompt: normalized, answer: '' };
    const prompt = normalized.slice(0, questionIndex + 1).trim();
    let answer = normalized.slice(questionIndex + 1).trim();
    answer = answer.replace(/^answer[:\s-]*/i, '').trim();
    return { prompt: prompt || normalized, answer };
}

function splitJokeSetupAndPunchline(line = '') {
    const normalized = normalizeBonusLine(line);
    if (!normalized) return { setup: '', punchline: '' };
    const questionBreak = normalized.lastIndexOf('?');
    if (questionBreak > -1) {
        const setup = normalized.slice(0, questionBreak + 1).trim();
        const punchline = normalized.slice(questionBreak + 1).trim();
        if (setup && punchline) return { setup, punchline };
    }
    const patterns = [
        /(?:\s+|^)Answer::\s*/i,
        /(?:\s+|^)Answer:\s*/i,
        /\s+—\s+/,
        /\.\.\.+\s+/,
        /…\s+/
    ];
    for (const pattern of patterns) {
        const match = normalized.match(pattern);
        if (!match || typeof match.index !== 'number') continue;
        const setup = normalized.slice(0, match.index).trim();
        const punchline = normalized.slice(match.index + match[0].length).trim();
        if (setup && punchline) return { setup, punchline };
    }
    return { setup: normalized, punchline: '' };
}

function loadBonusPools(appPath) {
    const source = fs.readFileSync(appPath, 'utf8');
    const generalMatch = source.match(/const BONUS_CONTENT = \{[\s\S]*?\n\};/);
    const youngMatch = source.match(/const BONUS_CONTENT_YOUNG = \{[\s\S]*?\n\};/);
    if (!generalMatch || !youngMatch) {
        throw new Error('Could not locate BONUS_CONTENT and BONUS_CONTENT_YOUNG in app.js');
    }
    const context = { console };
    vm.createContext(context);
    vm.runInContext(
        `${generalMatch[0]}
${youngMatch[0]}
this.__BONUS_GENERAL__ = BONUS_CONTENT;
this.__BONUS_YOUNG__ = BONUS_CONTENT_YOUNG;`,
        context,
        { filename: appPath }
    );
    return [
        context.__BONUS_GENERAL__ || {},
        context.__BONUS_YOUNG__ || {}
    ];
}

function collectBonusUtterances(pools = []) {
    const deduped = new Map();

    function addLine(raw = '', source = '', metadata = {}) {
        const line = normalizeBonusLine(raw);
        if (!line) return;
        const keyText = normalizeBonusManifestKeyText(line);
        if (!keyText) return;
        if (!deduped.has(keyText)) {
            deduped.set(keyText, {
                keyText,
                text: line,
                source,
                bonusType: String(metadata.bonusType || '').trim(),
                variant: String(metadata.variant || '').trim()
            });
        }
    }

    pools.forEach((pool, poolIndex) => {
        BONUS_TYPES.forEach((type) => {
            const bucket = Array.isArray(pool?.[type]) ? pool[type] : [];
            bucket.forEach((line) => {
                const source = `${poolIndex === 0 ? 'general' : 'young'}:${type}`;
                const base = normalizeBonusLine(line);
                if (!base) return;
                addLine(base, source, { bonusType: type, variant: 'base' });

                if (type === 'jokes') {
                    const parsed = splitJokeSetupAndPunchline(base);
                    if (parsed.setup) {
                        addLine(parsed.setup, `${source}:setup`, { bonusType: type, variant: 'setup' });
                    }
                    if (parsed.punchline) {
                        addLine(parsed.punchline, `${source}:punchline`, { bonusType: type, variant: 'punchline' });
                    }
                    if (parsed.setup && parsed.punchline) {
                        addLine(`${parsed.setup} ${parsed.punchline}`, `${source}:full`, { bonusType: type, variant: 'full' });
                    }
                } else if (type === 'riddles') {
                    const parsed = splitRiddlePromptAndAnswer(base);
                    if (parsed.prompt) {
                        addLine(parsed.prompt, `${source}:prompt`, { bonusType: type, variant: 'prompt' });
                    }
                    if (parsed.answer) {
                        addLine(parsed.answer, `${source}:answer`, { bonusType: type, variant: 'answer' });
                    }
                }
            });
        });
    });

    return Array.from(deduped.values());
}

function localeFromVoice(voiceName = '') {
    const parts = String(voiceName || '').split('-');
    if (parts.length >= 2) return `${parts[0]}-${parts[1]}`;
    return 'en-US';
}

function escapeXml(text = '') {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
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

function buildPlainSsml({ voice, locale, text }) {
    return `<speak version="1.0" xml:lang="${escapeXml(locale)}"><voice name="${escapeXml(voice)}">${escapeXml(text)}</voice></speak>`;
}

function buildProsodyChunk(text = '', { rate = '', pitch = '', style = '' } = {}) {
    const normalizedText = normalizeBonusLine(text);
    if (!normalizedText) return '';
    const attrs = [];
    if (String(rate || '').trim()) attrs.push(`rate="${escapeXml(String(rate).trim())}"`);
    if (String(pitch || '').trim()) attrs.push(`pitch="${escapeXml(String(pitch).trim())}"`);
    const base = attrs.length
        ? `<prosody ${attrs.join(' ')}>${escapeXml(normalizedText)}</prosody>`
        : escapeXml(normalizedText);
    const styleValue = String(style || '').trim();
    if (!styleValue) return base;
    return `<mstts:express-as style="${escapeXml(styleValue)}">${base}</mstts:express-as>`;
}

function buildProsodySsml(task, { voice, locale, prosodySettings }) {
    if (!prosodySettings?.enabled) return '';
    const type = String(task?.bonusType || '').trim();
    const variant = String(task?.variant || '').trim();

    const pushBreak = (ms) => `<break time="${Math.max(0, Number(ms) || 0)}ms"/>`;
    const chunks = [];

    if (type === 'jokes') {
        const parsed = splitJokeSetupAndPunchline(task.text || '');
        const setup = parsed.setup || '';
        const punchline = parsed.punchline || '';
        if (variant === 'setup' && setup) {
            chunks.push(buildProsodyChunk(setup, {
                rate: prosodySettings.jokeSetupRate,
                pitch: prosodySettings.defaultPitch,
                style: prosodySettings.styleJokes
            }));
        } else if (variant === 'punchline' && punchline) {
            chunks.push(buildProsodyChunk(punchline, {
                rate: prosodySettings.jokePunchlineRate,
                pitch: prosodySettings.jokePunchlinePitch || prosodySettings.defaultPitch,
                style: prosodySettings.styleAnswers || prosodySettings.styleJokes
            }));
        } else if ((variant === 'full' || variant === 'base') && setup && punchline) {
            chunks.push(buildProsodyChunk(setup, {
                rate: prosodySettings.jokeSetupRate,
                pitch: prosodySettings.defaultPitch,
                style: prosodySettings.styleJokes
            }));
            chunks.push(pushBreak(prosodySettings.jokeBreakMs));
            chunks.push(buildProsodyChunk(punchline, {
                rate: prosodySettings.jokePunchlineRate,
                pitch: prosodySettings.jokePunchlinePitch || prosodySettings.defaultPitch,
                style: prosodySettings.styleAnswers || prosodySettings.styleJokes
            }));
        } else {
            chunks.push(buildProsodyChunk(task.text, {
                rate: prosodySettings.jokeFullRate,
                pitch: prosodySettings.defaultPitch,
                style: prosodySettings.styleJokes
            }));
        }
    } else if (type === 'riddles') {
        const parsed = splitRiddlePromptAndAnswer(task.text || '');
        const prompt = parsed.prompt || '';
        const answer = parsed.answer || '';
        if (variant === 'prompt' && prompt) {
            chunks.push(buildProsodyChunk(prompt, {
                rate: prosodySettings.riddlePromptRate,
                pitch: prosodySettings.defaultPitch,
                style: prosodySettings.styleRiddles
            }));
        } else if (variant === 'answer' && answer) {
            chunks.push(buildProsodyChunk(answer, {
                rate: prosodySettings.riddleAnswerRate,
                pitch: prosodySettings.riddleAnswerPitch || prosodySettings.defaultPitch,
                style: prosodySettings.styleAnswers || prosodySettings.styleRiddles
            }));
        } else if ((variant === 'full' || variant === 'base') && prompt && answer) {
            chunks.push(buildProsodyChunk(prompt, {
                rate: prosodySettings.riddlePromptRate,
                pitch: prosodySettings.defaultPitch,
                style: prosodySettings.styleRiddles
            }));
            chunks.push(pushBreak(prosodySettings.riddleBreakMs));
            chunks.push(buildProsodyChunk(answer, {
                rate: prosodySettings.riddleAnswerRate,
                pitch: prosodySettings.riddleAnswerPitch || prosodySettings.defaultPitch,
                style: prosodySettings.styleAnswers || prosodySettings.styleRiddles
            }));
        } else {
            chunks.push(buildProsodyChunk(task.text, {
                rate: prosodySettings.riddlePromptRate,
                pitch: prosodySettings.defaultPitch,
                style: prosodySettings.styleRiddles
            }));
        }
    } else if (type === 'facts') {
        chunks.push(buildProsodyChunk(task.text, {
            rate: prosodySettings.factsRate,
            pitch: prosodySettings.defaultPitch,
            style: prosodySettings.styleFacts
        }));
    } else if (type === 'quotes') {
        chunks.push(buildProsodyChunk(task.text, {
            rate: prosodySettings.quotesRate,
            pitch: prosodySettings.defaultPitch,
            style: prosodySettings.styleQuotes
        }));
    } else {
        chunks.push(buildProsodyChunk(task.text, {
            rate: prosodySettings.defaultRate,
            pitch: prosodySettings.defaultPitch
        }));
    }

    const body = chunks.filter(Boolean).join('');
    if (!body) return '';
    return `<speak version="1.0" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="${escapeXml(locale)}"><voice name="${escapeXml(voice)}">${body}</voice></speak>`;
}

function buildSsmlVariants(task, { voice, locale, prosodySettings }) {
    const variants = [];
    const expressive = buildProsodySsml(task, { voice, locale, prosodySettings });
    if (expressive) variants.push(expressive);
    variants.push(buildPlainSsml({ voice, locale, text: task.text || '' }));
    return Array.from(new Set(variants));
}

async function synthesizeTextToMp3({ token, region, voice, locale, text, ssml }) {
    const ssmlBody = String(ssml || '').trim() || buildPlainSsml({ voice, locale, text });
    const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': OUTPUT_FORMAT,
            'User-Agent': 'cornerstone-mtss-bonus-tts-exporter'
        },
        body: ssmlBody
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`TTS failed (${response.status}): ${body.slice(0, 260)}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) throw new Error('TTS returned empty audio.');
    return buffer;
}

function resolveRelativePathFromManifestEntry(manifestEntry = '', manifestBase = '') {
    const entry = String(manifestEntry || '').trim();
    if (!entry) return '';
    const base = String(manifestBase || '').replace(/\/+$/, '');
    if (entry.startsWith(`${base}/`)) return entry.slice(base.length + 1);
    return '';
}

function buildDefaultRelativePath(keyText = '') {
    const digest = crypto.createHash('sha1').update(String(keyText || '')).digest('hex').slice(0, 14);
    return `en/sentence/bonus-${digest}.mp3`;
}

function printUsage() {
    console.log(`
Azure TTS export for Word Quest bonus lines (jokes/facts/quotes/riddles)

Usage:
  node scripts/export-azure-bonus-tts.js [options]

Required:
  --region=<azure_region>         or env AZURE_SPEECH_REGION
  --key=<azure_key>               or env AZURE_SPEECH_KEY

Optional:
  --pack-id=ava-multi             (default: ava-multi)
  --pack-name="Ava Multilingual"  (defaults to existing manifest value when present)
  --voice=en-US-Ava:DragonHDLatestNeural
  --app=app.js
  --out=audio/tts/packs/<pack-id>
  --manifest-base=audio/tts/packs/<pack-id>
  --overwrite=true                regenerate existing bonus clips
  --dry-run=true                  list counts only, no Azure requests
  --limit=50                      cap number of lines
  --retries=2
  --prosody=true                  enable SSML pacing/prosody (default: true)
  --prosody-config=path.json      optional JSON override for rates/styles/breaks
  --joke-setup-rate=-3%
  --joke-punchline-rate=+8%
  --joke-break-ms=420
  --riddle-prompt-rate=-4%
  --riddle-answer-rate=+6%
  --riddle-break-ms=320
`);
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help === 'true' || args.h === 'true') {
        printUsage();
        return;
    }

    const rootDir = path.resolve(__dirname, '..');
    const packId = safePackId(args['pack-id'] || 'ava-multi');
    const appPath = path.resolve(rootDir, args.app || 'app.js');
    const outDir = args.out
        ? path.resolve(rootDir, args.out)
        : path.resolve(rootDir, 'audio', 'tts', 'packs', packId);
    const manifestBase = toForwardSlash((args['manifest-base'] || `audio/tts/packs/${packId}`).replace(/^\.\/+/, ''));
    const overwrite = args.overwrite === 'true';
    const dryRun = args['dry-run'] === 'true';
    const retries = Number.isFinite(Number(args.retries)) ? Math.max(0, Number(args.retries)) : 2;
    const limit = Number.isFinite(Number(args.limit)) ? Math.max(0, Number(args.limit)) : 0;
    const voice = String(args.voice || DEFAULT_VOICE).trim() || DEFAULT_VOICE;
    const locale = localeFromVoice(voice);
    const prosodySettings = buildProsodySettings(args, rootDir);
    const region = String(args.region || process.env.AZURE_SPEECH_REGION || '').trim();
    const key = String(args.key || process.env.AZURE_SPEECH_KEY || '').trim();
    const hasCredentials = !!(region && key);

    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find app file: ${appPath}`);
    }

    fs.mkdirSync(outDir, { recursive: true });
    const manifestPath = path.join(outDir, 'tts-manifest.json');
    const existingManifest = fs.existsSync(manifestPath)
        ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        : {};

    const utterances = collectBonusUtterances(loadBonusPools(appPath));
    const finalUtterances = limit > 0 ? utterances.slice(0, limit) : utterances;

    const tasks = finalUtterances.map((item) => {
        const manifestKey = `${item.keyText}|en|sentence`;
        const existingEntryPath = existingManifest?.entries?.[manifestKey] || '';
        const relativePath = resolveRelativePathFromManifestEntry(existingEntryPath, manifestBase) || buildDefaultRelativePath(item.keyText);
        const manifestEntryPath = `${manifestBase}/${relativePath}`;
        return {
            ...item,
            manifestKey,
            relativePath,
            manifestEntryPath,
            absolutePath: path.join(outDir, relativePath)
        };
    });

    const toGenerate = tasks.filter((task) => overwrite || !fs.existsSync(task.absolutePath));
    console.log(`[Bonus TTS] utterances=${tasks.length} generate=${toGenerate.length} reuse=${tasks.length - toGenerate.length}`);

    if (dryRun) {
        const byType = tasks.reduce((acc, task) => {
            const keyName = task.bonusType || 'other';
            acc[keyName] = (acc[keyName] || 0) + 1;
            return acc;
        }, {});
        console.log(`[Bonus TTS] voice=${voice} locale=${locale} prosody=${prosodySettings.enabled ? 'on' : 'off'}`);
        console.log(`[Bonus TTS] type-breakdown=${JSON.stringify(byType)}`);
        console.log('[Bonus TTS] Dry run complete. No Azure requests were made.');
        return;
    }
    if (!hasCredentials && toGenerate.length > 0) {
        throw new Error('Missing Azure credentials. Provide --region/--key or AZURE_SPEECH_REGION/AZURE_SPEECH_KEY.');
    }

    let token = null;
    let tokenIssuedAt = 0;
    if (toGenerate.length > 0) {
        token = await fetchAzureToken(region, key);
        tokenIssuedAt = Date.now();
    }

    let generated = 0;
    let reused = 0;
    let failed = 0;
    let generatedWithProsody = 0;
    let generatedWithPlainFallback = 0;
    const failures = [];

    for (let i = 0; i < tasks.length; i += 1) {
        const task = tasks[i];
        fs.mkdirSync(path.dirname(task.absolutePath), { recursive: true });
        if (!overwrite && fs.existsSync(task.absolutePath)) {
            reused += 1;
        } else {
            if (token && (Date.now() - tokenIssuedAt) > (8 * 60 * 1000)) {
                token = await fetchAzureToken(region, key);
                tokenIssuedAt = Date.now();
            }
            let success = false;
            let lastError = '';
            const ssmlVariants = buildSsmlVariants(task, { voice, locale, prosodySettings });
            for (let ssmlIndex = 0; ssmlIndex < ssmlVariants.length; ssmlIndex += 1) {
                const ssml = ssmlVariants[ssmlIndex];
                for (let attempt = 0; attempt <= retries; attempt += 1) {
                    try {
                        const buffer = await synthesizeTextToMp3({
                            token,
                            region,
                            voice,
                            locale,
                            text: task.text,
                            ssml
                        });
                        fs.writeFileSync(task.absolutePath, buffer);
                        generated += 1;
                        if (ssmlIndex === 0 && prosodySettings.enabled) {
                            generatedWithProsody += 1;
                        } else {
                            generatedWithPlainFallback += 1;
                        }
                        success = true;
                        break;
                    } catch (error) {
                        lastError = error && error.message ? error.message : 'Unknown TTS error';
                        const transient = /(terminated|timeout|timed out|socket|network|fetch failed|econnreset|aborted|429|502|503|504)/i.test(lastError);
                        if (attempt >= retries || !transient) break;
                    }
                }
                if (success) break;
            }
            if (!success) {
                failed += 1;
                failures.push({ key: task.manifestKey, text: task.text, error: lastError || 'Unknown TTS error' });
                console.error(`[Bonus TTS] failed ${task.manifestKey}: ${lastError || 'Unknown TTS error'}`);
            }
        }

        if ((i + 1) % 25 === 0 || i === tasks.length - 1) {
            console.log(`[Bonus TTS] progress ${i + 1}/${tasks.length} (generated=${generated}, reused=${reused}, failed=${failed}, prosody=${generatedWithProsody}, fallback=${generatedWithPlainFallback})`);
        }
    }

    const mergedEntries = {
        ...(existingManifest?.entries && typeof existingManifest.entries === 'object' ? existingManifest.entries : {})
    };
    tasks.forEach((task) => {
        mergedEntries[task.manifestKey] = task.manifestEntryPath;
    });

    const langSet = new Set(Array.isArray(existingManifest?.languages) ? existingManifest.languages : []);
    langSet.add('en');
    const fieldSet = new Set(Array.isArray(existingManifest?.fields) ? existingManifest.fields : []);
    fieldSet.add('sentence');

    const voiceMap = {
        ...(existingManifest?.voiceMap && typeof existingManifest.voiceMap === 'object' ? existingManifest.voiceMap : {}),
        en: voice
    };

    const manifest = {
        version: 1,
        generatedAt: new Date().toISOString(),
        region: region || existingManifest?.region || '',
        format: OUTPUT_FORMAT,
        packId,
        packName: String(args['pack-name'] || existingManifest?.packName || `${packId} voice pack`).trim(),
        languages: Array.from(langSet),
        fields: Array.from(fieldSet),
        voiceMap,
        entries: mergedEntries
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    const reportPath = path.join(outDir, 'bonus-tts-export-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        generatedAt: manifest.generatedAt,
        packId,
        packName: manifest.packName,
        utterances: tasks.length,
        generated,
        reused,
        failed,
        generatedWithProsody,
        generatedWithPlainFallback,
        voice,
        locale,
        prosodySettings,
        retries,
        failures
    }, null, 2));

    console.log(`[Bonus TTS] Done. Manifest: ${manifestPath}`);
    console.log(`[Bonus TTS] Report:   ${reportPath}`);
}

main().catch((error) => {
    const message = error && error.message ? error.message : String(error);
    console.error(`[Bonus TTS] ${message}`);
    process.exit(1);
});
