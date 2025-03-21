"use client"

import { useEffect } from "react"
import { Box, Container, Typography, Paper, AppBar, Toolbar, Button, Grid, CircularProgress } from "@mui/material"
import UpdateButton from "@/components/atoms/UpdateButton"
import UserCard from "@/components/molecules/UserCard"
import { useAuth } from "@/hooks/useAuth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchUserData } from "@/store/user/thunks"
import NoSSR from "@/components/NoSSR"

export default function Dashboard() {
  const { user, signOut } = useAuth()

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

              {/* Wrap Redux-dependent components in NoSSR */}
              <NoSSR>
                <DashboardContent userId={user?.uid} />
              </NoSSR>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

// Separate component that uses Redux
function DashboardContent({ userId }: { userId?: string }) {
  const dispatch = useAppDispatch()
  const { data: userData, loading, error } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserData(userId))
    }
  }, [dispatch, userId])

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <UpdateButton userId={userId} />
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

      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>{userData && <UserCard user={userData} />}</Box>
    </>
  )
}

