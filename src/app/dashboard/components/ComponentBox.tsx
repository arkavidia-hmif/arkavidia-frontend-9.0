import React from 'react'

function ComponentBox({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="border-1 countdownBox flex flex-col items-center justify-center rounded-lg border border-white border-opacity-60 bg-gradient-to-br from-white/[0.24] to-white/[0.08] p-3 shadow-[0_0_10px_rgba(255,255,255,0.2)] backdrop-blur-md">
      <p className="countdownTitle mb-4 font-teachers text-[20px] font-bold">{title}</p>
      {children}
    </div>
  )
}

export default ComponentBox
