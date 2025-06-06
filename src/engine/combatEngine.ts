import { store } from '@/store/gameStore';
import { Character } from '@/types/game';

/**
 * Обработчик попадания
 */
export function handleHit() {
  const state = store.getState();
  const { player, enemies, updateEnemyHealth, removeEnemy } = state;

  const enemy = enemies[0];
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

