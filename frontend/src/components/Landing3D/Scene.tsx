import { useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    // Setup GSAP scroll animation
    const ctx = gsap.context(() => {
      gsap.to(meshRef.current!.rotation, {
        y: "+=3.14",
        x: "+=1.5",
        scrollTrigger: {
          trigger: "#landing-overlay",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      gsap.to(meshRef.current!.position, {
        x: 2,
        scrollTrigger: {
          trigger: ".feature-section-1",
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });

      gsap.to(meshRef.current!.position, {
        x: -2,
        scrollTrigger: {
          trigger: ".feature-section-2",
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });
    });

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshDistortMaterial
          color="#66FCF1"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.5}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-brand-dark">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#45A29E" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#aa3bff" />
        <AnimatedShape />
      </Canvas>
    </div>
  );
}
