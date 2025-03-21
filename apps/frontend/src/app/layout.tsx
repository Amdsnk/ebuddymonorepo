import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AnalyticsInitializer } from "@/components/AnalyticsInitializer"

const inter = Inter({ subsets: ["latin"] })

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
        <AnalyticsInitializer />
        {children}
      </body>
    </html>
  )
}
