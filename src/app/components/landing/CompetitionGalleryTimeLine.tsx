import Timeline, { TimelineEventProps } from '../Timeline'
import GalleryCarousel from './GalleryCarousel'

export const CompetitionGaleryTimeline = () => {
  const TimelineData: TimelineEventProps[] = [
    {
      title: 'Academya'
    },
    {
      title: 'Arkavidia Talks'
    },
    {
      title: 'ITFest'
    },
    {
      title: 'Gala Dinner'
    }
  ]
  return (
    <div className="mt-48 flex flex-col items-center justify-around gap-28 max-md:mt-24 md:flex-row">
      <GalleryCarousel />

      <Timeline variant="vertical" events={TimelineData} />
    </div>
  )
}
