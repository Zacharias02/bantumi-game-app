"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/three"
import type * as THREE from "three"

interface SeedProps {
  position: [number, number, number]
  selected: boolean
  index: number
}

export function Seed({ position, selected, index }: SeedProps) {
  const seedRef = useRef<THREE.Mesh>(null)

  // Animate seeds when selected
  const { scale, rotation } = useSpring({
    scale: selected ? 1.2 : 1,
    rotation: selected ? [0, Math.PI * 2, 0] : [0, 0, 0],
    config: { tension: 170, friction: 26 },
  })

  // Add subtle movement to seeds
  useFrame((state) => {
    if (seedRef.current) {
      // Each seed moves slightly differently based on its index
      const t = state.clock.getElapsedTime() + index * 0.5
      seedRef.current.position.x = position[0] + Math.sin(t * 2) * 0.01
      seedRef.current.position.y = position[1] + Math.cos(t * 1.5) * 0.01
    }
  })

  return (
    <animated.mesh ref={seedRef} position={position} scale={scale} rotation={rotation}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="#4d7c0f" roughness={0.6} />
    </animated.mesh>
  )
}
