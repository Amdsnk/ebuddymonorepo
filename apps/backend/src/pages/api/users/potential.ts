import type { NextApiRequest, NextApiResponse } from "next"
import { fetchPotentialUsers } from "../../../controller/api"
import { authMiddleware, type AuthRequest } from "../../../middleware/authMiddleware"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply auth middleware
    await authMiddleware(req as AuthRequest, res)

    // If middleware didn't terminate the request, proceed
    if (res.writableEnded) return

    // Handle different HTTP methods
    if (req.method === "GET") {
      await fetchPotentialUsers(req as AuthRequest, res)
    } else {
      res.status(405).json({ success: false, error: "Method not allowed" })
    }
  } catch (error) {
    console.error("API error:", error)
    res.status(500).json({ success: false, error: "Internal server error" })
  }
}

