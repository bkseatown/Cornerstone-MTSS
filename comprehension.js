const COMPREHENSION_SETS = [
    {
        id: 'garden-delivery',
        title: 'Garden Delivery',
        gradeBand: 'K-2',
        lexileBand: 'Emergent',
        passage: 'Mia carried a small basket to the garden. She saw a rabbit nibbling a leaf, so she walked quietly. Mia placed seeds near the fence and whispered, “Grow strong.”',
        questions: [
            {
                prompt: 'Why did Mia walk quietly?',
                choices: ['She was tired.', 'She did not want to scare the rabbit.', 'She was late.'],
                answer: 1,
                type: 'Inference',
                feedback: 'Mia saw a rabbit, so walking quietly keeps it from running away.'
            },
            {
                prompt: 'What did Mia place near the fence?',
                choices: ['Seeds', 'A basket', 'A shovel'],
                answer: 0,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'puddle-jump',
        title: 'Puddle Jump',
        gradeBand: 'K-2',
        lexileBand: 'Emergent',
        passage: 'Leo wore his rain boots to school. The clouds were dark, and the sidewalk had shiny puddles. Leo hopped over each puddle and smiled.',
        questions: [
            {
                prompt: 'What can you infer about the weather?',
                choices: ['It is sunny.', 'It is rainy.', 'It is snowy.'],
                answer: 1,
                type: 'Inference'
            },
            {
                prompt: 'What did Leo wear?',
                choices: ['Sandals', 'Rain boots', 'Skates'],
                answer: 1,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'library-map',
        title: 'Library Map',
        gradeBand: '3-5',
        lexileBand: 'Developing',
        passage: 'Ms. Ortiz handed the class a map of the library. The students had to find three different books using the map symbols. Ava traced the symbols with her finger before choosing her first book.',
        questions: [
            {
                prompt: 'Why did Ava trace the symbols?',
                choices: ['She wanted to memorize them.', 'She was checking where to go.', 'She was drawing a picture.'],
                answer: 1,
                type: 'Inference'
            },
            {
                prompt: 'How many different books were they asked to find?',
                choices: ['Two', 'Three', 'Five'],
                answer: 1,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'science-fair',
        title: 'Science Fair Surprise',
        gradeBand: '3-5',
        lexileBand: 'Developing',
        passage: 'Kai built a model volcano for the science fair. When the baking soda bubbled, his teammates cheered. Kai wrote down what worked so they could repeat it later.',
        questions: [
            {
                prompt: 'Why did Kai write down what worked?',
                choices: ['To repeat the experiment later.', 'To avoid cleaning up.', 'To hide the volcano.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'What caused the bubbles?',
                choices: ['Baking soda', 'Sand', 'Tape'],
                answer: 0,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'trail-signs',
        title: 'Trail Signs',
        gradeBand: '6-8',
        lexileBand: 'Fluent',
        passage: 'The hiking group paused at a fork in the trail. One sign pointed to the waterfall and another to the ridge. Jordan studied the map because the group wanted to reach the waterfall before lunch.',
        questions: [
            {
                prompt: 'What can you infer about Jordan?',
                choices: ['Jordan is guiding the group.', 'Jordan is bored.', 'Jordan wants to leave early.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'Where did the group want to go?',
                choices: ['The ridge', 'The waterfall', 'The camp store'],
                answer: 1,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'space-garden',
        title: 'Space Garden',
        gradeBand: '6-8',
        lexileBand: 'Fluent',
        passage: 'In the space station garden, Amina checked the moisture meter and dimmed the lights. The plants needed less light today because the crew had already run the growth lamps overnight.',
        questions: [
            {
                prompt: 'Why did Amina dim the lights?',
                choices: ['The plants were getting too much light.', 'The meter was broken.', 'The crew was sleeping.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'What tool did Amina check?',
                choices: ['A compass', 'A moisture meter', 'A stopwatch'],
                answer: 1,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'debate-team',
        title: 'Debate Team',
        gradeBand: '9-12',
        lexileBand: 'Advanced',
        passage: 'During practice, the debate coach asked the team to build stronger evidence. Priya rewrote her notes, adding quotes and statistics to support her claims.',
        questions: [
            {
                prompt: 'Why did Priya add quotes and statistics?',
                choices: ['To make her claims stronger.', 'To shorten her notes.', 'To change the topic.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'Who asked for stronger evidence?',
                choices: ['Priya', 'The debate coach', 'A judge'],
                answer: 1,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'city-proposal',
        title: 'City Proposal',
        gradeBand: '9-12',
        lexileBand: 'Advanced',
        passage: 'The student council proposed adding bike racks near the library. They surveyed classmates and noticed many students walked or biked to school, which supported their request.',
        questions: [
            {
                prompt: 'Why did the council run a survey?',
                choices: ['To support their proposal.', 'To plan a party.', 'To pick a mascot.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'Where did they want bike racks?',
                choices: ['Near the library', 'By the cafeteria', 'At the gym'],
                answer: 0,
                type: 'Detail'
            }
        ]
    }
];

const gradeSelect = document.getElementById('comp-grade');
const lexileSelect = document.getElementById('comp-lexile');
const passageEl = document.getElementById('comp-passage');
const titleEl = document.getElementById('comp-title');
const metaEl = document.getElementById('comp-meta');
const questionsList = document.getElementById('comp-questions-list');
const feedbackEl = document.getElementById('comp-feedback');
const shuffleBtn = document.getElementById('comp-shuffle');
const checkBtn = document.getElementById('comp-check');
const resetBtn = document.getElementById('comp-reset');
const coinsEl = document.getElementById('comp-coins');
const streakEl = document.getElementById('comp-streak');

const STATE_KEY = 'comp_progress';
let progress = { coins: 0, streak: 0 };
let currentSet = null;

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
    const gradeBands = Array.from(new Set(COMPREHENSION_SETS.map(set => set.gradeBand)));
    const lexileBands = Array.from(new Set(COMPREHENSION_SETS.map(set => set.lexileBand)));
    gradeSelect.innerHTML = gradeBands.map(band => `<option value="${band}">${band}</option>`).join('');
    lexileSelect.innerHTML = ['All'].concat(lexileBands).map(band => `<option value="${band}">${band}</option>`).join('');
}

function pickSet() {
    const grade = gradeSelect.value;
    const lexile = lexileSelect.value;
    let pool = COMPREHENSION_SETS.filter(set => set.gradeBand === grade);
    if (lexile !== 'All') {
        pool = pool.filter(set => set.lexileBand === lexile);
    }
    if (pool.length === 0) {
        pool = COMPREHENSION_SETS;
    }
    currentSet = pool[Math.floor(Math.random() * pool.length)];
}

function renderSet() {
    if (!currentSet) return;
    titleEl.textContent = currentSet.title;
    metaEl.textContent = `Grade ${currentSet.gradeBand} • Lexile band: ${currentSet.lexileBand} • Teacher-adjustable`;
    passageEl.textContent = currentSet.passage;
    questionsList.innerHTML = '';
    currentSet.questions.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'comp-question';
        card.innerHTML = `
            <div class="comp-question-meta">${question.type} Question</div>
            <h3>${index + 1}. ${question.prompt}</h3>
            <div class="comp-choices">
                ${question.choices.map((choice, i) => `
                    <label class="comp-choice">
                        <input type="radio" name="comp-q-${index}" value="${i}" />
                        <span>${choice}</span>
                    </label>
                `).join('')}
            </div>
        `;
        questionsList.appendChild(card);
    });
    feedbackEl.textContent = '';
}

function resetAnswers() {
    const inputs = questionsList.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.checked = false);
    feedbackEl.textContent = '';
}

function checkAnswers() {
    if (!currentSet) return;
    let correct = 0;
    currentSet.questions.forEach((question, index) => {
        const selected = questionsList.querySelector(`input[name="comp-q-${index}"]:checked`);
        if (selected && Number(selected.value) === question.answer) {
            correct += 1;
        }
    });
    const total = currentSet.questions.length;
    if (correct === total) {
        progress.coins += 2;
        progress.streak += 1;
        feedbackEl.textContent = '✅ Great job! Quest complete.';
    } else {
        progress.streak = 0;
        feedbackEl.textContent = `You got ${correct} of ${total}. Try again or shuffle for a new passage.`;
    }
    saveProgress();
    updateHud();
}

function init() {
    loadProgress();
    updateHud();
    buildFilters();
    pickSet();
    renderSet();

    gradeSelect.addEventListener('change', () => {
        pickSet();
        renderSet();
    });
    lexileSelect.addEventListener('change', () => {
        pickSet();
        renderSet();
    });
    shuffleBtn.addEventListener('click', () => {
        pickSet();
        renderSet();
    });
    resetBtn.addEventListener('click', resetAnswers);
    checkBtn.addEventListener('click', checkAnswers);
}

init();
