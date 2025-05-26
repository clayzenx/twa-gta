import { api } from "."
import WebApp from "@twa-dev/sdk"

export async function authUser() {
  const initData = WebApp.initData;
  console.log('initData', initData);

  const response = await api.post('/auth', { initData })

  if (!response.status) {
    throw new Error('Auth failed')
  }

  return await response.data()
}

