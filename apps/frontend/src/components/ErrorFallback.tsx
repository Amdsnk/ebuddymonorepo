"use client"

import { Button, Container, Typography, Paper, Box } from "@mui/material"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 3, color: "error.main", fontSize: "3rem" }}>⚠️</Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We're sorry, but an error occurred while rendering this page.
        </Typography>
        <Paper
          sx={{
            p: 2,
            mb: 4,
            bgcolor: "error.light",
            color: "error.dark",
            borderRadius: 1,
            maxWidth: "100%",
            overflow: "auto",
            textAlign: "left",
          }}
        >
          <Typography variant="body2" component="pre" sx={{ fontFamily: "monospace" }}>
            {error.message}
          </Typography>
        </Paper>
        <Button variant="contained" color="primary" onClick={resetErrorBoundary} sx={{ textTransform: "none", px: 4 }}>
          Try again
        </Button>
      </Paper>
    </Container>
  )
}

