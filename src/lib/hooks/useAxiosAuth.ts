'use client'

import { signOut, useSession } from 'next-auth/react'
import { authAxiosInstance } from '../axios'
import { useEffect } from 'react'
import { useRefreshToken } from './useRefreshToken'
import { useRouter } from 'next/navigation'

const useAxiosAuth = () => {
  const { data: session, status } = useSession()
  const refreshToken = useRefreshToken()
  const router = useRouter()

  useEffect(() => {
    const requestInterceptor = authAxiosInstance.instance.interceptors.request.use(
      async c => {
        // Success
        if (!c.headers.Authorization) {
          c.headers.Authorization = session?.user.accessToken
            ? `Bearer ${session.user.accessToken}`
            : undefined
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

        console.log('Failed to refresh token')
        await signOut({ redirect: false })
        return Promise.reject(err)
      }
    )

    return () => {
      authAxiosInstance.instance.interceptors.request.eject(requestInterceptor)
      authAxiosInstance.instance.interceptors.response.eject(responseInterceptor)
    }
  }, [session, status, refreshToken])

  return authAxiosInstance
}

export default useAxiosAuth
