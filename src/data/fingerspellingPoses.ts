/**
 * ASL manual-alphabet hand shapes, expressed as per-finger curl amounts
 * (0 = fully extended/straight, 1 = fully curled into the palm).
 *
 * This is the "pose" half of the fingerspelling pipeline described in
 * useSignLanguage's old fingerspellWord(): instead of a flat 2D SVG hand,
 * these curl values drive the actual finger bones of the rigged 3D avatar
 * (see src/avatar/handRetarget.ts).
 *
 * Source of truth for the shapes themselves: the standard American Manual
 * Alphabet (the same reference every ASL fingerspelling resource teaches
 * from). Cross-checked against real recorded hand landmarks from
 * huggingface.co/datasets/sid220/asl-now-fingerspelling — e.g. for "A" the
 * dataset's wrist→fingertip distances are shorter than wrist→knuckle
 * distances for index/middle/ring/pinky (curled) while the thumb sits out
 * away from the fist (extended to the side), which matches the curl values
 * below.
 *
 * IMPORTANT — known simplification: a handshape in real ASL is defined by
 * curl AND orientation (which way the palm/fingers point — e.g. G and Q
 * are nearly the same curl as each other but rotated differently; B is
 * curl 0 with the palm facing out). This first pass only encodes curl per
 * finger, which gets most letters right but will make a few pairs (G/Q,
 * K/P, H/U) look too similar. `wristTilt` / `wristTurn` below are a first
 * attempt at capturing orientation for the letters where curl alone is
 * clearly not enough — treat the exact degrees as a starting point to
 * tune against the actual rendered avatar, not a verified-correct value.
 */

export interface FingerCurls {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export interface LetterPose {
  curls: FingerCurls;
  /** Extra rotation of the wrist, in radians, layered on top of the base signing pose. */
  wristTilt?: number; // rotation around local X (palm up/down)
  wristTurn?: number; // rotation around local Y (palm in/out)
  /** true for letters that are actually traced motions (J, Z) rather than static shapes. */
  isMotion?: boolean;
}

const c = (thumb: number, index: number, middle: number, ring: number, pinky: number): FingerCurls => ({
  thumb, index, middle, ring, pinky,
});

export const FINGERSPELLING_POSES: Record<string, LetterPose> = {
  A: { curls: c(0.3, 1, 1, 1, 1) },
  B: { curls: c(1, 0, 0, 0, 0) },
  C: { curls: c(0.5, 0.5, 0.5, 0.5, 0.5) },
  D: { curls: c(0.6, 0, 1, 1, 1) },
  E: { curls: c(0.85, 0.85, 0.85, 0.85, 0.85) },
  F: { curls: c(0.7, 0.7, 0, 0, 0) },
  G: { curls: c(0, 0, 1, 1, 1), wristTurn: 1.2 },
  H: { curls: c(0.3, 0, 0, 1, 1), wristTurn: 1.2 },
  I: { curls: c(1, 1, 1, 1, 0) },
  J: { curls: c(1, 1, 1, 1, 0), isMotion: true },
  K: { curls: c(0.3, 0, 0, 1, 1) },
  L: { curls: c(0, 0, 1, 1, 1) },
  M: { curls: c(1, 1, 1, 1, 1) },
  N: { curls: c(0.8, 1, 1, 0.9, 1) },
  O: { curls: c(0.5, 0.6, 0.6, 0.6, 0.6) },
  P: { curls: c(0.3, 0, 0, 1, 1), wristTilt: 1.4 },
  Q: { curls: c(0, 0, 1, 1, 1), wristTilt: 1.4 },
  R: { curls: c(0.3, 0, 0, 1, 1) },
  S: { curls: c(1, 1, 1, 1, 1) },
  T: { curls: c(0.7, 1, 1, 1, 1) },
  U: { curls: c(0.5, 0, 0, 1, 1) },
  V: { curls: c(0.5, 0, 0, 1, 1) },
  W: { curls: c(0.4, 0, 0, 0, 1) },
  X: { curls: c(0.3, 0.5, 1, 1, 1) },
  Y: { curls: c(0, 1, 1, 1, 0) },
  Z: { curls: c(1, 0, 1, 1, 1), isMotion: true },
};

/** Relaxed idle hand — used when the avatar isn't actively signing. */
export const REST_POSE: LetterPose = { curls: c(0.15, 0.15, 0.15, 0.15, 0.15) };

/** Fallback for characters with no defined shape (digits, punctuation). */
export const NO_SIGN_POSE: LetterPose = { curls: c(0, 0, 0, 0, 0), wristTilt: -0.4 };

export function getLetterPose(letter: string): LetterPose {
  const upper = letter.toUpperCase();
  return FINGERSPELLING_POSES[upper] ?? NO_SIGN_POSE;
}
