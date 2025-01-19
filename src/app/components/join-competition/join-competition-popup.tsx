import React from 'react'
import { ArrowLeft, CircleCheck } from 'lucide-react'
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
import { useRouter } from 'next/router'

interface SuccessDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  competitionType: string
  competitionLink: string
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, setIsOpen, competitionType, competitionLink }) => {
  const teamName = 'Tim Sukses' // Dummy, replace it dynamically if needed

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex flex-col justify-center items-center gap-4 md:gap-16 p-12 max-w-4xl bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat">
        <DialogHeader className="flex flex-col justify-center items-center gap-2">
          <CircleCheck className="w-32 h-auto fill-[#F5E1FF] text-purple-600" />
          <DialogTitle className="text-2xl md:text-3xl font-bold">
            Successfully Joined Team
          </DialogTitle>
          <DialogDescription className="text-base md:text-xl text-white">
            Welcome to <span className="text-[#F5E1FF]">{teamName}</span>. You can now access the {competitionType} dashboard
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button size="lg" className="w-full" onClick={() => setIsOpen(false)}>
              Go Back to Dashboard
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface JoinTeamProps {
  competitionType: string
}

const JoinTeam: React.FC<JoinTeamProps> = ({ competitionType }) => {
  const [teamCode, setTeamCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // For testing purposes
    if (!teamCode || teamCode === 'WRONG') {
      setError('Wrong team code!')
    } else {
      setIsSuccess(true)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            Join Competition
          </Button>
        </DialogTrigger>

        <DialogContent
          className={cn(
            'max-w-5xl flex gap-4 justify-center items-center font-teachers py-16',
            'bg-[url("/images/join-competition/bg.png")] bg-cover bg-center bg-no-repeat'
          )}
        >
          <div className="flex flex-row gap-2 md:gap-4 w-full justify-center">
            <div className="grow-0">
              <DialogClose className="rounded-sm opacity-70 ring-offset-background p-2 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <ArrowLeft className="w-6 md:w-8 h-auto" />
                <span className="sr-only">Go back</span>
              </DialogClose>
            </div>
            <div className="flex flex-col gap-8 md:gap-24 grow-1">
              <DialogHeader className="flex flex-col gap-2 md:gap-4">
                <DialogTitle className="text-2xl md:text-5xl font-bold">
                  Join Team for {competitionType}
                </DialogTitle>
                <DialogDescription className="text-xl">Enter your team code to join</DialogDescription>
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
                    onChange={(e) => setTeamCode(e.target.value)}
                    required
                    className={cn(error ? 'border-red-400' : '', 'bg-[#F5E1FF] text-black py-6 md:py-7 md:text-xl')}
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

      <SuccessDialog isOpen={isSuccess} setIsOpen={setIsSuccess} competitionType={competitionType} competitionLink="yourCompetitionLinkHere" />
    </>
  )
}

export default JoinTeam
