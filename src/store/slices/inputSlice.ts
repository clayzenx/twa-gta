import { StateCreator } from 'zustand'
import { GameInput, Position } from '../types'

export interface InputSlice {
  input: GameInput
  
  // Input actions
  setPlayerMovement: (x: number, z: number) => void
  stopPlayerMovement: () => void
  triggerPlayerAttack: () => void
  resetPlayerAttack: () => void
}

const initialInputState: GameInput = {
  movement: { x: 0, z: 0 },
  isMoving: false,
  attackPressed: false
}

export const createInputSlice: StateCreator<
  InputSlice,
  [],
  [],
  InputSlice
> = (set, get) => ({
  input: initialInputState,

  setPlayerMovement: (x: number, z: number) =>
    set(
      (state) => ({
        input: {
          ...state.input,
          movement: { x, z },
          isMoving: true
        }
      })
    ),

  stopPlayerMovement: () =>
    set(
      (state) => ({
        input: {
          ...state.input,
          movement: { x: 0, z: 0 },
          isMoving: false
        }
      })
    ),

  triggerPlayerAttack: () =>
    set(
      (state) => ({
        input: {
          ...state.input,
          attackPressed: true
        }
      })
    ),

  resetPlayerAttack: () =>
    set(
      (state) => ({
        input: {
          ...state.input,
          attackPressed: false
        }
      })
    )
})