/* =========================================
   DECODE THE WORD - CORE LOGIC (FIXED VERSION)
   ========================================= */

// Game constants and state
const MAX_GUESSES = 6;
let CURRENT_WORD_LENGTH = 5;
let currentWord = "";
let currentEntry = null;
let guesses = [];
let currentGuess = "";
let gameOver = false;
let isFirstLoad = true;
let isUpperCase = false;

// DOM Elements (will be set after DOMContentLoaded)
let board, keyboard, modalOverlay, welcomeModal, teacherModal, gameModal;

// Main initialization
document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("game-board");
    keyboard = document.getElementById("keyboard");
    modalOverlay = document.getElementById("modal-overlay");
    welcomeModal = document.getElementById("welcome-modal");
    teacherModal = document.getElementById("teacher-modal");
    gameModal = document.getElementById("modal");
    
    if (!window.WORD_ENTRIES || !window.FOCUS_INFO) {
        console.error("Word data not loaded!");
        return;
    }
    
    initControls();
    initKeyboard();
    startNewGame();
    checkFirstTimeVisitor();
    initPhase2Features();
    initTranslationSystem();
    initStudio();
    
    console.log("✓ Game initialized successfully");
});

function initControls() {
    const newWordBtn = document.getElementById("new-word-btn");
    const caseToggle = document.getElementById("case-toggle");
    const teacherBtn = document.getElementById("teacher-btn");
    const setWordBtn = document.getElementById("set-word-btn");
    const toggleMask = document.getElementById("toggle-mask");
    const hearWordHint = document.getElementById("hear-word-hint");
    const hearSentenceHint = document.getElementById("hear-sentence-hint");
    const speakBtn = document.getElementById("speak-btn");
    
    if (newWordBtn) newWordBtn.onclick = () => startNewGame();
    if (caseToggle) caseToggle.onclick = toggleCase;
    if (teacherBtn) teacherBtn.onclick = openTeacherMode;
    if (setWordBtn) setWordBtn.onclick = handleTeacherSubmit;
    if (toggleMask) {
        toggleMask.onclick = () => {
            const inp = document.getElementById("custom-word-input");
            if (inp) { inp.type = inp.type === "password" ? "text" : "password"; inp.focus(); }
        };
    }
    
    const patternSelect = document.getElementById("pattern-select");
    const lengthSelect = document.getElementById("length-select");
    
    if (patternSelect) patternSelect.onchange = () => startNewGame();
    if (lengthSelect) {
        lengthSelect.onchange = (e) => {
            CURRENT_WORD_LENGTH = e.target.value === 'any' ? 5 : parseInt(e.target.value);
            startNewGame();
        };
    }

    if (hearWordHint) hearWordHint.onclick = () => speak(currentWord);
    if (hearSentenceHint) {
        hearSentenceHint.onclick = () => {
            if (currentEntry && currentEntry.sentence) { showToast("Sentence hint shared!"); speak(currentEntry.sentence); }
        };
    }
    if (speakBtn) speakBtn.onclick = () => speak(currentWord);

    document.querySelectorAll(".close-btn, .close-teacher, #start-playing-btn, #play-again-btn").forEach(btn => {
        if (btn) btn.addEventListener("click", closeModal);
    });

    if (modalOverlay) {
        modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };
    }

    window.addEventListener("keydown", (e) => {
        if (modalOverlay && !modalOverlay.classList.contains("hidden")) {
            if (e.key === "Escape") closeModal();
            if (e.key === "Enter" && welcomeModal && !welcomeModal.classList.contains("hidden")) closeModal();
            return;
        }
        if (gameOver) return;
        if (e.key === "Enter") submitGuess();
        else if (e.key === "Backspace") deleteLetter();
        else if (/^[a-z]$/i.test(e.key)) handleInput(e.key.toLowerCase());
    });

    const tInput = document.getElementById("custom-word-input");
    if (tInput) {
        tInput.addEventListener("keydown", (e) => {
            e.stopPropagation();
            if (e.key === "Enter") handleTeacherSubmit();
            if (e.key === "Escape") closeModal();
        });
    }
}

