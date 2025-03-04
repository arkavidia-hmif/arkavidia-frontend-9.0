'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '../Navbar'
import Timeline, { TimelineEventProps } from '../Timeline'
import { Button } from '../Button'
import { IoMdDownload } from 'react-icons/io'
import FAQAccordion from '../FAQAccordion'
import CompetitionRegistration from '../CompetitionRegistration'
import Link from 'next/link'
import { getUser } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useAppSelector } from '~/redux/store'
import { expandCompetitionName } from '~/lib/utils'

type WinnerPrizeProps = {
  position: string
  prize?: number | string
  positionLogo?: string
}

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

export type ContactPersonProps = {
  name: string
  type: SocialMedia
  contact?: string
}

export type SocialMedia =
  | 'phone'
  | 'email'
  | 'line'
  | 'whatsapp'
  | 'discord'
  | 'instagram'

export const contactLogo: Record<SocialMedia, string> = {
  line: '/images/profile/linelogo.svg',
  discord: '/images/profile/discordlogo.jpg',
  instagram: '/images/profile/iglogo.png',
  whatsapp: '/images/profile/whatsapplogo.svg',
  phone: '',
  email: ''
}

type CompetitionLandingPageProps = {
  competitionCode: string
  competitionAbbr: string
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
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const [currentOrClosestEvent, setCurrentOrClosestEvent] =
    useState<TimelineEventProps | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0) // Time left in milliseconds
  const [isRegistrationActive, setIsRegistrationActive] = useState<boolean>(false)
  const axiosAuth = useAxiosAuth()

  const registrationKeywords = [
    'Register',
    'Registration',
    'Pendaftaran',
    'Daftar',
    'Registrasi'
  ]

  useEffect(() => {
    const now = new Date()

    const futureEvents = props.registrationDeadline.filter(event => {
      const startTime = event.timeStart
        ? new Date(event.timeStart).getTime()
        : Number.MAX_SAFE_INTEGER
      const endTime = event.timeEnd ? new Date(event.timeEnd).getTime() : null
      return startTime > now.getTime()
    })

    let currentEvent: TimelineEventProps | null = null
    for (let i = 0; i < props.registrationDeadline.length; i++) {
      const event = props.registrationDeadline[i]
      if (event.timeStart && event.timeEnd) {
        const startTime = new Date(event.timeStart).getTime()
        const endTime = new Date(event.timeEnd).getTime()
        if (now.getTime() >= startTime && now.getTime() <= endTime) {
          currentEvent = event
          break
        }
      }
    }
    // const currentEvent = props.registrationDeadline.find(event => {
    //   const startTime = event.timeStart
    //     ? new Date(event.timeStart).getTime()
    //     : Number.MIN_SAFE_INTEGER
    //   const endTime = event.timeEnd ? new Date(event.timeEnd).getTime() : null
    //   // console.log('CURRENT EVENT: ', event)
    //   // console.log(
    //   //   event.title,
    //   //   ', STATUS: ',
    //   //   now.getTime() >= startTime && now.getTime() <= endTime,
    //   //   now.getTime(),
    //   //   startTime,
    //   //   endTime
    //   // )
    //   if (event.isTBA) return false
    //   if (endTime) {
    //     return now.getTime() >= startTime && now.getTime() <= endTime
    //   }

    //   return now.getTime() >= startTime
    // })

    if (currentEvent) {
      setCurrentOrClosestEvent(currentEvent)
      setTimeLeft(
        currentEvent.timeEnd
          ? new Date(currentEvent.timeEnd).getTime() - now.getTime()
          : futureEvents.length > 0
            ? new Date(futureEvents[0].timeStart || futureEvents[0].timeEnd!).getTime() -
              now.getTime()
            : 0
      )
    } else if (futureEvents.length > 0) {
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
    } else {
      setCurrentOrClosestEvent(null)
      setTimeLeft(0)
    }

    // Check for registration event
    const isRegistrationOngoing = props.registrationDeadline.some(event => {
      const titleIncludesRegistrationKeyword = registrationKeywords.some(keyword =>
        event.title.toLowerCase().includes(keyword.toLowerCase())
      )

      if (!titleIncludesRegistrationKeyword) return false

      const startTime = event.timeStart
        ? new Date(event.timeStart).getTime()
        : Number.MIN_SAFE_INTEGER
      const endTime = event.timeEnd
        ? new Date(event.timeEnd).getTime()
        : Number.MAX_SAFE_INTEGER

      return now.getTime() >= startTime && now.getTime() <= endTime
    })

    setIsRegistrationActive(isRegistrationOngoing)
  }, [props.registrationDeadline])

  useEffect(() => {
    // Timer to update timeLeft every second
    const interval = setInterval(() => {
      if (currentOrClosestEvent && timeLeft > 0) {
        setTimeLeft(prev => (prev > 1000 ? prev - 1000 : 0)) // Decrease by 1 second
      } else if (timeLeft === 0) {
        setCurrentOrClosestEvent(null) // Mark as closed when timeLeft reaches 0
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentOrClosestEvent, timeLeft])

  const formatTimeUnits = (ms: number) => {
    if (ms <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 } // Set all to 0 if no time is left
    }

    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / (1000 * 60)) % 60
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    return { days, hours, minutes, seconds }
  }

  const { days, hours, minutes, seconds } = formatTimeUnits(timeLeft)

  return (
    <div className="min-h-screen min-w-full py-10 md:py-0">
      <div className="lg:gap-18 mx-4 flex flex-col items-center gap-16 py-6 font-dmsans sm:mx-8 md:mx-12 md:gap-16 md:py-24 lg:mx-16 lg:py-24">
        {/* Competition Information Section */}
        <section
          className="flex flex-col items-center justify-around gap-8 md:gap-12"
          id="competition-information">
          <div className="flex flex-col justify-center gap-2 md:gap-0 lg:flex-row">
            <div className="flex w-full select-none items-center justify-center lg:w-auto">
              <Image
                width={650}
                height={650}
                src={props.competitionLogoPath || '/arkavidiaText.svg'}
                alt={props.competitionName}
              />
            </div>
            <div className="flex w-full flex-col justify-center gap-4 text-wrap md:gap-0 lg:w-1/2 lg:gap-10">
              <h1 className="text-bold text-center font-belanosima text-3xl uppercase sm:text-3xl md:text-4xl lg:text-left lg:text-6xl">
                {props.competitionName}
              </h1>
              <p className="text-justify font-dmsans text-sm leading-6 md:text-base md:leading-10 lg:text-lg">
                {props.competitionDescription}
              </p>

              <p className="text-center text-base font-bold md:text-left md:text-lg">
                {currentOrClosestEvent ? (
                  timeLeft > 0 ? (
                    `${currentOrClosestEvent.title}: ${
                      currentOrClosestEvent.timeStart
                        ? new Date(currentOrClosestEvent.timeStart).toLocaleDateString(
                            'id-ID',

                            options
                          )
                        : currentOrClosestEvent.timeStart
                          ? `Starts on ${new Date(currentOrClosestEvent.timeStart).toLocaleDateString('id-ID', options)}`
                          : 'Date Not Available'
                    }`
                  ) : (
                    <span className="rounded-sm border-red-400 px-6 py-2 text-center">
                      DITUTUP
                    </span>
                  )
                ) : (
                  'CLOSED'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Time Left Section */}
        <section
          className="flex w-[90%] flex-col gap-8 md:gap-12"
          id="registration-time ">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:flex md:flex-row md:items-center md:justify-center md:gap-10">
            {/* Timer Blocks */}
            {[
              { value: days, label: 'Hari' },
              { value: hours, label: 'Jam' },
              { value: minutes, label: 'Menit' },
              { value: seconds, label: 'Detik' }
            ].map(unit => (
              <div key={unit.label} className="flex flex-col items-center gap-1 md:gap-2">
                <div className="flex flex-row gap-1 sm:gap-2 md:gap-3">
                  <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-3 py-3 text-lg font-bold text-white sm:px-4 sm:py-3 sm:text-xl md:px-6 md:py-6 md:text-3xl">
                    <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      {Math.floor(unit.value / 10)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-3 py-3 text-lg font-bold text-white sm:px-4 sm:py-3 sm:text-xl md:px-6 md:py-6 md:text-3xl">
                    <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      {unit.value % 10}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-white sm:text-base">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8 lg:gap-12">
            <Link
              href={props.handbookLink === '#' ? '#' : props.handbookLink}
              target={
                props.handbookLink === '#' || props.handbookLink === '' ? '' : '_blank'
              }
              rel="noopener noreferrer">
              <Button variant="outline" className="w-full sm:w-auto">
                <div className="flex flex-row items-center justify-center gap-2">
                  <IoMdDownload className="text-[#48E6FF]" />
                  <span>Download Handbook</span>
                </div>
              </Button>
            </Link>
            <CompetitionRegistration
              competitionID={props.competitionCode}
              competitionAbbreviation={props.competitionAbbr}
              disabled={!isRegistrationActive}
            />
          </div>
        </section>

        {/* Timeline Section */}
        <section
          className="mt-20 flex w-full flex-col items-center gap-8 md:gap-12"
          id="competition-timeline">
          <h1 className="text-center font-belanosima text-3xl font-extrabold uppercase sm:text-4xl md:text-5xl">
            Competition Timeline
          </h1>
          <h1 className="text-center font-belanosima text-2xl font-extrabold uppercase sm:text-3xl md:text-4xl">
            (Updated)
          </h1>
          <Timeline events={props.registrationDeadline} variant="vertical" />
        </section>

        {/* Prize Section */}
        {props.winnerPrize && (
          <section
            className="flex flex-col items-center gap-8 md:gap-12"
            id="competition-prizes">
            <h1 className="text-center font-belanosima text-3xl font-extrabold uppercase sm:text-4xl md:text-5xl">
              Prize
            </h1>
            <div className="flex flex-col flex-wrap justify-around gap-12 sm:flex-row sm:gap-24 md:gap-48">
              {props.winnerPrize?.map(winner => (
                <div
                  key={winner.position}
                  className="flex flex-col items-center justify-center gap-4">
                  <Image
                    src={winner.positionLogo || '/images/competition/champion-logo.svg'}
                    alt={winner.position}
                    width={280}
                    height={280}
                    className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72"
                  />
                  <h3 className="text-center font-belanosima text-xl font-bold sm:text-2xl">
                    {winner.position}
                  </h3>
                  <p className="text-center text-lg sm:text-xl">{winner.prize}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {props.faqs && (
          <section
            className="flex w-full flex-col items-center gap-8 md:gap-12"
            id="competition-faq">
            <h1 className="text-center font-belanosima text-3xl font-extrabold uppercase sm:text-4xl md:text-5xl">
              FAQ
            </h1>
            <div className="flex w-full flex-col items-center gap-6 px-4 sm:px-8 md:px-12">
              <FAQAccordion items={props.faqs} />
            </div>
          </section>
        )}

        {/* Contact Person Section */}
        {props.contactPerson && (
          <section
            className="flex w-full items-center justify-center px-4 sm:px-8"
            id="competition-contact">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-center md:justify-around md:gap-12">
              <div className="text-nowrap text-center font-dmsans text-base font-bold sm:text-lg">
                Contact Person
              </div>
              <div className="flex w-full flex-col flex-wrap gap-4 sm:gap-2 md:flex-row">
                {props.contactPerson?.map(contact => (
                  <Link
                    key={contact.contact}
                    href={contact.contact || '#'}
                    className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full">
                      <div className="flex flex-row items-center justify-center gap-2 px-4">
                        <Image
                          src={contactLogo[contact.type] || ''}
                          alt={contact.name}
                          width={20}
                          height={20}
                        />
                        <p>{contact.name}</p>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <Image
        src={'/images/competition/landing-page.png'}
        // width={1920}
        // height={1080}
        fill
        className="absolute top-0 z-[-1] object-cover"
        alt="Landing Background"
      />
    </div>
  )
}
