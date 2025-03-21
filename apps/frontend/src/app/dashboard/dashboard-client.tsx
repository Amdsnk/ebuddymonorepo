"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Rating,
} from "@mui/material"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@ebuddy/shared"

// Client-side only dashboard
export default function DashboardClient() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<User | null>(null)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch user data directly without Redux
  const fetchUserData = async () => {
    if (!user?.uid) return

    try {
      setFetchLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`/api/user/${user.uid}`, {
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
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch user data")
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (user?.uid) {
      fetchUserData()
    }
  }, [user?.uid])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EBuddy Dashboard
          </Typography>
          <Button color="inherit" onClick={signOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="h4" gutterBottom>
                Welcome, {user?.displayName || user?.email || "User"}
              </Typography>
              <Typography variant="body1" paragraph>
                This is your dashboard where you can view and update your information.
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" color="primary" onClick={fetchUserData} disabled={fetchLoading}>
                  {fetchLoading ? "Loading..." : "Refresh User Data"}
                </Button>
              </Box>

              {fetchLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Typography color="error" align="center" sx={{ my: 2 }}>
                  Error: {error}
                </Typography>
              )}

              {userData && (
                <Card sx={{ maxWidth: 500, width: "100%", mx: "auto", mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={userData.photoURL || undefined}
                        alt={userData.displayName || "User"}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h5" component="div">
                          {userData.displayName || "User"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userData.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Rating
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating value={userData.totalAverageWeightRatings} precision={0.5} readOnly />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {userData.totalAverageWeightRatings.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Number of Rents
                      </Typography>
                      <Typography variant="h6">{userData.numberOfRents}</Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Active
                      </Typography>
                      <Typography variant="h6">{formatDate(userData.recentlyActive)}</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Chip label={`Created: ${formatDate(userData.createdAt)}`} size="small" variant="outlined" />
                      <Chip label={`Updated: ${formatDate(userData.updatedAt)}`} size="small" variant="outlined" />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

