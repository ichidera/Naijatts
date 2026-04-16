import { Volume2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { cn } from "@/lib/utils";

interface PronunciationData {
  ipa: string;
  phonetic: string;
  syllables: string;
  tips: string[];
  toneMarkers: string;
}

interface PronunciationGuideProps {
  text: string;
  language: string;
  pronunciationData: PronunciationData | null;
  isLoading: boolean;
  className?: string;
}

export function PronunciationGuide({ text, language, pronunciationData, isLoading, className }: PronunciationGuideProps) {
  const { speak, isSpeaking } = useSpeechSynthesis();

  const handleSpeak = () => {
    speak(text, language);
  };

  const handleSpeakSlow = () => {
    speak(text, language, { rate: 0.6 });
  };

  if (!text) return null;

  return (
    <div className={cn("glass-card rounded-2xl p-6 animate-fade-in", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="font-display font-semibold text-foreground">How to Pronounce</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSpeakSlow}
            disabled={isSpeaking || isLoading}
            className="rounded-full text-xs"
          >
            <Volume2 className="h-3 w-3 mr-1" />
            Slow
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSpeak}
            disabled={isSpeaking || isLoading}
            className="rounded-full text-xs"
          >
            <Volume2 className={cn("h-3 w-3 mr-1", isSpeaking && "animate-pulse")} />
            Listen
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Generating pronunciation...</span>
        </div>
      )}

      {pronunciationData && !isLoading && (
        <div className="space-y-4">
          {/* Main phonetic - Large and prominent */}
          {pronunciationData.phonetic && (
            <div className="bg-primary/5 rounded-xl p-4 text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">Say it like this</span>
              <p className="text-2xl md:text-3xl font-bold text-primary">{pronunciationData.phonetic}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* IPA */}
            {pronunciationData.ipa && (
              <div className="bg-muted/30 rounded-lg p-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">IPA Notation</span>
                <p className="text-base font-mono text-foreground">{pronunciationData.ipa}</p>
              </div>
            )}

            {/* Syllables */}
            {pronunciationData.syllables && (
              <div className="bg-muted/30 rounded-lg p-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">Syllable Breakdown</span>
                <p className="text-base text-foreground">{pronunciationData.syllables}</p>
              </div>
            )}
          </div>

          {/* Tones */}
          {pronunciationData.toneMarkers && (
            <div className="bg-accent/10 rounded-lg p-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">Tone Pattern</span>
              <p className="text-sm text-foreground">{pronunciationData.toneMarkers}</p>
            </div>
          )}

          {/* Tips */}
          {pronunciationData.tips && pronunciationData.tips.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Quick Tips</span>
              <ul className="text-sm text-muted-foreground space-y-1">
                {pronunciationData.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
