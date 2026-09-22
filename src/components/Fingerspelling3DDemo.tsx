import { useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignAvatarViewer } from "@/components/SignAvatarViewer";
import { useFingerspelling3D } from "@/hooks/useFingerspelling3D";
import type { SignAvatar3DHandle } from "@/avatar/SignAvatar3D";

export function Fingerspelling3DDemo() {
  const avatarRef = useRef<SignAvatar3DHandle>(null);
  const [word, setWord] = useState("HELLO");
  const { isPlaying, currentLetter, play, stop } = useFingerspelling3D(avatarRef);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="glass-card rounded-2xl overflow-hidden" style={{ height: 480 }}>
        <SignAvatarViewer avatarRef={avatarRef} />
      </div>

      <div className="flex items-center gap-3">
        <Input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type a word to fingerspell"
          maxLength={24}
          onKeyDown={(e) => e.key === "Enter" && !isPlaying && play(word)}
        />
        {isPlaying ? (
          <Button variant="outline" onClick={stop} className="gap-2">
            <Square className="h-4 w-4" /> Stop
          </Button>
        ) : (
          <Button onClick={() => play(word)} className="gap-2">
            <Play className="h-4 w-4" /> Play
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center h-5">
        {currentLetter ? `Signing: ${currentLetter}` : "\u00A0"}
      </p>
    </div>
  );
}
