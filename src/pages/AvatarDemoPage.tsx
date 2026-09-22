import { Fingerspelling3DDemo } from "@/components/Fingerspelling3DDemo";

export default function AvatarDemoPage() {
  return (
    <div className="px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto mb-6 text-center">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          3D Avatar — Fingerspelling
        </h1>
        <p className="text-sm text-muted-foreground">
          Rigged 3D avatar, fingerspelling shapes from the ASL manual alphabet. Drag to orbit.
        </p>
      </div>
      <Fingerspelling3DDemo />
    </div>
  );
}
