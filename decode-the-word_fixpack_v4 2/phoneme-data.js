/* ==========================================================================
   DECODE THE WORD: PHONEME & MOUTH POSITION DATA
   20 Core Phonemes with Articulation Cues & Visual Descriptions
   ========================================================================== */

(function() {
    'use strict';

    // Phoneme database with mouth position data
    window.PHONEME_DATA = {
        
        // SHORT VOWELS (5)
        'a': {
            name: 'Short A',
            sound: '/æ/',
            example: 'cat',
            cue: 'Open mouth wide, jaw drops',
            mouthShape: 'wide-open',
            color: '#ff6b9d',
            description: 'Say "ahhh" like at the doctor',
            tongue: 'low, middle',
            lips: 'unrounded, open',
            animation: 'mouth-short-a'
        },
        
        'e': {
            name: 'Short E',
            sound: '/ɛ/',
            example: 'bed',
            cue: 'Smile slightly, tongue mid-high',
            mouthShape: 'slight-smile',
            color: '#ff6b9d',
            description: 'Say "eh" like "meh"',
            tongue: 'mid-high, front',
            lips: 'slightly spread',
            animation: 'mouth-short-e'
        },
        
        'i': {
            name: 'Short I',
            sound: '/ɪ/',
            example: 'sit',
            cue: 'Lips relax, tongue near roof',
            mouthShape: 'relaxed',
            color: '#ff6b9d',
            description: 'Quick "ih" sound',
            tongue: 'high, front',
            lips: 'neutral',
            animation: 'mouth-short-i'
        },
        
        'o': {
            name: 'Short O',
            sound: '/ɒ/',
            example: 'hot',
            cue: 'Open mouth, round lips slightly',
            mouthShape: 'rounded-open',
            color: '#ff6b9d',
            description: 'Say "ahh" but rounder',
            tongue: 'low, back',
            lips: 'slightly rounded',
            animation: 'mouth-short-o'
        },
        
        'u': {
            name: 'Short U',
            sound: '/ʌ/',
            example: 'cup',
            cue: 'Relax mouth, jaw slightly open',
            mouthShape: 'neutral-open',
            color: '#ff6b9d',
            description: 'Say "uh" like "duh"',
            tongue: 'mid, center',
            lips: 'neutral',
            animation: 'mouth-short-u'
        },
        
        // STOP SOUNDS (6)
        'b': {
            name: 'B Sound',
            sound: '/b/',
            example: 'bat',
            cue: 'Press lips together, then pop open',
            mouthShape: 'lips-closed',
            color: '#4fc3f7',
            description: 'Lips explode open',
            tongue: 'low',
            lips: 'pressed together',
            animation: 'mouth-b'
        },
        
        'p': {
            name: 'P Sound',
            sound: '/p/',
            example: 'pet',
            cue: 'Press lips together, strong puff of air',
            mouthShape: 'lips-closed',
            color: '#4fc3f7',
            description: 'Like blowing out a candle',
            tongue: 'low',
            lips: 'pressed together',
            animation: 'mouth-p'
        },
        
        'd': {
            name: 'D Sound',
            sound: '/d/',
            example: 'dog',
            cue: 'Tongue touches roof behind teeth',
            mouthShape: 'tongue-up',
            color: '#4fc3f7',
            description: 'Tongue taps the roof',
            tongue: 'touches alveolar ridge',
            lips: 'neutral',
            animation: 'mouth-d'
        },
        
        't': {
            name: 'T Sound',
            sound: '/t/',
            example: 'top',
            cue: 'Tongue touches roof, quick release',
            mouthShape: 'tongue-up',
            color: '#4fc3f7',
            description: 'Sharp tap with tongue',
            tongue: 'touches alveolar ridge',
            lips: 'neutral',
            animation: 'mouth-t'
        },
        
        'g': {
            name: 'G Sound',
            sound: '/g/',
            example: 'go',
            cue: 'Back of tongue touches soft palate',
            mouthShape: 'throat',
            color: '#4fc3f7',
            description: 'Sound from back of throat',
            tongue: 'back raised',
            lips: 'neutral',
            animation: 'mouth-g'
        },
        
        'k': {
            name: 'K Sound',
            sound: '/k/',
            example: 'kite',
            cue: 'Back of tongue up, strong release',
            mouthShape: 'throat',
            color: '#4fc3f7',
            description: 'Hard sound from throat',
            tongue: 'back raised',
            lips: 'neutral',
            animation: 'mouth-k'
        },
        
        // CONTINUOUS SOUNDS (6)
        'm': {
            name: 'M Sound',
            sound: '/m/',
            example: 'mom',
            cue: 'Hum with lips closed',
            mouthShape: 'lips-closed',
            color: '#81c784',
            description: 'Mmmmm like yummy',
            tongue: 'low',
            lips: 'pressed together',
            animation: 'mouth-m'
        },
        
        'n': {
            name: 'N Sound',
            sound: '/n/',
            example: 'net',
            cue: 'Tongue on roof, hum through nose',
            mouthShape: 'tongue-up',
            color: '#81c784',
            description: 'Nnnnn through your nose',
            tongue: 'touches alveolar ridge',
            lips: 'slightly open',
            animation: 'mouth-n'
        },
        
        's': {
            name: 'S Sound',
            sound: '/s/',
            example: 'sun',
            cue: 'Teeth together, blow air out',
            mouthShape: 'teeth-together',
            color: '#81c784',
            description: 'Sssss like a snake',
            tongue: 'near alveolar ridge',
            lips: 'slightly spread',
            animation: 'mouth-s'
        },
        
        'f': {
            name: 'F Sound',
            sound: '/f/',
            example: 'fun',
            cue: 'Bottom lip touches top teeth',
            mouthShape: 'lip-teeth',
            color: '#81c784',
            description: 'Ffff like angry cat',
            tongue: 'low',
            lips: 'bottom lip under top teeth',
            animation: 'mouth-f'
        },
        
        'l': {
            name: 'L Sound',
            sound: '/l/',
            example: 'lap',
            cue: 'Tongue tip touches roof',
            mouthShape: 'tongue-up',
            color: '#81c784',
            description: 'Llll tongue stays up',
            tongue: 'tip touches alveolar ridge',
            lips: 'neutral',
            animation: 'mouth-l'
        },
        
        'r': {
            name: 'R Sound',
            sound: '/r/',
            example: 'run',
            cue: 'Tongue bunches up, doesn\'t touch',
            mouthShape: 'tongue-back',
            color: '#81c784',
            description: 'Rrr like a growl',
            tongue: 'bunched, not touching',
            lips: 'slightly rounded',
            animation: 'mouth-r'
        },
        
        // DIGRAPHS (3)
        'sh': {
            name: 'SH Sound',
            sound: '/ʃ/',
            example: 'ship',
            cue: 'Round lips, blow air softly',
            mouthShape: 'rounded-forward',
            color: '#ffb74d',
            description: 'Shhhh be quiet',
            tongue: 'raised toward roof',
            lips: 'rounded, protruded',
            animation: 'mouth-sh'
        },
        
        'ch': {
            name: 'CH Sound',
            sound: '/tʃ/',
            example: 'chip',
            cue: 'Like T + SH together',
            mouthShape: 'rounded-forward',
            color: '#ffb74d',
            description: 'Ch ch like a train',
            tongue: 'touches then pulls back',
            lips: 'rounded',
            animation: 'mouth-ch'
        },
        
        'th': {
            name: 'TH Sound',
            sound: '/θ/',
            example: 'think',
            cue: 'Tongue between teeth',
            mouthShape: 'tongue-out',
            color: '#ffb74d',
            description: 'Tongue peeks out',
            tongue: 'between teeth',
            lips: 'open',
            animation: 'mouth-th'
        }
    };

    // Helper function to get phoneme data
    window.getPhonemeData = function(phoneme) {
        const key = phoneme.toLowerCase();
        return window.PHONEME_DATA[key] || null;
    };

    // Helper to detect phoneme from word
    window.detectPhonemeInWord = function(word) {
        if (!word) return null;
        
        word = word.toLowerCase();
        
        // Check digraphs first
        if (word.includes('sh')) return window.PHONEME_DATA['sh'];
        if (word.includes('ch')) return window.PHONEME_DATA['ch'];
        if (word.includes('th')) return window.PHONEME_DATA['th'];
        
        // Check first vowel
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        for (let char of word) {
            if (vowels.includes(char)) {
                return window.PHONEME_DATA[char];
            }
        }
        
        // Fallback to first consonant
        const firstChar = word[0];
        return window.PHONEME_DATA[firstChar] || null;
    };

    console.log('✓ Phoneme data loaded with', Object.keys(window.PHONEME_DATA).length, 'phonemes');
})();
