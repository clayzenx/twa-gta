import { api } from '.';

export interface Activity {
  token: string;
  name: string,
  reward: number
}

const TAG = '[activities]'

/**
 * Fetches the list of activities for the authenticated user.
 */
export async function fetchActivities(): Promise<Activity[]> {
  const jwt = localStorage.getItem('jwt')
  if (!jwt) console.error(`${TAG}: no JWT token found in localStorage`)

  const response = await api.get<Activity[]>('/activities', {
    headers: { Authorization: `Bearer ${jwt}` }
  });

  console.log('response.data', response.data)

  return response.data;
}
