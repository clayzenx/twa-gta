import { useEffect } from 'react'
import { getUser } from '@/api/user'
import { initializePlayer } from '@/api/player'
import { useGameStore } from '@/store/gameStore'

const TAG = '[useInitApp]'

export function useInitApp() {
  const { user, isLoading, setUser, setLoading, initializePlayerData, initializeFromPlayerData } = useGameStore()

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        // fetch user profile; if not authenticated, interceptor will call /auth and retry
        const userData = await getUser()

        // If user doesn't have player data, initialize it
        if (!userData.player) {
          console.info(`${TAG}: Initializing player for user ${userData.id}`)
          const playerData = await initializePlayer()
          setUser({ ...userData, player: playerData })
        } else {
          console.log('else setUser', userData)
          setUser(userData)
        }
      } catch (err) {
        console.error(`${TAG}: App init error:`, err)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [setUser, setLoading, initializePlayerData, initializeFromPlayerData])

  return { user, ready: !isLoading }
}

