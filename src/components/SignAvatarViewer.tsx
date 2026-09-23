import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { SignAvatar3D, type SignAvatar3DHandle } from "@/avatar/SignAvatar3D";

interface SignAvatarViewerProps {
  avatarRef: RefObject<SignAvatar3DHandle>;
  className?: string;
}

export function SignAvatarViewer({ avatarRef, className }: SignAvatarViewerProps) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      {/*
        The GLB's own coordinate system already has feet at y≈0 and head
        top at y≈1.87 (checked directly against the file's mesh bounding
        box — no rescaling or vertical offset needed). Camera/target below
        frame the chest-to-head area.

        Distance/FOV were widened from an earlier version: with the arms
        at raw bind pose (a mild ~30°-flared A-pose) plus a camera only 1m
        away, the hands sat right at the edge of the frame and read as a
        much wider "T-pose" stance than the rig actually has. Now that the
        rest pose brings the arms in close to the body (see armPose.ts),
        1.3m / fov 32 comfortably fits chest-to-head with room for the
        signing hand out in front without the framing itself exaggerating
        the pose.

        Render quality/perf:
        - dpr capped to [1, 2] — uncapped devicePixelRatio on a 3x phone
          screen renders 9x the pixels for no visible benefit and tanks
          frame rate; 2x is already sharp.
        - AdaptiveDpr (from drei) automatically steps resolution down
          further under sustained frame drops and back up once the scene
          settles, so low-end devices stay smooth instead of stuttering.
        - ACESFilmic tone mapping + a soft shadow map for a less flat,
          more photographic look than the WebGL default.
      */}
      <Canvas
        camera={{ position: [0, 1.52, 1.3], fov: 32 }}
        shadows="soft"
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
          <Environment preset="studio" />
          <SignAvatar3D ref={avatarRef} src="/models/avatar.glb" handedness="Right" />
          <OrbitControls
            target={[0, 1.48, 0]}
            enablePan={false}
            minDistance={0.7}
            maxDistance={2.8}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
