"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Snackbar, Alert, type AlertColor } from "@mui/material"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<AlertColor>("success")

  const showToast = (message: string, type: ToastType = "success") => {
    setMessage(message)
    setType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

