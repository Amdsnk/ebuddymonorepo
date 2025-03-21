import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeRegistry } from "@/theme/ThemeRegistry"
import dynamic from "next/dynamic"

const inter = Inter({ subsets: ["latin"] })

// Dynamically import the Providers component with no SSR
const ClientProviders = dynamic(() => import("@/store/provider").then((mod) => mod.Providers), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "EBuddy App",
  description: "EBuddy Technical Test",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <ClientProviders>{children}</ClientProviders>
        </ThemeRegistry>
      </body>
    </html>
  )
}

