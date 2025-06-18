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
        setUser(userData)

        // If user doesn't have player data, initialize it
        if (!userData.player) {
          console.info(`${TAG}: Initializing player for user ${userData.id}`)
          const playerData = await initializePlayer()
          // TODO: лишнее наверное
          // initializePlayerData(playerData)

          console.log('initializePlayer', playerData)
          // Update the user object with player data
          setUser({ ...userData, player: playerData })

          // TODO: лишний state с player. user.player хватит вероятно
          // Initialize game player from player data
          // initializeFromPlayerData(playerData)
        } else {
          console.log('else', userData.player)
          setUser({ ...userData, player: userData.player })
          // Initialize game player from existing data
          // initializeFromPlayerData(userData.player)
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

