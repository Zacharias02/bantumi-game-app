import { type GameState, Player } from "./game-types"

// 6 pits per player, 4 stones each, 2 Mancalas (stores)
export const initialGameState: GameState = {
  board: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], // 0-5: P1 pits, 6: P1 Mancala, 7-12: P2 pits, 13: P2 Mancala
  stores: [0, 0], // Deprecated, use board[6] and board[13]
  currentPlayer: Player.One,
  gameOver: false,
}

function getStoreIndex(player: Player) {
  return player === Player.One ? 6 : 13
}
function isOwnPit(player: Player, pit: number) {
  return player === Player.One ? pit >= 0 && pit <= 5 : pit >= 7 && pit <= 12
}
function getOppositePit(pit: number) {
  // 0 <-> 12, 1 <-> 11, ..., 5 <-> 7, 7 <-> 5, ..., 12 <-> 0
  if (pit >= 0 && pit <= 5) {
    return 12 - pit;
  } else if (pit >= 7 && pit <= 12) {
    return 12 - pit;
  }
  return -1; // Not a valid pit for capture
}

/**
 * Generates the steps for a move and returns the final state
 */
export function generateMoveSteps(
  gameState: GameState,
  pitIndex: number,
): { finalState: GameState; steps: Array<{ pit: number; seedsAdded: number }> } {
  // Clone state
  const newState: GameState = {
    board: [...gameState.board],
    stores: [gameState.board[6], gameState.board[13]],
    currentPlayer: gameState.currentPlayer,
    gameOver: gameState.gameOver,
    lastMove: pitIndex,
  }

  // Validate move
  if (
    newState.gameOver ||
    !isOwnPit(newState.currentPlayer, pitIndex) ||
    newState.board[pitIndex] === 0
  ) {
    return { finalState: gameState, steps: [] }
  }

  let stones = newState.board[pitIndex]
  newState.board[pitIndex] = 0
  let currentPit = pitIndex
  const steps: Array<{ pit: number; seedsAdded: number }> = []

  while (stones > 0) {
    currentPit = (currentPit + 1) % 14
    // Skip opponent's Mancala
    if (
      (newState.currentPlayer === Player.One && currentPit === 13) ||
      (newState.currentPlayer === Player.Two && currentPit === 6)
    ) {
      continue
    }
    newState.board[currentPit]++
    steps.push({ pit: currentPit, seedsAdded: 1 })
    stones--
  }

  // Capture rule
  if (
    isOwnPit(newState.currentPlayer, currentPit) &&
    newState.board[currentPit] === 1 // Landed in empty own pit
  ) {
    const oppositePit = getOppositePit(currentPit)
    if (newState.board[oppositePit] > 0) {
      const storeIdx = getStoreIndex(newState.currentPlayer)
      const captured = newState.board[oppositePit] + newState.board[currentPit]
      newState.board[storeIdx] += captured
      steps.push({ pit: storeIdx, seedsAdded: captured })
      // Remove stones from both pits
      steps.push({ pit: currentPit, seedsAdded: -newState.board[currentPit] })
      steps.push({ pit: oppositePit, seedsAdded: -newState.board[oppositePit] })
      newState.board[currentPit] = 0
      newState.board[oppositePit] = 0
    }
  }

  // Extra turn if last stone in own Mancala
  const ownStore = getStoreIndex(newState.currentPlayer)
  if (currentPit !== ownStore) {
    newState.currentPlayer = newState.currentPlayer === Player.One ? Player.Two : Player.One
  }

  // Update stores array for compatibility
  newState.stores = [newState.board[6], newState.board[13]]

  return { finalState: checkGameOver(newState), steps }
}

/**
 * Makes a move without animation steps
 */
export function makeMove(gameState: GameState, pitIndex: number): GameState {
  const { finalState } = generateMoveSteps(gameState, pitIndex)
  return finalState
}

/**
 * Checks if the game is over and updates the state accordingly
 */
export function checkGameOver(gameState: GameState): GameState {
  const board = [...gameState.board]
  const player1Empty = board.slice(0, 6).every((n) => n === 0)
  const player2Empty = board.slice(7, 13).every((n) => n === 0)

  if (player1Empty || player2Empty) {
    // Collect remaining stones
    let p1Remaining = 0
    let p2Remaining = 0
    for (let i = 0; i < 6; i++) {
      p1Remaining += board[i]
      board[i] = 0
    }
    for (let i = 7; i < 13; i++) {
      p2Remaining += board[i]
      board[i] = 0
    }
    board[6] += p1Remaining
    board[13] += p2Remaining

    return {
      ...gameState,
      board,
      stores: [board[6], board[13]],
      gameOver: true,
    }
  }
  return { ...gameState, board, stores: [board[6], board[13]] }
}

/**
 * AI move logic for Player Two (easy-medium)
 * - Prefer extra turn, then capture, else first available
 */
export function getAIMove(gameState: GameState): number | null {
  if (gameState.currentPlayer !== Player.Two || gameState.gameOver) return null;

  // 1. Try to get an extra turn (last stone in Mancala)
  for (let pit = 7; pit <= 12; pit++) {
    const stones = gameState.board[pit];
    if (stones === 0) continue;
    const target = (pit + stones) % 14;
    if (target === 13) return pit;
  }

  // 2. Try to capture
  for (let pit = 7; pit <= 12; pit++) {
    const stones = gameState.board[pit];
    if (stones === 0) continue;
    let currentPit = pit;
    let s = stones;
    while (s > 0) {
      currentPit = (currentPit + 1) % 14;
      if (currentPit === 6) continue; // skip opponent's Mancala
      s--;
    }
    if (
      isOwnPit(Player.Two, currentPit) &&
      gameState.board[currentPit] === 0 &&
      gameState.board[getOppositePit(currentPit)] > 0
    ) {
      return pit;
    }
  }

  // 3. Otherwise, pick the first available pit
  for (let pit = 7; pit <= 12; pit++) {
    if (gameState.board[pit] > 0) return pit;
  }

  return null;
}

/**
 * Combines AI move selection with move execution and animation steps
 */
export function makeAIMove(gameState: GameState): {
  newState: GameState
  selectedPit: number | null
  steps: Array<{ pit: number; seedsAdded: number }> | null
} {
  const selectedPit = getAIMove(gameState)

  if (selectedPit !== null) {
    const { finalState, steps } = generateMoveSteps(gameState, selectedPit)
    return { newState: finalState, selectedPit, steps }
  } else {
    return {
      newState: gameState,
      selectedPit: null,
      steps: null,
    }
  }
}

