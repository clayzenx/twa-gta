import { GameStore } from '../gameStore'

// User selectors
export const selectUser = (state: GameStore) => state.user
export const selectUserBalance = (state: GameStore) => state.user?.balance ?? 0
export const selectIsUserLoading = (state: GameStore) => state.isLoading

// Player data selectors (from backend)
export const selectPlayerData = (state: GameStore) => state.user?.player
export const selectPlayerLevel = (state: GameStore) => state.user?.player?.level ?? 1
export const selectPlayerExperience = (state: GameStore) => state.user?.player?.experience ?? 0
export const selectPlayerMaxHealth = (state: GameStore) => state.user?.player?.maxHealth ?? 100

// Game player selectors (current game state)
export const selectPlayer = (state: GameStore) => state.getPlayerCharacter()
export const selectPlayerPosition = (state: GameStore) => state.user?.gameState?.position
export const selectPlayerHealth = (state: GameStore) => state.user?.player?.health
export const selectPlayerIsAttacking = (state: GameStore) => state.user?.gameState?.isAttacking
export const selectPlayerTarget = (state: GameStore) => state.user?.gameState?.targetId

// Combined selectors
export const selectPlayerHealthPercentage = (state: GameStore) => {
  const health = state.user?.player?.health ?? 0
  const maxHealth = state.user?.player?.maxHealth ?? 100
  return maxHealth > 0 ? (health / maxHealth) * 100 : 0
}

export const selectPlayerStats = (state: GameStore) => ({
  health: state.user?.player?.health ?? 0,
  maxHealth: state.user?.player?.maxHealth ?? 100,
  damage: state.user?.player?.damage ?? 0,
  attackRange: state.user?.player?.attackRange ?? 1,
  speed: state.user?.player?.movementSpeed ?? 1,
  level: state.user?.player?.level ?? 1,
  experience: state.user?.player?.experience ?? 0
})
