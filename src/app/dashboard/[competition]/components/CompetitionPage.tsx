'use client'

import { ElementType, useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../../components/ui/accordion'
import { Button } from '../../../components/ui/button'
import { Tab } from '../../../components/Tab'
import { ChevronLeft } from 'lucide-react'
import {
  getDownloadPresignedLink,
  GetPresignedLinkData,
  getTeamById,
  getTeams,
  GetTeamsResponse,
  getTeamSubmission,
  GetTeamSubmissionResponse,
  Media,
  postTeamDocument,
  putTeamSubmission,
  self,
  Team,
  updateTeamMemberDocument
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useAppSelector } from '~/redux/store'
import { useParams, useRouter } from 'next/navigation'
import ProfileCompetition from '~/app/components/ProfileCompetition'
import TaskDropzone from './TaskDropzone'
import TeamInformationContent from '~/app/components/competition/TeamInformationContent'
import Dropdown, { MenuItem } from '~/app/components/Dropdown'
import { toast, useToast } from '~/hooks/use-toast'
import FilePreview from './FilePreview'

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
// Task interface
interface Task {
  id: string
  title: string
  description: string
  status: 'notopened' | 'ongoing' | 'completed' | 'past due'
  dueDate: Date
  competitionName?: string
  submission: {
    teamId: string
    typeId: string
    mediaId: string | null
    judgeResponse: string | null
    createdAt: string | null
    updatedAt: string | null
    media: Media
  }
}

// Verif interface
interface Verification {
  id: string
  isVerified: boolean
  type: 'bukti-pembayaran' | 'poster' | 'twibbon'
  status: 'unsubmitted' | 'submitted' | 'verified' | 'rejected'
  mediaLink?: string
  mediaName?: string
  rejectionMessage?: string
}

interface TeamVerification extends Verification {
  teamId: string
}

interface MemberVerification extends Verification {
  userId?: string
}

const MemberDocumentRequirement = ['poster', 'twibbon']

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const CompetitionPage = ({ compeName }: { compeName: string }) => {
  const { toast } = useToast()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedVerif, setSelectedVerif] = useState<
    TeamVerification | MemberVerification | null
  >(null)

  const axiosInstance = useAxiosAuth()
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const hasFetched = useRef(false)
  // Call the requirement api
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    const fetchSubmissionRequirements = async () => {
      try {
        if (!isLoggedIn) {
          toast({
            title: 'Not Logged In',
            description: 'You need to be logged in to access this page',
            variant: 'destructive'
          })
          router.push('/')
          return
        }

        const teamsResponse = await getTeams({ client: axiosInstance })
        if (teamsResponse.data && teamsResponse.data.length > 0) {
          const teamData: GetTeamsResponse = []

          teamsResponse.data.forEach(team => {
            if (team.competition?.title.toLowerCase() === compeName.toLowerCase()) {
              teamData.push(team)
            }
          })

          // Handle case where no matching team is found
          if (!teamData || teamData.length <= 0) {
            router.push('/')
            return
          }
          const teamId = teamData[0].id
          setCurrentTeamId(teamId)
          const currentUserData = await self({ client: axiosInstance })
          setCurrentUserId(currentUserData.data?.id ?? '')

          const requirementsResponse = await getTeamSubmission({
            client: axiosInstance,
            path: { teamId }
          })

          const newTasks: Task[] = []

          // Verifications
          let teamVerification: TeamVerification | null
          const memberVerifications: MemberVerification[] = []

          const teamVerifData = await getTeamById({
            client: axiosInstance,
            path: { teamId }
          })
          // Get team payment verification if the user is a leader
          if (teamVerifData?.data?.document?.length === 0) {
            teamVerification = {
              id: 'team-0',
              teamId: teamId,
              type: 'bukti-pembayaran',
              isVerified: false,
              status: 'unsubmitted'
            }
          } else {
            const presignedFile = await getDownloadPresignedLink({
              client: axiosInstance,
              query: {
                filename: teamVerifData.data?.document?.[0].media.name || '',
                // @ts-ignore
                bucket: teamVerifData.data?.document?.[0].media.bucket
              }
            })

            if (presignedFile.error) {
              toast({
                title: 'File Error',
                description: 'Failed to get file URL',
                variant: 'warning'
              })
            }

            const isVerified = teamVerifData?.data?.document?.[0].isVerified ?? false
            const verificationError = teamVerifData?.data?.document?.[0].verificationError
            const isRejected =
              verificationError !== '' &&
              verificationError !== null &&
              verificationError !== undefined
            teamVerification = {
              id: 'team-0',
              teamId: teamId,
              type: 'bukti-pembayaran',
              status: isVerified ? 'verified' : isRejected ? 'rejected' : 'submitted',
              rejectionMessage:
                teamVerifData?.data?.document?.[0].verificationError ?? '',
              isVerified: isVerified,
              mediaLink: presignedFile.data?.mediaUrl,
              mediaName: teamVerifData.data?.document?.[0].media.name
            }
          }

          // Get current member data only
          //@ts-ignore
          const currentMemberData = teamVerifData?.data?.teamMembers!.find(
            user => user.userId === currentUserData.data?.id
          )

          // Get current member document
          const currentMemberDocument = currentMemberData?.document

          await Promise.all(
            MemberDocumentRequirement.map(async (docType: string, index: number) => {
              // @ts-ignore
              const memberDoc = currentMemberDocument?.find(
                (doc: any) => doc.type === docType
              )
          
              if (!memberDoc) {
                memberVerifications.push({
                  id: `member-${index}`,
                  userId: currentUserData.data?.id,
                  type: docType as 'poster' | 'twibbon',
                  isVerified: false,
                  status: 'unsubmitted'
                })
                return
              }
          
              const presignedFile = await getDownloadPresignedLink({
                client: axiosInstance,
                query: {
                  filename: memberDoc.media.name,
                  // @ts-ignore
                  bucket: memberDoc.media.bucket
                }
              })
          
              if (presignedFile.error) {
                toast({
                  title: 'File Error',
                  description: 'Failed to get file URL',
                  variant: 'warning'
                })
              }
          
              const isVerified = memberDoc.isVerified ?? false
              const verificationError = memberDoc.verificationError
              const isRejected =
                verificationError !== '' &&
                verificationError !== null &&
                verificationError !== undefined
          
              memberVerifications.push({
                id: `member-${index}`,
                userId: currentUserData.data?.id,
                type: docType as 'poster' | 'twibbon',
                isVerified: isVerified,
                rejectionMessage: memberDoc.verificationError ?? '',
                status: isVerified ? 'verified' : isRejected ? 'rejected' : 'submitted',
                mediaLink: presignedFile.data?.mediaUrl,
                mediaName: memberDoc.media.name
              })
            })
          )
          

          if (teamVerification) {
            setVerifications(prev => [...prev, teamVerification])
          }
          setVerifications(prev => [...prev, ...memberVerifications])

          // Submissions
          requirementsResponse.data?.forEach(data => {
            const item = {
              id: data.requirement.typeId,
              title: data.requirement.typeName,
              description: data.requirement.description,
              dueDate: new Date(data.requirement.deadline ?? ''),
              status: getStatusTask(data) ?? 'notopened',
              competitionName: compeName.toLowerCase(),
              submission: data.submission
            }

            if (data.requirement.stage === 'verification') {
            } else {
              if (!tasks.some(t => t.id === item.id)) {
                newTasks.push(item as Task)
              }
            }
          })

          setTasks(prev => [
            ...prev.filter(t => !newTasks.some(nt => nt.id === t.id)),
            ...newTasks
          ])
        } else {
          toast({
            title: 'No teams found',
            description: 'Anda belum bergabung dalam kompetisi ini',
            variant: 'destructive'
          })
          router.push('/')
        }
      } catch (error) {
        console.error(error)
        toast({
          title: 'Gagal',
          description: 'Gagal mendapatkan data',
          variant: 'destructive'
        })
      }
    }

    fetchSubmissionRequirements()
  }, [])

  const getStatusTask = (
    data: GetTeamSubmissionResponse extends (infer ElementType)[] ? ElementType : never
  ) => {
    const isDeadline = Date.now() > new Date(data.requirement.deadline ?? '').getTime()
    // No submission yet
    if (!data.submission || data.submission?.media === null) {
      if (isDeadline) {
        return 'past due'
      } else {
        return 'ongoing'
      }
    } else if (data.submission) {
      // Have a submission then marked as complete
      return 'completed'
    }
    // } else if (data.submission?.media !== null && !isDeadline) {
    //   return 'ongoing'
    // } else if (data.submission?.media !== null && isDeadline) {
    //   return 'complete'
    // }
    // return 'notopened'
  }

  const getVerifTriggerColor = (status: string): string => {
    if (status === 'unsubmitted')
      return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
    if (status === 'submitted') return 'bg-gradient-to-r from-white/20 to-[#FFCC00CC]/80'
    if (status === 'verified') return 'bg-gradient-to-r from-white/20 to-[#4D06B0CC]/80'
    if (status === 'rejected') return 'bg-gradient-to-r from-white/20 to-[#E50000]/80'
    return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
  }

  const getTriggerColor = (item: Task): string => {
    const today = new Date()
    const isPastDue = today > item.dueDate && item.status !== 'completed'

    if (
      item.submission &&
      item.submission.judgeResponse &&
      item.submission.judgeResponse.length
    ) {
      return 'bg-gradient-to-r from-white/20 to-[#E50000]/80'
    }
    if (isPastDue || item.status === 'past due')
      return 'bg-gradient-to-r from-white/20 to-[#E50000]/80' // Past due date and not complete
    if (item.status === 'notopened')
      return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
    if (item.status === 'ongoing')
      return 'bg-gradient-to-r from-white/20 to-[#FFCC00CC]/80'
    if (item.status === 'completed')
      return 'bg-gradient-to-r from-white/20 to-[#4D06B0CC]/80'

    return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
  }

  const getVerifStatusColor = (status: string): string => {
    if (status === 'unsubmitted') return 'border-[#FACCCCCC] text-[#FACCCCCC]'
    if (status === 'submitted') return 'border-[#FFCC00CC] text-[#FFCC00CC]'
    if (status === 'verified') return 'border-[#c8a5f9] text-[#c8a5f9]'
    if (status === 'rejected') return 'border-[#E50000] text-[#E50000]'
    return 'border-[#E50000] text-[#E50000]'
  }

  const getStatusColor = (item: Task): string => {
    const today = new Date()
    const isPastDue = today > item.dueDate && item.status !== 'completed'

    if (
      item.submission &&
      item.submission.judgeResponse &&
      item.submission.judgeResponse.length
    ) {
      return 'border-[#E50000] text-[#E50000]'
    }
    if (isPastDue || item.status === 'past due') return 'border-[#fd7777] text-[#fd7777]' // Past due date and not complete
    if (item.status === 'notopened') return 'border-[#FACCCCCC] text-[#FACCCCCC]'
    if (item.status === 'ongoing') return 'border-[#FFCC00CC] text-[#FFCC00CC]'
    if (item.status === 'completed') return 'border-[#c8a5f9] text-[#c8a5f9]'

    return 'border-[#E50000] text-[#E50000]'
  }

  const getVerifStatus = (status: string): string => {
    if (status === 'unsubmitted') return 'Unsubmitted'
    if (status === 'submitted') return 'Submitted'
    if (status === 'verified') return 'Verified'
    if (status === 'rejected') return 'Rejected'
    return 'Unsubmitted'
  }

  const getStatus = (item: Task): string => {
    const today = new Date()
    const isPastDue = today > item.dueDate && item.status !== 'completed'
    if (isPastDue || item.status === 'past due') return 'Past Due'
    if (item.status === 'notopened') return 'Not Opened'
    if (item.status === 'ongoing') return 'Ongoing'
    if (item.status === 'completed') return 'Completed'
    return ''
  }

  const handleSubmissionSubmit = async (
    mediaId: string,
    bucket: string,
    typeId: string
  ) => {
    const teamID = currentTeamId
    if (!teamID) {
      toast({
        title: 'Error',
        description: 'Invalid team ID',
        variant: 'destructive',
        duration: 5000
      })
      return
    }

    try {
      const submitReq = await putTeamSubmission({
        client: axiosInstance,
        path: {
          teamId: teamID
        },
        body: {
          typeId: typeId,
          mediaId: mediaId
        }
      })

      if (submitReq.error) {
        toast({
          title: 'Error',
          description: 'Failed to submit document',
          variant: 'destructive',
          duration: 5000
        })
      }

      if (submitReq.data) {
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
          description: 'Document submitted successfully',
          variant: 'success',
          duration: 5000
        })
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to submit document',
        variant: 'destructive',
        duration: 5000
      })
    }
  }

  const handleMediaSubmit = async (mediaId: string, type: string) => {
    const team_id = currentTeamId
    try {
      if (type === 'bukti-pembayaran') {
        const submitReq = await postTeamDocument({
          client: axiosInstance,
          body: { paymentProofMediaId: mediaId },
          path: {
            teamId: team_id ?? ''
          }
        })

        if (submitReq.error) {
          toast({
            title: 'Gagal',
            description: 'Gagal menyimpan dokumen',
            variant: 'destructive'
          })
        }

        if (submitReq.data) {
          const updatedVerifications = verifications.map(verif => {
            if (verif.type === type) {
              return {
                ...verif,
                isVerified: false,
                status: 'submitted' as 'submitted'
              }
            }
            return verif
          })
          setVerifications(updatedVerifications)
          setSelectedVerif(null)
          toast({
            title: 'Berhasil',
            description: 'Dokumen berhasil disimpan',
            variant: 'success'
          })
        }
      } else {
        const submitPersonalReq = await updateTeamMemberDocument({
          client: axiosInstance,
          body:
            type === 'poster' ? { posterMediaId: mediaId } : { twibbonMediaId: mediaId },
          path: { teamId: team_id ?? '', userId: currentUserId ?? '' }
        })

        if (submitPersonalReq.error) {
          toast({
            title: 'Gagal',
            description: 'Gagal menyimpan dokumen',
            variant: 'destructive'
          })
        }

        if (submitPersonalReq.data) {
          const updatedVerifications = verifications.map(verif => {
            if (verif.type === type) {
              return {
                ...verif,
                isVerified: false,
                status: 'submitted' as 'submitted'
              }
            }
            return verif
          })
          setVerifications(updatedVerifications)
          setSelectedVerif(null)
          toast({
            title: 'Berhasil',
            description: 'Dokumen berhasil disimpan',
            variant: 'success'
          })
        }
      }
    } catch (err) {
      toast({
        title: 'Gagal',
        description: 'Gagal menyimpan dokumen',
        variant: 'destructive'
      })
    }
  }

  const contentTypes = ['Team Information', 'Task List', 'Verification']

  const contents = [
    // Team Information Content
    <TeamInformationContent compeName={compeName} />,

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
          <TaskDropzone
            bucket={
              `submission-${selectedTask.competitionName}` as GetPresignedLinkData['query']['bucket']
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
                <p className="gap-3 text-lg font-semibold md:text-xl">
                  {task.title}
                  <span className="ml-3 text-xs font-light md:text-sm">
                    {formatDate(task.dueDate)}
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
                    className={`flex h-10 w-[40%] items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 py-2 text-xs md:w-auto md:px-8 md:text-base ${getStatusColor(task)}`}>
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
                <h1 className="text-xl font-bold md:text-2xl">
                  {capitalizeFirstLetter(selectedVerif.type)
                    .split('-')
                    .map(word => capitalizeFirstLetter(word))
                    .join(' ')}
                </h1>
              </div>
            </div>
            <div>
              <p
                className={`flex h-10 items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 px-2 py-2 text-xs md:px-8 md:text-base ${getVerifStatusColor(selectedVerif.status)}`}>
                {getVerifStatus(selectedVerif.status)}
              </p>
            </div>
          </div>
          {/* <p className="mt-10">{selectedVerif.description}</p> */}
          {/* Task Dropzone */}
          <TaskDropzone bucket={selectedVerif.type} onSubmitMedia={handleMediaSubmit} />
        </div>
      ) : (
        // Task List
        <Accordion type="multiple" defaultValue={verifications.map(verif => verif.id)}>
          {verifications?.map(verif => (
            <AccordionItem key={verif.id} value={`${verif.id}`}>
              <AccordionTrigger
                accType="framed"
                className={`&[data-state=open]>svg]:rotate-180 mt-2 rounded-xl border border-white px-5 py-5 outline-border hover:no-underline hover:decoration-0 md:py-7 [&>svg]:size-5 [&>svg]:-rotate-90 [&>svg]:text-white md:[&>svg]:size-7 [&[data-state=open]>svg]:rotate-0 ${getVerifTriggerColor(verif.status)}`}>
                <p className="gap-3 text-lg font-semibold md:text-xl lg:text-[24px]">
                  {capitalizeFirstLetter(verif.type)
                    .split('-')
                    .map(word => capitalizeFirstLetter(word))
                    .join(' ')}
                  {/* <span className="ml-3 text-xs font-light md:text-sm">
                    {formatDate(verif.dueDate)}
                  </span> */}
                </p>
              </AccordionTrigger>
              <AccordionContent className="-mt-2 rounded-lg border border-white px-5 py-7">
                {verif.type === 'bukti-pembayaran' && (
                  <div>
                    <p className="mb-4 md:text-[18px] lg:text-[21px]">
                      Silakan upload bukti pembayaran tim di sini
                    </p>
                    <p className="mb-1 font-bold md:text-[16px] lg:text-[19px]">
                      Rekening
                    </p>
                    <p className="md:text-[15px] lg:text-[17px]">
                      Seabank a.n. Stefany Josefina Santono
                    </p>
                    <p className="md:text-[15px] lg:text-[17px]">901723767417</p>
                  </div>
                )}
                {verif.type === 'poster' && (
                  <div>
                    <p className="mb-4 md:text-[18px] lg:text-[21px]">
                      Silakan upload poster di sini. Poster yang perlu diupload hanyalah
                      poster anda saja.{' '}
                      <b>(Poster diupload oleh masing-masing anggota tim)</b>
                    </p>
                  </div>
                )}
                {verif.type === 'twibbon' && (
                  <div>
                    <p className="mb-4 md:text-[18px] lg:text-[21px]">
                      Silakan upload twibbon di sini. Twibbon yang perlu diupload hanyalah
                      twibbon anda saja.{' '}
                      <b>(Twibbon diupload oleh masing-masing anggota tim)</b>
                    </p>
                  </div>
                )}
                {/* File URL Preview */}
                <FilePreview
                  fileURL={verif.mediaLink ?? undefined}
                  name={verif.mediaName}
                />
                {/* End of File URL Preview */}
                {verif.status === 'rejected' && (
                  <div className="pt-2">
                    <p className="font-teachers text-xl font-bold text-red-400">
                      Alasan penolakan
                    </p>
                    <p className="font-dmsans text-[1rem] text-lg font-normal">
                      {capitalizeFirstLetter(verif.rejectionMessage!)}
                    </p>
                  </div>
                )}
                <div className="mt-5 flex w-full items-center gap-3 md:justify-end">
                  <p
                    className={`flex h-10 w-[40%] items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 py-2 text-xs md:w-auto md:px-8 md:text-base ${getVerifStatusColor(verif.status)}`}>
                    {getVerifStatus(verif.status)}
                  </p>
                  <Button
                    onClick={
                      !verif.isVerified ? () => setSelectedVerif(verif) : undefined
                    }
                    size="lg"
                    disabled={verif.isVerified}
                    className={`w-[60%] text-center text-sm md:w-auto md:text-base ${verif.isVerified ? 'border-2 border-[#cccccc] bg-transparent text-[#cccccc] hover:text-[#4D06B0CC]' : 'bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white'}`}>
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
