'use client'
import React from 'react'
import Image from 'next/image'

function Loading({
  size,
  isSmallVariant = false
}: {
  size?: number
  isSmallVariant?: boolean
}) {
  // Parse size to be an even number
  if (size && size % 2 !== 0) {
    size = size + 1
  }

  const defaultSize = 360
  const maxSmallSize = 32
  const usedSize = size
    ? isSmallVariant
      ? Math.min(maxSmallSize, size)
      : size
    : isSmallVariant
      ? maxSmallSize
      : defaultSize
  const viewBox = `0 0 ${usedSize} ${usedSize}`

  // Path calculation
  let radius
  if (isSmallVariant) {
    radius = 0.75 * usedSize
  } else {
    radius = 0.85 * usedSize
  }
  const arcRadius = radius / 2
  const cursorVertical = (usedSize - radius) / 2
  const imageSize = 0.4 * usedSize

  const path = `M ${usedSize / 2} ${cursorVertical} a ${arcRadius} ${arcRadius} 0 0 1 0 ${radius} a ${arcRadius} ${arcRadius} 0 0 1 0 -${radius}`
  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 scale-[80%] items-center justify-center gap-x-3">
      <svg
        viewBox={viewBox}
        className="gradientLoader animate-spin rounded-full"
        style={{ width: usedSize, height: usedSize, animationDuration: '2s' }}>
        <path d={path} />
      </svg>
      {/* Center Content */}
      {isSmallVariant ? (
        <p className="font-teachers text-base font-bold text-white">Loading....</p>
      ) : (
        <div className="absolute flex flex-col items-center justify-center">
          <Image
            src="/loading_icon.png"
            alt="Loading icon"
            width={imageSize}
            height={imageSize}
            quality={30}
          />
          <p className="mt-2 font-teachers text-2xl font-bold text-white">Loading....</p>
        </div>
      )}
    </div>
  )
}

export default Loading