function startNewGame(customWord = null) {
    gameOver = false;
    guesses = [];
    currentGuess = "";
    if (board) board.innerHTML = "";
    clearKeyboardColors();
    updateFocusPanel();
    
    if (customWord) {
        currentWord = customWord.toLowerCase();
        CURRENT_WORD_LENGTH = currentWord.length;
        currentEntry = (window.WORD_ENTRIES && window.WORD_ENTRIES[currentWord]) || { 
            def: "Teacher word.", sentence: "Can you decode this?", syllables: [currentWord], syllableText: currentWord 
        };
    } else {
        const data = getWordFromDictionary();
        currentWord = data.word;
        currentEntry = data.entry;
        const lengthSelect = document.getElementById("length-select");
        if (lengthSelect && lengthSelect.value === 'any') CURRENT_WORD_LENGTH = currentWord.length;
    }
    isFirstLoad = false;
    
    if (board) {
        board.style.gridTemplateColumns = `repeat(${CURRENT_WORD_LENGTH}, 1fr)`;
        for (let i = 0; i < MAX_GUESSES * CURRENT_WORD_LENGTH; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.id = `tile-${i}`;
            board.appendChild(tile);
        }
    }
}

function getWordFromDictionary() {
    const patternSelect = document.getElementById("pattern-select");
    const lengthSelect = document.getElementById("length-select");
    const pattern = patternSelect ? patternSelect.value : 'all';
    const lenVal = lengthSelect ? lengthSelect.value : '5';
    let targetLen = (lenVal === 'any') ? (isFirstLoad ? 5 : null) : parseInt(lenVal);

    if (!window.WORD_ENTRIES) {
        return { word: "apple", entry: { def: "A fruit", sentence: "I ate an apple.", syllables: ["ap", "ple"], syllableText: "ap-ple", tags: ["all"] }};
    }

    const pool = Object.keys(window.WORD_ENTRIES).filter(w => {
        const e = window.WORD_ENTRIES[w];
        const lenMatch = !targetLen || w.length === targetLen;
        const patMatch = pattern === 'all' || (e.tags && e.tags.includes(pattern));
        return lenMatch && patMatch;
    });

    const final = pool.length ? pool[Math.floor(Math.random() * pool.length)] : "apple";
    return { word: final, entry: window.WORD_ENTRIES[final] || { def: "A word", sentence: "Try this word!", syllables: [final], syllableText: final, tags: [] }};
}

function updateFocusPanel() {
    const patternSelect = document.getElementById("pattern-select");
    const pat = patternSelect ? patternSelect.value : 'all';
    const info = (window.FOCUS_INFO && window.FOCUS_INFO[pat]) || (window.FOCUS_INFO && window.FOCUS_INFO.all) || 
                 { title: "Mixed Review", desc: "Practice various patterns", hint: "Look for patterns!", examples: "" };
    
    const focusTitle = document.getElementById("focus-title");
    const focusDesc = document.getElementById("focus-desc");
    const focusHint = document.getElementById("focus-hint");
    const focusExamples = document.getElementById("focus-examples");
    const quickRow = document.getElementById("quick-tiles-row");
    
    if (focusTitle) focusTitle.textContent = info.title || "Mixed Review";
    if (focusDesc) focusDesc.textContent = info.desc || "";
    if (focusHint) focusHint.textContent = info.hint || "";
    if (focusExamples) focusExamples.textContent = info.examples || "";

    if (quickRow) {
        if (info.quick && info.quick.length > 0) {
            quickRow.innerHTML = "";
            info.quick.forEach(q => {
                const b = document.createElement("button");
                b.className = "q-tile";
                b.textContent = q;
                b.onclick = () => { for (let c of q) handleInput(c); };
                quickRow.appendChild(b);
            });
            quickRow.classList.remove("hidden");
        } else {
            quickRow.classList.add("hidden");
        }
    }
}

function initKeyboard() {
    if (!keyboard) return;
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
            k.onclick = () => handleInput(char);
            rowDiv.appendChild(k);
        });
        if (r === "zxcvbnm") {
            rowDiv.prepend(createKey("ENTER", submitGuess, true));
            rowDiv.append(createKey("⌫", deleteLetter, true));
        }
        keyboard.appendChild(rowDiv);
    });
}

function createKey(txt, action, wide) {
    const b = document.createElement("button");
    b.textContent = txt;
    b.className = `key ${wide ? 'wide' : ''}`;
    b.onclick = action;
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
        if (t) { t.textContent = ""; t.className = "tile"; }
    }
    for (let i = 0; i < currentGuess.length; i++) {
        const t = document.getElementById(`tile-${offset + i}`);
        if (t) { t.textContent = isUpperCase ? currentGuess[i].toUpperCase() : currentGuess[i]; t.className = "tile active"; }
    }
}

