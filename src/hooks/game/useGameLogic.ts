import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/store/gameStore'
import { selectPlayer, selectEnemies, selectInput, selectGameRunning, selectSetPlayerTarget, selectSetPlayerAttacking } from '@/store/selectors'
import { useAutoTarget } from '@/hooks/game/useAutoTarget'
import { usePlayerMovement } from '@/hooks/game/usePlayerMovement'
import { usePlayerAttack } from '@/hooks/game/usePlayerAttack'
import { useEnemyAI } from '@/hooks/game/useEnemyAI'

export function useGameLogic() {
  const gameRunning = useGameStore(selectGameRunning)
  const player = useGameStore(selectPlayer)
  const enemies = useGameStore(selectEnemies)
  const input = useGameStore(selectInput)

  const setPlayerTarget = useGameStore(selectSetPlayerTarget)
  const setPlayerAttacking = useGameStore(selectSetPlayerAttacking)

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
