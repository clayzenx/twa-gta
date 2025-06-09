import { useRef } from 'react'
import { Group } from 'three'
import { Text, useGLTF, useAnimations } from '@react-three/drei'
import { Position } from '@/types/game'
import { handlePlayerHit } from '@/engine/playerCombatEngine'
import { useAttackBehavior, useMovementBehavior } from '@/hooks/behavior'

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
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF('models/player.glb')
  const { actions } = useAnimations(animations, group)

  const attackAction = actions['Attack'];
  const runAction = actions['Run'];
  const idleAction = actions['Idle'];

  useAttackBehavior({
    isAttacking,
    attackAction,
    hitTime: 0.4,
    onHit: handlePlayerHit,
    onAttackComplete: () => console.log('Атака завершилась'),
  });

  useMovementBehavior({
    isMoving,
    runAction,
    idleAction
  })

  return (
    <group>
      <primitive ref={group} object={scene} position={[position.x, 0.5, position.z]} rotation={[0, rotation, 0]} />
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
