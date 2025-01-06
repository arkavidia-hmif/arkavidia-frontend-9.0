import Image from 'next/image'
import React from 'react'

function ComingSoon() {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <Image
        src="/images/coming-soon/ComingSoonBG.png"
        alt="Coming Soon"
        layout="fill"
        objectFit="cover"
        className="z-0 object-center pt-8 lg:object-top"
      />
      <div className="z-10 mx-4 flex flex-col items-center justify-center">
        <p className="gradient-coming-soon text-center font-belanosima text-7xl leading-[1.1] tracking-normal md:text-[96px] lg:text-[120px]">
          Coming Soon
        </p>
        <p className="mt-4 text-center font-dmsans text-base leading-normal tracking-normal md:text-lg lg:text-xl">
          by Arkavidia 9.0
        </p>
      </div>
    </div>
  )
}

export default ComingSoon
