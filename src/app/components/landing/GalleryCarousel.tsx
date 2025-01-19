'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Button } from '../Button'

const gallery = [
  '/images/landing/gallery/gal-1.JPG',
  '/images/landing/gallery/gal-2.JPG',
  '/images/landing/gallery/gal-3.JPG',
  '/images/landing/gallery/gal-4.JPG',
  '/images/landing/gallery/gal-5.JPG',
  '/images/landing/gallery/gal-6.jpg',
  '/images/landing/gallery/gal-7.JPG',
  '/images/landing/gallery/gal-8.JPG',
  '/images/landing/gallery/gal-9.JPG'
]

const GalleryCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(Math.random() * gallery.length)
  )

  const handleLeft = () => {
    console.log('left')
    setActiveIndex(activeIndex === 0 ? gallery.length - 1 : activeIndex - 1)
  }

  const handleRight = () => {
    console.log('right')
    setActiveIndex(activeIndex === gallery.length - 1 ? 0 : activeIndex + 1)
  }

  return (
    <div className="flex w-full max-w-[400px] justify-center">
      <div className="flex w-full max-w-[400px] items-center justify-center gap-3">
        <Button onClick={handleLeft} className="cursor-pointer">
          <FaArrowLeft />
        </Button>
        <Swiper
          centeredSlides={true}
          slidesPerView={1}
          spaceBetween={20}
          initialSlide={0}
          onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
          loop={true}>
          {gallery.map((_, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center rounded-sm border-2 border-lilac-100 shadow-xl shadow-lilac-200 hover:cursor-grab active:cursor-grabbing">
              <div className="aspect-square w-full">
                <Image
                  src={gallery[activeIndex]}
                  alt={gallery[activeIndex]
                    .replace('/images/landing/gallery/', '')
                    .replace('.png', '')}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <Button onClick={handleRight} className="cursor-pointer">
          <FaArrowRight />
        </Button>
      </div>
    </div>
  )
}

export default GalleryCarousel
