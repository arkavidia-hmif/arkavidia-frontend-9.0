import { Check, ExternalLink, Pencil, SendHorizonal, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Media, TeamMember, updateSubmissionFeedback } from '~/api/generated'
import { Button } from '~/app/components/Button'
import Tag from '~/app/components/Tag'
import { cn } from '~/lib/utils'
import { Input } from '../../Input'
import Dropdown, { MenuItem } from '../../Dropdown'
import MoonLoader from 'react-spinners/ClipLoader'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import axios from 'axios'
import { useToast } from '~/hooks/use-toast'

const DEFAULT_FIELD = 'has not been filled'
const URL_PLACEHOLDER = 'https://picsum.photos/200/300'
const TYPE_ID_PLACEHOLDER = '6969'

type MediaIDType = {
  url: string
  typeID: string
}

type GetTeamDetailResponse = {
  teamID: string
  members?: Array<TeamMember> | undefined // Make members optional
  existsSubmission?: boolean
  paymentProof: MediaIDType
  submissionsTypeID: {
    name: string
    studentCard: string
    poster: string
    twibbon: string
  }[]
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
  url,
  teamID,
  typeID
}: {
  url?: string | null
  teamID: string
  typeID: string
}) {
  return (
    <div className="mb-6">
      <div className="rounded-lg border border-white px-6 py-3">
        <FileRequirements
          filetype="Payment Proof"
          url={url ? url : URL_PLACEHOLDER}
          editable={true}
          isPaymentProof
          teamID={teamID}
          typeID={typeID}
        />
      </div>
    </div>
  )
}

function FileRequirements({
  filetype,
  url,
  editable,
  isPaymentProof,
  teamID,
  typeID
}: {
  filetype: string
  url: string
  editable?: boolean
  isPaymentProof?: boolean
  teamID: string
  typeID: string
}) {
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const [isFeedback, setIsFeedback] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function submitHandler() {
    setLoading(true)
    const resp = await updateSubmissionFeedback({
      client: axiosAuth,
      path: {
        teamId: teamID,
        typeId: typeID
      },
      body: {
        feedback: feedback
      }
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
      title: 'Feedback Success',
      description: 'Feedback submitted',
      variant: 'success'
    })
  }

  return (
    <div
      className={cn(
        'flex justify-between',
        isFeedback ? 'flex-col gap-2 md:flex-row' : ''
      )}>
      <div className={cn('flex items-center', isPaymentProof ? 'gap-4' : 'gap-1')}>
        <ExternalLink size={24} />
        <div className="mt-1">
          <Link href={url}>
            <p
              className={cn(
                'hover:cursor-pointer hover:underline',
                isPaymentProof ? 'text-lg font-semibold' : ''
              )}>
              {filetype}
            </p>
          </Link>
        </div>
      </div>
      {editable ? (
        <>
          <div className={cn('gap-5', isFeedback ? 'hidden' : 'flex')}>
            <Button variant={'outline'} size={'sm'} onClick={() => setIsFeedback(true)}>
              <X size={10} className="text-white" strokeWidth={3} />
            </Button>
            <Button size={'sm'}>
              <Check size={10} strokeWidth={3} />
            </Button>
          </div>
          <div
            className={cn(
              'items-center justify-start gap-5',
              isFeedback ? 'flex' : 'hidden'
            )}>
            <Input
              placeholder="Send what's wrong"
              className="max-w-[250px]"
              onChange={e => setFeedback(e.target.value)}
            />
            <Button
              className={cn(loading ? 'cursor-not-allowed' : '')}
              size={'sm'}
              onClick={() => {
                if (!loading) {
                  submitHandler()
                }
              }}>
              {loading ? (
                <MoonLoader color="#fff" size={15} />
              ) : (
                <SendHorizonal size={15} strokeWidth={3} />
              )}
            </Button>
          </div>
        </>
      ) : (
        <div>
          <Check size={30} strokeWidth={2} />
        </div>
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
  twibbon
}: {
  isTeamLeader?: boolean
  teamID: string
  name: string
  email: string
  phone: string
  studentCard: MediaIDType
  poster: MediaIDType
  twibbon: MediaIDType
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
      <FileRequirements
        filetype="Student ID Card"
        url={studentCard.url}
        editable={!isTeamLeader}
        teamID={teamID}
        typeID={studentCard.typeID}
      />
      <FileRequirements
        filetype="Poster"
        url={poster.url}
        editable={!isTeamLeader}
        teamID={teamID}
        typeID={poster.typeID}
      />
      <FileRequirements
        filetype="Twibbon"
        url={twibbon.url}
        editable={!isTeamLeader}
        teamID={teamID}
        typeID={twibbon.typeID}
      />
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
  paymentProof
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
    <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-8 py-4 font-dmsans shadow-lg">
      <div className="mb-3 mr-2">
        <h1 className="font-teachers text-[32px] font-bold">Verfication</h1>
      </div>
      <PaymentProof url={paymentProof.url} teamID={teamID} typeID={paymentProof.typeID} />
      <div
        className={cn('grid-cols-1 gap-7 xl:grid-cols-3', members ? 'grid' : 'hidden')}>
        {members &&
          members.map((member, index) => {
            const data = submissionsTypeID.find(
              data => data.name === member.user?.fullName
            )

            const isStudentCardData = member.user?.document?.find(
              doc => doc.type === 'kartu-identitas'
            )

            const StudentCardDataMediaURL =
              member.user?.document?.find(doc => doc.type === 'kartu-identitas')?.media
                ?.url ?? ''

            const isPosterData = member.document?.find(doc => doc.type === 'poster')

            const PosterDataMediaUrl: string =
              member.document?.find(doc => doc.type === 'poster')?.media?.url ?? ''

            const isTwibbonData =
              member.document?.find(doc => doc.type === 'twibbon')?.media?.url ?? ''

            const TwibbonDataMediaURL: string =
              member.document?.find(doc => doc.type === 'twibbon')?.media?.url ?? ''

            const studentCard = {
              url: isStudentCardData ? StudentCardDataMediaURL : URL_PLACEHOLDER,
              typeID: data?.studentCard ? data.studentCard : TYPE_ID_PLACEHOLDER
            }
            const poster = {
              url: isPosterData ? PosterDataMediaUrl : URL_PLACEHOLDER,
              typeID: data?.poster ? data.poster : TYPE_ID_PLACEHOLDER
            }
            const twibbon = {
              url: isTwibbonData ? TwibbonDataMediaURL : URL_PLACEHOLDER,
              typeID: data?.twibbon ? data.twibbon : TYPE_ID_PLACEHOLDER
            }

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
                studentCard={studentCard}
                poster={poster}
                twibbon={twibbon}
              />
            )
          })}
      </div>
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
