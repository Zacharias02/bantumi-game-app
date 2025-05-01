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
    <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-gray-900 touch-auto">
      {/* Game title */}
      <div className="absolute top-4 left-4 text-lime-400 text-2xl font-bold nokia-text">BANTUMI</div>

      {/* Instructions button */}
      <button
        className="absolute top-4 right-4 text-lime-400 text-2xl font-bold hover:text-lime-500 p-2 touch-auto"
        onClick={toggleInstructions}
        aria-label="Instructions"
      >
        ?
      </button>

      <animated.div style={screenProps} className="relative w-full max-w-md h-full flex items-center justify-center">
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

      {/* Attribution */}
      <div className="absolute bottom-4 text-center w-full">
        <p className="text-lime-400 text-sm nokia-text">
          Vibe Coded by{" "}
          <a
            href="https://jlnecesito.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-lime-300 transition-colors"
          >
            JL Necesito
          </a>
        </p>
      </div>

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
