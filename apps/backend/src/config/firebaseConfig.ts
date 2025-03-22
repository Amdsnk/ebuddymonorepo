import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // For Vercel, we need to use the service account JSON as an environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined

  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`, // Add this line
  })
}

export const db = admin.database() // Changed from admin.firestore()
export const auth = admin.auth()

