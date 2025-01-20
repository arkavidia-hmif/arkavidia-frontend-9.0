'use client'

import React from 'react'
import { Button } from '../Button'
import { useRouter } from 'next/navigation'

function RedirectButton({ children }: { children?: React.ReactNode }) {
  const router = useRouter()

  function onButtonClick() {
    router.push('/')
  }

  return (
    <Button size="xl" className="mt-8 w-full" onClick={onButtonClick}>
      {children || 'Go Home'}
    </Button>
  )
}

export default RedirectButton
