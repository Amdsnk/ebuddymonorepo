"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analytics } from "@/utils/analytics"

// This component tracks user activity and page views
export default function ActivityTracker() {
  const pathname = usePathname()

  // Track page views
  useEffect(() => {
    if (pathname) {
      analytics.trackEvent("page_view", { path: pathname })
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}

