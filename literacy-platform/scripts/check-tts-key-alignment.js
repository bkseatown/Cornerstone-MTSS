#!/usr/bin/env node

// MUST match app.js normalizeCustomWordInput.
function normalizeCustomWordInput(value) {
  return String(value || '').trim().toLowerCase();
}

// MUST match literacy-platform/scripts/export-azure-tts.js safeWordSlug.
function safeWordSlug(word = '') {
  const slug = String(word || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'word';
}

function normalizePackedTtsLanguage(languageCode = 'en') {
  const code = String(languageCode || 'en').trim().toLowerCase();
  if (!code) return 'en';
  if (code === 'en' || code.startsWith('en-')) return 'en';
  if (code === 'es' || code.startsWith('es-')) return 'es';
  if (code === 'zh' || code.startsWith('zh-') || code === 'cmn') return 'zh';
  if (code === 'tl' || code === 'tagalog' || code === 'fil' || code.startsWith('fil-') || code === 'filipino') return 'tl';
  if (code === 'hi' || code.startsWith('hi-')) return 'hi';
  return code.slice(0, 2);
}

function normalizePackedTtsType(type = 'word') {
  const raw = String(type || 'word').trim().toLowerCase();
  if (raw === 'definition' || raw === 'def') return 'def';
  if (raw === 'sentence' || raw === 'sent') return 'sentence';
  if (raw === 'passage' || raw === 'text') return 'passage';
  if (raw === 'phoneme' || raw === 'sound') return 'phoneme';
  return 'word';
}

function runtimeKey(word, languageCode = 'en', type = 'word') {
  const rawWord = String(word || '').trim();
  if (!rawWord) return '';
  const lang = normalizePackedTtsLanguage(languageCode);
  const field = normalizePackedTtsType(type);
  return `${safeWordSlug(rawWord)}|${lang}|${field}`;
}

function expectedPath(base, word, languageCode = 'en', type = 'word') {
  const lang = normalizePackedTtsLanguage(languageCode);
  const field = normalizePackedTtsType(type);
  return `${base}/${lang}/${field}/${safeWordSlug(word)}.mp3`;
}

const samples = [
  'Analyze!',
  "can't",
  'U.S.',
  'in front of',
  '5th grade',
  'photosynthesis',
  'x-axis'
];

const manifestBase = process.argv[2] || 'audio/tts';

samples.forEach((word) => {
  console.log(JSON.stringify({
    input: word,
    normalizeCustomWordInput: normalizeCustomWordInput(word),
    safeWordSlug: safeWordSlug(word),
    runtimeKey: runtimeKey(word, 'en', 'word'),
    expectedPath: expectedPath(manifestBase, word, 'en', 'word')
  }));
});
