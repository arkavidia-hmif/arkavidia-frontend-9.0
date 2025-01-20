import Link from 'next/link'
import { Button } from '~/app/components/ui/button'

interface ProfileHeroProps {
  title: string
  isResetProfile: boolean
  name: string
  email: string
}

function ProfileHero({ title, isResetProfile, name, email }: ProfileHeroProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <h1 className="text-3xl font-bold text-white [text-shadow:0px_0px_17.7px_0px_#FFFFFF80] md:text-5xl">
        {title}
      </h1>
      <div className="flex w-full flex-col rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:flex-row md:justify-between md:p-10">
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-2xl font-bold text-white md:text-4xl">{name}</h1>
          <h3 className="text-sm text-white opacity-80 md:text-xl">{email}</h3>
        </div>

        {!isResetProfile && (
          <Link href="/forget-password">
            <Button
              className="mt-6 self-start bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white max-md:text-xs md:mt-0"
              type="button"
              variant={'ghost'}>
              Reset Password
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default ProfileHero
