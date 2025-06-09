import { useEffect, useRef } from "react";
import { LoopOnce, AnimationAction, AnimationMixerEventMap, Object3D } from "three";
import { useFrame } from "@react-three/fiber";
import { Position } from "@/types/game"; // Убедись, что тип подключён
import { useLookAtTarget } from "./useLookAtTarget";

interface AttackBehaviorProps {
  isAttacking: boolean;
  attackAction?: AnimationAction | null;
  hitTime?: number; // От 0 до 1. Момент удара по длительности анимации
  onHit?: () => void;
  onAttackComplete?: (e: AnimationMixerEventMap["finished"]) => void;
  selfRef?: React.RefObject<Object3D>;
  targetPosition?: Position;
}

/**
 * Хук, управляющий анимацией атаки и поворотом к цели.
 *
 * Повторяет атаку, пока `isAttacking = true`. Вызывает `onAttackComplete` при завершении каждой атаки.
 * В момент `hitTime` вызывает `onHit`.
 * Если переданы `selfRef` и `targetPosition`, поворачивает сущность к цели.
 */
export function useAttackBehavior({
  isAttacking,
  attackAction,
  hitTime = 0.5,
  onHit,
  onAttackComplete,
  selfRef,
  targetPosition,
}: AttackBehaviorProps) {
  const duration = useRef(0);
  const startTime = useRef(0);
  const hasHit = useRef(false);

  useLookAtTarget({
    selfRef,
    targetPosition,
    enabled: isAttacking,
    smooth: true,
  });

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

  // Вызов onHit на hitTime
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

