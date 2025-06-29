import { store } from '@/store/gameStore';
import { Character } from '@/types/game';

/**
 * Обработчик попадания
 */
export function handlePlayerHit() {
  const state = store.getState();
  const { enemies, updateEnemyHealth, removeEnemy } = state;
  const player = state.getPlayerCharacter();

  if (!player?.targetId) return;

  const enemy = enemies.find(e => e.id === player.targetId)

  if (!enemy?.id) return;

  const damage = calculateBasePlayerDamage(player);
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
export function calculateBasePlayerDamage(player: Character): number {
  return player.baseDamage;
}

