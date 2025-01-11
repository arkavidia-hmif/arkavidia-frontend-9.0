import React from 'react'
import CountdownPart from './CountdownPart'
import ComponentBox from '../ComponentBox'

interface CountdownProps {
  eventName: string
  eventDate: Date
}

function getDateText(date: Date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear().toString().slice(2)

  return `${day}/${month}/${year}`
}

function getDateDiff(date: Date) {
  const currDate = new Date()
  const countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  if (date < currDate) {
    return countdown
  }

  // Days Left
  if (date.getTime() > currDate.getTime()) {
    const diff = date.getTime() - currDate.getTime()
    countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24))
    countdown.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    countdown.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  }

  return countdown
}

function Countdown({ eventName, eventDate }: CountdownProps) {
  const currentDate = new Date()
  const countdown = getDateDiff(eventDate)

  return (
    <ComponentBox title="Countdown">
      <div className="w-full px-10">
        <div className="flex w-full justify-between font-dmsans text-[20px]">
          <p>{eventName ?? 'Event Name'}</p>
          <p>{getDateText(currentDate) ?? 'DD/MM/YY'}</p>
        </div>
        {/* Countdown */}
        <div className="grid grid-cols-1 pb-4">
          <div className="grid grid-cols-3 gap-x-2 text-center">
            <CountdownPart type="days" number={countdown.days} />
            <p className="font-belanosima text-[64px]">:</p>
            <CountdownPart type="hours" number={countdown.hours} />
          </div>
          <div className="grid grid-cols-3 gap-x-2 text-center">
            <CountdownPart type="minutes" number={countdown.minutes} />
            <p className="font-belanosima text-[64px]">:</p>
            <CountdownPart type="seconds" number={countdown.seconds} />
          </div>
        </div>
      </div>
    </ComponentBox>
  )
}

export default Countdown
