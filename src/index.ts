import app from "./app"
import dotenv from "dotenv"
import sequelize, { checkConnection } from "./configs/db.config"
import { Store } from "./models"

dotenv.config()

const PORT = process.env.PORT || 8484

const startServer = async () => {
  try {
    await checkConnection()

    sequelize
      .sync({ alter: true })
      .then(() => {
        console.log("Pipeline Database synchronized")
      })
      .catch(error => {
        console.error("Database synchronization failed:", error)
      })
    Store.sync({ alter: true })
      .then(() => {
        console.log("Store Table synchronized")
      })
      .catch(error => {
        console.error("Table synchronization failed:", error)
      })

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
