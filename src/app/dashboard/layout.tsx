import Sidebar from '../components/Sidebar/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="absolute h-full w-full pb-6"
      style={{
        backgroundImage: "url('/images/profile/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <Sidebar />
      <div className="px-8 py-20 lg:py-6 lg:pl-[230px]">{children}</div>
    </section>
  )
}
