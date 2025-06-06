import { Canvas } from '@react-three/fiber'
import { Player } from './game/Player'
import { Enemy } from './game/Enemy'
import { Terrain } from './game/Terrain'
import { IsometricCamera } from './game/IsometricCamera'
import { GameUI } from './game/GameUI'
import { GameControls } from './game/GameControls'
import { MobileControls } from './game/MobileControls'
import { useGameLogic } from '../hooks/useGameLogic'
import { useKeyboardInput } from '../hooks/useKeyboardInput'
import { useMobileInput } from '../hooks/useMobileInput'
import { useErrorBoundary } from 'use-error-boundary'

// Основная игровая логика теперь в отдельном компоненте
function GameLogic() {
  const { player, enemies, playerRotation, isMoving } = useGameLogic()

  return (
    <>
      <IsometricCamera target={player.position} />
      <Terrain />
      <Player
        position={player.position}
        isMoving={isMoving}
        isAttacking={player.isAttacking}
        health={player.health}
        maxHealth={player.maxHealth}
        rotation={playerRotation}
      />
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          enemy={enemy}
          playerPosition={player.position}
          onAttack={() => { }} // Теперь обрабатывается в useGameLogic
        />
      ))}

      <GameUI
        playerPosition={player.position}
        playerHealth={player.health}
        enemyCount={enemies.length}
      />
    </>
  )
}

export function GameCanvas() {
  const { didCatch, error } = useErrorBoundary()

  // Инициализируем обработчики ввода
  useKeyboardInput()
  const mobileInput = useMobileInput()

  // Проверяем, есть ли поддержка touch (мобильное устройство)
  const isTouchDevice = 'ontouchstart' in window

  return didCatch ? (
    <div>{error.message}</div>
  ) : (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <Canvas
        shadows
        camera={{
          position: [8, 12, 8],
          fov: 40,
          near: 0.1,
          far: 1000
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.7} />
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
        <GameLogic />
      </Canvas>

      {isTouchDevice ? (
        <MobileControls
          onMove={mobileInput.handleMove}
          onAttack={mobileInput.handleAttack}
          onStopMove={mobileInput.handleStopMove}
        />
      ) : (
        <GameControls />
      )}

    </div>
  )
}
