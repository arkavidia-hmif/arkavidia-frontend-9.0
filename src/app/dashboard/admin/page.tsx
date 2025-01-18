'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useToast } from '~/hooks/use-toast'
import { useAppSelector } from '~/redux/store'

function AdminDashboard() {
  const isAuthenticated = useAppSelector(state => state.auth.accessToken !== null)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const { toast } = useToast()
  const router = useRouter()

  if (!isAuthenticated || !isAdmin) {
    toast({
      title: 'Unauthorized',
      description: 'You are not authorized to view this page',
      variant: 'destructive'
    })
    router.replace('/')
  } else {
    return (
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    )
  }
}

export default AdminDashboard
