/* =========================================
// Compatibility: map WORDS_DATA to WORD_ENTRIES
if (typeof WORDS_DATA !== "undefined") window.WORD_ENTRIES = WORDS_DATA;
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
    // Compatibility: map WORDS_DATA to WORD_ENTRIES
    if (typeof WORDS_DATA !== 'undefined') {
        window.WORD_ENTRIES = WORDS_DATA;
    }
    
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
    initVoiceSourceControls(); // Voice source toggle
    
    // Initialize adaptive actions
    if (typeof initAdaptiveActions === 'function') {
        initAdaptiveActions();
    } else {
        console.log('initAdaptiveActions not available - skipping');
    }
    
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
    } else if (type === "sentence") {
        // Handle both data structures for sentences
        let currentSentence = null;
        if (currentEntry && currentEntry.en && currentEntry.en.sentence) {
            currentSentence = currentEntry.en.sentence;
        } else if (currentEntry && currentEntry.sentence) {
            currentSentence = currentEntry.sentence;
        }
        
        if (currentSentence && text === currentSentence) {
            dbKey = `${currentWord.toLowerCase()}_sentence`;
        } else {
            dbKey = "unknown"; 
        }
    } else {
        dbKey = "unknown";
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

/* Play text in a specific language for translations */
function playTextInLanguage(text, languageCode) {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Language code mappings for voice selection
    const langMappings = {
        'es': 'es',
        'zh': 'zh',
        'vi': 'vi',
        'tl': 'tl', 
        'pt': 'pt',
        'hi': 'hi'
    };
    
    const targetLang = langMappings[languageCode] || languageCode;
    
    // Find best voice for the language
    let preferredVoice = voices.find(v => v.lang.startsWith(targetLang + '-'));
    if (!preferredVoice) {
        preferredVoice = voices.find(v => v.lang.startsWith(targetLang));
    }
    
    if (preferredVoice) {
        msg.voice = preferredVoice;
        msg.lang = preferredVoice.lang;
    } else {
        // Fallback to setting language without specific voice
        msg.lang = targetLang;
    }
    
    msg.rate = 0.8; // Slightly slower for non-English
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
    const toggleMaskBtn = document.getElementById("toggle-mask");
    if (toggleMaskBtn) {
        toggleMaskBtn.onclick = () => {
            const inp = document.getElementById("custom-word-input");
            const isHidden = inp.type === "password";
            inp.type = isHidden ? "text" : "password";
            toggleMaskBtn.textContent = isHidden ? "Hide" : "Show";
            inp.focus();
        };
    }

    // Simple audio buttons
    const hearWordBtn = document.getElementById("simple-hear-word");
    const hearSentenceBtn = document.getElementById("simple-hear-sentence");
    
    if (hearWordBtn) {
        hearWordBtn.onclick = () => {
            if (currentWord) {
                // Add visual feedback
                const originalText = hearWordBtn.innerHTML;
                hearWordBtn.innerHTML = '🔊 Playing...';
                hearWordBtn.style.opacity = '0.7';
                
                speak(currentWord, 'word');
                
                // Reset button after a short delay
                setTimeout(() => {
                    hearWordBtn.innerHTML = originalText;
                    hearWordBtn.style.opacity = '1';
                }, 2000);
            }
            hearWordBtn.blur();
        };
    }
    
    if (hearSentenceBtn) {
        hearSentenceBtn.onclick = () => {
            let sentence = null;
            if (currentEntry && currentEntry.en && currentEntry.en.sentence) {
                sentence = currentEntry.en.sentence;
            } else if (currentEntry && currentEntry.sentence) {
                sentence = currentEntry.sentence;
            }
            
            const sentencePreview = document.getElementById('sentence-preview');
            
            if (sentence) {
                // Show sentence preview
                if (sentencePreview) {
                    sentencePreview.textContent = `"${sentence}"`;
                    sentencePreview.classList.remove('hidden');
                    
                    // Hide preview after 5 seconds
                    setTimeout(() => {
                        sentencePreview.classList.add('hidden');
                    }, 5000);
                }
                
                // Add visual feedback
                const originalText = hearSentenceBtn.innerHTML;
                hearSentenceBtn.innerHTML = '🔊 Playing...';
                hearSentenceBtn.style.opacity = '0.7';
                
                speak(sentence, 'sentence');
                
                // Reset button after a short delay
                setTimeout(() => {
                    hearSentenceBtn.innerHTML = originalText;
                    hearSentenceBtn.style.opacity = '1';
                }, 2000);
            } else {
                // Show feedback if no sentence available
                if (sentencePreview) {
                    sentencePreview.textContent = 'No example sentence available for this word.';
                    sentencePreview.classList.remove('hidden');
                    
                    setTimeout(() => {
                        sentencePreview.classList.add('hidden');
                    }, 3000);
                }
                
                const originalText = hearSentenceBtn.innerHTML;
                hearSentenceBtn.innerHTML = '❌ No sentence';
                hearSentenceBtn.style.opacity = '0.7';
                
                setTimeout(() => {
                    hearSentenceBtn.innerHTML = originalText;
                    hearSentenceBtn.style.opacity = '1';
                }, 1500);
            }
            hearSentenceBtn.blur();
        };
    }
    
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
        
        if (/^[a-z]$/i.test(key)) {
            // Find key by data-key attribute
            const keyElement = document.querySelector(`.key[data-key="${key}"]`);
            if (keyElement) {
                keyElement.classList.add('key-pressed');
                setTimeout(() => keyElement.classList.remove('key-pressed'), 150);
            }
            handleInput(key);
        }
        else if (e.key === "Enter") {
            const enterKey = Array.from(document.querySelectorAll('.key.wide')).find(k => 
                k.textContent === 'ENTER'
            );
            if (enterKey) {
                enterKey.classList.add('key-pressed');
                setTimeout(() => enterKey.classList.remove('key-pressed'), 150);
            }
            submitGuess();
        }
        else if (e.key === "Backspace") {
            const backKey = Array.from(document.querySelectorAll('.key.wide')).find(k => 
                k.textContent.includes('⌫')
            );
            if (backKey) {
                backKey.classList.add('key-pressed');
                setTimeout(() => backKey.classList.remove('key-pressed'), 150);
            }
            deleteLetter();
        }
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
    document.getElementById("prev-item-btn").onclick = prevStudioItem;
    document.getElementById("skip-item-btn").onclick = skipStudioItem;
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
        alert("No words found. Please check your selection or pasted list.");
        return;
    }

    studioList = [];
    for (let w of rawList) {
        const entry = window.WORD_ENTRIES[w];
        let sentence = `The word is ${w}.`; // fallback
        
        // Extract sentence from multilingual data structure
        if (entry) {
            if (entry.en && entry.en.sentence) {
                sentence = entry.en.sentence;
            } else if (entry.sentence) {
                sentence = entry.sentence;
            }
        }
        
        if (skipExisting) {
            const hasWord = await getAudioFromDB(`${w}_word`);
            const hasSent = await getAudioFromDB(`${w}_sentence`);
            if (hasWord && hasSent) continue; 
        }
        
        studioList.push({ 
            word: w, 
            sentence: sentence,
            definition: entry?.en?.def || entry?.def || `Definition for ${w}`,
            entry: entry
        });
    }

    if (studioList.length === 0) {
        alert("All selected words already have recordings! Try unchecking 'Skip existing' or choose different words.");
        return;
    }

    studioIndex = 0;
    document.getElementById("studio-setup-view").classList.add("hidden");
    document.getElementById("studio-record-view").classList.remove("hidden");
    loadStudioItem();
}

