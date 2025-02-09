'use client'
import { MutableRefObject, useEffect, useState } from 'react'
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

import UIUXLogo from '/public/images/event/academya/uiux-carousel.png'
import SoftengLogo from '/public/images/event/academya/softeng-carousel.png'
import PMLogo from '/public/images/event/academya/pm-carousel.png'
import DSLogo from '/public/images/event/academya/datsci-carousel.png'
import { getEvent } from '~/api/generated'
import { axiosInstance } from '~/lib/axios'

const events = [
  {
    title: 'Academya UI UX',
    description: '',
    preview: '/images/event/academya/Academya - UI UX.svg',
    carousel: UIUXLogo,
    link: '/event/academya/uiux'
  },
  {
    title: 'Academya Software Engineering',
    description: '',
    preview: '/images/event/academya/Academya - Software Engineering.svg',
    carousel: SoftengLogo,
    link: '/event/academya/softeng'
  },
  {
    title: 'Academya Product Management',
    description: '',
    preview: '/images/event/academya/Academya - Product Management.svg',
    carousel: PMLogo,
    link: '/event/academya/pm'
  },
  {
    title: 'Academya Data Science',
    description: '',
    preview: '/images/event/academya/Academya - Data Science.svg',
    carousel: DSLogo,
    link: '/event/academya/datascience'
  }
]

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

export const EventSwiper = () => {
  const [eventData, setEventData] = useState(events)
  const randomIdx = Math.floor(Math.random() * eventData.length)
  const [activeIndex, setActiveIndex] = useState(randomIdx)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getEvent({ client: axiosInstance })
      const eventTemp: typeof events = []
      if (res.data) {
        res.data.forEach(event => {
          const eventName = event.title.split(' ')[2]
          const currentEventData = eventData.find(data =>
            data.title.toLowerCase().includes(eventName.toLowerCase())
          )

          if (currentEventData) {
            currentEventData.description = event.description
            eventTemp.push(currentEventData)
          }
        })
        setEventData(eventTemp)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  function getTitle(index: number) {
    return eventData.at(index)?.title
  }
  function getLink(index: number) {
    return eventData.at(index)?.link
  }

  function getDescription(index: number) {
    return eventData.at(index)?.description
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

  if (loading) return null

  return (
    <div className="relative col-span-3 mt-[120px] flex h-fit w-full items-center justify-center md:mt-[100px] md:px-10">
      <ArrowSign onClick={prevSlide} direction={'left'} />
      <div className="relative flex max-h-[800px] w-full flex-col items-center">
        <h1 className="z-[10] text-center font-belanosima text-[32px] leading-10 text-white md:text-[40px] md:leading-[60px] lg:text-[60px] lg:leading-[88px]">
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
          {eventData.map((event, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center overflow-visible hover:cursor-grab active:cursor-grabbing"
              onClick={() => {
                setActiveIndex(index)
                swiperRef.current?.slideToLoop(index, 400)
              }}>
              <StandingPreview preview={event.preview} isActive={activeIndex === index} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute top-[35rem] z-[10] flex w-[300px] flex-col items-center gap-4 md:w-[600px]">
          <p className="font-dmsans md:text-lg lg:text-xl">
            {getDescription(activeIndex)}
          </p>
          <Link
            href={getLink(activeIndex) ?? ''}
            className="flex flex-row items-center gap-3">
            <Button className="flex flex-row gap-3 rounded-xl px-5">
              <p className="mx-5 font-dmsans text-base">Go To Page</p>
              <FaArrowRight />
            </Button>
          </Link>
        </div>
      </div>

      <ArrowSign onClick={nextSlide} direction={'right'} />
    </div>
  )
}
