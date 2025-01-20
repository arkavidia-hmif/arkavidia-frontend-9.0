'use client'

import React, { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger
} from '../ui/dialog'
import { Button } from '../Button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn } from '~/lib/utils'
import { postCreateTeam } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import {
  competitionAbbr,
  CompetitionType
} from '~/app/components/CompetitionRegistration'
import { useAppSelector } from '~/redux/store'
import { useRouter } from 'next/navigation'
import { getTeams, getUser } from '~/api/generated'

interface SuccessDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  teamCode: string
  competitionLink: string
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  setIsOpen,
  teamCode,
  competitionLink
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(teamCode).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [teamCode])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex max-w-4xl flex-col items-center justify-center gap-2 bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat font-teachers sm:gap-8 sm:p-12">
        <DialogHeader className="flex flex-col items-center justify-center gap-4 py-2 sm:py-4 md:py-12">
          <DialogTitle className="text-3xl font-bold md:text-5xl">
            Successfully Created Team
          </DialogTitle>
          <DialogDescription className="text-center text-base text-white md:text-lg">
            Share this code with your team members:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex w-full max-w-sm items-stretch justify-center rounded-xl border border-[#F5E1FF] text-base text-[#F5E1FF] md:mt-12 md:text-lg">
          <div className="flex items-center justify-center rounded-xl bg-[#F5E1FF] px-4 py-2 text-center text-purple-800 md:py-3">
            Code
          </div>
          <div className="flex flex-grow items-center">
            <Input
              type="text"
              value={teamCode}
              readOnly
              className="flex-grow bg-transparent text-base focus:border-none active:border-none md:text-xl"
            />
          </div>
          <div className="flex items-center justify-center">
            <Button
              type="button"
              onClick={copyToClipboard}
              size="icon"
              className="aspect-square h-auto border-[#F5E1FF] bg-transparent bg-none hover:bg-transparent hover:bg-none hover:text-opacity-80 hover:shadow-none focus:border-none focus:bg-transparent focus:bg-none focus:shadow-none active:border-none active:bg-transparent active:bg-none active:shadow-none">
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button
              size="xl"
              className="w-full"
              onClick={() => (window.location.href = competitionLink)}>
              Go to Dashboard
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const CreateTeamPopup: React.FC<{
  competitionID: string
  competitionType: CompetitionType
}> = ({ competitionID, competitionType }) => {
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const [teamName, setTeamName] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [generatedTeamCode, setGeneratedTeamCode] = useState('')

  // Check if user already logged in
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const router = useRouter()
  const axiosInstance = useAxiosAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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
      router.push('/dashboard')
    }

    if (!teamName) {
      setError('Team name is required!')
    } else {
      // Generate a random team code (in a real app, this would be done on the server)
      const resp = await postCreateTeam({
        client: axiosAuth,
        body: {
          competitionId: competitionID,
          name: teamName
        }
      })

      if (resp.error) {
        setError('Failed to create team.')
        return
      }
      toast({
        title: 'Team created successfully',
        variant: 'success',
        duration: 3000
      })
      const randomCode = resp.data.joinCode
      setGeneratedTeamCode(randomCode)
      setIsSuccess(true)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            onClick={() => setIsOpen(true)}
            className="flex w-[250px] items-center justify-center gap-[2rem]">
            <div>
              <p className="text-xl">Create Team</p>
            </div>
            <ArrowRight strokeWidth={4} size={4} className="mt-[2px]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-w-5xl items-center gap-4 bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat px-[3rem] py-[3rem] font-teachers md:justify-center">
          <div className="flex w-full flex-col justify-center md:gap-4">
            <div className="grow-0">
              <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <ArrowLeft className="h-auto w-5 md:w-8" />
                <span className="sr-only">Go back</span>
              </DialogClose>
            </div>
            <div className="grow-1 flex flex-col md:gap-12">
              <DialogHeader className="flex flex-col gap-4">
                <DialogTitle className="text-2xl font-bold md:text-5xl">
                  Create Team for {competitionAbbr[competitionType]}
                </DialogTitle>
                <DialogDescription className="text-base md:text-xl">
                  Once you create a team name you can invite others
                </DialogDescription>
              </DialogHeader>
              <form className="mt-4 flex flex-col gap-2 md:gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="teamName" className="text-lg md:text-xl">
                    Team Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="teamName"
                    type="text"
                    placeholder="Enter your team name"
                    name="teamName"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    required
                    className={cn(
                      error ? 'border-red-400' : '',
                      'bg-[#F5E1FF] py-6 text-black md:py-8 md:text-xl'
                    )}
                  />
                  {error && <p className="text-lg text-red-400">{error}</p>}
                </div>
                <Button type="submit" className="mt-2" size="xl">
                  Create Team
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <SuccessDialog
        isOpen={isSuccess}
        setIsOpen={setIsSuccess}
        competitionLink={'/dashboard'}
        teamCode={generatedTeamCode}
      />
    </>
  )
}
