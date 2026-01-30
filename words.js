/* Compatibility bundle: words.js
   Contains phonics_focus_data + jokes_facts_quotes_bank
   Keep for older builds expecting words.js. */

/* =========================================
   DECODE THE WORD - WORD BANK (MASTER v7)
   Data-only: taxonomy + bonus + quotes + word entries
   ========================================= */

(function () {
  // ---------------------------
  // 1) FOCUS TAXONOMY + UI INFO
  // ---------------------------
  window.FOCUS_INFO = {
    mixed: {
      label: "Mixed Review (cat, ship, tree)",
      desc: "A mix of phonics patterns you’ve practiced.",
      hint: "Look for any pattern you recognize.",
      examples: ["cat", "ship", "tree"],
      allowedLengths: [3, 4, 5, 6, 7, 8, 9, 10],
      defaultLength: 5
    },

    cvc: {
      label: "CVC (cat, map)",
      desc: "Consonant–Vowel–Consonant words with short vowels.",
      hint: "The vowel is usually short (a, e, i, o, u).",
      examples: ["cat", "sun", "web"],
      allowedLengths: [3],
      defaultLength: 3,
      quick: ["a", "e", "i", "o", "u"],
      helper: { type: "pattern", indices: [1] }
    },

    cvcc: {
      label: "CVCC (milk, hand)",
      desc: "Short vowel followed by two consonants.",
      hint: "Blend the last two sounds smoothly.",
      examples: ["milk", "fast", "hand"],
      allowedLengths: [4],
      defaultLength: 4,
      quick: ["st", "nd", "mp", "lk", "ft", "sk"],
      helper: { type: "range", start: 2, end: 3 }
    },

    ccvc: {
      label: "CCVC (stop, crab)",
      desc: "Two consonants at the start, then a vowel.",
      hint: "Say the first two consonants quickly together.",
      examples: ["stop", "frog", "clap"],
      allowedLengths: [4],
      defaultLength: 4,
      quick: ["st", "cl", "fl", "br", "cr", "tr", "gr", "pl", "sl", "dr"],
      helper: { type: "range", start: 0, end: 1 }
    },

    digraph: {
      label: "Digraphs (sh, ch, th)",
      desc: "Two letters that make one sound.",
      hint: "Look for pairs like sh, ch, th, wh, ck.",
      examples: ["ship", "chop", "thin"],
      allowedLengths: [3, 4, 5, 6],
      defaultLength: 4,
      quick: ["sh", "ch", "th", "wh", "ck", "ph"],
      helper: { type: "dynamic" }
    },

    blend: {
      label: "Blends (st, bl, tr)",
      desc: "Two or three consonants blended together.",
      hint: "You can hear each sound, but they move fast.",
      examples: ["stop", "flag", "crab"],
      allowedLengths: [4, 5, 6],
      defaultLength: 4,
      quick: [
        "bl","cl","fl","gl","pl","sl",
        "br","cr","dr","fr","gr","pr","tr",
        "sc","sk","sm","sn","sp","st","sw","spr","str"
      ],
      helper: { type: "range", start: 0, end: 1 }
    },

    floss: {
      label: "FLOSS Rule (ff, ll, ss, zz)",
      desc: "Short vowel words often end with ff, ll, ss, or zz.",
      hint: "Short vowel + f/l/s/z at the end? Double it!",
      examples: ["hill", "mess", "buzz"],
      allowedLengths: [4, 5],
      defaultLength: 4,
      quick: ["ff", "ll", "ss", "zz"],
      helper: { type: "range", start: 2, end: 3 }
    },

    "magic-e": {
      label: "Magic E (bake, late)",
      desc: "A silent e at the end makes the vowel say its name.",
      hint: "The e is quiet, but it changes the vowel sound.",
      examples: ["bake", "time", "hope"],
      allowedLengths: [4, 5, 6],
      defaultLength: 4,
      quick: ["a_e", "i_e", "o_e", "u_e", "e_e"],
      helper: { type: "pattern", indices: [1, 3] }
    },

    "vowel-team": {
      label: "Vowel Teams (rain, boat)",
      desc: "Two vowels work together to make one sound.",
      hint: "Spot teams like ai, ea, ee, oa, ou, oi.",
      examples: ["rain", "boat", "seed"],
      allowedLengths: [4, 5, 6],
      defaultLength: 4,
      quick: ["ai","ay","ee","ea","oa","ow","ou","oi","oy","oo","au","aw"],
      helper: { type: "pattern", indices: [1, 2] }
    },

    "r-controlled": {
      label: "R-Controlled (car, bird)",
      desc: "The letter r changes the vowel sound.",
      hint: "The r is bossy: ar, er, ir, or, ur.",
      examples: ["car", "bird", "fork"],
      allowedLengths: [3, 4, 5, 6],
      defaultLength: 4,
      quick: ["ar","er","ir","or","ur"],
      helper: { type: "pattern", indices: [1, 2] }
    },

    prefix: {
      label: "Prefixes (un-, re-, pre-)",
      desc: "A prefix is added to the beginning of a word.",
      hint: "Common prefixes: un-, re-, pre-, dis-, mis-.",
      examples: ["redo", "unfair", "preview"],
      allowedLengths: [4, 5, 6, 7, 8, 9, 10],
      defaultLength: 6,
      quick: ["un","re","pre","dis","mis","non","sub","inter"],
      helper: { type: "range", start: 0, end: 2 }
    },

    suffix: {
      label: "Suffixes (-s, -ed, -ing)",
      desc: "A suffix is added to the end of a word.",
      hint: "Common suffixes: -s, -ed, -ing, -er, -est, -ly.",
      examples: ["cats", "jumped", "playing"],
      allowedLengths: [4, 5, 6, 7, 8, 9, 10],
      defaultLength: 6,
      quick: ["s","es","ed","ing","er","est","ly","tion","ment"],
      helper: { type: "suffix" }
    },

    doubling: {
      label: "Doubling 1-1-1 (hop → hopping)",
      desc: "Sometimes you double the final consonant before adding a suffix.",
      hint: "1 syllable + 1 vowel + 1 consonant → double it before -ing/-ed.",
      examples: ["hopping", "running", "winning"],
      allowedLengths: [5, 6, 7, 8, 9, 10],
      defaultLength: 7,
      quick: ["ing","ed","er"],
      helper: { type: "morpheme" }
    },

    schwa: {
      label: "Schwa (sofa, about)",
      desc: "An unstressed vowel that sounds like /uh/ (or a relaxed vowel sound).",
      hint: "Say the word naturally and listen for the ‘lazy vowel’ sound.",
      examples: ["about", "sofa", "animal"],
      allowedLengths: [4, 5, 6, 7, 8, 9, 10],
      defaultLength: 5,
      quick: ["a","e","o","i","u"],
      helper: { type: "syllableHint" }
    },

    multisyllable: {
      label: "Multisyllabic (pic-nic, bas-ket)",
      desc: "Words with two or more syllables.",
      hint: "Break it into chunks. Clap it out. Then blend it back together.",
      examples: ["pic-nic", "bas-ket", "ro-bot"],
      allowedLengths: [6, 7, 8, 9, 10],
      defaultLength: 6,
      quick: ["tion","ment","ing","er","pre","re","dis"],
      helper: { type: "syllablesHyphen" }
    }
  };


 // ---------------------------
  // 4) WORD BANK (ENTRIES)
  // ---------------------------
  window.WORD_ENTRIES = {
    // ===== CVC (3) =====
    cat:  { syllables:["cat"], syllableText:"cat", tags:["cvc","mixed"], def:"A small pet that meows.", sentence:"The cat curled up and purred." },
    dog:  { syllables:["dog"], syllableText:"dog", tags:["cvc","mixed"], def:"A loyal animal that can bark.", sentence:"My dog ran to greet me at the door." },
    sun:  { syllables:["sun"], syllableText:"sun", tags:["cvc","mixed"], def:"The star that gives Earth light and heat.", sentence:"The sun warmed the playground." },
    map:  { syllables:["map"], syllableText:"map", tags:["cvc"], def:"A drawing that helps you find places.", sentence:"We used a map to plan our route." },
    hat:  { syllables:["hat"], syllableText:"hat", tags:["cvc"], def:"Something you wear on your head.", sentence:"He wore a hat to block the sun." },
    lip:  { syllables:["lip"], syllableText:"lip", tags:["cvc"], def:"The edge of your mouth.", sentence:"She put balm on her lip in dry weather." },
    sit:  { syllables:["sit"], syllableText:"sit", tags:["cvc"], def:"To rest on a seat.", sentence:"Please sit and listen carefully." },
    hop:  { syllables:["hop"], syllableText:"hop", tags:["cvc"], def:"To jump on one foot.", sentence:"The rabbit can hop very fast." },
    win:  { syllables:["win"], syllableText:"win", tags:["cvc"], def:"To be the one who succeeds.", sentence:"Our team worked hard to win." },
    mud:  { syllables:["mud"], syllableText:"mud", tags:["cvc"], def:"Wet, soft dirt.", sentence:"Boots help when the path is mud." },
    pen:  { syllables:["pen"], syllableText:"pen", tags:["cvc"], def:"A tool for writing with ink.", sentence:"I wrote a note with a blue pen." },
    jet:  { syllables:["jet"], syllableText:"jet", tags:["cvc"], def:"A fast airplane.", sentence:"A jet roared across the sky." },
    fix:  { syllables:["fix"], syllableText:"fix", tags:["cvc"], def:"To make something work again.", sentence:"We can fix it with patience and tools." },
    jam:  { syllables:["jam"], syllableText:"jam", tags:["cvc"], def:"Sweet spread made from fruit.", sentence:"I ate toast with strawberry jam." },
    van:  { syllables:["van"], syllableText:"van", tags:["cvc"], def:"A vehicle that carries people or things.", sentence:"The van brought supplies to school." },

    // ===== CVCC (4) =====
    milk: { syllables:["milk"], syllableText:"milk", tags:["cvcc","blend"], def:"A drink that can come from cows.", sentence:"I drank milk after soccer practice." },
    hand: { syllables:["hand"], syllableText:"hand", tags:["cvcc"], def:"The part of your body with fingers.", sentence:"Raise your hand if you have an idea." },
    jump: { syllables:["jump"], syllableText:"jump", tags:["cvcc","blend"], def:"To push off the ground and go up.", sentence:"Jump over the puddle in one try." },
    fast: { syllables:["fast"], syllableText:"fast", tags:["cvcc","blend"], def:"Moving quickly.", sentence:"The fast runner finished first." },
    tent: { syllables:["tent"], syllableText:"tent", tags:["cvcc"], def:"A shelter made of fabric for camping.", sentence:"We slept in a tent under the stars." },
    belt: { syllables:["belt"], syllableText:"belt", tags:["cvcc"], def:"A strap worn around your waist.", sentence:"He buckled his belt before the trip." },
    mask: { syllables:["mask"], syllableText:"mask", tags:["cvcc"], def:"Something that covers your face.", sentence:"Her mask was part of a costume." },
    lamp: { syllables:["lamp"], syllableText:"lamp", tags:["cvcc"], def:"A light you can turn on.", sentence:"The lamp helped me read at night." },
    sand: { syllables:["sand"], syllableText:"sand", tags:["cvcc"], def:"Tiny grains found on beaches.", sentence:"The sand felt warm under my feet." },
    nest: { syllables:["nest"], syllableText:"nest", tags:["cvcc"], def:"A bird’s home made of twigs.", sentence:"We spotted a nest in the tree." },

    // ===== CCVC (4) =====
    stop: { syllables:["stop"], syllableText:"stop", tags:["ccvc","blend"], def:"To end or pause moving.", sentence:"Stop and look before crossing." },
    crab: { syllables:["crab"], syllableText:"crab", tags:["ccvc","blend"], def:"A sea animal with claws.", sentence:"A crab hid under the rock." },
    clap: { syllables:["clap"], syllableText:"clap", tags:["ccvc","blend"], def:"To hit your hands together.", sentence:"Clap for the class performance." },
    frog: { syllables:["frog"], syllableText:"frog", tags:["ccvc","blend"], def:"A small animal that can hop and swim.", sentence:"The frog leapt into the pond." },
    trip: { syllables:["trip"], syllableText:"trip", tags:["ccvc","blend"], def:"A journey from one place to another.", sentence:"We packed snacks for the trip." },
    swim: { syllables:["swim"], syllableText:"swim", tags:["ccvc","blend"], def:"To move through water.", sentence:"I can swim from wall to wall." },
    drum: { syllables:["drum"], syllableText:"drum", tags:["ccvc","blend"], def:"A musical instrument you tap.", sentence:"The drum kept a steady beat." },
    brag: { syllables:["brag"], syllableText:"brag", tags:["ccvc","blend"], def:"To talk too much about yourself.", sentence:"Try not to brag—let your work speak." },
    slip: { syllables:["slip"], syllableText:"slip", tags:["ccvc","blend"], def:"To slide by accident.", sentence:"I might slip if the floor is wet." },
    grin: { syllables:["grin"], syllableText:"grin", tags:["ccvc","blend"], def:"A wide smile.", sentence:"He gave a grin when he solved it." },

    // ===== FLOSS (4–5) =====
    hill:  { syllables:["hill"],  syllableText:"hill",  tags:["floss"], def:"A raised area of land, smaller than a mountain.", sentence:"We rolled down the grassy hill." },
    bell:  { syllables:["bell"],  syllableText:"bell",  tags:["floss"], def:"A metal object that rings.", sentence:"The bell rang to start class." },
    miss:  { syllables:["miss"],  syllableText:"miss",  tags:["floss"], def:"To feel someone is gone.", sentence:"I miss my friend when they’re away." },
    mess:  { syllables:["mess"],  syllableText:"mess",  tags:["floss"], def:"A dirty or mixed-up situation.", sentence:"Clean up the mess after the project." },
    fuzz:  { syllables:["fuzz"],  syllableText:"fuzz",  tags:["floss"], def:"Soft, tiny hairs or fibers.", sentence:"The peach had fuzz on its skin." },
    buzz:  { syllables:["buzz"],  syllableText:"buzz",  tags:["floss"], def:"A humming sound like a bee.", sentence:"I heard a buzz near the flowers." },
    chill: { syllables:["chill"], syllableText:"chill", tags:["floss","digraph"], def:"A cool feeling, or to relax.", sentence:"We felt a chill in the morning air." },
    sniff: { syllables:["sniff"], syllableText:"sniff", tags:["floss","blend"], def:"To breathe in through your nose.", sentence:"Sniff the soup to smell the spices." },

    // ===== DIGRAPHS =====
    ship:  { syllables:["ship"],  syllableText:"ship",  tags:["digraph","cvcc"], def:"A large boat that travels on water.", sentence:"The ship crossed the ocean at night." },
    chop:  { syllables:["chop"],  syllableText:"chop",  tags:["digraph"], def:"To cut something with quick hits.", sentence:"Chop the vegetables carefully." },
    thin:  { syllables:["thin"],  syllableText:"thin",  tags:["digraph"], def:"Not thick.", sentence:"The ice was thin near the edge." },
    wish:  { syllables:["wish"],  syllableText:"wish",  tags:["digraph"], def:"A hope for something you want.", sentence:"I made a wish before blowing out candles." },
    check: { syllables:["check"], syllableText:"check", tags:["digraph"], def:"To look at something closely.", sentence:"Check your work before turning it in." },
    path:  { syllables:["path"],  syllableText:"path",  tags:["digraph"], def:"A way to walk or travel.", sentence:"We followed the path through the woods." },

    // ===== BLENDS =====
    flag:   { syllables:["flag"],   syllableText:"flag",   tags:["blend","cvcc"], def:"A piece of cloth used as a symbol.", sentence:"The flag waved in the wind." },
    step:   { syllables:["step"],   syllableText:"step",   tags:["blend"], def:"One movement when you walk.", sentence:"Take one step at a time." },
    crash:  { syllables:["crash"],  syllableText:"crash",  tags:["blend","digraph"], def:"To hit something loudly or suddenly.", sentence:"The waves crash against the rocks." },
    grow:   { syllables:["grow"],   syllableText:"grow",   tags:["blend"], def:"To get bigger or develop.", sentence:"Plants grow with sunlight and water." },
    stream: { syllables:["stream"], syllableText:"stream", tags:["blend"], def:"A small flowing body of water.", sentence:"A clear stream ran through the valley." },

    // ===== MAGIC E =====
    bake: { syllables:["bake"], syllableText:"bake", tags:["magic-e"], def:"To cook food using heat in an oven.", sentence:"We bake bread on the weekend." },
    hope: { syllables:["hope"], syllableText:"hope", tags:["magic-e"], def:"To want something good to happen.", sentence:"Never lose hope when learning feels hard." },
    ride: { syllables:["ride"], syllableText:"ride", tags:["magic-e"], def:"To travel on something like a bike or horse.", sentence:"She learned to ride without training wheels." },

    // ===== VOWEL TEAMS =====
    rain:  { syllables:["rain"],  syllableText:"rain",  tags:["vowel-team"], def:"Water that falls from clouds.", sentence:"Rain helps plants grow." },
    beach: { syllables:["beach"], syllableText:"beach", tags:["vowel-team","digraph"], def:"Sandy land near the ocean.", sentence:"We built a castle on the beach." },
    seed:  { syllables:["seed"],  syllableText:"seed",  tags:["vowel-team"], def:"The part of a plant that can grow.", sentence:"A tiny seed can become a tree." },

    // ===== R-CONTROLLED =====
    bird:  { syllables:["bird"],  syllableText:"bird",  tags:["r-controlled"], def:"An animal with feathers and wings.", sentence:"A bird sang outside the window." },
    storm: { syllables:["storm"], syllableText:"storm", tags:["r-controlled"], def:"Strong weather with wind or rain.", sentence:"The storm passed quickly." },
    park:  { syllables:["park"],  syllableText:"park",  tags:["r-controlled"], def:"A place with grass and trees for play.", sentence:"We met friends at the park." },

    // ===== MULTISYLLABIC =====
    picnic:  { syllables:["pic","nic"], syllableText:"pic-nic", tags:["multisyllable","cvcc"], def:"A meal eaten outdoors.", sentence:"We shared lunch at a picnic." },
    basket:  { syllables:["bas","ket"], syllableText:"bas-ket", tags:["multisyllable","cvcc"], def:"A container woven from strips.", sentence:"She carried apples in a basket." },
    robot:   { syllables:["ro","bot"],  syllableText:"ro-bot",  tags:["multisyllable"], def:"A machine that can follow instructions.", sentence:"The robot moved using code." },
    respect: { syllables:["re","spect"],syllableText:"re-spect",tags:["multisyllable","prefix"], def:"Caring about others and their ideas.", sentence:"Respect makes learning safer for everyone." }
  

};
})();


 // ---------------------------
  // 2) BONUS CONTENT
  // ---------------------------
  window.BONUS_BANK = {
    facts: [
      "Honey never spoils.",
      "Octopuses have three hearts.",
      "A group of flamingos is called a flamboyance.",
      "Your brain uses about 20% of your body’s energy.",
      "Some turtles can breathe through their skin.",
      "The moon has moonquakes.",
      "Ants don’t have lungs.",
      "A bolt of lightning can be hotter than the surface of the sun.",
      "Bananas are berries, but strawberries are not.",
      "Wombat poop can be cube-shaped.",
      "A day on Venus is longer than a year on Venus.",
      "Butterflies taste with their feet.",
      "Sharks have been around longer than trees.",
      "Sea otters hold hands while sleeping so they don’t drift apart.",
      "A cloud can weigh more than a million pounds.",
      "Koalas have fingerprints similar to humans.",
      "Some frogs can freeze and thaw without harm.",
      "The heart of a shrimp is in its head.",
      "A group of crows is called a murder.",
      "The Eiffel Tower can grow taller in summer heat.",
      "The Great Barrier Reef is the largest living structure on Earth.",
      "There are more stars in space than grains of sand on many beaches.",
      "Some plants can ‘talk’ using chemicals to warn each other.",
      "Owls can turn their heads very far because of extra neck bones.",
      "An astronaut’s suit is like a small spaceship.",
      "Water can boil and freeze at the same time under special conditions.",
      "Jellyfish have been around for hundreds of millions of years.",
      "The fastest land animal is the cheetah.",
      "The tallest animals are giraffes.",
      "Some volcanoes are under the ocean.",
      "The Amazon rainforest helps make oxygen for Earth.",
      "A single tree can be home to hundreds of species.",
      "Some birds can fly thousands of kilometers without stopping.",
      "The human body has 206 bones (grown-ups).",
      "Your tongue has unique prints like fingerprints.",
      "Some crystals grow in perfect patterns.",
      "There are deserts made of snow (Antarctica).",
      "Some dinosaurs had feathers.",
      "The Sun is a star, and it’s closer than any other star.",
      "Saturn would float in water if you had a big enough ocean.",
      "A compass points to Earth’s magnetic north, not the geographic north.",
      "The ocean has mountains and waterfalls under the surface.",
      "Some fish can glow in the dark (bioluminescence).",
      "The Milky Way is a galaxy, and Earth is inside it.",
      "Rocks can “cycle” and change form over time.",
      "Your bones are living tissue that can rebuild.",
      "Some spiders can ‘balloon’ through the air on silk.",
      "A seed can wait a long time before it starts to grow.",
      "Some whales sing songs that can travel far underwater."
    ],

    jokes: [
      { q: "Why did the pencil cross the road?", a: "To draw the other side!" },
      { q: "What do you call a bear with no teeth?", a: "A gummy bear!" },
      { q: "Why did the scarecrow win an award?", a: "He was outstanding in his field!" },
      { q: "What do you call a sleeping dinosaur?", a: "A dino-snore!" },
      { q: "Why did the cookie go to the hospital?", a: "Because it felt crummy." },
      { q: "What has hands but can’t clap?", a: "A clock." },
      { q: "Why did the math book look worried?", a: "It had too many problems." },
      { q: "What do you call a fake noodle?", a: "An impasta!" },
      { q: "Why did the bike fall over?", a: "Because it was two-tired." },
      { q: "What do you call a snowman in summer?", a: "A puddle!" },
      { q: "Why don’t eggs tell jokes?", a: "They might crack up." },
      { q: "What do you call cheese that isn’t yours?", a: "Nacho cheese!" },
      { q: "Why did the computer get cold?", a: "It left its Windows open." },
      { q: "What do you call a fish wearing a bowtie?", a: "So-fish-ticated." },
      { q: "Why was the broom late?", a: "It swept in." },
      { q: "What kind of tree fits in your hand?", a: "A palm tree." },
      { q: "Why did the tomato blush?", a: "It saw the salad dressing!" },
      { q: "What do you call a tiny mother?", a: "A minimum!" },
      { q: "Why did the music note go to school?", a: "To improve its pitch." },
      { q: "What do you call an alligator detective?", a: "An investi-gator!" },
      { q: "Why did the astronaut break up with the moon?", a: "It needed space." },
      { q: "What do you call a lazy kangaroo?", a: "A pouch potato." },
      { q: "Why did the library book look sad?", a: "It had too many chapters." },
      { q: "What do you call a clever boat?", a: "A brain vessel." },
      { q: "Why did the magnet smile?", a: "It found something attractive." }
    ]
  };

  // ---------------------------
  // 3) QUOTES (GRADE-BANDED)
  // - Keep quotes short and clear.
  // - “speaker” is optional display.
  // ---------------------------
  window.QUOTE_BANK = {
    k2: [
      { text: "Keep going. You can do hard things.", speaker: "Learning Motto" },
      { text: "Mistakes help your brain grow.", speaker: "Growth Mindset" },
      { text: "Try again with a brave heart.", speaker: "Learning Motto" },
      { text: "Small steps add up.", speaker: "Learning Motto" },
      { text: "Read, think, and wonder.", speaker: "Learning Motto" }
    ],
    g3_5: [
      { text: "Practice makes progress.", speaker: "Learning Motto" },
      { text: "Be curious. Ask great questions.", speaker: "Learning Motto" },
      { text: "Your effort matters more than perfect.", speaker: "Growth Mindset" },
      { text: "Learning is an adventure.", speaker: "Learning Motto" },
      { text: "A reader is a leader.", speaker: "Learning Motto" }
    ],
    g6_8: [
      { text: "The expert in anything was once a beginner.", speaker: "Learning Motto" },
      { text: "Discipline is choosing what you want most.", speaker: "Learning Motto" },
      { text: "Confidence grows from keeping promises to yourself.", speaker: "Learning Motto" },
      { text: "Questions are the engines of learning.", speaker: "Learning Motto" },
      { text: "Focus on improvement, not comparison.", speaker: "Learning Motto" }
    ],
    g9_12: [
      { text: "Education is the passport to the future.", speaker: "Popular Quote" },
      { text: "The more you learn, the more you can serve.", speaker: "Learning Motto" },
      { text: "Clarity comes from action and reflection.", speaker: "Learning Motto" },
      { text: "Your habits shape your future.", speaker: "Learning Motto" },
      { text: "Build skills that let you help others.", speaker: "Learning Motto" }
    ]
  };

