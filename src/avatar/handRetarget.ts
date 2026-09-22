import * as THREE from "three";
import type { FingerCurls, LetterPose } from "@/data/fingerspellingPoses";

/**
 * Retargeting strategy
 * ---------------------
 * Every finger bone in this rig (Ready Player Me / Mixamo-style — see the
 * bone dump this was built against: RightHandIndex1/2/3/4 etc., 67 joints
 * total under an "Armature" skin) points along its own local +Y axis in
 * the bind pose — i.e. translation.y dominates, x and z are ~0, for every
 * <Finger>2, <Finger>3, <Finger>4 node. Curling a joint is a rotation
 * around local X away from that +Y rest direction (standard for this rig
 * family). We never touch translation — only the local quaternion,
 * composed as bindQuaternion * curlQuaternion, so the mesh skin (which is
 * bound to the bind pose) deforms correctly via the skeleton.
 *
 * Per-joint max curl angle: the MCP joint (bone "1") bends the most, the
 * PIP joint ("2") a bit less, the DIP joint ("3") the least — matches how
 * real fingers move. The 4-bone ("4", the tip) is a non-rotating leaf and
 * is intentionally left alone.
 */

export type Handedness = "Left" | "Right";

const FINGER_BONES: Record<keyof FingerCurls, [string, string, string]> = {
  thumb: ["Thumb1", "Thumb2", "Thumb3"],
  index: ["Index1", "Index2", "Index3"],
  middle: ["Middle1", "Middle2", "Middle3"],
  ring: ["Ring1", "Ring2", "Ring3"],
  pinky: ["Pinky1", "Pinky2", "Pinky3"],
};

// Max bend per joint, in radians, as a fraction of curl=1. Thumb bends less
// overall (it has a different joint structure — CMC/MCP/IP, not three
// identical hinges) so its scale is lower across the board.
const JOINT_MAX_ANGLE: Record<keyof FingerCurls, [number, number, number]> = {
  thumb: [0.7, 0.6, 0.5],
  index: [1.1, 0.9, 0.7],
  middle: [1.1, 0.9, 0.7],
  ring: [1.1, 0.9, 0.7],
  pinky: [1.1, 0.9, 0.7],
};

// Sign flips the curl direction for a bone family if it curls "the wrong
// way" once you actually see it rendered — flip these to -1 rather than
// touching the math above.
const CURL_SIGN: Record<keyof FingerCurls, number> = {
  thumb: -1,
  index: 1,
  middle: 1,
  ring: 1,
  pinky: 1,
};

export interface HandBones {
  wrist: THREE.Bone | null;
  joints: Partial<Record<keyof FingerCurls, [THREE.Bone | null, THREE.Bone | null, THREE.Bone | null]>>;
  /** local quaternion of every bone as loaded, before any posing is applied */
  bind: Map<THREE.Bone, THREE.Quaternion>;
}

/** Walk a loaded skeleton and collect the named bones for one hand. */
export function collectHandBones(root: THREE.Object3D, hand: Handedness): HandBones {
  const find = (suffix: string) => {
    let found: THREE.Bone | null = null;
    root.traverse((obj) => {
      if (!found && (obj as THREE.Bone).isBone && obj.name === `${hand}Hand${suffix}`) {
        found = obj as THREE.Bone;
      }
    });
    return found;
  };

  const wrist = find("");
  const joints: HandBones["joints"] = {};
  const bind = new Map<THREE.Bone, THREE.Quaternion>();

  (Object.keys(FINGER_BONES) as (keyof FingerCurls)[]).forEach((finger) => {
    const names = FINGER_BONES[finger];
    const bones = names.map((n) => find(n)) as [THREE.Bone | null, THREE.Bone | null, THREE.Bone | null];
    joints[finger] = bones;
    bones.forEach((b) => {
      if (b) bind.set(b, b.quaternion.clone());
    });
  });

  if (wrist) bind.set(wrist, wrist.quaternion.clone());

  return { wrist, joints, bind };
}

const _curlQ = new THREE.Quaternion();
const _axisX = new THREE.Vector3(1, 0, 0);

/** Apply a set of finger curls (0..1 each) to one hand's bones, in place. */
export function applyFingerCurls(hand: HandBones, curls: FingerCurls) {
  (Object.keys(curls) as (keyof FingerCurls)[]).forEach((finger) => {
    const bones = hand.joints[finger];
    if (!bones) return;
    const maxAngles = JOINT_MAX_ANGLE[finger];
    const sign = CURL_SIGN[finger];
    const amount = THREE.MathUtils.clamp(curls[finger], 0, 1);

    bones.forEach((bone, i) => {
      if (!bone) return;
      const bindQ = hand.bind.get(bone);
      if (!bindQ) return;
      const angle = sign * amount * maxAngles[i];
      _curlQ.setFromAxisAngle(_axisX, angle);
      bone.quaternion.copy(bindQ).multiply(_curlQ);
    });
  });
}

/** Apply wrist tilt/turn on top of the wrist's bind rotation. */
export function applyWristOrientation(hand: HandBones, tilt = 0, turn = 0) {
  if (!hand.wrist) return;
  const bindQ = hand.bind.get(hand.wrist);
  if (!bindQ) return;
  const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
  const qTurn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), turn);
  hand.wrist.quaternion.copy(bindQ).multiply(qTurn).multiply(qTilt);
}

/** Convenience: apply a full LetterPose (curls + wrist orientation) to a hand. */
export function applyLetterPose(hand: HandBones, pose: LetterPose) {
  applyFingerCurls(hand, pose.curls);
  applyWristOrientation(hand, pose.wristTilt ?? 0, pose.wristTurn ?? 0);
}

/**
 * Smoothly blend a hand's CURRENT bone rotations toward a target LetterPose
 * by factor t (0..1 per call) — call this every frame with a small t for a
 * spring-like ease, or precompute two full poses and slerp between them
 * with a t that goes 0→1 over the transition duration (see
 * useFingerspelling3D, which does the latter for predictable timing).
 */
export function slerpTowardLetterPose(
  hand: HandBones,
  fromPose: LetterPose,
  toPose: LetterPose,
  t: number
) {
  const lerpCurl = (a: number, b: number) => a + (b - a) * t;
  const blended: FingerCurls = {
    thumb: lerpCurl(fromPose.curls.thumb, toPose.curls.thumb),
    index: lerpCurl(fromPose.curls.index, toPose.curls.index),
    middle: lerpCurl(fromPose.curls.middle, toPose.curls.middle),
    ring: lerpCurl(fromPose.curls.ring, toPose.curls.ring),
    pinky: lerpCurl(fromPose.curls.pinky, toPose.curls.pinky),
  };
  applyFingerCurls(hand, blended);
  applyWristOrientation(
    hand,
    lerpCurl(fromPose.wristTilt ?? 0, toPose.wristTilt ?? 0),
    lerpCurl(fromPose.wristTurn ?? 0, toPose.wristTurn ?? 0)
  );
}
