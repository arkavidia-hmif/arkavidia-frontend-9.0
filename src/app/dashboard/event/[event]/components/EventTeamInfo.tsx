'use client'

import React, { useState, useEffect } from 'react'
import { TeamData } from '~/app/components/competition/TeamInformationContent'
import VerificationBox, {
  VerificationBoxMessage
} from '~/app/components/competition/VerificationBox'
import Loading from '~/app/components/Loading'
import { ProfileData } from '~/app/components/competition/TeamInformationContent'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import {
  getEventTeam,
  getEventTeamByTeamId,
  GetEventTeamByTeamIdResponse,
  getUser,
  User
} from '~/api/generated'
import { checkMemberVerification, getEventNameSlug } from './event-dashboard-utils'

export interface TeamMember {
  name: string
  verified: boolean
  title: string
  id: string
}

interface TeamInformation {
  teamName: string
  teamId: string
  teamMembers: TeamMember[]
}

interface CurrentUser {
  id: string
  role: string
}

function EventTeamInfo({
  eventName,
  teamData,
  user
}: {
  eventName: string
  teamData?: GetEventTeamByTeamIdResponse
  user?: User
}) {
  const [loading, setLoading] = useState(true)
  const [currentUser] = useState<CurrentUser | null>(
    user && user.id && user.role ? { id: user.id, role: user.role } : null
  )
  const [eventMaxTeamMembers, setEventMaxTeamMembers] = useState<number>(1)
  const [userRole, setUserRole] = useState<string>(user?.role ?? 'member')
  const [verificationErrors, setVerificationErrors] = useState<
    VerificationBoxMessage[] | null
  >(null)
  const [teamInformation, setTeamInformation] = useState<TeamInformation | null>(null)

  const { toast } = useToast()
  const authAxios = useAxiosAuth()

  async function fetchUserAndTeamData() {
    try {
      if (teamData && currentUser) {
        const maxTeamMember = teamData.event?.maxTeamMember ?? 1
        setEventMaxTeamMembers(maxTeamMember)

        // Process member data
        const teamMembers = teamData.teamMembers
        setVerificationErrors(null)

        const transformedMembers = Array.isArray(teamMembers)
          ? teamMembers.map(member => {
              if (member.userId === currentUser.id) {
                setUserRole(member.role)
              }

              if (
                member.user?.document &&
                member.user?.document?.[0].verificationError &&
                member.user?.document?.[0].verificationError.length
              ) {
                const userIdentityCardError = {
                  username: member.user?.fullName || 'No name data',
                  type: 'Kartu identitas',
                  message: member.user?.document?.[0].verificationError
                }
                setVerificationErrors(prev =>
                  prev ? [...prev, userIdentityCardError] : [userIdentityCardError]
                )
              }

              member.document?.forEach(doc => {
                if (doc.verificationError && doc.verificationError.length) {
                  const verif = {
                    username: member.user?.fullName || 'No name data',
                    type: doc.type,
                    message: doc.verificationError
                  }
                  setVerificationErrors(prev => (prev ? [...prev, verif] : [verif]))
                }
              })

              return {
                name: member.user?.fullName || 'No Name',
                verified: checkMemberVerification(member) || false,
                title: member.role || 'Member',
                id: member.userId || 'null'
              }
            })
          : []

        setTeamInformation({
          teamName: teamData.name || 'No Team Name',
          teamId: teamData.id || 'No Team ID',
          teamMembers: transformedMembers
        })
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user data.\n Error: ' + err,
        variant: 'destructive'
      })
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  useEffect(() => {
    fetchUserAndTeamData()
  }, [teamData])

  if (loading) {
    return (
      <div className="relative flex w-full gap-x-2 pb-20">
        <Loading isSmallVariant={true} />
        <p>Loading team info</p>
      </div>
    )
  }

  if (!teamInformation || !teamInformation.teamName || !teamInformation.teamId) {
    return <div>No Team Information Found</div>
  }

  if (!currentUser || !currentUser.id || !currentUser.role) {
    toast({
      title: 'Error',
      description: 'User not found',
      variant: 'destructive',
      duration: 8000
    })
    return 'User data not found'
  }

  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg border border-[rgba(255,255,255,0.80)] bg-[linear-gradient(93deg,rgba(2,2,2,0.30)_7.52%,rgba(113,56,192,0.60)_104.77%)] px-10 py-20 shadow-lg md:flex-row md:gap-12 lg:gap-16">
      <div className="flex w-1/2 flex-col gap-8">
        <TeamData
          name={teamInformation.teamName}
          title="Team Name"
          teamId={teamInformation.teamId}
          userRole={currentUser?.role ?? 'member'}
          isEditable={eventMaxTeamMembers !== 1}
          isEvent={true}
        />
        {teamInformation.teamMembers.map((member, index) => (
          <ProfileData
            key={index}
            verified={member.verified}
            name={member.name}
            title={member.title}
            userRole={currentUser?.role}
            teamId={teamInformation.teamId}
            userId={member.id}
            currentUserId={currentUser?.id}
          />
        ))}
      </div>
      <VerificationBox verifications={verificationErrors} />
    </div>
  )
}

export default EventTeamInfo
