import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Signup API called with method:", req.method)

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` })
  }

  try {
    const { email, password } = req.body
    console.log("Signup attempt with email:", email)

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" })
    }

    // This is a mock implementation for testing
    // In a real app, you would create a user in your database
    return res.status(200).json({
      success: true,
      data: {
        token: "mock-token-" + Date.now(),
        user: {
          uid: "user-" + Date.now(),
          email: email,
          displayName: null,
          photoURL: null,
        },
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return res.status(500).json({ success: false, error: "Registration failed" })
  }
}

