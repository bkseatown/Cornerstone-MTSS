/* =========================================
   DECODE THE WORD - GOLD MASTER (IOS SAFE + FIXED STUDIO FLOW)
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

// DOM Elements - will be initialized after DOM loads
let board, keyboard, modalOverlay, welcomeModal, teacherModal, studioModal, gameModal;

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
    // Initialize DOM elements
    board = document.getElementById("game-board");
    keyboard = document.getElementById("keyboard");
    modalOverlay = document.getElementById("modal-overlay");
    welcomeModal = document.getElementById("welcome-modal");
    teacherModal = document.getElementById("teacher-modal");
    studioModal = document.getElementById("recording-studio-modal");
    gameModal = document.getElementById("modal");
    
    initDB();
    initControls();
    initKeyboard();
    initVoiceLoader(); 
    initStudio();
    initNewFeatures();
    initVoiceSourceControls(); // NEW: Voice source toggle
    
    startNewGame();
    checkFirstTimeVisitor();
});

/* --- VOICE LOADING & PICKER --- */
function initVoiceLoader() {
    const voiceSelect = document.getElementById("system-voice-select");

    const load = () => {
        cachedVoices = window.speechSynthesis.getVoices();
        populateVoiceList();
    };

    const populateVoiceList = () => {
        if (!voiceSelect) return;
        const saved = localStorage.getItem("preferred_voice_uri");
        
        voiceSelect.innerHTML = '<option value="">Auto-Select Best (Default)</option>';
        
        const englishVoices = cachedVoices.filter(v => v.lang.startsWith("en"));
        
        // CURATED LIST - Only show high-quality voices by default
        const curatedVoiceNames = [
            /Google US English/i,
            /Google UK English/i,
            /Enhanced|Premium/i,
            /Samantha/i,  // macOS
            /Ava/i,       // macOS
            /Alex/i,      // macOS
            /Microsoft.*English.*US/i,
            /Microsoft.*English.*UK/i
        ];
        
        const curatedVoices = englishVoices.filter(v => 
            curatedVoiceNames.some(pattern => pattern.test(v.name))
        );
        
        // If we found curated voices, use them. Otherwise show all.
        const voicesToShow = curatedVoices.length > 0 ? curatedVoices : englishVoices.slice(0, 10);
        
        voicesToShow.forEach(v => {
            const opt = document.createElement("option");
            opt.value = v.voiceURI;
            opt.textContent = `${v.name}`;
            if (v.voiceURI === saved) opt.selected = true;
            voiceSelect.appendChild(opt);
        });
        
        // Add "Show all voices" option if we're using curated list
        if (curatedVoices.length > 0 && curatedVoices.length < englishVoices.length) {
            const showAllOpt = document.createElement("option");
            showAllOpt.value = "_show_all_";
            showAllOpt.textContent = "── Show all voices ──";
            showAllOpt.disabled = true;
            voiceSelect.appendChild(showAllOpt);
        }
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
    }

    if(voiceSelect) {
        voiceSelect.onchange = () => {
            localStorage.setItem("preferred_voice_uri", voiceSelect.value);
        };
    }
}

