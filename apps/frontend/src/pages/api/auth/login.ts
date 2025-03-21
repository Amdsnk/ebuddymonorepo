import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" })
    }

    // This is a mock implementation for testing
    // In a real app, you would validate credentials against a database
    if (email === "test@example.com" && password === "password") {
      return res.status(200).json({
        success: true,
        data: {
          token: "mock-token-123",
          user: {
            uid: "user-123",
            email: email,
            displayName: "Test User",
            photoURL: null,
          },
        },
      })
    } else {
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, error: "Authentication failed" })
  }
}

