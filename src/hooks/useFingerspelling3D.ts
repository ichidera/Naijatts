import { useCallback, useRef, useState } from "react";
import type { SignAvatar3DHandle } from "@/avatar/SignAvatar3D";
import { getLetterPose } from "@/data/fingerspellingPoses";

const HOLD_MS = 420; // how long each letter is held before moving to the next
const TRANSITION_MS = 220; // how long the blend between letters takes

export interface UseFingerspelling3DReturn {
  isPlaying: boolean;
  currentLetter: string | null;
  play: (word: string) => void;
  stop: () => void;
}

/**
 * Drives a SignAvatar3D handle through a word, one letter at a time,
 * fingerspelling it. Non-alphabetic characters are skipped. This is the 3D
 * counterpart to the old useSignLanguage's fingerspellWord() — same idea
 * (letter by letter, since there's no whole-word lexical dictionary here),
 * but driving real bone rotations on the avatar instead of returning data
 * for a 2D canvas to draw.
 */
export function useFingerspelling3D(avatarRef: React.RefObject<SignAvatar3DHandle>): UseFingerspelling3DReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopRequested = useRef(false);

  const stop = useCallback(() => {
    stopRequested.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setCurrentLetter(null);
    avatarRef.current?.setArmRaised(false);
  }, [avatarRef]);

  const play = useCallback(
    (word: string) => {
      const letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");
      if (letters.length === 0 || !avatarRef.current) return;

      stopRequested.current = false;
      setIsPlaying(true);
      avatarRef.current.setArmRaised(true, 350);

      const step = (i: number) => {
        if (stopRequested.current || !avatarRef.current) {
          setIsPlaying(false);
          setCurrentLetter(null);
          return;
        }
        if (i >= letters.length) {
          setIsPlaying(false);
          setCurrentLetter(null);
          avatarRef.current.setArmRaised(false);
          return;
        }
        const letter = letters[i];
        setCurrentLetter(letter);
        avatarRef.current.playPose(getLetterPose(letter), TRANSITION_MS);
        timeoutRef.current = setTimeout(() => step(i + 1), HOLD_MS + TRANSITION_MS);
      };

      // small delay so the arm has started lifting before the first letter shape appears
      timeoutRef.current = setTimeout(() => step(0), 200);
    },
    [avatarRef]
  );

  return { isPlaying, currentLetter, play, stop };
}
