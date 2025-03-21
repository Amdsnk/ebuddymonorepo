"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "./index"

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}

// Default export for dynamic import
export default { Providers }

