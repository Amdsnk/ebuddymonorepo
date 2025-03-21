"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  uid: string
  email: string
  displayName?: string
}

interface UserData {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  totalAverageWeightRatings: number
  numberOfRents: number
  recentlyActive: number
  createdAt: number
  updatedAt: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Create mock user data
      const mockUserData: UserData = {
        id: parsedUser.uid,
        email: parsedUser.email,
        displayName: parsedUser.displayName || parsedUser.email.split("@")[0],
        photoURL: null,
        totalAverageWeightRatings: 4.5,
        numberOfRents: 12,
        recentlyActive: Date.now() - 86400000, // 1 day ago
        createdAt: Date.now() - 30 * 86400000, // 30 days ago
        updatedAt: Date.now() - 5 * 86400000, // 5 days ago
      }

      setUserData(mockUserData)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      if (userData) {
        setUserData({
          ...userData,
          recentlyActive: Date.now(),
          updatedAt: Date.now(),
        })
      }
      setRefreshing(false)
    }, 1000)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">EBuddy Dashboard</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {userData.displayName}</h2>
            <p className="mt-1 text-sm text-gray-600">
              This is your dashboard where you can view and update your information.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                  {userData.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{userData.displayName}</h3>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  refreshing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {refreshing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  "Refresh Data"
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Rating</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">
                    {userData.totalAverageWeightRatings.toFixed(1)}
                  </span>
                  <div className="flex text-yellow-400">
                    {"★".repeat(Math.floor(userData.totalAverageWeightRatings))}
                    {"☆".repeat(5 - Math.floor(userData.totalAverageWeightRatings))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Number of Rents</div>
                <div className="text-2xl font-bold text-gray-900">{userData.numberOfRents}</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Last Active</div>
                <div className="text-2xl font-bold text-gray-900">{formatDate(userData.recentlyActive)}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Account Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-500">User ID</span>
                  <span className="block text-sm font-medium text-gray-900">{userData.id}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Email</span>
                  <span className="block text-sm font-medium text-gray-900">{userData.email}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Created</span>
                  <span className="block text-sm font-medium text-gray-900">{formatDate(userData.createdAt)}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Last Updated</span>
                  <span className="block text-sm font-medium text-gray-900">{formatDate(userData.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

