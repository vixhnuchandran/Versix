import express from "express"
import * as handlers from "../routes/handler"

const router = express.Router()

// Set Data
router.post("/set-data", handlers.setData)

// Get Data
router.post("/get-data", handlers.getData)

// Has Data
router.post("/has-data", handlers.hasData)

export default router
