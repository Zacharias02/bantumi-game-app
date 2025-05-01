"use client"

import { useState, memo } from "react"

interface TitleScreenProps {
  onStartGame: () => void
  onStartAIGame: () => void
  onShowInstructions: () => void
}

function TitleScreenComponent({ onStartGame, onStartAIGame, onShowInstructions }: TitleScreenProps) {
  const [selectedOption, setSelectedOption] = useState<number>(0)
  const options = [
    { label: "1 PLAYER", action: onStartAIGame },
    { label: "2 PLAYERS", action: onStartGame },
  ]

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Title */}
      <h1 className="text-2xl font-bold text-nokia-dark mb-4 nokia-text">BANTUMI</h1>

      {/* Decorative bowls */}
      <div className="flex justify-center space-x-8 mb-6">
        <div className="w-12 h-8 border-2 border-nokia-dark rounded-b-full bg-lime-400 relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-nokia-dark rounded-full"></div>
          <div className="absolute top-1 right-1 w-2 h-2 bg-nokia-dark rounded-full"></div>
        </div>
        <div className="w-12 h-8 border-2 border-nokia-dark rounded-b-full bg-lime-400 relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-nokia-dark rounded-full"></div>
          <div className="absolute top-1 right-1 w-2 h-2 bg-nokia-dark rounded-full"></div>
        </div>
      </div>

      {/* Menu options */}
      <div className="flex flex-col space-y-2 w-full max-w-xs">
        {options.map((option, index) => (
          <button
            key={index}
            className={`px-4 py-1 text-sm font-bold rounded nokia-text
              ${selectedOption === index ? "bg-nokia-dark text-lime-400" : "bg-lime-400 text-nokia-dark border border-nokia-dark"}`}
            onClick={option.action}
            onMouseEnter={() => setSelectedOption(index)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 text-xs text-nokia-dark nokia-text">© 2023 NOKIA 3310</div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const TitleScreen = memo(TitleScreenComponent)
