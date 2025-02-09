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
  const indicatorRef = useRef<HTMLSpanElement>(null)

  const checkOverflow = () => {
    if (tabContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabContainerRef.current
      setIsOverflowingRight(scrollLeft + clientWidth < scrollWidth)
      setIsOverflowingLeft(scrollLeft > 0)
    }
  }

  const updateIndicator = () => {
    if (!indicatorRef.current || !tabContainerRef.current) return


    const activeTab = tabContainerRef.current.querySelector(`[data-tab="${selected}"]`) as HTMLButtonElement
    
    if (activeTab) {
      const containerRect = tabContainerRef.current.getBoundingClientRect()
      const activeTabRect = activeTab.getBoundingClientRect()

      const visibleLeft = Math.max(activeTabRect.left, containerRect.left)
      const visibleRight = Math.min(activeTabRect.right, containerRect.right)
      const visibleWidth = Math.max(0, visibleRight - visibleLeft)

      const relativeLeft = visibleLeft - containerRect.left

      indicatorRef.current.style.width = `${visibleWidth}px`
      indicatorRef.current.style.transform = `translateX(${relativeLeft}px)`
      indicatorRef.current.style.transition = 'transform 0.6s ease, width 0.3s ease'
    }
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [])

   useEffect(() => {

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [selected])

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
          className="relative z-10 flex h-fit w-full -translate-y-1 flex-row justify-evenly overflow-x-auto"
          ref={tabContainerRef}
          onScroll={()=> {
            checkOverflow()
            updateIndicator()
          }} // Dynamically check overflow on scroll
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
        <div className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-white"></div>
        <span
          ref={indicatorRef}
          className="absolute bottom-0 h-1 rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] transition-all duration-300"></span>
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
      data-tab={title}
      variant="ghost"
      className={`relative w-full px-6 py-2 text-white transition-all duration-200 hover:bg-white/40 hover:text-white`}
      onClick={onClick}>
      <h1 className="font-teachers text-xl font-bold md:text-2xl">{title}</h1>
    </Button>
  )
}
