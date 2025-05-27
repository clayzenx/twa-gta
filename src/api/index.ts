import axios from "axios";
import { authUser } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_TWA_API_SERVER,
})

// use JWT token for authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const isExpired = error.response?.data?.error === 'Token expired'

      if (isExpired)
        authUser()
    }

    return Promise.reject(error)
  }
)

