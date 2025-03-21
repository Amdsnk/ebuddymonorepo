"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!email) {
      setError("Email is required")
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "normal",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            Sign In
          </h1>

          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "8px 12px",
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#2563EB",
                }}
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
                disabled={isSubmitting}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#4B5563",
                }}
              >
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                backgroundColor: "#2563EB",
                color: "white",
                padding: "10px 16px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Link
              href="#"
              style={{
                fontSize: "14px",
                color: "#2563EB",
                textDecoration: "none",
              }}
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

