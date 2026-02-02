/* Focus info (SoR skill hints) */
(function(){
  'use strict';
  window.FOCUS_INFO = {
  "all": {
    "title": "All Words",
    "desc": "Mixed review across patterns.",
    "examples": "cat, ship, cake, rain",
    "quick": []
  },
  "cvc": {
    "title": "CVC (Short Vowels)",
    "desc": "Short vowel, 3-sound words (consonant–vowel–consonant).",
    "examples": "cat, dog, sun",
    "quick": [
      "a",
      "e",
      "i",
      "o",
      "u"
    ]
  },
  "digraph": {
    "title": "Digraphs",
    "desc": "Two letters, one sound (sh, ch, th, wh, ck).",
    "examples": "ship, chat, thin, whiz, duck",
    "quick": [
      "sh",
      "ch",
      "th",
      "wh",
      "ck"
    ]
  },
  "ccvc": {
    "title": "Initial Blends",
    "desc": "Two consonants at the start; you hear both sounds.",
    "examples": "stop, crab, flag",
    "quick": [
      "st",
      "bl",
      "tr",
      "fl",
      "cr",
      "gr",
      "sp"
    ]
  },
  "cvcc": {
    "title": "Final Blends",
    "desc": "Two consonants at the end; you hear both sounds.",
    "examples": "milk, hand, nest",
    "quick": [
      "mp",
      "nd",
      "st",
      "nk",
      "ft",
      "sk",
      "ld"
    ]
  },
  "trigraph": {
    "title": "Trigraphs",
    "desc": "Three letters, one sound (tch, dge, igh).",
    "examples": "catch, badge, light",
    "quick": [
      "tch",
      "dge",
      "igh"
    ]
  },
  "cvce": {
    "title": "Magic E (CVCe)",
    "desc": "Silent E makes the vowel say its name.",
    "examples": "cake, hope, time",
    "quick": [
      "a_e",
      "i_e",
      "o_e",
      "u_e",
      "e_e"
    ]
  },
  "vowel_team": {
    "title": "Vowel Teams",
    "desc": "Two vowels team up to make one vowel sound.",
    "examples": "rain, boat, see",
    "quick": [
      "ai",
      "ay",
      "ee",
      "ea",
      "oa",
      "ow"
    ]
  },
  "r_controlled": {
    "title": "R-Controlled",
    "desc": "Vowel + R changes the vowel sound.",
    "examples": "car, bird, fern",
    "quick": [
      "ar",
      "or",
      "er",
      "ir",
      "ur"
    ]
  },
  "diphthong": {
    "title": "Diphthongs",
    "desc": "Vowel sounds that glide (oi/oy, ou/ow).",
    "examples": "coin, boy, loud, cow",
    "quick": [
      "oi",
      "oy",
      "ou",
      "ow"
    ]
  },
  "floss": {
    "title": "FLOSS Rule",
    "desc": "Short vowel words often double f/l/s at the end.",
    "examples": "stuff, hill, pass",
    "quick": [
      "ff",
      "ll",
      "ss"
    ]
  },
  "welded": {
    "title": "Welded Sounds",
    "desc": "Sounds stuck together: -ang, -ing, -ong, -ank, -unk, -ing.",
    "examples": "king, bank, song",
    "quick": [
      "ang",
      "ing",
      "ong",
      "ank",
      "unk"
    ]
  },
  "schwa": {
    "title": "Schwa",
    "desc": "The lazy vowel sound in unstressed syllables.",
    "examples": "about, circus",
    "quick": [
      "a",
      "e",
      "i",
      "o",
      "u"
    ]
  },
  "prefix": {
    "title": "Prefixes",
    "desc": "Word parts added to the beginning (un-, re-, pre-).",
    "examples": "unhappy, reread, preview",
    "quick": [
      "un",
      "re",
      "pre",
      "dis",
      "mis"
    ]
  },
  "suffix": {
    "title": "Suffixes",
    "desc": "Word parts added to the end (-ing, -ed, -er, -est).",
    "examples": "jumping, played, faster",
    "quick": [
      "ing",
      "ed",
      "er",
      "est",
      "ly"
    ]
  },
  "compound": {
    "title": "Compound Words",
    "desc": "Two words that join to make one word.",
    "examples": "sunset, playground",
    "quick": [
      "sun",
      "day",
      "rain",
      "bow"
    ]
  },
  "multisyllable": {
    "title": "Multisyllabic Words",
    "desc": "Words with 2+ syllables. Tap and chunk.",
    "examples": "picnic, rabbit, computer",
    "quick": [
      "pre",
      "re",
      "un",
      "tion",
      "ing"
    ]
  }
};
  console.log('✓ Focus info loaded with ' + Object.keys(window.FOCUS_INFO).length + ' groups');
})();