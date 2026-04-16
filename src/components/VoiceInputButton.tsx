import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useEffect } from "react";
import { toast } from "sonner";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceInputButton({ onTranscript, disabled, className }: VoiceInputButtonProps) {
  const { 
    isListening, 
    isSupported, 
    transcript, 
    interimTranscript,
    startListening, 
    stopListening,
    resetTranscript 
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  const handleClick = () => {
    if (!isSupported) {
      toast.error("Voice input not supported", {
        description: "Your browser doesn't support speech recognition.",
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening((result) => {
        if (result.isFinal) {
          onTranscript(result.transcript);
        }
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "rounded-full transition-all duration-300",
          isListening && "bg-destructive/10 text-destructive animate-pulse",
          className
        )}
      >
        {isListening ? (
          <>
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
            <Mic className="h-5 w-5 relative z-10" />
          </>
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {isListening && interimTranscript && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-card border border-border rounded-lg shadow-lg text-sm max-w-[200px] truncate">
          {interimTranscript}
        </div>
      )}
    </div>
  );
}
