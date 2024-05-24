import { Request, Response } from "express"
import { StatusCodes as HTTP_CODE } from "http-status-codes"
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs"
import { join } from "path"
import {
  validateGetDataReq,
  validateSetDataReq,
  GetDataRequest,
  SetDataRequest,
  ValidationResult,
} from "../validations"
import * as crypto from "crypto"

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

  const folderPath = join(process.cwd(), "local_store", hashedId, name)
  try {
    mkdirSync(folderPath, { recursive: true })
    console.log(`Folder '${name}' created successfully.`)
  } catch (error) {
    console.error(`Error creating folder '${name}':`, error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
  }

  let fileName: string
  let version: number
  try {
    const files = readdirSync(folderPath)
    if (files.length === 0) {
      fileName = "1.json"
      version = 1
    } else {
      const fileNumbers = files
        .map(file => parseInt(file.split(".json")[0], 10))
        .filter(Number.isInteger)
      version = Math.max(...fileNumbers) + 1
      fileName = `${version}.json`
    }
  } catch (error) {
    console.error(`Error reading directory '${folderPath}':`, error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
  }

  const filePath = join(folderPath, fileName)
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`Data saved to '${fileName}' successfully.`)
  } catch (error) {
    console.error(`Error writing file '${fileName}':`, error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
  }

  return res.status(HTTP_CODE.OK).json({ version })
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

  const folderPath = join(process.cwd(), "local_store", hashedId, name)

  if (!existsSync(folderPath)) {
    return res.status(HTTP_CODE.NOT_FOUND).json({ error: "Folder not found." })
  }

  let fileName: string

  try {
    const files = readdirSync(folderPath).filter(file => file.endsWith(".json"))
    if (files.length === 0) {
      return res
        .status(HTTP_CODE.NOT_FOUND)
        .json({ error: "No data files found." })
    }

    if (version) {
      fileName = `${version}.json`
      if (!files.includes(fileName)) {
        return res
          .status(HTTP_CODE.NOT_FOUND)
          .json({ error: `Version ${version} not found.` })
      }
    } else {
      const fileNumbers = files
        .map(file => parseInt(file.split(".json")[0], 10))
        .filter(Number.isInteger)
      const latestVersion = Math.max(...fileNumbers)
      fileName = `${latestVersion}.json`
    }
  } catch (error) {
    console.error(`Error reading directory '${folderPath}':`, error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
  }

  const filePath = join(folderPath, fileName)

  try {
    const fileData = readFileSync(filePath, "utf8")
    const parsedData = JSON.parse(fileData)
    return res.status(HTTP_CODE.OK).json(parsedData)
  } catch (error) {
    console.error(`Error reading file '${fileName}':`, error)
    return res
      .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "INTERNAL_SERVER_ERROR" })
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

  const folderPath = join(process.cwd(), "local_store", hashedId, name)

  if (existsSync(folderPath)) {
    try {
      const files = readdirSync(folderPath)
      if (files.length > 0) {
        return res.status(HTTP_CODE.OK).json({ data: true })
      } else {
        return res.status(HTTP_CODE.OK).json({ data: false })
      }
    } catch (error) {
      console.error(`Error reading directory '${folderPath}':`, error)
      return res
        .status(HTTP_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: "INTERNAL_SERVER_ERROR" })
    }
  } else {
    return res.status(HTTP_CODE.OK).json({ data: false })
  }
}
