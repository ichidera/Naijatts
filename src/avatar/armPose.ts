import * as THREE from "three";

/**
 * How these numbers were derived
 * -------------------------------
 * This rig's bind pose is NOT a plain T-pose — it's already a mild ~30°
 * A-pose (upper arm ~30° off vertical, not 90°). Forward-kinematically
 * reconstructing the GLB's actual bind-pose bone positions (translations
 * + rotations straight out of the file) and testing rotations against
 * that reconstruction gives two results used directly below:
 *
 * 1. REST: rotating the *Arm bone 30° around local +X (both sides — the
 *    rig mirrors such that the same signed rotation works on both arms)
 *    brings the whole lower-arm+hand chain to within ~2° of hanging
 *    straight down. This replaces an earlier version of this file that
 *    only ever posed the signing arm and left both arms at raw bind pose
 *    — since bind pose reads as "arms held out to the sides" at typical
 *    camera distance, that was the actual cause of the T-pose-looking
 *    idle avatar, not a genuine T-pose in the asset.
 *
 * 2. SIGNING: starting from that rest position, a grid search over
 *    (shoulder Z, additional arm X, forearm Z) for the combination whose
 *    forward-kinematic hand position lands closest to a target point in
 *    front of the chest (chest height + 8cm, 30cm toward the viewer)
 *    converged on shoulder +20°/Z, arm +70° more on the same +X axis
 *    (100° total from bind), forearm +82° on -Z — landing within ~7cm of
 *    the target, which is as far as a coordinate-only search (no
 *    real-time rendering available in this environment) can be pushed.
 *    Fine visual polish from here — if the hand still isn't quite where
 *    it should be once actually seen on screen — is a matter of nudging
 *    these three numbers, not re-deriving the approach.
 */
export interface ArmBones {
  shoulder: THREE.Bone | null;
  upperArm: THREE.Bone | null;
  foreArm: THREE.Bone | null;
  bind: Map<THREE.Bone, THREE.Quaternion>;
}

export function collectArmBones(root: THREE.Object3D, hand: "Left" | "Right"): ArmBones {
  const find = (name: string) => {
    let found: THREE.Bone | null = null;
    root.traverse((obj) => {
      if (!found && (obj as THREE.Bone).isBone && obj.name === name) found = obj as THREE.Bone;
    });
    return found;
  };
  const shoulder = find(`${hand}Shoulder`);
  const upperArm = find(`${hand}Arm`);
  const foreArm = find(`${hand}ForeArm`);
  const bind = new Map<THREE.Bone, THREE.Quaternion>();
  [shoulder, upperArm, foreArm].forEach((b) => b && bind.set(b, b.quaternion.clone()));
  return { shoulder, upperArm, foreArm, bind };
}

const REST_ARM_X_DEG = 30; // both sides — see derivation above

const SIGNING_EXTRA = {
  shoulderZDeg: 20,
  armExtraXDeg: 70, // on top of the 30° rest, so 100° total from bind
  foreArmNegZDeg: 82,
};

const deg2rad = (d: number) => (d * Math.PI) / 180;

const _q = new THREE.Quaternion();
const _axisX = new THREE.Vector3(1, 0, 0);
const _axisZ = new THREE.Vector3(0, 0, 1);
const _negAxisZ = new THREE.Vector3(0, 0, -1);

function setBoneRotation(bone: THREE.Bone | null, bind: Map<THREE.Bone, THREE.Quaternion>, axis: THREE.Vector3, angleRad: number) {
  if (!bone) return;
  const bindQ = bind.get(bone);
  if (!bindQ) return;
  _q.setFromAxisAngle(axis, angleRad);
  bone.quaternion.copy(bindQ).multiply(_q);
}

/** Always-on relaxed pose: arms hanging at the sides instead of raw bind pose. Call once for each arm (both sides) on mount. */
export function applyRestArmPose(arm: ArmBones) {
  setBoneRotation(arm.upperArm, arm.bind, _axisX, deg2rad(REST_ARM_X_DEG));
}

/**
 * Blends the RIGHT arm from the rest position (t=0) to the signing
 * position in front of the chest (t=1). Only call this for the signing
 * (right) arm — the left arm just stays at applyRestArmPose's pose.
 */
export function applySigningArmPose(arm: ArmBones, t: number) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);
  setBoneRotation(arm.shoulder, arm.bind, _axisZ, deg2rad(SIGNING_EXTRA.shoulderZDeg) * clamped);
  setBoneRotation(arm.upperArm, arm.bind, _axisX, deg2rad(REST_ARM_X_DEG + SIGNING_EXTRA.armExtraXDeg * clamped));
  setBoneRotation(arm.foreArm, arm.bind, _negAxisZ, deg2rad(SIGNING_EXTRA.foreArmNegZDeg) * clamped);
}
