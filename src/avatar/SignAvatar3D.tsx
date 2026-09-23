import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { collectHandBones, applyLetterPose, applyFingerCurls, slerpTowardLetterPose, type HandBones } from "./handRetarget";
import { collectArmBones, applyRestArmPose, applySigningArmPose, type ArmBones } from "./armPose";
import { REST_POSE, type LetterPose } from "@/data/fingerspellingPoses";

export interface SignAvatar3DHandle {
  /** Snap directly to a letter pose (no blend). */
  setPose: (pose: LetterPose) => void;
  /** Smoothly transition to a new letter pose over durationMs. */
  playPose: (pose: LetterPose, durationMs: number) => void;
  /** Raise/lower the signing arm (0 = resting, 1 = fully raised). */
  setArmRaised: (raised: boolean, durationMs?: number) => void;
}

interface SignAvatar3DProps {
  /** Path to the GLB, e.g. "/models/avatar.glb". */
  src: string;
  /** Which hand does the signing. The other hand and both arms otherwise
   *  just sit in the relaxed rest pose (see armPose.ts). */
  handedness?: "Left" | "Right";
}

const OPPOSITE: Record<"Left" | "Right", "Left" | "Right"> = { Left: "Right", Right: "Left" };

/**
 * Loads the rigged GLB and exposes an imperative handle for posing the
 * signing hand — this is intentionally NOT driven by props on every
 * render, because per-frame bone updates need to happen inside useFrame,
 * outside React's render cycle, or they fight with the animation loop.
 */
export const SignAvatar3D = forwardRef<SignAvatar3DHandle, SignAvatar3DProps>(
  ({ src, handedness = "Right" }, ref) => {
    const { scene } = useGLTF(src);
    const handRef = useRef<HandBones | null>(null);
    const armRef = useRef<ArmBones | null>(null);

    // Transition state, read/written from useFrame — plain refs, not React
    // state, so we don't trigger a re-render 60x/second.
    const transition = useRef<{
      from: LetterPose;
      to: LetterPose;
      startedAt: number;
      durationMs: number;
    } | null>(null);
    const armTransition = useRef<{ from: number; to: number; startedAt: number; durationMs: number } | null>(null);
    const armAmount = useRef(0);

    useEffect(() => {
      // Signing hand + arm: driven dynamically (see useImperativeHandle/useFrame below).
      handRef.current = collectHandBones(scene, handedness);
      armRef.current = collectArmBones(scene, handedness);
      if (handRef.current) applyLetterPose(handRef.current, REST_POSE);
      if (armRef.current) applyRestArmPose(armRef.current);

      // Non-signing hand + arm: set once to a relaxed rest pose and left alone.
      const otherHand = collectHandBones(scene, OPPOSITE[handedness]);
      const otherArm = collectArmBones(scene, OPPOSITE[handedness]);
      applyFingerCurls(otherHand, REST_POSE.curls);
      applyRestArmPose(otherArm);
    }, [scene, handedness]);

    useImperativeHandle(
      ref,
      () => ({
        setPose(pose) {
          transition.current = null;
          if (handRef.current) applyLetterPose(handRef.current, pose);
        },
        playPose(pose, durationMs) {
          const hand = handRef.current;
          if (!hand) return;
          // Capture whatever the hand's current blended pose effectively is
          // by using the pose we were last animating toward (or rest).
          const from = transition.current?.to ?? REST_POSE;
          transition.current = { from, to: pose, startedAt: performance.now(), durationMs };
        },
        setArmRaised(raised, durationMs = 400) {
          armTransition.current = {
            from: armAmount.current,
            to: raised ? 1 : 0,
            startedAt: performance.now(),
            durationMs,
          };
        },
      }),
      []
    );

    useFrame(() => {
      const hand = handRef.current;
      const arm = armRef.current;

      if (hand && transition.current) {
        const { from, to, startedAt, durationMs } = transition.current;
        const t = durationMs <= 0 ? 1 : Math.min(1, (performance.now() - startedAt) / durationMs);
        // ease in/out so letters don't snap linearly
        const eased = t * t * (3 - 2 * t);
        slerpTowardLetterPose(hand, from, to, eased);
        if (t >= 1) transition.current = { ...transition.current, from: to };
      }

      if (arm && armTransition.current) {
        const { from, to, startedAt, durationMs } = armTransition.current;
        const t = durationMs <= 0 ? 1 : Math.min(1, (performance.now() - startedAt) / durationMs);
        const eased = t * t * (3 - 2 * t);
        armAmount.current = from + (to - from) * eased;
        applySigningArmPose(arm, armAmount.current);
        if (t >= 1) armTransition.current = null;
      }
    });

    const cloned = useMemo(() => scene, [scene]);

    return <primitive object={cloned} />;
  }
);

SignAvatar3D.displayName = "SignAvatar3D";

useGLTF.preload("/models/avatar.glb");
