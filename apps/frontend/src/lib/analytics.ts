// Simple analytics wrapper
// In a real app, you would integrate with a service like Google Analytics, Mixpanel, etc.

type EventName = "page_view" | "login" | "logout" | "refresh_data" | "error"

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

class Analytics {
  private enabled = false

  constructor() {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      this.enabled = true
    }
  }

  // Initialize analytics
  init() {
    if (!this.enabled) return
    console.log("Analytics initialized")

    // Track initial page view
    this.trackPageView()
  }

  // Track page views
  trackPageView(path?: string) {
    if (!this.enabled) return

    const currentPath = path || window.location.pathname
    console.log(`Analytics: Page view - ${currentPath}`)

    // In a real implementation, you would send this to your analytics service
    this.trackEvent("page_view", { path: currentPath })
  }

  // Track events
  trackEvent(name: EventName, properties?: EventProperties) {
    if (!this.enabled) return

    console.log(`Analytics: Event - ${name}`, properties)

    // In a real implementation, you would send this to your analytics service
  }
}

export const analytics = new Analytics()

