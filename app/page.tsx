"use client"

import { useState, useEffect, useCallback } from "react"
import { useSpring, animated } from "@react-spring/web"
import { GameBoard } from "@/components/game-board"
import { type GameState, Player } from "@/lib/game-types"
import { initialGameState, checkGameOver, makeAIMove, generateMoveSteps } from "@/lib/game-logic"
import { GameControls } from "@/components/game-controls"
import { GameOverScreen } from "@/components/game-over-screen"
import { TitleScreen } from "@/components/title-screen"
import { NokiaPhone } from "@/components/nokia-phone"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { InstructionsModal } from "@/components/instructions-modal"
import { PauseOverlay } from "@/components/pause-overlay"
import { type AnimationState, initialAnimationState } from "@/lib/animation-types"

export default function BantumiGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [selectedPit, setSelectedPit] = useState<number | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"title" | "game" | "gameOver">("title")

  // UI state
  const [animating, setAnimating] = useState(false)
  const [playAgainstAI, setPlayAgainstAI] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  // Animation state
  const [animationState, setAnimationState] = useState<AnimationState>(initialAnimationState)

  // Nokia 3310 screen animation
  const screenProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { tension: 100, friction: 30 },
  })

  // Process animation steps
  useEffect(() => {
    if (animationState.isAnimating && animationState.steps.length > 0 && !isPaused) {
      const timer = setTimeout(() => {
        // Move to next animation step
        if (animationState.currentStep < animationState.steps.length - 1) {
          setAnimationState((prev) => ({
            ...prev,
            currentStep: prev.currentStep + 1,
            currentPit: prev.steps[prev.currentStep + 1].pit,
          }))
        } else {
          // Animation finished
          setAnimationState(initialAnimationState)
          setAnimating(false)

          // Check if game is over
          const gameOverState = checkGameOver(gameState)
          if (gameOverState.gameOver) {
            setTimeout(() => {
              setGameState(gameOverState)
              setCurrentScreen("gameOver")
            }, 1000)
          }
        }
      }, 300) // Animation speed

      return () => clearTimeout(timer)
    }
  }, [animationState, gameState, isPaused])

  // AI move logic
  useEffect(() => {
    if (
      playAgainstAI &&
      currentScreen === "game" &&
      !animating &&
      !gameState.gameOver &&
      gameState.currentPlayer === Player.Two &&
      !isPaused
    ) {
      // Add a small delay to make it feel more natural
      const aiTimer = setTimeout(() => {
        setAnimating(true)

        // Another small delay before executing the move
        setTimeout(() => {
          const aiMoveResult = makeAIMove(gameState)
          setSelectedPit(aiMoveResult.selectedPit)

          // Start animation
          setAnimationState({
            isAnimating: true,
            currentPit: aiMoveResult.selectedPit,
            seedsInHand: gameState.board[aiMoveResult.selectedPit || 0],
            steps: aiMoveResult.steps || [],
            currentStep: 0,
          })

          // Update game state
          setGameState(aiMoveResult.newState)
        }, 500)
      }, 1000)

      return () => clearTimeout(aiTimer)
    }
  }, [gameState, currentScreen, animating, playAgainstAI, isPaused])

  // Memoize handlers to prevent unnecessary re-renders
  const handlePitSelect = useCallback(
    (pitIndex: number) => {
      if (
        animating ||
        gameState.gameOver ||
        isPaused ||
        (gameState.currentPlayer === Player.One && pitIndex > 5) ||
        (gameState.currentPlayer === Player.Two && pitIndex < 6 && !playAgainstAI) ||
        gameState.board[pitIndex] === 0
      ) {
        return
      }

      setSelectedPit(pitIndex)
      setAnimating(true)

      // Generate move steps for animation
      const { finalState, steps } = generateMoveSteps(gameState, pitIndex)

      // Start animation
      setAnimationState({
        isAnimating: true,
        currentPit: pitIndex,
        seedsInHand: gameState.board[pitIndex],
        steps,
        currentStep: 0,
      })

      // Update game state
      setGameState(finalState)
    },
    [animating, gameState, isPaused, playAgainstAI],
  )

  const startNewGame = useCallback((againstAI = false) => {
    setGameState(initialGameState)
    setPlayAgainstAI(againstAI)
    setCurrentScreen("game")
    setAnimationState(initialAnimationState)
    setIsPaused(false)
  }, [])

  const returnToTitle = useCallback(() => {
    setCurrentScreen("title")
    setIsPaused(false)
  }, [])

  const handlePauseClick = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleResumeClick = useCallback(() => {
    setIsPaused(false)
  }, [])

  const handleQuitClick = useCallback(() => {
    setShowQuitConfirmation(true)
  }, [])

  const handleQuitConfirm = useCallback(() => {
    setShowQuitConfirmation(false)
    returnToTitle()
  }, [returnToTitle])

  const handleQuitCancel = useCallback(() => {
    setShowQuitConfirmation(false)
  }, [])

  const toggleInstructions = useCallback(() => {
    setShowInstructions((prev) => !prev)
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen w-screen overflow-x-hidden bg-gray-900 touch-auto pb-8 md:pb-0">
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row justify-between items-center px-4 py-4 bg-transparent space-y-2 md:space-y-0">
        <div className="flex items-center">
          <div className="text-lime-400 text-2xl font-bold nokia-text">BANTUMI</div>
          <div className="text-lime-300 text-xs nokia-text ml-2">v0.1.1</div>
        </div>
        <div className="flex space-x-2">
          <a
            href="https://github.com/Zacharias02/bantumi-game-app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub">
            <img src="assets/github.svg" alt="Github Icon" className="w-7 h-7 ml-1" />
          </a>
          <a
            href="https://jlnecesito.webflow.io"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website">
              <img src="assets/web3.svg" alt="Website Icon" className="w-7 h-7 ml-1" />
          </a>
          <a
            href="https://www.facebook.com/jlnecesito02"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook">
              <img src="assets/facebook.svg" alt="Facebook Icon" className="w-7 h-7 ml-1" />
          </a>
          <a
            href="https://www.linkedin.com/in/john-lester-necesito"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn">
              <img src="assets/linkedin.svg" alt="LinkedIn Icon" className="w-7 h-7 ml-1" />
          </a>
        </div>
      </header>
  
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start w-full pt-4 pb-6 md:pb-6 sm:pb-20 overflow-y-auto">
        <animated.div
          style={screenProps}
          className="relative w-full max-w-md flex items-center justify-center max-h-[90vh] md:max-h-none overflow-y-auto"
        >
          <NokiaPhone>
        {currentScreen === "title" && (
          <TitleScreen
        onStartGame={() => startNewGame(false)}
        onStartAIGame={() => startNewGame(true)}
        onShowInstructions={toggleInstructions}
          />
        )}

        {currentScreen === "game" && (
          <>
        <GameControls
          currentPlayer={gameState.currentPlayer}
          onPauseClick={handlePauseClick}
          onQuitClick={handleQuitClick}
          gameState={gameState}
          playAgainstAI={playAgainstAI}
        />

        <GameBoard
          gameState={gameState}
          selectedPit={selectedPit}
          onPitSelect={handlePitSelect}
          animating={animating}
          playAgainstAI={playAgainstAI}
          currentAnimationPit={animationState.currentPit}
        />

        {isPaused && <PauseOverlay onResume={handleResumeClick} />}
          </>
        )}

        {currentScreen === "gameOver" && (
          <GameOverScreen
        gameState={gameState}
        onPlayAgain={() => startNewGame(playAgainstAI)}
        onMenuClick={returnToTitle}
        playAgainstAI={playAgainstAI}
          />
        )}
          </NokiaPhone>
        </animated.div>
      </main>

      {/* Modals */}
      {showQuitConfirmation && (
        <ConfirmationModal
          title="QUIT GAME"
          message="Are you sure you want to quit the current game?"
          onConfirm={handleQuitConfirm}
          onCancel={handleQuitCancel}
        />
      )}
  
      {showInstructions && <InstructionsModal onClose={toggleInstructions} />}
    </div>
  )
}
