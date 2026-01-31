# Contributing to Decode the Word

Thank you for your interest in contributing! This project has a unique philosophy centered on **pedagogy-first development**.

## 🎯 Before You Start

### Required Reading
1. **`docs/VISION.md`** — Understand the core mission
2. **`docs/AI_AGENT_INSTRUCTIONS.md`** — Development principles
3. **`docs/UX_PRINCIPLES.md`** — Design philosophy
4. **`docs/DATA_SCHEMAS.md`** — Data structure guidelines

### Core Principle
**This tool exists to remove barriers, not add features.**

## ✅ What We Welcome

### Highly Encouraged
- 📖 **Word database expansion** — Add more high-quality word entries
- ♿ **Accessibility improvements** — Better screen reader support, keyboard navigation
- 🌍 **Multilingual UI translations** (keeping phonics in English)
- 🎨 **UX enhancements** that reduce cognitive load
- 🐛 **Bug fixes** with clear reproduction steps
- 📚 **Documentation improvements**
- 🧪 **Test coverage** (when adding tests)

### Acceptable with Discussion
- ✨ **New features** that align with research-based pedagogy
- 🔧 **Refactoring** with clear pedagogical reasoning
- 🎵 **Audio/voice improvements**
- 📊 **Analytics** (privacy-preserving only)

## ❌ What We Don't Accept

### Will Be Rejected
- ❌ Feature removal "for simplicity" without pedagogical justification
- ❌ Breaking changes that remove accessibility
- ❌ Dependencies on external frameworks (React, Vue, etc.)
- ❌ Tracking/analytics that compromise student privacy
- ❌ Login requirements or user accounts
- ❌ Monetization features
- ❌ "Gamification" that distracts from learning

## 📝 How to Contribute

### 1. Open an Issue First
Before writing code, open an issue to discuss:
- What problem you're solving
- How it aligns with our pedagogical goals
- Your proposed approach

### 2. Fork and Branch
```bash
git clone https://github.com/yourusername/decode-the-word.git
cd decode-the-word
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Keep code **readable** over clever
- Add comments explaining **why**, not what
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices (iOS, Android)
- Ensure accessibility (keyboard navigation, screen readers)

### 4. Test Thoroughly
- Does it work for 3-letter words? 7-letter words?
- Does it work with all phonics patterns?
- Does it work in Teacher Mode?
- Does the Recording Studio still work?
- Does it work offline after first load?

### 5. Submit Pull Request
Include in your PR description:
- **What** — Clear description of changes
- **Why** — Pedagogical rationale
- **How** — Technical approach
- **Testing** — What you tested and how
- **Screenshots** — For UI changes

### PR Template
```markdown
## Description
Brief description of changes

## Pedagogical Rationale
How does this improve learning outcomes?

## Changes Made
- Change 1
- Change 2

## Testing Done
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested on mobile
- [ ] Tested all phonics patterns
- [ ] Tested Teacher Mode
- [ ] Tested Recording Studio

## Screenshots (if applicable)
Add screenshots here
```

## 🎨 Style Guidelines

### JavaScript
- Use **clear variable names** over short ones
- Add **comments for pedagogy**, not obvious code
- Keep functions **focused and readable**
- Avoid **clever tricks** — clarity wins

### CSS
- Use **CSS variables** for consistency
- **Mobile-first** responsive design
- **High contrast** for accessibility
- **Calm, predictable** animations only

### HTML
- **Semantic HTML** for screen readers
- **Clear IDs** that explain purpose
- **ARIA labels** where needed

## 📊 Adding Words

### Word Entry Requirements
Every word must have:
- ✅ **syllables** — Properly hyphenated
- ✅ **tags** — Correct phonics pattern(s)
- ✅ **partOfSpeech** — noun, verb, adjective, etc.
- ✅ **def** — Age-appropriate definition
- ✅ **sentence** — Natural, engaging example

Optional but encouraged:
- **enrichment** — Etymology, connections, deeper learning
- **fun** — Mnemonics, jokes, memorable phrases
- **decodableSentence** — Simple sentence for early readers

### Word Entry Example
```javascript
"storm": {
    syllables: "storm",
    tags: ["r_controlled", "blend"],
    partOfSpeech: "noun",
    def: "A violent weather event with wind, rain, or snow.",
    sentence: "The storm knocked out power for three days.",
    enrichment: "The word 'storm' comes from Old English and is related to 'stir' and 'disturb'.",
    fun: "After a storm comes a calm.",
    decodableSentence: "The storm is strong."
}
```

## 🐛 Reporting Bugs

### Good Bug Report
```markdown
**Browser:** Chrome 120 on macOS
**Steps to Reproduce:**
1. Select CVC pattern
2. Choose 4-letter words
3. Type "test"
4. Click submit

**Expected:** Word submits
**Actual:** Nothing happens
**Console Errors:** [paste any errors]
```

## 💡 Feature Requests

### Good Feature Request
```markdown
**Feature:** Add digraph highlighting in word tiles

**Pedagogical Goal:** Help students visually identify digraphs (sh, ch, th)

**User Story:** As a teacher, I want digraphs highlighted so students can see the letter patterns that make single sounds.

**Proposed Implementation:** Underline or color-code digraph tiles differently

**Research Backing:** Visual chunking supports orthographic mapping (Ehri, 2005)
```

## 🤝 Code of Conduct

### Our Commitment
- Be **respectful** of diverse perspectives
- Be **patient** with new contributors
- Focus on **learning outcomes**, not personal preferences
- Remember: **Pedagogy over code elegance**

### Unacceptable Behavior
- Dismissing accessibility concerns
- Proposing features that harm learning
- Disrespecting educators or researchers
- Ignoring the project's core values

## 📞 Questions?

- 💬 **Discussions:** Use GitHub Discussions for questions
- 🐛 **Issues:** For bugs and feature requests
- 📧 **Email:** [contact info if available]

---

**Thank you for helping make literacy instruction more accessible and effective!**

*Students think it's a game. Teachers know it's instruction.*
