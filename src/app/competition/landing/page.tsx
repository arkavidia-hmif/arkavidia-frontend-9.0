import Image from 'next/image'
import CompetitionCarousel from '~/app/components/competition/CompetitionCarousel'

const MainLandingCompetitionPage = () => {
  return (
    <div className="relative min-h-screen items-center bg-[linear-gradient(180deg,_#7138C0_-14.45%,_#0F0123_35.71%)]">
      <div className="relative z-10 mx-10 flex flex-col items-center gap-4 pt-16">
        <h1 className="shadow-inner-[0_4px_4px_0_#00000040] bg-gradient-to-br from-[#FFB8CF] via-[#AC7CD0] to-[#91F0FF] bg-clip-text text-2xl font-bold text-transparent drop-shadow-[0_0_17.4px_0_#7138C0]">
          COMPETITION
        </h1>
        <p className="text-justify text-xs leading-5 text-lilac-100">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla pulvinar, massa
          eleifend bibendum consectetur, nulla ligula hendrerit sapien, et aliquam orci ex
          vitae odio. Vestibulum ligula nunc, bibendum aliquam orci sed, tempor varius
          turpis. Praesent interdum lacus lectus, a aliquet lectus tempus sit amet. Fusce
          cursus tempus euismod. Praesent nec risus a tellus pellentesque aliquet nec vel
          nulla. Curabitur non elit elementum dolor pellentesque gravida eget eu purus.
        </p>
      </div>

      <div className="relative mt-16 flex flex-col items-center gap-2">
        <h1 className="font-bold [text-shadow:0px_0px_25px_#FFFFFF]">PRIZE POOL</h1>
        <h1 className="bg-gradient-to-b from-[#48E6FF] via-[#9274FF] to-[#C159D8] bg-clip-text text-2xl font-bold text-transparent [text-shadow:0px_0px_20px_#7C4099]">
          Rp 75.000.000++
        </h1>
        <Image
          src={'/images/competition/prizepool.png'}
          alt={'Prize'}
          width={175}
          height={200}
          className="absolute top-5"
        />
      </div>

      <div className="mt-52 pb-20">
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
