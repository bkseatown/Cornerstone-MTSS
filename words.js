(() => {
  "use strict";

  /* ======================================================
     PHONICS WORDLE — HAPPY MEDIUM PACK (Quality + Variety)
     Canonical schema:
       WORD_ENTRIES[word] = {
         definition, sentence, syllables?, focus[], tags[], seasonal[], tricky?
       }
  ====================================================== */

  const WORD_ENTRIES = {
  "cat": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "A disco frog found the cat in my backpack.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "bat": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the bat!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hat": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The hat is hot.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "rat": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the rat!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "mat": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the mat at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "cap": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the cap!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "map": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the map at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "tap": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the tap in my backpack.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "lap": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The lap is new.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "nap": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the nap!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "fan": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The fan is small.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "van": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the van at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "man": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the man!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "pan": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the pan!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "jam": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the jam!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "ham": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the ham at the park.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "bag": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the bag!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "rag": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The rag is fast.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "tag": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the tag on the playground.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "can": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The penguin found the can in my backpack.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "tan": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The wizard cat found the tan in the hallway.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "cab": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The cab is big.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "tab": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the tab in the hallway.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "bed": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The bed is hot.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "red": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the red!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "net": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The net is fast.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "pet": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the pet!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "pen": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "My friend found the pen at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hen": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "My teacher found the hen in my backpack.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "jet": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the jet!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "vet": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The vet is new.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "web": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "My friend found the web at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "leg": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The leg is cold.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "ten": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the ten!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "den": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The den is hot.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "pig": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the pig on the playground.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "wig": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the wig in the library.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "lid": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The lid is hot.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "kid": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the kid!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "fin": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The fin is new.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "pin": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the pin at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "bin": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the bin in my backpack.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "lip": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The penguin found the lip at the park.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "sip": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The sip is fast.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "tip": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the tip in the kitchen.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "kit": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the kit on the playground.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "rib": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The rib is fast.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "fig": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "A raccoon found the fig at the park.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "dog": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The dog is big.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hog": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the hog!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "log": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The llama found the log on the playground.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "fox": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The fox is soft.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "box": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The wizard cat found the box in the kitchen.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "mop": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the mop at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "top": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the top in my backpack.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "pot": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the pot!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "cot": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the cot in the library.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "rod": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The llama found the rod in the kitchen.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "job": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the job!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "sun": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the sun!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "bug": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the bug at the park.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "mug": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The penguin found the mug in the library.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "cup": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the cup!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "pup": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the pup!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "rug": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Look at the rug!",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "mud": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The llama found the mud in the kitchen.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "nut": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The nut is soft.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "bus": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The penguin found the bus at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "gum": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The gum is fast.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hut": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "A raccoon found the hut in my backpack.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "tub": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I saw the tub at the park.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "run": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The wizard cat can run on the playground.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hop": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I will hop now.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "dig": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Let's dig together.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hug": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Let's hug together.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "cut": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "My friend can cut on the playground.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "mix": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Let's mix together.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "fit": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I will fit now.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "sit": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The llama can sit at the park.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hit": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "We can hit at school.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "rip": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Let's rip together.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "zap": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "I will zap now.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "grab": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "Let's grab together.",
    "focus": [
      "cvc",
      "blends"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "sad": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The frog looks sad.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "mad": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "It was mad in the kitchen.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "bad": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "My socks feel bad today.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "fat": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "My socks feel fat today.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "big": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "It was big on the playground.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "hot": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "The soup was hot.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "wet": {
    "definition": "A short-vowel word for reading and spelling practice.",
    "sentence": "My socks feel wet today.",
    "focus": [
      "cvc"
    ],
    "tags": [
      "focus:cvc",
      "pattern:cvc",
      "wtw:letter-name-alphabetic"
    ],
    "seasonal": []
  },
  "flag": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the flag!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "flap": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The wizard cat found the flap in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "flip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the flip in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "flop": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the flop in the hallway.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "frog": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "A raccoon found the frog at the park.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "from": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the from!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "fresh": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the fresh at the park.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "flash": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The wizard cat found the flash on the playground.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "fling": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the fling!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clap": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the clap at school.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The penguin found the clip at school.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clog": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the clog!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clam": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the clam in the hallway.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cliff": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the cliff!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clock": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The wizard cat found the clock at school.",
    "focus": [
      "blends",
      "digraphs"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clump": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the clump in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clash": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the clash!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "brag": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the brag!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bran": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The bran is new.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "brim": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The penguin found the brim at the park.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "brick": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the brick on the playground.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "brisk": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the brisk in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "brown": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The wizard cat found the brown on the playground.",
    "focus": [
      "blends",
      "vowelTeams"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "brush": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the brush!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "crab": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the crab!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "crib": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The crib is small.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "crop": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the crop!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "crisp": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the crisp!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "crust": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the crust!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "crack": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The crack is soft.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cream": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the cream in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "crowd": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the crowd!",
    "focus": [
      "blends",
      "vowelTeams"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "drip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the drip!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "drop": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The drop is big.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "drag": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the drag!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "drum": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the drum on the playground.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "dress": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "A robot found the dress at the park.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "drive": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the drive in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "grin": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the grin in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "grid": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The grid is soft.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "grip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "My teacher found the grip at school.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "grass": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the grass!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "green": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the green in the hallway.",
    "focus": [
      "blends",
      "vowelTeams"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "grape": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The grape is soft.",
    "focus": [
      "blends",
      "vce"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "plan": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "My teacher found the plan at school.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "plug": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the plug in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "plot": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The plot is hot.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "plum": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "My friend found the plum in the library.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "plus": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The llama found the plus in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "plate": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the plate!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "slam": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The slam is cold.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "slip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the slip!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "slim": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the slim!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "sled": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The llama found the sled in the hallway.",
    "focus": [
      "blends",
      "seasonal"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word",
      "focus:seasonal"
    ],
    "seasonal": [
      "dec",
      "jan"
    ]
  },
  "slot": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The slot is cold.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "slush": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The slush is fast.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "spin": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The spin is hot.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "spot": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the spot in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stop": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the stop in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "step": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the step in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stub": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the stub at school.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stamp": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the stamp in the kitchen.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stick": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The wizard cat found the stick in the hallway.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "trip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the trip!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "trap": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the trap at school.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "trim": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the trim!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "twin": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The penguin found the twin at the park.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "twist": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "My friend found the twist in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "twelve": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the twelve in the library.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "smile": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "A robot found the smile in the library.",
    "focus": [
      "blends",
      "vce"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "smog": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The smog is new.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "smash": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "A disco frog found the smash at school.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "snip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the snip in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "snap": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the snap at the park.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "snack": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "A raccoon found the snack on the playground.",
    "focus": [
      "blends",
      "digraphs"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "skit": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The llama found the skit in the library.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "skip": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the skip on the playground.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "scan": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "I saw the scan in the library.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "scam": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The penguin found the scam in the hallway.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "swim": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the swim!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "swell": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "Look at the swell!",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "swift": {
    "definition": "A blend word for reading and spelling practice.",
    "sentence": "The penguin found the swift in my backpack.",
    "focus": [
      "blends"
    ],
    "tags": [
      "focus:blends",
      "pattern:blends",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "ship": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The ship is small.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shop": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The shop is cold.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shut": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the shut!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shed": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the shed!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shin": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The shin is cold.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "dish": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the dish in the hallway.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "fish": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the fish!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "wish": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the wish!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "rush": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The rush is cold.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cash": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the cash on the playground.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "mash": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the mash in the hallway.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "dash": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The llama found the dash at school.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bash": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the bash!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shell": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the shell!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shack": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A robot found the shack at the park.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shock": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A disco frog found the shock in the hallway.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shave": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The wizard cat found the shave in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "chip": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The penguin found the chip on the playground.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "chin": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The chin is cold.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "chat": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The chat is big.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "chop": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The llama found the chop in the kitchen.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "chill": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the chill in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "check": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The check is soft.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "chess": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The chess is soft.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "chest": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "My teacher found the chest in the library.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bench": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A disco frog found the bench in the library.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "pinch": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The llama found the pinch in the kitchen.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "lunch": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the lunch!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "much": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the much!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "rich": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the rich!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "such": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the such!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "thin": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the thin in the kitchen.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "this": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The this is new.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "that": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the that in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "with": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the with!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "math": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the math!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bath": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "My teacher found the bath in the kitchen.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "path": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the path in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "moth": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A disco frog found the moth in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "thick": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the thick on the playground.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "thumb": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The thumb is hot.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "thump": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The wizard cat found the thump in the library.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "third": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the third!",
    "focus": [
      "digraphs",
      "rControlled"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "when": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A raccoon found the when in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "what": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the what!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "whip": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The whip is small.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "whiz": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The whiz is hot.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "whale": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "My friend found the whale in the library.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "wheel": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "I saw the wheel in the kitchen.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "duck": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The duck is soft.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "pack": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the pack!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "sock": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The sock is fast.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "rock": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The llama found the rock in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "back": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A raccoon found the back in my backpack.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "neck": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A disco frog found the neck in the library.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "tick": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "A raccoon found the tick at school.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "tack": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "Look at the tack!",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "lock": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The lock is big.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stack": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The penguin found the stack at school.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stuck": {
    "definition": "A digraph word for reading and spelling practice.",
    "sentence": "The stuck is new.",
    "focus": [
      "digraphs"
    ],
    "tags": [
      "focus:digraphs",
      "pattern:digraphs",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cake": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the cake at the park.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bake": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The bake is cold.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "make": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "A disco frog found the make in the hallway.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "take": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The take is new.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "late": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the late!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "mate": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the mate in the kitchen.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "date": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The date is cold.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "gate": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the gate at school.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "game": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the game!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "name": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the name in the hallway.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "same": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "A disco frog found the same at school.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "safe": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "My friend found the safe at school.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "case": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the case!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bike": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "My friend found the bike in the hallway.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "like": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The like is new.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "hike": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the hike!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "ride": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the ride!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "side": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "A raccoon found the side at the park.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "time": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "My teacher found the time in the hallway.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "line": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the line in my backpack.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "fine": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the fine!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "mine": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the mine!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "hide": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The hide is hot.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "wide": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "A robot found the wide in the kitchen.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "five": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the five in my backpack.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "home": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the home!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bone": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The bone is fast.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cone": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The cone is soft.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "note": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "A raccoon found the note at school.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "rose": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the rose on the playground.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "nose": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "A robot found the nose in the hallway.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "hope": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the hope!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "rope": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the rope!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "hole": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the hole in my backpack.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "code": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the code!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "joke": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the joke at the park.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cube": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the cube on the playground.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "tube": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The tube is cold.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "tune": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The tune is big.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "mule": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The mule is big.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cute": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the cute in the library.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "rule": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the rule at school.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "use": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the use!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "snake": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the snake!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "plane": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The wizard cat found the plane in the kitchen.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shine": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "Look at the shine!",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "white": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The white is cold.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "slide": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The llama found the slide in the library.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "prize": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "I saw the prize at school.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "brave": {
    "definition": "A magic-e word for reading and spelling practice.",
    "sentence": "The brave is cold.",
    "focus": [
      "vce"
    ],
    "tags": [
      "focus:vce",
      "pattern:vce",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "rain": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the rain in the kitchen.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "train": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The penguin found the train in my backpack.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "pain": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "My teacher found the pain at the park.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "mail": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The mail is soft.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "tail": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the tail in the hallway.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "wait": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "A raccoon found the wait on the playground.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "play": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "A disco frog found the play in the kitchen.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stay": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the stay at the park.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "tray": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the tray!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "day": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The day is fast.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "boat": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The boat is hot.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "coat": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the coat!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "goat": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "A disco frog found the goat at the park.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "road": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "My teacher found the road at school.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "toad": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The toad is soft.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "soap": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The wizard cat found the soap in the library.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "toast": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the toast!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "float": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The float is new.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "moan": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the moan in my backpack.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "seed": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The seed is small.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "need": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the need!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "seen": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the seen!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "feet": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the feet at the park.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "meet": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The wizard cat found the meet at the park.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "tree": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the tree on the playground.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "free": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The free is soft.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "sleep": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The sleep is cold.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "keep": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the keep!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "sea": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the sea!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "team": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the team!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "seat": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the seat!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "heat": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the heat in my backpack.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "beach": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The beach is hot.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "peach": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The peach is new.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "reach": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "A disco frog found the reach at school.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "teach": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "My friend found the teach in the library.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "moon": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the moon in my backpack.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "food": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the food!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "room": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "My teacher found the room in my backpack.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "soon": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the soon in the library.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cool": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the cool!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "pool": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The pool is new.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "spoon": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The spoon is hot.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shoot": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the shoot!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stoop": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the stoop in the library.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "coin": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the coin!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "join": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the join in my backpack.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "boil": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the boil at the park.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "foil": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the foil in the hallway.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "soil": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The wizard cat found the soil in my backpack.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "toy": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "A robot found the toy in the kitchen.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "boy": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The boy is hot.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "joy": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "A robot found the joy in the hallway.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "point": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the point!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "voice": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "My teacher found the voice in the hallway.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shout": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the shout!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "cloud": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the cloud!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "round": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "My friend found the round at school.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "sound": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The sound is big.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "found": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "The found is cold.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "town": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the town!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "loud": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "I saw the loud in the hallway.",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "proud": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the proud!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "clown": {
    "definition": "A vowel-team word for reading and spelling practice.",
    "sentence": "Look at the clown!",
    "focus": [
      "vowelTeams"
    ],
    "tags": [
      "focus:vowelTeams",
      "pattern:vowelTeams",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "car": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "Look at the car!",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "star": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The star is small.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "farm": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The farm is small.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "park": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The park is small.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "dark": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the dark on the playground.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shark": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the shark in the hallway.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "march": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The wizard cat found the march in the kitchen.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "spark": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the spark in the library.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "start": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the start at the park.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "bird": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The bird is new.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "girl": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "My teacher found the girl at the park.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "first": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The first is hot.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "shirt": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "Look at the shirt!",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "stir": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the stir in my backpack.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "whirl": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "A disco frog found the whirl in the library.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "corn": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "My teacher found the corn at school.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "fork": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "My friend found the fork in the library.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "storm": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The storm is small.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "short": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the short at school.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "sport": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "My friend found the sport in my backpack.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "thorn": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "Look at the thorn!",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "north": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the north in my backpack.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "turn": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The turn is small.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "hurt": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the hurt in the library.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "fur": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The fur is cold.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "burst": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The burst is fast.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "curl": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The curl is hot.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "purr": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "Look at the purr!",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "surf": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The surf is small.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "her": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the her at school.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "fern": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "Look at the fern!",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "term": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "I saw the term at school.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "verb": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The penguin found the verb at school.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "perch": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The perch is cold.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "serve": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "Look at the serve!",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "work": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The work is hot.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "word": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The wizard cat found the word in the hallway.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "worm": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "Look at the worm!",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "world": {
    "definition": "A r-controlled word for reading and spelling practice.",
    "sentence": "The penguin found the world in the kitchen.",
    "focus": [
      "rControlled"
    ],
    "tags": [
      "focus:rControlled",
      "pattern:rControlled",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "said": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "She said yes before I finished asking.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": [],
    "tricky": [
      "ai sounds like /e/"
    ]
  },
  "was": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "The robot was confused by toast.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": [],
    "tricky": [
      "a sounds like /u/"
    ]
  },
  "were": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "We were ready for recess.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "have": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I have a plan involving pancakes.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "give": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Please give the marker back.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "done": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I am done, so I will clean up.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "come": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Come here and look.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "some": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I ate some grapes.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "one": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "One frog wore a tiny hat.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "two": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Two ducks waddled by.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "once": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Once I found a snack in my pocket.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "love": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I used the word love in a sentence at school.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "they": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "They ran when the bell rang.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "their": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Their backpacks were lined up.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "there": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Put it there on the shelf.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "where": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Where did my pencil go?",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "here": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Come here and look.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "these": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "These books are heavy.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "those": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Those cookies smell good.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "does": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "She does the math fast.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": [],
    "tricky": [
      "oe sounds like /u/"
    ]
  },
  "do": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I do my best at school.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "to": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I went to the park.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "of": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "A cup of cocoa is cozy.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "you": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "You can do it!",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "your": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Your backpack is here.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "could": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I could try again.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "would": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I would pick pizza.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "should": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "We should be kind.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "laugh": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "We laugh at silly jokes.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "enough": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "That is enough frosting.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "again": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Try again, please.",
    "focus": [
      "heart",
      "schwa"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "friend": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "My friend shared a snack.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "because": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Because the cat blinked, we all laughed.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "thought": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I thought it was Friday.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "through": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "We walked through the doorway.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "though": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "It was hard, though we kept trying.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "people": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "People cheered at the game.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "sure": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "Are you sure?",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "been": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I have been to the park.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "busy": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I used the word busy in a sentence on the playground.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "pretty": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I used the word pretty in a sentence in the library.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "every": {
    "definition": "A common word you often have to know by heart.",
    "sentence": "I used the word every in a sentence in the hallway.",
    "focus": [
      "heart"
    ],
    "tags": [
      "focus:heart",
      "pattern:heart",
      "high-frequency",
      "wtw:within-word"
    ],
    "seasonal": []
  },
  "unhappy": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced unhappy and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "unsafe": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in unsafe changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "unfair": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced unfair and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "unlock": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced unlock and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "untie": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced untie and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "unable": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in unable changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "replay": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in replay changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "redo": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "A raccoon wrote redo and circled the prefix in the library.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "refill": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in refill changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "repack": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "My teacher wrote repack and circled the prefix at the park.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "repaint": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in repaint changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "recheck": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in recheck changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "misplace": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced misplace and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "misread": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in misread changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "mistake": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The penguin wrote mistake and circled the prefix in the library.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "careless": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The llama wrote careless and circled the prefix in the hallway.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "fearless": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in fearless changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "helpful": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in helpful changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "playful": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in playful changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "thankful": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced thankful and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "hopeful": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced hopeful and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "joyful": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "A raccoon wrote joyful and circled the prefix at the park.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "quickly": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced quickly and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "slowly": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in slowly changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "kindly": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in kindly changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "running": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced running and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "hopping": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in hopping changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "stopping": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "A disco frog wrote stopping and circled the prefix in the hallway.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "clapping": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced clapping and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "skipping": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The penguin wrote skipping and circled the prefix in my backpack.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "slamming": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in slamming changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "played": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced played and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "jumped": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The wizard cat wrote jumped and circled the prefix in the hallway.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "helped": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "A robot wrote helped and circled the prefix in the kitchen.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "fixed": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "My friend wrote fixed and circled the prefix in my backpack.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "closed": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in closed changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "opened": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in opened changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "biggest": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in biggest changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "fastest": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The wizard cat wrote fastest and circled the prefix in the kitchen.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "smallest": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The llama wrote smallest and circled the prefix in my backpack.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "happier": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced happier and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "funnier": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The prefix or suffix in funnier changes meaning.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "sadness": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "We practiced sadness and talked about its parts.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "kindness": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The penguin wrote kindness and circled the prefix in the kitchen.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "darkness": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "The wizard cat wrote darkness and circled the prefix at school.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "helpfulness": {
    "definition": "A word built from meaningful parts (prefixes/suffixes).",
    "sentence": "A robot wrote helpfulness and circled the prefix in the kitchen.",
    "focus": [
      "morphology"
    ],
    "tags": [
      "focus:morphology",
      "pattern:morphology",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "banana": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say banana slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "pencil": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in pencil.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "animal": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in animal.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "family": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in family.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "problem": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in problem.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "robot": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say robot slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "button": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say button slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "lemon": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in lemon.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "pilot": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say pilot slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "salad": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say salad slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "about": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say about slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "above": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in above.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "around": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in around.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "paper": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say paper slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "garden": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in garden.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "music": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in music.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "camera": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in camera.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "sofa": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in sofa.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "wagon": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in wagon.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "doctor": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say doctor slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "teacher": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say teacher slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "together": {
    "definition": "In one group; not apart.",
    "sentence": "We worked together and finished fast on the playground.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "today": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say today slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "tomorrow": {
    "definition": "The day after today.",
    "sentence": "Tomorrow, A disco frog will bring a joke book in the kitchen.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "pajamas": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say pajamas slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "chocolate": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "We heard a soft vowel sound in chocolate.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "celebrate": {
    "definition": "A word that often has an unstressed vowel sound (schwa).",
    "sentence": "Say celebrate slowly and listen for the schwa sound.",
    "focus": [
      "schwa"
    ],
    "tags": [
      "focus:schwa",
      "pattern:schwa",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "temperature": {
    "definition": "How hot or cold something is.",
    "sentence": "The temperature dropped, so My friend wore a jacket at the park.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "conversation": {
    "definition": "A talk between people.",
    "sentence": "We had a conversation, and A disco frog kept giggling at the park.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "information": {
    "definition": "Facts or details you learn.",
    "sentence": "The information helped The penguin solve the mystery on the playground.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "education": {
    "definition": "Learning and teaching.",
    "sentence": "A disco frog said education is like a brain workout on the playground.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "communication": {
    "definition": "Sharing ideas with words or signals.",
    "sentence": "Good communication helped our team work together at the park.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "collection": {
    "definition": "A group of things gathered.",
    "sentence": "A robot has a collection of funny stickers at the park.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "discovery": {
    "definition": "Finding something new.",
    "sentence": "Our discovery made The wizard cat shout, “No way!” in the library.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "photograph": {
    "definition": "A picture taken with a camera.",
    "sentence": "A disco frog took a photograph of a flying sandwich on the playground.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "butterfly": {
    "definition": "An insect with colorful wings.",
    "sentence": "A butterfly landed on My friend's nose at the park.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "celebration": {
    "definition": "A special party or event.",
    "sentence": "The celebration included dancing and silly hats in the kitchen.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "organization": {
    "definition": "A group, or the way things are arranged.",
    "sentence": "Our organization plan kept the desk from exploding at school.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "responsible": {
    "definition": "Doing what you should do.",
    "sentence": "The wizard cat was responsible and returned the lost pencil in the kitchen.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "impossible": {
    "definition": "Not able to happen.",
    "sentence": "It seemed impossible to carry ten books at once in the hallway.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "comfortable": {
    "definition": "Cozy and not painful.",
    "sentence": "My friend found a comfortable chair and refused to move in the library.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "curiosity": {
    "definition": "A strong desire to know more.",
    "sentence": "Curiosity made A raccoon peek into the mystery box in my backpack.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "imagination": {
    "definition": "The ability to make pictures in your mind.",
    "sentence": "Imagination turned the hallway into a jungle in the kitchen.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "electricity": {
    "definition": "Energy that powers lights and devices.",
    "sentence": "Electricity made the lamp glow like a tiny sun in my backpack.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "community": {
    "definition": "People who live or work together.",
    "sentence": "Our community helped clean up the park on the playground.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "invention": {
    "definition": "Something new that someone created.",
    "sentence": "The invention was a spoon that can also be a fork at school.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "important": {
    "definition": "Very meaningful or needed.",
    "sentence": "It is important to be kind, even when A raccoon is grumpy in the hallway.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "wonderful": {
    "definition": "Very good or amazing.",
    "sentence": "The wonderful surprise was a note that said “You rock!” in the kitchen.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "favorite": {
    "definition": "The one you like best.",
    "sentence": "The penguin said the favorite snack is crunchy apples in my backpack.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "yesterday": {
    "definition": "The day before today.",
    "sentence": "Yesterday, A raccoon tried to teach a dog to read in the library.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "fantastic": {
    "definition": "Really great.",
    "sentence": "The fantastic plan involved glitter and a cape in the library.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "adventure": {
    "definition": "A fun, exciting experience.",
    "sentence": "The adventure started when The llama found a secret door in the hallway.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "remember": {
    "definition": "To keep something in your mind.",
    "sentence": "Remember to zip your backpack, said A raccoon on the playground.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "magazine": {
    "definition": "A booklet with articles and pictures.",
    "sentence": "A robot read a magazine about space tacos in my backpack.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "computer": {
    "definition": "A machine that runs programs.",
    "sentence": "The computer froze right when The wizard cat clicked “save” in my backpack.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "vacation": {
    "definition": "Time off for rest and fun.",
    "sentence": "On vacation, A disco frog tried to surf on a pillow at the park.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "library": {
    "definition": "A place to borrow books.",
    "sentence": "At the library, My teacher whispered like a ninja on the playground.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "question": {
    "definition": "Something you ask to learn.",
    "sentence": "A raccoon asked a question that made everyone think at the park.",
    "focus": [
      "multisyllable"
    ],
    "tags": [
      "focus:multisyllable",
      "pattern:multisyllable",
      "wtw:syllables-affixes"
    ],
    "seasonal": []
  },
  "snowman": {
    "definition": "A person made of snow.",
    "sentence": "The snowman wore sunglasses like a movie star.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "dec",
      "jan"
    ]
  },
  "pumpkin": {
    "definition": "A round orange squash.",
    "sentence": "The pumpkin looked like it was smiling on the porch.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "oct",
      "nov"
    ]
  },
  "backpack": {
    "definition": "A bag you wear on your back.",
    "sentence": "My backpack secretly eats pencils at school.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "aug",
      "sep"
    ]
  },
  "fireworks": {
    "definition": "Bright lights that boom in the sky.",
    "sentence": "Fireworks popped like giant glitter in the night.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "jul"
    ]
  },
  "raincoat": {
    "definition": "A coat for rainy weather.",
    "sentence": "My raincoat made me feel unstoppable in the rain.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "mar",
      "apr"
    ]
  },
  "sunhat": {
    "definition": "A hat that blocks the sun.",
    "sentence": "My sunhat tried to fly away at the park.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "jun",
      "jul",
      "aug"
    ]
  },
  "leaf": {
    "definition": "A flat part of a plant.",
    "sentence": "The leaf did a twirl in the wind.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "oct",
      "nov"
    ]
  },
  "lantern": {
    "definition": "A light you carry.",
    "sentence": "The lantern glowed like a tiny moon.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "oct"
    ]
  },
  "picnic": {
    "definition": "A meal outside.",
    "sentence": "The ants planned the picnic first.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "may",
      "jun"
    ]
  },
  "scarf": {
    "definition": "A cloth for your neck.",
    "sentence": "My scarf tried to become a snake.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "dec",
      "jan"
    ]
  },
  "sunrise": {
    "definition": "When the sun comes up.",
    "sentence": "The sunrise painted the sky orange and pink.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "jan",
      "feb"
    ]
  },
  "sprout": {
    "definition": "A tiny new plant.",
    "sentence": "A sprout popped up like a surprise.",
    "focus": [
      "seasonal"
    ],
    "tags": [
      "focus:seasonal",
      "pattern:seasonal",
      "wtw:within-word"
    ],
    "seasonal": [
      "mar",
      "apr"
    ]
  }
};

  const FOCUS_OPTIONS = [
  {
    "value": "none",
    "label": "Mixed Review",
    "defaultLen": 5,
    "examples": [
      "bad",
      "bag"
    ]
  },
  {
    "value": "cvc",
    "label": "CVC (Short Vowels)",
    "defaultLen": 3,
    "examples": [
      "bad",
      "bag"
    ]
  },
  {
    "value": "blends",
    "label": "Blends",
    "defaultLen": 4,
    "examples": [
      "brag",
      "bran"
    ]
  },
  {
    "value": "digraphs",
    "label": "Digraphs (sh, ch, th, wh, ck)",
    "defaultLen": 4,
    "examples": [
      "back",
      "bash"
    ]
  },
  {
    "value": "vce",
    "label": "Magic E (VCe)",
    "defaultLen": 4,
    "examples": [
      "use",
      "bake"
    ]
  },
  {
    "value": "vowelTeams",
    "label": "Vowel Teams / Diphthongs",
    "defaultLen": 4,
    "examples": [
      "boy",
      "day"
    ]
  },
  {
    "value": "rControlled",
    "label": "R-Controlled (Bossy R)",
    "defaultLen": 4,
    "examples": [
      "car",
      "fur"
    ]
  },
  {
    "value": "heart",
    "label": "Heart / Irregular Words",
    "defaultLen": 4,
    "examples": [
      "do",
      "of"
    ]
  },
  {
    "value": "morphology",
    "label": "Morphology (Prefixes/Suffixes)",
    "defaultLen": 6,
    "examples": [
      "redo",
      "fixed"
    ]
  },
  {
    "value": "schwa",
    "label": "Schwa",
    "defaultLen": 6,
    "examples": [
      "sofa",
      "about"
    ]
  },
  {
    "value": "multisyllable",
    "label": "Multisyllable",
    "defaultLen": 8,
    "examples": [
      "library",
      "computer"
    ]
  },
  {
    "value": "seasonal",
    "label": "Seasonal (Occasional)",
    "defaultLen": 7,
    "examples": [
      "leaf",
      "sled"
    ]
  }
];

  const FOCUS_REMINDERS = {
  "cvc": "Short vowel, closed syllables (cat, sun).",
  "blends": "Blend the first sounds smoothly (clap, frog).",
  "digraphs": "Two letters, one sound (sh, ch, th, wh, ck).",
  "vce": "Silent E makes the vowel say its name (cake, bike).",
  "vowelTeams": "Two vowels can team up (rain, boat) or glide (oi, ou).",
  "rControlled": "R changes the vowel sound (star, bird).",
  "heart": "Some parts you must know by heart (said, have).",
  "morphology": "Prefixes/suffixes change meaning (un-, re-, -ing).",
  "schwa": "Unstressed vowels can sound like /uh/ (ba-NA-na).",
  "multisyllable": "Chunk the word by syllables.",
  "seasonal": "A few themed words appear sometimes."
};

  const FUN_CONTENT = [
  "Joke: Why did the student bring a ladder to school? To go to high school.",
  "Joke: What do you call a bear with no teeth? A gummy bear.",
  "Joke: Why did the math book look sad? It had too many problems.",
  "Joke: Why did the bicycle fall over? It was two-tired.",
  "Joke: What do you call cheese that isn’t yours? Nacho cheese.",
  "Joke: What do you call a sleeping dinosaur? A dino-snore.",
  "Joke: Why did the cookie go to the nurse? It felt crummy.",
  "Joke: What did one wall say to the other wall? I’ll meet you at the corner.",
  "Joke: What did the ocean say to the beach? Nothing—it just waved.",
  "Joke: Why don’t eggs tell jokes? They’d crack up.",
  "Joke: What do you call a pile of cats? A meow-ntain.",
  "Joke: What’s a robot’s favorite snack? Computer chips.",
  "Joke: Why did the scarecrow get a prize? Outstanding in his field.",
  "Fact: Octopuses have three hearts.",
  "Fact: Honey never spoils.",
  "Fact: A group of flamingos is called a flamboyance.",
  "Fact: Butterflies taste with their feet.",
  "Fact: Sharks have been around longer than trees.",
  "Fact: Koalas have fingerprints like humans.",
  "Fact: Wombat poop is cube-shaped.",
  "Fact: Penguins propose with pebbles.",
  "Fact: Bees can recognize human faces.",
  "Fact: Rain has a smell called petrichor.",
  "Silly: A pink elephant tried to sit in a tiny pool.",
  "Silly: The dog sat on the cat and apologized politely.",
  "Silly: My shoe asked for a nap after PE.",
  "Silly: The sandwich ran away before lunch.",
  "Silly: The toaster looked like it was judging my bread.",
  "Silly: A banana wore pajamas and called it fashion.",
  "Silly: My backpack is suspiciously good at hiding pencils.",
  "Silly: The cloud looked like a fluffy sheep doing yoga.",
  "Silly: My friend blinked in the hallway and everyone smiled.",
  "Silly: A robot whispered in the kitchen and everyone smiled.",
  "Silly: My friend paused in my backpack and everyone smiled.",
  "Silly: A robot laughed on the playground and everyone smiled.",
  "Silly: A raccoon cheered in my backpack and everyone smiled.",
  "Silly: The penguin danced in the library and everyone smiled.",
  "Silly: My teacher blinked in the hallway and everyone smiled.",
  "Silly: The wizard cat smiled in the library and everyone smiled.",
  "Silly: The llama smiled in my backpack and everyone smiled.",
  "Silly: My teacher cheered in the hallway and everyone smiled.",
  "Silly: The llama danced in the library and everyone smiled.",
  "Silly: The llama tiptoed at school and everyone smiled.",
  "Silly: A robot danced in the hallway and everyone smiled.",
  "Silly: The llama paused in the kitchen and everyone smiled.",
  "Silly: The wizard cat paused at the park and everyone smiled.",
  "Silly: The llama whispered in my backpack and everyone smiled.",
  "Silly: The penguin tiptoed in the kitchen and everyone smiled.",
  "Silly: A robot danced in my backpack and everyone smiled.",
  "Silly: My friend paused in the hallway and everyone smiled.",
  "Silly: The wizard cat laughed at school and everyone smiled.",
  "Silly: The penguin laughed at the park and everyone smiled.",
  "Silly: A raccoon whispered in the kitchen and everyone smiled.",
  "Silly: The wizard cat danced at the park and everyone smiled.",
  "Silly: The wizard cat tiptoed in the hallway and everyone smiled.",
  "Silly: A disco frog tiptoed in my backpack and everyone smiled.",
  "Silly: My teacher blinked on the playground and everyone smiled.",
  "Silly: My friend tiptoed in the kitchen and everyone smiled.",
  "Silly: The wizard cat smiled at the park and everyone smiled.",
  "Silly: A robot danced at the park and everyone smiled.",
  "Silly: My teacher laughed at the park and everyone smiled.",
  "Silly: My teacher paused in the library and everyone smiled.",
  "Silly: A disco frog cheered in the kitchen and everyone smiled.",
  "Silly: My teacher tiptoed at school and everyone smiled.",
  "Silly: My teacher smiled in my backpack and everyone smiled.",
  "Silly: A robot danced on the playground and everyone smiled.",
  "Silly: A raccoon cheered in the kitchen and everyone smiled.",
  "Silly: A raccoon blinked at school and everyone smiled.",
  "Silly: The wizard cat tiptoed in my backpack and everyone smiled.",
  "Silly: The penguin smiled in the kitchen and everyone smiled.",
  "Silly: A robot danced in the kitchen and everyone smiled.",
  "Silly: A raccoon paused on the playground and everyone smiled.",
  "Silly: A disco frog tiptoed at the park and everyone smiled.",
  "Silly: A robot whispered at school and everyone smiled.",
  "Silly: A raccoon tiptoed in the hallway and everyone smiled.",
  "Silly: My friend cheered at school and everyone smiled.",
  "Silly: My teacher paused in my backpack and everyone smiled.",
  "Silly: The wizard cat laughed in my backpack and everyone smiled.",
  "Silly: The llama whispered on the playground and everyone smiled.",
  "Silly: The penguin danced on the playground and everyone smiled.",
  "Silly: A disco frog smiled in the kitchen and everyone smiled.",
  "Silly: My friend cheered at the park and everyone smiled.",
  "Silly: A raccoon whispered at the park and everyone smiled.",
  "Silly: The penguin tiptoed in the library and everyone smiled.",
  "Silly: A robot paused in the hallway and everyone smiled.",
  "Silly: A robot paused in my backpack and everyone smiled.",
  "Silly: A raccoon danced in my backpack and everyone smiled.",
  "Silly: A robot laughed at the park and everyone smiled.",
  "Silly: A robot cheered at school and everyone smiled.",
  "Silly: The wizard cat whispered in my backpack and everyone smiled.",
  "Silly: The llama laughed at school and everyone smiled.",
  "Silly: My teacher cheered at school and everyone smiled.",
  "Silly: A raccoon smiled on the playground and everyone smiled.",
  "Silly: The llama laughed on the playground and everyone smiled.",
  "Silly: A raccoon smiled in the library and everyone smiled.",
  "Silly: The llama smiled in the library and everyone smiled.",
  "Silly: The wizard cat smiled in my backpack and everyone smiled.",
  "Silly: The penguin cheered at the park and everyone smiled.",
  "Silly: The wizard cat whispered in the hallway and everyone smiled.",
  "Silly: My teacher tiptoed on the playground and everyone smiled.",
  "Silly: A robot cheered in the hallway and everyone smiled.",
  "Silly: A disco frog paused at school and everyone smiled.",
  "Silly: My friend tiptoed at school and everyone smiled.",
  "Silly: The wizard cat cheered in the hallway and everyone smiled.",
  "Silly: My friend paused on the playground and everyone smiled.",
  "Silly: A robot paused in the library and everyone smiled.",
  "Silly: The wizard cat cheered in my backpack and everyone smiled.",
  "Silly: My friend paused at the park and everyone smiled.",
  "Silly: The penguin laughed on the playground and everyone smiled.",
  "Silly: A robot smiled at school and everyone smiled.",
  "Silly: A disco frog danced in my backpack and everyone smiled.",
  "Silly: The llama blinked in the kitchen and everyone smiled.",
  "Silly: A robot whispered in the library and everyone smiled.",
  "Silly: The llama cheered in my backpack and everyone smiled.",
  "Silly: My friend tiptoed on the playground and everyone smiled.",
  "Silly: My friend paused at school and everyone smiled.",
  "Silly: A robot tiptoed at the park and everyone smiled.",
  "Silly: My friend blinked at school and everyone smiled.",
  "Silly: A disco frog smiled at school and everyone smiled.",
  "Silly: A disco frog laughed in the library and everyone smiled.",
  "Silly: A disco frog blinked in my backpack and everyone smiled.",
  "Silly: The penguin cheered at school and everyone smiled.",
  "Silly: A robot cheered in my backpack and everyone smiled.",
  "Silly: My friend tiptoed at the park and everyone smiled.",
  "Silly: The penguin blinked in the library and everyone smiled.",
  "Silly: The llama blinked in my backpack and everyone smiled.",
  "Silly: My friend cheered in the hallway and everyone smiled.",
  "Silly: A raccoon cheered at school and everyone smiled.",
  "Silly: The llama danced on the playground and everyone smiled.",
  "Silly: The llama laughed in my backpack and everyone smiled.",
  "Silly: A disco frog cheered in my backpack and everyone smiled.",
  "Silly: A disco frog smiled in the hallway and everyone smiled.",
  "Silly: The wizard cat whispered at school and everyone smiled.",
  "Silly: My teacher paused on the playground and everyone smiled.",
  "Silly: The penguin paused on the playground and everyone smiled.",
  "Silly: The llama tiptoed on the playground and everyone smiled.",
  "Silly: The penguin blinked at the park and everyone smiled.",
  "Silly: My teacher smiled in the library and everyone smiled.",
  "Silly: The llama smiled at school and everyone smiled.",
  "Silly: A raccoon cheered on the playground and everyone smiled.",
  "Silly: A raccoon danced at school and everyone smiled.",
  "Silly: A raccoon laughed in my backpack and everyone smiled.",
  "Silly: The wizard cat paused on the playground and everyone smiled.",
  "Silly: My friend laughed on the playground and everyone smiled.",
  "Silly: A disco frog tiptoed in the library and everyone smiled.",
  "Silly: The wizard cat blinked on the playground and everyone smiled.",
  "Silly: The wizard cat laughed in the hallway and everyone smiled.",
  "Silly: A disco frog whispered in the kitchen and everyone smiled.",
  "Silly: A raccoon blinked at the park and everyone smiled.",
  "Silly: A raccoon danced in the kitchen and everyone smiled.",
  "Silly: The wizard cat blinked at the park and everyone smiled.",
  "Silly: A disco frog danced in the library and everyone smiled.",
  "Silly: A raccoon smiled in the kitchen and everyone smiled.",
  "Silly: The llama danced in the kitchen and everyone smiled.",
  "Silly: My teacher smiled in the kitchen and everyone smiled.",
  "Silly: A robot smiled in the hallway and everyone smiled.",
  "Silly: A disco frog danced in the hallway and everyone smiled.",
  "Silly: The llama whispered at school and everyone smiled.",
  "Silly: A raccoon smiled in my backpack and everyone smiled.",
  "Silly: The wizard cat blinked in my backpack and everyone smiled.",
  "Silly: The llama danced in the hallway and everyone smiled.",
  "Silly: A raccoon danced at the park and everyone smiled.",
  "Silly: My friend laughed in the hallway and everyone smiled.",
  "Silly: A disco frog cheered at school and everyone smiled.",
  "Silly: My teacher whispered at the park and everyone smiled.",
  "Silly: My friend laughed at the park and everyone smiled.",
  "Silly: My friend whispered in the hallway and everyone smiled.",
  "Silly: My friend danced at the park and everyone smiled.",
  "Silly: The wizard cat blinked in the kitchen and everyone smiled.",
  "Silly: The penguin danced at the park and everyone smiled.",
  "Silly: My friend laughed in the kitchen and everyone smiled.",
  "Silly: A disco frog whispered on the playground and everyone smiled.",
  "Silly: A disco frog cheered in the hallway and everyone smiled.",
  "Silly: My teacher danced at school and everyone smiled.",
  "Silly: The llama blinked on the playground and everyone smiled.",
  "Silly: A robot whispered in the hallway and everyone smiled.",
  "Silly: My friend tiptoed in my backpack and everyone smiled.",
  "Silly: The wizard cat laughed in the library and everyone smiled.",
  "Silly: The llama blinked at the park and everyone smiled.",
  "Silly: The wizard cat smiled in the hallway and everyone smiled.",
  "Silly: A robot smiled in my backpack and everyone smiled.",
  "Silly: My teacher tiptoed in the kitchen and everyone smiled.",
  "Silly: A raccoon whispered at school and everyone smiled.",
  "Silly: The wizard cat cheered at school and everyone smiled.",
  "Silly: A raccoon laughed at school and everyone smiled.",
  "Silly: The penguin smiled in my backpack and everyone smiled.",
  "Silly: A raccoon smiled in the hallway and everyone smiled.",
  "Silly: A raccoon tiptoed in the kitchen and everyone smiled.",
  "Silly: A robot danced at school and everyone smiled.",
  "Silly: The penguin danced in the kitchen and everyone smiled.",
  "Silly: A robot cheered at the park and everyone smiled.",
  "Silly: A disco frog cheered at the park and everyone smiled.",
  "Silly: The llama whispered at the park and everyone smiled.",
  "Silly: A raccoon paused at school and everyone smiled.",
  "Silly: The llama danced in my backpack and everyone smiled.",
  "Silly: A robot danced in the library and everyone smiled.",
  "Silly: A disco frog tiptoed in the hallway and everyone smiled.",
  "Silly: My teacher tiptoed in my backpack and everyone smiled.",
  "Silly: My friend blinked at the park and everyone smiled.",
  "Silly: A disco frog paused on the playground and everyone smiled.",
  "Silly: The penguin tiptoed in the hallway and everyone smiled.",
  "Silly: A disco frog laughed at the park and everyone smiled.",
  "Silly: The wizard cat tiptoed at the park and everyone smiled.",
  "Silly: A raccoon cheered in the hallway and everyone smiled.",
  "Silly: A robot blinked at school and everyone smiled.",
  "Silly: A raccoon paused in the library and everyone smiled.",
  "Silly: The penguin paused in the library and everyone smiled."
];

  const ANSWER_POOLS = {
  "none": [
    "cat",
    "bat",
    "hat",
    "rat",
    "mat",
    "cap",
    "map",
    "tap",
    "lap",
    "nap",
    "fan",
    "van",
    "man",
    "pan",
    "jam",
    "ham",
    "bag",
    "rag",
    "tag",
    "can",
    "tan",
    "cab",
    "tab",
    "bed",
    "red",
    "net",
    "pet",
    "pen",
    "hen",
    "jet",
    "vet",
    "web",
    "leg",
    "ten",
    "den",
    "pig",
    "wig",
    "lid",
    "kid",
    "fin",
    "pin",
    "bin",
    "lip",
    "sip",
    "tip",
    "kit",
    "rib",
    "fig",
    "dog",
    "hog",
    "log",
    "fox",
    "box",
    "mop",
    "top",
    "pot",
    "cot",
    "rod",
    "job",
    "sun",
    "bug",
    "mug",
    "cup",
    "pup",
    "rug",
    "mud",
    "nut",
    "bus",
    "gum",
    "hut",
    "tub",
    "run",
    "hop",
    "dig",
    "hug",
    "cut",
    "mix",
    "fit",
    "sit",
    "hit",
    "rip",
    "zap",
    "grab",
    "sad",
    "mad",
    "bad",
    "fat",
    "big",
    "hot",
    "wet",
    "flag",
    "flap",
    "flip",
    "flop",
    "frog",
    "from",
    "fresh",
    "flash",
    "fling",
    "clap",
    "clip",
    "clog",
    "clam",
    "cliff",
    "clock",
    "clump",
    "clash",
    "brag",
    "bran",
    "brim",
    "brick",
    "brisk",
    "brown",
    "brush",
    "crab",
    "crib",
    "crop",
    "crisp",
    "crust",
    "crack",
    "cream",
    "crowd",
    "drip",
    "drop",
    "drag",
    "drum",
    "dress",
    "drive",
    "grin",
    "grid",
    "grip",
    "grass",
    "green",
    "grape",
    "plan",
    "plug",
    "plot",
    "plum",
    "plus",
    "plate",
    "slam",
    "slip",
    "slim",
    "sled",
    "slot",
    "slush",
    "spin",
    "spot",
    "stop",
    "step",
    "stub",
    "stamp",
    "stick",
    "trip",
    "trap",
    "trim",
    "twin",
    "twist",
    "twelve",
    "smile",
    "smog",
    "smash",
    "snip",
    "snap",
    "snack",
    "skit",
    "skip",
    "scan",
    "scam",
    "swim",
    "swell",
    "swift",
    "ship",
    "shop",
    "shut",
    "shed",
    "shin",
    "dish",
    "fish",
    "wish",
    "rush",
    "cash",
    "mash",
    "dash",
    "bash",
    "shell",
    "shack",
    "shock",
    "shave",
    "chip",
    "chin",
    "chat",
    "chop",
    "chill",
    "check",
    "chess",
    "chest",
    "bench",
    "pinch",
    "lunch",
    "much",
    "rich",
    "such",
    "thin",
    "this",
    "that",
    "with",
    "math",
    "bath",
    "path",
    "moth",
    "thick",
    "thumb",
    "thump",
    "third",
    "when",
    "what",
    "whip",
    "whiz",
    "whale",
    "wheel",
    "duck",
    "pack",
    "sock",
    "rock",
    "back",
    "neck",
    "tick",
    "tack",
    "lock",
    "stack",
    "stuck",
    "cake",
    "bake",
    "make",
    "take",
    "late",
    "mate",
    "date",
    "gate",
    "game",
    "name",
    "same",
    "safe",
    "case",
    "bike",
    "like",
    "hike",
    "ride",
    "side",
    "time",
    "line",
    "fine",
    "mine",
    "hide",
    "wide",
    "five",
    "home",
    "bone",
    "cone",
    "note",
    "rose",
    "nose",
    "hope",
    "rope",
    "hole",
    "code",
    "joke",
    "cube",
    "tube",
    "tune",
    "mule",
    "cute",
    "rule",
    "use",
    "snake",
    "plane",
    "shine",
    "white",
    "slide",
    "prize",
    "brave",
    "rain",
    "train",
    "pain",
    "mail",
    "tail",
    "wait",
    "play",
    "stay",
    "tray",
    "day",
    "boat",
    "coat",
    "goat",
    "road",
    "toad",
    "soap",
    "toast",
    "float",
    "moan",
    "seed",
    "need",
    "seen",
    "feet",
    "meet",
    "tree",
    "free",
    "sleep",
    "keep",
    "sea",
    "team",
    "seat",
    "heat",
    "beach",
    "peach",
    "reach",
    "teach",
    "moon",
    "food",
    "room",
    "soon",
    "cool",
    "pool",
    "spoon",
    "shoot",
    "stoop",
    "coin",
    "join",
    "boil",
    "foil",
    "soil",
    "toy",
    "boy",
    "joy",
    "point",
    "voice",
    "shout",
    "cloud",
    "round",
    "sound",
    "found",
    "town",
    "loud",
    "proud",
    "clown",
    "car",
    "star",
    "farm",
    "park",
    "dark",
    "shark",
    "march",
    "spark",
    "start",
    "bird",
    "girl",
    "first",
    "shirt",
    "stir",
    "whirl",
    "corn",
    "fork",
    "storm",
    "short",
    "sport",
    "thorn",
    "north",
    "turn",
    "hurt",
    "fur",
    "burst",
    "curl",
    "purr",
    "surf",
    "her",
    "fern",
    "term",
    "verb",
    "perch",
    "serve",
    "work",
    "word",
    "worm",
    "world",
    "said",
    "was",
    "were",
    "have",
    "give",
    "done",
    "come",
    "some",
    "one",
    "two",
    "once",
    "love",
    "they",
    "their",
    "there",
    "where",
    "here",
    "these",
    "those",
    "does",
    "do",
    "to",
    "of",
    "you",
    "your",
    "could",
    "would",
    "should",
    "laugh",
    "enough",
    "again",
    "friend",
    "because",
    "thought",
    "through",
    "though",
    "people",
    "sure",
    "been",
    "busy",
    "pretty",
    "every",
    "unhappy",
    "unsafe",
    "unfair",
    "unlock",
    "untie",
    "unable",
    "replay",
    "redo",
    "refill",
    "repack",
    "repaint",
    "recheck",
    "misplace",
    "misread",
    "mistake",
    "careless",
    "fearless",
    "helpful",
    "playful",
    "thankful",
    "hopeful",
    "joyful",
    "quickly",
    "slowly",
    "kindly",
    "running",
    "hopping",
    "stopping",
    "clapping",
    "skipping",
    "slamming",
    "played",
    "jumped",
    "helped",
    "fixed",
    "closed",
    "opened",
    "biggest",
    "fastest",
    "smallest",
    "happier",
    "funnier",
    "sadness",
    "kindness",
    "darkness",
    "helpfulness",
    "banana",
    "pencil",
    "animal",
    "family",
    "problem",
    "robot",
    "button",
    "lemon",
    "pilot",
    "salad",
    "about",
    "above",
    "around",
    "paper",
    "garden",
    "music",
    "camera",
    "sofa",
    "wagon",
    "doctor",
    "teacher",
    "together",
    "today",
    "tomorrow",
    "pajamas",
    "chocolate",
    "celebrate",
    "temperature",
    "conversation",
    "information",
    "education",
    "communication",
    "collection",
    "discovery",
    "photograph",
    "butterfly",
    "celebration",
    "organization",
    "responsible",
    "impossible",
    "comfortable",
    "curiosity",
    "imagination",
    "electricity",
    "community",
    "invention",
    "important",
    "wonderful",
    "favorite",
    "yesterday",
    "fantastic",
    "adventure",
    "remember",
    "magazine",
    "computer",
    "vacation",
    "library",
    "question",
    "snowman",
    "pumpkin",
    "backpack",
    "fireworks",
    "raincoat",
    "sunhat",
    "leaf",
    "lantern",
    "picnic",
    "scarf",
    "sunrise",
    "sprout"
  ],
  "cvc": [
    "cat",
    "bat",
    "hat",
    "rat",
    "mat",
    "cap",
    "map",
    "tap",
    "lap",
    "nap",
    "fan",
    "van",
    "man",
    "pan",
    "jam",
    "ham",
    "bag",
    "rag",
    "tag",
    "can",
    "tan",
    "cab",
    "tab",
    "bed",
    "red",
    "net",
    "pet",
    "pen",
    "hen",
    "jet",
    "vet",
    "web",
    "leg",
    "ten",
    "den",
    "pig",
    "wig",
    "lid",
    "kid",
    "fin",
    "pin",
    "bin",
    "lip",
    "sip",
    "tip",
    "kit",
    "rib",
    "fig",
    "dog",
    "hog",
    "log",
    "fox",
    "box",
    "mop",
    "top",
    "pot",
    "cot",
    "rod",
    "job",
    "sun",
    "bug",
    "mug",
    "cup",
    "pup",
    "rug",
    "mud",
    "nut",
    "bus",
    "gum",
    "hut",
    "tub",
    "run",
    "hop",
    "dig",
    "hug",
    "cut",
    "mix",
    "fit",
    "sit",
    "hit",
    "rip",
    "zap",
    "grab",
    "sad",
    "mad",
    "bad",
    "fat",
    "big",
    "hot",
    "wet"
  ],
  "blends": [
    "grab",
    "flag",
    "flap",
    "flip",
    "flop",
    "frog",
    "from",
    "fresh",
    "flash",
    "fling",
    "clap",
    "clip",
    "clog",
    "clam",
    "cliff",
    "clock",
    "clump",
    "clash",
    "brag",
    "bran",
    "brim",
    "brick",
    "brisk",
    "brown",
    "brush",
    "crab",
    "crib",
    "crop",
    "crisp",
    "crust",
    "crack",
    "cream",
    "crowd",
    "drip",
    "drop",
    "drag",
    "drum",
    "dress",
    "drive",
    "grin",
    "grid",
    "grip",
    "grass",
    "green",
    "grape",
    "plan",
    "plug",
    "plot",
    "plum",
    "plus",
    "plate",
    "slam",
    "slip",
    "slim",
    "sled",
    "slot",
    "slush",
    "spin",
    "spot",
    "stop",
    "step",
    "stub",
    "stamp",
    "stick",
    "trip",
    "trap",
    "trim",
    "twin",
    "twist",
    "twelve",
    "smile",
    "smog",
    "smash",
    "snip",
    "snap",
    "snack",
    "skit",
    "skip",
    "scan",
    "scam",
    "swim",
    "swell",
    "swift"
  ],
  "digraphs": [
    "clock",
    "snack",
    "ship",
    "shop",
    "shut",
    "shed",
    "shin",
    "dish",
    "fish",
    "wish",
    "rush",
    "cash",
    "mash",
    "dash",
    "bash",
    "shell",
    "shack",
    "shock",
    "shave",
    "chip",
    "chin",
    "chat",
    "chop",
    "chill",
    "check",
    "chess",
    "chest",
    "bench",
    "pinch",
    "lunch",
    "much",
    "rich",
    "such",
    "thin",
    "this",
    "that",
    "with",
    "math",
    "bath",
    "path",
    "moth",
    "thick",
    "thumb",
    "thump",
    "third",
    "when",
    "what",
    "whip",
    "whiz",
    "whale",
    "wheel",
    "duck",
    "pack",
    "sock",
    "rock",
    "back",
    "neck",
    "tick",
    "tack",
    "lock",
    "stack",
    "stuck"
  ],
  "vce": [
    "grape",
    "smile",
    "cake",
    "bake",
    "make",
    "take",
    "late",
    "mate",
    "date",
    "gate",
    "game",
    "name",
    "same",
    "safe",
    "case",
    "bike",
    "like",
    "hike",
    "ride",
    "side",
    "time",
    "line",
    "fine",
    "mine",
    "hide",
    "wide",
    "five",
    "home",
    "bone",
    "cone",
    "note",
    "rose",
    "nose",
    "hope",
    "rope",
    "hole",
    "code",
    "joke",
    "cube",
    "tube",
    "tune",
    "mule",
    "cute",
    "rule",
    "use",
    "snake",
    "plane",
    "shine",
    "white",
    "slide",
    "prize",
    "brave"
  ],
  "vowelTeams": [
    "brown",
    "crowd",
    "green",
    "rain",
    "train",
    "pain",
    "mail",
    "tail",
    "wait",
    "play",
    "stay",
    "tray",
    "day",
    "boat",
    "coat",
    "goat",
    "road",
    "toad",
    "soap",
    "toast",
    "float",
    "moan",
    "seed",
    "need",
    "seen",
    "feet",
    "meet",
    "tree",
    "free",
    "sleep",
    "keep",
    "sea",
    "team",
    "seat",
    "heat",
    "beach",
    "peach",
    "reach",
    "teach",
    "moon",
    "food",
    "room",
    "soon",
    "cool",
    "pool",
    "spoon",
    "shoot",
    "stoop",
    "coin",
    "join",
    "boil",
    "foil",
    "soil",
    "toy",
    "boy",
    "joy",
    "point",
    "voice",
    "shout",
    "cloud",
    "round",
    "sound",
    "found",
    "town",
    "loud",
    "proud",
    "clown"
  ],
  "rControlled": [
    "third",
    "car",
    "star",
    "farm",
    "park",
    "dark",
    "shark",
    "march",
    "spark",
    "start",
    "bird",
    "girl",
    "first",
    "shirt",
    "stir",
    "whirl",
    "corn",
    "fork",
    "storm",
    "short",
    "sport",
    "thorn",
    "north",
    "turn",
    "hurt",
    "fur",
    "burst",
    "curl",
    "purr",
    "surf",
    "her",
    "fern",
    "term",
    "verb",
    "perch",
    "serve",
    "work",
    "word",
    "worm",
    "world"
  ],
  "heart": [
    "said",
    "was",
    "were",
    "have",
    "give",
    "done",
    "come",
    "some",
    "one",
    "two",
    "once",
    "love",
    "they",
    "their",
    "there",
    "where",
    "here",
    "these",
    "those",
    "does",
    "do",
    "to",
    "of",
    "you",
    "your",
    "could",
    "would",
    "should",
    "laugh",
    "enough",
    "again",
    "friend",
    "because",
    "thought",
    "through",
    "though",
    "people",
    "sure",
    "been",
    "busy",
    "pretty",
    "every"
  ],
  "morphology": [
    "unhappy",
    "unsafe",
    "unfair",
    "unlock",
    "untie",
    "unable",
    "replay",
    "redo",
    "refill",
    "repack",
    "repaint",
    "recheck",
    "misplace",
    "misread",
    "mistake",
    "careless",
    "fearless",
    "helpful",
    "playful",
    "thankful",
    "hopeful",
    "joyful",
    "quickly",
    "slowly",
    "kindly",
    "running",
    "hopping",
    "stopping",
    "clapping",
    "skipping",
    "slamming",
    "played",
    "jumped",
    "helped",
    "fixed",
    "closed",
    "opened",
    "biggest",
    "fastest",
    "smallest",
    "happier",
    "funnier",
    "sadness",
    "kindness",
    "darkness",
    "helpfulness"
  ],
  "schwa": [
    "again",
    "banana",
    "pencil",
    "animal",
    "family",
    "problem",
    "robot",
    "button",
    "lemon",
    "pilot",
    "salad",
    "about",
    "above",
    "around",
    "paper",
    "garden",
    "music",
    "camera",
    "sofa",
    "wagon",
    "doctor",
    "teacher",
    "today",
    "pajamas",
    "chocolate",
    "celebrate"
  ],
  "multisyllable": [
    "together",
    "tomorrow",
    "temperature",
    "conversation",
    "information",
    "education",
    "communication",
    "collection",
    "discovery",
    "photograph",
    "butterfly",
    "celebration",
    "organization",
    "responsible",
    "impossible",
    "comfortable",
    "curiosity",
    "imagination",
    "electricity",
    "community",
    "invention",
    "important",
    "wonderful",
    "favorite",
    "yesterday",
    "fantastic",
    "adventure",
    "remember",
    "magazine",
    "computer",
    "vacation",
    "library",
    "question"
  ],
  "seasonal": [
    "sled",
    "snowman",
    "pumpkin",
    "backpack",
    "fireworks",
    "raincoat",
    "sunhat",
    "leaf",
    "lantern",
    "picnic",
    "scarf",
    "sunrise",
    "sprout"
  ]
};

  window.PHONICS_DATA = {
    WORD_ENTRIES,
    ANSWER_POOLS,
    FOCUS_OPTIONS,
    FOCUS_REMINDERS,
    FUN_CONTENT
  };
})();