function toggleCase() {
    isUpperCase = !isUpperCase;
    const caseToggle = document.getElementById("case-toggle");
    if (caseToggle) caseToggle.textContent = isUpperCase ? "ABC" : "abc";
    initKeyboard();
    guesses.forEach((g, rIdx) => {
        const off = rIdx * CURRENT_WORD_LENGTH;
        for (let i = 0; i < CURRENT_WORD_LENGTH; i++) {
            const t = document.getElementById(`tile-${off + i}`);
            if (t && g[i]) t.textContent = isUpperCase ? g[i].toUpperCase() : g[i];
        }
    });
    const currOff = guesses.length * CURRENT_WORD_LENGTH;
    for (let i = 0; i < currentGuess.length; i++) {
        const t = document.getElementById(`tile-${currOff + i}`);
        if (t) t.textContent = isUpperCase ? currentGuess[i].toUpperCase() : currentGuess[i];
    }
}

function submitGuess() {
    if (currentGuess.length !== CURRENT_WORD_LENGTH) {
        const first = document.getElementById(`tile-${guesses.length * CURRENT_WORD_LENGTH}`);
        if (first) { first.style.transform = "translateX(5px)"; setTimeout(() => first.style.transform = "none", 100); }
        return;
    }
    const result = evaluate(currentGuess, currentWord);
    revealColors(result, currentGuess);
    guesses.push(currentGuess);

    if (currentGuess === currentWord) { gameOver = true; setTimeout(() => showEndModal(true), 1500); }
    else if (guesses.length >= MAX_GUESSES) { gameOver = true; setTimeout(() => showEndModal(false), 1500); }
    else currentGuess = "";
}

function evaluate(guess, target) {
    const res = Array(CURRENT_WORD_LENGTH).fill("absent");
    const tArr = target.split(""), gArr = guess.split("");
    gArr.forEach((c, i) => { if (c === tArr[i]) { res[i] = "correct"; tArr[i] = null; gArr[i] = null; } });
    gArr.forEach((c, i) => { if (c && tArr.includes(c)) { res[i] = "present"; tArr[tArr.indexOf(c)] = null; } });
    return res;
}

function revealColors(result, guess) {
    const offset = guesses.length * CURRENT_WORD_LENGTH;
    result.forEach((status, i) => {
        setTimeout(() => {
            const t = document.getElementById(`tile-${offset + i}`);
            if (t) { t.classList.add(status); t.classList.add("pop"); }
            const k = document.querySelector(`.key[data-key="${guess[i]}"]`);
            if (k) {
                if (status === "correct") { k.classList.remove("present", "absent"); k.classList.add("correct"); }
                else if (status === "present" && !k.classList.contains("correct")) { k.classList.remove("absent"); k.classList.add("present"); }
                else if (status === "absent" && !k.classList.contains("correct") && !k.classList.contains("present")) k.classList.add("absent");
            }
        }, i * 200);
    });
}

function showEndModal(win) {
    if (modalOverlay) modalOverlay.classList.remove("hidden");
    if (gameModal) gameModal.classList.remove("hidden");
    const modalTitle = document.getElementById("modal-title");
    const modalWord = document.getElementById("modal-word");
    const modalSyllables = document.getElementById("modal-syllables");
    const modalDef = document.getElementById("modal-def");
    const modalSentence = document.getElementById("modal-sentence");
    
    if (modalTitle) modalTitle.textContent = win ? "Great Job!" : "Nice Try!";
    if (modalWord) modalWord.textContent = currentWord;
    if (modalSyllables && currentEntry) modalSyllables.textContent = currentEntry.syllableText || (Array.isArray(currentEntry.syllables) ? currentEntry.syllables.join(" • ") : currentEntry.syllables || "");
    if (modalDef && currentEntry) modalDef.textContent = currentEntry.def || "";
    if (modalSentence && currentEntry) modalSentence.textContent = `"${currentEntry.sentence || ""}"`;
    
    setTimeout(() => {
        const modalContent = gameModal ? gameModal.querySelector('.modal-content') : null;
        if (modalContent && currentWord && !modalContent.querySelector('.translation-box, .translation-unavailable')) {
            displayTranslation(currentWord, modalContent);
        }
    }, 100);
    setTimeout(() => showBonusContent(), 2000);
}

