'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import Image from 'next/image'
import { LogOut, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

type NavItem = {
  name: string
  link: string
}

function Navbar() {
  const LOGGED_IN = true // ! hardcode untuk testing
  const pathname = usePathname()
  const NAV_ITEMS: NavItem[] = [
    { name: 'About Us', link: '/aboutus' },
    { name: 'Event', link: '/event' },
    { name: 'Competition', link: '/competition' }
  ]

  function handleLogout() {
    // TODO: Implement logout functionality
  }

  return (
    <nav className="bg-black px-4 py-3 lg:px-12">
      <div className="flex flex-row items-center justify-between">
        <Link href="/" className="flex flex-row items-center justify-center gap-2">
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
            className="hidden md:block"
          />
        </Link>

        {/* Mobile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md data-[state=open]:bg-purple-700 md:hidden">
            <Menu size={24} className="m-3" color="white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2 min-w-[167px] gap-4 rounded-lg border-none bg-purple-700 px-3 py-5 font-teachers text-base font-bold text-white">
            {NAV_ITEMS.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className={pathname === item.link ? 'bg-white text-purple-700' : ''}
                asChild>
                <Link href={item.link} className="w-full">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
            {LOGGED_IN ? (
              <>
                <DropdownMenuItem
                  className={`cursor-pointer ${pathname === '/dashboard' ? 'bg-white text-purple-700' : ''}`}>
                  <Link href="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="focus:bg-transparent">
                <Link href="/login" className="w-full">
                  <Button className="h-auto w-full gap-4 rounded-lg bg-gradient-to-r from-teal-500 via-[#9274FF] to-[#C159D8] px-4 py-2 text-center font-dmsans text-xl font-semibold">
                    Login
                  </Button>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop menu */}
        <ul className="hidden items-center justify-center space-x-8 text-white md:flex">
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src={'/profileLogo.svg'}
                  alt={'Profile Logo'}
                  width={30}
                  height={30}
                  className="cursor-pointer rounded-full"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-2 mt-2 min-w-[155px] gap-12 rounded-lg border-none bg-purple-700 px-3 py-4 font-teachers text-base font-bold text-white">
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-purple-600 focus:text-white"
                  asChild>
                  <Link href="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:bg-purple-600 focus:text-red-400"
                  onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // * Nanti diganti button dari component Button
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