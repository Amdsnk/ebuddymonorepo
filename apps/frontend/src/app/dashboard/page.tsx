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
  potentialScore?: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Function to fetch user data from the API
  const fetchUserData = async () => {
    try {
      setRefreshing(true)
      setError(null)

      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("token")

      if (!storedUser || !token) {
        throw new Error("User not authenticated")
      }

      const parsedUser = JSON.parse(storedUser)

      // Fetch user data from the API
      const response = await fetch(`/api/user/${parsedUser.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch user data")
      }

      setUserData(data.data)

      // Record this activity
      await fetch(`/api/user/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activityType: "dashboard_view" }),
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch user data")
    } finally {
      setRefreshing(false)
    }
  }

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

      // Fetch user data on initial load
      fetchUserData()
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

  if (!user) {
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
            <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
              Welcome, {userData?.displayName || user.displayName || user.email.split("@")[0]}
            </h2>
            <button
              onClick={fetchUserData}
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
              <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>{userData?.email || user.email}</p>
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
                  {userData?.totalAverageWeightRatings.toFixed(1) || "N/A"}
                </p>
                <div style={{ display: "flex" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: userData && i < Math.floor(userData.totalAverageWeightRatings) ? "#F59E0B" : "#D1D5DB",
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
                <p style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>{userData?.numberOfRents || "0"}</p>
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
                <p style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>
                  {userData ? formatDate(userData.recentlyActive) : "N/A"}
                </p>
              </div>

              {userData?.potentialScore !== undefined && (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 4px 0" }}>Potential Score</p>
                  <p style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>{userData.potentialScore.toFixed(2)}</p>
                  <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0 0" }}>
                    Based on ratings, rents, and activity
                  </p>
                </div>
              )}
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
              <span style={{ fontWeight: "500" }}>{userData?.id || user.uid}</span>
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
              <span style={{ fontWeight: "500" }}>{userData ? formatDate(userData.createdAt) : "N/A"}</span>
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
              <span style={{ fontWeight: "500" }}>{userData ? formatDate(userData.updatedAt) : "N/A"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

