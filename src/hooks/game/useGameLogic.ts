import { useFrame } from '@react-three/fiber'
import { useGameStore, GameStore } from '@/store/gameStore'
import { Enemy } from '@/types/game'
import { useAutoTarget } from '@/hooks/game/useAutoTarget'

export function useGameLogic() {
  const gameRunning = useGameStore((state: GameStore) => state.gameRunning)
  const player = useGameStore((state: GameStore) => state.player)
  const enemies = useGameStore((state: GameStore) => state.enemies)
  const input = useGameStore((state: GameStore) => state.input)

  const updatePlayerPosition = useGameStore((state: GameStore) => state.updatePlayerPosition)
  const setPlayerTarget = useGameStore((state: GameStore) => state.setPlayerTarget)
  const updatePlayerHealth = useGameStore((state: GameStore) => state.updatePlayerHealth)
  const setPlayerAttacking = useGameStore((state: GameStore) => state.setPlayerAttacking)

  const updateEnemyPosition = useGameStore((state: GameStore) => state.updateEnemyPosition)
  const updateEnemyHealth = useGameStore((state: GameStore) => state.updateEnemyHealth)
  const setEnemyAttacking = useGameStore((state: GameStore) => state.setEnemyAttacking)
  const removeEnemy = useGameStore((state: GameStore) => state.removeEnemy)

  useAutoTarget({
    selfPosition: player.position,
    currentTargetId: player.targetId,
    range: player.attackRange,
    targets: enemies,
    setTarget: setPlayerTarget,
    onTargetChanged: setPlayerAttacking
  }); // для player

  // Основной игровой цикл
  useFrame((state, delta) => {
    if (!gameRunning) return

    // Обработка движения игрока
    if (input.isMoving) {
      const newPosition = {
        x: player.position.x + input.movement.x * player.speed * delta,
        z: player.position.z + input.movement.z * player.speed * delta
      }
      updatePlayerPosition(newPosition)
    }

    // Обработка атаки игрока
    if (input.attackPressed) {
      const now = Date.now()
      if (now - player.lastAttackTime > 800) { // 0.8 секунды cooldown

        // Проверяем врагов в радиусе атаки
        let hasAttacked = false
        enemies.forEach((enemy: Enemy) => {
          const distance = Math.sqrt(
            Math.pow(enemy.position.x - player.position.x, 2) +
            Math.pow(enemy.position.z - player.position.z, 2)
          )

          if (distance <= player.attackRange) {
            // Наносим урон врагу
            const newHealth = enemy.health - 20
            if (newHealth <= 0) {
              removeEnemy(enemy.id)
            } else {
              updateEnemyHealth(enemy.id, newHealth)
            }
            hasAttacked = true
          }
        })

        if (hasAttacked || true) { // Анимация атаки даже если не попали
          setPlayerAttacking(true)
        }
      }
    }

    // ИИ врагов
    enemies.forEach((enemy: Enemy) => {
      // Вычисляем расстояние до игрока
      const distance = Math.sqrt(
        Math.pow(enemy.position.x - player.position.x, 2) +
        Math.pow(enemy.position.z - player.position.z, 2)
      )

      // Если враг близко к игроку
      if (distance <= enemy.attackRange) {
        // Атака
        const now = Date.now()
        if (now - enemy.lastAttackTime > 1200) { // 1.2 секунды cooldown для врагов
          setEnemyAttacking(enemy.id, true)
          updatePlayerHealth(player.health - enemy.baseDamage)
        }
      } else if (distance < 10) {
        // Движение к игроку если он в зоне видимости
        const direction = {
          x: player.position.x - enemy.position.x,
          z: player.position.z - enemy.position.z
        }

        // Нормализуем направление
        const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z)
        if (length > 0) {
          direction.x /= length
          direction.z /= length
        }

        const newPosition = {
          x: enemy.position.x + direction.x * enemy.speed * delta,
          z: enemy.position.z + direction.z * enemy.speed * delta
        }

        updateEnemyPosition(enemy.id, newPosition)
      }
    })
  })

  // Возвращаем полезные данные для компонентов
  return {
    player,
    enemies,
    gameRunning,
    // Вычисляемые значения
    playerRotation: input.isMoving ? Math.atan2(input.movement.x, input.movement.z) : 0,
    isMoving: input.isMoving
  }
}