function showBonusContent() {
    if (!window.BONUS_BANK || !window.QUOTE_BANK) return;
    const type = Math.random();
    let content = "";
    if (type < 0.4 && window.BONUS_BANK.facts && window.BONUS_BANK.facts.length > 0) {
        const fact = window.BONUS_BANK.facts[Math.floor(Math.random() * window.BONUS_BANK.facts.length)];
        content = `<div class="bonus-header">✨ Did you know?</div><div class="bonus-text">${fact}</div>`;
    } else if (type < 0.7 && window.BONUS_BANK.jokes && window.BONUS_BANK.jokes.length > 0) {
        const joke = window.BONUS_BANK.jokes[Math.floor(Math.random() * window.BONUS_BANK.jokes.length)];
        content = `<div class="bonus-header">😄 Quick Joke</div><div class="bonus-text"><strong>${joke.q}</strong><br><em>${joke.a}</em></div>`;
    } else if (window.QUOTE_BANK.k2 && window.QUOTE_BANK.k2.length > 0) {
        const allQuotes = [...(window.QUOTE_BANK.k2 || []), ...(window.QUOTE_BANK.g3_5 || [])];
        if (allQuotes.length > 0) {
            const quote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
            content = `<div class="bonus-header">💡 Remember</div><div class="bonus-text">"${quote.text}"</div>`;
        }
    }
    if (!content) return;
    const bonusPopup = document.createElement("div");
    bonusPopup.className = "bonus-popup";
    bonusPopup.innerHTML = content;
    document.body.appendChild(bonusPopup);
    setTimeout(() => bonusPopup.classList.add("show"), 10);
    setTimeout(() => { bonusPopup.classList.remove("show"); setTimeout(() => bonusPopup.remove(), 300); }, 6000);
    bonusPopup.onclick = () => { bonusPopup.classList.remove("show"); setTimeout(() => bonusPopup.remove(), 300); };
}

function openTeacherMode() {
    if (modalOverlay) modalOverlay.classList.remove("hidden");
    if (teacherModal) teacherModal.classList.remove("hidden");
    const inp = document.getElementById("custom-word-input");
    const teacherError = document.getElementById("teacher-error");
    if (inp) { inp.value = ""; inp.focus(); }
    if (teacherError) teacherError.textContent = "";
}

function handleTeacherSubmit() {
    const inp = document.getElementById("custom-word-input");
    const teacherError = document.getElementById("teacher-error");
    const val = inp ? inp.value.trim().toLowerCase() : "";
    if (val.length < 3 || val.length > 10 || !/^[a-z]+$/.test(val)) {
        if (teacherError) teacherError.textContent = "3-10 letters, no spaces.";
        return;
    }
    closeModal();
    showToast("Teacher word accepted. Ready!");
    startNewGame(val);
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.add("hidden");
    if (welcomeModal) welcomeModal.classList.add("hidden");
    if (teacherModal) teacherModal.classList.add("hidden");
    if (gameModal) gameModal.classList.add("hidden");
    ["studio-modal", "passage-modal", "phoneme-modal"].forEach(id => {
        const m = document.getElementById(id);
        if (m) m.classList.add("hidden");
    });
}

function showToast(msg) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function checkFirstTimeVisitor() {
    if (!localStorage.getItem("decode_v4_visited")) {
        if (modalOverlay) modalOverlay.classList.remove("hidden");
        if (welcomeModal) welcomeModal.classList.remove("hidden");
        localStorage.setItem("decode_v4_visited", "true");
    }
}

function clearKeyboardColors() {
    document.querySelectorAll(".key").forEach(k => k.classList.remove("correct", "present", "absent"));
    initKeyboard();
}

function speak(text) {
    if (!text) return;
    const msg = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => (v.name.includes("Google") || v.name.includes("Samantha")) && v.lang.startsWith("en"));
    msg.voice = preferred || voices[0];
    msg.rate = 0.9;
    speechSynthesis.speak(msg);
}

// ================================
// Teacher Recording Studio
// ================================
let studioDbPromise = null;
function openStudioDb() {
    if (studioDbPromise) return studioDbPromise;
    studioDbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open("decode_the_word_audio_db", 1);
        req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains("audio")) db.createObjectStore("audio"); };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
    return studioDbPromise;
}

