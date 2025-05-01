"use client"

import type React from "react"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { useSpring, animated } from "@react-spring/three"
import type * as THREE from "three"

export function Nokia3310Frame({ children }: { children: React.ReactNode }) {
  const frameRef = useRef<THREE.Group>(null)

  // Add subtle floating animation to the phone
  useFrame((state) => {
    if (frameRef.current) {
      frameRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05
      frameRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
    }
  })

  // Spring animation for the frame appearance
  const frameProps = useSpring({
    scale: [1, 1, 1],
    from: { scale: [0, 0, 0] },
    config: { mass: 2, tension: 170, friction: 26 },
  })

  return (
    <animated.group ref={frameRef} scale={frameProps.scale}>
      {/* Phone body */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[2.2, 4, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 2.4, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      {/* Screen (Nokia green) */}
      <mesh position={[0, 0.5, 0.06]}>
        <boxGeometry args={[1.6, 2.2, 0.01]} />
        <meshStandardMaterial color="#a3e635" emissive="#a3e635" emissiveIntensity={0.4} />
      </mesh>

      {/* Nokia logo */}
      <Text
        position={[0, 2.1, 0.1]}
        fontSize={0.15}
        color="#0f172a"
        font="/fonts/GeistMono-Bold.ttf"
        anchorX="center"
        anchorY="middle"
      >
        NOKIA
      </Text>

      {/* Screen content */}
      <group position={[0, 0.5, 0.1]}>{children}</group>

      {/* Keypad area */}
      <mesh position={[0, -1.3, 0.05]}>
        <boxGeometry args={[1.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
    </animated.group>
  )
}
