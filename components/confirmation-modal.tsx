"use client"

import { memo, useEffect } from "react"

interface ConfirmationModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmationModalComponent({ title, message, onConfirm, onCancel }: ConfirmationModalProps) {
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
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="bg-lime-300 border-2 border-nokia-dark rounded-lg p-4 w-full max-w-xs shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
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

// Memoize the component to prevent unnecessary re-renders
export const ConfirmationModal = memo(ConfirmationModalComponent)
