import Image from 'next/image'
import { Toaster } from '../components/ui/toaster'
import { FormForgetPassword } from './components/FormForgetPassword'

function ForgetPassword() {
  return (
    <div className="relative flex min-h-screen items-center bg-purple-900">
      <Image
        src={'/images/login/bg.svg'}
        alt="Starry Background"
        width={100}
        height={100}
        className="absolute h-screen w-screen"></Image>

      {/* Main Page Parts */}
      <div className="flex h-full w-full flex-row items-center justify-center gap-[96px] max-md:my-10 max-md:flex-col max-md:items-center max-md:gap-[48px]">
        <Image
          src={'/images/login/arkav-logo.png'}
          alt={'Arkav Logo'}
          width={503}
          height={579}
          className="z-10 max-lg:w-80 max-md:h-72 max-md:w-64"
        />
        <div className="z-10">
          <FormForgetPassword />
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
