import React from 'react'
import ExpandedMenuItem from './expanded-menu-item'

interface ExpandedMenuProps {
  /** Array of menu options */
  items: {
    id: number
    option: string // Label for each item
    iconLeft?: boolean // Show left icon
    iconRight?: boolean // Show checkbox on the right
    disabled?: boolean // Disabled state
  }[]
}

function ExpandedMenu({ items }: ExpandedMenuProps) {
  return (
    <div className="custom-scrollbar flex max-h-[330px] w-[100%] flex-col gap-2 overflow-y-auto rounded-sm bg-lilac-100 p-2">
      {items.map(item => (
        <ExpandedMenuItem
          key={item.id}
          iconLeft={item.iconLeft}
          iconRight={item.iconRight}
          option={item.option}
          disabled={item.disabled}
        />
      ))}
    </div>
  )
}

export default ExpandedMenu
