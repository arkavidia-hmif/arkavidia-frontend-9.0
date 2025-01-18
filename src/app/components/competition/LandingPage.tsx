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
    <div className="min-h-[100vh] min-w-[100vw] bg-[url('/images/competition/landing-page.jpg')] bg-cover bg-no-repeat">
      <Navbar />
      <div className="mx-24 flex flex-col items-center gap-32 py-36 font-dmsans">
        <section
          className="flex flex-col items-center justify-around gap-12"
          id="competition-information">
          <div className="flex flex-row gap-8">
            <div className="flex w-1/3 items-center justify-center">
              <Image
                width={200}
                height={200}
                src={
                  props.competitionLogoPath !== '' && props.competitionLogoPath !== null
                    ? props.competitionLogoPath
                    : '/arkavidiaLogo.svg'
                }
                alt={props.competitionName}
              />
            </div>
            <div className="flex w-1/2 flex-col justify-between text-wrap">
              <h1 className="text-bold font-belanosima text-6xl uppercase">
                {props.competitionName}
              </h1>
              <p className="text-justify font-dmsans text-lg leading-7">
                {props.competitionDescription}
              </p>
              <p className="text-lg font-bold">
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
        <section className="flex flex-col gap-12" id="registration-time">
          <div className="flex flex-row items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row gap-3">
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold">
                  {Math.floor(days / 10)}
                </div>
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold text-white">
                  <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {days % 10}
                  </div>
                </div>
              </div>
              <div className="font-bold text-white">Days</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row gap-3">
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold text-white">
                  <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {Math.floor(hours / 10)}
                  </div>
                </div>
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold text-white">
                  <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {hours % 10}
                  </div>
                </div>
              </div>
              <div className="font-bold text-white">Hours</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row gap-3">
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold text-white">
                  <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {Math.floor(minutes / 10)}
                  </div>
                </div>
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold text-white">
                  <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {minutes % 10}
                  </div>
                </div>
              </div>
              <div className="font-bold text-white">Minutes</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row gap-3">
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold text-white">
                  <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {Math.floor(seconds / 10)}
                  </div>
                </div>
                <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-6 py-6 text-3xl font-bold text-white">
                  <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {seconds % 10}
                  </div>
                </div>
              </div>
              <div className="font-bold text-white">Seconds</div>
            </div>
          </div>

          {/* Button for registration and handbook */}
          <div className="flex flex-row justify-center gap-12">
            <Button variant="outline">
              <IoMdDownload className="text-[#48E6FF]" />
              Download Handbook
            </Button>
            <Button>
              Register Now <FaArrowRight />
            </Button>
          </div>
        </section>

        <section className="flex flex-col items-center gap-16" id="competition-timeline">
          <h1 className="font-belanosima text-5xl font-extrabold uppercase">
            Competition Timeline
          </h1>
          <div className="flex flex-col items-center justify-center">
            <Timeline events={props.registrationDeadline} variant="horizontal" />
          </div>
        </section>

        {props.winnerPrize && (
          <section className="flex flex-col items-center gap-12" id="competition-prizes">
            <h1 className="font-belanosima text-5xl font-extrabold uppercase">Prize</h1>
            <div className='flex flex-row gap-48 flex-wrap justify-around'>
              {props.winnerPrize?.map(winner => (
                <div key={winner.position} className='flex flex-col gap-4 items-center justify-center'>
                  <Image src={winner.positionLogo || "/images/competition/champion-logo.svg"} alt={winner.position} width={280} height={280}/>
                  <h3 className='text-2xl font-bold font-belanosima'>{winner.position}</h3>
                  <p className='text-xl'>{winner.prize}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {props.faqs && (
          <section className="flex flex-col items-center gap-12" id="competition-faq">
            <h1 className="font-belanosima text-5xl font-extrabold uppercase">FAQ</h1>
            <div className="flex flex-col items-center gap-6">
              <FAQAccordion items={props.faqs} />
            </div>
          </section>
        )}

        {props.contactPerson && (
          <section className="" id="competition-contact">
            <div className="flex flex-row items-center justify-around gap-28">
              <div className="font-dmsans text-lg font-bold">Contact Person</div>
              <div className="flex flex-row gap-2">
                {props.contactPerson?.map(contact => (
                  <Button variant="outline" key={contact.contact}>
                    <div className="flex flex-row gap-2">
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
  )
}