async function speak(text, type = "word") {
    if (!text) return;
    window.speechSynthesis.cancel(); 

    // 1. Check Studio Recording
    let dbKey = "";
    if (type === "word") {
        dbKey = `${text.toLowerCase()}_word`;
    } else {
        if (currentEntry && text === currentEntry.sentence) {
            dbKey = `${currentWord.toLowerCase()}_sentence`;
        } else {
            dbKey = "unknown"; 
        }
    }

    const blob = await getAudioFromDB(dbKey);
    
    if (blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
        return; 
    }

    // 2. Fallback to System Voice
    const msg = new SpeechSynthesisUtterance(text);
    let voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
    let preferred = null;

    const savedURI = localStorage.getItem("preferred_voice_uri");
    if (savedURI) {
        preferred = voices.find(v => v.voiceURI === savedURI);
    }

    if (!preferred) {
        preferred = voices.find(v => /Google US English/i.test(v.name));
        if (!preferred) preferred = voices.find(v => /Google/i.test(v.name) && v.lang.startsWith("en-US"));
        if (!preferred) preferred = voices.find(v => (/Enhanced|Premium|Siri/i.test(v.name) && v.lang.startsWith("en-US")));
        if (!preferred) preferred = voices.find(v => /Ava/i.test(v.name) && v.lang.startsWith("en-US"));
        if (!preferred) preferred = voices.find(v => /Samantha/i.test(v.name) && v.lang.startsWith("en-US"));
        if (!preferred) preferred = voices.find(v => /Microsoft/i.test(v.name) && v.lang.startsWith("en-US"));
        if (!preferred) preferred = voices.find(v => v.lang === "en-US");
        if (!preferred) preferred = voices.find(v => v.lang.startsWith("en"));
    }

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
        autoAdjustLength();
        startNewGame();
    };
    
    document.getElementById("length-select").onchange = (e) => {
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

    window.addEventListener("keydown", (e) => {
        if (isModalOpen()) {
            if (!studioModal.classList.contains("hidden")) return; 

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

        // Add visual feedback to on-screen keyboard
        const key = e.key.toLowerCase();
        const keyElement = document.querySelector(`.key[onclick*="${key}"]`);
        if (keyElement && /^[a-z]$/i.test(e.key)) {
            keyElement.classList.add('key-pressed');
            setTimeout(() => keyElement.classList.remove('key-pressed'), 150);
        }

        if (e.key === "Enter") {
            const enterKey = document.querySelector('.key.wide[onclick*="submitGuess"]');
            if (enterKey) {
                enterKey.classList.add('key-pressed');
                setTimeout(() => enterKey.classList.remove('key-pressed'), 150);
            }
            submitGuess();
        }
        else if (e.key === "Backspace") {
            const backKey = document.querySelector('.key.wide[onclick*="deleteLetter"]');
            if (backKey) {
                backKey.classList.add('key-pressed');
                setTimeout(() => backKey.classList.remove('key-pressed'), 150);
            }
            deleteLetter();
        }
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

/* --- AUTO-ADJUST WORD LENGTH BASED ON PATTERN --- */
function autoAdjustLength() {
    const pattern = document.getElementById("pattern-select").value;
    const lengthSelect = document.getElementById("length-select");
    
    // Auto-adjust length based on pattern
    const lengthMap = {
        'cvc': '3',           // CVC words are typically 3 letters
        'digraph': 'any',     // Digraphs vary
        'blend': 'any',       // Blends vary
        'magic-e': '4',       // Magic E often 4 letters (like, hope)
        'floss': 'any',       // FLOSS varies
        'welded': 'any',      // Welded varies
        'vowel-team': 'any',  // Vowel teams vary
        'r-controlled': 'any', // R-controlled vary
        'morphology': 'any',  // Morphology varies
        'all': 'traditional'  // Default to 5
    };
    
    if (lengthMap[pattern]) {
        lengthSelect.value = lengthMap[pattern];
    }
}

/* --- STUDIO LOGIC --- */
let studioList = [];
let studioIndex = 0;
let mediaRecorder = null;
let audioChunks = [];
let recordingType = ""; // Track what we are recording

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
    
    // Safety check
    if (!window.WORD_ENTRIES) {
        alert("Word database not loaded yet. Please wait and try again.");
        return;
    }
    
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
        // FIX: iOS/Safari Mime Check
        let mimeType = "audio/webm";
        if (MediaRecorder.isTypeSupported("audio/mp4")) {
            mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            mimeType = "audio/webm;codecs=opus";
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunks = [];
        recordingType = type; // Track what we are recording

        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunks, { type: mimeType });
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
                
                // CRITICAL FIX: Only auto-advance if we just finished the SENTENCE.
                // This ensures the user stays on the card after recording the Word.
                if (document.getElementById("studio-auto-advance").checked && recordingType === 'sentence') {
                    setTimeout(nextStudioItem, 500);
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
        alert("Could not access microphone. Check permissions.");
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
    
    // Safety check: ensure word database is loaded
    if (!window.WORD_ENTRIES) {
        console.error("Word database not loaded yet");
        return { word: "apple", entry: { def: "Loading...", sentence: "Please wait.", syllables: "ap-ple" } };
    }
    
    let targetLen = null;
    if (lenVal === 'traditional') targetLen = 5;
    else if (lenVal === 'any') targetLen = null;
    else targetLen = parseInt(lenVal);

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
    
    // Safety check: ensure FOCUS_INFO is loaded
    if (!window.FOCUS_INFO) {
        console.error("FOCUS_INFO not loaded yet");
        return;
    }
    
    const info = window.FOCUS_INFO[pat] || window.FOCUS_INFO.all || { 
        title: "Practice", desc: "General Review", hint: "Do your best!", examples: "" 
    };
    
    // Safety check: ensure DOM elements exist
    const titleEl = document.getElementById("focus-title");
    const descEl = document.getElementById("focus-desc");
    const hintEl = document.getElementById("focus-hint");
    
    if (!titleEl || !descEl || !hintEl) {
        console.error("Focus panel elements not found in DOM");
        return;
    }
    
    titleEl.textContent = info.title;
    descEl.textContent = info.desc;
    hintEl.textContent = info.hint;
    
    const exSpan = document.getElementById("focus-examples");
    if (info.examples && info.examples.length > 0) {
        exSpan.textContent = `Try words like: ${info.examples}`;
    } else {
        exSpan.textContent = "";
    }

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
        showToast("Finish the word first."); // CLEAN TOAST
        return;
    }
    
    const result = evaluate(currentGuess, currentWord);
    revealColors(result, currentGuess);
    guesses.push(currentGuess);

    if (currentGuess === currentWord) {
        gameOver = true;
        confetti(); 
        setTimeout(() => {
            showEndModal(true);  // Show word reveal first
        }, 1500);
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
    // Track progress
    trackProgress(currentWord, win, guesses.length);
    
    modalOverlay.classList.remove("hidden");
    gameModal.classList.remove("hidden");
    document.getElementById("modal-title").textContent = win ? "Great Job!" : "Nice Try!";
    
    document.getElementById("modal-word").textContent = currentWord.toUpperCase();
    document.getElementById("modal-syllables").textContent = currentEntry.syllables ? currentEntry.syllables.replace(/-/g, " • ") : currentWord;
    document.getElementById("modal-def").textContent = currentEntry.def;
    document.getElementById("modal-sentence").textContent = `"${currentEntry.sentence}"`;
    
    // Reset translation section
    document.getElementById("translation-section").style.display = 'none';
    document.getElementById('translate-to').value = '';
    document.getElementById('translation-result').textContent = '';
    
    // Show bonus content if won (after user has time to read word)
    if (win) {
        setTimeout(showBonusContent, 3000);  // 3 seconds instead of 800ms
    }
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
    const wasGameModalOpen = !gameModal.classList.contains("hidden");
    
    modalOverlay.classList.add("hidden");
    welcomeModal.classList.add("hidden");
    teacherModal.classList.add("hidden");
    gameModal.classList.add("hidden");
    studioModal.classList.add("hidden");
    
    // Close new modals
    const decodableModal = document.getElementById("decodable-modal");
    const progressModal = document.getElementById("progress-modal");
    const phonemeModal = document.getElementById("phoneme-modal");
    if (decodableModal) decodableModal.classList.add("hidden");
    if (progressModal) progressModal.classList.add("hidden");
    if (phonemeModal) phonemeModal.classList.add("hidden");
    
    if (document.activeElement) document.activeElement.blur();
    document.body.focus();
    
    // Auto-start new game after closing win/loss modal
    if (wasGameModalOpen && gameOver) {
        setTimeout(() => startNewGame(), 300);
    }
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

// FIX: New Non-Stacking Toast
function showToast(msg) {
    const container = document.getElementById("toast-container");
    container.innerHTML = ""; // Clear existing
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
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
    // Create more confetti pieces spread across screen
    for (let i = 0; i < 80; i++) {
        const c = document.createElement("div");
        c.style.position = "fixed";
        c.style.left = (Math.random() * 100) + "vw"; // Spread across full width
        c.style.top = "-20px";
        c.style.width = (Math.random() * 6 + 6) + "px"; // Varied sizes 6-12px
        c.style.height = (Math.random() * 6 + 6) + "px";
        c.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        c.style.borderRadius = Math.random() > 0.5 ? "50%" : "0"; // Mix circles and squares
        c.style.zIndex = "2000";
        c.style.opacity = "1";
        // Varied fall speeds for more natural effect
        const duration = (Math.random() * 0.8 + 1.2); // 1.2-2s
        c.style.transition = `top ${duration}s ease-in, opacity ${duration}s ease-in, transform ${duration}s ease-in`;
        document.body.appendChild(c);
        
        setTimeout(() => {
            c.style.top = "110vh";
            c.style.opacity = "0";
            c.style.transform = `rotate(${Math.random() * 360}deg)`; // Spin while falling
        }, 10);
        
        setTimeout(() => c.remove(), duration * 1000 + 100);
    }
}

/* ==========================================
   BONUS CONTENT SYSTEM
   ========================================== */

const BONUS_CONTENT = {
    jokes: [
        "Why did the bicycle fall over? Because it was two-tired!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why don't scientists trust atoms? Because they make up everything!",
        "What do you call a fish wearing a bowtie? Sofishticated!",
        "Why did the math book look sad? Because it had too many problems!",
        "What do you call a sleeping bull? A bulldozer!",
        "Why did the cookie go to the doctor? Because it felt crumbly!",
        "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
        "Why can't you give Elsa a balloon? Because she will let it go!",
        "What do you call a snowman in summer? A puddle!"
    ],
    facts: [
        "Honey never spoils! Archaeologists have found 3,000-year-old honey that's still edible.",
        "A group of flamingos is called a 'flamboyance'!",
        "Octopuses have three hearts and blue blood.",
        "Bananas are berries, but strawberries aren't!",
        "Lightning strikes Earth about 100 times every second.",
        "The shortest war in history lasted only 38 minutes.",
        "Your brain generates enough electricity to power a small light bulb.",
        "A cloud can weigh more than a million pounds!",
        "Butterflies taste with their feet.",
        "The dot over 'i' and 'j' is called a 'tittle'."
    ],
    quotes: [
        "The more that you read, the more things you will know. — Dr. Seuss",
        "Today a reader, tomorrow a leader. — Margaret Fuller",
        "A person who never made a mistake never tried anything new. — Albert Einstein",
        "Be yourself; everyone else is already taken. — Oscar Wilde",
        "In a world where you can be anything, be kind.",
        "You're braver than you believe, stronger than you seem. — A.A. Milne",
        "The expert in anything was once a beginner.",
        "Every mistake is a chance to learn something new.",
        "Believe you can and you're halfway there. — Theodore Roosevelt",
        "What you do today can improve all your tomorrows."
    ]
};

function showBonusContent() {
    // Randomly choose joke, fact, or quote
    const types = ['jokes', 'facts', 'quotes'];
    const type = types[Math.floor(Math.random() * types.length)];
    const content = BONUS_CONTENT[type][Math.floor(Math.random() * BONUS_CONTENT[type].length)];
    
    const emoji = type === 'jokes' ? '😄' : type === 'facts' ? '🌟' : '💭';
    const title = type === 'jokes' ? 'Joke Time!' : type === 'facts' ? 'Fun Fact!' : 'Quote of the Day';
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 24px 32px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
        z-index: 3000;
        max-width: 500px;
        text-align: center;
        font-size: 1.1rem;
        line-height: 1.6;
        animation: bonusSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    popup.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 12px;">${emoji}</div>
        <div style="font-weight: 700; font-size: 1.3rem; margin-bottom: 12px;">${title}</div>
        <div style="font-size: 1.05rem; font-weight: 400;">${content}</div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
        popup.style.transition = 'all 0.3s ease-out';
        setTimeout(() => popup.remove(), 300);
    }, 6000);
}

// Add bonus animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bonusSlideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);

/* ==========================================
   NEW FEATURES: Translation, Decodable Texts, Progress, Phoneme Guide
   ========================================== */

// Progress tracking data
let progressData = {
    wordsAttempted: 0,
    wordsCorrect: 0,
    recentWords: [],
    totalGuesses: 0
};

// Load progress data from localStorage
function loadProgressData() {
    const saved = localStorage.getItem('decode_progress_data');
    if (saved) {
        try {
            progressData = JSON.parse(saved);
        } catch (e) {
            console.error('Could not load progress data');
        }
    }
}

// Save progress data
function saveProgressData() {
    localStorage.setItem('decode_progress_data', JSON.stringify(progressData));
}

// Track game completion
function trackProgress(word, won, numGuesses) {
    progressData.wordsAttempted++;
    if (won) progressData.wordsCorrect++;
    progressData.totalGuesses += numGuesses;
    
    progressData.recentWords.unshift({
        word: word,
        won: won,
        guesses: numGuesses,
        date: new Date().toLocaleDateString()
    });
    
    // Keep only last 20 words
    if (progressData.recentWords.length > 20) {
        progressData.recentWords = progressData.recentWords.slice(0, 20);
    }
    
    saveProgressData();
}

// Initialize new features
function initNewFeatures() {
    loadProgressData();
    
    // Translation button
    const translateBtn = document.getElementById('translate-btn');
    if (translateBtn) {
        translateBtn.onclick = () => {
            const section = document.getElementById('translation-section');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
        };
    }
    
    // Translation select
    const translateSelect = document.getElementById('translate-to');
    if (translateSelect) {
        translateSelect.onchange = () => {
            const lang = translateSelect.value;
            if (!lang) return;
            
            const resultDiv = document.getElementById('translation-result');
            const word = currentWord;
            const def = currentEntry.def || '';
            
            // Debug: Check if translations are loaded
            console.log('Translation requested for:', word, 'Language:', lang);
            console.log('window.TRANSLATIONS exists:', !!window.TRANSLATIONS);
            if (window.TRANSLATIONS) {
                console.log('Available words:', Object.keys(window.TRANSLATIONS));
            }
            
            // Use curated translations for high-frequency words
            const translation = getWordTranslation(word, lang);
            console.log('Translation found:', translation);
            
            if (translation) {
                // Rich translation available from translations.js
                resultDiv.innerHTML = `
                    <div style="padding: 12px; background: #e8f5e9; border-radius: 8px; border: 2px solid var(--color-correct);">
                        <div style="color: var(--color-correct); font-weight: 600; margin-bottom: 8px;">✓ Translation Available</div>
                        
                        <div style="font-size: 1.2rem; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <strong>${word}</strong> 
                            <span style="color: #999;">→</span> 
                            <strong style="color: var(--color-correct);">${translation.word}</strong>
                            ${translation.phonetic ? `<span style="font-size: 0.85rem; color: #666; font-style: italic;">(${translation.phonetic})</span>` : ''}
                        </div>
                        
                        <div style="font-size: 0.95rem; color: #555; margin-bottom: 10px; line-height: 1.5;">
                            ${translation.def || translation.meaning || ''}
                        </div>
                        
                        ${translation.sentence ? `
                            <div style="padding: 8px; background: white; border-radius: 4px; font-size: 0.9rem; color: #666; font-style: italic; border-left: 3px solid var(--color-correct);">
                                "${translation.sentence}"
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                // Fallback: Show English definition clearly
                resultDiv.innerHTML = `
                    <div style="padding: 10px; background: #fff3e0; border-radius: 6px; border: 2px solid #ffb74d;">
                        <div style="color: #f57c00; font-weight: 600; margin-bottom: 6px;">📚 Translation Coming Soon</div>
                        <div style="font-size: 1.1rem; margin-bottom: 8px;">
                            <strong>${word}</strong> (English)
                        </div>
                        <div style="font-size: 0.9rem; color: #555; margin-bottom: 8px;">
                            <em>Meaning: ${def}</em>
                        </div>
                        <div style="font-size: 0.85rem; color: #666; line-height: 1.4;">
                            Working with English meanings helps build vocabulary skills! We're adding more translations regularly.
                        </div>
                    </div>
                `;
            }
        };
    }
    
    // Decodable texts button
    const decodableBtn = document.getElementById('decodable-btn');
    if (decodableBtn) {
        decodableBtn.onclick = openDecodableTexts;
    }
    
    // Progress button
    const progressBtn = document.getElementById('progress-btn');
    if (progressBtn) {
        progressBtn.onclick = openProgressModal;
    }
    
    // Phoneme button
    const phonemeBtn = document.getElementById('phoneme-btn');
    if (phonemeBtn) {
        phonemeBtn.onclick = openPhonemeGuide;
    }
    
    // Close buttons for new modals
    document.querySelectorAll('.close-decodable, .close-progress, .close-phoneme').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const closeDecodableBtn = document.getElementById('close-decodable-btn');
    if (closeDecodableBtn) {
        closeDecodableBtn.onclick = closeModal;
    }
    
    // Export data button
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.onclick = exportProgressData;
    }
    
    // Clear data button
    const clearBtn = document.getElementById('clear-data-btn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm('Clear all progress data? This cannot be undone.')) {
                progressData = {
                    wordsAttempted: 0,
                    wordsCorrect: 0,
                    recentWords: [],
                    totalGuesses: 0
                };
                saveProgressData();
                openProgressModal(); // Refresh display
            }
        };
    }
    
    // Phoneme card clicks - respect voice source selection
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.phoneme-card');
        if (card) {
            const sound = card.dataset.sound;
            const example = card.dataset.example;
            
            // Check which voice source is selected
            const voiceSource = document.querySelector('input[name="guide-voice-source"]:checked')?.value;
            
            if (voiceSource === 'system') {
                // Force system voice - bypass any recordings
                speakWithSystemVoice(example);
            } else {
                // Use recorded voice if available, fallback to system
                speak(example, 'word');
            }
        }
    });
}

