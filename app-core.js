(() => {
  "use strict";

  /* ======================================================
     Phonics Wordle — Core Engine (Clean, Aligned, Stable)
     Aligned to canonical words.js schema
  ====================================================== */

  const CFG = window.APP_CONFIG;
  const DATA = window.PHONICS_DATA;

  if (!CFG || !DATA) {
    console.error("Missing APP_CONFIG or PHONICS_DATA");
    return;
  }

  /* ======================================================
     DOM HELPERS
  ====================================================== */
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ======================================================
     DOM ELEMENTS
  ====================================================== */
  const boardEl = $("game-board");
  const keyboardEl = $("keyboard");

  const focusSelect = $("focus-select");
  const lengthSelect = $("length-select");
  const guessSelect = $("guess-select");

  const helpBtn = $("help-btn");
  const howtoModal = $("howto-modal");
  const howtoText = $("howto-text");

  const endModal = $("end-modal");
  const endWordEl = $("end-word");
  const endDefEl = $("end-definition");
  const endSentenceEl = $("end-sentence");
  const endFunEl = $("end-fun");

  const hearWordBtn = $("hear-word");
  const hearSentenceBtn = $("hear-sentence");
  const voiceToggleBtn = $("voice-toggle");

  const teacherInput = $("teacher-word");
  const teacherSetBtn = $("set-teacher-word");
  const teacherToast = $("teacher-toast");

  /* ======================================================
     STATE
  ====================================================== */
  let targetWord = "";
  let currentEntry = null;

  let wordLength = CFG.DEFAULTS.wordLength;
  let maxGuesses = CFG.DEFAULTS.guesses;

  let row = 0;
  let col = 0;
  let gameOver = false;
  let voiceEnabled = CFG.FEATURES.enableVoice;

  /* ======================================================
     INIT
  ====================================================== */
  function init() {
    buildSelectors();
    bindEvents();
    buildKeyboard();
    resetGame(true);

    if (CFG.FEATURES.showHelpOnLoad) {
      openHowTo();
    }
  }

  /* ======================================================
     SELECTORS
  ====================================================== */
  function buildSelectors() {
    fillSelect(focusSelect, DATA.FOCUS_OPTIONS);
    fillSelect(lengthSelect, [2,3,4,5,6,7,8,9,10]);
    fillSelect(guessSelect, [4,5,6,7,8]);

    lengthSelect.value = CFG.DEFAULTS.wordLength;
    guessSelect.value = CFG.DEFAULTS.guesses;
  }

  function fillSelect(select, values) {
    select.innerHTML = "";
    values.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.value ?? v;
      opt.textContent = v.label ?? v;
      select.appendChild(opt);
    });
  }

  /* ======================================================
     EVENTS
  ====================================================== */
  function bindEvents() {
    focusSelect.addEventListener("change", () => resetGame(true));
    lengthSelect.addEventListener("change", () => resetGame(true));
    guessSelect.addEventListener("change", () => resetGame(true));

    helpBtn.addEventListener("click", openHowTo);

    hearWordBtn.addEventListener("click", () => speak(targetWord));
    hearSentenceBtn.addEventListener("click", () => {
      if (currentEntry?.sentence) speak(currentEntry.sentence);
    });

    voiceToggleBtn.addEventListener("click", toggleVoice);

    teacherSetBtn.addEventListener("click", setTeacherWord);
    teacherInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setTeacherWord();
      }
    });

    document.addEventListener("keydown", handleKeyDown);
    howtoModal.addEventListener("click", (e) => {
      if (e.target === howtoModal) closeHowTo();
    });
    endModal.addEventListener("click", (e) => {
      if (e.target === endModal) closeEndModal();
    });
  }

  /* ======================================================
     GAME RESET
  ====================================================== */
  function resetGame(settingsChanged = false) {
    row = 0;
    col = 0;
    gameOver = false;

    wordLength = parseInt(lengthSelect.value, 10);
    maxGuesses = parseInt(guessSelect.value, 10);

    resetKeyboard();
    closeEndModal();

    targetWord = pickWord();
    currentEntry = DATA.WORD_ENTRIES[targetWord];

    buildBoard();
  }

  function pickWord() {
    const focus = focusSelect.value;
    const pool = DATA.ANSWER_POOLS[focus] || DATA.ANSWER_POOLS.none;

    const filtered = pool.filter(w => w.length === wordLength);
    if (!filtered.length) {
      console.warn("No words found for focus/length; falling back.");
      return DATA.ANSWER_POOLS.none.find(w => w.length === wordLength) || pool[0];
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /* ======================================================
     BOARD
  ====================================================== */
  function buildBoard() {
    boardEl.innerHTML = "";
    for (let r = 0; r < maxGuesses; r++) {
      const rowEl = document.createElement("div");
      rowEl.className = "row";
      for (let c = 0; c < wordLength; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.row = r;
        tile.dataset.col = c;
        rowEl.appendChild(tile);
      }
      boardEl.appendChild(rowEl);
    }
  }

  /* ======================================================
     INPUT HANDLING
  ====================================================== */
  function handleKeyDown(e) {
    if (howtoModal.classList.contains("open")) {
      if (e.key === "Enter" || e.key === "Escape") {
        closeHowTo();
      }
      return;
    }

    if (endModal.classList.contains("open")) {
      if (e.key === "Enter" || e.key === "Escape") {
        closeEndModal();
      }
      return;
    }

    if (gameOver) return;

    if (e.key === "Enter") submitGuess();
    else if (e.key === "Backspace") removeLetter();
    else if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key.toLowerCase());
  }

  function addLetter(letter) {
    if (col >= wordLength) return;
    const tile = getTile(row, col);
    tile.textContent = letter;
    tile.dataset.letter = letter;
    col++;
  }

  function removeLetter() {
    if (col === 0) return;
    col--;
    const tile = getTile(row, col);
    tile.textContent = "";
    tile.dataset.letter = "";
  }

  /* ======================================================
     GUESS LOGIC
  ====================================================== */
  function submitGuess() {
    if (col < wordLength) return;

    let guess = "";
    for (let i = 0; i < wordLength; i++) {
      guess += getTile(row, i).dataset.letter;
    }

    revealGuess(guess);

    if (guess === targetWord) endGame(true);
    else if (row === maxGuesses - 1) endGame(false);
    else {
      row++;
      col = 0;
    }
  }

  function revealGuess(guess) {
    const answer = targetWord.split("");
    const used = Array(wordLength).fill(false);

    // correct
    for (let i = 0; i < wordLength; i++) {
      const tile = getTile(row, i);
      if (guess[i] === answer[i]) {
        tile.classList.add("correct");
        markKey(guess[i], "correct");
        used[i] = true;
      }
    }

    // present / absent
    for (let i = 0; i < wordLength; i++) {
      const tile = getTile(row, i);
      if (tile.classList.contains("correct")) continue;

      const idx = answer.findIndex((l, j) => l === guess[i] && !used[j]);
      if (idx >= 0) {
        tile.classList.add("present");
        markKey(guess[i], "present");
        used[idx] = true;
      } else {
        tile.classList.add("absent");
        markKey(guess[i], "absent");
      }
    }
  }

  /* ======================================================
     END GAME
  ====================================================== */
  function endGame(win) {
    gameOver = true;

    endWordEl.textContent = targetWord;
    endDefEl.textContent = currentEntry?.definition || "";
    endSentenceEl.textContent = currentEntry?.sentence || "";

    if (DATA.FUN_CONTENT?.length) {
      endFunEl.textContent =
        DATA.FUN_CONTENT[Math.floor(Math.random() * DATA.FUN_CONTENT.length)];
    } else {
      endFunEl.textContent = "";
    }

    endModal.classList.add("open");

    if (win) triggerConfetti();
  }

  function closeEndModal() {
    endModal.classList.remove("open");
  }

  /* ======================================================
     KEYBOARD
  ====================================================== */
  function buildKeyboard() {
    const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    keyboardEl.innerHTML = "";

    rows.forEach((rowStr, idx) => {
      const rowEl = document.createElement("div");
      rowEl.className = "kb-row";

      if (idx === 2) rowEl.appendChild(makeKey("Enter"));

      rowStr.split("").forEach(ch => rowEl.appendChild(makeKey(ch)));

      if (idx === 2) rowEl.appendChild(makeKey("⌫"));

      keyboardEl.appendChild(rowEl);
    });
  }

  function makeKey(label) {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = label;
    btn.onclick = () => {
      if (label === "Enter") submitGuess();
      else if (label === "⌫") removeLetter();
      else addLetter(label);
    };
    return btn;
  }

  function markKey(letter, state) {
    const key = [...$$(".key")].find(k => k.textContent === letter);
    if (!key) return;
    if (state === "correct" || !key.classList.contains("correct")) {
      key.classList.remove("present", "absent");
      key.classList.add(state);
    }
  }

  function resetKeyboard() {
    $$(".key").forEach(k => {
      k.classList.remove("correct", "present", "absent");
    });
  }

  /* ======================================================
     TEACHER WORD
  ====================================================== */
  function setTeacherWord() {
    const val = teacherInput.value.trim().toLowerCase();
    if (val.length < 2 || val.length > 10) return;

    if (!DATA.WORD_ENTRIES[val]) {
      DATA.WORD_ENTRIES[val] = {
        definition: "Teacher-added word.",
        sentence: "The teacher chose this word for practice.",
        tags: ["teacher"],
        seasonal: []
      };
      DATA.ANSWER_POOLS.none.push(val);
    }

    lengthSelect.value = val.length;
    targetWord = val;
    currentEntry = DATA.WORD_ENTRIES[val];

    teacherInput.value = "";
    showTeacherToast("Teacher word set");
    resetGame(true);
  }

  function showTeacherToast(msg) {
    teacherToast.textContent = msg;
    teacherToast.classList.add("show");
    setTimeout(() => teacherToast.classList.remove("show"), 1200);
  }

  /* ======================================================
     MODALS + VOICE
  ====================================================== */
  function openHowTo() {
    howtoText.innerHTML = CFG.HOW_TO_PLAY_HTML || "";
    howtoModal.classList.add("open");
  }

  function closeHowTo() {
    howtoModal.classList.remove("open");
  }

  function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    voiceToggleBtn.textContent = voiceEnabled ? "Voice On" : "Voice Off";
  }

  function speak(text) {
    if (!voiceEnabled || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  /* ======================================================
     CONFETTI (SUBTLE)
  ====================================================== */
  function triggerConfetti() {
    if (!window.confetti) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.7 }
    });
  }

  /* ======================================================
     HELPERS
  ====================================================== */
  function getTile(r, c) {
    return boardEl.children[r].children[c];
  }

  /* ======================================================
     START
  ====================================================== */
  init();
})();
