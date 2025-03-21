import ErrorBoundary from "@/components/ErrorBoundary"
import DashboardClient from "./dashboard-client"

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardClient />
    </ErrorBoundary>
  )
}

