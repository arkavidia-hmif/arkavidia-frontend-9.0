'use client'

import { useCountdown } from '~/hooks/useCountdown'
import { TimeSection } from '~/app/components/event/Academya/TimeSection'

interface CountdownProps {
  targetDate: Date
}

export default function Countdown({ targetDate }: CountdownProps) {
  const { days, hours, minutes, isComplete } = useCountdown(targetDate)

  return (
    <div className="flex items-center gap-4">
      <TimeSection value={days} label="Days" />
      <TitikDua />
      <TimeSection value={hours} label="Hours" />
      <TitikDua />
      <TimeSection value={minutes} label="Minutes" />
    </div>
  )
}

function TitikDua() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-24 flex-col justify-center">
        <div className="flex flex-col gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>
      <div className="h-8" />
    </div>
  )
}
