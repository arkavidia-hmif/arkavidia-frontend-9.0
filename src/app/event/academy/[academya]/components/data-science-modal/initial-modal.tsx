import Image from 'next/image'
import { Button } from '~/app/components/Button'

interface InitialModalProps {
  eventType: string
  eventMap: Map<string, string>
  setModalState: (state: string) => void
}

export default function InitialModal({
  eventType,
  eventMap,
  setModalState
}: InitialModalProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-3 flex flex-col items-center gap-0">
        <h2 className="break-words text-center font-teachers text-base font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:text-[32px]">
          <span className="text-[24px] leading-10 text-teal-300 md:text-[28px] lg:text-[36px]">
            {eventMap.get(eventType)} <span className="text-white">Registration</span>
          </span>{' '}
        </h2>
      </div>
      <p className="mb-16 text-center text-[16px] md:text-[18px] lg:text-[20px]">
        Build your team or join forces with others
      </p>

      {/* Button Create*/}
      <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-[88px]">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/icons/events/person_add_alt_1.svg"
            alt="Arrow Down"
            width={64}
            height={64}
            className="h-20 w-20 md:h-16 md:w-16 lg:h-24 lg:w-24"
          />
          <Button
            onClick={() => setModalState('create')}
            className="flex w-[166px] gap-2 rounded-xl"
            size={'lg'}>
            Create Team
            <Image
              src="/icons/events/arrow_forward.svg"
              alt="Arrow Down"
              width={24}
              height={24}
            />
          </Button>
        </div>

        {/* Button Join */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/icons/events/person_search.svg"
            alt="Arrow Down"
            width={64}
            height={64}
            className="h-20 w-20 md:h-16 md:w-16 lg:h-24 lg:w-24"
          />
          <Button
            onClick={() => setModalState('join')}
            className="flex w-[166px] gap-2 rounded-xl"
            size={'lg'}>
            Join Team
            <Image
              src="/icons/events/arrow_forward.svg"
              alt="Arrow Down"
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>
    </>
  )
}
