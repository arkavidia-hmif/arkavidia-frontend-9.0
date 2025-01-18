import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-axios',
  input: `http://159.223.46.165:5000/openapi.json`,
  output: {
    format: 'prettier',
    path: 'src/api/generated',
    lint: 'eslint'
  }
})
