/**
 * Nigerian Sign Language (NSL) Dictionary
 *
 * Curated gesture data for common words/phrases.
 * NSL is distinct from ASL — it uses more two-handed signs,
 * facial grammar is critical for questions/negation,
 * and many signs reflect Nigerian cultural gestures.
 *
 * Sources: Nigerian National Association of the Deaf (NNAD),
 * NSL documentation projects, and Nigerian Deaf community references.
 */

import type { SignGesture, SignLanguageData } from "@/hooks/useSignLanguage";

type NSLEntry = Omit<SignGesture, "word"> & { keywords: string[] };

/**
 * NSL-specific grammatical rules:
 * 1. Topic-Comment structure (topic comes first, then comment)
 * 2. Questions use raised eyebrows + forward lean
 * 3. Negation uses head shake + specific hand movement
 * 4. Time signs come before the verb
 * 5. Classifiers are heavily used for spatial description
 */

const nslGestures: Record<string, NSLEntry> = {
  // ── Greetings ──
  hello: {
    keywords: ["hello", "hi", "hey"],
    gloss: "HELLO",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0.3, y: 0.8 },
      endPosition: { x: 0.5, y: 0.6 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "wave_side",
    bodyMovement: "head_nod",
    facialExpression: "smile",
    duration: 800,
  },
  good_morning: {
    keywords: ["good morning"],
    gloss: "MORNING GOOD",
    handShape: "flat_hand",
    dominantHand: {
      startPosition: { x: -0.2, y: -0.5 },
      endPosition: { x: 0.2, y: 0.3 },
      rotation: 15,
    },
    nonDominantHand: {
      startPosition: { x: -0.3, y: 0 },
      endPosition: { x: -0.3, y: 0 },
      rotation: 0,
    },
    movement: "rise_up",
    bodyMovement: "none",
    facialExpression: "smile",
    duration: 1200,
  },
  goodbye: {
    keywords: ["goodbye", "bye", "see you"],
    gloss: "BYE-BYE",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0.4, y: 0.7 },
      endPosition: { x: 0.6, y: 0.5 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "wave_repeated",
    bodyMovement: "head_nod",
    facialExpression: "smile",
    duration: 1000,
  },
  welcome: {
    keywords: ["welcome", "you are welcome"],
    gloss: "WELCOME",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0.5, y: 0.5 },
      endPosition: { x: 0, y: 0 },
      rotation: 0,
    },
    nonDominantHand: {
      startPosition: { x: -0.5, y: 0.5 },
      endPosition: { x: 0, y: 0 },
      rotation: 0,
    },
    movement: "sweep_inward",
    bodyMovement: "lean_forward",
    facialExpression: "big_smile",
    duration: 1000,
  },

  // ── Common Words ──
  thank_you: {
    keywords: ["thank you", "thanks"],
    gloss: "THANK-YOU",
    handShape: "flat_hand",
    dominantHand: {
      startPosition: { x: 0, y: 0.9 },
      endPosition: { x: 0.3, y: 0.5 },
      rotation: -15,
    },
    nonDominantHand: null,
    movement: "arc_forward",
    bodyMovement: "head_nod",
    facialExpression: "smile",
    duration: 900,
  },
  please: {
    keywords: ["please", "biko"],
    gloss: "PLEASE",
    handShape: "flat_hand",
    dominantHand: {
      startPosition: { x: 0.1, y: 0.2 },
      endPosition: { x: 0.1, y: -0.1 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "circular_chest",
    bodyMovement: "lean_forward",
    facialExpression: "concerned",
    duration: 800,
  },
  sorry: {
    keywords: ["sorry", "i am sorry", "excuse me", "ndo"],
    gloss: "SORRY",
    handShape: "fist",
    dominantHand: {
      startPosition: { x: 0.1, y: 0.1 },
      endPosition: { x: 0.1, y: -0.1 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "circular_chest",
    bodyMovement: "lean_forward",
    facialExpression: "sad",
    duration: 900,
  },
  yes: {
    keywords: ["yes", "ee"],
    gloss: "YES",
    handShape: "fist",
    dominantHand: {
      startPosition: { x: 0.3, y: 0.5 },
      endPosition: { x: 0.3, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "nod_wrist",
    bodyMovement: "head_nod",
    facialExpression: "smile",
    duration: 600,
  },
  no: {
    keywords: ["no", "mba"],
    gloss: "NO",
    handShape: "point",
    dominantHand: {
      startPosition: { x: 0.3, y: 0.5 },
      endPosition: { x: -0.1, y: 0.5 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "sweep_side",
    bodyMovement: "head_shake",
    facialExpression: "serious",
    duration: 700,
  },
  i_love_you: {
    keywords: ["i love you", "love"],
    gloss: "I LOVE YOU",
    handShape: "love",
    dominantHand: {
      startPosition: { x: 0.1, y: 0.1 },
      endPosition: { x: 0.4, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "push_forward",
    bodyMovement: "lean_forward",
    facialExpression: "big_smile",
    duration: 1000,
  },

  // ── Pronouns ──
  i_me: {
    keywords: ["i", "me", "myself"],
    gloss: "I/ME",
    handShape: "point",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.2 },
      endPosition: { x: 0, y: 0 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "tap_chest",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 500,
  },
  you: {
    keywords: ["you", "your"],
    gloss: "YOU",
    handShape: "point",
    dominantHand: {
      startPosition: { x: 0, y: 0.3 },
      endPosition: { x: 0.4, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "point_forward",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 500,
  },
  we: {
    keywords: ["we", "us", "our"],
    gloss: "WE",
    handShape: "point",
    dominantHand: {
      startPosition: { x: 0, y: 0.1 },
      endPosition: { x: 0.3, y: 0.1 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "arc_horizontal",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 600,
  },

  // ── Questions (NSL: raised eyebrows + lean forward) ──
  how_are_you: {
    keywords: ["how are you", "how are you doing"],
    gloss: "YOU FINE QUESTION",
    handShape: "thumbs_up",
    dominantHand: {
      startPosition: { x: 0.3, y: 0.3 },
      endPosition: { x: 0.4, y: 0.5 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "push_forward",
    bodyMovement: "lean_forward",
    facialExpression: "questioning",
    duration: 1000,
  },
  what: {
    keywords: ["what", "what is"],
    gloss: "WHAT",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: -0.2, y: 0.3 },
      endPosition: { x: 0.4, y: 0.3 },
      rotation: 10,
    },
    nonDominantHand: null,
    movement: "shake_horizontal",
    bodyMovement: "lean_forward",
    facialExpression: "questioning",
    duration: 700,
  },
  where: {
    keywords: ["where", "where is"],
    gloss: "WHERE",
    handShape: "point",
    dominantHand: {
      startPosition: { x: 0, y: 0.3 },
      endPosition: { x: 0.3, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "shake_horizontal",
    bodyMovement: "lean_forward",
    facialExpression: "questioning",
    duration: 700,
  },
  how_much: {
    keywords: ["how much", "price", "cost"],
    gloss: "HOW-MUCH",
    handShape: "pinch",
    dominantHand: {
      startPosition: { x: 0.1, y: 0.3 },
      endPosition: { x: 0.3, y: 0.5 },
      rotation: 15,
    },
    nonDominantHand: {
      startPosition: { x: -0.1, y: 0.3 },
      endPosition: { x: -0.1, y: 0.3 },
      rotation: 0,
    },
    movement: "rub_fingers",
    bodyMovement: "lean_forward",
    facialExpression: "questioning",
    duration: 900,
  },

  // ── Family (NSL uses culturally specific signs) ──
  mother: {
    keywords: ["mother", "mum", "mama", "nne"],
    gloss: "MOTHER",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0, y: 0.8 },
      endPosition: { x: 0, y: 0.7 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "tap_chin",
    bodyMovement: "none",
    facialExpression: "smile",
    duration: 700,
  },
  father: {
    keywords: ["father", "dad", "papa", "nna"],
    gloss: "FATHER",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0, y: 1 },
      endPosition: { x: 0, y: 0.9 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "tap_forehead",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 700,
  },
  child: {
    keywords: ["child", "baby", "kid", "nwa", "omo"],
    gloss: "CHILD",
    handShape: "flat_hand",
    dominantHand: {
      startPosition: { x: 0, y: -0.3 },
      endPosition: { x: 0.2, y: -0.4 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "pat_low",
    bodyMovement: "none",
    facialExpression: "smile",
    duration: 700,
  },
  friend: {
    keywords: ["friend", "enyi", "ore", "aboki"],
    gloss: "FRIEND",
    handShape: "hook",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.3 },
      endPosition: { x: 0.2, y: 0.2 },
      rotation: 0,
    },
    nonDominantHand: {
      startPosition: { x: -0.2, y: 0.3 },
      endPosition: { x: -0.2, y: 0.2 },
      rotation: 0,
    },
    movement: "interlock",
    bodyMovement: "head_nod",
    facialExpression: "smile",
    duration: 800,
  },

  // ── Common Actions ──
  eat: {
    keywords: ["eat", "food", "hungry", "nri"],
    gloss: "EAT",
    handShape: "pinch",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.5 },
      endPosition: { x: 0, y: 0.8 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "tap_mouth",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 800,
  },
  drink: {
    keywords: ["drink", "water", "thirsty", "mmiri"],
    gloss: "DRINK",
    handShape: "c_shape",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.5 },
      endPosition: { x: 0.1, y: 0.8 },
      rotation: -30,
    },
    nonDominantHand: null,
    movement: "tilt_mouth",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 800,
  },
  go: {
    keywords: ["go", "leave", "walk", "let's go"],
    gloss: "GO",
    handShape: "point",
    dominantHand: {
      startPosition: { x: 0, y: 0.3 },
      endPosition: { x: 0.6, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "push_forward",
    bodyMovement: "lean_forward",
    facialExpression: "focused",
    duration: 700,
  },
  come: {
    keywords: ["come", "come here"],
    gloss: "COME",
    handShape: "beckon",
    dominantHand: {
      startPosition: { x: 0.5, y: 0.3 },
      endPosition: { x: 0, y: 0.1 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "beckon_toward",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 700,
  },
  help: {
    keywords: ["help", "assist", "help me", "enyemaka", "taimako"],
    gloss: "HELP",
    handShape: "thumbs_up",
    dominantHand: {
      startPosition: { x: 0, y: -0.2 },
      endPosition: { x: 0, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: {
      startPosition: { x: -0.2, y: 0 },
      endPosition: { x: -0.2, y: 0.3 },
      rotation: 0,
    },
    movement: "lift_up",
    bodyMovement: "none",
    facialExpression: "concerned",
    duration: 900,
  },
  stop: {
    keywords: ["stop", "wait", "kwusi", "tsaya", "duro"],
    gloss: "STOP",
    handShape: "flat_hand",
    dominantHand: {
      startPosition: { x: 0, y: 0.2 },
      endPosition: { x: 0.4, y: 0.4 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "push_forward_sharp",
    bodyMovement: "none",
    facialExpression: "serious",
    duration: 600,
  },

  // ── Emergencies ──
  danger: {
    keywords: ["danger", "emergency", "fire", "help!"],
    gloss: "DANGER",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0, y: 0.3 },
      endPosition: { x: 0.3, y: 0.6 },
      rotation: 0,
    },
    nonDominantHand: {
      startPosition: { x: 0, y: 0.3 },
      endPosition: { x: -0.3, y: 0.6 },
      rotation: 0,
    },
    movement: "push_apart_urgent",
    bodyMovement: "lean_forward",
    facialExpression: "emphatic",
    duration: 800,
  },
  sick: {
    keywords: ["sick", "ill", "not well", "hospital", "doctor"],
    gloss: "SICK",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0, y: 1 },
      endPosition: { x: 0, y: 0.9 },
      rotation: 0,
    },
    nonDominantHand: {
      startPosition: { x: 0, y: 0 },
      endPosition: { x: 0, y: -0.1 },
      rotation: 0,
    },
    movement: "touch_forehead_stomach",
    bodyMovement: "lean_forward",
    facialExpression: "sad",
    duration: 1000,
  },

  // ── Descriptors ──
  good: {
    keywords: ["good", "fine", "well", "nice", "great"],
    gloss: "GOOD",
    handShape: "thumbs_up",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.3 },
      endPosition: { x: 0.3, y: 0.4 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "push_forward",
    bodyMovement: "head_nod",
    facialExpression: "smile",
    duration: 600,
  },
  bad: {
    keywords: ["bad", "not good", "wrong"],
    gloss: "BAD",
    handShape: "flat_hand",
    dominantHand: {
      startPosition: { x: 0, y: 0.8 },
      endPosition: { x: 0.2, y: 0 },
      rotation: 180,
    },
    nonDominantHand: null,
    movement: "flip_down",
    bodyMovement: "head_shake",
    facialExpression: "serious",
    duration: 700,
  },
  big: {
    keywords: ["big", "large", "much", "a lot"],
    gloss: "BIG",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0.1, y: 0.3 },
      endPosition: { x: 0.5, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: {
      startPosition: { x: -0.1, y: 0.3 },
      endPosition: { x: -0.5, y: 0.3 },
      rotation: 0,
    },
    movement: "spread_apart",
    bodyMovement: "none",
    facialExpression: "emphatic",
    duration: 800,
  },
  small: {
    keywords: ["small", "little", "tiny"],
    gloss: "SMALL",
    handShape: "pinch",
    dominantHand: {
      startPosition: { x: 0.3, y: 0.3 },
      endPosition: { x: 0.1, y: 0.3 },
      rotation: 0,
    },
    nonDominantHand: {
      startPosition: { x: -0.3, y: 0.3 },
      endPosition: { x: -0.1, y: 0.3 },
      rotation: 0,
    },
    movement: "squeeze_together",
    bodyMovement: "none",
    facialExpression: "focused",
    duration: 700,
  },

  // ── Numbers 1-5 (NSL uses similar fingerspelling to international) ──
  one: {
    keywords: ["one", "1", "otu", "daya", "okan"],
    gloss: "ONE",
    handShape: "point",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.4 },
      endPosition: { x: 0.2, y: 0.5 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "hold_still",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 600,
  },
  two: {
    keywords: ["two", "2", "abuo", "biyu", "eji"],
    gloss: "TWO",
    handShape: "index_middle",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.4 },
      endPosition: { x: 0.2, y: 0.5 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "hold_still",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 600,
  },
  five: {
    keywords: ["five", "5", "ise", "biyar"],
    gloss: "FIVE",
    handShape: "open_5",
    dominantHand: {
      startPosition: { x: 0.2, y: 0.4 },
      endPosition: { x: 0.2, y: 0.5 },
      rotation: 0,
    },
    nonDominantHand: null,
    movement: "hold_still",
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 600,
  },
};

/**
 * Attempt to match input text against the local NSL dictionary.
 * Returns pre-built gesture data for known phrases, or null for unknown.
 */
export function lookupNSL(text: string): SignLanguageData | null {
  const normalized = text.trim().toLowerCase().replace(/[?.!,;]+$/g, "");
  if (!normalized) return null;

  // Exact phrase match first
  for (const [, entry] of Object.entries(nslGestures)) {
    for (const kw of entry.keywords) {
      if (normalized === kw) {
        const { keywords, ...gesture } = entry;
        return {
          signs: [{ word: text, ...gesture }],
          totalDuration: gesture.duration,
          note: "NSL dictionary match",
        };
      }
    }
  }

  // Multi-word: try to decompose into known signs
  const words = normalized.split(/\s+/);
  const matched: SignGesture[] = [];

  for (let i = 0; i < words.length; i++) {
    // Try two-word phrases first
    if (i + 1 < words.length) {
      const twoWord = `${words[i]} ${words[i + 1]}`;
      let found = false;
      for (const [, entry] of Object.entries(nslGestures)) {
        if (entry.keywords.includes(twoWord)) {
          const { keywords, ...gesture } = entry;
          matched.push({ word: twoWord, ...gesture });
          i++; // skip next word
          found = true;
          break;
        }
      }
      if (found) continue;
    }

    // Single word match
    const word = words[i];
    let wordMatched = false;
    for (const [, entry] of Object.entries(nslGestures)) {
      if (entry.keywords.includes(word)) {
        const { keywords, ...gesture } = entry;
        matched.push({ word, ...gesture });
        wordMatched = true;
        break;
      }
    }

    // Skip function words that don't have signs (articles, prepositions)
    if (!wordMatched) {
      const skipWords = new Set(["the", "a", "an", "is", "are", "am", "to", "of", "in", "on", "at", "it", "this", "that", "and", "or", "but", "for", "with", "from", "be", "been", "being", "do", "does", "did", "have", "has", "had"]);
      if (!skipWords.has(word)) {
        // Unknown sign — will be filled by AI fallback
        return null;
      }
    }
  }

  if (matched.length === 0) return null;

  const totalDuration = matched.reduce((sum, s) => sum + s.duration, 0) + (matched.length - 1) * 200;
  return {
    signs: matched,
    totalDuration,
    note: "Built from NSL dictionary with local gesture data",
  };
}

export { nslGestures };
