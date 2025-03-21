import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeRegistry } from "@/theme/ThemeRegistry"
import { Providers } from "@/store/provider"
import ErrorBoundary from "@/components/ErrorBoundary"

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
        <ErrorBoundary>
          <ThemeRegistry>
            <Providers>{children}</Providers>
          </ThemeRegistry>
        </ErrorBoundary>
      </body>
    </html>
  )
}

