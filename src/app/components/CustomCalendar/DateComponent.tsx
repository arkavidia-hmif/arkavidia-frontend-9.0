import { format } from 'date-fns'
import React from 'react'
import './calendar.css'

interface DateComponentProps {
  day: Date
  currentDate: Date
  isEventDate?: boolean
}

function DateComponent({ day, currentDate, isEventDate = false }: DateComponentProps) {
  const isCurrentDate = format(day, 'dd-MM-yyyy') === format(new Date(), 'dd-MM-yyyy')
  return (
    <div
      className={`text-ba flex h-9 w-9 items-center justify-center font-dmsans font-semibold ${format(day, 'MM-yyyy') !== format(currentDate, 'MM-yyyy') ? 'text-gray-400' : ''} ${isCurrentDate ? 'rounded-full bg-white/20' : ''} cursor-default ${isEventDate ? 'eventDate rounded-full' : ''} `}>
      {format(day, 'd')}
    </div>
  )
}

export default DateComponent
