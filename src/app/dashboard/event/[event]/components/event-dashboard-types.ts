import { Media } from '~/api/generated'

interface EventVerification {
  id: string
  isVerified: boolean
  type: 'bukti-pembayaran' | 'poster' | 'twibbon'
  status: 'unsubmitted' | 'submitted' | 'verified' | 'rejected'
  mediaLink?: string
  mediaName?: string
  rejectionMessage?: string
}

interface MemberEventVerification extends EventVerification {
  userId: string
}

interface TeamEventVerification extends EventVerification {
  teamId: string
}

interface EventTask {
  id: string
  title: string
  description: string
  status: 'notopened' | 'ongoing' | 'completed' | 'past due'
  dueDate: Date
  competitionName?: string
  submission?: {
    teamId: string
    typeId: string
    mediaId: string | null
    judgeResponse: string | null
    createdAt: string | null
    updatedAt: string | null
    media: Media
  }
}

export {
  type EventVerification,
  type MemberEventVerification,
  type TeamEventVerification,
  type EventTask
}
