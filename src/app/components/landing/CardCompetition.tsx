import { ChevronRight } from 'lucide-react'
import { Button } from '../Button'
import { StandingPreview } from './StandingPreview'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'

export interface CompetitionBrief {
  title: string
  description: string
  preview: string
  link: string
  isActive?: boolean
}
export const LandingCardCompetition = ({
  title,
  description,
  preview,
  link,
  isActive = false
}: CompetitionBrief) => {
  const router = useRouter()
  function GoToPage() {
    router.push(link)
  }

  const TopMarginStanding =
    isActive && (title == 'Competitive Programming' || title == 'Capture The Flag')
      ? 'top-28'
      : 'top-8'

  const TopMarginContainer = isActive ? 'py-0' : 'translate-y-20'
  return (
    <div
      className={`select-none flex w-[444px] max-md:w-[320px] flex-col items-center justify-between ${isActive ? 'gap-[360px]' : 'gap-0'} ${TopMarginContainer}`}>
      {isActive && (
        <>
          <h1 className="z-10 text-center font-belanosima text-[36px] leading-[88px] text-white md:text-[48px] lg:text-[64px]">
            {title}
          </h1>

          <div className="z-10 flex flex-col items-center gap-4">
            <p className='lg:text-xl md:text-lg '>{description}</p>
            <Button onClick={GoToPage} className="flex flex-row gap-3 rounded-xl px-5">
              <p className="mx-5 text-base">Go To Page</p>

              <FaArrowRight />
            </Button>
          </div>
        </>
      )}

      <div className={`absolute ${TopMarginStanding} z-0`}>
        <StandingPreview preview={preview} isActive={isActive} />
      </div>
    </div>
  )
}
