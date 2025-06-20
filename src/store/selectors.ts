import { GameStore } from './gameStore'
import { GameState } from './slices/userSlice'

// Селекторы для оптимизации производительности
export const selectPlayer = (state: GameStore) => state.user?.player
export const selectPlayerGameState = (state: GameStore) => state.user?.gameState
export const selectEnemies = (state: GameStore) => state.enemies
export const selectInput = (state: GameStore) => state.input
export const selectGameRunning = (state: GameStore) => state.gameRunning
export const selectStartGame = (state: GameStore) => state.startGame
export const selectStopGame = (state: GameStore) => state.stopGame

// Составные селекторы для избежания лишних ререндеров
export const selectPlayerPosition = (state: GameStore) => state.user?.gameState?.position
export const selectPlayerHealth = (state: GameStore) => state.user?.player?.health
export const selectPlayerTarget = (state: GameStore) => state.user?.gameState?.targetId
export const selectPlayerAttacking = (state: GameStore) => state.user?.gameState?.isAttacking

export const selectMovement = (state: GameStore) => state.input.movement
export const selectIsMoving = (state: GameStore) => state.input.isMoving

// Селекторы действий - отдельные функции для избежания создания новых объектов
export const selectInitializePvEGameState = (state: GameStore) => state.initializePvEGameState
export const selectUpdatePlayerPosition = (state: GameStore) => state.updatePlayerPosition
export const selectUpdatePlayerHealth = (state: GameStore) => state.updatePlayerHealth
export const selectSetPlayerTarget = (state: GameStore) => state.setPlayerTarget
export const selectSetPlayerAttacking = (state: GameStore) => state.setPlayerAttacking
export const selectResetPlayerAttack = (state: GameStore) => state.resetPlayerAttack

export const selectInputActions = (state: GameStore) => ({
  setMovement: state.setPlayerMovement,
  stopMovement: state.stopPlayerMovement,
  triggerAttack: state.triggerPlayerAttack,
  resetAttack: state.resetPlayerAttack
})

export const selectEnemyActions = (state: GameStore) => ({
  updatePosition: state.updateEnemyPosition,
  updateHealth: state.updateEnemyHealth,
  setAttacking: state.setEnemyAttacking,
  removeEnemy: state.removeEnemy,
  addEnemy: state.addEnemy
})


// Селектроы enemy
export const selectUpdateEnemyPosition = (state: GameStore) => state.updateEnemyPosition
export const selectUpdateEnemyHealth = (state: GameStore) => state.updateEnemyHealth
export const selectRemoveEnemy = (state: GameStore) => state.removeEnemy
