/* =========================================
   PHONICS WORDLE - FINAL GOLD MASTER
   ========================================= */

const CONFIG = {
    voice: false,    
    confetti: true,
    filter: 'all',
    length: 'any',
    largeText: false
};

const JOKES_AND_FACTS = [
    { type: "Joke", text: "Why did the cookie go to the hospital? Because he felt crummy!" },
    { type: "Fact", text: "Did you know? Octopuses have three hearts!" },
    { type: "Joke", text: "What do you call a sleeping dinosaur? A dino-snore!" },
    { type: "Fact", text: "Honey is the only food that never spoils." },
    { type: "Joke", text: "Why was the math book sad? It had too many problems." },
    { type: "Fact", text: "A group of flamingos is called a 'flamboyance'." },
    { type: "Joke", text: "What falls in winter but never gets hurt? Snow!" },
    { type: "Fact", text: "Sloths can hold their breath longer than dolphins." },
    { type: "Joke", text: "What has hands but cannot clap? A clock!" },
    { type: "Fact", text: "Butterflies taste with their feet." }
];

let state = {
    target: "",
    syllables: "",
    grid: [],
    row: 0,
    guess: "",
    over: false,
    pool: [],
    customGame: false 
};

const board = document.getElementById("game-board");
const toast = document.getElementById("toast");

// ---------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------

function init() {
    // 1. Check First Time Visitor
    if (!localStorage.getItem('hasVisited')) {
        const welcomeModal = document.getElementById('welcome-modal-overlay');
        if (welcomeModal) welcomeModal.classList.remove('hidden');
        localStorage.setItem('hasVisited', 'true');
    }

    if (!loadPool()) return;

    // Pick random word
    const rawWord = state.pool[Math.floor(Math.random() * state.pool.length)];
    const data = window.WORD_ENTRIES && window.WORD_ENTRIES[rawWord] ? window.WORD_ENTRIES[rawWord] : {};
    
    state.target = rawWord;
    state.syllables = data.syllables || rawWord; 
    state.customGame = false; 
    
    resetGame();
}

function loadPool() {
    if (!window.WORD_ENTRIES) {
        console.error("Dictionary (words.js) not loaded.");
        return false;
    }
    const keys = Object.keys(window.WORD_ENTRIES);
    let filtered = keys;

    // Apply Filter
    if (CONFIG.filter !== 'all') {
        filtered = keys.filter(k => {
            const d = window.WORD_ENTRIES[k];
            const allTags = (d.tags || []).concat(d.focus || []);
            return allTags.some(t => t.includes(CONFIG.filter));
        });
    }

    // Apply Length
    if (CONFIG.length !== 'any') {
        const targetLen = parseInt(CONFIG.length);
        filtered = filtered.filter(k => k.length === targetLen);
    }

    state.pool = filtered;

    // Fallback: If filter returns 0 words, reset to 'all'
    if (state.pool.length === 0) {
        showToast(`No words found. Resetting filter.`);
        document.getElementById('length-select').value = 'any';
        CONFIG.length = 'any';
        state.pool = keys; 
    }
    return true;
}

function resetGame() {
    state.row = 0;
    state.guess = "";
    state.over = false;
    
    board.innerHTML = "";
    document.getElementById("keyboard").innerHTML = "";
    
    createGrid();
    createKeyboard();
    
    // Ensure game-state modals are closed
    document.getElementById("modal-overlay").classList.add("hidden");
    document.getElementById("teacher-menu").classList.add("hidden");
}

// ---------------------------------------------------------
// BOARD & KEYBOARD
// ---------------------------------------------------------

function createGrid() {
    const len = state.target.length;
    board.style.gridTemplateColumns = `repeat(${len}, 60px)`;
    state.grid = [];

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < len; c++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.id = `r${r}-c${c}`;
            board.appendChild(tile);
            state.grid.push(tile);
        }
    }
}

function createKeyboard() {
    const keys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    const kbd = document.getElementById("keyboard");
    
    keys.forEach(rowStr => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "key-row";
        rowStr.split("").forEach(char => {
            const btn = document.createElement("button");
            btn.className = "key";
            if (vowels.includes(char)) btn.classList.add("vowel-key");
            btn.textContent = char;
            btn.id = "key-" + char;
            btn.onclick = () => handleInput(char);
            rowDiv.appendChild(btn);
        });
        
        if (rowStr.startsWith("z")) {
            const enter = document.createElement("button");
            enter.className = "key action";
            enter.textContent = "ENTER";
            enter.onclick = submitGuess;
            rowDiv.appendChild(enter);

            const del = document.createElement("button");
            del.className = "key action";
            del.textContent = "⌫";
            del.onclick = () => handleInput("Backspace");
            rowDiv.prepend(del);
        }
        kbd.appendChild(rowDiv);
    });
}

