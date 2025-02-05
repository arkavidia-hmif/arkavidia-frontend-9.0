import Image from "next/image"
import { Button } from "~/app/components/Button"

interface InitialModalProps {
  eventType: string
  eventMap: Map<string, string>
  setModalState: (state: string) => void
}

export default function InitialModal({ eventType, eventMap, setModalState }: InitialModalProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-3 flex flex-col items-center gap-0">
        <h2 className="break-words text-center font-teachers text-base font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:text-[32px]">
          Academya <span className="text-teal-300">{eventMap.get(eventType)}</span> Registration
        </h2>
      </div>
      <p className="mb-16 text-center text-[14px] md:text-base">Build your team or join forces with others</p>

      {/* Button Create*/}
      <div className="flex items-center justify-center gap-4 md:gap-[88px]">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/icons/events/person_add_alt_1.svg"
            alt="Arrow Down"
            width={64}
            height={64}
            className="h-8 w-8 md:h-16 md:w-16"
          />
          <Button onClick={() => setModalState("create")} className="flex w-[166px] gap-2 rounded-xl">
            Create Team
            <Image src="/icons/events/arrow_forward.svg" alt="Arrow Down" width={24} height={24} />
          </Button>
        </div>

        {/* Button Join */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/icons/events/person_search.svg"
            alt="Arrow Down"
            width={64}
            height={64}
            className="h-8 w-8 md:h-16 md:w-16"
          />
          <Button onClick={() => setModalState("join")} className="flex w-[166px] gap-2 rounded-xl">
            Join Team
            <Image src="/icons/events/arrow_forward.svg" alt="Arrow Down" width={24} height={24} />
          </Button>
        </div>
      </div>
    </>
  )
}

