import type { User as SharedUser, UserUpdateData } from "@ebuddy/shared"

// Extend the shared User type to include potentialScore
export interface User extends SharedUser {
  potentialScore: number
}

export type { UserUpdateData }

