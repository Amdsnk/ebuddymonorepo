import express from "express"
import cors from "cors"
import userRoutes from "../routes/userRoutes"

const app = express()

// Middleware
app.use(cors({ origin: true }))
app.use(express.json())

// Routes
app.use("/api", userRoutes)

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).send("OK")
})

export default app

