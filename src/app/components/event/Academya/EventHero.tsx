'use client'

import React from 'react'
import Tag from '../../Tag'
import { mapStageTag, mapStatusTag } from '../../registered-teamlist/teamlist'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { getAdminEventTeamInformation } from '~/api/generated'

import { type EventTeam } from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import { Client } from '@hey-api/client-axios'

interface EventHeroProps {
  teamID: string
  eventID: string
}

export async function getTeamInfo(
  axiosInstance: Client,
  teamID: string,
  eventID: string
): Promise<EventTeam | null> {
  try {
    const res = await getAdminEventTeamInformation({
      client: axiosInstance,
      path: {
        eventId: eventID,
        teamId: teamID
      }
    })
    return res.data ?? null
  } catch (error) {
    const { toast } = useToast()
    toast({
      title: 'Error',
      description: 'Failed to fetch team information: ' + (error as Error).message,
      variant: 'destructive'
    })
    return null
  }
}

const EventHero: React.FC<EventHeroProps> = eventHeroProps => {
  const axiosInstance = useAxiosAuth()
  const [teamInfo, setTeamInfo] = React.useState<EventTeam | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getTeamInfo(
        axiosInstance,
        eventHeroProps.teamID,
        eventHeroProps.eventID
      )
      setTeamInfo(data)
    }

    fetchData()
  }, [axiosInstance, eventHeroProps])

  const teamName =
    teamInfo?.event?.title === 'Data Science'
      ? 'Team Name: ' + teamInfo.name
      : teamInfo?.name

  const status = teamInfo?.verificationStatus ?? 'No Status Yet'

  return (
    <div className="flex w-full flex-col rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:flex-row md:justify-between md:p-10">
      <div className="flex flex-col gap-1 md:gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white md:text-4xl">{teamName}</h1>
        </div>
        <h3 className="text-sm text-white opacity-80 md:text-xl">
          {eventHeroProps.teamID}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4 lg:gap-8">
          <div className="flex items-center">
            <h1 className="font-teachers text-xl font-bold">Team Status</h1>
          </div>
          <div className="">
            <Tag
              variant={mapStatusTag[status]}
              text={status}
              className="w-[100px] text-center capitalize lg:w-[240px] lg:text-left"
            />
          </div>
        </div>
        <div className="flex justify-between gap-4 lg:gap-8">
          <div className="flex items-center">
            <h1 className="font-teachers text-xl font-bold">Team Stage</h1>
          </div>
          <div>
            <Tag
              variant={mapStageTag[teamInfo?.stage ?? 'verification']}
              text={teamInfo?.stage ?? 'verification'}
              className="w-[100px] text-center capitalize lg:w-[240px] lg:text-left"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventHero
