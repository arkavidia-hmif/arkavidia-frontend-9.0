'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { getAdminAllEventTeams, getEvent, getEventById } from '~/api/generated'
import { EventTeam } from '~/api/generated'

import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

import { RegisteredTeamList } from '~/app/components/registered-event-teamlist/teamlist'
import Loading from '~/app/components/Loading'
import { AxiosError } from 'axios'
import { axiosInstance } from '~/lib/axios'

interface Pagination {
  currentPage: number
  totalItems: number
  totalPages: number
  next: string | null
  prev: string | null
}

function AdminEventDashboard() {
  const params = useParams<{ event: string }>()
  const authAxios = useAxiosAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const limit = '10'

  const [isEventFound, setIsEventFound] = useState(true)
  const [currentEventId, setCurrentEventId] = useState<string | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [teamData, setTeamData] = useState<EventTeam[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: currentPage,
    totalItems: 0,
    totalPages: 1,
    next: null,
    prev: null
  })

  // Get the event ID
  useEffect(() => {
    async function getEventId() {
      setIsLoading(true)
      const response = await getEvent({ client: axiosInstance })
      if (response.data) {
        const type = params.event.split('-')[1]
        const event = response.data.find(event =>
          event.title.toLowerCase().includes(type)
        )

        if (event) {
          setCurrentEventId(event.id)
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to get event data. Please refresh the page to try again.',
          variant: 'destructive',
          duration: 6000
        })
      }
      setIsLoading(false)
    }

    getEventId()
  }, [params.event])

  // Filter & search states
  const [teamStatusFilter, setTeamStatusFilter] = useState<
    Exclude<EventTeam['verificationStatus'], null> | undefined
  >(
    (searchParams.get('status') as
      | Exclude<EventTeam['verificationStatus'], null>
      | undefined) ?? undefined
  )
  const [teamStageFilter, setTeamStageFilter] = useState<EventTeam['stage'] | undefined>(
    (searchParams.get('stage') as EventTeam['stage']) ?? undefined
  )
  const [searchFilter, setSearchFilter] = useState<string>(
    searchParams.get('search') ?? ''
  )

  const fetchTeams = async (page: number) => {
    try {
      setIsLoading(true)
      if (!currentEventId) {
        return
      }

      const events = await getEventById({
        client: authAxios,
        path: { eventId: currentEventId }
      })

      if (!events?.data || events.data.length === 0) {
        setIsEventFound(false)
        toast({
          title: 'Event Not Found',
          description: `No event found with the name "${params.event}"`,
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }

      setIsEventFound(true)
      // @ts-expect-error
      setCurrentEventId(events.data.id)

      const response = await getAdminAllEventTeams({
        client: authAxios,
        // @ts-expect-error
        path: { eventId: events.data.id },
        query: {
          page: page.toString(),
          search: searchFilter,
          stage: teamStageFilter,
          verifStatus: teamStatusFilter,
          limit: limit
        }
      })

      if (response.data) {
        setTeamData(response.data.result ?? [])
        setPagination(
          response.data.pagination ?? {
            currentPage: 1,
            totalItems: 0,
            totalPages: 1,
            next: null,
            prev: null
          }
        )
      } else {
        setTeamData([])
        setPagination({
          currentPage: 1,
          totalItems: 0,
          totalPages: 1,
          next: null,
          prev: null
        })
      }
    } catch (err: unknown) {
      const error = err as AxiosError
      toast({
        title: 'Failed to fetch event teams',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateAllQueryString = ({
    page,
    search,
    stage,
    status
  }: {
    page?: number
    search?: string
    stage?: typeof teamStageFilter
    status?: typeof teamStatusFilter
  }) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page ? page.toString() : currentPage.toString())
    params.set('search', search ? search : searchFilter)

    if (!stage) {
      if (teamStageFilter) {
        params.set('stage', teamStageFilter)
      } else {
        params.delete('stage')
      }
    }

    if (!status) {
      if (teamStatusFilter) {
        params.set('status', teamStatusFilter)
      } else {
        params.delete('status')
      }
    }

    return params.toString()
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setCurrentPage(newPage)
  }

  // Effect for updating data when page or filter changes
  useEffect(() => {
    fetchTeams(currentPage)
    router.push(`?${generateAllQueryString({ search: searchFilter })}`)
  }, [currentPage, teamStatusFilter, teamStageFilter, currentEventId])

  function onSearchClick() {
    fetchTeams(currentPage)
    router.push(`?${generateAllQueryString({ search: searchFilter })}`)
  }

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <Loading />
        </div>
      ) : !isEventFound ? (
        <h1 className="font-belanosima text-3xl text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)] md:text-5xl">
          No event found with the name "{params.event}"
        </h1>
      ) : currentEventId === null ? (
        <div className="text-whitemd:text-3xl font-belanosima text-2xl">
          Event ID not valid
        </div>
      ) : (
        <RegisteredTeamList
          itemsPerPage={limit}
          teamData={teamData}
          pagination={pagination}
          eventId={currentEventId}
          currentSearchFilter={searchFilter}
          currentPage={currentPage}
          filterStates={{ teamStatusFilter, teamStageFilter }}
          onPageChange={handlePageChange}
          setCurrentPage={setCurrentPage}
          setSearchFilter={setSearchFilter}
          setTeamStatusFilter={setTeamStatusFilter}
          setTeamStageFilter={setTeamStageFilter}
          onSearchClick={onSearchClick}
        />
      )}
    </>
  )
}

export default AdminEventDashboard
