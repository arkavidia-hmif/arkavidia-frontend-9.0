import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sdkFilePath = __dirname + '/generated/sdk.gen.ts'

const functionRegex = /export\s+const\s+(\w+)\s*=\s*<([^>]*)>\s*\(([^)]*)\)\s*=>/g

let fileContent = fs.readFileSync(sdkFilePath, 'utf8')

const lines = fileContent.split('\n')

lines[1] = 'import axiosClient from "../axiosClient"'
fileContent = lines.join('\n')

fs.writeFileSync(sdkFilePath, fileContent, 'utf8')
