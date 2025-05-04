"use client"

import { memo } from "react"

interface SeedDisplayProps {
  count: number
  textColorClass?: string
}

function SeedDisplayComponent({ count, textColorClass = "text-nokia-dark" }: SeedDisplayProps) {
  return <span className={`${textColorClass} font-bold nokia-text`}>{count}</span>
}

// Memoize the component to prevent unnecessary re-renders
export const SeedDisplay = memo(SeedDisplayComponent)
