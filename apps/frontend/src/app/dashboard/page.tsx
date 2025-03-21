"use client"

import { ErrorBoundary } from "react-error-boundary"
import DashboardClient from "./dashboard-client"
import ErrorFallback from "@/components/ErrorFallback"
import { analytics } from "@/lib/analytics"

export default function DashboardPage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        // Log error to analytics
        analytics.trackEvent("error", {
          context: "dashboard",
          message: error.message,
        })
      }}
    >
      <DashboardClient />
    </ErrorBoundary>
  )
}

