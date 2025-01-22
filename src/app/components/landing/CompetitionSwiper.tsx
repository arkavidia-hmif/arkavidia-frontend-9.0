'use client'
import { MutableRefObject, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import { Button } from '../Button'
import { FaAngleLeft, FaAngleRight, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import { StandingPreview } from './StandingPreview'
import { useRef } from 'react'
import { Swiper as SwiperType } from 'swiper/types'
import { ArrowSign } from './ArrowSign'
interface CompetitionsCarouselProps {
  competitions: CompetitionBrief[]
}

export interface CompetitionBrief {
  title: string
  description: string
  preview: string
  link: string
  isActive?: boolean
}

export const CompetitionSwiper = ({ competitions }: CompetitionsCarouselProps) => {
  const randomIdx = Math.floor(Math.random() * competitions.length)
  const [activeIndex, setActiveIndex] = useState(randomIdx)

  function getTitle(index: number) {
    return competitions.at(index)?.title
  }
  function getLink(index: number) {
    return competitions.at(index)?.link
  }

  function getDescription(index: number) {
    return competitions.at(index)?.description
  }

  function nextSlide() {
    swiperRef.current?.slideNext(400)
    setActiveIndex(swiperRef.current?.realIndex ?? randomIdx)
  }
  function prevSlide() {
    swiperRef.current?.slidePrev(400),
      setActiveIndex(swiperRef.current?.realIndex ?? randomIdx)
  }

  const swiperRef = useRef<SwiperType | null>(null)
  return (
    <div className="relative col-span-3 mt-6 flex h-fit w-full items-center justify-center max-md:mt-16 md:mt-48 md:px-10">
      <ArrowSign onClick={prevSlide} direction={'left'} />
      <div className="relative flex max-h-[800px] w-full flex-col items-center">
        <h1 className="z-10 text-center font-belanosima text-[36px] leading-10 text-white md:text-[48px] md:leading-[60px] lg:text-[64px] lg:leading-[88px]">
          {getTitle(activeIndex)}
        </h1>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 8000 }}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={60}
          initialSlide={activeIndex}
          onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
          loop={true}
          onSwiper={swiper => (swiperRef.current = swiper)}
          className="flex h-full w-full items-center overflow-visible"
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
              className="flex items-center overflow-visible hover:cursor-grab active:cursor-grabbing"
              onClick={() => {
                setActiveIndex(index)
                swiperRef.current?.slideToLoop(index, 400)
              }}>
              <StandingPreview
                preview={competition.preview}
                isActive={activeIndex === index}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute z-10 flex w-[300px] top-[35rem] flex-col items-center gap-4 md:w-[600px]">
          <p className="font-dmsans md:text-lg lg:text-xl">
            {getDescription(activeIndex)}
          </p>
          <Button className="flex flex-row gap-3 rounded-xl px-5">
            <Link
              href={getLink(activeIndex) ?? ''}
              className="flex flex-row items-center gap-3">
              <p className="mx-5 font-dmsans text-base">Go To Page</p>
              <FaArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <ArrowSign onClick={nextSlide} direction={'right'} />
    </div>
  )
}
