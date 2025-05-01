/**
 * Represents the current state of the animation
 */
export interface AnimationState {
  isAnimating: boolean
  currentPit: number | null
  seedsInHand: number
  steps: Array<{ pit: number; seedsAdded: number }>
  currentStep: number
}

/**
 * Initial state for animations
 */
export const initialAnimationState: AnimationState = {
  isAnimating: false,
  currentPit: null,
  seedsInHand: 0,
  steps: [],
  currentStep: 0,
}
