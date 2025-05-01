"use client"

interface PauseOverlayProps {
  onResume: () => void
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 bg-lime-300 bg-opacity-80 z-10 flex flex-col items-center justify-center nokia-text">
      <div className="bg-lime-400 border-2 border-nokia-dark p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-nokia-dark text-center mb-4 nokia-text">PAUSED</h2>

        <button
          className="px-4 py-2 bg-lime-500 text-nokia-dark border-2 border-nokia-dark rounded font-bold hover:bg-lime-600 nokia-text"
          onClick={onResume}
        >
          RESUME
        </button>
      </div>
    </div>
  )
}
