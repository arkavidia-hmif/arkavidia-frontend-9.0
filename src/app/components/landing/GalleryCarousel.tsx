'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Button } from '../Button'
import { useRef } from 'react'
import { Swiper as SwiperType } from 'swiper/types'

const gallery = [
  '/images/landing/gallery/gal-1.JPG',
  '/images/landing/gallery/gal-3.JPG',
  '/images/landing/gallery/gal-4.JPG',
  '/images/landing/gallery/gal-5.JPG',
  '/images/landing/gallery/gal-6.jpg',
  '/images/landing/gallery/gal-7.JPG',
  '/images/landing/gallery/gal-8.JPG',
  '/images/landing/gallery/gal-9.JPG'
]

const GalleryCarousel = () => {
  const randomIdx = Math.floor(Math.random() * gallery.length)

  const swiperRef = useRef<SwiperType | null>(null)

  const handleLeft = () => {
    swiperRef.current?.slidePrev(500)
  }

  const handleRight = () => {
    console.log('right')

    swiperRef.current?.slideNext(500)
  }

  return (
    <div className="flex w-full items-center justify-center gap-3">
      <Button onClick={handleLeft} className="cursor-pointer">
        <FaArrowLeft />
      </Button>
      <div className="h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
        {' '}
        {/* Fixed dimensions */}
        <Swiper
          preventInteractionOnTransition={true}
          slidesPerView={1}
          spaceBetween={20}
          initialSlide={0}
          onSwiper={swiper => (swiperRef.current = swiper)}
          loop={true}>
          {gallery.map((gal, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center rounded-sm border-2 border-lilac-100 shadow-xl shadow-lilac-200 hover:cursor-grab active:cursor-grabbing">
              <div className="aspect-square w-full">
                <Image
                  src={gal}
                  alt={gal.replace('/images/landing/gallery/', '').replace('.png', '')}
                  layout="fill"
                  className="h-full w-full"
                  objectFit="cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Button onClick={handleRight} className="cursor-pointer">
        <FaArrowRight />
      </Button>
    </div>
  )
}

export default GalleryCarousel
