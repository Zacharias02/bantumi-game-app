export enum Player {
  One = 0,
  Two = 1,
}

export interface GameState {
  board: number[]
  stores: [number, number]
  currentPlayer: Player
  gameOver: boolean
  lastMove?: number
}
