"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, Suspense } from "react";

type Wrapped3DSceneProps = {
  slideIndex: number;
};

// Abstract glass shape
function GlassForm({
  geometry,
  position = [0, 0, 0],
  scale = 1,
  color = "#ffffff",
  rotationSpeed = 0.2,
}: {
  geometry: "blob" | "elongated" | "shard" | "twist" | "pill" | "lens";
  position?: [number, number, number];
  scale?: number;
  color?: string;
  rotationSpeed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * rotationSpeed;
      ref.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 1.3;
    }
  });

  const getGeometry = () => {
    switch (geometry) {
      case "blob":
        return <icosahedronGeometry args={[1, 2]} />;
      case "elongated":
        return <capsuleGeometry args={[0.4, 1.2, 16, 32]} />;
      case "shard":
        return <octahedronGeometry args={[1, 0]} />;
      case "twist":
        return <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />;
      case "pill":
        return <capsuleGeometry args={[0.5, 0.8, 8, 16]} />;
      case "lens":
        return <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />;
      default:
        return <icosahedronGeometry args={[1, 1]} />;
    }
  };

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <mesh ref={ref} position={position} scale={scale}>
        {getGeometry()}
        <meshPhysicalMaterial
          color={color}
          metalness={0}
          roughness={0.02}
          transmission={0.97}
          thickness={2}
          ior={1.5}
          transparent
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

// Scenes
function IntroScene() {
  return (
    <group position={[0.6, -0.6, 0]}>
      <GlassForm geometry="blob" scale={0.7} color="#ddd6fe" />
    </group>
  );
}

function NightScene() {
  return (
    <group position={[0.7, -0.7, 0]}>
      <GlassForm geometry="lens" scale={0.8} color="#bfdbfe" rotationSpeed={0.1} />
    </group>
  );
}

function SplitScene() {
  return (
    <>
      <group position={[-0.5, -0.5, 0]}>
        <GlassForm geometry="pill" scale={0.5} color="#a7f3d0" rotationSpeed={0.15} />
      </group>
      <group position={[0.7, -0.9, 0]}>
        <GlassForm geometry="pill" scale={0.3} color="#fecdd3" rotationSpeed={0.25} />
      </group>
    </>
  );
}

function CutsScene() {
  return (
    <group position={[0.6, -0.7, 0]}>
      <GlassForm geometry="shard" scale={0.6} color="#fef3c7" rotationSpeed={0.3} />
    </group>
  );
}

function DangerScene() {
  return (
    <group position={[0.7, -0.6, 0]}>
      <GlassForm geometry="twist" scale={0.5} color="#fecaca" rotationSpeed={0.4} />
    </group>
  );
}

function RevealScene() {
  return (
    <group position={[0.5, -0.5, 0]}>
      <GlassForm geometry="elongated" scale={0.7} color="#e9d5ff" rotationSpeed={0.2} />
    </group>
  );
}

function SceneContent({ slideIndex }: { slideIndex: number }) {
  const scenes = [IntroScene, NightScene, SplitScene, CutsScene, DangerScene, RevealScene];
  const Scene = scenes[slideIndex] || IntroScene;
  return <Scene />;
}

export default function Wrapped3DScene({ slideIndex }: Wrapped3DSceneProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, -5, 5]} intensity={0.4} />

          <SceneContent slideIndex={slideIndex} />
        </Suspense>
      </Canvas>
    </div>
  );
}
