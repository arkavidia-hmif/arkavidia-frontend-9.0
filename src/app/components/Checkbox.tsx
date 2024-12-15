'use client'

import { useState } from 'react'
import { Checkbox as RadixCheckbox } from './ui/checkbox'
import { Label } from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'

export interface CheckboxProps {
  checked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  text_right?: boolean
  text?: string
}

export default function Checkbox({
  checked = false,
  disabled = false,
  indeterminate = false,
  text_right = true,
  text
}: CheckboxProps) {
  const [isChecked, setChecked] = useState(checked)

  const handleChange = (checked: boolean | 'indeterminate') => {
    setChecked(checked === true)
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-4',
        text_right ? 'flex-row text-left' : 'flex-row-reverse justify-end text-right'
      )}>
      <RadixCheckbox
        checked={indeterminate ? 'indeterminate' : isChecked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : isChecked}
        onCheckedChange={handleChange}
        className="h-6 w-6 rounded-lg border-[1.5px] border-lilac-500 font-normal transition-all duration-150 ease-linear focus:shadow-[0_0_0_3px_rgba(255,166,255,1)] data-[state=checked]:bg-lilac-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:hover:bg-lilac-100"
      />
      {text && (
        <Label className="font-dmsans text-xl font-normal text-lilac-100">{text}</Label>
      )}
    </div>
  )
}
