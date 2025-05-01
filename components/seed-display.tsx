"use client"

interface SeedDisplayProps {
  count: number
}

export function SeedDisplay({ count }: SeedDisplayProps) {
  // For simplicity, we'll just show the number
  return <span className="text-nokia-dark font-bold nokia-text">{count}</span>
}
