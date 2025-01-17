'use client'

import { authAxiosInstance } from '../axios'
import { useEffect } from 'react'
import { useAppSelector } from '~/redux/store'

const useAxiosAuth = () => {
  const accessToken = useAppSelector(state => state.auth.accessToken)

  useEffect(() => {
    const requestInterceptor = authAxiosInstance.instance.interceptors.request.use(
      async c => {
        // Success
        c.headers['Authorization'] = `Bearer ${accessToken}`
        return c
      },
      err => Promise.reject(err) // Error
    )

    const responseInterceptor = authAxiosInstance.instance.interceptors.response.use(
      res => res, // Success
      async err => {
        return Promise.reject(err)
      }
    )

    return () => {
      authAxiosInstance.instance.interceptors.request.eject(requestInterceptor)
      authAxiosInstance.instance.interceptors.response.eject(responseInterceptor)
    }
  }, [accessToken])

  return authAxiosInstance
}

export default useAxiosAuth
