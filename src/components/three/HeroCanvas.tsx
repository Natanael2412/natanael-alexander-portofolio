"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function AbstractHead() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y =
      Math.sin(t * 0.3) * 0.15 + scrollProgress * Math.PI * 0.5;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshStandardMaterial
          color="#E8E0D5"
          roughness={0.3}
          metalness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 8, 100]} />
        <meshStandardMaterial color="#B0A898" roughness={0.6} metalness={0.2} />
      </mesh>

      <mesh rotation={[Math.PI / 3, 0.5, 0]}>
        <torusGeometry args={[1.9, 0.008, 8, 100]} />
        <meshStandardMaterial color="#C8C0B6" roughness={0.5} metalness={0.3} />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 120;
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    return new Float32Array(
      Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 8)
    );
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial size={0.025} color="#8A8070" transparent opacity={0.6} />
    </points>
  );
}

export default function HeroCanvas() {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const pixelRatio =
    typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio, isMobile ? 1 : 2)
      : 1;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: !isMobile }}
      dpr={pixelRatio}
      shadows={!isMobile}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow={!isMobile}
      />
      <directionalLight
        position={[-5, -2, -5]}
        intensity={0.4}
        color="#F0E8E0"
      />
      <Environment preset="studio" />
      <AbstractHead />
      <ParticleField />
      {!isMobile && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
      )}
    </Canvas>
  );
}
