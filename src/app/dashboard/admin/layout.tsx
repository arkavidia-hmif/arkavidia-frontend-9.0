'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { getUser } from '~/api/generated'
import { toast, useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useAppSelector } from '~/redux/store'

function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const router = useRouter()
  const axiosAuth = useAxiosAuth()
  const [isUserDataAdmin, setIsUserDataAdmin] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const { toast } = useToast()

  const getUserData = async () => {
    try {
      const response = await getUser({ client: axiosAuth })
      if (response.data) {
        setIsUserDataAdmin(
          response.data.role?.toLowerCase() === 'admin'
            ? true
            : response.data.role?.toLowerCase().includes('admin')
              ? true
              : false
        )
      }
      setTimeout(() => {
        setLoading(false)
      }, 100)
    } catch (error) {
      toast({
        title: 'Error',
        description: '',
        variant: 'destructive'
      })
    }
  }

  React.useEffect(() => {
    if (isLoggedIn) {
      getUserData()
    }
  }, [])

  if (loading) {
    return null
  }

  if (!isLoggedIn) {
    toast({
      title: 'Unauthorized',
      description: 'Anda harus login terlebih dahulu untuk mengakses halaman ini',
      variant: 'destructive'
    })
  }

  if (!isAdmin || !isUserDataAdmin) {
    toast({
      title: 'Unauthorized',
      description: 'Anda tidak memiliki akses untuk mengakses halaman ini',
      variant: 'destructive'
    })
  }

  if (!isLoggedIn || !isAdmin || !isUserDataAdmin) {
    setTimeout(() => {
      router.push('/')
    }, 1000)
    return null
  }
  return <section>{children}</section>
}

export default AdminDashboardLayout
