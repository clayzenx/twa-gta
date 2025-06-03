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
> = (set) => ({
  gameRunning: true,

  setGameRunning: (running: boolean) =>
    set(
      { gameRunning: running },
      false,
      'setGameRunning'
    ),

  startGame: () =>
    set(
      { gameRunning: true },
      false,
      'startGame'
    ),

  pauseGame: () =>
    set(
      { gameRunning: false },
      false,
      'pauseGame'
    ),

  stopGame: () =>
    set(
      { gameRunning: false },
      false,
      'stopGame'
    )
})