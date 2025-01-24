import React from 'react'

const FrameInfoSkeleton = () => (
  <div
    style={{
      background:
        'linear-gradient(90.68deg, rgba(255,255,255,0.24) 0.11%, rgba(255,255,255,0.08) 99.1%)',
      boxShadow: '0px 0px 8px 0px #F5F5F580'
    }}
    className="flex flex-grow animate-pulse items-center justify-between gap-3 rounded-lg border border-white/25 px-6 py-5 font-teachers font-bold">
    <div className="h-16 rounded-lg bg-gray-700"></div>
  </div>
)

export default FrameInfoSkeleton
