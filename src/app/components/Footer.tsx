import React from 'react'

function Footer() {
  return (
    <div className='flex flex-col items-start justify-center space-y-5'>
        <img src='/Logos.svg' alt='Arkavidia Logo' className='w-[150px] h-[40px] object-contain' />
        <div className='flex flex-row items-center justify-center space-x-5 font-teachers font-bold text-white text-sm'>
          <a href='/about-us' className='hover:underline'>About Us</a>
          <a href='/events' className='hover:underline'>Events</a>
          <a href='/competitions' className='hover:underline'>Competitions</a>
        </div>
        <div className='flex flex-row items-center justify-center space-x-2'>
          <a href='https://www.linkedin.com/company/arkavidia/' target='_blank' rel='noreferrer noopener' className='hover:underline'>
            <img src='/linkedin.svg' alt='LinkedIn Logo' className='w-6 h-6' />
          </a>
          <a href='https://www.instagram.com/arkavidia/' target='_blank' rel='noreferrer noopener' className='hover:underline'>
            <img src='/instagram.svg' alt='Instagram Logo' className='w-6 h-6' />
          </a>
          <a href='https://x.com/arkavidia' target='_blank' rel='noreferrer noopener' className='hover:underline'>
            <img src='/x.svg' alt='X Logo' className='w-6 h-6' />
          </a>
        </div>
        <p className='text-white text-sm'>© 2024 ARKAVIDIA. All rights reserved.</p>
    </div>
  )
}

export default Footer