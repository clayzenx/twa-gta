import { createContext, useContext, ReactNode } from "react";
import { useInitApp } from '@/hooks/app/useInitApp';

export type User = {
  id: number
  telegramId: string,
  firstName: string,
  lastName: string,
  username: string,
  languageCode: string,
  photoUrl: string,
  balance: number,
  createdAt: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

/**
 * Провайдер контекста User
 * Инициализирует пользователя через useInitApp и предоставляет доступ через контекст
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const { user, ready, setUser } = useInitApp();
  if (!ready) return <div>Загрузка приложения...</div>;
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}


