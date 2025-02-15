import Footer from '~/app/components/Footer'
import Navbar from '~/app/components/Navbar'
import Image from 'next/image'

export default function EventPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative h-full min-h-screen w-full">
      {/* Kalo udah jadi harusnya bg nya bakalan keliatan full  */}
      <Image
        src="/images/event/event-bg.png"
        alt="Event Background"
        fill
        className="-z-10 bg-purple-900 object-cover object-center"
        quality={90}
      />
      <Navbar />
      <div>{children}</div>
      <Footer />
    </section>
  )
}
