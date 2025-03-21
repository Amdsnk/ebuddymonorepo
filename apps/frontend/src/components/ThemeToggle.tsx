"use client"
import { IconButton, Tooltip } from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"

interface ThemeToggleProps {
  onToggle: () => void
  isDarkMode: boolean
}

export default function ThemeToggle({ onToggle, isDarkMode }: ThemeToggleProps) {
  return (
    <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton onClick={onToggle} color="inherit" aria-label="toggle theme">
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  )
}