async function studioPut(key, blob) {
    const db = await openStudioDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("audio", "readwrite");
        tx.objectStore("audio").put(blob, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

async function studioGet(key) {
    const db = await openStudioDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("audio", "readonly");
        const req = tx.objectStore("audio").get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
}

function initStudio() {
    const modal = document.getElementById("studio-modal");
    const openBtn = document.getElementById("open-studio-btn");
    if (!modal || !openBtn) { console.log("Studio elements not found"); return; }

    const closeBtn = document.getElementById("close-studio");
    const setupView = document.getElementById("studio-setup-view");
    const recordView = document.getElementById("studio-record-view");
    const startBtn = document.getElementById("studio-start-btn");
    const exitBtn = document.getElementById("studio-exit-btn");
    const nextBtn = document.getElementById("studio-next-btn");
    const counterEl = document.getElementById("studio-counter");
    const wordDisplay = document.getElementById("studio-word-display");
    const sentenceTA = document.getElementById("studio-sentence-display");
    const progressEl = document.getElementById("studio-progress");
    const recWordBtn = document.getElementById("record-word-btn");
    const recSentenceBtn = document.getElementById("record-sentence-btn");
    const playWordBtn = document.getElementById("play-word-preview");
    const playSentenceBtn = document.getElementById("play-sentence-preview");
    const statusEl = document.getElementById("recording-status");

    let studioIndex = 0, recorder = null, recordingType = null, isRecording = false, stream = null;

    function getWordList() {
        if (!window.WORD_ENTRIES) return [];
        const source = document.getElementById("studio-source-select")?.value || "all";
        const focus = document.getElementById("pattern-select")?.value || "all";
        return Object.keys(window.WORD_ENTRIES).filter(w => {
            if (source === "focus" && focus !== "all") return window.WORD_ENTRIES[w].tags?.includes(focus);
            return true;
        });
    }
    function currentWordKey() { return getWordList()[studioIndex] || ""; }
    function currentEntryStudio() { return window.WORD_ENTRIES ? window.WORD_ENTRIES[currentWordKey()] : null; }

    async function refreshUI() {
        const list = getWordList();
        if (counterEl) counterEl.textContent = `Word ${studioIndex + 1} of ${list.length}`;
        if (wordDisplay) wordDisplay.textContent = currentWordKey();
        const entry = currentEntryStudio();
        if (sentenceTA) sentenceTA.value = entry ? entry.sentence : "";
        const wordBlob = await studioGet(`${currentWordKey()}_word`);
        const sentenceBlob = await studioGet(`${currentWordKey()}_sentence`);
        if (playWordBtn) playWordBtn.disabled = !wordBlob;
        if (playSentenceBtn) playSentenceBtn.disabled = !sentenceBlob;
    }

    function showModal() { modal.classList.remove("hidden"); modal.setAttribute("aria-hidden", "false"); }
    function hideModal() { modal.classList.add("hidden"); modal.setAttribute("aria-hidden", "true"); if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }

    async function startRecording(type) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            recorder = new MediaRecorder(stream);
            const chunks = [];
            recorder.ondataavailable = e => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                await studioPut(`${currentWordKey()}_${type}`, blob);
                if (statusEl) statusEl.textContent = `✓ ${type} saved`;
                if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
                isRecording = false; recordingType = null;
                if (type === "word" && recWordBtn) recWordBtn.classList.remove("recording");
                if (type === "sentence" && recSentenceBtn) recSentenceBtn.classList.remove("recording");
                await refreshUI();
                const autoAdvance = document.getElementById("studio-auto-advance");
                if (autoAdvance?.checked && studioIndex < getWordList().length - 1) { studioIndex++; await refreshUI(); }
            };
            recorder.start();
            isRecording = true; recordingType = type;
            if (type === "word" && recWordBtn) recWordBtn.classList.add("recording");
            if (type === "sentence" && recSentenceBtn) recSentenceBtn.classList.add("recording");
            if (statusEl) statusEl.textContent = `🔴 Recording ${type}...`;
        } catch (err) { console.error("Recording error:", err); if (statusEl) statusEl.textContent = "⚠️ Microphone access denied"; }
    }

    function playBlob(blob) { if (!blob) return; const audio = new Audio(URL.createObjectURL(blob)); audio.play(); }

    openBtn.onclick = () => { if (setupView) setupView.classList.remove("hidden"); if (recordView) recordView.classList.add("hidden"); showModal(); if (progressEl) progressEl.textContent = ""; };
    if (closeBtn) closeBtn.onclick = hideModal;
    if (exitBtn) exitBtn.onclick = hideModal;
    modal.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
    if (startBtn) startBtn.onclick = async () => { if (setupView) setupView.classList.add("hidden"); if (recordView) recordView.classList.remove("hidden"); studioIndex = 0; await refreshUI(); };
    if (nextBtn) nextBtn.onclick = async () => { studioIndex = Math.min(studioIndex + 1, getWordList().length - 1); await refreshUI(); };
    if (recWordBtn) recWordBtn.onclick = () => { if (isRecording && recordingType === "word") { recorder?.stop(); } else startRecording("word"); };
    if (recSentenceBtn) recSentenceBtn.onclick = () => { if (isRecording && recordingType === "sentence") { recorder?.stop(); } else { const entry = currentEntryStudio(); if (entry && sentenceTA) entry.sentence = sentenceTA.value.trim(); startRecording("sentence"); } };
    if (playWordBtn) playWordBtn.onclick = async () => playBlob(await studioGet(`${currentWordKey()}_word`));
    if (playSentenceBtn) playSentenceBtn.onclick = async () => playBlob(await studioGet(`${currentWordKey()}_sentence`));
    openStudioDb().then(() => console.log("Audio DB Ready")).catch(() => {});
}

