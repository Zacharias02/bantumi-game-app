"use client"

import { type GameState, Player } from "@/lib/game-types"

interface GameOverScreenProps {
  gameState: GameState
  onPlayAgain: () => void
  onMenuClick: () => void
  playAgainstAI?: boolean
}

export function GameOverScreen({ gameState, onPlayAgain, onMenuClick, playAgainstAI = false }: GameOverScreenProps) {
  // Determine winner
  const winner =
    gameState.stores[Player.One] > gameState.stores[Player.Two]
      ? Player.One
      : gameState.stores[Player.One] < gameState.stores[Player.Two]
        ? Player.Two
        : null

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-nokia-dark mb-4 nokia-text">GAME OVER</h1>

      <div className="text-lg font-bold text-nokia-dark mb-6 nokia-text">
        {winner === null
          ? "IT'S A TIE!"
          : winner === Player.One
            ? "YOU WIN!"
            : playAgainstAI
              ? "COMPUTER WINS!"
              : "PLAYER 2 WINS!"}
      </div>

      <div className="bg-lime-400 border-2 border-nokia-dark rounded-lg p-2 mb-6">
        <div className="text-sm text-nokia-dark mb-1 nokia-text">FINAL SCORE:</div>
        <div className="flex justify-between space-x-4">
          <div className="text-nokia-dark nokia-text">
            {playAgainstAI ? "YOU:" : "P1:"} {gameState.stores[Player.One]}
          </div>
          <div className="text-nokia-dark nokia-text">
            {playAgainstAI ? "AI:" : "P2:"} {gameState.stores[Player.Two]}
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          className="px-3 py-1 bg-lime-400 text-nokia-dark border-2 border-nokia-dark rounded font-bold nokia-text"
          onClick={onPlayAgain}
        >
          PLAY AGAIN
        </button>

        <button
          className="px-3 py-1 bg-lime-400 text-nokia-dark border-2 border-nokia-dark rounded font-bold nokia-text"
          onClick={onMenuClick}
        >
          MENU
        </button>
      </div>
    </div>
  )
}
