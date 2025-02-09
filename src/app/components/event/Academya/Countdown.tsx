'use client'

import { useCountdown } from '~/hooks/useCountdown'
import { TimeSection } from '~/app/components/event/Academya/TimeSection'
import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: Date
}

interface TimeLeft {
  days: string
  hours: string
  minutes: string
}

export default function Countdown({ targetDate }: CountdownProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate)
  return (
    <div className="grid grid-cols-2 items-center gap-8 md:flex md:flex-row md:gap-6">
      <TimeSection value={days ?? '00'} label="Hari" />
      <TitikDua />

      <TimeSection value={hours ?? '00'} label="Jam" />
      <TitikDua />

      <TimeSection value={minutes ?? '00'} label="Menit" />
      <TitikDua />

      <TimeSection value={seconds ?? '00'} label="Detik" />
    </div>
  )
}

function TitikDua() {
  return (
    <div className="hidden flex-col items-center md:flex">
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
