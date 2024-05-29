import express from "express"
import multer from "multer"
import * as handlers from "../routes/handler"

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
})

// Set Data
router.post("/set-data", upload.single("data"), handlers.setData)

// Get Data
router.post("/get-data", handlers.getData)

// Has Data
router.post("/has-data", handlers.hasData)

export default router
