import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface CalendarNavButtonProps {
  onClick: () => void
  direction: 'left' | 'right'
}

function CalendarNavButton({ ...props }: CalendarNavButtonProps) {
  return (
    <button className="rounded-lg border border-white" onClick={props.onClick}>
      {props.direction === 'left' ? <ChevronLeftIcon size={20} /> : <ChevronRightIcon size={20} />}
    </button>
  )
}

export default CalendarNavButton
