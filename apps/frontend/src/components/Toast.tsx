"use client"
import { Snackbar, Alert } from "@mui/material"

type ToastProps = {
  message: string
  type?: "success" | "error" | "warning" | "info"
  open: boolean
  onClose: () => void
}

export default function Toast({ message, type = "success", open, onClose }: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

