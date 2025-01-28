'use client'

import { Tab } from '~/app/components/Tab'
import TeamInfo from '~/app/components/team-lists/detail/TeamInfo'
import Submission from '~/app/components/team-lists/detail/Submission'
import { useEffect, useState } from 'react'
import {
  getCompetitionById,
  getAdminCompetitionTeamSubmissions,
  getAdminCompetitionTeamInformation,
  GetAdminCompetitionTeamInformationResponse,
  GetAdminCompetitionTeamSubmissionsResponse
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useParams, useRouter } from 'next/navigation'
import Hero from '~/app/components/team-lists/detail/Hero'

type Competition = 'CP' | 'CTF' | 'Hackvidia' | 'UXvidia' | 'Datavidia'

const URL_PLACEHOLDER = 'https://picsum.photos/200/300'

const payment_placeholder = {
  url: URL_PLACEHOLDER,
  typeID: '12'
}

const submission_placeholder = [
  {
    name: 'Participant 1',
    studentCard: URL_PLACEHOLDER,
    poster: URL_PLACEHOLDER,
    twibbon: URL_PLACEHOLDER
  },
  {
    name: 'Participant 2',
    studentCard: URL_PLACEHOLDER,
    poster: URL_PLACEHOLDER,
    twibbon: URL_PLACEHOLDER
  },
  {
    name: 'Participant 3',
    studentCard: URL_PLACEHOLDER,
    poster: URL_PLACEHOLDER,
    twibbon: URL_PLACEHOLDER
  }
]

function TeamDetails() {
  const router = useRouter()
  const params = useParams()
  const [competition, setCompetition] = useState<Competition>()
  const [teamData, setTeamData] = useState<GetAdminCompetitionTeamInformationResponse>()
  const [submissionData, setSubmissionData] = useState<GetAdminCompetitionTeamSubmissionsResponse>();
  const axiosAuth = useAxiosAuth()

  async function validateCompetition(value: string | null): Promise<boolean> {
    if (!value) {
      return false
    }
    const resp = await getCompetitionById({
      client: axiosAuth,
      path: {
        competitionId: value
      }
    })

    if (resp.error || !resp.data) {
      return false
    }
    setCompetition(resp.data.title as Competition)

    // TODO: Uncomment this when the competition ID is finalized
    return ['CP', 'CTF', 'Hackvidia', 'UXvidia', 'Datavidia'].includes(
      value as Competition
    )
  }

  useEffect(() => {
    const competitionParam = params.competitionID as string

    if (!competitionParam || !validateCompetition(competitionParam)) {
      router.push('/404')
      return
    }

    let isMounted = true

    const fetchTeamData = async () => {
      const resp = await getAdminCompetitionTeamInformation({
        client: axiosAuth,
        path: {
          teamId: params.teamID as string,
          competitionId: competitionParam
        }
      })

      if (resp.error || !resp.data) {
        router.push('/404')
        return
      }

      if (isMounted) {
        setTeamData(resp.data)
      }
    }

    // TODO: Integrate
    const fetchTeamSubmission = async () => {
      const resp = await getAdminCompetitionTeamSubmissions({
        client: axiosAuth,
        path: {
          competitionId: competitionParam,
          teamId: params.teamID as string
        }
      })

      if(resp.error || !resp.data){
        router.push("/404")
        return
      }


    }

    fetchTeamData()
    fetchTeamSubmission()

    return () => {
      isMounted = false
    }
  }, [params, axiosAuth])

  if (!teamData) {
    return
  }

  const PaymentProofDocument = teamData.document?.find(
    doc => doc.type === 'bukti-pembayaran'
  )

  const PaymentProofMediaId = {
    url: PaymentProofDocument?.isVerified ? PaymentProofDocument.media.url : '',
    typeID: PaymentProofDocument?.isVerified ? PaymentProofDocument.mediaId : ''
  }

  return (
    <div
      className="flex min-h-screen flex-col gap-7 bg-gradient-to-r from-[#1F0246] to-[#2E046A] px-4"
      style={{
        backgroundImage: "url('/images/profile/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
      <Hero
        teamName={teamData.name}
        teamID={'#' + teamData.joinCode}
        teamStatus={
          teamData.verificationStatus === 'VERIFIED' ? 'Verified' : 'Not Verified'
        }
        teamStage={teamData.stage}
      />
      {competition &&
        (competition === 'UXvidia' || competition === 'Datavidia' ? (
          <Tab
            contentType={['Team Information', 'Submission']}
            content={[
              <TeamInfo
                key="team-info"
                members={teamData?.teamMembers}
                paymentProof={PaymentProofMediaId}
                teamID={teamData.id}
                submissionsTypeID={}
                existsSubmission
              />,
              <Submission key="submission" />
            ]}
          />
        ) : (
          <Tab
            contentType={['Team Information']}
            content={[
              <TeamInfo
                key="team-info"
                members={teamData?.teamMembers}
                paymentProof={payment_placeholder}
                submissionsTypeID={submission_placeholder}
                teamID={teamData.id}
              />
            ]}
          />
        ))}
    </div>
  )
}

export default TeamDetails
