'use client'

import { CreateTeamPopup } from './join-competition/create-team-popup'
import { JoinTeamPopup } from './join-competition/join-competition-popup'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger
} from './ui/dialog'
import { useState, useEffect } from 'react'
import { Button } from '~/app/components/Button'
import { ArrowLeft, ArrowRight, UserPlus, UserSearch } from 'lucide-react'
import { useAppSelector } from '~/redux/store'
import { useRouter } from 'next/navigation'
import { useToast } from '~/hooks/use-toast'
import { getTeams, getUser } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export type CompetitionType =
  | 'CP'
  | 'CTF'
  | 'Hackvidia'
  | 'UXvidia'
  | 'Datavidia'
  | 'Arkalogica'
  | 'Default'

export const competitionAbbr: Record<CompetitionType, string> = {
  CP: 'Competitive Programming',
  CTF: 'Capture The Flag',
  Hackvidia: 'Hackvidia',
  UXvidia: 'UXvidia',
  Datavidia: 'Datavidia',
  Arkalogica: 'Arkalogica',
  Default: 'Competition Name'
}

export default function CompetitionRegistration({
  competitionAbbreviation,
  competitionID,
  disabled
}: {
  competitionAbbreviation: string
  competitionID: string
  disabled: boolean
}) {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const router = useRouter()
  const axiosInstance = useAxiosAuth()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [competitionType, setCompetitionType] = useState<CompetitionType>('Default')
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isUserSMA, setIsUserSMA] = useState(false)

  // Fetch user data to check if user is SMA
  const checkUser = async () => {
    const user = await getUser({ client: axiosInstance })
    if (user.data) {
      const isSMA = user.data.education === 'sma'
      setIsUserSMA(isSMA)
      return isSMA
    }
  }

  function generateTooltip() {
    if (competitionAbbreviation.toLowerCase() === 'arkalogica') {
      if (!isLoggedIn) {
        return null
      } else if (!disabled && !isUserSMA) {
        return (
          <TooltipContent
            side="bottom"
            sideOffset={10}
            className="z-10 bg-black font-dmsans text-white">
            <p className="text-[15px]">Hanya untuk SMA/SMK</p>
          </TooltipContent>
        )
      } else if (disabled) {
        return (
          <TooltipContent
            side="bottom"
            sideOffset={10}
            className="z-10 bg-black font-dmsans text-white">
            <p className="text-[15px]">Registrasi belum dapat dilakukan</p>
          </TooltipContent>
        )
      } else if (isUserSMA) {
        return null
      }
    }
  }

  const handleOpenDialog = async function () {
    // Check if user logged in
    if (!isLoggedIn) {
      toast({
        variant: 'warning',
        title: 'Anda belum masuk. Silahkan masuk terlebih dahulu'
      })
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    // Check if user is SMA
    if (competitionAbbreviation.toLowerCase() === 'arkalogica') {
      const isSMA = await checkUser()
      if (!isSMA) {
        toast({
          variant: 'destructive',
          title: 'Tidak dapat mendaftar',
          description: 'Kompetisi ini hanya untuk SMA/SMK'
        })
        return
      }
    }

    // Check if user already filling their data
    const userResponse = await getUser({ client: axiosInstance })
    const user = userResponse.data

    if (!user?.isRegistrationComplete) {
      toast({
        variant: 'warning',
        title:
          'Anda belum menyelesaikan pendaftaran. Mohon selesaikan proses pendaftaran dahulu'
      })
      router.push('/register/personal-data')
    }

    // Check if user already join a team
    const teamJoined = (await getTeams({ client: axiosInstance })).data
    if (
      teamJoined &&
      teamJoined.length > 0 &&
      teamJoined.find(team => team.competitionId === competitionID)
    ) {
      toast({
        title: 'Anda sudah mendaftar ke perlombaan ini',
        variant: 'info'
      })
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    setCompetitionType(competitionAbbreviation as CompetitionType)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger asChild>
              <div
                className="cursor-pointer"
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}>
                <Button
                  size="sm"
                  onClick={() => {
                    !disabled ? handleOpenDialog() : () => {}
                  }}
                  disabled={disabled}
                  className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 lg:w-[200px] lg:gap-5 lg:text-base">
                    <p>Register Now </p>
                    <ArrowRight />
                  </div>
                </Button>
              </div>
            </TooltipTrigger>
            {generateTooltip()}
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="flex max-w-5xl items-center gap-4 bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat px-[3rem] py-[3rem] font-teachers md:justify-center">
        <div className="flex w-full flex-col justify-center md:gap-4">
          <div className="grow-0">
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <ArrowLeft className="h-auto w-5 md:w-8" />
            </DialogClose>
          </div>
          <div className="grow-1 flex flex-col md:gap-12">
            <DialogHeader className="flex flex-col gap-4">
              <DialogTitle className="text-2xl font-bold md:text-5xl">
                {competitionAbbr[competitionType]} Registration
              </DialogTitle>
              <DialogDescription className="text-base md:text-xl">
                Build your team or join forces with others
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col justify-around gap-y-6 md:gap-y-4 lg:mt-0 lg:flex-row lg:gap-y-0">
              <div className="flex flex-col items-center gap-4">
                <UserPlus strokeWidth={2.5} size={120} />
                <CreateTeamPopup
                  competitionID={competitionID}
                  competitionType={competitionType}
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <UserSearch strokeWidth={2.5} size={120} />
                <JoinTeamPopup
                  competitionID={competitionID}
                  competitionType={competitionType}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
