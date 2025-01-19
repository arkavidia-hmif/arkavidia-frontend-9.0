'use client'
import React, { useEffect } from 'react'
import FrameTugas from './FrameTugas'
import { getCompetitionStatistic, GetCompetitionStatisticResponse } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'

interface FrameSubmissionsProps {
  compe_id?: string
  totalTeam: number
}

const FrameSubmissions = ({ compe_id, totalTeam }: FrameSubmissionsProps) => {
  const axiosInstance = useAxiosAuth()
  const { toast } = useToast()

  const [competitionSubmissions, setCompetitionSubmissions] = React.useState<
    GetCompetitionStatisticResponse[]
  >([])

  useEffect(() => {
    async function fetchCompetitionSubmission() {
      // fetch competition submission
      try {
        const res = await getCompetitionStatistic({
          client: axiosInstance
        })

        if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
          throw new Error('Competition not found')
        }

        setCompetitionSubmissions(res.data)
      } catch (error) {
        toast({
          title: 'Error',
          description: (error as Error).message,
          variant: 'warning'
        })
      }
    }
    if (compe_id) fetchCompetitionSubmission()
  }, [compe_id, axiosInstance, totalTeam])

  return (
    <div
      style={{
        background:
          'linear-gradient(90.68deg, rgba(255,255,255,0.24) 0.11%, rgba(255,255,255,0.08) 99.1%)',
        boxShadow: '0px 0px 8px 0px #F5F5F580'
      }}
      className="flex flex-grow items-center justify-between gap-3 rounded-lg border border-white/25 px-4 py-4 font-teachers md:px-6 md:py-5">
      <div className="flex w-full flex-grow flex-col">
        <h2 className="text-center text-2xl font-bold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)] md:text-left md:text-3xl">
          Submission
        </h2>
        <h3 className="text-center font-dmsans text-sm text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)] md:text-left md:text-base">
          Track the number of participants who have submitted each task
        </h3>

        {/* List Tugas */}
        <div className="mt-4 flex flex-col gap-4">
          {competitionSubmissions
            .filter(item => item.competitionId === compe_id)
            .map((item, _index) =>
              item.submissions.map((submission, _subidx) => (
                <FrameTugas
                  key={submission.typeId}
                  title={submission.typeName}
                  deadline={submission.deadline}
                  submitted={submission.submitedTeams}
                  total={totalTeam}
                />
              ))
            )}
        </div>
      </div>
    </div>
  )
}

export default FrameSubmissions
