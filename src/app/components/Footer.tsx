import React from 'react'

function Footer() {
  return (
    <div className='bg-[#0F0123] overflow-hidden relative'>
      <div className='flex flex-row space-x-0 overflow-visible'>
        <div className="absolute -bottom-5 md:-bottom-[45%] -left-[25%] md:-left-10 w-60 h-60 md:w-80 md:h-80 rounded-full bg-[#0F0123] p-0 shadow-[0_0_30px_rgba(239,211,211,0.4)]">
          <div className="w-full h-full bg-[#0F0123] rounded-full"></div>
        </div>
        <img src='Vector 5.svg' alt='wave1' className='absolute bottom-0 left-0 lg:-left-1 z-0 h-[90%] w-full'/>
        <img src='Vector 17.svg' alt='wave2' className='absolute bottom-0 right-0 lg:-right-[15%] z-0 h-[70%] w-full'/>
        <div
          className="absolute top-0 left-[30%] md:left-[20%] z-0 h-full w-full"
          style={{
            backgroundImage: "url('Stars.svg')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "contain",
          }}
        />
      </div>
      <div className='relative z-10 flex flex-col items-start justify-center space-y-5 p-8 z-0'> 
        <img src='/Logos.svg' alt='Arkavidia Logo' className='w-[150px] h-[40px] object-contain' />
        <div className='flex flex-row items-center justify-center space-x-4 font-teachers font-bold text-white text-sm'>
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
    </div>
  )
}

export default Footer