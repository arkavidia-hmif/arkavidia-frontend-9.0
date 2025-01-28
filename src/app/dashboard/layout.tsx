'use client'
import { useLoginRedirect } from '~/lib/hooks/useRedirect'
import Sidebar from '../components/Sidebar/Sidebar'
import Image from 'next/image'
import useCheckFillInfo from '~/lib/hooks/useCheckFillInfo'
import { useToast } from '~/hooks/use-toast'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '~/redux/store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const router = useRouter()
  useLoginRedirect()
  const hasFilledInfo = useCheckFillInfo()
  const isAdmin = useAppSelector(state => state.auth.isAdmin)

  useEffect(() => {
    if (!hasFilledInfo && !isAdmin) {
      toast({
        title: 'Please fill in your information',
      description:
          'You need to fill in your information before you can access the dashboard',
        variant: 'info'
      })
      router.replace('/register/personal-data')
    }
  }, [])

  if (!hasFilledInfo && !isAdmin) {
    return (
      <section className="relative h-screen w-screen">
        <Image
          src="/images/competition/bg.png"
          alt="Background image"
          fill
          className="absolute z-[-10] h-full min-h-screen w-full bg-gradient-to-r from-[#1F0246] to-[#2E046A] object-cover"
        />
      </section>
    )
  }
  return (
    <section className="relative h-full w-full">
      <Sidebar />
      <div className="px-8 py-20 lg:py-6 lg:pl-[250px]">{children}</div>
      <Image
        src="/images/competition/bg.png"
        alt="Background image"
        fill
        className="absolute z-[-10] h-full min-h-screen w-full bg-gradient-to-r from-[#1F0246] to-[#2E046A] object-cover"
      />
    </section>
  )
}
