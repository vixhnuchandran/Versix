import { Client, createClient } from "@libsql/client"
import dotenv from "dotenv"

dotenv.config()

const databaseUrl = process.env.TURSO_DATABASE_URL!
const authToken = process.env.TURSO_AUTH_TOKEN!
const localDatabaseUrl = process.env.LOCAL_DATABASE_URL!

if (!localDatabaseUrl) {
  throw new Error("Environment variable LOCAL_DATABASE_URL is missing.")
}
if (!databaseUrl) {
  throw new Error("Environment variable TURSO_DATABASE_URL is missing.")
}

if (!authToken) {
  throw new Error("Environment variable TURSO_AUTH_TOKEN is missing.")
}

const client: Client = createClient({
  url: localDatabaseUrl,
  syncUrl: databaseUrl,
  authToken: authToken,
})

async function isDatabaseConnected(): Promise<boolean> {
  try {
    await client.sync()

    await client.execute("SELECT 1")
    console.log("Connected to the SQLite database.")

    const storeTableExists = await checkTableExists("store")

    if (storeTableExists) {
      console.log('The "store" table already exists.')
    } else {
      await client.sync()

      await client.execute(`
        CREATE TABLE store (
          store_id INTEGER PRIMARY KEY AUTOINCREMENT,
          dataset TEXT NOT NULL,
          id TEXT NOT NULL,
          name TEXT NOT NULL,
          data TEXT NOT NULL
        )
      `)
      console.log('Created the "store" table.')
    }

    return true
  } catch (error: any) {
    console.error("Error connecting to the SQLite database:", error.message)
    return false
  }
}

async function checkTableExists(tableName: string): Promise<boolean> {
  const result = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    args: [tableName],
  })
  return result.rows.length > 0
}

export { client, isDatabaseConnected }
