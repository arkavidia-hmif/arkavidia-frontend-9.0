'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '~/redux/store'
import { toast, useToast } from '~/hooks/use-toast'

const useLoginRedirect = () => {
  const { isLoggedIn } = useAppSelector(state => state.auth)
  const router = useRouter()

  useEffect(() => {
    // If there's no access token, redirect to login page
    if (!isLoggedIn) {
      toast({
        title: 'Not Logged In',
        description: 'You need to be logged in to access this page',
        variant: 'destructive'
      })
      router.push('/login') // Change this to the actual login page path
    }
  }, [])
}

const useAdminRedirect = () => {
  const { isAdmin } = useAppSelector(state => state.auth)
  const { toast } = useToast()

  useEffect(() => {
    // If the user is not an admin, redirect to the home page
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to access this page',
        variant: 'destructive'
      })
    }
  }, [])
}

export { useLoginRedirect, useAdminRedirect }
