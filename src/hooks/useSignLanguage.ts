import { useState, useCallback } from "react";
import type { SignLanguageData, SignGesture } from "@/components/SignLanguageAvatar";
import { lookupNSL, nslGestures } from "@/data/nslDictionary";

export type { SignLanguageData, SignGesture };

// Words to skip when auto-generating gestures
const SKIP_WORDS = new Set([
  "the", "a", "an", "is", "are", "am", "to", "of", "in", "on", "at",
  "it", "this", "that", "and", "or", "but", "for", "with", "from",
  "be", "been", "being", "do", "does", "did", "have", "has", "had",
]);

/**
 * Fingerspell a word that isn't in the NSL dictionary, one SignGesture per
 * letter. This replaces the old charCode-based arbitrary-gesture generator:
 * fingerspelling is a real, standardized strategy real signers use for
 * unfamiliar words and proper names, so — unlike the old fallback — this
 * always produces a real, recognizable letter, never an invented sign.
 * Non-alphabetic tokens (numbers, symbols) fall through to NO_SIGN_AVAILABLE.
 */
function fingerspellWord(word: string): SignGesture[] {
  const letters = word.replace(/[^a-zA-Z]/g, "").split("");
  if (letters.length === 0) {
    return [{ ...NO_SIGN_AVAILABLE, word }];
  }

  return letters.map((letter, i) => ({
    handShape: `fs_${letter.toLowerCase()}`,
    // Fingerspelling is held near shoulder height with no travel — the
    // motion is in the fingers, not the arm.
    dominantHand: {
      startPosition: { x: 0.15, y: 0.1 },
      endPosition: { x: 0.15, y: 0.1 },
      rotation: 0,
    },
    nonDominantHand: null,
    bodyMovement: "none",
    facialExpression: "neutral",
    duration: 320, // brisk — fingerspelling reads faster than a full lexical sign
    gloss: i === 0 ? `#${word.toUpperCase()}` : "", // "#WORD" is conventional gloss notation for a fingerspelled word
    word: i === 0 ? word : "",
  }));
}

/**
 * Shown for tokens with no letters to fingerspell (pure numbers, symbols).
 * This is an honest "I don't have a sign for that" state — open palms raised
 * with a questioning expression, a real, natural thing signers do — rather
 * than a fabricated gesture pretending to be a real sign. Numbers 0–9 have
 * their own real NSL handshapes and are a reasonable next addition; until
 * then, this is what un-signable input falls back to.
 */
const NO_SIGN_AVAILABLE: SignGesture = {
  word: "",
  gloss: "(no sign available)",
  handShape: "spread",
  dominantHand: {
    startPosition: { x: 0.35, y: -0.15 },
    endPosition: { x: 0.35, y: -0.15 },
    rotation: 15,
  },
  nonDominantHand: {
    startPosition: { x: -0.35, y: -0.15 },
    endPosition: { x: -0.35, y: -0.15 },
    rotation: -15,
  },
  bodyMovement: "none",
  facialExpression: "questioning",
  duration: 650,
};

/** Fallback single sign when all words are filtered */
const DEFAULT_SIGN: SignGesture = {
  word: "",
  gloss: "SIGN",
  handShape: "open_5",
  dominantHand: {
    startPosition: { x: 0, y: 0 },
    endPosition:   { x: 0.2, y: 0.3 },
    rotation: 0,
  },
  nonDominantHand: null,
  bodyMovement: "head_nod",
  facialExpression: "neutral",
  duration: 1000,
};

/**
 * Generate sign data purely in the browser — no API, no network.
 * Steps:
 *   1. For each word, try the NSL dictionary first.
 *   2. Fall back to the deterministic rule-based generator.
 */
function generateGestureLocally(text: string, signLanguageType: "NSL" | "ASL"): SignLanguageData {
  const rawWords = text.toLowerCase().split(/\s+/).filter(Boolean);
  const words = rawWords.filter((w) => !SKIP_WORDS.has(w));

  // Nothing left after filtering — return a single default sign
  if (words.length === 0) {
    const fallback = { ...DEFAULT_SIGN, word: text, gloss: text.toUpperCase() };
    return { signs: [fallback], note: "Auto-generated gesture" };
  }

  const signs: SignGesture[] = words.flatMap((word) => {
    // 1. Exact dictionary lookup (NSL)
    if (signLanguageType === "NSL") {
      const entry = lookupNSL(word);
      if (entry) {
        return [{
          handShape:        entry.handShape,
          dominantHand:     entry.dominantHand,
          nonDominantHand:  entry.nonDominantHand,
          bodyMovement:     entry.bodyMovement,
          facialExpression: entry.facialExpression,
          duration:         entry.duration,
          gloss:            entry.gloss,
          word,
        }];
      }
    }

    // 2. Not in the dictionary — fingerspell it, letter by letter, instead
    // of inventing a gesture.
    return fingerspellWord(word);
  });

  const totalDuration =
    signs.reduce((sum, s) => sum + s.duration, 0) +
    Math.max(0, signs.length - 1) * 200;

  return {
    signs,
    note: "Auto-generated gesture",
    // @ts-expect-error — totalDuration is an extra field used by some consumers
    totalDuration,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UseSignLanguageReturn {
  getSignLanguage: (text: string, sourceLanguage: string, signType?: "NSL" | "ASL") => void;
  signData: SignLanguageData | null;
  isLoading: boolean;
  error: string | null;
  clearSignData: () => void;
}

export function useSignLanguage(): UseSignLanguageReturn {
  const [signData, setSignData] = useState<SignLanguageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSignLanguage = useCallback(
    (text: string, _sourceLanguage: string, signType: "NSL" | "ASL" = "NSL") => {
      if (!text?.trim()) return;

      setIsLoading(true);
      setError(null);

      // Everything is synchronous and local — use a minimal setTimeout so
      // the loading spinner is briefly visible (gives user feedback).
      setTimeout(() => {
        try {
          // Step 1 — try the full-text NSL dictionary first (single phrase lookup)
          const exactEntry = signType === "NSL" ? lookupNSL(text.trim()) : null;
          if (exactEntry) {
            setSignData({
              signs: [
                {
                  handShape:        exactEntry.handShape,
                  dominantHand:     exactEntry.dominantHand,
                  nonDominantHand:  exactEntry.nonDominantHand,
                  bodyMovement:     exactEntry.bodyMovement,
                  facialExpression: exactEntry.facialExpression,
                  duration:         exactEntry.duration,
                  gloss:            exactEntry.gloss,
                  word:             text.trim(),
                },
              ],
            });
            setIsLoading(false);
            return;
          }

          // Step 2 — word-by-word with local generator
          const data = generateGestureLocally(text, signType);
          setSignData(data);
        } catch (_err) {
          // Should never throw, but be safe
          setSignData(generateGestureLocally(text, signType));
        } finally {
          setIsLoading(false);
        }
      }, 120);
    },
    []
  );

  const clearSignData = useCallback(() => {
    setSignData(null);
    setError(null);
  }, []);

  return { getSignLanguage, signData, isLoading, error, clearSignData };
}