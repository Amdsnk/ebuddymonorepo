export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  totalAverageWeightRatings: number
  numberOfRents: number
  recentlyActive: number // Epoch time
  createdAt: number // Epoch time
  updatedAt: number // Epoch time
}

export interface UserUpdateData {
  displayName?: string
  photoURL?: string
  totalAverageWeightRatings?: number
  numberOfRents?: number
  recentlyActive?: number
}

export interface UserResponse {
  success: boolean
  data?: User | User[]
  error?: string
}
