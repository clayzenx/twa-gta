import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createPlayerSlice, PlayerSlice } from './slices/playerSlice'
import { createEnemiesSlice, EnemiesSlice } from './slices/enemiesSlice'
import { createInputSlice, InputSlice } from './slices/inputSlice'
import { createGameSlice, GameSlice } from './slices/gameSlice'

// Объединяем все слайсы в один тип
export type GameStore = PlayerSlice & EnemiesSlice & InputSlice & GameSlice

export const useGameStore = create<GameStore>()(
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

// Экспортируем типы для удобства
export type { Position, Character, Enemy, GameInput } from './types'