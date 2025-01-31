import React from 'react'
import Image from 'next/image'

const AcademyaHeroSection = ({ type }: { type: 'UIUX' | 'PM' | 'DS' | 'SOFTENG' }) => {
  const imageSrc = `/images/event/academya/${type}.svg`
  const title =
    type === 'PM'
      ? 'Product Manager'
      : type === 'DS'
        ? 'Data Science'
        : type === 'UIUX'
          ? 'UI/UX'
          : 'Software Engineering'

  return (
    <section className="m-0 flex max-w-[1200px] flex-row items-center justify-center gap-6">
      <Image src={imageSrc} alt={type + ' Academya Logo'} width={502} height={363} />
      <div className="flex max-w-[540px] flex-col gap-6">
        <h1 className="text-wrap font-belanosima text-5xl text-white">
          ACADEMYA &ndash; {title}
        </h1>
        <p className="text-balance font-dmsans text-base text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
          laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.
          Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus.
        </p>

        <h2 className="font-dmsans text-xl font-semibold">
          Close Registration: 12 & 15 February 2024, 23.59
        </h2>
      </div>
    </section>
  )
}

export default AcademyaHeroSection
