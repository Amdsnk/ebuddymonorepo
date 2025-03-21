import { Router } from "express"
import { fetchUserData, updateUserData, fetchAllUsers, fetchPotentialUsers } from "../controller/api"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

// Protected routes (require authentication)
router.get("/user/:userId?", authMiddleware, fetchUserData)
router.put("/user/:userId?", authMiddleware, updateUserData)
router.get("/users", authMiddleware, fetchAllUsers)
router.get("/users/potential", authMiddleware, fetchPotentialUsers)

export default router

