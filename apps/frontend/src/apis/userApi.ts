import type { User, UserResponse, UserUpdateData } from "@ebuddy/shared"
import { getAuth } from "firebase/auth"

// Update to use Vercel API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

async function getAuthToken(): Promise<string> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error("User not authenticated")
  }

  return user.getIdToken()
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken()

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export async function fetchUser(userId?: string): Promise<User> {
  // Updated endpoint path for Vercel
  const endpoint = userId ? `${API_BASE_URL}/user/${userId}` : `${API_BASE_URL}/user`

  const response = await fetchWithAuth(endpoint)
  const data: UserResponse = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || "Failed to fetch user data")
  }

  return data.data as User
}

export async function updateUser(userData: UserUpdateData, userId?: string): Promise<User> {
  // Updated endpoint path for Vercel
  const endpoint = userId ? `${API_BASE_URL}/user/${userId}` : `${API_BASE_URL}/user`

  const response = await fetchWithAuth(endpoint, {
    method: "PUT",
    body: JSON.stringify(userData),
  })

  const data: UserResponse = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || "Failed to update user data")
  }

  return data.data as User
}

export async function fetchPotentialUsers(limit = 10, lastScore?: number, lastId?: string): Promise<User[]> {
  // Updated endpoint path for Vercel
  let endpoint = `${API_BASE_URL}/users/potential?limit=${limit}`

  if (lastScore !== undefined && lastId) {
    endpoint += `&lastScore=${lastScore}&lastId=${lastId}`
  }

  const response = await fetchWithAuth(endpoint)
  const data: UserResponse = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || "Failed to fetch potential users")
  }

  return data.data as User[]
}

