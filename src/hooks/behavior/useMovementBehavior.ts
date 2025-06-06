import { useEffect } from 'react';
import { AnimationAction } from 'three';

/**
 * Хук, управляющий анимациями движения и покоя.
 *
 * При `isMoving = true` проигрывает `runAction`, иначе `idleAction`.
 *
 * @param isMoving - Флаг, указывающий на движение.
 * @param runAction - Анимация бега.
 * @param idleAction - Анимация покоя.
 */
export function useMovementBehavior({
  isMoving,
  runAction,
  idleAction,
}: {
  isMoving: boolean;
  runAction?: AnimationAction | null;
  idleAction?: AnimationAction | null;
}) {
  useEffect(() => {
    const actions = [runAction, idleAction];
    actions.forEach((a) => a?.stop());

    if (isMoving) {
      runAction?.reset().fadeIn(0.2).play();
    } else {
      idleAction?.reset().fadeIn(0.2).play();
    }
  }, [isMoving, runAction, idleAction]);
}

