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
 *    forward-kinematic hand position lands closest to a target point out
 *    in front of the shoulder converged on shoulder +40°/Z, arm +90° more
 *    on the same +X axis (120° total from bind), forearm +58° on -Z.
 *
 *    This target was revised once already: the first version placed the
 *    hand only ~30cm in front of the chest, which turned out to be almost
 *    exactly where the jacket's lapel decoration sits (the jacket mesh's
 *    own bounding box peaks at z≈0.163 there) — close enough that the
 *    hand swept through it during the raise animation, showing up as
 *    stray pink/green patches (the decoration's colors) poking through
 *    the fingers. The current target sits further out and higher, up
 *    near collar height, verified by sampling the hand's z-depth at rest,
 *    mid-transition, and full extension against that 0.163 jacket-front
 *    figure — the closest point in the whole swing now clears it by
 *    roughly 5cm instead of clipping through it.
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
  shoulderZDeg: 40,
  armExtraXDeg: 90, // on top of the 30° rest, so 120° total from bind
  foreArmNegZDeg: 58,
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
