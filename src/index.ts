import app from "./app"
import dotenv from "dotenv"
import { isLocalFolderExist } from "./configs/local.config"

dotenv.config()

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await isLocalFolderExist()

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
