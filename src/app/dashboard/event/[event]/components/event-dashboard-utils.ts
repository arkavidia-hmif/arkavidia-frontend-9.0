import { TeamMember } from '~/api/generated'

const getVerifTriggerColor = (status: string): string => {
  if (status === 'unsubmitted') return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
  if (status === 'submitted') return 'bg-gradient-to-r from-white/20 to-[#FFCC00CC]/80'
  if (status === 'verified') return 'bg-gradient-to-r from-white/20 to-[#4D06B0CC]/80'
  if (status === 'rejected') return 'bg-gradient-to-r from-white/20 to-[#E50000]/80'
  return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
}

const getVerifStatusColor = (status: string): string => {
  if (status === 'unsubmitted') return 'border-[#FACCCCCC] text-[#FACCCCCC]'
  if (status === 'submitted') return 'border-[#FFCC00CC] text-[#FFCC00CC]'
  if (status === 'verified') return 'border-[#c8a5f9] text-[#c8a5f9]'
  if (status === 'rejected') return 'border-[#E50000] text-[#E50000]'
  return 'border-[#E50000] text-[#E50000]'
}

const getVerifStatus = (status: string): string => {
  if (status === 'unsubmitted') return 'Unsubmitted'
  if (status === 'submitted') return 'Submitted'
  if (status === 'verified') return 'Verified'
  if (status === 'rejected') return 'Rejected'
  return 'Unsubmitted'
}

const getEventNameSlug = (slug: string) => {
  // Based on sidebar event formatting (ex: academya-software-engineering)
  const eventSplit = slug.split('-')

  if (eventSplit.length) {
    // 0 is the event type, 1 and after is the event name
    // ex: Academya - Software Engineering
    const firstEventName = eventSplit[1].toLowerCase()
    if (firstEventName === 'software') {
      return 'Academya - Software Engineer'
    } else if (firstEventName === 'data') {
      return 'Academya - Data Science'
    } else if (firstEventName === 'ui') {
      return 'Academya - UI UX'
    } else if (firstEventName === 'project') {
      return 'Academya - Project Manager'
    }
  }
}

const checkMemberVerification = (member: TeamMember) => {
  let verified = true
  if (!member.document || member.document.length === 0) {
    verified = false
  }

  member.document?.forEach(doc => {
    if (!doc.isVerified) {
      verified = false
    }
  })

  return verified
}

export {
  getVerifTriggerColor,
  getVerifStatusColor,
  getVerifStatus,
  getEventNameSlug,
  checkMemberVerification
}
