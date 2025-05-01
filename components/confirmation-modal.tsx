"use client"

interface ConfirmationModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({ title, message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-lime-300 border-2 border-nokia-dark rounded-lg p-4 max-w-xs w-full shadow-lg">
        <h2 className="text-lg font-bold text-nokia-dark mb-2 nokia-text text-center">{title}</h2>
        <p className="text-nokia-dark mb-4 nokia-text text-center">{message}</p>

        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-lime-500 text-nokia-dark border-2 border-nokia-dark rounded font-bold nokia-text"
            onClick={onConfirm}
          >
            YES
          </button>
          <button
            className="px-4 py-2 bg-lime-400 text-nokia-dark border-2 border-nokia-dark rounded font-bold nokia-text"
            onClick={onCancel}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  )
}
