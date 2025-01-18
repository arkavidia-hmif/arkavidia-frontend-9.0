import React from 'react'
import ProgressBar from '../ProgressBar'

interface FrameTugasProps {
  title: string
  deadline: string
  submitted: number
  total: number
}

const FrameTugas = ({ title, deadline, submitted, total }: FrameTugasProps) => {
  const progress = Math.round((submitted / total) * 10000) / 100
  return (
    <div className="from-white/24 to-white/8 flex flex-grow items-center justify-between gap-3 rounded-xl bg-gradient-to-r px-6 py-5 shadow-[0_0_8px_0_rgba(245,245,245,0.5)]">
      <div className="flex flex-col">
        <h3 className="font-teachers text-base font-bold text-white">{title}</h3>
        <p className="font-dmsans text-xs text-white">{deadline}</p>
      </div>
      <div className="min-w-96">
        <p className="font-dmsans">
          {submitted} of {total} participant(s)
        </p>
        <div className="drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]">
          <ProgressBar progress={progress} />
        </div>
      </div>
    </div>
  )
}

export default FrameTugas
