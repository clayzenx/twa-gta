import { useEffect } from 'react';
import { LoopOnce, AnimationAction, AnimationMixerEventMap } from 'three';

type UsePlayerAnimationProps = {
  isAttacking: boolean;
  isMoving: boolean;
  actions?: Record<string, AnimationAction | null>;
  onAttackFinished?: (e: AnimationMixerEventMap['finished']) => void
};

export function usePlayerAnimation({ isAttacking, isMoving, actions, onAttackFinished }: UsePlayerAnimationProps) {
  // Обработчики
  useEffect(() => {
    if (!actions || !onAttackFinished) return;
    const attack = actions['Attack'];
    const attackMixer = attack?.getMixer();

    if (!attack || !attackMixer) return;

    onAttackFinished && attackMixer.addEventListener('finished', onAttackFinished);

    return () => {
      onAttackFinished && attackMixer.removeEventListener('finished', onAttackFinished);
    };
  }, [actions, onAttackFinished]);

  // Анимации
  useEffect(() => {
    const attack = actions?.['Attack'];
    const run = actions?.['Run'];
    const idle = actions?.['idle'];
    const mixer = attack?.getMixer();

    if (!actions || !attack || !mixer) return;

    // Останавливаем все анимации
    Object.values(actions).forEach((action) => action?.stop());

    if (isAttacking) {
      attack.reset().setLoop(LoopOnce, 1).clampWhenFinished = true;
      attack.play();
    } else if (isMoving) {
      run?.reset().fadeIn(0.2).play();
    } else {
      idle?.reset().fadeIn(0.2).play();
    }
  }, [isAttacking, isMoving, actions]);
}

