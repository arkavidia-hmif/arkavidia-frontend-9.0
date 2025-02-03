'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useToast } from '~/hooks/use-toast'
import { useAppSelector } from '~/redux/store'

function AdminCompetitionDashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true)
  const { competition } = useParams() as { competition: string }
  const competitionName = competition.toLowerCase() as keyof typeof competitionMap
  const adminRole = useAppSelector(state => state.auth.adminRole)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const router = useRouter()
  const { toast } = useToast()

  const competitionMap = {
    cp: 'CP',
    ctf: 'CTF',
    hackvidia: 'Hackvidia',
    uxvidia: 'UXvidia',
    datavidia: 'Datavidia',
    arkalogica: 'Arkalogica'
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
        description: 'Only competition admins can access this page',
        variant: 'destructive',
        duration: 6000
      })
      setTimeout(() => {
        router.push('/dashboard/admin')
      }, 500)
    }

    if (
      adminRole?.toLowerCase() === 'admin' ||
      adminRole?.toLowerCase() === 'admin_competition' ||
      adminRole?.toLowerCase() === `admin_competition_${competitionName}`
    ) {
      setLoading(false)
    } else {
      toast({
        title: 'Unauthorized',
        description:
          'Only competition admins with the right competition can access this page',
        variant: 'destructive',
        duration: 4000
      })
      const checkRole = adminRole?.split('_')

      setTimeout(() => {
        if (checkRole?.length === 3) {
          router.push(
            `/dashboard/admin/${competitionMap[checkRole[2].toLowerCase() as keyof typeof competitionMap]}`
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

export default AdminCompetitionDashboardLayout
