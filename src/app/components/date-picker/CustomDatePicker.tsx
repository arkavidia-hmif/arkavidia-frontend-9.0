'use client'

import React from 'react'
import { Calendar } from '../ui/calendar'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface DatePickerProps {
  onChange: (date: Date) => void
}

function CustomDatePicker({ onChange }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return
    setIsOpen(false)
    setSelectedDate(date)
    onChange(date)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value)
    const updatedDate = new Date(currentMonth)
    updatedDate.setFullYear(newYear)
    setCurrentMonth(updatedDate)
  }

  return (
    <div className="relative flex w-full grow">
      <div
        className="flex h-9 min-h-[20px] w-full items-center justify-between rounded-md border-[1.5px] border-input border-purple-300 bg-lilac-100 px-3 py-1 font-dmsans text-base font-normal leading-[24px] text-purple-400 shadow-sm transition-colors hover:cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-md:text-xs md:text-sm"
        onClick={() => setIsOpen(prev => !prev)}>
        <p>{selectedDate?.toLocaleDateString('id-ID') ?? 'dd/mm/yyyy'}</p>
        <div className="flex items-center">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>
      {isOpen && (
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="absolute right-0 top-full z-50 mt-2 rounded-md bg-white text-black shadow-lg"
          components={{
            Caption: () => (
              <div className="flex items-center justify-between p-2">
                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth)
                    newDate.setMonth(currentMonth.getMonth() - 1)
                    setCurrentMonth(newDate)
                  }}
                  className="text-lg">
                  &lt;
                </button>

                {/* Year selector */}
                <div className="flex items-center gap-x-1">
                  <p>{currentMonth.toLocaleString('default', { month: 'long' })}</p>
                  <select
                    value={currentMonth.getFullYear()}
                    onChange={handleYearChange}
                    className="bg-transparent text-center">
                    {Array.from({ length: 40 }, (_, i) => {
                      const year = new Date().getFullYear() - i // Adjust the range around the current year
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth)
                    newDate.setMonth(currentMonth.getMonth() + 1)
                    setCurrentMonth(newDate)
                  }}
                  className="text-lg">
                  &gt;
                </button>
              </div>
            )
          }}
        />
      )}
    </div>
  )
}

export default CustomDatePicker
