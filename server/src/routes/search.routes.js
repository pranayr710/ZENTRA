import express from "express"
import { searchRoutes } from "../controllers/search.controller.js"

const router = express.Router()

router.post("/", searchRoutes)

export default router