import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useParams } from 'next/navigation'
import { getEventById } from '~/api/generated'
import { GetEventByIdResponse } from '~/api/generated'

const AcademyaHeroSection = () => {
  const { eventId } = useParams()
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [imageSrc, setImageSrc] = useState(`/images/event/academya/`)

  const axiosInstance = useAxiosAuth()

  useEffect(() => {
    const fetchEventById = async (eventId: string) => {
      const res: GetEventByIdResponse = await getEventById({
        client: axiosInstance,
        path: { eventId: eventId }
      }).then(res => res.data ?? [])

      if ('title' in res && 'description' in res) {
        setEventTitle(res.title as string)
        setEventDescription(res.description as string)
        setImageSrc(`/images/event/academya/${res.title}.svg`)
      }
    }

    if (eventId && typeof eventId === 'string') fetchEventById(eventId)
  }, [eventId])

  return (
    <section className="m-0 flex max-w-[1200px] flex-row items-center justify-center gap-6">
      <Image src={imageSrc} alt={eventTitle + ' Logo'} width={502} height={363} />
      <div className="flex max-w-[540px] flex-col gap-6">
        <h1 className="text-wrap font-belanosima text-5xl uppercase text-white">
          {eventTitle}
        </h1>
        <p className="text-balance font-dmsans text-base text-white">
          {eventDescription}
        </p>

        <h2 className="font-dmsans text-xl font-semibold">
          Close Registration: 12 & 15 February 2024, 23.59
        </h2>
      </div>
    </section>
  )
}

export default AcademyaHeroSection
