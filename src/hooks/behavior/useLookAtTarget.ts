import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";

function lerpAngle(a: number, b: number, t: number) {
  const delta = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
  return a + delta * t;
}

interface UseLookAtTargetProps {
  selfRef?: React.RefObject<Object3D>;
  targetPosition?: { x: number; y?: number; z: number } | null;
  enabled?: boolean;
  smooth?: boolean;
  instantLookAt?: boolean;
  rotationSpeed?: number;
  fallbackMovement?: { x: number; z: number }; // ← добавим вектор движения
}

export function useLookAtTarget({
  selfRef,
  targetPosition,
  enabled = true,
  smooth = true,
  instantLookAt = false,
  rotationSpeed = 5,
  fallbackMovement,
}: UseLookAtTargetProps) {
  const targetVec = useRef(new Vector3());
  const currentRotationY = useRef(0);
  const wasEnabled = useRef(enabled);

  // Мгновенный поворот по движению при выходе из combat mode
  useEffect(() => {
    if (!selfRef?.current) return;
    if (wasEnabled.current && !enabled && fallbackMovement) {
      const { x, z } = fallbackMovement;
      const mag = x * x + z * z;
      if (mag > 0.0001) {
        const angle = Math.atan2(x, z);
        selfRef.current.rotation.y = angle;
        currentRotationY.current = angle;
      }
    }
    wasEnabled.current = enabled;
  }, [enabled, fallbackMovement]);

  useEffect(() => {
    if (!enabled || !selfRef?.current || !targetPosition) return;
    if (instantLookAt) {
      targetVec.current.set(targetPosition.x, targetPosition.y ?? 0, targetPosition.z);
      selfRef.current.lookAt(targetVec.current);
    }
  }, [enabled, instantLookAt, targetPosition?.x, targetPosition?.z]);

  useFrame((_, delta) => {
    if (!enabled || !selfRef?.current || !targetPosition || instantLookAt) return;

    const self = selfRef.current;
    targetVec.current.set(targetPosition.x, self.position.y, targetPosition.z);

    const direction = targetVec.current.clone().sub(self.position);
    direction.y = 0;

    if (direction.lengthSq() < 0.0001) return;

    const targetAngle = Math.atan2(direction.x, direction.z);

    if (smooth) {
      currentRotationY.current = lerpAngle(currentRotationY.current, targetAngle, rotationSpeed * delta);
      self.rotation.y = currentRotationY.current;
    } else {
      self.rotation.y = targetAngle;
      currentRotationY.current = targetAngle;
    }
  });
}


