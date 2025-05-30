import { AxiosInstance, AxiosError } from "axios";
import { authUser } from "../auth";
import WebApp from "@twa-dev/sdk";

/**
 * Sets up an interceptor to handle authentication errors (400/401/403).
 * On such errors, will call /auth to refresh the token (via authUser) and retry pending requests.
 */
export function setupAuthInterceptor(api: AxiosInstance) {
  let isRefreshing = false;
  let failedQueue: { resolve: (value?: any) => void; reject: (error: any) => void }[] = [];

  const processQueue = (error: any = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      error ? reject(error) : resolve();
    });
    failedQueue = [];
  };

  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;
      const status = error.response?.status;
      // if profile was called without Telegram initData (400), attach header and retry
      if (
        status === 400 &&
        originalRequest.url?.endsWith("/profile") &&
        !originalRequest._initInitDataRetry
      ) {
        originalRequest._initInitDataRetry = true;
        const initData = WebApp.initData;
        if (initData) {
          originalRequest.headers = originalRequest.headers || {};
          (originalRequest.headers as any)["x-telegram-initdata"] = initData;
          return api(originalRequest);
        }
      }
      // handle expired or invalid token
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => api(originalRequest));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        return new Promise(async (resolve, reject) => {
          try {
            await authUser();
            processQueue(null);
            resolve(api(originalRequest));
          } catch (err) {
            processQueue(err);
            window.location.href = '/';
            reject(err);
          } finally {
            isRefreshing = false;
          }
        });
      }
      return Promise.reject(error);
    }
  );
}
