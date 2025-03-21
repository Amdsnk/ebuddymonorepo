"use client"

import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { useMemo } from "react"

// Create a safe version of useDispatch that works during SSR
export const useAppDispatch = () => {
  const dispatch = useDispatch<AppDispatch>()
  // Memoize the dispatch function to avoid unnecessary re-renders
  const memoizedDispatch = useMemo(() => {
    // Check if we're running on the server
    if (typeof window === "undefined") {
      // Return a dummy dispatch function for SSR
      return (() => Promise.resolve()) as unknown as AppDispatch
    }
    return dispatch
  }, [dispatch])

  return memoizedDispatch
}

// Create a safe version of useSelector that works during SSR
export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) => {
  // Check if we're running on the server
  if (typeof window === "undefined") {
    // Return a default empty state for SSR
    return {} as ReturnType<typeof selector>
  }
  return useSelector(selector)
}

