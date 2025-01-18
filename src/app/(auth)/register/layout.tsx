import Image from 'next/image'
import { Toaster } from '../../components/ui/toaster'

interface Props {
  children: React.ReactNode
}

const RegisterLayout = ({ children }: Props) => {
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
      <div className="flex h-full w-full flex-row items-center justify-center gap-[110px] max-md:my-10 max-md:flex-col max-md:items-center max-md:gap-[24px]">
        <Image
          src={'/images/login/arkav-logo.png'}
          alt={'Arkav Logo'}
          width={503}
          height={579}
          quality={100}
          className="z-10 w-[250px] md:w-[330px] lg:w-[400px]"
        />
        <div className="z-10 max-md:mx-5">{children}</div>
      </div>
    </div>
  )
}

export default RegisterLayout
