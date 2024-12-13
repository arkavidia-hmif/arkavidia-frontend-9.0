'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import axiosClient from '~/api/axiosClient'

interface ApiContextProps {
  apiClient: typeof axiosClient
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined)

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [apiClient] = useState(axios)

  return <ApiContext.Provider value={{ apiClient }}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}
