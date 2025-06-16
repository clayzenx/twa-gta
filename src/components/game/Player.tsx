import { useRef, useMemo, useCallback } from 'react'
import { Group } from 'three'
import { Text, useGLTF, useAnimations } from '@react-three/drei'
import { Position } from '@/types/game'
import { handlePlayerHit } from '@/engine/playerCombatEngine'
import { useAttackBehavior, useMovementBehavior } from '@/hooks/behavior'
import { useEnableShadows } from '@/hooks/game/useEnableShadows'
import { useGameStore } from '@/store/gameStore'
import { selectEnemies, selectPlayerTarget } from '@/store/selectors'

interface PlayerProps {
  position: Position
  isMoving: boolean
  isAttacking: boolean
  health: number
  maxHealth: number
  rotation: number
}

export function Player({
  position,
  isMoving,
  isAttacking,
  health,
  maxHealth,
  rotation
}: PlayerProps) {
  const enemies = useGameStore(selectEnemies);
  const targetId = useGameStore(selectPlayerTarget);

  const playerRef = useRef<Group>(null)
  const { scene, animations } = useGLTF('models/player.glb')
  const { actions } = useAnimations(animations, playerRef)

  // Мемоизация target enemy для избежания лишних пересчетов
  const targetEnemy = useMemo(() => {
    return enemies.find((enemy) => enemy.id === targetId);
  }, [enemies, targetId]);

  // Мемоизация callback для атаки
  const onAttackComplete = useCallback(() => {
    console.log("Атака завершилась");
  }, []);

  const attackAction = actions['Attack'];
  const runAction = actions['Run'];
  const idleAction = actions['Idle'];
  const combatMoveAction = actions['Combat'];

  useAttackBehavior({
    isAttacking,
    attackAction,
    hitTime: 0.4,
    onHit: handlePlayerHit,
    onAttackComplete,
    selfRef: playerRef,
    targetPosition: targetEnemy?.position,
  });

  useMovementBehavior({
    isMoving,
    isAttacking,
    runAction,
    combatMoveAction,
    idleAction,
    selfRef: playerRef,
    targetPosition: targetEnemy?.position,
  });

  useEnableShadows(scene)

  return (
    <group>
      <primitive ref={playerRef} object={scene} position={[position.x, 0.5, position.z]} rotation={[0, rotation, 0]} />
      {/* HP бар */}
      <Text
        position={[position.x, 2.5, position.z]}
        fontSize={0.3}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        {`${health}/${maxHealth}`}
      </Text>
    </group>
  )
}
