'use client'
import { useLoginRedirect } from '~/lib/hooks/useRedirect'
import Sidebar from '../components/Sidebar/Sidebar'
import Image from 'next/image'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useLoginRedirect()
  return (
    <section className="relative h-full w-full">
      <Sidebar />
      <div className="px-8 py-20 lg:py-6 lg:pl-[250px]">{children}</div>
      <Image
        src={'/images/competition/bg.png'}
        alt={'bg-competition'}
        fill
        className="absolute z-[-10] w-full object-cover"
      />
    </section>
  )
}
