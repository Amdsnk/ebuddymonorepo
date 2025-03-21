import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" })
    }

    // Note: Firebase Admin SDK cannot directly sign in with email/password
    // In a real app, you would need to implement a custom authentication system
    // For this demo, we'll return a mock response

    return res.status(200).json({
      success: true,
      data: {
        token: "mock-token",
        user: {
          uid: "mock-uid",
          email: email,
          displayName: null,
          photoURL: null,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, error: "Authentication failed" })
  }
}

