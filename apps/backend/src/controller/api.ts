import type { NextApiResponse } from "next"
import type { AuthRequest } from "../middleware/authMiddleware"
import { getUserById, getAllUsers, updateUser, getPotentialUsers } from "../repository/userCollection"
import type { UserUpdateData } from "../entities/user"

export const fetchUserData = async (req: AuthRequest, res: NextApiResponse) => {
  try {
    // In Next.js API routes, params are in query for GET requests
    const userId = (req.query.userId as string) || req.user?.uid

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" })
    }

    const user = await getUserById(userId)

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export const fetchAllUsers = async (req: AuthRequest, res: NextApiResponse) => {
  try {
    const limit = Number.parseInt(req.query.limit as string) || 10
    const startAfter = req.query.startAfter as string

    const users = await getAllUsers(limit, startAfter)

    return res.status(200).json({ success: true, data: users })
  } catch (error) {
    console.error("Error fetching all users:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export const updateUserData = async (req: AuthRequest, res: NextApiResponse) => {
  try {
    const userId = (req.query.userId as string) || req.user?.uid

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" })
    }

    const userData: UserUpdateData = req.body

    // Always update recentlyActive when user data is updated
    userData.recentlyActive = Date.now()

    const updatedUser = await updateUser(userId, userData)

    return res.status(200).json({ success: true, data: updatedUser })
  } catch (error) {
    console.error("Error updating user data:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export const fetchPotentialUsers = async (req: AuthRequest, res: NextApiResponse) => {
  try {
    const limit = Number.parseInt(req.query.limit as string) || 10
    const lastScore = req.query.lastScore ? Number.parseFloat(req.query.lastScore as string) : undefined
    const lastId = req.query.lastId as string | undefined

    const users = await getPotentialUsers(limit, lastScore, lastId)

    return res.status(200).json({ success: true, data: users })
  } catch (error) {
    console.error("Error fetching potential users:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}
