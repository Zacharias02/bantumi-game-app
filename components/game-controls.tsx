"use client"
import { memo } from "react"
import type { Player, GameState } from "@/lib/game-types"

interface GameControlsProps {
  currentPlayer: Player
  onPauseClick: () => void
  onQuitClick: () => void
  gameState: GameState
  playAgainstAI?: boolean
}

function GameControlsComponent({
  currentPlayer,
  onPauseClick,
  onQuitClick,
}: GameControlsProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-2 text-xs nokia-text">
      <button
        className="px-2 py-1 bg-lime-400 text-nokia-dark border border-nokia-dark rounded nokia-text"
        onClick={onPauseClick}
      >
        PAUSE
      </button>

      <button
        className="px-2 py-1 bg-lime-400 text-nokia-dark border border-nokia-dark rounded nokia-text"
        onClick={onQuitClick}
      >
        QUIT
      </button>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const GameControls = memo(GameControlsComponent)
