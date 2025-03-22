import type { NextApiRequest, NextApiResponse } from "next"
import * as admin from "firebase-admin"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only initialize if not already initialized
    if (admin.apps.length === 0) {
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

      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    }

    const db = admin.firestore()

    // Try to access a collection
    const snapshot = await db.collection("USERS").limit(1).get()

    res.status(200).json({
      success: true,
      message: `Successfully connected to Firestore. Found ${snapshot.size} users.`,
      environment: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
        serviceAccountLength: process.env.FIREBASE_SERVICE_ACCOUNT ? process.env.FIREBASE_SERVICE_ACCOUNT.length : 0,
      },
    })
  } catch (error) {
    console.error("Firebase Admin connection error:", error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
      environment: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
        serviceAccountLength: process.env.FIREBASE_SERVICE_ACCOUNT ? process.env.FIREBASE_SERVICE_ACCOUNT.length : 0,
      },
    })
  }
}

