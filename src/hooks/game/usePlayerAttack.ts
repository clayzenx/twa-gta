import { useGameStore } from "@/store/gameStore";
import { selectEnemies, selectInput, selectPlayer, selectPlayerGameState, selectSetPlayerAttacking, selectEnemyActions } from "@/store/selectors";
import { useFrame } from "@react-three/fiber";

const TAG = '[usePlayerAttack]'

export function usePlayerAttack() {
  const input = useGameStore(selectInput);
  const playerGameState = useGameStore(selectPlayerGameState);
  const player = useGameStore(selectPlayer);
  const enemies = useGameStore(selectEnemies);

  const setPlayerAttacking = useGameStore(selectSetPlayerAttacking);
  const { updateHealth, removeEnemy } = useGameStore(selectEnemyActions);

  if (!player) throw new Error(`${TAG}: player does not exist`)
  if (!playerGameState) throw new Error(`${TAG}: player hame state does not exist`)

  console.log('usePlayerAttack vrode norm')
  useFrame(() => {
    if (!input.attackPressed) return;

    const now = Date.now();
    if (now - playerGameState.lastAttackTime < 800) return;

    let hasAttacked = false;

    enemies.forEach((enemy) => {
      const dx = enemy.position.x - playerGameState.position.x;
      const dz = enemy.position.z - playerGameState.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance <= player.attackRange) {
        const newHealth = enemy.health - 20;
        if (newHealth <= 0) {
          removeEnemy(enemy.id);
        } else {
          updateHealth(enemy.id, newHealth);
        }
        hasAttacked = true;
      }
    });

    if (hasAttacked) {
      setPlayerAttacking(true);
    }
  });
}

