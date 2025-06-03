import { StateCreator } from 'zustand'

export interface GameSlice {
  gameRunning: boolean
  
  // Game control actions
  setGameRunning: (running: boolean) => void
  startGame: () => void
  pauseGame: () => void
  stopGame: () => void
}

export const createGameSlice: StateCreator<
  GameSlice,
  [],
  [],
  GameSlice
> = (set, get) => ({
  gameRunning: true,

  setGameRunning: (running: boolean) =>
    set(
      { gameRunning: running }
    ),

  startGame: () =>
    set(
      { gameRunning: true }
    ),

  pauseGame: () =>
    set(
      { gameRunning: false }
    ),

  stopGame: () =>
    set(
      { gameRunning: false }
    )
})