'use client'

import { axiosInstance } from '../axios'
import { refresh } from '~/api/generated'
import { useRouter } from 'next/navigation'
import { useAuth } from '~/app/contexts/AuthContext'

export const useRefreshToken = () => {
  const { getRefreshToken, setRefreshToken, setIsAuth } = useAuth()
  const router = useRouter()

  const refreshToken = async () => {
    const refToken = getRefreshToken()
    if (!refToken) {
      return null
    }

    const tokens = await refresh({
      client: axiosInstance,
      query: { token: refToken ?? '' }
    })

    if (tokens.data?.refreshToken) {
      setRefreshToken(tokens.data.refreshToken)
      setIsAuth(true)
    }

    return tokens.data?.refreshToken ?? null
  }

  return refreshToken
}
