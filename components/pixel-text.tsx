"use client"

import { Text } from "@react-three/drei"

interface PixelTextProps {
  text: string
  position: [number, number, number]
  fontSize?: number
  color?: string
}

export function PixelText({ text, position, fontSize = 0.1, color = "#4d7c0f" }: PixelTextProps) {
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={color}
      font="/fonts/GeistMono-Bold.ttf"
      anchorX="center"
      anchorY="middle"
      characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?"
    >
      {text}
    </Text>
  )
}
