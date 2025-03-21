"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, Card, CardContent, TextField, Typography, Link as MuiLink, Alert } from "@mui/material"

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
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
      // Simplified login for testing
      console.log("Login attempt with:", email, password)

      // Mock successful login
      localStorage.setItem("user", JSON.stringify({ email }))
      localStorage.setItem("token", "mock-token")

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
    <Card sx={{ maxWidth: 400, width: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          {isSignUp ? "Create an Account" : "Sign In"}
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
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <MuiLink
              component="button"
              variant="body2"
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{ cursor: "pointer" }}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </MuiLink>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

