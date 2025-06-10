import { useGameStore } from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";

export function useEnemyAI() {
  const enemies = useGameStore((s) => s.enemies);
  const player = useGameStore((s) => s.player);
  const updateEnemyPosition = useGameStore((s) => s.updateEnemyPosition);
  const setEnemyAttacking = useGameStore((s) => s.setEnemyAttacking);
  const updatePlayerHealth = useGameStore((s) => s.updatePlayerHealth);

  useFrame((_, delta) => {
    enemies.forEach((enemy) => {
      const dx = player.position.x - enemy.position.x;
      const dz = player.position.z - enemy.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      const now = Date.now();

      if (distance <= enemy.attackRange) {
        if (now - enemy.lastAttackTime > 1200) {
          setEnemyAttacking(enemy.id, true);
          updatePlayerHealth(player.health - enemy.baseDamage);
        }
      } else if (distance < 10) {
        // Движение к игроку
        const direction = { x: dx / distance, z: dz / distance };
        const newPosition = {
          x: enemy.position.x + direction.x * enemy.speed * delta,
          z: enemy.position.z + direction.z * enemy.speed * delta,
        };
        updateEnemyPosition(enemy.id, newPosition);
      }
    });
  });
}

