(function () {
  const DEFAULT_AUDIENCE = ['Student', 'Parent', 'Teacher', 'LS', 'EAL', 'SLP', 'Counselor', 'Psych', 'Admin'];
  const STATUS_LABELS = {
    planned: 'Planned',
    building: 'Building',
    testing: 'Testing'
  };

  const MODULES = {
    'writing-studio': {
      title: 'Writing Studio',
      subtitle: 'Plan -> Draft -> Revise -> Publish (with scaffolds)',
      alignment: 'Aligned with Step Up to Writing (SUTW) language and structures.',
      what: [
        'Guide writing from plan to publish with one clear phase at a time.',
        'Use grade-band frames, sentence stems, and revision missions without AI generation.',
        'Track progress in teacher and parent-ready snapshots.'
      ],
      audience: DEFAULT_AUDIENCE,
      now: [
        { label: 'Start with Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open current Write and Build', href: 'writing.html' },
        { label: 'Open Intervention Studio', href: 'plan-it.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Scaffolded planner and chunked draft workflow' },
        { status: 'building', text: 'Step Up checklist and revision missions' },
        { status: 'testing', text: 'Teacher snapshot and parent summary export' },
        { status: 'planned', text: 'Role-based assignment and progress views' }
      ],
      modes: [
        { title: 'Plan (Graphic Organizers)', copy: 'Idea web, frames, and narrative structures.' },
        { title: 'Draft (Sentence and Paragraph Frames)', copy: 'Write one chunk at a time with supports.' },
        { title: 'Revise (Clarity, Organization, Evidence)', copy: 'Mission-based improvements with clear targets.' },
        { title: 'Publish (Formatting and Sharing)', copy: 'Clean final copy and report-friendly output.' }
      ],
      stepUpItems: [
        'Topic sentence',
        'Detail sentences',
        'Conclusion',
        'Transitions / power words',
        'Elaboration',
        'Evidence'
      ]
    },
    'student-toolkit': {
      title: 'Student Toolkit',
      subtitle: 'Practice path, streaks, and strategy badges',
      what: [
        'Show one daily starting point from Quick Check.',
        'Keep practice focused with short activity tiles and streak tracking.',
        'Surface strategy badges that celebrate growth and persistence.'
      ],
      audience: ['Student', 'Teacher', 'Parent'],
      now: [
        { label: 'Start Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open Word Quest', href: 'word-quest.html' },
        { label: 'Open Number Sense Lab', href: 'number-sense.html' }
      ],
      roadmap: [
        { status: 'building', text: 'My Path panel with one-click resume' },
        { status: 'testing', text: 'Badge tracker and motivation prompts' },
        { status: 'planned', text: 'Toolkit share card for home and school' }
      ],
      topChallenges: ['Decoding stamina', 'Math confidence', 'Self-monitoring']
    },
    'parent-toolkit': {
      title: 'Parent Toolkit',
      subtitle: 'Clear home routines with school-aligned language',
      what: [
        'Explain progress in plain language with one next step for tonight.',
        'Provide Bridges / Illustrative Math-aligned strategy explainers.',
        'Offer guidance for screen time, phones, and AI safety talks at home.'
      ],
      audience: ['Parent', 'Student', 'Teacher'],
      now: [
        { label: 'Start from Home Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'View Parent Communication Report', href: 'teacher-report.html?role=parent#report-parent-communication' },
        { label: 'Open Plan-It routines', href: 'plan-it.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Math at home visual explainers' },
        { status: 'building', text: 'Conversation starters and connection activities' },
        { status: 'planned', text: 'Weekly parent progress summary print view' }
      ],
      topChallenges: ['Homework stress', 'Screen-time routines', 'School-home alignment']
    },
    'school-team-toolkit': {
      title: 'School Team Toolkit Hub',
      subtitle: 'Role pathways for intervention, support, and MTSS leadership',
      what: [
        'Give each school role a focused toolkit with practical next actions.',
        'Connect Quick Check outcomes to role-specific workflows.',
        'Provide printable, meeting-ready snapshots for teams.'
      ],
      audience: ['Teacher', 'LS', 'EAL', 'SLP', 'Counselor', 'Psych', 'Admin'],
      now: [
        { label: 'Teacher Toolkit (Coming Soon)', href: 'teacher-toolkit.html' },
        { label: 'Learning Support Toolkit (Coming Soon)', href: 'learning-support-toolkit.html' },
        { label: 'EAL Toolkit (Coming Soon)', href: 'eal-toolkit.html' },
        { label: 'SLP Toolkit (Coming Soon)', href: 'slp-toolkit.html' },
        { label: 'Counselor Toolkit (Coming Soon)', href: 'counselor-toolkit.html' },
        { label: 'Psychologist Toolkit (Coming Soon)', href: 'psychologist-toolkit.html' },
        { label: 'Administrator Toolkit (Coming Soon)', href: 'administrator-toolkit.html' },
        { label: 'Dean Toolkit (Coming Soon)', href: 'dean-toolkit.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Role-specific quick action boards' },
        { status: 'testing', text: 'Cross-role handoff notes and timeline hooks' },
        { status: 'planned', text: 'Shared intervention impact snapshots' }
      ]
    },
    'teacher-toolkit': {
      title: 'Teacher Toolkit',
      subtitle: 'Fast grouping and instructional next moves',
      what: [
        'Suggest small groups from Quick Check and writing signals.',
        'Surface warmup and cooldown bank aligned to reading and number routines.',
        'Generate concise progress evidence for family communication.'
      ],
      audience: ['Teacher', 'LS', 'Admin'],
      now: [
        { label: 'Run Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open Impact Dashboard', href: 'teacher-report.html?role=teacher' },
        { label: 'Open Word Quest', href: 'word-quest.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Group builder from common needs' },
        { status: 'building', text: 'Quick lesson launch cards' },
        { status: 'planned', text: 'Auto-drafted parent notes' }
      ],
      topChallenges: ['Grouping quickly', 'Intervention planning', 'Family communication']
    },
    'learning-support-toolkit': {
      title: 'Learning Support Toolkit',
      subtitle: 'Progress monitoring and intervention planning hub',
      what: [
        'Track progress over time with clear intervention snapshots.',
        'Store goals and monitoring cadence in one place.',
        'Offer scaffold and accommodation menus by task type.'
      ],
      audience: ['LS', 'Teacher', 'Admin'],
      now: [
        { label: 'Start from Home Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open Impact Dashboard', href: 'teacher-report.html?role=learning-support' },
        { label: 'Open Intervention Studio', href: 'plan-it.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Goal bank and progress schedule cards' },
        { status: 'testing', text: 'Quick data export presets' },
        { status: 'planned', text: 'Intervention fidelity prompts' }
      ],
      topChallenges: ['Progress monitoring', 'Goal tracking', 'Scaffold consistency']
    },
    'eal-toolkit': {
      title: 'EAL Toolkit',
      subtitle: 'Language access supports across literacy and classroom tasks',
      what: [
        'Provide vocabulary and oral rehearsal supports.',
        'Use translation and voice settings for access without overload.',
        'Offer sentence frames that keep student voice while reducing barriers.'
      ],
      audience: ['EAL', 'Teacher', 'Parent'],
      now: [
        { label: 'Start from Home Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open Word Quest with language support', href: 'word-quest.html' },
        { label: 'Open Fluency Sprint', href: 'fluency.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Language support packs by grade band' },
        { status: 'testing', text: 'Sentence frame playlists' },
        { status: 'planned', text: 'Family language bridge notes' }
      ],
      topChallenges: ['Academic vocabulary', 'Oral rehearsal', 'Language transfer']
    },
    'slp-toolkit': {
      title: 'SLP Toolkit',
      subtitle: 'Speech, language, and communication support workflows',
      what: [
        'Support articulation practice, phoneme production, and fluency routines.',
        'Track pragmatic language, conversation skills, and social communication cues.',
        'Provide listening comprehension and following directions supports.'
      ],
      audience: ['SLP', 'Teacher', 'Parent'],
      now: [
        { label: 'Start from Home Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open Sound Lab', href: 'word-quest.html?soundlab=1' },
        { label: 'Open Fluency Sprint', href: 'fluency.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Articulation tracker and consistency log' },
        { status: 'building', text: 'Communication mini-labs and prompts' },
        { status: 'planned', text: 'Session summary export for team meetings' }
      ],
      topChallenges: ['Phoneme production', 'Pragmatic language', 'Listening and directions']
    },
    'counselor-toolkit': {
      title: 'Counselor Toolkit',
      subtitle: 'SEL check-ins and practical coping supports',
      what: [
        'Run SEL check-ins with stress and wellbeing indicators.',
        'Offer friendship, conflict repair, and school-safe scenario routines.',
        'Include digital wellbeing guidance for phones, AI safety, and screen habits.'
      ],
      audience: ['Counselor', 'Parent', 'Teacher'],
      now: [
        { label: 'Start from Home Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open Intervention Studio', href: 'plan-it.html' },
        { label: 'Open Impact Dashboard', href: 'teacher-report.html?role=counselor' }
      ],
      roadmap: [
        { status: 'building', text: 'Wellbeing pulse and triage prompts' },
        { status: 'testing', text: 'Conflict repair micro-lessons' },
        { status: 'planned', text: 'Family conversation guide export' }
      ],
      topChallenges: ['Anxiety and stress', 'Peer conflict', 'Digital wellbeing']
    },
    'psychologist-toolkit': {
      title: 'Psychologist Toolkit',
      subtitle: 'EF and behavior evidence workflows',
      what: [
        'Capture executive function screeners and behavior observation notes.',
        'Track intervention impact and learning profile patterns over time.',
        'Support attention and sensory regulation planning.'
      ],
      audience: ['Psych', 'LS', 'Admin'],
      now: [
        { label: 'Start from Home Quick Check', href: 'index.html#home-onboarding-wizard' },
        { label: 'Open Impact Dashboard', href: 'teacher-report.html?role=psychologist' },
        { label: 'Open Intervention Studio', href: 'plan-it.html' }
      ],
      roadmap: [
        { status: 'building', text: 'EF screener dashboard and templates' },
        { status: 'building', text: 'Behavior observation and trend views' },
        { status: 'planned', text: 'Intervention recommendation bundles' }
      ],
      topChallenges: ['Executive function', 'Behavior observations', 'Attention supports']
    },
    'administrator-toolkit': {
      title: 'Administrator Toolkit',
      subtitle: 'MTSS overview and intervention impact snapshots',
      what: [
        'Show school-wide trends across literacy, numeracy, SEL, and behavior.',
        'Track tier movement and intervention fidelity prompts.',
        'Generate printable snapshot reports for meetings.'
      ],
      audience: ['Admin', 'Dean', 'Teacher'],
      now: [
        { label: 'Open Impact Dashboard', href: 'teacher-report.html?role=admin' },
        { label: 'Open School Team Hub', href: 'school-team-toolkit.html' },
        { label: 'Run Home Quick Check flow', href: 'index.html#home-onboarding-wizard' }
      ],
      roadmap: [
        { status: 'building', text: 'Tier distribution and hotspot view' },
        { status: 'testing', text: 'Fidelity and movement timeline cards' },
        { status: 'planned', text: 'Meeting packet one-click export' }
      ],
      topChallenges: ['MTSS visibility', 'Resource planning', 'Intervention impact']
    },
    'dean-toolkit': {
      title: 'Dean Toolkit',
      subtitle: 'Student support trends and intervention follow-through',
      what: [
        'Track campus-level support signals and student risk patterns.',
        'Coordinate intervention actions across teacher and support teams.',
        'Prepare concise follow-up notes for families and leadership.'
      ],
      audience: ['Dean', 'Admin', 'Counselor'],
      now: [
        { label: 'Open Impact Dashboard', href: 'teacher-report.html?role=dean' },
        { label: 'Open School Team Hub', href: 'school-team-toolkit.html' },
        { label: 'Open Intervention Studio', href: 'plan-it.html' }
      ],
      roadmap: [
        { status: 'building', text: 'Dean daily support queue' },
        { status: 'testing', text: 'Intervention follow-through tracker' },
        { status: 'planned', text: 'Leadership snapshot export' }
      ],
      topChallenges: ['Student support coordination', 'Tier follow-through', 'Meeting readiness']
    }
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeStatus(status) {
    const raw = String(status || '').trim().toLowerCase();
    return STATUS_LABELS[raw] ? raw : 'planned';
  }

  function fillList(element, items, renderItem) {
    if (!(element instanceof HTMLElement)) return;
    element.innerHTML = (Array.isArray(items) ? items : [])
      .map((item) => renderItem(item))
      .join('');
  }

  function applyNotifyBehavior(moduleId) {
    const notifyBtn = document.getElementById('coming-soon-notify-btn');
    const statusEl = document.getElementById('coming-soon-notify-status');
    if (!(notifyBtn instanceof HTMLButtonElement) || !(statusEl instanceof HTMLElement)) return;
    const key = `cornerstone_notify_module_v1::${moduleId}`;
    const updateUi = (saved) => {
      notifyBtn.textContent = saved ? 'Saved on this device' : 'Notify me';
      notifyBtn.classList.toggle('saved', saved);
      statusEl.textContent = saved ? 'Saved locally on this device.' : '';
    };
    const initialSaved = localStorage.getItem(key) === '1';
    updateUi(initialSaved);
    notifyBtn.addEventListener('click', () => {
      localStorage.setItem(key, '1');
      updateUi(true);
    });
  }

  function renderExtra(cfg) {
    const top = document.getElementById('coming-soon-extra-top');
    const body = document.getElementById('coming-soon-extra-body');
    if (!(top instanceof HTMLElement) || !(body instanceof HTMLElement)) return;
    top.innerHTML = '';
    body.innerHTML = '';

    if (cfg.modes?.length) {
      top.innerHTML += `
        <section class="coming-soon-block full">
          <h3>Modes</h3>
          <div class="coming-soon-mode-grid">
            ${cfg.modes.map((mode) => `
              <article class="coming-soon-mode-card">
                <div class="coming-soon-mode-title">${escapeHtml(mode.title || '')}</div>
                <p>${escapeHtml(mode.copy || '')}</p>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    if (cfg.stepUpItems?.length) {
      top.innerHTML += `
        <section class="coming-soon-callout">
          <h3>Step Up to Writing Alignment</h3>
          <p>This module will mirror Step Up to Writing terms so staff can adopt quickly.</p>
          <ul>
            ${cfg.stepUpItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    if (cfg.topChallenges?.length) {
      body.innerHTML += `
        <section class="coming-soon-block full">
          <h3>Top challenges we support</h3>
          <div class="coming-soon-chip-row">
            ${cfg.topChallenges.map((item) => `<span class="coming-soon-chip">${escapeHtml(item)}</span>`).join('')}
          </div>
        </section>
      `;
    }

    body.innerHTML += `
      <section class="coming-soon-block full">
        <h3>Start here</h3>
        <p>Begin with Home Quick Check to unlock your recommended path and toolkit links.</p>
        <a class="home-cta primary" href="index.html#home-onboarding-wizard">Go to Home Quick Check</a>
      </section>
    `;
  }

  function renderModule() {
    const moduleId = String(document.body?.dataset?.comingSoonId || '').trim();
    if (!moduleId) return;
    const cfg = MODULES[moduleId] || {
      title: 'Preview Module',
      subtitle: 'Feature preview page',
      what: ['A guided workflow is coming soon.'],
      audience: DEFAULT_AUDIENCE,
      now: [{ label: 'Go Home', href: 'index.html' }],
      roadmap: [{ status: 'planned', text: 'Planning and scoping' }]
    };

    const titleEl = document.getElementById('coming-soon-title');
    const subtitleEl = document.getElementById('coming-soon-subtitle');
    const alignmentEl = document.getElementById('coming-soon-alignment');
    const whatEl = document.getElementById('coming-soon-what');
    const audienceEl = document.getElementById('coming-soon-audience');
    const nowEl = document.getElementById('coming-soon-now');
    const roadmapEl = document.getElementById('coming-soon-roadmap');

    if (titleEl) titleEl.textContent = cfg.title || 'Preview Module';
    if (subtitleEl) subtitleEl.textContent = cfg.subtitle || '';
    if (alignmentEl) {
      const alignment = String(cfg.alignment || '').trim();
      alignmentEl.textContent = alignment;
      alignmentEl.classList.toggle('hidden', !alignment);
    }
    if (cfg.title) document.title = `CORNERSTONE MTSS - ${cfg.title}`;

    fillList(whatEl, cfg.what, (item) => `<li>${escapeHtml(item || '')}</li>`);
    fillList(audienceEl, cfg.audience, (item) => `<span class="coming-soon-chip">${escapeHtml(item || '')}</span>`);
    fillList(nowEl, cfg.now, (item) => `
      <li>
        <a href="${escapeHtml(item?.href || 'index.html')}">${escapeHtml(item?.label || 'Open module')}</a>
      </li>
    `);
    fillList(roadmapEl, cfg.roadmap, (item) => {
      const status = normalizeStatus(item?.status);
      return `
        <li class="coming-soon-roadmap-item">
          <span class="coming-soon-status ${status}" aria-hidden="true"></span>
          <span class="coming-soon-roadmap-text">${escapeHtml(item?.text || '')}</span>
          <span class="coming-soon-roadmap-label">${STATUS_LABELS[status]}</span>
        </li>
      `;
    });

    renderExtra(cfg);
    applyNotifyBehavior(moduleId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderModule, { once: true });
  } else {
    renderModule();
  }
})();
