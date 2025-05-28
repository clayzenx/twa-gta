import { useEffect, useState } from 'react'
import { authUser } from '@/api/auth'
import { getUser } from '@/api/user'
import { User } from '@/context/UserContext'

const TAG = '[useInitApp]'

export function useInitApp() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        let token = localStorage.getItem('jwt')
        if (!token) {
          const result = await authUser()
          token = result.token
          if (token) localStorage.setItem('jwt', token)
          else console.error(`${TAG}: cannot get token`)
        }

        // TODO: no type here, fix it later
        const data = await getUser()
        setUser(data.user)
      } catch (err) {
        console.error('App init error:', err)
      } finally {
        setReady(true)
      }
    }
    run()
  }, [])

  return { user, ready, setUser }
}

