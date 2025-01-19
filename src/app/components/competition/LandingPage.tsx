'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '../Navbar'
import Timeline, { TimelineEventProps } from '../Timeline'
import { Button } from '../Button'
import { IoMdDownload } from 'react-icons/io'
import FAQAccordion from '../FAQAccordion'
import CompetitionRegistration from '../CompetitionRegistration'


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
  const [currentOrClosestEvent, setCurrentOrClosestEvent] =
    useState<TimelineEventProps | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0) // Time left in milliseconds

  useEffect(() => {
    const now = new Date();
  
    // Separate events into past and future
    const pastEvents = props.registrationDeadline.filter(
      event => event.timeEnd && new Date(event.timeEnd).getTime() < now.getTime()
    );
    const futureEvents = props.registrationDeadline.filter(event => {
      const startTime = event.timeStart
        ? new Date(event.timeStart).getTime()
        : Number.MAX_SAFE_INTEGER;
      const endTime = event.timeEnd
        ? new Date(event.timeEnd).getTime()
        : Number.MAX_SAFE_INTEGER;
      return startTime > now.getTime() || endTime > now.getTime();
    });
  
    // Check for current event
    const currentEvent = props.registrationDeadline.find(event => {
      const startTime = event.timeStart
        ? new Date(event.timeStart).getTime()
        : Number.MIN_SAFE_INTEGER;
      const endTime = event.timeEnd
        ? new Date(event.timeEnd).getTime()
        : Number.MAX_SAFE_INTEGER;
      return now.getTime() >= startTime && now.getTime() <= endTime;
    });
  
    if (currentEvent) {
      setCurrentOrClosestEvent(currentEvent);
      setTimeLeft(
        currentEvent.timeEnd
          ? new Date(currentEvent.timeEnd).getTime() - now.getTime()
          : futureEvents.length > 0
          ? new Date(futureEvents[0].timeStart || futureEvents[0].timeEnd!).getTime() -
            now.getTime()
          : 0
      );
      return;
    }
  
    // Find the closest future event
    if (futureEvents.length > 0) {
      const closestFutureEvent = futureEvents.sort((a, b) => {
        const timeA = a.timeStart
          ? new Date(a.timeStart).getTime()
          : new Date(a.timeEnd!).getTime();
        const timeB = b.timeStart
          ? new Date(b.timeStart!).getTime()
          : new Date(b.timeEnd!).getTime();
        return timeA - timeB;
      })[0];
  
      const remainingTime = closestFutureEvent.timeStart
        ? new Date(closestFutureEvent.timeStart).getTime() - now.getTime()
        : new Date(closestFutureEvent.timeEnd!).getTime() - now.getTime();
  
      setCurrentOrClosestEvent(closestFutureEvent);
      setTimeLeft(remainingTime);
      return;
    }
  
    // If all events are in the past or none exist
    setCurrentOrClosestEvent(null);
    setTimeLeft(0);
  }, [props.registrationDeadline]);
  
  useEffect(() => {
    // Timer to update timeLeft every second
    const interval = setInterval(() => {
      if (currentOrClosestEvent && timeLeft > 0) {
        setTimeLeft(prev => (prev > 1000 ? prev - 1000 : 0)); // Decrease by 1 second
      } else if (timeLeft === 0) {
        setCurrentOrClosestEvent(null); // Mark as closed when timeLeft reaches 0
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [currentOrClosestEvent, timeLeft]);
  
  const formatTimeUnits = (ms: number) => {
    if (ms <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Set all to 0 if no time is left
    }
  
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  };
  
  const { days, hours, minutes, seconds } = formatTimeUnits(timeLeft);

  return (
    <div className="min-h-screen min-w-full bg-[url('/images/competition/landing-page.jpg')] bg-cover bg-no-repeat">
      <Navbar />
      <div className="mx-4 flex flex-col items-center gap-16 py-12 font-dmsans sm:mx-8 md:mx-12 md:gap-16 md:py-24 lg:mx-24 lg:gap-24 lg:py-36">
        {/* Competition Information Section */}
        <section
          className="flex flex-col items-center justify-around gap-8 md:gap-12"
          id="competition-information">
          <div className="flex flex-col gap-4 md:flex-row md:gap-8">
            <div className="flex w-full items-center justify-center md:w-1/3">
              <Image
                width={600}
                height={600}
                src={props.competitionLogoPath || '/arkavidiaLogo.svg'}
                alt={props.competitionName}
              />
            </div>
            <div className="flex w-full flex-col justify-start gap-4 text-wrap md:w-1/2 md:gap-10">
              <h1 className="text-bold text-center font-belanosima text-3xl uppercase sm:text-4xl md:text-left md:text-5xl lg:text-6xl">
                {props.competitionName}
              </h1>
              <p className="text-justify font-dmsans text-sm leading-6 sm:text-base md:text-lg md:leading-7">
                {props.competitionDescription}
              </p>
              
              <p className="text-center text-base font-bold md:text-left md:text-lg">
  {currentOrClosestEvent ? (
    timeLeft > 0 ? (
      `${currentOrClosestEvent.title}: ${
        currentOrClosestEvent.timeEnd
          ? new Date(currentOrClosestEvent.timeEnd).toLocaleDateString('id-ID', options)
          : currentOrClosestEvent.timeStart
          ? `Starts on ${new Date(currentOrClosestEvent.timeStart).toLocaleDateString('id-ID', options)}`
          : 'Date Not Available'
      }`
    ) : (
      'CLOSED'
    )
  ) : (
    'CLOSED'
  )}
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
            ].map(unit => (
              <div key={unit.label} className="flex flex-col items-center gap-2">
                <div className="flex flex-row gap-1 sm:gap-2 md:gap-3">
                  <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-3 py-3 text-xl font-bold text-white sm:px-4 sm:py-4 sm:text-2xl md:px-6 md:py-6 md:text-3xl">
                    <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      {Math.floor(unit.value / 10)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[linear-gradient(180deg,_#A555CC_0%,_#7138C0_100%);] px-3 py-3 text-xl font-bold text-white sm:px-4 sm:py-4 sm:text-2xl md:px-6 md:py-6 md:text-3xl">
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
          <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-8 md:gap-12">
            <Button variant="outline" className="w-full sm:w-auto">
              <a href={props.handbookLink} target='_blank' rel="noopener noreferrer">
              <div className="flex flex-row items-center justify-center gap-2">
                <IoMdDownload className="text-[#48E6FF]" />
                <span>Download Handbook</span>
              </div>
              </a>
            </Button>
            <CompetitionRegistration competitionID={props.competitionCode} competitionAbbreviation={props.competitionAbbr} />
          </div>
        </section>

        {/* Timeline Section */}
        <section
          className="flex flex-col items-center gap-8 md:gap-16"
          id="competition-timeline">
          <h1 className="text-center font-belanosima text-3xl font-extrabold uppercase sm:text-4xl md:text-5xl">
            Competition Timeline
          </h1>
          <div className="flex w-full flex-col items-center justify-center">
            <Timeline events={props.registrationDeadline} variant="vertical" />
          </div>
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
          <section className="w-1/2 px-4 sm:px-8" id="competition-contact">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-around sm:gap-12 md:gap-28">
              <div className="text-center font-dmsans text-base font-bold sm:text-left sm:text-lg">
                Contact Person
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                {props.contactPerson?.map(contact => (
                  <Button
                    variant="outline"
                    key={contact.contact}
                    className="w-full sm:w-auto">
                    <div className="flex flex-row items-center justify-center gap-2">
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
