import { useGameStore } from "@/store/gameStore";
import { selectEnemies, selectEnemyActions, selectUpdatePlayerHealth } from "@/store/selectors";
import { selectPlayer } from "@/store/selectors/playerSelectors";
import { useFrame } from "@react-three/fiber";

export function useEnemyAI() {
  const player = useGameStore(selectPlayer);
  const enemies = useGameStore(selectEnemies);

  const { updatePosition, setAttacking } = useGameStore(selectEnemyActions);
  const updatePlayerHealth = useGameStore(selectUpdatePlayerHealth)

  useFrame((_, delta) => {
    enemies.forEach((enemy) => {
      const dx = player.position.x - enemy.position.x;
      const dz = player.position.z - enemy.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      const now = Date.now();

      if (distance <= enemy.attackRange) {
        if (now - enemy.lastAttackTime > 1200) {
          setAttacking(enemy.id, true);
          updatePlayerHealth(player.health - enemy.baseDamage);
        }
      } else if (distance < 10) {
        // Движение к игроку
        const direction = { x: dx / distance, z: dz / distance };
        const newPosition = {
          x: enemy.position.x + direction.x * enemy.speed * delta,
          z: enemy.position.z + direction.z * enemy.speed * delta,
        };
        updatePosition(enemy.id, newPosition);
      }
    });
  });
}

