import { useFrame, useThree } from '@react-three/fiber'
import { Position } from '../../types/game'

interface IsometricCameraProps {
  target: Position
}

export function IsometricCamera({ target }: IsometricCameraProps) {
  const { camera } = useThree()

  useFrame(() => {
    // Изометрическая позиция камеры относительно игрока
    const offset = { x: 8, y: 12, z: 8 }
    camera.position.set(
      target.x + offset.x,
      offset.y,
      target.z + offset.z
    )
    camera.lookAt(target.x, 0, target.z)
  })

  return null
}