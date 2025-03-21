"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import ErrorFallback from "./ErrorFallback"
import { analytics } from "@/utils/analytics"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)

    // Track error in analytics
    analytics.trackEvent("error", {
      context: "error_boundary",
      message: error.message,
    })
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error as Error} resetErrorBoundary={this.resetErrorBoundary} />
    }

    return this.props.children
  }
}

export default ErrorBoundary

