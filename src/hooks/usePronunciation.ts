import { useState, useCallback } from "react";

interface PronunciationData {
  ipa: string;
  phonetic: string;
  syllables: string;
  tips: string[];
  toneMarkers: string;
}

export function usePronunciation() {
  const [isLoading, setIsLoading] = useState(false);
  const [pronunciationData, setPronunciationData] = useState<PronunciationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPronunciation = useCallback(async (text: string, language: string): Promise<PronunciationData | null> => {
    if (!text.trim()) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pronunciation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, language }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get pronunciation");
      }

      const data = await response.json();
      setPronunciationData(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get pronunciation";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPronunciation = useCallback(() => {
    setPronunciationData(null);
    setError(null);
  }, []);

  return {
    getPronunciation,
    clearPronunciation,
    pronunciationData,
    isLoading,
    error,
  };
}
