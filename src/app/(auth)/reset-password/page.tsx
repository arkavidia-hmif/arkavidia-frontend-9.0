import Image from 'next/image'
import { ResetPasswordForm } from '../../components/reset-password/input-area'

const ResetPasswordPage = () => {
  return (
    <div className="relative flex min-h-screen items-center bg-purple-900">
      {/* Background Placeholder */}
      <Image
        src={'/images/reset-password/bg.svg'}
        alt="Starry Background"
        width={100}
        height={100}
        className="absolute h-screen w-screen"></Image>

      {/* Main Page Parts */}
      <div className="flex h-full w-full flex-row items-center justify-center gap-[96px] max-md:my-10 max-md:flex-col max-md:items-center max-md:gap-[48px]">
        <Image
          src={'/images/reset-password/arkav-logo.png'}
          alt={'Arkav Logo'}
          width={503}
          height={579}
          className="z-10 max-lg:w-80 max-md:h-72 max-md:w-64"
        />
        <div className="z-10">
          <ResetPasswordForm />
        </div>
        {/* Background Placeholder */}
      </div>
    </div>
  )
}

export default ResetPasswordPage
