
// ===== DOM SAFE GUARDS =====
const patternSelect = document.getElementById("pattern-select");
const lengthSelect = document.getElementById("length-select");
const focusTitleEl = document.getElementById("focus-title");
const focusDescEl = document.getElementById("focus-desc");
/* =========================================
   DECODE THE WORD - GOLD MASTER (With Studio)
   ========================================= */

let MAX_GUESSES = 6;
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
const studioModal = document.getElementById("recording-studio-modal");
const gameModal = document.getElementById("modal");

// --- AUDIO DATABASE SETUP (IndexedDB) ---
const DB_NAME = "PhonicsAudioDB";
const STORE_NAME = "audio_files";
let db;

function initDB() {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
    };
    request.onsuccess = (event) => {
        db = event.target.result;
    };
    request.onerror = (event) => {
        console.error("DB Error", event);
    };
}

function saveAudioToDB(key, blob) {
    if (!db) return;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, key);
}

function getAudioFromDB(key) {
    return new Promise((resolve) => {
        if (!db) return resolve(null);
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDB();
    initControls();
    initKeyboard();
    initVoiceLoader();
    initStudio();
    
    startNewGame();
    checkFirstTimeVisitor();
});

/* --- VOICE LOADING & PLAYBACK --- */
function initVoiceLoader() {
    const load = () => {
        cachedVoices = window.speechSynthesis.getVoices();
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
    }
}

async function speak(text, type = "word") {
    if (!text) return;
    window.speechSynthesis.cancel(); 

    // 1. Check for Teacher Recording in DB
    let dbKey = "";
    if (type === "word") {
        dbKey = `${text.toLowerCase()}_word`;
    } else {
        // Sentence matching logic
        if (currentEntry && text === currentEntry.sentence) {
            dbKey = `${currentWord.toLowerCase()}_sentence`;
        } else {
            dbKey = "unknown"; 
        }
    }

    const blob = await getAudioFromDB(dbKey);
    
    if (blob) {
        // Play Recorded Audio
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
        return; 
    }

    // 2. Fallback to Robot (Best Available)
    const msg = new SpeechSynthesisUtterance(text);
    
    let voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
    let preferred = null;

    // Prioritize Premium/Enhanced voices
    preferred = voices.find(v => /Google US English/i.test(v.name));
    if (!preferred) preferred = voices.find(v => /Google/i.test(v.name) && v.lang.startsWith("en-US"));
    if (!preferred) preferred = voices.find(v => (/Enhanced|Premium|Siri/i.test(v.name) && v.lang.startsWith("en-US")));
    if (!preferred) preferred = voices.find(v => /Ava/i.test(v.name) && v.lang.startsWith("en-US"));
    if (!preferred) preferred = voices.find(v => /Samantha/i.test(v.name) && v.lang.startsWith("en-US"));
    if (!preferred) preferred = voices.find(v => /Microsoft/i.test(v.name) && v.lang.startsWith("en-US"));
    if (!preferred) preferred = voices.find(v => v.lang === "en-US");
    if (!preferred) preferred = voices.find(v => v.lang.startsWith("en"));

    if (preferred) msg.voice = preferred;
    msg.rate = 0.9; 
    msg.pitch = 1.0;

    window.speechSynthesis.speak(msg);
}

/* --- CONTROLS & EVENTS --- */
function initControls() {
    document.getElementById("new-word-btn").onclick = () => {
        document.getElementById("new-word-btn").blur(); 
        startNewGame();
    };
    document.getElementById("case-toggle").onclick = (e) => {
        e.target.blur();
        toggleCase();
    };
    
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

    document.getElementById("teacher-btn").onclick = openTeacherMode;
    document.getElementById("set-word-btn").onclick = handleTeacherSubmit;
    document.getElementById("open-studio-btn").onclick = openStudioSetup;
    document.getElementById("toggle-mask").onclick = () => {
        const inp = document.getElementById("custom-word-input");
        inp.type = inp.type === "password" ? "text" : "password";
        inp.focus();
    };

    document.getElementById("hear-word-hint").onclick = () => {
        if (!isModalOpen()) speak(currentWord, "word");
    };
    document.getElementById("hear-sentence-hint").onclick = () => {
        if (!isModalOpen() && currentEntry) {
            // No toast, just speak
            speak(currentEntry.sentence, "sentence");
        }
    };
    document.getElementById("speak-btn").onclick = () => {
        speak(currentWord, "word");
    };
    document.getElementById("play-again-btn").onclick = () => {
        closeModal();
        startNewGame();
    };

    document.querySelectorAll(".close-btn, .close-teacher, .close-studio, #start-playing-btn").forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
    };

    // GLOBAL KEYBOARD LISTENER (Capture Phase)
    window.addEventListener("keydown", (e) => {
        if (isModalOpen()) {
            if (!studioModal.classList.contains("hidden")) return; // Allow typing in studio

            if (e.key === "Escape" || e.key === "Enter") {
                if (!teacherModal.classList.contains("hidden") && e.key === "Enter") {
                    handleTeacherSubmit();
                } else {
                    closeModal(); 
                }
            }
            return; 
        }

        if (gameOver) return;

        if (e.key === "Enter") submitGuess();
        else if (e.key === "Backspace") deleteLetter();
        else if (/^[a-z]$/i.test(e.key)) handleInput(e.key.toLowerCase());
    });

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

/* --- STUDIO LOGIC --- */
let studioList = [];
let studioIndex = 0;
let mediaRecorder = null;
let audioChunks = [];

function initStudio() {
    document.getElementById("studio-source-select").onchange = (e) => {
        const pasteArea = document.getElementById("studio-paste-area");
        pasteArea.classList.toggle("hidden", e.target.value !== "paste");
    };

    document.getElementById("start-studio-btn").onclick = startStudioSession;
    document.getElementById("exit-studio-btn").onclick = closeModal;
    
    document.getElementById("record-word-btn").onclick = () => toggleRecording("word");
    document.getElementById("record-sentence-btn").onclick = () => toggleRecording("sentence");
    
    document.getElementById("play-word-preview").onclick = () => playPreview("word");
    document.getElementById("play-sentence-preview").onclick = () => playPreview("sentence");
    
    document.getElementById("next-item-btn").onclick = nextStudioItem;
}

function openStudioSetup() {
    teacherModal.classList.add("hidden");
    studioModal.classList.remove("hidden");
    document.getElementById("studio-setup-view").classList.remove("hidden");
    document.getElementById("studio-record-view").classList.add("hidden");
}

async function startStudioSession() {
    const source = document.getElementById("studio-source-select").value;
    const skipExisting = document.getElementById("studio-skip-existing").checked;
    
    let rawList = [];

    if (source === "focus") {
        const pattern = document.getElementById("pattern-select").value;
        const allWords = Object.keys(window.WORD_ENTRIES);
        rawList = allWords.filter(w => {
            const e = window.WORD_ENTRIES[w];
            return pattern === 'all' || (e.tags && e.tags.includes(pattern));
        });
    } else {
        const text = document.getElementById("studio-paste-input").value;
        rawList = text.split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(s => s && /^[a-z]+$/.test(s));
    }

    if (rawList.length === 0) {
        alert("No words found.");
        return;
    }

    studioList = [];
    for (let w of rawList) {
        const entry = window.WORD_ENTRIES[w] || { sentence: `The word is ${w}.` };
        
        if (skipExisting) {
            const hasWord = await getAudioFromDB(`${w}_word`);
            const hasSent = await getAudioFromDB(`${w}_sentence`);
            if (hasWord && hasSent) continue; 
        }
        studioList.push({ word: w, sentence: entry.sentence });
    }

    if (studioList.length === 0) {
        alert("All words already have recordings!");
        return;
    }

    studioIndex = 0;
    document.getElementById("studio-setup-view").classList.add("hidden");
    document.getElementById("studio-record-view").classList.remove("hidden");
    loadStudioItem();
}

function loadStudioItem() {
    if (studioIndex >= studioList.length) {
        alert("Session Complete!");
        closeModal();
        return;
    }

    const item = studioList[studioIndex];
    document.getElementById("studio-progress").textContent = `${studioIndex + 1} / ${studioList.length}`;
    document.getElementById("studio-word-display").textContent = item.word.toUpperCase();
    document.getElementById("studio-sentence-display").value = item.sentence;

    resetRecordButtons();
}

function resetRecordButtons() {
    const wordBtn = document.getElementById("record-word-btn");
    const sentBtn = document.getElementById("record-sentence-btn");
    const playW = document.getElementById("play-word-preview");
    const playS = document.getElementById("play-sentence-preview");

    wordBtn.textContent = "Record Word";
    wordBtn.classList.remove("recording");
    sentBtn.textContent = "Record Sentence";
    sentBtn.classList.remove("recording");
    
    playW.disabled = true;
    playS.disabled = true;

    const w = studioList[studioIndex].word;
    getAudioFromDB(`${w}_word`).then(b => { if(b) playW.disabled = false; });
    getAudioFromDB(`${w}_sentence`).then(b => { if(b) playS.disabled = false; });
}

function toggleRecording(type) {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunks, { type: "audio/webm" });
            const word = studioList[studioIndex].word;
            const key = type === "word" ? `${word}_word` : `${word}_sentence`;
            
            saveAudioToDB(key, blob);
            
            const btn = document.getElementById(type === "word" ? "record-word-btn" : "record-sentence-btn");
            btn.textContent = "Re-Record";
            btn.classList.remove("recording");
            
            const playBtn = document.getElementById(type === "word" ? "play-word-preview" : "play-sentence-preview");
            playBtn.disabled = false;

            document.getElementById("recording-status").textContent = "Saved!";
            setTimeout(() => {
                document.getElementById("recording-status").textContent = "";
                // Auto-advance check
                if (document.getElementById("studio-auto-advance").checked) {
                    // Check if both exist now
                    getAudioFromDB(`${word}_word`).then(w => {
                        getAudioFromDB(`${word}_sentence`).then(s => {
                            if (w && s) setTimeout(nextStudioItem, 500);
                        });
                    });
                }
            }, 1000);
        };

        mediaRecorder.start();
        
        const btn = document.getElementById(type === "word" ? "record-word-btn" : "record-sentence-btn");
        btn.textContent = "Stop ■";
        btn.classList.add("recording");
        document.getElementById("recording-status").textContent = "Recording...";

    }).catch(err => {
        console.error("Mic Error:", err);
        alert("Could not access microphone.");
    });
}

