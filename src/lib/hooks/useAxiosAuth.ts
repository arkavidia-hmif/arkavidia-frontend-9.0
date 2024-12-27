'use client'

import { signOut, useSession } from 'next-auth/react'
import { authAxiosInstance } from '../axios'
import { useEffect } from 'react'
import { useRefreshToken } from './useRefreshToken'

const useAxiosAuth = () => {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestInterceptor = authAxiosInstance.instance.interceptors.request.use(
      c => {
        // Success
        if (!c.headers.Authorization) {
          c.headers.Authorization = `Bearer ${session?.user.accessToken}`
        }

        return c
      },
      err => Promise.reject(err) // Error
    )

    const responseInterceptor = authAxiosInstance.instance.interceptors.response.use(
      res => res, // Success
      async err => {
        // Error
        const prevReq = err.config

        // If the request was made and the server responded with a 401
        if (err.response.status === 401 && prevReq && !prevReq._sent) {
          prevReq._sent = true
          const newAcc = await refreshToken()
          prevReq.headers['Authorization'] = `Bearer ${newAcc}`
          return authAxiosInstance.instance(prevReq)
        }

        // Failed to refresh token
        console.log('Failed to refresh token')
        await signOut()
        return Promise.reject(err)
      }
    )

    return () => {
      authAxiosInstance.instance.interceptors.request.eject(requestInterceptor)
      authAxiosInstance.instance.interceptors.response.eject(responseInterceptor)
    }
  }, [session])

  return authAxiosInstance
}

export default useAxiosAuth
