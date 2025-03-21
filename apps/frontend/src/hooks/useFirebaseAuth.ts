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

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize Firebase on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Dynamically import Firebase
        const { initializeApp } = await import("firebase/app")
        const { getAuth, onAuthStateChanged } = await import("firebase/auth")

        // Firebase config
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }

        // Initialize Firebase
        const app = initializeApp(firebaseConfig)
        const auth = getAuth(app)

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }
            setUser(user)
          } else {
            setUser(null)
          }
          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Error initializing Firebase:", error)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth")
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }

      return user
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth")
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }

      return user
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const { getAuth, signOut: firebaseSignOut } = await import("firebase/auth")
      const auth = getAuth()

      await firebaseSignOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }, [router])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}

