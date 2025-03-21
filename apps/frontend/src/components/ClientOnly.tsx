"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "@/store"

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder during SSR
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return <Provider store={store}>{children}</Provider>
}

