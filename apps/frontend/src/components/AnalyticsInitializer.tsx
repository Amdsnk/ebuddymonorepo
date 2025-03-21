"use client"

import { useEffect } from "react"
import { analytics } from "@/utils/analytics"

export function AnalyticsInitializer() {
  useEffect(() => {
    analytics.init()
  }, [])

  return null
}

