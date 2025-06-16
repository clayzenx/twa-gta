import { useRef, useMemo, useCallback, useEffect } from 'react'
import { Group } from 'three'
import { Text, useAnimations, useGLTF } from '@react-three/drei'
import { Character, Position } from '../../types/game'
import { useAttackBehavior, useMovementBehavior } from '@/hooks/behavior'
import { useEnemyAI } from '@/hooks/behavior/useEnemyAI'
import { modelCache } from '@/utils/modelCache'

interface EnemyProps {
  enemy: Character & { id: string }
  playerPosition: Position
  onAttack: (enemyId: string) => void
}

export function Enemy({ enemy, playerPosition, onAttack }: EnemyProps) {
  const enemyRef = useRef<Group>(null)
  const { scene, animations } = useGLTF('models/monster.glb')

  // Получение клона из кэша для оптимизации
  const enemyObj = useMemo(() => modelCache.getClone(scene, 'monster'), [scene]);
  const { actions } = useAnimations(animations, enemyRef)

  // Мемоизация callback для предотвращения ненужных ререндеров
  const handleAttack = useCallback((enemyId: string) => {
    onAttack(enemyId);
  }, [onAttack]);

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
    onAttack: handleAttack
  })

  // Возврат клона в кэш при размонтировании компонента
  useEffect(() => {
    return () => {
      if (enemyObj) {
        modelCache.returnClone(enemyObj, 'monster');
      }
    };
  }, [enemyObj]);

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
