'use client'
import { useLoginRedirect } from '~/lib/hooks/useRedirect'
import Sidebar from '../components/Sidebar/Sidebar'
import Image from 'next/image'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useLoginRedirect()
  return (
    <section className="relative h-[100vh] min-h-screen w-full overflow-auto bg-gradient-to-b from-[#1f0246] to-[#2e046a] md:min-h-screen">
      <Image
        src="/images/profile/reset-password/bg.png"
        alt="Background"
        className="fixed left-0 top-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <Sidebar />

      <div className="px-5 pb-5 pt-32 lg:pl-[220px] lg:pt-[34px]">{children}</div>
    </section>
  )
}
