'use client'
import React, { useEffect } from 'react'
import Dropdown, { MenuItem } from '../Dropdown'
import FrameInfo from './FrameInfo'
import FrameSubmissions from './FrameSubmissions'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  getCompetitionByName,
  GetCompetitionByNameData,
  GetCompetitionStatisticResponse
} from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import FrameInfoSkeleton from './FrameInfoSkeleton'

const CompetitionContext = ({
  competitionsData
}: {
  competitionsData?: GetCompetitionStatisticResponse
}) => {
  const axiosInstance = useAxiosAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(true)
  const [CompNumber, setCompNumber] = React.useState({ unverified: 0, registered: 0 })

  type competitionStatisticSelectors =
    keyof GetCompetitionStatisticResponse['competition']

  const DROPDOWN_DATA: MenuItem[] = [
    { id: 2, option: 'CP' },
    { id: 3, option: 'CTF' },
    { id: 4, option: 'UXvidia' },
    { id: 5, option: 'Arkalogica' },
    { id: 6, option: 'Datavidia' },
    { id: 7, option: 'Hackvidia' }
  ]

  function getStatisticSelector(
    compeName: 'CP' | 'CTF' | 'UXvidia' | 'Arkalogica' | 'Datavidia' | 'Hackvidia'
  ) {
    switch (compeName) {
      case 'CP':
        return 'competitiveProgramming' as competitionStatisticSelectors
      case 'CTF':
        return 'captureTheFlag' as competitionStatisticSelectors
      case 'UXvidia':
        return compeName.toLowerCase() as competitionStatisticSelectors
      case 'Arkalogica':
        return compeName.toLowerCase() as competitionStatisticSelectors
      case 'Datavidia':
        return compeName.toLowerCase() as competitionStatisticSelectors
      case 'Hackvidia':
        return compeName.toLowerCase() as competitionStatisticSelectors
    }
  }

  const [selectedCompetition, setSelectedCompetition] = React.useState<MenuItem | null>(
    DROPDOWN_DATA[0]
  )
  const [selectedCompetitionId, setSelectedCompetitionId] = React.useState<string>('')

  useEffect(() => {
    async function fetchCompetitionSubmission(option: string) {
      setIsLoading(true)
      try {
        const res = await getCompetitionByName({
          client: axiosInstance,
          query: { name: option }
        } as GetCompetitionByNameData)

        if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
          throw new Error('Competition not found')
        }

        const competitionId = (res.data as Array<{ id: string }>)[0].id
        setSelectedCompetitionId(competitionId)

        const data =
          competitionsData?.competition[
            getStatisticSelector(
              option as
                | 'CP'
                | 'CTF'
                | 'UXvidia'
                | 'Arkalogica'
                | 'Datavidia'
                | 'Hackvidia'
            )
          ]
        const total = data?.count || 0
        const verified = data?.verifiedCount || 0

        setCompNumber({
          unverified: total - verified,
          registered: verified
        })
      } catch (error) {
        toast({
          title: 'Failed to fetch competition participants',
          description: (error as Error).message,
          variant: 'warning'
        })
        setCompNumber({ unverified: 0, registered: 0 })
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedCompetition?.option) {
      fetchCompetitionSubmission(selectedCompetition.option)
    }
  }, [selectedCompetition, competitionsData])

  return (
    <>
      {/* Competition */}
      <div className="my-4 flex flex-col items-center justify-between gap-4 md:my-8 md:flex-row md:gap-10">
        <h1 className="font-belanosima text-3xl md:text-5xl">Competition</h1>
        <div className="w-full md:w-auto">
          <Dropdown
            data={DROPDOWN_DATA}
            label={''}
            value={selectedCompetition}
            onChange={setSelectedCompetition}
          />
        </div>
      </div>

      {/* Competition Participants */}
      <div className="my-4 flex flex-col items-center justify-between gap-4 md:my-8 md:flex-row md:gap-10">
        {isLoading ? (
          <>
            <FrameInfoSkeleton />
            <FrameInfoSkeleton />
          </>
        ) : (
          <>
            <FrameInfo
              number={CompNumber.registered}
              helperText={'Registered Participants'}
              imgSrc={'/images/admin-dashboard/supervisor-acc.svg'}
            />
            <FrameInfo
              number={CompNumber.unverified}
              helperText={'Unverified Participants'}
              imgSrc={'/images/admin-dashboard/unverified-acc.svg'}
            />
          </>
        )}
      </div>

      {/* Submissions */}
      {/* {!isLoading && selectedCompetitionId && (
        <FrameSubmissions
          compe_id={selectedCompetitionId}
          totalTeam={CompNumber.registered}
        />
      )} */}
    </>
  )
}

export default CompetitionContext
