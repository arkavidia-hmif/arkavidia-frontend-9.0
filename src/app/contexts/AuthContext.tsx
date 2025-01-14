'use client'

import React, { createContext, useContext, useState } from 'react'
import { self, User } from '~/api/generated'
import { basicLogin as login, logout as reqLogout } from '~/api/generated'
import { authAxiosInstance, axiosInstance } from '~/lib/axios'
import { useRouter } from 'next/navigation'
import { AuthContextProps, basicLoginResponse } from './AuthContextTypes'

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const setIsAuth = (value: boolean) => {
    setIsAuthenticated(value)
  }

  const basicLogin = async (email: string, password: string) => {
    const req = await login({
      client: axiosInstance,
      body: { email: email, password }
    })

    const res: basicLoginResponse = {
      ok: false,
      error: false
    }

    if (!req.data) {
      res.error = true
      return res
    }

    if (req.data) {
      localStorage.setItem('ref_tkn', req.data.refreshToken)
      setIsAuthenticated(true)

      // Get User Data
      const userData = await self({ client: authAxiosInstance })
      setUser(userData.data ?? null)
      res.ok = true
      router.push('/')
    }

    return res
  }

  const logout = async () => {
    localStorage.removeItem('ref_tkn')
    setIsAuthenticated(false)
    await reqLogout({
      client: authAxiosInstance,
      headers: {
        'X-Logout-Request': 'true'
      }
    }) // Delete cookies
    router.replace('/login')
  }

  const getRefreshToken = () => {
    return localStorage.getItem('ref_tkn')
  }

  const setRefreshToken = (token: string) => {
    localStorage.setItem('ref_tkn', token)
  }

  const clearRefreshToken = () => {
    localStorage.removeItem('ref_tkn')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuth,
        basicLogin,
        logout,
        getRefreshToken,
        setRefreshToken,
        clearRefreshToken
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
