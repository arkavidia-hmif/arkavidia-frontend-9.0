import React from 'react'

async function UserDashboard({ params }: { params: Promise<{ competition: string }> }) {
  const competitionName = (await params).competition
  return <div>UserDashboard</div>
}

export default UserDashboard
