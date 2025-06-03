import { useGameStore } from '../store/gameStore'

export function useMobileInput() {
  const setPlayerMovement = useGameStore(state => state.setPlayerMovement)
  const stopPlayerMovement = useGameStore(state => state.stopPlayerMovement)
  const triggerPlayerAttack = useGameStore(state => state.triggerPlayerAttack)

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