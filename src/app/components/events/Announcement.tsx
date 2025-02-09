'use client'
import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
import {
  client,
  getEventAnnouncement,
  GetEventAnnouncementResponse
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

interface AnnouncementType {
  id: string
  title: string
  contents: string
  background: string
}

interface AnnouncementProps {
  eventId: string
}

export const AnnouncementEventContent = ({ eventId }: AnnouncementProps) => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>()
  const axiosInstance = useAxiosAuth()

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const announcement = await getEventAnnouncement({
        client: axiosInstance,
        path: {
          eventId: eventId
        }
      })
      const announcementsLists  = announcement.data?.map((data, idx) => {
        const announcement: AnnouncementType = {
          id: data.id,
          title: data.title,
          contents: data.description,
          background: getBackgroundColor(idx)
        }
        return announcement;
      }) || [];
      setAnnouncements(announcementsLists)
    }
    fetchAnnouncements()
  }, [])


  function getBackgroundColor(idx: number){
    
    return idx % 2 === 0 ? 'to-[#FACCCC]' : 'to-[#4D06B0]'
  }

  return (
    <Accordion type="single" collapsible>
      {announcements?.map(announcement => (
        <AccordionItem key={announcement.id} value={`announcement-${announcement.id}`}>
          <AccordionTrigger
            accType="framed"
            className={`bg-gradient-to-r from-white/20 ${announcement.background} &[data-state=open]>svg]:rotate-180 mt-2 rounded-xl border border-white px-5 py-5 outline-border hover:no-underline hover:decoration-0 md:py-7 [&>svg]:size-5 [&>svg]:-rotate-90 [&>svg]:text-white md:[&>svg]:size-7 [&[data-state=open]>svg]:rotate-0`}>
            <p className="gap-3 text-lg font-semibold md:text-xl">{announcement.title}</p>
          </AccordionTrigger>
          <AccordionContent className="-mt-2 rounded-lg border border-white px-5 pb-10 pt-5">
            <p className="text-base md:text-lg">{announcement.contents}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
