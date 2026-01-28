/* ======================================================
   Phonics Wordle — App Configuration
   This file is SAFE to edit.
====================================================== */

window.APP_CONFIG = {

  /* -------------------------
     DEFAULT GAME SETTINGS
  -------------------------- */
  DEFAULTS: {
    focus: "none",       // Default category (none = mixed)
    wordLength: 5,       // Default word length
    guesses: 6           // Default number of tries
  },

  /* -------------------------
     BEHAVIOR FLAGS
  -------------------------- */
  FEATURES: {
    enableVoice: true,          // Master switch for audio buttons
    enableConfetti: true,       // Celebration animation on win
    enableHelpOnLoad: true,     // Show instructions on first load
    autoResetOnRefresh: true,   // Always get a new word on reload
    
    // SCIENCE OF READING MODES
    enableSyllables: true,      // (Future) Allow toggling syllable breaks
    enableDictation: false      // IF TRUE: App speaks word immediately on start (Spelling focus)
                                // IF FALSE: App is silent until you click "Hear Word"
  },

  /* -------------------------
     HOW TO PLAY (HTML)
     This content appears in the Help Modal
  -------------------------- */
  HOW_TO_PLAY_HTML: `
    <p><strong>Guess the word</strong> in the number of tries shown.</p>
    <p>Each guess must use the correct number of letters.</p>

    <ul>
      <li><span style="color:#22c55e;font-weight:700;">Green</span> means the sound/letter is correct.</li>
      <li><span style="color:#f59e0b;font-weight:700;">Yellow</span> means it is in the word, but wrong spot.</li>
      <li><span style="color:#94a3b8;font-weight:700;">Gray</span> means it is not in the word.</li>
    </ul>

    <p><strong>Tools for Learning:</strong></p>
    <ul>
      <li>Tap <strong>🎧 Word</strong> to hear the target word.</li>
      <li>Tap <strong>🗣️ Sentence</strong> to hear it used in context.</li>
      <li>Change <strong>Focus</strong> to practice specific patterns (like Magic-E).</li>
    </ul>
  `
};