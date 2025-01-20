'use client'

import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import { FaArrowRight } from 'react-icons/fa'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import Link from 'next/link'
import { randomInt } from 'crypto'
import { Button } from '../Button'
import { useRef } from 'react'
import { Swiper as SwiperType } from 'swiper/types'
import { useRouter } from 'next/navigation'
import ArkaLogo from '/public/images/competition/arkalogica-logo.png'
import CTFLogo from '/public/images/competition/ctf-logo.png'
import CPLogo from '/public/images/competition/cp-logo.png'
import DataLogo from '/public/images/competition/datavidia-logo.png'
import HackLogo from '/public/images/competition/hackvidia-logo.png'
import UXLogo from '/public/images/competition/uxvidia-logo.png'
import { ArrowSign } from '../landing/ArrowSign'

interface CardCompetitionProps {
  title: string
  logo: StaticImageData
  isActive: boolean
}

const competitions = [
  {
    title: 'Arkalogica',
    description:
      'Arkalogica merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/arkalogica-preview.png',
    carousel: ArkaLogo,
    link: '/competition/arkalogica'
  },
  {
    title: 'Capture The Flag',
    description:
      'Capture The Flag merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/ctf-preview.png',
    carousel: CTFLogo,
    link: '/competition/capture-the-flag'
  },
  {
    title: 'Competitive Programming',
    description:
      'Competitive Programming merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/cp-preview.png',
    carousel: CPLogo,
    link: '/competition/competitive-programming'
  },
  {
    title: 'Datavidia',
    description:
      'Datavidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: DataLogo,
    link: '/competition/datavidia'
  },
  {
    title: 'Hackvidia',
    description:
      'Hackvidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/hackvidia-preview.png',
    carousel: HackLogo,
    link: '/competition/hackvidia'
  },
  {
    title: 'UXvidia',
    description:
      'UXvidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/uxvidia-preview.png',
    carousel: UXLogo,
    link: '/competition/uxvidia'
  }
]
const CardCompetition = ({ title, logo, isActive }: CardCompetitionProps) => {
  let imageStyle = ''
  const swiperRef = useRef<SwiperRef>(null)

  if (title === 'Hackvidia') {
    imageStyle = 'w-[64px] md:w-[120px] -top-3 md:-top-7'
  } else if (title === 'Datavidia') {
    imageStyle = 'w-[48px] md:w-[72px] -top-5 md:-top-7'
  } else if (title === 'Competitive Programming') {
    imageStyle = 'w-[48px] md:w-[84px] -top-8 md:-top-[56px] lg:-top-[60px]'
  } else if (title === 'UXvidia') {
    imageStyle = 'w-10 md:w-[72px] -top-4 md:-top-8'
  } else if (title === 'Arkalogica') {
    imageStyle = 'w-10 md:w-[72px] -top-6 md:-top-12'
  } else {
    imageStyle = 'w-8 md:w-[64px] -top-5 md:-top-9'
  }

  const glowCardStyle = isActive
    ? {
        boxShadow:
          title === 'Hackvidia' || title === 'Capture The Flag'
            ? '0 0 10px 5px rgba(72, 230, 255, 0.6), 0 0 10px rgba(72, 230, 255, 0.6)'
            : title === 'UXvidia'
              ? '0 0 15px rgba(186, 85, 211, 0.6), 0 0 25px rgba(186, 85, 211, 0.6)'
              : '0 0 10px 5px rgba(255, 82, 82, 0.6), 0 0 10px rgba(255, 82, 82, 0.6)',
        transition: 'box-shadow 0.3s ease-in-out'
      }
    : {}

  const glowTextStyle = {
    textShadow: isActive
      ? title === 'Hackvidia' || title === 'Capture The Flag'
        ? '0 0 15px rgba(72, 230, 255, 0.8), 0 0 25px rgba(72, 230, 255, 0.6)'
        : title === 'UXvidia'
          ? '0 0 15px rgba(186, 85, 211, 0.6), 0 0 25px rgba(186, 85, 211, 0.6)'
          : '0 0 15px rgba(255, 82, 82, 0.8), 0 0 25px rgba(255, 82, 82, 0.6)'
      : 'none'
  }

  return (
    <div
      className={`my-16 flex items-center justify-center transition-transform duration-300 ${
        isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-80'
      }`}>
      <div
        className={`relative flex h-16 w-full max-w-md justify-center rounded-sm bg-gradient-to-b from-[#2E046A] to-[#162951] px-6 pb-1 pt-6 md:h-24`}
        style={glowCardStyle}>
        <div className="flex items-center">
          <h1
            className="text-center font-dmsans text-[10px] font-semibold md:text-base lg:text-xl"
            style={glowTextStyle}>
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

function prevSlide() {}

function nextSlide() {}

const CompetitionCarousel = () => {
  const router = useRouter()
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(Math.random() * competitions.length)
  )

  return (
    <div>
      {/* Preview */}
      <div className="flex w-full justify-center">
        <div className="grid min-h-[250px] max-w-5xl grid-cols-2 items-center justify-center gap-2 px-8 lg:px-0">
          <div className="flex items-center justify-center">
            <Image
              src={competitions[activeIndex].preview}
              alt={competitions[activeIndex].title}
              width={1013}
              height={763}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
            <h1 className="font-belanosima text-[24px] font-bold [text-shadow:0px_0px_20px_#FFFFFF] md:text-[42px] lg:text-[56px]">
              {competitions[activeIndex].title}
            </h1>
            <p className="text-justify font-dmsans text-xs leading-5 text-lilac-100 md:text-[14px] md:leading-6 lg:text-[16px]">
              {competitions[activeIndex].description}
            </p>
            <Button className="z-50 hover:cursor-pointer hover:opacity-75">
              <Link
                href={competitions[activeIndex].link}
                className="flex w-full items-center rounded-sm bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] px-3 py-2">
                <p className="grow text-center font-dmsans text-xs md:text-base">
                  Lihat Detail
                </p>
                <FaArrowRight className="ml-2 justify-self-end text-xs md:text-base" />
              </Link>
            </Button>
          </div>
          <div className="relative col-span-2 mt-6 flex w-full justify-center px-4 md:mt-14 lg:px-0">
            <ArrowSign onClick={prevSlide} direction={'left'} />
            <div className="w-full max-w-3xl">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                centeredSlides={true}
                slidesPerView={3}
                spaceBetween={20}
                initialSlide={activeIndex}
                onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
                loop={true}
                onSwiper={swiper => (swiperRef.current = swiper)}
                breakpoints={{
                  450: {
                    slidesPerView: 3,
                    spaceBetween: 30
                  }
                }}>
                {competitions.map((competition, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex items-center hover:cursor-grab active:cursor-grabbing"
                    onClick={() => {
                      setActiveIndex(index)
                      swiperRef.current?.slideToLoop(index, 500)
                    }}>
                    <CardCompetition
                      title={competition.title}
                      logo={competition.carousel}
                      isActive={index === activeIndex}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <ArrowSign onClick={nextSlide} direction={'right'} />
          </div>
        </div>
      </div>

      {/* Carousel */}
    </div>
  )
}

export default CompetitionCarousel
