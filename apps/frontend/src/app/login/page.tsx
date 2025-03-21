"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material"
import Toast from "@/components/Toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState({ open: false, message: "", type: "success" as const })
  const router = useRouter()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)

    try {
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

      // Show success toast
      setToast({
        open: true,
        message: "Login successful",
        type: "success",
      })

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Auth error:", err)
      setError(err instanceof Error ? err.message : "Authentication failed")
      setToast({
        open: true,
        message: err instanceof Error ? err.message : "Authentication failed",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f8fa",
        padding: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 450, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              EBuddy Login
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
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
              InputProps={{
                startAdornment: <InputAdornment position="start">✉️</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <InputAdornment position="start">🔒</InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 1,
                mb: 3,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 1,
              }}
            >
              {isSubmitting ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Signing in...
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Demo Mode
              </Typography>
            </Divider>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              For this demo, you can use any email and password
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  )
}

