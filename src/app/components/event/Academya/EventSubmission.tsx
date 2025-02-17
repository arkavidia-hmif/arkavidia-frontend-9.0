'use client'

import { useEffect, useState } from 'react'
import { GetAdminCompetitionTeamInformationResponse, getAdminEventTeamSubmissions, GetAdminEventTeamSubmissionsResponse } from '~/api/generated'
// TODO: For placeholder use the competition. Change into event later. The event team information not yet given
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { capitalizeFirstLetter } from '~/lib/utils'
import EventSubmissionSection from './EventSubmissionSection'
import { SubmissionDoc } from '../../team-lists/detail/SubmissionTable'
import { useParams } from 'next/navigation'
import { EventTeamStatus } from './EventTeamStatus'

const FINAL_QUALIFICATIONS = [
  { id: 1, option: 'Juara 1' },
  { id: 2, option: 'Juara 2' },
  { id: 3, option: 'Juara 3' }
  // { id: 4, option: 'Juara Harapan 1' },
  // { id: 5, option: 'Juara Harapan 2' },
  // { id: 6, option: 'Juara Harapan 3' }
]

const NOT_FINAL_QUALIFICATIONS = [
  { id: 1, option: 'Pass' },
  { id: 2, option: 'Not Pass' },
  { id: 3, option: 'On Review' }
]

export default function Submission({
  teamData
}: {
  teamData: GetAdminCompetitionTeamInformationResponse
}) {
  const [prelimSubmission, setPrelimSubmission] = useState<Array<SubmissionDoc>>([])
  const [finalSubmission, setFinalSubmission] = useState<Array<SubmissionDoc>>([])
  const { eventID, teamID } = useParams()
  const axiosAuth = useAxiosAuth()

  function generateSubmissionData(
    teamSubmissions?: GetAdminEventTeamSubmissionsResponse
  ) {
    setPrelimSubmission([])
    setFinalSubmission([])
    const preEliminaryData = teamSubmissions?.['pre-eliminary']
    const finalData = teamSubmissions?.final

    const combinedData = preEliminaryData?.concat(finalData ?? [])

    combinedData?.forEach(data => {
      const stage = capitalizeFirstLetter(data.requirement.stage)

      let currentDoc: SubmissionDoc = {
        req_id: data.requirement.typeId,
        title: data.requirement.typeName,
        stage: capitalizeFirstLetter(data.requirement.stage) as 'Final' | 'Pre-eliminary',
        file_name: '-',
        file_url: '',
        status: 'Not Submitted',
        feedback: ''
      }

      // If there is a submission, update the currentDoc
      if (data.submission && data.submission.media) {
        currentDoc = {
          ...currentDoc,
          file_name: data.submission.media.name,
          file_url: data.submission.media.url,
          feedback: data.submission.judgeResponse || undefined,
          status: data.submission.judgeResponse ? 'Change Needed' : 'Submitted'
        }
      }

      const deadline = new Date(data.requirement.deadline ?? Date.now())
      const currentDate = new Date()
      if (currentDate > deadline) {
        if (currentDoc.status === 'Waiting') {
          currentDoc.status = 'Not Submitted'
        }
      }

      // Add submission to the correct stage
      if (stage.toLowerCase().includes('final')) {
        setFinalSubmission(prev => [...prev, currentDoc])
      } else {
        setPrelimSubmission(prev => [...prev, currentDoc])
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (teamID && typeof teamID === 'string') {
        const response = (
          await getAdminEventTeamSubmissions({
            client: axiosAuth,
            path: { eventId: eventID as string, teamId: teamID }
          })
        )?.data

        generateSubmissionData(response)
      }
    }
    fetchData()
  }, [teamID, axiosAuth])

  const refetchData = async () => {
    if (teamID && typeof teamID === 'string') {
      const response = (
        await getAdminEventTeamSubmissions({
          client: axiosAuth,
          path: { eventId: eventID as string, teamId: teamID }
        })
      )?.data

      generateSubmissionData(response)
    }
  }

  return (
    <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-[2rem] pb-[4rem] pt-[1rem] font-dmsans shadow-lg">
      <div className="flex flex-col gap-[3rem]">
        {/* Pre-eliminary submissions */}
        <EventTeamStatus
          teamID={teamID as string}
          eventID={eventID as string}
          qual={teamData.preeliminaryStatus}
          stage="Pre-eliminary"
          qualifications={NOT_FINAL_QUALIFICATIONS}
          stageSuccess={['Pass']}
          stageFailed={['Not Pass']}
        />
        <EventSubmissionSection
          stageData={prelimSubmission}
          teamID={teamID as string}
          eventID={eventID as string}
          refetchData={refetchData}
        />

        {/* Final submissions */}
        <EventTeamStatus
          teamID={teamID as string}
          eventID={eventID as string}
          qual={teamData.finalStatus}
          stage={'Final'}
          qualifications={FINAL_QUALIFICATIONS}
          stageWin={['Juara 1', 'Juara 2', 'Juara 3']}
          // stageSuccess={submission.stageSuccess}
          stageFailed={[]}
        />
        <EventSubmissionSection
          stageData={finalSubmission}
          teamID={teamID as string}
          eventID={eventID as string}
          refetchData={refetchData}
        />
      </div>
    </div>
  )
}
