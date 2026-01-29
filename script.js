/* =========================================
   DECODE THE WORD - FINAL GOLD MASTER
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
let cachedVoices = [];

// DOM Elements
const board = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
const modalOverlay = document.getElementById("modal-overlay");
const welcomeModal = document.getElementById("welcome-modal");
const teacherModal = document.getElementById("teacher-modal");
const gameModal = document.getElementById("modal");

document.addEventListener("DOMContentLoaded", () => {
    initControls();
    initKeyboard();
    initVoiceLoader();
    
    // Start game logic
    startNewGame();
    checkFirstTimeVisitor();
});

/* --- VOICE LOADING (Premium/Enhanced Fix) --- */
function initVoiceLoader() {
    const load = () => {
        cachedVoices = window.speechSynthesis.getVoices();
    };
    load();
    // Chrome/Safari often load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
    }
}

function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel(); // Stop any previous speech
    const msg = new SpeechSynthesisUtterance(text);
    
    // 1. Get list of available voices
    let voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
    
    // 2. Intelligent Voice Selection
    let preferred = null;

    // A. Google Voices (Best for Chrome/Android)
    preferred = voices.find(v => /Google US English/i.test(v.name));
    if (!preferred) preferred = voices.find(v => /Google/i.test(v.name) && v.lang.startsWith("en-US"));

    // B. Apple "Enhanced" / "Premium" / "Siri" (Best for iOS/Mac)
    // This fixes the "robotic" sound by asking for the high-quality version explicitly
    if (!preferred) preferred = voices.find(v => (/Enhanced|Premium|Siri/i.test(v.name) && v.lang.startsWith("en-US")));

    // C. Specific High-Quality Apple Voices (Ava, Samantha Enhanced)
    if (!preferred) preferred = voices.find(v => /Ava/i.test(v.name) && v.lang.startsWith("en-US"));
    if (!preferred) preferred = voices.find(v => /Samantha/i.test(v.name) && v.lang.startsWith("en-US"));

    // D. Microsoft Voices (Windows)
    if (!preferred) preferred = voices.find(v => /Microsoft/i.test(v.name) && v.lang.startsWith("en-US"));

    // E. Fallback: Any US English voice
    if (!preferred) preferred = voices.find(v => v.lang === "en-US");
    
    // F. Final Fallback: Any English voice
    if (!preferred) preferred = voices.find(v => v.lang.startsWith("en"));

    if (preferred) msg.voice = preferred;
    msg.rate = 0.9; // 0.9 is the sweet spot for clarity
    msg.pitch = 1.0;

    window.speechSynthesis.speak(msg);
}

