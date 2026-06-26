import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, GripVertical, Minimize2, Maximize2, Download, Circle, Square, Loader2 } from "lucide-react";
import { SignLanguageAvatar } from "@/components/SignLanguageAvatar";
import { useAvatarContext } from "@/contexts/AvatarContext";
import { useAvatarRecorder } from "@/hooks/useAvatarRecorder";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function FloatingAvatar() {
  const { signData, isPlaying, setIsPlaying, isVisible, setIsVisible } = useAvatarContext();
  const [isMinimized, setIsMinimized] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const { isRecording, isProcessing, progress, startRecording, stopRecording, downloadRecording, cancelRecording } = useAvatarRecorder();

  const handlePlayComplete = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleRecord = useCallback(async () => {
    if (isRecording) {
      const url = await stopRecording();
      if (url) {
        await downloadRecording(url);
        toast.success("Recording saved!");
        URL.revokeObjectURL(url);
      } else {
        toast.error("Recording failed");
      }
    } else if (avatarContainerRef.current) {
      startRecording(avatarContainerRef.current, { fps: 12 });
      // Auto-play if not already playing
      if (!isPlaying && signData) {
        setIsPlaying(true);
      }
      toast.info("Recording started — press stop when done");
    }
  }, [isRecording, isPlaying, signData, startRecording, stopRecording, downloadRecording, setIsPlaying]);

  if (!isVisible) return null;

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[998]" />
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={cn(
              "fixed z-[999] pointer-events-auto",
              "bottom-24 right-4 md:bottom-8 md:right-8",
            )}
            style={{ touchAction: "none" }}
          >
            <div className={cn(
              "rounded-2xl border border-border/50 overflow-visible",
              "bg-card/95 backdrop-blur-xl shadow-elevated",
              "transition-all duration-300",
              isMinimized ? "w-16 h-16" : "w-56 md:w-72",
              isRecording && "ring-2 ring-destructive/60 ring-offset-2 ring-offset-background"
            )}>
              {/* Header bar */}
              <div 
                className="flex items-center justify-between px-3 py-2 bg-muted/50 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center gap-1.5">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                  {!isMinimized && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {isRecording ? "● Recording" : "Sign Language"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Record button */}
                  {!isMinimized && !isProcessing && (
                    <button
                      onClick={handleRecord}
                      className={cn(
                        "p-1 rounded-md transition-colors",
                        isRecording 
                          ? "bg-destructive/20 hover:bg-destructive/30" 
                          : "hover:bg-muted"
                      )}
                      title={isRecording ? "Stop recording" : "Record as video"}
                    >
                      {isRecording ? (
                        <Square className="h-3 w-3 text-destructive fill-destructive" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  {isProcessing && (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Minimize2 className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => { 
                      cancelRecording();
                      setIsVisible(false); 
                      setIsPlaying(false); 
                    }}
                    className="p-1 rounded-md hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Processing progress */}
              {isProcessing && (
                <div className="px-3 py-1">
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">Processing...</p>
                </div>
              )}

              {/* Avatar content */}
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col items-center p-3 pb-4"
                >
                  <div ref={avatarContainerRef}>
                    <SignLanguageAvatar
                      signData={signData}
                      isPlaying={isPlaying}
                      onPlayComplete={handlePlayComplete}
                      size="sm"
                    />
                  </div>

                  {/* Sign glosses */}
                  {signData && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {signData.signs.slice(0, 5).map((sign, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground"
                        >
                          {sign.gloss}
                        </span>
                      ))}
                      {signData.signs.length > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">
                          +{signData.signs.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}