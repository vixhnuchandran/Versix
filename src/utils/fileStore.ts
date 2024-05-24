import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs"
import { join } from "path"

export class fileStore {
  async saveData(hashedId: string, name: string, data: any): Promise<number> {
    const folderPath = join(process.cwd(), "local_store", hashedId, name)
    try {
      mkdirSync(folderPath, { recursive: true })
      console.log(`Folder '${name}' created successfully.`)
    } catch (error) {
      console.error(`Error creating folder '${name}':`, error)
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
    }

    const filePath = join(folderPath, fileName)

    try {
      writeFileSync(filePath, JSON.stringify(data, null, 2))
      console.log(`Data saved to '${fileName}' successfully.`)
    } catch (error) {
      console.error(`Error writing file '${fileName}':`, error)
    }
    return version
  }

  async getData(
    hashedId: string,
    name: string,
    version?: number
  ): Promise<any> {
    const folderPath = join(process.cwd(), "local_store", hashedId, name)

    if (!existsSync(folderPath)) {
      throw new Error("Folder not found.")
    }

    const files = readdirSync(folderPath).filter(file => file.endsWith(".json"))
    if (files.length === 0) {
      throw new Error("No data files found.")
    }

    let fileName: string
    if (version) {
      fileName = `${version}.json`
      if (!files.includes(fileName)) {
        throw new Error(`Version ${version} not found.`)
      }
    } else {
      const latestVersion = Math.max(
        ...files.map(file => parseInt(file.split(".json")[0], 10))
      )
      fileName = `${latestVersion}.json`
    }

    const filePath = join(folderPath, fileName)
    const fileData = readFileSync(filePath, "utf8")
    return JSON.parse(fileData)
  }

  async hasData(hashedId: string, name: string): Promise<boolean> {
    const folderPath = join(process.cwd(), "local_store", hashedId, name)
    if (!existsSync(folderPath)) {
      return false
    }

    const files = readdirSync(folderPath)
    return files.length > 0
  }
}
