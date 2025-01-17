'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FaArrowRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'

interface CardCompetitionProps {
  title: string
  logo: string
  isActive: boolean
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

const CardCompetition = ({ title, logo, isActive }: CardCompetitionProps) => {
  let imageStyle = ''
  if (title === 'Hackvidia') {
    imageStyle = 'w-14 md:w-20 -top-3 md:-top-5'
  } else if (title === 'Datavidia') {
    imageStyle = 'w-[40px] md:w-16 -top-3 md:-top-5'
  } else if (title === 'Competitive Programming') {
    imageStyle = 'w-[40px] md:w-[70px] -top-5 md:-top-10'
  } else {
    imageStyle = 'w-8 md:w-16 -top-3 md:-top-8'
  }

  return (
    <div
      className={`my-16 flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-80'}`}>
      <div
        className={`relative flex h-16 w-full max-w-md justify-center rounded-sm bg-gradient-to-b from-[#2E046A] to-[#162951] px-6 pb-1 pt-6 md:h-24 ${
          title === 'Hackvidia' || title === 'Capture The Flag'
            ? '[box-shadow:0px_0px_15px_#48E6FF4D] md:[box-shadow:0px_0px_20px_#48E6FF4D]'
            : '[box-shadow:0px_0px_15px_#FF4E884D] md:[box-shadow:0px_0px_20px_#FF4E884D]'
        }`}>
        <div className="flex items-center">
          <h1 className="text-center text-[10px] font-semibold [text-shadow:0px_0px_10px_#FFFFFF] md:text-base">
            {title}
          </h1>
        </div>
        <Image
          src={logo}
          alt={title}
          width={259}
          height={276}
          className={`absolute ${imageStyle}`}
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
      <div className="flex w-full justify-center">
        <div className="min-h-[250px] grid max-w-3xl grid-cols-2 items-center gap-2 px-8 lg:px-0">
          <div className="flex items-center justify-center">
            <Image
              src={competitions[activeIndex].preview}
              alt={competitions[activeIndex].title}
              width={1013}
              height={763}
              className="w-full max-w-64"
            />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
            <h1 className="text-xs font-bold [text-shadow:0px_0px_20px_#FFFFFF] sm:text-base md:text-2xl">
              {competitions[activeIndex].title}
            </h1>
            <p className="text-justify text-[10px] leading-5 text-lilac-100 sm:text-xs md:text-base md:leading-6">
              {competitions[activeIndex].description}
            </p>
            <Link href={competitions[activeIndex].link} className="hover:cursor-pointer">
              <div className="flex w-full items-center rounded-sm bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] px-3 py-2">
                <p className="grow text-center font-dmsans text-xs md:text-base">
                  Go To Page
                </p>
                <FaArrowRight className="ml-2 justify-self-end text-xs md:text-base" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="mt-12 flex justify-center px-4 md:mt-20 lg:px-0">
        <div className="w-full max-w-3xl">
          <Swiper
            centeredSlides={true}
            slidesPerView={3}
            spaceBetween={20}
            initialSlide={1}
            onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              450: {
                slidesPerView: 3,
                spaceBetween: 30
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
    </div>
  )
}

export default CompetitionCarousel
