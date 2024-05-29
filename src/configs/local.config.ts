import { existsSync, mkdirSync } from "fs"
import { join } from "path"

const mainFolderName = "local_store"
const mainFolderPath = join(process.cwd(), mainFolderName)

export const isLocalFolderExist = async (): Promise<boolean> => {
  if (!existsSync(mainFolderPath)) {
    mkdirSync(mainFolderPath)
    console.log(`Folder '${mainFolderName}' created successfully.`)
  } else {
    console.log(`Folder '${mainFolderName}' already exists.`)
  }
  return true
}
