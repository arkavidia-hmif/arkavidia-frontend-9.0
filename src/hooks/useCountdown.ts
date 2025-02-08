import { useState, useEffect } from 'react'

export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const difference = targetDate.getTime() - new Date().getTime()
    return Math.max(0, difference)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime()
      setTimeLeft(Math.max(0, difference))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    isComplete: timeLeft === 0
  }
}
