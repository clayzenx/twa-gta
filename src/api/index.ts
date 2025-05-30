import axios from "axios";
// initialize response interceptor (retry on 401/403 via /auth)
import { setupAuthInterceptor } from './interceptors/authInterceptor';

export const api = axios.create({
  baseURL: import.meta.env.VITE_TWA_API_SERVER,
  withCredentials: true,
});

// attach auth interceptor to handle 401/403 and token refresh
setupAuthInterceptor(api);

