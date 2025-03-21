"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// Define user type without importing from Firebase
interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

// Define auth response type
interface AuthResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  error?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data: AuthResponse = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error || "Authentication failed")
      }

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.data.user))
      localStorage.setItem("token", data.data.token)

      setUser(data.data.user)
      return data.data.user
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data: AuthResponse = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error || "Registration failed")
      }

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.data.user))
      localStorage.setItem("token", data.data.token)

      setUser(data.data.user)
      return data.data.user
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // Clear user state
    setUser(null)

    // Redirect to login page
    router.push("/login")
  }, [router])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}

