import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '../Button'

interface CalendarNavButtonProps {
  onClick: () => void
  direction: 'left' | 'right'
  disabled: boolean
}

function CalendarNavButton({ ...props }: CalendarNavButtonProps) {
  return (
    <button
      disabled={props.disabled}
      className={`flex h-6 w-6 items-center justify-center rounded-lg border border-white ${props.disabled ? 'opacity-65' : 'opacity-100'}`}
      onClick={props.onClick}>
      {props.direction === 'left' ? (
        <ChevronLeftIcon size={20} />
      ) : (
        <ChevronRightIcon size={20} />
      )}
    </button>
  )
}

export default CalendarNavButton
