import Navbar from '../components/Navbar'

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="py-6 md:min-h-screen"
      style={{
        backgroundImage: "url('/images/profile/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <Navbar />
      <div>{children}</div>
    </section>
  )
}
