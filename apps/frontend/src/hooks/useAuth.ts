"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// Add this import
import { analytics } from "@/lib/analytics"

// Define user type
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

// Change to named export
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

  // In the signIn function
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      // Use relative URL for API endpoints
      const loginUrl = "/api/auth/login"

      console.log("Signing in with:", loginUrl)

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Login failed with status:", response.status, errorText)
        throw new Error(`Login failed: ${response.status} ${errorText}`)
      }

      // Try to parse JSON
      let data: AuthResponse
      try {
        data = await response.json()
      } catch (error) {
        console.error("Failed to parse JSON response:", error)
        const responseText = await response.text()
        console.error("Response text:", responseText)
        throw new Error("Invalid response from server")
      }

      if (!data.success || !data.data) {
        throw new Error(data.error || "Authentication failed")
      }

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.data.user))
      localStorage.setItem("token", data.data.token)

      // Track login event
      analytics.trackEvent("login", { email })

      setUser(data.data.user)
      return data.data.user
    } catch (error) {
      // Track error event
      analytics.trackEvent("error", {
        context: "login",
        message: error instanceof Error ? error.message : "Authentication failed",
      })

      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      // Use relative URL for API endpoints
      const signupUrl = "/api/auth/signup"

      console.log("Signing up with:", signupUrl)

      const response = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Signup failed with status:", response.status, errorText)
        throw new Error(`Signup failed: ${response.status} ${errorText}`)
      }

      // Try to parse JSON
      let data: AuthResponse
      try {
        data = await response.json()
      } catch (error) {
        console.error("Failed to parse JSON response:", error)
        const responseText = await response.text()
        console.error("Response text:", responseText)
        throw new Error("Invalid response from server")
      }

      if (!data.success || !data.data) {
        throw new Error(data.error || "Registration failed")
      }

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.data.user))
      localStorage.setItem("token", data.data.token)

      setUser(data.data.user)
      return data.data.user
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // In the signOut function
  const signOut = useCallback(async () => {
    // Track logout event
    analytics.trackEvent("logout")

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

