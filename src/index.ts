import app from "./app"
import dotenv from "dotenv"
import { isLocalFolderExist } from "./configs/local.config"
import { isDatabaseConnected } from "./configs/sqlite.config"

dotenv.config()

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    const storeType = process.env.STORE_TYPE

    if (storeType === "file") {
      await isLocalFolderExist()
    } else if (storeType === "db") {
      await isDatabaseConnected()
    } else {
      throw new Error("Invalid STORE_TYPE environment variable")
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
