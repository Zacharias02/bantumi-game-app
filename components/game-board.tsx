"use client"

import { useState, memo } from "react"
import { type GameState, Player } from "@/lib/game-types"
import { SeedDisplay } from "./seed-display"

interface GameBoardProps {
  gameState: GameState
  selectedPit: number | null
  onPitSelect: (pitIndex: number) => void
  animating: boolean
  playAgainstAI?: boolean
  currentAnimationPit?: number | null
}

function GameBoardComponent({
  gameState,
  selectedPit,
  onPitSelect,
  animating,
  playAgainstAI = false,
  currentAnimationPit = null,
}: GameBoardProps) {
  const [hoveredPit, setHoveredPit] = useState<number | null>(null)

  // Convert store index (106 or 113) to regular display
  const isPitHighlighted = (index: number) => {
    if (currentAnimationPit === null) return false
    if (currentAnimationPit === index) return true

    // Handle store highlighting (106 for player 1, 113 for player 2)
    if (index === 0 && currentAnimationPit === 106) return true
    if (index === 1 && currentAnimationPit === 113) return true

    return false
  }

  // Determine hand emoji position
  const getHandPosition = () => {
    if (currentAnimationPit === null) {
      // Default position based on current player
      return gameState.currentPlayer === Player.One ? "bottom" : "top"
    }

    // If pointing to a store
    if (currentAnimationPit === 106) return "right" // Player 1 store
    if (currentAnimationPit === 113) return "left" // Player 2 store

    // If pointing to a regular pit
    if (currentAnimationPit < 6) return "bottom" // Player 1 pits
    if (currentAnimationPit >= 6 && currentAnimationPit < 12) return "top" // Player 2 pits

    return gameState.currentPlayer === Player.One ? "bottom" : "top" // Default fallback
  }

  // Get hand emoji based on position
  const getHandEmoji = () => {
    const position = getHandPosition()
    switch (position) {
      case "top":
        return "👆"
      case "bottom":
        return "👇"
      case "left":
        return "👈"
      case "right":
        return "👉"
      default:
        return gameState.currentPlayer === Player.One ? "👇" : "👆"
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-10">
      <div className="text-center mb-2 text-nokia-dark text-xs font-bold nokia-text">
        {playAgainstAI ? "COMPUTER" : "PLAYER 2"}
      </div>

      {/* Player 2 pits (top row) */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        {[11, 10, 9, 8, 7, 6].map((i) => {
          const isSelectable = gameState.currentPlayer === Player.Two && !playAgainstAI && gameState.board[i] > 0
          const isHighlighted = isPitHighlighted(i)
          return (
            <button
              key={`pit-${i}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold nokia-text
                ${selectedPit === i ? "bg-lime-500" : isHighlighted ? "bg-lime-600" : "bg-lime-400"} 
                ${isSelectable ? "hover:bg-lime-500 cursor-pointer" : "opacity-70 cursor-default"}
                ${hoveredPit === i ? "ring-2 ring-lime-700" : ""}
                border-2 border-nokia-dark transition-colors duration-200`}
              onClick={() => onPitSelect(i)}
              onMouseEnter={() => !animating && isSelectable && setHoveredPit(i)}
              onMouseLeave={() => setHoveredPit(null)}
              disabled={animating || !isSelectable}
            >
              <SeedDisplay count={gameState.board[i]} />
            </button>
          )
        })}
      </div>

      {/* Stores (mancalas) */}
      <div className="flex justify-between w-full px-1 mb-2">
        <div
          className={`w-8 h-16 rounded-lg ${isPitHighlighted(1) ? "bg-lime-600" : "bg-lime-400"} border-2 border-nokia-dark flex items-center justify-center text-sm font-bold nokia-text transition-colors duration-200`}
        >
          {gameState.stores[Player.Two]}
        </div>

        {/* Current player indicator */}
        <div className="flex items-center justify-center">
          <div
            className={`w-6 h-6 flex items-center justify-center animate-pulse ${animating ? "opacity-100" : "opacity-70"}`}
          >
            {getHandEmoji()}
          </div>
        </div>

        <div
          className={`w-8 h-16 rounded-lg ${isPitHighlighted(0) ? "bg-lime-600" : "bg-lime-400"} border-2 border-nokia-dark flex items-center justify-center text-sm font-bold nokia-text transition-colors duration-200`}
        >
          {gameState.stores[Player.One]}
        </div>
      </div>

      {/* Player 1 pits (bottom row) */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const isSelectable = gameState.currentPlayer === Player.One && gameState.board[i] > 0
          const isHighlighted = isPitHighlighted(i)
          return (
            <button
              key={`pit-${i}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold nokia-text
                ${selectedPit === i ? "bg-lime-500" : isHighlighted ? "bg-lime-600" : "bg-lime-400"} 
                ${isSelectable ? "hover:bg-lime-500 cursor-pointer" : "opacity-70 cursor-default"}
                ${hoveredPit === i ? "ring-2 ring-lime-700" : ""}
                border-2 border-nokia-dark transition-colors duration-200`}
              onClick={() => onPitSelect(i)}
              onMouseEnter={() => !animating && isSelectable && setHoveredPit(i)}
              onMouseLeave={() => setHoveredPit(null)}
              disabled={animating || !isSelectable}
            >
              <SeedDisplay count={gameState.board[i]} />
            </button>
          )
        })}
      </div>

      <div className="text-center mt-2 text-nokia-dark text-xs font-bold nokia-text">PLAYER 1</div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const GameBoard = memo(GameBoardComponent)
