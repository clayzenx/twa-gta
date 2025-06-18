import { StateCreator } from 'zustand'
import { Character, Position } from '@/types/game'

export type User = {
  id: number
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
  isAttacking: boolean
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

export interface UserSlice {
  user: User | null
  isLoading: boolean

  // User actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  updateUserBalance: (balance: number) => void

  // Player actions  
  updatePlayerData: (stats: Partial<PlayerData>) => void
  initializePlayerData: (player: PlayerData) => void

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
    if (!state.user?.player) return null

    const player = state.user.player
    return {
      position: { x: 0, z: 0 }, // позиция хранится в игровом состоянии
      targetId: null,
      health: player.health,
      maxHealth: player.maxHealth,
      attackRange: player.attackRange,
      speed: player.movementSpeed,
      baseDamage: player.damage,
      isAttacking: false,
      lastAttackTime: 0
    }
  }
})
