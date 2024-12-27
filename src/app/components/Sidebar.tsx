'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronUp, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

function Sidebar() {
  const SIDEBAR_ITEMS = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Competitive Programming', link: '/dashboard/cp' },
    { name: 'Capture The Flag', link: '/dashboard/ctf' },
    { name: 'UXVidia', link: '/dashboard/uxvidia' },
    { name: 'Arkalogica', link: '/dashboard/arkalogica' },
    { name: 'Datavidia', link: '/dashboard/datavidia' },
    { name: 'Hackvidia', link: '/dashboard/hackvidia' },
    { name: 'ArkavX', link: '/dashboard/arkavx' },
    { name: 'Academya', link: '/dashboard/academya' }
  ]

  function handleLogout() {
    // TODO: Implement logout functionality
  }

  return (
    <div className="fixed left-0 top-0 m-2 h-[calc(100vh-1rem)] overflow-hidden rounded-xl lg:w-[156px]">
      <Image
        src="/images/sidebar/bg.svg"
        alt="Sidebar background"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 200px, 250px"
      />
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden">
        <div className="relative my-4 flex h-full w-full flex-col items-center justify-start lg:my-6">
          <Image
            src="/images/sidebar/logo.svg"
            alt="Logo Arkavidia 9.0"
            width={100}
            height={100}
            className="lg:h-[138px] lg:w-[138px]"
          />
          <div className="mt-4 flex w-full flex-col gap-3 px-2 lg:mt-7 lg:gap-3 lg:px-3">
            {SIDEBAR_ITEMS.map((item, index) => (
              <SidebarItem key={index} name={item.name} link={item.link} />
            ))}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-xl p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
            <div className="flex flex-1 items-center gap-2 text-left">
              <Image
                src="/profileLogo.svg"
                alt="Profile Logo"
                width={20}
                height={20}
                className="lg:h-6 lg:w-6"
              />
              <span className="truncate text-sm font-medium text-white lg:text-base">
                Profile
              </span>
              <ChevronUp className="m-1 ml-auto h-4 w-4 text-white lg:h-5 lg:w-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="m-auto ml-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-[0_0_10px] shadow-lilac-200">
            <DropdownMenuItem className="cursor-pointer rounded-lg text-white focus:text-white/80">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.17 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V6.83C18 6.3 17.79 5.79 17.41 5.42L12.58 0.59C12.21 0.21 11.7 0 11.17 0ZM5 12H13C13.55 12 14 12.45 14 13C14 13.55 13.55 14 13 14H5C4.45 14 4 13.55 4 13C4 12.45 4.45 12 5 12ZM5 8H13C13.55 8 14 8.45 14 9C14 9.55 13.55 10 13 10H5C4.45 10 4 9.55 4 9C4 8.45 4.45 8 5 8ZM5 4H10C10.55 4 11 4.45 11 5C11 5.55 10.55 6 10 6H5C4.45 6 4 5.55 4 5C4 4.45 4.45 4 5 4Z"
                  fill="white"
                />
              </svg>
              <Link href="/">Landing Page</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg text-red-500 focus:text-red-400"
              onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Sidebar

interface SidebarItemProps {
  name: string
  link: string
  image?: string // * Kalo ada image, bisa langsung masukin aja di SIDEBAR_ITEMS
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, link, image }) => {
  return (
    <Link
      href={link}
      className="flex w-full flex-row items-center justify-start gap-1 rounded-lg p-1 text-left transition-colors hover:bg-white/10">
      <div className="size-3 flex-shrink-0 items-center justify-center lg:size-4">
        <Image
          src={image ?? '/images/sidebar/item.svg'}
          alt="Arrow Right"
          width={10}
          height={10}
          className="lg:h-3 lg:w-3"
        />
      </div>
      <span className="flex-grow font-teachers text-xs font-bold text-white lg:text-base">
        {name}
      </span>
    </Link>
  )
}
