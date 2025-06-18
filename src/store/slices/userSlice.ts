import { StateCreator } from 'zustand'
import { Character, Position } from '@/types/game'
import { sanitizeHealth, sanitizePosition } from '@/utils/validation'
import { GAME_CONSTANTS } from '@/constants/game'

export type User = {
  id: string
  telegramId: string
  firstName: string
  lastName: string
  username: string
  languageCode: string
  photoUrl: string
  balance: number
  createdAt: string
  player?: PlayerData | null
  gameState?: GameState | null
}

// Игровое состояние (client side)
export type GameState = {
  targetId: string | null
  position: Position,
  isAttacking: boolean,
  lastAttackTime: number
}

export type PlayerData = {
  id: number
  userId: number
  health: number
  maxHealth: number
  damage: number
  attackRange: number
  attackSpeed: number
  movementSpeed: number
  level: number
  experience: number
  createdAt: string
  updatedAt: string
}

// TODO: Надо убрать лишнее
export interface UserSlice {
  user: User | null
  isLoading: boolean

  // User actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  updateUserBalance: (balance: number) => void

  // Player data
  updatePlayerData: (stats: Partial<PlayerData>) => void
  initializePlayerData: (player: PlayerData) => void

  // Player Game State
  initializePvEGameState: () => void
  updatePlayerPosition: (position: Position) => void
  updatePlayerHealth: (health: number) => void
  setPlayerTarget: (targetId: string | null) => void
  setPlayerAttacking: (isAttacking: boolean) => void
  resetPlayerAttack: () => void

  // Selectors
  getPlayerCharacter: () => Character | null
}

export const createUserSlice: StateCreator<
  UserSlice,
  [],
  [],
  UserSlice
> = (set, get) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),

  initializePvEGameState: () =>
    set((state) => ({
      user: state.user && {
        ...state.user,
        gameState: {
          targetId: null,
          position: { x: 0, z: 0 },
          isAttacking: false,
          lastAttackTime: 0
        },
      }
    })),

  updatePlayerPosition: (position: Position) =>
    set((state) => ({
      user: state.user && state.user.gameState
        ? {
          ...state.user,
          gameState: {
            ...state.user.gameState,
            position: sanitizePosition(position)
          }
        }
        : state.user
    })),

  updatePlayerHealth: (health: number) =>
    set((state) => ({
      user: state.user && state.user.player
        ? {
          ...state.user,
          player: {
            ...state.user.player,
            health: sanitizeHealth(health, state.user.player.maxHealth)
          }
        }
        : state.user
    })),

  setPlayerTarget: (targetId: string | null) =>
    set((state) => ({
      user: state.user && state.user.gameState
        ? {
          ...state.user,
          gameState: {
            ...state.user.gameState,
            targetId
          }
        }
        : state.user
    })),

  setPlayerAttacking: (isAttacking: boolean) =>
    set((state) => ({
      user: state.user && state.user.gameState
        ? {
          ...state.user,
          gameState: {
            ...state.user.gameState,
            isAttacking,
            lastAttackTime: isAttacking ? Date.now() : state.user.gameState.lastAttackTime
          }
        }
        : state.user
    })),

  resetPlayerAttack: () =>
    set((state) => ({
      user: state.user && state.user.gameState
        ? {
          ...state.user,
          gameState: {
            ...state.user.gameState,
            isAttacking: false
          }
        }
        : state.user
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  updateUserBalance: (balance) =>
    set((state) => ({
      user: state.user ? { ...state.user, balance } : null
    })),

  updatePlayerData: (stats) =>
    set((state) => ({
      user: state.user && state.user.player
        ? {
          ...state.user,
          player: { ...state.user.player, ...stats }
        }
        : state.user
    })),

  initializePlayerData: (player) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, player }
        : null
    })),

  getPlayerCharacter: () => {
    const state = get()
    if (!state.user?.player || !state.user?.gameState) return null

    const player = state.user.player
    const gameState = state.user.gameState
    return {
      position: gameState.position,
      targetId: gameState.targetId,
      health: player.health,
      maxHealth: player.maxHealth,
      attackRange: player.attackRange,
      speed: player.movementSpeed,
      baseDamage: player.damage,
      isAttacking: gameState.isAttacking,
      lastAttackTime: gameState.lastAttackTime
    }
  }
})
