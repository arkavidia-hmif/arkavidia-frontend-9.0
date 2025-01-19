import React from 'react'
import Image from 'next/image'

interface FrameInfoProps {
  number: number
  helperText: string
  imgSrc: string
}

const FrameInfo = ({ number, helperText, imgSrc }: FrameInfoProps) => {
  return (
    <div
      style={{
        background:
          'linear-gradient(90.68deg, rgba(255,255,255,0.24) 0.11%, rgba(255,255,255,0.08) 99.1%)',
        boxShadow: '0px 0px 8px 0px #F5F5F580'
      }}
      className="flex flex-grow items-center justify-between gap-3 rounded-lg border border-white/25 px-6 py-5 font-teachers font-bold">
      <div className="flex flex-col">
        <h2 className="text-3xl text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
          {number.toLocaleString().replace(/,/g, '.')}
        </h2>
        <h3 className="text-base text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
          {helperText}
        </h3>
      </div>
      <Image src={imgSrc} alt="Unverified Account Logo" width={54} height={54} />
    </div>
  )
}

export default FrameInfo
