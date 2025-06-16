// Константы игры
export const GAME_CONSTANTS = {
  // Параметры игрока
  PLAYER: {
    MAX_HEALTH: 1000,
    INITIAL_HEALTH: 1000,
    ATTACK_RANGE: 2,
    SPEED: 5,
    BASE_DAMAGE: 10,
    ATTACK_SPEED_PENALTY: 1.4, // Замедление при атаке
  },

  // Параметры врагов
  ENEMY: {
    MAX_HEALTH: 50,
    INITIAL_HEALTH: 50,
    ATTACK_RANGE: 1.5,
    SPEED: 2,
    BASE_DAMAGE: 10,
    SPAWN_DISTANCE: 10,
  },

  // Физика и движение
  PHYSICS: {
    MOVEMENT_SMOOTHING: 0.1,
    ROTATION_SPEED: 5,
    GRAVITY: -9.81,
  },

  // Анимации
  ANIMATION: {
    ATTACK_HIT_TIME: 0.4,
    BLEND_TIME: 0.2,
    LOOP_ONCE: false,
    LOOP_REPEAT: true,
  },

  // Камера
  CAMERA: {
    ISOMETRIC_POSITION: [8, 12, 8] as const,
    FOV: 40,
    NEAR: 0.1,
    FAR: 1000,
    FOLLOW_SMOOTHING: 0.1,
  },

  // Освещение
  LIGHTING: {
    AMBIENT_INTENSITY: 0.7,
    DIRECTIONAL_INTENSITY: 1,
    DIRECTIONAL_POSITION: [10, 10, 5] as const,
    SHADOW_MAP_SIZE: 2048,
    SHADOW_CAMERA_SIZE: 20,
  },

  // UI
  UI: {
    HEALTH_BAR_HEIGHT: 2.5,
    ENEMY_HEALTH_BAR_HEIGHT: 2.2,
    HEALTH_BAR_FONT_SIZE: 0.3,
    ENEMY_HEALTH_BAR_FONT_SIZE: 0.25,
  },

  // Пути к моделям
  MODELS: {
    PLAYER: 'models/player.glb',
    ENEMY: 'models/monster.glb',
  },

  // Цвета
  COLORS: {
    PLAYER_HEALTH: 'red',
    ENEMY_HEALTH: 'darkred',
    TERRAIN: '#4a5d23',
  }
} as const;

// Типы для констант
export type GameConstants = typeof GAME_CONSTANTS;
