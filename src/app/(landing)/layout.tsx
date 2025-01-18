import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </section>
  )
}
