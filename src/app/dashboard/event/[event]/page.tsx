import React from 'react'
import EventDashboard from './components/EventDashboard'

async function EventDashboardPage({ params }: { params: Promise<{ event: string }> }) {
  const param = await params
  return <EventDashboard eventName={param.event} />
}

export default EventDashboardPage
