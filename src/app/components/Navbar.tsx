'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

type NavItem = {
  name: string
  link: string
}

function Navbar() {
  const LOGGED_IN = false // ! hardcode untuk testing
  const pathname = usePathname()
  const NAV_ITEMS: NavItem[] = [
    { name: 'About Us', link: '/aboutus' },
    { name: 'Event', link: '/event' },
    { name: 'Competition', link: '/competition' }
  ]

  return (
    <nav className="bg-black px-4 py-3 lg:px-12">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-center gap-2">
          <Image
            src="/arkavidiaLogo.svg"
            alt="Logo Arkavidia 9.0"
            width={38}
            height={56}
          />
          <Image
            src="/arkavidiaText.svg"
            alt="Text Arkavidia 9.0"
            width={161}
            height={56}
            className="hidden sm:block"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md data-[state=open]:bg-purple-700 lg:hidden">
            <Menu size={24} className="m-3" color="white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2 min-w-[167px] gap-12 rounded-lg bg-purple-700 px-3 py-5 font-teachers text-base font-bold text-white outline-none">
            <DropdownMenuItem>About Us</DropdownMenuItem>
            <DropdownMenuItem>Event</DropdownMenuItem>
            <DropdownMenuItem>Competition</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-transparent" />
            <DropdownMenuItem>
              <Link href="/login" className="w-full">
                <Button className="h-auto w-full gap-4 rounded-lg bg-gradient-to-r from-teal-500 via-[#9274FF] to-[#C159D8] px-4 py-2 text-center font-dmsans text-base">
                  Login
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop menu */}
        <ul className="hidden items-center justify-center space-x-8 text-white lg:flex">
          {NAV_ITEMS.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`px-6 py-2 font-teachers text-base font-bold ${
                  pathname === item.link ? 'rounded-full bg-purple-500' : ''
                }`}>
                {item.name}
              </Link>
            </li>
          ))}
          {LOGGED_IN ? (
            <Link href={'/profile'}>
              <Image
                src={'/profileLogo.svg'}
                alt={'Profile Logo'}
                width={30}
                height={30}
              />
            </Link>
          ) : (
            <Link href="/login">
              <Button className="font-base h-auto gap-4 rounded-md bg-gradient-to-r from-teal-500 via-[#9274FF] to-[#C159D8] px-8 py-4 font-dmsans text-base">
                Login
              </Button>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
