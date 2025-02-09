'use client'
import { useEffect, useState } from 'react'
import { Tab } from '../Tab'
import { getEventById, GetEventByIdError } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import Router from 'next/router'
import { useAppSelector } from '~/redux/store'

interface EventPageProps {
  eventId: string
  announcementComponent: React.ReactNode
  materialComponent: React.ReactNode
  taskComponent: React.ReactNode
}
export const EventPageComponent = ({
  eventId,
  announcementComponent,
  materialComponent,
  taskComponent
}: EventPageProps) => {
  const axiosInstance = useAxiosAuth()
  const [eventName, setEventName] = useState<string>()
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

  function generateContentsPage() {
    return [
      {
        title: 'Announcements',
        content: announcementComponent
      },
      {
        title: 'Material',
        content: materialComponent
      },
      {
        title: 'Task',
        content: taskComponent
      }
    ]
  }

  useEffect(() => {
    if (!isLoggedIn) Router.push('/login')

    const fetchEventName = async () => {
      try {
        const eventData = await getEventById({
          client: axiosInstance,
          path: {
            eventId: eventId
          }
        })

        setEventName(eventData.data?.title)
      } catch (e) {
        console.error(e)
      }
    }
    fetchEventName()
  }, [])

  const { contentTypes, contents } = generateContentsPage().reduce(
    (acc: { contentTypes: string[]; contents: React.ReactNode[] }, item) => {
      acc.contentTypes.push(item.title)
      acc.contents.push(item.content)
      return acc
    },
    { contentTypes: [], contents: [] }
  )
  return (
    <>
      <h1 className="text-glow-animated mb-7 text-xl text-white sm:text-3xl md:text-4xl">
        {eventName}
      </h1>
      <Tab contentType={contentTypes} content={contents} />
    </>
  )
}
