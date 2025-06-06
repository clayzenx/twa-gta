import { useEffect, useRef } from "react";
import { LoopOnce, AnimationAction, AnimationMixerEventMap } from "three";
import { useFrame } from "@react-three/fiber";

interface AttackBehaviorProps {
  isAttacking: boolean;
  attackAction?: AnimationAction | null;
  hitTime?: number; // От 0 до 1. Момент удара по длительности анимации
  onHit?: () => void;
  onAttackComplete?: (e: AnimationMixerEventMap["finished"]) => void;
}

/**
 * Хук, управляющий анимацией атаки и автоатакой.
 *
 * Повторяет атаку, пока `isAttacking = true`. Вызывает `onAttackComplete` при завершении каждой атаки.
 *
 * @param isAttacking - Флаг, указывающий на активную атаку.
 * @param attackAction - Анимация атаки.
 * @param hitTime - Момент удара (0–1, как часть длины клипа).
 * @param onHit - Колбэк, вызываемый в нужный момент анимации.
 * @param onAttackComplete - Колбэк, вызываемый по завершении анимации атаки.
 */
export function useAttackBehavior({
  isAttacking,
  attackAction,
  hitTime = 0.5,
  onHit,
  onAttackComplete,
}: AttackBehaviorProps) {
  const duration = useRef(0);
  const startTime = useRef(0);
  const hasHit = useRef(false);

  useEffect(() => {
    if (!isAttacking || !attackAction) return;

    const mixer = attackAction.getMixer();
    const clip = attackAction.getClip();

    duration.current = clip.duration / (attackAction.timeScale || 1);
    startTime.current = performance.now();
    hasHit.current = false;

    attackAction.clampWhenFinished = true;
    attackAction.reset().setLoop(LoopOnce, 1).play();

    const handleFinished = (e: AnimationMixerEventMap["finished"]) => {
      if (e.action !== attackAction) return;
      onAttackComplete?.(e);

      if (isAttacking) {
        attackAction.reset().play();
        startTime.current = performance.now();
        hasHit.current = false;
      }
    };

    mixer.addEventListener("finished", handleFinished);

    return () => {
      mixer.removeEventListener("finished", handleFinished);
      attackAction.stop();
    };
  }, [isAttacking, attackAction]);

  useFrame(() => {
    if (!isAttacking || !attackAction || hasHit.current) return;

    const elapsed = (performance.now() - startTime.current) / 1000;
    const hitThreshold = duration.current * hitTime;


    if (elapsed >= hitThreshold) {
      onHit?.();
      hasHit.current = true;
    }
  });
}

