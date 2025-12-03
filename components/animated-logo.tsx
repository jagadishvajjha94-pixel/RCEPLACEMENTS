"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Center } from "@react-three/drei"
import * as THREE from "three"

function RotatingLogo() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      <Center>
        {/* Use a simple box geometry as fallback since font file doesn't exist */}
        <mesh>
          <boxGeometry args={[2, 0.5, 0.2]} />
          <meshStandardMaterial
            color="#FF8C42"
            metalness={0.8}
            roughness={0.2}
            emissive="#FF8C42"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* RCE text using simple geometry */}
        <group position={[-0.6, 0, 0.1]}>
          <mesh>
            <boxGeometry args={[0.3, 0.8, 0.1]} />
            <meshStandardMaterial color="#FF8C42" emissive="#FF8C42" emissiveIntensity={0.3} />
          </mesh>
        </group>
        <group position={[0, 0, 0.1]}>
          <mesh>
            <boxGeometry args={[0.3, 0.8, 0.1]} />
            <meshStandardMaterial color="#2E86AB" emissive="#2E86AB" emissiveIntensity={0.3} />
          </mesh>
        </group>
        <group position={[0.6, 0, 0.1]}>
          <mesh>
            <boxGeometry args={[0.3, 0.8, 0.1]} />
            <meshStandardMaterial color="#A23B72" emissive="#A23B72" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </Center>
      
      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#2E86AB" emissive="#2E86AB" emissiveIntensity={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

export function AnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2E86AB" />
        <RotatingLogo />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}

// Fallback 2D animated logo for environments where 3D doesn't work
export function AnimatedLogo2D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8C42" />
              <stop offset="50%" stopColor="#2E86AB" />
              <stop offset="100%" stopColor="#A23B72" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="none" stroke="url(#logoGradient)" strokeWidth="4" opacity="0.3" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="url(#logoGradient)" strokeWidth="3" opacity="0.5" />
          <text
            x="100"
            y="115"
            fontSize="48"
            fontWeight="bold"
            textAnchor="middle"
            fill="url(#logoGradient)"
            className="font-sans"
          >
            RCE
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full animate-pulse"
            style={{
              transform: `rotate(${i * 60}deg) translateY(-70px)`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}