"use client"

interface PauseMenuProps {
  onResume: () => void
  onInstructions: () => void
  onQuit: () => void
}

export function PauseMenu({ onResume, onInstructions, onQuit }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 bg-lime-300 z-10 flex flex-col items-center justify-center nokia-text">
      <div className="bg-lime-400 border-2 border-nokia-dark p-4 rounded-lg shadow-md w-4/5 max-w-xs">
        <h2 className="text-xl font-bold text-nokia-dark text-center mb-4 nokia-text">PAUSED</h2>

        <div className="flex flex-col space-y-3">
          <button
            className="px-4 py-2 bg-lime-500 text-nokia-dark border-2 border-nokia-dark rounded font-bold hover:bg-lime-600 nokia-text"
            onClick={onResume}
          >
            RESUME
          </button>

          <button
            className="px-4 py-2 bg-lime-500 text-nokia-dark border-2 border-nokia-dark rounded font-bold hover:bg-lime-600 nokia-text"
            onClick={onInstructions}
          >
            INSTRUCTIONS
          </button>

          <button
            className="px-4 py-2 bg-lime-500 text-nokia-dark border-2 border-nokia-dark rounded font-bold hover:bg-lime-600 nokia-text"
            onClick={onQuit}
          >
            QUIT
          </button>
        </div>
      </div>
    </div>
  )
}
