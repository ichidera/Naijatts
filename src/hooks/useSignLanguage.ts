import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lookupNSL } from "@/data/nslDictionary";

export interface SignGesture {
  word: string;
  gloss: string;
  handShape: string;
  dominantHand: {
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
    rotation: number;
  };
  nonDominantHand: {
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
    rotation: number;
  } | null;
  movement: string;
  bodyMovement: string;
  facialExpression: string;
  duration: number;
}

export interface SignLanguageData {
  signs: SignGesture[];
  totalDuration: number;
  note?: string;
}

export function useSignLanguage() {
  const [isLoading, setIsLoading] = useState(false);
  const [signData, setSignData] = useState<SignLanguageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getSignLanguage = useCallback(async (
    text: string,
    sourceLanguage: string,
    signLanguageType: "NSL" | "ASL"
  ) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // For NSL: try the local dictionary first for instant, accurate gestures
      if (signLanguageType === "NSL") {
        const localResult = lookupNSL(text);
        if (localResult) {
          setSignData(localResult);
          setIsLoading(false);
          return;
        }
      }

      // Fallback to AI-generated gestures
      const { data, error: fnError } = await supabase.functions.invoke("sign-language", {
        body: { text, sourceLanguage, signLanguageType },
      });

      if (fnError) throw fnError;
      setSignData(data as SignLanguageData);
    } catch (err) {
      console.error("Sign language error:", err);
      setError(err instanceof Error ? err.message : "Failed to get sign language");
      setSignData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSignData = useCallback(() => {
    setSignData(null);
    setError(null);
  }, []);

  return {
    getSignLanguage,
    signData,
    isLoading,
    error,
    clearSignData,
  };
}
