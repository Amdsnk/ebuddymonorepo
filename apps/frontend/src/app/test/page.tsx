"use client"

import { useState, useEffect } from "react"
import { Box, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material"

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testApi = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test")
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testApi()
  }, [])

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: 600, width: "100%", m: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            API Test Page
          </Typography>

          {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />}

          {error && (
            <Typography color="error" sx={{ my: 2 }}>
              Error: {error}
            </Typography>
          )}

          {result && (
            <Box sx={{ my: 2 }}>
              <Typography variant="h6">API Response:</Typography>
              <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 4, overflow: "auto" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Box>
          )}

          <Button variant="contained" onClick={testApi} disabled={loading} sx={{ mt: 2 }}>
            Test API Again
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

