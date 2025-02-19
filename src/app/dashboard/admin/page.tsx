'use client'

import { useAppSelector } from '~/redux/store'
import MainDashboardCompe from './components/MainDashboardCompe'
import MainDashboardEvent from './components/MainDashboardEvent'

const AdminDashboardPage = () => {
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const adminRole = useAppSelector(state => state.auth.adminRole)

  if (!isAdmin) {
    return null
  }

  if (adminRole === 'admin') {
    return (
      <div className="flex flex-col">
        <MainDashboardCompe />
        <MainDashboardEvent withHeader={false} />
      </div>
    )
  } else if (adminRole?.includes('competition')) {
    return <MainDashboardCompe />
  } else if (adminRole?.includes('event')) {
    return <MainDashboardEvent withTopBreak />
  }
}

export default AdminDashboardPage
