'use client'

import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { getUser, googleLoginAccessToken } from '~/api/generated'
import { axiosInstance, createAxiosAuthInstance } from '../axios'
import { useAppDispatch } from '~/redux/store'
import { setFilledInfo, userLogin } from '~/redux/slices/auth'
import { useToast } from '~/hooks/use-toast'

export default function useGAuth() {
  const appDispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const login = useGoogleLogin({
    onSuccess: async response => {
      const token = response.access_token
      const res = await googleLoginAccessToken({
        client: axiosInstance,
        body: {
          accessToken: token
        }
      })

      if (res.data) {
        const client = createAxiosAuthInstance(res.data.accessToken)
        const userData = await getUser({ client: client })
        if (!userData.data) {
          toast({
            title: 'Login gagal',
            description: 'Gagal mengambil data user',
            variant: 'destructive'
          })
        } else {
          appDispatch(userLogin(res.data.accessToken))
          const hasFilledInfo = userData.data.isRegistrationComplete
          toast({
            title: 'Login Success',
            description: 'Successfully logged in',
            variant: 'success'
          })
          if (hasFilledInfo) {
            appDispatch(setFilledInfo(true))
          }

          setTimeout(() => {
            if (!hasFilledInfo) {
              router.replace('/register/personal-data')
            } else {
              router.replace('/')
            }
          }, 1000)
        }
      }
    }
  })

  const register = useGoogleLogin({
    onSuccess: async response => {
      const token = response.access_token
      const res = await googleLoginAccessToken({
        client: axiosInstance,
        body: {
          accessToken: token
        }
      })

      if (res.data) {
        toast({
          title: 'Register Success',
          description: 'Successfully registered',
          variant: 'success'
        })

        setTimeout(() => {
          router.replace('/login')
        }, 500)
      }
    }
  })

  return { login, register }
}
