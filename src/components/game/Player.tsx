import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text } from '@react-three/drei'
import { Position } from '../../types/game'

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
  const groupRef = useRef<Group>(null)
  const [animationState, setAnimationState] = useState<'idle' | 'walking' | 'attacking'>('idle')

  // Простая модель героя (заготовка для замены на GLTF)
  const PlayerModel = () => (
    <group ref={groupRef} position={[position.x, 0.5, position.z]} rotation={[0, rotation, 0]}>
      {/* Тело */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 1.2, 0.3]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Голова */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Руки */}
      <mesh castShadow position={[-0.5, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh castShadow position={[0.5, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Ноги */}
      <mesh castShadow position={[-0.15, -0.9, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh castShadow position={[0.15, -0.9, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Оружие */}
      <mesh castShadow position={[0.7, 0.3, 0]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
    </group>
  )

  // Простая анимация (заготовка для замены на GLTF анимации)
  useFrame((state) => {
    if (!groupRef.current) return

    if (isAttacking) {
      // Анимация атаки
      const time = state.clock.elapsedTime
      groupRef.current.rotation.y = rotation + Math.sin(time * 20) * 0.1
    } else if (isMoving) {
      // Анимация ходьбы
      const time = state.clock.elapsedTime
      groupRef.current.position.y = 0.5 + Math.sin(time * 8) * 0.1
    } else {
      // Анимация покоя
      const time = state.clock.elapsedTime
      groupRef.current.position.y = 0.5 + Math.sin(time * 2) * 0.05
    }
  })

  return (
    <group>
      <PlayerModel />
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