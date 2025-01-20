import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/app/components/ui/select'

interface MonthNYearSelectProps {
  type: 'month' | 'year'
  onChange?: (value: string) => void
  initialDate?: Date,
  limit: {
    month_upper: number,
    month_under : number,
    year : number,
  }
}

function MonthNYearSelect(props: MonthNYearSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>()

  // Update selected value when initialDate changes
  useEffect(() => {
    if (props.initialDate) {
      const value =
        props.type === 'month'
          ? (props.initialDate.getMonth() + 1).toString() // Convert 0-based month to 1-based
          : props.initialDate.getFullYear().toString()
      setSelectedValue(value)
    }
  }, [props.initialDate, props.type])

  // Handle value change
  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    if (props.onChange) {
      props.onChange(value)
    }
  }

  return (
    <div className="flex gap-x-2">
      <Select onValueChange={handleValueChange} value={selectedValue}>
        <SelectTrigger className="h-6 gap-x-2 rounded-lg border-white text-[13px]">
          <SelectValue
            className="text-[10px]"
            placeholder={
              props.type === 'month'
                ? props.initialDate?.toLocaleString('id-ID', { month: 'long' })
                : props.initialDate?.getFullYear().toString()
            }></SelectValue>
        </SelectTrigger>
        <SelectContent className="text-[10px]">
          {props.type === 'month' &&
            Array.from({ length: props.limit.month_upper - props.limit.month_under }, (_, i = props.limit.month_under) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
              </SelectItem>
            ))}
          {props.type === 'year' && (
            <SelectItem
              disabled={true}
              key={new Date().getFullYear()}
              value={new Date().getFullYear().toString()}>
              {new Date().getFullYear()}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export default MonthNYearSelect
