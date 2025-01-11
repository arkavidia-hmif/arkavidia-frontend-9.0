import React from 'react'

function ComponentBox({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="border-1 countdownBox flex flex-col items-center justify-center rounded-lg border p-1">
      <p className="countdownTitle mb-4 font-teachers text-[32px] font-bold">{title}</p>
      {children}
    </div>
  )
}

export default ComponentBox
