'use client'

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
} from './../ui/dialog'
import { Button } from './../Button'
import { Input } from './../ui/input'
import { Label } from './../ui/label'
import { cn } from '~/lib/utils'

type CompetitionType = 'cp' | 'ctf';

const competitionAbbr: Record<CompetitionType, string> = {
  'cp': "Competitive Programming",
  'ctf': "Capture The Flag",
}

interface SuccessDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  competitionType: CompetitionType
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, setIsOpen, competitionType }) => {
  const teamName = 'Tim Sukses'; // Dummy
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='flex flex-col justify-center items-center bg-purple-700 gap-12 p-12 max-w-4xl h-[50vh]'>
        <DialogHeader className='flex flex-col justify-center items-center gap-2'>
          <CircleCheck className='w-32 h-auto fill-[#F5E1FF] text-purple-600' />
          <DialogTitle className="text-2xl font-bold">
            Successfully Join Team
          </DialogTitle>
          <DialogDescription className='text-lg text-white'>Welcome to <span className='text-[#F5E1FF]'>{teamName}</span>. You can now access the {competitionAbbr[competitionType]} dashboard</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button size="lg" className='w-full' onClick={() => setIsOpen(false)}>
              Go Back to Dashboard
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const JoinCompetitionPopup: React.FC<{ competitionType: CompetitionType }> = ({ competitionType }) => {
  const [teamCode, setTeamCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // TODO implement code validation. Just for testing purposes
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
        <DialogContent className="bg-purple-700 max-w-5xl h-[60vh] flex gap-4 justify-center items-center font-teachers py-16">
          <div className="flex flex-row gap-4 w-full justify-center">
            <div className='grow-0'>
              <DialogClose className="rounded-sm opacity-70 ring-offset-background p-2 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <ArrowLeft className="w-8 h-auto" />
                <span className="sr-only">Go back</span>
              </DialogClose>
            </div>
            <div className='flex flex-col gap-8 grow-1'>
              <DialogHeader className='flex flex-col gap-4'>
                <DialogTitle className="text-5xl font-bold">
                  Join Team for {competitionAbbr[competitionType]}
                </DialogTitle>
                <DialogDescription className='text-xl'>Enter your team code to join</DialogDescription>
              </DialogHeader>
              <form className="mt-4 flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="teamCode" className='text-xl'>
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
                    className={cn((error ? 'border-red-400' : ''), ' bg-[#F5E1FF] text-black py-6 !text-xl')}
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
      <SuccessDialog isOpen={isSuccess} setIsOpen={setIsSuccess} competitionType={competitionType} />
    </>
  )
}