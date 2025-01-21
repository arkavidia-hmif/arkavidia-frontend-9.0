import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Footer() {
  return (
    <div className="relative overflow-hidden bg-[#0F0123]">
      <div className="flex flex-row space-x-0 overflow-visible">
        <div className="absolute -bottom-5 -left-[25%] h-60 w-60 rounded-full bg-[#0F0123] p-0 shadow-[0_0_30px_rgba(239,211,211,0.4)] md:-bottom-[45%] md:-left-10 md:h-80 md:w-80">
          <div className="h-full w-full rounded-full bg-[#0F0123]"></div>
        </div>
        <Image
          src="/Vector 5.svg"
          alt="wave1"
          className="absolute bottom-0 left-0 z-0 h-[90%] w-full lg:-left-1"
          layout="fill"
          objectFit="cover"
        />
        {/* <img src='Vector 5.svg' alt='wave1' className='absolute bottom-0 left-0 lg:-left-1 z-0 h-[90%] w-full'/> */}
        <Image
          src="/Vector 17.svg"
          alt="wave2"
          className="absolute bottom-0 right-0 z-0 h-[70%] w-full lg:-right-[15%]"
          layout="fill"
          objectFit="cover"
        />
        {/* <img src='Vector 17.svg' alt='wave2' className='absolute bottom-0 right-0 lg:-right-[15%] z-0 h-[70%] w-full'/> */}
        <div
          className="absolute left-[30%] top-0 z-0 h-full w-full md:left-[20%]"
          style={{
            backgroundImage: "url('Stars.svg')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'contain'
          }}
        />
      </div>
      <div className="relative z-10 flex flex-col items-start justify-center space-y-5 p-8">
        <Image
          src="/Logos.svg"
          alt="Arkavidia Logo"
          className="object-contain"
          width={150}
          height={40}
        />
        {/* <img src='/Logos.svg' alt='Arkavidia Logo' className='w-[150px] h-[40px] object-contain' /> */}
        <div className="flex flex-row items-center justify-center space-x-4 font-teachers text-sm font-bold text-white">
          <Link href="/event" className="hover:underline">
            Events
          </Link>
          <Link href="/competition" className="hover:underline">
            Competitions
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center space-x-2">
          <a
            href="https://www.linkedin.com/company/arkavidia/"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline">
            <Image src="/linkedin.svg" alt="LinkedIn Logo" width={24} height={24} />
            {/* <img src='/linkedin.svg' alt='LinkedIn Logo' className='w-6 h-6' /> */}
          </a>
          <a
            href="https://www.instagram.com/arkavidia/"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline">
            <Image src="/instagram.svg" alt="Instagram Logo" width={24} height={24} />
            {/* <img src='/instagram.svg' alt='Instagram Logo' className='w-6 h-6' /> */}
          </a>
          <a
            href="https://x.com/arkavidia"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline">
            <Image src="/x.svg" alt="X Logo" width={24} height={24} />
            {/* <img src='/x.svg' alt='X Logo' className='w-6 h-6' /> */}
          </a>
        </div>
        <p className="text-sm text-white">© 2025 ARKAVIDIA. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
