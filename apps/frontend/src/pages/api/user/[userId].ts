import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }

  const userId = req.query.userId as string

  // This is a mock implementation
  // In a real app, you would validate the token and fetch user data from your database
  return res.status(200).json({
    success: true,
    data: {
      id: userId || "user-123",
      email: "angela.soenoko@gmail.com",
      displayName: "Angela Soenoko",
      photoURL: null,
      totalAverageWeightRatings: 4.5,
      numberOfRents: 12,
      recentlyActive: Date.now() - 86400000, // 1 day ago
      createdAt: Date.now() - 30 * 86400000, // 30 days ago
      updatedAt: Date.now() - 5 * 86400000, // 5 days ago
    },
  })
}

