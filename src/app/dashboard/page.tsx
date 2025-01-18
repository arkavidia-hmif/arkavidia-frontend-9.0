'use client'

import React from 'react'
import FrameInfo from '../components/admin-dashboard/FrameInfo'
import CompetitionContext from '../components/admin-dashboard/CompetitionContext'

const AdminDashboardPage = () => {
  const IMAGE = '/images/sidebar/item.svg'
  const Unverified = 99999
  const Registered = 99999

  return (
    <>
      {/* Dashboard Title */}
      <div className="relative flex items-center space-x-4">
        <div
          className="h-12 w-12"
          style={{
            background: 'linear-gradient(180deg, #7138C0 0%, #B89BDF 100%)',
            boxShadow: '0px 0px 8px 0px #F5F5F580',
            WebkitMaskImage: `url(${IMAGE})`, // kalo masing-masing compe punya logo, bisa diganti
            maskImage: `url(${IMAGE})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center'
          }}
        />
        <h1 className="font-belanosima text-5xl text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
          Dashboard
        </h1>
      </div>

      {/* break line */}
      <div className="my-4 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />

      {/* Overall Participant */}
      <div className="my-8 flex items-center justify-between gap-10">
        <FrameInfo
          number={Unverified}
          helperText={'Overall Registered Participants'}
          imgSrc={'/images/admin-dashboard/supervisor-acc.svg'}
        />
        <FrameInfo
          number={Registered}
          helperText={'Overall Unverified Participants'}
          imgSrc={'/images/admin-dashboard/unverified-acc.svg'}
        />
      </div>

      {/* break line */}
      <div className="my-4 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />

      <CompetitionContext />
    </>
  )
}

export default AdminDashboardPage
