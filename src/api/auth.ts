export async function authUser() {
  const initData = window.Telegram.WebApp.initData

  const response = await fetch(import.meta.env.VITE_TWA_API_SERVER + '/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ initData }),
  })

  if (!response.ok) {
    throw new Error('Auth failed')
  }

  return await response.json()
}

