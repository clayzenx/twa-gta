import { User } from "@/context/UserContext"
import { api } from "."

const TAG = '[user]'

export async function getUser(): Promise<User> {
  const initData = window.Telegram?.WebApp?.initData;

  const headers: Record<string, string> = {};

  if (initData) {
    headers['X-Telegram-InitData'] = initData;
  }

  const response = await api.get<User>('/profile', {
    headers,
  });

  console.info(`${TAG}: get user data`, response.data);

  if (!response.data) {
    console.error(`${TAG}: cannot get user data`);
  }
  return response.data;
}
