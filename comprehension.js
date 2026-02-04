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
    },
    {
        id: 'seed-sprout',
        title: 'Seed Sprout',
        gradeBand: 'K-2',
        lexileBand: 'Emergent',
        passage: 'Ava planted a seed in a cup by the window. She watered it each morning. After a week, a tiny sprout leaned toward the light.',
        questions: [
            {
                prompt: 'Why did the sprout lean toward the light?',
                choices: ['It wanted water.', 'It was growing toward sunlight.', 'It was looking for food.'],
                answer: 1,
                type: 'Inference',
                feedback: 'Plants grow toward sunlight to help them make energy.'
            },
            {
                prompt: 'Where did Ava put the cup?',
                choices: ['By the window', 'Under the desk', 'On the floor'],
                answer: 0,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'feelings-corner',
        title: 'Feelings Corner',
        gradeBand: 'K-2',
        lexileBand: 'Emergent',
        passage: 'Jamal felt nervous before sharing. His friend nodded and smiled, so Jamal took a deep breath and started to read.',
        questions: [
            {
                prompt: 'How did Jamal feel at first?',
                choices: ['Nervous', 'Sleepy', 'Angry'],
                answer: 0,
                type: 'Detail'
            },
            {
                prompt: 'Why did Jamal take a deep breath?',
                choices: ['To calm down', 'To run faster', 'To hide'],
                answer: 0,
                type: 'Inference'
            }
        ]
    },
    {
        id: 'bridge-test',
        title: 'Bridge Test',
        gradeBand: '3-5',
        lexileBand: 'Developing',
        passage: 'Sasha built a paper bridge for science class. She added extra folds after the first test sagged. The second test held the weight longer.',
        questions: [
            {
                prompt: 'Why did Sasha add extra folds?',
                choices: ['To make the bridge stronger.', 'To make it shorter.', 'To change the color.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'What happened during the first test?',
                choices: ['The bridge sagged.', 'The bridge flew away.', 'The bridge melted.'],
                answer: 0,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'recess-coach',
        title: 'Recess Coach',
        gradeBand: '3-5',
        lexileBand: 'Developing',
        passage: 'During recess, Mateo noticed two friends arguing about the rules. He suggested they take turns explaining their ideas and then choose a fair plan.',
        questions: [
            {
                prompt: 'What can you infer about Mateo?',
                choices: ['He likes to help solve problems.', 'He wants to leave recess.', 'He ignores his friends.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'What did Mateo suggest?',
                choices: ['Taking turns explaining ideas', 'Playing a new game', 'Telling a joke'],
                answer: 0,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'reef-data',
        title: 'Reef Data',
        gradeBand: '6-8',
        lexileBand: 'Fluent',
        passage: 'The marine club recorded water temperature at the reef each hour. When the temperature rose, they noticed fewer fish near the surface.',
        questions: [
            {
                prompt: 'What can you infer about the fish?',
                choices: ['They moved to cooler water.', 'They stopped swimming.', 'They ate more food.'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'What data did the club record?',
                choices: ['Water temperature', 'Air pressure', 'Wind speed'],
                answer: 0,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'peer-mentor',
        title: 'Peer Mentor',
        gradeBand: '6-8',
        lexileBand: 'Fluent',
        passage: 'Riley volunteered as a peer mentor. When a new student looked lost, Riley walked with her to class and introduced her to a partner.',
        questions: [
            {
                prompt: 'Why did Riley walk with the new student?',
                choices: ['To help her feel welcome', 'To skip class', 'To avoid homework'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'What role did Riley have?',
                choices: ['Peer mentor', 'Coach', 'Principal'],
                answer: 0,
                type: 'Detail'
            }
        ]
    },
    {
        id: 'lab-ethics',
        title: 'Lab Ethics',
        gradeBand: '9-12',
        lexileBand: 'Advanced',
        passage: 'In biology lab, the class debated how to design a fair test. They agreed to keep one variable the same so their results could be trusted.',
        questions: [
            {
                prompt: 'Why did they keep one variable the same?',
                choices: ['To make results reliable', 'To finish faster', 'To avoid writing notes'],
                answer: 0,
                type: 'Inference'
            },
            {
                prompt: 'What did the class debate?',
                choices: ['How to design a fair test', 'Which lunch to eat', 'Where to sit'],
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

function applyLightTheme() {
    document.body.classList.add('force-light');
    document.documentElement.classList.add('force-light');
    document.documentElement.style.colorScheme = 'light';
}

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
    applyFriendlyNavLabels();
    applyLightTheme();
    applyPlatformGameModeVisibility();
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

function applyPlatformGameModeVisibility() {
    const active = isPlatformGameModeActive();
    const hud = document.querySelector('.comp-hud');
    if (hud) hud.style.display = active ? 'flex' : 'none';
}

function isPlatformGameModeActive() {
    try {
        const raw = localStorage.getItem('decode_settings');
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        const enabled = !!parsed?.funHud?.enabled;
        const hasModes = !!parsed?.gameMode?.teamMode || !!parsed?.gameMode?.timerEnabled || !!parsed?.funHud?.challenge;
        return enabled && hasModes;
    } catch (e) {
        return false;
    }
}

function applyFriendlyNavLabels() {
    const map = {
        'Cloze': 'Story Fill',
        'Comprehension': 'Read & Think',
        'Fluency': 'Speed Sprint',
        'Mad Libs': 'Silly Stories'
    };
    document.querySelectorAll('a, button').forEach((el) => {
        const label = (el.textContent || '').trim();
        if (map[label]) {
            el.textContent = map[label];
        }
    });
}
