"use client"

import { useState } from "react"
import { Box } from "@mui/material"

export default function SkipLink() {
  const [focused, setFocused] = useState(false)

  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        position: "absolute",
        top: focused ? "5px" : "-9999px",
        left: focused ? "5px" : "-9999px",
        zIndex: 9999,
        padding: "10px",
        backgroundColor: "background.paper",
        color: "primary.main",
        textDecoration: "none",
        fontWeight: "bold",
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: "4px",
        "&:focus": {
          outline: "none",
        },
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      Skip to main content
    </Box>
  )
}
