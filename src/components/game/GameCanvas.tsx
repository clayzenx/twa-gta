import { Canvas } from '@react-three/fiber'
import { Player } from './Player'
import { Enemy } from './Enemy'
import { Terrain } from './Terrain'
import { IsometricCamera } from './IsometricCamera'
import { GameUI } from './GameUI'
import { GameControls } from './GameControls'
import { MobileControls } from './MobileControls'
import { useGameLogic } from '@/hooks/game/useGameLogic'
import { useKeyboardInput } from '../../hooks/input/useKeyboardInput'
import { useMobileInput } from '../../hooks/input/useMobileInput'
import { useErrorBoundary } from 'use-error-boundary'
import { Environment } from '@react-three/drei'

// Основная игровая логика
function GameLogic() {
  const { player, playerGameState, enemies, playerRotation, isMoving } = useGameLogic()

  if (!player) throw new Error('Player does not exist')

  return (
    <>
      <IsometricCamera target={playerGameState.position} />
      <Terrain />
      <Player
        position={playerGameState.position}
        isMoving={isMoving}
        isAttacking={playerGameState.isAttacking}
        health={player.health}
        maxHealth={player.maxHealth}
        rotation={playerRotation}
      />
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          enemy={enemy}
          playerPosition={playerGameState.position}
          onAttack={() => { }} // Теперь обрабатывается в useGameLogic
        />
      ))}

      <GameUI
        playerPosition={playerGameState.position}
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
        camera={{ position: [8, 12, 8], fov: 40 }}
      >
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={80}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0001}
        />
        <Environment preset='sunset' />
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
