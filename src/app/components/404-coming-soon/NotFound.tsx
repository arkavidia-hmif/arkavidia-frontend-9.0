import React from 'react'
import Image from 'next/image'
import { FaArrowRight } from 'react-icons/fa'
import RedirectButton from './RedirectButton'

function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-none pb-4">
      <Image
        src="/images/not-found/Background.png"
        alt="Not Found"
        layout="fill"
        objectFit="cover"
        className="z-0 object-left lg:object-center"
      />
      <div className="z-10 mx-10 my-2 items-center justify-center">
        <div className="flex items-center justify-center font-belanosima text-[150px] leading-[158px] text-purple-100 md:text-[180px] md:leading-[200px] lg:text-[250px] lg:leading-[300px]">
          <p className="[text-shadow:0_0_7px_#FFB8CF] lg:mr-1">4</p>
          <Image
            src="/images/not-found/planet-0.png"
            alt="0 symbol"
            fill
            quality={100}
            className="!static min-w-[90px] max-w-[90px] translate-y-1 scale-[125%] md:max-w-[120px] lg:max-w-[155px] lg:translate-y-2 lg:scale-[140%]"
          />
          <p className="[text-shadow:0_0_7px_#FFB8CF] lg:ml-1">4</p>
        </div>
        <div className="flex flex-col gap-y-4 text-center">
          <p className="mb-2 font-teachers text-[32px] font-bold [text-shadow:0_0_5px_#FFF]">
            Oops, you are lost in space!
          </p>
          <p className="mb-2 font-dmsans text-xl">
            We can't find the page you're looking for
          </p>
        </div>
        <RedirectButton>
          <div className="flex w-full items-center px-1">
            <p className="grow text-center font-dmsans text-xl">Go Home</p>
            <FaArrowRight className="ml-2 justify-self-end" />
          </div>
        </RedirectButton>
      </div>
    </div>
  )
}

export default NotFound
