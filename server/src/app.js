import { connectDB } from "./config/db.js"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"

import { searchFlights } from "./services/aviation.service.js"
import searchRoutes from "./routes/search.routes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// routes
app.use("/api/search", searchRoutes)

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "zentra-node" })
})

connectDB()


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
