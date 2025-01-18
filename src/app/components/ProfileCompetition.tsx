"use client"

import { MdCheck, MdExitToApp, MdLink } from 'react-icons/md'
import { useState, useEffect } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { User, Team, postQuitTeam } from '~/api/generated'

interface ProfileCompetitionProps {
  competitionName: string
}

function ProfileCompetition({
  competitionName
}: ProfileCompetitionProps) {

  const authAxios = useAxiosAuth()

  const [profileData, setProfileData] = useState({
    name: '',
    team: '',
    joinCode: '',
    isVerified: false,
    teamId: '',
  })
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authAxios.get({ url: '/User' })
        const userData = userResponse.data as User

        const teamResponse = await authAxios.get({ url: '/Team' })
        const teamData = teamResponse.data as Team

        setProfileData({
          name: userData.fullName || '',
          team: teamData.name || '',
          teamId: teamData.id || '',
          joinCode: teamData.joinCode || '',
          isVerified: teamData.isVerified || false,
        })
      } catch (error) {
        alert('error fetching data' + error)
      }
    }

    fetchData()
  }
  , [])


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
      if (!profileData.teamId) {
        alert("No team ID found. Cannot leave team.")
        return
      }

      const response = await postQuitTeam({
        path: { teamId: profileData.teamId },
      })
      window.location.reload()
      alert('Successfully left team'+ response)
    } catch (error) {
      alert('error leaving team' + error)
    }
  }


  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <h1 className="text-3xl font-bold text-white [text-shadow:0px_0px_17.7px_0px_#FFFFFF80] md:text-5xl">
        {competitionName}
      </h1>
      <div className="flex w-full flex-row justify-between gap-8 rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:p-10">
        <div className="flex flex-col gap-5 md:w-full md:flex-row md:justify-between">
          {/* Profile */}
          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-2xl font-bold text-white md:text-4xl">{profileData.name}</h1>
            <h3 className="text-sm text-white opacity-80 md:text-xl">{profileData.team}</h3>
            <h3
              className={`text-sm md:text-xl ${profileData.isVerified ? 'text-green-200' : 'text-red-200'}`}>
              {profileData.isVerified ? 'Verified' : 'Not Verified'}
            </h3>
          </div>

          {/* Join Code */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-row items-center justify-between gap-4 self-start rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] py-3 px-4 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:gap-6 md:py-5 md:px-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white md:text-4xl">#{profileData.joinCode}</h1>
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
          <div onClick={leaveTeam} className="mt-3 md:mt-0 hover:cursor-pointer">
            <MdExitToApp className="text-3xl text-red-200 md:text-4xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompetition
