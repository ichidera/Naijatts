import { useState, useCallback, useRef } from "react";

interface TTSOptions {
  speed?: number;
  voiceId?: string;
}

export function useElevenLabsTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const speak = useCallback(async (text: string, options: TTSOptions = {}): Promise<string | null> => {
    if (!text.trim()) return null;

    cleanup();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text,
            voiceId: options.voiceId,
            speed: options.speed,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `TTS failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      objectUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => { setIsSpeaking(false); cleanup(); };
      audio.onerror = () => { setIsSpeaking(false); setError("Audio playback failed"); cleanup(); };

      await audio.play();
      return audioUrl;
    } catch (err) {
      console.error("ElevenLabs TTS error:", err);
      setError(err instanceof Error ? err.message : "TTS failed");
      setIsSpeaking(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setIsSpeaking(false);
  }, [cleanup]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
    audioRef,
  };
}
