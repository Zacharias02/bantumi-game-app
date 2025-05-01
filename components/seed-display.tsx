"use client"

import { memo } from "react"

interface SeedDisplayProps {
  count: number
}

function SeedDisplayComponent({ count }: SeedDisplayProps) {
  return <span className="text-nokia-dark font-bold nokia-text">{count}</span>
}

// Memoize the component to prevent unnecessary re-renders
export const SeedDisplay = memo(SeedDisplayComponent)
