'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './Button'
import Image from 'next/image'
import { LogOut, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { useAuth } from '../contexts/AuthContext'
import { useAppSelector } from '~/redux/store'
import { toast } from '~/hooks/use-toast'
import { cn } from '~/lib/utils'
import { useEffect, useState } from 'react'

type NavItem = {
  name: string
  link: string
}

function Navbar() {
  const isAuthenticated = useAppSelector(state => state.auth.accessToken !== null)
  const hasFilledInfo = useAppSelector(state => state.auth.hasFilledInfo)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const router = useRouter()
  const { logout } = useAuth()
  const LOGGED_IN = isAuthenticated // ! hardcode untuk testing
  const pathname = usePathname()
  const NAV_ITEMS: NavItem[] = [
    // { name: 'About Us', link: '/aboutus' },
    { name: 'Event', link: '/event' },
    { name: 'Competition', link: '/competition' }
  ]
  const [scrollY, setScrollY] = useState(0)

  async function handleLogout() {
    await logout()
    toast({
      title: 'Logged out',
      description: 'You have been logged out',
      variant: 'info'
    })
  }

  const checkHasFilledInfo = () => {
    if (!hasFilledInfo) {
      toast({
        title: 'Please fill in your information',
        description:
          'You need to fill in your information before you can access the dashboard',
        variant: 'info'
      })
      setTimeout(() => {
        router.push('/register/personal-data')
      }, 500)
    } else {
      if (isAdmin) {
        setTimeout(() => router.push('/dashboard/admin'), 500)
      } else {
        setTimeout(() => router.push('/dashboard'), 500)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav
      className={cn(
        'fixed z-[100] w-full bg-transparent px-4 py-6 lg:px-12',
        scrollY > 10
          ? 'backdrop-blur-lg transition-all duration-300 ease-in-out'
          : ''
      )}>
      <div className="flex flex-row items-center justify-between">
        <Link href="/" className="flex flex-row items-center justify-center gap-2 px-4">
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
          <DropdownMenuContent className="z-10 mr-2 mt-3 min-w-[167px] gap-4 rounded-lg border-none bg-purple-700 px-3 py-5 font-teachers text-base font-bold text-white">
            {NAV_ITEMS.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className={pathname === item.link ? 'bg-white text-purple-700' : ''}
                asChild>
                <Link href={item.link} className="w-full hover:bg-gray-500">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
            {LOGGED_IN ? (
              <>
                <DropdownMenuItem
                  className={`cursor-pointer ${pathname === '/dashboard' ? 'bg-white text-purple-700' : ''}`}>
                  <div className="w-full" onClick={() => checkHasFilledInfo()}>
                    Dashboard
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
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
                className={`h-full px-6 py-2 font-teachers text-base font-bold ${
                  pathname === item.link
                    ? 'rounded-xl bg-purple-300'
                    : 'hover:rounded-lg hover:bg-black/20 hover:py-4'
                }`}>
                {item.name}
              </Link>
            </li>
          ))}
          {LOGGED_IN ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <Image
                  src={'/profileLogo.svg'}
                  alt={'Profile Logo'}
                  width={30}
                  height={30}
                  className="cursor-pointer rounded-full"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-20 mr-3 mt-3 min-w-[155px] gap-12 rounded-lg border-none bg-purple-700 px-3 py-4 font-teachers text-base font-bold text-white">
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-purple-600 focus:text-white"
                  asChild>
                  <div className="w-full" onClick={() => checkHasFilledInfo()}>
                    Dashboard
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:bg-purple-600 focus:text-red-400"
                  onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // * Nanti diganti button dari component Button
            <Link href="/login" className="">
              <Button className="font-base gap-4 rounded-md bg-gradient-to-r from-teal-500 via-[#9274FF] to-[#C159D8] py-1 font-dmsans text-base lg:px-8 lg:py-4">
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
