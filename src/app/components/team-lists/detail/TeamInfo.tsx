import { Check, ExternalLink, Pencil, SendHorizonal, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  putAdminCompetitionTeamVerification,
  PutAdminCompetitionTeamVerificationData,
  TeamDocument,
  TeamMember,
  TeamMemberDocument,
  UserDocument
} from '~/api/generated'
import { Button } from '~/app/components/Button'
import Tag from '~/app/components/Tag'
import { cn } from '~/lib/utils'
import { Input } from '../../Input'
import Dropdown, { MenuItem } from '../../Dropdown'
import MoonLoader from 'react-spinners/ClipLoader'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'

/* NOTE: NULL verificationStatus should be indicated by no document uploaded yet.
 *  Assumption: frontend won't automatically change any status EXCEPT the user decided to
 *  Assumption: frontend con't check if the verification status corresponding is
 */
const DEFAULT_FIELD = 'has not been filled'

type GetTeamDetailResponse = {
  teamID: string
  competitionID: string
  members?: Array<TeamMember> | undefined // Make members optional
  existsSubmission?: boolean
  paymentProof: TeamDocument | null
  onRefetch: () => Promise<void>
  submissionsTypeID:
    | {
        name: string
        studentCard: UserDocument | null
        poster: TeamMemberDocument | null
        twibbon: TeamMemberDocument | null
      }[]
    | undefined
}

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

