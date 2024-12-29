'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronUp, LogOut, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

export interface SidebarProps {
  announcement?: boolean
}

function Sidebar({ announcement = true }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const SIDEBAR_ITEMS = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Competitive Programming', link: '/dashboard/cp' },
    { name: 'Capture The Flag', link: '/dashboard/ctf' },
    { name: 'UXVidia', link: '/dashboard/uxvidia' },
    { name: 'Arkalogica', link: '/dashboard/arkalogica' },
    { name: 'Datavidia', link: '/dashboard/datavidia' },
    { name: 'Hackvidia', link: '/dashboard/hackvidia' },
    { name: 'ArkavX', link: '/dashboard/arkavx' },
    { name: 'Academya', link: '/dashboard/academya' },
    announcement
      ? {
          name: 'Announcement',
          link: '/dashboard/announcement',
          image: '/images/sidebar/notification-important.svg'
        }
      : { name: 'Profile', link: '/profile', image: '/images/sidebar/face.svg' }
  ]

  const USERNAME = 'Ahmad John' // TODO: Get user name from auth context

  function handleLogout() {
    // TODO: Implement logout functionality
  }

  return (
    <>
      <input type="checkbox" id="sidebarToggle" className="peer hidden" />

      <div className="fixed z-50 flex w-full items-center justify-between bg-transparent p-4 lg:hidden">
        <Link href="/">
          <Image
            src="/arkavidiaLogo.svg"
            alt="Logo Arkavidia 9.0"
            width={38}
            height={56}
            className="ml-4"
          />
        </Link>
        <label
          htmlFor="sidebarToggle"
          className="mr-2 size-fit cursor-pointer rounded-lg bg-gradient-to-b from-[#2E046A] to-[#0B1936] p-2">
          <Menu className="h-6 w-6 text-white" />
        </label>
      </div>

      <div
        className={`fixed -left-2 top-2 z-50 h-[calc(100vh-1rem)] w-[162px] -translate-x-full transform overflow-visible rounded-xl bg-cover bg-center bg-no-repeat shadow-[0px_0px_10px_0px_#1B3E88] transition-transform duration-300 ease-in-out peer-checked:translate-x-3 lg:left-0 lg:top-0 lg:m-2 lg:block lg:translate-x-0`}
        style={{ backgroundImage: "url('/images/sidebar/bg.svg')" }}>
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden">
          <div className="relative my-2 flex h-full w-full flex-col items-center justify-start lg:my-6">
            <Image
              src="/images/sidebar/logo.svg"
              alt="Logo Arkavidia 9.0"
              width={100}
              height={100}
              className="mt-4 size-max lg:h-[138px] lg:w-[138px]"
            />
            <div className="mt-4 flex w-full flex-col gap-4 px-2 lg:mt-7 lg:gap-2 lg:px-[10px]">
              {SIDEBAR_ITEMS.map((item, index) => (
                <SidebarItem
                  key={index}
                  name={item.name}
                  link={item.link}
                  image={item.image}
                />
              ))}
            </div>
          </div>

          <DropdownMenu
            onOpenChange={open => {
              setDropdownOpen(open)
            }}>
            <DropdownMenuTrigger
              asChild
              className="my-6 flex w-full items-center gap-2 rounded-xl p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
              <div className="flex flex-1 items-center gap-2 text-left">
                <Image
                  src="/profileLogo.svg" // bisa diganti dengan foto profile user
                  alt="Profile Logo"
                  width={20}
                  height={20}
                  className="lg:h-6 lg:w-6"
                />
                <span className="truncate text-sm font-medium text-white lg:text-base">
                  {USERNAME}
                </span>
                <ChevronUp
                  className={`m-1 ml-auto h-4 w-4 text-white transition-transform duration-300 ease-in-out lg:h-5 lg:w-5 ${
                    dropdownOpen ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="m-auto ml-1 rounded-md bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-[0_0_12px] shadow-lilac-200">
              <DropdownMenuItem className="cursor-pointer rounded-lg text-white focus:text-white/80">
                <Image
                  src="/images/sidebar/landing-page.svg"
                  alt={'Landing Pace Icon'}
                  width={16}
                  height={18}
                  className="mr-2 h-4 w-4"
                />
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

      <label
        htmlFor="sidebarToggle"
        className="pointer-events-none fixed inset-0 z-40 bg-black opacity-0 transition-opacity duration-300 peer-checked:pointer-events-auto peer-checked:opacity-50 lg:hidden"
      />
    </>
  )
}

export default Sidebar

interface SidebarItemProps {
  name: string
  link: string
  image?: string // Kalo ada image, bisa langsung masukin aja di SIDEBAR_ITEMS
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  link,
  image = '/images/sidebar/item.svg'
}) => {
  const pathname = usePathname()
  const isActive = pathname === link

  return (
    <Link
      href={link}
      className={`flex w-full flex-row items-center justify-start gap-2 rounded-md p-2 text-left transition-all ${
        isActive
          ? 'bg-gradient-to-r from-white/15 to-white/10 shadow-[0_0_8px] shadow-white/75 backdrop-blur-[10px]'
          : 'hover:bg-white/10'
      }`}>
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
