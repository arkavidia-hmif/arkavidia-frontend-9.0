'use client'
import React, { useEffect, useState } from 'react'
import Hero from '~/app/components/event/Academya/Hero'
import { Button } from '~/app/components/Button'
import Timeline from '~/app/components/Timeline'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Countdown from '~/app/components/event/Academya/Countdown'
import { useParams, useRouter } from 'next/navigation'
import {
  Event,
  EventTimeline,
  getEvent,
  getEventById,
  getEventTimeline,
  getEventTimelineById
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import Link from 'next/link'
import { getAcademyaEventName, getAcademyaEventType } from '~/lib/utils'
import ModalPopup from './components/RegisterModal'

interface eventTimeline {
  title: string
  timeStart: Date
  timeEnd?: Date
}

const SPONSORS_EXAMPLE = [
  {
    name: 'Gojek',
    logo: '/images/event/academya/sponsors/gojek.png',
    link: 'https://gojek.com'
  },
  {
    name: 'Paragon',
    logo: '/images/event/academya/sponsors/paragon.png',
    link: 'https://facebook.com'
  },
  {
    name: 'Shopee',
    logo: '/images/event/academya/sponsors/shopee.png',
    link: 'https://shopee.com'
  }
]

function EventPage() {
  const { eventName } = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const [event, setEvent] = useState<Event>()
  const [eventTimeline, setEventTimeline] = useState<eventTimeline[]>([])
  const [registrationCloseDate, setRegistrationCloseDate] = useState<string>('')
  const [eventId, setEventId] = useState<string>('')
  const axiosInstance = useAxiosAuth()

  const MOCK_EVENTS_DATA = [
    {
      title: 'No Data',
      timeStart: new Date('2025-01-01T00:00:00'),
      timeEnd: new Date('2025-01-01T00:00:00')
    },
    {
      title: 'No Data',
      timeStart: new Date('2025-01-01T00:00:00'),
      timeEnd: new Date('2025-01-01T00:00:00')
    },
    {
      title: 'No Data',
      timeStart: new Date('2025-01-01T00:00:00'),
      timeEnd: new Date('2025-01-01T00:00:00')
    },
    {
      title: 'No Data',
      timeStart: new Date('2025-01-01T00:00:00'),
      timeEnd: new Date('2025-01-01T00:00:00')
    },
    {
      title: 'No Data',
      timeStart: new Date('2025-01-01T00:00:00'),
      timeEnd: new Date('2025-01-01T00:00:00')
    }
  ]

  useEffect(() => {
    async function getEventData() {
      try {
        const res = await getEvent({ client: axiosInstance })
        if (res.data) {
          const eventTitle = getAcademyaEventName(eventName as string)
          const eventType = getAcademyaEventType(eventName as string)
          const event = res.data.find(
            (event: Event) =>
              event.title.toLowerCase() === eventTitle.toLowerCase() ||
              event.title.toLowerCase().includes(eventType.toLowerCase())
          )

          if (event) {
            setEventId(event.id)
          }
        }
      } catch (err: unknown) {
        toast({
          title: 'Failed to fetch event data',
          description: 'Error: ' + err,
          variant: 'destructive',
          duration: 5000
        })
      }
    }

    getEventData()
  }, [])

  useEffect(() => {
    const fetchEventById = async (eventId: string) => {
      try {
        const res = await getEventById({
          client: axiosInstance,
          path: { eventId: eventId }
        }).then(res => res.data)

        if (!res) {
          throw new Error('Event not found')
        }

        if (res && typeof res === 'object' && 'title' in res && 'description' in res) {
          setEvent(res as unknown as Event)
        } else {
          throw new Error('Invalid event data')
        }
      } catch (error) {
        toast({
          title: 'Failed to fetch event',
          description: error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
          duration: 5000
        })

        router.push('/')
      }
    }

    // TODO: masih perlu diuji karena belum ada data timeline
    const fetchEventTimeline = async (eventId: string) => {
      const res = await getEventTimeline({
        client: axiosInstance,
        path: { eventId: eventId }
      })

      if (res.data && Array.isArray(res)) {
        const mappedEvents = res.map((timeline: EventTimeline) => ({
          title: timeline.title,
          timeStart: new Date(timeline.startDate),
          timeEnd: timeline.endDate ? new Date(timeline.endDate) : undefined
        }))

        setEventTimeline(mappedEvents)
      } else {
        toast({
          title: 'Failed to fetch event timeline',
          description: 'Please try again later',
          variant: 'destructive',
          duration: 5000
        })
      }
    }

    if (eventId && typeof eventId === 'string' && eventId.length) {
      fetchEventById(eventId)
      fetchEventTimeline(eventId)
    }
  }, [eventId])

  useEffect(() => {
    const registrationEvent =
      eventTimeline.length > 0
        ? eventTimeline.find(event => event.title.toLowerCase().includes('regist'))
        : MOCK_EVENTS_DATA.find(event => event.title.toLowerCase().includes('regist')) // pake mock data kalo ga ada data timeline
    if (registrationEvent?.timeEnd) {
      setRegistrationCloseDate(
        registrationEvent.timeEnd.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      )
    }
  }, [eventTimeline])

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center gap-10 px-4 pb-32 pt-24 md:gap-12 md:pt-40 lg:gap-24 lg:pt-32">
      {/* Hero Section */}
      <Hero
        eventTitle={event?.title}
        eventDescription={event?.description}
        registrationCloseDate={registrationCloseDate}
      />

      {/* Countdown & Register */}
      <section className="flex flex-col items-center justify-center gap-6">
        <div className="p-10 pt-2">
          <Countdown
            targetDate={
              eventTimeline.length > 0
                ? eventTimeline.reduce((latest, current) =>
                    latest.timeStart > current.timeStart ? latest : current
                  ).timeStart
                : new Date('2025-02-07T00:00:00')
            }
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
          <Button
            variant={'outline'}
            onClick={() => {
              if (event?.guidebookUrl) {
                window.open(event.guidebookUrl, '_blank')
              }
            }}>
            <Image
              src={'/images/event/download.svg'}
              alt={'Download Handbook Icon'}
              width={16}
              height={16}
              className="mr-2"
            />
            Download Handbook
          </Button>
          {/* TODO: Handle Register Now Event */}
          {!event || !event.id ? (
            <Button disabled>
              Register Now
              <ArrowRight />
            </Button>
          ) : (
            <ModalPopup eventType={event.id} />
          )}
        </div>
      </section>

      {/* Event Timeline */}
      <section className="flex flex-col items-center justify-center gap-12 lg:gap-16">
        <h1 className="mt-6 text-center font-belanosima text-6xl uppercase md:mt-0">
          EVENT TIMELINE
        </h1>
        {eventTimeline.length === 0 ? (
          <>
            <Timeline events={MOCK_EVENTS_DATA} variant={'vertical'} />
          </>
        ) : (
          <Timeline events={eventTimeline} variant={'vertical'} />
        )}
      </section>

      {/* TODO: FAQ */}
      <section>
        <h1 className="font-belanosima text-6xl uppercase">FAQ</h1>
      </section>
      {/* TODO: Sponsors */}
      {/* <section>
        <h1 className="text-center font-belanosima text-6xl">Sponsors</h1>
        <div className="mt-8 rounded-xl border-2 border-none bg-gradient-to-b from-[rgba(206,106,255,0.2)] to-[rgba(72,230,255,0.2)] px-6 py-4 shadow-[0_0_33.1px_0_#EFD3D3] backdrop-blur-[20px]">
          <div className="flex flex-wrap justify-center gap-8">
            {SPONSORS_EXAMPLE.map(sponsor => (
              <Link
                key={sponsor.name}
                href={sponsor.link}
                target="_blank"
                rel="noreferrer">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={200}
                  height={200}
                  className="h-[156px] w-auto"
                  style={{ width: 'auto' }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default EventPage
