"use client"

import { useState, useEffect } from "react"
import { IconButton, Tooltip, useTheme } from "@mui/material"

// Simple theme toggle that doesn't require additional icon dependencies
export default function ThemeToggle() {
  const theme = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
        {isDarkMode ? "☀️" : "🌙"}
      </IconButton>
    </Tooltip>
  )
}

