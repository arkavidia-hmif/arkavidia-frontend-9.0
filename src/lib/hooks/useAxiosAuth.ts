'use client'

import { authAxiosInstance } from '../axios'
import { useEffect } from 'react'
import { useRefreshToken } from './useRefreshToken'
import { useAuth } from '~/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useToast } from '~/hooks/use-toast'

const useAxiosAuth = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { logout } = useAuth()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestInterceptor = authAxiosInstance.instance.interceptors.request.use(
      async c => {
        // Success
        return c
      },
      err => Promise.reject(err) // Error
    )

    const responseInterceptor = authAxiosInstance.instance.interceptors.response.use(
      res => res, // Success
      async err => {
        // Error
        const prevReq = err.config
        // If the request is a logout request, don't try to refresh the token
        if (prevReq && prevReq.headers['X-Logout-Request'] === 'true') {
          return Promise.reject(err)
        }
        // If the request was made and the server responded with a 401
        else if (err.response.status === 401 && prevReq && !prevReq._sent) {
          prevReq._sent = true
          const refresh = await refreshToken()
          if (!refresh) {
            logout()
            return Promise.reject(err)
          }
          return authAxiosInstance.instance(prevReq)
        }

        return Promise.reject(err)
      }
    )

    return () => {
      authAxiosInstance.instance.interceptors.request.eject(requestInterceptor)
      authAxiosInstance.instance.interceptors.response.eject(responseInterceptor)
    }
  }, [refreshToken])

  return authAxiosInstance
}

export default useAxiosAuth
