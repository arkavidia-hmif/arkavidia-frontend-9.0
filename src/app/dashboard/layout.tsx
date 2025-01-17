import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="py-6 md:min-h-screen"
      style={{
        backgroundImage: "url('/images/profile/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <Sidebar />
      <div className="px-8 lg:pl-[220px]">{children}</div>
    </section>
  )
}
