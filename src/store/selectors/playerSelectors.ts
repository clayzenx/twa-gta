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
export const selectPlayer = (state: GameStore) => state.player
export const selectPlayerPosition = (state: GameStore) => state.player.position
export const selectPlayerHealth = (state: GameStore) => state.player.health
export const selectPlayerIsAttacking = (state: GameStore) => state.player.isAttacking
export const selectPlayerTarget = (state: GameStore) => state.player.targetId

// Combined selectors
export const selectPlayerHealthPercentage = (state: GameStore) => {
  const health = state.player.health
  const maxHealth = state.player.maxHealth
  return maxHealth > 0 ? (health / maxHealth) * 100 : 0
}

export const selectPlayerStats = (state: GameStore) => ({
  health: state.player.health,
  maxHealth: state.player.maxHealth,
  damage: state.player.baseDamage,
  attackRange: state.player.attackRange,
  speed: state.player.speed,
  level: state.user?.player?.level ?? 1,
  experience: state.user?.player?.experience ?? 0
})