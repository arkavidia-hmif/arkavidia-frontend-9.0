'use client'
import { StaticImageData } from 'next/image'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { CompetitionBrief, LandingCardCompetition } from './CardCompetition'

interface CompetitionsCarouselProps {
  competitions: CompetitionBrief[]
}

export const CompetitionSwiper = ({ competitions }: CompetitionsCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(Math.random() * competitions.length)
  )
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 8000 }}
      centeredSlides={true}
      slidesPerView={3}
      spaceBetween={60}
      initialSlide={activeIndex}
      onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
      loop={true}
      className="flex h-full w-full items-center"
      breakpoints={{
        0: {
          slidesPerView: 1, // For smaller screens, show one slide
          spaceBetween: 20
        },
        450: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        768: {
          slidesPerView: 2, // Medium screens
          spaceBetween: 40
        },
        1024: {
          slidesPerView: 3, // Larger screens
          spaceBetween: 60
        }
      }}>
      {competitions.map((competition, index) => (
        <SwiperSlide
          key={index}
          className="flex items-center hover:cursor-grab active:cursor-grabbing"
          onClick={() => setActiveIndex(index)}>
          <LandingCardCompetition
            title={competition.title}
            preview={competition.preview}
            isActive={index === activeIndex}
            description={competition.description}
            link={competition.link}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
