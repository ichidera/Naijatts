import { useEffect, useRef } from "react";
import { RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignAvatarViewer } from "@/components/SignAvatarViewer";
import { useFingerspelling3D } from "@/hooks/useFingerspelling3D";
import type { SignAvatar3DHandle } from "@/avatar/SignAvatar3D";

interface SignLanguagePanelProps {
  /** English text to fingerspell. ASL fingerspelling has no letterforms for
   *  Igbo/Hausa/Yoruba/Ikwere diacritics, so this must always be the
   *  English side of the translation — see the two call sites in
   *  TranslationPanel, which resolve this before passing it in. */
  text: string;
}

export function SignLanguagePanel({ text }: SignLanguagePanelProps) {
  const avatarRef = useRef<SignAvatar3DHandle>(null);
  const { isPlaying, currentLetter, play, stop } = useFingerspelling3D(avatarRef);
  const lastPlayed = useRef<string | null>(null);

  // Auto-play whenever the English text actually changes (not on every
  // keystroke re-render — only when the settled value is new).
  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      stop();
      lastPlayed.current = null;
      return;
    }
    if (trimmed === lastPlayed.current) return;
    lastPlayed.current = trimmed;
    play(trimmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!text.trim()) return null;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          Sign Language (ASL fingerspelling)
        </label>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8"
          onClick={() => play(text.trim())}
          disabled={isPlaying}
          title="Replay"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ height: 320 }}>
        <SignAvatarViewer avatarRef={avatarRef} />
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          Letter-by-letter fingerspelling, not full ASL grammar.
        </p>
        <p className="text-xs text-muted-foreground h-4">
          {currentLetter ? `Signing: ${currentLetter}` : "\u00A0"}
        </p>
      </div>
    </div>
  );
}
