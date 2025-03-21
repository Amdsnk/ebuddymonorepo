import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }

  // This is a mock implementation
  // In a real app, you would validate the token and fetch user data from your database
  return res.status(200).json({
    success: true,
    data: {
      id: "user-123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      totalAverageWeightRatings: 4.5,
      numberOfRents: 12,
      recentlyActive: Date.now(),
      createdAt: Date.now() - 1000000,
      updatedAt: Date.now() - 50000,
    },
  })
}

