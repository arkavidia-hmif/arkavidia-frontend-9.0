import React, { useState } from 'react'
import ModalPopup from './components/RegisterModal'

function EventPage() {
  return (
    <div className="h-[100vh] bg-white flex items-center justify-center">
      <ModalPopup eventType="oajbedpk" />
    </div>
  )
}

export default EventPage
