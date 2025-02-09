import Timeline, { TimelineEventProps } from '../Timeline'
import GalleryCarousel from './GalleryCarousel'

export const CompetitionGaleryTimeline = () => {
  const TimelineData: TimelineEventProps[] = [
    {
      title: 'Academya',
      timeStart: new Date('2025-02-09T00:00:00'),
      timeEnd: new Date('2025-03-22T00:00:00')
    },
    {
      title: 'ArkavX'
    }
    // {
    //   title: 'Gala Dinner'
    // }
  ]
  return (
    <div className="z-50 mt-[8rem] flex flex-col items-center justify-around gap-28 max-md:mt-[9rem] xl:flex-row">
      <GalleryCarousel />

      <Timeline variant="vertical" events={TimelineData} />
    </div>
  )
}
