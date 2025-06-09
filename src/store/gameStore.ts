import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createPlayerSlice, PlayerSlice } from './slices/playerSlice'
import { createEnemiesSlice, EnemiesSlice } from './slices/enemiesSlice'
import { createInputSlice, InputSlice } from './slices/inputSlice'
import { createGameSlice, GameSlice } from './slices/gameSlice'

export type GameStore = PlayerSlice & EnemiesSlice & InputSlice & GameSlice

const store = create<GameStore>()(
  devtools(
    (...args) => ({
      ...createPlayerSlice(...args),
      ...createEnemiesSlice(...args),
      ...createInputSlice(...args),
      ...createGameSlice(...args)
    }),
    {
      name: 'game-store'
    }
  )
)

const useGameStore = store;

export { useGameStore, store }

export type { Position, Character, Enemy, GameInput } from '@/types/game'
