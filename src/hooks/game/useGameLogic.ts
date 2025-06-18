import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/store/gameStore'
import { selectPlayer, selectEnemies, selectInput, selectGameRunning, selectSetPlayerTarget, selectSetPlayerAttacking, selectPlayerGameState } from '@/store/selectors'
import { useAutoTarget } from '@/hooks/game/useAutoTarget'
import { usePlayerMovement } from '@/hooks/game/usePlayerMovement'
import { usePlayerAttack } from '@/hooks/game/usePlayerAttack'
import { useEnemyAI } from '@/hooks/game/useEnemyAI'
import { selectUser } from '@/store/selectors/playerSelectors'

export function useGameLogic() {
  const gameRunning = useGameStore(selectGameRunning)
  const player = useGameStore(selectPlayer)
  const playerGameState = useGameStore(selectPlayerGameState)
  const user = useGameStore(selectUser)
  const enemies = useGameStore(selectEnemies)
  const input = useGameStore(selectInput)

  if (!player) return { ready: false, reason: 'Player loading...' };
  if (!playerGameState) return { ready: false, reason: 'Player gamse state loading...' };

  console.log('useGameLogic', player, user);

  const setPlayerTarget = useGameStore(selectSetPlayerTarget)
  const setPlayerAttacking = useGameStore(selectSetPlayerAttacking)

  usePlayerMovement()
  usePlayerAttack()
  useEnemyAI()

  useAutoTarget({
    selfPosition: playerGameState.position,
    currentTargetId: playerGameState.targetId,
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
    playerGameState,
    enemies,
    gameRunning,
    // Вычисляемые значения
    playerRotation: input.isMoving ? Math.atan2(input.movement.x, input.movement.z) : 0,
    isMoving: input.isMoving
  }
}
