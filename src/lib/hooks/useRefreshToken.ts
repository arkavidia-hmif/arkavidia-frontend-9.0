'use client'

import { useSession } from 'next-auth/react'
import { axiosInstance } from '../axios'
import { refresh, self } from '~/api/generated'

export const useRefreshToken = () => {
  const { data: session, update } = useSession()

  const refreshToken = async () => {
    const res = await refresh({
      client: axiosInstance,
      query: { token: session?.user.refreshToken ?? '' }
    })

    if (session && res.data) {
      await update({
        user: {
          ...session.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken
        }
      })

      return res.data.accessToken
    }
  }

  return refreshToken
}
