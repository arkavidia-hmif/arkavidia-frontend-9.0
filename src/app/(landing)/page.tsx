import Image from 'next/image'
import CompetitionCarousel from '~/app/components/competition/CompetitionCarousel'

const MainLandingCompetitionPage = () => {
  return (
    <div className="md:py-18 relative flex min-h-screen flex-col items-center bg-[linear-gradient(180deg,_#7138C0_-14.45%,_#0F0123_35.71%)] py-10 text-center lg:py-24">
      <div className="relative z-10 flex w-full justify-center px-10">
        <div className="max-w-x flex flex-col items-center gap-2 pt-16 sm:gap-4 md:max-w-2xl lg:max-w-3xl">
          <h1 className="text-glow bg-gradient-to-r from-[#FFB8CF] from-20% via-[#AC7CD0] via-[62%] to-[#91F0FF] bg-clip-text font-belanosima text-[56px] font-bold leading-[132px] text-transparent md:text-[90px] lg:text-[120px]">
            COMPETITION
          </h1>
          <p className="px-8 text-justify font-dmsans text-[16px] leading-5 tracking-wider text-lilac-100 md:text-[20px] md:leading-6 lg:mt-10 lg:px-0 lg:leading-7">
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

      <div className="relative mt-20 flex flex-col items-center gap-2 md:mt-24 lg:mt-36">
        <h1 className="font-teachers text-[48px] font-bold [text-shadow:0px_0px_25px_#FFFFFF] md:text-[56px] lg:text-[68px]">
          PRIZE POOL
        </h1>
        <p className="min-h-[52px] bg-gradient-to-b from-[#48E6FF] via-[#9274FF] to-[#C159D8] bg-clip-text font-belanosima text-2xl text-[40px] font-bold leading-[52px] tracking-wide text-transparent [text-shadow:0px_0px_20px_#7C4099] md:text-[50px] lg:min-h-[64px] lg:text-[64px]">
          Rp 75.000.000++
        </p>
        <Image
          src={'/images/competition/box.png'}
          alt={'Prize'}
          width={1470}
          height={1678}
          className="z-10 w-48 md:w-[320px] lg:w-[500px]"
        />
      </div>

      <div className="mt-16 pb-10 md:mt-24">
        <CompetitionCarousel />
      </div>

      <Image
        src={'/images/competition/bg-competition.png'}
        alt={'bg-competition'}
        fill
        className="absolute top-16 z-0 object-contain"
      />
    </div>
  )
}

export default MainLandingCompetitionPage
