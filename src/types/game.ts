export interface Position {
  x: number
  z: number
}

export interface Character {
  position: Position
  health: number
  maxHealth: number
  attackRange: number
  speed: number
  isAttacking: boolean
  lastAttackTime: number
}

export interface GameState {
  player: Character
  enemies: (Character & { id: string })[]
  gameRunning: boolean
}