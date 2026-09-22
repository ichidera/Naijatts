import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
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
        frame the chest-to-head area, since that's what's visible/relevant
        for a signing avatar.
      */}
      <Canvas camera={{ position: [0, 1.5, 1.0], fov: 35 }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow />
          <Environment preset="studio" />
          <SignAvatar3D ref={avatarRef} src="/models/avatar.glb" handedness="Right" />
          <OrbitControls
            target={[0, 1.45, 0]}
            enablePan={false}
            minDistance={0.5}
            maxDistance={2.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
