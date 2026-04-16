import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Copy, Check, ArrowRightLeft, Loader2, Sparkles, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { PronunciationGuide } from "@/components/PronunciationGuide";
import { SignLanguagePanel } from "@/components/SignLanguagePanel";
import { useTranslation, type TranslationResult } from "@/hooks/useTranslation";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import { usePronunciation } from "@/hooks/usePronunciation";
import { useAvatarContext } from "@/contexts/AvatarContext";

interface TranslationPanelProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSwapLanguages: () => void;
}

export function TranslationPanel({
  sourceLanguage,
  targetLanguage,
  onSwapLanguages,
}: TranslationPanelProps) {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translationSource, setTranslationSource] = useState<"phrase-library" | "ai" | null>(null);
  const [copied, setCopied] = useState(false);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  
  const { translate, translateRealtime, isTranslating } = useTranslation();
  const { speak: speakBrowser, isSpeaking: isSpeakingBrowser, stop: stopBrowser } = useSpeechSynthesis();
  const { speak: speakEL, isSpeaking: isSpeakingEL, isLoading: isELLoading, stop: stopEL, error: elError } = useElevenLabsTTS();
  const { getPronunciation, pronunciationData, isLoading: isPronunciationLoading, clearPronunciation } = usePronunciation();
  const { setSignData, setIsPlaying: setAvatarPlaying, setIsVisible: setAvatarVisible } = useAvatarContext();

  const isSpeaking = useElevenLabs ? isSpeakingEL : isSpeakingBrowser;
  const isAudioLoading = useElevenLabs ? isELLoading : false;

  // Fallback to browser TTS if ElevenLabs fails
  useEffect(() => {
    if (elError && useElevenLabs) {
      console.warn("ElevenLabs failed, falling back to browser TTS");
    }
  }, [elError, useElevenLabs]);

  // Auto-fetch pronunciation when translation completes
  useEffect(() => {
    if (translatedText) {
      getPronunciation(translatedText, targetLanguage);
    } else {
      clearPronunciation();
    }
  }, [translatedText, targetLanguage]);

  // Real-time translation callback
  const handleRealtimeResult = useCallback((result: TranslationResult) => {
    if (result.translation) {
      setTranslatedText(result.translation);
      setTranslationSource(result.source ?? null);
    } else if (result.error) {
      toast.error("Translation failed", { description: result.error });
    }
  }, []);

  // Trigger realtime translation on every input change or target language change
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText("");
      setTranslationSource(null);
      return;
    }
    translateRealtime(inputText, sourceLanguage, targetLanguage, handleRealtimeResult);
  }, [inputText, sourceLanguage, targetLanguage, translateRealtime, handleRealtimeResult]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    const result = await translate(inputText, sourceLanguage, targetLanguage);
    
    if (result.translation) {
      setTranslatedText(result.translation);
      setTranslationSource(result.source ?? null);
    } else if (result.error) {
      toast.error("Translation failed", {
        description: result.error,
      });
    }
  };

  const handleSpeak = async () => {
    if (!translatedText) return;
    
    if (isSpeaking) {
      useElevenLabs ? stopEL() : stopBrowser();
      return;
    }

    if (useElevenLabs) {
      const audioUrl = await speakEL(translatedText);
      if (!audioUrl) {
        // Fallback to browser TTS
        speakBrowser(translatedText, targetLanguage);
      }
    } else {
      speakBrowser(translatedText, targetLanguage);
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVoiceInput = (text: string) => {
    setInputText((prev) => prev + (prev ? " " : "") + text);
  };

  // When sign data is available from SignLanguagePanel, push to floating avatar
  const handleSignDataReady = (data: any) => {
    setSignData(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Language Header */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="glass-card px-6 py-3 rounded-full">
          <span className="font-display font-semibold text-foreground">
            {sourceLanguage}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSwapLanguages}
          className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          disabled={sourceLanguage === "English"}
        >
          <ArrowRightLeft className="h-5 w-5" />
        </Button>
        
        <div className="glass-card px-6 py-3 rounded-full">
          <span className="font-display font-semibold text-foreground">
            {targetLanguage}
          </span>
        </div>
      </div>

      {/* Translation Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Enter text in {sourceLanguage}
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type or speak ${sourceLanguage} text...`}
            className="min-h-[160px] bg-transparent border-none resize-none text-lg focus-visible:ring-0 p-0"
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {inputText.length} characters
              </span>
              <VoiceInputButton onTranscript={handleVoiceInput} />
            </div>
            <div className="flex items-center gap-2">
              {isTranslating && (
                <span className="flex items-center gap-1.5 text-xs text-primary animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Translating...
                </span>
              )}
              <Button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Zap className="h-4 w-4 mr-1.5" />
                Translate
              </Button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-muted-foreground block">
              Translation in {targetLanguage}
            </label>
            {translationSource && (
              <span className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                translationSource === "phrase-library"
                  ? "bg-secondary/20 text-secondary-foreground"
                  : "bg-primary/10 text-primary"
              )}>
                {translationSource === "phrase-library" ? (
                  <><BookOpen className="h-3 w-3" /> Phrase Library</>
                ) : (
                  <><Sparkles className="h-3 w-3" /> AI Translated</>
                )}
              </span>
            )}
          </div>
          <div className="min-h-[160px]">
            {isTranslating && !translatedText ? (
              <div className="flex items-center gap-2 text-muted-foreground/70 italic">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-lg">Translating...</p>
              </div>
            ) : translatedText ? (
              <p className="text-lg text-foreground leading-relaxed">
                {translatedText}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground/50 italic">
                Start typing to translate...
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                disabled={!translatedText || isAudioLoading}
                className={cn(
                  "rounded-full",
                  isSpeaking && "text-primary"
                )}
              >
                {isAudioLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isSpeaking ? (
                  <>
                    <div className="absolute animate-pulse-ring rounded-full w-10 h-10 bg-primary/20" />
                    <Volume2 className="h-5 w-5" />
                  </>
                ) : translatedText ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!translatedText}
                className="rounded-full"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-secondary" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
            <button 
              onClick={() => setUseElevenLabs(!useElevenLabs)}
              className={cn(
                "flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors",
                useElevenLabs 
                  ? "bg-accent/20 text-accent-foreground" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Sparkles className="h-3 w-3" />
              {useElevenLabs ? "HD Audio" : "Basic Audio"}
            </button>
          </div>
        </div>
      </div>

      {/* Auto-shown Pronunciation Guide */}
      {translatedText && (
        <div className="mt-4 space-y-4">
          <PronunciationGuide
            text={translatedText}
            language={targetLanguage}
            pronunciationData={pronunciationData}
            isLoading={isPronunciationLoading}
          />
          
          {/* Sign Language Panel */}
          <SignLanguagePanel
            text={translatedText}
            sourceLanguage={targetLanguage}
            onSignDataReady={handleSignDataReady}
          />
        </div>
      )}
    </div>
  );
}
