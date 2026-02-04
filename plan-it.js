const SCENARIOS = [
  {
    id: 'after-school',
    title: 'After-School Rescue',
    description:
      'It is 3:00 PM. You want to finish your tasks and be ready for bed by 9:00 PM.',
    tip:
      'Tip: Start with the fixed events (practice, dinner), then fit the flexible tasks around them.',
    startTime: '3:00',
    endTime: '9:00',
    stepMinutes: 30,
    tasks: [
      { id: 'snack', label: 'Snack', durationMinutes: 30, earliest: '3:00', latestStart: '4:30' },
      { id: 'homework', label: 'Homework', durationMinutes: 60, earliest: '3:00', latestStart: '6:00' },
      { id: 'reading', label: 'Reading', durationMinutes: 30, earliest: '3:30', latestStart: '8:00' },
      { id: 'practice', label: 'Practice', durationMinutes: 60, mustStart: '5:00' },
      { id: 'dinner', label: 'Dinner', durationMinutes: 30, mustStart: '6:30' },
      { id: 'shower', label: 'Shower', durationMinutes: 30, earliest: '7:00', latestStart: '8:00' }
    ]
  }
];

const scenarioSelect = document.getElementById('planit-scenario');
const scenarioTitle = document.getElementById('planit-scenario-title');
const scenarioText = document.getElementById('planit-scenario-text');
const scenarioTip = document.getElementById('planit-scenario-tip');
const taskList = document.getElementById('planit-task-list');
const resetBtn = document.getElementById('planit-reset');
const checkBtn = document.getElementById('planit-check');
const feedbackEl = document.getElementById('planit-feedback');
const timelineEl = document.getElementById('planit-timeline');

const STORAGE_KEY = 'planit_progress_v1';
let currentScenario = SCENARIOS[0];
let selections = {}; // { taskId: "HH:MM" }

function applyLightTheme() {
  document.body.classList.add('force-light');
  document.documentElement.classList.add('force-light');
  document.documentElement.style.colorScheme = 'light';
}

function toMinutes(timeStr) {
  const [h, m] = (timeStr || '0:0').split(':').map(n => Number(n));
  return (h * 60) + (m || 0);
}

function fromMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

function listSlots(scenario) {
  const start = toMinutes(scenario.startTime);
  const end = toMinutes(scenario.endTime);
  const step = scenario.stepMinutes;
  const slots = [];
  for (let t = start; t <= end; t += step) {
    slots.push(fromMinutes(t));
  }
  return slots;
}

function getTaskOptions(task, scenario) {
  const slots = listSlots(scenario);
  const start = toMinutes(scenario.startTime);
  const end = toMinutes(scenario.endTime);
  const dur = task.durationMinutes;

  if (task.mustStart) return [task.mustStart];

  const earliest = task.earliest ? toMinutes(task.earliest) : start;
  const latestStart = task.latestStart ? toMinutes(task.latestStart) : (end - dur);

  return slots.filter(label => {
    const t = toMinutes(label);
    if (t < earliest) return false;
    if (t > latestStart) return false;
    if (t + dur > end) return false;
    return true;
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;
    const pick = SCENARIOS.find(s => s.id === parsed.scenarioId);
    if (pick) currentScenario = pick;
    selections = parsed.selections || {};
  } catch (e) {}
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    scenarioId: currentScenario.id,
    selections
  }));
}

function buildScenarioList() {
  scenarioSelect.innerHTML = SCENARIOS
    .map(s => `<option value="${s.id}">${s.title}</option>`)
    .join('');
  scenarioSelect.value = currentScenario.id;
}

function renderScenario() {
  scenarioTitle.textContent = currentScenario.title;
  scenarioText.textContent = currentScenario.description;
  scenarioTip.textContent = currentScenario.tip || '';
}

function renderTasks() {
  taskList.innerHTML = '';
  currentScenario.tasks.forEach(task => {
    const options = getTaskOptions(task, currentScenario);
    const value = selections[task.id] && options.includes(selections[task.id]) ? selections[task.id] : '';

    const row = document.createElement('div');
    row.className = 'planit-task';
    row.innerHTML = `
      <div class="planit-task-left">
        <div class="planit-task-name">${task.label}</div>
        <div class="planit-task-meta">${task.durationMinutes} min</div>
      </div>
      <div class="planit-task-right">
        <label class="planit-task-label">
          Start
          <select data-task="${task.id}">
            <option value="">Choose…</option>
            ${options.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </label>
      </div>
    `;

    const select = row.querySelector('select');
    select.value = value;
    select.addEventListener('change', () => {
      if (select.value) {
        selections[task.id] = select.value;
      } else {
        delete selections[task.id];
      }
      saveState();
      renderTimeline();
    });

    taskList.appendChild(row);
  });
}

