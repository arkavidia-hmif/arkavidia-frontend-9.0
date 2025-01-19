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
