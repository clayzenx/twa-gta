import { api } from '.';

export interface Activity {
  id: string;
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

  console.info(`${TAG}: response.data`, response.data)

  return response.data;
}

export async function reward(activityId: string) {
  const jwt = localStorage.getItem('jwt')
  if (!jwt) console.error(`${TAG}: no JWT token found in localStorage`)

  const response = await api.post('/activities/reward', { activityId }, {
    headers: { Authorization: `Bearer ${jwt}` }
  });

  console.info(`${TAG} response`, response)

  // return response.data;
}
