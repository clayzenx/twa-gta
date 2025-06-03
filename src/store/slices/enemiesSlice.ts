import { StateCreator } from 'zustand'
import { Enemy, Position } from '../types'

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
]

export const createEnemiesSlice: StateCreator<
  EnemiesSlice,
  [],
  [],
  EnemiesSlice
> = (set) => ({
  enemies: initialEnemies,

  updateEnemyPosition: (enemyId: string, position: Position) =>
    set(
      (state) => ({
        enemies: state.enemies.map(enemy =>
          enemy.id === enemyId
            ? { ...enemy, position }
            : enemy
        )
      }),
      false,
      'updateEnemyPosition'
    ),

  updateEnemyHealth: (enemyId: string, health: number) =>
    set(
      (state) => ({
        enemies: state.enemies.map(enemy =>
          enemy.id === enemyId
            ? { ...enemy, health: Math.max(0, Math.min(health, enemy.maxHealth)) }
            : enemy
        )
      }),
      false,
      'updateEnemyHealth'
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
      }),
      false,
      'setEnemyAttacking'
    ),

  removeEnemy: (enemyId: string) =>
    set(
      (state) => ({
        enemies: state.enemies.filter(enemy => enemy.id !== enemyId)
      }),
      false,
      'removeEnemy'
    ),

  addEnemy: (enemy: Enemy) =>
    set(
      (state) => ({
        enemies: [...state.enemies, enemy]
      }),
      false,
      'addEnemy'
    )
})