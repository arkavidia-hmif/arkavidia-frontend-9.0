'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '~/lib/utils'
import Image from 'next/image'

interface SidebarItemProps {
  name: string
  link: string
  image?: string // Kalo ada image, bisa langsung masukin aja di SIDEBAR_ITEMS
  className?: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  link,
  image = '/images/sidebar/item.svg',
  className = ''
}) => {
  const pathname = usePathname()
  const isActive = pathname === link

  return (
    <Link
      href={link}
      className={cn(
        `flex w-full flex-row items-center justify-start gap-2 rounded-md p-2 text-left transition-all ${
          isActive
            ? 'bg-gradient-to-r from-white/15 to-white/10 shadow-[0_0_8px] shadow-white/75 backdrop-blur-[10px]'
            : 'hover:bg-white/10'
        }`,
        className
      )}>
      <div className="relative flex size-4 flex-shrink-0 items-center justify-center rounded-sm lg:size-4">
        <Image
          src={image}
          alt={`${name} icon`}
          width={20}
          height={20}
          className={`lg:h-4 lg:w-4 ${isActive ? 'invisible' : ''}`}
        />
        {isActive && (
          <div
            className="absolute inset-0 drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]"
            style={{
              background:
                'linear-gradient(138.01deg, #FFB8CF 20.61%, #AC7CD0 62%, #91F0FF 100%)',
              WebkitMaskImage: `url(${image})`,
              maskImage: `url(${image})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center'
            }}
          />
        )}
      </div>
      <span
        className={`min-w-0 whitespace-normal break-words font-teachers text-sm font-bold text-white lg:text-base`}>
        {name}
      </span>
    </Link>
  )
}

export default SidebarItem
