'use client'

import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { googleLoginAccessToken } from '~/api/generated'
import { axiosInstance } from '../axios'
import { useAppDispatch } from '~/redux/store'
import { userLogin } from '~/redux/slices/auth'
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
        appDispatch(userLogin(res.data.accessToken))
        toast({
          title: 'Login Success',
          description: 'Successfully logged in',
          variant: 'success'
        })

        setTimeout(() => {
          router.replace('/')
        }, 500)
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
