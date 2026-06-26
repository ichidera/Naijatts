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

// Hand shape map by first letter
function letterToHandShape(word: string): string {
  if (word.length > 8) return "spread";
  const ch = word[0]?.toLowerCase() ?? "a";
  if (ch >= "a" && ch <= "e") return "open_5";
  if (ch >= "f" && ch <= "j") return "flat_hand";
  if (ch >= "k" && ch <= "o") return "point";
  if (ch >= "p" && ch <= "t") return "fist";
  return "c_shape"; // u-z
}

// Facial expression based on word semantics
function wordToExpression(word: string): string {
  const w = word.toLowerCase();
  if (["happy", "joy", "love", "great", "good", "nice", "wonderful", "excellent", "best", "beautiful"].includes(w))
    return "smile";
  if (["sad", "sorry", "bad", "wrong", "pain", "sick", "hurt", "cry", "poor"].includes(w))
    return "concerned";
  if (["what", "where", "who", "why", "how", "when", "which"].includes(w))
    return "questioning";
  if (["think", "wonder", "maybe", "perhaps", "probably"].includes(w))
    return "thinking";
  if (["stop", "never", "danger", "angry", "hate"].includes(w))
    return "serious";
  return "neutral";
}

// Body movement based on word semantics
function wordToBodyMovement(word: string): string {
  const w = word.toLowerCase();
  if (["yes", "agree", "okay", "ok", "right", "correct", "sure"].includes(w)) return "head_nod";
  if (["no", "never", "not", "wrong", "disagree"].includes(w)) return "head_shake";
  return "none";
}

/**
 * Generate a deterministic SignGesture from any word.
 * No randomness — same word always produces the same gesture.
 */
function generateGestureForWord(word: string): SignGesture {
  const code0 = word.charCodeAt(0) || 97;
  const code1 = word.charCodeAt(1) || 97;

  const endX = (code0 % 5 - 2) * 0.3;                   // -0.6 to 0.6
  const endY = word.length > 5 ? 0.4 : 0;               // higher for longer words
  const startX = endX;
  const startY = endY - 0.2;
  const rotation = (code1 % 60) - 30;                    // -30 to 30
  const hasNonDom = word.length > 6;
  const duration = 800 + word.length * 60;

  return {
    handShape: letterToHandShape(word),
    dominantHand: {
      startPosition: { x: startX, y: startY },
      endPosition:   { x: endX,   y: endY },
      rotation,
    },
    nonDominantHand: hasNonDom
      ? {
          startPosition: { x: -startX, y: startY },
          endPosition:   { x: -endX,   y: endY },
          rotation:       -rotation,
        }
      : null,
    bodyMovement:    wordToBodyMovement(word),
    facialExpression: wordToExpression(word),
    duration,
    gloss: word.toUpperCase(),
    word,
  };
}

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

  const signs: SignGesture[] = words.map((word) => {
    // 1. Exact dictionary lookup (NSL)
    if (signLanguageType === "NSL") {
      const entry = lookupNSL(word);
      if (entry) {
        return {
          handShape:        entry.handShape,
          dominantHand:     entry.dominantHand,
          nonDominantHand:  entry.nonDominantHand,
          bodyMovement:     entry.bodyMovement,
          facialExpression: entry.facialExpression,
          duration:         entry.duration,
          gloss:            entry.gloss,
          word,
        };
      }
    }

    // 2. Deterministic fallback generator
    return generateGestureForWord(word);
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