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

export interface Enemy extends Character {
  id: string
}

export interface GameInput {
  movement: Position
  isMoving: boolean
  attackPressed: boolean
}