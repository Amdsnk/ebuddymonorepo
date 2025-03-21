import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client_layout"

export const metadata: Metadata = {
  title: "EBuddy App",
  description: "EBuddy Technical Test",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

