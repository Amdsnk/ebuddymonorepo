import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../config/firebaseConfig"

export interface AuthRequest extends NextApiRequest {
  user?: {
    uid: string
    email: string
    role?: string // Added role property
  }
}

export const authMiddleware = async (req: AuthRequest, res: NextApiResponse): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, error: "Unauthorized: No token provided" })
      return
    }

    const token = authHeader.split("Bearer ")[1]

    try {
      const decodedToken = await auth.verifyIdToken(token)

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        // You can add custom claims for role if you have them in your Firebase Auth
        role: decodedToken.role || decodedToken.claims?.role || "user"
      }
      // Continue to the next middleware/handler
    } catch (error) {
      res.status(401).json({ success: false, error: "Unauthorized: Invalid token" })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({ success: false, error: "Internal server error" })
  }
}
