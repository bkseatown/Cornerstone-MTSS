const TEMPLATES = [
    {
        id: 'cafeteria-caper',
        title: 'Cafeteria Caper',
        template: 'At the {place} cafeteria, lunch smelled like {type_of_food} and {silly_topping}. The chef wore a {adjective} hat and served a {snack} the size of a {animal}.\n\nSuddenly, {silly_name} {verb_past} in and shouted "{silly_sound}!" We all {verb_past} to our seats, giggling with {feeling}.'
    },
    {
        id: 'field-trip-fiasco',
        title: 'Field Trip Fiasco',
        template: 'On our field trip, we rode a {vehicle} to the {place}. The guide showed us a {color} {animal} that could {verb} with its {body_part}.\n\nWhen the stormy {weather} hit, our {silly_name} {verb_past} and everyone made a {silly_sound} noise. We stayed cozy and ate {type_of_food}.'
    },
    {
        id: 'pet-talent-show',
        title: 'Pet Talent Show',
        template: 'Welcome to the Pet Talent Show! First up, a {adjective} {animal} named {silly_name} who can {talent}.\n\nThe crowd cheered "{silly_sound}!" and tossed {snack}. The judge laughed so hard they {verb_past} their {body_part}.'
    },
    {
        id: 'weather-wizard',
        title: 'Weather Wizard',
        template: 'Today’s forecast: {weather}! A {adjective} wizard used {superpower} to turn the clouds into {type_of_food}.\n\nEveryone {verb_past} outside, waving their {body_part} and chanting "{silly_sound}". It was the most {feeling} day ever.'
    },
    {
        id: 'space-snack-attack',
        title: 'Space Snack Attack',
        template: 'Captain {silly_name} blasted off toward {planet} with a crate of {snack}. The ship’s computer was {adjective} and kept saying "{silly_sound}".\n\nAn alien with a {body_part} shaped like a {animal} {verb_past} onboard and traded {type_of_food} for a high five. Mission success!'
    },
    {
        id: 'mystery-museum',
        title: 'Mystery Museum',
        template: 'The {adjective} museum guard warns you about the {mystery} exhibit. Suddenly, the lights flicker and a {animal} in a {color} hat {verb_past} past!\n\nYou and {silly_name} follow it to the {place}, where the {villain} reveals a plan to steal the {treasure}. Good thing you brought {magical_item}!'
    },
    {
        id: 'jungle-rescue',
        title: 'Jungle Rescue',
        template: 'In the {weather} jungle, your {vehicle} gets stuck in {obstacle}. A {adjective} {animal} guides you to the {place} camp.\n\nYou shout "{silly_sound}!" and use {type_of_food} to lure the {animal} away. Rescue mission complete!'
    },
    {
        id: 'sky-castle',
        title: 'Sky Castle Quest',
        template: 'Your {vehicle} floats to a {adjective} castle in the clouds. The gate opens when you say "{silly_sound}" and show your {magical_item}.\n\nInside, the {villain} challenges you to a {talent} contest. You win, earn {treasure}, and celebrate with {type_of_food}.'
    },
    {
        id: 'robot-repair',
        title: 'Robot Repair Rally',
        template: 'At the {place} lab, a {adjective} robot named {silly_name} broke its {body_part}. You grab a {magical_item} and {verb_past} into action.\n\nWith a {silly_sound} and a {type_of_food} snack break, the robot learned to {talent} again. Everyone felt {feeling}.'
    },
    {
        id: 'city-parade',
        title: 'City Parade Surprise',
        template: 'The {color} parade float rolled down {place} street, led by a {adjective} {animal} who could {verb}.\n\nThe crowd shouted "{silly_sound}" and tossed {snack}. Then {silly_name} {verb_past} onstage and the band played a {feeling} tune.'
    },
    {
        id: 'campfire-mystery',
        title: 'Campfire Mystery',
        template: 'On a {weather} night at {place} camp, we heard a {silly_sound} near the {obstacle}.\n\nYou and your {sidekick} followed the tracks and found a {mystery} hidden inside a {magical_item}. The discovery felt {feeling}!'
    },
    {
        id: 'choose-your-path',
        title: 'Choose Your Own Adventure',
        template: 'At the edge of {place}, you meet {sidekick} who offers two paths: the {path_choice} trail or the {path_choice} tunnel. You grab your {magical_item} and head out.\n\nInside, a {obstacle} blocks the way, but you use {talent} to solve it. At the end, you find the {treasure} and promise to share it with your {sidekick}.'
    }
];

