import { GetEventTeamSubmissionResponse, TeamMember } from '~/api/generated'
import { EventTask } from './event-dashboard-types'

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
      return 'Academya - Software Engineering'
    } else if (firstEventName === 'data') {
      return 'Academya - Data Science'
    } else if (firstEventName === 'ui') {
      return 'Academya - UI UX'
    } else if (firstEventName === 'product') {
      return 'Academya - Product Management'
    }
  }
}

const getBucketEventKeyword = (pathName: string) => {
  if (pathName.includes('software')) {
    return 'softeng'
  } else if (pathName.includes('data')) {
    return 'datsci'
  } else if (pathName.includes('ui')) {
    return 'uiux'
  } else if (pathName.includes('product')) {
    return 'pm'
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

// Task List
const getStatus = (item: EventTask): string => {
  const today = new Date()
  const isPastDue = today > item.dueDate && item.status !== 'completed'
  if (isPastDue || item.status === 'past due') return 'Past Due'
  if (item.status === 'notopened') return 'Not Opened'
  if (item.status === 'ongoing') return 'Ongoing'
  if (item.status === 'completed') return 'Completed'
  return ''
}

const getStatusTask = (
  data: GetEventTeamSubmissionResponse extends (infer ElementType)[] ? ElementType : never
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
}

const getStatusColor = (item: EventTask): string => {
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

const getTriggerColor = (item: EventTask): string => {
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
  if (item.status === 'ongoing') return 'bg-gradient-to-r from-white/20 to-[#FFCC00CC]/80'
  if (item.status === 'completed')
    return 'bg-gradient-to-r from-white/20 to-[#4D06B0CC]/80'

  return 'bg-gradient-to-r from-white/20 to-[#FACCCCCC]/80'
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

export {
  getVerifTriggerColor,
  getVerifStatusColor,
  getVerifStatus,
  getEventNameSlug,
  checkMemberVerification,
  getStatus,
  getStatusTask,
  getStatusColor,
  getTriggerColor,
  getBucketEventKeyword,
  formatDate
}
