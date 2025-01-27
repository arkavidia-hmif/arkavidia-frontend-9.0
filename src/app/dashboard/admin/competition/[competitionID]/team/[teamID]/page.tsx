'use client'

import { Tab } from '~/app/components/Tab'
import TeamInfo from '~/app/components/team-lists/detail/TeamInfo'
import Submission from '~/app/components/team-lists/detail/Submission'
import { useCallback, useEffect, useState } from 'react'
import {
  getCompetitionById,
  getAdminCompetitionTeamInformation,
  GetAdminCompetitionTeamInformationResponse,
  TeamMemberDocument,
  UserDocument
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import Hero from '~/app/components/team-lists/detail/Hero'
import { getTeamStatus } from '~/app/components/registered-teamlist/teamlist'

type Competition = 'CP' | 'CTF' | 'Hackvidia' | 'UXvidia' | 'Datavidia'

type submissionsTypeID = {
  name: string
  studentCard: UserDocument | null
  poster: TeamMemberDocument | null
  twibbon: TeamMemberDocument | null
}[]

/* ASSUMPTIONS
 * IF there are for example several payment proofs or posters or twibbons, frontend WILL only get the latest file
 */

function TeamDetails() {
  const router = useRouter()
  const params = useParams()
  const [competition, setCompetition] = useState<Competition>()
  const [teamData, setTeamData] = useState<GetAdminCompetitionTeamInformationResponse>()
  const [teamSubmission, setTeamSubmission] = useState<submissionsTypeID>()
  const [competitionID, setCompetitionID] = useState<string>('')

  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()

  // Validate competition function
  const validateCompetition = useCallback(
    async (value: string | null): Promise<boolean> => {
      if (!value) {
        return false
      }
      const resp = await getCompetitionById({
        client: axiosAuth,
        path: {
          competitionId: value
        }
      })

      if (resp.error || !resp.data || resp.status !== 200) {
        return false
      }
      setCompetition(resp.data.title as Competition)
      return true
    },
    [axiosAuth]
  )

  // Fetch team data function
  const fetchTeamData = useCallback(async () => {
    const competitionParam = params.competitionID as string
    const teamIdParam = params.teamID as string

    const resp = await getAdminCompetitionTeamInformation({
      client: axiosAuth,
      path: {
        teamId: teamIdParam,
        competitionId: competitionParam
      }
    })

    if (resp.error || !resp.data) {
      const responseError = resp.error

      if ('validationErrors' in responseError) {
        toast({
          title: 'Validation Error of fetching team data',
          description: 'Unknown validation error.',
          variant: 'destructive'
        })
      } else if ('error' in responseError) {
        toast({
          title: 'Failed to fetch team data',
          description: responseError.error || 'An unknown error occurred.',
          variant: 'destructive'
        })
      }
      router.replace('/404')
      return
    }

    setTeamData(resp.data)
  }, [axiosAuth, params.competitionID, params.teamID, router, toast])

  // Process team submission data
  const processTeamSubmission = useCallback(
    (teamData: GetAdminCompetitionTeamInformationResponse) => {
      const tempTeamSubmission: submissionsTypeID = []
      teamData.teamMembers?.forEach(member => {
        let latestPoster: TeamMemberDocument | null = null
        let latestTwibbon: TeamMemberDocument | null = null

        const documents: TeamMemberDocument[] = Array.isArray(member.document)
          ? member.document
          : member.document
            ? [member.document]
            : []

        for (const doc of documents) {
          if (doc.type === 'poster') {
            if (
              !latestPoster ||
              new Date(doc.media.createdAt) > new Date(latestPoster.media.createdAt)
            ) {
              latestPoster = doc
            }
          } else if (doc.type === 'twibbon') {
            if (
              !latestTwibbon ||
              new Date(doc.media.createdAt) > new Date(latestTwibbon.media.createdAt)
            ) {
              latestTwibbon = doc
            }
          }
        }

        tempTeamSubmission.push({
          name: member.user?.fullName || '',
          studentCard:
            member.user?.document?.find(
              (doc: UserDocument) => doc.type === 'kartu-identitas'
            ) || null,
          twibbon: latestTwibbon || null,
          poster: latestPoster || null
        })
      })

      setTeamSubmission(tempTeamSubmission)
    },
    []
  )

  // Initial data fetch
  useEffect(() => {
    const competitionParam = params.competitionID as string

    if (!competitionParam || !validateCompetition(competitionParam)) {
      toast({
        title: 'Competition not found',
        variant: 'destructive'
      })
      router.replace('/404')
      return
    }

    fetchTeamData()
    setCompetitionID(competitionParam)
  }, [params, validateCompetition, fetchTeamData, router, toast])

  // Process submission data when teamData changes
  useEffect(() => {
    if (!teamData) return
    processTeamSubmission(teamData)
  }, [teamData, processTeamSubmission])

  if (!teamData) {
    return null
  }

  // Get latest payment proof
  const paymentProof = (() => {
    if (!teamData.document || teamData.document.length === 0) {
      return null
    }
    return teamData.document.reduce((latest, current) =>
      new Date(current.media.createdAt) > new Date(latest.media.createdAt)
        ? current
        : latest
    )
  })()

  // Refetch handler that will be passed to TeamInfo
  const handleRefetch = async () => {
    await fetchTeamData()
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
        teamStatus={getTeamStatus(teamData)}
        teamStage={teamData.stage}
      />
      {competition &&
        (competition === 'UXvidia' || competition === 'Datavidia' ? (
          <Tab
            contentType={['Team Information', 'Submission']}
            content={[
              <TeamInfo
                key="team-info"
                competitionID={competitionID}
                members={teamData?.teamMembers}
                paymentProof={paymentProof}
                teamID={teamData.id}
                submissionsTypeID={teamSubmission}
                existsSubmission
                onRefetch={handleRefetch}
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
                competitionID={competitionID}
                members={teamData?.teamMembers}
                paymentProof={paymentProof}
                submissionsTypeID={teamSubmission}
                teamID={teamData.id}
                onRefetch={handleRefetch}
              />
            ]}
          />
        ))}
    </div>
  )
}

export default TeamDetails
