import { useContext } from 'react';
import { ActivitiesContext, ActivitiesContextType } from '@/context/ActivitiesContext';

/**
 * Хук для удобного доступа к ActivitiesContext
 */
export function useActivitiesContext(): ActivitiesContextType {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivitiesContext must be used within an ActivitiesProvider');
  }
  return context;
}
