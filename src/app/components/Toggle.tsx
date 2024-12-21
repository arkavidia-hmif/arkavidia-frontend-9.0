import React from 'react'
import { Switch } from './ui/switch'

interface ToggleProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  labelPosition?: 'left' | 'right'
}

function Toggle({ label, checked, onChange, disabled, labelPosition }: ToggleProps) {
  const handleCheckedChange = (checked: boolean) => {
    if (onChange) {
      onChange(checked);
    }
  };
  return (
    <div className="flex items-center gap-2">
      {labelPosition === 'left' && <span className="text-white peer-disabled:opacity-50">{label}</span>}
      
      <Switch 
        checked={checked} 
        onCheckedChange={handleCheckedChange}
        disabled={disabled} />
      
      {labelPosition === 'right' && <span className="text-white peer-disabled:opacity-50">{label}</span>}
    </div>
  )
}

export { Toggle }
