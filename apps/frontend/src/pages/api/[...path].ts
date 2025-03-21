import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Catch-all API route called:", {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: req.headers,
    body: req.body,
  })

  res.status(200).json({
    success: true,
    message: "Catch-all API route",
    path: req.query.path,
    method: req.method,
  })
}

