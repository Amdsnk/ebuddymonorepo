"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, CircularProgress, Container } from "@mui/material"
import Dashboard from "@/components/pages/Dashboard"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

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
    <Box sx={{ minHeight: "100vh" }}>
      <Dashboard />
    </Box>
  )
}
