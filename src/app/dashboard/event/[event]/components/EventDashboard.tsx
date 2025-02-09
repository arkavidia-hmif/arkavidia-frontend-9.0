'use client'

import React, { useEffect, useState } from 'react'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import EventVerification from './EventVerification'
import EventTeamInfo from './EventTeamInfo'
import EventTeamProfileHero from './EventTeamProfileHero'
import {
  getEventTeam,
  getEventTeamByTeamId,
  GetEventTeamByTeamIdResponse,
  GetEventTeamResponse,
  getUser,
  User
} from '~/api/generated'
import { getEventNameSlug } from './event-dashboard-utils'
import Loading from '~/app/components/Loading'
import { Tab } from '~/app/components/Tab'
import EventTaskList from './EventTaskList'
import { AnnouncementEventContent } from './EventAnnouncement'

function EventDashboard({ eventName }: { eventName: string }) {
  const { toast } = useToast()
  const authAxios = useAxiosAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<User>()
  const [userEventTeams, setUserEventTeams] = useState<GetEventTeamResponse>([])
  const [activeTeamData, setActiveTeamData] = useState<GetEventTeamByTeamIdResponse>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const userReq = await getUser({ client: authAxios })

        if (!userReq.data) {
          throw new Error('User data not found')
        }
        setUserData(userReq.data)

        // Get user event teams
        const teamReq = await getEventTeam({ client: authAxios })

        if (!teamReq.data || !teamReq.data.length) {
          throw new Error('Team data not found')
        }

        setUserEventTeams(teamReq.data)

        // Get active team data
        const activeTeam = teamReq.data.find(
          team => team.event?.title === getEventNameSlug(eventName)
        )
        if (!activeTeam) {
          throw new Error('Currently chosen team data not found')
        }

        // Get detailed team data
        const teamDataReq = await getEventTeamByTeamId({
          client: authAxios,
          path: {
            teamId: activeTeam.id
          }
        })

        if (!teamDataReq.data) {
          throw new Error('Team data not found')
        }

        setActiveTeamData(teamDataReq.data)
        setTimeout(() => setIsLoading(false), 500)
      } catch (err: unknown) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="relative flex h-screen w-full flex-col">
        <Loading />
      </div>
    )
  }

  const contentTypes = [
    'Team Info',
    'Announcement',
    'Material',
    'Task List',
    'Verification'
  ]

  return (
    <div>
      <EventTeamProfileHero
        eventName={eventName}
        userData={userData}
        activeTeamData={activeTeamData}
      />
      <Tab
        contentType={contentTypes}
        content={[
          <EventTeamInfo
            eventName={eventName}
            user={userData}
            teamData={activeTeamData}
          />,
          <AnnouncementEventContent eventId={activeTeamData?.eventId ?? ''} />,
          <div className="mt-12 flex items-center justify-center font-dmsans font-semibold">
            Belum ada materi untuk diakses
          </div>,
          <EventTaskList teamId={activeTeamData?.id} eventName={eventName} />,
          <EventVerification activeTeamData={activeTeamData} user={userData} />
        ]}
      />
    </div>
  )
}

export default EventDashboard
