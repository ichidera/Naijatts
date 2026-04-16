import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { SignGesture, SignLanguageData } from "@/hooks/useSignLanguage";
import { handShapes } from "@/data/avatarHandShapes";
import { facialExpressions } from "@/data/avatarExpressions";

interface SignLanguageAvatarProps {
  signData: SignLanguageData | null;
  isPlaying: boolean;
  onPlayComplete?: () => void;
  size?: "sm" | "md" | "lg";
}

export function SignLanguageAvatar({ 
  signData, 
  isPlaying, 
  onPlayComplete,
  size = "md" 
}: SignLanguageAvatarProps) {
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<"idle" | "intro" | "signing" | "outro">("idle");
  const [waveFrame, setWaveFrame] = useState(0);
  const [blinkState, setBlinkState] = useState(false);
  const [breathePhase, setBreathePhase] = useState(0);

  const currentSign = useMemo(() => {
    if (!signData?.signs?.length) return null;
    return signData.signs[currentSignIndex] || null;
  }, [signData, currentSignIndex]);

  const sizeClasses = {
    sm: "w-32 h-40",
    md: "w-48 h-60",
    lg: "w-64 h-80"
  };

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Breathing animation
  useEffect(() => {
    const breatheInterval = setInterval(() => {
      setBreathePhase(prev => (prev + 1) % 60);
    }, 50);
    return () => clearInterval(breatheInterval);
  }, []);

  // Wave animation for intro/outro
  useEffect(() => {
    if (animationPhase !== "intro" && animationPhase !== "outro") return;
    const interval = setInterval(() => {
      setWaveFrame(prev => (prev + 1) % 4);
    }, 200);
    return () => clearInterval(interval);
  }, [animationPhase]);

  useEffect(() => {
    if (!isPlaying || !signData?.signs?.length) {
      setCurrentSignIndex(0);
      setAnimationPhase("idle");
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    setAnimationPhase("intro");
    timeoutId = setTimeout(() => {
      setAnimationPhase("signing");
      
      const playNextSign = (index: number) => {
        if (index >= signData.signs.length) {
          setAnimationPhase("outro");
          timeoutId = setTimeout(() => {
            setAnimationPhase("idle");
            setCurrentSignIndex(0);
            onPlayComplete?.();
          }, 600);
          return;
        }

        setCurrentSignIndex(index);
        const duration = signData.signs[index].duration || 1000;
        
        timeoutId = setTimeout(() => {
          playNextSign(index + 1);
        }, duration);
      };

      playNextSign(0);
    }, 500);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, signData, onPlayComplete]);

  const getHandPosition = (sign: SignGesture | null, phase: "start" | "end") => {
    if (!sign) return { x: 0, y: 0 };
    const pos = phase === "start" ? sign.dominantHand.startPosition : sign.dominantHand.endPosition;
    return {
      x: pos.x * 40,
      y: pos.y * -40
    };
  };

  const isWaving = animationPhase === "intro" || animationPhase === "outro";
  const handShape = isWaving ? "wave" : (currentSign?.handShape || "open_5");
  const handSvg = handShapes[handShape] || handShapes.open_5;
  const expression = isWaving ? "smile" : (currentSign?.facialExpression || "neutral");
  const face = facialExpressions[expression] || facialExpressions.neutral;

  const handPosition = isWaving
    ? { x: -25 + Math.sin(waveFrame * 1.2) * 10, y: -50 + Math.cos(waveFrame * 0.8) * 5 }
    : getHandPosition(currentSign, animationPhase === "signing" ? "end" : "start");
  
  const bodyLean = currentSign?.bodyMovement === "lean_forward" ? 3 : 
                   currentSign?.bodyMovement === "lean_back" ? -3 : 0;

  const waveRotation = isWaving ? Math.sin(waveFrame * 1.5) * 20 : 0;

  const pupilOffsetX = face.leftPupilOffset?.x || (handPosition.x > 0 ? 1.5 : handPosition.x < -10 ? -1.5 : 0);
  const pupilOffsetY = face.rightPupilOffset?.y || (handPosition.y < -20 ? -1 : 0);

  const breatheOffset = Math.sin(breathePhase * 0.105) * 1.5;

  // Eye path when blinking
  const eyePath = blinkState 
    ? "M76 90 Q85 90 94 90 M106 90 Q115 90 124 90" 
    : face.eyes;

  return (
    <div className={cn(
      "relative flex flex-col items-center",
      sizeClasses[size]
    )}>
      <motion.div 
        className="relative w-full h-full"
        animate={{ 
          rotateZ: bodyLean,
          y: currentSign?.bodyMovement === "head_nod" ? [0, -3, 0] : breatheOffset
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 300" className="w-full h-full">
          <defs>
            <radialGradient id="avatarGlow" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5E3C" />
              <stop offset="50%" stopColor="#7A4F30" />
              <stop offset="100%" stopColor="#6B4226" />
            </linearGradient>
            <linearGradient id="skinHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A0704D" />
              <stop offset="100%" stopColor="#8B5E3C" />
            </linearGradient>
            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A1A1A" />
              <stop offset="100%" stopColor="#0D0D0D" />
            </linearGradient>
            <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A0704D" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#A0704D" stopOpacity="0" />
            </radialGradient>
            <filter id="avatarShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#00000030" />
            </filter>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <filter id="innerShadow">
              <feFlood floodColor="#00000020" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background glow */}
          <ellipse cx="100" cy="120" rx="90" ry="110" fill="url(#avatarGlow)" />

          {/* Body/Shirt */}
          <motion.ellipse 
            cx="100" cy="260" rx="55" ry="45" 
            fill="url(#shirtGrad)"
            filter="url(#avatarShadow)"
            initial={{ scale: 1 }}
            animate={{ scale: animationPhase === "signing" ? 1.02 : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <ellipse cx="90" cy="250" rx="20" ry="15" fill="hsl(var(--primary) / 0.2)" />
          {/* Collar detail */}
          <path d="M85 218 Q100 230 115 218" stroke="hsl(var(--primary) / 0.6)" strokeWidth="2" fill="none" />

          {/* Neck */}
          <rect x="87" y="170" width="26" height="35" fill="url(#skinGrad)" rx="5" />
          <rect x="87" y="195" width="26" height="10" fill="#6B4226" rx="3" opacity="0.25" />
          {/* Neck tendon */}
          <path d="M95 175 L95 200" stroke="#6B4226" strokeWidth="0.5" opacity="0.15" />
          <path d="M105 175 L105 200" stroke="#6B4226" strokeWidth="0.5" opacity="0.15" />

          {/* Head */}
          <motion.ellipse 
            cx="100" cy="100" rx="50" ry="60" 
            fill="url(#skinGrad)"
            filter="url(#avatarShadow)"
            animate={{ 
              rotateZ: currentSign?.bodyMovement === "head_shake" ? [-5, 5, -5, 0] : 0 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          {/* Face contour highlight */}
          <ellipse cx="100" cy="95" rx="44" ry="52" fill="url(#skinHighlight)" opacity="0.3" />
          
          {/* Cheek highlights */}
          <circle cx="72" cy="112" r="12" fill="url(#cheekGlow)" />
          <circle cx="128" cy="112" r="12" fill="url(#cheekGlow)" />

          {/* Hair */}
          <path 
            d="M48 92 Q48 38 100 32 Q152 38 152 92 Q147 58 100 50 Q53 58 48 92" 
            fill="url(#hairGrad)"
            filter="url(#avatarShadow)"
          />
          {/* Hair texture lines */}
          <path d="M65 48 Q82 42 100 44 Q118 42 135 48" stroke="#2A2A2A" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M58 58 Q78 50 100 52 Q122 50 142 58" stroke="#2A2A2A" strokeWidth="1" fill="none" opacity="0.3" />
          {/* Hair shine */}
          <path d="M75 42 Q88 38 100 40" stroke="#3A3A3A" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />

          {/* Ears */}
          <ellipse cx="50" cy="105" rx="8" ry="15" fill="url(#skinGrad)" />
          <ellipse cx="150" cy="105" rx="8" ry="15" fill="url(#skinGrad)" />
          <ellipse cx="52" cy="105" rx="4" ry="8" fill="#7A4F30" opacity="0.4" />
          <ellipse cx="148" cy="105" rx="4" ry="8" fill="#7A4F30" opacity="0.4" />
          {/* Earring */}
          <circle cx="50" cy="118" r="2" fill="hsl(var(--primary))" opacity="0.6" />

          {/* Eyes with blink */}
          <motion.path 
            d={eyePath}
            stroke="#1A0F0A" 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
            animate={{ d: eyePath }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          />
          {/* Eye whites */}
          {!blinkState && (
            <>
              <ellipse cx="85" cy="90" rx="9" ry="6" fill="white" opacity="0.9" />
              <ellipse cx="115" cy="90" rx="9" ry="6" fill="white" opacity="0.9" />
            </>
          )}
          {/* Pupils */}
          {!blinkState && (
            <>
              <motion.circle 
                cx={85 + pupilOffsetX} cy={92 + pupilOffsetY} r="4.5" fill="#1A0F0A"
                animate={{ cx: 85 + pupilOffsetX, cy: 92 + pupilOffsetY }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              <motion.circle 
                cx={115 + pupilOffsetX} cy={92 + pupilOffsetY} r="4.5" fill="#1A0F0A"
                animate={{ cx: 115 + pupilOffsetX, cy: 92 + pupilOffsetY }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              {/* Iris ring */}
              <motion.circle 
                cx={85 + pupilOffsetX} cy={92 + pupilOffsetY} r="4.5" 
                fill="none" stroke="#2C1810" strokeWidth="1" opacity="0.3"
                animate={{ cx: 85 + pupilOffsetX, cy: 92 + pupilOffsetY }}
                transition={{ duration: 0.2 }}
              />
              <motion.circle 
                cx={115 + pupilOffsetX} cy={92 + pupilOffsetY} r="4.5" 
                fill="none" stroke="#2C1810" strokeWidth="1" opacity="0.3"
                animate={{ cx: 115 + pupilOffsetX, cy: 92 + pupilOffsetY }}
                transition={{ duration: 0.2 }}
              />
              {/* Eye highlights */}
              <circle cx={87 + pupilOffsetX} cy={90 + pupilOffsetY} r="1.8" fill="white" />
              <circle cx={117 + pupilOffsetX} cy={90 + pupilOffsetY} r="1.8" fill="white" />
              <circle cx={84 + pupilOffsetX} cy={93 + pupilOffsetY} r="0.8" fill="white" opacity="0.6" />
              <circle cx={114 + pupilOffsetX} cy={93 + pupilOffsetY} r="0.8" fill="white" opacity="0.6" />
            </>
          )}
          {/* Eyelashes */}
          <path d="M74 87 L72 84" stroke="#1A0F0A" strokeWidth="1" strokeLinecap="round" />
          <path d="M96 87 L98 84" stroke="#1A0F0A" strokeWidth="1" strokeLinecap="round" />
          <path d="M104 87 L102 84" stroke="#1A0F0A" strokeWidth="1" strokeLinecap="round" />
          <path d="M126 87 L128 84" stroke="#1A0F0A" strokeWidth="1" strokeLinecap="round" />

          {/* Eyebrows */}
          <motion.path 
            d={face.eyebrows.split(" M")[0]} 
            stroke="#1A0F0A" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            animate={{ d: face.eyebrows.split(" M")[0] }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.path 
            d={"M" + face.eyebrows.split(" M")[1]} 
            stroke="#1A0F0A" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            animate={{ d: "M" + face.eyebrows.split(" M")[1] }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />

          {/* Nose */}
          <path d="M97 105 Q100 115 103 105" stroke="#6B4226" strokeWidth="1.8" fill="none" />
          <path d="M94 112 Q97 116 100 114 Q103 116 106 112" stroke="#6B4226" strokeWidth="1.2" fill="none" opacity="0.5" />

          {/* Mouth */}
          <motion.path 
            d={face.mouth}
            stroke="#5C2D12"
            strokeWidth="2.5"
            fill={face.mouthFill || expression === "surprised" ? "#4A2410" : "none"}
            strokeLinecap="round"
            animate={{ d: face.mouth }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          {/* Lip shine */}
          {(expression === "smile" || expression === "big_smile") && (
            <path d="M92 128 Q100 126 108 128" stroke="#7A4F30" strokeWidth="0.8" fill="none" opacity="0.4" />
          )}

          {/* Chin dimple */}
          <path d="M97 148 Q100 150 103 148" stroke="#6B4226" strokeWidth="0.8" fill="none" opacity="0.2" />

          {/* Arms */}
          <path d="M60 210 Q45 220 35 250" stroke="url(#shirtGrad)" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M140 210 Q155 220 165 250" stroke="url(#shirtGrad)" strokeWidth="16" fill="none" strokeLinecap="round" />
          {/* Shoulder seams */}
          <path d="M62 212 Q55 218 48 228" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" fill="none" />
          <path d="M138 212 Q145 218 152 228" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" fill="none" />
        </svg>

        {/* Dominant Hand */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`hand-${currentSignIndex}-${handShape}-${animationPhase}`}
            className="absolute"
            style={{ 
              bottom: "25%",
              right: "5%",
              width: "28%",
              height: "22%"
            }}
            initial={{ 
              x: 0, y: 0, rotate: 0, scale: 0.85, opacity: 0.6
            }}
            animate={{ 
              x: handPosition.x,
              y: handPosition.y,
              rotate: isWaving ? waveRotation : (currentSign?.dominantHand.rotation || 0),
              scale: 1,
              opacity: 1
            }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 180,
              damping: 22,
              mass: 0.8,
            }}
          >
            <svg viewBox={handSvg.viewBox} className="w-full h-full drop-shadow-lg">
              <defs>
                <linearGradient id="handSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5E3C" />
                  <stop offset="50%" stopColor="#7A4F30" />
                  <stop offset="100%" stopColor="#6B4226" />
                </linearGradient>
              </defs>
              <motion.path
                d={handSvg.path}
                fill="url(#handSkinGrad)"
                stroke="#5C3A20"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </AnimatePresence>

        {/* Non-dominant hand */}
        {currentSign?.nonDominantHand && (
          <motion.div
            className="absolute"
            style={{ 
              bottom: "25%",
              left: "5%",
              width: "25%",
              height: "20%"
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              x: currentSign.nonDominantHand.startPosition.x * 30,
              y: currentSign.nonDominantHand.startPosition.y * -30,
              rotate: currentSign.nonDominantHand.rotation
            }}
            transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.8 }}
          >
            <svg viewBox={handSvg.viewBox} className="w-full h-full drop-shadow-lg transform -scale-x-100">
              <path
                d={handSvg.path}
                fill="#7A4F30"
                stroke="#5C3A20"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Current word indicator */}
      <AnimatePresence mode="wait">
        {isPlaying && (
          <motion.div
            key={isWaving ? "wave" : currentSign?.word}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute -bottom-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {isWaving ? (animationPhase === "intro" ? "👋 Hello!" : "👋 Done!") : currentSign?.gloss}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
