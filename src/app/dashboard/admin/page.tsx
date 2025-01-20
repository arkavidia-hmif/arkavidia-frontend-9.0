'use client'

import React, { useEffect } from 'react'
import FrameInfo from '../../components/admin-dashboard/FrameInfo'
import CompetitionContext from '../../components/admin-dashboard/CompetitionContext'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RegisteredTeamList } from '~/app/components/registered-teamlist/teamlist'
import { getCompetitionParticipant } from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useAppSelector } from '~/redux/store'
import { getTeamStatistic, GetTeamStatisticResponse } from '~/api/generated'
import { Team } from '~/api/generated'

interface Pagination {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  next: string | null;
  prev: string | null;
}

const AdminDashboardPage = () => {
  const isAuthenticated = useAppSelector(state => state.auth.accessToken !== null)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to view this page',
        variant: 'destructive'
      })
      setTimeout(() => {
        router.replace('/')
      }, 1000)
    }
  }, [])

  const IMAGE = '/images/sidebar/item.svg'
  const axiosInstance = useAxiosAuth()
  const [overallStats, setOverallStats] = React.useState({
    unverified: -1,
    registered: -1
  })
  const [stats, setStats] = React.useState<GetTeamStatisticResponse>()

  useEffect(() => {
    ;(async () => {
      const statsResponse = await getTeamStatistic({ client: axiosInstance })
      setStats(statsResponse.data)
      const registered = statsResponse.data?.totalVerifiedTeam || -1 // -1 if null / undefined
      const unverified =
        statsResponse.data?.totalTeam && statsResponse.data?.totalVerifiedTeam
          ? statsResponse.data.totalTeam - statsResponse.data.totalVerifiedTeam
          : -1
      setOverallStats({ unverified, registered })
      setIsLoading(false)
    })()
  }, [])

  const authAxios = useAxiosAuth();
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = searchParams.get('limit') ?? "10";

  const [teamData, setTeamData] = useState<Team[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: currentPage,
    totalItems: 0,
    totalPages: 1,
    next: null,
    prev: null,
  });

  const fetchTeams = async (page: number) => {
    try {
      const response = await getCompetitionParticipant({
        client: authAxios,
        path: { competitionId: 'sgq2znio' },
        query: { page: page.toString(), limit: limit }
      });

      if (response.data) {
        setTeamData(response.data.result ?? []);
        setPagination(response.data.pagination ?? { currentPage: 1, totalItems: 0, totalPages: 1, next: null, prev: null });
      } else {
        setTeamData([]);
        setPagination({ currentPage: 1, totalItems: 0, totalPages: 1, next: null, prev: null });
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    // Update URL with new page query parameter
    router.push(`?${createQueryString('page', newPage.toString())}`);

    fetchTeams(newPage);
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  useEffect(() => {
    fetchTeams(currentPage);
  }, [currentPage]);  

  return (
    <>
      {/* Dashboard Title */}
      <div className="relative flex items-center justify-center space-x-4 md:justify-start">
        <div
          className="h-8 w-8 md:h-12 md:w-12"
          style={{
            background: 'linear-gradient(180deg, #7138C0 0%, #B89BDF 100%)',
            boxShadow: '0px 0px 8px 0px #F5F5F580',
            WebkitMaskImage: `url(${IMAGE})`, // kalo masing-masing compe punya logo, bisa diganti
            maskImage: `url(${IMAGE})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center'
          }}
        />
        <h1 className="font-belanosima text-3xl text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)] md:text-5xl">
          Dashboard
        </h1>
      </div>

      {/* break line */}
      <div className="my-3 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] md:my-4" />

      {/* Overall Participant */}
      <div className="my-4 flex flex-col items-center justify-between gap-4 md:my-8 md:flex-row md:gap-10">
        <FrameInfo
          number={overallStats.registered}
          helperText={'Overall Registered Participants'}
          imgSrc={'/images/admin-dashboard/supervisor-acc.svg'}
        />
        <FrameInfo
          number={overallStats.unverified}
          helperText={'Overall Unverified Participants'}
          imgSrc={'/images/admin-dashboard/unverified-acc.svg'}
        />
      </div>

      {/* break line */}
      <div className="my-3 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] md:my-4" />

      {/* Competition */}
      <CompetitionContext
        totalTeam={stats?.totalTeam ?? 0}
        totalVerifiedTeam={stats?.totalVerifiedTeam ?? 0}
        result={stats?.result || []}
      />
    </>
  )
}

export default AdminDashboard
