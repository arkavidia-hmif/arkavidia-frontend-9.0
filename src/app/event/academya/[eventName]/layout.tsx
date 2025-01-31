import Footer from '../../../components/Footer'
import Navbar from '../../../components/Navbar'
import Image from 'next/image'

export default function EventPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative h-full min-h-screen w-full">
      <Image
        src="/images/event/event-bg.png"
        alt="Event Background"
        fill
        className="-z-10 object-cover object-center"
      />
      <Navbar />
      <div>{children}</div>
      <Footer />
    </section>
  )
}
