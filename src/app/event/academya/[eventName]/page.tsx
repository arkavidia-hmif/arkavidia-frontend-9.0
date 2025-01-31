import React from 'react'
import Hero from '~/app/components/event/Academya/Hero'
import { Button } from '~/app/components/Button'
import Timeline from '~/app/components/Timeline'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Countdown from '~/app/components/event/Academya/Countdown'

async function EventPage({ params }: { params: { eventName: string } }) {
  const { eventName } = params

  const validEvents = ['ds', 'pm', 'softeng', 'uiux']
  if (!validEvents.includes(eventName)) {
    throw new Error('Invalid event name')
  }

  const events = [
    {
      title: 'Registration',
      timeStart: new Date('2025-02-01T00:00:00'),
      timeEnd: new Date('2025-02-15T23:59:59')
    },
    {
      title: 'Extended Registration',
      timeStart: new Date('2025-02-16T00:00:00'),
      timeEnd: new Date('2025-02-22T23:59:59')
    },
    {
      title: 'Announcement Phase 1',
      timeStart: new Date('2025-02-25T12:00:00'),
      timeEnd: new Date('2025-02-25T23:59:59')
    },
    {
      title: 'Announcement Phase 2',
      timeStart: new Date('2025-02-28T12:00:00'),
      timeEnd: new Date('2025-02-28T23:59:59')
    },
    {
      title: 'Academya Session',
      timeStart: new Date('2025-02-01T09:00:00'),
      timeEnd: new Date('2025-02-05T17:00:00')
    }
  ]

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center gap-32 pb-32 pt-52">
      {/* Hero Section */}
      <Hero type={eventName.toUpperCase() as 'UIUX' | 'PM' | 'DS' | 'SOFTENG'} />

      {/* Countdown & Register */}
      <section className="flex flex-col items-center justify-center gap-16">
        <div className="p-10">
          <Countdown targetDate={new Date('2025-02-01T00:00:00')} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant={'outline'}>
            <Image
              src={'/images/event/download-icon.svg'}
              alt={'Download Handbook Icon'}
              width={16}
              height={16}
              className="mr-2"
            />
            Download Handbook
          </Button>
          <Button>
            Register Now
            <ArrowRight />
          </Button>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="flex flex-col items-center justify-center gap-28">
        <h1 className="font-belanosima text-6xl uppercase">EVENT TIMELINE</h1>
        <Timeline events={events} variant={'horizontal'} />
      </section>

      {/* FAQ */}
      {/* Sponsors */}
    </div>
  )
}

export default EventPage
