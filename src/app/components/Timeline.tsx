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
  // Sort the events by timeStart, then by timeEnd
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.timeStart?.getTime() ?? a.timeEnd?.getTime() ?? Infinity;
    const timeB = b.timeStart?.getTime() ?? b.timeEnd?.getTime() ?? Infinity;
    return timeA - timeB;
  });

  return (
    <div
      className={`flex w-full items-center justify-center ${
        variant === 'horizontal'
          ? 'flex-col lg:flex-row lg:flex-wrap lg:gap-y-28'
          : 'flex-col'
      }`}
    >
      {sortedEvents.map((event, index) => (
        <div
          key={index}
          className={`flex gap-4 md:gap-10 ${
            variant === 'horizontal'
              ? 'flex-row lg:w-96 lg:flex-col lg:items-center lg:justify-center'
              : 'w-72 flex-row sm:w-96'
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
                  ? `h-10 w-1 lg:h-1 lg:flex-1 ${
                      index === 0 ? 'bg-transparent' : 'bg-[#D2A0FF]'
                    }`
                  : `h-10 w-1 ${index === 0 ? 'bg-transparent' : 'bg-[#D2A0FF]'}`
              }`}
            />
            {/* Circle */}
            <div
              className="relative h-6 w-6 rounded-full bg-[#D2A0FF]"
              style={{
                boxShadow: '0 0 15px 5px rgba(210, 160, 255, 0.5)',
              }}
            />
            {/* Right Line: Hide only for last events */}
            <span
              className={`${
                variant === 'horizontal'
                  ? `h-10 w-1 lg:h-1 lg:flex-1 ${
                      index === sortedEvents.length - 1
                        ? 'bg-transparent'
                        : 'bg-[#D2A0FF]'
                    }`
                  : `h-10 w-1 ${
                      index === sortedEvents.length - 1
                        ? 'bg-transparent'
                        : 'bg-[#D2A0FF]'
                    }`
              }`}
            />
          </div>
          {/* Event Content */}
          <div
            className={`${
              variant === 'horizontal'
                ? 'flex w-96 flex-col justify-center px-8 text-left lg:px-0 lg:text-center'
                : 'flex flex-col justify-center pl-2 text-left md:pl-8'
            } space-y-2`}
          >
            <h1 className="text-2xl font-bold text-purple-100">
              {event.title}
            </h1>
            <p className="text-md text-gray-400">
              {event.timeStart &&
                event.timeStart.toLocaleDateString('id-ID', options)}
              {event.timeEnd && ' - ' + event.timeEnd?.toLocaleDateString('id-ID', options)}
              {event.timeStart || event.timeEnd ? '' : 'Coming Soon'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
