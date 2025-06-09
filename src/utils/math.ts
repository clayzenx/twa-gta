import { Position } from '@/types/game'

interface isInRangeResult {
  inRange: boolean,
  distance: number
}

/**
 * Проверяет, находится ли target в радиусе range от origin.
 * Работает по плоскости XZ.
 */
export function isInRange(origin: Position, target: Position, range: number): isInRangeResult {
  const dx = target.x - origin.x
  const dz = target.z - origin.z
  const distanceSq = dx * dx + dz * dz
  return ({ inRange: distanceSq <= range * range, distance: distanceSq })
}
