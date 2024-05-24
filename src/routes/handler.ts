import { Request, Response } from "express"
import { StatusCodes as HTTP_CODE } from "http-status-codes"
import { fileStore } from "../utils/fileStore"
import {
  validateGetDataReq,
  validateSetDataReq,
  GetDataRequest,
  SetDataRequest,
  ValidationResult,
} from "../validations"
import * as crypto from "crypto"

const fileStorage = new fileStore()

// Set Data
export const setData = async (req: Request, res: Response) => {
  const { id, name, data }: SetDataRequest = req.body

  const validationResult = validateSetDataReq({ id, name, data })

  if (!validationResult.isValid) {
    console.error(validationResult.message)
    return res
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ error: validationResult.message })
  }

  const hashedId = crypto.createHash("md5").update(id).digest("hex")

  try {
    const version = await fileStorage.saveData(hashedId, name, data)
    console.log(`Data saved successfully with version ${version}.`)
    return res.status(HTTP_CODE.OK).json({ version })
  } catch (error) {
    console.error("Error saving data:", error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
  }
}

// Get Data
export const getData = async (req: Request, res: Response) => {
  const { id, name, version }: GetDataRequest = req.body

  const validationResult: ValidationResult = validateGetDataReq({
    id,
    name,
    version,
  })

  if (!validationResult.isValid) {
    console.error(validationResult.message)
    return res
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ error: validationResult.message })
  }

  const hashedId = crypto.createHash("md5").update(id).digest("hex")

  try {
    const data = await fileStorage.getData(hashedId, name, version)
    console.log("Data retrieved successfully.")
    return res.status(HTTP_CODE.OK).json(data)
  } catch (error) {
    console.error("Error retrieving data:", error.message)
    return res.status(HTTP_CODE.NOT_FOUND).json({ error: "Not Found" })
  }
}

// Has Data
export const hasData = async (req: Request, res: Response) => {
  const { id, name } = req.body

  const validationResult: ValidationResult = validateGetDataReq({ id, name })

  if (!validationResult.isValid) {
    console.error(validationResult.message)
    return res
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ error: validationResult.message })
  }

  const hashedId = crypto.createHash("md5").update(id).digest("hex")

  try {
    const hasData = await fileStorage.hasData(hashedId, name)
    console.log("Check for data completed.")
    return res.status(HTTP_CODE.OK).json({ data: hasData })
  } catch (error) {
    console.error("Error checking for data:", error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
  }
}
