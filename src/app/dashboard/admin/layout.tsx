'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { toast, useToast } from '~/hooks/use-toast'
import { useAppSelector } from '~/redux/store'

function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const router = useRouter()
  const { toast } = useToast()

  if (!isLoggedIn) {
    toast({
      title: 'Unauthorized',
      description: 'Anda harus login terlebih dahulu untuk mengakses halaman ini',
      variant: 'destructive'
    })
  }

  if (!isAdmin) {
    toast({
      title: 'Unauthorized',
      description: 'Anda tidak memiliki akses untuk mengakses halaman ini',
      variant: 'destructive'
    })
  }

  if (!isLoggedIn || !isAdmin) {
    setTimeout(() => {
      router.push('/')
    }, 1000)
    return null
  }
  return <section>{children}</section>
}

export default AdminDashboardLayout
