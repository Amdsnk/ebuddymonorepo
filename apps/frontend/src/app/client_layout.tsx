"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { CustomThemeProvider } from "@/theme/CustomThemeProvider"
import { ToastProvider } from "@/components/ToastProvider"
import { ReactQueryProvider } from "@/lib/react-query"
import "./globals.css"

// Add this import
import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

const inter = Inter({ subsets: ["latin"] })

// Add this component
function AnalyticsInitializer() {
  useEffect(() => {
    analytics.init()
  }, [])

  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomThemeProvider>
          <ReactQueryProvider>
            <ToastProvider>
              <AnalyticsInitializer />
              {children}
            </ToastProvider>
          </ReactQueryProvider>
        </CustomThemeProvider>
      </body>
    </html>
  )
}

