'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { client, getUser, self, User } from '~/api/generated'
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
  setUsername,
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
    window.localStorage.clear()
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
        const isAdmin = selfReq.data.role === 'admin'
        const userReq = await getUser({ client: authAxios })
        if (userReq.data) {
          const hasFilledInfo = userReq.data.isRegistrationComplete
          const username = userReq.data.fullName
          appDispatch(setFilledInfo(hasFilledInfo))

          if (username) {
            appDispatch(setUsername(username))
          }

          if (isAdmin) {
            appDispatch(setAdmin())
          }
        }
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
      const selfReq = await self({
        client: createAxiosAuthInstance(req.data.accessToken)
      })
      if (selfReq.data) {
        const hasFilledInfo = selfReq.data.isRegistrationComplete
        const isAdmin = selfReq.data.role === 'admin'
        const username = selfReq.data.fullName
        if (hasFilledInfo) {
          appDispatch(setFilledInfo(true))
        }

        if (username) {
          appDispatch(setUsername(username))
        }

        if (isAdmin) {
          appDispatch(setAdmin())
        }
        res.ok = true
        setTimeout(() => {
          if (!hasFilledInfo) {
            router.replace('/register/personal-data')
          } else {
            router.replace('/')
          }
        }, 500)
      }
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
