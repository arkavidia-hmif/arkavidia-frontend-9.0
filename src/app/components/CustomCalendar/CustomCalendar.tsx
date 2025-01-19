'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths
} from 'date-fns'
import CalendarNavButton from './CalendarNavButton'
import Dropdown from '../Dropdown'
import { Select } from '../ui/select'
import MonthNYearSelect from './MonthNYearSelect'
import DateComponent from './DateComponent'

const dayList = ['Se', 'Sel', 'Ra', 'Ka', 'Ju', 'Sa', 'Mi']

// const dummyEventDate = [
//   new Date('2025-01-10'),
//   new Date('2025-01-16'),
//   new Date('2025-01-25')
// ]

interface EventDate {
  date: Date
  information: string
}

const Calendar = ({ eventDate }: { eventDate?: EventDate[] }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [days, setDays] = useState<Date[]>()

  // Helpers for date navigation
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  // Generate calendar days
  const generateCalendar = useCallback(() => {
    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }) // week starts on Monday
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    const newDays: Date[] = []

    let current = startDate
    while (current <= endDate) {
      newDays.push(current)
      current = addDays(current, 1)
    }

    setDays(newDays) // Set the new days after calculation
  }, [currentDate])

  useEffect(() => {
    generateCalendar()
    setIsLoading(false)
  }, [currentDate, generateCalendar])

  if (isLoading) {
    return null
  }

  return (
    <div className="w-min-[100px] rounded-lg border border-[#D888FF] bg-purple-800 p-4">
      {/* Header */}
      <div className="calendar-header mb-4 flex items-center justify-between">
        {/* Nav Buttons */}
        <div className="flex gap-x-2">
          <CalendarNavButton onClick={handlePrevMonth} direction="left" />
          <CalendarNavButton onClick={handleNextMonth} direction="right" />
        </div>
        {/* Month and Year */}
        <div className="flex gap-x-3">
          <MonthNYearSelect type="month" initialDate={currentDate} />
          <MonthNYearSelect type="year" initialDate={currentDate} />
        </div>
      </div>

      {/* Days of the Week */}
      <div className="calendar-days grid grid-cols-7 gap-x-4 text-center font-dmsans text-[16px] font-semibold">
        {dayList.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="calendar-grid my-1 grid grid-cols-7 gap-x-4 gap-y-1 text-center">
        {days?.map(day => (
          <DateComponent
            key={day.toISOString()}
            day={day}
            currentDate={currentDate}
            isEventDate={
              eventDate
                ? eventDate.some(
                    event => event.date.toDateString() === day.toDateString()
                  )
                : false
            }
          />
        ))}
      </div>
    </div>
  )
}

export default Calendar