// ================================
// PHASE 2: PASSAGE READER & PHONEME PRACTICE
// ================================
function initPhase2Features() {
    initPassageReader();
    initPhonemePractice();
    initTeacherControls();
    console.log("✓ Phase 2 features initialized");
}

function initPassageReader() {
    const passageBtn = document.getElementById('open-passage-btn');
    const passageModal = document.getElementById('passage-modal');
    const closeBtn = document.getElementById('close-passage');
    const playBtn = document.getElementById('passage-play-btn');
    const highlightBtn = document.getElementById('passage-highlight-btn');
    const questionsBtn = document.getElementById('passage-questions-btn');
    const anotherBtn = document.getElementById('passage-another-btn');
    if (!passageBtn || !passageModal) { console.log("Passage reader elements not found"); return; }

    let currentPassage = null, highlightMode = false;

    passageBtn.onclick = () => {
        const focus = document.getElementById('pattern-select')?.value || 'all';
        const passage = window.getRandomPassage ? window.getRandomPassage(focus) : null;
        if (passage) { currentPassage = passage; showPassage(passage); }
        else showToast("No passages available for this focus yet!");
    };
    if (closeBtn) closeBtn.onclick = () => { passageModal.classList.add('hidden'); if (modalOverlay) modalOverlay.classList.add('hidden'); highlightMode = false; };
    if (playBtn) playBtn.onclick = () => { if (currentPassage) { speakText(currentPassage.text); showToast("🔊 Playing passage..."); } };
    if (highlightBtn) highlightBtn.onclick = () => { highlightMode = !highlightMode; highlightPatternWords(currentPassage, highlightMode); highlightBtn.textContent = highlightMode ? "✓ Highlighting" : "👁 Highlight Pattern"; highlightBtn.style.background = highlightMode ? "var(--color-correct)" : ""; highlightBtn.style.color = highlightMode ? "white" : ""; };
    if (questionsBtn) questionsBtn.onclick = () => { const qDiv = document.getElementById('passage-questions'); if (qDiv) { qDiv.classList.toggle('hidden'); questionsBtn.textContent = qDiv.classList.contains('hidden') ? "❓ Show Questions" : "✓ Questions Shown"; } };
    if (anotherBtn) anotherBtn.onclick = () => { const focus = document.getElementById('pattern-select')?.value || 'all'; const passage = window.getRandomPassage ? window.getRandomPassage(focus) : null; if (passage) { currentPassage = passage; showPassage(passage); highlightMode = false; if (highlightBtn) { highlightBtn.textContent = "👁 Highlight Pattern"; highlightBtn.style.background = ""; highlightBtn.style.color = ""; } } };
}

function showPassage(passage) {
    const passageModal = document.getElementById('passage-modal');
    const passageTitle = document.getElementById('passage-title');
    const passageLevel = document.getElementById('passage-level');
    const passageFocus = document.getElementById('passage-focus');
    const passageText = document.getElementById('passage-text');
    const questionsList = document.getElementById('questions-list');
    const teachingList = document.getElementById('teaching-list');
    const questionsDiv = document.getElementById('passage-questions');

    if (passageTitle) passageTitle.textContent = passage.title;
    if (passageLevel) passageLevel.textContent = passage.level;
    if (passageFocus) passageFocus.textContent = passage.focus;
    if (passageText) passageText.innerHTML = `<p>${passage.text}</p>`;
    if (questionsList && passage.questions) questionsList.innerHTML = passage.questions.map(q => `<li>${q}</li>`).join('');
    if (teachingList && passage.teachingPoints) teachingList.innerHTML = passage.teachingPoints.map(p => `<li>${p}</li>`).join('');
    if (questionsDiv) questionsDiv.classList.add('hidden');
    if (passageModal) passageModal.classList.remove('hidden');
    if (modalOverlay) modalOverlay.classList.remove('hidden');
}

