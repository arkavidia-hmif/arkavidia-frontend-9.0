'use client'

import React, { useState } from 'react'
import { Calendar } from '../ui/calendar'
import { CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react'

interface DatePickerProps {
  onChange: (date: Date) => void

  /**
   * Set restriction more = true
   */
  restriction?: {
    daylimit:
      | {
          year: number
          month: number
          day: number
        }
      | Date
    range: 'higher' | 'lower'
  }
}

function CustomDatePicker({ onChange, restriction }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const today = new Date()

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return
    if (validateDateRestriction(date)) {
      setError(null)
      setIsOpen(false)
      setSelectedDate(date)
      setInputValue(date.toLocaleDateString('id-ID'))
      onChange(date)
    }
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value)
    const updatedDate = new Date(currentMonth)
    updatedDate.setFullYear(newYear)
    setCurrentMonth(updatedDate)
  }

  const getLimitDate = (
    daylimit: { year: number; month: number; day: number } | Date
  ): Date => {
    if (daylimit instanceof Date) {
      return daylimit
    }
    const { year, month, day } = daylimit
    return new Date(year, month - 1, day) // Adjust for 0-based month
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)
    setError(null)

    const parsedDate = new Date(value)
    if (isNaN(parsedDate.getTime()) || value.split('/').length !== 3) {
      setError('Input tidak valid. Gunakan format hari/bulan/tahun, contoh: 10/5/2024.')
      return
    }

    const [day, month, year] = value.split('/').map(Number)
    const date = new Date(year, month - 1, day)
    if (date >= today) {
      setError('Mohon masukkan tanggal lahir yang valid')
      return
    }

    setSelectedDate(date)
    onChange(date)
  }

  const validateDateRestriction = (date: Date): boolean => {
    if (!restriction) return true

    const limitDate = getLimitDate(restriction.daylimit)
    const isValid = restriction.range === 'higher' ? date > limitDate : date < limitDate

    if (!isValid) {
      setError(
        restriction.range === 'higher'
          ? `Mohon memilih tanggal setelah ${limitDate.toLocaleDateString('id-ID')}`
          : `Mohon memilih tanggal sebelum ${limitDate.toLocaleDateString('id-ID')}`
      )
    }

    return false
  }

  return (
    <div className="relative flex w-full grow">
      <div className="flex flex-col w-full">
        <div className="flex w-full rounded-md border-[1.5px] border-purple-300 bg-lilac-100 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          {/* Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="dd/mm/yyyy"
            className="h-9 flex-1 border-none bg-transparent px-3 py-1 font-dmsans text-base text-purple-400 focus:outline-none max-md:text-xs md:text-sm"
          />  
          {/* Calendar Toggle Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-r-md bg-transparent text-purple-400 transition-colors hover:cursor-pointer hover:opacity-90"
            type="button"
            onClick={() => setIsOpen(prev => !prev)}>
            <CalendarIcon size={20} />
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