const PLACEHOLDER_LABELS = {
    adjective: 'Adjective',
    adverb: 'Adverb',
    animal: 'Animal',
    body_part: 'Body part',
    color: 'Color',
    direction: 'Direction',
    feeling: 'Feeling',
    interjection: 'Interjection',
    planet: 'Planet',
    place: 'Place',
    silly_name: 'Silly name',
    silly_sound: 'Silly sound',
    silly_topping: 'Silly topping',
    snack: 'Snack',
    sidekick: 'Sidekick',
    treasure: 'Treasure',
    obstacle: 'Obstacle',
    magical_item: 'Magic item',
    mystery: 'Mystery object',
    villain: 'Villain',
    path_choice: 'Path choice',
    superpower: 'Superpower',
    talent: 'Talent',
    type_of_food: 'Type of food',
    vehicle: 'Vehicle',
    weather: 'Type of weather',
    verb: 'Verb',
    verb_ing: 'Verb ending in -ing',
    verb_past: 'Verb (past tense)'
};

const PLACEHOLDER_EXAMPLES = {
    adjective: 'Example: bright',
    adverb: 'Example: quickly',
    animal: 'Example: rabbit',
    body_part: 'Example: elbow',
    color: 'Example: purple',
    direction: 'Example: north',
    feeling: 'Example: excited',
    interjection: 'Example: wow',
    planet: 'Example: Mars',
    place: 'Example: library',
    silly_name: 'Example: Captain Giggles',
    silly_sound: 'Example: boing',
    silly_topping: 'Example: glitter sauce',
    snack: 'Example: popcorn',
    sidekick: 'Example: brave puppy',
    treasure: 'Example: golden compass',
    obstacle: 'Example: giant boulder',
    magical_item: 'Example: crystal key',
    mystery: 'Example: glowing statue',
    villain: 'Example: sneaky wizard',
    path_choice: 'Example: rainbow',
    superpower: 'Example: invisibility',
    talent: 'Example: tap dance',
    type_of_food: 'Example: spaghetti',
    vehicle: 'Example: bus',
    weather: 'Example: thunderstorm',
    verb: 'Example: jump',
    verb_ing: 'Example: jumping',
    verb_past: 'Example: jumped'
};

const WORD_BANKS = {
    adjective: ['bright', 'mysterious', 'tiny', 'brave', 'sparkly'],
    adverb: ['quickly', 'quietly', 'happily', 'carefully'],
    animal: ['rabbit', 'dolphin', 'owl', 'turtle'],
    body_part: ['elbow', 'nose', 'knee', 'toe', 'ear'],
    color: ['purple', 'turquoise', 'gold', 'lime', 'scarlet'],
    direction: ['north', 'south', 'east', 'west'],
    feeling: ['excited', 'curious', 'proud', 'calm'],
    interjection: ['wow', 'hooray', 'oops', 'yay'],
    planet: ['Mars', 'Jupiter', 'Saturn', 'Neptune', 'Pluto'],
    place: ['library', 'park', 'museum', 'playground'],
    silly_name: ['Captain Giggles', 'Professor Noodle', 'Queen Wobble', 'Sir Sprinkles'],
    silly_sound: ['boing', 'kaboom', 'meep', 'sploot'],
    silly_topping: ['glitter sauce', 'marshmallow fog', 'rainbow sprinkles'],
    snack: ['popcorn', 'pretzels', 'apple slices', 'graham crackers'],
    sidekick: ['brave puppy', 'robot pal', 'mischievous fairy', 'tiny dragon'],
    treasure: ['golden compass', 'sparkle crown', 'mystery map', 'glowing gem'],
    obstacle: ['giant boulder', 'sticky vines', 'mystery maze', 'foggy river'],
    magical_item: ['crystal key', 'magic wand', 'whispering cloak', 'rainbow rope'],
    mystery: ['glowing statue', 'whispering door', 'vanishing painting', 'mystery box'],
    villain: ['sneaky wizard', 'grumpy troll', 'shadow cat', 'robot pirate'],
    path_choice: ['rainbow', 'moonlit', 'mossy', 'sparkly'],
    superpower: ['invisibility', 'super speed', 'ice breath', 'giant jumps'],
    talent: ['tap dance', 'juggle', 'sing opera', 'do backflips'],
    type_of_food: ['spaghetti', 'tacos', 'pancakes', 'dumplings'],
    vehicle: ['bus', 'train', 'submarine', 'hot-air balloon'],
    weather: ['rainstorm', 'snowy day', 'windy weather', 'sunny skies'],
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

function initClozeNav() {
    const header = document.querySelector('.madlibs-header');
    if (!header || document.getElementById('madlibs-cloze-link')) return;
    const link = document.createElement('a');
    link.id = 'madlibs-cloze-link';
    link.href = 'cloze.html';
    link.className = 'link-btn';
    link.textContent = 'Cloze';
    header.appendChild(link);
}

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

let madlibsVoices = [];
let madlibsVoicesPromise = null;
let madlibsSpeechTimeout = null;

const HIGH_QUALITY_VOICE_PATTERNS = [
    /Premium/i,
    /Enhanced/i,
    /Natural/i,
    /Neural/i,
    /Siri/i,
    /Google/i,
    /Microsoft/i,
    /Samantha/i,
    /Ava/i,
    /Alex/i,
    /Daniel/i,
    /Serena/i,
    /Kate/i
];

function getPreferredDialect() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return 'en-US';
    try {
        const parsed = JSON.parse(saved);
        const raw = (parsed.voiceDialect || 'en-US').toString().toLowerCase();
        if (['uk', 'en-uk', 'british', 'en-gb'].includes(raw)) return 'en-GB';
        if (['us', 'en-us', 'american'].includes(raw)) return 'en-US';
        if (raw.startsWith('en-')) return parsed.voiceDialect;
    } catch {
        return 'en-US';
    }
    return 'en-US';
}

