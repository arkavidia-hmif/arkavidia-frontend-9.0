import React from 'react'
import Image from 'next/image'
import Checkbox from '../Checkbox'

interface ExpandedMenuItemProps {
  /** Whether to display the left icon */
  iconLeft?: boolean

  /** Whether to display the checkbox on the right */
  iconRight?: boolean

  /** Label for the menu item */
  option: string

  /** Whether the menu item is disabled */
  disabled?: boolean
}

function ExpandedMenuItem({
  iconLeft,
  iconRight,
  option,
  disabled = false
}: ExpandedMenuItemProps) {
  return (
    <div
      className={`flex w-[100%] items-center justify-between rounded-sm py-3 pl-3 pr-4 transition-all duration-100 ease-linear ${
        disabled ? 'cursor-not-allowed' : 'hover:bg-purple-100'
      }`}>
      {/* Left Content */}
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
          className={`font-dmsans text-base ${
            disabled ? 'text-gray-400' : 'text-purple-500'
          }`}>
          {option}
        </span>
      </div>

      {/* Right Content */}
      {iconRight && <Checkbox />}
    </div>
  )
}

export default ExpandedMenuItem
