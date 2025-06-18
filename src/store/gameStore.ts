import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createEnemiesSlice, EnemiesSlice } from './slices/enemiesSlice'
import { createInputSlice, InputSlice } from './slices/inputSlice'
import { createGameSlice, GameSlice } from './slices/gameSlice'
import { createUserSlice, UserSlice } from './slices/userSlice'

export type GameStore = EnemiesSlice & InputSlice & GameSlice & UserSlice

const store = create<GameStore>()(
  devtools(
    (...args) => ({
      ...createEnemiesSlice(...args),
      ...createInputSlice(...args),
      ...createGameSlice(...args),
      ...createUserSlice(...args)
    }),
    {
      name: 'game-store'
    }
  )
)

const useGameStore = store;

export { useGameStore, store }

export type { Position, Character, Enemy, GameInput } from '@/types/game'
