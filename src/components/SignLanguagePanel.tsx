import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, Play, Pause, RotateCcw, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignLanguageAvatar } from "@/components/SignLanguageAvatar";
import { useSignLanguage } from "@/hooks/useSignLanguage";
import { useAvatarContext } from "@/contexts/AvatarContext";
import { cn } from "@/lib/utils";

interface SignLanguagePanelProps {
  text: string;
  sourceLanguage: string;
  onSignDataReady?: (data: any) => void;
}

export function SignLanguagePanel({ text, sourceLanguage, onSignDataReady }: SignLanguagePanelProps) {
  const [signType, setSignType] = useState<"NSL" | "ASL">("NSL");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { getSignLanguage, signData, isLoading, error, clearSignData } = useSignLanguage();
  const { setSignData: setFloatingSignData, setIsVisible, setIsPlaying: setFloatingPlaying } = useAvatarContext();

  // Auto-fetch when text changes and panel is expanded
  useEffect(() => {
    if (text && isExpanded) {
      getSignLanguage(text, sourceLanguage, signType);
    }
  }, [text, signType, isExpanded]);

  // Push sign data to floating avatar
  useEffect(() => {
    if (signData) {
      onSignDataReady?.(signData);
    }
  }, [signData, onSignDataReady]);

  useEffect(() => {
    if (!text) {
      clearSignData();
      setIsPlaying(false);
    }
  }, [text]);

  const handlePlayPause = () => {
    if (!signData) return;
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handlePlayComplete = () => {
    setIsPlaying(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    if (text && !signData) {
      getSignLanguage(text, sourceLanguage, signType);
    }
  };

  const handlePopOut = () => {
    if (signData) {
      setFloatingSignData(signData);
      setIsVisible(true);
      setFloatingPlaying(true);
    }
  };

  if (!text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => isExpanded ? setIsExpanded(false) : handleExpand()}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Hand className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">
              Sign Language
            </h3>
            <p className="text-sm text-muted-foreground">
              {signType === "NSL" ? "Nigerian Sign Language" : "American Sign Language"}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {/* Sign Language Type Toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  onClick={() => setSignType("NSL")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    signType === "NSL" 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  🇳🇬 NSL
                </button>
                <button
                  onClick={() => setSignType("ASL")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    signType === "ASL" 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  🇺🇸 ASL
                </button>
              </div>

              {/* Avatar Display */}
              <div className="flex flex-col items-center py-6 bg-gradient-to-b from-muted/30 to-transparent rounded-xl">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Preparing sign language...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-destructive mb-2">Failed to load</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => getSignLanguage(text, sourceLanguage, signType)}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <SignLanguageAvatar
                    signData={signData}
                    isPlaying={isPlaying}
                    onPlayComplete={handlePlayComplete}
                    size="lg"
                  />
                )}
              </div>

              {/* Controls */}
              {signData && !isLoading && (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReplay}
                    className="rounded-full"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="rounded-full px-8 gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        Play Signs
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePopOut}
                    className="rounded-full"
                    title="Pop out to floating avatar"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Sign sequence indicator */}
              {signData && signData.signs.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {signData.signs.map((sign, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "px-2 py-1 text-xs rounded-md transition-colors",
                        "bg-muted text-muted-foreground"
                      )}
                    >
                      {sign.gloss}
                    </span>
                  ))}
                </div>
              )}

              {/* Note */}
              {signData?.note && (
                <p className="text-xs text-muted-foreground text-center italic">
                  {signData.note}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
