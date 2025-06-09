import { useEffect } from 'react'
import { Mesh } from 'three'
import { Object3D } from 'three'

/**
 * Хук для рекурсивного включения поддержки теней у всех мешей в 3D-сцене.
 *
 * @param {Object3D} rootObject - Корневой объект сцены или модели (например, результат useGLTF().scene)
 * @param {Object} [options] - Дополнительные параметры
 * @param {boolean} [options.castShadow=true] - Включить отбрасывание тени
 * @param {boolean} [options.receiveShadow=false] - Включить приём теней
 *
 * @example
 * const { scene } = useGLTF('/model.glb')
 * useEnableShadows(scene)
 */
export function useEnableShadows(
  rootObject: Object3D,
  options?: {
    castShadow?: boolean
    receiveShadow?: boolean
  }
) {
  useEffect(() => {
    if (!rootObject) return

    const {
      castShadow = true,
      receiveShadow = false,
    } = options || {}

    rootObject.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })
  }, [rootObject, options])
}

