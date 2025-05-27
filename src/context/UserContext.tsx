import { createContext, useContext } from "react"

export type User = {
  id: number
  username: string
  first_name: string
  last_name?: string
  language_code?: string
  photo_url?: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}


