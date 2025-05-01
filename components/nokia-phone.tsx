"use client"

import { useRef, memo } from "react"
import type React from "react"

interface NokiaPhoneProps {
  children: React.ReactNode
}

function NokiaPhoneComponent({ children }: NokiaPhoneProps) {
  const phoneRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative w-full h-full max-w-xs mx-auto flex items-center justify-center">
      {/* Phone body */}
      <div
        ref={phoneRef}
        className="relative bg-slate-800 rounded-3xl p-3 shadow-2xl transform transition-all duration-500 ease-out"
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "min(85vh, 580px)",
          aspectRatio: "1/2",
        }}
      >
        {/* Screen bezel */}
        <div className="absolute inset-4 rounded-lg bg-slate-900 overflow-hidden">
          {/* Screen (Nokia green) */}
          <div className="absolute inset-2 bg-lime-300 rounded overflow-hidden flex items-center justify-center">
            {/* Pixelated grid overlay for retro effect */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />

            {/* Screen content */}
            <div className="relative w-full h-full p-2 flex flex-col items-center justify-center nokia-text">
              {children}
            </div>
          </div>
        </div>

        {/* Nokia logo */}
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <div className="text-slate-700 font-bold text-sm nokia-text">NOKIA</div>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const NokiaPhone = memo(NokiaPhoneComponent)
