import { createClient, createConfig } from '@hey-api/client-axios'
import {
  RequestJWTInterceptor,
  onRequestJWTInterceptorError,
  onResponseFulfilledJWTInterceptor,
  onResponseRejectedJWTInterceptor
} from './interceptors'
import axios from 'axios'
import { cookies } from 'next/headers'

const tokenName = process.env.ACCESS_TOKEN_ID ?? 'accessToken'
const refreshTokenName = process.env.REFRESH_TOKEN_ID ?? 'refreshToken'

const axiosClient = createClient(
  createConfig({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' }
  })
)

/**
 *  Interceptor for Requests
 */

// JWT Interceptor for Requests
axiosClient.instance.interceptors.request.use(
  async config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// /**
//  *  Interceptor for Responses
//  */

// // JWT Interceptor for Responses
// axiosClient.instance.interceptors.response.use(
//   response => {
//     return onResponseFulfilledJWTInterceptor(response)
//   },
//   error => {
//     onResponseRejectedJWTInterceptor(error, tokenName, refreshTokenName)
//   }
// )

export default axiosClient
