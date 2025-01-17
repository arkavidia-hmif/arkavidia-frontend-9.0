'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '~/app/components/Button'
import { FaArrowRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'

interface CardCompetitionProps {
  title: string,
  logo: string,
  isActive: boolean,
}

const competitions = [
  {
    title: 'Arkalogica',
    description:
      'Arkalogica merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: '/images/competition/arkalogica-logo.png',
    link: '/competition/arkalogica'
  },
  {
    title: 'Capture The Flag',
    description:
      'Capture The Flag merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: '/images/competition/ctf-logo.png',
    link: '/competition/ctf'
  },
  {
    title: 'Competitive Programming',
    description:
      'Competitive Programming merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: '/images/competition/cp-logo.png',
    link: '/competition/cp'
  },
  {
    title: 'Datavidia',
    description:
      'Datavidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: '/images/competition/datavidia-logo.png',
    link: '/competition/datavidia'
  },
  {
    title: 'Hackvidia',
    description:
      'Hackvidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: '/images/competition/hackvidia-logo.png',
    link: '/competition/hackvidia'
  },
  {
    title: 'UXvidia',
    description:
      'UXvidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: '/images/competition/uxvidia-logo.png',
    link: '/competition/uxvidia'
  }
]

const CardCompetition = ({ title, logo, isActive } : CardCompetitionProps) => {
  return (
    <div
      className={`my-6 flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-80'}`}>
      <div className="relative flex h-16 w-32 justify-center rounded-sm bg-gradient-to-b from-[#2E046A] to-[#162951] px-8 pb-1 pt-6">
        <div className="flex items-center">
          <h1 className="text-center text-[10px] font-semibold [text-shadow:0px_0px_10px_#FFFFFF]">
            {title}
          </h1>
        </div>
        <Image
          src={logo}
          alt={title}
          width={259}
          height={276}
          className="absolute -top-4 size-8"
        />
      </div>
    </div>
  )
}

const CompetitionCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(2)

  return (
    <div>
      {/* Preview */}
      <div className="mx-6 mt-48 flex justify-start">
        <div className="basis-1/2 pr-2">
          <Image
            src={competitions[activeIndex].preview}
            alt={competitions[activeIndex].title}
            width={130}
            height={130}
            className="h-full w-full transition-transform duration-300 ease-in-out"
          />
        </div>
        <div className="relative basis-1/2">
          <div className="absolute flex flex-col gap-2">
            <h1 className="text-xs font-semibold [text-shadow:0px_0px_20px_#FFFFFF]">
              {competitions[activeIndex].title}
            </h1>
            <p className="text-justify text-[10px] text-lilac-100">
              {competitions[activeIndex].description}
            </p>
            <Button
              className="relative w-full rounded-lg bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] p-0 text-xs font-normal text-white"
              variant={'ghost'}>
              <Link href={competitions[activeIndex].link}>Go To Page</Link>
              <FaArrowRight className="absolute right-3 font-thin" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="mt-32">
        <Swiper
          centeredSlides={true}
          slidesPerView={2}
          spaceBetween={5}
          initialSlide={1}
          onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            393: {
              slidesPerView: 3,
              spaceBetween: 10
            }
          }}>
          {competitions.map((competition, index) => (
            <SwiperSlide key={index} className="flex items-center">
              <CardCompetition
                title={competition.title}
                logo={competition.carousel}
                isActive={index === activeIndex}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default CompetitionCarousel
