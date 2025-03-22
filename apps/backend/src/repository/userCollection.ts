import { db } from "../config/firebaseConfig"
import type { User, UserUpdateData } from "../entities/user"

const USERS_REF = "USERS"
const USER_ACTIVITIES_REF = "USER_ACTIVITIES"

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const snapshot = await db.ref(`${USERS_REF}/${userId}`).get()

    if (!snapshot.exists()) {
      return null
    }

    const userData = snapshot.val()
    return { id: userId, ...userData } as User
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const getAllUsers = async (limit = 10, startAfter?: string): Promise<User[]> => {
  try {
    let query = db.ref(USERS_REF).orderByKey().limitToFirst(limit)

    if (startAfter) {
      query = query.startAfter(startAfter)
    }

    const snapshot = await query.get()

    if (!snapshot.exists()) {
      return []
    }

    const users: User[] = []
    snapshot.forEach((childSnapshot) => {
      const userId = childSnapshot.key
      const userData = childSnapshot.val()
      if (userId) {
        users.push({ id: userId, ...userData } as User)
      }
    })

    return users
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

    await db.ref(`${USERS_REF}/${userId}`).update(updateData)

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
      // Add a potentialScore field that will be calculated and stored
      potentialScore: 0,
    }

    // Calculate the initial potential score
    newUser.potentialScore = calculatePotentialScore(
      newUser.totalAverageWeightRatings,
      newUser.numberOfRents,
      newUser.recentlyActive,
    )

    await db.ref(`${USERS_REF}/${userId}`).set(newUser)

    return { id: userId, ...newUser }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Calculate potential score based on all three factors
export const calculatePotentialScore = (rating: number, rents: number, lastActive: number): number => {
  // Weights for each factor
  const ratingWeight = 0.6 // Highest priority
  const rentsWeight = 0.3 // Medium priority
  const activityWeight = 0.1 // Lowest priority

  // Normalize ratings (assuming ratings are between 0-5)
  const normalizedRating = rating / 5

  // Normalize number of rents (assuming 100 is a high number)
  const normalizedRents = Math.min(rents / 100, 1)

  // Normalize activity (more recent = higher score)
  // Convert to days ago (0 = today, higher = older)
  const daysAgo = (Date.now() - lastActive) / (1000 * 60 * 60 * 24)
  // Normalize to 0-1 (0 = 30+ days ago, 1 = today)
  const normalizedActivity = Math.max(0, 1 - daysAgo / 30)

  // Compute final score (0-1 scale)
  const score = normalizedRating * ratingWeight + normalizedRents * rentsWeight + normalizedActivity * activityWeight

  // Scale to 0-100 for better readability and to avoid floating point issues
  return Math.round(score * 10000) / 100
}

// Update potential scores for all users (can be run periodically)
export const updateAllPotentialScores = async (): Promise<void> => {
  try {
    const snapshot = await db.ref(USERS_REF).get()

    if (!snapshot.exists()) {
      console.log("No users found to update potential scores")
      return
    }

    const updates: Record<string, number> = {}

    snapshot.forEach((childSnapshot) => {
      const userId = childSnapshot.key
      const userData = childSnapshot.val()

      if (userId) {
        const potentialScore = calculatePotentialScore(
          userData.totalAverageWeightRatings || 0,
          userData.numberOfRents || 0,
          userData.recentlyActive || 0,
        )

        updates[`${USERS_REF}/${userId}/potentialScore`] = potentialScore
      }
    })

    await db.ref().update(updates)
    console.log(`Updated potential scores for ${Object.keys(updates).length} users`)
  } catch (error) {
    console.error("Error updating potential scores:", error)
    throw error
  }
}

// Efficient query for potential users with pagination
export const getPotentialUsers = async (limit = 10, lastScore?: number, lastId?: string): Promise<User[]> => {
  try {
    let query = db.ref(USERS_REF).orderByChild("potentialScore").limitToFirst(limit)

    // Apply cursor for pagination if provided
    if (lastScore !== undefined && lastId !== undefined) {
      // For Realtime Database, we need to use startAt with the value and key
      query = query.startAt(lastScore, lastId)
    }

    const snapshot = await query.get()

    if (!snapshot.exists()) {
      return []
    }

    const users: User[] = []
    snapshot.forEach((childSnapshot) => {
      const userId = childSnapshot.key
      const userData = childSnapshot.val()
      if (userId) {
        users.push({ id: userId, ...userData } as User)
      }
    })

    // Sort in descending order (since we're using potentialScore)
    return users.sort((a, b) => (b.potentialScore || 0) - (a.potentialScore || 0))
  } catch (error) {
    console.error("Error fetching potential users:", error)
    throw error
  }
}

// Function to update a user's potential score
export const updateUserPotentialScore = async (userId: string): Promise<void> => {
  try {
    const snapshot = await db.ref(`${USERS_REF}/${userId}`).get()

    if (!snapshot.exists()) {
      throw new Error(`User ${userId} not found`)
    }

    const userData = snapshot.val() || {}
    const potentialScore = calculatePotentialScore(
      userData.totalAverageWeightRatings || 0,
      userData.numberOfRents || 0,
      userData.recentlyActive || Date.now(),
    )

    await db.ref(`${USERS_REF}/${userId}/potentialScore`).set(potentialScore)
  } catch (error) {
    console.error(`Error updating potential score for user ${userId}:`, error)
    throw error
  }
}

// Function to record user activity and update recentlyActive
export const recordUserActivity = async (userId: string, activityType: string): Promise<void> => {
  try {
    const now = Date.now()

    // Update the user document
    await db.ref(`${USERS_REF}/${userId}`).update({
      recentlyActive: now,
      updatedAt: now,
    })

    // Optionally log the activity in a separate reference
    const newActivityRef = db.ref(USER_ACTIVITIES_REF).push()
    await newActivityRef.set({
      userId,
      activityType,
      timestamp: now,
    })

    // Update the potential score
    await updateUserPotentialScore(userId)

    console.log(`Recorded activity ${activityType} for user ${userId}`)
  } catch (error) {
    console.error(`Error recording activity for user ${userId}:`, error)
    throw error
  }
}

