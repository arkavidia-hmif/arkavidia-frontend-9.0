import React from 'react'

interface InvalidModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InvalidModal: React.FC<InvalidModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-red-600">E-mail Tidak Terdaftar</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <p className="mt-4 text-gray-700">
          Kami tidak menemukan akun dengan e-mail tersebut. Silakan coba lagi.
        </p>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="rounded bg-purple-800 px-4 py-2 text-white hover:bg-purple-700">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}