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

  const leftButtonRef = useRef<HTMLButtonElement>(null)
  const rightButtonRef = useRef<HTMLButtonElement>(null)

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
    handleGlowAnimation(rightButtonRef)
    swiperRef.current?.slideNext(400)
    setActiveIndex(swiperRef.current?.realIndex ?? randomIdx)
  }
  function prevSlide() {
    handleGlowAnimation(leftButtonRef)
    swiperRef.current?.slidePrev(400),
      setActiveIndex(swiperRef.current?.realIndex ?? randomIdx)
  }

  const handleGlowAnimation = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (buttonRef.current) {
      // Add the glow effect

      buttonRef.current.style.scale = '1.5'
      // Remove the glow effect after 200 milliseconds
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.scale = '1'
        }
      }, 400)
    }
  }

  const swiperRef = useRef<SwiperType | null>(null)
  return (
    <>
      <button
        ref={leftButtonRef}
        onClick={prevSlide}
        style={{
          position: 'absolute',

          zIndex: 10,
          fontSize: '2.25rem', // text-4xl
          color: 'rgba(255, 255, 255, 0.7)', // text-white text-opacity-70
          transition: 'transform 0.2s, opacity 0.2s, scale 0.3s',

          textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' // Glow effect
        }}
        className="left-0 flex h-full items-center rounded-md bg-transparent px-1.5 opacity-60 backdrop-blur-sm hover:opacity-100 lg:left-10">
        <span>
          <FaAngleLeft />
        </span>
      </button>
      <div className="relative flex max-h-[800px] w-full flex-col items-center">
        <h1 className="z-10 text-center font-belanosima text-[36px] leading-[88px] text-white md:text-[48px] lg:text-[64px]">
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
        <div className="z-10 flex w-[300px] translate-y-[-100px] flex-col items-center gap-4 md:w-[450px]">
          <p className="md:text-lg lg:text-xl">{getDescription(activeIndex)}</p>
          <Button className="flex flex-row gap-3 rounded-xl px-5">
            <Link
              href={getLink(activeIndex) ?? ''}
              className="flex flex-row items-center gap-3">
              <p className="mx-5 text-base">Go To Page</p>
              <FaArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <button
        ref={rightButtonRef}
        onClick={nextSlide}
        style={{
          position: 'absolute',

          zIndex: 10,
          fontSize: '2.25rem', // text-4xl
          color: 'rgba(255, 255, 255, 0.7)', // text-white text-opacity-70
          transition: 'transform 0.2s, opacity 0.2s , scale 0.3s',

          textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' // Glow effect
        }}
        className="right-0 flex h-full items-center rounded-md bg-transparent px-1.5 opacity-60 backdrop-blur-sm hover:opacity-100 lg:right-10">
        <FaAngleRight width={20} height={20} />
      </button>
    </>
  )
}
