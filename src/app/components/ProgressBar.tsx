import { Progress } from './ui/progress'

import React from 'react'

interface ProgressBarProps {
  progress: number
  isValueRightSided?: boolean
}

function valueText(value: number) {
  return (
    <span className="min-w-[4ch] shrink-0 font-dmsans text-sm text-white">{value}%</span>
  )
}

function ProgressBar({ progress, isValueRightSided = true }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-x-1.5">
      {!isValueRightSided && valueText(progress)}
      <div className="w-full">
        <Progress
          value={progress}
          max={100}
          className="bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8]"
        />
      </div>
      {isValueRightSided && valueText(progress)}
    </div>
  )
}

export default ProgressBar
