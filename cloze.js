const CLOZE_SETS = [
    {
        id: 'rainforest-rescue',
        title: 'Rainforest Rescue',
        passage: 'On our class hike, we followed a winding trail into the __1__. The air smelled like __2__, and we heard a __3__ calling from the trees.\n\nA guide named __4__ showed us a map and reminded us to stay on the __5__ path. We carried our __6__ and promised to protect the forest.',
        answers: ['rainforest', 'pine', 'parrot', 'Maya', 'marked', 'backpacks'],
        distractors: ['desert', 'pancakes', 'robot', 'Eli', 'rocky', 'umbrellas']
    },
    {
        id: 'library-quest',
        title: 'Library Quest',
        passage: 'After school, we met at the __1__ where a __2__ librarian offered us a puzzle. We had to find a __3__ book hidden behind the __4__ shelf.\n\nWhen we solved it, our team cheered, grabbed a __5__ sticker, and shared a __6__ snack with the class.',
        answers: ['library', 'kind', 'mystery', 'blue', 'golden', 'healthy'],
        distractors: ['playground', 'sleepy', 'space', 'green', 'sparkly', 'spicy']
    },
    {
        id: 'science-lab',
        title: 'Science Lab Spark',
        passage: 'Today in science, we mixed __1__ and __2__ to build a bubbling __3__. Our teacher, __4__, reminded us to wear __5__ goggles.\n\nThe experiment made a __6__ sound, and we all wrote down what we observed in our notebooks.',
        answers: ['baking soda', 'vinegar', 'volcano', 'Mr. Lee', 'safety', 'swoosh'],
        distractors: ['glitter', 'juice', 'rocket', 'Ms. Gray', 'fashion', 'whisper']
    },
    {
        id: 'garden-helpers',
        title: 'Garden Helpers',
        passage: 'In the school __1__, we spotted a __2__ ladybug and a line of __3__ carrying leaves.\n\nCoach __4__ asked us to pull __5__ weeds, then we munched on a __6__ snack.',
        answers: ['garden', 'tiny', 'ants', 'Reed', 'stubborn', 'crunchy'],
        distractors: ['stadium', 'sleepy', 'robots', 'Ava', 'slippery', 'sticky']
    },
    {
        id: 'ocean-cleanup',
        title: 'Ocean Cleanup',
        passage: 'Our class visited the __1__ shore and found a __2__ turtle tangled in __3__.\n\nWe worked with __4__ to sort __5__ bins, then celebrated with a __6__ cheer.',
        answers: ['ocean', 'brave', 'plastic', 'Kai', 'recycling', 'loud'],
        distractors: ['mountain', 'sleepy', 'glitter', 'Zoe', 'history', 'quiet']
    },
    {
        id: 'space-station',
        title: 'Space Station Mission',
        passage: 'Captain __1__ guided us into the __2__ station where we floated past a __3__ window.\n\nWe pressed the __4__ button, collected __5__ samples, and ate a __6__ snack.',
        answers: ['Nova', 'space', 'round', 'glowing', 'meteor', 'freeze-dried'],
        distractors: ['Rex', 'forest', 'square', 'silent', 'fossil', 'spicy']
    },
    {
        id: 'mountain-camp',
        title: 'Mountain Camp',
        passage: 'At __1__ camp, we built a __2__ fire and told a __3__ story about a __4__ bear.\n\nBefore bed, we zipped our __5__ bags and whispered a __6__ goodnight.',
        answers: ['Summit', 'cozy', 'funny', 'sleepy', 'sleeping', 'soft'],
        distractors: ['Downtown', 'noisy', 'scary', 'angry', 'messy', 'loud']
    },
    {
        id: 'city-parade',
        title: 'City Parade',
        passage: 'During the __1__ parade, we waved a __2__ flag and spotted a __3__ drummer.\n\nMayor __4__ tossed __5__ confetti, and the crowd sang a __6__ song.',
        answers: ['spring', 'shiny', 'talented', 'Chen', 'colorful', 'happy'],
        distractors: ['midnight', 'dusty', 'sleepy', 'Luna', 'rainy', 'slow']
    },
    {
        id: 'art-studio',
        title: 'Art Studio Splash',
        passage: 'In art class, we painted a __1__ sunset using __2__ brushes and __3__ paints.\n\nOur helper, __4__, framed the __5__ picture and gave us a __6__ high five.',
        answers: ['glowing', 'soft', 'bright', 'Ms. Vega', 'finished', 'giant'],
        distractors: ['stormy', 'scratchy', 'dark', 'Mr. Hill', 'broken', 'tiny']
    },
    {
        id: 'robot-repair',
        title: 'Robot Repair',
        passage: 'Our class fixed a __1__ robot with a __2__ screwdriver and a __3__ bolt.\n\nWhen the robot said "__4__!", we felt __5__ and did a __6__ dance.',
        answers: ['friendly', 'tiny', 'silver', 'thank you', 'proud', 'silly'],
        distractors: ['grumpy', 'huge', 'rusty', 'beep', 'tired', 'quiet']
    }
];

