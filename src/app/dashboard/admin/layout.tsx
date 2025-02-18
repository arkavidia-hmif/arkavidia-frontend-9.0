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
  const [loading, setLoading] = React.useState(true)
  const { toast } = useToast()

  const checkRole = async () => {
    try {
      setLoading(true)
      if (!isLoggedIn) {
        toast({
          title: 'Unauthorized',
          description: 'Anda harus login terlebih dahulu untuk mengakses halaman ini',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push('/')
        }, 1000)
        return
      }

      if (!isAdmin) {
        toast({
          title: 'Unauthorized',
          description: 'Anda tidak memiliki akses untuk mengakses halaman ini',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push('/')
        }, 1000)
        return
      }

      const response = await getUser({ client: axiosAuth })
      if (response.data) {
        if (response.data.role === 'admin' || response.data.role?.includes('admin')) {
          setLoading(false)
        } else {
          toast({
            title: 'Unauthorized',
            description: 'Anda tidak memiliki akses untuk mengakses halaman ini',
            variant: 'destructive'
          })
          setTimeout(() => {
            router.push('/')
          }, 1000)
          return
        }
      } else {
        toast({
          title: 'Unauthorized',
          description: 'Anda tidak memiliki akses untuk mengakses halaman ini',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push('/')
        }, 1000)
        return
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: '',
        variant: 'destructive'
      })
    }
  }

  React.useEffect(() => {
    checkRole()
  }, [isLoggedIn, isAdmin])

  if (loading) {
    return null
  }

  return <section>{children}</section>
}

export default AdminDashboardLayout