function PaymentProof({
  file,
  teamID,
  competitionID,
  onRefetch
}: {
  file: TeamDocument
  teamID: string
  competitionID: string
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
          competitionID={competitionID}
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
  competitionID,
  userID,
  onRefetch
}: {
  file: TeamDocument | TeamMemberDocument | UserDocument
  editable: boolean
  teamID: string
  isPaymentProof?: boolean
  competitionID: string
  userID?: string
  onRefetch: () => Promise<void>
}) {
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const [isFeedback, setIsFeedback] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Submit handler for document status change
  async function submitHandler(isVerified: boolean) {
    setLoading(true)

    const bodyUpdate: PutAdminCompetitionTeamVerificationData['body'] = {
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

    const resp = await putAdminCompetitionTeamVerification({
      client: axiosAuth,
      path: { teamId: teamID, competitionId: competitionID || '' },
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
    'bukti-pembayaran': 'Bukti Pembayaran',
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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ExternalLink size={24} />
              <Link href={`https://${file.media.url}`} target="_blank">
                <p className="text-lg font-semibold text-white hover:underline">
                  {fileType[file.type]}
                </p>
              </Link>
            </div>
            {/* Document Status */}
            <div className="text-right">
              <p
                className={`text-sm font-medium ${file?.isVerified ? 'text-green-300' : 'text-purple-100'}`}>
                {file?.isVerified ? 'Verified' : 'Not Verified'}
              </p>
              {file?.verificationError && (
                <p className="mt-1 text-sm text-red-100">
                  <b>Rejection Reason:</b> {file.verificationError}
                </p>
              )}
            </div>
          </div>

          {/* "Ganti Status" and Buttons */}
          <div className="flex flex-col gap-3">
            <p className="text-white">Ganti Status</p>
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
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Send what's wrong"
                  className="max-w-[250px]"
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
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
                <Button variant="outline" size="xs" onClick={() => setIsFeedback(false)}>
                  <X size={10} className="text-white" strokeWidth={3} />
                </Button>
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

function MemberCard({
  isTeamLeader,
  teamID,
  name,
  email,
  phone,
  studentCard,
  poster,
  twibbon,
  competitionID,
  userID,
  onRefetch
}: {
  isTeamLeader?: boolean
  teamID: string
  name: string
  email: string
  phone: string
  studentCard: UserDocument | null
  poster: TeamMemberDocument | null
  twibbon: TeamMemberDocument | null
  competitionID: string
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
      <Field title="Email" value={email} />
      <Field title="Phone" value={phone ? phone : '-'} />

      <h3 className="font-semibold">Team Member Document</h3>
      {/* Student card */}
      {studentCard?.media.url && studentCard?.type ? (
        <FileRequirements
          file={studentCard}
          editable={true}
          teamID={teamID}
          competitionID={competitionID}
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
          competitionID={competitionID}
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
          competitionID={competitionID}
          userID={userID}
          onRefetch={onRefetch}
        />
      ) : (
        <p className="text-lg text-red-100">Twibbon not found</p>
      )}
    </div>
  )
}

export function TeamStatus({
  stage,
  qualifications,
  stageWin,
  stageSuccess,
  stageFailed
}: {
  stage: 'Pre-eliminary' | 'Final'
  qualifications: MenuItem[]
  stageWin?: string[]
  stageSuccess: string[]
  stageFailed?: string[]
}) {
  const [hidden, setHidden] = useState<boolean>(false)
  const [qualification, setQualification] = useState<MenuItem | null>(null)

  const isWin = qualification?.option ? stageWin?.includes(qualification.option) : false
  const isSuccess = qualification?.option
    ? stageSuccess.includes(qualification.option)
    : false
  const isFailed = qualification?.option
    ? stageFailed?.includes(qualification.option)
    : false
  const qualificationStatus = isWin
    ? 'lilac'
    : isSuccess
      ? 'success'
      : isFailed
        ? 'danger'
        : 'warning'

  return (
    <div
      className={cn(
        'mt-5 flex items-center justify-between',
        hidden ? 'flex-col md:flex-row' : ''
      )}>
      <div>
        <h1 className="font-teachers text-[32px] font-bold">{stage}</h1>
      </div>
      {!hidden && (
        <div className="flex items-center gap-3">
          <Tag
            variant={qualificationStatus}
            text={qualification?.option ? qualification?.option : 'On Review'}
            className="w-fit px-6"
          />
          <Pencil
            size={25}
            className="text-white hover:cursor-pointer"
            strokeWidth={2.4}
            onClick={() => {
              setHidden(true)
            }}
          />
        </div>
      )}
      {hidden && (
        <div className="mt-3 flex items-center gap-2">
          <Dropdown
            data={qualifications}
            onChange={e => {
              setQualification(e)
            }}
            value={qualification}
          />
          <div className="flex flex-row gap-2 pb-2">
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => {
                setHidden(false)
              }}>
              <X size={10} className="text-white" strokeWidth={3} />
            </Button>
            <Button
              size={'sm'}
              onClick={() => {
                setHidden(false)
              }}>
              <Check size={10} strokeWidth={3} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TeamInfo({
  teamID,
  members,
  submissionsTypeID,
  existsSubmission,
  paymentProof,
  competitionID,
  onRefetch
}: GetTeamDetailResponse) {
  if (members?.length === 0) {
    return (
      <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-[2rem] py-[1rem] shadow-lg">
        <h1 className="font-teachers text-[32px] font-bold">
          This team doesn't have any member yet
        </h1>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-[2rem] py-[1rem] font-dmsans shadow-lg">
      <div className="mb-3 mr-2">
        <h1 className="font-teachers text-[32px] font-bold">Verification</h1>
      </div>
      {paymentProof ? (
        <PaymentProof
          file={paymentProof}
          teamID={teamID}
          competitionID={competitionID}
          onRefetch={onRefetch}
        />
      ) : (
        <p className="mb-4 rounded-sm border-[1px] border-white px-2 py-2 text-xl font-bold text-white">
          Payment proof document not found
        </p>
      )}
      <div
        className={cn('grid-cols-1 gap-7 xl:grid-cols-3', members ? 'grid' : 'hidden')}>
        {members &&
          submissionsTypeID &&
          members.map((member, index) => {
            const data = submissionsTypeID.find(
              data => data.name === member.user?.fullName
            )
            return (
              <MemberCard
                key={index}
                teamID={teamID}
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
                competitionID={competitionID}
                userID={member.userId}
                onRefetch={onRefetch}
              />
            )
          })}
      </div>
      {/* // TODO: integrate submission for UXVidia and Hackvidia */}
      {!existsSubmission && (
        <>
          <TeamStatus
            stage="Final"
            qualifications={[
              { id: 1, option: 'Juara 1' },
              { id: 2, option: 'Juara 2' },
              { id: 3, option: 'Juara 3' },
              { id: 4, option: 'Juara Harapan 1' },
              { id: 5, option: 'Juara Harapan 2' },
              { id: 6, option: 'Juara Harapan 3' }
            ]}
            stageWin={['Juara 1', 'Juara 2', 'Juara 3']}
            stageSuccess={['Juara Harapan 1', 'Juara Harapan 2', 'Juara Harapan 3']}
          />
          <TeamStatus
            stage="Pre-eliminary"
            qualifications={[
              { id: 1, option: 'Pass' },
              { id: 2, option: 'Not Pass' },
              { id: 3, option: 'On Review' }
            ]}
            stageSuccess={['Pass']}
            stageFailed={['Not Pass']}
          />
        </>
      )}
    </div>
  )
}
