(function () {
  const BUILD_DEFAULT = 'dev';
  const PLACEMENT_KEY = 'decode_placement_v1';
  const QUICKCHECK_SUMMARY_KEY = 'cornerstone_quickcheck_summary_v1';

  const HUB_META = {
    teacher: {
      title: 'TEACHER HUB',
      subtitle: 'Daily classroom launchpad for quick evidence and next teaching moves.',
      modules: [
        'Digital IM Cooldown Capture',
        'Flexible Grouping Dashboard',
        'SST / Student Concern Wizard',
        'UDL Accommodation Tracker'
      ]
    },
    'learning-support': {
      title: 'LEARNING SUPPORT HUB',
      subtitle: 'Supports intervention planning, progress checks, and meeting readiness.',
      modules: [
        'Goal Builder',
        'Progress Monitoring Hub',
        'Meeting Packet Generator'
      ]
    },
    eal: {
      title: 'EAL HUB',
      subtitle: 'Plans language-aware supports and home-language bridges.',
      modules: [
        'Language Demands Lens',
        'Pronunciation Practice',
        'Home Language Support'
      ]
    },
    slp: {
      title: 'SLP HUB',
      subtitle: 'Targets speech-language sessions with practical workflow tools.',
      modules: [
        'Sound Lab',
        'Articulation Practice',
        'Session Notes + Progress Graphs'
      ]
    },
    counselor: {
      title: 'COUNSELOR HUB',
      subtitle: 'Keeps SEL supports and student planning in one practical workspace.',
      modules: [
        'SEL Check-in',
        'Tiered Supports Planner',
        'FBA-lite pathway'
      ]
    },
    psychologist: {
      title: 'PSYCHOLOGIST HUB',
      subtitle: 'Supports consultation and classroom behavior pattern review.',
      modules: [
        'Executive Function Snapshot',
        'Classroom Behavior Tracker',
        'Consultation Notes'
      ]
    },
    admin: {
      title: 'ADMIN HUB',
      subtitle: 'School-wide implementation view for MTSS coordination and follow-through.',
      modules: [
        'MTSS Dashboard',
        'Growth Summaries',
        'School-wide Trends'
      ]
    },
    parent: {
      title: 'PARENT HUB',
      subtitle: 'Clear family-facing supports that explain learning approaches and next steps.',
      modules: [
        '"How math is taught now" mini experiences',
        '"How reading works" mini experiences',
        'Bilingual support pages',
        'Short home practice activities'
      ]
    },
    student: {
      title: 'STUDENT HUB',
      subtitle: 'Simple launch area for practice, momentum, and strategy ownership.',
      modules: [
        'Practice Path',
        'Streaks & badges',
        'Strategy choices (draw, model, explain)'
      ]
    }
  };

  function safeParse(raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function detectBuildStamp() {
    const script = document.currentScript || Array.from(document.querySelectorAll('script[src]')).find((node) => /hub-page\.js(\?|$)/.test(node.src));
    if (!(script instanceof HTMLScriptElement)) return BUILD_DEFAULT;
    try {
      const src = new URL(script.src, window.location.href);
      const value = String(src.searchParams.get('v') || '').trim();
      return value || BUILD_DEFAULT;
    } catch {
      return BUILD_DEFAULT;
    }
  }

  function readQuickCheckSummary() {
    const placement = safeParse(localStorage.getItem(PLACEMENT_KEY) || '');
    const summary = safeParse(localStorage.getItem(QUICKCHECK_SUMMARY_KEY) || '');
    const payload = placement && typeof placement === 'object' ? placement : summary;
    if (!payload || typeof payload !== 'object') {
      return { status: 'not_started', score: 'No result yet', recommendation: 'Run Quick Check from Home to generate a recommendation.' };
    }

    const score = payload.score || payload.correct || payload.percent || payload.accuracy || '';
    const recommendation = payload.recommendation || payload.activityLabel || payload.nextStep || payload.focus || '';
    const scoreLabel = score ? String(score) : 'Result available';
    const recommendationLabel = recommendation ? String(recommendation) : 'See Home for detailed recommendation.';
    return {
      status: 'complete',
      score: scoreLabel,
      recommendation: recommendationLabel
    };
  }

  function renderHubPage() {
    const hubId = String(document.body.dataset.hubId || '').trim().toLowerCase();
    const meta = HUB_META[hubId];
    if (!meta) return;

    const params = new URLSearchParams(window.location.search || '');
    const quickCheckParam = String(params.get('quickcheck') || '').trim().toLowerCase();
    const focusParam = String(params.get('focus') || '').trim().toLowerCase();
    const quickCheck = readQuickCheckSummary();

    const titleEl = document.querySelector('[data-cs-hub-title]');
    const subtitleEl = document.querySelector('[data-cs-hub-subtitle]');
    const modulesEl = document.querySelector('[data-cs-hub-modules]');
    const stampEl = document.querySelector('[data-cs-hub-stamp]');
    const bannerEl = document.querySelector('[data-cs-hub-banner]');
    const cardResultsEl = document.querySelector('[data-cs-hub-card="results"]');
    const cardPathEl = document.querySelector('[data-cs-hub-card="path"]');
    const cardToolsEl = document.querySelector('[data-cs-hub-card="tools"]');

    if (titleEl) titleEl.textContent = meta.title;
    if (subtitleEl) subtitleEl.textContent = meta.subtitle;
    if (stampEl) stampEl.textContent = `Hub Build: ${detectBuildStamp()}`;

    if (bannerEl) {
      if (quickCheckParam === 'skipped') {
        bannerEl.textContent = 'Quick Check skipped — start anytime from Home.';
        bannerEl.classList.remove('cs-hub-hidden');
      } else {
        bannerEl.classList.add('cs-hub-hidden');
      }
    }

    if (cardResultsEl) {
      const statusText = quickCheckParam === 'skipped' ? 'Skipped for now' : quickCheck.status === 'complete' ? 'Completed' : 'Not started';
      cardResultsEl.innerHTML = `
        <h3>Quick Check Results</h3>
        <p class="cs-hub-value">${statusText}</p>
        <p>${quickCheckParam === 'skipped' ? 'No score saved yet. Start anytime from Home.' : quickCheck.score}</p>
      `;
    }

    if (cardPathEl) {
      const focusLabel = focusParam === 'literacy' ? 'Reading & Words' : focusParam === 'numeracy' ? 'Math & Numbers' : focusParam === 'both' ? 'Both' : 'To be selected';
      cardPathEl.innerHTML = `
        <h3>Recommended Path</h3>
        <p class="cs-hub-value">${focusLabel}</p>
        <p>${quickCheck.recommendation}</p>
      `;
    }

    if (cardToolsEl) {
      cardToolsEl.innerHTML = `
        <h3>Workspace Tools</h3>
        <p>Open quick actions for this pathway and keep setup consistent.</p>
        <div class="cs-hub-actions">
          <a class="cs-hub-link-btn" href="index.html">Return to Home</a>
          <a class="cs-hub-link-btn" href="word-quest.html">Open Word Quest</a>
        </div>
      `;
    }

    if (modulesEl) {
      modulesEl.innerHTML = '';
      meta.modules.forEach((label) => {
        const moduleCard = document.createElement('article');
        moduleCard.className = 'cs-hub-module';
        moduleCard.textContent = label;
        modulesEl.appendChild(moduleCard);
      });
    }
  }

  function renderWritingStub() {
    const writingRoot = document.querySelector('[data-cs-hub-writing]');
    if (!writingRoot) return;
    const stampEl = document.querySelector('[data-cs-hub-stamp]');
    if (stampEl) stampEl.textContent = `Hub Build: ${detectBuildStamp()}`;
  }

  if (document.body.classList.contains('cs-hub-page') && document.body.dataset.hubId) {
    renderHubPage();
    return;
  }

  if (document.body.classList.contains('cs-hub-page') && document.body.dataset.hubWriting === 'true') {
    renderWritingStub();
  }
})();
