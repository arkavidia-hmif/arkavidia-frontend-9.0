'use client'

import React, { useEffect } from 'react'
import {
  getEventTeamSubmission,
  GetPresignedLinkData,
  putEventTeamSubmission
} from '~/api/generated'
import { Button } from '~/app/components/Button'
import Loading from '~/app/components/Loading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/app/components/ui/accordion'
import FilePreview from '~/app/dashboard/[competition]/components/FilePreview'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { capitalizeFirstLetter } from '~/lib/utils'
import { EventTask } from './event-dashboard-types'
import {
  formatDate,
  getBucketEventKeyword,
  getStatus,
  getStatusColor,
  getStatusTask,
  getTriggerColor
} from './event-dashboard-utils'
import { ChevronLeft } from 'lucide-react'
import TaskDropzone from '~/app/dashboard/[competition]/components/TaskDropzone'

function EventTaskList({ teamId, eventName }: { teamId?: string; eventName: string }) {
  const [loadingTask, setLoadingTask] = React.useState(true)
  const [tasks, setTasks] = React.useState<EventTask[]>([])
  const [selectedTask, setSelectedTask] = React.useState<EventTask | null>(null)
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()

  async function getTaskList() {
    try {
      if (teamId) {
        const res = await getEventTeamSubmission({
          client: axiosAuth,
          path: {
            teamId: teamId
          }
        })

        if (res.error || !res.data) {
          toast({
            title: 'Error',
            description: 'Failed to fetch submissions. Error: ' + res.error,
            variant: 'destructive',
            duration: 6000
          })
        }

        if (res.data) {
          const newTasks: EventTask[] = []
          res.data.map(task => {
            const item = {
              id: task.requirement.typeId,
              title: task.requirement.typeName,
              description: task.requirement.description,
              dueDate: new Date(task.requirement.deadline ?? ''),
              status: getStatusTask(task) ?? ('notopened' as EventTask['status']),
              submission: task.submission
            }

            newTasks.push(item)
          })

          setTasks(prev => [
            ...prev.filter(t => !newTasks.some(nt => nt.id === t.id)),
            ...newTasks
          ])
        }
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to fetch submissions. Error: ' + err,
        variant: 'destructive',
        duration: 6000
      })
    }
  }

  const handleSubmissionSubmit = async (
    mediaId: string,
    bucket: string,
    typeId: string
  ) => {
    const teamID = teamId
    if (!teamID) {
      toast({
        title: 'Error',
        description: 'Team ID not found',
        variant: 'destructive',
        duration: 6000
      })
      return
    }

    try {
      const res = await putEventTeamSubmission({
        client: axiosAuth,
        path: {
          teamId: teamID
        },
        body: {
          typeId: typeId,
          mediaId: mediaId
        }
      })

      if (res.error || !res.data) {
        toast({
          title: 'Error',
          description: 'Failed to submit task. Error: ' + res.error,
          variant: 'destructive',
          duration: 6000
        })
        return
      }

      if (res.data) {
        const updatedTasks = tasks.map(task => {
          if (task.id === typeId) {
            return {
              ...task,
              status: 'completed' as 'completed'
            }
          }
          return task
        })

        setTasks(updatedTasks)
        setSelectedTask(null)
        toast({
          title: 'Success',
          description: 'File submitted successfully',
          variant: 'success',
          duration: 5000
        })
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to submit task. Error: ' + err,
        variant: 'destructive',
        duration: 6000
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getTaskList()
      setLoadingTask(false)
    }

    fetchData()
  }, [])

  if (!teamId && !loadingTask) {
    return <div>Team data not found</div>
  }

  if (loadingTask) {
    return (
      <div className="relative flex h-full w-full items-center justify-center pt-6">
        <Loading isSmallVariant={true} />
      </div>
    )
  }

  return (
    <div className="font-dmsans">
      {selectedTask ? (
        // Specific Task
        <div className="rounded-lg border border-white bg-gradient-to-r from-[#0202024D]/30 to-[#7138C099]/60 px-8 py-8 md:px-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Button
                onClick={() => setSelectedTask(null)}
                size="icon"
                className="size-9 bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white">
                <ChevronLeft />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold md:text-2xl">{selectedTask.title}</h1>
                <p className="font-dmsans text-xs md:text-sm">
                  {formatDate(selectedTask.dueDate)} WIB
                </p>
              </div>
            </div>
            <div>
              <p
                className={`flex h-10 items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 px-2 py-2 text-xs md:px-8 md:text-base ${getStatusColor(selectedTask)}`}>
                {getStatus(selectedTask)}
              </p>
            </div>
          </div>
          <p className="mt-10">{selectedTask.description}</p>
          {/* Task Dropzone */}
          <TaskDropzone
            bucket={
              `submission-academya-${getBucketEventKeyword(eventName)}` as GetPresignedLinkData['query']['bucket']
            }
            onSubmitMedia={handleSubmissionSubmit}
            submissionTypeId={selectedTask.id}
          />
        </div>
      ) : (
        // Task List
        <Accordion type="single" collapsible>
          {tasks?.map(task => (
            <AccordionItem key={task.id} value={`task-${task.id}`}>
              <AccordionTrigger
                accType="framed"
                className={`&[data-state=open]>svg]:rotate-180 mt-2 rounded-xl border border-white px-5 py-5 outline-border hover:no-underline hover:decoration-0 md:py-7 [&>svg]:size-5 [&>svg]:-rotate-90 [&>svg]:text-white md:[&>svg]:size-7 [&[data-state=open]>svg]:rotate-0 ${getTriggerColor(
                  task
                )}`}>
                <p className="flex w-full items-center justify-between gap-3 text-lg font-semibold md:text-xl">
                  {task.title}
                  <span className="ml-3 mr-8 rounded-lg border border-white px-2 py-2 font-dmsans text-xs md:text-sm lg:text-[16px]">
                    {formatDate(task.dueDate)} WIB
                  </span>
                </p>
              </AccordionTrigger>
              <AccordionContent className="-mt-2 rounded-lg border border-white px-5 py-7">
                <p
                  className="text-base md:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: task.description.replace(/\n/g, '<br />')
                  }}
                />
                <FilePreview
                  fileURL={task.submission?.media.url ?? undefined}
                  name={task.submission?.media.name ?? undefined}
                />
                {task.submission && task.submission.judgeResponse?.length && (
                  <div className="pt-2">
                    <p className="font-teachers text-xl font-bold text-yellow-400">
                      Feedback
                    </p>
                    <p className="font-dmsans text-[1rem] text-lg font-normal">
                      {capitalizeFirstLetter(task.submission.judgeResponse)}
                    </p>
                  </div>
                )}
                <div className="mt-5 flex w-full items-center gap-3 md:justify-end">
                  <p
                    className={`flex h-12 w-[40%] items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 py-2 text-xs md:w-auto md:px-8 md:text-base ${getStatusColor(task)}`}>
                    {getStatus(task)}
                  </p>
                  <Button
                    onClick={() => setSelectedTask(task)}
                    size="lg"
                    disabled={new Date() > task.dueDate}
                    className={`w-[60%] text-center text-sm md:w-auto md:text-base ${task.status === 'notopened' ? 'border-2 border-[#cccccc] bg-transparent text-[#cccccc] hover:text-[#4D06B0CC]' : 'bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white'}`}>
                    Submit Task
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          {tasks.length === 0 && (
            <div className="mt-12 flex items-center justify-center font-dmsans font-semibold">
              Belum ada task saat ini
            </div>
          )}
        </Accordion>
      )}
    </div>
  )
}

export default EventTaskList