// ---------------------------------------------------------
// GAME LOGIC
// ---------------------------------------------------------

function handleInput(key) {
    if (state.over) return;
    const len = state.target.length;
    
    if (key === "Backspace") {
        state.guess = state.guess.slice(0, -1);
    } else if (state.guess.length < len && /^[a-z]$/.test(key)) {
        state.guess += key;
    }
    updateGrid();
}

function updateGrid() {
    const len = state.target.length;
    for (let c = 0; c < len; c++) {
        const tile = document.getElementById(`r${state.row}-c${c}`);
        if (tile) {
            tile.textContent = state.guess[c] || "";
            tile.setAttribute("data-state", state.guess[c] ? "active" : "");
        }
    }
}

function submitGuess() {
    if (state.over) return;
    const guess = state.guess;
    const target = state.target;
    
    // 1. Length Check
    if (guess.length !== target.length) {
        shakeRow();
        return;
    }

    // 2. Dictionary Check REMOVED per request.
    // Any word combination is allowed to test phonics sounds.
    
    const result = new Array(target.length).fill("gray");
    const targetChars = target.split("");
    const guessChars = guess.split("");

    // Pass 1: Green
    guessChars.forEach((char, i) => {
        if (char === targetChars[i]) {
            result[i] = "green";
            targetChars[i] = null;
            guessChars[i] = null;
        }
    });

    // Pass 2: Yellow
    guessChars.forEach((char, i) => {
        if (char && targetChars.includes(char)) {
            result[i] = "yellow";
            targetChars[targetChars.indexOf(char)] = null; 
        }
    });

    // Render & Animate
    result.forEach((color, i) => {
        const tile = document.getElementById(`r${state.row}-c${i}`);
        setTimeout(() => {
            tile.classList.add("flip");
            tile.classList.add(color);
            
            const keyBtn = document.getElementById("key-" + guess[i]);
            if (keyBtn) {
                const isGreen = keyBtn.classList.contains("green");
                const isYellow = keyBtn.classList.contains("yellow");
                if (color === "green") {
                    keyBtn.classList.remove("yellow", "gray"); keyBtn.classList.add("green");
                } else if (color === "yellow" && !isGreen) {
                    keyBtn.classList.remove("gray"); keyBtn.classList.add("yellow");
                } else if (color === "gray" && !isGreen && !isYellow) {
                    keyBtn.classList.add("gray");
                }
            }
        }, i * 150); 
    });

    // End Game Check
    setTimeout(() => {
        if (guess === target) {
            state.over = true;
            if (CONFIG.confetti && typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            }
            showModal(true);
        } else if (state.row >= 5) {
            state.over = true;
            showModal(false);
        } else {
            state.row++;
            state.guess = "";
        }
    }, target.length * 150 + 300);
}

function shakeRow() {
    board.classList.add("shake");
    setTimeout(() => board.classList.remove("shake"), 500);
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---------------------------------------------------------
// MODALS
// ---------------------------------------------------------

function showModal(win) {
    const data = (window.WORD_ENTRIES && window.WORD_ENTRIES[state.target]) 
        ? window.WORD_ENTRIES[state.target] 
        : { def: "Teacher Word", sentence: "Great job decoding!", tags: [] };
    
    document.getElementById("modal-title").textContent = win ? "🎉 Fantastic!" : "Good Try!";
    document.getElementById("reveal-word").textContent = state.syllables || state.target;
    document.getElementById("reveal-def").textContent = data.def;
    document.getElementById("reveal-sentence").textContent = data.sentence;
    
    // Tips
    const tipBox = document.getElementById("reveal-tip");
    let tipText = "";
    const tags = data.tags || [];

    if (tags.includes("magic-e")) tipText = "💡 Rule: Silent 'e' makes the vowel say its name.";
    else if (tags.includes("digraph")) tipText = "💡 Rule: Two letters make ONE sound.";
    else if (tags.includes("doubling")) tipText = "💡 Rule: 1-1-1 Rule! Double the last letter.";
    
    tipBox.textContent = tipText;
    tipBox.style.display = tipText ? "block" : "none";

    // Fun Content
    const funBox = document.getElementById("fun-content-box");
    if (win) {
        const funItem = JOKES_AND_FACTS[Math.floor(Math.random() * JOKES_AND_FACTS.length)];
        document.getElementById("fun-label").textContent = funItem.type === 'Joke' ? '😂 Joke:' : '🧠 Fact:';
        document.getElementById("fun-text").textContent = funItem.text;
        funBox.classList.remove("hidden");
    } else {
        funBox.classList.add("hidden");
    }

    document.getElementById("modal-overlay").classList.remove("hidden");
    if (win && CONFIG.voice) speak(state.target);
}

function speak(text) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Google US English")) || voices[0];
    if (preferred) u.voice = preferred;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
}

