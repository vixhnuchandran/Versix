import express from "express"
import multer from "multer"
import * as handlers from "../routes/handler"

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
})

// Set Data
/**
 * @swagger
 * /set-data:
 *   post:
 *     summary: Set data
 *     tags:
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dataset:
 *                 type: string
 *                 description: Name of the dataset
 *               id:
 *                 type: string
 *                 description: ID for the data
 *               name:
 *                 type: string
 *                 description: Name of the data
 *               replace:
 *                 type: boolean
 *                 description: Whether to replace existing data
 *               data:
 *                 type: string
 *                 format: binary
 *                 description: Data file
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataset:
 *                 type: string
 *                 description: Name of the dataset
 *               id:
 *                 type: string
 *                 description: ID for the data
 *               name:
 *                 type: string
 *                 description: Name of the data
 *               replace:
 *                 type: boolean
 *                 description: Whether to replace existing data
 *               data:
 *                 type: string
 *                 description: Data in JSON format
 *     responses:
 *       '200':
 *         description: Data saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: integer
 *                   description: Version of the data
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post("/set-data", upload.single("data"), handlers.setData)

// Get Data
/**
 * @swagger
 * /get-data:
 *   post:
 *     summary: Get data
 *     tags:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataset:
 *                 type: string
 *                 description: Name of the dataset
 *               id:
 *                 type: string
 *                 description: ID for the data
 *               name:
 *                 type: string
 *                 description: Name of the data
 *               version:
 *                 type: integer
 *                 description: Version of the data
 *                 required: false
 *     responses:
 *       '302':
 *         description: Redirect to the requested data
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '404':
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post("/get-data", handlers.getData)

// Has Data
/**
 * @swagger
 * /has-data:
 *   post:
 *     summary: Check if data exists
 *     tags:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataset:
 *                 type: string
 *                 description: Name of the dataset
 *               id:
 *                 type: string
 *                 description: ID for the data
 *               name:
 *                 type: string
 *                 description: Name of the data
 *     responses:
 *       '200':
 *         description: Check for data completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                   description: Indicates whether the data exists
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post("/has-data", handlers.hasData)

export default router
