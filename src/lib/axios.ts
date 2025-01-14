import axios from 'axios'
import { createClient, createConfig } from '@hey-api/client-axios'

const axiosInstance = createClient(
  createConfig({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  })
)

const authAxiosInstance = createClient(
  createConfig({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  })
)

export { axiosInstance, authAxiosInstance }
