'use client'

import { createContext, ReactNode, SetStateAction, useContext, useState } from 'react'
import * as api from '~/api/generated/types.gen'
import { useApi } from './ApiContext'

type AuthContextType = {
  user: object | null
  isAuthenticated: boolean
  accessToken: string | null
  setAccessToken: React.Dispatch<SetStateAction<string | null>>
  setUser: React.Dispatch<SetStateAction<api.User | null>>
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>
  basicLogin: (email: string, password: string) => Promise<api.BasicLoginError | void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<api.User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const { apiClient } = useApi()

  const basicLogin = async (email: string, password: string) => {
    const loginResponse = await apiClient.basicLogin({
      body: {
        email,
        password
      }
    })

    if (loginResponse.error) {
      return loginResponse.error
    }

    if (loginResponse.data) {
      setAccessToken(loginResponse.data.accessToken)
      setIsAuthenticated(true)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        user,
        setAccessToken,
        setIsAuthenticated,
        setUser,
        basicLogin
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
