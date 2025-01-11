import React from 'react'

interface CountdownPartProps {
  type: 'days' | 'hours' | 'minutes' | 'seconds'
  number: number
}

function CountdownPart({ type, number }: CountdownPartProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <p className="bg-gradient-to-r from-[#CE6AFF] to-[#FF71A0] bg-clip-text font-belanosima text-[64px] text-transparent">
        {number ?? 'XX'}
      </p>
      <p className="calendarDateTypes font-teachers text-[24px] font-bold">
        {type.toUpperCase() ?? 'NULL'}
      </p>
    </div>
  )
}

export default CountdownPart
