import axios from 'axios'
import { createClient, createConfig } from '@hey-api/client-axios'

const axiosInstance = createClient(
  createConfig({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    headers: { 'Content-Type': 'application/json' }
  })
)

const authAxiosInstance = createClient(
  createConfig({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    headers: { 'Content-Type': 'application/json' }
  })
)

export { axiosInstance, authAxiosInstance }