function isHighQualityVoice(voice) {
    if (!voice || !voice.name) return false;
    return HIGH_QUALITY_VOICE_PATTERNS.some(pattern => pattern.test(voice.name));
}

function pickBestVoiceForLang(voices, targetLang) {
    if (!voices || !voices.length || !targetLang) return null;
    const normalized = targetLang.toLowerCase();
    const matches = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(normalized));
    if (!matches.length) return null;
    const highQuality = matches.filter(isHighQualityVoice);
    const pool = highQuality.length ? highQuality : matches;
    for (const pattern of HIGH_QUALITY_VOICE_PATTERNS) {
        const preferred = pool.find(v => pattern.test(v.name));
        if (preferred) return preferred;
    }
    return pool[0];
}

function pickBestEnglishVoice(voices) {
    const dialect = getPreferredDialect();
    return pickBestVoiceForLang(voices, dialect) || pickBestVoiceForLang(voices, 'en');
}

function getVoicesAsync(timeout = 800) {
    if (madlibsVoices.length) return Promise.resolve(madlibsVoices);
    if (madlibsVoicesPromise) return madlibsVoicesPromise;
    madlibsVoicesPromise = new Promise((resolve) => {
        const existing = window.speechSynthesis.getVoices();
        if (existing && existing.length) {
            madlibsVoices = existing;
            madlibsVoicesPromise = null;
            resolve(existing);
            return;
        }
        let resolved = false;
        const finish = () => {
            if (resolved) return;
            resolved = true;
            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length) madlibsVoices = voices;
            madlibsVoicesPromise = null;
            resolve(madlibsVoices);
        };
        if (window.speechSynthesis.addEventListener) {
            window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
        } else {
            window.speechSynthesis.onvoiceschanged = finish;
        }
        setTimeout(finish, timeout);
    });
    return madlibsVoicesPromise;
}

function speakUtterance(utterance) {
    if (!('speechSynthesis' in window)) return;
    if (madlibsSpeechTimeout) clearTimeout(madlibsSpeechTimeout);
    window.speechSynthesis.cancel();
    madlibsSpeechTimeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        madlibsSpeechTimeout = null;
    }, 40);
}

async function readStory() {
    const story = output.textContent;
    if (!story || output.classList.contains('empty')) return;
    const utterance = new SpeechSynthesisUtterance(story);
    const voices = await getVoicesAsync();
    const preferred = pickBestEnglishVoice(voices);
    if (preferred) {
        utterance.voice = preferred;
        utterance.lang = preferred.lang;
    } else {
        utterance.lang = getPreferredDialect();
    }
    utterance.rate = Math.max(0.7, getSpeechRate());
    utterance.pitch = 1.0;
    speakUtterance(utterance);
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
initClozeNav();
