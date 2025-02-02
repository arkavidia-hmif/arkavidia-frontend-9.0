import React from 'react'
import Image from 'next/image'

const AcademyaHeroSection = ({
  eventTitle,
  eventDescription,
  registrationCloseDate
}: {
  eventTitle: string | undefined
  eventDescription: string | undefined
  registrationCloseDate: string
}) => {
  const imageSrc = `/images/event/academya/` + eventTitle + `.svg`

  if (!eventTitle || !eventDescription) {
    return (
      <section className="m-0 mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-6 px-4 md:flex-row">
        <div className="h-[363px] w-[502px] animate-pulse rounded-lg bg-gray-700" />
        <div className="flex max-w-[540px] flex-col gap-6">
          <div className="h-14 w-96 animate-pulse rounded bg-gray-700" />
          <div className="h-24 w-full animate-pulse rounded bg-gray-700" />
          <div className="h-8 w-80 animate-pulse rounded bg-gray-700" />
        </div>
      </section>
    )
  }

  return (
    <section className="m-0 mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-6 px-4 md:flex-row">
      <Image src={imageSrc} alt={eventTitle + ' Logo'} width={502} height={363} />
      <div className="flex max-w-[540px] flex-col gap-6">
        <h1 className="text-wrap font-belanosima text-5xl uppercase text-white">
          {eventTitle}
        </h1>
        <p className="text-balance font-dmsans text-base text-white">
          {eventDescription}
        </p>

        <h2 className="font-dmsans text-xl font-semibold">
          Close Registration: {registrationCloseDate}
        </h2>
      </div>
    </section>
  )
}

export default AcademyaHeroSection
