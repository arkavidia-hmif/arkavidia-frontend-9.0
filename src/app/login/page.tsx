import Image from 'next/image'
import { InputArea } from '../components/login/input-area'
import { ToastProvider } from '../components/ui/toast'
import { Toaster } from '../components/ui/toaster'

const LoginPage = () => {
  return (
      <div className="relative flex min-h-screen items-center bg-purple-900">
        {/* Background Placeholder */}
        <Image
          src={'/images/login/bg.svg'}
          alt="Starry Background"
          width={100}
          height={100}
          className="absolute h-screen w-screen"></Image>

        {/* Main Page Parts */}
        <div className="flex h-full w-full flex-row justify-center gap-[96px] max-md:my-10 max-md:flex-col max-md:items-center max-md:gap-[48px]">
          <Image
            src={'/images/login/arkav-logo.png'}
            alt={'Arkav Logo'}
            width={503}
            height={579}
            className="z-10 max-lg:w-80 max-md:h-72 max-md:w-64"
          />
          <div className="z-10">
            <InputArea />
          </div>
          {/* Background Placeholder */}
        </div>
        {/* NOTE: Might consider put this on main pages */}
        <Toaster/>
      </div>
  )
}

export default LoginPage