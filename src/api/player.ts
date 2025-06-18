import { PlayerData } from "@/store/slices/userSlice"
import { api } from "."

const TAG = '[player]'

export async function initializePlayer(): Promise<PlayerData> {
  const response = await api.post<PlayerData>('/player/initialize');
  console.info(`${TAG}: initialize player`, response.data);
  return response.data;
}

export async function updatePlayerStats(stats: Partial<PlayerData>): Promise<PlayerData> {
  const response = await api.put<PlayerData>('/player/stats', stats);
  console.info(`${TAG}: update player stats`, response.data);
  return response.data;
}