import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, useAnimations, useGLTF } from '@react-three/drei'
import { Character, Position } from '../../types/game'
import { SkeletonUtils } from 'three-stdlib';
import { useAttackBehavior, useMovementBehavior } from '@/hooks/behavior'
import { useEnemyAI } from '@/hooks/behavior/useEnemyAI'

interface EnemyProps {
  enemy: Character & { id: string }
  playerPosition: Position
  onAttack: (enemyId: string) => void
}

export function Enemy({ enemy, playerPosition, onAttack }: EnemyProps) {
  const [targetPosition, setTargetPosition] = useState<Position>(enemy.position)

  const enemyRef = useRef<Group>(null)
  const { scene, animations } = useGLTF('models/monster.glb')

  const enemyObj = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, enemyRef)

  const attackAction = actions['Attack'];
  const runAction = actions['Run'];

  useMovementBehavior({
    isMoving: true,
    isAttacking: enemy.isAttacking,
    runAction,
    selfRef: enemyRef,
    targetPosition: playerPosition,
  });

  useAttackBehavior({
    isAttacking: enemy.isAttacking,
    attackAction,
    hitTime: 0.4,
    onHit: () => { },
    onAttackComplete: () => console.log("Атака завершилась"),
    selfRef: enemyRef,
    targetPosition: playerPosition,
  });

  useEnemyAI({
    enemy,
    playerPosition,
    selfRef: enemyRef,
    onAttack
  })

  // Обновляем позицию врага
  useEffect(() => {
    enemy.position = targetPosition
  }, [targetPosition, enemy])

  return (
    <group>
      <primitive ref={enemyRef} object={enemyObj} position={[enemy.position.x, 0.5, enemy.position.z]} />

      {/* HP бар врага */}
      <Text
        position={[enemy.position.x, 2.2, enemy.position.z]}
        fontSize={0.25}
        color="darkred"
        anchorX="center"
        anchorY="middle"
      >
        {`${enemy.health}/${enemy.maxHealth}`}
      </Text>
    </group>
  )
}
