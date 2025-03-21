"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UserData {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  totalAverageWeightRatings: number
  numberOfRents: number
  recentlyActive: number
  createdAt: number
  updatedAt: number
}

export default function DashboardClient() {
  const [user, setUser] = useState<any | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Create mock user data
      const mockUserData: UserData = {
        id: parsedUser.uid,
        email: parsedUser.email,
        displayName: parsedUser.displayName || parsedUser.email.split("@")[0],
        photoURL: null,
        totalAverageWeightRatings: 4.5,
        numberOfRents: 12,
        recentlyActive: Date.now() - 86400000, // 1 day ago
        createdAt: Date.now() - 30 * 86400000, // 30 days ago
        updatedAt: Date.now() - 5 * 86400000, // 5 days ago
      }

      setUserData(mockUserData)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              border: "4px solid rgba(0, 0, 0, 0.1)",
              borderTopColor: "#2563EB",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "16px",
            }}
          ></div>
          <p style={{ color: "#6B7280" }}>Loading your dashboard...</p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return null
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header
        style={{
          backgroundColor: "white",
          padding: "16px 24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>EBuddy Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#EF4444",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {error && (
          <div
            style={{
              marginBottom: "24px",
              padding: "12px 16px",
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Welcome, {userData.displayName}</h2>
            <button
              onClick={() => {
                setRefreshing(true)
                setTimeout(() => {
                  setRefreshing(false)
                }, 1000)
              }}
              disabled={refreshing}
              style={{
                backgroundColor: "#2563EB",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                opacity: refreshing ? 0.7 : 1,
              }}
            >
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>

          <p style={{ color: "#6B7280", marginBottom: "24px" }}>
            This is your dashboard where you can view and update your information.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              backgroundColor: "#F9FAFB",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <div>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 4px 0" }}>Email</p>
              <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>{userData.email}</p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 4px 0" }}>Rating</p>
                <p style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 4px 0" }}>
                  {userData.totalAverageWeightRatings.toFixed(1)}
                </p>
                <div style={{ display: "flex" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < Math.floor(userData.totalAverageWeightRatings) ? "#F59E0B" : "#D1D5DB",
                        fontSize: "16px",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 4px 0" }}>Number of Rents</p>
                <p style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>{userData.numberOfRents}</p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 4px 0" }}>Last Active</p>
                <p style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>{formatDate(userData.recentlyActive)}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginTop: 0, marginBottom: "16px" }}>Account Details</h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <span style={{ color: "#6B7280" }}>User ID</span>
              <span style={{ fontWeight: "500" }}>{userData.id}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <span style={{ color: "#6B7280" }}>Created</span>
              <span style={{ fontWeight: "500" }}>{formatDate(userData.createdAt)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <span style={{ color: "#6B7280" }}>Last Updated</span>
              <span style={{ fontWeight: "500" }}>{formatDate(userData.updatedAt)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

