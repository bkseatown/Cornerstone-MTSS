# 🔤 Decode the Word — Phonics Wordle

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**A research-aligned, equity-centered phonics game that makes literacy instruction engaging and effective.**

> **Students think it's a game. Teachers know it's instruction. Families feel included in their own language.**

## 🎯 What Makes This Different

This is **NOT** just another Wordle clone. It's a carefully designed literacy platform built on Science of Reading (SoR) principles with:

- ✅ **Research-aligned phonics patterns** (CVC, CVCe, digraphs, blends, vowel teams, r-controlled)
- ✅ **Multilingual support** for English Language Learners
- ✅ **Accessibility-first design** for students with ASD, ADHD, dyslexia
- ✅ **Teacher controls** for custom word selection
- ✅ **Audio recording studio** for authentic pronunciation
- ✅ **Rich word entries** with definitions, sentences, enrichment, and decodable examples

## 🚀 Quick Start

### Play Now
Simply open `index.html` in any modern browser. No installation required!

### GitHub Pages Deployment
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from branch" → `main` → `/root`
4. Your app will be live at `https://yourusername.github.io/decode-the-word/`

### Local Development
```bash
git clone https://github.com/yourusername/decode-the-word.git
cd decode-the-word
# Open index.html in your browser
```

## 📚 Features

### For Students
- **Engaging gameplay** that builds phonics skills
- **Audio support** for every word and sentence
- **Visual feedback** with color-coded tiles (green = correct, yellow = in word)
- **Multiple difficulty levels** (3-7 letter words)
- **Quick-entry tiles** for common patterns

### For Teachers
- **Custom word mode** — Set specific words for your class
- **Focus patterns** — Target specific phonics skills
- **Recording studio** — Add your voice or student voices
- **No login required** — Privacy-first design
- **Works offline** after first load

### For Developers
- **Clean, documented code** (no minification)
- **Modular architecture** (separate data/logic/presentation)
- **IndexedDB storage** for audio recordings
- **Mobile-responsive** with iOS/Android support
- **Extensible word database** in `words.js`

## 📖 How to Use

### Basic Play
1. Select a **Focus Pattern** (e.g., CVC, Digraphs)
2. Choose **Word Length** (3-7 letters)
3. Type your guess using the keyboard
4. Use **hints** to hear the word or a sentence
5. Learn from feedback and try again!

### Teacher Mode
1. Click **"Teacher"** button
2. Enter a custom word (3-10 letters)
3. Click **"Set Word & Start Game"**
4. Students will practice your chosen word

### Recording Studio
1. Go to Teacher Mode → **"Open Recording Studio"**
2. Choose words from your focus pattern or paste a custom list
3. Record the word pronunciation
4. Record the sentence
5. Recordings are saved locally and used automatically

## 🏗️ Project Structure

```
decode-the-word/
├── index.html          # Main application file
├── style.css           # All styling (no frameworks)
├── script.js           # Game logic and audio handling
├── words.js            # Word database (4000+ entries)
├── README.md           # This file
└── docs/               # Vision and design documents
```

## 🎨 Design Principles

From `UX_PRINCIPLES.md`:
- **Calm** — No overwhelming animations or sounds
- **Predictable** — Consistent behavior builds confidence
- **Visual** — Icons and colors over text
- **Low text** — Reduces cognitive load
- **High contrast** — Accessibility for all learners

> Design for ASD / ADHD / EAL first. If it works for them, it works for everyone.

## 📊 Word Database Schema

Each word entry in `words.js` includes:

```javascript
"example": {
    syllables: "ex-am-ple",
    tags: ["vowel_team", "multi_syllable"],
    partOfSpeech: "noun",
    def: "Something used to illustrate a point.",
    sentence: "This is an example of a well-designed word entry.",
    enrichment: "The word 'example' comes from Latin 'exemplum'.",
    fun: "Be the example you want to see in the world!",
    decodableSentence: "The example is simple."
}
```

## 🔧 Customization

### Adding New Words
Edit `words.js` and add entries following the schema above:

```javascript
"newword": {
    syllables: "new-word",
    tags: ["cvc"],  // phonics pattern
    partOfSpeech: "noun",
    def: "Your definition here",
    sentence: "Example sentence with the word.",
    enrichment: "Optional: Etymology or fun fact",
    fun: "Optional: Joke or memorable phrase",
    decodableSentence: "Optional: Simple decodable sentence"
}
```

## 🌍 Multilingual Support

The architecture supports translation through a **curated glossary approach** (no API required):
- High-frequency words have pre-translated definitions
- Works offline and on GitHub Pages
- FERPA/COPPA compliant (no external services)
- Teachers can expand the glossary by editing `script.js`

**Why no API?** Translation APIs require secret keys that can't be safely stored in client-side code. Our curated approach provides:
- ✅ Privacy (no data sent externally)
- ✅ Reliability (always works offline)
- ✅ Pedagogy (focus on English phonics + meaning connections)
- ✅ Cost (completely free)

## 🎤 Audio System

- **System TTS** — Built-in text-to-speech (auto-selects best voice)
- **Custom recordings** — Store your own audio in IndexedDB
- **Fallback hierarchy** — Custom audio → TTS

## 🧪 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (iOS 14+)
- ✅ Samsung Internet 14+

**Requirements:**
- JavaScript enabled
- Web Audio API support
- IndexedDB for audio storage (optional)

## 🤝 Contributing

We welcome contributions that align with our **pedagogy-first** philosophy!

### Before Contributing
1. Read `docs/VISION.md` — Understand the "why"
2. Read `docs/AI_AGENT_INSTRUCTIONS.md` — Development guidelines
3. Check existing issues and PRs

### Guidelines
- ❌ **Don't** remove features to "simplify"
- ❌ **Don't** refactor without understanding pedagogy
- ✅ **Do** add accessibility improvements
- ✅ **Do** expand word database
- ✅ **Do** add research-backed features

## 📄 License

MIT License — Feel free to use this in your classroom or adapt for your needs.

## 🙏 Acknowledgments

- Built on **Science of Reading** research
- Inspired by **Universal Design for Learning** (UDL)
- Designed for **Multi-Tiered Systems of Support** (MTSS)
- Fonts: [Fredoka](https://fonts.google.com/specimen/Fredoka) & [Lexend](https://fonts.google.com/specimen/Lexend)

---

**Built with ❤️ for educators and learners everywhere.**

*This tool exists to remove barriers, not add features.*
