import { GameStore } from './gameStore'

// Селекторы для оптимизации производительности
export const selectPlayer = (state: GameStore) => state.player
export const selectEnemies = (state: GameStore) => state.enemies
export const selectInput = (state: GameStore) => state.input
export const selectGameRunning = (state: GameStore) => state.gameRunning
export const selectStartGame = (state: GameStore) => state.startGame
export const selectStopGame = (state: GameStore) => state.stopGame

// Составные селекторы для избежания лишних ререндеров
export const selectPlayerPosition = (state: GameStore) => state.player.position
export const selectPlayerHealth = (state: GameStore) => state.player.health
export const selectPlayerTarget = (state: GameStore) => state.player.targetId
export const selectPlayerAttacking = (state: GameStore) => state.player.isAttacking

export const selectMovement = (state: GameStore) => state.input.movement
export const selectIsMoving = (state: GameStore) => state.input.isMoving

// Селекторы действий - отдельные функции для избежания создания новых объектов
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
