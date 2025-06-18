import { StateCreator } from 'zustand'
import { Character, Position } from '@/types/game'
import { GAME_CONSTANTS } from '@/constants/game'
import { sanitizeHealth, sanitizePosition } from '@/utils/validation'
import { GameState, PlayerData } from './userSlice'

export interface PlayerSlice {
  player: Character

  // Player actions
  updatePlayerPosition: (position: Position) => void
  updatePlayerHealth: (health: number) => void
  setPlayerTarget: (targetId: string | null) => void
  setPlayerAttacking: (isAttacking: boolean) => void
  resetPlayerAttack: () => void
  // TODO: лишний походу. Как и весь модуль
  initializeFromPlayerData: (playerData: PlayerData) => void
}

const getInitialPlayerState = (): Character => ({
  targetId: null,
  position: { x: 0, z: 0 },
  health: GAME_CONSTANTS.PLAYER.INITIAL_HEALTH,
  maxHealth: GAME_CONSTANTS.PLAYER.MAX_HEALTH,
  attackRange: GAME_CONSTANTS.PLAYER.ATTACK_RANGE,
  speed: GAME_CONSTANTS.PLAYER.SPEED,
  baseDamage: GAME_CONSTANTS.PLAYER.BASE_DAMAGE,
  isAttacking: false,
  lastAttackTime: 0
})

export const createPlayerSlice: StateCreator<
  PlayerSlice,
  [],
  [],
  PlayerSlice
> = (set, get) => ({
  player: getInitialPlayerState(),

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
          position: sanitizePosition(position)
        }
      })
    ),

  updatePlayerHealth: (health: number) =>
    set(
      (state) => ({
        player: {
          ...state.player,
          health: sanitizeHealth(health, state.player.maxHealth)
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
    ),

  initializeFromPlayerData: (playerData: PlayerData) =>
    set(
      (state) => ({
        player: {
          ...state.player,
          health: playerData.health,
          maxHealth: playerData.maxHealth,
          attackRange: playerData.attackRange,
          speed: playerData.movementSpeed,
          baseDamage: playerData.damage
        }
      })
    )
})
