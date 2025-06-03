import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { Player } from './game/Player'
import { Enemy } from './game/Enemy'
import { Terrain } from './game/Terrain'
import { IsometricCamera } from './game/IsometricCamera'
import { GameUI } from './game/GameUI'
import { GameControls } from './game/GameControls'
import { MobileControls } from './game/MobileControls'
import { GameState } from '../types/game'

// Основная игровая логика
function GameLogic({ mobileMovement, isMobileMoving }: {
  mobileMovement: { x: number, z: number },
  isMobileMoving: boolean
}) {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      position: { x: 0, z: 0 },
      health: 100,
      maxHealth: 100,
      attackRange: 2,
      speed: 5,
      isAttacking: false,
      lastAttackTime: 0
    },
    enemies: [
      {
        id: 'enemy1',
        position: { x: 5, z: 5 },
        health: 50,
        maxHealth: 50,
        attackRange: 1.5,
        speed: 3,
        isAttacking: false,
        lastAttackTime: 0
      },
      {
        id: 'enemy2',
        position: { x: -7, z: 3 },
        health: 50,
        maxHealth: 50,
        attackRange: 1.5,
        speed: 2.5,
        isAttacking: false,
        lastAttackTime: 0
      }
    ],
    gameRunning: true
  })

  const [playerRotation, setPlayerRotation] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const keysPressed = useRef<Set<string>>(new Set())

  // Управление на клавиатуре
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key.toLowerCase())
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])


  // Обновление игры
  useFrame((state, delta) => {
    if (!gameState.gameRunning) return

    // Движение игрока
    let moveX = 0
    let moveZ = 0
    let moving = false

    // Клавиатурное управление
    if (keysPressed.current.has('w') || keysPressed.current.has('ц')) {
      moveZ -= 1
      moving = true
    }
    if (keysPressed.current.has('s') || keysPressed.current.has('ы')) {
      moveZ += 1
      moving = true
    }
    if (keysPressed.current.has('a') || keysPressed.current.has('ф')) {
      moveX -= 1
      moving = true
    }
    if (keysPressed.current.has('d') || keysPressed.current.has('в')) {
      moveX += 1
      moving = true
    }

    // Мобильное управление
    if (isMobileMoving) {
      moveX += mobileMovement.x
      moveZ += mobileMovement.z
      moving = true
    }

    if (moving) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ)
      if (length > 0) {
        moveX /= length
        moveZ /= length
      }

      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          position: {
            x: prev.player.position.x + moveX * prev.player.speed * delta,
            z: prev.player.position.z + moveZ * prev.player.speed * delta
          }
        }
      }))

      setPlayerRotation(Math.atan2(moveX, moveZ))
    }

    setIsMoving(moving)

    // Атака игрока по пробелу
    if (keysPressed.current.has(' ')) {
      const now = Date.now()
      if (now - gameState.player.lastAttackTime > 800) { // 0.8 секунды cooldown
        // Проверяем врагов в радиусе атаки
        gameState.enemies.forEach(enemy => {
          const distance = Math.sqrt(
            Math.pow(enemy.position.x - gameState.player.position.x, 2) +
            Math.pow(enemy.position.z - gameState.player.position.z, 2)
          )

          if (distance <= gameState.player.attackRange) {
            setGameState(prev => ({
              ...prev,
              player: {
                ...prev.player,
                isAttacking: true,
                lastAttackTime: now
              },
              enemies: prev.enemies.map(e =>
                e.id === enemy.id
                  ? { ...e, health: Math.max(0, e.health - 20) }
                  : e
              ).filter(e => e.health > 0)
            }))
          }
        })

        // Сброс анимации атаки
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            player: { ...prev.player, isAttacking: false }
          }))
        }, 300)
      }
    }
  })

  // Обработка атаки врага
  const handleEnemyAttack = (enemyId: string) => {
    const now = Date.now()
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        health: Math.max(0, prev.player.health - 15)
      },
      enemies: prev.enemies.map(enemy =>
        enemy.id === enemyId
          ? { ...enemy, isAttacking: true, lastAttackTime: now }
          : enemy
      )
    }))

    // Сброс анимации атаки врага
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        enemies: prev.enemies.map(enemy =>
          enemy.id === enemyId
            ? { ...enemy, isAttacking: false }
            : enemy
        )
      }))
    }, 400)
  }

  return (
    <>
      <IsometricCamera target={gameState.player.position} />
      <Terrain />
      <Player
        position={gameState.player.position}
        isMoving={isMoving}
        isAttacking={gameState.player.isAttacking}
        health={gameState.player.health}
        maxHealth={gameState.player.maxHealth}
        rotation={playerRotation}
      />
      {gameState.enemies.map(enemy => (
        <Enemy
          key={enemy.id}
          enemy={enemy}
          playerPosition={gameState.player.position}
          onAttack={handleEnemyAttack}
        />
      ))}

      <GameUI
        playerPosition={gameState.player.position}
        playerHealth={gameState.player.health}
        enemyCount={gameState.enemies.length}
      />
    </>
  )
}

export function GameCanvas() {
  const [mobileMovement, setMobileMovement] = useState({ x: 0, z: 0 })
  const [isMobileMoving, setIsMobileMoving] = useState(false)
  const [mobileAttackTrigger, setMobileAttackTrigger] = useState(0)

  const handleMobileMove = (direction: { x: number, z: number }) => {
    setMobileMovement(direction)
    setIsMobileMoving(true)
  }

  const handleMobileStopMove = () => {
    setMobileMovement({ x: 0, z: 0 })
    setIsMobileMoving(false)
  }

  // Проверяем, есть ли поддержка touch (мобильное устройство)
  const isTouchDevice = 'ontouchstart' in window

  const handleMobileAttack = () => {
    setMobileAttackTrigger(prev => prev + 1)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <Canvas
        shadows
        camera={{
          position: [8, 12, 8],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <GameLogic
          mobileMovement={mobileMovement}
          isMobileMoving={isMobileMoving}
        />
      </Canvas>

      <GameControls />

      {isTouchDevice && (
        <MobileControls
          onMove={handleMobileMove}
          onAttack={handleMobileAttack}
          onStopMove={handleMobileStopMove}
        />
      )}
    </div>
  )
}
