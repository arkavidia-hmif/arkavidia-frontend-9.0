import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-axios',
  input:  'http://localhost:3000/openapi.json',
  output: {
    format: 'prettier',
    path: 'src/api/generated',
    lint: 'eslint'
  }
})
