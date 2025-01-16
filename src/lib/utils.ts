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
