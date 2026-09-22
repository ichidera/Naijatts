import * as THREE from "three";

/**
 * Raises the right arm from its resting (down-at-the-side) bind pose into a
 * signing position in front of the chest, by rotating the shoulder/upper
 * arm/forearm relative to their own bind rotations.
 *
 * These angles are a starting estimate, not a verified-correct pose — I
 * don't have a way to render and eyeball this myself, so they're picked to
 * be roughly right (elbow bent ~90°, hand lifted to chest height) and are
 * meant to be tuned against the actual avatar in-browser. All three bones
 * expose their rotation as simple named constants below specifically so
 * that tuning is "change a number," not "re-derive the math."
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

// Tune these three numbers (radians) to fix the raised-arm pose visually.
export const SIGNING_ARM_ANGLES = {
  shoulderLift: 0.15, // slight shoulder rotation, forward/up
  upperArmLift: -1.3, // swings the upper arm forward and up from the side
  foreArmBend: -1.6, // bends the elbow so the forearm comes up in front of the chest
};

/** t = 0 → resting arm-down bind pose, t = 1 → fully raised signing pose. */
export function applySigningArmPose(arm: ArmBones, t: number) {
  const set = (bone: THREE.Bone | null, axis: THREE.Vector3, angle: number) => {
    if (!bone) return;
    const bindQ = arm.bind.get(bone);
    if (!bindQ) return;
    const q = new THREE.Quaternion().setFromAxisAngle(axis, angle * t);
    bone.quaternion.copy(bindQ).multiply(q);
  };
  set(arm.shoulder, new THREE.Vector3(0, 0, 1), SIGNING_ARM_ANGLES.shoulderLift);
  set(arm.upperArm, new THREE.Vector3(0, 0, 1), SIGNING_ARM_ANGLES.upperArmLift);
  set(arm.foreArm, new THREE.Vector3(0, 1, 0), SIGNING_ARM_ANGLES.foreArmBend);
}
