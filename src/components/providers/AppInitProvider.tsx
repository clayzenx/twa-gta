import { ReactNode } from "react";
import { useInitApp } from '@/hooks/app/useInitApp';

type AppInitProviderProps = {
  children: ReactNode
}

export function AppInitProvider({ children }: AppInitProviderProps) {
  const { ready } = useInitApp();
  
  if (!ready) {
    return <div>Загрузка приложения...</div>;
  }
  
  return <>{children}</>;
}