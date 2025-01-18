'use client'
import React, { useEffect } from 'react'
import FrameTugas from './FrameTugas'

interface FrameSubmissionsProps {
  compe_id?: string
  totalTeam: number
}

const FrameSubmissions = ({ compe_id, totalTeam }: FrameSubmissionsProps) => {
  const date = new Date()

  const COMPETITION_SUBMISSIONS = [
    {
      title: 'Tugas 1',
      deadline: '12/12/2021 00:00 WIB',
      submitted: 9122,
      total: 12731
    },
    {
      title: 'Tugas 2',
      deadline: date,
      submitted: 11,
      total: 40
    },
    { title: 'Tugas 3', deadline: '12/12/2021 00:00 WIB', submitted: 0, total: totalTeam }
  ]

  useEffect(() => {
    // fetchCompetitionSubmission(compe_id)
  }, [])

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
          {COMPETITION_SUBMISSIONS.map((item, index) => (
            <FrameTugas
              key={index}
              title={item.title}
              deadline={item.deadline.toLocaleString()}
              submitted={item.submitted}
              total={item.total}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FrameSubmissions
