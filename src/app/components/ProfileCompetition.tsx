'use client'

import { MdCheck, MdExitToApp, MdLink } from 'react-icons/md'
import { useState, useEffect } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { Team, postQuitTeam, getUser, getTeams, User } from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import { expandCompetitionName } from '~/lib/utils'

interface ProfileCompetitionProps {
  competitionName: string
}

function getCompeName(slug: string) {
  switch (slug) {
    case 'CP':
      return 'cp'
    case 'CTF':
      return 'ctf'
    case 'UXvidia':
      return 'uxvidia'
    case 'Arkalogica':
      return 'arkalogica'
    case 'Datavidia':
      return 'datavidia'
    case 'Hackvidia':
      return 'hackvidia'
    default:
      break
  }
}

function ProfileCompetition({ competitionName }: ProfileCompetitionProps) {
  const authAxios = useAxiosAuth()
  const { toast } = useToast()

  const [userData, setUserData] = useState<User>()
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [activeTeamId, setActiveTeamId] = useState('')
  const [profileData, setProfileData] = useState({
    name: '',
    team: '',
    joinCode: '',
    isVerified: false,
    teamId: ''
  })
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userReq = await getUser({ client: authAxios })
        const userData = userReq.data

        if (userData && userData.id) {
          setUserData(userData)
          // Get user teams
          const teamReq = await getTeams({ client: authAxios })

          if (teamReq.data && teamReq.data.length > 0) {
            setUserTeams(teamReq.data)
            const activeTeamData = teamReq.data.find(
              team =>
                // @ts-ignore
                getCompeName(team.competition.title) === competitionName.toLowerCase()
            )
            setActiveTeamId(activeTeamData?.id || '')
            setProfileData({
              name: userData?.fullName || '',
              team: activeTeamData?.name || '',
              teamId: activeTeamData?.id || '',
              joinCode: activeTeamData?.joinCode || '',
              isVerified: activeTeamData?.isVerified || false
            })
          }
        }
      } catch (error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get user data',
          variant: 'destructive'
        })
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeTeamData = userTeams.find(
          team =>
            // @ts-ignore
            getCompeName(team.competition.title) === competitionName.toLowerCase()
        )
        setActiveTeamId(activeTeamData?.id || '')
        setProfileData({
          name: userData?.fullName || '',
          team: activeTeamData?.name || '',
          teamId: activeTeamData?.id || '',
          joinCode: activeTeamData?.joinCode || '',
          isVerified: activeTeamData?.isVerified || false
        })
      } catch (error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get profile data',
          variant: 'destructive'
        })
      }
    }

    fetchData()
  }, [competitionName])

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
      if (!activeTeamId) {
        toast({
          title: 'No team ID found',
          description: 'Cannot leave team',
          variant: 'destructive'
        })
        return
      }

      const response = await postQuitTeam({
        client: authAxios,
        path: { teamId: activeTeamId }
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
    } catch (error) {
      toast({
        title: 'Failed leaving team',
        description: 'Failed to leave the team',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="mb-4 flex flex-col gap-6 md:mb-8 md:gap-10">
      <h1 className="text-3xl font-bold text-white [text-shadow:0px_0px_17.7px_0px_#FFFFFF80] md:text-5xl">
        {expandCompetitionName(competitionName.toUpperCase())}
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
              className={`text-sm md:text-xl ${profileData.isVerified ? 'text-green-200' : 'text-red-200'}`}>
              {profileData.isVerified ? 'Verified' : 'Not Verified'}
            </h3>
          </div>

          {/* Join Code */}
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
        </div>

        {/* Leave Team */}
        <div className="flex flex-col justify-start md:justify-center">
          <div onClick={leaveTeam} className="mt-3 hover:cursor-pointer md:mt-0">
            <MdExitToApp className="text-3xl text-red-200 md:text-4xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompetition
