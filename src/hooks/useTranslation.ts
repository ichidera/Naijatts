import { useState, useCallback, useRef, useEffect } from "react";
import { phraseLibrary } from "@/data/phraseLibrary";

export interface TranslationResult {
  translation: string;
  source?: "phrase-library" | "ai";
  error?: string;
}

type NigerianLang = keyof (typeof phraseLibrary)[0]["translations"];
const NIGERIAN_LANGUAGES = new Set<string>(["Igbo", "Hausa", "Yoruba", "Ikwere"]);

const SUPABASE_FUNCTION_BASE = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "") ?? "";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const hasSupabaseConfig = Boolean(SUPABASE_FUNCTION_BASE && SUPABASE_PUBLISHABLE_KEY);

function lookupPhraseLibraryExactWord(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): string | null {
  const normalized = text.trim().toLowerCase().replace(/[?.!,;]+$/, "");
  if (!normalized) return null;

  const isSourceEnglish = sourceLanguage === "English";
  const isTargetEnglish = targetLanguage === "English";

  if (isSourceEnglish) {
    const lang = targetLanguage as NigerianLang;
    for (const phrase of phraseLibrary) {
      const phraseNorm = phrase.english.toLowerCase().replace(/[?.!,;]+$/, "");
      if (phraseNorm === normalized) {
        return phrase.translations[lang] ?? null;
      }
    }
  } else if (isTargetEnglish) {
    const srcLang = sourceLanguage as NigerianLang;
    for (const phrase of phraseLibrary) {
      const phraseText = phrase.translations[srcLang];
      if (!phraseText) continue;
      const phraseNorm = phraseText.toLowerCase().replace(/[?.!,;]+$/, "");
      if (phraseNorm === normalized) {
        return phrase.english;
      }
    }
  } else if (NIGERIAN_LANGUAGES.has(sourceLanguage) && NIGERIAN_LANGUAGES.has(targetLanguage)) {
    const srcLang = sourceLanguage as NigerianLang;
    const tgtLang = targetLanguage as NigerianLang;
    for (const phrase of phraseLibrary) {
      const phraseText = phrase.translations[srcLang];
      if (!phraseText) continue;
      const phraseNorm = phraseText.toLowerCase().replace(/[?.!,;]+$/, "");
      if (phraseNorm === normalized) {
        return phrase.translations[tgtLang] ?? null;
      }
    }
  }

  return null;
}

function fallbackWordTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): string | null {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const translatedWords = words.map((word) => lookupPhraseLibraryExactWord(word, sourceLanguage, targetLanguage));
  if (translatedWords.some((translated) => translated === null)) {
    return null;
  }

  return translatedWords.join(" ");
}

/**
 * Bidirectional phrase library lookup.
 * English → Nigerian:  matches against phrase.english
 * Nigerian → English:  matches against phrase.translations[sourceLang]
 * Nigerian → Nigerian: matches source, returns target
 */
function lookupPhraseLibrary(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): string | null {
  const normalized = text.trim().toLowerCase().replace(/[?.!,;]+$/, "");
  if (!normalized) return null;

  const isSourceEnglish = sourceLanguage === "English";
  const isTargetEnglish = targetLanguage === "English";

  if (isSourceEnglish) {
    // English → Nigerian
    const lang = targetLanguage as NigerianLang;
    for (const phrase of phraseLibrary) {
      const phraseNorm = phrase.english.toLowerCase().replace(/[?.!,;]+$/, "");
      if (phraseNorm === normalized) {
        return phrase.translations[lang] ?? null;
      }
    }
  } else if (isTargetEnglish) {
    // Nigerian → English
    const srcLang = sourceLanguage as NigerianLang;
    for (const phrase of phraseLibrary) {
      const phraseText = phrase.translations[srcLang];
      if (!phraseText) continue;
      const phraseNorm = phraseText.toLowerCase().replace(/[?.!,;]+$/, "");
      if (phraseNorm === normalized) {
        return phrase.english;
      }
    }
  } else if (NIGERIAN_LANGUAGES.has(sourceLanguage) && NIGERIAN_LANGUAGES.has(targetLanguage)) {
    // Nigerian → Nigerian (e.g. Igbo → Yoruba)
    const srcLang = sourceLanguage as NigerianLang;
    const tgtLang = targetLanguage as NigerianLang;
    for (const phrase of phraseLibrary) {
      const phraseText = phrase.translations[srcLang];
      if (!phraseText) continue;
      const phraseNorm = phraseText.toLowerCase().replace(/[?.!,;]+$/, "");
      if (phraseNorm === normalized) {
        return phrase.translations[tgtLang] ?? null;
      }
    }
  }

  return null;
}

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /** Direct translation call — cancels any in-flight request. */
  const translate = useCallback(async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResult> => {
    if (!text.trim()) {
      return { translation: "" };
    }

    // Check phrase library first for instant results
    const libraryMatch = lookupPhraseLibrary(text, sourceLanguage, targetLanguage);
    if (libraryMatch) {
      return { translation: libraryMatch, source: "phrase-library" };
    }

    // Try a local word-by-word fallback when the Supabase function isn't configured.
    if (!hasSupabaseConfig) {
      const fallback = fallbackWordTranslation(text, sourceLanguage, targetLanguage);
      if (fallback) {
        return { translation: fallback, source: "phrase-library" };
      }
      const errorMessage = "Translation service is not configured.";
      setError(errorMessage);
      return { translation: "", error: errorMessage };
    }

    // Cancel previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch(
        `${SUPABASE_FUNCTION_BASE}/functions/v1/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, sourceLanguage, targetLanguage }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        let message = "Translation failed";
        try {
          const errorData = await response.json();
          message = errorData?.error || message;
        } catch {
          const textBody = await response.text();
          if (textBody) message = textBody;
        }
        throw new Error(message);
      }

      const data = await response.json();
      return { translation: data.translation, source: "ai" };
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return { translation: "" };
      }

      const fallback = fallbackWordTranslation(text, sourceLanguage, targetLanguage);
      if (fallback) {
        return { translation: fallback, source: "phrase-library" };
      }

      let errorMessage = err instanceof Error ? err.message : "Translation failed";
      if (errorMessage === "Failed to fetch") {
        errorMessage = "Unable to reach the translation service. Please check your network or Supabase function configuration.";
      }
      setError(errorMessage);
      return { translation: "", error: errorMessage };
    } finally {
      if (abortRef.current === controller) {
        setIsTranslating(false);
      }
    }
  }, []);

  /**
   * Debounced real-time translate — call on every keystroke.
   * Phrase-library matches return instantly; AI calls are debounced.
   */
  const translateRealtime = useCallback((
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    onResult: (result: TranslationResult) => void,
    delayMs = 500
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      abortRef.current?.abort();
      setIsTranslating(false);
      onResult({ translation: "" });
      return;
    }

    // Instant phrase library lookup
    const libraryMatch = lookupPhraseLibrary(text, sourceLanguage, targetLanguage);
    if (libraryMatch) {
      abortRef.current?.abort();
      setIsTranslating(false);
      onResult({ translation: libraryMatch, source: "phrase-library" });
      return;
    }

    // Show loading state immediately, debounce the actual API call
    setIsTranslating(true);
    debounceRef.current = setTimeout(async () => {
      const result = await translate(text, sourceLanguage, targetLanguage);
      onResult(result);
    }, delayMs);
  }, [translate]);

  return {
    translate,
    translateRealtime,
    isTranslating,
    error,
  };
}
