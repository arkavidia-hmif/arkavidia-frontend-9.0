'use client'

import { useSession } from 'next-auth/react'
import { axiosInstance } from '../axios'
import { refresh } from '~/api/generated'
import { useRouter } from 'next/navigation'

export const useRefreshToken = () => {
  const { data: session, update, status } = useSession()
  const router = useRouter()

  const refreshToken = async () => {
    if (!session?.user?.refreshToken) {
      router.push('/api-test') // Redirect to login page if no refresh token
      return
    }

    const res = await refresh({
      client: axiosInstance,
      query: { token: session?.user.refreshToken ?? '' }
    })

    if (res.data) {
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
