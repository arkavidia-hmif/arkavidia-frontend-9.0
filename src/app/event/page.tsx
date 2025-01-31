import React from 'react'
import Hero from '../components/event/Academya/Hero'
import { Button } from '../components/Button'
import Timeline from '../components/Timeline'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Countdown from '../components/event/Academya/Countdown'

function EventPage() {
  const events = [
    {
      title: 'Registration',
      timeStart: new Date('2022-10-10T09:00:00'),
      timeEnd: new Date('2022-10-10T17:00:00')
    },
    {
      title: 'Extended Registration',
      timeStart: new Date('2022-10-11T09:00:00'),
      timeEnd: new Date('2022-10-10T17:00:00')
    },
    {
      title: 'Announcement Phase 1',
      timeStart: new Date('2022-10-12T09:00:00'),
      timeEnd: new Date('2022-10-12T17:00:00')
    },
    {
      title: 'Announcement Phase 2',
      timeStart: new Date('2022-10-12T09:00:00'),
      timeEnd: new Date('2022-10-12T17:00:00')
    },
    {
      title: 'Announcement Phase 3',
      timeStart: new Date('2022-10-12T09:00:00'),
      timeEnd: new Date('2022-10-12T17:00:00')
    }
  ]

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center gap-32 py-32">
      {/* Hero Section */}
      <Hero type={'PM'} />

      {/* Countdown & Register */}
      <section className="flex flex-col items-center justify-center gap-16">
        {/* TODO: Countdown */}
        <div className="p-10">
          <Countdown targetDate={new Date('2022-10-10T17:00:00')} />
        </div>

        {/* Button Register */}
        <div className="flex items-center justify-center gap-4">
          <Button variant={'outline'}>
            <Image
              src={'images/event/download-icon.svg'}
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
        <h1 className="font-belanosima text-6xl">EVENT TIMELINE</h1>
        <Timeline events={events} variant={'horizontal'} />
      </section>

      {/* FAQ */}
      {/* Sponsors */}
    </div>
  )
}

export default EventPage
