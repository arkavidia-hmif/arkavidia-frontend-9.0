import React from 'react';

export type TimelineEventProps = {
  title: string;
  timeStart?: Date;
  timeEnd?: Date;
};

export type TimelineProps = {
  events: TimelineEventProps[];
  variant: 'horizontal' | 'vertical';
};

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const Timeline: React.FC<TimelineProps> = ({ events, variant }) => {
  return (
    <div
      className={`flex w-full items-center justify-center ${
        variant === 'horizontal'
          ? 'flex-col lg:flex-row lg:flex-wrap lg:gap-y-28'
          : 'flex-col'
      }`}
    >
      {events.map((event, index) => (
        <div
          key={index}
          className={`flex gap-4 md:gap-10 ${
            variant === 'horizontal'
              ? 'flex-row lg:w-96 lg:flex-col lg:items-center lg:justify-center'
              : 'flex-row w-72 sm:w-96 '
          }`}
        >
          {/* Timeline Line */}
          <div
            className={`flex ${
              variant === 'horizontal'
                ? 'flex-col items-center lg:w-full lg:flex-row lg:items-center'
                : 'flex-col items-center'
            }`}
          >
            {/* Left Line: Show only for non-first events */}
            <span
              className={`${
                variant === 'horizontal'
                  ? `w-1 h-10 lg:h-1 lg:flex-1 ${
                      index === 0 ? 'bg-transparent' : 'bg-[#D2A0FF]'
                    }`
                  : `h-10 w-1 ${index === 0 ? 'bg-transparent' : 'bg-[#D2A0FF]'}`
              }`}
            />
            {/* Circle */}
            <div
              className="h-6 w-6 rounded-full bg-[#D2A0FF] relative"
              style={{
                boxShadow: '0 0 15px 5px rgba(210, 160, 255, 0.5)',
              }}
            />
            {/* Right Line: Hide only for last events */}
            <span
              className={`${
                variant === 'horizontal'
                  ? `w-1 h-10 lg:h-1 lg:flex-1 ${
                      index === events.length - 1 ? 'bg-transparent' : 'bg-[#D2A0FF]'
                    }`
                  : `h-10 w-1 ${
                      index === events.length - 1 ? 'bg-transparent' : 'bg-[#D2A0FF]'
                    }`
              }`}
            />
          </div>
          {/* Event Content */}
          <div
            className={`${
              variant === 'horizontal'
                ? 'w-96 px-8 text-left flex flex-col justify-center lg:text-center lg:px-0'
                : 'pl-2 md:pl-8 text-left flex flex-col justify-center'
            } space-y-2`}
          >
            <h1 className="text-2xl font-bold text-purple-100">{event.title}</h1>
            <p className="text-md text-gray-400">
              {event.timeStart &&
                event.timeStart.toLocaleDateString('id-ID', options) + ' - '}
              {event.timeEnd && event.timeEnd?.toLocaleDateString('id-ID', options)}
              {event.timeStart || event.timeEnd ? '' : '-'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;