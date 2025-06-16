import { Object3D } from 'three'
import { SkeletonUtils } from 'three-stdlib'

// Кэш для клонированных моделей
class ModelCache {
  private cache = new Map<string, Object3D[]>()
  private maxCacheSize = 10 // Максимальное количество клонов для каждой модели

  // Получить клон модели из кэша или создать новый
  getClone(originalScene: Object3D, modelKey: string): Object3D {
    let clones = this.cache.get(modelKey)

    if (!clones) {
      clones = []
      this.cache.set(modelKey, clones)
    }

    // Если в кэше есть неиспользуемый клон, возвращаем его
    const availableClone = clones.find(clone => !clone.userData.inUse)
    if (availableClone) {
      availableClone.userData.inUse = true
      return availableClone
    }

    // Если кэш не полный, создаем новый клон
    if (clones.length < this.maxCacheSize) {
      const newClone = SkeletonUtils.clone(originalScene)
      newClone.userData.inUse = true
      clones.push(newClone)
      return newClone
    }

    // Если кэш полный, создаем временный клон (не кэшируем)
    return SkeletonUtils.clone(originalScene)
  }

  // Вернуть клон в кэш
  returnClone(clone: Object3D, modelKey: string): void {
    const clones = this.cache.get(modelKey)
    if (clones && clones.includes(clone)) {
      clone.userData.inUse = false
      // Сбрасываем позицию и поворот
      clone.position.set(0, 0, 0)
      clone.rotation.set(0, 0, 0)
      clone.scale.set(1, 1, 1)
    }
  }

  // Очистить кэш
  clear(): void {
    this.cache.clear()
  }

  // Получить статистику кэша
  getStats(): Record<string, { total: number; inUse: number }> {
    const stats: Record<string, { total: number; inUse: number }> = {}

    this.cache.forEach((clones, key) => {
      stats[key] = {
        total: clones.length,
        inUse: clones.filter(clone => clone.userData.inUse).length
      }
    })

    return stats
  }
}

// Экспортируем singleton
export const modelCache = new ModelCache()

// Hook для управления моделями с кэшированием
export const useModelWithCache = (originalScene: Object3D, modelKey: string) => {
  const clone = modelCache.getClone(originalScene, modelKey)

  const returnToCache = () => {
    modelCache.returnClone(clone, modelKey)
  }

  return { clone, returnToCache }
}