function highlightPatternWords(passage, highlight) {
    const passageText = document.getElementById('passage-text');
    if (!passageText || !passage) return;
    if (!highlight) { passageText.innerHTML = `<p>${passage.text}</p>`; return; }
    let html = passage.text;
    if (passage.words) passage.words.forEach(word => { html = html.replace(new RegExp(`\\b(${word})\\b`, 'gi'), '<span class="highlight-word">$1</span>'); });
    passageText.innerHTML = `<p>${html}</p>`;
}

function initPhonemePractice() {
    const phonemeBtn = document.getElementById('open-phoneme-btn');
    const phonemeModal = document.getElementById('phoneme-modal');
    const closeBtn = document.getElementById('close-phoneme');
    const playAllBtn = document.getElementById('phoneme-play-all');
    const slowBlendBtn = document.getElementById('phoneme-slow-blend');
    if (!phonemeBtn || !phonemeModal) { console.log("Phoneme practice elements not found"); return; }

    phonemeBtn.onclick = () => showPhonemePractice(currentWord);
    if (closeBtn) closeBtn.onclick = () => { phonemeModal.classList.add('hidden'); if (modalOverlay) modalOverlay.classList.add('hidden'); };
    if (playAllBtn) playAllBtn.onclick = () => speak(currentWord);
    if (slowBlendBtn) slowBlendBtn.onclick = () => slowBlend(currentWord);
}

function showPhonemePractice(word) {
    const phonemeModal = document.getElementById('phoneme-modal');
    const phonemeWord = document.getElementById('phoneme-word');
    const phonemeSounds = document.getElementById('phoneme-sounds');
    const phonemeArticulation = document.getElementById('phoneme-articulation');
    if (!word || !phonemeModal) return;

    if (phonemeWord) phonemeWord.textContent = word;
    const phonemes = window.getWordPhonemes ? window.getWordPhonemes(word) : word.split('');
    if (phonemeSounds) {
        phonemeSounds.innerHTML = '';
        phonemes.forEach(phoneme => {
            const btn = document.createElement('button');
            btn.className = 'phoneme-btn';
            btn.textContent = phoneme;
            btn.onclick = () => { showPhonemeArticulation(phoneme); speakPhoneme(phoneme); };
            phonemeSounds.appendChild(btn);
        });
    }
    if (phonemeArticulation) phonemeArticulation.innerHTML = '<p class="muted">👆 Click a sound above to see how to make it</p>';
    phonemeModal.classList.remove('hidden');
    if (modalOverlay) modalOverlay.classList.remove('hidden');
}

function showPhonemeArticulation(phoneme) {
    const phonemeArticulation = document.getElementById('phoneme-articulation');
    if (!phonemeArticulation) return;
    const info = window.getPhonemeInfo ? window.getPhonemeInfo(phoneme) : null;
    if (info) {
        phonemeArticulation.innerHTML = `<div class="articulation-card"><h4>${info.symbol || phoneme}</h4><p><strong>How to make it:</strong> ${info.description || 'Speak this sound'}</p>${info.mouthPosition ? `<p><strong>Mouth position:</strong> ${info.mouthPosition}</p>` : ''}${info.examples ? `<p><strong>Examples:</strong> ${info.examples.join(', ')}</p>` : ''}</div>`;
    } else phonemeArticulation.innerHTML = `<p>Speak the sound: <strong>${phoneme}</strong></p>`;
}

function speakPhoneme(phoneme) { const u = new SpeechSynthesisUtterance(phoneme); u.rate = 0.5; speechSynthesis.speak(u); }

function slowBlend(word) {
    const phonemes = window.getWordPhonemes ? window.getWordPhonemes(word) : word.split('');
    let delay = 0;
    phonemes.forEach(phoneme => { setTimeout(() => speakPhoneme(phoneme), delay); delay += 800; });
    setTimeout(() => speak(word), delay + 500);
}

function initTeacherControls() {
    const enablePassages = document.getElementById('enable-passages');
    const enablePhonemePractice = document.getElementById('enable-phoneme-practice');
    const featureContainer = document.getElementById('feature-buttons-container');

    function updateFeatureVisibility() {
        const showPassages = enablePassages?.checked;
        const showPhoneme = enablePhonemePractice?.checked;
        if (featureContainer) featureContainer.classList.toggle('hidden', !showPassages && !showPhoneme);
        const passageBtn = document.getElementById('open-passage-btn');
        const phonemeBtn = document.getElementById('open-phoneme-btn');
        if (passageBtn) passageBtn.style.display = showPassages ? 'inline-block' : 'none';
        if (phonemeBtn) phonemeBtn.style.display = showPhoneme ? 'inline-block' : 'none';
        localStorage.setItem('enable-passages', showPassages);
        localStorage.setItem('enable-phoneme-practice', showPhoneme);
    }

    if (enablePassages) { enablePassages.checked = localStorage.getItem('enable-passages') === 'true'; enablePassages.onchange = updateFeatureVisibility; }
    if (enablePhonemePractice) { enablePhonemePractice.checked = localStorage.getItem('enable-phoneme-practice') === 'true'; enablePhonemePractice.onchange = updateFeatureVisibility; }
    updateFeatureVisibility();
}

