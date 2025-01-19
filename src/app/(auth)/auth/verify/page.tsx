'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { basicVerifyAccount } from '~/api/generated'
import Loading from '~/app/components/Loading'
import { axiosInstance } from '~/lib/axios'
import { userLogin } from '~/redux/slices/auth'
import { useAppDispatch } from '~/redux/store'

function VerifyEmailPage() {
  const [isProcessing, setIsProcessing] = React.useState(true)
  const [message, setMessage] = React.useState('')
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')

  const searchParams = useSearchParams()
  const userId = searchParams.get('user')
  const token = searchParams.get('token')

  const appDispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const verifyEmail = async (userId: string, token: string) => {
      const res = await basicVerifyAccount({
        client: axiosInstance,
        query: {
          user: userId,
          token: token
        }
      })
      if (res.error) {
        setStatus('error')
        // @ts-ignore
        if (res.error.message === 'Token has expired') {
          setMessage('Verification link has expired. Redirecting to register page...')
        } else {
          // @ts-ignore
          setMessage(res.error.message + '. Redirecting to register page...')
        }
        setIsProcessing(false)
        setTimeout(() => {
          router.replace('/register')
        }, 3000)
      }
      if (res.data) {
        const accessToken = res.data.accessToken
        appDispatch(userLogin(accessToken))
        setIsProcessing(false)
        setStatus('success')
        setMessage('Email verified successfully')
        setTimeout(() => {
          router.replace('/')
        }, 2000)
      }
    }

    if (!userId || !token) {
      setStatus('error')
      setIsProcessing(false)
      setMessage('Invalid verification link. Redirecting to login page...')
      setTimeout(() => {
        router.replace('/login')
      }, 1500)
      return
    }

    setTimeout(() => {
      verifyEmail(userId, token)
    }, 1000)
  }, [])

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-center font-teachers text-2xl font-bold">
        Verifying your email
      </h1>
      <div className="relative mt-10">
        {isProcessing && <Loading size={64} isSmallVariant={true} />}
        {!isProcessing && (
          <p
            className={`text-center ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage
