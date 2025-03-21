"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Star, Package, Calendar, RefreshCw, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [user, setUser] = useState<any | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

      // Fetch user data or create mock data
      fetchUserData(parsedUser.uid)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchUserData = async (userId: string) => {
    setRefreshing(true)
    setError(null)

    try {
      // Try to fetch from API first
      const token = localStorage.getItem("token")

      if (token) {
        try {
          const response = await fetch(`/api/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              setUserData(data.data)
              setRefreshing(false)
              return
            }
          }
        } catch (apiError) {
          console.error("API error:", apiError)
          // Fall back to mock data
        }
      }

      // Create mock user data as fallback
      const mockUserData: UserData = {
        id: userId,
        email: user?.email || "user@example.com",
        displayName: user?.displayName || user?.email?.split("@")[0] || "User",
        photoURL: user?.photoURL || null,
        totalAverageWeightRatings: 4.5,
        numberOfRents: 12,
        recentlyActive: Date.now() - 86400000, // 1 day ago
        createdAt: Date.now() - 30 * 86400000, // 30 days ago
        updatedAt: Date.now() - 5 * 86400000, // 5 days ago
      }

      setUserData(mockUserData)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Failed to load user data. Please try again.")
    } finally {
      setRefreshing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return null
  }

  // Calculate days since last active
  const daysSinceActive = Math.floor((Date.now() - userData.recentlyActive) / (1000 * 60 * 60 * 24))

  // Calculate activity score (0-100)
  const activityScore = Math.max(0, 100 - daysSinceActive * 5)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </a>
            </Button>
            <h1 className="text-xl font-semibold">EBuddy Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 md:py-10">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_250px]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>User Profile</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUserData(userData.id)}
                    disabled={refreshing}
                    className="h-8 gap-1"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                  </Button>
                </div>
                <CardDescription>View and manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage src={userData.photoURL || undefined} alt={userData.displayName || "User"} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials(userData.displayName || userData.email.split("@")[0])}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-2xl font-semibold">{userData.displayName || userData.email.split("@")[0]}</h3>
                      <p className="text-muted-foreground">{userData.email}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Star className="mr-1 h-4 w-4" />
                          <span>Rating</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl font-semibold mr-2">
                            {userData.totalAverageWeightRatings.toFixed(1)}
                          </span>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(userData.totalAverageWeightRatings) ? "fill-current" : "fill-none"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Package className="mr-1 h-4 w-4" />
                          <span>Rentals</span>
                        </div>
                        <p className="text-2xl font-semibold">{userData.numberOfRents}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>Last Active</span>
                        </div>
                        <p className="text-2xl font-semibold">{formatDate(userData.recentlyActive)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Your recent activity and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Activity Score</span>
                    <span className="text-sm font-medium">{activityScore}%</span>
                  </div>
                  <Progress value={activityScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {daysSinceActive === 0
                      ? "Active today"
                      : daysSinceActive === 1
                        ? "Last active yesterday"
                        : `Last active ${daysSinceActive} days ago`}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Rental History</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-3xl font-bold">{userData.numberOfRents}</div>
                      <p className="text-xs text-muted-foreground">Total rentals completed</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Average Rating</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-3xl font-bold">{userData.totalAverageWeightRatings.toFixed(1)}</div>
                      <div className="flex text-amber-400 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(userData.totalAverageWeightRatings) ? "fill-current" : "fill-none"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-sm font-medium break-all">{userData.id}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{userData.email}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Account Created</p>
                  <p className="text-sm font-medium">{formatDate(userData.createdAt)}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">{formatDate(userData.updatedAt)}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="w-full justify-center py-1.5">
                  {userData.numberOfRents > 10 ? "Premium Member" : "Standard Member"}
                </Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  View Rentals
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Star className="mr-2 h-4 w-4" />
                  My Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

