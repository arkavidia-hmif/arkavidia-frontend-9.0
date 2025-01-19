import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-axios',
  input: `https://api-staging.arkavidia.com/openapi.json`,
  output: {
    format: 'prettier',
    path: 'src/api/generated',
    lint: 'eslint'
  }
})
