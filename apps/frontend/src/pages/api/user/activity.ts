import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  const { activityType } = req.body

  if (!activityType) {
    return res.status(400).json({ success: false, error: "Activity type is required" })
  }

  // This is a mock implementation
  // In a real app, you would record the activity in your database
  console.log(`Activity recorded: ${activityType}`)

  return res.status(200).json({
    success: true,
    message: `Activity ${activityType} recorded successfully`,
  })
}

