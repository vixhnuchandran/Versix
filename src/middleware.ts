import { Request, Response, NextFunction } from "express"
import { StatusCodes as HTTP_CODE } from "http-status-codes"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

dotenv.config()

const keysFilePath = path.resolve(__dirname, "../", process.env.API_KEYS_FILE!)
let validApiKeys: string[] = []

try {
  const keysFileContent = fs.readFileSync(keysFilePath, "utf-8")

  validApiKeys = keysFileContent
    .split("\n")
    .map(key => key.trim())
    .filter(key => key.length > 0)
} catch (error) {
  console.error("Error reading API keys file:", error)
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"]

  if (typeof apiKey !== "string" || !validApiKeys.includes(apiKey)) {
    return res.status(HTTP_CODE.FORBIDDEN).json({ error: "Not authorized" })
  }

  next()
}
