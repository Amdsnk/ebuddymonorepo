"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { User, UserUpdateData } from "@ebuddy/shared"
import { useToast } from "@/components/ToastProvider"

async function fetchUserData(userId?: string): Promise<User> {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const endpoint = userId ? `/api/user/${userId}` : "/api/user"
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.status}`)
  }

  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch user data")
  }

  return data.data
}

async function updateUserData(params: { userId?: string; data: UserUpdateData }): Promise<User> {
  const { userId, data: userData } = params
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const endpoint = userId ? `/api/user/${userId}` : "/api/user"
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update user data: ${response.status}`)
  }

  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || "Failed to update user data")
  }

  return data.data
}

export function useUserData(userId?: string) {
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["userData", userId],
    queryFn: () => fetchUserData(userId),
    onError: (error: Error) => {
      showToast(error.message, "error")
    },
  })

  const mutation = useMutation({
    mutationFn: updateUserData,
    onSuccess: (data) => {
      queryClient.setQueryData(["userData", userId], data)
      showToast("User data updated successfully", "success")
    },
    onError: (error: Error) => {
      showToast(error.message, "error")
    },
  })

  return {
    userData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateUser: (data: UserUpdateData) => mutation.mutate({ userId, data }),
    isUpdating: mutation.isPending,
  }
}

