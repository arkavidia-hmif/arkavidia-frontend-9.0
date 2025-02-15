'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { getAdminAllCompetitionTeams, getCompetitionByName } from '~/api/generated'
import { Team } from '~/api/generated'

import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

import { RegisteredTeamList } from '~/app/components/registered-teamlist/teamlist'
import Loading from '~/app/components/Loading'
import { AxiosError } from 'axios'

interface Pagination {
  currentPage: number
  totalItems: number
  totalPages: number
  next: string | null
  prev: string | null
}

function AdminCompetitionDashboard() {
  const params = useParams<{ competition: string }>()
  const authAxios = useAxiosAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const limit = '10'

  const [isCompetitionFound, setIsCompetitionFound] = useState(true)
  const [currentCompetitionId, setCurrentCompetitionId] = useState<string | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [teamData, setTeamData] = useState<Team[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: currentPage,
    totalItems: 0,
    totalPages: 1,
    next: null,
    prev: null
  })

  // Filter & search states
  const [teamStatusFilter, setTeamStatusFilter] = useState<
    Exclude<Team['verificationStatus'], null> | undefined
  >(
    (searchParams.get('status') as
      | Exclude<Team['verificationStatus'], null>
      | undefined) ?? undefined
  )
  const [teamStageFilter, setTeamStageFilter] = useState<Team['stage'] | undefined>(
    (searchParams.get('stage') as Team['stage']) ?? undefined
  )
  const [searchFilter, setSearchFilter] = useState<string>(
    searchParams.get('search') ?? ''
  )

  const fetchTeams = async (page: number) => {
    try {
      setIsLoading(true)
      const competitions = await getCompetitionByName({
        client: authAxios,
        query: { name: params.competition }
      })

      if (!competitions?.data || competitions.data.length === 0) {
        setIsCompetitionFound(false)
        toast({
          title: 'Competition Not Found',
          description: `No competition found with the name "${params.competition}"`,
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }

      setIsCompetitionFound(true)
      setCurrentCompetitionId(competitions.data[0].id)

      const response = await getAdminAllCompetitionTeams({
        client: authAxios,
        path: { competitionId: competitions.data[0].id },
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
        title: 'Failed to fetch teams',
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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setCurrentPage(newPage)
  }

  // Effect for updating data when page or filter changes
  useEffect(() => {
    fetchTeams(currentPage)
    router.push(`?${generateAllQueryString({ search: searchFilter })}`)
  }, [currentPage, teamStatusFilter, teamStageFilter])

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
      ) : !isCompetitionFound ? (
        <h1 className="font-belanosima text-3xl text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)] md:text-5xl">
          No competition found with the name "${params.competition}"
        </h1>
      ) : currentCompetitionId === null ? (
        <div className="text-whitemd:text-3xl font-belanosima text-2xl">
          Competition ID not valid
        </div>
      ) : (
        <RegisteredTeamList
          itemsPerPage={limit}
          teamData={teamData}
          pagination={pagination}
          competitionId={currentCompetitionId}
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

export default AdminCompetitionDashboard
