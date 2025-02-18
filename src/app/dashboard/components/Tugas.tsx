import React from 'react'

const getTriggerColor = (status: string): string => {
  if (status === 'past due') return 'bg-gradient-to-r from-white/20 to-[#E50000]/80'
  if (status === 'notopened') return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
  if (status === 'ongoing') return 'bg-gradient-to-r from-white/20 to-[#FFCC00CC]/80'
  if (status === 'completed') return 'bg-gradient-to-r from-white/20 to-[#4D06B0CC]/80'
  if (status === 'unknown') return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
  return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
}

function Tugas({
  title,
  link,
  date,
  status
}: {
  title?: string
  link?: string
  date?: string
  status: string
}) {
  return (
    <div>
      <div
        className={`flex items-center justify-between rounded-xl border border-[#E66DD0] ${getTriggerColor(status)} px-3 py-2 leading-7 transition-all duration-100 xl:py-3`}>
        <span className="font-teachers text-[14px] font-bold xl:text-base">
          {title ? title : 'Unknown Submission '}
        </span>
        <span className="hidden font-dmsans text-[14px] font-bold text-white xl:block">
          {date ? date : 'Unknown Deadline'}{' '}
        </span>
      </div>
    </div>
  )
}

export default Tugas
