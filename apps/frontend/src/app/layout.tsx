import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeRegistry } from "@/theme/ThemeRegistry"
import Script from "next/script"

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
        <ThemeRegistry>{children}</ThemeRegistry>
        {/* Add a script to detect client-side rendering */}
        <Script id="redux-provider-script" strategy="afterInteractive">
          {`
            // This script runs only on the client
            window.__REDUX_INITIALIZED__ = true;
          `}
        </Script>
      </body>
    </html>
  )
}

