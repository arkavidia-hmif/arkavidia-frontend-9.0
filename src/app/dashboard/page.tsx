import React from 'react'
import Countdown from './components/countdown/Countdown'
import { addMonths } from 'date-fns'
import Image from 'next/image'
import Tag from '../components/Tag'
import Category from './components/Category'
import Calendar from '../components/CustomCalendar/CustomCalendar'
import Pengumuman from './components/Pengumuman'
import ComponentBox from './components/ComponentBox'
import Submisi from './components/Submisi'

function DashboardPage() {
  const currDate = new Date()

  return (
    <div className="relative flex h-full w-full flex-col px-6">
      <Image
        src="/images/not-found/Background.png"
        alt="Not Found"
        fill
        className="z-0 h-full w-full object-cover object-left lg:object-center"
      />
      <div className="flex items-center gap-x-2">
        <Image
          src="/icons/userDashboardLogo.png"
          alt="Dashboard Logo"
          width={48}
          height={48}
        />
        <p className="dashboardTitle font-belanosima text-[48px]">Dashboard</p>
      </div>
      <div className="dashboardSeparator h-1.5 rounded"></div>
      <p className="mt-2 font-belanosima text-[30px]">Hi, User!</p>
      <div className="my-2">
        <div className="font-dmsans text-[16px]">
          Team:{' '}
          <span className="font-teachers text-[16px] font-bold">Arkavidia Gacor</span>
        </div>
        <div className="flex items-center gap-x-2 font-dmsans text-[14px]">
          Kategori:{' '}
          <span>
            <Category categoryName="Arkavidia" />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <p>Team Status </p>
          <Tag variant="success" text="Verified" className="w-[80px]" />
        </div>
        <div className="flex items-center gap-x-2">
          <p>Team Stage </p>
          <Tag variant="pink" text="Pre-eliminary" className="w-[80px]" />
        </div>
      </div>
      <div className="my-4">
        <Countdown eventName="Test" eventDate={addMonths(currDate, 2)} />
      </div>
      <div className="my-2 mb-4">
        <Pengumuman />
      </div>
      <div className="my-2 mb-4">
        <Submisi />
      </div>
      <ComponentBox title="Calendar">
        <div className="m-4">
          <Calendar />
        </div>
      </ComponentBox>
    </div>
  )
}

export default DashboardPage
