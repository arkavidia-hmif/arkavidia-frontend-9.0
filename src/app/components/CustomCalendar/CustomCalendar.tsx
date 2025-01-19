'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  setMonth,
  setYear
} from 'date-fns'
import CalendarNavButton from './CalendarNavButton'
import MonthNYearSelect from './MonthNYearSelect'
import DateComponent from './DateComponent'

const dayList = ['Se', 'Sel', 'Ra', 'Ka', 'Ju', 'Sa', 'Mi']

interface EventDate {
  date: Date
  information: string
}

const LIMIT_MONTH_UPPER = 6
const LIMIT_MONTH_UNDER = 1
const LIMIT_YEAR = 2025

const Calendar = ({ eventDate }: { eventDate?: EventDate[] }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [days, setDays] = useState<Date[]>()
  // Helpers for date navigation
  const handleCustomMonth = (month: number) => {
    if (month >= LIMIT_MONTH_UNDER && month < LIMIT_MONTH_UPPER) {
      setCurrentDate(prevDate => setMonth(prevDate, month - 1))
    }
  }

  const isPrevMonthDisabled = currentDate.getMonth() + 1 <= LIMIT_MONTH_UNDER
  const isNextMonthDisabled = currentDate.getMonth() + 2 >= LIMIT_MONTH_UPPER

  console.log(
    'Current Month : ' +
      currentDate.getMonth() +
      ' Prev: ' +
      isPrevMonthDisabled +
      ' Next : ' +
      isNextMonthDisabled
  )

  const handleCustomYear = (year: number) => {
    if (year === LIMIT_YEAR) {
      setCurrentDate(prevDate => setYear(prevDate, year))
    }
  }
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
          {
            <CalendarNavButton
              onClick={() => handleCustomMonth(currentDate.getMonth())}
              direction="left"
              disabled={isPrevMonthDisabled}
            />
          }

          <CalendarNavButton
            onClick={() => handleCustomMonth(currentDate.getMonth() + 2)}
            direction="right"
            disabled={isNextMonthDisabled}
          />
        </div>
        {/* Month and Year */}
        <div className="flex gap-x-3">
          <MonthNYearSelect
            type="month"
            initialDate={currentDate}
            onChange={value => handleCustomMonth(parseInt(value, 10))}
            limit={{
              month_upper: LIMIT_MONTH_UPPER,
              month_under: LIMIT_MONTH_UNDER,
              year: LIMIT_YEAR
            }}
          />
          <MonthNYearSelect
            type="year"
            initialDate={currentDate}
            onChange={value => handleCustomYear(parseInt(value, 10))}
            limit={{
              month_upper: LIMIT_MONTH_UPPER,
              month_under: LIMIT_MONTH_UNDER,
              year: LIMIT_YEAR
            }}
          />
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
