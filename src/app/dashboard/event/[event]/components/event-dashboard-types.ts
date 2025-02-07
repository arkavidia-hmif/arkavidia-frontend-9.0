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

export {
  type EventVerification,
  type MemberEventVerification,
  type TeamEventVerification
}