async function playPreview(type) {
    const word = studioList[studioIndex].word;
    const key = type === "word" ? `${word}_word` : `${word}_sentence`;
    const blob = await getAudioFromDB(key);
    if (blob) {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
    }
}

function nextStudioItem() {
    studioIndex++;
    loadStudioItem();
}

/* --- GAME LOGIC --- */
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
            def: "Teacher set word.", sentence: "Can you decode this?", syllables: currentWord 
        };
    } else {
        const data = getWordFromDictionary();
        currentWord = data.word;
        currentEntry = data.entry;
        CURRENT_WORD_LENGTH = currentWord.length;
    }

    isFirstLoad = false;
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

    const pool = Object.keys(window.WORD_ENTRIES).filter(w => {
        const e = window.WORD_ENTRIES[w];
        const lenMatch = !targetLen || w.length === targetLen;
        const patMatch = pattern === 'all' || (e.tags && e.tags.includes(pattern));
        return lenMatch && patMatch;
    });

    if (pool.length === 0) return { word: "apple", entry: window.WORD_ENTRIES["apple"] };
    const final = pool[Math.floor(Math.random() * pool.length)];
    return { word: final, entry: window.WORD_ENTRIES[final] };
}

function updateFocusPanel() {
    const pat = document.getElementById("pattern-select").value;
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
    document.querySelectorAll(".tile").forEach(t => {
        if(t.textContent) t.textContent = isUpperCase ? t.textContent.toUpperCase() : t.textContent.toLowerCase();
    });
}

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
        confetti(); 
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

function showEndModal(win) {
    modalOverlay.classList.remove("hidden");
    gameModal.classList.remove("hidden");
    document.getElementById("modal-title").textContent = win ? "Great Job!" : "Nice Try!";
    
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
    studioModal.classList.add("hidden");
    
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

function checkFirstTimeVisitor() {
    if (!localStorage.getItem("decode_v5_visited")) {
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

// ===== MIC HARD STOP =====
function stopAllTracks(stream) {
  if (!stream) return;
  stream.getTracks().forEach(t => t.stop());
}
