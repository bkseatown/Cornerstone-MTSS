const FLUENCY_PASSAGES = [
    {
        id: 'cvc-picnic',
        title: 'CVC Picnic',
        gradeBand: 'K-2',
        lexileBand: 'Emergent',
        focus: 'CVC words',
        passage: 'Sam sat on the mat. He had a bag with a red lid. Sam fed the cat and the cat did a hop. The sun was hot, but Sam did not stop.'
    },
    {
        id: 'short-vowels-trip',
        title: 'Short Vowel Trip',
        gradeBand: 'K-2',
        lexileBand: 'Emergent',
        focus: 'Short vowels',
        passage: 'Jen went on a trip. She packed a red pen, a big hat, and a top. The bus hit a bump, so Jen held her map and did not slip.'
    },
    {
        id: 'blends-camp',
        title: 'Blends at Camp',
        gradeBand: '3-5',
        lexileBand: 'Developing',
        focus: 'Initial blends',
        passage: 'The class went on a camp trek. They planned a stop by the stream and built a small shelter. Sam brought a snack and thanked the guide for the map.'
    },
    {
        id: 'digraph-mystery',
        title: 'Digraph Mystery',
        gradeBand: '3-5',
        lexileBand: 'Developing',
        focus: 'Digraphs',
        passage: 'The ship drifted past the shore when the wind shifted. The crew shouted, “Watch the waves!” Then they checked the chart to find the dock.'
    },
    {
        id: 'vowel-team-quest',
        title: 'Vowel Team Quest',
        gradeBand: '6-8',
        lexileBand: 'Fluent',
        focus: 'Vowel teams',
        passage: 'The team found clues on the trail. The guide said to stay close and read each sign. They cheered when they reached the green clearing.'
    },
    {
        id: 'r-controlled-race',
        title: 'R-Controlled Race',
        gradeBand: '6-8',
        lexileBand: 'Fluent',
        focus: 'R-controlled vowels',
        passage: 'The racers started at dawn. Nora heard a horn and surged ahead. The sharp turn near the barn made her slow, but she still earned first place.'
    },
    {
        id: 'multi-syllable',
        title: 'Multi-Syllable Mission',
        gradeBand: '9-12',
        lexileBand: 'Advanced',
        focus: 'Multi-syllable decoding',
        passage: 'The community center organized a volunteer project. Students collaborated to renovate the reading lounge and prepared informative posters for visitors.'
    },
    {
        id: 'science-brief',
        title: 'Science Briefing',
        gradeBand: '9-12',
        lexileBand: 'Advanced',
        focus: 'Academic vocabulary',
        passage: 'During the briefing, the researcher explained how the experiment measured temperature changes. The data suggested a consistent pattern across trials.'
    }
];

const gradeSelect = document.getElementById('fluency-grade');
const lexileSelect = document.getElementById('fluency-lexile');
const passageSelect = document.getElementById('fluency-select');
const passageEl = document.getElementById('fluency-passage');
const titleEl = document.getElementById('fluency-title');
const metaEl = document.getElementById('fluency-meta');
const timerDisplay = document.getElementById('fluency-timer-display');
const timerSelect = document.getElementById('fluency-minutes');
const startBtn = document.getElementById('fluency-start');
const pauseBtn = document.getElementById('fluency-pause');
const resetBtn = document.getElementById('fluency-reset');
const wordsInput = document.getElementById('fluency-words');
const errorsInput = document.getElementById('fluency-errors');
const goalInput = document.getElementById('fluency-goal');
const scoreOutput = document.getElementById('fluency-score');
const feedbackEl = document.getElementById('fluency-feedback');
const coinsEl = document.getElementById('fluency-coins');
const streakEl = document.getElementById('fluency-streak');
const scoreBtn = document.getElementById('fluency-check');

const STATE_KEY = 'fluency_progress';
let progress = { coins: 0, streak: 0 };
let timerId = null;
let remainingSeconds = 60;
let currentDuration = 60;
let currentPassage = null;

function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STATE_KEY));
        if (saved) progress = { ...progress, ...saved };
    } catch (e) {}
}

function saveProgress() {
    localStorage.setItem(STATE_KEY, JSON.stringify(progress));
}

function updateHud() {
    coinsEl.textContent = progress.coins;
    streakEl.textContent = progress.streak;
}

function buildFilters() {
    const gradeBands = Array.from(new Set(FLUENCY_PASSAGES.map(p => p.gradeBand)));
    const lexileBands = Array.from(new Set(FLUENCY_PASSAGES.map(p => p.lexileBand)));
    gradeSelect.innerHTML = gradeBands.map(band => `<option value="${band}">${band}</option>`).join('');
    lexileSelect.innerHTML = ['All'].concat(lexileBands).map(band => `<option value="${band}">${band}</option>`).join('');
}

function buildPassageList() {
    const grade = gradeSelect.value;
    const lexile = lexileSelect.value;
    let pool = FLUENCY_PASSAGES.filter(p => p.gradeBand === grade);
    if (lexile !== 'All') {
        pool = pool.filter(p => p.lexileBand === lexile);
    }
    if (pool.length === 0) pool = FLUENCY_PASSAGES;

    passageSelect.innerHTML = pool.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
    currentPassage = pool[0];
    renderPassage();
}

function renderPassage() {
    if (!currentPassage) return;
    titleEl.textContent = currentPassage.title;
    metaEl.textContent = `Grade ${currentPassage.gradeBand} • Lexile band: ${currentPassage.lexileBand} • Focus: ${currentPassage.focus}`;
    passageEl.textContent = currentPassage.passage;
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
}

function startTimer() {
    if (timerId) return;
    timerId = setInterval(() => {
        remainingSeconds = Math.max(0, remainingSeconds - 1);
        updateTimerDisplay();
        if (remainingSeconds <= 0) {
            stopTimer();
            feedbackEl.textContent = '⏱️ Time! Enter words read and errors to score.';
        }
    }, 1000);
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function resetTimer() {
    stopTimer();
    remainingSeconds = currentDuration;
    updateTimerDisplay();
}

function updateDuration() {
    currentDuration = Number(timerSelect.value) || 60;
    remainingSeconds = currentDuration;
    updateTimerDisplay();
}

function scoreFluency() {
    const words = Number(wordsInput.value || 0);
    const errors = Number(errorsInput.value || 0);
    const minutes = currentDuration / 60;
    const orf = Math.max(0, words - errors) / minutes;
    scoreOutput.textContent = orf.toFixed(1);

    const goal = Number(goalInput.value || 0);
    if (goal && orf >= goal) {
        progress.coins += 2;
        progress.streak += 1;
        feedbackEl.textContent = '🏅 Goal reached! Coins awarded.';
    } else if (goal) {
        progress.streak = 0;
        feedbackEl.textContent = 'Keep going! Try again to beat the goal.';
    } else {
        feedbackEl.textContent = 'Score saved. Set a goal if you want rewards.';
    }
    saveProgress();
    updateHud();
}

function init() {
    loadProgress();
    updateHud();
    buildFilters();
    buildPassageList();
    updateDuration();

    gradeSelect.addEventListener('change', buildPassageList);
    lexileSelect.addEventListener('change', buildPassageList);
    passageSelect.addEventListener('change', () => {
        const selected = FLUENCY_PASSAGES.find(p => p.id === passageSelect.value);
        if (selected) currentPassage = selected;
        renderPassage();
    });

    timerSelect.addEventListener('change', updateDuration);
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
    scoreBtn.addEventListener('click', scoreFluency);
}

init();
