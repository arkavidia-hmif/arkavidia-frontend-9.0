import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Image from 'next/image'

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative h-full w-full">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </section>
  )
}
