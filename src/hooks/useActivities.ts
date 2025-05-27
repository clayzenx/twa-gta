import { useState, useEffect } from 'react';
import { fetchActivities, Activity } from '@/api/activities';
import { reward } from '@/api/activities';

/**
 * Custom hook to load activities once for an authenticated user.
 *
 * Returns the activities list, loading state, and error (if any).
 */
export function useActivities(): {
  activities: Activity[];
  loading: boolean;
  error: Error | null;
  reward: (token: string) => void
} {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchActivities();
        if (isMounted) {
          setActivities(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { activities, loading, error, reward };
}
