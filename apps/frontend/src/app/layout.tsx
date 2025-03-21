import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeRegistry } from "@/theme/ThemeRegistry"
import { Providers } from "@/store/provider"

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
        <ThemeRegistry>
          {/* The Provider will only be used on the client */}
          <Providers>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  )
}

