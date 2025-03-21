"use client"

import type { User } from "@ebuddy/shared"
import { Card, CardContent, Typography, Box, Divider, Chip, Avatar } from "@mui/material"

interface UserCardProps {
  user: User | null
}

export default function UserCard({ user }: UserCardProps) {
  if (!user) {
    return null
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <Card sx={{ maxWidth: 400, width: "100%", mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={user.photoURL || undefined}
            alt={user.displayName || "User"}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h5" component="div">
              {user.displayName || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Rating
          </Typography>
          <Typography variant="h6">{user.totalAverageWeightRatings.toFixed(1)} / 5.0</Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Number of Rents
          </Typography>
          <Typography variant="h6">{user.numberOfRents}</Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Last Active
          </Typography>
          <Typography variant="h6">{formatDate(user.recentlyActive)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Chip label={`Created: ${formatDate(user.createdAt)}`} size="small" variant="outlined" />
          <Chip label={`Updated: ${formatDate(user.updatedAt)}`} size="small" variant="outlined" />
        </Box>
      </CardContent>
    </Card>
  )
}

