import { store } from '@/store/gameStore';
import { Character } from '@/types/game';

/**
 * Обработчик попадания
 */
export function handlePlayerHit() {
  const state = store.getState();
  const { player, enemies, updateEnemyHealth, removeEnemy } = state;

  if (!player.targetId) return;

  const enemy = enemies.find(e => e.id === player.targetId)

  if (!enemy?.id) return;

  const damage = calculateBaseDamage(player);
  const newHealth = enemy.health - damage;

  if (newHealth <= 0) {
    removeEnemy(enemy.id);
  } else {
    updateEnemyHealth(enemy.id, newHealth);
  }
}

/**
 * Простой расчёт урона на основе статов игрока
 */
export function calculateBaseDamage(player: Character): number {
  return player.baseDamage;
}

