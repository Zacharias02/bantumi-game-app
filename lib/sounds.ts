// Sound effects for the game
export const playButtonClickSound = () => {
  const audio = new Audio('/assets/sounds/swoop.mp3')
  audio.volume = 0.5
  audio.play().catch(err => console.log('Error playing sound:', err))
}

export const playWinnerSound = () => {
  const audio = new Audio('/assets/sounds/winner.mp3')
  audio.volume = 0.1
  audio.play().catch(err => console.log('Error playing sound:', err))
}

export const playGameOverSound = () => {
  const audio = new Audio('/assets/sounds/game-over.mp3')
  audio.volume = 0.2
  audio.play().catch(err => console.log('Error playing sound:', err))
} 