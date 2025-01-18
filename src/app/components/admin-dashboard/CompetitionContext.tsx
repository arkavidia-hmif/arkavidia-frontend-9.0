'use client'
import React, { useEffect } from 'react'
import Dropdown, { MenuItem } from '../Dropdown'
import FrameInfo from './FrameInfo'
import FrameSubmissions from './FrameSubmissions'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  getCompetitionIdByName,
  GetCompetitionIdByNameData,
  GetTeamStatisticResponse
} from '~/api/generated'
import { useToast } from '~/hooks/use-toast'

const CompetitionContext = ({ result }: GetTeamStatisticResponse) => {
  const axiosInstance = useAxiosAuth()
  const { toast } = useToast()
  const [CompNumber, setCompNumber] = React.useState({ unverified: 0, registered: 0 })

  const DROPDOWN_DATA: MenuItem[] = [
    { id: 2, option: 'CP' },
    { id: 3, option: 'CTF' },
    { id: 4, option: 'UXVidia' },
    { id: 5, option: 'Arcalogica' },
    { id: 6, option: 'Datavidia' },
    { id: 7, option: 'Hackvidia' },
    { id: 8, option: 'ArkavX' },
    { id: 9, option: 'Academya' }
  ]

  const [selectedCompetition, setSelectedCompetition] = React.useState<MenuItem | null>(
    DROPDOWN_DATA[0]
  )
  const [selectedCompetitionId, setSelectedCompetitionId] = React.useState<
    string | undefined
  >(undefined)

  useEffect(() => {
    async function fetchCompetitionSubmission(option: string | undefined) {
      if (option === undefined) return

      await getCompetitionIdByName({
        client: axiosInstance,
        query: { name: option }
      } as GetCompetitionIdByNameData)
        .then(async res => {
          try {
            if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
              throw new Error('Competition not found')
            }
            setSelectedCompetitionId((res.data as Array<{ id: string }>)[0].id)
            const data = result.filter(
              item => item.competitionId === selectedCompetitionId
            )[0]

            const total = data?.totalTeam || -1
            const verified = data?.totalVerifiedTeam || -1

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
          }
        })
        .catch(err => {
          toast({
            title: 'Failed to fetch competition participants',
            description: err.message,
            variant: 'warning'
          })
        })
    }

    fetchCompetitionSubmission(selectedCompetition?.option)
  }, [selectedCompetition, axiosInstance, result])

  return (
    <>
      {/* Competition */}
      <div className="my-8 flex flex-row items-center justify-between gap-10">
        <h1 className="font-belanosima text-5xl">Competition</h1>
        <div>
          <Dropdown
            data={DROPDOWN_DATA}
            label={''}
            value={selectedCompetition}
            onChange={setSelectedCompetition}
          />
        </div>
      </div>

      {/* Competition Participants */}
      <div className="my-8 flex items-center justify-between gap-10">
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

      {/* Submissions  */}
      <FrameSubmissions compe_id={selectedCompetitionId} />
    </>
  )
}

export default CompetitionContext
