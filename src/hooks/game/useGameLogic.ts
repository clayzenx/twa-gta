import { useFrame } from '@react-three/fiber'
import { useGameStore, GameStore } from '@/store/gameStore'
import { useAutoTarget } from '@/hooks/game/useAutoTarget'
import { usePlayerMovement } from '@/hooks/game/usePlayerMovement'
import { usePlayerAttack } from '@/hooks/game/usePlayerAttack'
import { useEnemyAI } from '@/hooks/game/useEnemyAI'

export function useGameLogic() {
  const gameRunning = useGameStore((state: GameStore) => state.gameRunning)
  const player = useGameStore((state: GameStore) => state.player)
  const enemies = useGameStore((state: GameStore) => state.enemies)
  const input = useGameStore((state: GameStore) => state.input)

  const setPlayerTarget = useGameStore((state: GameStore) => state.setPlayerTarget)
  const setPlayerAttacking = useGameStore((state: GameStore) => state.setPlayerAttacking)

  usePlayerMovement()
  usePlayerAttack()
  useEnemyAI()

  useAutoTarget({
    selfPosition: player.position,
    currentTargetId: player.targetId,
    range: player.attackRange,
    targets: enemies,
    setTarget: setPlayerTarget,
    onTargetChanged: setPlayerAttacking
  }); // для player

  // Основной игровой цикл
  useFrame((state, delta) => {
    if (!gameRunning) return
  })

  // Возвращаем полезные данные для компонентов
  return {
    player,
    enemies,
    gameRunning,
    // Вычисляемые значения
    playerRotation: input.isMoving ? Math.atan2(input.movement.x, input.movement.z) : 0,
    isMoving: input.isMoving
  }
}
