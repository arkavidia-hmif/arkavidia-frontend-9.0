'use client'
import React, { useState, useEffect } from 'react'
import ComponentBox from './ComponentBox'

interface CountdownProps {
  eventName?: string
  eventDate?: Date | null
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getDateText(date: Date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(2)
  return `${day}/${month}/${year}`
}

function calculateTimeLeft(endDate?: Date): TimeLeft {
  if (!endDate) {
    return {
      days: -1,
      hours: -1,
      minutes: -1,
      seconds: -1
    }
  }

  const total = endDate.getTime() - Date.now()

  if (total <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000)
  }
}

function CountdownPart({ type, number }: { type: string; number: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <p className="bg-gradient-to-r from-[#CE6AFF] to-[#FF71A0] bg-clip-text font-belanosima text-[56px] text-transparent xl:text-[64px]">
        {number}
      </p>
      <p className="calendarDateTypes font-teachers text-[20px] font-bold xl:text-[24px]">
        {type.toUpperCase()}
      </p>
    </div>
  )
}

function Countdown({ eventName, eventDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    eventDate ? calculateTimeLeft(eventDate) : null
  )

  useEffect(() => {
    if (!eventDate) return

    const timer = setInterval(() => {
      setTimeLeft(eventDate ? calculateTimeLeft(eventDate) : null)
    }, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  const getDisplayNumber = (value: number) => {
    return value === -1 ? '--' : value.toString().padStart(2, '0')
  }

  return (
    <ComponentBox title="Countdown" morespace={true}>
      <div className="w-full px-2">
        <div className="flex w-full justify-between font-dmsans text-[20px]">
          <p className="text-[14px] font-normal xl:text-base">
            {eventName ?? 'Belum ada event'}
          </p>
          <p className="text-[14px] font-bold xl:text-base">
            {eventDate ? getDateText(eventDate) : '-'}
          </p>
        </div>
        <div className="grid grid-cols-1 pb-4">
          <div className="grid grid-cols-3 gap-x-2 text-center">
            <CountdownPart type="days" number={getDisplayNumber(timeLeft?.days ?? -1)} />
            <p className="font-belanosima text-[48px] xl:text-[64px]">:</p>
            <CountdownPart
              type="hours"
              number={getDisplayNumber(timeLeft?.hours ?? -1)}
            />
          </div>
          <div className="grid grid-cols-3 gap-x-2 text-center">
            <CountdownPart
              type="minutes"
              number={getDisplayNumber(timeLeft?.minutes ?? -1)}
            />
            <p className="font-belanosima text-[48px] xl:text-[64px]">:</p>
            <CountdownPart
              type="seconds"
              number={getDisplayNumber(timeLeft?.seconds ?? -1)}
            />
          </div>
        </div>
      </div>
    </ComponentBox>
  )
}

export default Countdown
