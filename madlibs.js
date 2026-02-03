const TEMPLATES = [
    {
        id: 'classroom-adventure',
        title: 'Classroom Adventure',
        template: 'Today our class visited the {place}. We saw a {adjective} {animal} and it {verb_past} loudly. Everyone felt {feeling}.'
    },
    {
        id: 'space-mission',
        title: 'Space Mission',
        template: 'Captain {name} launched the {noun} into space. The crew {verb_past} past a {adjective} planet and discovered a {noun}.'
    },
    {
        id: 'weather-report',
        title: 'Weather Report',
        template: 'Good morning! Today will be {adjective} with a chance of {noun_plural}. The wind will {verb} from the {direction}.'
    },
    {
        id: 'fairy-tale',
        title: 'Fairy Tale Remix',
        template: 'Once upon a time, a {adjective} {noun} met a {adjective} {animal}. They decided to {verb} to the {place}.'
    },
    {
        id: 'sports-day',
        title: 'Sports Day',
        template: 'Our team practiced {verb_ing} and felt {feeling}. The coach said, "{interjection}!" We scored a {adjective} win.'
    }
];

const PLACEHOLDER_LABELS = {
    adjective: 'Adjective',
    adverb: 'Adverb',
    animal: 'Animal',
    direction: 'Direction',
    feeling: 'Feeling',
    interjection: 'Interjection',
    name: 'Name',
    noun: 'Noun',
    noun_plural: 'Plural Noun',
    place: 'Place',
    verb: 'Verb',
    verb_ing: 'Verb ending in -ing',
    verb_past: 'Verb (past tense)'
};

const PLACEHOLDER_EXAMPLES = {
    adjective: 'Example: bright',
    adverb: 'Example: quickly',
    animal: 'Example: rabbit',
    direction: 'Example: north',
    feeling: 'Example: excited',
    interjection: 'Example: wow',
    name: 'Example: Maya',
    noun: 'Example: backpack',
    noun_plural: 'Example: balloons',
    place: 'Example: library',
    verb: 'Example: jump',
    verb_ing: 'Example: jumping',
    verb_past: 'Example: jumped'
};

const WORD_BANKS = {
    adjective: ['bright', 'mysterious', 'tiny', 'brave', 'sparkly'],
    adverb: ['quickly', 'quietly', 'happily', 'carefully'],
    animal: ['rabbit', 'dolphin', 'owl', 'turtle'],
    direction: ['north', 'south', 'east', 'west'],
    feeling: ['excited', 'curious', 'proud', 'calm'],
    interjection: ['wow', 'hooray', 'oops', 'yay'],
    name: ['Maya', 'Noah', 'Ava', 'Liam'],
    noun: ['backpack', 'rocket', 'lantern', 'puzzle'],
    noun_plural: ['balloons', 'stories', 'sandwiches', 'dragons'],
    place: ['library', 'park', 'museum', 'playground'],
    verb: ['jump', 'explore', 'build', 'discover'],
    verb_ing: ['jumping', 'exploring', 'building', 'discovering'],
    verb_past: ['jumped', 'explored', 'built', 'discovered']
};

const SETTINGS_KEY = 'decode_settings';
let currentTemplate = TEMPLATES[0].template;
let currentPlaceholders = [];

const templateSelect = document.getElementById('madlibs-template-select');
const templateInput = document.getElementById('madlibs-template-input');
const fieldsContainer = document.getElementById('madlibs-fields');
const output = document.getElementById('madlibs-output');

function initTemplates() {
    templateSelect.innerHTML = '';
    TEMPLATES.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = template.title;
        templateSelect.appendChild(option);
    });
}

function extractPlaceholders(template) {
    const regex = /{([^}]+)}/g;
    const found = [];
    let match;
    while ((match = regex.exec(template)) !== null) {
        const key = match[1].trim();
        if (key && !found.includes(key)) {
            found.push(key);
        }
    }
    return found;
}

