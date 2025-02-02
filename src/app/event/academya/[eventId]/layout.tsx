import Footer from '~/app/components/Footer'
import Navbar from '~/app/components/Navbar'
import Image from 'next/image'

export default function EventPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative h-full min-h-screen w-full px-4">
      {/* Kalo udah jadi harusnya bg nya bakalan keliatan full  */}
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
