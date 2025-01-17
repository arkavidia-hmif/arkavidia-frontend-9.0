'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { client, self, User } from '~/api/generated'
import { createAxiosAuthInstance } from '~/lib/axios'
import { basicLogin as login, logout as reqLogout } from '~/api/generated'
import { authAxiosInstance, axiosInstance } from '~/lib/axios'
import { useRouter } from 'next/navigation'
import { AuthContextProps, basicLoginResponse } from './AuthContextTypes'
import { useAppDispatch, useAppSelector, StoreType } from '~/redux/store'
import { useToast } from '~/hooks/use-toast'
import {
  setAdmin,
  setFilledInfo,
  setNotAdmin,
  userLogin,
  userLogout
} from '~/redux/slices/auth'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useStore } from 'react-redux'

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken, isAdmin, isLoggedIn } = useAppSelector(state => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  const authAxios = useAxiosAuth()
  const { toast } = useToast()
  const router = useRouter()
  const appDispatch = useAppDispatch()

  const logout = async () => {
    appDispatch(userLogout())
    appDispatch(setNotAdmin())
    localStorage.clear()
  }

  const getSelf = async () => {
    const selfReq = await self({ client: authAxios })
    return selfReq
  }

  const sessionCheck = async () => {
    if (accessToken) {
      const selfReq = await getSelf()
      if (selfReq.error || selfReq.status === 401) {
        await logout()
        toast({
          title: 'Session Expired',
          description: 'Please login again',
          variant: 'info'
        })
      }

      if (selfReq.data) {
        // // Logic to get user personal info status
        // const hasFilledInfo = selfReq.data.hasFilledInfo
        // if (!hasFilledInfo) {
        //   router.replace('/register/personal-data')
        // } else {
        //   appDispatch(setFilledInfo(true))
        // }
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    sessionCheck()
  }, [])

  const basicLogin = async (email: string, password: string) => {
    const req = await login({
      client: axiosInstance,
      body: { email: email, password }
    })

    const res: basicLoginResponse = {
      ok: false,
      error: false,
      message: ''
    }

    if (!req.data) {
      res.error = true
      // @ts-expect-error
      res.message = req.error?.message
      return res
    }

    if (req.data) {
      appDispatch(userLogin(req.data.accessToken))
      res.ok = true
      setTimeout(() => {
        router.replace('/')
      }, 500)
    }

    return res
  }

  return (
    <AuthContext.Provider
      value={{
        logout,
        basicLogin
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
