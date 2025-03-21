"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box } from "@mui/material"
import LoginForm from "@/components/organisms/LoginForm"
import { useAuth } from "@/hooks/useAuth"

export default function LoginClient() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <LoginForm />
    </Box>
  )
}