function getIntervals() {
  const start = toMinutes(currentScenario.startTime);
  const end = toMinutes(currentScenario.endTime);

  const intervals = [];
  currentScenario.tasks.forEach(task => {
    const startLabel = selections[task.id];
    if (!startLabel) return;
    const t0 = toMinutes(startLabel);
    const t1 = t0 + task.durationMinutes;
    intervals.push({
      id: task.id,
      label: task.label,
      start: t0,
      end: t1,
      duration: task.durationMinutes
    });
  });

  const problems = [];
  intervals.forEach(it => {
    if (it.start < start || it.end > end) problems.push(`${it.label} does not fit in the timeline.`);
  });

  return { intervals, problems };
}

function checkPlan() {
  feedbackEl.textContent = '';

  const missing = currentScenario.tasks.filter(t => !selections[t.id]);
  if (missing.length) {
    feedbackEl.textContent = `Pick start times for: ${missing.map(t => t.label).join(', ')}.`;
    return;
  }

  const { intervals, problems } = getIntervals();
  const sorted = intervals.slice().sort((a, b) => a.start - b.start);

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (cur.start < prev.end) {
      problems.push(`Overlap: ${prev.label} overlaps with ${cur.label}.`);
    }
  }

  currentScenario.tasks.forEach(task => {
    const chosen = selections[task.id];
    if (!chosen) return;
    if (task.mustStart && chosen !== task.mustStart) {
      problems.push(`${task.label} must start at ${task.mustStart}.`);
    }
    if (task.earliest && toMinutes(chosen) < toMinutes(task.earliest)) {
      problems.push(`${task.label} starts too early (earliest: ${task.earliest}).`);
    }
    if (task.latestStart && toMinutes(chosen) > toMinutes(task.latestStart)) {
      problems.push(`${task.label} starts too late (latest: ${task.latestStart}).`);
    }
  });

  if (problems.length) {
    feedbackEl.innerHTML = `<ul class="planit-feedback-list">${problems.map(p => `<li>⚠️ ${p}</li>`).join('')}</ul>`;
  } else {
    feedbackEl.textContent = '✅ Nice plan! Everything fits with no overlaps.';
  }
}

function renderTimeline() {
  const slots = listSlots(currentScenario);
  const start = toMinutes(currentScenario.startTime);
  const step = currentScenario.stepMinutes;

  timelineEl.innerHTML = '';
  timelineEl.style.setProperty('--planit-rows', String(slots.length - 1));

  // row labels
  slots.slice(0, -1).forEach((label, i) => {
    const row = document.createElement('div');
    row.className = 'planit-time-row';
    row.style.gridRow = `${i + 1}`;
    row.innerHTML = `<div class="planit-time-label">${label}</div><div class="planit-time-slot"></div>`;
    timelineEl.appendChild(row);
  });

  // task blocks
  const { intervals } = getIntervals();
  intervals.forEach((it, idx) => {
    const rowStart = Math.floor((it.start - start) / step) + 1;
    const rowSpan = Math.max(1, Math.floor(it.duration / step));
    const block = document.createElement('div');
    block.className = 'planit-block';
    block.style.gridRow = `${rowStart} / span ${rowSpan}`;
    block.style.setProperty('--planit-color', String((idx % 6) + 1));
    block.textContent = it.label;
    timelineEl.appendChild(block);
  });
}

function resetAll() {
  selections = {};
  saveState();
  renderTasks();
  renderTimeline();
  feedbackEl.textContent = '';
}

function init() {
  applyLightTheme();
  loadState();
  buildScenarioList();
  renderScenario();
  renderTasks();
  renderTimeline();

  scenarioSelect.addEventListener('change', () => {
    const pick = SCENARIOS.find(s => s.id === scenarioSelect.value);
    if (pick) currentScenario = pick;
    selections = {};
    saveState();
    renderScenario();
    renderTasks();
    renderTimeline();
    feedbackEl.textContent = '';
  });

  resetBtn.addEventListener('click', resetAll);
  checkBtn.addEventListener('click', checkPlan);
}

init();