function labelFor(key) {
    return PLACEHOLDER_LABELS[key] || key.replace(/_/g, ' ');
}

function exampleFor(key) {
    return PLACEHOLDER_EXAMPLES[key] || '';
}

function buildFields(placeholders) {
    fieldsContainer.innerHTML = '';
    currentPlaceholders = placeholders;

    if (!placeholders.length) {
        fieldsContainer.innerHTML = '<p class="muted">Add placeholders like {noun} to get started.</p>';
        return;
    }

    placeholders.forEach(key => {
        const field = document.createElement('div');
        field.className = 'madlibs-field';

        const help = exampleFor(key);
        field.innerHTML = `
            <label>${labelFor(key)}${help ? `<span class="field-help">${help}</span>` : ''}</label>
            <div class="field-row">
                <input type="text" data-key="${key}" placeholder="${labelFor(key)}">
                <button type="button" data-suggest="${key}">Suggest</button>
            </div>
        `;

        const suggestBtn = field.querySelector('button');
        if (!WORD_BANKS[key]) {
            suggestBtn.disabled = true;
            suggestBtn.style.opacity = '0.5';
            suggestBtn.style.cursor = 'not-allowed';
        } else {
            suggestBtn.addEventListener('click', () => {
                const choices = WORD_BANKS[key];
                const choice = choices[Math.floor(Math.random() * choices.length)];
                const input = field.querySelector('input');
                input.value = choice;
            });
        }

        fieldsContainer.appendChild(field);
    });
}

function applyTemplate(template) {
    currentTemplate = template;
    const placeholders = extractPlaceholders(template);
    buildFields(placeholders);
    output.textContent = 'Your story will appear here.';
    output.classList.add('empty');
}

function generateStory() {
    let story = currentTemplate;
    currentPlaceholders.forEach(key => {
        const input = fieldsContainer.querySelector(`input[data-key="${key}"]`);
        const value = input && input.value.trim() ? input.value.trim() : `[${labelFor(key)}]`;
        const regex = new RegExp(`{${key}}`, 'g');
        story = story.replace(regex, value);
    });

    output.textContent = story;
    output.classList.remove('empty');
}

function getSpeechRate() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return 0.85;
    try {
        const parsed = JSON.parse(saved);
        return parsed.speechRate || 0.85;
    } catch {
        return 0.85;
    }
}

function readStory() {
    const story = output.textContent;
    if (!story || output.classList.contains('empty')) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(story);
    utterance.rate = Math.max(0.7, getSpeechRate());
    window.speechSynthesis.speak(utterance);
}

function autoFill() {
    currentPlaceholders.forEach(key => {
        const input = fieldsContainer.querySelector(`input[data-key="${key}"]`);
        if (!input) return;
        if (WORD_BANKS[key]) {
            const choices = WORD_BANKS[key];
            input.value = choices[Math.floor(Math.random() * choices.length)];
        }
    });
}

function wireEvents() {
    document.getElementById('madlibs-use-template').addEventListener('click', () => {
        const selected = TEMPLATES.find(t => t.id === templateSelect.value);
        if (selected) applyTemplate(selected.template);
    });

    document.getElementById('madlibs-random-template').addEventListener('click', () => {
        const pick = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
        templateSelect.value = pick.id;
        applyTemplate(pick.template);
    });

    document.getElementById('madlibs-parse-template').addEventListener('click', () => {
        const custom = templateInput.value.trim();
        if (custom) applyTemplate(custom);
    });

    document.getElementById('madlibs-generate').addEventListener('click', generateStory);
    document.getElementById('madlibs-autofill').addEventListener('click', autoFill);
    document.getElementById('madlibs-read').addEventListener('click', readStory);
    document.getElementById('madlibs-reset').addEventListener('click', () => {
        fieldsContainer.querySelectorAll('input').forEach(input => input.value = '');
        output.textContent = 'Your story will appear here.';
        output.classList.add('empty');
    });
}

initTemplates();
applyTemplate(currentTemplate);
wireEvents();
