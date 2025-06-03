import { StateCreator } from 'zustand'
import { Character, Position } from '../types'

export interface PlayerSlice {
  player: Character
  
  // Player actions
  updatePlayerPosition: (position: Position) => void
  updatePlayerHealth: (health: number) => void
  setPlayerAttacking: (isAttacking: boolean) => void
  resetPlayerAttack: () => void
}

const initialPlayerState: Character = {
  position: { x: 0, z: 0 },
  health: 100,
  maxHealth: 100,
  attackRange: 2,
  speed: 5,
  isAttacking: false,
  lastAttackTime: 0
}

export const createPlayerSlice: StateCreator<
  PlayerSlice,
  [],
  [],
  PlayerSlice
> = (set, get) => ({
  player: initialPlayerState,

  updatePlayerPosition: (position: Position) =>
    set(
      (state) => ({
        player: {
          ...state.player,
          position
        }
      })
    ),

  updatePlayerHealth: (health: number) =>
    set(
      (state) => ({
        player: {
          ...state.player,
          health: Math.max(0, Math.min(health, state.player.maxHealth))
        }
      })
    ),

  setPlayerAttacking: (isAttacking: boolean) =>
    set(
      (state) => ({
        player: {
          ...state.player,
          isAttacking,
          lastAttackTime: isAttacking ? Date.now() : state.player.lastAttackTime
        }
      })
    ),

  resetPlayerAttack: () =>
    set(
      (state) => ({
        player: {
          ...state.player,
          isAttacking: false
        }
      })
    )
})