import dynamic from "next/dynamic"

// Import the login form with no SSR
const LoginForm = dynamic(() => import("@/components/organisms/LoginForm"), { ssr: false })

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <LoginForm />
    </div>
  )
}

