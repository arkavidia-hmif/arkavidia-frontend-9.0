import React from 'react'
import Hero from '../components/event/Academya/Hero'
import { Button } from '../components/Button'
import Timeline from '../components/Timeline'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

function EventPage() {
  const events = [
    {
      title: 'Event Start',
      timeStart: new Date('2022-10-10T09:00:00')
    },
    {
      title: 'Event End',
      timeEnd: new Date('2022-10-10T17:00:00')
    }
  ]

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center gap-32">
      {/* Hero Section */}
      <Hero type={'PM'} />

      {/* Countdown */}
      {/* TODO: Countdown */}

      {/* Button Register */}
      <div className="flex gap-4">
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

      {/* Event Timeline */}
      <Timeline events={events} variant={'horizontal'} />

      {/* FAQ */}
      {/* Sponsors */}
    </div>
  )
}

export default EventPage
