import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Position, Character } from '@/types/game'

interface Props {
  enemy: Character & { id: string }
  playerPosition: Position
  selfRef: React.RefObject<Group>
  onAttack: (enemyId: string) => void
}

export function useEnemyAI({ enemy, playerPosition, selfRef, onAttack }: Props) {
  useFrame((state, delta) => {
    if (!selfRef.current) return

    const distance = Math.hypot(
      playerPosition.x - enemy.position.x,
      playerPosition.z - enemy.position.z
    )

    if (distance <= enemy.attackRange) {
      const now = Date.now()
      if (now - enemy.lastAttackTime > 1000 && !enemy.isAttacking) {
        onAttack(enemy.id)
      }
    } else if (distance > enemy.attackRange) {
      const dx = playerPosition.x - enemy.position.x
      const dz = playerPosition.z - enemy.position.z
      const len = Math.hypot(dx, dz)

      if (len > 0.1) {
        enemy.position.x += (dx / len) * enemy.speed * delta
        enemy.position.z += (dz / len) * enemy.speed * delta
      }
    }

    // Поворот к игроку
    const angle = Math.atan2(
      playerPosition.x - enemy.position.x,
      playerPosition.z - enemy.position.z
    )
    selfRef.current.rotation.y = angle

    // Анимация подпрыгивания
    const time = state.clock.elapsedTime
    selfRef.current.position.y = enemy.isAttacking
      ? 0.5 + Math.sin(time * 15) * 0.2
      : 0.5 + Math.sin(time * 4) * 0.08
  })

  useEffect(() => {
    // синхронизируем 3D позицию с состоянием
    if (selfRef.current) {
      selfRef.current.position.x = enemy.position.x
      selfRef.current.position.z = enemy.position.z
    }
  }, [enemy.position.x, enemy.position.z])
}

