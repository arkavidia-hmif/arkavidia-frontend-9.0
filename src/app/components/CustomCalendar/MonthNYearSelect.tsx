import React from 'react'
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
  initialDate?: Date
}

function MonthNYearSelect({ ...props }: MonthNYearSelectProps) {
  const initialDate = props.initialDate || new Date()
  return (
    <div className="flex gap-x-2">
      <Select>
        <SelectTrigger className="gap-x-2 h-6 rounded-lg border-white text-[13px]">
          <SelectValue
            className="text-[10px]"
            placeholder={
              props.type === 'month'
                ? initialDate.toLocaleString('id-ID', { month: 'long' })
                : initialDate.getFullYear()
            }></SelectValue>
        </SelectTrigger>
        <SelectContent className="text-[10px]">
          {props.type === 'month' && (
            <>
              <SelectItem value="1">Januari</SelectItem>
              <SelectItem value="2">Februari</SelectItem>
              <SelectItem value="3">Maret</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">Mei</SelectItem>
              <SelectItem value="6">Juni</SelectItem>
              <SelectItem value="7">Juli</SelectItem>
              <SelectItem value="8">Agustus</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">Oktober</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">Desember</SelectItem>
            </>
          )}
          {props.type === 'year' && (
            <>
              <SelectItem value="2025">2025</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export default MonthNYearSelect
