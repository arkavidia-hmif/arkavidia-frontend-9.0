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
import {
  CompetitionLandingPage,
  ContactPersonProps
} from '~/app/components/competition/LandingPage'
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
      { name: 'Farhan', contact: 'https://wa.me/6281311106310', type: 'whatsapp' },
      { name: 'Kristo', contact: 'https://wa.me/6285813153747', type: 'whatsapp' }
    ]
  },
  arkalogica: {
    title: 'Arkalogica',
    abbr: 'Arkalogica',
    logoPath: '/images/competition/arkalogica-logo.svg',
    contactPerson: [
      { name: 'Nuel', contact: 'https://wa.me/6281217551251', type: 'whatsapp' },
      { name: 'Adril', contact: 'https://wa.me/6282297365702', type: 'whatsapp' }
    ]
  },
  uxvidia: {
    title: 'UXVidia',
    abbr: 'UXvidia',
    logoPath: '/images/competition/uxvidia-logo.svg',
    contactPerson: [
      { name: 'Lina', contact: 'https://wa.me/6285971635307', type: 'whatsapp' },
      { name: 'Angie', contact: 'https://wa.me/6281290362644', type: 'whatsapp' }
    ]
  },
  'capture-the-flag': {
    title: 'Capture The Flag',
    abbr: 'CTF',
    logoPath: '/images/competition/ctf-logo.svg',
    contactPerson: [
      { name: 'Dava', contact: 'https://wa.me/6285659251632', type: 'whatsapp' },
      { name: 'Saad', contact: 'https://wa.me/6281289131528', type: 'whatsapp' }
    ]
  },
  hackvidia: {
    title: 'Hackvidia',
    abbr: 'Hackvidia',
    logoPath: '/images/competition/hackvidia-logo.svg',
    contactPerson: [
      { name: 'Syakira', contact: 'https://wa.me/6287824078423', type: 'whatsapp' },
      { name: 'Edbert', contact: 'https://wa.me/6285345871185', type: 'whatsapp' }
    ]
  },
  datavidia: {
    title: 'Datavidia',
    abbr: 'Datavidia',
    logoPath: '/images/competition/datavidia-logo.svg',
    contactPerson: [
      { name: 'Fathur', contact: 'https://wa.me/62895392152737', type: 'whatsapp' },
      { name: 'Maul', contact: 'https://wa.me/6287728997015', type: 'whatsapp' }
    ]
  }
}

const transformToTimelineEvents = (
  competitionTimeline: CompetitionTimeline[]
): TimelineEventProps[] => {
  const data: TimelineEventProps[] = []
  competitionTimeline.forEach(event => {
    let arr: TimelineEventProps
    // TBA
    if (event.showOnLanding === true) {
      arr = {
        title: event.title,
        timeStart: undefined,
        timeEnd: undefined,
        isTBA: true
      }
    } else {
      arr = {
        title: event.title,
        timeStart: event.startDate ? new Date(event.startDate) : undefined,
        timeEnd: event.endDate ? new Date(event.endDate) : undefined,
        isTBA: false
      }
    }

    if (event.showTime === true) {
      arr = {
        ...arr,
        isUpdated: true
      }
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
    return (
      <div className="relative h-screen w-full">
        <Loading />
      </div>
    )
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
