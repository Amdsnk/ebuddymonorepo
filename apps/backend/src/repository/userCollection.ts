import { db } from "../config/firebaseConfig"
import type { User, UserUpdateData } from "../entities/user"

const USERS_COLLECTION = "USERS"

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get()

    if (!userDoc.exists) {
      return null
    }

    return { id: userDoc.id, ...userDoc.data() } as User
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const getAllUsers = async (limit = 10, startAfter?: string): Promise<User[]> => {
  try {
    let query = db.collection(USERS_COLLECTION).limit(limit)

    if (startAfter) {
      const startAfterDoc = await db.collection(USERS_COLLECTION).doc(startAfter).get()
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc)
      }
    }

    const snapshot = await query.get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User)
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const updateUser = async (userId: string, userData: UserUpdateData): Promise<User> => {
  try {
    const updateData = {
      ...userData,
      updatedAt: Date.now(),
      // Always update recentlyActive when user data is updated
      recentlyActive: Date.now(),
    }

    await db.collection(USERS_COLLECTION).doc(userId).update(updateData)

    const updatedUser = await getUserById(userId)
    if (!updatedUser) {
      throw new Error("User not found after update")
    }

    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const createUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const now = Date.now()
    const newUser: Omit<User, "id"> = {
      email: userData.email || "",
      displayName: userData.displayName || "",
      photoURL: userData.photoURL || "",
      totalAverageWeightRatings: userData.totalAverageWeightRatings || 0,
      numberOfRents: userData.numberOfRents || 0,
      recentlyActive: userData.recentlyActive || now,
      createdAt: now,
      updatedAt: now,
    }

    await db.collection(USERS_COLLECTION).doc(userId).set(newUser)

    return { id: userId, ...newUser }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// For the bonus query - compute potential score
export const getPotentialUsers = async (limit = 10, lastScore?: number, lastId?: string): Promise<User[]> => {
  try {
    // First, get all users and compute their scores
    const snapshot = await db.collection(USERS_COLLECTION).get()

    const users = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<User, "id">
      const user = { id: doc.id, ...data } as User

      // Compute potential score - this is a custom formula that combines all three factors
      // We normalize each factor and then combine them with appropriate weights
      const ratingWeight = 0.6 // Highest priority
      const rentsWeight = 0.3 // Medium priority
      const activityWeight = 0.1 // Lowest priority

      // Normalize ratings (assuming ratings are between 0-5)
      const normalizedRating = user.totalAverageWeightRatings / 5

      // Normalize number of rents (assuming 100 is a high number)
      const normalizedRents = Math.min(user.numberOfRents / 100, 1)

      // Normalize activity (more recent = higher score)
      // Convert to days ago (0 = today, higher = older)
      const daysAgo = (Date.now() - user.recentlyActive) / (1000 * 60 * 60 * 24)
      // Normalize to 0-1 (0 = 30+ days ago, 1 = today)
      const normalizedActivity = Math.max(0, 1 - daysAgo / 30)

      // Compute final score
      const potentialScore =
        normalizedRating * ratingWeight + normalizedRents * rentsWeight + normalizedActivity * activityWeight

      return { user, potentialScore }
    })

    // Sort by potential score
    users.sort((a, b) => {
      if (b.potentialScore !== a.potentialScore) {
        return b.potentialScore - a.potentialScore
      }
      // If scores are equal, sort by ID for consistent pagination
      return a.user.id.localeCompare(b.user.id)
    })

    // Apply pagination
    let startIndex = 0
    if (lastScore !== undefined && lastId !== undefined) {
      const lastIndex = users.findIndex((item) => item.potentialScore === lastScore && item.user.id === lastId)
      if (lastIndex !== -1) {
        startIndex = lastIndex + 1
      }
    }

    return users.slice(startIndex, startIndex + limit).map((item) => item.user)
  } catch (error) {
    console.error("Error fetching potential users:", error)
    throw error
  }
}

