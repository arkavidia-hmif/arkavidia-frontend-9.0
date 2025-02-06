import Image from 'next/image'
import { Button } from '~/app/components/Button'
import { Input } from '~/app/components/Input'

interface JoinTeamModalProps {
  eventType: string
  eventMap: Map<string, string>
  setModalState: (state: string) => void
  teamCode: string
  setTeamCode: (name: string) => void
  joinTeam: (team_code: string) => void
}

export default function JoinTeamModal({
  eventType,
  eventMap,
  setModalState,
  teamCode,
  setTeamCode,
  joinTeam
}: JoinTeamModalProps) {
  return (
    <>
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <div
          className="cursor-pointer transition duration-200 ease-in-out hover:drop-shadow-[0_0_10px_#C8A2C8]"
          onClick={() => setModalState('initial')}>
          <Image
            src="/icons/events/arrow_forward.svg"
            alt="Arrow Down"
            width={32}
            height={32}
            style={{ transform: 'rotate(180deg)' }}
          />
        </div>
        <div>
          <h2 className="break-words px-2 text-center font-teachers text-[16px] font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:px-0 md:text-start md:text-[20px]">
            Join Team for Academya {eventMap.get(eventType)}
          </h2>
          <p className="mb-16 px-2 text-center text-[14px] md:px-0 md:text-start md:text-base">
            Enter your team code to join
          </p>

          <div className="flex flex-col gap-1 px-4 md:px-0">
            <div className="mb-6 flex flex-col gap-2">
              <p className="text-lilac-200">
                Team Code
                <span className="text-red-500"> *</span>
              </p>
              <div className="md:w-[556px]">
                <Input
                  className="w-full"
                  placeholder="Enter your team code"
                  value={teamCode}
                  onChange={e => setTeamCode(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-[100%] rounded-xl"
              onClick={() => {
                joinTeam(teamCode)
                console.log(teamCode)
              }}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