// ---------------------------------------------------------
// TEACHER TOOLS
// ---------------------------------------------------------

function initTeacherMode() {
    const inputField = document.getElementById("teacher-input");
    const input = inputField.value.trim().toLowerCase();
    
    if (!input) {
        showToast("Please type a word");
        return;
    }

    const cleanWord = input.replace(/[^a-z]/g, "");
    
    // FIXED: Allowed up to 10 characters
    if (cleanWord.length < 3 || cleanWord.length > 10) {
        showToast("Word must be 3-10 letters");
        return;
    }

    state.target = cleanWord;
    state.syllables = input; 
    state.customGame = true; 
    
    document.getElementById("teacher-menu").classList.add("hidden");
    resetGame();
    showToast(`Target set: ${cleanWord}`);
    
    inputField.value = "";
}

// ---------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------

window.onclick = function(event) {
    // FIXED: Exact ID matching for robust closing
    const id = event.target.id;
    if (id === 'modal-overlay') {
        init(); // Win/Loss Modal Background -> Next Game
    } else if (id === 'welcome-modal-overlay' || id === 'help-modal-overlay' || id === 'teacher-menu') {
        event.target.classList.add('hidden'); // Close others
    }
};

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        // Close all overlays
        document.querySelectorAll('.tool-overlay, #modal-overlay, #welcome-modal-overlay, #help-modal-overlay').forEach(el => el.classList.add('hidden'));
    }
    
    if (e.key === "Enter") {
        if (!document.getElementById("modal-overlay").classList.contains("hidden")) {
            init();
        } else if (!document.getElementById("teacher-menu").classList.contains("hidden")) {
            initTeacherMode();
        } else {
            submitGuess();
        }
    }

    if (e.key === "Backspace") handleInput("Backspace");
    else if (/^[a-z]$/i.test(e.key)) handleInput(e.key.toLowerCase());
});

// Buttons
document.getElementById("btn-next-word").onclick = init;
document.getElementById("modal-close").onclick = init; 

document.getElementById("btn-voice").onclick = function() {
    CONFIG.voice = !CONFIG.voice;
    this.style.opacity = CONFIG.voice ? "1" : "0.5";
    showToast(CONFIG.voice ? "Voice ON" : "Voice OFF");
};

document.getElementById("btn-size").onclick = function() {
    CONFIG.largeText = !CONFIG.largeText;
    document.body.classList.toggle("large-mode");
};

document.getElementById("btn-teacher").onclick = () => document.getElementById("teacher-menu").classList.remove("hidden");
document.getElementById("teacher-close").onclick = () => document.getElementById("teacher-menu").classList.add("hidden");
document.getElementById("btn-teacher-set").onclick = initTeacherMode;

document.getElementById("btn-welcome-start").onclick = () => document.getElementById("welcome-modal-overlay").classList.add("hidden");

// FIXED: Dedicated Help Modal Logic (No mutation)
document.getElementById("btn-help").onclick = () => document.getElementById("help-modal-overlay").classList.remove("hidden");
document.getElementById("help-close").onclick = () => document.getElementById("help-modal-overlay").classList.add("hidden");

document.getElementById("btn-hear-word").onclick = () => speak(state.target);
document.getElementById("btn-hear-sentence").onclick = () => {
    const data = (window.WORD_ENTRIES && window.WORD_ENTRIES[state.target]) || { sentence: "You can do it!" };
    speak(data.sentence);
};

document.getElementById("filter-select").onchange = (e) => { 
    CONFIG.filter = e.target.value; 
    init(); 
    e.target.blur();
};
document.getElementById("length-select").onchange = (e) => { 
    CONFIG.length = e.target.value; 
    init(); 
    e.target.blur(); 
};

window.onload = init;