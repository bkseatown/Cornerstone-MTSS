// Home page enhancements: placement screener + recommended next steps.
(function () {
  const PLACEMENT_KEY = 'decode_placement_v1';
  const SETTINGS_KEY = 'decode_settings';

  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('placement-modal');
  const summary = document.getElementById('placement-summary');

  const startBtn = document.getElementById('placement-start');
  const closeBtn = document.getElementById('placement-close');
  const calcBtn = document.getElementById('placement-calc');
  const clearBtn = document.getElementById('placement-clear');
  const result = document.getElementById('placement-result');
  const goWordQuest = document.getElementById('placement-go-word-quest');
  const openWordQuest = document.getElementById('placement-open-word-quest');

  const gradeSelect = document.getElementById('placement-grade');
  const skillEls = {
    letterSounds: document.getElementById('skill-letter-sounds'),
    cvc: document.getElementById('skill-cvc'),
    digraph: document.getElementById('skill-digraph'),
    blends: document.getElementById('skill-blends'),
    magicE: document.getElementById('skill-magic-e'),
    vowelTeam: document.getElementById('skill-vowel-team'),
    rControlled: document.getElementById('skill-r-controlled'),
    multisyllable: document.getElementById('skill-multisyllable')
  };

  if (!overlay || !modal || !summary || !startBtn || !calcBtn || !clearBtn || !result || !goWordQuest || !gradeSelect) {
    return;
  }

  const wordQuestStat = document.getElementById('progress-word-quest');
  const wordQuestDetail = document.getElementById('progress-word-quest-detail');
  const activityLogList = document.getElementById('progress-activity-log');
  const activityLogEmpty = document.getElementById('progress-activity-empty');
  const exportJsonBtn = document.getElementById('progress-export-json');
  const exportCsvBtn = document.getElementById('progress-export-csv');
  const importJsonBtn = document.getElementById('progress-import-json');
  const importFileInput = document.getElementById('progress-import-file');
  const reportStatus = document.getElementById('progress-report-status');
  const learnerActiveSelect = document.getElementById('learner-active-select');
  const learnerActiveMeta = document.getElementById('learner-active-meta');
  const learnerNameInput = document.getElementById('learner-name-input');
  const learnerGradeInput = document.getElementById('learner-grade-input');
  const learnerAddBtn = document.getElementById('learner-add-btn');
  const learnerList = document.getElementById('learner-list');
  const learnerStatus = document.getElementById('learner-status');
  let editingLearnerId = '';

  const REPORT_VERSION = 1;
  const REPORT_EXACT_KEYS = new Set([
    'cloze_settings',
    'cloze_last_set_v1',
    'comp_progress',
    'comp_filters_v1',
    'fluency_progress',
    'fluency_filters_v1',
    'writing_builder_v1',
    'planit_progress_v2',
    'planit_video_links_v1',
    'planit_reflections_v1',
    'wtw_assessment_records',
    'useTeacherRecordings',
    'hasRecordings',
    'decode_v5_visited',
    'tutorialShown',
    'last_bonus_key',
    'bonus_frequency_migrated',
    'hq_english_voice_notice',
    'hq_voice_notice_shown'
  ]);
  const REPORT_PREFIXES = [
    'decode_',
    'cloze_',
    'comp_',
    'fluency_',
    'writing_',
    'planit_',
    'wtw_'
  ];

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function setReportStatus(message, isError = false) {
    if (!reportStatus) return;
    reportStatus.textContent = message || '';
    reportStatus.classList.toggle('error', !!isError);
    reportStatus.classList.toggle('success', !isError && !!message);
  }

  function setLearnerStatus(message, isError = false) {
    if (!learnerStatus) return;
    learnerStatus.textContent = message || '';
    learnerStatus.classList.toggle('error', !!isError);
    learnerStatus.classList.toggle('success', !isError && !!message);
  }

  function isReportStorageKey(key) {
    return REPORT_EXACT_KEYS.has(key) || REPORT_PREFIXES.some((prefix) => key.startsWith(prefix));
  }

  function buildReportSnapshot() {
    const platform = window.DECODE_PLATFORM;
    const data = platform?.getLearnerDataSnapshot?.() || {};
    const learner = platform?.getActiveLearner?.() || null;

    return {
      version: REPORT_VERSION,
      format: 'decode-progress-report',
      exportedAt: new Date().toISOString(),
      learner,
      data
    };
  }

  function downloadBlob(text, filename, mimeType) {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function formatDateSlug(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function escapeCsvCell(value) {
    const raw = String(value ?? '');
    if (!/[",\n]/.test(raw)) return raw;
    return `"${raw.replace(/"/g, '""')}"`;
  }

  function getRecentActivityEntries() {
    const log = safeParse(localStorage.getItem('decode_activity_log_v1') || '');
    return Array.isArray(log) ? log : [];
  }

  function handleExportJson() {
    const snapshot = buildReportSnapshot();
    const keyCount = Object.keys(snapshot.data).length;
    const filename = `decode-report-${formatDateSlug(new Date())}.json`;
    downloadBlob(JSON.stringify(snapshot, null, 2), filename, 'application/json;charset=utf-8');
    setReportStatus(`Exported ${keyCount} data keys to ${filename}.`);
  }

  function handleExportCsv() {
    const entries = getRecentActivityEntries();
    if (!entries.length) {
      setReportStatus('No activity log data to export yet.', true);
      return;
    }

    const header = [
      'timestamp_iso',
      'activity',
      'event',
      'score',
      'coins',
      'streak',
      'focus',
      'details'
    ];
    const rows = entries.map((entry) => {
      const details = entry && typeof entry === 'object'
        ? JSON.stringify(entry)
        : '';
      return [
        entry?.ts ? new Date(entry.ts).toISOString() : '',
        entry?.label || entry?.activityLabel || entry?.activity || '',
        entry?.event || entry?.action || entry?.message || '',
        entry?.score ?? '',
        entry?.coins ?? '',
        entry?.streak ?? '',
        entry?.focus ?? '',
        details
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\n');

    const filename = `decode-activity-${formatDateSlug(new Date())}.csv`;
    downloadBlob(csv, filename, 'text/csv;charset=utf-8');
    setReportStatus(`Exported ${rows.length} activity rows to ${filename}.`);
  }

  function extractImportPairs(raw) {
    const parsed = safeParse(raw);
    if (!parsed || typeof parsed !== 'object') return [];
    const source = parsed.data && typeof parsed.data === 'object'
      ? parsed.data
      : parsed;
    return Object.entries(source).filter(([key, value]) => (
      typeof key === 'string' && typeof value === 'string' && isReportStorageKey(key)
    ));
  }

  function refreshAfterImport() {
    const settings = safeParse(localStorage.getItem(SETTINGS_KEY) || '');
    if (settings?.uiLook) {
      applyLookClass(settings.uiLook);
    }
    renderSummary(load());
    renderProgress();
    renderLearners();
  }

  function handleImportFile(file) {
    if (!file) return;
    file.text()
      .then((raw) => {
        const pairs = extractImportPairs(raw);
        if (!pairs.length) {
          setReportStatus('Import failed: file did not contain supported Decode data keys.', true);
          return;
        }

        const platform = window.DECODE_PLATFORM;
        if (platform?.importLearnerDataSnapshot) {
          const payload = {};
          pairs.forEach(([key, value]) => {
            payload[key] = value;
          });
          platform.importLearnerDataSnapshot(payload);
        } else {
          pairs.forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
        }

        refreshAfterImport();
        setReportStatus(`Imported ${pairs.length} data keys from ${file.name}.`);
      })
      .catch(() => {
        setReportStatus('Import failed: unable to read the selected file.', true);
      });
  }

  function formatLearnerMeta(learner) {
    if (!learner) return 'No active learner selected.';
    const gradeBand = normalizeGradeBand(learner.gradeBand || '') || 'Not set';
    return `Grade band: ${gradeBand}`;
  }

  function buildGradeBandSelect(select, selectedValue = '') {
    if (!select) return;
    const normalized = normalizeGradeBand(selectedValue || '');
    select.innerHTML = `
      <option value="">Choose…</option>
      <option value="K-2">K–2</option>
      <option value="3-5">3–5</option>
      <option value="6-8">6–8</option>
      <option value="9-12">9–12</option>
    `;
    select.value = normalized;
  }

  function switchLearner(id) {
    const platform = window.DECODE_PLATFORM;
    if (!platform?.setActiveLearner) return;
    const changed = platform.getActiveLearnerId?.() !== id;
    const ok = platform.setActiveLearner(id, { reload: false });
    if (!ok) {
      setLearnerStatus('Could not switch learner.', true);
      return;
    }
    platform.refreshLearnerSwitchers?.();
    const settings = safeParse(localStorage.getItem(SETTINGS_KEY) || '');
    if (settings?.uiLook) applyLookClass(settings.uiLook);
    editingLearnerId = '';
    renderSummary(load());
    renderProgress();
    renderLearners();
    if (changed) {
      setLearnerStatus('Switched active learner.');
    }
  }

  function renderLearners() {
    const platform = window.DECODE_PLATFORM;
    if (!platform?.getLearners || !platform?.getActiveLearner) return;

    const learners = platform.getLearners();
    const active = platform.getActiveLearner();

    if (learnerActiveSelect) {
      learnerActiveSelect.innerHTML = '';
      learners.forEach((learner) => {
        const option = document.createElement('option');
        option.value = learner.id;
        option.textContent = learner.name;
        learnerActiveSelect.appendChild(option);
      });
      if (active?.id) learnerActiveSelect.value = active.id;
    }

    if (learnerActiveMeta) {
      learnerActiveMeta.textContent = formatLearnerMeta(active);
    }

    if (learnerList) {
      learnerList.innerHTML = '';
      learners.forEach((learner) => {
        const li = document.createElement('li');
        li.className = 'home-learner-item';
        li.dataset.learnerId = learner.id;
        const isEditing = editingLearnerId === learner.id;
        const gradeBand = normalizeGradeBand(learner.gradeBand || '') || '—';

        const copy = document.createElement('div');
        copy.className = 'home-learner-copy';
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = learner.name;
        const gradeSpan = document.createElement('span');
        gradeSpan.className = 'muted';
        gradeSpan.textContent = `Grade: ${gradeBand}`;
        copy.appendChild(nameStrong);
        copy.appendChild(gradeSpan);

        const actions = document.createElement('div');
        actions.className = 'home-learner-actions';

        const switchBtn = document.createElement('button');
        switchBtn.className = 'secondary-btn';
        switchBtn.type = 'button';
        switchBtn.dataset.action = 'switch';
        switchBtn.dataset.id = learner.id;
        switchBtn.textContent = 'Switch';
        if (active?.id === learner.id) switchBtn.disabled = true;

        const editBtn = document.createElement('button');
        editBtn.className = 'secondary-btn';
        editBtn.type = 'button';
        editBtn.dataset.action = 'edit';
        editBtn.dataset.id = learner.id;
        editBtn.textContent = 'Edit';
        if (isEditing) editBtn.disabled = true;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'secondary-btn';
        removeBtn.type = 'button';
        removeBtn.dataset.action = 'remove';
        removeBtn.dataset.id = learner.id;
        removeBtn.textContent = 'Remove';
        if (learners.length <= 1) removeBtn.disabled = true;

        actions.appendChild(switchBtn);
        actions.appendChild(editBtn);
        actions.appendChild(removeBtn);
        li.appendChild(copy);
        li.appendChild(actions);

        if (isEditing) {
          const editor = document.createElement('div');
          editor.className = 'home-learner-editor';

          const grid = document.createElement('div');
          grid.className = 'home-learner-edit-grid';

          const nameField = document.createElement('label');
          nameField.className = 'home-field-label';
          nameField.textContent = 'Name';
          const editNameInput = document.createElement('input');
          editNameInput.className = 'home-input';
          editNameInput.type = 'text';
          editNameInput.value = learner.name || '';
          editNameInput.dataset.role = 'edit-name';

          const gradeField = document.createElement('label');
          gradeField.className = 'home-field-label';
          gradeField.textContent = 'Grade band';
          const editGradeSelect = document.createElement('select');
          editGradeSelect.className = 'home-select';
          editGradeSelect.dataset.role = 'edit-grade';
          buildGradeBandSelect(editGradeSelect, learner.gradeBand || '');

          const nameWrap = document.createElement('div');
          nameWrap.appendChild(nameField);
          nameWrap.appendChild(editNameInput);

          const gradeWrap = document.createElement('div');
          gradeWrap.appendChild(gradeField);
          gradeWrap.appendChild(editGradeSelect);

          grid.appendChild(nameWrap);
          grid.appendChild(gradeWrap);

          const editorActions = document.createElement('div');
          editorActions.className = 'home-learner-editor-actions';

          const saveBtn = document.createElement('button');
          saveBtn.className = 'primary-btn';
          saveBtn.type = 'button';
          saveBtn.dataset.action = 'save-edit';
          saveBtn.dataset.id = learner.id;
          saveBtn.textContent = 'Save';

          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'secondary-btn';
          cancelBtn.type = 'button';
          cancelBtn.dataset.action = 'cancel-edit';
          cancelBtn.dataset.id = learner.id;
          cancelBtn.textContent = 'Cancel';

          editorActions.appendChild(saveBtn);
          editorActions.appendChild(cancelBtn);

          editor.appendChild(grid);
          editor.appendChild(editorActions);
          li.appendChild(editor);
        }

        learnerList.appendChild(li);
      });
    }
  }

  function normalizeGradeBand(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw === 'k2' || raw.toLowerCase() === 'k-2') return 'K-2';
    if (raw === '35' || raw === '3-5') return '3-5';
    if (raw === '68' || raw === '6-8') return '6-8';
    if (raw === '912' || raw === '9-12') return '9-12';
    if (raw === '612' || raw === '6-12') return '6-8';
    return raw;
  }

  function gradeBandToLook(band) {
    const normalized = normalizeGradeBand(band);
    if (normalized === 'K-2') return 'k2';
    if (normalized === '3-5') return '35';
    if (normalized === '6-8' || normalized === '9-12') return '612';
    return '';
  }

  function applyLookClass(look) {
    const body = document.body;
    if (!body) return;
    body.classList.remove('look-k2', 'look-35', 'look-612');
    body.classList.add(look === 'k2' ? 'look-k2' : look === '612' ? 'look-612' : 'look-35');
  }

  function syncProfileAndLook(gradeBand) {
    const normalized = normalizeGradeBand(gradeBand);
    if (!normalized) return;

    const platform = window.DECODE_PLATFORM;

    try {
      platform?.setProfile?.({ gradeBand: normalized });
    } catch {}

    const look = gradeBandToLook(normalized);
    if (!look) return;

    if (platform?.setSettings) {
      platform.setSettings({ uiLook: look }, { emit: true });
    } else {
      const existing = safeParse(localStorage.getItem(SETTINGS_KEY) || '') || {};
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, uiLook: look }));
    }
    applyLookClass(look);
  }

  function getSkillState() {
    return {
      letterSounds: !!skillEls.letterSounds?.checked,
      cvc: !!skillEls.cvc?.checked,
      digraph: !!skillEls.digraph?.checked,
      blends: !!skillEls.blends?.checked,
      magicE: !!skillEls.magicE?.checked,
      vowelTeam: !!skillEls.vowelTeam?.checked,
      rControlled: !!skillEls.rControlled?.checked,
      multisyllable: !!skillEls.multisyllable?.checked
    };
  }

  function computeRecommendation(skills) {
    if (!skills.letterSounds) {
      return {
        focus: 'cvc',
        length: '3',
        headline: 'Start with sound-letter connections + 3-letter words.',
        notes: 'Tip: open Sound Lab in Word Quest (Tools ▾) and practice short vowels + consonants.'
      };
    }
    if (!skills.cvc) {
      return {
        focus: 'cvc',
        length: '3',
        headline: 'Start with CVC short vowels.',
        notes: 'Keep words short and repeat patterns daily.'
      };
    }
    if (!skills.digraph) {
      return {
        focus: 'digraph',
        length: '4',
        headline: 'Next focus: digraphs (sh/ch/th).',
        notes: 'Practice the digraph sound, then read words with that pattern.'
      };
    }
    if (!skills.blends) {
      return {
        focus: 'ccvc',
        length: '4',
        headline: 'Next focus: blends (st/bl/cr).',
        notes: 'Start with initial blends (CCVC), then move to final blends (CVCC).'
      };
    }
    if (!skills.magicE) {
      return {
        focus: 'cvce',
        length: '4',
        headline: 'Next focus: silent‑e (CVCe).',
        notes: 'Contrast pairs help: cap → cape, kit → kite.'
      };
    }
    if (!skills.vowelTeam) {
      return {
        focus: 'vowel_team',
        length: '5',
        headline: 'Next focus: vowel teams.',
        notes: 'Try one team per day (ai, ee, oa…).'
      };
    }
    if (!skills.rControlled) {
      return {
        focus: 'r_controlled',
        length: '5',
        headline: 'Next focus: r‑controlled vowels.',
        notes: 'Group by sound (ar / er / or) to reduce confusion.'
      };
    }
    if (!skills.multisyllable) {
      return {
        focus: 'multisyllable',
        length: 'any',
        headline: 'Next focus: multisyllable words.',
        notes: 'Teach “chunking”: syllables, prefixes/suffixes, and known patterns.'
      };
    }
    return {
      focus: 'multisyllable',
      length: 'any',
      headline: 'You can start with multisyllable practice.',
      notes: 'Mix in prefixes/suffixes and vocabulary work.'
    };
  }

  function wordQuestHref(focus, length) {
    const url = new URL('word-quest.html', window.location.href);
    if (focus) url.searchParams.set('focus', focus);
    if (length) url.searchParams.set('len', length);
    return url.toString();
  }

  function openModal() {
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    modal.classList.remove('hidden');
    modal.dataset.open = 'true';
  }

  function closeModal() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    modal.classList.add('hidden');
    delete modal.dataset.open;
  }

  function renderSummary(data) {
    if (!summary) return;

    if (!data || !data.recommendation) {
      summary.innerHTML = `
        <div class="home-mini-title">Current recommendation</div>
        <div class="muted">Not set yet. Run the screener to get a starting focus.</div>
      `;
      if (openWordQuest) openWordQuest.href = 'word-quest.html';
      return;
    }

    const rec = data.recommendation;
    const updated = data.updatedAt ? new Date(data.updatedAt) : null;
    const updatedText = updated && !Number.isNaN(updated.getTime())
      ? updated.toLocaleDateString()
      : '—';

    const focusLabel = rec.focus === 'vowel_team'
      ? 'Vowel Teams'
      : rec.focus === 'r_controlled'
        ? 'R-Controlled'
        : rec.focus === 'cvce'
          ? 'Silent‑e (CVCe)'
          : rec.focus === 'ccvc'
            ? 'Blends (CCVC)'
            : rec.focus === 'digraph'
              ? 'Digraphs'
              : rec.focus === 'cvc'
                ? 'CVC'
                : rec.focus === 'multisyllable'
                  ? 'Multisyllable'
                  : 'All Words';

    summary.innerHTML = `
      <div class="home-mini-title">Current recommendation</div>
      <div class="home-placement-line"><strong>${focusLabel}</strong> · length <strong>${rec.length}</strong> · updated <strong>${updatedText}</strong></div>
      <div class="muted">${rec.headline || ''}</div>
    `;

    const href = wordQuestHref(rec.focus, rec.length);
    goWordQuest.href = href;
    openWordQuest.href = href;
  }

  function store(data) {
    localStorage.setItem(PLACEMENT_KEY, JSON.stringify(data));
  }

  function load() {
    return safeParse(localStorage.getItem(PLACEMENT_KEY) || '');
  }

  function setFormFromData(data) {
    if (!data) return;
    if (gradeSelect && data.gradeBand !== undefined) {
      gradeSelect.value = normalizeGradeBand(data.gradeBand) || '';
    }
    const skills = data.skills || {};
    if (skillEls.letterSounds) skillEls.letterSounds.checked = !!skills.letterSounds;
    if (skillEls.cvc) skillEls.cvc.checked = !!skills.cvc;
    if (skillEls.digraph) skillEls.digraph.checked = !!skills.digraph;
    if (skillEls.blends) skillEls.blends.checked = !!skills.blends;
    if (skillEls.magicE) skillEls.magicE.checked = !!skills.magicE;
    if (skillEls.vowelTeam) skillEls.vowelTeam.checked = !!skills.vowelTeam;
    if (skillEls.rControlled) skillEls.rControlled.checked = !!skills.rControlled;
    if (skillEls.multisyllable) skillEls.multisyllable.checked = !!skills.multisyllable;
  }

  function showResult(rec) {
    result.classList.remove('hidden');
    result.innerHTML = `
      <div class="placement-result-title">Recommended Word Quest focus</div>
      <div class="placement-result-main"><strong>${rec.focus}</strong> · length <strong>${rec.length}</strong></div>
      <div class="muted" style="margin-top:6px;">${rec.headline || ''}</div>
      ${rec.notes ? `<div class="muted" style="margin-top:6px;">${rec.notes}</div>` : ''}
    `;

    const href = wordQuestHref(rec.focus, rec.length);
    goWordQuest.href = href;
    goWordQuest.classList.remove('hidden');
  }

  startBtn.addEventListener('click', () => {
    const existing = load();
    setFormFromData(existing);
    if (existing?.recommendation) {
      showResult(existing.recommendation);
    } else {
      result.classList.add('hidden');
      goWordQuest.classList.add('hidden');
    }
    openModal();
  });

  closeBtn?.addEventListener('click', closeModal);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.dataset.open === 'true') {
      closeModal();
    }
  });

  calcBtn.addEventListener('click', () => {
    const gradeBand = normalizeGradeBand(gradeSelect.value || '');
    const skills = getSkillState();
    const recommendation = computeRecommendation(skills);
    const payload = {
      version: 1,
      gradeBand,
      skills,
      recommendation,
      updatedAt: new Date().toISOString()
    };
    store(payload);
    syncProfileAndLook(gradeBand);
    showResult(recommendation);
    renderSummary(payload);
  });

  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(PLACEMENT_KEY);
    Object.values(skillEls).forEach((el) => {
      if (el) el.checked = false;
    });
    gradeSelect.value = '';
    result.classList.add('hidden');
    goWordQuest.classList.add('hidden');
    renderSummary(null);
  });

  // Initial render
  renderSummary(load());

  function renderProgress() {
    if (wordQuestStat && wordQuestDetail) {
      const data = safeParse(localStorage.getItem('decode_progress_data') || '');
      const attempted = Number(data?.wordsAttempted || 0);
      const correct = Number(data?.wordsCorrect || 0);
      const totalGuesses = Number(data?.totalGuesses || 0);

      if (!attempted) {
        wordQuestStat.textContent = 'No data yet';
        wordQuestDetail.textContent = 'Play a few rounds to see accuracy and recent words.';
      } else {
        const accuracy = Math.round((correct / attempted) * 100);
        const avgGuesses = attempted ? (totalGuesses / attempted) : 0;
        wordQuestStat.textContent = `${accuracy}% accuracy`;
        wordQuestDetail.textContent = `${correct}/${attempted} correct · avg guesses ${avgGuesses.toFixed(1)}`;
      }
    }

    if (activityLogList && activityLogEmpty) {
      const entries = getRecentActivityEntries().slice(0, 8);
      activityLogList.innerHTML = '';
      activityLogEmpty.textContent = '';

      if (!entries.length) {
        activityLogEmpty.textContent = 'No recent activity yet.';
        return;
      }

      entries.forEach((entry) => {
        const when = entry?.ts ? new Date(entry.ts) : null;
        const whenText = when && !Number.isNaN(when.getTime())
          ? when.toLocaleDateString()
          : '';
        const label = entry?.label || entry?.activityLabel || entry?.activity || 'Activity';
        const event = entry?.event || entry?.action || entry?.message || 'Updated';
        const li = document.createElement('li');
        li.textContent = whenText ? `${label}: ${event} (${whenText})` : `${label}: ${event}`;
        activityLogList.appendChild(li);
      });
    }
  }

  renderProgress();
  renderLearners();

  exportJsonBtn?.addEventListener('click', handleExportJson);
  exportCsvBtn?.addEventListener('click', handleExportCsv);
  importJsonBtn?.addEventListener('click', () => {
    importFileInput?.click();
  });
  importFileInput?.addEventListener('change', () => {
    const file = importFileInput.files?.[0];
    handleImportFile(file);
    importFileInput.value = '';
  });
  learnerActiveSelect?.addEventListener('change', () => {
    switchLearner(learnerActiveSelect.value);
  });
  learnerAddBtn?.addEventListener('click', () => {
    const platform = window.DECODE_PLATFORM;
    const name = (learnerNameInput?.value || '').trim();
    const gradeBand = normalizeGradeBand(learnerGradeInput?.value || '');
    if (!platform?.addLearner) return;
    if (!name) {
      setLearnerStatus('Enter a learner name before adding.', true);
      return;
    }
    platform.addLearner({ name, gradeBand });
    if (learnerNameInput) learnerNameInput.value = '';
    if (learnerGradeInput) learnerGradeInput.value = '';
    editingLearnerId = '';
    platform.refreshLearnerSwitchers?.();
    renderLearners();
    setLearnerStatus('Learner added.');
  });
  learnerList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const actionEl = target.closest('button[data-action]');
    if (!actionEl) return;
    const id = actionEl.getAttribute('data-id') || '';
    const action = actionEl.getAttribute('data-action');
    const platform = window.DECODE_PLATFORM;

    if (action === 'switch') {
      switchLearner(id);
      return;
    }

    if (action === 'edit') {
      editingLearnerId = id;
      renderLearners();
      setLearnerStatus('Editing learner.');
      return;
    }

    if (action === 'cancel-edit') {
      editingLearnerId = '';
      renderLearners();
      setLearnerStatus('');
      return;
    }

    if (action === 'save-edit') {
      if (!platform?.updateLearner) return;
      const row = actionEl.closest('li[data-learner-id]');
      const editNameInput = row?.querySelector('input[data-role="edit-name"]');
      const editGradeSelect = row?.querySelector('select[data-role="edit-grade"]');
      const name = (editNameInput && 'value' in editNameInput) ? editNameInput.value.trim() : '';
      const gradeBand = normalizeGradeBand((editGradeSelect && 'value' in editGradeSelect) ? editGradeSelect.value : '');

      if (!name) {
        setLearnerStatus('Learner name cannot be empty.', true);
        editNameInput?.focus();
        return;
      }

      const updated = platform.updateLearner(id, { name, gradeBand });
      if (!updated) {
        setLearnerStatus('Could not update learner.', true);
        return;
      }

      if (platform.getActiveLearnerId?.() === id) {
        window.DECODE_PLATFORM?.setProfile?.({ gradeBand: gradeBand || '' });
        if (gradeBand) syncProfileAndLook(gradeBand);
      }

      editingLearnerId = '';
      platform.refreshLearnerSwitchers?.();
      renderLearners();
      renderSummary(load());
      renderProgress();
      setLearnerStatus('Learner updated.');
      return;
    }

    if (action === 'remove') {
      if (!platform?.removeLearner) return;
      const confirmRemove = window.confirm('Remove this learner and all learner-specific saved data on this device?');
      if (!confirmRemove) return;
      const response = platform.removeLearner(id, { reload: false });
      if (!response?.ok) {
        setLearnerStatus('Could not remove learner. At least one learner is required.', true);
        return;
      }
      editingLearnerId = '';
      platform.refreshLearnerSwitchers?.();
      renderLearners();
      renderSummary(load());
      renderProgress();
      setLearnerStatus('Learner removed.');
    }
  });
})();
