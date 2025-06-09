import { StateCreator } from 'zustand'
import { Character, Position } from '@/types/game'

export interface PlayerSlice {
  player: Character

  // Player actions
  updatePlayerPosition: (position: Position) => void
  updatePlayerHealth: (health: number) => void
  setPlayerTarget: (targetId: string | null) => void
  setPlayerAttacking: (isAttacking: boolean) => void
  resetPlayerAttack: () => void
}

const initialPlayerState: Character = {
  targetId: null,
  position: { x: 0, z: 0 },
  health: 1000,
  maxHealth: 1000,
  attackRange: 2,
  speed: 5,
  baseDamage: 10,
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

  setPlayerTarget: (targetId: string | null) =>
    set(
      (state) => ({
        player: {
          ...state.player,
          targetId
        }
      })
    ),

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
