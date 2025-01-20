import React from 'react'
import { ArrowLeft, ArrowRight, CircleCheck } from 'lucide-react'
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
import { getTeamById, joinTeamByCode } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import { CompetitionType } from '~/app/components/CompetitionRegistration'
import { useAppSelector } from '~/redux/store'
import { useRouter } from 'next/navigation'
import { getUser, getTeams } from '~/api/generated'

interface SuccessDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  competitionType: string
  teamName: string
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  setIsOpen,
  competitionType,
  teamName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex max-w-4xl flex-col items-center justify-center gap-4 bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat p-12 md:gap-16">
        <DialogHeader className="flex flex-col items-center justify-center gap-2">
          <CircleCheck className="h-auto w-32 fill-[#F5E1FF] text-purple-600" />
          <DialogTitle className="text-2xl font-bold md:text-3xl">
            Successfully Joined Team
          </DialogTitle>
          <DialogDescription className="text-base text-white md:text-xl">
            Welcome to <span className="text-[#F5E1FF]">{teamName}</span>. You can now
            access the {competitionType} dashboard
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button
              size="lg"
              className="w-full"
              onClick={() => window.location.replace('/dashboard')}>
              Go to Dashboard
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const JoinTeamPopup: React.FC<{
  competitionID: string
  competitionType: CompetitionType
}> = ({ competitionType, competitionID }) => {
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const [teamCode, setTeamCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [teamName, setTeamName] = React.useState('')

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
      teamJoined.find(t => t.competitionId === competitionID)
    ) {
      toast({
        title: 'Anda sudah mendaftar ke perlombaan ini',
        variant: 'info'
      })
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    }

    const resp = await joinTeamByCode({
      client: axiosAuth,
      body: {
        teamCode
      }
    })

    if (!teamCode) {
      setError('Please provide team code')
      return
    }

    if (resp.error) {
      // @ts-expect-error - error doesn't exists on response definition
      setError(resp.error.error)
      return
    }

    const getTeamInfo = await getTeamById({
      client: axiosAuth,
      path: {
        // @ts-ignore
        teamId: resp.data.teamId
      }
    })

    if (getTeamInfo.data) {
      setTeamName(getTeamInfo.data.name)
    }

    toast({
      title: 'Successfully joined team',
      variant: 'success',
      duration: 3000
    })

    setIsSuccess(true)
    setIsOpen(false)
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
              <p className="text-xl">Join Team</p>
            </div>
            <ArrowRight strokeWidth={4} size={4} className="mt-[2px]" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            'flex max-w-5xl items-center justify-center gap-4 px-[3rem] py-16 font-teachers',
            "bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat"
          )}>
          <div className="flex w-full flex-col justify-center gap-2 md:gap-4">
            <div className="grow-0">
              <DialogClose className="rounded-sm p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <ArrowLeft className="h-auto w-6 md:w-8" />
                <span className="sr-only">Go back</span>
              </DialogClose>
            </div>
            <div className="grow-1 flex flex-col gap-8 md:gap-24">
              <DialogHeader className="flex flex-col gap-2 md:gap-4">
                <DialogTitle className="text-2xl font-bold md:text-5xl">
                  Join Team for {competitionType}
                </DialogTitle>
                <DialogDescription className="text-xl">
                  Enter your team code to join
                </DialogDescription>
              </DialogHeader>

              <form className="mt-4 flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="teamCode" className="text-lg md:text-xl">
                    Team Code <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="teamCode"
                    type="text"
                    placeholder="Enter your team code"
                    name="teamCode"
                    value={teamCode}
                    onChange={e => setTeamCode(e.target.value)}
                    required
                    className={cn(
                      error ? 'border-red-400' : '',
                      'bg-[#F5E1FF] py-6 text-black md:py-7 md:text-xl'
                    )}
                  />
                  {error && <p className="text-lg text-red-400">{error}</p>}
                </div>
                <Button type="submit" className="mt-2" size="xl">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SuccessDialog
        isOpen={isSuccess}
        setIsOpen={setIsSuccess}
        competitionType={competitionType}
        teamName={teamName}
      />
    </>
  )
}

export default JoinTeamPopup
