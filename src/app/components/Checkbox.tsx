'use client'

import { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { Label } from '@radix-ui/react-dropdown-menu'

// Create props for checkbox
export interface CheckboxProps {
  checked?: boolean // Made optional
  disabled?: boolean // Made optional
  indeterminate?: boolean // Made optional
  text_right?: boolean // Made optional
  text?: string // Made optional
}

export default function CheckboxCustom({
  checked = false, // Default value
  disabled = false, // Default value
  indeterminate = false, // Default value
  text_right = true, // Default value
  text
}: CheckboxProps) {
  const [isChecked, setChecked] = useState(checked)
  const [isDisabled, setDisabled] = useState(disabled)
  const [isIndeterminate, setIndeterminate] = useState(indeterminate)

  const handleChange = () => {
    setChecked(!isChecked)
  }

  return (
    <div
      className={
        text_right
          ? 'flex items-center gap-[1rem] space-x-2'
          : 'flex flex-row-reverse items-center gap-[1rem] space-x-2'
      }>
      <Checkbox
        checked={isIndeterminate ? 'indeterminate' : isChecked}
        disabled={isDisabled}
        onCheckedChange={handleChange}
        className="h-[1.5rem] w-[1.5rem] rounded-lg border-[1.5px] border-lilac-500 font-normal transition-all duration-150 ease-linear focus:shadow-[0px_0px_0px_1.5px_rgba(255,166,255,1)] data-[state=checked]:bg-lilac-500 data-[state=unchecked]:bg-transparent data-[state=unchecked]:hover:bg-lilac-100"
      />

      {text && <Label className="text-lilac-100">{text}</Label>}
    </div>
  )
}
