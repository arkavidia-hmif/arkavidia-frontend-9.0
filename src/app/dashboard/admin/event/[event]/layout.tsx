'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useToast } from '~/hooks/use-toast'
import { useAppSelector } from '~/redux/store'

function AdminEventDashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true)
  const { event } = useParams() as { event: string }
  const eventName = event.toLowerCase() as keyof typeof eventMap
  const adminRole = useAppSelector(state => state.auth.adminRole)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const router = useRouter()
  const { toast } = useToast()


  const eventMap = {
    ogqnrwas: 'Product Management',
    eqpginai: 'Software Engineering',
    oajbedpk: 'Data Science',
    oqgjwbra: 'UI UX'
  }

  const eventRole = {
    pm: 'ogqnrwas',
    softeng: 'eqpginai',
    datsci: 'oajbedpk',
    uiux: 'oqgjwbra'
  }

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
    }

    // Redirect if user is event admins
    if (adminRole?.includes('event')) {
      toast({
        title: 'Unauthorized',
        description: 'Only event admins can access this page',
        variant: 'destructive',
        duration: 6000
      })
      setTimeout(() => {
        router.push('/dashboard/admin')
      }, 500)
    }

    if (
      adminRole?.toLowerCase() === 'admin' ||
      adminRole?.toLowerCase() === 'admin_event' ||
      adminRole?.toLowerCase() === `admin_event_${eventMap[eventName]}`
    ) {
      setLoading(false)
    } else {
      toast({
        title: 'Unauthorized',
        description: 'Only event admins with the right event can access this page',
        variant: 'destructive',
        duration: 4000
      })
      const checkRole = adminRole?.split('_')

      //   admin_event can access all event while admin_event_{eventID} can only access that event
      setTimeout(() => {
        if (checkRole?.length === 4 || checkRole?.length === 2) {
          router.push(
            // `/dashboard/admin/${eventMap[checkRole[2].toLowerCase() as keyof typeof eventMap]}`
            `/dashboard/admin/${eventRole[checkRole[3] as keyof typeof eventRole].toLowerCase()}`
          )
        } else {
          router.push('/dashboard/admin')
        }
      }, 500)
    }
  }, [])

  if (!loading) {
    return <section>{children}</section>
  } else {
    return null
  }
}

export default AdminEventDashboardLayout