const SETTINGS_KEY = 'cloze_settings';

const state = {
    currentIndex: 0,
    selectedWord: null,
    coins: 0,
    streak: 0,
    hearts: 3,
    maxHearts: 3,
    challenge: false,
    completionBonus: 0
};

const ui = {
    select: document.getElementById('cloze-select'),
    title: document.getElementById('cloze-title'),
    passage: document.getElementById('cloze-passage'),
    bank: document.getElementById('cloze-bank'),
    reset: document.getElementById('cloze-reset'),
    shuffle: document.getElementById('cloze-shuffle'),
    check: document.getElementById('cloze-check'),
    coins: document.getElementById('cloze-coins'),
    streak: document.getElementById('cloze-streak'),
    hearts: document.getElementById('cloze-hearts'),
    message: document.getElementById('cloze-message'),
    challenge: document.getElementById('cloze-challenge')
};

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return;
    try {
        const parsed = JSON.parse(saved);
        state.challenge = !!parsed.challenge;
    } catch (err) {
        console.warn('Cloze settings failed to load', err);
    }
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ challenge: state.challenge }));
}

function buildSelect() {
    ui.select.innerHTML = '';
    CLOZE_SETS.forEach((set, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = set.title;
        ui.select.appendChild(option);
    });
}

function buildPassage(set) {
    ui.passage.innerHTML = '';
    const paragraphs = set.passage.split(/\n\s*\n/);

    paragraphs.forEach((paragraph) => {
        const p = document.createElement('p');
        const parts = paragraph.split(/(__\d+__)/g);
        parts.forEach(part => {
            const match = part.match(/__\d+__/);
            if (match) {
                const index = Number(part.replace(/_/g, '')) - 1;
                const blank = document.createElement('span');
                blank.className = 'cloze-blank';
                blank.dataset.index = String(index);
                blank.textContent = '_____';
                blank.setAttribute('role', 'button');
                blank.setAttribute('tabindex', '0');
                blank.addEventListener('click', () => handleBlankClick(blank));
                blank.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleBlankClick(blank);
                    }
                });
                blank.addEventListener('dragover', (event) => event.preventDefault());
                blank.addEventListener('drop', (event) => {
                    event.preventDefault();
                    const word = event.dataTransfer.getData('text/plain');
                    if (word) fillBlank(blank, word);
                });
                p.appendChild(blank);
            } else {
                p.appendChild(document.createTextNode(part));
            }
        });
        ui.passage.appendChild(p);
    });
}

function buildBank(set) {
    ui.bank.innerHTML = '';
    const words = [...set.answers, ...set.distractors];
    shuffleArray(words).forEach(word => {
        const card = document.createElement('div');
        card.className = 'cloze-word';
        card.textContent = word;
        card.dataset.word = word;
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', word);
        });
        card.addEventListener('click', () => selectWordCard(card));
        ui.bank.appendChild(card);
    });
}

function selectWordCard(card) {
    const alreadySelected = card.classList.contains('selected');
    document.querySelectorAll('.cloze-word.selected').forEach(el => el.classList.remove('selected'));
    if (!alreadySelected && !card.classList.contains('used')) {
        card.classList.add('selected');
        state.selectedWord = card.dataset.word;
    } else {
        state.selectedWord = null;
    }
}

function handleBlankClick(blank) {
    if (blank.dataset.filled) {
        clearBlank(blank);
        return;
    }
    if (!state.selectedWord) return;
    fillBlank(blank, state.selectedWord);
}

