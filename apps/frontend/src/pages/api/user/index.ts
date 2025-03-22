import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }

  // Calculate a mock potential score based on the current time to simulate changes
  const now = Date.now()
  const randomFactor = Math.sin(now / 10000) * 0.1 + 0.9 // Value between 0.8 and 1.0

  // This is a mock implementation
  // In a real app, you would validate the token and fetch user data from your database
  return res.status(200).json({
    success: true,
    data: {
      id: "user-123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
      totalAverageWeightRatings: 4.5 * randomFactor,
      numberOfRents: Math.floor(12 * randomFactor),
      recentlyActive: now,
      createdAt: now - 30 * 86400000, // 30 days ago
      updatedAt: now - Math.floor(Math.random() * 5) * 86400000, // 0-5 days ago
      potentialScore: 85.75 * randomFactor, // Mock potential score
    },
  })
}

