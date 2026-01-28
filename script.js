document.addEventListener("DOMContentLoaded", () => {

  /* ================= MODAL ================= */
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-modal");
  const startBtn = document.getElementById("start-btn");

  function showModal(title, bodyHTML, actionText = "OK", onAction = null) {
    overlay.querySelector("h2").textContent = title;
    overlay.querySelector("p").innerHTML = bodyHTML;
    startBtn.textContent = actionText;
    startBtn.onclick = () => {
      overlay.style.display = "none";
      if (onAction) onAction();
    };
    overlay.style.display = "flex";
  }

  closeBtn.onclick = () => overlay.style.display = "none";
  overlay.onclick = e => e.target === overlay && (overlay.style.display = "none");

  /* ================= VOICE (BEST AVAILABLE) ================= */
  let preferredVoice = null;

  function loadVoice() {
    const voices = speechSynthesis.getVoices();
    preferredVoice =
      voices.find(v => /google|microsoft|samantha|daniel/i.test(v.name)) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0];
  }
  speechSynthesis.onvoiceschanged = loadVoice;
  loadVoice();

  function speak(text) {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    if (preferredVoice) u.voice = preferredVoice;
    u.rate = 0.88;
    speechSynthesis.speak(u);
  }

  /* ================= FOCUS + WORD DATA ================= */
  const FOCUS_INFO = {
    mixed: {
      label: "Mixed Review",
      hint: "Scan the whole word before guessing.",
      words: [
        { word: "stone", def: "A small piece of rock.", sentence: "The stone skipped across the water." },
        { word: "plant", def: "A living thing that grows in soil.", sentence: "The plant grew toward the light." }
      ]
    },
    cvc: {
      label: "CVC",
      hint: "Say each sound, then blend.",
      words: [
        { word: "cat", def: "A small pet animal.", sentence: "The cat slept on the mat." },
        { word: "bed", def: "A place to sleep.", sentence: "She made her bed." }
      ]
    },
    multisyllabic: {
      label: "Multisyllabic",
      hint: "Clap the syllables, then decode each part.",
      words: [
        { word: "robot", def: "A machine that can move and act.", sentence: "The robot waved its arm." },
        { word: "basket", def: "A container made of woven material.", sentence: "He carried apples in a basket." }
      ]
    }
  };

  const focusSelect = document.getElementById("focus-select");
  const lengthSelect = document.getElementById("length-select");

  Object.entries(FOCUS_INFO).forEach(([k, v]) => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = v.label;
    focusSelect.appendChild(opt);
  });

  /* ================= GAME STATE ================= */
  const board = document.getElementById("board");
  const keyboard = document.getElementById("keyboard");

  let ROWS = 6;
  let COLS = 5;
  let row = 0, col = 0;
  let answerObj = null;
  let guesses = [];

  function lockControls(lock) {
    focusSelect.disabled = lock;
    lengthSelect.disabled = lock;
  }

  function pickWord() {
    const pool = FOCUS_INFO[focusSelect.value].words
      .filter(w => w.word.length === COLS);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function buildBoard() {
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${COLS}, 60px)`;
    for (let i = 0; i < ROWS * COLS; i++) {
      const t = document.createElement("div");
      t.className = "tile";
      board.appendChild(t);
    }
  }

  function buildKeyboard() {
    keyboard.innerHTML = "";
    "QWERTYUIOPASDFGHJKLZXCVBNM".split("").forEach(l => {
      const b = document.createElement("button");
      b.textContent = l;
      b.className = "key";
      b.onclick = () => addLetter(l);
      keyboard.appendChild(b);
    });
  }

  function resetGame() {
    COLS = Number(lengthSelect.value);
    row = col = 0;
    guesses = Array.from({ length: ROWS }, () => []);
    answerObj = pickWord();
    buildBoard();
    buildKeyboard();
    lockControls(true);
  }

  function tile(r, c) {
    return board.children[r * COLS + c];
  }

  function addLetter(l) {
    if (col >= COLS) return;
    guesses[row][col] = l;
    tile(row, col).textContent = l;
    col++;
  }

  function backspace() {
    if (col === 0) return;
    col--;
    guesses[row][col] = "";
    tile(row, col).textContent = "";
  }

  function submit() {
    if (col < COLS) return;
    const guess = guesses[row].join("");
    const answer = answerObj.word.toUpperCase();
    const used = Array(COLS).fill(false);

    for (let i = 0; i < COLS; i++) {
      if (guess[i] === answer[i]) {
        tile(row, i).style.background = "#6aaa64";
        used[i] = true;
      }
    }
    for (let i = 0; i < COLS; i++) {
      if (tile(row, i).style.background) continue;
      const idx = answer.indexOf(guess[i]);
      tile(row, i).style.background =
        idx !== -1 && !used[idx] ? "#c9b458" : "#787c7e";
    }

    if (guess === answer) {
      confetti();
      lockControls(false);
      showModal(
        "Nice decoding! 🎉",
        `<strong>${answer}</strong><br>
         ${answerObj.def}<br><br>
         <em>${answerObj.sentence}</em>`,
        "Play Again",
        resetGame
      );
      return;
    }

    row++;
    col = 0;

    if (row === ROWS) {
      lockControls(false);
      showModal("Good try!", `The word was <strong>${answer}</strong>.`, "Play Again", resetGame);
    }
  }

  window.addEventListener("keydown", e => {
    if (overlay.style.display === "flex") return;
    if (e.key === "Enter") submit();
    else if (e.key === "Backspace") backspace();
    else if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key.toUpperCase());
  });

  /* ================= CONFETTI ================= */
  function confetti() {
    for (let i = 0; i < 80; i++) {
      const c = document.createElement("div");
      c.style.position = "fixed";
      c.style.left = Math.random() * 100 + "vw";
      c.style.top = "-10px";
      c.style.width = "6px";
      c.style.height = "6px";
      c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
      c.style.animation = "fall 1.5s linear";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1500);
    }
  }

  /* ================= INIT ================= */
  resetGame();
  showModal("Welcome 👋", "Pick a focus and decode the word.", "Start");
});
