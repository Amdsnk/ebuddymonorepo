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
  useTheme,
} from "@mui/material"
import { useAuth } from "@/hooks/useAuth"
import ThemeToggle from "@/components/ThemeToggle"
import Toast from "@/components/Toast"
import type { User } from "@ebuddy/shared"

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const [userData, setUserData] = useState<User | null>(null)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState({ open: false, message: "", type: "success" as const })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

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
      // Show success toast
      setToast({
        open: true,
        message: "User data refreshed successfully",
        type: "success",
      })
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch user data")
      // Show error toast
      setToast({
        open: true,
        message: err instanceof Error ? err.message : "Failed to fetch user data",
        type: "error",
      })
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
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f8fa" }}>
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EBuddy Dashboard
          </Typography>
          <ThemeToggle />
          <Button
            color="inherit"
            onClick={signOut}
            sx={{
              borderRadius: "4px",
              textTransform: "none",
              fontWeight: 500,
              ml: 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Welcome, {user?.displayName || user?.email?.split("@")[0] || "User"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchUserData}
                  disabled={fetchLoading}
                  sx={{ textTransform: "none" }}
                >
                  {fetchLoading ? "Refreshing..." : "Refresh Data"}
                </Button>
              </Box>

              {fetchLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Typography
                  color="error"
                  align="center"
                  sx={{ my: 2, p: 2, bgcolor: "rgba(211, 47, 47, 0.1)", borderRadius: 1 }}
                >
                  Error: {error}
                </Typography>
              )}

              {userData && !fetchLoading && (
                <Card sx={{ maxWidth: 600, width: "100%", mx: "auto", mb: 2, borderRadius: 2, overflow: "hidden" }}>
                  <Box sx={{ bgcolor: theme.palette.primary.main, p: 2, color: "white" }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      User Profile
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        src={userData.photoURL || undefined}
                        alt={userData.displayName || "User"}
                        sx={{
                          width: 80,
                          height: 80,
                          mr: 3,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        {!userData.photoURL && "👤"}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {userData.displayName || userData.email.split("@")[0]}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {userData.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Rating
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Rating value={userData.totalAverageWeightRatings} precision={0.1} readOnly size="large" />
                          </Box>
                          <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
                            {userData.totalAverageWeightRatings.toFixed(1)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Number of Rents
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {userData.numberOfRents}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Last Active
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {formatDate(userData.recentlyActive)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                      <Chip
                        label={`Created: ${formatDate(userData.createdAt)}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: "4px" }}
                      />
                      <Chip
                        label={`Updated: ${formatDate(userData.updatedAt)}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: "4px" }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  )
}

