import { api } from "."
import WebApp from "@twa-dev/sdk"

export async function authUser() {
  // Notify Telegram Web App that the page is ready (optional)
  if (WebApp.ready) {
    WebApp.ready()
  }

  const initData = WebApp.initData
  // initData must be provided by Telegram Web App environment
  if (!initData) {
    throw new Error('Telegram initData is missing. Open this page in a Telegram WebApp context.')
  }

  // Send Telegram initData to backend for verification
  const response = await api.post('/auth', { initData });
  const data = response.data as { token?: string };
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

