
import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../../config/firebaseConfig"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" })
    }

    // Create a custom token
    const userRecord = await auth.getUserByEmail(email).catch(() => null)

    if (!userRecord) {
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }

    // Generate a custom token
    const token = await auth.createCustomToken(userRecord.uid)

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          photoURL: userRecord.photoURL,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, error: "Authentication failed" })
  }
}

