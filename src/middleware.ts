import { Request, Response, NextFunction } from "express"
import { StatusCodes as HTTP_CODE } from "http-status-codes"

const validApiKeys = ["apikey1", "apikey2", "apikey3"]

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"]

  if (!apiKey || typeof apiKey !== "string" || !validApiKeys.includes(apiKey)) {
    return res.status(HTTP_CODE.FORBIDDEN).json({ error: "Not authorized" })
  }

  next()
}
