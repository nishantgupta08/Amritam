"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";

function HeartModelContent() {
  const ref = useRef<any>();
  const { scene } = useGLTF("/models/heart.glb", true);

  useFrame(({ clock }) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.2) * 0.03;
      ref.current.scale.set(pulse, pulse, pulse);
    }
  });

  if (!scene) {
    return null;
  }

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.2}
      position={[0, -0.5, 0]}
    />
  );
}

export default function HeartModel() {
  return (
    <Suspense fallback={null}>
      <HeartModelContent />
    </Suspense>
  );
}