function loadStudioItem() {
    if (studioIndex >= studioList.length) {
        showStudioCompletionModal();
        return;
    }

    const item = studioList[studioIndex];
    const progressElement = document.getElementById("studio-progress");
    const definitionElement = document.getElementById("studio-definition-display");
    
    // Enhanced progress display
    const progressText = `Word ${studioIndex + 1} of ${studioList.length}`;
    const percentComplete = Math.round(((studioIndex) / studioList.length) * 100);
    progressElement.innerHTML = `<strong>${progressText}</strong> • ${percentComplete}% Complete`;
    
    // Populate word data
    document.getElementById("studio-word-display").textContent = item.word.toUpperCase();
    document.getElementById("studio-sentence-display").value = item.sentence || "";
    
    // Show definition
    if (definitionElement) {
        definitionElement.textContent = item.definition || "No definition available";
    }

    resetRecordButtons();
    updateNavigationButtons();
    
    // Auto-scroll to top of recording area
    const recordView = document.getElementById("studio-record-view");
    if (recordView) {
        recordView.scrollTop = 0;
    }
}

function showStudioCompletionModal() {
    const totalWords = studioList.length;
    const wordsRecorded = studioIndex;
    
    const message = `🎉 Recording Session Complete!\n\n` +
                   `✅ ${totalWords} words processed\n` +
                   `🎙️ Recordings saved to device\n\n` +
                   `Your custom recordings will now be used when students play with these words. ` +
                   `The app will automatically prefer your recordings over computer-generated speech.`;
    
    alert(message);
    closeModal();
}

