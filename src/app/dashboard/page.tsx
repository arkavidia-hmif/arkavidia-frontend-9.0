'use client'
import React, { useEffect } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { getTeams } from '~/api/generated'
import { toast } from '~/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Button } from '../components/Button'
import Link from 'next/link'

function UserDashboard() {
  const [hasCompetitions, setHasCompetitions] = React.useState(true)
  const axiosAuth = useAxiosAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchTeams() {
      const userTeam = await getTeams({ client: axiosAuth })
      if (userTeam.error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get user competitions',
          variant: 'destructive'
        })
      }

      if (userTeam.data) {
        if (userTeam.data.length > 0) {
          const competitions = userTeam.data.toSorted((a, b) =>
            // @ts-ignore
            a.competition.title.localeCompare(b.competition.title)
          )
          const chosenCompetition = competitions[0]
          // @ts-ignore
          router.push(`/dashboard/${chosenCompetition.competition.title.toLowerCase()}`)
        } else {
        }
      }
    }

    fetchTeams()
  }, [])
  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-y-3">
      <div className="text-center font-belanosima text-[20px]">
        No competitions joined yet!
      </div>
      <Link href="/">
        <Button>Find a competition to join</Button>
      </Link>
    </div>
  )
}

export default UserDashboard
