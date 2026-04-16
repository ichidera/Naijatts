import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import type { SignLanguageData } from "@/hooks/useSignLanguage";

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface AvatarContextType {
  // Sign data
  signData: SignLanguageData | null;
  setSignData: (data: SignLanguageData | null) => void;
  
  // Playback
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  
  // Audio sync
  audioState: AudioState;
  setAudioState: (state: AudioState) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  
  // Visibility
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  
  // Position
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;

  // Actions
  playWithAudio: (signData: SignLanguageData, audioUrl?: string) => void;
  stopPlayback: () => void;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [signData, setSignData] = useState<SignLanguageData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>({ isPlaying: false, currentTime: 0, duration: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playWithAudio = useCallback((data: SignLanguageData, audioUrl?: string) => {
    setSignData(data);
    setIsVisible(true);
    setIsPlaying(true);

    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(console.error);
    }
  }, []);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState({ isPlaying: false, currentTime: 0, duration: 0 });
  }, []);

  return (
    <AvatarContext.Provider value={{
      signData, setSignData,
      isPlaying, setIsPlaying,
      audioState, setAudioState,
      audioRef,
      isVisible, setIsVisible,
      position, setPosition,
      playWithAudio, stopPlayback,
    }}>
      {children}
      {/* Hidden audio element for sync */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setAudioState({
              isPlaying: !audioRef.current.paused,
              currentTime: audioRef.current.currentTime,
              duration: audioRef.current.duration || 0,
            });
          }
        }}
        onPlay={() => setAudioState(prev => ({ ...prev, isPlaying: true }))}
        onPause={() => setAudioState(prev => ({ ...prev, isPlaying: false }))}
        onEnded={() => {
          setIsPlaying(false);
          setAudioState({ isPlaying: false, currentTime: 0, duration: 0 });
        }}
      />
    </AvatarContext.Provider>
  );
}

export function useAvatarContext() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatarContext must be used within AvatarProvider");
  return ctx;
}
