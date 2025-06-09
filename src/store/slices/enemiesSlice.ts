import { StateCreator } from 'zustand'
import { Enemy, Position } from '@/types/game'

export interface EnemiesSlice {
  enemies: Enemy[]

  // Enemy actions
  updateEnemyPosition: (enemyId: string, position: Position) => void
  updateEnemyHealth: (enemyId: string, health: number) => void
  setEnemyAttacking: (enemyId: string, isAttacking: boolean) => void
  removeEnemy: (enemyId: string) => void
  addEnemy: (enemy: Enemy) => void
}

const initialEnemies: Enemy[] = [
  {
    id: 'enemy1',
    position: { x: 5, z: 5 },
    health: 50,
    maxHealth: 50,
    attackRange: 1.5,
    speed: 3,
    isAttacking: false,
    lastAttackTime: 0,
    baseDamage: 10,
    targetId: 'player1'
  },
  {
    id: 'enemy2',
    position: { x: -7, z: 3 },
    health: 50,
    maxHealth: 50,
    attackRange: 1.5,
    speed: 2.5,
    isAttacking: false,
    lastAttackTime: 0,
    baseDamage: 10,
    targetId: 'player1'
  }
]

export const createEnemiesSlice: StateCreator<
  EnemiesSlice,
  [],
  [],
  EnemiesSlice
> = (set, get) => ({
  enemies: initialEnemies,

  updateEnemyPosition: (enemyId: string, position: Position) =>
    set(
      (state) => ({
        enemies: state.enemies.map(enemy =>
          enemy.id === enemyId
            ? { ...enemy, position }
            : enemy
        )
      })
    ),

  updateEnemyHealth: (enemyId: string, health: number) =>
    set(
      (state) => ({
        enemies: state.enemies.map(enemy =>
          enemy.id === enemyId
            ? { ...enemy, health: Math.max(0, Math.min(health, enemy.maxHealth)) }
            : enemy
        )
      })
    ),

  setEnemyAttacking: (enemyId: string, isAttacking: boolean) =>
    set(
      (state) => ({
        enemies: state.enemies.map(enemy =>
          enemy.id === enemyId
            ? {
              ...enemy,
              isAttacking,
              lastAttackTime: isAttacking ? Date.now() : enemy.lastAttackTime
            }
            : enemy
        )
      })
    ),

  removeEnemy: (enemyId: string) =>
    set(
      (state) => ({
        enemies: state.enemies.filter(enemy => enemy.id !== enemyId)
      })
    ),

  addEnemy: (enemy: Enemy) =>
    set(
      (state) => ({
        enemies: [...state.enemies, enemy]
      })
    )
})
