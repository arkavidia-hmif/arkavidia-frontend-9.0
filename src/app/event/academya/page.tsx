'use client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { getEvent } from '~/api/generated'
import { Event } from '~/api/generated/types.gen'
import Link from 'next/link'

function EventPage() {
  // return <ComingSoon />
  const axiosInstance = useAxiosAuth()
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await getEvent({ client: axiosInstance })
      if (res?.data) setEvents(res.data)
    }
    fetchEvent()
  }, [])
  return (
    <section className="relative h-full min-h-screen w-full">
      <div className="container mx-auto pt-52">
        <ul className="pt-50">
          {events.map((ev: Event) => (
            <li key={ev.id}>
              <Link key={ev.id} href={`/event/academya/${ev.id}`}>
                {ev.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default EventPage
