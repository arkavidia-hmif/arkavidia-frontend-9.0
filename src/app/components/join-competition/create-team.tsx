'use client'

import React, { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
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

type CompetitionType = 'cp' | 'ctf'

const competitionAbbr: Record<CompetitionType, string> = {
  cp: 'Competitive Programming',
  ctf: 'Capture The Flag'
}

interface SuccessDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  competitionType: CompetitionType
  teamCode: string
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, setIsOpen, teamCode }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(teamCode).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [teamCode])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex max-w-4xl flex-col items-center justify-center gap-2 sm:gap-8 bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat sm:p-12 font-teachers">
        <DialogHeader className="flex flex-col items-center justify-center gap-4 py-2 sm:py-4 md:py-12">
          <DialogTitle className="text-3xl md:text-5xl font-bold">
            Successfully Created Team
          </DialogTitle>
          <DialogDescription className="text-center text-base md:text-lg text-white">
            Share this code with your team members:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 md:mt-12 flex w-full max-w-sm items-center justify-center rounded-xl border border-[#F5E1FF] text-base md:text-lg text-[#F5E1FF]">
          <div className="flex items-center rounded-xl bg-[#F5E1FF] px-4 py-2 md:py-3 text-center text-purple-800">
            Code
          </div>
          <Input
            type="text"
            value={teamCode}
            readOnly
            className="bg-transparent text-base md:text-xl focus:border-none active:border-none"
          />
          <Button
            type="button"
            onClick={copyToClipboard}
            size="icon"
            className="h-12 w-12 border-[3F5E1FF] bg-transparent bg-none hover:bg-transparent hover:bg-none hover:text-opacity-80 hover:shadow-none focus:border-none focus:bg-transparent focus:bg-none focus:shadow-none active:border-none active:bg-transparent active:bg-none active:shadow-none">
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button size="xl" className="w-full" onClick={() => setIsOpen(false)}>
              Go to Dashboard
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const CreateTeamPopup: React.FC<{ competitionType: CompetitionType }> = ({
  competitionType
}) => {
  const [teamName, setTeamName] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [generatedTeamCode, setGeneratedTeamCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!teamName) {
      setError('Team name is required!')
    } else {
      // Generate a random team code (in a real app, this would be done on the server)
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      setGeneratedTeamCode(randomCode)
      setIsSuccess(true)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            Create Team
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-w-5xl items-center md:justify-center gap-4 bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat py-16 font-teachers">
          <div className="flex w-full flex-row justify-center md:gap-4">
            <div className="grow-0">
              <DialogClose className="rounded-sm p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <ArrowLeft className="h-auto w-5 md:w-8" />
                <span className="sr-only">Go back</span>
              </DialogClose>
            </div>
            <div className="grow-1 flex flex-col md:gap-12">
              <DialogHeader className="flex flex-col gap-4">
                <DialogTitle className="text-2xl md:text-5xl font-bold">
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
                      'bg-[#F5E1FF] py-6 md:py-8 md:text-xl text-black'
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
        competitionType={competitionType}
        teamCode={generatedTeamCode}
      />
    </>
  )
}
