'use client'
import React, { useEffect } from 'react'
import Dropdown, { MenuItem } from '../Dropdown'
import FrameInfo from './FrameInfo'
import FrameSubmissions from './FrameSubmissions'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  getCompetitionByName,
  GetCompetitionByNameData,
  GetTeamStatisticResponse
} from '~/api/generated'
import { useToast } from '~/hooks/use-toast'

const CompetitionContext = ({ result }: GetTeamStatisticResponse) => {
  const axiosInstance = useAxiosAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(true)
  const [CompNumber, setCompNumber] = React.useState({ unverified: 0, registered: 0 })

  const DROPDOWN_DATA: MenuItem[] = [
    { id: 2, option: 'CP' },
    { id: 3, option: 'CTF' },
    { id: 4, option: 'UXvidia' },
    { id: 5, option: 'Arkalogica' },
    { id: 6, option: 'Datavidia' },
    { id: 7, option: 'Hackvidia' }
    // { id: 8, option: 'ArkavX' },
    // { id: 9, option: 'Academya' }
  ]

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

        const data = result.filter(item => item.competitionId === competitionId)[0]
        const total = data?.totalTeam || 0
        const verified = data?.totalVerifiedTeam || 0

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
        setSelectedCompetitionId('')
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedCompetition?.option) {
      fetchCompetitionSubmission(selectedCompetition.option)
    }
  }, [selectedCompetition, axiosInstance, result, toast])

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
      </div>

      {/* Submissions */}
      {!isLoading && selectedCompetitionId && (
        <FrameSubmissions
          compe_id={selectedCompetitionId}
          totalTeam={CompNumber.registered}
        />
      )}
    </>
  )
}

export default CompetitionContext
