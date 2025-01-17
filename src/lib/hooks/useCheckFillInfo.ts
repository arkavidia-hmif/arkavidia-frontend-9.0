'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '~/redux/store'

export default function useCheckFillInfo() {
  const router = useRouter()
  const hasFilledInfo = useAppSelector(state => state.auth.hasFilledInfo)
  if (!hasFilledInfo) {
    return false
  } else {
    return true
  }
}
