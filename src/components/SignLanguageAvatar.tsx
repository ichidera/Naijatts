import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types (kept identical to existing interface) ────────────────────────────

export interface HandPosition {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

export interface HandData {
  startPosition: HandPosition;
  endPosition: HandPosition;
  rotation: number;
}

export interface SignGesture {
  handShape: string;
  dominantHand: HandData;
  nonDominantHand: HandData | null;
  bodyMovement: string;
  facialExpression: string;
  duration: number;
  gloss?: string;
  word?: string;
}

export interface SignLanguageData {
  signs: SignGesture[];
  note?: string;
}

interface SignLanguageAvatarProps {
  signData: SignLanguageData | null;
  isPlaying: boolean;
  onPlayComplete?: () => void;
  size?: "sm" | "md" | "lg";
}

// ─── Canvas constants (native 300×400 space) ─────────────────────────────────
const CW = 300;
const CH = 400;

// Skin palette
const SKIN_BASE   = "#7A4F30";
const SKIN_LIGHT  = "#8B5E3C";
const SKIN_SHADOW = "#5C3A20";
const SHIRT_COLOR = "#4F7942"; // earthy green - distinct from skin

// ─── Lerp helpers ────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpClamped(a: number, b: number, t: number) { return lerp(a, b, Math.min(1, Math.max(0, t))); }

// ─── Arm angle mapping ───────────────────────────────────────────────────────
// dominantHand is the RIGHT arm; nonDominantHand is the LEFT arm
// x: -1..1 → shoulder yaw angle
// y: -1..1 → forearm pitch offset

function mapDominantAngles(end: HandPosition): { upperAngle: number; forearmAngle: number } {
  // RIGHT arm: shoulder angle → 0 (down) to -1.2 (raised toward head-right)
  // x=1 = far right = arm up & outward; y=1 = head level
  const upperAngle  = lerp(0.3, -1.1, (end.x + 1) / 2) + lerp(0.2, -0.3, (end.y + 1) / 2);
  const forearmAngle = lerp(0.1, -0.6, (end.y + 1) / 2);
  return { upperAngle, forearmAngle };
}

function mapNonDominantAngles(end: HandPosition): { upperAngle: number; forearmAngle: number } {
  // LEFT arm: mirror of dominant
  const upperAngle  = lerp(-0.3, 1.1, (end.x + 1) / 2) + lerp(0.2, -0.3, (end.y + 1) / 2);
  const forearmAngle = lerp(0.1, -0.6, (end.y + 1) / 2);
  return { upperAngle, forearmAngle };
}

// ─── Hand shape drawing ───────────────────────────────────────────────────────
// All drawn relative to wrist point (cx=0, cy=0), then translated
function drawHand(
  ctx: CanvasRenderingContext2D,
  shape: string,
  cx: number,
  cy: number,
  angle: number,   // wrist rotation in radians
  flip: boolean    // true for left hand
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  if (flip) ctx.scale(-1, 1);

  ctx.fillStyle = SKIN_BASE;
  ctx.strokeStyle = SKIN_SHADOW;
  ctx.lineWidth = 1.2;

  switch (shape) {
    case "fist": {
      ctx.beginPath();
      ctx.roundRect(-9, -8, 18, 14, 4);
      ctx.fill(); ctx.stroke();
      // knuckle lines
      ctx.strokeStyle = SKIN_SHADOW;
      ctx.lineWidth = 0.7;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-5 + i * 5, -6);
        ctx.lineTo(-5 + i * 5, -2);
        ctx.stroke();
      }
      break;
    }
    case "point": {
      // fist
      ctx.beginPath();
      ctx.roundRect(-9, 0, 18, 12, 4);
      ctx.fill(); ctx.stroke();
      // index finger
      ctx.beginPath();
      ctx.roundRect(-3, -18, 6, 14, 3);
      ctx.fill(); ctx.stroke();
      break;
    }
    case "flat_hand": {
      ctx.beginPath();
      ctx.roundRect(-10, -18, 20, 28, 3);
      ctx.fill(); ctx.stroke();
      // finger lines
      ctx.strokeStyle = SKIN_SHADOW;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-4 + i * 4, -18);
        ctx.lineTo(-4 + i * 4, -4);
        ctx.stroke();
      }
      break;
    }
    case "c_shape": {
      ctx.beginPath();
      ctx.arc(0, 0, 13, Math.PI * 0.2, Math.PI * 1.8);
      ctx.lineWidth = 7;
      ctx.strokeStyle = SKIN_BASE;
      ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = SKIN_SHADOW;
      ctx.beginPath();
      ctx.arc(0, 0, 13, Math.PI * 0.2, Math.PI * 1.8);
      ctx.stroke();
      break;
    }
    case "o_shape": {
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = SKIN_BASE;
      ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = SKIN_SHADOW;
      ctx.stroke();
      break;
    }
    case "thumbs_up": {
      // fist
      ctx.beginPath();
      ctx.roundRect(-8, 0, 16, 12, 4);
      ctx.fill(); ctx.stroke();
      // thumb
      ctx.beginPath();
      ctx.roundRect(-12, -14, 8, 18, 4);
      ctx.fill(); ctx.stroke();
      break;
    }
    case "wave": {
      // open hand, slightly spread
      ctx.beginPath();
      // palm
      ctx.roundRect(-9, -4, 18, 14, 3);
      ctx.fill();
      // fingers fanned
      const angles2 = [-0.4, -0.15, 0.05, 0.25, 0.45];
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate(angles2[i]);
        ctx.beginPath();
        ctx.roundRect(-3, -20, 5.5, 16, 2.5);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      ctx.stroke();
      break;
    }
    case "open_5":
    case "spread": {
      ctx.beginPath();
      ctx.roundRect(-9, -4, 18, 14, 3);
      ctx.fill();
      const fanAngles = [-0.5, -0.2, 0.0, 0.2, 0.45];
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate(fanAngles[i]);
        ctx.beginPath();
        ctx.roundRect(-3, -20, 5.5, 16, 2.5);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      ctx.stroke();
      break;
    }
    case "pinch": {
      // fist-like with thumb-index touching
      ctx.beginPath();
      ctx.roundRect(-9, -4, 18, 14, 4);
      ctx.fill(); ctx.stroke();
      // thumb + index pinch
      ctx.beginPath();
      ctx.arc(-6, -10, 4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(2, -12, 4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      break;
    }
    case "bent_v": {
      ctx.beginPath();
      ctx.roundRect(-9, -2, 18, 12, 4);
      ctx.fill(); ctx.stroke();
      // bent index
      ctx.save();
      ctx.rotate(-0.15);
      ctx.beginPath();
      ctx.roundRect(-6, -16, 5, 10, 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-5.5, -22, 4.5, 8, 2);
      ctx.rotate(0.3);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      // bent middle
      ctx.save();
      ctx.rotate(0.2);
      ctx.beginPath();
      ctx.roundRect(0, -16, 5, 10, 2);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "hook": {
      ctx.beginPath();
      ctx.roundRect(-9, -2, 18, 12, 4);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, -2);
      ctx.quadraticCurveTo(-4, -14, 2, -16);
      ctx.quadraticCurveTo(8, -14, 6, -6);
      ctx.lineWidth = 5;
      ctx.strokeStyle = SKIN_BASE;
      ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = SKIN_SHADOW;
      ctx.stroke();
      break;
    }
    case "clap": {
      ctx.beginPath();
      ctx.roundRect(-11, -5, 22, 18, 3);
      ctx.fill(); ctx.stroke();
      break;
    }
    case "love":
    case "horns": {
      ctx.beginPath();
      ctx.roundRect(-9, -2, 18, 14, 4);
      ctx.fill(); ctx.stroke();
      // pinky
      ctx.save(); ctx.rotate(-0.4);
      ctx.beginPath(); ctx.roundRect(-10, -18, 5, 14, 2);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      // index
      ctx.save(); ctx.rotate(0.3);
      ctx.beginPath(); ctx.roundRect(4, -20, 5, 16, 2);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      // thumb (for love)
      if (shape === "love") {
        ctx.save(); ctx.rotate(0.9);
        ctx.beginPath(); ctx.roundRect(-14, -10, 5, 12, 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      break;
    }
    case "palm_down":
    case "beckon": {
      ctx.save();
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.roundRect(-10, -18, 20, 28, 3);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "emphasis_push":
    case "claw": {
      // Fingers curled outward
      ctx.beginPath();
      ctx.roundRect(-9, -6, 18, 14, 3);
      ctx.fill(); ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(-8 + i * 5.5, -6);
        ctx.rotate(-0.6);
        ctx.beginPath();
        ctx.roundRect(-2.5, -12, 5, 10, 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      break;
    }
    case "snap":
    case "index_middle": {
      ctx.beginPath();
      ctx.roundRect(-9, -2, 18, 12, 4);
      ctx.fill(); ctx.stroke();
      // two fingers
      ctx.save(); ctx.rotate(-0.12);
      ctx.beginPath(); ctx.roundRect(-7, -18, 5, 14, 2);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.rotate(0.12);
      ctx.beginPath(); ctx.roundRect(1, -18, 5, 14, 2);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    default: {
      // fallback: open_5
      ctx.beginPath();
      ctx.roundRect(-9, -4, 18, 14, 3);
      ctx.fill();
      const fa = [-0.5, -0.2, 0.0, 0.2, 0.45];
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate(fa[i]);
        ctx.beginPath();
        ctx.roundRect(-3, -20, 5.5, 16, 2.5);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ─── Draw a capsule (arm segment) between two points ─────────────────────────
function drawCapsule(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  radius: number,
  fill: string
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.001) return;
  const nx = -dy / len, ny = dx / len;
  ctx.beginPath();
  ctx.moveTo(x1 + nx * radius, y1 + ny * radius);
  ctx.lineTo(x2 + nx * radius, y2 + ny * radius);
  ctx.arc(x2, y2, radius, Math.atan2(dy, dx) + Math.PI / 2, Math.atan2(dy, dx) - Math.PI / 2, false);
  ctx.lineTo(x1 - nx * radius, y1 - ny * radius);
  ctx.arc(x1, y1, radius, Math.atan2(dy, dx) - Math.PI / 2, Math.atan2(dy, dx) + Math.PI / 2, false);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = SKIN_SHADOW;
  ctx.lineWidth = 1;
  ctx.stroke();
}

// ─── Animation state object ───────────────────────────────────────────────────
interface ArmState {
  upperAngle: number;
  forearmAngle: number;
  handShape: string;
  handRotation: number;
}

interface FaceState {
  expression: string;
  headOffsetX: number;
  headOffsetY: number;
}

interface AnimState {
  right: ArmState;
  left: ArmState;
  face: FaceState;
  bodyLean: number;
}

function defaultAnimState(): AnimState {
  return {
    right: { upperAngle: 0.25, forearmAngle: 0.15, handShape: "open_5", handRotation: 0 },
    left:  { upperAngle: -0.25, forearmAngle: 0.15, handShape: "open_5", handRotation: 0 },
    face: { expression: "neutral", headOffsetX: 0, headOffsetY: 0 },
    bodyLean: 0,
  };
}

// ─── Main component ───────────────────────────────────────────────────────────
export function SignLanguageAvatar({
  signData,
  isPlaying,
  onPlayComplete,
  size = "md",
}: SignLanguageAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  // Mutable animation state (not React state, to avoid re-render loops)
  const stateRef   = useRef<AnimState>(defaultAnimState());
  const targetRef  = useRef<AnimState>(defaultAnimState());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Idle counters
  const breatheRef = useRef(0);
  const blinkRef   = useRef({ countdown: 180, active: false, frame: 0 });
  const headWobRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 }); // for head_nod / head_shake

  // ── Size mapping ──────────────────────────────────────────────────────────
  const sizes = { sm: [160, 200], md: [192, 240], lg: [256, 320] };
  const [dispW, dispH] = sizes[size];

  // ── Clear all playback timeouts ───────────────────────────────────────────
  const clearPlayTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // ── Apply a SignGesture to target state ───────────────────────────────────
  const applySign = useCallback((sign: SignGesture) => {
    const t = targetRef.current;

    // Right (dominant) arm
    const { upperAngle: rUpper, forearmAngle: rForearm } =
      mapDominantAngles(sign.dominantHand.endPosition);
    t.right.upperAngle   = rUpper;
    t.right.forearmAngle = rForearm;
    t.right.handShape    = sign.handShape;
    t.right.handRotation = sign.dominantHand.rotation * (Math.PI / 180);

    // Left (non-dominant) arm
    if (sign.nonDominantHand) {
      const { upperAngle: lUpper, forearmAngle: lForearm } =
        mapNonDominantAngles(sign.nonDominantHand.endPosition);
      t.left.upperAngle   = lUpper;
      t.left.forearmAngle = lForearm;
      t.left.handShape    = sign.handShape; // mirror same shape
      t.left.handRotation = sign.nonDominantHand.rotation * (Math.PI / 180);
    } else {
      // Rest left arm
      t.left.upperAngle   = -0.25;
      t.left.forearmAngle = 0.15;
      t.left.handShape    = "open_5";
      t.left.handRotation = 0;
    }

    // Face
    t.face.expression = sign.facialExpression || "neutral";

    // Body
    t.bodyLean = sign.bodyMovement === "lean_forward"  ?  4
               : sign.bodyMovement === "lean_back"     ? -4
               : 0;

    // Head movement helpers (triggered every frame in draw loop)
    if (sign.bodyMovement === "head_nod") {
      headWobRef.current.vy = -1.2;
    } else if (sign.bodyMovement === "head_shake") {
      headWobRef.current.vx = 2;
    }
  }, []);

  // ── Reset to idle ─────────────────────────────────────────────────────────
  const resetToIdle = useCallback(() => {
    const idle = defaultAnimState();
    Object.assign(targetRef.current, idle);
  }, []);

  // ── Playback effect ───────────────────────────────────────────────────────
  useEffect(() => {
    clearPlayTimeouts();
    if (!isPlaying || !signData?.signs?.length) {
      resetToIdle();
      return;
    }

    // Intro wave
    const introTarget = targetRef.current;
    introTarget.right.upperAngle   = -1.0;
    introTarget.right.forearmAngle = -0.4;
    introTarget.right.handShape    = "wave";
    introTarget.face.expression    = "smile";

    let t = 600;

    signData.signs.forEach((sign, idx) => {
      const id1 = setTimeout(() => applySign(sign), t);
      timeoutsRef.current.push(id1);
      t += sign.duration || 1000;

      if (idx === signData.signs.length - 1) {
        // Outro
        const id2 = setTimeout(() => {
          targetRef.current.right.upperAngle   = -1.0;
          targetRef.current.right.forearmAngle = -0.4;
          targetRef.current.right.handShape    = "wave";
          targetRef.current.face.expression    = "smile";
        }, t);
        timeoutsRef.current.push(id2);
        t += 600;

        const id3 = setTimeout(() => {
          resetToIdle();
          onPlayComplete?.();
        }, t);
        timeoutsRef.current.push(id3);
      }
    });

    return () => clearPlayTimeouts();
  }, [isPlaying, signData, applySign, resetToIdle, clearPlayTimeouts, onPlayComplete]);

  // ── rAF render loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LERP_SPEED = 0.1; // per frame smooth factor

    const c = ctx; // ctx is non-null here (checked above); alias avoids ! throughout

    function drawFrame(_now: number) {
      rafRef.current = requestAnimationFrame(drawFrame);

      // ── Idle animations ────────────────────────────────────────────────
      breatheRef.current += 0.05; // ~0.8Hz at 60fps
      const breatheY = Math.sin(breatheRef.current) * 3;

      // Blink
      const blink = blinkRef.current;
      blink.countdown--;
      if (blink.countdown <= 0 && !blink.active) {
        blink.active = true;
        blink.frame  = 0;
        blink.countdown = 180 + Math.floor(Math.random() * 120);
      }
      if (blink.active) {
        blink.frame++;
        if (blink.frame > 7) { blink.active = false; blink.frame = 0; }
      }
      const blinking = blink.active && blink.frame < 4;

      // Head wobble for nod/shake (spring decay)
      const hw = headWobRef.current;
      hw.vx *= 0.82; hw.vy *= 0.82;
      hw.x  += hw.vx; hw.y  += hw.vy;
      if (Math.abs(hw.vx) > 0.05) hw.vx *= -0.6;
      if (Math.abs(hw.vy) > 0.05) hw.vy *= -0.6;
      if (Math.abs(hw.x) < 0.05) hw.x = 0;
      if (Math.abs(hw.y) < 0.05) hw.y = 0;

      // ── Lerp current → target ─────────────────────────────────────────
      const s = stateRef.current;
      const tg = targetRef.current;

      s.right.upperAngle   = lerpClamped(s.right.upperAngle,   tg.right.upperAngle,   LERP_SPEED);
      s.right.forearmAngle = lerpClamped(s.right.forearmAngle, tg.right.forearmAngle, LERP_SPEED);
      s.right.handRotation = lerpClamped(s.right.handRotation, tg.right.handRotation, LERP_SPEED);
      s.right.handShape    = tg.right.handShape;

      s.left.upperAngle    = lerpClamped(s.left.upperAngle,   tg.left.upperAngle,   LERP_SPEED);
      s.left.forearmAngle  = lerpClamped(s.left.forearmAngle, tg.left.forearmAngle, LERP_SPEED);
      s.left.handRotation  = lerpClamped(s.left.handRotation, tg.left.handRotation, LERP_SPEED);
      s.left.handShape     = tg.left.handShape;

      s.face.expression = tg.face.expression;
      s.bodyLean        = lerpClamped(s.bodyLean, tg.bodyLean, 0.05);

      // ── Clear ─────────────────────────────────────────────────────────
      c.clearRect(0, 0, CW, CH);

      // ── Draw body with breathing offset ──────────────────────────────
      c.save();
      c.translate(0, breatheY);

      // Body rotation for lean
      c.translate(150, 220);
      c.rotate(s.bodyLean * Math.PI / 180);
      c.translate(-150, -220);

      drawBody(c);
      drawNeck(c);
      drawHead(c, s.face.expression, blinking, hw.x, hw.y);

      // ── Left arm (non-dominant) ────────────────────────────────────
      const leftShoulder = { x: 105, y: 183 };
      const U_LEN = 65, F_LEN = 50;

      const lUA = s.left.upperAngle; // angle from vertical
      const lElbow = {
        x: leftShoulder.x + Math.sin(lUA) * U_LEN,
        y: leftShoulder.y + Math.cos(lUA) * U_LEN,
      };
      const lFA = lUA + s.left.forearmAngle;
      const lWrist = {
        x: lElbow.x + Math.sin(lFA) * F_LEN,
        y: lElbow.y + Math.cos(lFA) * F_LEN,
      };

      // Shirt sleeve
      drawCapsule(c, leftShoulder.x, leftShoulder.y, lElbow.x, lElbow.y, 10, SHIRT_COLOR);
      // Forearm (skin)
      drawCapsule(c, lElbow.x, lElbow.y, lWrist.x, lWrist.y, 7, SKIN_BASE);
      // Elbow joint
      c.beginPath();
      c.arc(lElbow.x, lElbow.y, 8, 0, Math.PI * 2);
      c.fillStyle = SKIN_BASE;
      c.fill();
      // Hand
      drawHand(c, s.left.handShape, lWrist.x, lWrist.y, s.left.handRotation + lFA, true);

      // ── Right arm (dominant) ──────────────────────────────────────
      const rightShoulder = { x: 195, y: 183 };
      const rUA = s.right.upperAngle;
      const rElbow = {
        x: rightShoulder.x + Math.sin(rUA) * U_LEN,
        y: rightShoulder.y + Math.cos(rUA) * U_LEN,
      };
      const rFA = rUA + s.right.forearmAngle;
      const rWrist = {
        x: rElbow.x + Math.sin(rFA) * F_LEN,
        y: rElbow.y + Math.cos(rFA) * F_LEN,
      };

      drawCapsule(c, rightShoulder.x, rightShoulder.y, rElbow.x, rElbow.y, 10, SHIRT_COLOR);
      drawCapsule(c, rElbow.x, rElbow.y, rWrist.x, rWrist.y, 7, SKIN_BASE);
      c.beginPath();
      c.arc(rElbow.x, rElbow.y, 8, 0, Math.PI * 2);
      c.fillStyle = SKIN_BASE;
      c.fill();
      drawHand(c, s.right.handShape, rWrist.x, rWrist.y, s.right.handRotation + rFA, false);

      c.restore();
    }

    rafRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // only mount/unmount

  // ─── Sub-drawing functions ──────────────────────────────────────────────

  function drawBody(ctx: CanvasRenderingContext2D) {
    // Main torso
    ctx.beginPath();
    ctx.roundRect(108, 170, 84, 115, [8, 8, 20, 20]);
    ctx.fillStyle = SHIRT_COLOR;
    ctx.fill();
    // Shoulder width taper + highlight
    ctx.beginPath();
    ctx.roundRect(110, 170, 80, 30, [6, 6, 0, 0]);
    ctx.fillStyle = "#5A8A55";
    ctx.fill();
    // Collar
    ctx.beginPath();
    ctx.moveTo(140, 175);
    ctx.lineTo(150, 190);
    ctx.lineTo(160, 175);
    ctx.strokeStyle = "#3A6035";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawNeck(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.roundRect(140, 150, 20, 30, 5);
    ctx.fillStyle = SKIN_BASE;
    ctx.fill();
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  function drawHead(
    ctx: CanvasRenderingContext2D,
    expression: string,
    blinking: boolean,
    headX: number,
    headY: number
  ) {
    const hx = 150 + headX;
    const hy = 100 + headY;

    // ── Ears ──────────────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.ellipse(hx - 46, hy + 8, 9, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = SKIN_BASE;
    ctx.fill();
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(hx + 46, hy + 8, 9, 14, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Inner ear
    ctx.beginPath();
    ctx.ellipse(hx - 47, hy + 8, 4, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = SKIN_SHADOW;
    ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.ellipse(hx + 47, hy + 8, 4, 8, 0, 0, Math.PI * 2);
    ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Head shape ────────────────────────────────────────────────────────
    const grad = ctx.createRadialGradient(hx - 10, hy - 15, 5, hx, hy, 55);
    grad.addColorStop(0, SKIN_LIGHT);
    grad.addColorStop(0.6, SKIN_BASE);
    grad.addColorStop(1, SKIN_SHADOW);

    ctx.beginPath();
    ctx.ellipse(hx, hy, 44, 52, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Hair ──────────────────────────────────────────────────────────────
    const hairGrad = ctx.createLinearGradient(hx - 44, hy - 52, hx + 44, hy);
    hairGrad.addColorStop(0, "#2A2A2A");
    hairGrad.addColorStop(1, "#0D0D0D");
    ctx.beginPath();
    ctx.moveTo(hx - 43, hy - 20);
    ctx.quadraticCurveTo(hx - 48, hy - 55, hx, hy - 60);
    ctx.quadraticCurveTo(hx + 48, hy - 55, hx + 43, hy - 20);
    ctx.quadraticCurveTo(hx + 40, hy - 45, hx, hy - 52);
    ctx.quadraticCurveTo(hx - 40, hy - 45, hx - 43, hy - 20);
    ctx.fillStyle = hairGrad;
    ctx.fill();

    // Hair shine
    ctx.beginPath();
    ctx.moveTo(hx - 15, hy - 52);
    ctx.quadraticCurveTo(hx, hy - 58, hx + 15, hy - 52);
    ctx.strokeStyle = "#4A4A4A";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // ── Eyebrows ──────────────────────────────────────────────────────────
    let browLift = 0, browTilt = 0;
    if (expression === "questioning" || expression === "surprised") { browLift = -4; }
    if (expression === "serious" || expression === "angry") { browTilt = 3; browLift = 2; }
    if (expression === "thinking") { browTilt = -2; }

    ctx.strokeStyle = "#1A0A05";
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Left brow
    ctx.beginPath();
    ctx.moveTo(hx - 28, hy - 16 + browLift + browTilt);
    ctx.quadraticCurveTo(hx - 18, hy - 20 + browLift, hx - 8, hy - 17 + browLift - browTilt);
    ctx.stroke();

    // Right brow
    ctx.beginPath();
    ctx.moveTo(hx + 8, hy - 17 + browLift - browTilt);
    ctx.quadraticCurveTo(hx + 18, hy - 20 + browLift, hx + 28, hy - 16 + browLift + browTilt);
    ctx.stroke();

    // ── Eyes ──────────────────────────────────────────────────────────────
    if (blinking) {
      // Blink: thin line
      ctx.beginPath();
      ctx.moveTo(hx - 28, hy - 4);
      ctx.lineTo(hx - 8, hy - 4);
      ctx.moveTo(hx + 8, hy - 4);
      ctx.lineTo(hx + 28, hy - 4);
      ctx.strokeStyle = "#1A0A05";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Eye whites
      ctx.beginPath();
      ctx.ellipse(hx - 18, hy - 4, 11, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(hx + 18, hy - 4, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris
      ctx.beginPath();
      ctx.arc(hx - 18, hy - 3, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#3D1F0A";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx + 18, hy - 3, 6, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.beginPath();
      ctx.arc(hx - 18, hy - 3, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#0D0505";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx + 18, hy - 3, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight
      ctx.beginPath();
      ctx.arc(hx - 16, hy - 5, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx + 20, hy - 5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Nose ──────────────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(hx - 4, hy + 10);
    ctx.quadraticCurveTo(hx, hy + 20, hx + 4, hy + 10);
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(hx - 8, hy + 18);
    ctx.quadraticCurveTo(hx, hy + 22, hx + 8, hy + 18);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Mouth ────────────────────────────────────────────────────────────
    ctx.strokeStyle = "#5C2D12";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";

    switch (expression) {
      case "smile":
      case "excited":
        ctx.beginPath();
        ctx.moveTo(hx - 14, hy + 30);
        ctx.quadraticCurveTo(hx, hy + 40, hx + 14, hy + 30);
        ctx.stroke();
        break;
      case "big_smile": {
        ctx.beginPath();
        ctx.moveTo(hx - 16, hy + 28);
        ctx.quadraticCurveTo(hx, hy + 44, hx + 16, hy + 28);
        ctx.closePath();
        ctx.fillStyle = "#3A1508";
        ctx.fill();
        ctx.stroke();
        break;
      }
      case "sad":
      case "concerned":
        ctx.beginPath();
        ctx.moveTo(hx - 12, hy + 36);
        ctx.quadraticCurveTo(hx, hy + 28, hx + 12, hy + 36);
        ctx.stroke();
        break;
      case "surprised": {
        ctx.beginPath();
        ctx.ellipse(hx, hy + 34, 10, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#3A1508";
        ctx.fill();
        ctx.stroke();
        break;
      }
      case "questioning":
      case "thinking":
        ctx.beginPath();
        ctx.moveTo(hx - 10, hy + 32);
        ctx.lineTo(hx + 10, hy + 34);
        ctx.stroke();
        break;
      case "serious":
      case "focused":
      case "emphatic":
      case "angry":
        ctx.beginPath();
        ctx.moveTo(hx - 12, hy + 33);
        ctx.lineTo(hx + 12, hy + 33);
        ctx.stroke();
        break;
      default: // neutral
        ctx.beginPath();
        ctx.moveTo(hx - 11, hy + 32);
        ctx.quadraticCurveTo(hx, hy + 36, hx + 11, hy + 32);
        ctx.stroke();
    }

    // ── Cheek highlights ─────────────────────────────────────────────────
    const cheekAlpha =
      expression === "smile" || expression === "big_smile" || expression === "excited" ? 0.18 : 0.08;
    const cheekGrad = ctx.createRadialGradient(hx - 28, hy + 14, 0, hx - 28, hy + 14, 14);
    cheekGrad.addColorStop(0, `rgba(160,80,60,${cheekAlpha})`);
    cheekGrad.addColorStop(1, "rgba(160,80,60,0)");
    ctx.beginPath();
    ctx.arc(hx - 28, hy + 14, 14, 0, Math.PI * 2);
    ctx.fillStyle = cheekGrad;
    ctx.fill();

    const cheekGrad2 = ctx.createRadialGradient(hx + 28, hy + 14, 0, hx + 28, hy + 14, 14);
    cheekGrad2.addColorStop(0, `rgba(160,80,60,${cheekAlpha})`);
    cheekGrad2.addColorStop(1, "rgba(160,80,60,0)");
    ctx.beginPath();
    ctx.arc(hx + 28, hy + 14, 14, 0, Math.PI * 2);
    ctx.fillStyle = cheekGrad2;
    ctx.fill();
  }

  return (
    <div
      className={cn("relative flex flex-col items-center")}
      style={{ width: dispW, height: dispH + 24, overflow: "visible" }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ width: dispW, height: dispH }}
        className="rounded-xl"
      />
    </div>
  );
}