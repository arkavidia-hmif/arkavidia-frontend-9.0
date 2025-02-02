'use client'
import React, { useEffect, useState } from 'react'
import Hero from '~/app/components/event/Academya/Hero'
import { Button } from '~/app/components/Button'
import Timeline from '~/app/components/Timeline'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Countdown from '~/app/components/event/Academya/Countdown'
import { useParams } from 'next/navigation'
import {
  Event,
  EventTimeline,
  getEventById,
  GetEventByIdResponse,
  getEventTimelineById
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

interface eventTimeline {
  title: string
  timeStart: Date
  timeEnd?: Date
}

function EventPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState<Event>()
  const [eventTimeline, setEventTimeline] = useState<eventTimeline[]>([])
  const axiosInstance = useAxiosAuth()

  useEffect(() => {
    const fetchEventById = async (eventId: string) => {
      const res: GetEventByIdResponse = await getEventById({
        client: axiosInstance,
        path: { eventId: eventId }
      }).then(res => res.data ?? [])

      if ('title' in res && 'description' in res) {
        setEvent(res as unknown as Event)
      }
    }

    // ! masih perlu diuji karena belum ada data timeline
    const fetchEventTimeline = async (eventId: string) => {
      const res = await getEventTimelineById({
        client: axiosInstance,
        path: { eventId: eventId }
      }).then(res => res.data ?? [])

      if (Array.isArray(res)) {
        const mappedEvents = res.map((timeline: EventTimeline) => ({
          title: timeline.title,
          timeStart: new Date(timeline.startDate),
          timeEnd: timeline.endDate ? new Date(timeline.endDate) : undefined
        }))
        setEventTimeline(mappedEvents)
      }
    }

    if (eventId && typeof eventId === 'string') {
      fetchEventById(eventId)
      fetchEventTimeline(eventId)
    }
  }, [eventId])

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center gap-32 pb-32 pt-52">
      {/* Hero Section */}
      <Hero eventTitle={event?.title} eventDescription={event?.description} />

      {/* Countdown & Register */}
      <section className="flex flex-col items-center justify-center gap-16">
        <div className="p-10">
          <Countdown targetDate={new Date('2025-02-04T00:00:00')} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant={'outline'}
            onClick={() => {
              if (event?.guidebookUrl) {
                window.open(event.guidebookUrl, '_blank')
              }
            }}>
            <Image
              src={'/images/event/download-icon.svg'}
              alt={'Download Handbook Icon'}
              width={16}
              height={16}
              className="mr-2"
            />
            Download Handbook
          </Button>
          {/* TODO: Handle Register Now Event */}
          <Button>
            Register Now
            <ArrowRight />
          </Button>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="flex flex-col items-center justify-center gap-28">
        <h1 className="font-belanosima text-6xl uppercase">EVENT TIMELINE</h1>
        {eventTimeline.length === 0 ? (
          <p className="font-dmsans text-base">No timeline available</p>
        ) : (
          <Timeline events={eventTimeline} variant={'horizontal'} />
        )}
      </section>

      {/* FAQ */}
      {/* Sponsors */}
    </div>
  )
}

export default EventPage
