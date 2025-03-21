"use client"

import { useState, useEffect, useCallback } from "react"
import type { User as FirebaseUser } from "firebase/auth"
import { initializeApp } from "@/config/firebase"

// Define types for auth functions to avoid importing them directly
type AuthFunctions = {
  getAuth: any
  signInWithEmailAndPassword: (auth: any, email: string, password: string) => Promise<any>
  createUserWithEmailAndPassword: (auth: any, email: string, password: string) => Promise<any>
  signOut: (auth: any) => Promise<void>
  onAuthStateChanged: (auth: any, callback: (user: FirebaseUser | null) => void) => () => void
}

// Cache for auth functions
let authFunctions: AuthFunctions | null = null

// Function to dynamically import auth functions
async function getAuthFunctions(): Promise<AuthFunctions> {
  if (authFunctions) return authFunctions

  const {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut: firebaseSignOut,
    onAuthStateChanged,
  } = await import("firebase/auth")

  authFunctions = {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut: firebaseSignOut,
    onAuthStateChanged,
  }

  return authFunctions
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)
  const [auth, setAuth] = useState<any>(null)

  // Initialize Firebase and Auth
  useEffect(() => {
    let unsubscribe = () => {}

    async function initAuth() {
      try {
        const app = initializeApp()
        const { getAuth, onAuthStateChanged } = await getAuthFunctions()
        const authInstance = getAuth(app)
        setAuth(authInstance)

        unsubscribe = onAuthStateChanged(authInstance, (user) => {
          setUser(user)
          setLoading(false)
        })

        setAuthReady(true)
      } catch (error) {
        console.error("Error initializing auth:", error)
        setLoading(false)
      }
    }

    initAuth()

    return () => unsubscribe()
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!authReady) {
        throw new Error("Auth not initialized")
      }

      setLoading(true)
      try {
        const { signInWithEmailAndPassword } = await getAuthFunctions()
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        setUser(userCredential.user)
        return userCredential.user
      } finally {
        setLoading(false)
      }
    },
    [auth, authReady],
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!authReady) {
        throw new Error("Auth not initialized")
      }

      setLoading(true)
      try {
        const { createUserWithEmailAndPassword } = await getAuthFunctions()
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        setUser(userCredential.user)
        return userCredential.user
      } finally {
        setLoading(false)
      }
    },
    [auth, authReady],
  )

  const signOut = useCallback(async () => {
    if (!authReady) {
      throw new Error("Auth not initialized")
    }

    try {
      const { signOut } = await getAuthFunctions()
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }, [auth, authReady])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}

