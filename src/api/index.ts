import axios from "axios";
// initialize response interceptor (retry on 401/403 via /auth)
import { setupAuthInterceptor } from './interceptors/authInterceptor';

export const api = axios.create({
  baseURL: import.meta.env.VITE_TWA_API_SERVER,
});

// Request interceptor: attach token from localStorage to Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// attach auth interceptor to handle 401/403 and token refresh
setupAuthInterceptor(api);

