'use client'

import React, { useEffect, useState } from 'react'
import { getTeamInfo } from './EventHero'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  EventTeam,
  getDownloadPresignedLink,
  self,
  putAdminEventTeamVerification,
  PutAdminEventTeamVerificationData,
  TeamMemberDocument,
  UserDocument,
  EventTeamDocument
} from '~/api/generated'
import { cn } from '~/lib/utils'
import Tag from '~/app/components/Tag'
import { useToast } from '~/hooks/use-toast'
import { Button } from '~/app/components/Button'
import MoonLoader from 'react-spinners/ClipLoader'
import { Check, ExternalLink, SendHorizonal, X } from 'lucide-react'
import { Input } from '~/app/components/Input'
import Link from 'next/link'

interface EventVerificationSectionProps {
  teamID: string
  eventID: string
}

const DEFAULT_FIELD = 'has not been filled'

function Field({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div>
        <h1 className="font-semibold">{title}</h1>
      </div>
      <div>
        <p className="text-purple-100">{value}</p>
      </div>
    </div>
  )
}

function MemberCard({
  isTeamLeader,
  teamID,
  name,
  email,
  phone,
  studentCard,
  poster,
  twibbon,
  instance,
  eventID,
  userID,
  onRefetch
}: {
  isTeamLeader?: boolean
  teamID: string
  name: string
  email: string
  phone: string
  instance: string
  studentCard: UserDocument | null
  poster: TeamMemberDocument | null
  twibbon: TeamMemberDocument | null
  eventID: string
  userID: string
  onRefetch: () => Promise<void>
}) {
  return (
    <div className="relative flex flex-col gap-3 rounded-lg border border-white px-5 py-4">
      {isTeamLeader && (
        <Tag
          variant="lilac"
          text="Team Leader"
          className="absolute right-4 top-3 w-fit bg-white px-5"
        />
      )}
      <Field title="Name" value={name} />
      <Field title="Instance" value={instance} />
      <Field title="Email" value={email} />
      <Field title="Phone" value={phone ? phone : '-'} />

      <h3 className="font-semibold">Team Member Document</h3>
      {/* Student card */}
      {studentCard?.media.url && studentCard?.type ? (
        <FileRequirements
          file={studentCard}
          editable={true}
          teamID={teamID}
          eventID={eventID}
          userID={userID}
          onRefetch={onRefetch}
        />
      ) : (
        <p className="text-lg text-red-100">Student ID Card not found</p>
      )}

      {/* Student poster */}
      {poster?.type && poster?.media.url ? (
        <FileRequirements
          file={poster}
          editable={true}
          teamID={teamID}
          eventID={eventID}
          userID={userID}
          onRefetch={onRefetch}
        />
      ) : (
        <p className="text-lg text-red-100">Poster not found</p>
      )}

      {/* Student twibbon */}
      {twibbon?.type && twibbon?.media.url ? (
        <FileRequirements
          file={twibbon}
          editable={true}
          teamID={teamID}
          eventID={eventID}
          userID={userID}
          onRefetch={onRefetch}
        />
      ) : (
        <p className="text-lg text-red-100">Twibbon not found</p>
      )}
    </div>
  )
}

function PaymentProof({
  file,
  teamID,
  eventID,
  onRefetch
}: {
  file: EventTeamDocument
  teamID: string
  eventID: string
  onRefetch: () => Promise<void>
}) {
  return (
    <div className="mb-6">
      {file?.media?.url && file.type ? (
        <FileRequirements
          file={file}
          editable={true}
          isPaymentProof={true}
          teamID={teamID}
          eventID={eventID}
          onRefetch={onRefetch}
        />
      ) : (
        <p className="font-belanosima text-2xl text-white">No payment proof found</p>
      )}
    </div>
  )
}

