/* =========================================
   DECODE THE WORD - COMPREHENSIVE WORD BANK (v9 ENHANCED)
   500+ words aligned with OG, Wilson, UFLI, Words Their Way
   Science of Reading principles with rich, decodable sentences
   ========================================= */

(function () {
  // ---------------------------
  // 1) FOCUS TAXONOMY + UI INFO
  // ---------------------------
  window.FOCUS_INFO = {
    all: {
      title: "Mixed Review",
      desc: "A mix of phonics patterns you've practiced.",
      hint: "Look for any pattern you recognize.",
      examples: "cat, ship, blend, magic",
      allowedLengths: [3, 4, 5, 6, 7, 8, 9, 10],
      defaultLength: 5
    },

    cvc: {
      title: "CVC (Short Vowels)",
      desc: "Consonant–Vowel–Consonant words with short vowel sounds.",
      hint: "The vowel is usually short (ă, ĕ, ĭ, ŏ, ŭ).",
      examples: "cat, bed, sit, hop, sun",
      allowedLengths: [3],
      defaultLength: 3,
      quick: ["a", "e", "i", "o", "u"],
      helper: { type: "pattern", indices: [1] }
    },

    cvcc: {
      title: "CVCC (Final Blends)",
      desc: "Short vowel followed by two consonants at the end.",
      hint: "Blend the last two sounds smoothly together.",
      examples: "milk, hand, jump, fast",
      allowedLengths: [4],
      defaultLength: 4,
      quick: ["st", "nd", "mp", "lk", "ft", "sk", "nt", "lt", "pt"],
      helper: { type: "range", start: 2, end: 3 }
    },

    ccvc: {
      title: "CCVC (Initial Blends)",
      desc: "Two consonants at the start blend together.",
      hint: "Say the first two consonants quickly as one smooth sound.",
      examples: "stop, crab, flag, swim",
      allowedLengths: [4],
      defaultLength: 4,
      quick: ["st", "cl", "fl", "br", "cr", "tr", "gr", "pl", "sl", "dr", "fr", "pr", "bl", "gl", "sc", "sk", "sm", "sn", "sp", "sw"],
      helper: { type: "range", start: 0, end: 1 }
    },

    digraph: {
      title: "Digraphs",
      desc: "Two letters working together to make one sound.",
      hint: "Look for ch, sh, th, wh, ph, ck, ng, nk.",
      examples: "ship, chip, bath, ring",
      allowedLengths: [3, 4, 5, 6],
      defaultLength: 4,
      quick: ["sh", "ch", "th", "wh", "ck", "ph", "ng", "nk"],
      helper: { type: "dynamic" }
    },

    blend: {
      title: "Blends",
      desc: "Two or three consonants blended smoothly together.",
      hint: "You can hear each sound, but they move fast together.",
      examples: "stop, blend, crash, spring",
      allowedLengths: [4, 5, 6, 7],
      defaultLength: 5,
      quick: [
        "bl","cl","fl","gl","pl","sl",
        "br","cr","dr","fr","gr","pr","tr",
        "sc","sk","sm","sn","sp","st","sw",
        "spl","spr","str","scr","squ"
      ],
      helper: { type: "range", start: 0, end: 2 }
    },

    floss: {
      title: "FLOSS Rule (ff, ll, ss, zz)",
      desc: "After a short vowel in one-syllable words, double f, l, s, or z.",
      hint: "Short vowel + f/l/s/z at the end? Double it!",
      examples: "hill, stuff, pass, buzz",
      allowedLengths: [4, 5],
      defaultLength: 4,
      quick: ["ff", "ll", "ss", "zz"],
      helper: { type: "range", start: 2, end: 3 }
    },

    "glued-sounds": {
      title: "Glued Sounds (am, an, all, ing)",
      desc: "Letter combinations that stick together as one unit.",
      hint: "These sounds 'glue' together: -am, -an, -all, -ing, -ang, -ong, -ung, -ank, -ink, -onk, -unk.",
      examples: "ham, pan, ball, ring, thank",
      allowedLengths: [3, 4, 5, 6],
      defaultLength: 4,
      quick: ["am", "an", "all", "ing", "ang", "ong", "ung", "ank", "ink", "onk", "unk"],
      helper: { type: "dynamic" }
    },

    "magic-e": {
      title: "Magic E (Silent E)",
      desc: "A silent e at the end makes the vowel say its name (long sound).",
      hint: "The e is quiet, but it changes the vowel: cap→cape, hop→hope.",
      examples: "bake, time, hope, cube, these",
      allowedLengths: [4, 5, 6],
      defaultLength: 4,
      quick: ["a_e", "i_e", "o_e", "u_e", "e_e"],
      helper: { type: "pattern", indices: [1, 3] }
    },

    "vowel-team": {
      title: "Vowel Teams",
      desc: "Two vowels work together to make one sound.",
      hint: "Common teams: ai, ay, ee, ea, oa, ow, ou, oi, oy, oo, au, aw, ue, ew.",
      examples: "rain, play, seem, boat, snow",
      allowedLengths: [4, 5, 6, 7],
      defaultLength: 4,
      quick: ["ai","ay","ee","ea","oa","ow","ou","oi","oy","oo","au","aw","ue","ew","ie","ei"],
      helper: { type: "pattern", indices: [1, 2] }
    },

    "r-controlled": {
      title: "R-Controlled Vowels",
      desc: "The letter r changes how the vowel sounds (bossy r).",
      hint: "Listen for ar, er, ir, or, ur sounds.",
      examples: "car, bird, fork, turn, fern",
      allowedLengths: [3, 4, 5, 6],
      defaultLength: 4,
      quick: ["ar","er","ir","or","ur"],
      helper: { type: "pattern", indices: [1, 2] }
    },

    diphthongs: {
      title: "Diphthongs (oi, oy, ou, ow)",
      desc: "Two vowel sounds that glide together in one syllable.",
      hint: "Your mouth moves while saying these: oi (coin), oy (boy), ou (out), ow (now).",
      examples: "coin, boy, cloud, town",
      allowedLengths: [3, 4, 5, 6],
      defaultLength: 4,
      quick: ["oi", "oy", "ou", "ow"],
      helper: { type: "dynamic" }
    },

    "irregular": {
      title: "Irregular/Heart Words",
      desc: "Words that don't follow regular patterns - memorize them!",
      hint: "These words need special attention. Learn them by heart.",
      examples: "come, said, have, one, two",
      allowedLengths: [3, 4, 5, 6, 7],
      defaultLength: 4,
      quick: [],
      helper: { type: "none" }
    },

    prefix: {
      title: "Prefixes",
      desc: "A chunk at the start that changes meaning.",
      hint: "Common ones: un-, re-, pre-, dis-, mis-, in-, non-.",
      examples: "undo, replay, preset, distrust",
      allowedLengths: [4, 5, 6, 7, 8, 9, 10],
      defaultLength: 6,
      quick: ["un","re","pre","dis","mis","in","non","de","ex","sub"],
      helper: { type: "morpheme", position: "prefix" }
    },

    suffix: {
      title: "Suffixes",
      desc: "A chunk at the end that changes meaning or form.",
      hint: "Common ones: -ed, -ing, -s, -er, -est, -ly, -ful, -less, -ness.",
      examples: "jumped, playing, happier, kindness",
      allowedLengths: [4, 5, 6, 7, 8, 9, 10],
      defaultLength: 6,
      quick: ["ed","ing","s","er","est","ly","ful","less","ness","ment","tion"],
      helper: { type: "morpheme", position: "suffix" }
    },

    doubling: {
      title: "Doubling Rule (1-1-1)",
      desc: "One syllable, one vowel, one consonant at end: double before adding -ed or -ing.",
      hint: "hop → hopped, hopping; swim → swimming.",
      examples: "hopped, running, sitting, planned",
      allowedLengths: [6, 7, 8, 9],
      defaultLength: 7,
      quick: ["ed","ing"],
      helper: { type: "morpheme", highlight: "doubled" }
    },

    schwa: {
      title: "Schwa (Lazy Vowel)",
      desc: "An unstressed vowel that sounds like 'uh' - the most common sound in English!",
      hint: "Say the word naturally. Which vowel sounds relaxed or 'lazy'?",
      examples: "about, lemon, pencil, circus",
      allowedLengths: [4, 5, 6, 7, 8],
      defaultLength: 5,
      quick: ["a","e","o","i","u"],
      helper: { type: "syllableHint" }
    },

    multisyllable: {
      title: "Multisyllabic Words",
      desc: "Words with two or more syllables - divide and conquer!",
      hint: "Break into chunks. Clap it out. Blend it together.",
      examples: "pic-nic, bas-ket, ro-bot, pen-cil",
      allowedLengths: [6, 7, 8, 9, 10],
      defaultLength: 6,
      quick: ["tion","ment","ing","er","ly","pre","re","dis","con"],
      helper: { type: "syllablesHyphen" }
    }
  };

  // ---------------------------
  // 2) COMPREHENSIVE WORD BANK
  // ---------------------------
  window.WORD_ENTRIES = {
    
    /* ================================
       CVC WORDS (3 letters, short vowels)
       ================================ */
    
    // Short A
    cat: { syllables:["cat"], syllableText:"cat", tags:["cvc","all"], def:"A small pet with fur that meows.", sentence:"The cat crept quietly through tall grass." },
    hat: { syllables:["hat"], syllableText:"hat", tags:["cvc"], def:"Something you wear on your head.", sentence:"A hat can block the sun and keep you cool." },
    map: { syllables:["map"], syllableText:"map", tags:["cvc","all"], def:"A picture showing where places are.", sentence:"Use a map to find paths you've never walked." },
    bat: { syllables:["bat"], syllableText:"bat", tags:["cvc"], def:"A flying mammal, or a stick for hitting.", sentence:"A bat flew past at dusk near the old barn." },
    rat: { syllables:["rat"], syllableText:"rat", tags:["cvc"], def:"A small rodent with a long tail.", sentence:"The rat solved the maze faster than expected." },
    sad: { syllables:["sad"], syllableText:"sad", tags:["cvc"], def:"Feeling unhappy or down.", sentence:"When sad, talking to a friend often helps." },
    dad: { syllables:["dad"], syllableText:"dad", tags:["cvc"], def:"Another word for father.", sentence:"Dad taught me that mistakes help you learn." },
    bad: { syllables:["bad"], syllableText:"bad", tags:["cvc"], def:"Not good; harmful or wrong.", sentence:"Bad weather can change plans, but not attitudes." },
    bag: { syllables:["bag"], syllableText:"bag", tags:["cvc"], def:"A container for carrying things.", sentence:"Pack your bag with what you really need." },
    tag: { syllables:["tag"], syllableText:"tag", tags:["cvc"], def:"A label, or a game of chase.", sentence:"Tag is a game that needs no equipment." },
    jam: { syllables:["jam"], syllableText:"jam", tags:["cvc"], def:"Sweet spread made from fruit.", sentence:"Jam forms when fruit and sugar bond with heat." },
    can: { syllables:["can"], syllableText:"can", tags:["cvc"], def:"To be able to do something.", sentence:"You can do hard things with practice and grit." },
    man: { syllables:["man"], syllableText:"man", tags:["cvc"], def:"An adult male person.", sentence:"The man shared his lunch with someone in need." },
    ran: { syllables:["ran"], syllableText:"ran", tags:["cvc"], def:"Past tense of run.", sentence:"She ran fast because she trained each morning." },
    van: { syllables:["van"], syllableText:"van", tags:["cvc"], def:"A vehicle for carrying people or cargo.", sentence:"The van delivered books to remote villages." },
    cap: { syllables:["cap"], syllableText:"cap", tags:["cvc"], def:"A soft hat with a visor.", sentence:"A cap shields your eyes from bright sunlight." },
    gap: { syllables:["gap"], syllableText:"gap", tags:["cvc"], def:"A space or opening between things.", sentence:"Mind the gap between what you know and don't know." },
    tap: { syllables:["tap"], syllableText:"tap", tags:["cvc"], def:"To hit lightly, or a water faucet.", sentence:"Tap gently on the glass to see if it's fragile." },

    // Short E  
    bed: { syllables:["bed"], syllableText:"bed", tags:["cvc"], def:"Furniture for sleeping.", sentence:"A good bed helps your body rest and heal." },
    red: { syllables:["red"], syllableText:"red", tags:["cvc"], def:"The color of ripe apples.", sentence:"Red light has the longest wavelength we can see." },
    led: { syllables:["led"], syllableText:"led", tags:["cvc"], def:"Past tense of lead; guided.", sentence:"She led the team by setting a strong example." },
    fed: { syllables:["fed"], syllableText:"fed", tags:["cvc"], def:"Past tense of feed; gave food.", sentence:"He fed the birds every morning without fail." },
    pet: { syllables:["pet"], syllableText:"pet", tags:["cvc"], def:"An animal kept for companionship.", sentence:"A pet teaches responsibility and empathy daily." },
    let: { syllables:["let"], syllableText:"let", tags:["cvc"], def:"To allow or permit.", sentence:"Let others speak before you jump to conclusions." },
    net: { syllables:["net"], syllableText:"net", tags:["cvc"], def:"Mesh fabric for catching things.", sentence:"A net catches fish but also teaches patience." },
    pen: { syllables:["pen"], syllableText:"pen", tags:["cvc"], def:"A tool for writing with ink.", sentence:"The pen is mightier than the sword, they say." },
    ten: { syllables:["ten"], syllableText:"ten", tags:["cvc"], def:"The number after nine.", sentence:"Ten is the base of our counting system today." },
    hen: { syllables:["hen"], syllableText:"hen", tags:["cvc"], def:"A female chicken.", sentence:"The hen laid eggs rich in protein each day." },
    men: { syllables:["men"], syllableText:"men", tags:["cvc"], def:"Plural of man.", sentence:"Great men and women build on others' ideas." },
    web: { syllables:["web"], syllableText:"web", tags:["cvc"], def:"A spider's silk trap, or the internet.", sentence:"A spider's web is stronger than steel by weight." },
    
    // Short I
    sit: { syllables:["sit"], syllableText:"sit", tags:["cvc"], def:"To rest on a seat or surface.", sentence:"Sit with good posture to protect your spine." },
    hit: { syllables:["hit"], syllableText:"hit", tags:["cvc"], def:"To strike or make contact.", sentence:"He hit the target by calculating the angle first." },
    fit: { syllables:["fit"], syllableText:"fit", tags:["cvc"], def:"The right size, or healthy.", sentence:"Stay fit by moving your body every single day." },
    bit: { syllables:["bit"], syllableText:"bit", tags:["cvc"], def:"A small piece, or past tense of bite.", sentence:"A bit of kindness can change someone's whole day." },
    pit: { syllables:["pit"], syllableText:"pit", tags:["cvc"], def:"A hole in the ground, or a seed.", sentence:"The pit of a peach holds a future tree inside." },
    dig: { syllables:["dig"], syllableText:"dig", tags:["cvc"], def:"To make a hole by removing earth.", sentence:"Dig deep to find fossils from ancient times." },
    big: { syllables:["big"], syllableText:"big", tags:["cvc"], def:"Large in size.", sentence:"Think big, but start with one small step today." },
    pig: { syllables:["pig"], syllableText:"pig", tags:["cvc"], def:"A farm animal with a curly tail.", sentence:"Pigs are smarter than most people assume they are." },
    win: { syllables:["win"], syllableText:"win", tags:["cvc"], def:"To succeed or finish first.", sentence:"To win, you must learn from every loss first." },
    pin: { syllables:["pin"], syllableText:"pin", tags:["cvc"], def:"A thin pointed fastener.", sentence:"A pin holds things together with surprising strength." },
    fin: { syllables:["fin"], syllableText:"fin", tags:["cvc"], def:"A body part fish use to swim.", sentence:"A fish's fin acts like a rudder and propeller." },
    lip: { syllables:["lip"], syllableText:"lip", tags:["cvc"], def:"The edge of your mouth.", sentence:"Read lips to understand when sound is unclear." },
    dip: { syllables:["dip"], syllableText:"dip", tags:["cvc"], def:"To lower into liquid briefly.", sentence:"Dip the litmus paper to test if it's acid." },
    tip: { syllables:["tip"], syllableText:"tip", tags:["cvc"], def:"The pointed end, or helpful advice.", sentence:"Here's a tip: listen more than you speak daily." },
    zip: { syllables:["zip"], syllableText:"zip", tags:["cvc"], def:"To move fast, or close with a zipper.", sentence:"Zip through your work when you focus completely." },
    
    // Short O
    hot: { syllables:["hot"], syllableText:"hot", tags:["cvc"], def:"Having high temperature.", sentence:"Hot water molecules move faster than cold ones do." },
    pot: { syllables:["pot"], syllableText:"pot", tags:["cvc"], def:"A container for cooking.", sentence:"A clay pot can purify water through tiny pores." },
    dot: { syllables:["dot"], syllableText:"dot", tags:["cvc"], def:"A small round mark.", sentence:"Connect the dots to see the hidden pattern emerge." },
    got: { syllables:["got"], syllableText:"got", tags:["cvc"], def:"Past tense of get; received.", sentence:"She got the answer by trying multiple approaches." },
    not: { syllables:["not"], syllableText:"not", tags:["cvc"], def:"Used to make something negative.", sentence:"Not every problem has just one correct solution." },
    top: { syllables:["top"], syllableText:"top", tags:["cvc"], def:"The highest part.", sentence:"From the top, you can see where you've traveled." },
    hop: { syllables:["hop"], syllableText:"hop", tags:["cvc"], def:"To jump on one foot.", sentence:"Rabbits hop to save energy while moving quickly." },
    mop: { syllables:["mop"], syllableText:"mop", tags:["cvc"], def:"A tool for cleaning floors.", sentence:"A mop uses friction to remove dirt from surfaces." },
    box: { syllables:["box"], syllableText:"box", tags:["cvc"], def:"A container with sides and a lid.", sentence:"Think outside the box means find creative solutions." },
    fox: { syllables:["fox"], syllableText:"fox", tags:["cvc"], def:"A wild animal like a small dog.", sentence:"A fox uses cunning to solve problems and survive." },
    dog: { syllables:["dog"], syllableText:"dog", tags:["cvc","all"], def:"A loyal animal often kept as a pet.", sentence:"Dogs read human body language better than wolves do." },
    log: { syllables:["log"], syllableText:"log", tags:["cvc"], def:"A thick piece of tree trunk.", sentence:"A log floats because wood is less dense than water." },
    
    // Short U
    sun: { syllables:["sun"], syllableText:"sun", tags:["cvc","all"], def:"The star at the center of our solar system.", sentence:"The sun provides energy for nearly all life on Earth." },
    run: { syllables:["run"], syllableText:"run", tags:["cvc"], def:"To move fast on foot.", sentence:"Run toward challenges instead of running away from them." },
    fun: { syllables:["fun"], syllableText:"fun", tags:["cvc"], def:"Enjoyment or amusement.", sentence:"Learning is fun when curiosity guides the journey." },
    bun: { syllables:["bun"], syllableText:"bun", tags:["cvc"], def:"A small round bread roll.", sentence:"A bun rises because yeast produces carbon dioxide gas." },
    gun: { syllables:["gun"], syllableText:"gun", tags:["cvc"], def:"A weapon that fires projectiles.", sentence:"A gun uses force and momentum in physics terms." },
    cup: { syllables:["cup"], syllableText:"cup", tags:["cvc"], def:"A small container for drinking.", sentence:"A cup holds liquid because molecules stick to sides." },
    pup: { syllables:["pup"], syllableText:"pup", tags:["cvc"], def:"A young dog.", sentence:"A pup learns through play and observation of adults." },
    cut: { syllables:["cut"], syllableText:"cut", tags:["cvc"], def:"To divide with something sharp.", sentence:"Cut carefully, measuring twice before you act once." },
    hut: { syllables:["hut"], syllableText:"hut", tags:["cvc"], def:"A small simple dwelling.", sentence:"A hut can shelter you if built with knowledge." },
    nut: { syllables:["nut"], syllableText:"nut", tags:["cvc"], def:"A hard-shelled seed or fruit.", sentence:"A nut stores energy and nutrients for new growth." },
    but: { syllables:["but"], syllableText:"but", tags:["cvc"], def:"Used to introduce a contrast.", sentence:"I understand your point, but consider this alternative view." },
    bus: { syllables:["bus"], syllableText:"bus", tags:["cvc"], def:"A large vehicle for many passengers.", sentence:"A bus is more efficient than many separate cars." },
    bug: { syllables:["bug"], syllableText:"bug", tags:["cvc"], def:"A small insect or error in code.", sentence:"Every bug in your code teaches debugging skills forever." },
    hug: { syllables:["hug"], syllableText:"hug", tags:["cvc"], def:"To hold someone close with arms.", sentence:"A hug releases oxytocin, which reduces stress levels." },
    mud: { syllables:["mud"], syllableText:"mud", tags:["cvc"], def:"Wet soft dirt.", sentence:"Mud is just soil plus water in specific proportions." },

    /* ================================
       CVCC WORDS (4 letters, final blends)
       ================================ */
    
    milk: { syllables:["milk"], syllableText:"milk", tags:["cvcc","blend","all"], def:"A white drink from cows or other mammals.", sentence:"Milk contains calcium that helps bones grow stronger each day." },
    hand: { syllables:["hand"], syllableText:"hand", tags:["cvcc","all"], def:"The part at the end of your arm.", sentence:"Your hand has twenty-seven bones working together as one system." },
    band: { syllables:["band"], syllableText:"band", tags:["cvcc"], def:"A group of musicians, or a strip.", sentence:"A rubber band stores potential energy when you stretch it." },
    land: { syllables:["land"], syllableText:"land", tags:["cvcc"], def:"The solid part of Earth's surface.", sentence:"Land forms change slowly over millions of patient years." },
    sand: { syllables:["sand"], syllableText:"sand", tags:["cvcc"], def:"Tiny grains found on beaches.", sentence:"Sand is just tiny rocks broken down by waves and wind." },
    wand: { syllables:["wand"], syllableText:"wand", tags:["cvcc"], def:"A thin stick used by magicians.", sentence:"A magic wand is a tool that focuses your attention." },
    
    help: { syllables:["help"], syllableText:"help", tags:["cvcc"], def:"To assist or make easier.", sentence:"Help others climb, and you'll reach higher yourself every time." },
    melt: { syllables:["melt"], syllableText:"melt", tags:["cvcc"], def:"To change from solid to liquid.", sentence:"Ice will melt when molecules gain enough heat energy to move." },
    belt: { syllables:["belt"], syllableText:"belt", tags:["cvcc"], def:"A strap worn around the waist.", sentence:"A seat belt uses friction and inertia to keep you safe." },
    felt: { syllables:["felt"], syllableText:"felt", tags:["cvcc"], def:"Past tense of feel, or thick fabric.", sentence:"She felt proud because she persisted through difficult moments." },
    
    jump: { syllables:["jump"], syllableText:"jump", tags:["cvcc","blend"], def:"To push off the ground into air.", sentence:"When you jump, you briefly overcome the force of gravity." },
    bump: { syllables:["bump"], syllableText:"bump", tags:["cvcc"], def:"To hit against something.", sentence:"A bump transfers energy from one object to the other." },
    pump: { syllables:["pump"], syllableText:"pump", tags:["cvcc"], def:"A device to move liquid or gas.", sentence:"Your heart is a pump that beats one hundred thousand times daily." },
    dump: { syllables:["dump"], syllableText:"dump", tags:["cvcc"], def:"To drop or throw down.", sentence:"Don't dump trash thoughtlessly; consider where it will end up eventually." },
    lump: { syllables:["lump"], syllableText:"lump", tags:["cvcc"], def:"A thick solid piece.", sentence:"A lump of clay can become art with patient skilled hands." },
    
    tent: { syllables:["tent"], syllableText:"tent", tags:["cvcc"], def:"A portable shelter made of fabric.", sentence:"A tent protects you from wind and rain in the wilderness." },
    bent: { syllables:["bent"], syllableText:"bent", tags:["cvcc"], def:"Past tense of bend; curved.", sentence:"The tree bent but didn't break during the fierce storm last night." },
    sent: { syllables:["sent"], syllableText:"sent", tags:["cvcc"], def:"Past tense of send.", sentence:"She sent a message using light signals across the dark valley." },
    went: { syllables:["went"], syllableText:"went", tags:["cvcc"], def:"Past tense of go.", sentence:"He went exploring and discovered something completely unexpected on his journey." },
    rent: { syllables:["rent"], syllableText:"rent", tags:["cvcc"], def:"To pay for temporary use.", sentence:"You rent an apartment instead of buying it outright immediately." },
    
    fast: { syllables:["fast"], syllableText:"fast", tags:["cvcc","blend"], def:"Moving or happening quickly.", sentence:"Fast doesn't always mean better; sometimes slow and steady wins races." },
    last: { syllables:["last"], syllableText:"last", tags:["cvcc"], def:"Coming after all others.", sentence:"The last person to finish still crossed the finish line with courage." },
    past: { syllables:["past"], syllableText:"past", tags:["cvcc"], def:"Time before now, or beyond.", sentence:"Learn from the past, but don't let it define your future path." },
    cast: { syllables:["cast"], syllableText:"cast", tags:["cvcc"], def:"To throw, or all actors in a play.", sentence:"Cast your fishing line with smooth wrist motion for best distance." },
    mast: { syllables:["mast"], syllableText:"mast", tags:["cvcc"], def:"A tall pole on a ship for sails.", sentence:"The mast catches wind and converts it into forward motion efficiently." },
    
    desk: { syllables:["desk"], syllableText:"desk", tags:["cvcc"], def:"A table for working or studying.", sentence:"An organized desk helps your mind focus on learning each day." },
    mask: { syllables:["mask"], syllableText:"mask", tags:["cvcc"], def:"A covering for the face.", sentence:"A mask can filter particles from the air you breathe in slowly." },
    task: { syllables:["task"], syllableText:"task", tags:["cvcc"], def:"A piece of work to be done.", sentence:"Break each large task into smaller manageable steps you can complete." },
    risk: { syllables:["risk"], syllableText:"risk", tags:["cvcc"], def:"The possibility of danger.", sentence:"Calculated risk leads to growth; reckless risk leads to waste." },
    
    nest: { syllables:["nest"], syllableText:"nest", tags:["cvcc"], def:"A bird's home made of twigs.", sentence:"A bird builds its nest using geometry and engineering instincts naturally." },
    best: { syllables:["best"], syllableText:"best", tags:["cvcc"], def:"Of the highest quality.", sentence:"Do your best each time, and improvement becomes inevitable over time." },
    test: { syllables:["test"], syllableText:"test", tags:["cvcc"], def:"An examination or trial.", sentence:"A test shows what you know and what needs more practice still." },
    rest: { syllables:["rest"], syllableText:"rest", tags:["cvcc"], def:"To relax or stop working.", sentence:"Rest lets your brain consolidate memories and grow stronger connections inside." },
    west: { syllables:["west"], syllableText:"west", tags:["cvcc"], def:"The direction where the sun sets.", sentence:"The sun sets in the west because Earth rotates toward the east." },
    
    lift: { syllables:["lift"], syllableText:"lift", tags:["cvcc"], def:"To raise something upward.", sentence:"To lift something heavy, use your legs instead of straining your back." },
    gift: { syllables:["gift"], syllableText:"gift", tags:["cvcc"], def:"Something given freely.", sentence:"The greatest gift you can give someone is your full attention always." },
    soft: { syllables:["soft"], syllableText:"soft", tags:["cvcc"], def:"Not hard; gentle.", sentence:"Soft materials absorb impact better than rigid ones in most collision cases." },
    loft: { syllables:["loft"], syllableText:"loft", tags:["cvcc"], def:"An upper room or storage space.", sentence:"A loft provides extra space by using vertical height cleverly and wisely." },

    lamp: { syllables:["lamp"], syllableText:"lamp", tags:["cvcc"], def:"A device that produces light.", sentence:"A lamp converts electrical energy into light and heat energy simultaneously." },
    camp: { syllables:["camp"], syllableText:"camp", tags:["cvcc"], def:"A place with tents for staying.", sentence:"At camp, you learn survival skills and independence far from home comforts." },
    damp: { syllables:["damp"], syllableText:"damp", tags:["cvcc"], def:"Slightly wet.", sentence:"Damp conditions help mold grow because fungi need moisture to thrive well." },
    
    
    /* ================================
       CCVC WORDS (4 letters, initial blends)
       ================================ */
    
    stop: { syllables:["stop"], syllableText:"stop", tags:["ccvc","blend","all"], def:"To cease moving or end.", sentence:"Stop and think before you act to avoid hasty mistakes later on." },
    step: { syllables:["step"], syllableText:"step", tags:["ccvc","blend"], def:"One movement of the foot.", sentence:"Take one step at a time and eventually reach distant goals." },
    stem: { syllables:["stem"], syllableText:"stem", tags:["ccvc","blend"], def:"The main body of a plant.", sentence:"A stem carries water and nutrients from roots up to leaves." },
    
    crab: { syllables:["crab"], syllableText:"crab", tags:["ccvc","blend"], def:"A sea creature with claws.", sentence:"A crab walks sideways because of how its legs are jointed together." },
    crib: { syllables:["crib"], syllableText:"crib", tags:["ccvc","blend"], def:"A baby's bed with high sides.", sentence:"A crib keeps babies safe while they sleep soundly at night." },
    crop: { syllables:["crop"], syllableText:"crop", tags:["ccvc","blend"], def:"Plants grown for food.", sentence:"Farmers rotate crops to keep soil healthy and nutrient-rich over years." },
    
    clap: { syllables:["clap"], syllableText:"clap", tags:["ccvc","blend"], def:"To hit hands together.", sentence:"Clap to show appreciation when someone does something well or brave." },
    clip: { syllables:["clip"], syllableText:"clip", tags:["ccvc","blend"], def:"To cut or fasten.", sentence:"A paper clip uses spring force to hold papers together tightly." },
    clam: { syllables:["clam"], syllableText:"clam", tags:["ccvc","blend"], def:"A shellfish that lives in sand.", sentence:"A clam filters water to find tiny food particles floating by." },
    
    flag: { syllables:["flag"], syllableText:"flag", tags:["ccvc","blend"], def:"A piece of cloth representing something.", sentence:"A flag is a symbol that unites people under shared values." },
    flat: { syllables:["flat"], syllableText:"flat", tags:["ccvc","blend"], def:"Having a level surface.", sentence:"A flat surface has no curves when you look at it closely." },
    flip: { syllables:["flip"], syllableText:"flip", tags:["ccvc","blend"], def:"To turn over quickly.", sentence:"Flip a coin and get fifty percent heads over many trials." },
    
    glad: { syllables:["glad"], syllableText:"glad", tags:["ccvc","blend"], def:"Feeling happy or pleased.", sentence:"Be glad for small victories because they compound into big success." },
    glum: { syllables:["glum"], syllableText:"glum", tags:["ccvc","blend"], def:"Sad and quiet.", sentence:"Feeling glum is natural, but don't stay there longer than needed." },
    
    plan: { syllables:["plan"], syllableText:"plan", tags:["ccvc","blend"], def:"A detailed way to do something.", sentence:"Make a plan before starting so you know each step ahead." },
    plot: { syllables:["plot"], syllableText:"plot", tags:["ccvc","blend"], def:"A piece of land, or a story.", sentence:"Plot your data on a graph to see patterns emerge clearly." },
    plum: { syllables:["plum"], syllableText:"plum", tags:["ccvc","blend"], def:"A sweet juicy fruit.", sentence:"A plum ripens when enzymes break down starches into simple sugars." },
    
    slam: { syllables:["slam"], syllableText:"slam", tags:["ccvc","blend"], def:"To shut forcefully and loudly.", sentence:"Don't slam doors; use gentle force to extend their life span." },
    slim: { syllables:["slim"], syllableText:"slim", tags:["ccvc","blend"], def:"Thin or slender.", sentence:"A slim margin means the difference was very small between outcomes." },
    slip: { syllables:["slip"], syllableText:"slip", tags:["ccvc","blend"], def:"To slide accidentally.", sentence:"You slip when friction between your feet and floor gets too low." },
    slap: { syllables:["slap"], syllableText:"slap", tags:["ccvc","blend"], def:"To hit with an open hand.", sentence:"A high-five is a gentle slap that celebrates shared achievement together." },
    
    brag: { syllables:["brag"], syllableText:"brag", tags:["ccvc","blend"], def:"To boast about yourself.", sentence:"Don't brag about success; let your actions speak louder than words always." },
    brim: { syllables:["brim"], syllableText:"brim", tags:["ccvc","blend"], def:"The edge of a container or hat.", sentence:"Fill your cup to the brim means use all available capacity." },
    
    drip: { syllables:["drip"], syllableText:"drip", tags:["ccvc","blend"], def:"To fall in drops.", sentence:"A dripping faucet wastes gallons over time through tiny repeated losses." },
    drag: { syllables:["drag"], syllableText:"drag", tags:["ccvc","blend"], def:"To pull along the ground.", sentence:"Drag creates friction that opposes motion and slows objects down significantly." },
    drum: { syllables:["drum"], syllableText:"drum", tags:["ccvc","blend"], def:"A musical instrument you hit.", sentence:"A drum vibrates air molecules to create sound waves you hear." },
    drop: { syllables:["drop"], syllableText:"drop", tags:["ccvc","blend"], def:"To fall or let fall.", sentence:"Don't drop fragile things; handle them with care and full attention." },
    
    frog: { syllables:["frog"], syllableText:"frog", tags:["ccvc","blend","all"], def:"An amphibian that hops and swims.", sentence:"A frog can breathe through its skin underwater using diffusion of gases." },
    from: { syllables:["from"], syllableText:"from", tags:["ccvc","blend"], def:"Indicating starting point.", sentence:"Learn from every experience whether you succeed or fail completely." },
    
    grab: { syllables:["grab"], syllableText:"grab", tags:["ccvc","blend"], def:"To seize quickly.", sentence:"Don't grab chances hastily; evaluate them with calm clear thinking first." },
    grin: { syllables:["grin"], syllableText:"grin", tags:["ccvc","blend"], def:"A wide smile.", sentence:"A grin uses fewer muscles than a frown and feels better too." },
    grip: { syllables:["grip"], syllableText:"grip", tags:["ccvc","blend"], def:"To hold tightly.", sentence:"Get a firm grip before you lift to prevent dropping heavy loads." },
    
    prim: { syllables:["prim"], syllableText:"prim", tags:["ccvc","blend"], def:"Formal and proper.", sentence:"Being too prim can prevent authentic connection with others around you." },
    
    trim: { syllables:["trim"], syllableText:"trim", tags:["ccvc","blend"], def:"To cut away excess.", sentence:"Trim away what's unnecessary to focus on what truly matters most." },
    trip: { syllables:["trip"], syllableText:"trip", tags:["ccvc","blend","all"], def:"A journey to a place.", sentence:"Every trip teaches you something new about yourself and the world." },
    trap: { syllables:["trap"], syllableText:"trap", tags:["ccvc","blend"], def:"A device to catch animals.", sentence:"Avoid logical traps where conclusions don't follow from the premises given." },
    
    scan: { syllables:["scan"], syllableText:"scan", tags:["ccvc","blend"], def:"To look at quickly.", sentence:"Scan the horizon to spot changes or patterns you might miss." },
    scab: { syllables:["scab"], syllableText:"scab", tags:["ccvc","blend"], def:"A crust over a healing wound.", sentence:"A scab protects new skin growing underneath from germs and dirt." },
    
    skip: { syllables:["skip"], syllableText:"skip", tags:["ccvc","blend"], def:"To hop lightly along.", sentence:"Don't skip steps when learning; each builds on what came before." },
    skin: { syllables:["skin"], syllableText:"skin", tags:["ccvc","blend"], def:"The outer covering of a body.", sentence:"Your skin is your largest organ and protects you constantly every day." },
    skim: { syllables:["skim"], syllableText:"skim", tags:["ccvc","blend"], def:"To remove from surface.", sentence:"Skim the text first for main ideas before reading every detail." },
    
    smug: { syllables:["smug"], syllableText:"smug", tags:["ccvc","blend"], def:"Too pleased with yourself.", sentence:"Being smug prevents growth because you stop questioning your assumptions then." },
    
    snap: { syllables:["snap"], syllableText:"snap", tags:["ccvc","blend"], def:"To break suddenly.", sentence:"Materials snap when stress exceeds their breaking point instantly and dramatically." },
    snag: { syllables:["snag"], syllableText:"snag", tags:["ccvc","blend"], def:"To catch on something.", sentence:"Watch for snags in your logic where arguments suddenly break down." },
    snip: { syllables:["snip"], syllableText:"snip", tags:["ccvc","blend"], def:"To cut with scissors.", sentence:"Snip carefully along the line to get a clean straight edge." },
    
    spin: { syllables:["spin"], syllableText:"spin", tags:["ccvc","blend"], def:"To turn rapidly around.", sentence:"When you spin, centrifugal force pushes you outward from the center." },
    spit: { syllables:["spit"], syllableText:"spit", tags:["ccvc","blend"], def:"To eject from mouth.", sentence:"Spitting is rude and spreads germs unnecessarily to those around you." },
    spot: { syllables:["spot"], syllableText:"spot", tags:["ccvc","blend"], def:"A particular place or mark.", sentence:"Can you spot the pattern hidden in this sequence of numbers?" },
    span: { syllables:["span"], syllableText:"span", tags:["ccvc","blend"], def:"The distance between two points.", sentence:"The Golden Gate Bridge has a span of nearly two miles total." },
    
    swim: { syllables:["swim"], syllableText:"swim", tags:["ccvc","blend"], def:"To move through water.", sentence:"Fish swim using muscles that push water backward with their tails." },
    sway: { syllables:["sway"], syllableText:"sway", tags:["ccvc","blend"], def:"To move slowly side to side.", sentence:"Trees sway in wind because they're flexible instead of rigid and stiff." },

    /* ================================
       FLOSS RULE WORDS
       ================================ */
    
    hill: { syllables:["hill"], syllableText:"hill", tags:["floss"], def:"A raised area of land.", sentence:"Roll down a hill and feel potential energy become kinetic motion." },
    bell: { syllables:["bell"], syllableText:"bell", tags:["floss"], def:"A hollow object that rings.", sentence:"A bell vibrates to create sound waves that travel through air molecules." },
    tell: { syllables:["tell"], syllableText:"tell", tags:["floss"], def:"To say or communicate.", sentence:"Tell the truth always, even when it's harder than a comfortable lie." },
    well: { syllables:["well"], syllableText:"well", tags:["floss"], def:"In a good way, or a deep hole for water.", sentence:"A well drilled deep enough reaches groundwater stored in rock layers below." },
    sell: { syllables:["sell"], syllableText:"sell", tags:["floss"], def:"To exchange for money.", sentence:"To sell well, first understand what problem your product truly solves." },
    fell: { syllables:["fell"], syllableText:"fell", tags:["floss"], def:"Past tense of fall.", sentence:"The tree fell because gravity pulled its mass toward Earth's center." },
    cell: { syllables:["cell"], syllableText:"cell", tags:["floss"], def:"The basic unit of life.", sentence:"Every cell in your body contains instructions in DNA molecules inside." },
    yell: { syllables:["yell"], syllableText:"yell", tags:["floss"], def:"To shout loudly.", sentence:"Don't yell when calm words communicate your message just as effectively." },
    
    miss: { syllables:["miss"], syllableText:"miss", tags:["floss"], def:"To fail to hit or catch.", sentence:"Miss the target once, adjust your aim, then try again immediately." },
    kiss: { syllables:["kiss"], syllableText:"kiss", tags:["floss"], def:"To touch with lips.", sentence:"A kiss shows affection and releases bonding chemicals in the brain." },
    hiss: { syllables:["hiss"], syllableText:"hiss", tags:["floss"], def:"To make a sharp 's' sound.", sentence:"Snakes hiss by forcing air through a narrow opening in their mouths." },
    
    pass: { syllables:["pass"], syllableText:"pass", tags:["floss"], def:"To go by or succeed.", sentence:"To pass a test, review material over time instead of cramming." },
    mass: { syllables:["mass"], syllableText:"mass", tags:["floss"], def:"The amount of matter in something.", sentence:"Mass stays constant, but weight changes with gravity's pull on you." },
    bass: { syllables:["bass"], syllableText:"bass", tags:["floss"], def:"A low sound, or a type of fish.", sentence:"Bass frequencies vibrate slower than high-pitched treble notes do always." },
    lass: { syllables:["lass"], syllableText:"lass", tags:["floss"], def:"A young girl or woman.", sentence:"The brave lass climbed higher than anyone thought remotely possible before." },
    class: { syllables:["class"], syllableText:"class", tags:["floss"], def:"A group of students learning together.", sentence:"A class learns best when everyone contributes their unique perspective freely." },
    glass: { syllables:["glass"], syllableText:"glass", tags:["floss"], def:"A hard transparent material.", sentence:"Glass is made from sand melted at extremely high temperatures then cooled." },
    grass: { syllables:["grass"], syllableText:"grass", tags:["floss"], def:"Green plants covering the ground.", sentence:"Grass performs photosynthesis, converting sunlight into chemical energy stored in bonds." },
    
    mess: { syllables:["mess"], syllableText:"mess", tags:["floss"], def:"A dirty or untidy state.", sentence:"A mess can be organized if you sort things into logical categories." },
    less: { syllables:["less"], syllableText:"less", tags:["floss"], def:"A smaller amount.", sentence:"Sometimes less is more when you eliminate all unnecessary elements completely." },
    bless: { syllables:["bless"], syllableText:"bless", tags:["floss"], def:"To make holy or wish well.", sentence:"Bless others with kindness and see how it returns to you." },
    dress: { syllables:["dress"], syllableText:"dress", tags:["floss"], def:"To put on clothes, or a garment.", sentence:"How you dress communicates messages about yourself before you speak at all." },
    press: { syllables:["press"], syllableText:"press", tags:["floss"], def:"To push firmly.", sentence:"Press grapes to extract juice through mechanical force and patient pressure." },
    chess: { syllables:["chess"], syllableText:"chess", tags:["floss"], def:"A strategy board game.", sentence:"Chess teaches you to think several moves ahead before deciding." },
    
    buff: { syllables:["buff"], syllableText:"buff", tags:["floss"], def:"To polish, or muscular.", sentence:"Buff the surface until it shines by rubbing in circular motions." },
    puff: { syllables:["puff"], syllableText:"puff", tags:["floss"], def:"A short blast of breath or air.", sentence:"A puff of wind can carry seeds miles away from their parent plant." },
    stuff: { syllables:["stuff"], syllableText:"stuff", tags:["floss"], def:"Things or material.", sentence:"Don't let stuff own you; you should own your possessions instead." },
    bluff: { syllables:["bluff"], syllableText:"bluff", tags:["floss"], def:"To pretend or deceive.", sentence:"Call someone's bluff when their claims don't match observable evidence presented." },
    fluff: { syllables:["fluff"], syllableText:"fluff", tags:["floss"], def:"Soft light material.", sentence:"Fluff traps air between fibers, which insulates by preventing heat transfer." },
    
    dull: { syllables:["dull"], syllableText:"dull", tags:["floss"], def:"Not sharp or interesting.", sentence:"A dull blade requires more force because it distributes pressure over area." },
    full: { syllables:["full"], syllableText:"full", tags:["floss"], def:"Containing as much as possible.", sentence:"A full stomach signals your brain through hormones to stop eating more." },
    pull: { syllables:["pull"], syllableText:"pull", tags:["floss"], def:"To drag toward you.", sentence:"When you pull, you apply force in the direction you want motion." },
    bull: { syllables:["bull"], syllableText:"bull", tags:["floss"], def:"A male cow.", sentence:"A bull is strong but reacts to movement rather than the color red." },
    null: { syllables:["null"], syllableText:"null", tags:["floss"], def:"Having no value or meaning.", sentence:"A null hypothesis says there's no effect until evidence proves otherwise clearly." },
    
    buzz: { syllables:["buzz"], syllableText:"buzz", tags:["floss"], def:"A humming sound.", sentence:"Bees buzz by beating their wings over two hundred times per second." },
    fuzz: { syllables:["fuzz"], syllableText:"fuzz", tags:["floss"], def:"Soft fibers or hair.", sentence:"Peach fuzz protects fruit from insects and reduces water loss through evaporation." },
    jazz: { syllables:["jazz"], syllableText:"jazz", tags:["floss"], def:"A type of music with improvisation.", sentence:"Jazz musicians create new melodies spontaneously by combining patterns they know." },
    
    /* ================================
       DIGRAPH WORDS (sh, ch, th, wh, ph, ck, ng, nk)
       ================================ */
    
    ship: { syllables:["ship"], syllableText:"ship", tags:["digraph","all"], def:"A large boat for traveling on water.", sentence:"A ship floats because its total density is less than water overall." },
    shop: { syllables:["shop"], syllableText:"shop", tags:["digraph"], def:"A place to buy things.", sentence:"Shop wisely by comparing quality and price before you commit to buying." },
    shed: { syllables:["shed"], syllableText:"shed", tags:["digraph"], def:"A small building for storage.", sentence:"A shed protects tools from rain and sun that would cause rust." },
    shin: { syllables:["shin"], syllableText:"shin", tags:["digraph"], def:"The front of your lower leg.", sentence:"Your shin bone is one of the strongest bones relative to size." },
    shut: { syllables:["shut"], syllableText:"shut", tags:["digraph"], def:"To close.", sentence:"Shut the door gently to avoid waking people sleeping nearby inside." },
    
    wish: { syllables:["wish"], syllableText:"wish", tags:["digraph"], def:"To want something to happen.", sentence:"Wish for things, but work hard to make wishes become reality." },
    dish: { syllables:["dish"], syllableText:"dish", tags:["digraph"], def:"A plate or prepared food.", sentence:"A dish can be both container and the food it holds inside." },
    fish: { syllables:["fish"], syllableText:"fish", tags:["digraph"], def:"An animal that lives in water.", sentence:"Fish extract oxygen from water using gills instead of lungs like us." },
    rush: { syllables:["rush"], syllableText:"rush", tags:["digraph"], def:"To hurry or move quickly.", sentence:"Don't rush through learning; understanding takes time and patience always." },
    push: { syllables:["push"], syllableText:"push", tags:["digraph"], def:"To press against something.", sentence:"When you push, you exert force away from your body's center." },
    cash: { syllables:["cash"], syllableText:"cash", tags:["digraph"], def:"Money in coins or bills.", sentence:"Cash is physical currency you can exchange for goods and services." },
    dash: { syllables:["dash"], syllableText:"dash", tags:["digraph"], def:"To run quickly.", sentence:"Dash to safety when you identify genuine danger approaching fast." },
    bash: { syllables:["bash"], syllableText:"bash", tags:["digraph"], def:"To strike hard.", sentence:"Don't bash things in anger; take a breath and calm down first." },
    gosh: { syllables:["gosh"], syllableText:"gosh", tags:["digraph"], def:"An exclamation of surprise.", sentence:"Gosh, I didn't expect results to improve that dramatically so fast!" },
    
    chip: { syllables:["chip"], syllableText:"chip", tags:["digraph","all"], def:"A small piece broken off.", sentence:"A microchip contains millions of transistors smaller than a human hair." },
    chop: { syllables:["chop"], syllableText:"chop", tags:["digraph"], def:"To cut with quick blows.", sentence:"Chop vegetables into equal pieces so they all cook evenly together." },
    chat: { syllables:["chat"], syllableText:"chat", tags:["digraph"], def:"To talk in a friendly way.", sentence:"Chat with someone new each day to practice communication skills constantly." },
    chin: { syllables:["chin"], syllableText:"chin", tags:["digraph"], def:"The lower part of your face.", sentence:"Your chin is actually part of your jaw bone structure below." },
    much: { syllables:["much"], syllableText:"much", tags:["digraph"], def:"A large amount.", sentence:"Too much of anything, even good things, can become harmful eventually." },
    such: { syllables:["such"], syllableText:"such", tags:["digraph"], def:"Of this or that kind.", sentence:"There's no such thing as a stupid question in learning environments." },
    rich: { syllables:["rich"], syllableText:"rich", tags:["digraph"], def:"Having a lot of money or quality.", sentence:"Rich soil contains organic matter that feeds plants growing in it." },
    
    thin: { syllables:["thin"], syllableText:"thin", tags:["digraph"], def:"Not thick.", sentence:"Thin ice is dangerous because it can't support much weight safely." },
    then: { syllables:["then"], syllableText:"then", tags:["digraph"], def:"At that time, or next.", sentence:"First think, then act with purpose and clear intention every time." },
    that: { syllables:["that"], syllableText:"that", tags:["digraph"], def:"Used to identify something.", sentence:"Notice that assumptions often hide in plain sight within your reasoning." },
    than: { syllables:["than"], syllableText:"than", tags:["digraph"], def:"Used in comparisons.", sentence:"It's better to be kind than to be right in most situations." },
    them: { syllables:["them"], syllableText:"them", tags:["digraph"], def:"Those people or things.", sentence:"Treat them the way you'd want to be treated yourself always." },
    this: { syllables:["this"], syllableText:"this", tags:["digraph"], def:"The thing here or being indicated.", sentence:"This moment right now is all you truly have for certain." },
    math: { syllables:["math"], syllableText:"math", tags:["digraph"], def:"The study of numbers and shapes.", sentence:"Math is the language scientists use to describe patterns in nature." },
    path: { syllables:["path"], syllableText:"path", tags:["digraph"], def:"A way or route to follow.", sentence:"The shortest path between two points is always a straight line." },
    bath: { syllables:["bath"], syllableText:"bath", tags:["digraph"], def:"Washing your whole body.", sentence:"A warm bath relaxes muscles because heat increases blood flow there." },
    moth: { syllables:["moth"], syllableText:"moth", tags:["digraph"], def:"An insect like a butterfly.", sentence:"Moths navigate using moonlight, which is why lamps confuse them badly." },
    
    when: { syllables:["when"], syllableText:"when", tags:["digraph"], def:"At what time.", sentence:"When in doubt, ask questions instead of making assumptions wrongly." },
    what: { syllables:["what"], syllableText:"what", tags:["digraph"], def:"Asking for information.", sentence:"What you practice grows stronger in your brain through repetition daily." },
    whip: { syllables:["whip"], syllableText:"whip", tags:["digraph"], def:"To beat quickly or move fast.", sentence:"Whip cream by adding air bubbles that make it fluffy and light." },
    
    back: { syllables:["back"], syllableText:"back", tags:["digraph"], def:"The rear part of something.", sentence:"Your back contains your spine, which protects your spinal cord inside." },
    pack: { syllables:["pack"], syllableText:"pack", tags:["digraph"], def:"To put things in a container.", sentence:"Pack efficiently by placing heavy items at the bottom of bags." },
    lack: { syllables:["lack"], syllableText:"lack", tags:["digraph"], def:"To be without something.", sentence:"Lack of sleep impairs your judgment and memory formation significantly each day." },
    rack: { syllables:["rack"], syllableText:"rack", tags:["digraph"], def:"A frame for holding things.", sentence:"A bike rack uses leverage to hold wheels in place securely." },
    sack: { syllables:["sack"], syllableText:"sack", tags:["digraph"], def:"A large bag.", sentence:"A burlap sack is woven to let air through while holding contents." },
    tack: { syllables:["tack"], syllableText:"tack", tags:["digraph"], def:"A small nail or approach.", sentence:"Try a different tack when your current approach isn't working at all." },
    deck: { syllables:["deck"], syllableText:"deck", tags:["digraph"], def:"A platform or set of cards.", sentence:"A deck of cards has fifty-two cards representing mathematical probability perfectly." },
    neck: { syllables:["neck"], syllableText:"neck", tags:["digraph"], def:"The part connecting head to body.", sentence:"Your neck contains seven vertebrae and many important blood vessels flowing through." },
    peck: { syllables:["peck"], syllableText:"peck", tags:["digraph"], def:"To strike with a beak.", sentence:"Birds peck rapidly because their head muscles are exceptionally strong actually." },
    check: { syllables:["check"], syllableText:"check", tags:["digraph"], def:"To examine or verify.", sentence:"Always check your work twice to catch errors before submitting it." },
    thick: { syllables:["thick"], syllableText:"thick", tags:["digraph"], def:"Wide from side to side.", sentence:"Thick walls insulate better by creating more space for trapped air inside." },
    stick: { syllables:["stick"], syllableText:"stick", tags:["digraph"], def:"A thin piece of wood.", sentence:"A stick floats because wood cells contain air pockets throughout their structure." },
    trick: { syllables:["trick"], syllableText:"trick", tags:["digraph"], def:"A clever action to deceive.", sentence:"Magic tricks exploit how your brain makes assumptions about what it sees." },
    brick: { syllables:["brick"], syllableText:"brick", tags:["digraph"], def:"A block for building.", sentence:"Bricks are made from clay fired at high heat until hard." },
    quick: { syllables:["quick"], syllableText:"quick", tags:["digraph"], def:"Fast or rapid.", sentence:"Quick thinking requires practice until responses become almost automatic in you." },
    click: { syllables:["click"], syllableText:"click", tags:["digraph"], def:"A short sharp sound.", sentence:"A click happens when something snaps into place suddenly and completely." },
    
    rang: { syllables:["rang"], syllableText:"rang", tags:["digraph"], def:"Past tense of ring.", sentence:"The bell rang because someone pulled a rope attached to its clapper." },
    bang: { syllables:["bang"], syllableText:"bang", tags:["digraph"], def:"A loud sudden noise.", sentence:"A bang occurs when air compresses rapidly from an explosion's shock wave." },
    sang: { syllables:["sang"], syllableText:"sang", tags:["digraph"], def:"Past tense of sing.", sentence:"She sang beautifully by controlling her breath and vocal cord vibrations." },
    hang: { syllables:["hang"], syllableText:"hang", tags:["digraph"], def:"To suspend from above.", sentence:"Pictures hang level when weight distributes evenly across the hanging point." },
    gang: { syllables:["gang"], syllableText:"gang", tags:["digraph"], def:"A group working together.", sentence:"A gang of workers can accomplish more through coordination and teamwork." },
    fang: { syllables:["fang"], syllableText:"fang", tags:["digraph"], def:"A long pointed tooth.", sentence:"Venomous snakes inject poison through hollow fangs into prey animals fast." },
    
    ring: { syllables:["ring"], syllableText:"ring", tags:["digraph","all"], def:"A circular band or sound.", sentence:"A ring of Saturn consists of countless ice particles orbiting together." },
    sing: { syllables:["sing"], syllableText:"sing", tags:["digraph"], def:"To make musical sounds with voice.", sentence:"When you sing, your vocal cords vibrate to create sound waves." },
    wing: { syllables:["wing"], syllableText:"wing", tags:["digraph"], def:"The part birds use to fly.", sentence:"A bird's wing creates lift by shaping airflow differently above and below." },
    king: { syllables:["king"], syllableText:"king", tags:["digraph"], def:"A male ruler of a country.", sentence:"A wise king listens to advice from many different perspectives before deciding." },
    ping: { syllables:["ping"], syllableText:"ping", tags:["digraph"], def:"A sharp ringing sound.", sentence:"Sonar uses ping sounds bouncing back to detect underwater objects precisely." },
    ding: { syllables:["ding"], syllableText:"ding", tags:["digraph"], def:"A ringing sound.", sentence:"A bell makes a ding by vibrating at its natural resonant frequency." },
    
    song: { syllables:["song"], syllableText:"song", tags:["digraph"], def:"Music with words.", sentence:"A song combines rhythm, melody, and words to convey emotion powerfully." },
    long: { syllables:["long"], syllableText:"long", tags:["digraph"], def:"Extending far in distance or time.", sentence:"Long practice sessions build skill faster than short scattered ones do." },
    gong: { syllables:["gong"], syllableText:"gong", tags:["digraph"], def:"A metal disc that makes sound.", sentence:"A gong vibrates when struck, sending sound waves in all directions outward." },
    
    rung: { syllables:["rung"], syllableText:"rung", tags:["digraph"], def:"Past participle of ring, or ladder step.", sentence:"Each rung on the ladder must support your full weight safely." },
    hung: { syllables:["hung"], syllableText:"hung", tags:["digraph"], def:"Past tense of hang.", sentence:"The painting hung perfectly level after careful measurement with a tool." },
    lung: { syllables:["lung"], syllableText:"lung", tags:["digraph"], def:"Organ for breathing air.", sentence:"Your lungs extract oxygen and release carbon dioxide with each breath cycle." },
    sung: { syllables:["sung"], syllableText:"sung", tags:["digraph"], def:"Past participle of sing.", sentence:"The anthem was sung with passion by thousands of voices together." },
    bung: { syllables:["bung"], syllableText:"bung", tags:["digraph"], def:"A stopper for a hole.", sentence:"A bung seals a barrel by fitting tightly into the opening completely." },
    
    bank: { syllables:["bank"], syllableText:"bank", tags:["digraph"], def:"Edge of a river, or place for money.", sentence:"A river bank forms where flowing water deposits sediment over time." },
    tank: { syllables:["tank"], syllableText:"tank", tags:["digraph"], def:"A container for liquids or vehicle.", sentence:"A water tank stores liquid using gravity to maintain pressure in pipes." },
    rank: { syllables:["rank"], syllableText:"rank", tags:["digraph"], def:"A position in order.", sentence:"Don't worry about rank; focus on learning and improving yourself daily." },
    sank: { syllables:["sank"], syllableText:"sank", tags:["digraph"], def:"Past tense of sink.", sentence:"The ship sank because water filled compartments faster than pumps could remove." },
    yank: { syllables:["yank"], syllableText:"yank", tags:["digraph"], def:"To pull hard suddenly.", sentence:"Don't yank cords roughly; pull gently to avoid damaging connections inside." },
    
    ink: { syllables:["ink"], syllableText:"ink", tags:["digraph"], def:"Colored liquid for writing.", sentence:"Ink consists of pigment particles suspended in liquid that dries quickly." },
    pink: { syllables:["pink"], syllableText:"pink", tags:["digraph"], def:"A light red color.", sentence:"Pink flowers attract pollinators that can see that wavelength of light." },
    link: { syllables:["link"], syllableText:"link", tags:["digraph"], def:"A connection between things.", sentence:"Find the link between ideas to understand relationships and patterns clearly." },
    sink: { syllables:["sink"], syllableText:"sink", tags:["digraph"], def:"To go down in water, or a basin.", sentence:"Objects sink when their density exceeds the density of surrounding water." },
    rink: { syllables:["rink"], syllableText:"rink", tags:["digraph"], def:"A place for ice skating.", sentence:"A skating rink freezes water to create a smooth slippery surface." },
    wink: { syllables:["wink"], syllableText:"wink", tags:["digraph"], def:"To close one eye briefly.", sentence:"A wink can communicate shared understanding without using any words at all." },
    
    honk: { syllables:["honk"], syllableText:"honk", tags:["digraph"], def:"The sound a horn makes.", sentence:"A car honk warns others by creating loud sound waves suddenly." },
    bonk: { syllables:["bonk"], syllableText:"bonk", tags:["digraph"], def:"To hit something.", sentence:"Don't bonk your head; watch for low ceilings and overhanging branches above." },
    
    bunk: { syllables:["bunk"], syllableText:"bunk", tags:["digraph"], def:"A narrow bed or nonsense.", sentence:"A bunk bed saves space by stacking sleeping areas vertically efficiently." },
    junk: { syllables:["junk"], syllableText:"junk", tags:["digraph"], def:"Old or useless things.", sentence:"One person's junk is another person's treasure depending on needs." },
    sunk: { syllables:["sunk"], syllableText:"sunk", tags:["digraph"], def:"Past participle of sink.", sentence:"The cost has sunk lower than anyone predicted just months ago." },

    /* ================================
       GLUED SOUNDS (-am, -an, -all, -ing, etc.)
       ================================ */
    
    ham: { syllables:["ham"], syllableText:"ham", tags:["glued-sounds"], def:"Meat from a pig's leg.", sentence:"Ham is preserved through salt curing that prevents bacterial growth." },
    jam: { syllables:["jam"], syllableText:"jam", tags:["glued-sounds","cvc"], def:"Sweet fruit spread.", sentence:"Jam forms when pectin molecules link together into a gel network." },
    ram: { syllables:["ram"], syllableText:"ram", tags:["glued-sounds"], def:"A male sheep, or to push hard.", sentence:"A ram charges with force generated by strong leg muscles pushing forward." },
    dam: { syllables:["dam"], syllableText:"dam", tags:["glued-sounds"], def:"A barrier to hold back water.", sentence:"A dam creates potential energy by holding water at higher elevation." },
    yam: { syllables:["yam"], syllableText:"yam", tags:["glued-sounds"], def:"A starchy root vegetable.", sentence:"Yams store energy as starch that plants use for growth later." },
    clam: { syllables:["clam"], syllableText:"clam", tags:["glued-sounds","ccvc"], def:"A shellfish living in sand.", sentence:"Clams filter-feed by pumping water through their gills constantly all day." },
    gram: { syllables:["gram"], syllableText:"gram", tags:["glued-sounds"], def:"A metric unit of mass.", sentence:"A gram is one-thousandth of a kilogram in the metric system." },
    tram: { syllables:["tram"], syllableText:"tram", tags:["glued-sounds"], def:"A rail vehicle for passengers.", sentence:"A tram runs on tracks, using electricity to power its motor." },
    
    ban: { syllables:["ban"], syllableText:"ban", tags:["glued-sounds"], def:"To prohibit or forbid.", sentence:"To ban something doesn't make it disappear; it just hides it away." },
    can: { syllables:["can"], syllableText:"can", tags:["glued-sounds","cvc"], def:"Able to do something.", sentence:"You can achieve more than you think if you persist courageously." },
    fan: { syllables:["fan"], syllableText:"fan", tags:["glued-sounds"], def:"Device that moves air.", sentence:"A fan creates airflow by pushing air molecules with rotating blades." },
    man: { syllables:["man"], syllableText:"man", tags:["glued-sounds","cvc"], def:"An adult male human.", sentence:"A good man admits mistakes and learns from them with humility." },
    pan: { syllables:["pan"], syllableText:"pan", tags:["glued-sounds"], def:"A cooking container.", sentence:"A pan conducts heat from stove to food through metal atoms." },
    ran: { syllables:["ran"], syllableText:"ran", tags:["glued-sounds","cvc"], def:"Past tense of run.", sentence:"He ran faster after training his muscles through consistent daily practice." },
    tan: { syllables:["tan"], syllableText:"tan", tags:["glued-sounds"], def:"Light brown color, or skin darkening.", sentence:"Your skin tans when melanin protects it from ultraviolet radiation damage." },
    van: { syllables:["van"], syllableText:"van", tags:["glued-sounds","cvc"], def:"A vehicle for transport.", sentence:"A delivery van carries goods efficiently to multiple destinations daily." },
    plan: { syllables:["plan"], syllableText:"plan", tags:["glued-sounds","ccvc"], def:"A detailed proposal.", sentence:"Make a plan first, then execute it step by careful step." },
    clan: { syllables:["clan"], syllableText:"clan", tags:["glued-sounds"], def:"A family group.", sentence:"A clan shares traditions passed down through many generations together." },
    scan: { syllables:["scan"], syllableText:"scan", tags:["glued-sounds","ccvc"], def:"To examine quickly.", sentence:"Scan the environment for threats before relaxing your attention completely." },
    
    all: { syllables:["all"], syllableText:"all", tags:["glued-sounds"], def:"Every one of something.", sentence:"All living things need energy from food or sunlight to survive." },
    ball: { syllables:["ball"], syllableText:"ball", tags:["glued-sounds"], def:"A round object for games.", sentence:"A ball bounces because elastic materials store and release energy quickly." },
    call: { syllables:["call"], syllableText:"call", tags:["glued-sounds"], def:"To shout or telephone.", sentence:"Birds call to communicate territory and attract mates across distances." },
    fall: { syllables:["fall"], syllableText:"fall", tags:["glued-sounds"], def:"To drop down or autumn.", sentence:"Objects fall because gravity pulls all mass toward Earth's center." },
    hall: { syllables:["hall"], syllableText:"hall", tags:["glued-sounds"], def:"A corridor or large room.", sentence:"A hall can amplify sound through echoes bouncing off hard walls." },
    tall: { syllables:["tall"], syllableText:"tall", tags:["glued-sounds"], def:"High in height.", sentence:"Tall buildings must withstand wind forces that increase with height." },
    wall: { syllables:["wall"], syllableText:"wall", tags:["glued-sounds"], def:"A vertical structure enclosing space.", sentence:"A wall provides structure and divides space for different purposes inside." },
    mall: { syllables:["mall"], syllableText:"mall", tags:["glued-sounds"], def:"A shopping center.", sentence:"A mall centralizes many stores so people can shop efficiently together." },
    small: { syllables:["small"], syllableText:"small", tags:["glued-sounds"], def:"Little in size.", sentence:"Small changes compound into big results over long periods of time." },
    stall: { syllables:["stall"], syllableText:"stall", tags:["glued-sounds"], def:"To stop or delay.", sentence:"Don't stall on important decisions; gather facts then act with confidence." },

/* I'll continue with more patterns in the next section due to length... */

    /* ================================
       MAGIC E / SILENT E WORDS (VCe)
       ================================ */
    
    bake: { syllables:["bake"], syllableText:"bake", tags:["magic-e","all"], def:"To cook using dry heat.", sentence:"Bake bread by heating it until proteins set and starches gelatinize." },
    cake: { syllables:["cake"], syllableText:"cake", tags:["magic-e"], def:"A sweet baked dessert.", sentence:"Cake rises when carbon dioxide bubbles form inside the batter." },
    fake: { syllables:["fake"], syllableText:"fake", tags:["magic-e"], def:"Not real or genuine.", sentence:"Learn to spot fake arguments that use emotion instead of logic." },
    lake: { syllables:["lake"], syllableText:"lake", tags:["magic-e"], def:"A large body of water.", sentence:"A lake forms when water collects in a depression over time." },
    make: { syllables:["make"], syllableText:"make", tags:["magic-e"], def:"To create or build.", sentence:"Make something today, even if small, to practice creative thinking." },
    rake: { syllables:["rake"], syllableText:"rake", tags:["magic-e"], def:"A tool for gathering leaves.", sentence:"A rake works by using tines to catch and gather loose materials." },
    sake: { syllables:["sake"], syllableText:"sake", tags:["magic-e"], def:"Purpose or benefit.", sentence:"For the sake of learning, make mistakes without fear or shame." },
    take: { syllables:["take"], syllableText:"take", tags:["magic-e"], def:"To grab or receive.", sentence:"Take notes by hand to help your brain encode information better." },
    wake: { syllables:["wake"], syllableText:"wake", tags:["magic-e"], def:"To stop sleeping.", sentence:"You wake when your brain shifts from sleep to alert conscious state." },
    
    came: { syllables:["came"], syllableText:"came", tags:["magic-e"], def:"Past tense of come.", sentence:"She came prepared because planning ahead prevents poor performance always." },
    dame: { syllables:["dame"], syllableText:"dame", tags:["magic-e"], def:"A respectful title for women.", sentence:"The dame received honor for her decades of dedicated public service." },
    fame: { syllables:["fame"], syllableText:"fame", tags:["magic-e"], def:"Being known by many people.", sentence:"Fame is fleeting, but character and integrity last your whole life." },
    game: { syllables:["game"], syllableText:"game", tags:["magic-e"], def:"An activity with rules for fun.", sentence:"Every game teaches strategy, rules, and how to handle wins and losses." },
    name: { syllables:["name"], syllableText:"name", tags:["magic-e"], def:"What someone or something is called.", sentence:"Your name is important, but your actions define who you truly are." },
    same: { syllables:["same"], syllableText:"same", tags:["magic-e"], def:"Not different or changed.", sentence:"Two things are the same when they match in every measurable way." },
    tame: { syllables:["tame"], syllableText:"tame", tags:["magic-e"], def:"Not wild or dangerous.", sentence:"Animals become tame through patient conditioning over many generations gradually." },
    
    cane: { syllables:["cane"], syllableText:"cane", tags:["magic-e"], def:"A walking stick or plant stem.", sentence:"A cane redistributes weight to reduce pressure on injured legs." },
    lane: { syllables:["lane"], syllableText:"lane", tags:["magic-e"], def:"A narrow road or path.", sentence:"Stay in your lane means focus on your own work and progress." },
    mane: { syllables:["mane"], syllableText:"mane", tags:["magic-e"], def:"Long hair on a horse's neck.", sentence:"A lion's mane protects its neck during fights with other males." },
    pane: { syllables:["pane"], syllableText:"pane", tags:["magic-e"], def:"A single sheet of glass.", sentence:"A window pane lets light through while blocking wind and rain." },
    
    cape: { syllables:["cape"], syllableText:"cape", tags:["magic-e"], def:"A sleeveless cloak or land jutting out.", sentence:"A cape extends into water, created by erosion patterns over ages." },
    gape: { syllables:["gape"], syllableText:"gape", tags:["magic-e"], def:"To stare with mouth open.", sentence:"Don't gape rudely; close your mouth and observe politely instead always." },
    tape: { syllables:["tape"], syllableText:"tape", tags:["magic-e"], def:"Sticky strip for joining things.", sentence:"Tape sticks because adhesive molecules bond to surface molecules strongly." },
    
    cave: { syllables:["cave"], syllableText:"cave", tags:["magic-e"], def:"A hollow in a cliff or hillside.", sentence:"A cave forms when water slowly dissolves limestone over thousands of years." },
    gave: { syllables:["gave"], syllableText:"gave", tags:["magic-e"], def:"Past tense of give.", sentence:"She gave generously without expecting anything in return from others ever." },
    save: { syllables:["save"], syllableText:"save", tags:["magic-e"], def:"To keep safe or store.", sentence:"Save money consistently and compound interest works in your favor long-term." },
    wave: { syllables:["wave"], syllableText:"wave", tags:["magic-e"], def:"Moving water or hand gesture.", sentence:"A wave transfers energy through water without moving the water itself far." },
    
    base: { syllables:["base"], syllableText:"base", tags:["magic-e"], def:"The bottom or foundation.", sentence:"A strong base supports structures built on top of it securely." },
    case: { syllables:["case"], syllableText:"case", tags:["magic-e"], def:"A container or situation.", sentence:"State your case clearly using evidence and logical reasoning always." },
    vase: { syllables:["vase"], syllableText:"vase", tags:["magic-e"], def:"A container for flowers.", sentence:"A vase holds water that keeps cut flowers alive longer through stems." },
    
    bite: { syllables:["bite"], syllableText:"bite", tags:["magic-e"], def:"To cut with teeth.", sentence:"Bite food thoroughly before swallowing to help digestion begin in mouth." },
    kite: { syllables:["kite"], syllableText:"kite", tags:["magic-e"], def:"A flying toy on a string.", sentence:"A kite flies because wind creates lift pushing up on its surface." },
    site: { syllables:["site"], syllableText:"site", tags:["magic-e"], def:"A location or place.", sentence:"Choose a site carefully by considering access, resources, and environment first." },
    
    dime: { syllables:["dime"], syllableText:"dime", tags:["magic-e"], def:"A ten-cent coin.", sentence:"A dime is one-tenth of a dollar in United States currency." },
    lime: { syllables:["lime"], syllableText:"lime", tags:["magic-e"], def:"A green citrus fruit.", sentence:"Limes contain citric acid that gives them their characteristic sour taste." },
    mime: { syllables:["mime"], syllableText:"mime", tags:["magic-e"], def:"Silent performer using gestures.", sentence:"A mime communicates entirely through body language without speaking any words." },
    time: { syllables:["time"], syllableText:"time", tags:["magic-e","all"], def:"The ongoing sequence of events.", sentence:"Time is relative and actually moves slower near massive objects surprisingly." },
    
    dine: { syllables:["dine"], syllableText:"dine", tags:["magic-e"], def:"To eat dinner.", sentence:"Dine slowly and chew well to improve digestion and nutrient absorption." },
    fine: { syllables:["fine"], syllableText:"fine", tags:["magic-e"], def:"Very good quality, or money penalty.", sentence:"Fine details matter because excellence requires attention to small things daily." },
    line: { syllables:["line"], syllableText:"line", tags:["magic-e"], def:"A long narrow mark or row.", sentence:"A straight line is the shortest distance connecting any two points." },
    mine: { syllables:["mine"], syllableText:"mine", tags:["magic-e"], def:"Belonging to me, or dig for minerals.", sentence:"A mine extracts valuable minerals from deep underground rock layers below." },
    nine: { syllables:["nine"], syllableText:"nine", tags:["magic-e"], def:"The number after eight.", sentence:"Nine is divisible by three, which is useful for checking math." },
    pine: { syllables:["pine"], syllableText:"pine", tags:["magic-e"], def:"An evergreen tree or to yearn.", sentence:"Pine trees stay green year-round because their needles resist freezing well." },
    vine: { syllables:["vine"], syllableText:"vine", tags:["magic-e"], def:"A climbing plant.", sentence:"A vine climbs by wrapping around supports or using tiny hooks." },
    wine: { syllables:["wine"], syllableText:"wine", tags:["magic-e"], def:"An alcoholic drink from grapes.", sentence:"Wine forms when yeast converts grape sugar into alcohol through fermentation." },
    
    dive: { syllables:["dive"], syllableText:"dive", tags:["magic-e"], def:"To plunge into water.", sentence:"Dive safely by checking water depth first to avoid serious injury." },
    five: { syllables:["five"], syllableText:"five", tags:["magic-e"], def:"The number after four.", sentence:"Five fingers on each hand give humans exceptional manual dexterity always." },
    hive: { syllables:["hive"], syllableText:"hive", tags:["magic-e"], def:"A structure where bees live.", sentence:"A hive contains thousands of bees working together as one organism." },
    
    code: { syllables:["code"], syllableText:"code", tags:["magic-e"], def:"A system of rules or secret writing.", sentence:"Computer code tells machines what to do using precise logical instructions." },
    mode: { syllables:["mode"], syllableText:"mode", tags:["magic-e"], def:"A way of doing something.", sentence:"Find the mode of learning that works best for your unique brain." },
    rode: { syllables:["rode"], syllableText:"rode", tags:["magic-e"], def:"Past tense of ride.", sentence:"She rode her bike to school every day for exercise and fresh air." },
    
    bone: { syllables:["bone"], syllableText:"bone", tags:["magic-e"], def:"Hard part of a skeleton.", sentence:"Bone is living tissue that constantly breaks down and rebuilds itself." },
    cone: { syllables:["cone"], syllableText:"cone", tags:["magic-e"], def:"A shape with circular base tapering up.", sentence:"A cone focuses force toward its point, making it structurally strong." },
    done: { syllables:["done"], syllableText:"done", tags:["magic-e","irregular"], def:"Finished or completed.", sentence:"Something is done when you've met all requirements to your best ability." },
    gone: { syllables:["gone"], syllableText:"gone", tags:["magic-e"], def:"No longer present.", sentence:"Gone doesn't mean forgotten if lessons learned remain with you always." },
    lone: { syllables:["lone"], syllableText:"lone", tags:["magic-e"], def:"Single or solitary.", sentence:"A lone wolf survives by adapting strategies for hunting without a pack." },
    none: { syllables:["none"], syllableText:"none", tags:["magic-e"], def:"Not any.", sentence:"None of us is perfect; we all make mistakes and learn from them." },
    tone: { syllables:["tone"], syllableText:"tone", tags:["magic-e"], def:"Sound quality or attitude.", sentence:"Your tone of voice communicates emotion more than the words you choose." },
    zone: { syllables:["zone"], syllableText:"zone", tags:["magic-e"], def:"An area with specific characteristics.", sentence:"Find your learning zone where challenges meet your current skill level." },
    
    hope: { syllables:["hope"], syllableText:"hope", tags:["magic-e","all"], def:"To want something to happen.", sentence:"Hope sustains you through difficulty, but pair it with action and plans." },
    rope: { syllables:["rope"], syllableText:"rope", tags:["magic-e"], def:"Thick cord made of twisted fibers.", sentence:"A rope gains strength when individual fibers twist together under tension." },
    
    cube: { syllables:["cube"], syllableText:"cube", tags:["magic-e"], def:"A solid with six square faces.", sentence:"A cube is a three-dimensional square with equal length on every side." },
    tube: { syllables:["tube"], syllableText:"tube", tags:["magic-e"], def:"A hollow cylinder.", sentence:"A tube carries liquids or gases from one place to another efficiently." },
    
    cute: { syllables:["cute"], syllableText:"cute", tags:["magic-e"], def:"Attractive or charming.", sentence:"Humans find baby animals cute because of proportions triggering care instincts." },
    mute: { syllables:["mute"], syllableText:"mute", tags:["magic-e"], def:"Silent or unable to speak.", sentence:"Mute the distractions around you to focus deeply on important work." },
    
    dude: { syllables:["dude"], syllableText:"dude", tags:["magic-e"], def:"A person (informal).", sentence:"Dude is slang that became popular in California surf culture originally." },
    rude: { syllables:["rude"], syllableText:"rude", tags:["magic-e"], def:"Impolite or offensive.", sentence:"Being rude damages relationships and makes cooperation harder for everyone involved." },

    /* I'll continue with vowel teams, r-controlled, and other patterns... Due to length, I'll create this as a complete comprehensive file */

  }; // End WORD_ENTRIES

  console.log("✓ Comprehensive word bank loaded:", Object.keys(window.WORD_ENTRIES).length, "words");

})();

    /* ================================
       VOWEL TEAMS (ai, ay, ee, ea, oa, ow, etc.)
       ================================ */
    
    rain: { syllables:["rain"], syllableText:"rain", tags:["vowel-team","all"], def:"Water falling from clouds.", sentence:"Rain forms when water vapor condenses into droplets heavy enough to fall." },
    pain: { syllables:["pain"], syllableText:"pain", tags:["vowel-team"], def:"Physical or emotional hurt.", sentence:"Pain signals tell your brain that something needs attention or protection now." },
    main: { syllables:["main"], syllableText:"main", tags:["vowel-team"], def:"Most important or chief.", sentence:"Focus on the main idea first before worrying about small details later." },
    gain: { syllables:["gain"], syllableText:"gain", tags:["vowel-team"], def:"To obtain or increase.", sentence:"You gain knowledge through practice, mistakes, and persistent curiosity daily." },
    tail: { syllables:["tail"], syllableText:"tail", tags:["vowel-team"], def:"The rear part of an animal.", sentence:"A tail helps animals balance and communicate with others around them." },
    fail: { syllables:["fail"], syllableText:"fail", tags:["vowel-team"], def:"To not succeed.", sentence:"Fail forward by learning what doesn't work on your way to success." },
    nail: { syllables:["nail"], syllableText:"nail", tags:["vowel-team"], def:"A metal spike or fingertip covering.", sentence:"A nail driven through wood creates friction that holds pieces together tight." },
    mail: { syllables:["mail"], syllableText:"mail", tags:["vowel-team"], def:"Letters and packages delivered.", sentence:"Mail travels through complex sorting systems using codes and automation now." },
    sail: { syllables:["sail"], syllableText:"sail", tags:["vowel-team"], def:"Fabric that catches wind on boats.", sentence:"A sail converts wind energy into forward motion through aerodynamic lift." },
    wait: { syllables:["wait"], syllableText:"wait", tags:["vowel-team"], def:"To stay until something happens.", sentence:"Wait patiently and observe instead of rushing to hasty wrong conclusions." },
    
    day: { syllables:["day"], syllableText:"day", tags:["vowel-team"], def:"24 hours or daylight time.", sentence:"A day is how long Earth takes to rotate once completely around." },
    pay: { syllables:["pay"], syllableText:"pay", tags:["vowel-team"], def:"To give money for something.", sentence:"You pay for goods and services that others provide through their work." },
    say: { syllables:["say"], syllableText:"say", tags:["vowel-team"], def:"To speak words.", sentence:"Say what you mean clearly and mean what you say always." },
    may: { syllables:["may"], syllableText:"may", tags:["vowel-team"], def:"Expressing possibility.", sentence:"You may succeed if you try, but you'll definitely fail if you don't." },
    way: { syllables:["way"], syllableText:"way", tags:["vowel-team"], def:"A method or path.", sentence:"There's often more than one way to solve any challenging problem." },
    bay: { syllables:["bay"], syllableText:"bay", tags:["vowel-team"], def:"A body of water partly enclosed.", sentence:"A bay provides shelter for boats from strong ocean waves and storms." },
    hay: { syllables:["hay"], syllableText:"hay", tags:["vowel-team"], def:"Dried grass for animal feed.", sentence:"Hay preserves grass nutrients so animals can eat it all winter long." },
    lay: { syllables:["lay"], syllableText:"lay", tags:["vowel-team"], def:"To put down flat.", sentence:"Lay your foundation carefully because everything else builds on top of it." },
    ray: { syllables:["ray"], syllableText:"ray", tags:["vowel-team"], def:"A beam of light or type of fish.", sentence:"A ray of light travels in straight lines until something bends it." },
    tray: { syllables:["tray"], syllableText:"tray", tags:["vowel-team"], def:"A flat container for carrying items.", sentence:"A tray distributes weight evenly so you can carry multiple things safely." },
    play: { syllables:["play"], syllableText:"play", tags:["vowel-team"], def:"To have fun or perform.", sentence:"Play is how young mammals learn skills they'll need as adults later." },
    stay: { syllables:["stay"], syllableText:"stay", tags:["vowel-team"], def:"To remain in a place.", sentence:"Stay curious and keep asking questions throughout your entire life journey." },
    gray: { syllables:["gray"], syllableText:"gray", tags:["vowel-team"], def:"A color between black and white.", sentence:"Gray areas exist where issues aren't simply black or white clearly." },
    pray: { syllables:["pray"], syllableText:"pray", tags:["vowel-team"], def:"To speak to a deity.", sentence:"People pray to express gratitude, seek guidance, or find inner peace." },
    
    bee: { syllables:["bee"], syllableText:"bee", tags:["vowel-team"], def:"A flying insect that makes honey.", sentence:"Bees pollinate crops by carrying pollen between flowers while gathering nectar." },
    see: { syllables:["see"], syllableText:"see", tags:["vowel-team"], def:"To perceive with eyes.", sentence:"You see when light enters your eye and brain interprets the signals." },
    tree: { syllables:["tree"], syllableText:"tree", tags:["vowel-team","all"], def:"A large plant with trunk and branches.", sentence:"A tree can live for centuries by growing new rings each year." },
    free: { syllables:["free"], syllableText:"free", tags:["vowel-team"], def:"Not controlled or costing nothing.", sentence:"Freedom comes with responsibility to use it wisely and respectfully always." },
    knee: { syllables:["knee"], syllableText:"knee", tags:["vowel-team"], def:"The joint in the middle of your leg.", sentence:"Your knee is a hinge joint that lets your leg bend and straighten." },
    
    bead: { syllables:["bead"], syllableText:"bead", tags:["vowel-team"], def:"A small piece with a hole through it.", sentence:"Beads on an abacus represent numbers in different place value positions." },
    read: { syllables:["read"], syllableText:"read", tags:["vowel-team"], def:"To understand written words.", sentence:"When you read, your brain decodes symbols into meaning automatically over time." },
    lead: { syllables:["lead"], syllableText:"lead", tags:["vowel-team"], def:"To guide or show the way.", sentence:"Lead by example instead of just telling others what they should do." },
    beak: { syllables:["beak"], syllableText:"beak", tags:["vowel-team"], def:"A bird's hard mouth part.", sentence:"A bird's beak shape matches what food it eats through evolution." },
    weak: { syllables:["weak"], syllableText:"weak", tags:["vowel-team"], def:"Not strong.", sentence:"Weakness in one area can be balanced by strength in another area." },
    peak: { syllables:["peak"], syllableText:"peak", tags:["vowel-team"], def:"The pointed top of something.", sentence:"A mountain peak forms where tectonic forces push rock upward highest." },
    bean: { syllables:["bean"], syllableText:"bean", tags:["vowel-team"], def:"An edible seed from a pod.", sentence:"Beans contain protein that your body uses to build and repair tissues." },
    mean: { syllables:["mean"], syllableText:"mean", tags:["vowel-team"], def:"Unkind, or to signify.", sentence:"Be clear about what you mean to avoid misunderstandings with others always." },
    leap: { syllables:["leap"], syllableText:"leap", tags:["vowel-team"], def:"To jump high or far.", sentence:"Sometimes you must leap before you can see where you'll land safely." },
    heap: { syllables:["heap"], syllableText:"heap", tags:["vowel-team"], def:"A pile of things.", sentence:"A heap grows when you keep adding items without organizing them well." },
    team: { syllables:["team"], syllableText:"team", tags:["vowel-team"], def:"A group working together.", sentence:"A team achieves more than individuals because skills and ideas combine together." },
    seat: { syllables:["seat"], syllableText:"seat", tags:["vowel-team"], def:"Something to sit on.", sentence:"A seat distributes your weight across a surface to make sitting comfortable." },
    beat: { syllables:["beat"], syllableText:"beat", tags:["vowel-team"], def:"To hit repeatedly or defeat.", sentence:"Your heart beats roughly one hundred thousand times every single day continuously." },
    heat: { syllables:["heat"], syllableText:"heat", tags:["vowel-team"], def:"Warmth or thermal energy.", sentence:"Heat is molecular motion that transfers energy from hot to cold objects." },
    meat: { syllables:["meat"], syllableText:"meat", tags:["vowel-team"], def:"Animal flesh as food.", sentence:"Meat provides protein and nutrients but requires resources to produce it." },
    neat: { syllables:["neat"], syllableText:"neat", tags:["vowel-team"], def:"Tidy and organized.", sentence:"Keep your workspace neat so you can find what you need quickly." },
    
    boat: { syllables:["boat"], syllableText:"boat", tags:["vowel-team","all"], def:"A watercraft for traveling.", sentence:"A boat floats because it displaces water equal to its total weight." },
    coat: { syllables:["coat"], syllableText:"coat", tags:["vowel-team"], def:"Outer clothing or layer.", sentence:"A thick coat traps air near your body to prevent heat loss." },
    goat: { syllables:["goat"], syllableText:"goat", tags:["vowel-team"], def:"A farm animal with horns.", sentence:"Goats can climb steep terrain because their hooves grip rocks well." },
    road: { syllables:["road"], syllableText:"road", tags:["vowel-team"], def:"A path for vehicles.", sentence:"Roads connect places and enable trade and travel between distant communities." },
    load: { syllables:["load"], syllableText:"load", tags:["vowel-team"], def:"Something heavy to carry.", sentence:"Distribute a load evenly to maintain balance and prevent injury always." },
    toad: { syllables:["toad"], syllableText:"toad", tags:["vowel-team"], def:"An amphibian like a frog.", sentence:"Toads have bumpy skin that helps them camouflage among rocks and dirt." },
    soap: { syllables:["soap"], syllableText:"soap", tags:["vowel-team"], def:"A cleaning substance.", sentence:"Soap molecules grab onto both oil and water to remove dirt effectively." },
    
    seed: { syllables:["seed"], syllableText:"seed", tags:["vowel-team","all"], def:"What plants grow from.", sentence:"A seed contains a tiny plant and food stored to help it grow." },
    need: { syllables:["need"], syllableText:"need", tags:["vowel-team"], def:"To require something essential.", sentence:"Separate what you need from what you merely want through honest reflection." },
    feed: { syllables:["feed"], syllableText:"feed", tags:["vowel-team"], def:"To give food to.", sentence:"Feed your mind with knowledge and your body with nutritious real food." },
    weed: { syllables:["weed"], syllableText:"weed", tags:["vowel-team"], def:"An unwanted wild plant.", sentence:"A weed is just a plant growing where you don't want it." },
    speed: { syllables:["speed"], syllableText:"speed", tags:["vowel-team"], def:"How fast something moves.", sentence:"Speed equals distance divided by time in physics calculations always." },
    
    feel: { syllables:["feel"], syllableText:"feel", tags:["vowel-team"], def:"To sense through touch or emotion.", sentence:"Feel your emotions fully but don't let them control your choices unwisely." },
    peel: { syllables:["peel"], syllableText:"peel", tags:["vowel-team"], def:"The skin of a fruit or to remove it.", sentence:"A fruit peel protects the inside from damage and disease naturally." },
    reel: { syllables:["reel"], syllableText:"reel", tags:["vowel-team"], def:"A cylinder for winding thread or to stagger.", sentence:"A fishing reel uses gears to multiply force when pulling in line." },
    heel: { syllables:["heel"], syllableText:"heel", tags:["vowel-team"], def:"The back part of your foot.", sentence:"Your heel bone is the largest bone in your entire foot structure." },
    steel: { syllables:["steel"], syllableText:"steel", tags:["vowel-team"], def:"A strong metal made from iron.", sentence:"Steel is iron mixed with carbon to make it harder and stronger." },
    wheel: { syllables:["wheel"], syllableText:"wheel", tags:["vowel-team"], def:"A round object that rotates.", sentence:"A wheel reduces friction by letting things roll instead of slide along." },
    
    keep: { syllables:["keep"], syllableText:"keep", tags:["vowel-team"], def:"To continue having something.", sentence:"Keep learning new things even after school because education never stops." },
    deep: { syllables:["deep"], syllableText:"deep", tags:["vowel-team"], def:"Extending far down or in.", sentence:"Deep thinking requires focus without distractions pulling you away constantly." },
    sleep: { syllables:["sleep"], syllableText:"sleep", tags:["vowel-team"], def:"To rest with eyes closed.", sentence:"Sleep helps your brain organize memories and clear out waste products daily." },
    sheep: { syllables:["sheep"], syllableText:"sheep", tags:["vowel-team"], def:"A woolly farm animal.", sentence:"Sheep grow wool that humans have used for clothing for thousands of years." },
    sweep: { syllables:["sweep"], syllableText:"sweep", tags:["vowel-team"], def:"To clean with a broom.", sentence:"Sweep regularly to prevent dirt from building up over time gradually." },
    steep: { syllables:["steep"], syllableText:"steep", tags:["vowel-team"], def:"Having a sharp slope.", sentence:"A steep hill requires more energy to climb because you fight gravity harder." },
    
    feet: { syllables:["feet"], syllableText:"feet", tags:["vowel-team"], def:"Plural of foot.", sentence:"Your feet contain fifty-two bones total supporting your whole body weight." },
    meet: { syllables:["meet"], syllableText:"meet", tags:["vowel-team"], def:"To come together with someone.", sentence:"Meet new people with an open mind and genuine curiosity about them." },
    beet: { syllables:["beet"], syllableText:"beet", tags:["vowel-team"], def:"A dark red root vegetable.", sentence:"Beets contain natural sugars and turn red from betalain pigments inside." },

    /* ================================
       R-CONTROLLED VOWELS (ar, er, ir, or, ur)
       ================================ */
    
    car: { syllables:["car"], syllableText:"car", tags:["r-controlled","all"], def:"A vehicle with wheels and engine.", sentence:"A car converts chemical energy in fuel into motion through combustion." },
    bar: { syllables:["bar"], syllableText:"bar", tags:["r-controlled"], def:"A long piece of rigid material.", sentence:"A crowbar uses leverage to multiply force when prying things apart." },
    far: { syllables:["far"], syllableText:"far", tags:["r-controlled"], def:"At a great distance.", sentence:"Something far away looks smaller because light spreads out over distance traveled." },
    jar: { syllables:["jar"], syllableText:"jar", tags:["r-controlled"], def:"A container with a lid.", sentence:"A sealed jar preserves food by keeping out air and bacteria completely." },
    tar: { syllables:["tar"], syllableText:"tar", tags:["r-controlled"], def:"A thick black sticky substance.", sentence:"Tar comes from petroleum and is used to pave roads and seal roofs." },
    arm: { syllables:["arm"], syllableText:"arm", tags:["r-controlled"], def:"The limb from shoulder to hand.", sentence:"Your arm contains bones, muscles, and nerves working together as one system." },
    art: { syllables:["art"], syllableText:"art", tags:["r-controlled"], def:"Creative expression or skill.", sentence:"Art communicates ideas and emotions that words sometimes can't express fully." },
    ark: { syllables:["ark"], syllableText:"ark", tags:["r-controlled"], def:"A large boat in religious stories.", sentence:"Noah's ark story teaches about preparation and preservation during crisis times." },
    arch: { syllables:["arch"], syllableText:"arch", tags:["r-controlled"], def:"A curved structure.", sentence:"An arch distributes weight outward and down through its curved shape efficiently." },
    barn: { syllables:["barn"], syllableText:"barn", tags:["r-controlled"], def:"A farm building for animals or storage.", sentence:"A barn protects animals and equipment from harsh weather throughout seasons." },
    card: { syllables:["card"], syllableText:"card", tags:["r-controlled"], def:"Stiff paper or a playing piece.", sentence:"Credit cards represent money digitally stored in computer systems securely now." },
    dark: { syllables:["dark"], syllableText:"dark", tags:["r-controlled"], def:"With little or no light.", sentence:"Dark means absence of light because no photons reach your eyes then." },
    harp: { syllables:["harp"], syllableText:"harp", tags:["r-controlled"], def:"A musical instrument with strings.", sentence:"A harp creates sound when plucked strings vibrate at specific frequencies together." },
    mark: { syllables:["mark"], syllableText:"mark", tags:["r-controlled"], def:"A visible impression or sign.", sentence:"Mark important ideas when you read to help you remember them later." },
    park: { syllables:["park"], syllableText:"park", tags:["r-controlled","all"], def:"A public space with grass and trees.", sentence:"Parks provide green space in cities where people can relax and exercise." },
    part: { syllables:["part"], syllableText:"part", tags:["r-controlled"], def:"A piece of something larger.", sentence:"Each part plays a role in how the whole system functions together." },
    farm: { syllables:["farm"], syllableText:"farm", tags:["r-controlled"], def:"Land for growing crops or raising animals.", sentence:"Farms produce food by managing soil, water, and sunlight for plant growth." },
    harm: { syllables:["harm"], syllableText:"harm", tags:["r-controlled"], def:"To cause damage or injury.", sentence:"First, do no harm is a principle doctors follow when treating patients." },
    yarn: { syllables:["yarn"], syllableText:"yarn", tags:["r-controlled"], def:"Spun thread for knitting.", sentence:"Yarn is made by twisting fibers together to create long strong thread." },
    yard: { syllables:["yard"], syllableText:"yard", tags:["r-controlled"], def:"An area of land near a building.", sentence:"A yard is three feet long in the imperial measurement system used." },
    sharp: { syllables:["sharp"], syllableText:"sharp", tags:["r-controlled"], def:"Having a fine cutting edge.", sentence:"Sharp tools concentrate force on a tiny area for efficient cutting action." },
    shark: { syllables:["shark"], syllableText:"shark", tags:["r-controlled"], def:"A large predatory fish.", sentence:"Sharks have existed for over four hundred million years on Earth." },
    chart: { syllables:["chart"], syllableText:"chart", tags:["r-controlled"], def:"A visual display of information.", sentence:"A chart makes patterns in data visible so you understand them faster." },
    smart: { syllables:["smart"], syllableText:"smart", tags:["r-controlled"], def:"Intelligent or clever.", sentence:"Being smart means learning from experience and adapting to new situations well." },
    start: { syllables:["start"], syllableText:"start", tags:["r-controlled"], def:"To begin something.", sentence:"Start where you are with what you have and improve gradually daily." },
    
    her: { syllables:["her"], syllableText:"her", tags:["r-controlled"], def:"Belonging to a female.", sentence:"Listen to her perspective because different viewpoints reveal new insights always." },
    term: { syllables:["term"], syllableText:"term", tags:["r-controlled"], def:"A word or period of time.", sentence:"Define your terms clearly so everyone understands what you mean precisely." },
    fern: { syllables:["fern"], syllableText:"fern", tags:["r-controlled"], def:"A plant with feathery leaves.", sentence:"Ferns reproduce using spores instead of seeds like flowering plants do." },
    herd: { syllables:["herd"], syllableText:"herd", tags:["r-controlled"], def:"A group of animals together.", sentence:"A herd provides safety through numbers as many eyes watch for danger." },
    verb: { syllables:["verb"], syllableText:"verb", tags:["r-controlled"], def:"A word describing an action.", sentence:"Verbs are action words that tell what someone or something does." },
    perch: { syllables:["perch"], syllableText:"perch", tags:["r-controlled"], def:"A place to sit or a fish.", sentence:"Birds perch on branches by locking their toes around the wood securely." },
    
    bird: { syllables:["bird"], syllableText:"bird", tags:["r-controlled","all"], def:"A warm-blooded animal with feathers.", sentence:"Birds evolved from dinosaurs over millions of years through natural selection." },
    girl: { syllables:["girl"], syllableText:"girl", tags:["r-controlled"], def:"A young female person.", sentence:"Every girl deserves education and opportunity to reach her full potential completely." },
    dirt: { syllables:["dirt"], syllableText:"dirt", tags:["r-controlled"], def:"Loose soil or filth.", sentence:"Dirt contains minerals, organic matter, air, and water supporting plant life." },
    firm: { syllables:["firm"], syllableText:"firm", tags:["r-controlled"], def:"Solid and stable or a business.", sentence:"Stand firm on your principles but stay flexible in your methods always." },
    first: { syllables:["first"], syllableText:"first", tags:["r-controlled"], def:"Coming before all others.", sentence:"First impressions matter, but give people chances to show more over time." },
    shirt: { syllables:["shirt"], syllableText:"shirt", tags:["r-controlled"], def:"A garment for the upper body.", sentence:"A shirt covers your torso to protect from sun and provide warmth." },
    third: { syllables:["third"], syllableText:"third", tags:["r-controlled"], def:"Number three in sequence.", sentence:"One-third is a fraction representing one part out of three equal parts." },
    birth: { syllables:["birth"], syllableText:"birth", tags:["r-controlled"], def:"When someone is born.", sentence:"Birth begins life's journey filled with learning and endless growth ahead." },
    chirp: { syllables:["chirp"], syllableText:"chirp", tags:["r-controlled"], def:"A short high sound.", sentence:"Birds chirp to communicate territory, attract mates, and warn of danger." },
    
    for: { syllables:["for"], syllableText:"for", tags:["r-controlled"], def:"Intended to belong to.", sentence:"Work for something meaningful that helps others beyond just yourself alone." },
    or: { syllables:["or"], syllableText:"or", tags:["r-controlled"], def:"Used to link alternatives.", sentence:"Choose one path or another but make decisions based on clear reasoning." },
    corn: { syllables:["corn"], syllableText:"corn", tags:["r-controlled"], def:"A cereal grain plant.", sentence:"Corn stores energy as starch that humans and animals use for food." },
    born: { syllables:["born"], syllableText:"born", tags:["r-controlled"], def:"Brought into life.", sentence:"Everyone is born with unique potential waiting to be discovered through life." },
    horn: { syllables:["horn"], syllableText:"horn", tags:["r-controlled"], def:"A hard pointed growth or instrument.", sentence:"An animal's horn is made of keratin, the same material as your fingernails." },
    torn: { syllables:["torn"], syllableText:"torn", tags:["r-controlled"], def:"Past participle of tear; ripped.", sentence:"Torn fabric can be repaired by stitching the edges back together carefully." },
    worn: { syllables:["worn"], syllableText:"worn", tags:["r-controlled"], def:"Past participle of wear; damaged by use.", sentence:"Worn items show use over time through friction wearing material away gradually." },
    fork: { syllables:["fork"], syllableText:"fork", tags:["r-controlled"], def:"A utensil with prongs.", sentence:"A fork helps you pick up food by spearing or scooping it up." },
    pork: { syllables:["pork"], syllableText:"pork", tags:["r-controlled"], def:"Meat from a pig.", sentence:"Pork must be cooked thoroughly to kill harmful bacteria inside the meat." },
    cork: { syllables:["cork"], syllableText:"cork", tags:["r-controlled"], def:"A stopper from bark.", sentence:"Cork floats because its cells are filled with air making it light." },
    form: { syllables:["form"], syllableText:"form", tags:["r-controlled"], def:"A shape or to create.", sentence:"Form follows function means design should match what something needs to do." },
    norm: { syllables:["norm"], syllableText:"norm", tags:["r-controlled"], def:"A standard or usual way.", sentence:"Social norms guide behavior but can change over time as societies evolve." },
    storm: { syllables:["storm"], syllableText:"storm", tags:["r-controlled","all"], def:"Violent weather conditions.", sentence:"A storm forms when warm and cold air masses collide creating instability." },
    fort: { syllables:["fort"], syllableText:"fort", tags:["r-controlled"], def:"A strong building for defense.", sentence:"A fort protects people inside using thick walls and strategic location carefully." },
    port: { syllables:["port"], syllableText:"port", tags:["r-controlled"], def:"A harbor for ships.", sentence:"A port is where ships load and unload cargo connecting land and sea." },
    short: { syllables:["short"], syllableText:"short", tags:["r-controlled"], def:"Not long in length or time.", sentence:"Short explanations are often clearer than long complicated ones are usually." },
    sort: { syllables:["sort"], syllableText:"sort", tags:["r-controlled"], def:"A type or to arrange.", sentence:"Sort items into categories to find patterns and organize information well." },
    sport: { syllables:["sport"], syllableText:"sport", tags:["r-controlled"], def:"A competitive physical activity.", sentence:"Sports teach teamwork, discipline, and how to handle winning and losing gracefully." },
    north: { syllables:["north"], syllableText:"north", tags:["r-controlled"], def:"The direction toward the top of maps.", sentence:"North is determined by Earth's magnetic field that compasses detect reliably." },
    
    burn: { syllables:["burn"], syllableText:"burn", tags:["r-controlled"], def:"To be damaged by fire or heat.", sentence:"Things burn when they react with oxygen releasing heat and light energy." },
    turn: { syllables:["turn"], syllableText:"turn", tags:["r-controlled","all"], def:"To rotate or change direction.", sentence:"Turn challenges into opportunities by changing your perspective on them completely." },
    curl: { syllables:["curl"], syllableText:"curl", tags:["r-controlled"], def:"To form into a curved shape.", sentence:"Hair curls when protein bonds form in curved patterns naturally or artificially." },
    blur: { syllables:["blur"], syllableText:"blur", tags:["r-controlled"], def:"To make unclear or indistinct.", sentence:"Motion blur happens when objects move faster than your eye can track." },
    slur: { syllables:["slur"], syllableText:"slur", tags:["r-controlled"], def:"Unclear speech or insult.", sentence:"Don't slur your words; speak clearly so others understand your meaning well." },
    spur: { syllables:["spur"], syllableText:"spur", tags:["r-controlled"], def:"To urge forward or a spike.", sentence:"Competition can spur innovation when it motivates people to improve constantly." },
    purr: { syllables:["purr"], syllableText:"purr", tags:["r-controlled"], def:"The sound a content cat makes.", sentence:"Cats purr by vibrating muscles in their throat at specific frequencies." },
    surf: { syllables:["surf"], syllableText:"surf", tags:["r-controlled"], def:"Breaking waves or to ride them.", sentence:"Surfers ride waves by balancing on boards using physics and body control." },
    turf: { syllables:["turf"], syllableText:"turf", tags:["r-controlled"], def:"Grass and soil or territory.", sentence:"Protect your turf means defend what belongs to you or your group." },
    hurt: { syllables:["hurt"], syllableText:"hurt", tags:["r-controlled"], def:"To cause pain or injury.", sentence:"Words can hurt deeply even though they leave no visible wounds behind." },
    
    /* ================================
       DIPHTHONGS (oi, oy, ou, ow)
       ================================ */
    
    oil: { syllables:["oil"], syllableText:"oil", tags:["diphthongs"], def:"A thick liquid that doesn't mix with water.", sentence:"Oil floats on water because it's less dense than water molecules." },
    soil: { syllables:["soil"], syllableText:"soil", tags:["diphthongs"], def:"The top layer of earth.", sentence:"Healthy soil contains billions of organisms working together to support life." },
    boil: { syllables:["boil"], syllableText:"boil", tags:["diphthongs"], def:"To heat liquid until it bubbles.", sentence:"Water boils at one hundred degrees Celsius at sea level pressure always." },
    coin: { syllables:["coin"], syllableText:"coin", tags:["diphthongs","all"], def:"A flat piece of metal money.", sentence:"Coins have been used as money for over two thousand years worldwide." },
    join: { syllables:["join"], syllableText:"join", tags:["diphthongs"], def:"To connect or become part of.", sentence:"Join forces with others to accomplish goals bigger than yourself alone." },
    point: { syllables:["point"], syllableText:"point", tags:["diphthongs"], def:"A sharp end or purpose.", sentence:"Every good argument has a clear point supported by evidence and logic." },
    joint: { syllables:["joint"], syllableText:"joint", tags:["diphthongs"], def:"Where two things connect.", sentence:"A joint allows movement by connecting bones with flexible tissue between them." },
    moist: { syllables:["moist"], syllableText:"moist", tags:["diphthongs"], def:"Slightly wet.", sentence:"Moist environments help bacteria grow because they need water to survive well." },
    voice: { syllables:["voice"], syllableText:"voice", tags:["diphthongs"], def:"Sound from speaking or singing.", sentence:"Your voice is unique like a fingerprint because of your vocal anatomy." },
    choice: { syllables:["choice"], syllableText:"choice", tags:["diphthongs"], def:"Picking one option from many.", sentence:"Every choice you make shapes your future in small or large ways." },
    noise: { syllables:["noise"], syllableText:"noise", tags:["diphthongs"], def:"Unwanted or random sound.", sentence:"Too much noise makes concentration difficult because your brain can't filter it." },
    
    boy: { syllables:["boy"], syllableText:"boy", tags:["diphthongs","all"], def:"A young male person.", sentence:"Every boy deserves respect, education, and opportunity to grow into goodness." },
    joy: { syllables:["joy"], syllableText:"joy", tags:["diphthongs"], def:"Great happiness.", sentence:"Find joy in small moments instead of waiting for big events always." },
    toy: { syllables:["toy"], syllableText:"toy", tags:["diphthongs"], def:"An object for playing.", sentence:"Toys help children learn through play by exploring how things work freely." },
    soy: { syllables:["soy"], syllableText:"soy", tags:["diphthongs"], def:"A bean rich in protein.", sentence:"Soybeans provide protein and are used to make many different foods now." },
    
    out: { syllables:["out"], syllableText:"out", tags:["diphthongs"], def:"Away from inside.", sentence:"Step out of your comfort zone regularly to grow and learn new skills." },
    loud: { syllables:["loud"], syllableText:"loud", tags:["diphthongs"], def:"Making much noise.", sentence:"Loud sounds have greater amplitude making air molecules vibrate more forcefully." },
    cloud: { syllables:["cloud"], syllableText:"cloud", tags:["diphthongs","all"], def:"Visible water droplets in sky.", sentence:"Clouds form when water vapor condenses around dust particles in air." },
    proud: { syllables:["proud"], syllableText:"proud", tags:["diphthongs"], def:"Feeling satisfaction in achievements.", sentence:"Be proud of progress you've made without becoming arrogant about it." },
    shout: { syllables:["shout"], syllableText:"shout", tags:["diphthongs"], def:"To call loudly.", sentence:"Don't shout in anger; take a breath and speak calmly instead." },
    scout: { syllables:["scout"], syllableText:"scout", tags:["diphthongs"], def:"To search or explore ahead.", sentence:"Scout ahead to gather information before making important decisions always." },
    snout: { syllables:["snout"], syllableText:"snout", tags:["diphthongs"], def:"An animal's projecting nose.", sentence:"A pig's snout is sensitive and strong for digging through soil easily." },
    sprout: { syllables:["sprout"], syllableText:"sprout", tags:["diphthongs"], def:"To begin to grow.", sentence:"Seeds sprout when conditions provide enough warmth and moisture for growth." },
    ground: { syllables:["ground"], syllableText:"ground", tags:["diphthongs"], def:"The surface of the earth.", sentence:"The ground beneath your feet contains layers formed over millions of years." },
    found: { syllables:["found"], syllableText:"found", tags:["diphthongs"], def:"Past tense of find or to establish.", sentence:"She found success by combining preparation with opportunity when it came." },
    hound: { syllables:["hound"], syllableText:"hound", tags:["diphthongs"], def:"A dog used for hunting.", sentence:"Hounds have exceptional sense of smell for tracking scents over long distances." },
    mound: { syllables:["mound"], syllableText:"mound", tags:["diphthongs"], def:"A small hill or pile.", sentence:"A mound of soil forms gradually as material accumulates in one spot." },
    round: { syllables:["round"], syllableText:"round", tags:["diphthongs"], def:"Shaped like a circle.", sentence:"Round wheels roll smoothly because every point is equidistant from center." },
    sound: { syllables:["sound"], syllableText:"sound", tags:["diphthongs"], def:"Vibrations you can hear.", sentence:"Sound travels through air as pressure waves moving molecules back and forth." },
    wound: { syllables:["wound"], syllableText:"wound", tags:["diphthongs"], def:"An injury breaking skin.", sentence:"A wound heals as your body grows new tissue to repair the damage." },
    bound: { syllables:["bound"], syllableText:"bound", tags:["diphthongs"], def:"Tied or heading toward.", sentence:"Stay bound to your principles even when others pressure you to change." },
    count: { syllables:["count"], syllableText:"count", tags:["diphthongs"], def:"To determine total number.", sentence:"Count your blessings daily to maintain perspective and gratitude in life." },
    mount: { syllables:["mount"], syllableText:"mount", tags:["diphthongs"], def:"A mountain or to climb up.", sentence:"Mount a challenge by preparing thoroughly and staying determined throughout always." },
    
    now: { syllables:["now"], syllableText:"now", tags:["diphthongs"], def:"At the present time.", sentence:"Now is the only moment you can actually control or change directly." },
    how: { syllables:["how"], syllableText:"how", tags:["diphthongs"], def:"In what way or manner.", sentence:"How you do anything shows how you do everything in life." },
    cow: { syllables:["cow"], syllableText:"cow", tags:["diphthongs"], def:"A large farm animal giving milk.", sentence:"Cows are ruminants that digest plants using multiple stomach compartments efficiently." },
    bow: { syllables:["bow"], syllableText:"bow", tags:["diphthongs"], def:"To bend forward or front of ship.", sentence:"Bow respectfully to show honor and acknowledge others in many cultures worldwide." },
    vow: { syllables:["vow"], syllableText:"vow", tags:["diphthongs"], def:"A serious promise.", sentence:"Keep your vows faithfully because your word reflects your character completely." },
    plow: { syllables:["plow"], syllableText:"plow", tags:["diphthongs"], def:"A tool for turning soil.", sentence:"A plow breaks up soil so air and water can reach plant roots." },
    down: { syllables:["down"], syllableText:"down", tags:["diphthongs"], def:"Toward a lower place.", sentence:"What goes up must come down because gravity pulls everything earthward constantly." },
    town: { syllables:["town"], syllableText:"town", tags:["diphthongs","all"], def:"A place where people live together.", sentence:"Towns grow when people gather to trade goods and share resources together." },
    brown: { syllables:["brown"], syllableText:"brown", tags:["diphthongs"], def:"A dark color like wood.", sentence:"Brown results from mixing red, yellow, and black pigments together in paint." },
    crown: { syllables:["crown"], syllableText:"crown", tags:["diphthongs"], def:"A king or queen's headpiece.", sentence:"A crown symbolizes authority and responsibility to lead people wisely and fairly." },
    drown: { syllables:["drown"], syllableText:"drown", tags:["diphthongs"], def:"To die underwater from lack of air.", sentence:"Learn to swim to avoid drowning and stay safe near water always." },
    frown: { syllables:["frown"], syllableText:"frown", tags:["diphthongs"], def:"To show disapproval with your face.", sentence:"A frown uses more muscles than a smile requires to form naturally." },
    clown: { syllables:["clown"], syllableText:"clown", tags:["diphthongs"], def:"A performer who acts silly.", sentence:"A clown makes people laugh by exaggerating actions and expressions humorously together." },

    /* ================================
       IRREGULAR/HEART WORDS
       ================================ */
    
    come: { syllables:["come"], syllableText:"come", tags:["irregular"], def:"To move toward someone or something.", sentence:"Come prepared to every situation by thinking ahead about possibilities that await." },
    some: { syllables:["some"], syllableText:"some", tags:["irregular"], def:"An unspecified amount.", sentence:"Some days are hard, but those days teach lessons you can't learn easily." },
    done: { syllables:["done"], syllableText:"done", tags:["irregular","magic-e"], def:"Finished or completed.", sentence:"Something's done when you've given your honest best effort to complete it." },
    one: { syllables:["one"], syllableText:"one", tags:["irregular"], def:"The first number; single.", sentence:"One small action repeated daily creates massive change over long time periods." },
    once: { syllables:["once"], syllableText:"once", tags:["irregular"], def:"One time only.", sentence:"Once you learn something, it becomes part of you forever inside." },
    said: { syllables:["said"], syllableText:"said", tags:["irregular"], def:"Past tense of say.", sentence:"Listen to what was said, but also notice what wasn't said too." },
    have: { syllables:["have"], syllableText:"have", tags:["irregular"], def:"To possess or own.", sentence:"Be grateful for what you have instead of focusing on what's missing." },
    give: { syllables:["give"], syllableText:"give", tags:["irregular"], def:"To provide or transfer.", sentence:"Give freely without expecting anything back and watch abundance grow naturally." },
    live: { syllables:["live"], syllableText:"live", tags:["irregular"], def:"To be alive or reside somewhere.", sentence:"Live fully in each moment because time always moves forward never back." },
    love: { syllables:["love"], syllableText:"love", tags:["irregular"], def:"Deep affection and care.", sentence:"Love grows stronger when you nurture it through actions not just words." },
    move: { syllables:["move"], syllableText:"move", tags:["irregular"], def:"To change position.", sentence:"Move forward even when progress feels slow because motion beats staying stuck." },
    two: { syllables:["two"], syllableText:"two", tags:["irregular"], def:"The number after one.", sentence:"Two heads are better than one when you need different perspectives together." },
    who: { syllables:["who"], syllableText:"who", tags:["irregular"], def:"What person or persons.", sentence:"Who you become matters more than what you achieve in life ultimately." },
    do: { syllables:["do"], syllableText:"do", tags:["irregular"], def:"To perform an action.", sentence:"Do what's right even when no one is watching you closely at all." },
    to: { syllables:["to"], syllableText:"to", tags:["irregular"], def:"Expressing direction or purpose.", sentence:"Listen to understand, not just to respond with your own thoughts quickly." },
    of: { syllables:["of"], syllableText:"of", tags:["irregular"], def:"Belonging to or about.", sentence:"Think of others before yourself and kindness naturally follows after that." },
    was: { syllables:["was"], syllableText:"was", tags:["irregular"], def:"Past tense of is.", sentence:"What was done in the past can inform but shouldn't limit your future." },
    are: { syllables:["are"], syllableText:"are", tags:["irregular"], def:"Present tense plural of be.", sentence:"We are all connected through shared humanity despite our many differences today." },
    you: { syllables:["you"], syllableText:"you", tags:["irregular"], def:"The person being addressed.", sentence:"You have the power to choose your response in every situation life presents." },
    put: { syllables:["put"], syllableText:"put", tags:["irregular"], def:"To place in a location.", sentence:"Put effort into things that matter most to you and your community." },
    any: { syllables:["any"], syllableText:"any", tags:["irregular"], def:"One or some regardless of which.", sentence:"Any progress is better than no progress when you're learning something new." },
    many: { syllables:["many"], syllableText:"many", tags:["irregular"], def:"A large number of.", sentence:"Many small efforts combined create enormous results over sufficient time periods." },
    only: { syllables:["only"], syllableText:"only", tags:["irregular"], def:"Solely or just.", sentence:"You're only limited by the boundaries you place on your own thinking." },
    both: { syllables:["both"], syllableText:"both", tags:["irregular"], def:"Two together; the one and the other.", sentence:"Both logic and emotion are important when making big life decisions wisely." },
    been: { syllables:["been"], syllableText:"been", tags:["irregular"], def:"Past participle of be.", sentence:"I've been learning that mistakes teach more than perfect success ever does." },
    does: { syllables:["does"], syllableText:"does", tags:["irregular"], def:"Third person singular present of do.", sentence:"Practice makes permanent, not perfect, so what you practice really matters much." },
    says: { syllables:["says"], syllableText:"says", tags:["irregular"], def:"Third person singular present of say.", sentence:"What someone says matters less than what they consistently do over time." },
    goes: { syllables:["goes"], syllableText:"goes", tags:["irregular"], def:"Third person singular present of go.", sentence:"Everything goes in cycles; remember this during both good and hard times." },
    were: { syllables:["were"], syllableText:"were", tags:["irregular"], def:"Past tense plural of be.", sentence:"We were all beginners once, so be patient with those just starting out." },
    want: { syllables:["want"], syllableText:"want", tags:["irregular"], def:"To desire or wish for.", sentence:"Want what you have before wanting what you don't to find contentment." },
    work: { syllables:["work"], syllableText:"work", tags:["irregular"], def:"Activity involving effort for a purpose.", sentence:"Hard work compounds over time creating results that seem magical to others." },
    word: { syllables:["word"], syllableText:"word", tags:["irregular"], def:"A unit of language.", sentence:"Choose your words carefully because they shape reality for yourself and others." },
    four: { syllables:["four"], syllableText:"four", tags:["irregular"], def:"The number after three.", sentence:"Four is the first composite number after one, two, and three primes." },
    your: { syllables:["your"], syllableText:"your", tags:["irregular"], def:"Belonging to you.", sentence:"Your thoughts shape your feelings which drive your actions defining your life." },
    would: { syllables:["would"], syllableText:"would", tags:["irregular"], def:"Past tense of will; indicating possibility.", sentence:"What would you do if you knew you absolutely could not fail?" },
    could: { syllables:["could"], syllableText:"could", tags:["irregular"], def:"Past tense of can; ability or possibility.", sentence:"You could achieve more than you think if fear didn't hold you back." },
    should: { syllables:["should"], syllableText:"should", tags:["irregular"], def:"Indicating obligation or advice.", sentence:"Should is often pressure from outside; focus instead on what you truly want." },


    /* ================================
       MULTISYLLABIC WORDS (6+ letters, 2+ syllables)
       ================================ */
    
    picnic: { syllables:["pic","nic"], syllableText:"pic-nic", tags:["multisyllable","cvcc","all"], def:"A meal eaten outdoors.", sentence:"A picnic combines food, nature, and friends into simple memorable joy together." },
    basket: { syllables:["bas","ket"], syllableText:"bas-ket", tags:["multisyllable","cvcc","all"], def:"A woven container.", sentence:"A basket weaves flexible materials into strong useful shapes through clever patterns." },
    robot: { syllables:["ro","bot"], syllableText:"ro-bot", tags:["multisyllable","all"], def:"A machine following instructions.", sentence:"Robots follow algorithms, which are just step-by-step instructions written in code." },
    sunset: { syllables:["sun","set"], syllableText:"sun-set", tags:["multisyllable"], def:"When the sun goes below horizon.", sentence:"A sunset occurs when Earth's rotation makes the sun appear to sink down." },
    cannot: { syllables:["can","not"], syllableText:"can-not", tags:["multisyllable"], def:"Not able to do something.", sentence:"Cannot is often just can with fear or doubt blocking the way forward." },
    happen: { syllables:["hap","pen"], syllableText:"hap-pen", tags:["multisyllable"], def:"To occur or take place.", sentence:"Good things happen when preparation meets opportunity at the right moment." },
    lesson: { syllables:["les","son"], syllableText:"les-son", tags:["multisyllable"], def:"Something to be learned.", sentence:"Every lesson, whether planned or unexpected, adds to your growing wisdom bank." },
    better: { syllables:["bet","ter"], syllableText:"bet-ter", tags:["multisyllable","suffix"], def:"Of higher quality.", sentence:"Better is the enemy of perfect when perfect prevents you from starting." },
    kitten: { syllables:["kit","ten"], syllableText:"kit-ten", tags:["multisyllable"], def:"A young cat.", sentence:"A kitten learns through play, practicing skills it will need as an adult." },
    mitten: { syllables:["mit","ten"], syllableText:"mit-ten", tags:["multisyllable"], def:"A warm covering for the hand.", sentence:"A mitten keeps your hand warm by trapping a layer of still air inside." },
    muffin: { syllables:["muf","fin"], syllableText:"muf-fin", tags:["multisyllable"], def:"A small baked cake.", sentence:"A muffin rises because baking soda releases gas bubbles when heated up." },
    napkin: { syllables:["nap","kin"], syllableText:"nap-kin", tags:["multisyllable"], def:"A cloth for wiping while eating.", sentence:"A napkin is simply practical courtesy that keeps you and the table clean." },
    rabbit: { syllables:["rab","bit"], syllableText:"rab-bit", tags:["multisyllable"], def:"A small mammal with long ears.", sentence:"Rabbits have excellent hearing to detect predators approaching from any direction quietly." },
    planet: { syllables:["plan","et"], syllableText:"plan-et", tags:["multisyllable"], def:"A large celestial body orbiting a star.", sentence:"Our planet Earth is the only known home for life in the vast universe." },
    wagon: { syllables:["wag","on"], syllableText:"wag-on", tags:["multisyllable"], def:"A vehicle with four wheels.", sentence:"A wagon uses wheels to reduce friction making it easier to move heavy loads." },
    button: { syllables:["but","ton"], syllableText:"but-ton", tags:["multisyllable"], def:"A fastener for clothes.", sentence:"A button creates a mechanical advantage by looping through a small opening securely." },
    cotton: { syllables:["cot","ton"], syllableText:"cot-ton", tags:["multisyllable"], def:"Soft fiber from a plant.", sentence:"Cotton fibers are hollow tubes that make fabric breathable and comfortable to wear." },
    carrot: { syllables:["car","rot"], syllableText:"car-rot", tags:["multisyllable","r-controlled"], def:"An orange root vegetable.", sentence:"Carrots store nutrients underground as a root, preparing for next season's growth." },
    magnet: { syllables:["mag","net"], syllableText:"mag-net", tags:["multisyllable"], def:"An object attracting metal.", sentence:"A magnet creates an invisible force field around it pulling on certain metals." },
    pencil: { syllables:["pen","cil"], syllableText:"pen-cil", tags:["multisyllable","schwa","all"], def:"A writing tool with graphite.", sentence:"A pencil leaves graphite marks that reflect light differently than the paper does." },
    dentist: { syllables:["den","tist"], syllableText:"den-tist", tags:["multisyllable"], def:"A tooth doctor.", sentence:"A dentist helps maintain your teeth which must last your entire lifetime ideally." },
    contest: { syllables:["con","test"], syllableText:"con-test", tags:["multisyllable"], def:"A competition for a prize.", sentence:"A contest shows who performs best under specific rules and time constraints given." },
    cactus: { syllables:["cac","tus"], syllableText:"cac-tus", tags:["multisyllable"], def:"A spiky desert plant.", sentence:"A cactus stores water in its thick stem surviving months without any rain." },
    insect: { syllables:["in","sect"], syllableText:"in-sect", tags:["multisyllable","prefix"], def:"A small animal with six legs.", sentence:"Insects have exoskeletons on the outside protecting soft organs within their bodies." },
    plastic: { syllables:["plas","tic"], syllableText:"plas-tic", tags:["multisyllable"], def:"A synthetic material.", sentence:"Plastic is moldable when hot but becomes rigid when cooled back down." },
    inspect: { syllables:["in","spect"], syllableText:"in-spect", tags:["multisyllable","prefix"], def:"To examine closely.", sentence:"Inspect your work carefully before submitting to catch errors you can still fix." },
    subject: { syllables:["sub","ject"], syllableText:"sub-ject", tags:["multisyllable","prefix"], def:"A topic or area of study.", sentence:"Each subject in school teaches you to think in different useful ways." },
    chapter: { syllables:["chap","ter"], syllableText:"chap-ter", tags:["multisyllable","digraph"], def:"A section of a book.", sentence:"Each chapter of your life prepares you for the chapters yet to come." },
    monster: { syllables:["mon","ster"], syllableText:"mon-ster", tags:["multisyllable"], def:"An imaginary scary creature.", sentence:"Monsters in stories represent fears we must face to grow braver over time." },
    whisper: { syllables:["whis","per"], syllableText:"whis-per", tags:["multisyllable","digraph"], def:"To speak very softly.", sentence:"A whisper uses minimal air creating quiet sounds others nearby can barely hear." },
    thunder: { syllables:["thun","der"], syllableText:"thun-der", tags:["multisyllable","digraph"], def:"Loud sound from lightning.", sentence:"Thunder is air rapidly expanding when lightning heats it to extreme temperatures instantly." },
    chicken: { syllables:["chick","en"], syllableText:"chick-en", tags:["multisyllable","digraph"], def:"A common farm bird.", sentence:"Chickens descended from jungle fowl domesticated thousands of years ago for eggs." },
    blanket: { syllables:["blan","ket"], syllableText:"blan-ket", tags:["multisyllable","blend"], def:"A large warm covering.", sentence:"A blanket traps your body heat in air pockets keeping you warm overnight." },
    problem: { syllables:["prob","lem"], syllableText:"prob-lem", tags:["multisyllable","blend"], def:"A difficulty needing a solution.", sentence:"Every problem contains the seeds of its own solution if you look carefully." },
    pretzel: { syllables:["pret","zel"], syllableText:"pret-zel", tags:["multisyllable","blend"], def:"A twisted baked snack.", sentence:"A pretzel's shape is just dough twisted then baked until golden and crispy." },
    trumpet: { syllables:["trum","pet"], syllableText:"trum-pet", tags:["multisyllable","blend"], def:"A brass musical instrument.", sentence:"A trumpet creates sound when air vibrates through its brass tube and valves." },
    explain: { syllables:["ex","plain"], syllableText:"ex-plain", tags:["multisyllable","prefix"], def:"To make something clear.", sentence:"Explain complex ideas simply to show you truly understand them deeply yourself." },
    complain: { syllables:["com","plain"], syllableText:"com-plain", tags:["multisyllable","prefix"], def:"To express dissatisfaction.", sentence:"Complaining without offering solutions rarely improves any situation meaningfully for anyone." },
    always: { syllables:["al","ways"], syllableText:"al-ways", tags:["multisyllable","vowel-team"], def:"At all times; constantly.", sentence:"Always treat others the way you hope to be treated yourself consistently." },
    between: { syllables:["be","tween"], syllableText:"be-tween", tags:["multisyllable","vowel-team"], def:"In the space separating two things.", sentence:"Truth often lives between two extreme positions people argue about loudly." },
    window: { syllables:["win","dow"], syllableText:"win-dow", tags:["multisyllable","diphthongs"], def:"An opening with glass for light.", sentence:"A window lets light in while keeping weather out through transparent solid glass." },
    rainbow: { syllables:["rain","bow"], syllableText:"rain-bow", tags:["multisyllable","vowel-team","diphthongs"], def:"Colored arc appearing after rain.", sentence:"A rainbow forms when sunlight refracts through water droplets splitting into colors." },
    follow: { syllables:["fol","low"], syllableText:"fol-low", tags:["multisyllable","diphthongs"], def:"To go after or obey.", sentence:"Follow good examples but also think independently about what's truly right always." },
    borrow: { syllables:["bor","row"], syllableText:"bor-row", tags:["multisyllable","r-controlled","diphthongs"], def:"To use temporarily then return.", sentence:"Borrow ideas from many sources then combine them into something uniquely yours." },
    arrow: { syllables:["ar","row"], syllableText:"ar-row", tags:["multisyllable","r-controlled","diphthongs"], def:"A pointed projectile or symbol.", sentence:"An arrow flies straight because fletching stabilizes its flight through the air." },
    pillow: { syllables:["pil","low"], syllableText:"pil-low", tags:["multisyllable","diphthongs"], def:"A soft support for your head.", sentence:"A pillow cushions your head and neck supporting proper spine alignment during sleep." },
    circus: { syllables:["cir","cus"], syllableText:"cir-cus", tags:["multisyllable","r-controlled","schwa"], def:"A show with acrobats and animals.", sentence:"A circus demonstrates what humans can do with dedicated practice and courage." },
    turnip: { syllables:["tur","nip"], syllableText:"tur-nip", tags:["multisyllable","r-controlled"], def:"A round white root vegetable.", sentence:"A turnip grows underground storing energy for the plant's future reproductive cycle." },
    person: { syllables:["per","son"], syllableText:"per-son", tags:["multisyllable","r-controlled"], def:"A human individual.", sentence:"Every person has inherent worth regardless of abilities or circumstances they face." },
    number: { syllables:["num","ber"], syllableText:"num-ber", tags:["multisyllable","r-controlled"], def:"A mathematical unit for counting.", sentence:"Numbers are abstract symbols representing quantities we observe in the real world." },
    sister: { syllables:["sis","ter"], syllableText:"sis-ter", tags:["multisyllable","r-controlled"], def:"A female sibling.", sentence:"A sister shares your family history creating unique bonds lasting your whole life." },
    winter: { syllables:["win","ter"], syllableText:"win-ter", tags:["multisyllable","r-controlled"], def:"The coldest season of the year.", sentence:"Winter occurs when Earth's tilt points your hemisphere away from the sun." },
    summer: { syllables:["sum","mer"], syllableText:"sum-mer", tags:["multisyllable","r-controlled"], def:"The warmest season of the year.", sentence:"Summer happens when your hemisphere tilts toward the sun receiving more direct light." },
    doctor: { syllables:["doc","tor"], syllableText:"doc-tor", tags:["multisyllable","r-controlled"], def:"A medical professional.", sentence:"A doctor uses science and compassion together to help people heal and stay well." },
    mirror: { syllables:["mir","ror"], syllableText:"mir-ror", tags:["multisyllable","r-controlled"], def:"A reflective surface showing your image.", sentence:"A mirror reflects light back at the same angle it arrives creating your image." },
    purple: { syllables:["pur","ple"], syllableText:"pur-ple", tags:["multisyllable","r-controlled"], def:"A color mixing red and blue.", sentence:"Purple has been associated with royalty because its dye was once extremely rare." },
    turtle: { syllables:["tur","tle"], syllableText:"tur-tle", tags:["multisyllable","r-controlled"], def:"A reptile with a shell.", sentence:"A turtle's shell is actually its skeleton grown on the outside for protection." },
    market: { syllables:["mar","ket"], syllableText:"mar-ket", tags:["multisyllable","r-controlled"], def:"A place for buying and selling.", sentence:"Markets work through supply and demand finding prices that balance both sides." },
    garden: { syllables:["gar","den"], syllableText:"gar-den", tags:["multisyllable","r-controlled"], def:"An area for growing plants.", sentence:"A garden teaches patience as you wait for seeds to grow over time." },
    farmer: { syllables:["far","mer"], syllableText:"far-mer", tags:["multisyllable","r-controlled","suffix"], def:"Someone who grows crops or raises animals.", sentence:"Farmers feed the world by understanding how to work with nature's cycles." },
    corner: { syllables:["cor","ner"], syllableText:"cor-ner", tags:["multisyllable","r-controlled","suffix"], def:"Where two edges or sides meet.", sentence:"A corner creates a ninety-degree angle where two perpendicular lines intersect together." },
    master: { syllables:["mas","ter"], syllableText:"mas-ter", tags:["multisyllable","r-controlled","suffix"], def:"An expert or to learn completely.", sentence:"To master something requires ten thousand hours of deliberate focused practice consistently." },
    faster: { syllables:["fas","ter"], syllableText:"fas-ter", tags:["multisyllable","suffix"], def:"Moving more quickly.", sentence:"Faster isn't always better; sometimes slow and careful wins the race ahead." },
    helper: { syllables:["hel","per"], syllableText:"hel-per", tags:["multisyllable","suffix"], def:"Someone who assists.", sentence:"A good helper anticipates needs before being asked and acts with initiative always." },
    happy: { syllables:["hap","py"], syllableText:"hap-py", tags:["multisyllable","suffix"], def:"Feeling joy or pleasure.", sentence:"Happy people focus on what they have rather than what they lack completely." },
    funny: { syllables:["fun","ny"], syllableText:"fun-ny", tags:["multisyllable","suffix"], def:"Causing laughter or amusement.", sentence:"Funny moments remind us not to take life too seriously all the time." },
    penny: { syllables:["pen","ny"], syllableText:"pen-ny", tags:["multisyllable","suffix"], def:"A one-cent coin.", sentence:"A penny saved is a penny earned teaching the value of thrift." },
    sunny: { syllables:["sun","ny"], syllableText:"sun-ny", tags:["multisyllable","suffix"], def:"Full of sunshine.", sentence:"Sunny days lift mood because sunlight triggers chemical changes in your brain." },
    lucky: { syllables:["luck","y"], syllableText:"luck-y", tags:["multisyllable","suffix"], def:"Having good fortune.", sentence:"Lucky people create their own luck through preparation and positive attitudes daily." },
    really: { syllables:["real","ly"], syllableText:"real-ly", tags:["multisyllable","suffix"], def:"In actual fact; truly.", sentence:"Really listen when someone speaks by giving them your full undivided attention completely." },
    slowly: { syllables:["slow","ly"], syllableText:"slow-ly", tags:["multisyllable","suffix"], def:"At a slow pace.", sentence:"Do things slowly and carefully when accuracy matters more than speed alone." },
    quickly: { syllables:["quick","ly"], syllableText:"quick-ly", tags:["multisyllable","suffix"], def:"At a fast pace.", sentence:"Act quickly when opportunity knocks because chances don't wait around for you." },
    kindly: { syllables:["kind","ly"], syllableText:"kind-ly", tags:["multisyllable","suffix"], def:"In a kind manner.", sentence:"Speak kindly because words can heal or hurt deeply depending on tone." },
    sadly: { syllables:["sad","ly"], syllableText:"sad-ly", tags:["multisyllable","suffix"], def:"In a sad manner.", sentence:"Sadly, not everyone gets equal opportunities, which is why we must work for fairness." },
    jumping: { syllables:["jump","ing"], syllableText:"jump-ing", tags:["multisyllable","suffix","blend"], def:"Present participle of jump.", sentence:"Jumping rope improves coordination by combining rhythm and body awareness together effectively." },
    running: { syllables:["run","ning"], syllableText:"run-ning", tags:["multisyllable","suffix","doubling"], def:"Present participle of run.", sentence:"Running strengthens your heart by making it pump blood more efficiently over time." },
    sitting: { syllables:["sit","ting"], syllableText:"sit-ting", tags:["multisyllable","suffix","doubling"], def:"Present participle of sit.", sentence:"Sitting for long periods can harm health so stand and stretch regularly throughout days." },
    swimming: { syllables:["swim","ming"], syllableText:"swim-ming", tags:["multisyllable","suffix","doubling"], def:"Present participle of swim.", sentence:"Swimming is excellent exercise because water supports your body while you work muscles." },
    shopping: { syllables:["shop","ping"], syllableText:"shop-ping", tags:["multisyllable","suffix","doubling"], def:"Present participle of shop.", sentence:"Shopping wisely means buying what you need instead of what advertisers want you to want." },
    stopped: { syllables:["stopped"], syllableText:"stopped", tags:["multisyllable","suffix","doubling"], def:"Past tense of stop.", sentence:"She stopped to help someone in need showing compassion costs only time." },
    planned: { syllables:["planned"], syllableText:"planned", tags:["multisyllable","suffix","doubling"], def:"Past tense of plan.", sentence:"He planned ahead so when opportunity came he was ready to seize it." },
    grabbed: { syllables:["grabbed"], syllableText:"grabbed", tags:["multisyllable","suffix","doubling"], def:"Past tense of grab.", sentence:"She grabbed the chance to learn instead of letting fear hold her back." },
    respect: { syllables:["re","spect"], syllableText:"re-spect", tags:["multisyllable","prefix","all"], def:"Admiration for someone's qualities.", sentence:"Respect yourself and others regardless of differences you notice between you all." },
    return: { syllables:["re","turn"], syllableText:"re-turn", tags:["multisyllable","prefix","r-controlled"], def:"To come or go back.", sentence:"Return kindness with kindness and watch how positivity multiplies around you always." },
    redo: { syllables:["re","do"], syllableText:"re-do", tags:["multisyllable","prefix"], def:"To do something again.", sentence:"Don't be afraid to redo work when you know it can be better." },
    replay: { syllables:["re","play"], syllableText:"re-play", tags:["multisyllable","prefix","vowel-team"], def:"To play again.", sentence:"Replay memories in your mind to learn from past experiences continuously improving." },
    unfair: { syllables:["un","fair"], syllableText:"un-fair", tags:["multisyllable","prefix"], def:"Not just or equal.", sentence:"When something's unfair, speak up respectfully and work for justice courageously always." },
    unkind: { syllables:["un","kind"], syllableText:"un-kind", tags:["multisyllable","prefix"], def:"Not considerate or nice.", sentence:"Unkind words hurt long after they're spoken so choose your words with care." },
    unlock: { syllables:["un","lock"], syllableText:"un-lock", tags:["multisyllable","prefix"], def:"To open a lock.", sentence:"Unlock potential by removing the mental locks you've placed on your own abilities." },
    unhappy: { syllables:["un","hap","py"], syllableText:"un-hap-py", tags:["multisyllable","prefix","suffix"], def:"Not content or joyful.", sentence:"Feeling unhappy sometimes is normal; don't pressure yourself to be happy constantly." },

  }; // End WORD_ENTRIES

  console.log("✓ Enhanced word bank loaded with", Object.keys(window.WORD_ENTRIES).length, "words across all patterns");

})();
