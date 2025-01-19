import React from 'react'

async function CompetitionPage({
  params
}: {
  params: Promise<{ competition: string }>
}) {
  const param = await params
  return <p>{param.competition}</p>
}

export default CompetitionPage
