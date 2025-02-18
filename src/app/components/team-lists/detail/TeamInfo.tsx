import { Check, ExternalLink, Pencil, SendHorizonal, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  getDownloadPresignedLink,
  getPresignedLink,
  putAdminCompetitionTeamStatus,
  putAdminCompetitionTeamVerification,
  PutAdminCompetitionTeamVerificationData,
  self,
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
import { useRouter } from 'next/navigation'

/* NOTE: NULL verificationStatus should be indicated by no document uploaded yet.
 *  Assumption: frontend won't automatically change any status EXCEPT the user decided to.
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
        id: string,
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
  const [fileURL, setURL] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetchURL = async () => {

      const selfData = await self({
        client: axiosAuth
      })

      // Check access whether its the owner or admin.
      if(
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
      });

      if(presigned.error) {
        toast({
          title: 'File Error',
          description: 'Failed to get file URL',
          variant: 'warning'
        })
        return;
      }

      setURL(presigned.data?.presignedUrl);
    }

    fetchURL();
  }, [])

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
  competitionID,
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
  stageFailed,
  teamID,
  competitionID,
  qual
}: {
  stage: 'Pre-eliminary' | 'Final'
  qualifications: MenuItem[]
  stageWin?: string[]
  stageSuccess?: string[]
  stageFailed?: string[]
  teamID: string
  competitionID: string
  qual: string
}) {
  const currentQualifications = qualifications.find(option => {
    return option.option === qual
  })
  const [initialQualification, setInitialQualification] = useState<MenuItem | null>(
    currentQualifications ?? null
  )
  const [hidden, setHidden] = useState<boolean>(false)
  const [qualification, setQualification] = useState<MenuItem | null>(
    currentQualifications ?? null
  )
  const { toast } = useToast()
  const authAxios = useAxiosAuth()

  const isWin = qualification?.option ? stageWin?.includes(qualification.option) : false
  const isSuccess = qualification?.option
    ? stageSuccess?.includes(qualification.option)
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

  const handleSaveQualification = async () => {
    if (stage === 'Final') {
      const resp = await putAdminCompetitionTeamStatus({
        client: authAxios,
        body: {
          finalStatus: qualification?.option as
            | 'On Review'
            | 'Not Pass'
            | 'Juara 1'
            | 'Juara 2'
            | 'Juara 3'
            | undefined
        },
        path: {
          teamId: teamID,
          competitionId: competitionID
        }
      })

      if (resp.error) {
        // console.log('Failed to save Final Stage')
        toast({
          title: 'Failed to save Final Stage',
          description: 'Please try again later',
          variant: 'destructive'
        })
      } else {
        // console.log('Successfully saved Final Stage')
        toast({
          title: 'Successfully saved Final Stage',
          description: 'The final stage has been set to ' + qualification?.option,
          variant: 'success'
        })
        setInitialQualification(qualification)
        setQualification(qualification)
      }

      setHidden(false)
    } else {
      const resp = await putAdminCompetitionTeamStatus({
        client: authAxios,
        body: {
          preeliminaryStatus: qualification?.option as
            | 'Pass'
            | 'Not Pass'
            | 'On Review'
            | undefined
        },
        path: {
          teamId: teamID,
          competitionId: competitionID
        }
      })

      if (resp.error) {
        // console.log('Failed to save Prelim Stage')
        toast({
          title: 'Failed to save Pre-eliminary Stage',
          description: 'Please try again later',
          variant: 'destructive'
        })
      } else {
        // console.log('Successfully saved Prelim Stage')
        toast({
          title: 'Successfully saved Pre-eliminary Stage',
          description: 'The pre-eliminary stage has been set to ' + qualification?.option,
          variant: 'success'
        })
        setInitialQualification(qualification)
        setQualification(qualification)
      }

      setHidden(false)
    }
    setHidden(false)
  }

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
            text={qualification?.option ? qualification?.option : qual}
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
                setQualification(initialQualification)
                setHidden(false)
              }}>
              <X size={10} className="text-white" strokeWidth={3} />
            </Button>
            <Button size={'sm'} onClick={handleSaveQualification}>
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
  prelim,
  final,
  onRefetch,
  createdAt
}: GetTeamDetailResponse & { competitionID: string } & {
  prelim: string
} & { final: string } & {createdAt: string}) {
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
      <div className="mb-4 mr-2">
        <h1 className="font-teachers text-[32px] font-bold">Verification</h1>
        <p>Created: {createdAt}</p>
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
              data => data.id === member.user?.id
            )
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
            qual={final}
            teamID={teamID}
            competitionID={competitionID}
            stage="Final"
            qualifications={[
              { id: 1, option: 'Juara 1' },
              { id: 2, option: 'Juara 2' },
              { id: 3, option: 'Juara 3' },
              // { id: 4, option: 'Juara Harapan 1' },
              // { id: 5, option: 'Juara Harapan 2' },
              // { id: 6, option: 'Juara Harapan 3' },
              { id: 7, option: 'On Review' }
            ]}
            stageWin={['Juara 1', 'Juara 2', 'Juara 3']}
            stageSuccess={['Juara Harapan 1', 'Juara Harapan 2', 'Juara Harapan 3']}
          />
          <TeamStatus
            qual={prelim}
            teamID={teamID}
            competitionID={competitionID}
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
