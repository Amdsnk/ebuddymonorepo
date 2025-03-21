"use client"

import { useEffect } from "react"
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
import RefreshIcon from "@mui/icons-material/Refresh"
import PersonIcon from "@mui/icons-material/Person"
import { useAuth } from "@/hooks/useAuth"
import ThemeToggle from "@/components/ThemeToggle"
import { useThemeContext } from "@/theme/CustomThemeProvider"
import { useUserData } from "@/hooks/useUserData"
import SkipLink from "@/components/SkipLink"

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const { mode, toggleTheme } = useThemeContext()

  // Use React Query hook instead of useState and useEffect
  const { userData, isLoading: fetchLoading, isError, error, refetch: fetchUserData } = useUserData(user?.uid)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

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

  const errorMessage = isError ? (error instanceof Error ? error.message : "Failed to fetch user data") : null

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
      <SkipLink />
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EBuddy Dashboard
          </Typography>
          <ThemeToggle onToggle={toggleTheme} isDarkMode={mode === "dark"} />
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
              id="main-content" // Add this ID for skip link
              tabIndex={-1} // Make it focusable but not in tab order
              aria-label="Main content"
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Welcome, {user?.displayName || user?.email?.split("@")[0] || "User"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => fetchUserData()}
                  disabled={fetchLoading}
                  startIcon={<RefreshIcon />}
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

              {errorMessage && (
                <Typography
                  color="error"
                  align="center"
                  sx={{ my: 2, p: 2, bgcolor: "rgba(211, 47, 47, 0.1)", borderRadius: 1 }}
                >
                  Error: {errorMessage}
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
                        {!userData.photoURL && <PersonIcon fontSize="large" />}
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
    </Box>
  )
}

