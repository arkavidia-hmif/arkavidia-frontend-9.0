import Image from 'next/image'
import CompetitionCarousel from '~/app/components/competition/CompetitionCarousel'

const MainLandingCompetitionPage = () => {
  return (
    <div className="relative min-h-screen items-center bg-[linear-gradient(180deg,_#7138C0_-14.45%,_#0F0123_35.71%)]">
      <div className="relative z-10 w-full flex justify-center px-10">
        <div className="flex flex-col items-center gap-2 pt-16 sm:gap-4 max-w-xl">
          <h1 className="bg-gradient-to-br from-[#FFB8CF] via-[#AC7CD0] to-[#91F0FF] bg-clip-text text-2xl font-bold text-transparent [text-shadow:0px_0px_17.4px_#7138C0] sm:text-3xl md:text-5xl">
            COMPETITION
          </h1>
          <p className="text-justify text-xs leading-5 text-lilac-100 sm:text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pulvinar, massa
            eleifend bibendum consectetur, nulla ligula hendrerit sapien, et aliquam orci
            ex vitae odio. Vestibulum ligula nunc, bibendum aliquam orci sed, tempor
            varius turpis. Praesent interdum lacus lectus, a aliquet lectus tempus sit
            amet. Fusce cursus tempus euismod. Praesent nec risus a tellus pellentesque
            aliquet nec vel nulla. Curabitur non elit elementum dolor pellentesque gravida
            eget eu purus.
          </p>
        </div>
      </div>

      <div className="relative mt-24 sm:mt-28 md:mt-36 flex flex-col items-center gap-2">
        <h1 className="font-bold [text-shadow:0px_0px_25px_#FFFFFF] sm:text-lg md:text-3xl">
          PRIZE POOL
        </h1>
        <h1 className="bg-gradient-to-b from-[#48E6FF] via-[#9274FF] to-[#C159D8] bg-clip-text text-2xl font-bold text-transparent [text-shadow:0px_0px_20px_#7C4099] sm:text-3xl md:text-5xl">
          Rp 75.000.000++
        </h1>
        <Image
          src={'/images/competition/box.png'}
          alt={'Prize'}
          width={1470}
          height={1678}
          className="absolute top-4 w-44 sm:top-6 sm:w-48 md:w-72"
        />
      </div>

      <div className="mt-56 pb-20 sm:mt-64 md:mt-96">
        <CompetitionCarousel />
      </div>

      <Image
        src={'/images/competition/bg-competition.png'}
        alt={'bg-competition'}
        width={3024}
        height={3016}
        className="absolute top-16 z-0 w-full"
      />
    </div>
  )
}

export default MainLandingCompetitionPage