// Force system voice (ignore recordings)
function speakWithSystemVoice(text) {
    if (!('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use selected system voice
    const voiceSelect = document.getElementById("system-voice-select");
    const selectedVoiceURI = voiceSelect?.value;
    
    if (selectedVoiceURI && cachedVoices) {
        const voice = cachedVoices.find(v => v.voiceURI === selectedVoiceURI);
        if (voice) {
            utterance.voice = voice;
        }
    }
    
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
}

// Open decodable texts
function openDecodableTexts() {
    if (!window.DECODABLE_TEXTS) {
        alert('Decodable texts not loaded');
        return;
    }
    
    modalOverlay.classList.remove('hidden');
    const decodableModal = document.getElementById('decodable-modal');
    decodableModal.classList.remove('hidden');
    
    const listDiv = document.getElementById('decodable-text-list');
    const pattern = document.getElementById('pattern-select').value;
    
    // Filter texts by current pattern
    const texts = window.DECODABLE_TEXTS.filter(text => {
        return pattern === 'all' || (text.tags && text.tags.some(tag => tag === pattern || pattern.includes(tag)));
    });
    
    if (texts.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: #666;">No texts available for this pattern.</p>';
        return;
    }
    
    listDiv.innerHTML = texts.map(text => `
        <div class="decodable-text-card" onclick="readDecodableText('${text.title}')">
            <div class="decodable-text-title">${text.title}</div>
            <div class="decodable-text-level">${text.level}</div>
            <div class="decodable-text-content">${text.content}</div>
        </div>
    `).join('');
}

// Read decodable text aloud
function readDecodableText(title) {
    const text = window.DECODABLE_TEXTS.find(t => t.title === title);
    if (text) {
        speak(text.content, 'sentence');
    }
}

// Open progress modal
function openProgressModal() {
    modalOverlay.classList.remove('hidden');
    const progressModal = document.getElementById('progress-modal');
    progressModal.classList.remove('hidden');
    
    // Update stats
    document.getElementById('stat-attempted').textContent = progressData.wordsAttempted;
    document.getElementById('stat-correct').textContent = progressData.wordsCorrect;
    
    const rate = progressData.wordsAttempted > 0 
        ? Math.round((progressData.wordsCorrect / progressData.wordsAttempted) * 100)
        : 0;
    document.getElementById('stat-rate').textContent = rate + '%';
    
    const avgGuesses = progressData.wordsAttempted > 0
        ? (progressData.totalGuesses / progressData.wordsAttempted).toFixed(1)
        : 0;
    document.getElementById('stat-avg-guesses').textContent = avgGuesses;
    
    // Recent words
    const recentDiv = document.getElementById('recent-words');
    if (progressData.recentWords.length === 0) {
        recentDiv.innerHTML = '<p style="color: #666;">No words played yet.</p>';
    } else {
        recentDiv.innerHTML = progressData.recentWords.map(w => `
            <div style="padding: 6px; border-bottom: 1px solid #eee;">
                <strong>${w.word}</strong> - 
                ${w.won ? '✅' : '❌'} 
                (${w.guesses} guesses) - 
                <small>${w.date}</small>
            </div>
        `).join('');
    }
}

// Export progress data
function exportProgressData() {
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `decode-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Progress data exported!');
}

// Open phoneme guide
function openPhonemeGuide() {
    modalOverlay.classList.remove('hidden');
    const phonemeModal = document.getElementById('phoneme-modal');
    phonemeModal.classList.remove('hidden');
}


/* ==========================================
   MULTILINGUAL GLOSSARY (No API Required)
   Curated translations for high-frequency words
   ========================================== */

// Curated multilingual glossary
// Translation system loaded from translations.js
// window.TRANSLATIONS provides rich multilingual data:
// - word: native script translation
// - def: definition in home language  
// - sentence: example sentence translated
// - phonetic: pronunciation guide

function getWordTranslation(word, langCode) {
    const wordLower = word.toLowerCase();
    // Use window.TRANSLATIONS from translations.js (loaded via script tag)
    if (window.TRANSLATIONS && window.TRANSLATIONS[wordLower] && window.TRANSLATIONS[wordLower][langCode]) {
        return window.TRANSLATIONS[wordLower][langCode];
    }
    return null;
}


/* Self-Contained Phoneme Voice Management */
let phonemeRecorder = null;
let phonemeAudioChunks = [];
let currentPhonemeForRecording = null;

function initVoiceSourceControls() {
    // Toggle voice source
    const voiceRadios = document.getElementsByName('guide-voice-source');
    voiceRadios.forEach(radio => {
        radio.closest('.voice-option').addEventListener('click', function() {
            const radioInput = this.querySelector('input[type="radio"]');
            radioInput.checked = true;
            
            // Update styling
            document.querySelectorAll('.voice-option').forEach(opt => {
                opt.style.borderColor = '#d0d0d0';
                opt.style.background = 'white';
            });
            this.style.borderColor = 'var(--color-correct)';
            this.style.background = '#f0f8f5';
            
            if (radioInput.value === 'system') {
                showToast('Using system voice');
            } else {
                showToast('Using your recorded voice');
            }
        });
    });
    
    // When clicking a phoneme card, set it as current for recording (Teacher Studio only)
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.phoneme-card');
        if (card && card.dataset.sound) {
            currentPhonemeForRecording = card.dataset.sound;
            const displayEl = document.getElementById('current-phoneme-recording');
            if (displayEl) {
                displayEl.textContent = card.dataset.sound;
            }
        }
    });
}

/* First-Time Tutorial */
function initTutorial() {
    const tutorialShown = localStorage.getItem('tutorialShown');
    const welcomeModal = document.getElementById('welcome-modal');
    const startBtn = document.getElementById('start-playing-btn');
    const dontShowCheckbox = document.getElementById('dont-show-tutorial');
    const closeBtn = document.querySelector('.close-welcome');
    
    if (!tutorialShown && welcomeModal) {
        welcomeModal.classList.remove('hidden');
    }
    
    if (startBtn) {
        startBtn.onclick = () => {
            if (dontShowCheckbox && dontShowCheckbox.checked) {
                localStorage.setItem('tutorialShown', 'true');
            }
            welcomeModal.classList.add('hidden');
        };
    }
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            welcomeModal.classList.add('hidden');
        };
    }
}

/* Focus Panel Toggle */
function initFocusToggle() {
    const toggleBtn = document.getElementById('focus-toggle-btn');
    const focusPanel = document.getElementById('focus-panel');
    
    if (toggleBtn && focusPanel) {
        toggleBtn.onclick = () => {
            const isHidden = focusPanel.classList.contains('hidden');
            
            if (isHidden) {
                focusPanel.classList.remove('hidden');
                toggleBtn.classList.add('expanded');
                toggleBtn.textContent = '▲ Hide Hints';
            } else {
                focusPanel.classList.add('hidden');
                toggleBtn.classList.remove('expanded');
                toggleBtn.textContent = 'ℹ️ Show Hints';
            }
        };
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initTutorial();
    initFocusToggle();
});
