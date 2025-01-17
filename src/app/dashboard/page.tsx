import React from 'react'
import Countdown from './components/Countdown'
// import Countdown from './components/countdown'
import { addMonths } from 'date-fns'
import Image from 'next/image'
import Tag from '../components/Tag'
import Category from './components/Category'
import Calendar from '../components/CustomCalendar/CustomCalendar'
import Pengumuman from './components/Pengumuman'
import ComponentBox from './components/ComponentBox'
import Information from './components/Information/Information'
import Submisi from './components/Submisi'
import { link } from 'fs'
import { map } from 'zod'

function DashboardPage() {
  const currDate = new Date()
  const username = 'User'
  const team = 'Arkavidia sssr'
  const informations = [
    {
      id: '1',
      title: 'Judul Informasi',
      datetime: '20/01/2024, 10:00 WIB',
      content:
        'Lorem ipsum dolor sit amet consectetur. Nullam lacus nunc nullam molestie odio ornare.'
    },
    {
      id: '2',
      title: 'Judul Informasi',
      datetime: '19/01/2024, 15:30 WIB',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: '3',
      title: 'Judul Informasi',
      datetime: '18/01/2024, 09:15 WIB',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    }
  ]
  const events = [
    { date: new Date('2025-01-10'), information: 'Hari Raya' },
    { date: new Date('2025-01-16'), information: 'Hari Besar' },
    { date: new Date('2025-01-25'), information: 'Hari Berbahagia' }
  ]
  const submissions = [
    {
      title: 'Tugas 1',
      link: '/tugas1'
    },
    {
      title: 'Tugas 2',
      link: '/tugas2'
    },
    {
      title: 'Tugas 3',
      link: '/tugas3'
    }
  ]

  return (
    <div className="relative flex h-full w-full flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-x-2">
          <Image
            src="/icons/userDashboardLogo.png"
            alt="Dashboard Logo"
            width={21}
            height={21}
          />
          <p className="dashboardTitle font-belanosima text-[32px]">Dashboard</p>
        </div>
        <div className="dashboardSeparator mt-4 h-1.5 rounded"></div>
        <p className="my-4 font-belanosima text-[24px]">Hi, {username}!</p>

        {/* Team Information */}
        <div className="flex flex-col gap-y-4 text-white">
          {/* Team Name */}
          <div className="flex items-center">
            <span className="w-[100px] font-dmsans text-xs">Team</span>
            <span className="max-w-[200px] break-words font-teachers text-[14px] font-bold">
              {team}
            </span>
          </div>

          {/* Kategori */}
          <div className="flex items-center">
            <span className="w-[100px] font-dmsans text-xs">Kategori</span>
            <Category categoryName="Arkavidia" />
          </div>

          {/* Team Status */}
          <div className="flex items-center">
            <span className="w-[100px] font-dmsans text-xs">Team Status</span>
            <Tag variant="success" text="Verified" className="w-[120px]" />
          </div>

          {/* Team Stage */}
          <div className="flex items-center">
            <span className="w-[100px] font-dmsans text-xs">Team Stage</span>
            <Tag variant="pink" text="Pre-eliminary" className="w-[120px]" />
          </div>
        </div>
      </div>

      {/* Countdown */}
      <Countdown eventName="Penyisihan" eventDate={new Date('2026-01-01T00:00:00')} />

      {/* Pengunguman */}
      <Information informations={informations} />

      {/* Submisi */}
      <Submisi submissions={submissions} />

      {/* Calendar */}
      <ComponentBox title="Calendar">
        <div className='x flex flex-col '>
          <Calendar events={events} />
          {/* Informasi event */}
          <div className="mt-[23px] flex flex-col self-start">
            {events &&
              events.map((event, index) => (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#FF71A0] to-[#CE6AFF]"></div>
                  <h6 className="text-[14px] font-semibold">
                    {String(event.date.getDate()).padStart(2, '0')}/
                    {String(event.date.getMonth() + 1).padStart(2, '0')}/
                    {String(event.date.getFullYear()).slice(-2)}
                  </h6>
                  <p className="text-[14px]">: {event.information}</p>
                </div>
              ))}
          </div>
        </div>
      </ComponentBox>
    </div>
  )
}

export default DashboardPage
