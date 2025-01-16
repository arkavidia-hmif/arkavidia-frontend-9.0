'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { set } from 'react-hook-form'
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
  const userId = searchParams.get('userId')
  const token = searchParams.get('verificationToken')

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
        setMessage('Something went wrong. Please try again.')
      }

      if (res.data) {
        const accessToken = res.data.accessToken
        appDispatch(userLogin(accessToken))
        setStatus('success')
        setMessage('Email verified successfully')
        setTimeout(() => {
          router.replace('/')
        }, 1500)
      }
    }

    // Dummy logic
    setTimeout(() => {
      setIsProcessing(false)
      setStatus('success')
      setMessage('Email verified successfully. Redirecting to homepage...')
    }, 1000)

    setTimeout(() => {
      router.replace('/')
    }, 3000)
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
