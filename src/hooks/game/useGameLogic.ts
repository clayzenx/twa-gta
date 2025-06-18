import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { useGameStore } from '@/store/gameStore'
import { selectPlayer, selectEnemies, selectInput, selectGameRunning, selectSetPlayerTarget, selectSetPlayerAttacking, selectPlayerGameState } from '@/store/selectors'
import { useAutoTarget } from '@/hooks/game/useAutoTarget'
import { usePlayerMovement } from '@/hooks/game/usePlayerMovement'
import { usePlayerAttack } from '@/hooks/game/usePlayerAttack'
import { useEnemyAI } from '@/hooks/game/useEnemyAI'

export function useGameLogic() {
  const gameRunning = useGameStore(selectGameRunning)
  const player = useGameStore(selectPlayer)
  const playerGameState = useGameStore(selectPlayerGameState)
  const enemies = useGameStore(selectEnemies)
  const input = useGameStore(selectInput)
  const setPlayerTarget = useGameStore(selectSetPlayerTarget)
  const setPlayerAttacking = useGameStore(selectSetPlayerAttacking)

  // TODO: Описать норм валидацию
  if (!player) return { ready: false, reason: 'Player loading...' };
  if (!playerGameState) return { player, ready: false, reason: 'Player gamse state loading...' };


  // Мемоизируем позицию для избежания лишних объектов
  // const memoizedPosition = useMemo(() => ({
  //   x: playerGameState.position.x,
  //   z: playerGameState.position.z
  // }), [playerGameState.position.x, playerGameState.position.z])

  usePlayerMovement()
  usePlayerAttack()
  // useEnemyAI()

  // useAutoTarget({
  //   selfPosition: memoizedPosition,
  //   currentTargetId: playerGameState.targetId,
  //   range: player.attackRange,
  //   targets: enemies,
  //   setTarget: setPlayerTarget,
  //   onTargetChanged: setPlayerAttacking
  // }); // для player

  // Основной игровой цикл TODO: мб не нужен
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
