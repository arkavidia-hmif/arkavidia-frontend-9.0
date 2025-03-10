import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function expandCompetitionName(competitionName: string) {
  switch (competitionName) {
    case 'CP':
      return 'Competitive Programming'
    case 'CTF':
      return 'Capture The Flag'
    default:
      return competitionName
  }
}

export function getAcademyaEventName(eventName: string) {
  if (eventName === 'softeng') {
    return 'Academya - Software Engineering'
  } else if (eventName === 'datascience') {
    return 'Academya - Data Science'
  } else if (eventName === 'pm') {
    return 'Academya - Product Manager'
  } else if (eventName === 'uiux') {
    return 'Academya - UI UX'
  } else {
    return ''
  }
}

export function getAcademyaEventType(eventName: string) {
  if (eventName === 'softeng') {
    return 'Software'
  } else if (eventName === 'datascience') {
    return 'Data'
  } else if (eventName === 'pm') {
    return 'Product'
  } else if (eventName === 'uiux') {
    return 'UI'
  } else {
    return ''
  }
}

export function expandEventName(eventName: string) {
  //! HARDCODED, event name not corresponding to
  // Based on sidebar links,
  switch (eventName) {
    default:
      return capitalizeFirstLetter(eventName)
  }
}

export function getBeautifulEventName(eventName: string) {
  // Based on sidebar links, ex: academya-software-engineering
  const split = eventName.split('-').map(s => s.toLowerCase())
  split[0] = split[0].replace('academya', 'academya -')
  return split.map(s => s.toUpperCase()).join(' ')
}

export function getFormattedBirthDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month.toString().padStart(2, '0')}-${day}`
}

export function getEducation(education: string) {
  switch (education) {
    case 'SMA/MA/SMK':
      return 'sma'
    case 'S1':
      return 's1'
    case 'S2':
      return 's2'
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
