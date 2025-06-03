import { useRef, useState, useEffect, useCallback } from 'react'

interface MobileControlsProps {
  onMove: (direction: { x: number, z: number }) => void
  onAttack: () => void
  onStopMove: () => void
}

interface JoystickState {
  isDragging: boolean
  startPos: { x: number, y: number }
  currentPos: { x: number, y: number }
  touchId: number | null
}

export function MobileControls({ onMove, onAttack, onStopMove }: MobileControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const [joystick, setJoystick] = useState<JoystickState>({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    touchId: null
  })

  const maxDistance = 50

  const handleJoystickStart = useCallback((clientX: number, clientY: number, touchId?: number) => {
    if (!joystickRef.current) return
    
    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    setJoystick({
      isDragging: true,
      startPos: { x: centerX, y: centerY },
      currentPos: { x: clientX, y: clientY },
      touchId: touchId ?? null
    })
  }, [])

  const handleJoystickMove = useCallback((clientX: number, clientY: number) => {
    if (!joystick.isDragging) return

    const deltaX = clientX - joystick.startPos.x
    const deltaY = clientY - joystick.startPos.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    let x = deltaX
    let z = deltaY
    
    if (distance > maxDistance) {
      x = (deltaX / distance) * maxDistance
      z = (deltaY / distance) * maxDistance
    }

    setJoystick(prev => ({
      ...prev,
      currentPos: { x: joystick.startPos.x + x, y: joystick.startPos.y + z }
    }))

    // Нормализуем для игры (правильные направления: вверх = вперед, вправо = вправо)
    const normalizedX = x / maxDistance
    const normalizedZ = z / maxDistance
    
    if (Math.abs(normalizedX) > 0.1 || Math.abs(normalizedZ) > 0.1) {
      onMove({ x: normalizedX, z: normalizedZ })
    }
  }, [joystick, onMove, maxDistance])

  const handleJoystickEnd = useCallback(() => {
    setJoystick({
      isDragging: false,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      touchId: null
    })
    onStopMove()
  }, [onStopMove])

  // Сброс состояния через timeout если touch зависает
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (joystick.isDragging) {
      timeoutId = setTimeout(() => {
        handleJoystickEnd()
      }, 5000) // Сброс через 5 секунд
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [joystick.isDragging, handleJoystickEnd])

  // Touch события для джойстика с поддержкой multi-touch
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Находим первый touch который не используется другими элементами
    const touch = e.touches[0]
    handleJoystickStart(touch.clientX, touch.clientY, touch.identifier)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!joystick.isDragging || joystick.touchId === null) return
    
    // Ищем наш конкретный touch по ID
    const touch = Array.from(e.touches).find(t => t.identifier === joystick.touchId)
    if (touch) {
      handleJoystickMove(touch.clientX, touch.clientY)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Проверяем, завершился ли именно наш touch
    const touchEnded = Array.from(e.changedTouches).some(t => t.identifier === joystick.touchId)
    if (touchEnded) {
      handleJoystickEnd()
    }
  }

  // Mouse события для тестирования на ПК
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleJoystickStart(e.clientX, e.clientY)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleJoystickMove(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      handleJoystickEnd()
    }

    const handleTouchMoveGlobal = (e: TouchEvent) => {
      if (joystick.isDragging && joystick.touchId !== null) {
        const touch = Array.from(e.touches).find(t => t.identifier === joystick.touchId)
        if (touch) {
          handleJoystickMove(touch.clientX, touch.clientY)
        }
      }
    }

    const handleTouchEndGlobal = (e: TouchEvent) => {
      if (joystick.isDragging && joystick.touchId !== null) {
        const touchEnded = Array.from(e.changedTouches).some(t => t.identifier === joystick.touchId)
        if (touchEnded) {
          handleJoystickEnd()
        }
      }
    }

    if (joystick.isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false })
      document.addEventListener('touchend', handleTouchEndGlobal)
      document.addEventListener('touchcancel', handleTouchEndGlobal)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMoveGlobal)
      document.removeEventListener('touchend', handleTouchEndGlobal)
      document.removeEventListener('touchcancel', handleTouchEndGlobal)
    }
  }, [joystick.isDragging, handleJoystickMove, handleJoystickEnd])

  // Вычисляем позицию knob
  const knobStyle = joystick.isDragging && joystickRef.current ? {
    transform: `translate(${
      joystick.currentPos.x - joystick.startPos.x
    }px, ${
      joystick.currentPos.y - joystick.startPos.y
    }px)`
  } : {}

  return (
    <div 
      data-game-control
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 1000
      }}>
      {/* Джойстик движения */}
      <div
        ref={joystickRef}
        data-game-control
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Ручка джойстика */}
        <div
          ref={knobRef}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: joystick.isDragging ? 'none' : 'transform 0.2s ease',
            ...knobStyle
          }}
        />
        
        {/* Иконка движения в центре */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          color: 'rgba(255, 255, 255, 0.7)',
          pointerEvents: 'none'
        }}>
          ↕
        </div>
      </div>

      {/* Кнопки справа */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center'
      }}>
        {/* Кнопка атаки */}
        <button
          data-game-control
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            pointerEvents: 'auto',
            touchAction: 'manipulation',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Не препятствуем другим touch событиям
            onAttack()
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAttack()
          }}
        >
          ⚔️
        </button>

        {/* Место для будущих кнопок скилов */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(100, 100, 100, 0.3)',
          border: '2px dashed rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '12px'
        }}>
          SKILL
        </div>
      </div>
    </div>
  )
}