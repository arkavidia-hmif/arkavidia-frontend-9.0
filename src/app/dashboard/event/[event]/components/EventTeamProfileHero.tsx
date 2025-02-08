'use client'

import { MdCheck, MdExitToApp, MdLink } from 'react-icons/md'
import { useState, useEffect } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import {
  expandCompetitionName,
  expandEventName,
  getBeautifulEventName
} from '~/lib/utils'
import Loading from '~/app/components/Loading'
import { Button } from '~/app/components/Button'
import { DangerDialog } from '~/app/components/DangerDialog'
import {
  EventTeam,
  getEventTeam,
  getEventTeamByTeamId,
  GetEventTeamByTeamIdResponse,
  getEventTeamMemberById,
  GetEventTeamResponse,
  getUser,
  postQuitEventTeam,
  User,
  type Event as EventType
} from '~/api/generated'
import { getEventNameSlug } from './event-dashboard-utils'

interface EventTeamProfileProps {
  eventName: string
  userData?: User
  activeTeamData?: GetEventTeamByTeamIdResponse
}

function EventTeamProfileHero({
  eventName,
  userData,
  activeTeamData
}: EventTeamProfileProps) {
  const authAxios = useAxiosAuth()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isUserTeamLeader, setIsUserTeamLeader] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    team: '',
    joinCode: '',
    isVerified: '',
    teamId: '',
    maxTeamMember: 1
  })
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTeamData && userData) {
          const teamVerification = (
            await getEventTeamByTeamId({
              client: authAxios,
              path: {
                teamId: activeTeamData?.id
              }
            })
          ).data?.verificationStatus

          // Check if user is team leader in current shown team
          if (activeTeamData) {
            // Get the team members
            const currentUser = await getEventTeamMemberById({
              client: authAxios,
              path: {
                teamId: activeTeamData.id,
                userId: userData.id
              }
            })

            if (currentUser.data && currentUser.data.role === 'leader') {
              setIsUserTeamLeader(true)
            } else {
              setIsUserTeamLeader(false)
            }
          }
          setProfileData({
            name: userData.fullName || '',
            team: activeTeamData.name || '',
            teamId: activeTeamData.id || '',
            joinCode:
              activeTeamData.event?.maxTeamMember === 3
                ? (activeTeamData.joinCode ?? '')
                : '',
            isVerified: teamVerification || 'Not verified',
            maxTeamMember: activeTeamData.event?.maxTeamMember || 1
          })
          setIsLoading(false)
        }
      } catch (error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get data. Error: ' + error,
          variant: 'destructive'
        })
      }
    }

    fetchData()
  }, [])

  // Function to copy join code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileData.joinCode).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  // Logic to handle leave team
  const leaveTeam = async () => {
    try {
      if (!activeTeamData || !activeTeamData.id) {
        toast({
          title: 'No team ID found',
          description: 'Cannot leave team',
          variant: 'destructive'
        })
        return
      }

      const response = await postQuitEventTeam({
        client: authAxios,
        path: { teamId: activeTeamData.id }
      })

      if (response.error) {
        toast({
          title: 'Failed leaving team',
          description: 'Failed to leave the team',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Left team',
        description: 'You have left the team',
        variant: 'success'
      })
      setTimeout(() => {
        window.location.replace('/dashboard')
      }, 500)
    } catch (error) {
      toast({
        title: 'Failed leaving team',
        description: 'Failed to leave the team',
        variant: 'destructive'
      })
    }
  }

  function getVerifyStatusColor(status: string | null | undefined) {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-200'
      case 'NOT_VERIFIED':
        return 'text-red-200'
      case 'WAITING':
        return 'text-yellow-200'
      case 'ON REVIEW':
        return 'text-yellow-200'
      case 'DENIED':
        return 'text-red-200'
      default:
        return 'text-lilac-200'
    }
  }

  if (isLoading) {
    return (
      <>
        <h1 className="mb-4 text-3xl font-bold text-white [text-shadow:0px_0px_17.7px_0px_#FFFFFF80] md:text-5xl">
          {getBeautifulEventName(eventName.toUpperCase())}
        </h1>
        <div className="relative w-full pb-20">
          <Loading isSmallVariant={true} />
        </div>
      </>
    )
  }
  return (
    <div className="mb-4 flex flex-col gap-6 md:mb-8 md:gap-10">
      <h1 className="text-3xl font-bold text-white [text-shadow:0px_0px_17.7px_0px_#FFFFFF80] md:text-5xl">
        {getBeautifulEventName(eventName.toUpperCase())}
      </h1>
      <div className="flex w-full flex-row justify-between gap-8 rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] md:p-10">
        <div className="flex flex-col gap-5 md:w-full md:flex-row md:justify-between">
          {/* Profile */}
          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-2xl font-bold text-white md:text-4xl">
              {profileData.team}
            </h1>
            {/* <h3 className="text-sm text-white opacity-80 md:text-xl">
              {profileData.team}
            </h3> */}
            <h3
              className={`text-sm md:text-xl ${getVerifyStatusColor(profileData.isVerified)} capitalize`}>
              {profileData.isVerified.toLowerCase()}
            </h3>
          </div>

          {/* Join Code */}
          {profileData.joinCode && (
            <div className="flex flex-col justify-center">
              <div className="flex flex-row items-center justify-between gap-4 self-start rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] px-4 py-3 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] md:gap-6 md:px-6 md:py-5">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-white md:text-4xl">
                    {profileData.joinCode}
                  </h1>
                  <h3 className="text-sm text-white opacity-80 md:text-xl">Join Code</h3>
                </div>

                {/* Copy Code */}
                <button
                  onClick={copyToClipboard}
                  className="text-2xl text-white md:text-4xl">
                  {copySuccess ? <MdCheck /> : <MdLink />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leave Team */}
        <div className="flex flex-col justify-start md:justify-center">
          <DangerDialog
            title={profileData.maxTeamMember === 1 ? 'Leave Event' : 'Leave Team Event'}
            message={`Apakah anda yakin ingin meninggalkan ${profileData.maxTeamMember === 1 ? 'event' : 'tim event'}?`}
            actionText="Tinggalkan"
            dangerWarning={
              isUserTeamLeader
                ? 'Tim event ini akan dihapus karena Anda adalah ketua tim!'
                : undefined
            }
            action={leaveTeam}>
            <div className="mt-3 hover:cursor-pointer md:mt-0">
              <MdExitToApp className="text-3xl text-red-200 md:text-4xl" />
            </div>
          </DangerDialog>
        </div>
      </div>
    </div>
  )
}

export default EventTeamProfileHero
