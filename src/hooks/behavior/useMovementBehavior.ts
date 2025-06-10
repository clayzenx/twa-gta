import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';
import { AnimationAction, Object3D } from 'three';
import { useLookAtTarget } from './useLookAtTarget';
import { useMovementDirectionTracker } from '@/hooks/behavior/useMovementDirectionTracker'

/**
 * Хук, управляющий анимациями движения и покоя, с поддержкой боевого режима и поворота к цели.
 *
 * - При `isMoving = true` проигрывает:
 *   - `combatMoveAction`, если `isAttacking === true`
 *   - иначе `runAction`
 * - При `isMoving = false` проигрывает `idleAction`
 * - При `isAttacking = true` и передан `selfRef` + `targetPosition`, поворачивает к цели
 *
 * @param isMoving - Флаг движения
 * @param isAttacking - Флаг боевого режима
 * @param runAction - Анимация обычного бега
 * @param combatMoveAction - Анимация боевого движения
 * @param idleAction - Анимация покоя
 * @param selfRef - Ссылка на объект (модель), которую нужно вращать
 * @param targetPosition - Позиция цели, к которой нужно поворачиваться
 */
export function useMovementBehavior({
  isMoving,
  isAttacking,
  runAction,
  combatMoveAction,
  idleAction,
  selfRef,
  targetPosition,
}: {
  isMoving: boolean;
  isAttacking?: boolean;
  runAction?: AnimationAction | null;
  combatMoveAction?: AnimationAction | null;
  idleAction?: AnimationAction | null;
  selfRef?: React.RefObject<Object3D>;
  targetPosition?: { x: number; z: number }; // только x и z (движение по плоскости)
}) {

  const movement = useGameStore((s) => s.input.movement);

  useLookAtTarget({
    selfRef,
    targetPosition,
    enabled: isAttacking,
    smooth: true,
    fallbackMovement: movement,
  });

  useMovementDirectionTracker({
    isMoving,
    movementVec: movement,
    selfRef
  })

  useEffect(() => {

    const actions = [runAction, combatMoveAction, idleAction];

    // Определяем нужную анимацию
    let activeAction: AnimationAction | null | undefined;
    if (isMoving) {
      activeAction = isAttacking ? combatMoveAction : runAction;
    } else {
      activeAction = idleAction;
    }

    // Неактивные экшены останавливаем
    actions.forEach((a) => {
      if (a && a !== activeAction) {
        a.fadeOut(0.2); // Мягко убираем
      }
    });

    // Включаем нужную
    activeAction?.reset().fadeIn(0.2).play();
  }, [isMoving, isAttacking, runAction, combatMoveAction, idleAction]);
}

