import type React from "react"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="./assets/favicon.ico" />
        <title>Bantumi Game</title>
      </head>
      <body>        
        <Suspense>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
