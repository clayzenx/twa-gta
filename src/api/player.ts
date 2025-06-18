import { PlayerData } from "@/store/slices/userSlice"
import { api } from "."

const TAG = '[player]'

export async function initializePlayer(): Promise<PlayerData> {
  const initData = window.Telegram?.WebApp?.initData;

  const headers: Record<string, string> = {};

  if (initData) {
    headers['X-Telegram-InitData'] = initData;
  }

  console.log('initializePlayer', initData, headers)

  const response = await api.post<PlayerData>('/player/initialize', null, {
    headers,
  });
  console.info(`${TAG}: initialize player`, response.data);
  return response.data;
}

export async function updatePlayerStats(stats: Partial<PlayerData>): Promise<PlayerData> {
  const initData = window.Telegram?.WebApp?.initData;

  const headers: Record<string, string> = {};

  if (initData) {
    headers['X-Telegram-InitData'] = initData;
  }

  console.log('stats update', initData, headers)

  const response = await api.put<PlayerData>('/player/stats', stats, {
    headers,
  });
  console.info(`${TAG}: update player stats`, response.data);
  return response.data;
}
