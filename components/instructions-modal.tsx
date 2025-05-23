"use client"

import { memo, useEffect } from "react"

interface InstructionsModalProps {
  onClose: () => void
}

function InstructionsModalComponent({ onClose }: InstructionsModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Save the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow
    // Prevent scrolling on the background
    document.body.style.overflow = "hidden"

    // Restore original overflow on cleanup
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 touch-none"
      onClick={(e) => {
        // Close when clicking the backdrop (outside the modal)
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-lime-300 border-2 border-nokia-dark rounded-lg p-3 w-full max-w-xs shadow-lg max-h-[80vh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-lime-300 pb-1">
          <h2 className="text-lg font-bold text-nokia-dark nokia-text">HOW TO PLAY</h2>
          <button
            className="text-nokia-dark text-2xl font-bold hover:text-lime-700 w-8 h-8 flex items-center justify-center"
            onClick={onClose}
            aria-label="Close instructions"
          >
            ×
          </button>
        </div>

        <div className="text-sm space-y-3 nokia-text text-nokia-dark">
          <div>
            <p className="font-bold">SETUP:</p>
            <p>• 2 rows of 6 pits</p>
            <p>• 2 stores (one for each player)</p>
            <p>• 4 seeds in each pit</p>
          </div>

          <div>
            <p className="font-bold">GOAL:</p>
            <p>Collect the most seeds in your store</p>
          </div>

          <div>
            <p className="font-bold">MOVES:</p>
            <p>• Select a pit on your side</p>
            <p>• Seeds are distributed counter-clockwise</p>
            <p>• Skip opponent's store</p>
          </div>

          <div>
            <p className="font-bold">SPECIAL RULES:</p>
            <p>• Last seed in your store: free turn</p>
            <p>• Last seed in empty pit on your side: capture opposite seeds</p>
          </div>

          <div>
            <p className="font-bold">GAME END:</p>
            <p>When one player has no seeds left</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            className="px-4 py-2 bg-lime-500 text-nokia-dark border-2 border-nokia-dark rounded font-bold nokia-text"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const InstructionsModal = memo(InstructionsModalComponent)
