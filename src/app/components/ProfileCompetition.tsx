"use client"

import { MdCheck, MdExitToApp, MdLink } from 'react-icons/md'
import { useState } from 'react'

interface ProfileCompetitionProps {
  competitionName: string
  name: string
  team: string
  joinCode: string
  isVerified: boolean
}

function ProfileCompetition({
  competitionName,
  name,
  team,
  joinCode,
  isVerified
}: ProfileCompetitionProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  // Function to copy join code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinCode).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  // Logic to handle leave team
  const leaveTeam = () => {}

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <h1 className="text-3xl font-bold text-white [text-shadow:0px_0px_17.7px_0px_#FFFFFF80] md:text-5xl">
        {competitionName}
      </h1>
      <div className="flex w-full flex-row justify-between gap-8 rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:p-10">
        <div className="flex flex-col gap-5 md:w-full md:flex-row md:justify-between">
          {/* Profile */}
          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-2xl font-bold text-white md:text-4xl">{name}</h1>
            <h3 className="text-sm text-white opacity-80 md:text-xl">{team}</h3>
            <h3
              className={`text-sm md:text-xl ${isVerified ? 'text-green-200' : 'text-red-200'}`}>
              {isVerified ? 'Verified' : 'Not Verified'}
            </h3>
          </div>

          {/* Join Code */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-row items-center justify-between gap-4 self-start rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] px-2 py-3 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:gap-6 md:px-4 md:py-5">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white md:text-4xl">{joinCode}</h1>
                <h3 className="text-sm text-white opacity-80 md:text-xl">Join Code</h3>
              </div>

              {/* Copy Code */}
              <button
                onClick={copyToClipboard}
                className="text-xl text-white md:text-3xl">
                {copySuccess ? <MdCheck /> : <MdLink />}
              </button>
            </div>
          </div>
        </div>

        {/* Leave Team */}
        <div className="flex flex-col justify-start md:justify-center">
          <button onClick={leaveTeam} className="mt-3 md:mt-0" type="button">
            <MdExitToApp className="text-3xl text-red-200 md:text-4xl" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompetition