import { useEffect, useState } from 'react'
import { getUser } from '@/api/user'
import { User } from '@/context/UserContext'

const TAG = '[useInitApp]'

export function useInitApp() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        // fetch user profile; if not authenticated, interceptor will call /auth and retry
        const user = await getUser()
        setUser(user)
      } catch (err) {
        console.error(`${TAG}: App init error:`, err)
      } finally {
        setReady(true)
      }
    }
    run()
  }, [])

  return { user, ready, setUser }
}

