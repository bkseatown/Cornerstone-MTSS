(function () {
  const STORE_PREFIX = 'cs_sst_v1::';
  const ACTIVE_KEY = 'cs_sst_v1_active';
  const STEP_COUNT = 8;

  const STRENGTH_OPTIONS = [
    'Effort',
    'Participation',
    'Peer relationships',
    'Motivation',
    'Oral language',
    'Creativity',
    'Organization',
    'Other'
  ];

  const CONTEXT_OPTIONS = [
    'Whole group',
    'Small group',
    'Independent work',
    'Tests',
    'Transitions',
    'Homework',
    'Recess/Lunch',
    'Other'
  ];

  const DURATION_OPTIONS = [
    'Less than 2 weeks',
    '2-4 weeks',
    '1-2 months',
    '3+ months'
  ];

  const REVIEW_OPTIONS = ['2 weeks', '4 weeks', '6 weeks'];

  const CONCERN_AREAS = [
    'Academic (Reading)',
    'Academic (Math)',
    'Writing',
    'Attention/EF',
    'Behavior',
    'SEL',
    'Communication',
    'Attendance'
  ];

  const NEXT_STEP_OPTIONS = [
    'Learning Support consult',
    'EAL consult',
    'Counselor',
    'SLP',
    'Psych',
    'Admin',
    'Tier 2 group',
    'Tier 3 referral'
  ];

  const SUPPORT_CATALOG = [
    {
      category: 'UDL Access',
      items: [
        'Preferential seating',
        'Visual directions / anchor chart',
        'Chunking tasks',
        'Extra processing time',
        'Reduced copy load / provided notes'
      ]
    },
    {
      category: 'Instructional',
      items: [
        'Small-group reteach',
        'Pre-teach vocabulary',
        'Worked examples',
        'Guided practice checks',
        'Frequent feedback'
      ]
    },
    {
      category: 'Assessment',
      items: [
        'Extended time',
        'Alternative response format',
        'Fewer items / prioritized standards',
        'Oral read-aloud (as appropriate)'
      ]
    },
    {
      category: 'Regulation / SEL',
      items: [
        'Movement breaks',
        'Calm corner / reset routine',
        'Check-in/check-out',
        'Coping strategy menu'
      ]
    },
    {
      category: 'Home support',
      items: [
        'Home practice routine shared',
        'Parent check-in',
        'Translated materials (if needed)'
      ]
    }
  ];

  const root = document.getElementById('csSstRoot');
  if (!root) return;

  const state = buildDefaultState();
  hydrateFromStorage();
  render();

  function buildDefaultState() {
    return {
      step: 1,
      sessionKey: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      studentName: '',
      gradeBand: '',
      teacherName: '',
      concernArea: '',

      strengths: [],
      strengthsNotes: '',

      concernObserved: '',
      concernContexts: [],
      concernDuration: '',

      supports: buildSupportState(),

      dataReadingNote: '',
      dataMathNote: '',
      dataWritingNote: '',
      dataEvidenceNotes: '',

      communicationLog: [],
      commDraft: {
        date: todayDateValue(),
        method: 'email',
        summary: '',
        nextStep: ''
      },

      nextSteps: [],
      reviewTimeline: '',

      packetGeneratedAt: ''
    };
  }

  function buildSupportState() {
    const map = {};
    SUPPORT_CATALOG.forEach((group) => {
      group.items.forEach((item) => {
        const id = supportId(group.category, item);
        map[id] = {
          category: group.category,
          label: item,
          selected: false,
          startDate: '',
          frequency: '',
          helpfulness: '',
          notes: ''
        };
      });
    });
    return map;
  }

  function hydrateFromStorage() {
    try {
      const activeKey = String(localStorage.getItem(ACTIVE_KEY) || '').trim();
      if (!activeKey || !activeKey.startsWith(STORE_PREFIX)) return;
      const raw = localStorage.getItem(activeKey) || '';
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;

      const defaults = buildDefaultState();
      const merged = {
        ...defaults,
        ...parsed,
        supports: {
          ...defaults.supports,
          ...(parsed.supports && typeof parsed.supports === 'object' ? parsed.supports : {})
        },
        communicationLog: Array.isArray(parsed.communicationLog) ? parsed.communicationLog : [],
        commDraft: {
          ...defaults.commDraft,
          ...(parsed.commDraft && typeof parsed.commDraft === 'object' ? parsed.commDraft : {})
        }
      };

      Object.assign(state, merged);
      state.step = clampStep(Number(merged.step) || 1);
      state.sessionKey = activeKey;
    } catch {}
  }

  function persist() {
    state.updatedAt = new Date().toISOString();
    if (!state.sessionKey) {
      const slug = slugify(state.studentName);
      if (!slug) return;
      const stamp = Date.now();
      state.sessionKey = `${STORE_PREFIX}${slug}::${stamp}`;
    }
    try {
      localStorage.setItem(state.sessionKey, JSON.stringify(state));
      localStorage.setItem(ACTIVE_KEY, state.sessionKey);
    } catch {}
  }

  function render() {
    const stepTitle = getStepTitle(state.step);
    const helper = getStepHelper(state.step);
    root.innerHTML = `
      <section class="cs-sst-card">
        <header class="cs-sst-header">
          <div>
            <p class="cs-sst-eyebrow">SST / Student Concern Wizard</p>
            <h2>${escapeHtml(stepTitle)}</h2>
            <p class="cs-sst-helper">${escapeHtml(helper)}</p>
          </div>
          <button type="button" class="cs-sst-btn cs-sst-btn-quiet" data-action="start-over">Start over</button>
        </header>

        <div class="cs-sst-progress" aria-hidden="true">
          <span>Step ${state.step} of ${STEP_COUNT}</span>
        </div>

        <section class="cs-sst-step-content">
          ${renderStepBody()}
        </section>

        <footer class="cs-sst-footer">
          <button type="button" class="cs-sst-btn" data-action="back" ${state.step === 1 ? 'disabled' : ''}>Back</button>
          ${renderPrimaryButton()}
        </footer>
      </section>
    `;
    bindEvents();
  }

  function renderStepBody() {
    if (state.step === 1) return renderStepStudent();
    if (state.step === 2) return renderStepStrengths();
    if (state.step === 3) return renderStepConcern();
    if (state.step === 4) return renderStepSupports();
    if (state.step === 5) return renderStepDataEvidence();
    if (state.step === 6) return renderStepCommunication();
    if (state.step === 7) return renderStepPlan();
    return renderStepPacket();
  }

  function renderPrimaryButton() {
    if (state.step === 8) {
      return '<button type="button" class="cs-sst-btn cs-sst-btn-primary" data-action="download-packet">Download SST Packet (printable HTML)</button>';
    }
    const label = state.step === 7 ? 'Generate packet →' : 'Continue →';
    return `<button type="button" class="cs-sst-btn cs-sst-btn-primary" data-action="continue">${label}</button>`;
  }

  function renderStepStudent() {
    return `
      <div class="cs-sst-grid cs-sst-grid-2">
        <label class="cs-sst-field">
          <span>Student name</span>
          <input id="sst-student-name" class="cs-sst-input" type="text" value="${escapeHtml(state.studentName)}" />
        </label>
        <label class="cs-sst-field">
          <span>Grade band</span>
          <select id="sst-grade-band" class="cs-sst-select">
            ${['', 'K-2', '3-5', '6-8', '9-12'].map((value) => `<option value="${escapeHtml(value)}" ${state.gradeBand === value ? 'selected' : ''}>${value || 'Choose grade band'}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="cs-sst-grid cs-sst-grid-2">
        <label class="cs-sst-field">
          <span>Teacher name (optional)</span>
          <input id="sst-teacher-name" class="cs-sst-input" type="text" value="${escapeHtml(state.teacherName)}" />
        </label>
        <label class="cs-sst-field">
          <span>Primary concern area</span>
          <select id="sst-concern-area" class="cs-sst-select">
            <option value="">Choose area</option>
            ${CONCERN_AREAS.map((item) => `<option value="${escapeHtml(item)}" ${state.concernArea === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}
          </select>
        </label>
      </div>
      <p id="sst-step-status" class="cs-sst-note" role="status" aria-live="polite"></p>
    `;
  }

  function renderStepStrengths() {
    return `
      <div class="cs-sst-check-grid">
        ${STRENGTH_OPTIONS.map((item) => `
          <label class="cs-sst-check">
            <input type="checkbox" data-action="toggle-strength" value="${escapeHtml(item)}" ${state.strengths.includes(item) ? 'checked' : ''} />
            <span>${escapeHtml(item)}</span>
          </label>
        `).join('')}
      </div>
      <label class="cs-sst-field">
        <span>What is going well? (notes)</span>
        <textarea id="sst-strengths-notes" class="cs-sst-textarea">${escapeHtml(state.strengthsNotes)}</textarea>
      </label>
    `;
  }

  function renderStepConcern() {
    return `
      <label class="cs-sst-field">
        <span>What are you noticing?</span>
        <textarea id="sst-concern-observed" class="cs-sst-textarea">${escapeHtml(state.concernObserved)}</textarea>
      </label>
      <div class="cs-sst-label">When/where does it show up?</div>
      <div class="cs-sst-check-grid">
        ${CONTEXT_OPTIONS.map((item) => `
          <label class="cs-sst-check">
            <input type="checkbox" data-action="toggle-context" value="${escapeHtml(item)}" ${state.concernContexts.includes(item) ? 'checked' : ''} />
            <span>${escapeHtml(item)}</span>
          </label>
        `).join('')}
      </div>
      <label class="cs-sst-field">
        <span>How long has this been happening?</span>
        <select id="sst-concern-duration" class="cs-sst-select">
          <option value="">Choose duration</option>
          ${DURATION_OPTIONS.map((value) => `<option value="${escapeHtml(value)}" ${state.concernDuration === value ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}
        </select>
      </label>
      <p id="sst-step-status" class="cs-sst-note" role="status" aria-live="polite"></p>
    `;
  }

  function renderStepSupports() {
    return `
      <div class="cs-sst-stack">
        ${SUPPORT_CATALOG.map((group) => `
          <section class="cs-sst-support-group">
            <h3>${escapeHtml(group.category)}</h3>
            <div class="cs-sst-support-grid">
              ${group.items.map((item) => renderSupportItem(group.category, item)).join('')}
            </div>
          </section>
        `).join('')}
      </div>
    `;
  }

  function renderSupportItem(category, label) {
    const id = supportId(category, label);
    const entry = state.supports[id] || {
      category,
      label,
      selected: false,
      startDate: '',
      frequency: '',
      helpfulness: '',
      notes: ''
    };
    const selected = !!entry.selected;
    return `
      <article class="cs-sst-support-item ${selected ? 'cs-sst-support-item-active' : ''}">
        <label class="cs-sst-check">
          <input type="checkbox" data-action="toggle-support" data-support-id="${escapeHtml(id)}" ${selected ? 'checked' : ''} />
          <span>${escapeHtml(label)}</span>
        </label>
        ${selected ? `
          <div class="cs-sst-grid cs-sst-grid-3">
            <label class="cs-sst-field">
              <span>Start date</span>
              <input type="date" class="cs-sst-input" data-action="support-field" data-support-id="${escapeHtml(id)}" data-field="startDate" value="${escapeHtml(entry.startDate || '')}" />
            </label>
            <label class="cs-sst-field">
              <span>Frequency</span>
              <select class="cs-sst-select" data-action="support-field" data-support-id="${escapeHtml(id)}" data-field="frequency">
                ${['', 'daily', 'weekly'].map((value) => `<option value="${value}" ${entry.frequency === value ? 'selected' : ''}>${value ? value[0].toUpperCase() + value.slice(1) : 'Choose'}</option>`).join('')}
              </select>
            </label>
            <label class="cs-sst-field">
              <span>Did it help?</span>
              <select class="cs-sst-select" data-action="support-field" data-support-id="${escapeHtml(id)}" data-field="helpfulness">
                ${['', 'Not yet', 'Some', 'Yes'].map((value) => `<option value="${escapeHtml(value)}" ${entry.helpfulness === value ? 'selected' : ''}>${escapeHtml(value || 'Choose')}</option>`).join('')}
              </select>
            </label>
          </div>
          <label class="cs-sst-field">
            <span>Notes (optional)</span>
            <textarea class="cs-sst-textarea" data-action="support-field" data-support-id="${escapeHtml(id)}" data-field="notes">${escapeHtml(entry.notes || '')}</textarea>
          </label>
        ` : ''}
      </article>
    `;
  }

  function renderStepDataEvidence() {
    return `
      <div class="cs-sst-grid cs-sst-grid-3">
        <label class="cs-sst-field">
          <span>Reading note (optional)</span>
          <textarea id="sst-data-reading" class="cs-sst-textarea">${escapeHtml(state.dataReadingNote)}</textarea>
        </label>
        <label class="cs-sst-field">
          <span>Math note (optional)</span>
          <textarea id="sst-data-math" class="cs-sst-textarea">${escapeHtml(state.dataMathNote)}</textarea>
        </label>
        <label class="cs-sst-field">
          <span>Writing note (optional)</span>
          <textarea id="sst-data-writing" class="cs-sst-textarea">${escapeHtml(state.dataWritingNote)}</textarea>
        </label>
      </div>
      <div class="cs-sst-link-row">
        <a class="cs-sst-link-btn" href="progress-monitoring.html">Open Progress Monitoring</a>
        <a class="cs-sst-link-btn" href="teacher-report.html">Open Teacher Report</a>
        <a class="cs-sst-link-btn" href="writing-studio-v1.html">Open Writing Studio</a>
      </div>
      <label class="cs-sst-field">
        <span>Evidence links / notes (paste links or short notes)</span>
        <textarea id="sst-data-evidence" class="cs-sst-textarea">${escapeHtml(state.dataEvidenceNotes)}</textarea>
      </label>
    `;
  }

  function renderStepCommunication() {
    return `
      <div class="cs-sst-grid cs-sst-grid-4">
        <label class="cs-sst-field">
          <span>Date</span>
          <input id="sst-comm-date" class="cs-sst-input" type="date" value="${escapeHtml(state.commDraft.date || todayDateValue())}" />
        </label>
        <label class="cs-sst-field">
          <span>Method</span>
          <select id="sst-comm-method" class="cs-sst-select">
            ${['email', 'phone', 'in person'].map((method) => `<option value="${method}" ${state.commDraft.method === method ? 'selected' : ''}>${method}</option>`).join('')}
          </select>
        </label>
        <label class="cs-sst-field">
          <span>Summary</span>
          <input id="sst-comm-summary" class="cs-sst-input" type="text" value="${escapeHtml(state.commDraft.summary || '')}" />
        </label>
        <label class="cs-sst-field">
          <span>Next step</span>
          <input id="sst-comm-next" class="cs-sst-input" type="text" value="${escapeHtml(state.commDraft.nextStep || '')}" />
        </label>
      </div>
      <div class="cs-sst-footer-inline">
        <button type="button" class="cs-sst-btn" data-action="add-comm-entry">Add communication entry</button>
      </div>
      <p id="sst-step-status" class="cs-sst-note" role="status" aria-live="polite"></p>
      <div class="cs-sst-log-list">
        ${state.communicationLog.length ? state.communicationLog.map((entry, index) => `
          <article class="cs-sst-log-item">
            <p><strong>${escapeHtml(formatDateLabel(entry.date))}</strong> · ${escapeHtml(entry.method)}</p>
            <p>${escapeHtml(entry.summary)}</p>
            <p><strong>Next:</strong> ${escapeHtml(entry.nextStep || '-')}</p>
            <button type="button" class="cs-sst-btn cs-sst-btn-quiet" data-action="remove-comm-entry" data-index="${index}">Remove</button>
          </article>
        `).join('') : '<p class="cs-sst-note">No communication entries added yet.</p>'}
      </div>
    `;
  }

  function renderStepPlan() {
    return `
      <div class="cs-sst-label">What support do you want next?</div>
      <div class="cs-sst-check-grid">
        ${NEXT_STEP_OPTIONS.map((item) => `
          <label class="cs-sst-check">
            <input type="checkbox" data-action="toggle-next-step" value="${escapeHtml(item)}" ${state.nextSteps.includes(item) ? 'checked' : ''} />
            <span>${escapeHtml(item)}</span>
          </label>
        `).join('')}
      </div>
      <label class="cs-sst-field">
        <span>Review again in</span>
        <select id="sst-review-timeline" class="cs-sst-select">
          <option value="">Choose timeline</option>
          ${REVIEW_OPTIONS.map((value) => `<option value="${escapeHtml(value)}" ${state.reviewTimeline === value ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}
        </select>
      </label>
      <p id="sst-step-status" class="cs-sst-note" role="status" aria-live="polite"></p>
    `;
  }

  function renderStepPacket() {
    return `
      <section class="cs-sst-preview">
        ${buildPacketPreviewHtml()}
      </section>
      <div class="cs-sst-export-row">
        <button type="button" class="cs-sst-btn cs-sst-btn-primary" data-action="download-packet">Download SST Packet (printable HTML)</button>
        <button type="button" class="cs-sst-btn" data-action="download-csv">Download SST Summary CSV</button>
      </div>
      <p id="sst-step-status" class="cs-sst-note" role="status" aria-live="polite"></p>
    `;
  }

  function bindEvents() {
    root.querySelector('[data-action="start-over"]')?.addEventListener('click', () => {
      resetSession();
    });
    root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      state.step = clampStep(state.step - 1);
      persist();
      render();
    });
    root.querySelector('[data-action="continue"]')?.addEventListener('click', () => {
      syncVisibleFields();
      if (!validateCurrentStep()) return;
      if (state.step === 7) {
        state.packetGeneratedAt = new Date().toISOString();
      }
      state.step = clampStep(state.step + 1);
      persist();
      render();
    });
    root.querySelector('[data-action="download-packet"]')?.addEventListener('click', () => {
      syncVisibleFields();
      if (!state.packetGeneratedAt) state.packetGeneratedAt = new Date().toISOString();
      persist();
      downloadPacketHtml();
      setStatus('Packet HTML downloaded.');
    });
    root.querySelector('[data-action="download-csv"]')?.addEventListener('click', () => {
      syncVisibleFields();
      downloadPacketCsv();
      setStatus('SST summary CSV downloaded.');
    });
    root.querySelector('[data-action="add-comm-entry"]')?.addEventListener('click', () => {
      syncCommunicationDraft();
      const draft = state.commDraft;
      if (!draft.date || !draft.summary.trim()) {
        setStatus('Add at least date and summary to log communication.', true);
        return;
      }
      state.communicationLog.unshift({
        date: draft.date,
        method: draft.method || 'email',
        summary: draft.summary.trim(),
        nextStep: draft.nextStep.trim()
      });
      state.commDraft = {
        date: todayDateValue(),
        method: 'email',
        summary: '',
        nextStep: ''
      };
      persist();
      render();
      setStatus('Communication entry added.');
    });

    root.querySelectorAll('[data-action="remove-comm-entry"]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-index'));
        if (!Number.isFinite(index) || index < 0 || index >= state.communicationLog.length) return;
        state.communicationLog.splice(index, 1);
        persist();
        render();
      });
    });

    root.querySelectorAll('[data-action="toggle-strength"]').forEach((input) => {
      input.addEventListener('change', () => {
        const value = String(input.value || '');
        toggleArrayValue(state.strengths, value, input.checked);
        persist();
      });
    });
    root.querySelectorAll('[data-action="toggle-context"]').forEach((input) => {
      input.addEventListener('change', () => {
        const value = String(input.value || '');
        toggleArrayValue(state.concernContexts, value, input.checked);
        persist();
      });
    });
    root.querySelectorAll('[data-action="toggle-next-step"]').forEach((input) => {
      input.addEventListener('change', () => {
        const value = String(input.value || '');
        toggleArrayValue(state.nextSteps, value, input.checked);
        persist();
      });
    });
    root.querySelectorAll('[data-action="toggle-support"]').forEach((input) => {
      input.addEventListener('change', () => {
        const supportKey = String(input.getAttribute('data-support-id') || '');
        if (!supportKey || !state.supports[supportKey]) return;
        state.supports[supportKey].selected = !!input.checked;
        if (!input.checked) {
          state.supports[supportKey].startDate = '';
          state.supports[supportKey].frequency = '';
          state.supports[supportKey].helpfulness = '';
          state.supports[supportKey].notes = '';
        }
        persist();
        render();
      });
    });
    root.querySelectorAll('[data-action="support-field"]').forEach((control) => {
      control.addEventListener('input', () => {
        const supportKey = String(control.getAttribute('data-support-id') || '');
        const field = String(control.getAttribute('data-field') || '');
        if (!supportKey || !field || !state.supports[supportKey]) return;
        state.supports[supportKey][field] = String(control.value || '');
        persist();
      });
      control.addEventListener('change', () => {
        const supportKey = String(control.getAttribute('data-support-id') || '');
        const field = String(control.getAttribute('data-field') || '');
        if (!supportKey || !field || !state.supports[supportKey]) return;
        state.supports[supportKey][field] = String(control.value || '');
        persist();
      });
    });

    root.querySelectorAll('input, textarea, select').forEach((control) => {
      control.addEventListener('change', () => {
        syncVisibleFields();
        persist();
      });
      if (control.tagName === 'TEXTAREA' || control.tagName === 'INPUT') {
        control.addEventListener('input', () => {
          syncVisibleFields();
          persist();
        });
      }
    });
  }

  function syncVisibleFields() {
    const studentNameEl = root.querySelector('#sst-student-name');
    if (studentNameEl) state.studentName = String(studentNameEl.value || '').trim();
    const gradeBandEl = root.querySelector('#sst-grade-band');
    if (gradeBandEl) state.gradeBand = String(gradeBandEl.value || '');
    const teacherNameEl = root.querySelector('#sst-teacher-name');
    if (teacherNameEl) state.teacherName = String(teacherNameEl.value || '').trim();
    const concernAreaEl = root.querySelector('#sst-concern-area');
    if (concernAreaEl) state.concernArea = String(concernAreaEl.value || '');

    const strengthsNotesEl = root.querySelector('#sst-strengths-notes');
    if (strengthsNotesEl) state.strengthsNotes = String(strengthsNotesEl.value || '').trim();

    const concernObservedEl = root.querySelector('#sst-concern-observed');
    if (concernObservedEl) state.concernObserved = String(concernObservedEl.value || '').trim();
    const concernDurationEl = root.querySelector('#sst-concern-duration');
    if (concernDurationEl) state.concernDuration = String(concernDurationEl.value || '');

    const dataReadingEl = root.querySelector('#sst-data-reading');
    if (dataReadingEl) state.dataReadingNote = String(dataReadingEl.value || '').trim();
    const dataMathEl = root.querySelector('#sst-data-math');
    if (dataMathEl) state.dataMathNote = String(dataMathEl.value || '').trim();
    const dataWritingEl = root.querySelector('#sst-data-writing');
    if (dataWritingEl) state.dataWritingNote = String(dataWritingEl.value || '').trim();
    const dataEvidenceEl = root.querySelector('#sst-data-evidence');
    if (dataEvidenceEl) state.dataEvidenceNotes = String(dataEvidenceEl.value || '').trim();

    const reviewTimelineEl = root.querySelector('#sst-review-timeline');
    if (reviewTimelineEl) state.reviewTimeline = String(reviewTimelineEl.value || '');

    syncCommunicationDraft();
  }

  function syncCommunicationDraft() {
    const dateEl = root.querySelector('#sst-comm-date');
    const methodEl = root.querySelector('#sst-comm-method');
    const summaryEl = root.querySelector('#sst-comm-summary');
    const nextEl = root.querySelector('#sst-comm-next');
    if (!dateEl && !methodEl && !summaryEl && !nextEl) return;
    state.commDraft = {
      date: String(dateEl?.value || todayDateValue()),
      method: String(methodEl?.value || 'email'),
      summary: String(summaryEl?.value || ''),
      nextStep: String(nextEl?.value || '')
    };
  }

  function validateCurrentStep() {
    if (state.step === 1) {
      if (!state.studentName || !state.gradeBand || !state.concernArea) {
        setStatus('Complete student name, grade band, and primary concern area.', true);
        return false;
      }
      persist();
      return true;
    }
    if (state.step === 3) {
      if (!state.concernObserved) {
        setStatus('Add a brief observable concern description to continue.', true);
        return false;
      }
      return true;
    }
    if (state.step === 7) {
      if (!state.reviewTimeline) {
        setStatus('Choose a review timeline before generating the packet.', true);
        return false;
      }
      return true;
    }
    return true;
  }

  function buildPacketPreviewHtml() {
    const selectedSupports = Object.values(state.supports).filter((entry) => entry.selected);
    return `
      <h3>SST Packet Preview</h3>
      <div class="cs-sst-preview-grid">
        <article class="cs-sst-preview-card">
          <h4>Student + context</h4>
          <p><strong>Student:</strong> ${escapeHtml(state.studentName || '-')}</p>
          <p><strong>Grade band:</strong> ${escapeHtml(state.gradeBand || '-')}</p>
          <p><strong>Teacher:</strong> ${escapeHtml(state.teacherName || '-')}</p>
          <p><strong>Concern area:</strong> ${escapeHtml(state.concernArea || '-')}</p>
        </article>
        <article class="cs-sst-preview-card">
          <h4>Strengths</h4>
          <p>${escapeHtml(state.strengths.join(', ') || '-')}</p>
          <p>${escapeHtml(state.strengthsNotes || '-')}</p>
        </article>
      </div>

      <article class="cs-sst-preview-card">
        <h4>Concern description</h4>
        <p><strong>Observed:</strong> ${escapeHtml(state.concernObserved || '-')}</p>
        <p><strong>Contexts:</strong> ${escapeHtml(state.concernContexts.join(', ') || '-')}</p>
        <p><strong>Duration:</strong> ${escapeHtml(state.concernDuration || '-')}</p>
      </article>

      <article class="cs-sst-preview-card">
        <h4>Supports tried</h4>
        <div class="cs-sst-table-wrap">
          <table class="cs-sst-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Support</th>
                <th>Start date</th>
                <th>Frequency</th>
                <th>Helpfulness</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${selectedSupports.length ? selectedSupports.map((entry) => `
                <tr>
                  <td>${escapeHtml(entry.category)}</td>
                  <td>${escapeHtml(entry.label)}</td>
                  <td>${escapeHtml(entry.startDate || '-')}</td>
                  <td>${escapeHtml(entry.frequency || '-')}</td>
                  <td>${escapeHtml(entry.helpfulness || '-')}</td>
                  <td>${escapeHtml(entry.notes || '-')}</td>
                </tr>
              `).join('') : '<tr><td colspan="6">No supports selected yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </article>

      <article class="cs-sst-preview-card">
        <h4>Data & evidence notes</h4>
        <p><strong>Reading:</strong> ${escapeHtml(state.dataReadingNote || '-')}</p>
        <p><strong>Math:</strong> ${escapeHtml(state.dataMathNote || '-')}</p>
        <p><strong>Writing:</strong> ${escapeHtml(state.dataWritingNote || '-')}</p>
        <p><strong>Evidence notes:</strong> ${escapeHtml(state.dataEvidenceNotes || '-')}</p>
      </article>

      <article class="cs-sst-preview-card">
        <h4>Parent/Guardian communication log</h4>
        <div class="cs-sst-table-wrap">
          <table class="cs-sst-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Summary</th>
                <th>Next step</th>
              </tr>
            </thead>
            <tbody>
              ${state.communicationLog.length ? state.communicationLog.map((entry) => `
                <tr>
                  <td>${escapeHtml(formatDateLabel(entry.date))}</td>
                  <td>${escapeHtml(entry.method)}</td>
                  <td>${escapeHtml(entry.summary)}</td>
                  <td>${escapeHtml(entry.nextStep || '-')}</td>
                </tr>
              `).join('') : '<tr><td colspan="4">No communication entries added.</td></tr>'}
            </tbody>
          </table>
        </div>
      </article>

      <article class="cs-sst-preview-card">
        <h4>Next steps + review timeline</h4>
        <p><strong>Requested supports:</strong> ${escapeHtml(state.nextSteps.join(', ') || '-')}</p>
        <p><strong>Review timeline:</strong> ${escapeHtml(state.reviewTimeline || '-')}</p>
      </article>
    `;
  }

  function downloadPacketHtml() {
    const generatedAt = new Date().toLocaleString();
    const titleName = state.studentName || 'Student';
    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SST Packet - ${escapeHtml(titleName)}</title>
  <style>
    body { font-family: "Atkinson Hyperlegible", "Segoe UI", Arial, sans-serif; margin: 1rem; color: #0f172a; }
    h1, h2, h3 { margin: 0 0 .5rem; line-height: 1.25; }
    p { margin: 0 0 .4rem; line-height: 1.4; }
    .meta, .panel { border: 1px solid #cbd5e1; border-radius: .75rem; padding: .75rem; margin-bottom: .75rem; background: #fff; }
    table { width: 100%; border-collapse: collapse; margin-top: .35rem; }
    th, td { border: 1px solid #cbd5e1; text-align: left; vertical-align: top; padding: .42rem; font-size: .9rem; }
    th { background: #eef2ff; }
    .actions { margin-bottom: .75rem; }
    button { border: 1px solid #cbd5e1; border-radius: .6rem; background: #eef2ff; padding: .45rem .7rem; font-weight: 700; }
    @media print { .actions { display: none; } body { margin: .5rem; } }
  </style>
</head>
<body>
  <h1>SST Packet</h1>
  <p>Generated: ${escapeHtml(generatedAt)}</p>
  <div class="actions"><button onclick="window.print()">Print</button></div>
  <div class="meta">
    <p><strong>Student:</strong> ${escapeHtml(state.studentName || '-')}</p>
    <p><strong>Grade band:</strong> ${escapeHtml(state.gradeBand || '-')}</p>
    <p><strong>Teacher:</strong> ${escapeHtml(state.teacherName || '-')}</p>
    <p><strong>Primary concern area:</strong> ${escapeHtml(state.concernArea || '-')}</p>
  </div>
  <div class="panel">
    ${buildPacketPreviewHtml()}
  </div>
</body>
</html>
    `.trim();
    const stamp = todayDateValue().replace(/-/g, '');
    const filename = `sst-packet-${slugify(state.studentName || 'student') || 'student'}-${stamp}.html`;
    downloadBlob(filename, html, 'text/html;charset=utf-8;');
  }

  function downloadPacketCsv() {
    const selectedSupports = Object.values(state.supports).filter((entry) => entry.selected);
    const contacts = state.communicationLog.slice();
    const headers = [
      'row_type',
      'student',
      'grade_band',
      'teacher_name',
      'concern_area',
      'strengths',
      'concern_observed',
      'concern_contexts',
      'concern_duration',
      'next_steps',
      'review_timeline',
      'support_category',
      'support_name',
      'support_start_date',
      'support_frequency',
      'support_helpfulness',
      'support_notes',
      'parent_contact_date',
      'parent_contact_method',
      'parent_contact_summary',
      'parent_contact_next_step',
      'reading_note',
      'math_note',
      'writing_note',
      'evidence_notes'
    ];

    const rows = [];
    rows.push([
      'summary',
      state.studentName,
      state.gradeBand,
      state.teacherName,
      state.concernArea,
      state.strengths.join(' | '),
      state.concernObserved,
      state.concernContexts.join(' | '),
      state.concernDuration,
      state.nextSteps.join(' | '),
      state.reviewTimeline,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      state.dataReadingNote,
      state.dataMathNote,
      state.dataWritingNote,
      state.dataEvidenceNotes
    ]);

    selectedSupports.forEach((entry) => {
      rows.push([
        'support',
        state.studentName,
        state.gradeBand,
        state.teacherName,
        state.concernArea,
        '',
        '',
        '',
        '',
        '',
        '',
        entry.category,
        entry.label,
        entry.startDate || '',
        entry.frequency || '',
        entry.helpfulness || '',
        entry.notes || '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]);
    });

    contacts.forEach((entry) => {
      rows.push([
        'parent_contact',
        state.studentName,
        state.gradeBand,
        state.teacherName,
        state.concernArea,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        entry.date || '',
        entry.method || '',
        entry.summary || '',
        entry.nextStep || '',
        '',
        '',
        '',
        ''
      ]);
    });

    const csv = [headers.join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');
    const stamp = todayDateValue().replace(/-/g, '');
    const filename = `sst-summary-${slugify(state.studentName || 'student') || 'student'}-${stamp}.csv`;
    downloadBlob(filename, csv, 'text/csv;charset=utf-8;');
  }

  function resetSession() {
    const existingKey = state.sessionKey;
    const fresh = buildDefaultState();
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, fresh);
    try {
      if (existingKey) localStorage.removeItem(existingKey);
      localStorage.removeItem(ACTIVE_KEY);
    } catch {}
    render();
  }

  function getStepTitle(step) {
    if (step === 1) return 'Student + context';
    if (step === 2) return "Strengths + what's going well";
    if (step === 3) return 'Define the concern';
    if (step === 4) return 'Supports tried (UDL/MTSS)';
    if (step === 5) return 'Data & evidence';
    if (step === 6) return 'Parent/Guardian communication log';
    if (step === 7) return 'Plan + next steps';
    return 'Packet preview + exports';
  }

  function getStepHelper(step) {
    if (step === 1) return 'Start with clear student details and one concern focus.';
    if (step === 2) return 'Anchor the record in strengths first.';
    if (step === 3) return 'Keep language factual, observable, and brief.';
    if (step === 4) return 'Capture supports tried, frequency, and what helped.';
    if (step === 5) return 'Add notes and open supporting tools when needed.';
    if (step === 6) return 'Log communication with neutral, factual summaries.';
    if (step === 7) return 'Set next supports and a review timeline.';
    return 'Review the full packet and export for SST planning.';
  }

  function supportId(category, label) {
    return `${slugify(category)}__${slugify(label)}`;
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function toggleArrayValue(collection, value, enabled) {
    const index = collection.indexOf(value);
    if (enabled && index === -1) collection.push(value);
    if (!enabled && index >= 0) collection.splice(index, 1);
  }

  function setStatus(message, isWarn) {
    const el = root.querySelector('#sst-step-status');
    if (!el) return;
    el.textContent = String(message || '');
    el.classList.toggle('cs-sst-note-warn', !!isWarn);
  }

  function clampStep(value) {
    return Math.max(1, Math.min(STEP_COUNT, Number(value) || 1));
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function todayDateValue() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDateLabel(raw) {
    const text = String(raw || '').trim();
    if (!text) return '-';
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return text;
    return date.toLocaleDateString();
  }

  function csvEscape(value) {
    const text = String(value === undefined || value === null ? '' : value);
    if (!/[",\n]/.test(text)) return text;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadBlob(filename, contents, type) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }
})();
