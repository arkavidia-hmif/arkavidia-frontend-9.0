import React, { useEffect } from 'react'
import FrameInfo from '~/app/components/admin-dashboard/FrameInfo'
import CompetitionContext from '~/app/components/admin-dashboard/CompetitionContext'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

import { useRouter } from 'next/navigation'
import { useToast } from '~/hooks/use-toast'
import { useAppSelector } from '~/redux/store'
import { getCompetitionStatistic, GetCompetitionStatisticResponse } from '~/api/generated'
import FrameInfoSkeleton from '~/app/components/admin-dashboard/FrameInfoSkeleton'

function MainDashboardCompe({ withHeader = true }: { withHeader?: boolean }) {
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
    unverified: 0,
    registered: 0
  })
  const [stats, setStats] = React.useState<GetCompetitionStatisticResponse>()

  useEffect(() => {
    ;(async () => {
      try {
        const statsResponse = await getCompetitionStatistic({ client: axiosInstance })
        const data = statsResponse.data

        const totalVerified = data?.verificationStatus.verified ?? 0
        const totalTeam = data?.count ?? 0

        setOverallStats({
          registered: totalVerified,
          unverified: totalTeam - totalVerified
        })

        setStats(data)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to fetch statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive'
        })
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <>
      {/* Dashboard Title */}
      {withHeader && (
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
      )}

      {/* break line */}
      <div className="my-3 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] md:my-4" />

      <h1 className="mb-2 font-belanosima text-3xl font-normal md:text-5xl">
        Competition
      </h1>
      {/* Overall Participant */}
      <div className="my-3 flex flex-col items-center justify-between gap-4 md:my-5 md:flex-row md:gap-10">
        {isLoading ? (
          <>
            <FrameInfoSkeleton />
            <FrameInfoSkeleton />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Competition */}
      <CompetitionContext competitionsData={stats} />
      {/* break line */}
      <div className="my-3 h-1 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] md:my-4" />
    </>
  )
}

export default MainDashboardCompe
