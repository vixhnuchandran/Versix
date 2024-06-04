import express from "express"
import { Express, Request, Response, NextFunction } from "express"
import cors from "cors"
import router from "./routes"
import { authMiddleware } from "./middleware"
import setupSwagger from "./utils/swagger"
import { StatusCodes } from "http-status-codes"

const app: Express = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: "50mb" }))

app.use((req: Request, res: Response, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`)
  next()
})

app.get("/", (req: Request, res: Response) => {
  return res.sendStatus(StatusCodes.OK)
})
app.use("/api/store", authMiddleware, router)
setupSwagger(app)

export default app
