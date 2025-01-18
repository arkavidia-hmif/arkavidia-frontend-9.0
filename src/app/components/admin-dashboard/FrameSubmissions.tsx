'use client'
import React from 'react'
import FrameTugas from './FrameTugas'

const FrameSubmissions = () => {
  return (
    <div
      style={{
        background:
          'linear-gradient(90.68deg, rgba(255,255,255,0.24) 0.11%, rgba(255,255,255,0.08) 99.1%)',
        boxShadow: '0px 0px 8px 0px #F5F5F580'
      }}
      className="flex flex-grow items-center justify-between gap-3 rounded-lg border border-white/25 px-6 py-5 font-teachers">
      <div className="flex flex-grow flex-col">
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
          Submission
        </h2>
        <h3 className="font-dmsans text-base text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
          Track the number of participants who have submitted each task
        </h3>

        {/* List Tugas */}
        <div className="mt-4 flex flex-col gap-4">
          <FrameTugas title={'Tugas 1'} deadline={'12/12/2021 00:00 WIB'} />
          <FrameTugas title={'Tugas 2'} deadline={'12/12/2021 00:00 WIB'} />
          <FrameTugas title={'Tugas 3'} deadline={'12/12/2021 00:00 WIB'} />
        </div>
      </div>
    </div>
  )
}

export default FrameSubmissions
