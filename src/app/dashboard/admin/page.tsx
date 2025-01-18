'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RegisteredTeamList } from '~/app/components/registered-teamlist/teamlist'
import { getCompetitionParticipant } from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useAppSelector } from '~/redux/store'
import { Team } from '~/api/generated'

interface Pagination {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  next: string | null;
  prev: string | null;
}

function AdminDashboard() {
  const isAuthenticated = useAppSelector(state => state.auth.accessToken !== null)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const { toast } = useToast()
  const router = useRouter()

  if (!isAuthenticated || !isAdmin) {
    toast({
      title: 'Unauthorized',
      description: 'You are not authorized to view this page',
      variant: 'destructive'
    })
    router.replace('/')
  } else {
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
        <RegisteredTeamList teamData={teamData} pagination={pagination} onPageChange={handlePageChange}/>
      </> 
    )
  }
}

export default AdminDashboard