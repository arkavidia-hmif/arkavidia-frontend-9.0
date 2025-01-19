'use client'

import React, { useEffect, useState } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  Competition,
  CompetitionTimeline,
  getCompetitionByName,
  getCompetitionTimelineWithCompetitionId,
  GetCompetitionTimelineWithCompetitionIdResponse
} from '~/api/generated'
import { CompetitionLandingPage, ContactPersonProps } from '~/app/components/competition/LandingPage'
import { useRouter } from 'next/navigation'
import { TimelineEventProps } from '~/app/components/Timeline'
import Loading from '~/app/components/Loading'

type CompetitionMap = {
  [key: string]: {
    title: string
    abbr: string
    logoPath: string
    contactPerson?: ContactPersonProps[]
  }
}

// DEFINITION
const COMPETITIONMAP: CompetitionMap = {
  'competitive-programming': {
    title: 'Competitive Programming',
    abbr: 'CP',
    logoPath: '/images/competition/cp-logo.svg',
    contactPerson: [
      {name: 'Farhan', contact: 'farhannr28', type: 'line'},
      {name: 'Kristo', contact: 'kristoanugrah', type: 'line'},
    ],
  },
  arkalogica: {
    title: 'Arkalogica',
    abbr: 'Arkalogica',
    logoPath: '/images/competition/arkalogica-logo.svg',
    contactPerson: [
      {name: 'Nuel', contact: 'imanuelgirsang', type: 'line'},
      {name: 'Adril', contact: 'manurungadril', type: 'line'},
    ],
  },
  uxvidia: {
    title: 'UXVidia',
    abbr: 'UXvidia',
    logoPath: '/images/competition/uxvidia-logo.svg',
    contactPerson: [
      {name: 'Nuel', contact: 'imanuelgirsang', type: 'line'},
      {name: 'Adril', contact: 'manurungadril', type: 'line'},
    ],
  },
  'capture-the-flag': {
    title: 'Capture The Flag',
    abbr: 'CTF',
    logoPath: '/images/competition/ctf-logo.svg',
    contactPerson: [
      {name: 'Dava', contact: 'dovodedomo', type: 'discord'},
      {name: 'Saad', contact: 'saadabha', type: 'line'},
    ],
  },
  hackvidia: {
    title: 'Hackvidia',
    abbr: 'Hackvidia',
    logoPath: '/images/competition/hackvidia-logo.svg',
    contactPerson: [
      {name: 'Syakira', contact: 'syakiraafldz', type: 'line'},
      {name: 'Edbert', contact: 'yenyenhui', type: 'line'},
    ],
  },
  datavidia: {
    title: 'Datavidia',
    abbr: 'Datavidia',
    logoPath: '/images/competition/datavidia-logo.svg',
    contactPerson: [
      {name: 'Fathur', contact: 'fathurwithyou', type: 'line'},
      {name: 'Maul', contact: 'maull04', type: 'line'},
    ],
  }
}

const transformToTimelineEvents = (
  competitionTimeline: CompetitionTimeline[]
): TimelineEventProps[] => {
  const data: TimelineEventProps[] = []
  competitionTimeline.forEach(event => {
    const arr = {
      title: event.title,
      timeStart: event.startDate ? new Date(event.startDate) : undefined,
      timeEnd: event.endDate ? new Date(event.endDate) : new Date()
    }
    data.push(arr)
  })
  return data
}

function CompetitionLanding({ params }: { params: Promise<{ competition: string }> }) {
  const [competitionData, setCompetitionData] = useState<Competition | null>(null)
  const [competitionMeta, setCompetitionMeta] = useState<{
    title: string
    abbr: string
    logoPath: string
    contactPerson?: ContactPersonProps[]
  }>({ title: '', abbr: '', logoPath: '' })
  const [competitionTimeline, setCompetitionTimeline] = useState<TimelineEventProps[]>([
    { title: '', timeEnd: new Date() }
  ])
  const [error, setError] = useState<string | null>(null)
  const axiosInstance = useAxiosAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchCompetitionData = async () => {
      try {
        // Unwrap params from the promise
        const { competition } = await params

        // Fetch competition data from the API
        const competitionResponse = await getCompetitionByName({ client: axiosInstance })

        // Extract the competition array from competitionResponse
        const competitions: Competition[] | undefined = competitionResponse?.data

        // Validate COMPETITIONMAP entry
        const competitionMeta = COMPETITIONMAP[competition]
        if (!competitionMeta) {
          router.push('/404')
          return
        }

        if (!competitions) {
          router.push('/404')
          return
        }

        // Match the competition by title
        const matchedCompetition = competitions.find(
          (c: Competition) => c.title === competitionMeta.abbr
        )

        if (matchedCompetition) {
          setCompetitionData(matchedCompetition)

          const competitionTimelineResponse =
            await getCompetitionTimelineWithCompetitionId({
              client: axiosInstance,
              path: { competitionId: matchedCompetition.id }
            })
          const competitionTimelineData: GetCompetitionTimelineWithCompetitionIdResponse =
            competitionTimelineResponse?.data || []
          const competitionTimelineTemp = transformToTimelineEvents(
            competitionTimelineData
          )
          setCompetitionTimeline(competitionTimelineTemp)
          setCompetitionMeta(competitionMeta)
        } else {
          router.push('/404')
        }
      } catch (err) {
        setError('Failed to fetch competition data: ' + String(err))
      }
    }

    fetchCompetitionData()
  }, [params, axiosInstance])

  if (error) {
    router.push('/404')
  }

  if (!competitionData) {
    return (<Loading/>)
  }

  return (
    <CompetitionLandingPage
      competitionCode={competitionData.id}
      competitionName={competitionMeta.title}
      competitionAbbr={competitionData.title}
      competitionDescription={competitionData.description}
      registrationDeadline={competitionTimeline}
      competitionLogoPath={competitionMeta.logoPath}
      registerLink=""
      handbookLink={competitionData.guidebookUrl || '#'}
      contactPerson={competitionMeta.contactPerson}
    />
  )
}

export default CompetitionLanding
