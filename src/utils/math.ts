import { Position } from '@/types/game'

/**
 * Проверяет, находится ли target в радиусе range от origin.
 * Работает по плоскости XZ.
 */
export function isInRange(origin: Position, target: Position, range: number): boolean {
  const dx = target.x - origin.x
  const dz = target.z - origin.z
  const distanceSq = dx * dx + dz * dz
  return distanceSq <= range * range
}
