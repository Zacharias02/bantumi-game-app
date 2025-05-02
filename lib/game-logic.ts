import { type GameState, Player } from "./game-types"

// Initial game state with 4 seeds in each pit
export const initialGameState: GameState = {
  board: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  stores: [0, 0],
  currentPlayer: Player.One,
  gameOver: false,
}

/**
 * Generates the steps for a move and returns the final state
 * This is used for animation and game state updates
 */
export function generateMoveSteps(
  gameState: GameState,
  pitIndex: number,
): { finalState: GameState; steps: Array<{ pit: number; seedsAdded: number }> } {
  // Clone the current state to avoid mutations
  const newState: GameState = {
    board: [...gameState.board],
    stores: [...gameState.stores],
    currentPlayer: gameState.currentPlayer,
    gameOver: gameState.gameOver,
    lastMove: pitIndex,
  }

  // If game is over or pit is empty, return unchanged state
  if (gameState.gameOver || gameState.board[pitIndex] === 0) {
    return { finalState: gameState, steps: [] }
  }

  // Pick up seeds
  let seedsInHand = newState.board[pitIndex]
  newState.board[pitIndex] = 0

  // Track steps for animation
  const steps: Array<{ pit: number; seedsAdded: number }> = []

  // Sow seeds
  let currentPit = pitIndex
  while (seedsInHand > 0) {
    currentPit = (currentPit + 1) % 12

    // Skip opponent's store
    const isOpponentStore =
      (gameState.currentPlayer === Player.One && currentPit === 13) ||
      (gameState.currentPlayer === Player.Two && currentPit === 6)

    if (!isOpponentStore) {
      // If we're at our store
      if (
        (gameState.currentPlayer === Player.One && currentPit === 6) ||
        (gameState.currentPlayer === Player.Two && currentPit === 13)
      ) {
        newState.stores[gameState.currentPlayer]++
        steps.push({ pit: currentPit + 100, seedsAdded: 1 }) // Use pit+100 to indicate store
        seedsInHand--
      } else {
        // Regular pit
        newState.board[currentPit]++
        steps.push({ pit: currentPit, seedsAdded: 1 })
        seedsInHand--
      }
    }
  }

  // Check for capture
  if (currentPit < 12 && newState.board[currentPit] === 1) {
    const isOwnSide =
      (gameState.currentPlayer === Player.One && currentPit < 6) ||
      (gameState.currentPlayer === Player.Two && currentPit >= 6)

    if (isOwnSide) {
      const oppositePit = 11 - currentPit
      if (newState.board[oppositePit] > 0) {
        // Capture seeds
        const capturedSeeds = newState.board[currentPit] + newState.board[oppositePit]
        newState.stores[gameState.currentPlayer] += capturedSeeds

        // Add capture steps
        steps.push({ pit: currentPit, seedsAdded: -1 }) // Remove from current pit
        steps.push({ pit: oppositePit, seedsAdded: -newState.board[oppositePit] }) // Remove from opposite pit
        steps.push({ pit: gameState.currentPlayer === Player.One ? 106 : 113, seedsAdded: capturedSeeds }) // Add to store

        newState.board[currentPit] = 0
        newState.board[oppositePit] = 0
      }
    }
  }

  // Check for free turn (last seed in own store)
  const lastSeedInOwnStore =
    (gameState.currentPlayer === Player.One && currentPit === 6) ||
    (gameState.currentPlayer === Player.Two && currentPit === 13)

  if (!lastSeedInOwnStore) {
    // Switch player
    newState.currentPlayer = gameState.currentPlayer === Player.One ? Player.Two : Player.One
  }

  return { finalState: checkGameOver(newState), steps }
}

/**
 * Makes a move without animation steps
 * This is a simplified version of generateMoveSteps
 */
export function makeMove(gameState: GameState, pitIndex: number): GameState {
  const { finalState } = generateMoveSteps(gameState, pitIndex)
  return finalState
}

/**
 * Checks if the game is over and updates the state accordingly
 */
export function checkGameOver(gameState: GameState): GameState {
  const newState = { ...gameState, board: [...gameState.board], stores: [...gameState.stores] }

  // Check if one side is empty
  const player1Empty = newState.board.slice(0, 6).every((count) => count === 0)
  const player2Empty = newState.board.slice(6, 12).every((count) => count === 0)

  if (player1Empty || player2Empty) {
    // Game is over, collect remaining seeds
    for (let i = 0; i < 6; i++) {
      if (newState.board[i] > 0) {
        newState.stores[Player.One] += newState.board[i]
        newState.board[i] = 0
      }
    }

    for (let i = 6; i < 12; i++) {
      if (newState.board[i] > 0) {
        newState.stores[Player.Two] += newState.board[i]
        newState.board[i] = 0
      }
    }

    newState.gameOver = true
  }

  return newState
}

/**
 * AI move logic - returns the best move for the AI
 */
export function makeAIMove(gameState: GameState) {
  // Clone the current state
  const newState = { ...gameState, board: [...gameState.board], stores: [...gameState.stores] }

  // Only make a move if it's Player Two's turn
  if (newState.currentPlayer !== Player.Two) {
    return { newState, selectedPit: null, steps: [] }
  }

  // Get valid moves (non-empty pits on AI's side)
  const validMoves = []
  for (let i = 6; i < 12; i++) {
    if (newState.board[i] > 0) {
      validMoves.push(i)
    }
  }

  if (validMoves.length === 0) {
    return { newState, selectedPit: null, steps: [] }
  }

  // Strategy 1: Check for moves that end in the store (free turn)
  const movesWithFreeTurn = validMoves.filter((pitIndex) => {
    // Check if the number of seeds in the pit will land in the store
    const distance = 13 - pitIndex // Distance to the store
    return newState.board[pitIndex] % 13 === distance
  })

  // Strategy 2: Check for moves that can capture
  const movesWithCapture = validMoves.filter((pitIndex) => {
    const seeds = newState.board[pitIndex]
    // Calculate where the last seed will land
    const landingPit = (pitIndex + seeds) % 13
    // Check if landing pit is on AI's side and empty
    return landingPit >= 6 && landingPit < 12 && newState.board[landingPit] === 0 && newState.board[11 - landingPit] > 0
  })

  // Strategy 3: Prioritize moves with more seeds
  const sortedBySeeds = [...validMoves].sort((a, b) => newState.board[b] - newState.board[a])

  // Choose the best move based on priorities
  let selectedPit

  if (movesWithFreeTurn.length > 0) {
    // Prefer moves that give a free turn
    selectedPit = movesWithFreeTurn[0]
  } else if (movesWithCapture.length > 0) {
    // If no free turn, prefer moves that capture
    selectedPit = movesWithCapture[0]
  } else {
    // Otherwise, choose the pit with the most seeds
    selectedPit = sortedBySeeds[0]
  }

  // Get move steps
  const { finalState, steps } = generateMoveSteps(newState, selectedPit)

  return { newState: finalState, selectedPit, steps }
}
