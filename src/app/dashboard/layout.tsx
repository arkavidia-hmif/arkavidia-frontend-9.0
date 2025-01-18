'use client'
import { useLoginRedirect } from '~/lib/hooks/useRedirect'
import Sidebar from '../components/Sidebar/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useLoginRedirect()
  return (
    <section
      className="absolute h-full w-full"
      style={{
        backgroundImage: "url('/images/competition/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
      <Sidebar />
      <div className="px-8 py-20 lg:py-6 lg:pl-[250px]">{children}</div>
    </section>
  )
}
