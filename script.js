document.addEventListener("DOMContentLoaded", function () {

  /* ================= MODAL ================= */
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-modal");
  const startBtn = document.getElementById("start-btn");

  function openModal(title, text, action = "OK") {
    overlay.querySelector("h2").textContent = title;
    overlay.querySelector("p").textContent = text;
    startBtn.textContent = action;
    overlay.style.display = "flex";
  }
  function closeModal() {
    overlay.style.display = "none";
  }

  closeBtn.onclick = closeModal;
  startBtn.onclick = closeModal;
  overlay.onclick = e => e.target === overlay && closeModal();
  window.addEventListener("keydown", e => {
    if (overlay.style.display !== "none" && (e.key === "Escape" || e.key === "Enter")) {
      closeModal();
      e.preventDefault();
    }
  });

  overlay.style.display = "flex";

  /* ================= FOCUS TAXONOMY ================= */
  const FOCUS_INFO = {
    mixed: {
      label: "Mixed Review",
      desc: "A mix of previously learned phonics patterns.",
      examples: ["cat", "ship", "train"],
      hint: "Scan the whole word before guessing.",
      words: ["plant", "ship", "train", "flag", "stone"]
    },
    cvc: {
      label: "CVC",
      desc: "Consonant–vowel–consonant words with short vowels.",
      examples: ["cat", "sun", "bed"],
      hint: "Say each sound, then blend.",
      words: ["cat", "bed", "sun", "map", "top"]
    },
    digraphs: {
      label: "Digraphs",
      desc: "Two letters that make one sound.",
      examples: ["ship", "chop", "thin"],
      hint: "Look for letters that stick together.",
      words: ["ship", "thin", "chop", "when", "that"]
    },
    blends: {
      label: "Blends",
      desc: "Two or three consonants blended together.",
      examples: ["stop", "flag", "clip"],
      hint: "Each sound is heard quickly.",
      words: ["stop", "flag", "clip", "frog", "brisk"]
    },
    floss: {
      label: "FLOSS",
      desc: "Short vowel words ending in ff, ll, ss, zz.",
      examples: ["hill", "buzz", "off"],
      hint: "Double the final consonant.",
      words: ["hill", "buzz", "miss", "off", "fizz"]
    },
    magicE: {
      label: "Magic E",
      desc: "Silent e makes the vowel say its name.",
      examples: ["make", "time", "hope"],
      hint: "The e is quiet but powerful.",
      words: ["make", "time", "hope", "cake", "fine"]
    },
    prefixes: {
      label: "Prefixes",
      desc: "Word parts added to the beginning.",
      examples: ["redo", "unhappy"],
      hint: "Prefixes change meaning.",
      words: ["redo", "unfair", "preview", "unlock", "replay"]
    },
    suffixes: {
      label: "Suffixes",
      desc: "Word parts added to the end.",
      examples: ["jumped", "playing"],
      hint: "Suffixes change tense or number.",
      words: ["played", "jumped", "cats", "running", "helpful"]
    },
    schwa: {
      label: "Schwa",
      desc: "An unstressed vowel that sounds like /uh/.",
      examples: ["about", "animal"],
      hint: "Say it naturally.",
      words: ["about", "animal", "pencil", "problem", "family"]
    },
    multisyllabic: {
      label: "Multisyllabic",
      desc: "Words with two or more syllables.",
      examples: ["robot", "basket", "important"],
      hint: "Clap the syllables, then decode each part.",
      words: ["robot", "basket", "sunset", "important", "fantastic"]
    }
  };

  const focusSelect = document.getElementById("focus-select");
  const focusTitle = document.getElementById("focus-title");
  const focusDesc = document.getElementById("focus-desc");
  const focusExamples = document.getElementById("focus-examples");
  const focusHint = document.getElementById("focus-hint");

  Object.keys(FOCUS_INFO).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${FOCUS_INFO[key].label} (${FOCUS_INFO[key].examples.join(", ")})`;
    focusSelect.appendChild(opt);
  });

  function updateFocusPanel(key) {
    const f = FOCUS_INFO[key];
    focusTitle.textContent = f.label;
    focusDesc.textContent = f.desc;
    focusExamples.textContent = f.examples.join(", ");
    focusHint.textContent = "Tip: " + f.hint;
  }

  updateFocusPanel("mixed");

  /* ================= WORDLE GAMEPLAY ================= */
  const board = document.getElementById("board");
  const keyboard = document.getElementById("keyboard");

  const ROWS = 6;
  let COLS = 5;
  let currentRow = 0;
  let currentCol = 0;
  let answer = "";
  let guesses = Array.from({ length: ROWS }, () => []);

  function lockFocus(lock) {
    focusSelect.disabled = lock;
  }

  function chooseWord() {
    const f = FOCUS_INFO[focusSelect.value];
    const pool = f.words.filter(w => w.length === COLS);
    answer = pool[Math.floor(Math.random() * pool.length)].toUpperCase();
  }

  function buildBoard() {
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${COLS}, 60px)`;
    for (let r = 0; r < ROWS * COLS; r++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      board.appendChild(tile);
    }
  }

  function resetGame() {
    currentRow = 0;
    currentCol = 0;
    guesses = Array.from({ length: ROWS }, () => []);
    COLS = Number(document.getElementById("length-select").value || 5);
    buildBoard();
    chooseWord();
    lockFocus(true);
  }

  function getTile(r, c) {
    return board.children[r * COLS + c];
  }

  function addLetter(l) {
    if (currentCol >= COLS) return;
    guesses[currentRow][currentCol] = l;
    const tile = getTile(currentRow, currentCol);
    tile.textContent = l;
    currentCol++;
  }

  function removeLetter() {
    if (currentCol === 0) return;
    currentCol--;
    guesses[currentRow][currentCol] = "";
    getTile(currentRow, currentCol).textContent = "";
  }

  function submitGuess() {
    if (currentCol < COLS) return;

    const guess = guesses[currentRow].join("");
    const answerArr = answer.split("");
    const used = Array(COLS).fill(false);

    // Greens
    for (let i = 0; i < COLS; i++) {
      const tile = getTile(currentRow, i);
      if (guess[i] === answer[i]) {
        tile.style.background = "#6aaa64";
        tile.style.color = "#fff";
        used[i] = true;
      }
    }
    // Yellows / Grays
    for (let i = 0; i < COLS; i++) {
      const tile = getTile(currentRow, i);
      if (tile.style.background) continue;
      const idx = answerArr.findIndex((l, j) => l === guess[i] && !used[j]);
      if (idx > -1) {
        tile.style.background = "#c9b458";
        tile.style.color = "#fff";
        used[idx] = true;
      } else {
        tile.style.background = "#787c7e";
        tile.style.color = "#fff";
      }
    }

    if (guess === answer) {
      openModal("Nice decoding! 🎉", `You decoded "${answer}".`, "Play Again");
      lockFocus(false);
      return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === ROWS) {
      openModal("Good try!", `The word was "${answer}".`, "Play Again");
      lockFocus(false);
    }
  }

  /* ================= INPUT ================= */
  window.addEventListener("keydown", e => {
    if (overlay.style.display !== "none") return;
    const k = e.key.toUpperCase();
    if (k === "ENTER") submitGuess();
    else if (k === "BACKSPACE") removeLetter();
    else if (/^[A-Z]$/.test(k)) addLetter(k);
  });

  "QWERTYUIOPASDFGHJKLZXCVBNM".split("").forEach(l => {
    const b = document.createElement("button");
    b.className = "key";
    b.textContent = l;
    b.onclick = () => addLetter(l);
    keyboard.appendChild(b);
  });

  /* ================= SPEECH ================= */
  document.getElementById("hear-word").onclick = () =>
    speechSynthesis.speak(new SpeechSynthesisUtterance(answer.toLowerCase()));

  document.getElementById("hear-sentence").onclick = () =>
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(`The word is ${answer.toLowerCase()}.`)
    );

  focusSelect.onchange = () => {
    updateFocusPanel(focusSelect.value);
    resetGame();
  };

  document.getElementById("new-word-btn").onclick = resetGame;

  resetGame();
  console.log("✅ Gameplay + multisyllabic focus restored");
});
