import React from 'react'
import { cn } from '~/lib/utils'

function ComponentBox({
  children,
  title,
  center = true,
  morespace = false
}: {
  children: React.ReactNode
  title: string
  center?: boolean
  morespace?: boolean
}) {
  return (
    <div
      className={cn(
        'border-1 countdownBox flex flex-col items-center justify-center rounded-lg border border-white border-opacity-60 bg-gradient-to-br from-white/[0.24] to-white/[0.08] p-3 shadow-[0_0_10px_rgba(255,255,255,0.2)] xl:px-6 xl:pb-6 xl:pt-2',
        {
          'xl:items-start': !center
        }
      )}>
      <p
        className={
          'countdownTitle mb-4 font-teachers text-[20px] font-bold xl:text-[32px]' +
          (morespace ? ' mt-3' : '')
        }>
        {title}
      </p>
      {children}
    </div>
  )
}

export default ComponentBox
