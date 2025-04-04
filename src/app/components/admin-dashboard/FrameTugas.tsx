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
  const formattedDeadline =
    new Date(deadline).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + ' WIB'
  return (
    <div className="from-white/24 to-white/8 flex flex-grow flex-col items-center justify-between gap-3 rounded-xl bg-gradient-to-r px-4 py-4 shadow-[0_0_8px_0_rgba(245,245,245,0.5)] md:flex-row md:px-6 md:py-5">
      <div className="flex flex-col">
        <h3 className="text-center font-teachers text-sm font-bold text-white md:text-left md:text-base">
          {title}
        </h3>
        <p className="text-center font-dmsans text-xs text-white md:text-left">
          {formattedDeadline}
        </p>
      </div>
      <div className="w-full max-w-[100px] md:min-w-96">
        <p className="text-center font-dmsans text-sm md:text-left">
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
