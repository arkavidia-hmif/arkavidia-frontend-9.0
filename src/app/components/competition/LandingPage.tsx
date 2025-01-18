'use client'

import React from 'react'
import Image from 'next/image'
import Navbar from '../Navbar'
import Timeline, {TimelineEventProps} from '../Timeline'


type WinnerPrizeProps = {
  position: string
  prize: number
}

type FAQProps = {
  title: string
  description: string
}

type ContactPersonProps = {
  name: string
  type: 'phone' | 'email' | 'line' | 'whatsapp' | 'instagram' | string
  contact: string
}

type CompetitionLandingPageProps = {
  competitionCode: string,
  competitionName: string
  competitionDescription: string
  competitionLogoPath: string
  registrationDeadline: TimelineEventProps[]
  handbookLink: string
  registerLink: string
  faq?: FAQProps[]
  contactPerson?: ContactPersonProps[]
  winnerPrize?: WinnerPrizeProps[]
}

export const CompetitionLandingPage: React.FC<CompetitionLandingPageProps> = props => {
  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-[url('/images/competition/landing-page.jpg')] bg-cover bg-no-repeat">
      <Navbar />
      <div className="mx-24 py-36 flex flex-col items-center gap-16">
        <section
          className="flex flex-col items-center justify-around gap-12"
          id="competition-information">
          <div className="flex flex-row gap-8">
            <div className="w-1/3 flex items-center justify-center">
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
            <div className="w-1/2 flex flex-col justify-between text-wrap">
              <h1 className='text-6xl text-bold font-belanosima'>{props.competitionName}</h1>
              <p className='text-lg text-justify font-dmsans'>{props.competitionDescription}</p>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section id="registration-time"></section>

        <section className="flex flex-col items-center gap-16" id="competition-timeline">
          <h1 className="text-5xl font-extrabold font-belanosima">Competition Timeline</h1>
          <div className="flex flex-col items-center justify-center">
            <Timeline events={props.registrationDeadline} variant='horizontal' />
          </div>
        </section>

        <section className="" id='competition-prizes'></section>

        <section className='' id='competition-faq'></section>
      </div>
    </div>
  )
}
