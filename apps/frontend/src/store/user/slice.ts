import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@ebuddy/shared"
import { fetchUserData, updateUserData } from "./thunks"

interface UserState {
  data: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch user data
    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || "Failed to fetch user data"
    })

    // Update user data
    builder.addCase(updateUserData.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateUserData.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || "Failed to update user data"
    })
  },
})

export const { clearUserData } = userSlice.actions
export default userSlice.reducer

