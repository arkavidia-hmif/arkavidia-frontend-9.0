import React from 'react'
import { FaCircle } from "react-icons/fa";

type TimelineEventProps = {
  title: string
  description: string
  time?: Date
  logoPath?: string
}

type TimelineProps = {
  events: TimelineEventProps[]
  variant: 'horizontal' | 'vertical'
}

const Timeline: React.FC<TimelineProps> = ({ events, variant }) => {
  return (
    <div
      className={`flex ${
        variant === 'horizontal' ? 'flex-row' : 'flex-col'
      } w-full items-center justify-center`}>
      {events.map((event, index) => (
        <div
          key={index}
          className={`flex ${
            variant === 'horizontal' ? 'w-96 flex-col items-center' : 'flex-row'
          } gap-4`}>
          {/* Timeline Line */}
          <div
            className={`flex ${
              variant === 'horizontal' ? 'w-full flex-row items-center' : 'flex-col'
            }`}>
            {/* Left Line: Show only for non-first events */}
            <span
              className={`${
                variant === 'horizontal'
                  ? `h-1 flex-1 ${index === 0 ? 'bg-transparent' : 'bg-[#D2A0FF]'}`
                  : `h-10 w-1 ${index === 0 ? 'bg-transparent' : 'bg-[#D2A0FF]'}`
              }`}
            ></span>

            {/* Circle */}
            <div
              className="h-6 w-6 rounded-full bg-[#D2A0FF] relative"
              style={{
                boxShadow: '0 0 15px 5px rgba(210, 160, 255, 0.5)',
              }}></div>

            {/* Right Line: Hide only for last events */}
            <span
              className={`${
                variant === 'horizontal'
                  ? `h-1 flex-1 ${
                      index === events.length - 1 ? 'bg-transparent' : 'bg-[#D2A0FF]'
                    }`
                  : `h-10 w-1 ${
                      index === events.length - 1 ? 'bg-transparent' : 'bg-[#D2A0FF]'
                    }`
              }`}
            ></span>
          </div>

          {/* Event Content */}
          <div
            className={`${
              variant === 'horizontal' ? 'w-96 text-center' : 'w-96 px-8 text-left'
            }`}>
            <h1 className="text-lg font-bold">{event.title}</h1>
            <p className="text-sm">{event.description}</p>
            {event.time && (
              <p className="text-xs text-gray-400">
                {event.time.toLocaleDateString()} {event.time.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
