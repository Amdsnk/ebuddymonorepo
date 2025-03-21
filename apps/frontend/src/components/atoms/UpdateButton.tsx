"use client"

import { Button, type ButtonProps } from "@mui/material"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchUserData } from "@/store/user/thunks"

interface UpdateButtonProps extends ButtonProps {
  userId?: string
}

export default function UpdateButton({ userId, ...props }: UpdateButtonProps) {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.user)

  const handleClick = useCallback(() => {
    dispatch(fetchUserData(userId))
  }, [dispatch, userId])

  return (
    <Button variant="contained" color="primary" onClick={handleClick} disabled={loading} {...props}>
      {loading ? "Loading..." : "Fetch User Data"}
    </Button>
  )
}

