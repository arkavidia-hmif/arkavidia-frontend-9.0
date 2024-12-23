import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Sidebar() {
  const SIDEBAR_ITEMS = [
    { name: 'Dashboard', link: '/dashboard' },
    { name: 'Competitive Programming', link: '/cp' },
    { name: 'Capture The Flag', link: '/ctf' },
    { name: 'UXVidia', link: '/uxvidia' },
    { name: 'Arkalogica', link: '/arkalogica' },
    { name: 'Datavidia', link: '/Datavidia' },
    { name: 'Hackvidia', link: '/hackvidia' },
    { name: 'ArkavX', link: '/arkavx' },
    { name: 'Academya', link: '/academya' }
  ]
  return (
    <div
      // ! diatur ke fixed, tapi nanti ganti aja sesuai layout yang dimau
      className="fixed left-0 top-0 h-screen w-full max-w-[156px] rounded-xl bg-cover bg-no-repeat"
      style={{ backgroundImage: 'url(/images/sidebar/bg.svg)' }}>
      <div className="h-full justify-between">
        <div className="relative flex h-full flex-col items-center justify-start px-2">
          <Image
            src="/images/sidebar/logo.svg"
            alt="Logo Arkavidia 9.0"
            width={138}
            height={138}
          />
          <div className="mt-8 flex flex-col gap-6">
            {SIDEBAR_ITEMS.map((item, index) => (
              <SidebarItem key={index} name={item.name} link={item.link} />
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-3 pl-2 text-left">
          <Image src="/profileLogo.svg" alt="Profile Logo" width={24} height={24} />
          <span>Profile</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

interface SidebarItemProps {
  name: string
  link: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, link }) => {
  return (
    <Link
      href={link}
      className="flex w-full flex-row items-center justify-start gap-3 pl-2 text-left">
      <div className="size-4 flex-shrink-0 items-center justify-center">
        <Image src="/images/sidebar/item.svg" alt="Arrow Right" width={24} height={24} />
      </div>
      <span className="flex-grow font-teachers text-base font-bold text-white">
        {name}
      </span>
    </Link>
  )
}
