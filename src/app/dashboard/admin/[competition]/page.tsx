'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { getCompetitionByName, getCompetitionParticipant } from '~/api/generated'
import { Team } from '~/api/generated'

import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

import { RegisteredTeamList } from '~/app/components/registered-teamlist/teamlist'
import Loading from '~/app/components/Loading'

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

  const currentPage = Number(searchParams.get('page')) || 1
  const limit = searchParams.get('limit') ?? '10'

  const [isCompetitionFound, setIsCompetitionFound] = useState(true)
  const [currentCompetitionName, setCurrentCompetitionName] = useState<string | null>(
    null
  )
  const [teamData, setTeamData] = useState<Team[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: currentPage,
    totalItems: 0,
    totalPages: 1,
    next: null,
    prev: null
  })

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
      setCurrentCompetitionName(competitions.data[0].title)

      const response = await getCompetitionParticipant({
        client: authAxios,
        path: { competitionId: competitions.data[0].id },
        query: { page: page.toString(), limit: limit }
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
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setIsLoading(false)
    }
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

    // Update URL with new page query parameter
    router.push(`?${createQueryString('page', newPage.toString())}`)

    fetchTeams(newPage)
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }))
  }

  useEffect(() => {
    fetchTeams(currentPage)
  }, [currentPage])

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
      ) : (
        <RegisteredTeamList
          teamData={teamData}
          pagination={pagination}
          competitionName={currentCompetitionName ?? null}
          onPageChange={handlePageChange}
        />
      )}
    </>
  )
}

export default AdminCompetitionDashboard
