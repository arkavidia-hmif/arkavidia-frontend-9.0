import React from 'react'
import CompetitionPage from './components/CompetitionPage'

async function CompetitionDashboard({
  parameter
}: {
  parameter: Promise<{ competition: string }>
}) {
  const param = await parameter
  return <CompetitionPage params={param} />
}

export default CompetitionDashboard
