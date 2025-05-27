import { api } from "."

const TAG = '[user]'

export async function getUser() {
  const jwt = localStorage.getItem('jwt')
  if (!jwt) console.error(`${TAG}: no JWT token found in localStorage`)
  const response = await api.get('/profile', {
    headers: { Authorization: `Bearer ${jwt}` }
  })

  if (!response.data) console.error(`${TAG}: cannot get user data`)

  return response.data
}
