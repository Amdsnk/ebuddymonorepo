"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, Card, CardContent, TextField, Typography, Alert, Container } from "@mui/material"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // For demo purposes, accept any email/password
      console.log("Login attempt with:", email)

      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: "user-123",
          email,
          displayName: email.split("@")[0],
        }),
      )
      localStorage.setItem("token", "mock-token-123")

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Auth error:", err)
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ width: "100%" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            EBuddy Login
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter any email and password to log in
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

