import { useGameStore, GameStore } from '../store/gameStore'

export function useMobileInput() {
  const setPlayerMovement = useGameStore((state: GameStore) => state.setPlayerMovement)
  const stopPlayerMovement = useGameStore((state: GameStore) => state.stopPlayerMovement)
  const triggerPlayerAttack = useGameStore((state: GameStore) => state.triggerPlayerAttack)

  const handleMove = (direction: { x: number, z: number }) => {
    // Нормализуем направление если нужно
    const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z)
    if (length > 0) {
      const normalizedX = direction.x / length
      const normalizedZ = direction.z / length
      setPlayerMovement(normalizedX, normalizedZ)
    }
  }

  const handleStopMove = () => {
    stopPlayerMovement()
  }

  const handleAttack = () => {
    triggerPlayerAttack()
  }

  return {
    handleMove,
    handleStopMove,
    handleAttack
  }
}