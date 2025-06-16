import { Position, Character, Enemy } from '@/types/game'

// Валидация позиции
export const isValidPosition = (position: Position): boolean => {
  return (
    typeof position === 'object' &&
    position !== null &&
    typeof position.x === 'number' &&
    typeof position.z === 'number' &&
    !isNaN(position.x) &&
    !isNaN(position.z) &&
    isFinite(position.x) &&
    isFinite(position.z)
  )
}

// Валидация здоровья
export const isValidHealth = (health: number, maxHealth: number): boolean => {
  return (
    typeof health === 'number' &&
    typeof maxHealth === 'number' &&
    !isNaN(health) &&
    !isNaN(maxHealth) &&
    isFinite(health) &&
    isFinite(maxHealth) &&
    health >= 0 &&
    maxHealth > 0 &&
    health <= maxHealth
  )
}

// Валидация персонажа
export const isValidCharacter = (character: Character): boolean => {
  return (
    typeof character === 'object' &&
    character !== null &&
    isValidPosition(character.position) &&
    isValidHealth(character.health, character.maxHealth) &&
    typeof character.attackRange === 'number' &&
    typeof character.speed === 'number' &&
    typeof character.baseDamage === 'number' &&
    typeof character.isAttacking === 'boolean' &&
    typeof character.lastAttackTime === 'number' &&
    character.attackRange > 0 &&
    character.speed > 0 &&
    character.baseDamage >= 0 &&
    character.lastAttackTime >= 0
  )
}

// Валидация врага
export const isValidEnemy = (enemy: Enemy): boolean => {
  return (
    isValidCharacter(enemy) &&
    typeof enemy.id === 'string' &&
    enemy.id.length > 0 &&
    (enemy.targetId === null || typeof enemy.targetId === 'string')
  )
}

// Проверка границ карты (можно настроить под игровую карту)
export const isWithinMapBounds = (position: Position, mapSize = 50): boolean => {
  return (
    Math.abs(position.x) <= mapSize &&
    Math.abs(position.z) <= mapSize
  )
}

// Валидация дистанции между объектами
export const isValidDistance = (pos1: Position, pos2: Position, maxDistance: number): boolean => {
  if (!isValidPosition(pos1) || !isValidPosition(pos2)) return false

  const dx = pos1.x - pos2.x
  const dz = pos1.z - pos2.z
  const distance = Math.sqrt(dx * dx + dz * dz)

  return distance <= maxDistance
}

// Санитизация позиции
export const sanitizePosition = (position: Position): Position => {
  return {
    x: isFinite(position.x) ? position.x : 0,
    z: isFinite(position.z) ? position.z : 0
  }
}

// Санитизация здоровья
export const sanitizeHealth = (health: number, maxHealth: number): number => {
  if (!isFinite(health) || health < 0) return 0
  if (health > maxHealth) return maxHealth
  return health
}

// Валидация ID
export const isValidId = (id: string | null): boolean => {
  return id === null || (typeof id === 'string' && id.length > 0)
}

// Проверка на мертвого персонажа
export const isDead = (character: Character): boolean => {
  return character.health <= 0
}

// Проверка возможности атаки
export const canAttack = (character: Character, currentTime = Date.now()): boolean => {
  const cooldown = 1000 // 1 секунда кулдаун
  return currentTime - character.lastAttackTime >= cooldown
}
