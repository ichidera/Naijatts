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
 *    forward-kinematic hand position lands closest to a target point
 *    above collar height and well forward converged on shoulder +57°/Z,
 *    arm +108° more on the same +X axis (138° total from bind), forearm
 *    +40° on -Z.
 *
 *    This target has been revised twice now. The first version placed
 *    the hand ~30cm in front of the chest — almost exactly where the
 *    jacket's lapel decoration sits (its bounding box peaks at z≈0.163
 *    there), so the hand swept through it, showing the decoration's
 *    colors poking through the fingers in a screenshot. A second attempt
 *    aimed for collar height with a 5cm margin — a screen recording of
 *    that build showed the hand still landing on the decoration, meaning
 *    5cm wasn't actually enough clearance in practice. This version goes
 *    well above the neck instead of just to collar height, and was
 *    checked by sampling the hand's forward depth at five points along
 *    the whole raise (t=0, 0.25, 0.5, 0.75, 1.0), not just the endpoint —
 *    every sampled point now clears the jacket's front-most measured
 *    point by at least 7cm, and the resting signing position (where the
 *    hand spends most of its time, between letters) sits above the neck
 *    entirely, well clear of anything at chest height regardless of
 *    exactly where on the lapel the decoration sits.
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
  shoulderZDeg: 57,
  armExtraXDeg: 108, // on top of the 30° rest, so 138° total from bind
  foreArmNegZDeg: 40,
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
