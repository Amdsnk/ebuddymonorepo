import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" })
  }

  try {
    const { customToken } = req.body

    if (!customToken) {
      return res.status(400).json({ success: false, error: "Custom token is required" })
    }

    // We can't exchange the custom token for an ID token on the server
    // The client will need to do this using the REST API

    return res.status(200).json({
      success: true,
      data: {
        customToken,
      },
    })
  } catch (error) {
    console.error("Token exchange error:", error)
    return res.status(500).json({ success: false, error: "Token exchange failed" })
  }
}

