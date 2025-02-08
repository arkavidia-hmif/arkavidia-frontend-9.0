import React, { useState } from 'react'
import ModalPopup from './components/RegisterModal'

function EventPage() {
  return (
    <div className="flex h-[100vh] items-center justify-center bg-black">
      <ModalPopup eventType="eqpginai" />
    </div>
  )
}

export default EventPage
