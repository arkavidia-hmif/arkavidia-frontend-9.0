interface EventVerification {
  id: string
  isVerified: boolean
  type: 'bukti-pembayaran' | 'poster' | 'twibbon'
  status: 'unsubmitted' | 'submitted' | 'verified' | 'rejected'
  mediaLink?: string
  mediaName?: string
  rejectionMessage?: string
}

export { type EventVerification }