function FileRequirements({
  file,
  editable,
  teamID,
  isPaymentProof,
  eventID,
  userID,
  onRefetch
}: {
  file: EventTeamDocument | TeamMemberDocument | UserDocument
  editable: boolean
  teamID: string
  isPaymentProof?: boolean
  eventID: string
  userID?: string
  onRefetch: () => Promise<void>
}) {
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const [isFeedback, setIsFeedback] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fileURL, setURL] = useState<string | undefined>()

  useEffect(() => {
    const fetchURL = async () => {
      const selfData = await self({
        client: axiosAuth
      })

      // Check access whether its the owner or admin.
      if (
        selfData.error ||
        selfData.data.role !== 'admin' ||
        selfData.data.id !== file.media.creatorId
      ) {
        setURL('/404')
      }

      const presigned = await getDownloadPresignedLink({
        client: axiosAuth,
        query: {
          filename: file.media.name,
          // @ts-ignore
          bucket: file.media.bucket
        }
      })

      if (presigned.error) {
        toast({
          title: 'File Error',
          description: 'Failed to get file URL',
          variant: 'warning'
        })
        return
      }

      setURL(presigned.data?.presignedUrl)
    }

    fetchURL()
  }, [])

  // Submit handler for document status change
  async function submitHandler(isVerified: boolean) {
    setLoading(true)

    const bodyUpdate: PutAdminEventTeamVerificationData['body'] = {
      buktiPembayaran: isPaymentProof
        ? { isVerified, verificationError: isVerified ? '' : feedback }
        : undefined,
      teamMember: !isPaymentProof
        ? [
            {
              userId: userID || '',
              [file.type === 'kartu-identitas' ? 'kartuIdentitas' : file.type]: {
                isVerified,
                verificationError: isVerified ? '' : feedback
              }
            }
          ]
        : []
    }

    const resp = await putAdminEventTeamVerification({
      client: axiosAuth,
      path: { teamId: teamID, eventId: eventID || '' },
      body: bodyUpdate
    })

    setLoading(false)
    setIsFeedback(false)
    if (resp.error) {
      toast({
        title: 'Feedback Error',
        description: 'Failed to submit feedback',
        variant: 'destructive'
      })
      return
    }

    toast({
      title: isVerified ? 'Verified Successfully' : 'Rejection Submitted',
      description: `Document ${isVerified ? 'verified' : 'rejected successfully.'}`,
      variant: 'success'
    })

    if (onRefetch) {
      await onRefetch()
    }
  }

  //! HARDCODED
  const fileType: Record<string, string> = {
    'commitment-fee': 'Commitment Fee',
    nisn: 'NISN',
    'kartu-identitas': 'Kartu Identitas',
    poster: 'Poster',
    twibbon: 'Twibbon'
  }

  return (
    <div className="mb-6">
      {file?.media?.url && file.type ? (
        <div className="rounded-lg border border-white px-6 py-3">
          {/* First Row: File URL, File Type and Status */}
          <div className="mb-4 flex justify-between gap-5">
            <Link href={fileURL || '#'} target="_blank">
              <div className="flex items-center gap-4">
                <ExternalLink size={30} />
                <p className="text-lg font-semibold text-white underline underline-offset-1 hover:underline">
                  {fileType[file.type]}
                </p>
              </div>
            </Link>
            {/* Document Status */}
            <div className="inline-block h-fit w-full break-words text-right">
              <p
                className={`pt-1 text-sm font-medium lg:text-[20px] ${file?.isVerified ? 'text-green-300' : 'text-red-200'}`}>
                {file?.isVerified ? 'Verified' : 'Not Verified'}
              </p>
              {file?.verificationError && (
                <div className="mt-1 text-right">
                  <p className="textD-red-100 text-sm">
                    <b>Rejection Reason:</b>
                  </p>
                  <p
                    className="textD-red-100 break-words text-sm"
                    style={{
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word' // Ensures long words break
                    }}>
                    {file.verificationError}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* "Ganti Status" and Buttons */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <p className="text-white lg:text-[20px] xl:w-[70px]">Ganti Status</p>
            {editable && !isFeedback && (
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsFeedback(true)}>
                  <X size={10} className="text-white" strokeWidth={3} />
                </Button>
                <Button size="sm" onClick={() => submitHandler(true)}>
                  <Check size={10} strokeWidth={3} />
                </Button>
              </div>
            )}
            {isFeedback && (
              <div className="flex flex-wrap items-center gap-2 xl:w-full xl:flex-col xl:flex-nowrap xl:items-start">
                <div className="xl:w-full">
                  <Input
                    placeholder="Send what's wrong"
                    className="w-full md:w-[300px] lg:w-[500px] xl:w-full xl:grow-[2]"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                  />
                </div>
                <div className="flex gap-x-1">
                  <Button
                    className={cn(loading ? 'cursor-not-allowed' : '')}
                    size="sm"
                    onClick={() => !loading && submitHandler(false)}>
                    {loading ? (
                      <MoonLoader color="#fff" size={15} />
                    ) : (
                      <SendHorizonal size={15} strokeWidth={3} />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setIsFeedback(false)}>
                    <X size={10} className="text-white" strokeWidth={3} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="font-belanosima text-2xl text-white">No payment proof found</p>
      )}
    </div>
  )
}

const EventVerificationSection = ({ teamID, eventID }: EventVerificationSectionProps) => {
  const axiosInstance = useAxiosAuth()
  const [teamInfo, setTeamInfo] = useState<EventTeam | null>(null)

  const fetchData = async () => {
    const data = await getTeamInfo(axiosInstance, teamID, eventID)
    setTeamInfo(data)
  }

  const handleRefetch = async () => {
    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [axiosInstance, teamID, eventID])

  const createdAt = teamInfo?.createdAt
    ? new Date(teamInfo.createdAt).toLocaleDateString()
    : ''
  const members = teamInfo?.teamMembers
  // Get latest payment proof
  const paymentProof = (() => {
    if (!teamInfo?.document || teamInfo.document.length === 0) {
      return null
    }
    return teamInfo.document.reduce((latest, current) =>
      new Date(current.media.createdAt) > new Date(latest.media.createdAt)
        ? current
        : latest
    )
  })()

  const submissionsTypeID =
    teamInfo?.teamMembers?.map(member => {
      const data = member.user

      return {
        id: data?.id,
        studentCard: data?.document?.find(doc => doc.type === 'kartu-identitas'),
        poster: member.document?.find(doc => doc.type === 'poster'),
        twibbon: member.document?.find(doc => doc.type === 'twibbon')
      }
    }) || []

  return (
    <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-[2rem] py-[1rem] font-dmsans shadow-lg">
      <div className="mb-4 mr-2">
        <h1 className="font-teachers text-[32px] font-bold">Verification</h1>
        <p>Created: {createdAt}</p>
      </div>
      {paymentProof ? (
        <PaymentProof
          file={paymentProof}
          teamID={teamID}
          eventID={eventID}
          onRefetch={handleRefetch}
        />
      ) : (
        <p className="mb-4 rounded-sm border-[1px] border-white px-2 py-2 text-xl font-bold text-white">
          Commitment Fee document not found
        </p>
      )}
      <div
        className={cn('grid-cols-1 gap-7 xl:grid-cols-3', members ? 'grid' : 'hidden')}>
        {members &&
          // submissionsTypeID &&
          members.map((member, index) => {
            const data = submissionsTypeID.find(data => data.id === member.user?.id)
            return (
              <MemberCard
                key={index}
                teamID={teamID}
                instance={member.user?.instance ? member.user.instance : DEFAULT_FIELD}
                name={member.user?.fullName ? member.user.fullName : DEFAULT_FIELD}
                email={member.user?.email ? member.user?.email : DEFAULT_FIELD}
                phone={
                  member.user?.phoneNumber
                    ? member.user.phoneNumber.toString()
                    : DEFAULT_FIELD
                }
                isTeamLeader={member.role === 'leader'}
                studentCard={data?.studentCard || null}
                poster={data?.poster || null}
                twibbon={data?.twibbon || null}
                eventID={eventID}
                userID={member.userId}
                onRefetch={handleRefetch}
              />
            )
          })}
      </div>
    </div>
  )
}

export default EventVerificationSection
