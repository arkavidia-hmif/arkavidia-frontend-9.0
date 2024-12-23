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
} from "./../ui/dialog"
import { Button } from "./../Button"
import { Input } from "./../ui/input"
import { Label } from "./../ui/label"
import { cn } from "~/lib/utils"

type CompetitionType = 'cp' | 'ctf';

const competitionAbbr: Record<CompetitionType, string> = {
  'cp': "Competitive Programming",
  'ctf': "Capture The Flag",
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
      <DialogContent className='flex flex-col font-teachers justify-center items-center bg-purple-700 gap-8 p-12 max-w-4xl'>
        <DialogHeader className='flex flex-col justify-center items-center gap-4 py-12'>
          <DialogTitle className="text-5xl font-bold">
            Successfully Created Team
          </DialogTitle>
          <DialogDescription className='text-lg text-white text-center'>
            Share this code with your team members:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-12 flex w-full max-w-sm items-center justify-center border border-[#F5E1FF] text-[#F5E1FF] rounded-xl text-lg">
          <div className='text-purple-800 bg-[#F5E1FF] flex items-center py-2.5 rounded-xl px-4 text-center'>Code</div>
          <Input
            type="text"
            value={teamCode}
            readOnly
            className="bg-transparent !text-xl active:border-none focus:border-none"
          />
          <Button type="button" onClick={copyToClipboard} size="icon" className="h-12 w-12 bg-none bg-transparent border-[3F5E1FF] active:shadow-none focus:shadow-none active:border-none active:bg-none 
          hover:bg-none hover:bg-transparent hover:shadow-none hover:text-opacity-80 focus:border-none focus:bg-none focus:bg-transparent active:bg-transparent">
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button size="xl" className='w-full' onClick={() => setIsOpen(false)}>
              Go to Dashboard
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const CreateTeamPopup: React.FC<{ competitionType: CompetitionType }> = ({ competitionType }) => {
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
                  Create Team for {competitionAbbr[competitionType]}
                </DialogTitle>
                <DialogDescription className='text-xl'>Once you create a team name you can invite others</DialogDescription>
              </DialogHeader>
              <form className="mt-4 flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="teamName" className='text-xl'>
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
                    className={cn((error ? 'border-red-400' : ''), ' bg-[#F5E1FF] text-black py-8 !text-xl')}
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

