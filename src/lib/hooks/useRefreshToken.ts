'use client'

import { useSession } from 'next-auth/react'
import { axiosInstance } from '../axios'
import { refresh, self } from '~/api/generated'

export const useRefreshToken = () => {
  const { data: session } = useSession()

  const refreshToken = async () => {
    const res = await refresh({
      client: axiosInstance,
      query: { token: session?.user.refreshToken ?? '' }
    })

    if (session && res.data) {
      session.user.accessToken = res.data.accessToken
      session.user.refreshToken = res.data.refreshToken
    }
  }

  return refreshToken
}
