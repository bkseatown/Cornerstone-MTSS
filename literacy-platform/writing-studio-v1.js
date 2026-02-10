(function () {
  const ACTIVE_KEY = 'cs_writing_v1_active';
  const SAVE_PREFIX = 'cs_writing_v1::';
  const THEME_KEY = 'cs_hv2_theme';
  const THEMES = ['calm', 'professional', 'playful'];

  const GRADE_BANDS = [
    { id: 'k2', label: 'K-2', subtitle: 'Early writers building confidence.' },
    { id: '35', label: '3-5', subtitle: 'Developing structure and details.' },
    { id: '68', label: '6-8', subtitle: 'Expanding evidence and reasoning.' },
    { id: '912', label: '9-12', subtitle: 'Academic clarity and voice.' }
  ];

  const WRITING_TYPES = [
    { id: 'narrative', label: 'Narrative', subtitle: 'Tell a story with clear events.' },
    { id: 'informational', label: 'Informational', subtitle: 'Teach the reader about a topic.' },
    { id: 'opinion', label: 'Opinion/Argument', subtitle: 'Make a claim and support it.' },
    { id: 'reflection', label: 'Reflection', subtitle: 'Explain experience and growth.' }
  ];

  const ORGANIZERS = {
    web: {
      id: 'web',
      label: 'Web',
      subtitle: 'Center idea and connected details.',
      fields: [
        { id: 'center', label: 'Center idea' },
        { id: 'branch_1', label: 'Branch idea 1' },
        { id: 'branch_2', label: 'Branch idea 2' },
        { id: 'branch_3', label: 'Branch idea 3' },
        { id: 'branch_4', label: 'Branch idea 4' }
      ]
    },
    list: {
      id: 'list',
      label: 'List',
      subtitle: 'Quick sequence of key points.',
      fields: [
        { id: 'topic', label: 'Topic' },
        { id: 'item_1', label: 'Point 1' },
        { id: 'item_2', label: 'Point 2' },
        { id: 'item_3', label: 'Point 3' },
        { id: 'item_4', label: 'Point 4' }
      ]
    },
    boxes_bullets: {
      id: 'boxes_bullets',
      label: 'Boxes & Bullets',
      subtitle: 'Main idea plus supporting bullets.',
      fields: [
        { id: 'box', label: 'Main box idea' },
        { id: 'bullet_1', label: 'Bullet detail 1' },
        { id: 'bullet_2', label: 'Bullet detail 2' },
        { id: 'bullet_3', label: 'Bullet detail 3' },
        { id: 'bullet_4', label: 'Bullet detail 4' }
      ]
    },
    story_mountain: {
      id: 'story_mountain',
      label: 'Story Mountain',
      subtitle: 'Beginning, middle, and end arc.',
      fields: [
        { id: 'characters', label: 'Characters' },
        { id: 'setting', label: 'Setting' },
        { id: 'problem', label: 'Problem' },
        { id: 'events', label: 'Important events' },
        { id: 'resolution', label: 'Resolution' }
      ]
    },
    five_paragraph: {
      id: 'five_paragraph',
      label: '5-Paragraph',
      subtitle: 'Intro, body, and conclusion flow.',
      fields: [
        { id: 'intro', label: 'Introduction' },
        { id: 'body_1', label: 'Body paragraph 1' },
        { id: 'body_2', label: 'Body paragraph 2' },
        { id: 'body_3', label: 'Body paragraph 3' },
        { id: 'conclusion', label: 'Conclusion' }
      ]
    }
  };

  const ORGANIZER_BY_TYPE = {
    narrative: ['web', 'story_mountain'],
    informational: ['list', 'boxes_bullets'],
    opinion: ['boxes_bullets', 'five_paragraph'],
    reflection: ['web', 'list']
  };

  const IDEA_STARTERS = {
    narrative: [
      'Who is your main character?',
      'Where does this story happen?',
      'What problem shows up first?',
      'How do feelings change from start to finish?'
    ],
    informational: [
      'What topic are you teaching?',
      'What are your key subtopics?',
      'Which facts are most important?',
      'Which example makes your idea clearer?'
    ],
    opinion: [
      'What is your claim?',
      'What are your strongest reasons?',
      'Which examples support those reasons?',
      'How will you end with impact?'
    ],
    reflection: [
      'What experience are you reflecting on?',
      'What did you learn?',
      'What feelings stood out?',
      'What will you do differently next time?'
    ]
  };

  const SENTENCE_FRAMES = {
    narrative: ['At first,', 'Then,', 'After that,', 'In the end,'],
    informational: ['One important reason is', 'For example,', 'Another key fact is', 'In conclusion,'],
    opinion: ['I believe that', 'One reason is', 'For example,', 'This shows that'],
    reflection: ['I noticed that', 'I learned that', 'Next time I will', 'This matters because']
  };

  const CHECKLISTS = {
    k2: [
      'My writing has a clear main idea.',
      'I added details to explain my idea.',
      'I used simple transitions (then, next, finally).',
      'I wrote an ending.',
      'I used different sentence starts.',
      'I chose strong words.'
    ],
    '35': [
      'I have a topic sentence or claim.',
      'My details/evidence support my main idea.',
      'I used transitions between ideas.',
      'My conclusion wraps up clearly.',
      'I varied sentence types.',
      'I improved word choice.'
    ],
    '68': [
      'My thesis or main idea is clear.',
      'Evidence supports each paragraph.',
      'Transitions connect my reasoning.',
      'My conclusion strengthens the message.',
      'Sentence structures are varied.',
      'Word choice is precise for audience and purpose.'
    ],
    '912': [
      'My central claim/focus is explicit.',
      'Evidence and analysis are connected.',
      'Transitions create cohesion across sections.',
      'Conclusion extends or reinforces the argument.',
      'Sentence variety supports clarity and tone.',
      'Academic word choice fits purpose and audience.'
    ]
  };

  const FEEDBACK_FOCUS = ['Ideas', 'Organization', 'Details', 'Transitions', 'Conventions'];
  const TABS = ['plan', 'draft', 'revise', 'publish'];

  const root = document.getElementById('writingStudioV1Root');
  if (!root) return;

  const state = {
    wizardStep: 0,
    workspaceStarted: false,
    gradeBand: '',
    writingType: '',
    organizer: '',
    activeTab: 'plan',
    organizerFields: {},
    draftText: '',
    checklistState: {},
    conferenceFocus: FEEDBACK_FOCUS[0],
    conferenceNotes: '',
    title: '',
    author: '',
    startedAt: Date.now(),
    updatedAt: Date.now(),
    status: '',
    lastSavedKey: '',
    checklistCelebrated: false
  };

  hydrateActive();
  applyTheme();
  render();

  function hydrateActive() {
    const parsed = safeParse(localStorage.getItem(ACTIVE_KEY) || '');
    if (!parsed || typeof parsed !== 'object') return;

    state.wizardStep = clamp(parsed.wizardStep, 0, 3);
    state.workspaceStarted = !!parsed.workspaceStarted;
    state.gradeBand = isValidId(parsed.gradeBand, GRADE_BANDS) ? parsed.gradeBand : '';
    state.writingType = isValidId(parsed.writingType, WRITING_TYPES) ? parsed.writingType : '';
    state.organizer = isValidOrganizerForType(parsed.organizer, state.writingType) ? parsed.organizer : '';
    state.activeTab = TABS.includes(parsed.activeTab) ? parsed.activeTab : 'plan';
    state.organizerFields = parsed.organizerFields && typeof parsed.organizerFields === 'object' ? { ...parsed.organizerFields } : {};
    state.draftText = String(parsed.draftText || '');
    state.checklistState = parsed.checklistState && typeof parsed.checklistState === 'object' ? { ...parsed.checklistState } : {};
    state.conferenceFocus = FEEDBACK_FOCUS.includes(parsed.conferenceFocus) ? parsed.conferenceFocus : FEEDBACK_FOCUS[0];
    state.conferenceNotes = String(parsed.conferenceNotes || '');
    state.title = String(parsed.title || '');
    state.author = String(parsed.author || '');
    state.startedAt = Number.isFinite(parsed.startedAt) ? parsed.startedAt : Date.now();
    state.updatedAt = Number.isFinite(parsed.updatedAt) ? parsed.updatedAt : Date.now();
    state.status = String(parsed.status || '');
    state.lastSavedKey = String(parsed.lastSavedKey || '');
    state.checklistCelebrated = !!parsed.checklistCelebrated;

    ensureOrganizerFields();
  }

  function applyTheme() {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const fromUrl = String(params.get('theme') || '').trim().toLowerCase();
      const fromStorage = String(localStorage.getItem(THEME_KEY) || '').trim().toLowerCase();
      const chosen = THEMES.includes(fromUrl) ? fromUrl : THEMES.includes(fromStorage) ? fromStorage : 'calm';
      if (THEMES.includes(fromUrl)) localStorage.setItem(THEME_KEY, fromUrl);
      THEMES.forEach((theme) => document.documentElement.classList.remove(`cs-hv2-theme-${theme}`));
      document.documentElement.classList.add(`cs-hv2-theme-${chosen}`);
    } catch {}
  }

  function render() {
    if (!state.workspaceStarted) {
      renderWizard();
      return;
    }
    renderWorkspace();
  }

  function renderWizard() {
    const content = buildWizardContent();
    root.innerHTML = `
      <section class="cs-wsv1-setup">
        <div class="cs-wsv1-setup-header">
          <p class="cs-wsv1-eyebrow">Writing Studio V1</p>
          <div class="cs-wsv1-chip-row">
            ${latestSavedKey() ? '<button class="cs-wsv1-btn cs-wsv1-btn-quiet" type="button" data-action="load-latest">Load latest saved</button>' : ''}
            <button class="cs-wsv1-btn cs-wsv1-btn-quiet" type="button" data-action="reset">Start over</button>
          </div>
        </div>
        <h2 class="cs-wsv1-title">${escapeHtml(content.title)}</h2>
        <p class="cs-wsv1-subtitle">${escapeHtml(content.subtitle)}</p>
        ${content.showPrompt ? '<p class="cs-wsv1-safe-prompt">It\'s okay if your first idea isn\'t perfect - just start small.</p>' : ''}
        ${content.optionsHtml}
        <div class="cs-wsv1-actions">
          <button class="cs-wsv1-btn" type="button" data-action="back" ${state.wizardStep === 0 ? 'disabled' : ''}>Back</button>
          <button class="cs-wsv1-btn cs-wsv1-btn-primary" type="button" data-action="next" ${content.canContinue ? '' : 'disabled'}>${content.primaryLabel}</button>
        </div>
      </section>
    `;

    root.querySelectorAll('[data-action="select-option"]').forEach((button) => {
      button.addEventListener('click', () => {
        const value = String(button.getAttribute('data-value') || '');
        if (!value) return;
        if (state.wizardStep === 1) {
          state.gradeBand = value;
        } else if (state.wizardStep === 2) {
          state.writingType = value;
          state.organizer = '';
          state.organizerFields = {};
        } else if (state.wizardStep === 3) {
          state.organizer = value;
          state.organizerFields = {};
          ensureOrganizerFields();
        }
        persistActive();
        renderWizard();
      });
    });

    root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      state.wizardStep = clamp(state.wizardStep - 1, 0, 3);
      persistActive();
      renderWizard();
    });

    root.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      if (state.wizardStep === 0) {
        state.wizardStep = 1;
        persistActive();
        renderWizard();
        return;
      }
      if (state.wizardStep === 1 && !state.gradeBand) return;
      if (state.wizardStep === 2 && !state.writingType) return;
      if (state.wizardStep === 3 && !state.organizer) return;

      if (state.wizardStep < 3) {
        state.wizardStep += 1;
        persistActive();
        renderWizard();
        return;
      }

      state.workspaceStarted = true;
      state.activeTab = 'plan';
      state.startedAt = Date.now();
      state.checklistCelebrated = false;
      state.status = 'Writing session started.';
      ensureOrganizerFields();
      persistActive();
      renderWorkspace();
    });

    root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
      resetSession();
    });

    root.querySelector('[data-action="load-latest"]')?.addEventListener('click', () => {
      const key = latestSavedKey();
      if (!key) return;
      loadSavedSession(key);
    });
  }

  function buildWizardContent() {
    if (state.wizardStep === 0) {
      return {
        title: 'Welcome to Writing Studio V1',
        subtitle: 'Move from planning to publishing with clear non-AI supports.',
        showPrompt: false,
        optionsHtml: '',
        canContinue: true,
        primaryLabel: 'Continue ->'
      };
    }

    if (state.wizardStep === 1) {
      return {
        title: 'Choose grade band',
        subtitle: 'Select the grade range for scaffolded supports.',
        showPrompt: true,
        optionsHtml: optionCards(GRADE_BANDS, state.gradeBand),
        canContinue: !!state.gradeBand,
        primaryLabel: 'Continue ->'
      };
    }

    if (state.wizardStep === 2) {
      return {
        title: 'Choose writing type',
        subtitle: 'Select the purpose for this writing session.',
        showPrompt: true,
        optionsHtml: optionCards(WRITING_TYPES, state.writingType),
        canContinue: !!state.writingType,
        primaryLabel: 'Continue ->'
      };
    }

    const options = organizerOptionsForType(state.writingType);
    return {
      title: 'Choose organizer',
      subtitle: 'Organizer options are matched to your writing type.',
      showPrompt: true,
      optionsHtml: optionCards(options, state.organizer),
      canContinue: !!state.organizer,
      primaryLabel: 'Start writing ->'
    };
  }

  function optionCards(options, selectedId) {
    return `
      <div class="cs-wsv1-option-grid" role="group">
        ${options.map((option) => `
          <button class="cs-wsv1-option ${selectedId === option.id ? 'cs-wsv1-option-active' : ''}" type="button" data-action="select-option" data-value="${escapeHtml(option.id)}">
            <h3>${escapeHtml(option.label)}</h3>
            <p>${escapeHtml(option.subtitle || '')}</p>
          </button>
        `).join('')}
      </div>
    `;
  }

  function organizerOptionsForType(typeId) {
    const ids = ORGANIZER_BY_TYPE[typeId] || [];
    return ids.map((id) => ORGANIZERS[id]).filter(Boolean);
  }

  function renderWorkspace() {
    ensureOrganizerFields();

    root.innerHTML = `
      <div class="cs-wsv1-setup-header">
        <div>
          <p class="cs-wsv1-eyebrow">FishTank + Responsive Classroom aligned</p>
          <h2 class="cs-wsv1-title">Writing Studio V1</h2>
          <p class="cs-wsv1-subtitle">Plan -> Draft -> Revise -> Publish</p>
        </div>
        <div class="cs-wsv1-chip-row">
          <button class="cs-wsv1-btn" type="button" data-action="save-local">Save locally</button>
          ${latestSavedKey() ? '<button class="cs-wsv1-btn cs-wsv1-btn-quiet" type="button" data-action="load-latest">Load latest saved</button>' : ''}
          <button class="cs-wsv1-btn cs-wsv1-btn-quiet" type="button" data-action="reset">Start over</button>
        </div>
      </div>

      <div class="cs-wsv1-chip-row">
        <span class="cs-wsv1-chip">Grade: ${escapeHtml(labelForId(state.gradeBand, GRADE_BANDS))}</span>
        <span class="cs-wsv1-chip">Type: ${escapeHtml(labelForId(state.writingType, WRITING_TYPES))}</span>
        <span class="cs-wsv1-chip">Organizer: ${escapeHtml(ORGANIZERS[state.organizer]?.label || '')}</span>
      </div>

      <nav class="cs-wsv1-tabs" aria-label="Writing steps">
        ${TABS.map((tab) => `<button class="cs-wsv1-tab ${state.activeTab === tab ? 'cs-wsv1-tab-active' : ''}" type="button" data-action="tab" data-tab="${tab}">${capitalize(tab)}</button>`).join('')}
      </nav>

      <section class="cs-wsv1-workspace">
        <article class="cs-wsv1-panel" id="cs-wsv1-main-tab"></article>
        <aside class="cs-wsv1-panel">
          <h3>Conference notes</h3>
          <p>Quick, teacher-friendly notes for writing conferences.</p>
          <div class="cs-wsv1-form-row">
            <label for="cs-wsv1-focus">Focus for feedback</label>
            <select id="cs-wsv1-focus" class="cs-wsv1-select">
              ${FEEDBACK_FOCUS.map((item) => `<option value="${escapeHtml(item)}" ${state.conferenceFocus === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}
            </select>
          </div>
          <div class="cs-wsv1-form-row">
            <label for="cs-wsv1-notes">Notes</label>
            <textarea id="cs-wsv1-notes" class="cs-wsv1-textarea" placeholder="Add conference notes...">${escapeHtml(state.conferenceNotes)}</textarea>
          </div>
          <p class="cs-wsv1-notice">Conference fields are included in Teacher Summary CSV export.</p>
        </aside>
      </section>

      <p class="cs-wsv1-status" id="cs-wsv1-status">${escapeHtml(state.status || '')}</p>
    `;

    root.querySelectorAll('[data-action="tab"]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextTab = String(button.getAttribute('data-tab') || 'plan');
        if (!TABS.includes(nextTab)) return;
        state.activeTab = nextTab;
        state.status = '';
        persistActive();
        renderWorkspace();
      });
    });

    root.querySelector('[data-action="save-local"]')?.addEventListener('click', () => {
      saveCurrentSession();
      renderWorkspace();
    });

    root.querySelector('[data-action="load-latest"]')?.addEventListener('click', () => {
      const key = latestSavedKey();
      if (!key) return;
      loadSavedSession(key);
    });

    root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
      resetSession();
    });

    const focusEl = root.querySelector('#cs-wsv1-focus');
    const notesEl = root.querySelector('#cs-wsv1-notes');
    focusEl?.addEventListener('change', () => {
      state.conferenceFocus = FEEDBACK_FOCUS.includes(focusEl.value) ? focusEl.value : FEEDBACK_FOCUS[0];
      persistActive();
    });
    notesEl?.addEventListener('input', () => {
      state.conferenceNotes = String(notesEl.value || '');
      persistActive();
    });

    renderActiveTab();
  }

  function renderActiveTab() {
    const panel = root.querySelector('#cs-wsv1-main-tab');
    if (!panel) return;

    if (state.activeTab === 'plan') return renderPlanTab(panel);
    if (state.activeTab === 'draft') return renderDraftTab(panel);
    if (state.activeTab === 'revise') return renderReviseTab(panel);
    return renderPublishTab(panel);
  }

  function renderPlanTab(panel) {
    const organizer = ORGANIZERS[state.organizer] || organizerOptionsForType(state.writingType)[0];
    const starters = IDEA_STARTERS[state.writingType] || [];

    panel.innerHTML = `
      <h3>Plan</h3>
      <p>Start with your organizer and gather ideas before drafting.</p>
      <p class="cs-wsv1-safe-prompt">It's okay if your first idea isn't perfect - just start small.</p>
      <div class="cs-wsv1-panel">
        <h3>Idea Starters</h3>
        <div class="cs-wsv1-alert-list">
          ${starters.map((line) => `<div class="cs-wsv1-alert-card cs-wsv1-alert-gray">${escapeHtml(line)}</div>`).join('')}
        </div>
      </div>
      <div class="cs-wsv1-form-grid">
        ${(organizer?.fields || []).map((field) => `
          <div class="cs-wsv1-form-row">
            <label for="field_${field.id}">${escapeHtml(field.label)}</label>
            <textarea id="field_${field.id}" class="cs-wsv1-textarea" data-action="field" data-field="${field.id}" placeholder="Write your idea...">${escapeHtml(state.organizerFields[field.id] || '')}</textarea>
          </div>
        `).join('')}
      </div>
      <div class="cs-wsv1-actions">
        <button class="cs-wsv1-btn" type="button" data-action="copy-plan">Copy plan into draft</button>
      </div>
    `;

    panel.querySelectorAll('[data-action="field"]').forEach((el) => {
      el.addEventListener('input', () => {
        const field = String(el.getAttribute('data-field') || '');
        if (!field) return;
        state.organizerFields[field] = String(el.value || '');
        persistActive();
      });
    });

    panel.querySelector('[data-action="copy-plan"]')?.addEventListener('click', () => {
      const text = planToText(organizer);
      if (!text) {
        state.status = 'Add organizer ideas before copying to draft.';
      } else {
        state.draftText = `${state.draftText ? `${state.draftText}\n\n` : ''}${text}`;
        state.activeTab = 'draft';
        state.status = 'Plan copied into draft.';
      }
      persistActive();
      renderWorkspace();
    });
  }

  function renderDraftTab(panel) {
    const frames = SENTENCE_FRAMES[state.writingType] || [];

    panel.innerHTML = `
      <h3>Draft</h3>
      <p>Write first, then improve in Revise.</p>
      <div class="cs-wsv1-stats-grid">
        <div class="cs-wsv1-stat"><span>Words</span><strong id="draft_words">0</strong></div>
        <div class="cs-wsv1-stat"><span>Sentences</span><strong id="draft_sentences">0</strong></div>
        <div class="cs-wsv1-stat"><span>Paragraphs</span><strong id="draft_paragraphs">0</strong></div>
      </div>
      <div class="cs-wsv1-form-row">
        <label for="draft_text">Draft</label>
        <textarea id="draft_text" class="cs-wsv1-textarea cs-wsv1-draft-area" placeholder="Start writing...">${escapeHtml(state.draftText)}</textarea>
      </div>
      <div class="cs-wsv1-panel">
        <h3>Sentence builder</h3>
        <p>Select a sentence frame and insert it into your draft.</p>
        <div class="cs-wsv1-frame-row">
          <select id="sentence_frame" class="cs-wsv1-select cs-wsv1-frame-select">
            ${frames.map((frame) => `<option value="${escapeHtml(frame)}">${escapeHtml(frame)}</option>`).join('')}
          </select>
          <button class="cs-wsv1-btn" type="button" data-action="insert-frame">Insert frame</button>
        </div>
      </div>
    `;

    const draftEl = panel.querySelector('#draft_text');
    const frameEl = panel.querySelector('#sentence_frame');

    const updateCounts = () => {
      const metrics = analyzeMetrics(String(draftEl?.value || ''));
      panel.querySelector('#draft_words').textContent = String(metrics.wordCount);
      panel.querySelector('#draft_sentences').textContent = String(metrics.sentenceCount);
      panel.querySelector('#draft_paragraphs').textContent = String(metrics.paragraphCount);
      state.draftText = String(draftEl?.value || '');
    };

    updateCounts();

    draftEl?.addEventListener('input', () => {
      updateCounts();
      persistActive();
    });

    panel.querySelector('[data-action="insert-frame"]')?.addEventListener('click', () => {
      if (!draftEl) return;
      const frame = String(frameEl?.value || '').trim();
      if (!frame) return;
      const insert = `${frame} `;
      const start = Number.isFinite(draftEl.selectionStart) ? draftEl.selectionStart : draftEl.value.length;
      const end = Number.isFinite(draftEl.selectionEnd) ? draftEl.selectionEnd : draftEl.value.length;
      draftEl.value = `${draftEl.value.slice(0, start)}${insert}${draftEl.value.slice(end)}`;
      const cursor = start + insert.length;
      draftEl.focus();
      draftEl.setSelectionRange(cursor, cursor);
      updateCounts();
      persistActive();
    });
  }

  function renderReviseTab(panel) {
    const checklist = checklistForBand(state.gradeBand);
    const analysis = analyzeRevision(state.draftText);
    const completion = checklistCompletion(checklist);

    panel.innerHTML = `
      <h3>Revise</h3>
      <p>Use this non-AI checklist and gentle highlights to improve your draft.</p>
      <p class="cs-wsv1-check-progress">Checklist completion: ${completion}%</p>
      <div class="cs-wsv1-checklist">
        ${checklist.map((item, idx) => {
          const key = checklistKey(idx, item);
          return `
            <label class="cs-wsv1-check-item">
              <input type="checkbox" data-action="check-item" data-key="${escapeHtml(key)}" ${state.checklistState[key] ? 'checked' : ''} />
              <span>${escapeHtml(item)}</span>
            </label>
          `;
        }).join('')}
      </div>

      <div class="cs-wsv1-panel">
        <h3>Long sentences (more than 25 words)</h3>
        <div class="cs-wsv1-alert-list">
          ${analysis.longSentences.length
            ? analysis.longSentences.map((line) => `<div class="cs-wsv1-alert-card cs-wsv1-alert-amber">${escapeHtml(line)}</div>`).join('')
            : '<p class="cs-wsv1-notice">No long sentences found.</p>'}
        </div>
      </div>

      <div class="cs-wsv1-panel">
        <h3>Repeated words (6+ times)</h3>
        <div class="cs-wsv1-chip-row">
          ${analysis.repeatedWords.length
            ? analysis.repeatedWords.map((item) => `<span class="cs-wsv1-word-chip">${escapeHtml(item.word)} x${item.count}</span>`).join('')
            : '<p class="cs-wsv1-notice">No repeated words above threshold.</p>'}
        </div>
      </div>

      <div class="cs-wsv1-panel">
        <h3>Missing end punctuation by line</h3>
        <div class="cs-wsv1-alert-list">
          ${analysis.missingPunctuation.length
            ? analysis.missingPunctuation.map((item) => `<div class="cs-wsv1-alert-card cs-wsv1-alert-gray">Line ${item.line}: ${escapeHtml(item.text)}</div>`).join('')
            : '<p class="cs-wsv1-notice">Line endings look complete.</p>'}
        </div>
      </div>

      <div class="cs-wsv1-panel">
        <h3>Fix-it suggestions</h3>
        <div class="cs-wsv1-alert-list">
          <div class="cs-wsv1-alert-card cs-wsv1-alert-gray">Try adding a transition: "For example," "Also," "Because of this,"</div>
          <div class="cs-wsv1-alert-card cs-wsv1-alert-gray">Split one long sentence into two shorter sentences.</div>
          <div class="cs-wsv1-alert-card cs-wsv1-alert-gray">Swap repeated words for stronger choices.</div>
        </div>
      </div>
    `;

    panel.querySelectorAll('[data-action="check-item"]').forEach((el) => {
      el.addEventListener('change', () => {
        const key = String(el.getAttribute('data-key') || '');
        if (!key) return;
        state.checklistState[key] = !!el.checked;
        const nextCompletion = checklistCompletion(checklistForBand(state.gradeBand));
        maybeCelebrateChecklistCompletion(nextCompletion);
        persistActive();
        renderReviseTab(panel);
      });
    });
  }

  function renderPublishTab(panel) {
    const metrics = analyzeMetrics(state.draftText);
    const checklist = checklistForBand(state.gradeBand);
    const checklistScore = checklistCompletion(checklist);

    panel.innerHTML = `
      <h3>Publish</h3>
      <p>Finalize your writing and export for students and teachers.</p>
      <div class="cs-wsv1-form-grid">
        <div class="cs-wsv1-form-row">
          <label for="publish_title">Title</label>
          <input id="publish_title" class="cs-wsv1-input" type="text" value="${escapeHtml(state.title)}" placeholder="Title" />
        </div>
        <div class="cs-wsv1-form-row">
          <label for="publish_author">Author (optional)</label>
          <input id="publish_author" class="cs-wsv1-input" type="text" value="${escapeHtml(state.author)}" placeholder="Author" />
        </div>
      </div>

      <div class="cs-wsv1-stats-grid">
        <div class="cs-wsv1-stat"><span>Word count</span><strong>${metrics.wordCount}</strong></div>
        <div class="cs-wsv1-stat"><span>Checklist score</span><strong>${checklistScore}%</strong></div>
      </div>

      <div class="cs-wsv1-actions">
        <button class="cs-wsv1-btn" type="button" data-action="save-local">Save local</button>
        <button class="cs-wsv1-btn" type="button" data-action="export-txt">Download .txt</button>
        <button class="cs-wsv1-btn" type="button" data-action="export-html">Download .printable.html</button>
        <button class="cs-wsv1-btn cs-wsv1-btn-primary" type="button" data-action="export-csv">Teacher Summary CSV</button>
      </div>
    `;

    panel.querySelector('#publish_title')?.addEventListener('input', (event) => {
      state.title = String(event.target.value || '');
      persistActive();
    });
    panel.querySelector('#publish_author')?.addEventListener('input', (event) => {
      state.author = String(event.target.value || '');
      persistActive();
    });

    panel.querySelector('[data-action="save-local"]')?.addEventListener('click', () => {
      if (saveCurrentSession()) {
        celebrateWritingMilestone('Publish complete');
      }
      renderWorkspace();
    });
    panel.querySelector('[data-action="export-txt"]')?.addEventListener('click', () => {
      if (downloadTxt()) {
        celebrateWritingMilestone('Publish complete');
      }
      renderWorkspace();
    });
    panel.querySelector('[data-action="export-html"]')?.addEventListener('click', () => {
      if (downloadPrintableHtml()) {
        celebrateWritingMilestone('Publish complete');
      }
      renderWorkspace();
    });
    panel.querySelector('[data-action="export-csv"]')?.addEventListener('click', () => {
      if (downloadTeacherCsv()) {
        celebrateWritingMilestone('Publish complete');
      }
      renderWorkspace();
    });
  }

  function celebrateWritingMilestone(label = 'Completed') {
    if (!window.csDelight || typeof window.csDelight.awardStars !== 'function') return;
    window.csDelight.awardStars(3, { label });
  }

  function maybeCelebrateChecklistCompletion(completionPercent = 0) {
    const complete = Number(completionPercent) >= 100;
    if (complete && !state.checklistCelebrated) {
      state.checklistCelebrated = true;
      celebrateWritingMilestone('Checklist complete');
      return;
    }
    if (!complete && state.checklistCelebrated) {
      state.checklistCelebrated = false;
    }
  }

  function ensureOrganizerFields() {
    const organizer = ORGANIZERS[state.organizer];
    if (!organizer) return;
    organizer.fields.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(state.organizerFields, field.id)) {
        state.organizerFields[field.id] = '';
      }
    });
  }

  function planToText(organizer) {
    if (!organizer) return '';
    const lines = organizer.fields
      .map((field) => {
        const value = String(state.organizerFields[field.id] || '').trim();
        if (!value) return '';
        return `${field.label}: ${value}`;
      })
      .filter(Boolean);
    return lines.join('\n');
  }

  function analyzeMetrics(text) {
    const source = String(text || '').trim();
    if (!source) return { wordCount: 0, sentenceCount: 0, paragraphCount: 0 };
    const words = source.match(/[A-Za-z0-9']+/g) || [];
    const sentenceCount = (source.match(/[.!?]+/g) || []).length || source.split(/\n+/).filter((line) => line.trim()).length;
    const paragraphCount = source.split(/\n\s*\n/).filter((chunk) => chunk.trim()).length || 1;
    return { wordCount: words.length, sentenceCount, paragraphCount };
  }

  function analyzeRevision(text) {
    const source = String(text || '');
    const sentences = source.match(/[^.!?\n]+[.!?]?/g) || [];
    const longSentences = sentences
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => ((line.match(/[A-Za-z0-9']+/g) || []).length > 25));

    const counts = new Map();
    (source.toLowerCase().match(/[a-z']+/g) || []).forEach((word) => {
      counts.set(word, (counts.get(word) || 0) + 1);
    });
    const repeatedWords = Array.from(counts.entries())
      .filter((entry) => entry[1] >= 6)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => ({ word: entry[0], count: entry[1] }));

    const missingPunctuation = source
      .split('\n')
      .map((line, idx) => ({ line: idx + 1, text: line.trim() }))
      .filter((item) => item.text)
      .filter((item) => !/[.!?]["')\]]*$/.test(item.text));

    return { longSentences, repeatedWords, missingPunctuation };
  }

  function checklistForBand(bandId) {
    return CHECKLISTS[bandId] || CHECKLISTS.k2;
  }

  function checklistKey(idx, label) {
    return `${idx}_${slugify(label)}`;
  }

  function checklistCompletion(items) {
    const total = items.length || 1;
    const checked = items.filter((item, idx) => state.checklistState[checklistKey(idx, item)]).length;
    return Math.round((checked / total) * 100);
  }

  function summaryPayload() {
    const checklist = checklistForBand(state.gradeBand);
    const metrics = analyzeMetrics(state.draftText);
    const checklistScores = checklist
      .map((item, idx) => `${item}:${state.checklistState[checklistKey(idx, item)] ? '1' : '0'}`)
      .join(' | ');

    return {
      date: new Date().toISOString(),
      grade_band: labelForId(state.gradeBand, GRADE_BANDS),
      type: labelForId(state.writingType, WRITING_TYPES),
      organizer: ORGANIZERS[state.organizer]?.label || '',
      title: state.title,
      author: state.author,
      draft_text: state.draftText,
      word_count: metrics.wordCount,
      sentence_count: metrics.sentenceCount,
      paragraph_count: metrics.paragraphCount,
      checklist_completion_percent: checklistCompletion(checklist),
      checklist_scores: checklistScores,
      conference_focus: state.conferenceFocus,
      conference_notes: state.conferenceNotes,
      time_spent_minutes: Math.max(1, Math.round((Date.now() - state.startedAt) / 60000))
    };
  }

  function saveCurrentSession() {
    const key = `${SAVE_PREFIX}${Date.now()}`;
    const payload = summaryPayload();
    try {
      localStorage.setItem(key, JSON.stringify(payload));
      state.lastSavedKey = key;
      state.status = `Saved locally: ${key}`;
      persistActive();
      return true;
    } catch {
      state.status = 'Could not save locally on this device.';
      return false;
    }
  }

  function latestSavedKey() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith(SAVE_PREFIX)) keys.push(key);
      }
      keys.sort((a, b) => Number(b.slice(SAVE_PREFIX.length)) - Number(a.slice(SAVE_PREFIX.length)));
      return keys[0] || '';
    } catch {
      return '';
    }
  }

  function loadSavedSession(key) {
    const payload = safeParse(localStorage.getItem(key) || '');
    if (!payload || typeof payload !== 'object') {
      state.status = 'Saved session was not found.';
      render();
      return;
    }

    const gradeBand = idForLabel(payload.grade_band, GRADE_BANDS) || state.gradeBand || 'k2';
    const writingType = idForLabel(payload.type, WRITING_TYPES) || state.writingType || 'narrative';
    const organizer = idForOrganizerLabel(payload.organizer) || organizerOptionsForType(writingType)[0]?.id || 'web';

    state.workspaceStarted = true;
    state.wizardStep = 3;
    state.gradeBand = gradeBand;
    state.writingType = writingType;
    state.organizer = organizer;
    state.activeTab = 'plan';
    state.organizerFields = {};
    state.draftText = String(payload.draft_text || '');
    state.checklistState = parseChecklistScores(payload.checklist_scores);
    state.checklistCelebrated = checklistCompletion(checklistForBand(gradeBand)) >= 100;
    state.conferenceFocus = FEEDBACK_FOCUS.includes(payload.conference_focus) ? payload.conference_focus : FEEDBACK_FOCUS[0];
    state.conferenceNotes = String(payload.conference_notes || '');
    state.title = String(payload.title || '');
    state.author = String(payload.author || '');
    state.status = `Loaded session: ${key}`;
    ensureOrganizerFields();
    persistActive();
    renderWorkspace();
  }

  function parseChecklistScores(text) {
    const out = {};
    const source = String(text || '');
    if (!source) return out;
    source.split('|').forEach((part) => {
      const [rawLabel, rawVal] = part.split(':');
      const label = String(rawLabel || '').trim();
      const val = String(rawVal || '').trim();
      if (!label) return;
      const key = `${slugify(label)}`;
      if (val === '1') out[key] = true;
    });

    const checklist = checklistForBand(state.gradeBand);
    checklist.forEach((item, idx) => {
      const key = checklistKey(idx, item);
      const slug = slugify(item);
      if (out[slug]) out[key] = true;
      delete out[slug];
    });
    return out;
  }

  function downloadTxt() {
    const payload = summaryPayload();
    const text = [
      payload.title || 'Untitled writing',
      payload.author ? `Author: ${payload.author}` : '',
      `Grade band: ${payload.grade_band}`,
      `Type: ${payload.type}`,
      `Organizer: ${payload.organizer}`,
      '',
      payload.draft_text || '(No draft text yet)',
      '',
      `Conference focus: ${payload.conference_focus}`,
      `Conference notes: ${payload.conference_notes || 'None'}`
    ].filter(Boolean).join('\n');
    const ok = triggerDownload(`${slugify(payload.title || 'writing-studio')}.txt`, text, 'text/plain;charset=utf-8');
    state.status = ok ? 'Downloaded .txt export.' : 'Download unavailable on this device.';
    return ok;
  }

  function downloadPrintableHtml() {
    const payload = summaryPayload();
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(payload.title || 'Writing draft')}</title>
  <style>
    body { font-family: "Atkinson Hyperlegible", "Segoe UI", Arial, sans-serif; margin: 32px; color: #0f172a; }
    h1 { margin: 0 0 10px; }
    .meta { color: #334155; margin: 0 0 16px; }
    pre { white-space: pre-wrap; line-height: 1.55; font-size: 15px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(payload.title || 'Untitled writing')}</h1>
  <p class="meta">${payload.author ? `Author: ${escapeHtml(payload.author)} | ` : ''}${escapeHtml(payload.grade_band)} | ${escapeHtml(payload.type)}</p>
  <pre>${escapeHtml(payload.draft_text || '(No draft text yet)')}</pre>
</body>
</html>`;
    const ok = triggerDownload(`${slugify(payload.title || 'writing-studio')}.printable.html`, html, 'text/html;charset=utf-8');
    state.status = ok ? 'Downloaded printable HTML export.' : 'Download unavailable on this device.';
    return ok;
  }

  function downloadTeacherCsv() {
    const payload = summaryPayload();
    const headers = ['date', 'band', 'type', 'word_count', 'checklist_scores'];
    const row = [
      payload.date,
      payload.grade_band,
      payload.type,
      String(payload.word_count),
      payload.checklist_scores
    ];
    const csv = `${headers.join(',')}\n${row.map(csvEscape).join(',')}\n`;
    const ok = triggerDownload(`teacher-summary-${Date.now()}.csv`, csv, 'text/csv;charset=utf-8');
    state.status = ok ? 'Downloaded Teacher Summary CSV.' : 'Download unavailable on this device.';
    return ok;
  }

  function triggerDownload(filename, content, mimeType) {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch {
      state.status = 'Download unavailable on this device.';
      return false;
    }
  }

  function persistActive() {
    state.updatedAt = Date.now();
    try {
      localStorage.setItem(ACTIVE_KEY, JSON.stringify({ ...state }));
    } catch {}
  }

  function resetSession() {
    const keepTheme = localStorage.getItem(THEME_KEY);
    try {
      localStorage.removeItem(ACTIVE_KEY);
      if (keepTheme) localStorage.setItem(THEME_KEY, keepTheme);
    } catch {}
    const fresh = {
      wizardStep: 0,
      workspaceStarted: false,
      gradeBand: '',
      writingType: '',
      organizer: '',
      activeTab: 'plan',
      organizerFields: {},
      draftText: '',
      checklistState: {},
      conferenceFocus: FEEDBACK_FOCUS[0],
      conferenceNotes: '',
      title: '',
      author: '',
      startedAt: Date.now(),
      updatedAt: Date.now(),
      status: '',
      lastSavedKey: '',
      checklistCelebrated: false
    };
    Object.keys(fresh).forEach((key) => {
      state[key] = fresh[key];
    });
    render();
  }

  function isValidId(value, options) {
    return options.some((item) => item.id === String(value || ''));
  }

  function isValidOrganizerForType(organizer, type) {
    return (ORGANIZER_BY_TYPE[type] || []).includes(String(organizer || ''));
  }

  function labelForId(id, options) {
    const found = options.find((item) => item.id === id);
    return found ? found.label : '';
  }

  function idForLabel(label, options) {
    const raw = String(label || '').trim().toLowerCase();
    if (!raw) return '';
    const found = options.find((item) => item.label.toLowerCase() === raw);
    return found ? found.id : '';
  }

  function idForOrganizerLabel(label) {
    const raw = String(label || '').trim().toLowerCase();
    if (!raw) return '';
    const found = Object.values(ORGANIZERS).find((item) => item.label.toLowerCase() === raw);
    return found ? found.id : '';
  }

  function capitalize(value) {
    const text = String(value || '');
    return text ? text[0].toUpperCase() + text.slice(1) : '';
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, Math.round(n)));
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'writing';
  }

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function csvEscape(value) {
    const text = String(value || '');
    if (!/[",\n]/.test(text)) return text;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
