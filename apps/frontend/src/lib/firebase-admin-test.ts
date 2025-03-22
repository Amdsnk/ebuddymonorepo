// This file is for testing purposes only and should not be included in production
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getDatabase } from "firebase-admin/database"

export async function testFirebaseAdminConnection() {
  try {
    // Only initialize if not already initialized
    if (getApps().length === 0) {
      // For Vercel, we need to use the service account JSON as an environment variable
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT

      if (!serviceAccount) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set")
      }

      // Check if it's a valid JSON
      try {
        JSON.parse(serviceAccount)
      } catch (e) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT is not a valid JSON string")
      }

      initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
      })
    }

    const db = getDatabase()

    // Try to access a reference
    const snapshot = await db.ref("USERS").limitToFirst(1).get()

    return {
      success: true,
      message: `Successfully connected to Realtime Database. Found ${snapshot.exists() ? "data" : "no data"} in USERS.`,
    }
  } catch (error) {
    console.error("Firebase Admin connection error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

