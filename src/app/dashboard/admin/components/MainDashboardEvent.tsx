'use client'

import React, { useEffect, useState } from 'react'
import { getAcademyaStatistic, getEvent, GetEventResponse } from '~/api/generated'
import FrameInfo from '~/app/components/admin-dashboard/FrameInfo'
import FrameInfoSkeleton from '~/app/components/admin-dashboard/FrameInfoSkeleton'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import EventContext from './EventContext'
import Dropdown, { MenuItem } from '~/app/components/Dropdown'

interface ParticipantVerificationStatus {
  changed: number
  denied: number
  incomplete: number
  onReview: number
  verified: number
  waiting: number
}

interface IndividualEventStats {
  [eventId: string]: IndividualEventStatsAttributes
}

export interface IndividualEventStatsAttributes {
  count: number
  verificationStatus: ParticipantVerificationStatus
}

function getEventType(eventName: string) {
  if (eventName.toLowerCase().includes('software')) return 'softeng'
  if (eventName.toLowerCase().includes('data')) return 'datsci'
  if (eventName.toLowerCase().includes('product')) return 'pm'
  if (eventName.toLowerCase().includes('ui')) return 'uiux'
}

const IMAGE = '/images/sidebar/item.svg'
const DROPDOWN_DATA = [
  {
    id: 1,
    option: 'Academya - Software Engineering'
  },
  {
    id: 2,
    option: 'Academya - Data Science'
  },
  {
    id: 3,
    option: 'Academya - Product Management'
  },
  {
    id: 4,
    option: 'Academya - UI/UX'
  }
]

function MainDashboardEvent({
  withHeader = true,
  withTopBreak = false
}: {
  withHeader?: boolean
  withTopBreak?: boolean
}) {
  const [loading, setLoading] = useState(true)
  const [overallStats, setOverallStats] = useState<{
    registered: number
    unverified: number
  }>({
    registered: 0,
    unverified: 0
  })
  const [eventList, setEventList] = useState<GetEventResponse>()
  const [individualStats, setIndividualStats] = useState<IndividualEventStats>({})
  const [shownStats, setShownStats] = useState<IndividualEventStatsAttributes>()
  const [selectedCompetition, setSelectedCompetition] = React.useState<MenuItem | null>(
    DROPDOWN_DATA[0]
  )

  const authAxios = useAxiosAuth()
  const { toast } = useToast()

  useEffect(() => {
    async function getAcademyaStats() {
      try {
        setLoading(true)
        const response = await getAcademyaStatistic({ client: authAxios })
        const data = response.data

        const totalVerified = data?.verificationStatus.verified ?? 0
        const totalTeam = data?.count ?? 0

        const academyaIndividualStats = [
          // @ts-expect-error
          data?.Academya.dataScience,
          // @ts-expect-error
          data?.Academya.productManagement,
          // @ts-expect-error
          data?.Academya.softwareEngineering,
          // @ts-expect-error
          data?.Academya.uiux
        ]

        const statsObject = {
          datsci: academyaIndividualStats[0],
          pm: academyaIndividualStats[1],
          softeng: academyaIndividualStats[2],
          uiux: academyaIndividualStats[3]
        }

        setIndividualStats(statsObject)
        const eventType = getEventType(DROPDOWN_DATA[0].option)
        if (eventType) {
          setShownStats(statsObject[eventType])
        } else {
          setShownStats({
            count: 0,
            verificationStatus: {
              changed: 0,
              denied: 0,
              incomplete: 0,
              onReview: 0,
              verified: 0,
              waiting: 0
            }
          })
        }

        setOverallStats({
          registered: totalVerified,
          unverified: totalTeam - totalVerified
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed getting Academya statistic. Error: ' + error,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    getAcademyaStats()
  }, [])

  useEffect(() => {
    if (selectedCompetition) {
      const eventType = getEventType(selectedCompetition.option)
      if (eventType) {
        setShownStats(individualStats[eventType])
      }
    }
  }, [selectedCompetition])

  return (
    <>
      {/* Dashboard Title */}
      {withHeader && (
        <div className="relative flex items-center justify-center space-x-4 md:justify-start">
          <div
            className="h-8 w-8 md:h-12 md:w-12"
            style={{
              background: 'linear-gradient(180deg, #7138C0 0%, #B89BDF 100%)',
              boxShadow: '0px 0px 8px 0px #F5F5F580',
              WebkitMaskImage: `url(${IMAGE})`, // kalo masing-masing compe punya logo, bisa diganti
              maskImage: `url(${IMAGE})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />

          <h1 className="font-belanosima text-3xl text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)] md:text-5xl">
            Dashboard
          </h1>
        </div>
      )}

      {withTopBreak && (
        <div className="my-3 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] md:my-4" />
      )}
      <h1 className="mb-2 mt-4 font-belanosima text-3xl md:text-5xl">Event</h1>
      {/* Overall Participant */}
      <div className="my-3 flex flex-col items-center justify-between gap-4 md:my-5 md:flex-row md:gap-10">
        {loading ? (
          <>
            <FrameInfoSkeleton />
            <FrameInfoSkeleton />
          </>
        ) : (
          <>
            <FrameInfo
              number={overallStats.registered}
              helperText={'Overall Registered Participants & Team'}
              imgSrc={'/images/admin-dashboard/supervisor-acc.svg'}
            />
            <FrameInfo
              number={overallStats.unverified}
              helperText={'Overall Unverified Participants & Team'}
              imgSrc={'/images/admin-dashboard/unverified-acc.svg'}
            />
          </>
        )}
      </div>

      {/* Competition */}
      <div className="my-3 flex flex-col items-center justify-between gap-4 md:my-5 md:flex-row md:gap-10">
        <h1 className="font-belanosima text-2xl md:text-[40px]">Academya</h1>
        <div className="w-full self-end md:w-auto md:grow">
          <Dropdown
            data={DROPDOWN_DATA}
            label={''}
            value={selectedCompetition}
            onChange={setSelectedCompetition}
            className="md:mr-0"
          />
        </div>
      </div>
      <EventContext individualStats={shownStats} />
      {/* break line */}
      <div className="my-3 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] md:my-4" />
    </>
  )
}

export default MainDashboardEvent
