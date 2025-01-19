'use client'

import { useState, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { Button } from './ui/button'

export type contentType = string

interface TabProps {
  contentType: contentType[]
  content: React.ReactNode[]
}

export const Tab = ({ contentType, content }: TabProps) => {
  const [selected, setSelected] = useState<contentType>(contentType[0])
  const [isOverflowingRight, setIsOverflowingRight] = useState(false)
  const [isOverflowingLeft, setIsOverflowingLeft] = useState(false)
  const tabContainerRef = useRef<HTMLDivElement>(null)

  const selectedContent = content[contentType.indexOf(selected)]

  const checkOverflow = () => {
    if (tabContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabContainerRef.current
      setIsOverflowingRight(scrollLeft + clientWidth < scrollWidth)
      setIsOverflowingLeft(scrollLeft > 0)
    }
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [])

  return (
    <>
      {/* Tab Bar */}

      <div className="relative h-fit">
        {/* Overflow Indicators */}
        {isOverflowingLeft && (
          <div className="absolute left-0 top-0 z-40 flex h-full items-center rounded-tl-md bg-gradient-to-r from-purple-300 to-transparent pr-8">
            <span className="ml-2 animate-pulse text-xl font-bold text-white">{'<'}</span>
          </div>
        )}
        {isOverflowingRight && (
          <div className="absolute right-0 top-0 z-40 flex h-full items-center bg-gradient-to-l from-purple-300 to-transparent pl-6">
            <span className="mr-2 animate-pulse rounded-tl-md text-xl font-bold text-white">
              {'>'}
            </span>
          </div>
        )}

        <div
          className="relative z-10 flex h-fit w-full flex-row justify-between gap-12 overflow-x-auto"
          ref={tabContainerRef}
          onScroll={checkOverflow} // Dynamically check overflow on scroll
        >
          {contentType.map(title => (
            <Menu
              key={title}
              Selected={selected}
              setSelected={setSelected}
              title={title}
            />
          ))}
        </div>
        <span className="absolute bottom-0 h-1 w-full rounded-full bg-white"></span>
      </div>

      {/* Render Selected Content */}
      <div className="mt-4">{selectedContent}</div>
    </>
  )
}

// Menu Component
interface MenuProps {
  Selected: contentType
  setSelected: Dispatch<SetStateAction<contentType>>
  title: contentType
}

const Menu = ({ Selected, setSelected, title }: MenuProps) => {
  const isSelected = Selected === title

  const onClick = () => {
    setSelected(title)
  }

  return (
    <Button
      variant="ghost"
      className="flex h-full w-full flex-col px-0 py-0 text-white hover:bg-white/40 hover:text-white"
      onClick={onClick}>
      <h1 className="font-teachers text-xl font-bold md:text-2xl">{title}</h1>
      {isSelected ? (
        <span className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF]"></span>
      ) : (
        <span className="h-1.5 w-full"></span>
      )}
    </Button>
  )
}
