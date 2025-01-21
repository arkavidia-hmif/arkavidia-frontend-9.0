import Timeline, { TimelineEventProps } from '../Timeline'
import GalleryCarousel from './GalleryCarousel'

export const CompetitionGaleryTimeline = () => {
  const TimelineData: TimelineEventProps[] = [
    {
      title: 'Academya'
    },
    {
      title: 'ArkavX'
    },
    {
      title: 'Gala Dinner'
    }
  ]
  return (
    <div className="z-50 mt-32 flex flex-col items-center justify-around gap-28 max-md:mt-16 lg:flex-row">
      <GalleryCarousel />

      <Timeline variant="vertical" events={TimelineData} />
    </div>
  )
}
