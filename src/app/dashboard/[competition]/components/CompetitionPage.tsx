'use client'

import { ElementType, useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../../components/ui/accordion'
import { Button } from '../../../components/ui/button'
import { Tab } from '../../../components/Tab'
import { ChevronLeft, CloudUpload } from 'lucide-react'
import {
  getCompetitionSubmissionRequirement,
  GetCompetitionSubmissionRequirementResponse,
  
  getTeams,
  
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useAppSelector } from '~/redux/store'
import { useRouter } from 'next/navigation'
import ProfileCompetition from '~/app/components/ProfileCompetition'

// Task interface
interface Task {
  id: string
  title: string
  description: string
  status: 'notopened' | 'ongoing' | 'complete'
  dueDate: Date
}

// Verif interface
interface Verif extends Task {}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const CompetitionPage = ({ compeName }: { compeName: string }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedVerif, setSelectedVerif] = useState<Verif | null>(null)

  const axiosInstance = useAxiosAuth()
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [verifications, setVerificatons] = useState<Verif[]>([])
  // Call the requirement api
  useEffect(() => {
    const fetchSubmissionRequirements = async () => {
      try {
        if (!isLoggedIn) {
          router.push('/login')
          return
        }

        const teamsResponse = await getTeams({ client: axiosInstance })
        if (teamsResponse.data && teamsResponse.data.length > 0) {
          const teamId = teamsResponse.data[0].id // Get Current user ID
          const requirementsResponse = await getCompetitionSubmissionRequirement({
            client: axiosInstance,
            path: { teamId }
          })

          const newTasks: Task[] = []
          const newVerifications: Verif[] = []

          requirementsResponse.data?.forEach(data => {
            const item = {
              id: data.requirement.typeId,
              title: data.requirement.typeName,
              description: data.requirement.description,
              dueDate: new Date(data.requirement.deadline ?? ''),
              status: getStatusTask(data) ?? 'notopened'
            }

            if (data.requirement.stage === 'verification') {
              if (!verifications.some(v => v.id === item.id)) {
                newVerifications.push(item as Verif)
              }
            } else {
              if (!tasks.some(t => t.id === item.id)) {
                newTasks.push(item as Task)
              }
            }
          })

          console.log(newVerifications)
          setVerificatons(prev => [
            ...prev.filter(v => !newVerifications.some(nv => nv.id === v.id)),
            ...newVerifications
          ])

          setTasks(prev => [
            ...prev.filter(t => !newTasks.some(nt => nt.id === t.id)),
            ...newTasks
          ])
        } else {
          console.warn('No teams found.')
          router.push("/dashboard")
        }
      } catch (error) {
        console.error('Error fetching submission requirements:', error)
      }
    }

    fetchSubmissionRequirements()
  }, [])

  const getStatusTask = (
    data: GetCompetitionSubmissionRequirementResponse extends (infer ElementType)[]
      ? ElementType
      : never
  ) => {
    const isDeadline = Date.now() > new Date(data.requirement.deadline ?? '').getTime()
    if (data.media == null && !isDeadline) {
      return 'notopened'
    } else if (data.media != null && !isDeadline) {
      return 'ongoing'
    } else if (data.media != null && isDeadline) {
      return 'complete'
    }
    return 'notopened'
  }

  const getTriggerColor = (item: Task | Verif): string => {
    const today = new Date()
    const isPastDue = today > item.dueDate && item.status !== 'complete'

    if (isPastDue) return 'bg-gradient-to-r from-white/20 to-[#E50000]/80' // Past due date and not complete
    if (item.status === 'notopened')
      return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
    if (item.status === 'ongoing')
      return 'bg-gradient-to-r from-white/20 to-[#FFCC00CC]/80'
    if (item.status === 'complete')
      return 'bg-gradient-to-r from-white/20 to-[#4D06B0CC]/80'

    return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
  }
  const getStatusColor = (item: Task | Verif): string => {
    const today = new Date()
    const isPastDue = today > item.dueDate && item.status !== 'complete'

    if (isPastDue) return 'border-[#fd7777] text-[#fd7777]' // Past due date and not complete
    if (item.status === 'notopened') return 'border-[#FACCCCCC] text-[#FACCCCCC]'
    if (item.status === 'ongoing') return 'border-[#FFCC00CC] text-[#FFCC00CC]'
    if (item.status === 'complete') return 'border-[#c8a5f9] text-[#c8a5f9]'

    return 'border-[#E50000] text-[#E50000]'
  }
  const getStatus = (item: Task | Verif): string => {
    const today = new Date()
    const isPastDue = today > item.dueDate && item.status !== 'complete'
    if (isPastDue) return 'Past Due'
    if (item.status === 'notopened') return 'Not Opened'
    if (item.status === 'ongoing') return 'Ongoing'
    if (item.status === 'complete') return 'Complete'
    return ''
  }
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      setSelectedFile(file)
      console.log('Dropped file:', file)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setSelectedFile(file)
      console.log('Selected file:', file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }
  const contentTypes = ['Team Information', 'Announcements', 'Task List', 'Verification']
  const contents = [
    <div>Team Information Content</div>,
    <div>Announcements Content</div>,
    // Task List Content
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
                <p className="text-xs md:text-sm">{formatDate(selectedTask.dueDate)}</p>
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
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#DBCDEF] bg-transparent px-4 py-10 text-center">
            <CloudUpload className="mb-6" />
            <div className="flex text-sm text-[#DBCDEF] md:text-base">
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-4 hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mr-2 cursor-pointer font-semibold underline">
                Click to upload
              </label>
              <p className="font-light">or drag and drop</p>
            </div>
            <p className="mt-1 text-xs text-[#8C8C8C]">
              Supported formats: JPEG, PNG, PDF, DOCX (Max 20MB)
            </p>
          </div>

          {/* Display Selected File */}
          {selectedFile && (
            <div className="mt-4 text-xs text-[#DBCDEF] md:text-sm">
              <p>Selected File:</p>
              <p className="font-bold">{selectedFile.name}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              size="lg"
              className="mt-2 bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white">
              Submit Task
            </Button>
          </div>
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
                <p className="gap-3 text-lg font-semibold md:text-xl">
                  {task.title}
                  <span className="ml-3 text-xs font-light md:text-sm">
                    {formatDate(task.dueDate)}
                  </span>
                </p>
              </AccordionTrigger>
              <AccordionContent className="-mt-2 rounded-lg border border-white px-5 py-7">
                <p className="text-base md:text-lg">{task.description}</p>
                <div className="mt-5 flex w-full items-center gap-3 md:justify-end">
                  <p
                    className={`flex h-10 w-[40%] items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 py-2 text-xs md:w-auto md:px-8 md:text-base ${getStatusColor(task)}`}>
                    {getStatus(task)}
                  </p>
                  <Button
                    onClick={() => setSelectedTask(task)} //TODO: Add trigger to change status of task to ongoing
                    size="lg"
                    className={`w-[60%] text-center text-sm md:w-auto md:text-base ${task.status === 'notopened' ? 'border-2 border-[#cccccc] bg-transparent text-[#cccccc] hover:text-[#4D06B0CC]' : 'bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white'}`}>
                    Submit Task
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>,

    // Verif List Content
    <div className="font-dmsans">
      {selectedVerif ? (
        // Specific Verif
        <div className="rounded-lg border border-white bg-gradient-to-r from-[#0202024D]/30 to-[#7138C099]/60 px-8 py-8 md:px-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Button
                onClick={() => setSelectedVerif(null)}
                size="icon"
                className="size-9 bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white">
                <ChevronLeft />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold md:text-2xl">{selectedVerif.title}</h1>
                <p className="text-xs md:text-sm">{formatDate(selectedVerif.dueDate)}</p>
              </div>
            </div>
            <div>
              <p
                className={`flex h-10 items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 px-2 py-2 text-xs md:px-8 md:text-base ${getStatusColor(selectedVerif)}`}>
                {getStatus(selectedVerif)}
              </p>
            </div>
          </div>
          <p className="mt-10">{selectedVerif.description}</p>
          {/* Task Dropzone */}
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#DBCDEF] bg-transparent px-4 py-10 text-center">
            <CloudUpload className="mb-6" />
            <div className="flex text-sm text-[#DBCDEF] md:text-base">
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-4 hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mr-2 cursor-pointer font-semibold underline">
                Click to upload
              </label>
              <p className="font-light">or drag and drop</p>
            </div>
            <p className="mt-1 text-xs text-[#8C8C8C]">
              Supported formats: JPEG, PNG, PDF, DOCX (Max 20MB)
            </p>
          </div>

          {/* Display Selected File */}
          {selectedFile && (
            <div className="mt-4 text-xs text-[#DBCDEF] md:text-sm">
              <p>Selected File:</p>
              <p className="font-bold">{selectedFile.name}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              size="lg"
              className="mt-2 bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white">
              Submit Verification
            </Button>
          </div>
        </div>
      ) : (
        // Task List
        <Accordion type="single" collapsible>
          {verifications?.map(verif => (
            <AccordionItem key={verif.id} value={`task-${verif.id}`}>
              <AccordionTrigger
                accType="framed"
                className={`&[data-state=open]>svg]:rotate-180 mt-2 rounded-xl border border-white px-5 py-5 outline-border hover:no-underline hover:decoration-0 md:py-7 [&>svg]:size-5 [&>svg]:-rotate-90 [&>svg]:text-white md:[&>svg]:size-7 [&[data-state=open]>svg]:rotate-0 ${getTriggerColor(
                  verif
                )}`}>
                <p className="gap-3 text-lg font-semibold md:text-xl">
                  {verif.title}
                  <span className="ml-3 text-xs font-light md:text-sm">
                    {formatDate(verif.dueDate)}
                  </span>
                </p>
              </AccordionTrigger>
              <AccordionContent className="-mt-2 rounded-lg border border-white px-5 py-7">
                <p className="text-base md:text-lg">{verif.description}</p>
                <div className="mt-5 flex w-full items-center gap-3 md:justify-end">
                  <p
                    className={`flex h-10 w-[40%] items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 py-2 text-xs md:w-auto md:px-8 md:text-base ${getStatusColor(verif)}`}>
                    {getStatus(verif)}
                  </p>
                  <Button
                    onClick={() => setSelectedVerif(verif)} //TODO: Add trigger to change status of task to ongoing
                    size="lg"
                    className={`w-[60%] text-center text-sm md:w-auto md:text-base ${verif.status === 'notopened' ? 'border-2 border-[#cccccc] bg-transparent text-[#cccccc] hover:text-[#4D06B0CC]' : 'bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white'}`}>
                    Submit Verification
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  ]

  return (
    <main>
      <ProfileCompetition competitionName={compeName} />
      <Tab contentType={contentTypes} content={contents} />
    </main>
  )
}

export default CompetitionPage
