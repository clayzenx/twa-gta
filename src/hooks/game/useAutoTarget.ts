import { useEffect, useMemo, useCallback, useRef } from "react";
import { isInRange } from "@/utils/math";
import { Position } from "@/types/game";

interface UseAutoTargetProps<T extends { id: string; position: Position }> {
  selfPosition: { x: number; z: number };
  currentTargetId: string | null;
  range: number;
  targets: T[];
  setTarget: (id: string | null) => void;
  onTargetChanged?: (hasTarget: boolean) => void;
}

/**
 * Хук автоматического выбора ближайшей цели в пределах досягаемости.
 * Универсален и может использоваться для любых сущностей (игроков, монстров и т.п.).
 *
 * @param selfPosition - Позиция текущего объекта (сущности).
 * @param currentTargetId - ID текущей цели.
 * @param range - Радиус досягаемости.
 * @param targets - Список возможных целей (объекты с `id` и `position`).
 * @param setTarget - Функция установки новой цели.
 */
export function useAutoTarget<T extends { id: string; position: Position }>({
  selfPosition,
  currentTargetId,
  range,
  targets,
  setTarget,
  onTargetChanged
}: UseAutoTargetProps<T>) {
  // Используем ref для позиции, чтобы избежать бесконечных re-render'ов
  const positionRef = useRef(selfPosition);
  positionRef.current = selfPosition;

  // Оптимизированная мемоизация ключа целей для избежания ненужных ререндеров
  const targetsKey = useMemo(() =>
    targets.map((t) => `${t.id}:${t.position.x},${t.position.z}`).join("|"),
    [targets]
  );

  useEffect(() => {
    if (!targets.length) {
      if (currentTargetId !== null) {
        setTarget(null);
        onTargetChanged?.(false);
      }
      return;
    }

    // Если кто-то уже в таргете — ничего не меняем
    if (currentTargetId !== null) {
      // Но сбрасываем, если текущая цель вне диапазона или отсутствует
      const stillValid = targets.some(
        (t) =>
          t.id === currentTargetId &&
          isInRange(positionRef.current, t.position, range).inRange
      );

      if (!stillValid) {
        setTarget(null);
        onTargetChanged?.(false);
      }

      return;
    }

    let closestId: string | null = null;
    let closestDistance = Infinity;
    let foundInRange = false;

    for (const target of targets) {
      const { distance, inRange } = isInRange(positionRef.current, target.position, range);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = target.id;
      }

      if (inRange) {
        foundInRange = true;
      }
    }

    if (!foundInRange) {
      if (currentTargetId !== null) {
        setTarget(null);
        onTargetChanged?.(false);
      }
      return;
    }

    if (closestId !== currentTargetId) {
      setTarget(closestId);
      onTargetChanged?.(true);
    }
  }, [
    currentTargetId,
    range,
    targetsKey
  ]);
}

