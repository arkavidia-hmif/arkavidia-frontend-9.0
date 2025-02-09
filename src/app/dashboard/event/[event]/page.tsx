import { useParams } from 'next/navigation'
import { AnnouncementEventContent } from '~/app/components/events/Announcement'
import { EventPageComponent } from '~/app/components/events/EventPage'
import { Tab } from '~/app/components/Tab'

const EventPage = async ({ params }: { params: Promise<{ event: string }> }) => {
  const param = await params
  //TODO: Replace the following with the actual content components
  const eventId = param.event
  return (
    <main>
      <EventPageComponent
        eventId={eventId}
        announcementComponent={<AnnouncementEventContent eventId={eventId} />}
        materialComponent={<div>Replace with Material Content Component</div>}
        taskComponent={<div>Replace with Task Content Component</div>}
      />
    </main>
  )
}

export default EventPage
