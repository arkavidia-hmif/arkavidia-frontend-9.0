import React from 'react'
import Image from 'next/image'
import { Checkbox } from './checkbox'

interface ExpandedMenuItemProps {
  iconLeft?: boolean
  iconRight?: boolean
  Option: string
  icon?: boolean // This prop is defined but not used. Remove it if not needed.
  disabled?: boolean
}

function ExpandedMenuItem({
  iconLeft,
  iconRight,
  Option,
  disabled = false
}: ExpandedMenuItemProps) {
  return (
    <div
      className={`flex w-[350px] items-center justify-between rounded-sm py-3 pl-3 pr-4 transition-all duration-100 ease-linear ${disabled ? 'cursor-not-allowed bg-gray-200' : 'hover:bg-purple-100'}`}>
      <div className="flex items-center gap-3">
        {iconLeft && (
          <Image
            className="h-8 w-8"
            src="/star.svg"
            alt="star"
            width={100}
            height={100}
          />
        )}
        <span
          className={`font-dmsans text-xl ${
            disabled ? 'text-gray-400' : 'text-purple-500'
          }`}>
          {Option}
        </span>
      </div>
      {iconRight && <Checkbox className="h-6 w-6 rounded-lg" />}
    </div>
  )
}

export default ExpandedMenuItem
