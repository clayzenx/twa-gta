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
  baseDamage: number
  isAttacking: boolean
  lastAttackTime: number
}

export interface Enemy extends Character {
  id: string
}

export interface GameInput {
  movement: { x: number, z: number }
  isMoving: boolean,
  attackPressed: boolean
}

export interface GameState {
  player: Character
  enemies: (Character & { id: string })[]
  gameRunning: boolean
}
