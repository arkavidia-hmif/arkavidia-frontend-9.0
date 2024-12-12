'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

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
    <nav className="flex flex-row justify-between bg-black px-12 py-3">
      <div className="flex flex-row items-center justify-center gap-2">
        <Image src="/arkavidiaLogo.svg" alt="Logo Arkavidia 9.0" width={38} height={56} />
        <Image
          src="/arkavidiaText.svg"
          alt="Text Arkavidia 9.0"
          width={161}
          height={56}></Image>
      </div>
      <ul className="flex items-center justify-center space-x-8 text-white">
        {NAV_ITEMS.map((item, index) => (
          <li key={index}>
            <Link
              href={item.link}
              className={`px-6 py-2 font-teachers text-base font-bold ${pathname === item.link ? 'rounded-full bg-purple-500' : ''}`}>
              {item.name}
            </Link>
          </li>
        ))}
        {LOGGED_IN ? (
          <Link href={'/profile'} className="">
            <Image
              src={'/profileLogo.svg'}
              alt={'Profile Logo'}
              width={30}
              height={30}></Image>
          </Link>
        ) : (
          <Link href="/login">
            {/* // ? nanti diganti sama Button dari Bagas */}
            <Button className="font-base h-auto gap-4 rounded-md bg-gradient-to-r from-teal-500 via-[#9274FF] to-[#C159D8] px-8 py-4 font-dmsans text-base">
              Login
            </Button>
          </Link>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
