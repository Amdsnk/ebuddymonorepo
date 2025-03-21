import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, we would check for authentication server-side
  // For this demo, we'll redirect to login
  redirect("/login")

  return null
}