function resetRecordButtons() {
    const wordBtn = document.getElementById("record-word-btn");
    const sentBtn = document.getElementById("record-sentence-btn");
    const playW = document.getElementById("play-word-preview");
    const playS = document.getElementById("play-sentence-preview");

    // Reset button states
    wordBtn.innerHTML = "🎤 Record Word";
    wordBtn.classList.remove("recording");
    wordBtn.style.background = "#dc2626";
    
    sentBtn.innerHTML = "🎤 Record Sentence";
    sentBtn.classList.remove("recording");
    sentBtn.style.background = "#dc2626";
    
    // Reset play buttons
    playW.disabled = true;
    playW.style.background = "#e5e7eb";
    playW.style.color = "#9ca3af";
    
    playS.disabled = true;
    playS.style.background = "#e5e7eb";
    playS.style.color = "#9ca3af";

    // Check for existing recordings and update play button states
    const w = studioList[studioIndex].word;
    getAudioFromDB(`${w}_word`).then(blob => { 
        if(blob) {
            playW.disabled = false;
            playW.style.background = "#10b981";
            playW.style.color = "white";
            wordBtn.innerHTML = "✅ Re-record Word";
            wordBtn.style.background = "#059669";
        }
    });
    
    getAudioFromDB(`${w}_sentence`).then(blob => { 
        if(blob) {
            playS.disabled = false;
            playS.style.background = "#10b981";
            playS.style.color = "white";
            sentBtn.innerHTML = "✅ Re-record Sentence";
            sentBtn.style.background = "#059669";
        }
    });
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
            const playBtn = document.getElementById(type === "word" ? "play-word-preview" : "play-sentence-preview");
            
            // Update button to show successful recording
            btn.innerHTML = type === "word" ? "✅ Re-record Word" : "✅ Re-record Sentence";
            btn.classList.remove("recording");
            btn.style.background = "#059669";
            
            // Enable and style the play button
            playBtn.disabled = false;
            playBtn.style.background = "#10b981";
            playBtn.style.color = "white";

            // Show success message
            const statusElement = document.getElementById("recording-status");
            statusElement.style.display = "block";
            statusElement.style.background = "#d1fae5";
            statusElement.style.color = "#065f46";
            statusElement.innerHTML = `🎉 ${type === "word" ? "Word" : "Sentence"} recording saved!`;
            
            setTimeout(() => {
                statusElement.style.display = "none";
                
                // CRITICAL FIX: Only auto-advance if we just finished the SENTENCE.
                // This ensures the user stays on the card after recording the Word.
                if (document.getElementById("studio-auto-advance").checked && recordingType === 'sentence') {
                    setTimeout(nextStudioItem, 500);
                }
            }, 2000);
        };

        mediaRecorder.start();
        
        const btn = document.getElementById(type === "word" ? "record-word-btn" : "record-sentence-btn");
        const statusElement = document.getElementById("recording-status");
        
        // Update button for recording state
        btn.innerHTML = "🔴 Stop Recording";
        btn.classList.add("recording");
        btn.style.background = "#ef4444";
        
        // Show recording status
        statusElement.style.display = "block";
        statusElement.style.background = "#fee2e2";
        statusElement.style.color = "#dc2626";
        statusElement.innerHTML = `🔴 Recording ${type === "word" ? "word" : "sentence"}... Click button to stop.`;

    }).catch(err => {
        console.error("Mic Error:", err);
        alert("Could not access microphone. Please check permissions and try again.");
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

function prevStudioItem() {
    if (studioIndex > 0) {
        studioIndex--;
        loadStudioItem();
    }
    updateNavigationButtons();
}

function skipStudioItem() {
    const confirmSkip = confirm(`Skip recording "${studioList[studioIndex].word}"?\n\nYou can come back to it later by using the Previous button.`);
    if (confirmSkip) {
        nextStudioItem();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById("prev-item-btn");
    const nextBtn = document.getElementById("next-item-btn");
    
    if (prevBtn) {
        prevBtn.disabled = studioIndex === 0;
        prevBtn.style.opacity = studioIndex === 0 ? "0.5" : "1";
    }
    
    if (nextBtn) {
        const isLast = studioIndex >= studioList.length - 1;
        nextBtn.innerHTML = isLast ? "🏁 Finish Session" : "Next Word →";
    }
}

/* --- GAME LOGIC --- */
function startNewGame(customWord = null) {
    // Safety check: ensure board element exists
    if (!board) {
        console.error("Game board element not found! Cannot start game.");
        board = document.getElementById("game-board");
        if (!board) {
            console.error("Still cannot find #game-board element!");
            return;
        }
    }
    
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
    board.style.setProperty("--word-length", CURRENT_WORD_LENGTH);
    for (let i = 0; i < MAX_GUESSES * CURRENT_WORD_LENGTH; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    }
    
    console.log(`✓ Game started: word="${currentWord}" (${CURRENT_WORD_LENGTH} letters)`);
    
    // Update adaptive actions for new word
    if (typeof updateAdaptiveActions === 'function') {
        updateAdaptiveActions();
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
    const sel = document.getElementById("pattern-select");
    const pat = sel ? sel.value : "all";

    // Safety check: ensure FOCUS_INFO is loaded
    if (!window.FOCUS_INFO) {
        console.error("FOCUS_INFO not loaded yet");
        return;
    }

    const info = window.FOCUS_INFO[pat] || window.FOCUS_INFO.all || {
        title: "Practice",
        desc: "General Review",
        examples: ""
    };

    // Support both older + newer DOM ids
    const titleEl = document.getElementById("focus-title") || document.getElementById("simple-focus-title");
    const descEl = document.getElementById("focus-desc") || document.getElementById("simple-focus-desc");
    const examplesEl = document.getElementById("focus-examples") || document.getElementById("simple-focus-examples");

    if (titleEl) titleEl.textContent = info.title || "";
    if (descEl) descEl.textContent = info.desc || "";

    if (examplesEl) {
        if (info.examples) {
            examplesEl.textContent = `Try words like: ${info.examples}`;
            examplesEl.classList.remove("hidden");
        } else {
            examplesEl.textContent = "";
            examplesEl.classList.add("hidden");
        }
    }

    // Quick tiles row is optional; never crash if missing
    const quickRow = document.getElementById("quick-tiles-row");
    if (quickRow) {
        if (pat !== "all" && info.quick && Array.isArray(info.quick) && info.quick.length) {
            quickRow.innerHTML = "";
            info.quick.forEach(q => {
                const b = document.createElement("button");
                b.className = "q-tile";
                b.type = "button";
                b.textContent = q;
                b.onclick = () => {
                    for (let c of q) handleInput(c);
                    b.blur();
                };
                quickRow.appendChild(b);
            });
            quickRow.classList.remove("hidden");
        } else {
            quickRow.classList.add("hidden");
            quickRow.innerHTML = "";
        }
    }
}

/* ==========================================
   ADAPTIVE ACTION ROW - Context-aware quick actions
   ========================================== */

function updateAdaptiveActions() {
    // Get current word info
    const word = currentWord;
    const entry = currentEntry;
    
    if (!word || !entry) return;
    
    // Action buttons
    const hearWord = document.getElementById('action-hear-word');
    const hearSentence = document.getElementById('action-hear-sentence');
    const hearSound = document.getElementById('action-hear-sound');
    const mouthPosition = document.getElementById('action-mouth-position');
    
    if (!hearWord) return; // Elements not loaded yet
    
    // Always show "Hear word"
    hearWord.style.display = 'inline-block';
    hearWord.onclick = () => speak(word, 'word');
    
    // Show "Hear sentence" only if sentence exists
    if (entry.sentence && entry.sentence.length > 5) {
        hearSentence.style.display = 'inline-block';
        hearSentence.onclick = () => speak(entry.sentence, 'sentence');
    } else {
        hearSentence.style.display = 'none';
    }
    
    // Show "Hear sound" if we can detect a phoneme pattern
    const firstSound = detectPrimarySound(word);
    if (firstSound) {
        hearSound.style.display = 'inline-block';
        hearSound.onclick = () => {
            // Play sound then word
            speakPhoneme(firstSound);
            setTimeout(() => speak(word, 'word'), 600);
        };
    } else {
        hearSound.style.display = 'none';
    }
    
    // Show "Mouth guide" if we have a matching phoneme
    if (firstSound && canShowMouthPosition(firstSound)) {
        mouthPosition.style.display = 'inline-block';
        mouthPosition.onclick = () => openPhonemeGuideToSound(firstSound);
    } else {
        mouthPosition.style.display = 'none';
    }
    
    // Update voice indicator
    updateVoiceIndicator();
}

function detectPrimarySound(word) {
    if (!word) return null;
    
    // Detect first vowel sound (simplified - can be enhanced)
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    for (let char of word.toLowerCase()) {
        if (vowels.includes(char)) {
            return char;
        }
    }
    return word[0]; // Fallback to first letter
}

function speakPhoneme(sound) {
    // Speak isolated phoneme sound
    if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(sound);
        utterance.rate = 0.7; // Slower for clarity
        speechSynthesis.speak(utterance);
    }
}

function canShowMouthPosition(sound) {
    // Check if we have mouth position data for this sound
    // For now, return true for vowels
    return ['a', 'e', 'i', 'o', 'u'].includes(sound.toLowerCase());
}

function openPhonemeGuideToSound(sound) {
    // Open phoneme modal
    const phonemeModal = document.getElementById('phoneme-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (phonemeModal && modalOverlay) {
        modalOverlay.classList.remove('hidden');
        phonemeModal.classList.remove('hidden');
    try { populatePhonemeGrid && populatePhonemeGrid(); } catch(e) {}
        
        // Scroll to matching card and highlight
        setTimeout(() => {
            const targetCard = document.querySelector(`.phoneme-card[data-sound="${sound}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.classList.add('highlight-flash');
                setTimeout(() => targetCard.classList.remove('highlight-flash'), 2000);
            }
        }, 100);
    }
}

function updateVoiceIndicator() {
    const indicator = document.getElementById('voice-indicator');
    const indicatorText = document.getElementById('voice-indicator-text');
    
    if (!indicator || !indicatorText) return;
    
    // Check if teacher recordings are enabled
    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    
    if (useTeacherVoice && hasAnyRecordings()) {
        indicator.style.display = 'block';
        indicatorText.textContent = '🎤 Using teacher\'s voice';
    } else {
        indicator.style.display = 'none';
    }
}

function hasAnyRecordings() {
    // Check if any recordings exist in IndexedDB
    // Simplified check - can be enhanced
    return localStorage.getItem('hasRecordings') === 'true';
}

function initAdaptiveActions() {
    // Wire up action buttons
    const hearWord = document.getElementById('action-hear-word');
    const hearSentence = document.getElementById('action-hear-sentence');
    const hearSound = document.getElementById('action-hear-sound');
    const mouthPosition = document.getElementById('action-mouth-position');
    
    // Actions are wired up in updateAdaptiveActions()
    // This is just initial setup
    
    console.log('✓ Adaptive actions initialized');
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
                // Add visual feedback
                e.target.classList.add('key-pressed');
                setTimeout(() => e.target.classList.remove('key-pressed'), 150);
                
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
        // Add visual feedback
        e.target.classList.add('key-pressed');
        setTimeout(() => e.target.classList.remove('key-pressed'), 150);
        
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
    
    // Handle both data structures (your multilingual format vs simple format)
    let def, sentence;
    if (currentEntry.en) {
        def = currentEntry.en.def;
        sentence = currentEntry.en.sentence;
    } else {
        def = currentEntry.def;
        sentence = currentEntry.sentence;
    }
    
    document.getElementById("modal-def").textContent = def;
    document.getElementById("modal-sentence").textContent = `"${sentence}"`;
    
    // Set up translation dropdown functionality
    const languageSelect = document.getElementById("language-select");
    const translationDisplay = document.getElementById("translation-display");
    const translatedDef = document.getElementById("translated-def");
    const translatedSentence = document.getElementById("translated-sentence");
    const playTranslatedDef = document.getElementById("play-translated-def");
    const playTranslatedSentence = document.getElementById("play-translated-sentence");
    
    if (languageSelect) {
        languageSelect.value = "en";
        translationDisplay.classList.add("hidden");
        
        languageSelect.onchange = () => {
            const selectedLang = languageSelect.value;
            if (selectedLang === "en") {
                translationDisplay.classList.add("hidden");
            } else {
                const translation = window.TRANSLATIONS.getTranslation(currentWord, selectedLang);
                if (translation && translation.definition) {
                    translatedDef.textContent = translation.definition;
                    translatedSentence.textContent = `"${translation.sentence}"`;
                    
                    // Set up audio buttons for translations
                    if (playTranslatedDef) {
                        playTranslatedDef.onclick = () => playTextInLanguage(translation.definition, selectedLang);
                    }
                    if (playTranslatedSentence) {
                        playTranslatedSentence.onclick = () => playTextInLanguage(translation.sentence, selectedLang);
                    }
                    
                    translationDisplay.classList.remove("hidden");
                } else {
                    translatedDef.textContent = "Translation not available";
                    translatedSentence.textContent = "";
                    translationDisplay.classList.remove("hidden");
                }
            }
        };
    }
    
    // Store that we should show bonus when modal closes (if won)
    if (win) {
        sessionStorage.setItem('showBonusOnClose', 'true');
    }
}

function openTeacherMode() {
    modalOverlay.classList.remove("hidden");
    teacherModal.classList.remove("hidden");
    const inp = document.getElementById("custom-word-input");
    inp.value = "";
    document.getElementById("teacher-error").textContent = "";
    
    // Initialize voice control settings
    initTeacherVoiceControl();
    
    inp.focus();
}

/* ==========================================
   TEACHER VOICE CONTROL SYSTEM
   ========================================== */

function initTeacherVoiceControl() {
    const toggle = document.getElementById('teacher-voice-toggle');
    const clearBtn = document.getElementById('clear-all-recordings');
    const statusText = document.getElementById('recording-count');
    
    if (!toggle) return; // Elements not ready
    
    // Load saved preference (default: true/ON)
    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    toggle.checked = useTeacherVoice;
    
    // Update status display
    updateRecordingStatus();
    
    // Toggle handler
    toggle.onchange = () => {
        const enabled = toggle.checked;
        localStorage.setItem('useTeacherRecordings', enabled.toString());
        updateVoiceIndicator();
        
        if (enabled) {
            showToast('✅ Teacher voice enabled');
        } else {
            showToast('🔊 Using system voice');
        }
    };
    
    // Clear all recordings handler
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm('Delete all your voice recordings? This cannot be undone.')) {
                clearAllTeacherRecordings();
            }
        };
    }
}

function updateRecordingStatus() {
    const statusText = document.getElementById('recording-count');
    const clearBtn = document.getElementById('clear-all-recordings');
    
    if (!statusText || !clearBtn) return;
    
    // Check how many recordings exist
    checkRecordingCount().then(count => {
        if (count > 0) {
            statusText.textContent = `${count} word${count === 1 ? '' : 's'} recorded`;
            clearBtn.disabled = false;
            clearBtn.style.opacity = '1';
            localStorage.setItem('hasRecordings', 'true');
        } else {
            statusText.textContent = 'No recordings yet';
            clearBtn.disabled = true;
            clearBtn.style.opacity = '0.5';
            localStorage.setItem('hasRecordings', 'false');
        }
    });
}

function checkRecordingCount() {
    return new Promise((resolve) => {
        if (!window.audioDB) {
            resolve(0);
            return;
        }
        
        try {
            const transaction = audioDB.transaction(["audio"], "readonly");
            const store = transaction.objectStore("audio");
            const request = store.count();
            
            request.onsuccess = () => resolve(request.result || 0);
            request.onerror = () => resolve(0);
        } catch (e) {
            resolve(0);
        }
    });
}

function clearAllTeacherRecordings() {
    if (!window.audioDB) {
        showToast('❌ No recordings to delete');
        return;
    }
    
    try {
        const transaction = audioDB.transaction(["audio"], "readwrite");
        const store = transaction.objectStore("audio");
        const request = store.clear();
        
        request.onsuccess = () => {
            showToast('✅ All recordings deleted');
            localStorage.setItem('hasRecordings', 'false');
            updateRecordingStatus();
            updateVoiceIndicator();
        };
        
        request.onerror = () => {
            showToast('❌ Error deleting recordings');
        };
    } catch (e) {
        showToast('❌ Error deleting recordings');
    }
}

function updateVoiceIndicator() {
    const indicator = document.getElementById('voice-indicator');
    const indicatorText = document.getElementById('voice-indicator-text');
    
    if (!indicator || !indicatorText) return;
    
    // Check if teacher recordings are enabled and exist
    const useTeacherVoice = localStorage.getItem('useTeacherRecordings') !== 'false';
    const hasRecordings = localStorage.getItem('hasRecordings') === 'true';
    
    if (useTeacherVoice && hasRecordings) {
        indicator.style.display = 'block';
        indicatorText.textContent = '🎤 Using teacher\'s voice';
    } else {
        indicator.style.display = 'none';
    }
}

function handleTeacherSubmit() {
    const val = document.getElementById("custom-word-input").value.trim().toLowerCase();
    if (val.length < 3 || val.length > 10 || !/^[a-z]+$/.test(val)) {
        document.getElementById("teacher-error").textContent = "3-10 letters, no spaces.";
        return;
    }
    
    // Show clear confirmation
    document.getElementById("teacher-error").textContent = "";
    document.getElementById("teacher-error").style.color = "var(--color-correct)";
    document.getElementById("teacher-error").textContent = `✅ Word accepted: "${val.toUpperCase()}" - Game ready!`;
    
    // Briefly pause for confirmation, then start
    setTimeout(() => {
        closeModal();
        showBanner(`✅ Teacher word set: ${val.toUpperCase()}`);
        startNewGame(val);
    }, 800);
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
    const helpModal = document.getElementById("help-modal");
    if (decodableModal) decodableModal.classList.add("hidden");
    if (progressModal) progressModal.classList.add("hidden");
    if (phonemeModal) phonemeModal.classList.add("hidden");
    if (helpModal) helpModal.classList.add("hidden");
    
    if (document.activeElement) document.activeElement.blur();
    document.body.focus();
    
    // Show bonus content if closing word modal after win
    if (wasGameModalOpen && sessionStorage.getItem('showBonusOnClose') === 'true') {
        sessionStorage.removeItem('showBonusOnClose');
        setTimeout(() => showBonusContent(), 500);  // Brief delay after modal closes
    }
    
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
    
    // Help button
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.onclick = openHelpModal;
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
    
    // Phoneme cards are created when the phoneme modal opens.
    
    // Close buttons for new modals
    document.querySelectorAll('.close-decodable, .close-progress, .close-phoneme, .close-help').forEach(btn => {
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
function openHelpModal() {
    modalOverlay.classList.remove('hidden');
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
        helpModal.classList.remove('hidden');
    }
}

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
/* ==========================================
   PHONEME CARD INITIALIZATION WITH MOUTH ANIMATIONS
   ========================================== */


/* ==========================================================================
   ADVANCED ARTICULATION SYSTEM
   Comprehensive phoneme guide with mouth positioning and multiple sounds
   ========================================================================== */

// Current selected sound for detailed view
let currentSelectedSound = null;

function populatePhonemeGrid() {
    console.log("Initializing Advanced Articulation Guide...");
    
    if (!window.PHONEME_DATA || !window.LETTER_SOUNDS) {
        console.error('Phoneme data not loaded!');
        return;
    }
    
    // Setup tab navigation
    initPhonemeTabNavigation();
    
    // Populate all grids
    populateVowelsGrid();
    populateConsonantsGrid(); 
    populateLettersGrid();
    
    // Setup audio controls
    initArticulationAudioControls();

    // Initialize mouth animations now that cards exist
    initPhonemeCards();
    
    console.log("✓ Advanced Articulation Guide ready");
}

function initPhonemeTabNavigation() {
    const tabs = document.querySelectorAll('.phoneme-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.onclick = () => {
            // Update tab appearance
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.color = '#6b7280';
            });
            tab.classList.add('active');
            tab.style.background = 'white';
            tab.style.color = '#374151';
            
            // Show corresponding content
            const targetTab = tab.dataset.tab;
            contents.forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(targetTab + '-content').classList.remove('hidden');
        };
    });
}

function populatePhonemeGroup(gridId, sounds) {
    const grid = document.getElementById(gridId);
    if (!grid) return 0;

    grid.innerHTML = '';
    let count = 0;

    sounds.forEach(sound => {
        const phoneme = window.PHONEME_DATA[sound];
        if (!phoneme) return;
        const card = createPhonemeCard(sound, phoneme);
        grid.appendChild(card);
        count += 1;
    });

    const section = grid.closest('.phoneme-section');
    if (section) {
        section.classList.toggle('hidden', count === 0);
    }

    return count;
}

function populateVowelsGrid() {
    if (window.PHONEME_GROUPS && window.PHONEME_GROUPS.vowels) {
        populatePhonemeGroup('vowels-short-grid', window.PHONEME_GROUPS.vowels.short);
        populatePhonemeGroup('vowels-long-grid', window.PHONEME_GROUPS.vowels.long);
        populatePhonemeGroup('vowels-rcontrolled-grid', window.PHONEME_GROUPS.vowels.rControlled);
        populatePhonemeGroup('vowels-diphthongs-grid', window.PHONEME_GROUPS.vowels.diphthongs);
        populatePhonemeGroup('vowels-welded-grid', window.PHONEME_GROUPS.vowels.welded);
        populatePhonemeGroup('vowels-schwa-grid', window.PHONEME_GROUPS.vowels.schwa);
        return;
    }

    const grid = document.getElementById('vowels-grid');
    if (!grid) return;

    const vowels = window.PHONEME_CATEGORIES.vowels.filter(v => window.PHONEME_DATA[v]);
    grid.innerHTML = '';

    vowels.forEach(sound => {
        const phoneme = window.PHONEME_DATA[sound];
        const card = createPhonemeCard(sound, phoneme);
        grid.appendChild(card);
    });
}

function populateConsonantsGrid() {
    if (window.PHONEME_GROUPS && window.PHONEME_GROUPS.consonants) {
        populatePhonemeGroup('consonants-single-grid', window.PHONEME_GROUPS.consonants.single);
        populatePhonemeGroup('consonants-digraphs-grid', window.PHONEME_GROUPS.consonants.digraphs);
        populatePhonemeGroup('consonants-blends-grid', window.PHONEME_GROUPS.consonants.blends);
        return;
    }

    const grid = document.getElementById('consonants-grid');
    if (!grid) return;

    const consonants = window.PHONEME_CATEGORIES.consonants.filter(c => window.PHONEME_DATA[c]);
    grid.innerHTML = '';

    consonants.forEach(sound => {
        const phoneme = window.PHONEME_DATA[sound];
        const card = createPhonemeCard(sound, phoneme);
        grid.appendChild(card);
    });
}

function populateLettersGrid() {
    const grid = document.getElementById('letters-grid');
    if (!grid) return;
    
    const letters = Object.keys(window.LETTER_SOUNDS);
    grid.innerHTML = '';
    
    letters.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.style.cssText = `
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 700;
            font-size: 2rem;
        `;
        
        card.textContent = letter.toUpperCase();
        card.onclick = () => showLetterSounds(letter);
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
        
        grid.appendChild(card);
    });
}

function getMouthClass(phoneme) {
    return phoneme?.animation || 'mouth-neutral';
}

function createPhonemeCard(sound, phoneme) {
    const card = document.createElement('div');
    card.className = 'phoneme-card';
    card.dataset.sound = sound;
    card.dataset.example = phoneme.example || '';
    card.style.cssText = `
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    `;
    
    const displayText = (phoneme.grapheme || sound).toUpperCase();
    const mouthClass = getMouthClass(phoneme);
    
    card.innerHTML = `
        <div class="phoneme-letter">${displayText}</div>
        <div class="mini-mouth"><div class="mouth ${mouthClass}"></div></div>
        <div class="phoneme-example">${phoneme.example || ''}</div>
        <div class="phoneme-ipa">${phoneme.sound || ''}</div>
    `;
    
    card.onclick = () => selectSound(sound, phoneme);
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = phoneme.color || '#3b82f6';
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = '#e5e7eb';
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
    
    return card;
}

function selectSound(sound, phoneme) {
    currentSelectedSound = { sound, phoneme };
    
    // Show detailed view
    const display = document.getElementById('selected-sound-display');
    display.classList.remove('hidden');
    
    // Populate detailed information
    document.getElementById('sound-letter').textContent = (phoneme.grapheme || sound).toUpperCase();
    document.getElementById('sound-name').textContent = phoneme.name || '';
    document.getElementById('mouth-cue').textContent = phoneme.cue || '';
    document.getElementById('mouth-description').textContent = phoneme.description || '';
    
    // Update mouth visual
    const mouthVisual = document.getElementById('mouth-visual');
    if (mouthVisual) {
        const mouthClass = getMouthClass(phoneme);
        mouthVisual.innerHTML = `<div class="mouth ${mouthClass}"></div>`;
    }
    
    // Scroll to top
    display.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showLetterSounds(letter) {
    const sounds = window.LETTER_SOUNDS[letter];
    if (!sounds) return;
    
    document.getElementById('selected-letter').textContent = letter.toUpperCase();
    
    const grid = document.getElementById('letter-sounds-grid');
    grid.innerHTML = '';
    
    sounds.forEach(soundInfo => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 2rem; font-weight: 700;">${letter.toUpperCase()}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #374151;">${soundInfo.name}</div>
                    <div style="font-size: 0.9rem; color: #6b7280;">Example: ${soundInfo.example}</div>
                </div>
                <button style="padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 0.85rem;">Play</button>
            </div>
        `;
        
        card.onclick = () => {
            if (window.PHONEME_DATA[soundInfo.phoneme]) {
                selectSound(soundInfo.phoneme, window.PHONEME_DATA[soundInfo.phoneme]);
            }
        };
        
        // Find and setup the play button
        const playBtn = card.querySelector('button');
        playBtn.onclick = (e) => {
            e.stopPropagation();
            playLetterSequence(letter, soundInfo.example, soundInfo.phoneme);
        };
        
        grid.appendChild(card);
    });
    
    document.getElementById('letter-sounds-display').classList.remove('hidden');
    document.getElementById('letter-sounds-display').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initArticulationAudioControls() {
    const hearLetterBtn = document.getElementById('hear-letter-name');
    const hearWordBtn = document.getElementById('hear-example-word');
    const hearSoundBtn = document.getElementById('hear-phoneme-sound');
    
    if (hearLetterBtn) {
        hearLetterBtn.onclick = () => {
            if (currentSelectedSound) {
                const grapheme = currentSelectedSound.phoneme.grapheme || currentSelectedSound.sound;
                speakSpelling(grapheme);
            }
        };
    }
    
    if (hearWordBtn) {
        hearWordBtn.onclick = () => {
            if (currentSelectedSound) {
                speakText(currentSelectedSound.phoneme.example || '');
            }
        };
    }
    
    if (hearSoundBtn) {
        hearSoundBtn.onclick = () => {
            if (currentSelectedSound) {
                speakPhonemeSound(currentSelectedSound.phoneme);
            }
        };
    }
}

function playLetterSequence(letter, word, phoneme) {
    // Play: spelling → example word → sound cue
    speakSpelling(letter);

    setTimeout(() => {
        speakText(word);
    }, 900);

    setTimeout(() => {
        const phonemeData = window.getPhonemeData ? window.getPhonemeData(phoneme) : null;
        speakPhonemeSound(phonemeData);
    }, 1800);
}

function speakText(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

function speakSpelling(grapheme) {
    if (!grapheme) return;
    const letters = grapheme
        .toString()
        .toUpperCase()
        .split('')
        .join(' ');
    speakText(letters);
}

function getPhonemeTts(phoneme) {
    if (!phoneme) return '';
    if (phoneme.tts) return phoneme.tts;
    if (phoneme.name && phoneme.example) return `${phoneme.name}, as in ${phoneme.example}`;
    if (phoneme.example) return phoneme.example;
    return phoneme.sound || '';
}

function speakPhonemeSound(phoneme) {
    const tts = getPhonemeTts(phoneme);
    if (!tts) return;
    speakText(tts);
}

function initPhonemeCards() {
    const cards = document.querySelectorAll('.phoneme-card');

    let initialized = 0;
    cards.forEach(card => {
        if (card.dataset.mouthInit === 'true') return;
        card.dataset.mouthInit = 'true';
        initialized += 1;

        card.addEventListener('click', () => {
            const sound = card.dataset.sound;
            if (!sound) return;

            const phonemeData = window.getPhonemeData ? window.getPhonemeData(sound) : null;
            showPhonemeMouth(sound, phonemeData);
        });
    });

    if (initialized > 0) {
        console.log('✓ Initialized', initialized, 'phoneme cards with mouth animations');
    }
}

function showPhonemeMouth(sound, phonemeData) {
    // Create or get mouth display container
    let mouthDisplay = document.getElementById('phoneme-mouth-display');
    
    if (!mouthDisplay) {
        mouthDisplay = document.createElement('div');
        mouthDisplay.id = 'phoneme-mouth-display';
        mouthDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            text-align: center;
        `;
        document.body.appendChild(mouthDisplay);
    }
    
    // Build content
    const animation = phonemeData ? getMouthClass(phonemeData) : 'mouth-neutral';
    const cue = phonemeData ? phonemeData.cue : 'Watch the mouth';
    const description = phonemeData ? phonemeData.description : '';
    
    mouthDisplay.innerHTML = `
        <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 10px; color: #2c3e50;">
            ${sound.toUpperCase()} Sound
        </div>
        
        <div class="mouth-container">
            <div class="mouth ${animation}"></div>
        </div>
        
        ${phonemeData ? `
            <div class="phoneme-articulation">
                <div class="phoneme-cue">${cue}</div>
                <div class="phoneme-description">${description}</div>
                
                <div style="margin-top: 12px; font-size: 0.8rem; color: #888;">
                    <div>Tongue: ${phonemeData.tongue}</div>
                    <div>Lips: ${phonemeData.lips}</div>
                </div>
            </div>
        ` : ''}
        
        <button onclick="document.getElementById('phoneme-mouth-display').style.display='none'" 
                style="margin-top: 20px; padding: 10px 24px; background: var(--color-correct); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Got it!
        </button>
    `;
    
    mouthDisplay.style.display = 'block';
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (mouthDisplay) mouthDisplay.style.display = 'none';
    }, 8000);
}

function openPhonemeGuide() {
    modalOverlay.classList.remove('hidden');
    const phonemeModal = document.getElementById('phoneme-modal');
    if (!phonemeModal) {
        console.error("phoneme-modal element not found!");
        return;
    }
    phonemeModal.classList.remove('hidden');
    
    // Force populate the grid
    console.log("Opening Sounds Guide - populating phoneme grid...");
    try {
        if (typeof populatePhonemeGrid === 'function') {
            populatePhonemeGrid();
        } else {
            console.error("populatePhonemeGrid function not found!");
        }
    } catch(e) {
        console.error("Error populating phoneme grid:", e);
    }
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
                toggleBtn.textContent = '▼ Hide';
            } else {
                focusPanel.classList.add('hidden');
                toggleBtn.classList.remove('expanded');
                toggleBtn.textContent = '💡 Hints';
            }
        };
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initTutorial();
    initFocusToggle();
    
    // Populate phoneme grid when modal opens
    const phonemeBtn = document.getElementById('phoneme-btn');
    if (phonemeBtn) {
        phonemeBtn.addEventListener('click', () => {
            setTimeout(() => populatePhonemeGrid(), 100);
        });
    }
});
