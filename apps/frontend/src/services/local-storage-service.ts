// A simple service that uses localStorage instead of Firebase
export const localStorageService = {
  // Authentication
  signIn: async (email: string, password: string) => {
    // Simple mock authentication
    if (email && password.length >= 6) {
      const user = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        photoURL: null,
      }

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", "mock-token")

      return user
    }
    throw new Error("Invalid credentials")
  },

  signOut: async () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  },

  // User data
  getUserData: async (userId?: string) => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) throw new Error("User not found")

    const user = JSON.parse(storedUser)

    // Get or create user data
    const userDataKey = `userData-${user.uid}`
    let userData = localStorage.getItem(userDataKey)

    if (!userData) {
      // Create initial user data
      userData = JSON.stringify({
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        totalAverageWeightRatings: 4.5,
        numberOfRents: 10,
        recentlyActive: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        potentialScore: 75.5,
      })
      localStorage.setItem(userDataKey, userData)
    }

    return JSON.parse(userData)
  },

  updateUserData: async (data: any, userId?: string) => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) throw new Error("User not found")

    const user = JSON.parse(storedUser)
    const userDataKey = `userData-${user.uid}`

    // Get existing data
    const existingData = localStorage.getItem(userDataKey)
    if (!existingData) throw new Error("User data not found")

    // Update data
    const userData = {
      ...JSON.parse(existingData),
      ...data,
      updatedAt: Date.now(),
      recentlyActive: Date.now(),
    }

    localStorage.setItem(userDataKey, JSON.stringify(userData))
    return userData
  },

  recordActivity: async (activityType: string) => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) throw new Error("User not found")

    const user = JSON.parse(storedUser)

    // Update user's recentlyActive timestamp
    const userDataKey = `userData-${user.uid}`
    const existingData = localStorage.getItem(userDataKey)

    if (existingData) {
      const userData = JSON.parse(existingData)
      userData.recentlyActive = Date.now()
      localStorage.setItem(userDataKey, JSON.stringify(userData))
    }

    // Record activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    activities.push({
      id: `activity-${Date.now()}`,
      userId: user.uid,
      activityType,
      timestamp: Date.now(),
    })

    localStorage.setItem("activities", JSON.stringify(activities))
  },
}

