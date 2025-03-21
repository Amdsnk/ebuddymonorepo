"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth"
import { initializeApp } from "@/config/firebase"

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp()
    const auth = getAuth(app)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      return userCredential.user
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      return userCredential.user
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    const auth = getAuth()
    await firebaseSignOut(auth)
    setUser(null)
  }, [])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}

