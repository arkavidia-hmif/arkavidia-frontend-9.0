import React from 'react'
import { cn } from '~/lib/utils'

interface TagProps {
  variant:
    | 'success'
    | 'warning'
    | 'danger'
    | 'lilac'
    | 'purple'
    | 'teal'
    | 'pink'
    | 'blue'
    | 'neutral'
  text: string
  className?: string
}

function getTagStyling(variant: string) {
  switch (variant) {
    case 'success':
      return 'bg-green-300 text-green-800 border-green-500'
    case 'warning':
      return 'bg-yellow-300 text-yellow-800 border-yellow-500'
    case 'danger':
      return 'bg-red-300 text-red-800 border-red-500'
    case 'lilac':
      return 'bg-lilac-300 text-lilac-800 border-lilac-500'
    case 'purple':
      return 'bg-purple-300 text-white border-purple-500'
    case 'teal':
      return 'bg-teal-100 text-teal-600 border-teal-500'
    case 'pink':
      return 'bg-pink-100 text-pink-500 border-pink-300'
    case 'blue':
      return 'bg-blue-100 text-blue-500 border-blue-300'
    case 'neutral':
      return 'bg-neutral-100 text-650-800 border-neutral-300'
  }
}

function Tag({ variant, text, className }: TagProps) {
  const tagClass =
    getTagStyling(variant) +
    ' border-4 border-solid flex w-full items-center justify-center py-1 px-1 text-xs md:text-sm lg:text-base min-w-[100px] text-center'

  return (
    <div className={cn(tagClass, 'rounded-[25px]', className)}>
      <p className="font-dmsans leading-snug">{text}</p>
    </div>
  )
}

export default Tag
