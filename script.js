/* =========================================
   DECODE THE WORD - CORE LOGIC (GOLD MASTER)
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

// DOM
const board = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
const modalOverlay = document.getElementById("modal-overlay");
const welcomeModal = document.getElementById("welcome-modal");
const teacherModal = document.getElementById("teacher-modal");
const gameModal = document.getElementById("modal");

// Focus panel elements (assigned on DOMContentLoaded for safety)
let focusTitleEl = null;
let focusDescEl = null;
let focusExamplesEl = null;
let focusHintEl = null;

document.addEventListener("DOMContentLoaded", () => {
    // Cache focus panel elements (these IDs live in index.html)
    focusTitleEl = document.getElementById("focus-title");
    focusDescEl = document.getElementById("focus-desc");
    focusExamplesEl = document.getElementById("focus-examples");
    focusHintEl = document.getElementById("focus-hint");

    // Sanity checks: make sure data files loaded
    if (!window.FOCUS_INFO || typeof window.FOCUS_INFO !== "object") {
        console.error("FOCUS_INFO is missing. Check that phonics_focus_data.js (or words.js) is loaded before script.js.");
        alert("Data file missing: FOCUS_INFO. Please ensure phonics_focus_data.js is loaded.");
        return;
    }
    if (!window.WORD_ENTRIES || typeof window.WORD_ENTRIES !== "object") {
        console.error("WORD_ENTRIES is missing. Check that phonics_focus_data.js (or words.js) is loaded before script.js.");
        alert("Data file missing: WORD_ENTRIES. Please ensure phonics_focus_data.js is loaded.");
        return;
    }

    initControls();
    initKeyboard();
    startNewGame();
    checkFirstTimeVisitor();
});

function initControls() {
    // Buttons
    document.getElementById("new-word-btn").onclick = () => {
        document.getElementById("new-word-btn").blur(); // Release focus
        startNewGame();
    };
    document.getElementById("case-toggle").onclick = (e) => {
        e.target.blur();
        toggleCase();
    };
    
    // Selects
    document.getElementById("pattern-select").onchange = () => {
        document.getElementById("pattern-select").blur();
        startNewGame();
    };
    document.getElementById("length-select").onchange = (e) => {
        const val = e.target.value;
        CURRENT_WORD_LENGTH = val === 'any' ? 5 : parseInt(val);
        e.target.blur();
        startNewGame();
    };

    // Teacher Mode
    document.getElementById("teacher-btn").onclick = openTeacherMode;
    document.getElementById("set-word-btn").onclick = handleTeacherSubmit;
    document.getElementById("toggle-mask").onclick = () => {
        const inp = document.getElementById("custom-word-input");
        inp.type = inp.type === "password" ? "text" : "password";
        inp.focus();
    };

    // Hints
    document.getElementById("hear-word-hint").onclick = () => {
        if (!isModalOpen()) speak(currentWord);
    };
    document.getElementById("hear-sentence-hint").onclick = () => {
        if (!isModalOpen()) {
            showToast("Sentence hint shared!");
            speak(currentEntry.sentence);
        }
    };
    document.getElementById("speak-btn").onclick = () => {
        if (!isModalOpen()) speak(currentWord);
    };

    // Modal Closing Logic
    document.querySelectorAll(".close-btn, .close-teacher, #start-playing-btn, #play-again-btn").forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
    };

    // Global Keyboard Listener
    window.addEventListener("keydown", (e) => {
        // CRITICAL FIX: Block all game input if any modal is visible
        if (isModalOpen()) {
            if (e.key === "Escape") closeModal();
            if (e.key === "Enter") {
                // Route Enter to specific modal actions
                if (!welcomeModal.classList.contains("hidden")) closeModal();
                else if (!teacherModal.classList.contains("hidden")) handleTeacherSubmit();
                else if (!gameModal.classList.contains("hidden")) closeModal(); 
            }
            return; // STOP execution here
        }

        if (gameOver) return;

        if (e.key === "Enter") submitGuess();
        else if (e.key === "Backspace") deleteLetter();
        else if (/^[a-z]$/i.test(e.key)) handleInput(e.key.toLowerCase());
    });

    // Teacher Input Specifics
    const tInput = document.getElementById("custom-word-input");
    tInput.addEventListener("keydown", (e) => {
        e.stopImmediatePropagation(); // CRITICAL FIX: Stop bubbling to window
        if (e.key === "Enter") handleTeacherSubmit();
        if (e.key === "Escape") closeModal();
    });
}

function isModalOpen() {
    return !modalOverlay.classList.contains("hidden");
}

function startNewGame(customWord = null) {
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
            def: "Teacher word.", sentence: "Can you decode this?", syllables: currentWord 
        };
    } else {
        const data = getWordFromDictionary();
        currentWord = data.word;
        currentEntry = data.entry;
        if (document.getElementById("length-select").value === 'any') {
            CURRENT_WORD_LENGTH = currentWord.length;
        }
    }

    isFirstLoad = false;
    
    // Build Grid - CRITICAL FIX: Use fixed width columns to ensure centering works
    // '1fr' causes left-alignment of small tiles in wide columns. '50px' packs them tight.
    board.style.gridTemplateColumns = `repeat(${CURRENT_WORD_LENGTH}, 50px)`;
    
    for (let i = 0; i < MAX_GUESSES * CURRENT_WORD_LENGTH; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    }
}

function getWordFromDictionary() {
  if (!window.WORD_ENTRIES || typeof window.WORD_ENTRIES !== "object") return null;
    if (!window.WORD_ENTRIES || typeof window.WORD_ENTRIES !== "object") {
        console.error("WORD_ENTRIES is missing. Check your <script> order: phonics_focus_data.js must load before script.js");
        return "cat";
    }

    const pat = patternSelect.value;
    const lenOption = lengthSelect.value;

    const entries = window.WORD_ENTRIES;

    // Filter by tag
    let candidates = Object.keys(entries).filter(w => {
        const e = entries[w];
        return e && Array.isArray(e.tags) && e.tags.includes(pat);
    });

    // Mixed review = allow anything
    if (pat === "mixed") {
        candidates = Object.keys(entries);
    }

    // Length handling
    if (lenOption !== "any") {
        const L = parseInt(lenOption, 10);
        if (!Number.isNaN(L)) {
            candidates = candidates.filter(w => w.length === L);
        }
    }

    if (!candidates.length) {
        // Safe fallback: try any word at requested length, else any word
        const all = Object.keys(entries);
        let fallback = all;
        if (lenOption !== "any") {
            const L = parseInt(lenOption, 10);
            if (!Number.isNaN(L)) fallback = all.filter(w => w.length === L);
        }
        if (fallback.length) return fallback[Math.floor(Math.random() * fallback.length)];
        return "cat";
    }

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    return pick;
}

function updateFocusPanel() {
    const patSel = document.getElementById("pattern-select");
    const pat = (patSel && patSel.value) ? patSel.value : "mixed";
    const info = (window.FOCUS_INFO && window.FOCUS_INFO[pat]) ? window.FOCUS_INFO[pat]
               : (window.FOCUS_INFO && window.FOCUS_INFO.mixed) ? window.FOCUS_INFO.mixed
               : { title: "Practice", label: "Practice", desc: "", hint: "", examples: [] };

    const titleText = info.title || info.label || "Practice";
    const descText = info.desc || "";
    const hintText = info.hint || "";

    // Examples can be string or array
    let ex = info.examples || info.examplesList || [];
    if (typeof ex === "string") {
        ex = ex.split(",").map(s => s.trim()).filter(Boolean);
    }
    const exText = Array.isArray(ex) ? ex.join(", ") : "";

    if (focusTitleEl) focusTitleEl.textContent = titleText;
    if (focusDescEl) focusDescEl.textContent = descText;
    if (focusExamplesEl) focusExamplesEl.textContent = exText ? ("Try: " + exText) : "";
    if (focusHintEl) focusHintEl.textContent = hintText;
}

// --- INPUT & GRID ---

function initKeyboard() {
    const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    keyboard.innerHTML = "";
    rows.forEach(r => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        r.split("").forEach(char => {
            const k = document.createElement("button");
            // Preserve vowel class correctly
            k.className = `key ${"aeiou".includes(char) ? 'vowel' : ''}`;
            k.textContent = isUpperCase ? char.toUpperCase() : char;
            k.dataset.key = char;
            k.onclick = (e) => {
                handleInput(char);
                e.target.blur(); // Remove focus
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
    document.getElementById("case-toggle").textContent = isUpperCase ? "ABC" : "abc";
    initKeyboard();
    
    guesses.forEach((g, rIdx) => {
        const off = rIdx * CURRENT_WORD_LENGTH;
        for(let i=0; i<CURRENT_WORD_LENGTH; i++) {
            const t = document.getElementById(`tile-${off+i}`);
            t.textContent = isUpperCase ? g[i].toUpperCase() : g[i];
        }
    });
    const currOff = guesses.length * CURRENT_WORD_LENGTH;
    for(let i=0; i<currentGuess.length; i++) {
        const t = document.getElementById(`tile-${currOff+i}`);
        t.textContent = isUpperCase ? currentGuess[i].toUpperCase() : currentGuess[i];
    }
}

// --- GAME LOGIC ---

function submitGuess() {
    if (currentGuess.length !== CURRENT_WORD_LENGTH) {
        const offset = guesses.length * CURRENT_WORD_LENGTH;
        const first = document.getElementById(`tile-${offset}`);
        if(first) {
            first.style.transform = "translateX(5px)";
            setTimeout(() => first.style.transform = "none", 100);
        }
        return;
    }
    
    const result = evaluate(currentGuess, currentWord);
    revealColors(result, currentGuess);
    guesses.push(currentGuess);

    if (currentGuess === currentWord) {
        gameOver = true;
        setTimeout(() => showEndModal(true), 1500);
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
                // CRITICAL FIX: Robust class handling without string injection errors
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

// --- MODALS & HELPERS ---

function showEndModal(win) {
    modalOverlay.classList.remove("hidden");
    gameModal.classList.remove("hidden");
    document.getElementById("modal-title").textContent = win ? "Great Job!" : "Nice Try!";
    document.getElementById("modal-word").textContent = currentWord;
    document.getElementById("modal-syllables").textContent = currentEntry.syllables.replace(/-/g, " • ");
    document.getElementById("modal-def").textContent = currentEntry.def;
    document.getElementById("modal-sentence").textContent = `"${currentEntry.sentence}"`;
}

function openTeacherMode() {
    modalOverlay.classList.remove("hidden");
    teacherModal.classList.remove("hidden");
    const inp = document.getElementById("custom-word-input");
    inp.value = "";
    document.getElementById("teacher-error").textContent = "";
    inp.focus();
}

function handleTeacherSubmit() {
    const val = document.getElementById("custom-word-input").value.trim().toLowerCase();
    if (val.length < 3 || val.length > 10 || !/^[a-z]+$/.test(val)) {
        document.getElementById("teacher-error").textContent = "3-10 letters, no spaces.";
        return;
    }
    closeModal();
    showToast("Teacher word accepted. Ready!");
    startNewGame(val);
}

function closeModal() {
    modalOverlay.classList.add("hidden");
    welcomeModal.classList.add("hidden");
    teacherModal.classList.add("hidden");
    gameModal.classList.add("hidden");
    // CRITICAL FIX: Release focus from last clicked button so typing works
    if (document.activeElement) document.activeElement.blur();
}

function showToast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.getElementById("toast-container").appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function checkFirstTimeVisitor() {
    if (!localStorage.getItem("decode_v4_visited")) {
        modalOverlay.classList.remove("hidden");
        welcomeModal.classList.remove("hidden");
        localStorage.setItem("decode_v4_visited", "true");
    }
}

function clearKeyboardColors() {
    document.querySelectorAll(".key").forEach(k => {
        k.classList.remove("correct", "present", "absent");
        // Vowel class is static, so we don't need to re-add it, just don't remove it.
    });
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => (v.name.includes("Google") || v.name.includes("Samantha")) && v.lang.startsWith("en"));
    msg.voice = preferred || voices[0];
    msg.rate = 0.9;
    speechSynthesis.speak(msg);
}