"use client"

import { useEffect, useState } from "react"
import { Box, Container, Typography, Paper, AppBar, Toolbar, Button, Grid, CircularProgress } from "@mui/material"
import UpdateButton from "@/components/atoms/UpdateButton"
import UserCard from "@/components/molecules/UserCard"
import { useAuth } from "@/hooks/useAuth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchUserData } from "@/store/user/thunks"

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const dispatch = useAppDispatch()

  // Use local state as a fallback during SSR
  const [localLoading, setLocalLoading] = useState(false)

  // Safely use Redux state with fallbacks
  const reduxState = useAppSelector((state) => state.user)
  const userData = reduxState.data || null
  const loading = reduxState.loading || localLoading
  const error = reduxState.error || null

  // Only fetch data on the client side
  useEffect(() => {
    if (typeof window !== "undefined" && user?.uid) {
      setLocalLoading(true)
      dispatch(fetchUserData(user.uid)).finally(() => setLocalLoading(false))
    }
  }, [dispatch, user?.uid])

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
                <UpdateButton userId={user?.uid} />
              </Box>

              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Typography color="error" align="center" sx={{ my: 2 }}>
                  Error: {error}
                </Typography>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                {userData && <UserCard user={userData} />}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

