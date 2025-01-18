'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '../Navbar'
import Timeline, { TimelineEventProps } from '../Timeline'
import { Button } from '../Button'
import { IoMdDownload } from 'react-icons/io'
import { FaArrowRight } from 'react-icons/fa'
import FAQAccordion from '../FAQAccordion'

type WinnerPrizeProps = {
  position: string
  prize?: number | string
  positionLogo?: string
}

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}

type ContactPersonProps = {
  name: string
  type?: 'phone' | 'email' | 'line' | 'whatsapp' | 'instagram' | string
  contact?: string
  iconPath?: string
}

type CompetitionLandingPageProps = {
  competitionCode: string
  competitionName: string
  competitionDescription: string
  competitionLogoPath: string
  registrationDeadline: TimelineEventProps[]
  handbookLink: string
  registerLink: string
  faqs?: { question: string; answer: string }[]
  contactPerson?: ContactPersonProps[]
  winnerPrize?: WinnerPrizeProps[]
}

export const CompetitionLandingPage: React.FC<CompetitionLandingPageProps> = props => {
  const [currentOrClosestEvent, setCurrentOrClosestEvent] =
    useState<TimelineEventProps | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0) // Time left in milliseconds

  useEffect(() => {
    const now = new Date()

    // Separate events into past and future
    const pastEvents = props.registrationDeadline.filter(
      event => event.timeEnd && new Date(event.timeEnd).getTime() < now.getTime()
    )
    const futureEvents = props.registrationDeadline.filter(event => {
      const startTime = event.timeStart
        ? new Date(event.timeStart).getTime()
        : Number.MAX_SAFE_INTEGER
      const endTime = event.timeEnd
        ? new Date(event.timeEnd).getTime()
        : Number.MAX_SAFE_INTEGER
      return startTime > now.getTime() || endTime > now.getTime()
    })

    // 1. Check for current event
    const currentEvent = props.registrationDeadline.find(event => {
      const startTime = event.timeStart
        ? new Date(event.timeStart).getTime()
        : Number.MIN_SAFE_INTEGER
      const endTime = event.timeEnd
        ? new Date(event.timeEnd).getTime()
        : Number.MAX_SAFE_INTEGER
      return now.getTime() >= startTime && now.getTime() <= endTime
    })

    if (currentEvent) {
      setCurrentOrClosestEvent(currentEvent)
      setTimeLeft(
        currentEvent.timeEnd
          ? new Date(currentEvent.timeEnd).getTime() - now.getTime()
          : 0
      )
      return
    }

    // 2. If no current event, find the closest future event
    if (futureEvents.length > 0) {
      const closestFutureEvent = futureEvents.sort((a, b) => {
        const timeA = a.timeStart
          ? new Date(a.timeStart).getTime()
          : new Date(a.timeEnd!).getTime()
        const timeB = b.timeStart
          ? new Date(b.timeStart!).getTime()
          : new Date(b.timeEnd!).getTime()
        return timeA - timeB
      })[0]

      const remainingTime = closestFutureEvent.timeStart
        ? new Date(closestFutureEvent.timeStart).getTime() - now.getTime()
        : new Date(closestFutureEvent.timeEnd!).getTime() - now.getTime()

      setCurrentOrClosestEvent(closestFutureEvent)
      setTimeLeft(remainingTime)
      return
    }

    // 3. If all events are in the past, return the latest past event
    if (pastEvents.length > 0) {
      const latestPastEvent = pastEvents.sort(
        (a, b) => new Date(b.timeEnd!).getTime() - new Date(a.timeEnd!).getTime()
      )[0]
      setCurrentOrClosestEvent(latestPastEvent)
      setTimeLeft(0)
      return
    }

    // 4. If no events exist
    setCurrentOrClosestEvent(null)
    setTimeLeft(0)
  }, [props.registrationDeadline])

  useEffect(() => {
    // Timer to update timeLeft every second
    const interval = setInterval(() => {
      if (currentOrClosestEvent && timeLeft > 0) {
        setTimeLeft(prev => (prev > 1000 ? prev - 1000 : 0)) // Decrease by 1 second
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentOrClosestEvent, timeLeft])

  const formatTimeUnits = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / (1000 * 60)) % 60
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    return { days, hours, minutes, seconds }
  }

  const { days, hours, minutes, seconds } = formatTimeUnits(timeLeft)

  return (
    <div className="min-h-screen min-w-full bg-[url('/images/competition/landing-page.jpg')] bg-cover bg-no-repeat">
      <Navbar />
      <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-24 flex flex-col items-center gap-16 md:gap-24 lg:gap-32 py-12 md:py-24 lg:py-36 font-dmsans">
        {/* Competition Information Section */}
        <section
          className="flex flex-col items-center justify-around gap-8 md:gap-12"
          id="competition-information">
          <div className="flex flex-col gap-4 md:flex-row md:gap-8">
            <div className="flex w-full md:w-1/3 items-center justify-center">
              <Image
                width={600}
                height={600}
                src={props.competitionLogoPath || '/arkavidiaLogo.svg'}
                alt={props.competitionName}
              />
            </div>
            <div className="flex w-full md:w-1/2 flex-col gap-4 md:gap-8 justify-start text-wrap">
              <h1 className="text-bold font-belanosima text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-center md:text-left">
                {props.competitionName}
              </h1>
              <p className="text-justify font-dmsans text-sm sm:text-base md:text-lg leading-6 md:leading-7">
                {props.competitionDescription}
              </p>
              <p className="text-base md:text-lg font-bold text-center md:text-left">
                {currentOrClosestEvent
                  ? 'Close ' +
                    currentOrClosestEvent.title +
                    ': ' +
                    currentOrClosestEvent.timeEnd.toLocaleDateString('id-ID', options)
                  : ''}
              </p>
            </div>
          </div>
        </section>

        {/* Time Left Section */}
        <section className="flex flex-col gap-8 md:gap-12" id="registration-time">
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 md:gap-10">
            {/* Timer Blocks */}
            {[
              { value: days, label: 'Days' },
              { value: hours, label: 'Hours' },
              { value: minutes, label: 'Minutes' },
              { value: seconds, label: 'Seconds' }
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center gap-2">
                <div className="flex flex-row gap-1 sm:gap-2 md:gap-3">
                  <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      {Math.floor(unit.value / 10)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      {unit.value % 10}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-white text-sm sm:text-base">{unit.label}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 md:gap-12">
            <Button variant="outline" className="w-full sm:w-auto">
              <div className='flex flex-row gap-2 justify-center items-center'>
                <IoMdDownload className="text-[#48E6FF]" />
                <span>Download Handbook</span>
              </div>
            </Button>
            <Button className="w-full sm:w-auto">
              Register Now <FaArrowRight />
            </Button>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="flex flex-col items-center gap-8 md:gap-16" id="competition-timeline">
          <h1 className="font-belanosima text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-center">
            Competition Timeline
          </h1>
          <div className="w-full flex flex-col items-center justify-center">
            <Timeline events={props.registrationDeadline} variant="vertical" />
          </div>
        </section>

        {/* Prize Section */}
        {props.winnerPrize && (
          <section className="flex flex-col items-center gap-8 md:gap-12" id="competition-prizes">
            <h1 className="font-belanosima text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-center">
              Prize
            </h1>
            <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 md:gap-48 flex-wrap justify-around">
              {props.winnerPrize?.map(winner => (
                <div key={winner.position} className="flex flex-col gap-4 items-center justify-center">
                  <Image
                    src={winner.positionLogo || "/images/competition/champion-logo.svg"}
                    alt={winner.position}
                    width={280}
                    height={280}
                    className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72"
                  />
                  <h3 className="text-xl sm:text-2xl font-bold font-belanosima text-center">
                    {winner.position}
                  </h3>
                  <p className="text-lg sm:text-xl text-center">{winner.prize}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {props.faqs && (
          <section className="flex flex-col items-center gap-8 md:gap-12 w-full" id="competition-faq">
            <h1 className="font-belanosima text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-center">
              FAQ
            </h1>
            <div className="flex flex-col items-center gap-6 w-full px-4 sm:px-8 md:px-12">
              <FAQAccordion items={props.faqs} />
            </div>
          </section>
        )}

        {/* Contact Person Section */}
        {props.contactPerson && (
          <section className="w-1/2 px-4 sm:px-8" id="competition-contact">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-6 sm:gap-12 md:gap-28">
              <div className="font-dmsans text-base sm:text-lg font-bold text-center sm:text-left">
                Contact Person
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                {props.contactPerson?.map(contact => (
                  <Button variant="outline" key={contact.contact} className="w-full sm:w-auto">
                    <div className="flex flex-row gap-2 items-center justify-center">
                      <Image
                        src={contact.iconPath || ''}
                        alt={contact.name}
                        width={20}
                        height={20}
                      />
                      <p>{contact.name}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
