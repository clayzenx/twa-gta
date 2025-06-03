import { Text } from '@react-three/drei'
import { Position } from '../../types/game'

interface GameUIProps {
  playerPosition: Position
  playerHealth: number
  enemyCount: number
}

export function GameUI({ playerPosition, playerHealth, enemyCount }: GameUIProps) {
  return (
    <>
      {/* Game Over экран */}
      {playerHealth <= 0 && (
        <Text
          position={[playerPosition.x, 5, playerPosition.z]}
          fontSize={1}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          GAME OVER
        </Text>
      )}

      {/* Victory экран */}
      {enemyCount === 0 && playerHealth > 0 && (
        <Text
          position={[playerPosition.x, 5, playerPosition.z]}
          fontSize={1}
          color="green"
          anchorX="center"
          anchorY="middle"
        >
          VICTORY!
        </Text>
      )}
    </>
  )
}