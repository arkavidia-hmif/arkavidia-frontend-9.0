'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { EventTeam, getAdminEventTeamInformation } from '~/api/generated'
import { Tab } from '~/app/components/Tab'
import EventSubmission from '~/app/components/event/Academya/EventSubmission'
import Hero from '~/app/components/team-lists/detail/Hero'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

function TeamDetailPage() {
  const { event, teamId } = useParams() as { event: string; teamId: string }
  const [CONTENT_TYPES, setCONTENT_TYPES] = useState<Array<string>>([
    'Participant Information',
    'Submission'
  ])
  const [loading, setLoading] = useState(true)
  const [teamData, setTeamData] = useState<EventTeam>()
  const [eventMaxTeamMember, setEventMaxTeamMember] = useState<number>(1)
  const axiosAuth = useAxiosAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true)
      try {
        const response = (await getAdminEventTeamInformation({
          client: axiosAuth,
          path: { teamId: teamId, eventId: event }
        })) as any

        if (!response || response.error || !response.data) {
          return
        }

        if (response.data) {
          setTeamData(response.data as EventTeam)
          setEventMaxTeamMember(response.data.event.maxTeamMember)
          if (response.data.event.maxTeamMember !== 1) {
            setCONTENT_TYPES(['Team Information', 'Submission'])
          }
        }
      } catch (error) {
        toast({
          title: 'Failed fetching team data',
          description: 'Error: ' + error,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  if (!loading) {
    return (
      <div className="flex min-h-screen flex-col gap-7">
        <Hero
          teamName={teamData?.name ?? 'No team name'}
          teamID={teamData?.joinCode ? `#${teamData?.joinCode}` : ''}
          teamStatus={teamData?.verificationStatus ?? null}
          teamStage={teamData?.stage ?? 'No stage data'}
          isNotTeam={eventMaxTeamMember === 1}
        />
        <Tab contentType={CONTENT_TYPES} content={[null, <EventSubmission />]} />
      </div>
    )
  }
}

export default TeamDetailPage
