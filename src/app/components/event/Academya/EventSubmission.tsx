'use client'

import { useEffect, useState } from 'react'
import {
  getAdminEventTeamSubmissions,
  GetAdminEventTeamSubmissionsResponse,
  getAdminEventTeamInformation,
  EventTeam
  
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { capitalizeFirstLetter } from '~/lib/utils'
import EventSubmissionSection from './EventSubmissionSection'
import { SubmissionDoc } from '../../team-lists/detail/SubmissionTable'
import { useParams,  useRouter } from 'next/navigation'
import { EventTeamStatus } from './EventTeamStatus'
import { useToast } from '~/hooks/use-toast'

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

export default function EventSubmission({}: {}) {
  const [prelimSubmission, setPrelimSubmission] = useState<Array<SubmissionDoc>>([])
  const [finalSubmission, setFinalSubmission] = useState<Array<SubmissionDoc>>([])
  const params = useParams()
  const axiosAuth = useAxiosAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [teamData, setTeamData] = useState<EventTeam>()
  
  const teamID = params.team as string // If using teamID, change params.team to params.teamID
  const eventID = params.event as string // Same with event

  const fetchTeamData = async () => {
    const response = await getAdminEventTeamInformation({
      client: axiosAuth,
      path: { teamId: teamID, eventId: eventID }
    })

    if (!response || response.error || response.status !== 200 || !response.data) {
      toast({
        title: 'Failed fetching team data',
        variant: 'destructive'
      })
      router.replace('/404')
      return
    }

    const responseData = response?.data as EventTeam

    setTeamData(responseData)
  }

  function generateSubmissionData(
    teamSubmissions?: GetAdminEventTeamSubmissionsResponse
  ) {
    const prelimSubmissions: SubmissionDoc[] = []
    const finalSubmissions: SubmissionDoc[] = []
  
    const preEliminaryData = teamSubmissions?.['pre-eliminary']
    const finalData = teamSubmissions?.final
    // console.log(preEliminaryData, finalData)
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
  
      if (data.submission && data.submission.media) {
        currentDoc = {
          ...currentDoc,
          file_name: data.submission.media.name,
          file_url: data.submission.media.url,
          feedback: data.submission.judgeResponse || undefined,
          status: data.submission.judgeResponse ? 'Change Needed' : 'Submitted'
        }
      }
  
      if (data.requirement.deadline) {
        const deadline = new Date(data.requirement.deadline)
        const currentDate = new Date()
        if (currentDate > deadline) {
          if (currentDoc.status === 'Waiting') {
            currentDoc.status = 'Not Submitted'
          }
        }
      }
  
      if (stage.toLowerCase().includes('final')) {
        finalSubmissions.push(currentDoc)
      } else {
        prelimSubmissions.push(currentDoc)
      }
    })
  
    setPrelimSubmission(prelimSubmissions)
    setFinalSubmission(finalSubmissions)
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

        // ! Delete groupedResult if API fixed
        generateSubmissionData(response?.groupedResult)
      }
    }
    fetchData()
    fetchTeamData()
  }, [teamID, axiosAuth])
  
  const refetchData = async () => {
    if (teamID && typeof teamID === 'string') {
      const response = (
        await getAdminEventTeamSubmissions({
          client: axiosAuth,
          path: { eventId: eventID as string, teamId: teamID }
        })
      )?.data
      
      // TODO: delete grouped result from API
      // ! Delete groupedResult if API fixed
      generateSubmissionData(response?.groupedResult)
    }
  }

  if (!teamData) {
    return null;
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
