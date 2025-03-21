import { createAsyncThunk } from "@reduxjs/toolkit"
import type { User, UserUpdateData } from "@ebuddy/shared"
import * as userApi from "@/apis/userApi"

export const fetchUserData = createAsyncThunk<User, string | undefined>(
  "user/fetchUserData",
  async (userId, { rejectWithValue }) => {
    try {
      return await userApi.fetchUser(userId)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch user data")
    }
  },
)

export const updateUserData = createAsyncThunk<User, { data: UserUpdateData; userId?: string }>(
  "user/updateUserData",
  async ({ data, userId }, { rejectWithValue }) => {
    try {
      return await userApi.updateUser(data, userId)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update user data")
    }
  },
)

