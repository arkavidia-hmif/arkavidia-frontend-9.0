import React, { useState } from 'react'
import ModalPopup from './components/modal'
import { getUser } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'

function EventPage() {
  return (
    <div className="h-[100vh] bg-white">
      <ModalPopup eventType="oajbedpk" />
    </div>
  )
}

export default EventPage
