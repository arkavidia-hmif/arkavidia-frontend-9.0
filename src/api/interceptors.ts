import axios, { InternalAxiosRequestConfig } from 'axios'
import { AxiosResponse } from 'axios'
import { useAuth } from '~/app/contexts/AuthContext'

export function RequestJWTInterceptor(config: InternalAxiosRequestConfig) {
  const { accessToken } = useAuth()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
    console.log('Request JWT Interceptor Token Available')
  } else {
    console.log('Request JWT Interceptor No Token')
  }

  return config
}

export function onRequestJWTInterceptorError(error: any) {
  console.log('Request JWT Interceptor Error')
  return Promise.reject(error)
}

export function onResponseFulfilledJWTInterceptor(response: AxiosResponse) {
  console.log('Respone Fulfilled JWT Interceptor')
  return response
}

export async function onResponseRejectedJWTInterceptor(
  error: Error,
  accessTokenName: string,
  refreshTokenName: string
) {
  if (axios.isAxiosError(error)) {
    console.log('Respone Rejected JWT Interceptor')
    const originalRequest = error.config

    // Token expired
    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log('Response Rejected Token Expired')

      // Refresh the token
      try {
        if (!refreshToken) {
          throw new Error('Invalid Refresh Token')
        }

        // // const newToken = await refreshAccessToken(refreshToken)
        // if (newToken.error) {
        //   throw new Error('Failed to get new access token')
        // }

        // if (!newToken.data.accessToken || !newToken.data.refreshToken) {
        //   throw new Error()
        // }

        // localStorage.setItem(accessTokenName, newToken.data.accessToken)
        // localStorage.setItem(refreshTokenName, newToken.data.refreshToken)
      } catch (error) {
        localStorage.removeItem(accessTokenName)
        localStorage.removeItem(refreshTokenName)
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
  }
}
