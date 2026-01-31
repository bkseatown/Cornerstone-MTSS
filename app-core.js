(function() {
  // State
  let state = {
    word: "",
    wordEntry: null,
    guesses: [],
    currentGuess: "",
    maxGuesses: 6,
    gameOver: false
  };

  // Audio
  let voices = [];
  let selectedVoice = null;
  let voiceEnabled = true;
  let voiceWarmedUp = false;

  // Performance cache
  let wordCache = new Map();

  // Initialize
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    if (!window.WORD_ENTRIES) {
      alert("Word data not loaded!");
      return;
    }

    initVoiceSystem();
    setupControls();
    setupKeyboard();

    buildFocusOptions();
    buildLengthOptions();
    buildGradeOptions();
    buildLanguageOptions();

    // Focus card + smart length behavior
    updateFocusCard();
    rebuildLengthOptionsForFocus();

    setupModalAccessibility();
    startNewGame();
  }

  // ========================================
  // 1. VOICE WARM-UP (Magic First 10 Seconds)
  // ========================================
  
  function initVoiceSystem() {
    function loadAndWarm() {
      voices = speechSynthesis.getVoices();
      if (voices.length === 0) return;
      
      // Sort: Premium English first
      voices.sort((a,b) => {
        const aPremium = a.name.includes("Google") || a.name.includes("Premium") || a.name.includes("Enhanced");
        const bPremium = b.name.includes("Google") || b.name.includes("Premium") || b.name.includes("Enhanced");
        if (aPremium && !bPremium) return -1;
        if (!aPremium && bPremium) return 1;
        if (a.lang.startsWith("en") && !b.lang.startsWith("en")) return -1;
        if (!a.lang.startsWith("en") && b.lang.startsWith("en")) return 1;
        return a.name.localeCompare(b.name);
      });
      
      selectedVoice = voices.find(v => v.lang.startsWith("en") && 
        (v.name.includes("Google") || v.name.includes("Premium"))) || voices[0];
      
      // WARM-UP: Silent utterance to initialize engine
      if (selectedVoice && !voiceWarmedUp) {
        const warmup = new SpeechSynthesisUtterance(" ");
        warmup.voice = selectedVoice;
        warmup.volume = 0.01;
        warmup.rate = 2;
        speechSynthesis.speak(warmup);
        voiceWarmedUp = true;
      }
    }
    
    loadAndWarm();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadAndWarm;
    }
  }

  function speak(text) {
    if (!text || !voiceEnabled) return;
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    if (selectedVoice) msg.voice = selectedVoice;
    msg.rate = 0.9;
    msg.pitch = 1.0;
    speechSynthesis.speak(msg);
  }

  // ========================================
  // 3. PROJECTOR MODE
  // ========================================

  function setupControls() {
    const helpBtn = document.getElementById("help-btn");
    const hearWord = document.getElementById("hear-word");
    const hearSentence = document.getElementById("hear-sentence");
    const voiceToggle = document.getElementById("voice-toggle");

    const projectorToggle = document.getElementById("projector-toggle");
    const contrastToggle = document.getElementById("contrast-toggle");
    const calmToggle = document.getElementById("calm-toggle");

    const setTeacherWord = document.getElementById("set-teacher-word");

    const focusSelect = document.getElementById("focus-select");
    const lengthSelect = document.getElementById("length-select");
    const gradeSelect = document.getElementById("grade-select");
    const langSelect = document.getElementById("lang-select");

    if (helpBtn) helpBtn.onclick = showHelp;

    if (hearWord) hearWord.onclick = () => speak(state.word);

    if (hearSentence) hearSentence.onclick = () => {
      if (state.wordEntry?.sentence) speak(state.wordEntry.sentence);
    };

    if (voiceToggle) {
      voiceToggle.onclick = () => {
        voiceEnabled = !voiceEnabled;
        voiceToggle.textContent = voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off";
        voiceToggle.classList.toggle("off", !voiceEnabled);
        localStorage.setItem("decode_voice_enabled", voiceEnabled ? "1" : "0");
      };

      // restore
      const saved = localStorage.getItem("decode_voice_enabled");
      if (saved === "0") {
        voiceEnabled = false;
        voiceToggle.textContent = "🔇 Voice Off";
        voiceToggle.classList.add("off");
      }
    }

    // Projector mode toggle
    if (projectorToggle) {
      let isProjector = document.body.classList.contains("projector-mode");
      projectorToggle.textContent = isProjector ? "📺 Exit Projector" : "📽️ Projector Mode";

      projectorToggle.onclick = () => {
        isProjector = !isProjector;
        document.body.classList.toggle("projector-mode", isProjector);
        projectorToggle.textContent = isProjector ? "📺 Exit Projector" : "📽️ Projector Mode";
        localStorage.setItem("decode_projector", isProjector ? "1" : "0");
        showToast(isProjector ? "Projector mode activated" : "Normal mode");
      };

      // restore
      if (localStorage.getItem("decode_projector") === "1") {
        document.body.classList.add("projector-mode");
        projectorToggle.textContent = "📺 Exit Projector";
      }
    }

    // High contrast
    if (contrastToggle) {
      const apply = (on) => {
        document.body.classList.toggle("high-contrast", on);
        contrastToggle.textContent = on ? "🌓 Contrast: On" : "🌓 Contrast: Off";
        localStorage.setItem("decode_contrast", on ? "1" : "0");
      };
      apply(localStorage.getItem("decode_contrast") === "1");
      contrastToggle.onclick = () => apply(!document.body.classList.contains("high-contrast"));
    }

    // Calm / low-stim
    if (calmToggle) {
      const apply = (on) => {
        document.body.classList.toggle("calm-mode", on);
        calmToggle.textContent = on ? "🌿 Calm: On" : "🌿 Calm: Off";
        localStorage.setItem("decode_calm", on ? "1" : "0");
      };
      apply(localStorage.getItem("decode_calm") === "1");
      calmToggle.onclick = () => apply(!document.body.classList.contains("calm-mode"));
    }

    // Teacher word setter (teacher tools remain hidden by UI)
    if (setTeacherWord) {
      setTeacherWord.onclick = () => {
        const input = document.getElementById("teacher-word");
        const word = input?.value.trim().toLowerCase() || "";
        if (word.length >= 2 && word.length <= 10 && /^[a-z]+$/.test(word)) {
          setCustomWord(word);
          if (input) input.value = "";
          showToast("Word set ✓", "success");
        } else {
          showToast("Enter 2–10 letters only", "error");
        }
      };
    }

    // Focus → update focus card and smart lengths
    if (focusSelect) {
      focusSelect.onchange = () => {
        localStorage.setItem("decode_focus", focusSelect.value);
        wordCache.clear();
        updateFocusCard();
        rebuildLengthOptionsForFocus();
        startNewGame();
      };

      // restore focus
      const saved = localStorage.getItem("decode_focus");
      if (saved && [...focusSelect.options].some(o => o.value === saved)) {
        focusSelect.value = saved;
      }
    }

    if (lengthSelect) {
      lengthSelect.onchange = () => {
        localStorage.setItem("decode_length", lengthSelect.value);
        wordCache.clear();
        startNewGame();
      };

      // restore length
      const saved = localStorage.getItem("decode_length");
      if (saved && [...lengthSelect.options].some(o => o.value === saved)) {
        lengthSelect.value = saved;
      }
    }

    if (gradeSelect) {
      gradeSelect.onchange = () => {
        localStorage.setItem("decode_grade_band", gradeSelect.value);
        wordCache.clear();
        startNewGame();
      };
    }

    if (langSelect) {
      langSelect.onchange = () => {
        localStorage.setItem("decode_lang", langSelect.value);
        // If end modal is open, refresh translation immediately
        if (!document.getElementById("end-modal")?.classList.contains("hidden")) {
          applyTranslationToEndModal(state.word, state.wordEntry);
        }
      };
    }

    window.addEventListener("keydown", handleKeyPress);

    document.querySelectorAll("[data-close]").forEach(btn => {
      btn.onclick = () => closeModal(btn.dataset.close);
    });
  }
  
  function setupModalAccessibility() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const openModal = document.querySelector(".modal.open");
        if (openModal) {
          const modalId = openModal.id.replace("-modal", "");
          closeModal(modalId);
        }
      }
    });
  }

  function buildFocusOptions() {
    const select = document.getElementById("focus-select");
    if (!select || !window.FOCUS_INFO) return;
    
    Object.entries(window.FOCUS_INFO).forEach(([key, info]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = info.title;
      select.appendChild(option);
    });
    select.value = "all";
  }

  function buildLengthOptions() {
    const select = document.getElementById("length-select");
    if (!select) return;
    
    const lengths = [
      { value: "any", label: "Any" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7+" }
    ];
    
    lengths.forEach(({value, label}) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
    select.value = "5";
  }

  // ========================================
  // 7. PERFORMANCE CACHING
  // ========================================
  
  function startNewGame() {
    const focus = document.getElementById("focus-select")?.value || "all";
    const lengthSel = document.getElementById("length-select")?.value || "any";
    const gradeBand = getGradeBand();
    const cacheKey = `${focus}-${lengthSel}-${gradeBand}`;

    let candidates = wordCache.get(cacheKey);

    if (!candidates) {
      candidates = Object.entries(window.WORD_ENTRIES).filter(([word, entry]) => {
        if (!entry) return false;

        // Focus match: prefer entry.focus array; fall back to tags (supports both "cvc" and "focus:cvc")
        if (focus !== "all") {
          const focusArr = Array.isArray(entry.focus) ? entry.focus : [];
          const tagArr = Array.isArray(entry.tags) ? entry.tags : [];
          const hit = focusArr.includes(focus) || tagArr.includes(focus) || tagArr.includes(`focus:${focus}`) || tagArr.includes(`pattern:${focus}`);
          if (!hit) return false;
        }

        // Grade band (explicit tags if present; otherwise gentle heuristic)
        if (gradeBand !== "all") {
          const tagArr = Array.isArray(entry.tags) ? entry.tags : [];
          const explicit = tagArr.find(t => typeof t === "string" && t.startsWith("grade:"));
          if (explicit) {
            if (explicit !== `grade:${gradeBand}`) return false;
          } else {
            // Heuristic fallback
            const len = word.length;
            const focusArr = Array.isArray(entry.focus) ? entry.focus : [];
            const f = focusArr[0] || "";

            const isMulti = f === "multisyllable" || tagArr.includes("multisyllable");
            const isMorph = f === "morphology" || tagArr.some(t => typeof t === "string" && (t.includes("prefix") || t.includes("suffix") || t.includes("morph")));
            if (gradeBand === "k-2") {
              if (len > 5) return false;
              if (isMulti || isMorph) return false;
            } else if (gradeBand === "3-5") {
              if (len < 4) return false;
              if (len > 8) return false;
            } else if (gradeBand === "6-8") {
              if (len < 5) return false;
            } else if (gradeBand === "9-12") {
              if (len < 6) return false;
            }
          }
        }

        // Length match
        if (lengthSel === "any") return true;
        const len = parseInt(lengthSel);
        if (len === 7) return word.length >= 7;
        return word.length === len;
      });

      wordCache.set(cacheKey, candidates);
    }

    if (candidates.length === 0) {
      showToast("No words for this selection", "error");
      return;
    }

    const [word, entry] = candidates[Math.floor(Math.random() * candidates.length)];
    startGame(word, entry);
  }

  function getFocusInfo(focusKey) {
    return (window.FOCUS_INFO && window.FOCUS_INFO[focusKey]) ? window.FOCUS_INFO[focusKey] : (window.FOCUS_INFO?.all || null);
  }

  function updateFocusCard() {
    const focusKey = document.getElementById("focus-select")?.value || "all";
    const info = getFocusInfo(focusKey);

    const titleEl = document.getElementById("focus-title");
    const descEl = document.getElementById("focus-desc");
    const hintEl = document.getElementById("focus-hint");
    const exWrap = document.getElementById("focus-examples-wrap");

    if (!info) return;

    if (titleEl) titleEl.textContent = info.title || "Focus";
    if (descEl) descEl.textContent = info.desc || "";
    if (hintEl) hintEl.textContent = info.hint || "";

    // Kid-friendly examples as chips (no "Ex:" prefix)
    if (exWrap) {
      exWrap.innerHTML = "";
      const raw = (info.examples || "").trim();
      if (raw) {
        raw.split(",").map(s => s.trim()).filter(Boolean).slice(0, 8).forEach(w => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "example-chip";
          chip.textContent = w;
          chip.onclick = () => speak(w);
          exWrap.appendChild(chip);
        });
      }
    }
  }

  function rebuildLengthOptionsForFocus() {
    const focusKey = document.getElementById("focus-select")?.value || "all";
    const info = getFocusInfo(focusKey);
    const select = document.getElementById("length-select");
    if (!select) return;

    // Preserve existing selection if still allowed
    const currentVal = select.value || "any";

    // Allowed lengths: use focus info if present, otherwise fall back to default list.
    const defaultList = [
      { value: "any", label: "Any" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7+" }
    ];

    let allowed = null;
    if (info && Array.isArray(info.allowedLengths) && info.allowedLengths.length) {
      allowed = info.allowedLengths.slice();
    } else if (info && typeof info.defaultLength === "number") {
      allowed = [info.defaultLength];
    }

    // Build options
    select.innerHTML = "";
    // Always allow "Any" so teachers can override
    const anyOpt = document.createElement("option");
    anyOpt.value = "any";
    anyOpt.textContent = "Any";
    select.appendChild(anyOpt);

    if (allowed) {
      allowed.forEach(n => {
        const opt = document.createElement("option");
        opt.value = String(n);
        opt.textContent = String(n);
        select.appendChild(opt);
      });
    } else {
      defaultList.slice(1).forEach(({value,label}) => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        select.appendChild(opt);
      });
    }

    // Auto-switch to default length for this focus (unless user is on "Any")
    if (info && typeof info.defaultLength === "number") {
      select.value = String(info.defaultLength);
    } else {
      // restore if possible
      const exists = [...select.options].some(o => o.value === currentVal);
      select.value = exists ? currentVal : "any";
    }
  }

  // ========================================
  // 5. GRADE BAND FILTER (SAFE DEFAULT)
  // ========================================

  function buildGradeOptions() {
    const select = document.getElementById("grade-select");
    if (!select) return;

    const options = [
      { value: "all", label: "All" },
      { value: "k-2", label: "K–2" },
      { value: "3-5", label: "3–5" },
      { value: "6-8", label: "6–8" },
      { value: "9-12", label: "9–12" }
    ];

    select.innerHTML = "";
    options.forEach(({value,label}) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    });

    // Persist
    const saved = localStorage.getItem("decode_grade_band");
    if (saved && options.some(o => o.value === saved)) select.value = saved;
  }

  function getGradeBand() {
    const sel = document.getElementById("grade-select");
    return sel ? (sel.value || "all") : "all";
  }

  function wordMatchesGradeBand(entry, band) {
    if (!entry || band === "all") return true;

    // If dataset has explicit grade tags, honor them (best path).
    const tags = entry.tags || [];
    const explicit = tags.find(t => typeof t === "string" && t.startsWith("grade:"));
    if (explicit) {
      return explicit === `grade:${band}`;
    }

    // Heuristic fallback (won't block too hard): keep most words visible.
    // Goal: younger = shorter + simpler focuses.
    const focusArr = entry.focus || [];
    const focus = focusArr[0] || "";
    const len = (entry.wordLength || 0);

    // We'll infer length from word itself later; this is just a placeholder.
    // When called from filter, we pass word separately.
    return true;
  }

  // ========================================
  // 6. TRANSLATION UI (uses translations.js if present)
  // ========================================

  function buildLanguageOptions() {
    const select = document.getElementById("lang-select");
    if (!select || !window.getSupportedLanguages || !window.getLanguageInfo) return;

    const langs = window.getSupportedLanguages();
    select.innerHTML = "";

    // Default: English (no translation)
    const opt0 = document.createElement("option");
    opt0.value = "en";
    opt0.textContent = "English";
    select.appendChild(opt0);

    langs.forEach(code => {
      const info = window.getLanguageInfo(code);
      if (!info) return;
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = `${info.flag || ""} ${info.native || info.name || code}`.trim();
      select.appendChild(opt);
    });

    const saved = localStorage.getItem("decode_lang");
    if (saved && [...select.options].some(o => o.value === saved)) select.value = saved;
  }

  function getSelectedLang() {
    const sel = document.getElementById("lang-select");
    return sel ? (sel.value || "en") : "en";
  }

  function applyTranslationToEndModal(word, entry) {
    const wrap = document.getElementById("end-translation-wrap");
    const tWord = document.getElementById("end-translation-word");
    const tDef = document.getElementById("end-translation-def");
    const tSent = document.getElementById("end-translation-sentence");
    const tSpeak = document.getElementById("end-translation-speak");

    if (!wrap) return;

    const lang = getSelectedLang();
    if (!lang || lang === "en" || !window.getTranslation) {
      wrap.classList.add("hidden");
      return;
    }

    const tr = window.getTranslation(word, lang);
    if (!tr) {
      wrap.classList.remove("hidden");
      if (tWord) tWord.textContent = "No translation yet";
      if (tDef) tDef.textContent = "";
      if (tSent) tSent.textContent = "";
      if (tSpeak) tSpeak.disabled = true;
      return;
    }

    wrap.classList.remove("hidden");
    if (tWord) tWord.textContent = tr.word || "";
    if (tDef) tDef.textContent = tr.def || "";
    if (tSent) tSent.textContent = tr.sentence ? `“${tr.sentence}”` : "";
    if (tSpeak) {
      tSpeak.disabled = false;
      tSpeak.onclick = () => window.speakTranslation ? window.speakTranslation(tr.word || tr.sentence || "", lang) : null;
    }
  }



  function setCustomWord(word) {
    const entry = window.WORD_ENTRIES[word] || {
      def: "Custom word for practice",
      sentence: `Spell the word: ${word}`,
      tags: ["all"]
    };
    startGame(word, entry);
  }

  function startGame(word, entry) {
    state.word = word.toLowerCase();
    state.wordEntry = entry;
    state.guesses = [];
    state.currentGuess = "";
    state.gameOver = false;
    
    buildBoard();
    resetKeyboard();
  }

  function buildBoard() {
    const board = document.getElementById("game-board");
    if (!board) return;
    
    board.innerHTML = "";
    board.style.setProperty("--word-length", state.word.length);
    
    const guessSelect = document.getElementById("guess-select");
    const maxGuesses = guessSelect ? parseInt(guessSelect.value) : 6;
    state.maxGuesses = maxGuesses;
    
    for (let i = 0; i < maxGuesses; i++) {
      const row = document.createElement("div");
      row.className = "row";
      for (let j = 0; j < state.word.length; j++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        row.appendChild(tile);
      }
      board.appendChild(row);
    }
  }

  // ========================================
  // 4. KEYBOARD WITH BETTER HIT TARGETS
  // ========================================
  
  function setupKeyboard() {
    const keyboard = document.getElementById("keyboard");
    if (!keyboard) return;
    
    const rows = [
      ["q","w","e","r","t","y","u","i","o","p"],
      ["a","s","d","f","g","h","j","k","l"],
      ["Enter","z","x","c","v","b","n","m","⌫"]
    ];
    
    rows.forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "kb-row";
      row.forEach(key => {
        const btn = document.createElement("button");
        btn.className = "key";
        if (key === "Enter") btn.classList.add("key-wide");
        if (key === "⌫") btn.classList.add("key-wide");
        btn.textContent = key.toUpperCase();
        btn.onclick = () => handleKey(key);
        btn.setAttribute("aria-label", key === "⌫" ? "Delete" : key);
        rowDiv.appendChild(btn);
      });
      keyboard.appendChild(rowDiv);
    });
  }

  function handleKeyPress(e) {
    if (state.gameOver) return;
    if (document.querySelector(".modal.open")) return;
    
    if (e.key === "Enter") submitGuess();
    else if (e.key === "Backspace") deleteLetter();
    else if (/^[a-z]$/i.test(e.key)) addLetter(e.key.toLowerCase());
  }

  function handleKey(key) {
    if (state.gameOver) return;
    if (key === "Enter") submitGuess();
    else if (key === "⌫") deleteLetter();
    else addLetter(key.toLowerCase());
  }

  // ========================================
  // 4. MICRO-ANIMATIONS (Pop-in, Shake)
  // ========================================
  
  function addLetter(letter) {
    if (state.currentGuess.length >= state.word.length) return;
    state.currentGuess += letter;
    updateCurrentRow();
  }

  function deleteLetter() {
    if (state.currentGuess.length === 0) return;
    state.currentGuess = state.currentGuess.slice(0, -1);
    updateCurrentRow();
  }

  function updateCurrentRow() {
    const rows = document.querySelectorAll(".row");
    const currentRow = rows[state.guesses.length];
    if (!currentRow) return;
    
    const tiles = currentRow.querySelectorAll(".tile");
    tiles.forEach((tile, i) => {
      if (i < state.currentGuess.length) {
        if (!tile.textContent) {
          tile.classList.add("pop-in");
          setTimeout(() => tile.classList.remove("pop-in"), 100);
        }
        tile.textContent = state.currentGuess[i].toUpperCase();
        tile.classList.add("filled");
      } else {
        tile.textContent = "";
        tile.classList.remove("filled");
      }
    });
  }

  function submitGuess() {
    if (state.currentGuess.length !== state.word.length) {
      const rows = document.querySelectorAll(".row");
      const currentRow = rows[state.guesses.length];
      if (currentRow) {
        currentRow.classList.add("shake");
        setTimeout(() => currentRow.classList.remove("shake"), 500);
      }
      showToast("Not enough letters", "error");
      return;
    }
    
    const guess = state.currentGuess;
    state.guesses.push(guess);
    
    colorTiles(guess);
    updateKeyboard(guess);
    
    if (guess === state.word) {
      state.gameOver = true;
      setTimeout(() => showEndModal(true), 800);
    } else if (state.guesses.length >= state.maxGuesses) {
      state.gameOver = true;
      setTimeout(() => showEndModal(false), 800);
    }
    
    state.currentGuess = "";
  }

  function colorTiles(guess) {
    const row = document.querySelectorAll(".row")[state.guesses.length - 1];
    const tiles = row.querySelectorAll(".tile");
    
    const letterCount = {};
    for (let char of state.word) {
      letterCount[char] = (letterCount[char] || 0) + 1;
    }
    
    // First pass: mark correct
    tiles.forEach((tile, i) => {
      if (guess[i] === state.word[i]) {
        setTimeout(() => {
          tile.classList.add("flip", "correct");
        }, i * 100);
        letterCount[guess[i]]--;
      }
    });
    
    // Second pass: mark present/absent
    tiles.forEach((tile, i) => {
      if (guess[i] !== state.word[i]) {
        setTimeout(() => {
          tile.classList.add("flip");
          if (state.word.includes(guess[i]) && letterCount[guess[i]] > 0) {
            tile.classList.add("present");
            letterCount[guess[i]]--;
          } else {
            tile.classList.add("absent");
          }
        }, i * 100);
      }
    });
  }

  function updateKeyboard(guess) {
    guess.split("").forEach((letter, i) => {
      const keys = document.querySelectorAll(".key");
      const key = Array.from(keys).find(k => k.textContent.toLowerCase() === letter);
      if (!key) return;
      
      if (state.word[i] === letter) {
        key.classList.remove("present", "absent");
        key.classList.add("correct");
      } else if (state.word.includes(letter) && !key.classList.contains("correct")) {
        key.classList.remove("absent");
        key.classList.add("present");
      } else if (!key.classList.contains("correct") && !key.classList.contains("present")) {
        key.classList.add("absent");
      }
    });
  }

  function resetKeyboard() {
    document.querySelectorAll(".key").forEach(key => {
      key.classList.remove("correct", "present", "absent");
    });
  }

  function showEndModal(won) {
    const modal = document.getElementById("end-modal");
    const wordEl = document.getElementById("end-word");
    const defEl = document.getElementById("end-definition");
    const sentEl = document.getElementById("end-sentence");
    const enrichEl = document.getElementById("end-enrichment");
    const funEl = document.getElementById("end-fun-entry");
    const titleEl = document.getElementById("end-title");
    const sylEl = document.getElementById("end-syllables");

    const entry = state.wordEntry || {};
    const defText = (entry.def || entry.definition || "").trim();
    const sentText = (entry.sentence || "").trim();

    // Syllables may be: syllableText (string), syllables (array), or syllables (string)
    let sylText = "";
    if (typeof entry.syllableText === "string" && entry.syllableText.trim()) {
      sylText = entry.syllableText.trim();
    } else if (Array.isArray(entry.syllables) && entry.syllables.length) {
      sylText = entry.syllables.join("-");
    } else if (typeof entry.syllables === "string" && entry.syllables.trim()) {
      sylText = entry.syllables.trim();
    }

    if (titleEl) titleEl.textContent = won ? "🎉 Great Job!" : "Nice Try!";
    if (wordEl) wordEl.textContent = (state.word || "").toUpperCase();
    if (sylEl) sylEl.textContent = sylText ? sylText.replace(/-/g, " • ") : "";
    if (defEl) defEl.textContent = defText || "";
    if (sentEl) sentEl.textContent = sentText ? `“${sentText}”` : "";

    if (enrichEl) {
      enrichEl.textContent = (entry.enrichment || "").trim();
    }

    if (funEl && window.BONUS_BANK) {
      const bonus = getRandomBonus();
      if (bonus) funEl.textContent = bonus;
    }

    // Apply translation (if translations.js present and a language is selected)
    applyTranslationToEndModal(state.word, entry);

    const moreBtn = document.getElementById("end-more");
    const moreWrap = document.getElementById("end-more-wrap");
    if (moreBtn && moreWrap) {
      moreBtn.onclick = () => {
        moreWrap.style.display = "block";
        moreBtn.style.display = "none";
      };
      moreWrap.style.display = "none";
      moreBtn.style.display = "block";
    }

    if (modal) {
      modal.classList.add("open");
      trapFocus(modal);
    }

    setTimeout(() => {
      if (voiceEnabled) {
        const spoken = sentText ? `The word is ${state.word}. ${sentText}` : `The word is ${state.word}.`;
        speak(spoken);
      }
    }, 200);
  }

  function getRandomBonus() {
    if (!window.BONUS_BANK) return "";
    const { facts, jokes } = window.BONUS_BANK;
    
    const useJoke = Math.random() < 0.3;
    if (useJoke && jokes && jokes.length > 0) {
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return `${joke.q} ${joke.a}`;
    }
    
    if (facts && facts.length > 0) {
      return facts[Math.floor(Math.random() * facts.length)];
    }
    
    return "";
  }

  function showHelp() {
    const modal = document.getElementById("howto-modal");
    const textEl = document.getElementById("howto-text");
    
    if (textEl) {
      textEl.innerHTML = `
        <p><strong>Guess the word!</strong></p>
        <p>Each guess must match the word length. Colors show how close you are:</p>
        <ul>
          <li><span class="demo-correct">Green</span> = correct letter, correct spot</li>
          <li><span class="demo-present">Orange</span> = correct letter, wrong spot</li>
          <li><span class="demo-absent">Gray</span> = letter not in word</li>
        </ul>
        <p>Use the controls to adjust focus, word length, and number of guesses.</p>
        <p>Teachers: Set custom words using the password field.</p>
      `;
    }
    
    if (modal) {
      modal.classList.add("open");
      trapFocus(modal);
    }
  }

  function closeModal(which) {
    const modal = document.getElementById(`${which}-modal`);
    if (modal) {
      modal.classList.remove("open");
      releaseFocus();
    }
    
    if (which === "end") {
      startNewGame();
    }
  }

  function trapFocus(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    function handleTab(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    
    modal.addEventListener("keydown", handleTab);
    if (first) first.focus();
  }

  function releaseFocus() {
    const board = document.getElementById("game-board");
    if (board) board.focus();
  }

  function showToast(message, type = "info") {
    const toast = document.getElementById("teacher-toast");
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add("show");
    
    setTimeout(() => toast.classList.remove("show"), 2500);
/* ======================================================
   RECORDING STUDIO (PERSISTENT + CLEAN MIC LIFECYCLE)
   - additive / safe
   - uses IndexedDB
====================================================== */
(function initRecordingStudio() {
  const studio = document.getElementById("studio-modal");
  if (!studio) return;

  const micStatus = document.getElementById("mic-status");

  let mediaRecorder = null;
  let mediaStream = null;
  let audioChunks = [];

  // In-memory cache (fast UI); persisted in IndexedDB (real storage)
  const recordings = { word: null, sentence: null };

  // ---- IndexedDB (tiny + reliable) ----
  const DB_NAME = "decode_the_word_audio";
  const DB_VERSION = 1;
  const STORE = "clips";

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbPut(id, blob) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ id, blob, savedAt: Date.now() });
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async function idbGet(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => {
        const val = req.result ? req.result.blob : null;
        db.close();
        resolve(val);
      };
      req.onerror = () => { db.close(); reject(req.error); };
    });
  }

  // ---- Helpers ----
  function getCurrentTargetWord() {
    // Prefer your app state if it exists; fall back to what’s shown in the end modal / board.
    try {
      if (typeof state === "object" && state && typeof state.word === "string" && state.word) return state.word;
    } catch (_) {}
    const endWord = document.getElementById("end-word")?.textContent?.trim();
    if (endWord) return endWord;
    return "current"; // safe fallback (still stores, but not per-word)
  }

  function keyFor(type) {
    return `${getCurrentTargetWord().toLowerCase()}|${type}`;
  }

  function setMic(on, label = "") {
    if (!micStatus) return;
    micStatus.textContent = on ? `Recording ${label}…` : "Mic OFF";
    micStatus.classList.toggle("on", on);
    micStatus.classList.toggle("off", !on);
  }

  function stopStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    }
  }

  function stopRecorderSafely() {
    try {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    } catch (_) {}
  }

  // ---- Wire each block (word / sentence) ----
  studio.querySelectorAll(".studio-block").forEach(async (block) => {
    const type = block.dataset.type; // REQUIRED: data-type="word" / "sentence"
    if (type !== "word" && type !== "sentence") return;

    const buttons = block.querySelectorAll("button");
    if (buttons.length < 3) return;

    const [recordBtn, stopBtn, playBtn] = buttons;
    const savedLabel = block.querySelector(".studio-saved");

    // Initial UI state
    stopBtn.disabled = true;
    playBtn.disabled = true;
    if (savedLabel) savedLabel.style.display = "none";

    // Load existing recording (if any) for this word/type
    try {
      const existing = await idbGet(keyFor(type));
      if (existing) {
        recordings[type] = existing;
        playBtn.disabled = false;
        if (savedLabel) savedLabel.style.display = "block";
      }
    } catch (_) {
      // If IDB fails (private mode edge cases), app still works in-memory.
    }

    recordBtn.addEventListener("click", async () => {
      // If something is already recording, stop it cleanly first
      stopRecorderSafely();
      stopStream();
      setMic(false);

      // Request mic
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        alert("Microphone access denied.");
        return;
      }

      audioChunks = [];
      mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        recordings[type] = blob;

        // Persist (per word + type)
        try { await idbPut(keyFor(type), blob); } catch (_) {}

        if (savedLabel) savedLabel.style.display = "block";
        playBtn.disabled = false;

        // Reset mic + UI
        setMic(false);
        stopStream();

        recordBtn.disabled = false;
        stopBtn.disabled = true;
      };

      // Update UI immediately
      setMic(true, type);
      if (savedLabel) savedLabel.style.display = "none";
      recordBtn.disabled = true;
      stopBtn.disabled = false;
      playBtn.disabled = true;

      mediaRecorder.start();
    });

    stopBtn.addEventListener("click", () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      } else {
        // If stop is hit with no active recorder, reset UI safely
        setMic(false);
        stopStream();
        recordBtn.disabled = false;
        stopBtn.disabled = true;
      }
    });

    playBtn.addEventListener("click", () => {
      const blob = recordings[type];
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audio.play();
    });
  });

  // If studio closes while recording, stop cleanly (prevents “mic stuck on”)
  studio.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-close]");
    if (!closeBtn) return;
    stopRecorderSafely();
    stopStream();
    setMic(false);
  });
})();

