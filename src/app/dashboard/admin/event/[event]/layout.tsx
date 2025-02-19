'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { getEvent } from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import { axiosInstance } from '~/lib/axios'
import { useAppSelector } from '~/redux/store'

function AdminEventDashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true)
  const { event } = useParams() as { event: string }
  const adminRole = useAppSelector(state => state.auth.adminRole)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admin can access this page',
        variant: 'destructive',
        duration: 6000
      })
      setTimeout(() => {
        router.push('/')
      }, 500)
      return
    }

    // Redirect if user is competition admins
    if (adminRole?.includes('compe')) {
      toast({
        title: 'Unauthorized',
        description: 'Only event admins can access this page',
        variant: 'destructive',
        duration: 6000
      })
      setTimeout(() => {
        router.push('/dashboard/admin')
      }, 500)
      return
    }

    if (
      adminRole?.toLowerCase() === 'admin' ||
      adminRole?.toLowerCase() === 'admin_event'
      // adminRole?.toLowerCase() === `admin_event_${eventMap[eventName]}`
    ) {
      setLoading(false)
    } else {
      toast({
        title: 'Unauthorized',
        description: 'Only event admins with the right event can access this page',
        variant: 'destructive',
        duration: 4000
      })
      // const checkRole = adminRole?.split('_')

      //   admin_event can access all event while admin_event_{eventID} can only access that event
      // setTimeout(() => {
      //   if (checkRole?.length === 4) {
      //     router.push(
      //       `/dashboard/admin/event/${eventRole[checkRole[3] as keyof typeof eventRole].toLowerCase()}`
      //     )
      //   } else {
      //     router.push('/dashboard/admin')
      //   }
      // }, 500)
    }
  }, [])

  if (!loading) {
    return <section>{children}</section>
  } else {
    return null
  }
}

export default AdminEventDashboardLayout
