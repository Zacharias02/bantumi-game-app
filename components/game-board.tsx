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
    if (currentAnimationPit === null) return false;
    // Highlight the pit if it's the current animation pit
    if (currentAnimationPit === index) return true;

    // Highlight store for Player One (left) and Player Two (right)
    if (index === 0 && currentAnimationPit === 106) return true;
    if (index === 1 && currentAnimationPit === 113) return true;

    return false;
  };

  // Determine hand emoji position
  const getHandPosition = () => {
    if (hoveredPit !== null) {
      // If hovering over a pit, determine its row
      if (hoveredPit < 6) return "bottom"; // Player 1 pits
      if (hoveredPit >= 7 && hoveredPit <= 12) return "top"; // Player 2 pits
    }
    if (currentAnimationPit === null) {
      return gameState.currentPlayer === Player.One ? "bottom" : "top";
    }
    if (currentAnimationPit === 106) return "right";
    if (currentAnimationPit === 113) return "left";
    if (currentAnimationPit < 6) return "bottom";
    if (currentAnimationPit >= 6 && currentAnimationPit < 12) return "top";
    return gameState.currentPlayer === Player.One ? "bottom" : "top";
  };

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
      <div className="grid grid-cols-6 gap-1 mb-2 relative">
        {[12, 11, 10, 9, 8, 7].map((i, idx) => {
          const isSelectable = gameState.currentPlayer === Player.Two && !playAgainstAI && gameState.board[i] > 0;
          const isHighlighted = isPitHighlighted(i);
          return (
            <div key={`pit-container-${i}`} className="relative flex flex-col items-center">
              {/* Hand emoji above pit if hovered */}
              {isPitHighlighted(i) && (
                <span className="absolute -bottom-8 text-xl animate-bounce">
                  👆
                </span>
              )}
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold nokia-text
                  ${selectedPit === i ? "bg-nokia-dark opacity-50" : isHighlighted ? "bg-nokia-dark opacity-90" : "bg-nokia-dark"} 
                  ${isSelectable ? "hover:bg-nokia-dark cursor-pointer" : "opacity-70 cursor-default"}
                  ${hoveredPit === i ? "ring-2 ring-lime-700" : ""}
                  border-2 border-nokia-dark transition-colors duration-200`}
                onClick={() => onPitSelect(i)}
                onMouseEnter={() => !animating && isSelectable && setHoveredPit(i)}
                onMouseLeave={() => setHoveredPit(null)}
                disabled={animating || !isSelectable}
              >
                <SeedDisplay count={gameState.board[i]} textColorClass="text-lime"/>
              </button>
            </div>
          );
        })}
      </div>

      {/* Stores (mancalas) */}
      <div className="flex justify-between w-full px-1 mb-2">
        <div
          className={`w-8 h-16 rounded-lg ${isPitHighlighted(1) ? "bg-lime-600" : "bg-nokia-dark"} border-2 border-nokia-dark flex items-center justify-center text-sm font-bold nokia-text text-lime transition-colors duration-200`}
        >
          {gameState.stores[Player.Two]}
        </div>


        {/* Current player indicator */}
        <div className="flex items-center justify-center">
            <div
            className={`w-6 h-6 flex items-center justify-center text-xl`}
            >
            {animating ? "⏳" : getHandEmoji()}
            </div>
        </div>

        <div
          className={`w-8 h-16 rounded-lg ${isPitHighlighted(0) ? "bg-lime-600" : "bg-lime-400"} border-2 border-nokia-dark flex items-center justify-center text-sm font-bold nokia-text text-nokia-dark transition-colors duration-200`}
        >
          {gameState.stores[Player.One]}
        </div>
      </div>

      {/* Player 1 pits (bottom row) */}
      <div className="grid grid-cols-6 gap-1 mb-2 relative">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const isSelectable = gameState.currentPlayer === Player.One && gameState.board[i] > 0;
          const isHighlighted = isPitHighlighted(i);
          return (
            <div key={`pit-container-${i}`} className="relative flex flex-col items-center">
              {/* Hand emoji above pit if hovered */}
              {isPitHighlighted(i) && (
                <span className="absolute -top-8 text-xl animate-bounce">
                  👇
                </span>
              )}
              <button
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
            </div>
          );
        })}
      </div>

      <div className="text-center mt-2 text-nokia-dark text-xs font-bold nokia-text">PLAYER 1</div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const GameBoard = memo(GameBoardComponent)
