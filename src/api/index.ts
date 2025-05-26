import axios from "axios";
export { authUser } from './auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_TWA_API_SERVER,
})

