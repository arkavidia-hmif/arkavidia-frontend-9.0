import Image from 'next/image'
import { CompetitionSwiper } from '../components/landing/CompetitionSwiper'
import GalleryCarousel from '../components/landing/GalleryCarousel'
import Timeline from '../components/Timeline'
import { CompetitionGaleryTimeline } from '../components/landing/CompetitionGalleryTimeLine'
import { ArrowLeftCircle } from 'lucide-react'
import { FaAngleLeft, FaAngleRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const competitions = [
  {
    title: 'Arkalogica',
    description:
      'Arkalogica merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/arkalogica-preview.png',
    carousel: '/images/competition/arkalogica-logo.png',
    link: '/competition/arkalogica'
  },
  {
    title: 'Capture The Flag',
    description:
      'Capture The Flag merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/ctf-preview.png',
    carousel: '/images/competition/ctf-logo.png',
    link: '/competition/capture-the-flag'
  },
  {
    title: 'Competitive Programming',
    description:
      'Competitive Programming merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/cp-preview.png',
    carousel: '/images/competition/cp-logo.png',
    link: '/competition/competitive-programming'
  },
  {
    title: 'Datavidia',
    description:
      'Datavidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/datavidia-preview.png',
    carousel: '/images/competition/datavidia-logo.png',
    link: '/competition/datavidia'
  },
  {
    title: 'Hackvidia',
    description:
      'Hackvidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/hackvidia-preview.png',
    carousel: '/images/competition/hackvidia-logo.png',
    link: '/competition/hackvidia'
  },
  {
    title: 'UXvidia',
    description:
      'UXvidia merupakan kompetisi yang bertujuan untuk menjadi ajang pengembangan kompetensi dan pertandingan antara talenta digital Indonesia khususnya di dunia sains data.',
    preview: '/images/competition/uxvidia-preview.png',
    carousel: '/images/competition/uxvidia-logo.png',
    link: '/competition/uxvidia'
  }
]

const MainLandingCompetitionPage = () => {
  return (
    <div className="md:py-18 relative flex min-h-screen flex-col items-center bg-[linear-gradient(180deg,_#2C016D_-17.56%,_#0F0123_35.71%)] py-10 text-center lg:py-24">
      <div className="relative z-10 flex w-full flex-col justify-center px-10 pt-12 md:pt-20 lg:pt-24">
        <h1 className="text-glow bg-gradient-to-b from-[#48E6FF] from-20% via-[#9274FF] to-[#C159D8] bg-clip-text font-belanosima text-[56px] font-bold leading-[70px] text-transparent md:text-[84px] md:leading-[96px] lg:text-[108px] lg:leading-[132px]">
          ARKAVIDIA 9.0
        </h1>
        <h2 className="lg::text-[40px] font-belanosima text-[24px] font-normal leading-[64px] text-lilac-100 md:text-[36px]">
          IT & Informatics Festival
        </h2>
      </div>

      <div
        className="mx-10 mt-16 rounded-lg bg-gradient-to-b from-[#240F3E] to-[#0E3F62] p-10 accent-[#0E3F62] backdrop-blur-lg md:mx-20 md:mt-24 lg:mx-40 lg:mt-36 xl:mx-52"
        style={{
          boxShadow:
            '0 0 -5px 5px rgba(72, 230, 255, 0.2), 0 0 10px rgba(72, 230, 255, 0.2)'
        }}>
        <p className="lg-[24px] text-left  font-dmsans text-[16px] leading-5 tracking-wider text-lilac-100 md:text-[20px] md:leading-6 lg:leading-7">
          Arkavidia merupakan acara IT tahunan yang diadakan oleh Himpunan Mahasiswa
          Informatika ITB. Dengan tema “Adaptive Collaboration to Encounter Digital
          Disruption”, Arkavidia 9.0 diharapkan akan lebih banyak individu sadar akan hak
          dan kewajibannya di dunia digital, sehingga dapat mewujudkan kemerdekaan digital
          bagi dirinya. Diharapkan dengan diadakannya acara ini, dapat memberikan manfaat
          bagi pelajar, civitas akademik, dan masyarakat umum seluruh Indonesia.
        </p>
      </div>

      <CompetitionSwiper competitions={competitions} />

      <CompetitionGaleryTimeline />

      <Image
        src={'/images/competition/bg-landing.png'}
        alt={'bg-competition'}
        width={1900}
        height={2080}
        className="absolute top-0 object-contain"
      />
    </div>
  )
}

export default MainLandingCompetitionPage
