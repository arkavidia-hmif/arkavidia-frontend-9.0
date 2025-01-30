'use client'

import React from 'react'
import { Check, Pencil, Trash, X } from 'lucide-react'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { Input } from '../../Input'
import { Button } from '../../Button'
import { putAdminCompetitionTeamSubmissionVerdict } from '~/api/generated'
import { useParams } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/app/components/ui/alert-dialog'

interface FeedbackProps {
  submissionTypeId: string
  feedback?: string
  competitionId?: string
  refetchData?: () => Promise<void>
}

function SubmissionEditFeedback({
  submissionTypeId,
  feedback,
  competitionId,
  refetchData
}: FeedbackProps) {
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const [isEditing, setIsEditing] = React.useState(false)
  const [currentFeedback, setcurrentFeedback] = React.useState(
    feedback && feedback.length ? feedback : ''
  )
  const [newFeedback, setNewFeedback] = React.useState('')
  const teamID = useParams().teamID as string

  const onEditButtonClick = () => {
    setIsEditing(true)
  }

  const saveFeedback = async (judgeResponse: string) => {
    if (!competitionId || !teamID || !teamID.length || !competitionId.length) {
      toast({
        title: 'Error',
        description: 'Invalid competition ID or team ID',
        variant: 'destructive',
        duration: 8000
      })
      return
    }

    try {
      const saveRequest = await putAdminCompetitionTeamSubmissionVerdict({
        client: axiosAuth,
        path: {
          competitionId: competitionId,
          teamId: teamID,
          typeId: submissionTypeId
        },
        body: {
          judgeResponse: judgeResponse
        }
      })

      if (saveRequest.error || !saveRequest.data) {
        toast({
          title: 'Error',
          description: 'Failed to save feedback',
          variant: 'destructive',
          duration: 8000
        })
        return
      }

      toast({
        title: 'Success',
        description: 'Feedback saved successfully',
        variant: 'success',
        duration: 8000
      })
    } catch (e: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to save feedback',
        variant: 'destructive',
        duration: 8000
      })
    }
  }

  const onTrashButtonClick = async () => {
    setNewFeedback('')
    await saveFeedback('')
    refetchData && (await refetchData())
  }

  const handleFeedbackSave = async () => {
    await saveFeedback(newFeedback)
    setcurrentFeedback(newFeedback)
    setIsEditing(false)
    setNewFeedback('')
    refetchData && (await refetchData())
  }

  return (
    <div className="flex flex-col gap-x-4 gap-y-4 px-4 md:flex-row md:items-center md:justify-between md:gap-y-1">
      {!isEditing ? (
        <>
          <p className={currentFeedback.length ? 'text-white' : 'text-gray-400'}>
            {currentFeedback.length ? currentFeedback : 'No feedback given'}
          </p>
          <div className="flex gap-x-4">
            {currentFeedback.length ? (
              <AlertDialog>
                <AlertDialogTrigger>
                  <Trash size={20} className="text-red-400 hover:cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-purple-400">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white">
                      Feedback will be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-200 text-black hover:bg-black hover:text-white">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-400 text-white hover:bg-red-600"
                      onClick={onTrashButtonClick}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}

            <Pencil
              size={20}
              className="hover:cursor-pointer"
              onClick={onEditButtonClick}
            />
          </div>
        </>
      ) : (
        <>
          <Input
            value={newFeedback}
            placeholder="Masukkan feedback di sini"
            onChange={e => setNewFeedback(e.target.value)}
          />
          <div className="flex gap-4">
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => {
                setNewFeedback('')
                setIsEditing(false)
              }}>
              <X size={10} className="text-white" strokeWidth={3} />
            </Button>
            <Button size={'sm'} onClick={handleFeedbackSave}>
              <Check size={10} strokeWidth={3} />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default SubmissionEditFeedback
