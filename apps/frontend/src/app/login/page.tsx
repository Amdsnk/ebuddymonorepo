import LoginForm from "@/components/organisms/LoginForm"
import { Box } from "@mui/material"

export default function LoginPage() {
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

