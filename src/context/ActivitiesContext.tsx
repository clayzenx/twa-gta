import { createContext, useMemo, ReactNode } from 'react';
import { useActivities } from '@/hooks/useActivities';
import { Activity } from '@/api/activities';

/**
 * Контекст для списка активностей и доступа к ним по человекочитаемому id.
 */
export type ActivitiesContextType = {
  /** Полный список активностей */
  activities: Activity[];
  /** Флаг загрузки */
  loading: boolean;
  /** Ошибка загрузки, если есть */
  error: Error | null;
  /**
   * Получить объект активности по её id (человеческому ключу)
   * @param id уникальный ключ активности (например из enum или строковое значени)
   */
  getActivityById: (id: ActivityIds | string) => Activity | undefined;
  /**
   * Получить токен/хеш активности по её id (ActivityIds или string на прямую)
   */
  getTokenById: (id: ActivityIds | string) => string | undefined;
  /**
   * Список всех доступных id активностей
   */
  activityIds: string[];
};

export const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

/**
 * Провайдер, загружает список активностей единожды и предоставляет доступ ко всем
 */
export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const { activities, loading, error } = useActivities();

  // Создаём map: id -> Activity
  const mapById = useMemo<Record<string, Activity>>(() => {
    const m: Record<string, Activity> = {};
    activities.forEach((a) => {
      m[a.id] = a;
    });
    return m;
  }, [activities]);

  const getActivityById = (id: string) => mapById[id];
  const getTokenById = (id: string) => mapById[id]?.token;
  const activityIds = useMemo(() => Object.keys(mapById), [mapById]);

  return (
    <ActivitiesContext.Provider
      value={{ activities, loading, error, getActivityById, getTokenById, activityIds }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

