'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '../Navbar'

type RegistrationDeadlineProps = {
  title: string
  time: Date
}

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
  competitionName: string
  competitionDescription: string
  competitionLogoPath: string
  registrationTimeline: RegistrationDeadlineProps[]
  handbook: string
  registerLink: string
  faq?: FAQProps[]
  contactPerson?: ContactPersonProps[]
  winnerPrize?: WinnerPrizeProps[]
}

export const CompetitionLandingPage: React.FC<CompetitionLandingPageProps> = props => {
  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-[url('/images/competition/landing-page.jpg')] bg-cover bg-no-repeat">
      <Navbar />
      <div className="mx-24 my-8 flex flex-col items-center">
        <section
          className="flex flex-col items-center justify-around gap-12"
          id="competition-information">
          <div className="flex flex-row justify-center gap-28">
            <div className="grow-[4]">
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
            <div className="grow-0">
              <h1>{props.competitionName}</h1>
              <div>{props.competitionDescription}</div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section id="registration-time"></section>

        <section className="flex flex-col items-center" id="competition-timeline">
          <h1 className="text-2xl font-extrabold">Competition Timeline</h1>
          <div className="flex flex-col items-center justify-center">
            <div>
              <h3></h3>
            </div>
          </div>
        </section>

        <section className="" id='competition-prizes'></section>

        <section className='' id='competition-faq'></section>
      </div>
    </div>
  )
}
