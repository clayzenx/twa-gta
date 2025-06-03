import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text } from '@react-three/drei'
import { Character, Position } from '../../types/game'

interface EnemyProps {
  enemy: Character & { id: string }
  playerPosition: Position
  onAttack: (enemyId: string) => void
}

export function Enemy({ enemy, playerPosition, onAttack }: EnemyProps) {
  const groupRef = useRef<Group>(null)
  const [targetPosition, setTargetPosition] = useState<Position>(enemy.position)

  // AI логика следования и атаки
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const distance = Math.sqrt(
      Math.pow(playerPosition.x - enemy.position.x, 2) +
      Math.pow(playerPosition.z - enemy.position.z, 2)
    )

    // Если игрок в зоне атаки
    if (distance <= enemy.attackRange) {
      const now = Date.now()
      if (now - enemy.lastAttackTime > 1000 && !enemy.isAttacking) { // 1 секунда cooldown
        onAttack(enemy.id)
      }
    } else if (distance > enemy.attackRange) {
      // Движение к игроку
      const direction = {
        x: playerPosition.x - enemy.position.x,
        z: playerPosition.z - enemy.position.z
      }
      const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z)

      if (length > 0.1) {
        const normalizedDirection = {
          x: direction.x / length,
          z: direction.z / length
        }

        setTargetPosition({
          x: enemy.position.x + normalizedDirection.x * enemy.speed * delta,
          z: enemy.position.z + normalizedDirection.z * enemy.speed * delta
        })
      }
    }

    // Поворот к игроку
    const angle = Math.atan2(
      playerPosition.x - enemy.position.x,
      playerPosition.z - enemy.position.z
    )
    groupRef.current.rotation.y = angle

    // Анимация движения/атаки
    if (enemy.isAttacking) {
      const time = state.clock.elapsedTime
      groupRef.current.position.y = 0.5 + Math.sin(time * 15) * 0.2
    } else {
      const time = state.clock.elapsedTime
      groupRef.current.position.y = 0.5 + Math.sin(time * 4) * 0.08
    }
  })

  // Обновляем позицию врага
  useEffect(() => {
    enemy.position = targetPosition
  }, [targetPosition, enemy])

  return (
    <group>
      <group ref={groupRef} position={[enemy.position.x, 0.5, enemy.position.z]}>
        {/* Простая модель врага (заготовка для замены) */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 1, 0.3]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* Голова */}
        <mesh castShadow position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>

        {/* Руки */}
        <mesh castShadow position={[-0.4, 0.2, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
        <mesh castShadow position={[0.4, 0.2, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>

        {/* Ноги */}
        <mesh castShadow position={[-0.12, -0.8, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow position={[0.12, -0.8, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

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