function fillBlank(blank, word) {
    const index = Number(blank.dataset.index);
    const answer = CLOZE_SETS[state.currentIndex].answers[index];
    blank.textContent = word;
    blank.dataset.filled = word;
    blank.classList.add('filled');
    blank.classList.toggle('correct', word.toLowerCase() === answer.toLowerCase());
    blank.classList.toggle('wrong', word.toLowerCase() !== answer.toLowerCase());

    const card = ui.bank.querySelector(`.cloze-word[data-word="${CSS.escape(word)}"]`);
    if (card) {
        card.classList.add('used');
        card.classList.remove('selected');
        card.setAttribute('draggable', 'false');
    }

    if (word.toLowerCase() === answer.toLowerCase()) {
        state.streak += 1;
    } else {
        state.streak = 0;
        if (state.challenge) {
            state.hearts = Math.max(0, state.hearts - 1);
        }
    }

    state.selectedWord = null;
    state.completionBonus = 0;
    updateScore();
}

function clearBlank(blank) {
    const word = blank.dataset.filled;
    if (!word) return;
    blank.textContent = '_____';
    blank.dataset.filled = '';
    blank.classList.remove('filled', 'correct', 'wrong');

    const card = ui.bank.querySelector(`.cloze-word[data-word="${CSS.escape(word)}"]`);
    if (card) {
        card.classList.remove('used');
        card.setAttribute('draggable', 'true');
    }
    state.completionBonus = 0;
    updateScore();
}

function updateScore() {
    const blanks = Array.from(document.querySelectorAll('.cloze-blank'));
    const answers = CLOZE_SETS[state.currentIndex].answers;
    const correctCount = blanks.filter(blank => {
        const index = Number(blank.dataset.index);
        return blank.dataset.filled && blank.dataset.filled.toLowerCase() === answers[index].toLowerCase();
    }).length;

    state.coins = correctCount * 2 + state.completionBonus;
    ui.coins.textContent = state.coins;
    ui.streak.textContent = state.streak;
    renderHearts();

    if (correctCount === answers.length) {
        state.completionBonus = 5;
        ui.message.textContent = 'Level complete! +5 bonus coins ✨';
        ui.message.classList.add('visible');
        state.coins = correctCount * 2 + state.completionBonus;
        ui.coins.textContent = state.coins;
    } else {
        ui.message.classList.remove('visible');
    }
}

function renderHearts() {
    ui.hearts.innerHTML = '';
    if (!state.challenge) return;
    for (let i = 0; i < state.maxHearts; i += 1) {
        const span = document.createElement('span');
        span.textContent = i < state.hearts ? '❤️' : '🩶';
        ui.hearts.appendChild(span);
    }
}

function resetGame() {
    state.coins = 0;
    state.streak = 0;
    state.hearts = state.maxHearts;
    state.completionBonus = 0;
    state.selectedWord = null;
    buildPassage(CLOZE_SETS[state.currentIndex]);
    buildBank(CLOZE_SETS[state.currentIndex]);
    updateScore();
}

function shuffleBank() {
    const cards = Array.from(ui.bank.children);
    shuffleArray(cards).forEach(card => ui.bank.appendChild(card));
}

function checkStory() {
    const blanks = Array.from(document.querySelectorAll('.cloze-blank'));
    blanks.forEach(blank => {
        if (!blank.dataset.filled) {
            blank.classList.add('wrong');
        }
    });
    updateScore();
}

function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function init() {
    loadSettings();
    buildSelect();
    ui.select.value = String(state.currentIndex);
    ui.challenge.checked = state.challenge;
    ui.title.textContent = CLOZE_SETS[state.currentIndex].title;
    buildPassage(CLOZE_SETS[state.currentIndex]);
    buildBank(CLOZE_SETS[state.currentIndex]);
    updateScore();

    ui.select.addEventListener('change', (event) => {
        state.currentIndex = Number(event.target.value);
        ui.title.textContent = CLOZE_SETS[state.currentIndex].title;
        resetGame();
    });

    ui.reset.addEventListener('click', resetGame);
    ui.shuffle.addEventListener('click', shuffleBank);
    ui.check.addEventListener('click', checkStory);
    ui.challenge.addEventListener('change', (event) => {
        state.challenge = event.target.checked;
        saveSettings();
        renderHearts();
    });
}

init();
