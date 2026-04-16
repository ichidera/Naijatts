import { useState, useCallback, useEffect } from "react";

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Language to voice mapping for Nigerian languages
// We use African/closest locale voices when available
const languageVoiceMap: Record<string, string[]> = {
  Igbo: ["ig-NG", "en-NG", "en-GB"],
  Hausa: ["ha-NG", "en-NG", "en-GB"],
  Yoruba: ["yo-NG", "en-NG", "en-GB"],
  Ikwere: ["ig-NG", "en-NG", "en-GB"], // Ikwere is related to Igbo
  English: ["en-US", "en-GB", "en"],
};

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const findBestVoice = useCallback((language: string): SpeechSynthesisVoice | null => {
    const preferredLocales = languageVoiceMap[language] || ["en-US"];
    
    for (const locale of preferredLocales) {
      const voice = availableVoices.find(v => v.lang.startsWith(locale));
      if (voice) return voice;
    }
    
    // Fallback to any English voice
    return availableVoices.find(v => v.lang.startsWith("en")) || availableVoices[0] || null;
  }, [availableVoices]);

  const speak = useCallback(async (text: string, language: string, options: SpeechOptions = {}) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = findBestVoice(language);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = options.rate ?? 0.85; // Slightly slower for clarity
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, findBestVoice]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    availableVoices,
  };
}
