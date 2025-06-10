import { useGameStore } from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";

export function usePlayerAttack() {
  const input = useGameStore((s) => s.input);
  const player = useGameStore((s) => s.player);
  const enemies = useGameStore((s) => s.enemies);

  const setPlayerAttacking = useGameStore((s) => s.setPlayerAttacking);
  const updateEnemyHealth = useGameStore((s) => s.updateEnemyHealth);
  const removeEnemy = useGameStore((s) => s.removeEnemy);

  useFrame(() => {
    if (!input.attackPressed) return;

    const now = Date.now();
    if (now - player.lastAttackTime < 800) return;

    let hasAttacked = false;

    enemies.forEach((enemy) => {
      const dx = enemy.position.x - player.position.x;
      const dz = enemy.position.z - player.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance <= player.attackRange) {
        const newHealth = enemy.health - 20;
        if (newHealth <= 0) {
          removeEnemy(enemy.id);
        } else {
          updateEnemyHealth(enemy.id, newHealth);
        }
        hasAttacked = true;
      }
    });

    if (hasAttacked || true) {
      setPlayerAttacking(true);
    }
  });
}

