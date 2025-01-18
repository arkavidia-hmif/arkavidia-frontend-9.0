import React from 'react'
import CompetitionPage from './components/CompetitionPage'

async function CompetitionDashboard({
  params
}: {
  params: Promise<{ competition: string }>
}) {
  const param = await params
  return <CompetitionPage compeName={param.competition} />
}

export default CompetitionDashboard
