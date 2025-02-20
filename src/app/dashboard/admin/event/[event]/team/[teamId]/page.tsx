'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { EventTeam, getAdminEventTeamInformation } from '~/api/generated'
import { Tab } from '~/app/components/Tab'
import EventHero from '~/app/components/event/Academya/EventHero'
import EventSubmission from '~/app/components/event/Academya/EventSubmission'
import EventVerificationBox from '~/app/components/event/Academya/EventVerificationBox'
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
  const axiosAuth = useAxiosAuth()
  const { toast } = useToast()

  const fetchTeamData = async () => {
    try {
      const response = await getAdminEventTeamInformation({
        client: axiosAuth,
        path: { teamId: teamId, eventId: event }
      })

      if (!response || response.error || !response.data) {
        return
      }

      if (response.data) {
        setTeamData(response.data as EventTeam)
        if (response.data.event?.maxTeamMember !== 1) {
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

  useEffect(() => {
    fetchTeamData()
  }, [])

  if (!loading) {
    return (
      <div className="flex min-h-screen flex-col gap-7">
        <EventHero teamData={teamData} />
        <Tab
          contentType={CONTENT_TYPES}
          content={[
            <EventVerificationBox
              teamData={teamData}
              refetchData={fetchTeamData}
              teamID={teamId}
              eventID={event}
            />,
            <EventSubmission />
          ]}
        />
      </div>
    )
  }
}

export default TeamDetailPage
