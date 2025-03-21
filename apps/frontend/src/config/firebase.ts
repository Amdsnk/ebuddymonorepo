import type { FirebaseApp } from "firebase/app"

// Cache the Firebase app instance
let app: FirebaseApp | null = null

export async function initializeApp(): Promise<FirebaseApp> {
  if (app) return app

  try {
    const { getApp, initializeApp: firebaseInitializeApp } = await import("firebase/app")

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    try {
      app = getApp()
    } catch {
      app = firebaseInitializeApp(firebaseConfig)
    }

    return app
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    throw error
  }
}

