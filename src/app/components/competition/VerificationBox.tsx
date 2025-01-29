'use client'

import React, { useRef, useState, useEffect } from 'react'
import { capitalizeFirstLetter } from '~/lib/utils'
import { ChevronDown } from 'lucide-react' // Arrow icon

export interface VerificationBoxMessage {
  username: string
  type: string
  message: string
}

interface VerificationBoxProps {
  verifications: VerificationBoxMessage[] | null
}

function VerificationBox({ verifications }: VerificationBoxProps) {
  const boxContainerRef = useRef<HTMLDivElement>(null)
  const [showArrow, setShowArrow] = useState(false)

  useEffect(() => {
    const checkScrollable = () => {
      if (!boxContainerRef.current) return
      const { scrollHeight, clientHeight, scrollTop } = boxContainerRef.current

      // Show arrow if content is scrollable and user is not at the bottom
      setShowArrow(scrollTop + clientHeight < scrollHeight)
    }

    checkScrollable()

    window.addEventListener('resize', checkScrollable)
    return () => {
      window.removeEventListener('resize', checkScrollable)
    }
  }, [verifications])

  // Detect scroll and update arrow visibility
  const handleScroll = () => {
    if (!boxContainerRef.current) return
    const { scrollHeight, clientHeight, scrollTop } = boxContainerRef.current

    // Show the arrow if the user is not at the bottom
    setShowArrow(scrollTop + clientHeight < scrollHeight)
  }

  if (!verifications || verifications?.length === 0) {
    return null
  }

  return (
    <div className="relative flex flex-col gap-2 md:min-w-[300px] lg:w-[40%] lg:min-w-[350px]">
      <p className="font-teachers text-[24px] font-bold">Verification Error</p>
      <div
        className="scrollbar relative flex max-h-[150px] w-full flex-col gap-y-4 overflow-auto rounded-md border border-lilac-200 p-4"
        ref={boxContainerRef}
        onScroll={handleScroll}>
        {verifications?.map((verification, index) => (
          <div
            key={index}
            className="mt-1 flex w-full flex-col justify-between gap-y-0.5">
            <p className="font-dmsans text-[18px] font-bold">
              {verification.username} |{' '}
              <span className="font-normal">
                {capitalizeFirstLetter(verification.type)}
              </span>
            </p>
            <p className="font-dmsans text-[16px] text-red-200">
              {capitalizeFirstLetter(verification.message)}
            </p>
          </div>
        ))}

        {/* Scroll Indicator (Always at the bottom) */}
        {showArrow && (
          <div className="sticky bottom-0 flex h-5 w-5 self-center bg-gradient-to-b from-purple-200/80 to-transparent pb-2 lg:h-6 lg:w-6">
            <ChevronDown className="animate-bounce text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default VerificationBox
