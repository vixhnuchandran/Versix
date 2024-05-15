import express, { Request, Response } from "express"
import { Store } from "../models"
import { StatusCodes as HTTP_CODE } from "http-status-codes"
const router = express.Router()

// Set Data
router.post("/set-data", async (req: Request, res: Response) => {
  const { id, name, data } = req.body
  if (id && data) {
    try {
      const existingRecord = await Store.findOne({
        where: {
          id,
          name,
        },
        order: [["createdAt", "DESC"]],
      })

      if (existingRecord) {
        const length = Object.keys(existingRecord.data).length
        await existingRecord.update({
          data: { ...existingRecord.data, [`v${length + 1}`]: data },
        })
      } else {
        await Store.create({ id, name, data: { ["v1"]: data } })
      }

      res.status(HTTP_CODE.OK).json({ message: "Data added successfully" })
    } catch (error) {
      console.error("Error adding data:", error)
      res
        .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while adding data" })
    }
  } else {
    res.status(HTTP_CODE.BAD_REQUEST).json({ message: "Incomplete fields" })
  }
})

// Get Data
router.post("/get-data", async (req: Request, res: Response) => {
  const { id, name, version } = req.body

  try {
    if (!id || !name) {
      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({ message: "Incomplete fields" })
    }

    const existingRecord = await Store.findOne({
      where: { id, name },
      order: [["createdAt", "DESC"]],
    })

    if (!existingRecord) {
      return res
        .status(HTTP_CODE.NOT_FOUND)
        .json({ message: "Record not found" })
    }

    const data = existingRecord.dataValues.data
    let dataToSend

    if (version) {
      const lowerCaseVersion = String(version).toLowerCase()
      if (!data[lowerCaseVersion]) {
        return res
          .status(HTTP_CODE.NOT_FOUND)
          .json({ message: `Version ${version} not found` })
      }
      dataToSend = data[lowerCaseVersion]
    } else {
      const latestVersion = Object.keys(data).sort().pop()
      dataToSend = data[latestVersion]
    }

    res.status(HTTP_CODE.OK).json(dataToSend)
  } catch (error) {
    console.error("Error retrieving data:", error)
    res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while retrieving data" })
  }
})

export default router
