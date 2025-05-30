import { User } from "@/context/UserContext"
import { api } from "."

const TAG = '[user]'

export async function getUser(): Promise<User> {
  const jwt = localStorage.getItem('jwt')
  if (!jwt) console.error(`${TAG}: no JWT token found in localStorage`)
  const response = await api.get<User>('/profile', {
    headers: { Authorization: `Bearer ${jwt}` }
  })

  if (!response.data) console.error(`${TAG}: cannot get user data`)

  return response.data
}
