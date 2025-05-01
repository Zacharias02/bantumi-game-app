export interface AnimationState {
  isAnimating: boolean
  currentPit: number | null
  seedsInHand: number
  steps: Array<{ pit: number; seedsAdded: number }>
  currentStep: number
}

export const initialAnimationState: AnimationState = {
  isAnimating: false,
  currentPit: null,
  seedsInHand: 0,
  steps: [],
  currentStep: 0,
}