/* --- CONTROLS & EVENTS --- */
function initControls() {
    // Buttons
    document.getElementById("new-word-btn").onclick = () => {
        document.getElementById("new-word-btn").blur(); 
        startNewGame();
    };
    document.getElementById("case-toggle").onclick = (e) => {
        e.target.blur();
        toggleCase();
    };
    
    // Selects (Unlocked - Changing them restarts game immediately)
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
        if (!isModalOpen() && currentEntry) {
            // FIXED: Removed showToast() so no pop-up appears
            speak(currentEntry.sentence);
        }
    };
    document.getElementById("speak-btn").onclick = () => {
        speak(currentWord);
    };
    document.getElementById("play-again-btn").onclick = () => {
        closeModal();
        startNewGame();
    };

    // Modal Closing Logic (Click X or Buttons)
    document.querySelectorAll(".close-btn, .close-teacher, #start-playing-btn").forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
    };

    // Global Keyboard Listener
    window.addEventListener("keydown", (e) => {
        // MODAL HANDLING
        if (isModalOpen()) {
            if (e.key === "Escape" || e.key === "Enter") {
                // If teacher modal is open, Enter submits the word
                if (!teacherModal.classList.contains("hidden") && e.key === "Enter") {
                    handleTeacherSubmit();
                } else {
                    closeModal(); // Otherwise just close
                }
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
        e.stopImmediatePropagation(); 
        if (e.key === "Enter") handleTeacherSubmit();
        if (e.key === "Escape") closeModal();
    });
}

function isModalOpen() {
    return !modalOverlay.classList.contains("hidden");
}

/* --- GAME LOGIC --- */
function startNewGame(customWord = null) {
    gameOver = false;
    guesses = [];
    currentGuess = "";
    board.innerHTML = "";
    clearKeyboardColors();
    updateFocusPanel();
    
    // Pick word
    if (customWord) {
        currentWord = customWord.toLowerCase();
        CURRENT_WORD_LENGTH = currentWord.length;
        currentEntry = window.WORD_ENTRIES[currentWord] || { 
            def: "Teacher set word.", sentence: "Can you decode this?", syllables: currentWord 
        };
    } else {
        const data = getWordFromDictionary();
        currentWord = data.word;
        currentEntry = data.entry;
        // If we picked a random word, ensure grid matches its length
        CURRENT_WORD_LENGTH = currentWord.length;
    }

    isFirstLoad = false;
    
    // Build Grid
    board.style.gridTemplateColumns = `repeat(${CURRENT_WORD_LENGTH}, 50px)`;
    for (let i = 0; i < MAX_GUESSES * CURRENT_WORD_LENGTH; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    }
}

function getWordFromDictionary() {
    const pattern = document.getElementById("pattern-select").value;
    const lenVal = document.getElementById("length-select").value;
    const targetLen = (lenVal === 'any') ? null : parseInt(lenVal);

    // Filter using your uploaded words.js data
    const pool = Object.keys(window.WORD_ENTRIES).filter(w => {
        const e = window.WORD_ENTRIES[w];
        const lenMatch = !targetLen || w.length === targetLen;
        // Check tag match OR if pattern is 'all'
        const patMatch = pattern === 'all' || (e.tags && e.tags.includes(pattern));
        return lenMatch && patMatch;
    });

    // Fallback if no words match criteria
    if (pool.length === 0) return { word: "apple", entry: window.WORD_ENTRIES["apple"] };

    const final = pool[Math.floor(Math.random() * pool.length)];
    return { word: final, entry: window.WORD_ENTRIES[final] };
}

function updateFocusPanel() {
    const pat = document.getElementById("pattern-select").value;
    // Uses data from words.js (FOCUS_INFO)
    const info = window.FOCUS_INFO[pat] || window.FOCUS_INFO.all || { 
        title: "Practice", desc: "General Review", hint: "Do your best!", examples: "" 
    };
    
    document.getElementById("focus-title").textContent = info.title;
    document.getElementById("focus-desc").textContent = info.desc;
    document.getElementById("focus-hint").textContent = info.hint;
    document.getElementById("focus-examples").textContent = `Ex: ${info.examples}`;

    const quickRow = document.getElementById("quick-tiles-row");
    if (info.quick) {
        quickRow.innerHTML = "";
        info.quick.forEach(q => {
            const b = document.createElement("button");
            b.className = "q-tile";
            b.textContent = q;
            b.onclick = () => { 
                for(let c of q) handleInput(c); 
                b.blur();
            };
            quickRow.appendChild(b);
        });
        quickRow.classList.remove("hidden");
    } else {
        quickRow.classList.add("hidden");
    }
}

/* --- KEYBOARD & INPUT --- */
function initKeyboard() {
    const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    keyboard.innerHTML = "";
    rows.forEach(r => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        r.split("").forEach(char => {
            const k = document.createElement("button");
            k.className = `key ${"aeiou".includes(char) ? 'vowel' : ''}`;
            k.textContent = isUpperCase ? char.toUpperCase() : char;
            k.dataset.key = char;
            k.onclick = (e) => {
                handleInput(char);
                e.target.blur(); 
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
    // Update existing grid text
    document.querySelectorAll(".tile").forEach(t => {
        if(t.textContent) t.textContent = isUpperCase ? t.textContent.toUpperCase() : t.textContent.toLowerCase();
    });
}

/* --- GUESS SUBMISSION --- */
function submitGuess() {
    if (currentGuess.length !== CURRENT_WORD_LENGTH) {
        // Shake animation
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
        confetti(); // Trigger confetti
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

    // First pass: Correct
    gArr.forEach((c, i) => {
        if (c === tArr[i]) {
            res[i] = "correct";
            tArr[i] = null;
            gArr[i] = null;
        }
    });
    // Second pass: Present
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

            // Keyboard coloring
            const k = document.querySelector(`.key[data-key="${guess[i]}"]`);
            if (k) {
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

/* --- MODALS & EFFECTS --- */
function showEndModal(win) {
    modalOverlay.classList.remove("hidden");
    gameModal.classList.remove("hidden");
    document.getElementById("modal-title").textContent = win ? "Great Job!" : "Nice Try!";
    
    // Populate Data
    document.getElementById("modal-word").textContent = currentWord.toUpperCase();
    document.getElementById("modal-syllables").textContent = currentEntry.syllables ? currentEntry.syllables.replace(/-/g, " • ") : currentWord;
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
    showBanner("Word Set! Class is Ready.");
    startNewGame(val);
}

function closeModal() {
    modalOverlay.classList.add("hidden");
    welcomeModal.classList.add("hidden");
    teacherModal.classList.add("hidden");
    gameModal.classList.add("hidden");
    
    if (document.activeElement) document.activeElement.blur();
    document.body.focus();
}

function showBanner(msg) {
    const b = document.getElementById("banner-container");
    b.textContent = msg;
    b.classList.remove("hidden");
    b.classList.add("visible"); 
    setTimeout(() => {
        b.classList.remove("visible");
        b.classList.add("hidden");
    }, 3000);
}

function showToast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.getElementById("toast-container").appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function checkFirstTimeVisitor() {
    if (!localStorage.getItem("decode_v5_visited")) { // Bumped version
        modalOverlay.classList.remove("hidden");
        welcomeModal.classList.remove("hidden");
        localStorage.setItem("decode_v5_visited", "true");
    }
}

function clearKeyboardColors() {
    document.querySelectorAll(".key").forEach(k => {
        k.classList.remove("correct", "present", "absent");
    });
}

function confetti() {
    // Simple pure JS confetti
    for (let i = 0; i < 50; i++) {
        const c = document.createElement("div");
        c.style.position = "fixed";
        c.style.left = Math.random() * 100 + "vw";
        c.style.top = "-10px";
        c.style.width = "8px";
        c.style.height = "8px";
        c.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        c.style.zIndex = "2000";
        c.style.transition = "top 1.5s ease-in, opacity 1.5s ease-in";
        document.body.appendChild(c);
        setTimeout(() => {
            c.style.top = "110vh";
            c.style.opacity = "0";
        }, 10);
        setTimeout(() => c.remove(), 1600);
    }
}