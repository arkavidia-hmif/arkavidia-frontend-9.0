'use client'

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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
import { useAppSelector } from '~/redux/store'
import { useRouter } from 'next/navigation'

const RegisterCompetitionPopup: React.FC<{ competitionName: string }> = ({ competitionName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const router = useRouter();
  const handleOpenDialog = () => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }
    setIsOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => handleOpenDialog()}>
          Register Now <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center gap-4 sm:max-w-5xl md:justify-center bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat py-12 sm:py-16 font-teachers">
        <div className="flex flex-col w-full items-center sm:items-start justify-center sm:flex-row sm:gap-4 sm:justify-center">
          <div className="sm:grow-0 sm:mr-4">
            <DialogClose className="rounded-sm p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <ArrowLeft className="h-auto w-5 sm:w-8" />
              <span className="sr-only">Go back</span>
            </DialogClose>
          </div>
          <div className="sm:grow-1 flex flex-col gap-6 sm:gap-12 w-full sm:w-auto">
            <DialogHeader className="flex flex-col gap-4">
              <DialogTitle className="text-2xl sm:text-3xl md:text-5xl font-bold text-center sm:text-left">
                Register to {competitionName}
              </DialogTitle>
              <DialogDescription className="text-base sm:text-xl text-center sm:text-left">
                Choose an option to join or create your team
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-10 w-full sm:w-auto">
              <Button
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => {
                  // Handle Register Team action here
                  console.log('Register Team')
                }}
              >
                Register Team
              </Button>
              <Button
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => {
                  // Handle Join Team action here
                  console.log('Join Team')
                }}
              >
                Join Team
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RegisterCompetitionPopup