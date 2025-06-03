import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export function useKeyboardInput() {
  const keysPressed = useRef<Set<string>>(new Set())
  
  const setPlayerMovement = useGameStore(state => state.setPlayerMovement)
  const stopPlayerMovement = useGameStore(state => state.stopPlayerMovement)
  const triggerPlayerAttack = useGameStore(state => state.triggerPlayerAttack)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      keysPressed.current.add(key)
      
      // Обработка движения
      updateMovement()
      
      // Обработка атаки
      if (key === ' ') {
        event.preventDefault()
        triggerPlayerAttack()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      keysPressed.current.delete(key)
      
      // Обновляем движение при отпускании клавиш
      updateMovement()
    }

    const updateMovement = () => {
      let moveX = 0
      let moveZ = 0

      // WASD и русская раскладка
      if (keysPressed.current.has('w') || keysPressed.current.has('ц')) {
        moveZ -= 1
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('ы')) {
        moveZ += 1
      }
      if (keysPressed.current.has('a') || keysPressed.current.has('ф')) {
        moveX -= 1
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('в')) {
        moveX += 1
      }

      // Нормализуем вектор движения
      if (moveX !== 0 || moveZ !== 0) {
        const length = Math.sqrt(moveX * moveX + moveZ * moveZ)
        if (length > 0) {
          moveX /= length
          moveZ /= length
        }
        setPlayerMovement(moveX, moveZ)
      } else {
        stopPlayerMovement()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [setPlayerMovement, stopPlayerMovement, triggerPlayerAttack])

  // Возвращаем текущие нажатые клавиши для отладки
  return {
    keysPressed: keysPressed.current
  }
}