function speakText(text) {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1.0; u.volume = 1.0;
    const voices = speechSynthesis.getVoices();
    u.voice = voices.find(v => v.lang.startsWith('en-')) || voices[0];
    speechSynthesis.speak(u);
}

// ================================
// PHASE 3: TRANSLATION SYSTEM
// ================================
function initTranslationSystem() {
    const enableTranslations = document.getElementById('enable-translations');
    const languageSelector = document.getElementById('language-selector');
    const translationLanguage = document.getElementById('translation-language');
    if (!enableTranslations || !languageSelector) { console.log("Translation elements not found"); return; }

    enableTranslations.addEventListener('change', (e) => { languageSelector.classList.toggle('hidden', !e.target.checked); saveTranslationPreferences(); });
    if (translationLanguage) translationLanguage.addEventListener('change', () => { saveTranslationPreferences(); showToast(`🌍 Translation language set to ${translationLanguage.options[translationLanguage.selectedIndex].text}`); });
    loadTranslationPreferences();
    console.log("✓ Translation system initialized");
}

function saveTranslationPreferences() {
    const enableTranslations = document.getElementById('enable-translations');
    const translationLanguage = document.getElementById('translation-language');
    if (enableTranslations && translationLanguage) {
        localStorage.setItem('enable-translations', enableTranslations.checked);
        localStorage.setItem('translation-language', translationLanguage.value);
    }
}

function loadTranslationPreferences() {
    const enableTranslations = document.getElementById('enable-translations');
    const translationLanguage = document.getElementById('translation-language');
    const languageSelector = document.getElementById('language-selector');
    if (enableTranslations && translationLanguage && languageSelector) {
        const enabled = localStorage.getItem('enable-translations') === 'true';
        enableTranslations.checked = enabled;
        translationLanguage.value = localStorage.getItem('translation-language') || '';
        if (enabled) languageSelector.classList.remove('hidden');
    }
}

function getTranslationSettings() {
    return {
        enabled: document.getElementById('enable-translations')?.checked || false,
        language: document.getElementById('translation-language')?.value || ''
    };
}

function displayTranslation(word, containerElement) {
    const settings = getTranslationSettings();
    if (!settings.enabled || !settings.language) return;
    const translation = window.getTranslation ? window.getTranslation(word, settings.language) : null;
    if (!translation) {
        const unavailableDiv = document.createElement('div');
        unavailableDiv.className = 'translation-unavailable';
        unavailableDiv.innerHTML = `<strong>🌍 Translation:</strong> Not yet available for "${word}" in this language.`;
        containerElement.appendChild(unavailableDiv);
        return;
    }
    const langInfo = window.getLanguageInfo ? window.getLanguageInfo(settings.language) : null;
    if (!langInfo) return;
    const translationBox = document.createElement('div');
    translationBox.className = 'translation-box';
    if (langInfo.dir === 'rtl') translationBox.setAttribute('dir', 'rtl');
    translationBox.innerHTML = `<div class="translation-header"><div class="translation-language-badge"><span class="flag">${langInfo.flag}</span><span>${langInfo.native}</span></div><button class="translation-audio-btn" onclick="window.playTranslationAudio('${word}', '${settings.language}')">🔊 Hear in ${langInfo.name}</button></div><div class="translation-word">${translation.word}</div><div class="translation-phonetic">Pronunciation: ${translation.phonetic}</div><div class="translation-def">${translation.def}</div><div class="translation-sentence">"${translation.sentence}"</div>`;
    containerElement.appendChild(translationBox);
}

window.playTranslationAudio = function(word, langCode) {
    const translation = window.getTranslation ? window.getTranslation(word, langCode) : null;
    if (!translation) return;
    if (window.speakTranslation) window.speakTranslation(translation.word, langCode);
    else speak(translation.word);
    showToast(`🔊 Playing pronunciation...`);
};

console.log("✓ Script loaded successfully");
