import { useEffect, useRef } from "react";
import { Object3D, Vector3 } from "three";

/**
 * Управляет направлением объекта при остановке движения.
 * Поворачивает к последнему направлению движения.
 *
 * @param isMoving - Флаг движения
 * @param movementVec - Вектор движения (x, z)
 * @param selfRef - Ссылка на объект (модель)
 */
export function useMovementDirectionTracker({
  isMoving,
  movementVec,
  selfRef,
}: {
  isMoving: boolean;
  movementVec: { x: number; z: number };
  selfRef?: React.RefObject<Object3D>;
}) {
  const lastDirection = useRef(new Vector3(0, 0, 1));

  // Обновляем последний ненулевой вектор движения
  useEffect(() => {
    if (isMoving && (movementVec.x !== 0 || movementVec.z !== 0)) {
      lastDirection.current.set(movementVec.x, 0, movementVec.z).normalize();
    }
  }, [isMoving, movementVec.x, movementVec.z]);

  // При остановке — разворачиваем в последнем направлении
  useEffect(() => {
    if (!isMoving && selfRef?.current) {
      const dir = lastDirection.current;
      const angle = Math.atan2(dir.x, dir.z); // направление в радианах
      selfRef.current.rotation.y = angle;
    }
  }, [isMoving]);
}

