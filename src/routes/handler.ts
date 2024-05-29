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
import dotenv from "dotenv"
import { dbStore } from "../utils/dbStore"
import { client } from "../configs/sqlite.config"

dotenv.config()

let storage: fileStore | dbStore
const storeType = process.env.STORE_TYPE

if (!storeType) {
  throw new Error("STORE_TYPE is not defined in environment variables")
}

switch (storeType) {
  case "file":
    storage = new fileStore()
    break
  case "db":
    storage = new dbStore(client)
    break
  default:
    throw new Error(`Invalid STORE_TYPE: ${storeType}`)
}

// Set Data
export const setData = async (req: Request, res: Response) => {
  const { dataset, id, name }: SetDataRequest = req.body
  let data: any

  if (req.file) {
    data = req.file
  } else {
    data = req.body.data
  }
  const validationResult = validateSetDataReq({ dataset, id, name, data })

  if (!validationResult.isValid) {
    console.error(validationResult.message)
    return res
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ error: validationResult.message })
  }

  const hashedId = crypto.createHash("md5").update(id).digest("hex")

  try {
    const version = await storage.saveData(dataset, hashedId, name, data)
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
  const { dataset, id, name, version }: GetDataRequest = req.body

  const validationResult: ValidationResult = validateGetDataReq({
    dataset,
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
    const data = await storage.getData(dataset, hashedId, name, version)
    console.log("Data retrieved successfully.")
    return res.status(HTTP_CODE.OK).json(data)
  } catch (error) {
    console.error("Error retrieving data:", error.message)
    return res.status(HTTP_CODE.NOT_FOUND).json({ error: "Not Found" })
  }
}

// Has Data
export const hasData = async (req: Request, res: Response) => {
  const { dataset, id, name } = req.body

  const validationResult: ValidationResult = validateGetDataReq({
    dataset,
    id,
    name,
  })

  if (!validationResult.isValid) {
    console.error(validationResult.message)
    return res
      .status(HTTP_CODE.BAD_REQUEST)
      .json({ error: validationResult.message })
  }

  const hashedId = crypto.createHash("md5").update(id).digest("hex")

  try {
    const hasData = await storage.hasData(dataset, hashedId, name)
    console.log("Check for data completed.")
    return res.status(HTTP_CODE.OK).json({ data: hasData })
  } catch (error) {
    console.error("Error checking for data:", error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
  }
}
